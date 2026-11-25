import { SITE_CONFIG } from '../config/site';
import type { Locale } from '../i18n/types';

export type TimeSlot = 'morning' | 'afternoon';
export type DateValidationResult = 'OK' | 'INVALID_DATE' | 'PAST_DATE' | 'SUNDAY_CLOSED';

export interface LisbonDateParts {
  isoDate: string;
  weekday: number; // 0 = Sunday ... 6 = Saturday
  hour: number;
  minute: number;
}

const WEEKDAY_MAP: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function getLisbonDateParts(date: Date = new Date()): LisbonDateParts {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: SITE_CONFIG.timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const byType = new Map(parts.map((part) => [part.type, part.value]));

  const year = byType.get('year') ?? '2026';
  const month = byType.get('month') ?? '01';
  const day = byType.get('day') ?? '01';
  const weekdayStr = byType.get('weekday') ?? 'Mon';
  const rawHour = Number(byType.get('hour') ?? '0');
  const hour = rawHour === 24 ? 0 : rawHour;
  const minute = Number(byType.get('minute') ?? '0');

  return {
    isoDate: `${year}-${month}-${day}`,
    weekday: WEEKDAY_MAP[weekdayStr] ?? 1,
    hour,
    minute,
  };
}

export function getTodayLisbonIso(now: Date = new Date()): string {
  return getLisbonDateParts(now).isoDate;
}

export function isWorkshopOpen(now: Date = new Date()): boolean {
  const { weekday, hour } = getLisbonDateParts(now);

  if (weekday === 0) return false;
  if (weekday === 6) {
    return hour >= SITE_CONFIG.hours.saturdayOpen && hour < SITE_CONFIG.hours.saturdayClose;
  }
  return hour >= SITE_CONFIG.hours.weekdayOpen && hour < SITE_CONFIG.hours.weekdayClose;
}

export function getDayOfWeekFromIso(isoDate: string): number | null {
  if (!ISO_DATE_RE.test(isoDate)) return null;
  const [y, m, d] = isoDate.split('-').map(Number);
  if (!y || !m || !d) return null;

  const utcDate = new Date(Date.UTC(y, m - 1, d));
  if (
    utcDate.getUTCFullYear() !== y ||
    utcDate.getUTCMonth() !== m - 1 ||
    utcDate.getUTCDate() !== d
  ) {
    return null;
  }
  return utcDate.getUTCDay();
}

export function getAvailableTimeSlots(isoDate: string): TimeSlot[] {
  const day = getDayOfWeekFromIso(isoDate);
  if (day === null || day === 0) return [];
  if (day === 6) return ['morning'];
  return ['morning', 'afternoon'];
}

export function validateBookingDate(isoDate: string, todayIso: string): DateValidationResult {
  const day = getDayOfWeekFromIso(isoDate);
  if (day === null) return 'INVALID_DATE';
  if (isoDate < todayIso) return 'PAST_DATE';
  if (day === 0) return 'SUNDAY_CLOSED';
  return 'OK';
}

export interface WhatsAppBookingParams {
  phoneNumber: string;
  lang: Locale;
  bookingId?: string;
  bike: string;
  serviceLabels: string[];
  preferredDate: string;
  timeSlotLabel: string;
  name: string;
  notes?: string;
}

export function buildWhatsAppBookingUrl(params: WhatsAppBookingParams): string {
  const digits = params.phoneNumber.replace(/\D+/g, '');
  const servicesText = params.serviceLabels.join(', ');
  const notesLine = params.notes?.trim()
    ? params.lang === 'en'
      ? `\nNotes: ${params.notes.trim()}`
      : `\nObservações: ${params.notes.trim()}`
    : '';

  const message =
    params.lang === 'en'
      ? [
          params.bookingId
            ? `Hello Pro Motors! I just submitted booking ${params.bookingId} on promotors.pt:`
            : 'Hello Pro Motors! I would like to book a service via promotors.pt:',
          `Name: ${params.name}`,
          `Bike/Scooter: ${params.bike}`,
          `Services: ${servicesText}`,
          `Preferred date: ${params.preferredDate} (${params.timeSlotLabel})${notesLine}`,
        ].join('\n')
      : [
          params.bookingId
            ? `Olá Pro Motors! Fiz a marcação ${params.bookingId} em promotors.pt:`
            : 'Olá Pro Motors! Gostaria de agendar um serviço em promotors.pt:',
          `Nome: ${params.name}`,
          `Moto/Scooter: ${params.bike}`,
          `Serviços: ${servicesText}`,
          `Data pretendida: ${params.preferredDate} (${params.timeSlotLabel})${notesLine}`,
        ].join('\n');

  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
