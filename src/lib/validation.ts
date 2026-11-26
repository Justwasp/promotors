import { VALID_SERVICE_IDS } from '../data/services';
import type { Locale } from '../i18n/types';
import {
  getAvailableTimeSlots,
  validateBookingDate,
  type TimeSlot,
} from './schedule';

export interface BookingInput {
  services: string[];
  bike: string;
  preferredDate: string;
  timeSlot: TimeSlot;
  name: string;
  phone: string;
  email: string;
  notes: string;
  gdprAccepted: boolean;
  lang: Locale;
  website: string; // honeypot
  startedAt: number;
}

export type BookingFieldError =
  | 'REQUIRED'
  | 'INVALID_DATE'
  | 'PAST_DATE'
  | 'SUNDAY_CLOSED'
  | 'SLOT_UNAVAILABLE'
  | 'INVALID_PHONE'
  | 'INVALID_EMAIL';

export type BookingValidationErrors = Partial<
  Record<
    'services' | 'bike' | 'preferredDate' | 'timeSlot' | 'name' | 'phone' | 'email' | 'gdprAccepted',
    BookingFieldError
  >
>;

export interface BookingValidationResult {
  valid: boolean;
  errors: BookingValidationErrors;
  sanitized: BookingInput;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateBookingInput(
  input: BookingInput,
  todayLisbonIso: string,
): BookingValidationResult {
  const errors: BookingValidationErrors = {};

  const services = Array.from(
    new Set(input.services.filter((id) => VALID_SERVICE_IDS.has(id))),
  );
  if (services.length === 0) {
    errors.services = 'REQUIRED';
  }

  const bike = input.bike.trim().slice(0, 120);
  if (bike.length < 2) {
    errors.bike = 'REQUIRED';
  }

  const preferredDate = input.preferredDate.trim();
  const dateStatus = validateBookingDate(preferredDate, todayLisbonIso);
  if (dateStatus !== 'OK') {
    errors.preferredDate = dateStatus;
  } else {
    const allowedSlots = getAvailableTimeSlots(preferredDate);
    if (!allowedSlots.includes(input.timeSlot)) {
      errors.timeSlot = 'SLOT_UNAVAILABLE';
    }
  }

  const name = input.name.trim().slice(0, 100);
  if (name.length < 2) {
    errors.name = 'REQUIRED';
  }

  const phone = input.phone.trim().slice(0, 32);
  const phoneDigits = phone.replace(/\D+/g, '');
  if (phoneDigits.length < 9 || phoneDigits.length > 15) {
    errors.phone = 'INVALID_PHONE';
  }

  const email = input.email.trim().slice(0, 160);
  if (!EMAIL_RE.test(email)) {
    errors.email = 'INVALID_EMAIL';
  }

  if (!input.gdprAccepted) {
    errors.gdprAccepted = 'REQUIRED';
  }

  const sanitized: BookingInput = {
    services,
    bike,
    preferredDate,
    timeSlot: input.timeSlot,
    name,
    phone,
    email,
    notes: input.notes.trim().slice(0, 800),
    gdprAccepted: Boolean(input.gdprAccepted),
    lang: input.lang === 'en' ? 'en' : 'pt',
    website: input.website.trim().slice(0, 120),
    startedAt: input.startedAt,
  };

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    sanitized,
  };
}
