import { describe, expect, it } from 'vitest';
import {
  buildWhatsAppBookingUrl,
  getAvailableTimeSlots,
  getLisbonDateParts,
  isWorkshopOpen,
  validateBookingDate,
} from '../lib/schedule';

describe('schedule utilities (Europe/Lisbon)', () => {
  it('reports open during weekday working hours (Mon-Fri 09:00-19:00)', () => {
    // Wednesday 2026-11-25 14:30 UTC === 14:30 Europe/Lisbon (WET)
    const wedAfternoon = new Date('2026-11-25T14:30:00Z');
    expect(isWorkshopOpen(wedAfternoon)).toBe(true);
  });

  it('reports closed after weekday closing time (19:00)', () => {
    // Wednesday 2026-11-25 19:05 Europe/Lisbon
    const wedEvening = new Date('2026-11-25T19:05:00Z');
    expect(isWorkshopOpen(wedEvening)).toBe(false);
  });

  it('reports open on Saturday morning (09:00-13:00) and closed Saturday afternoon', () => {
    // Saturday 2026-11-28
    expect(isWorkshopOpen(new Date('2026-11-28T10:00:00Z'))).toBe(true);
    expect(isWorkshopOpen(new Date('2026-11-28T13:30:00Z'))).toBe(false);
  });

  it('reports closed all day on Sunday', () => {
    // Sunday 2026-11-29
    expect(isWorkshopOpen(new Date('2026-11-29T11:00:00Z'))).toBe(false);
  });

  it('returns both morning and afternoon slots for weekdays, morning only for Saturday, and empty for Sunday', () => {
    expect(getAvailableTimeSlots('2026-11-26')).toEqual(['morning', 'afternoon']); // Thu
    expect(getAvailableTimeSlots('2026-11-28')).toEqual(['morning']); // Sat
    expect(getAvailableTimeSlots('2026-11-29')).toEqual([]); // Sun
  });

  it('validates booking dates against today (Europe/Lisbon) and rejects Sundays and past dates', () => {
    const today = '2026-11-25';
    expect(validateBookingDate('2026-11-24', today)).toBe('PAST_DATE');
    expect(validateBookingDate('2026-11-29', today)).toBe('SUNDAY_CLOSED');
    expect(validateBookingDate('2026-11-28', today)).toBe('OK');
    expect(validateBookingDate('invalid', today)).toBe('INVALID_DATE');
  });

  it('extracts Europe/Lisbon calendar parts accurately across summer time (WEST)', () => {
    // 2026-07-15 23:30 UTC is 2026-07-16 00:30 in Europe/Lisbon (UTC+1)
    const parts = getLisbonDateParts(new Date('2026-07-15T23:30:00Z'));
    expect(parts.isoDate).toBe('2026-07-16');
    expect(parts.hour).toBe(0);
  });

  it('builds a pre-filled WhatsApp URL containing booking ID, bike, services, and date', () => {
    const url = buildWhatsAppBookingUrl({
      phoneNumber: '351968505075',
      lang: 'pt',
      bookingId: 'PM-2026-0014',
      bike: 'Honda PCX 125',
      serviceLabels: ['Revisão Geral', 'Óleo & Filtros'],
      preferredDate: '2026-11-28',
      timeSlotLabel: 'Manhã (09:00–13:00)',
      name: 'João Silva',
      notes: 'Barulho no travão da frente',
    });

    expect(url.startsWith('https://wa.me/351968505075?text=')).toBe(true);
    const decoded = decodeURIComponent(url.split('text=')[1] ?? '');
    expect(decoded).toContain('PM-2026-0014');
    expect(decoded).toContain('Honda PCX 125');
    expect(decoded).toContain('Revisão Geral, Óleo & Filtros');
    expect(decoded).toContain('2026-11-28');
  });
});
