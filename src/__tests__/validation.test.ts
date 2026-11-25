import { describe, expect, it } from 'vitest';
import { validateBookingInput, type BookingInput } from '../lib/validation';

const validBase: BookingInput = {
  services: ['revisao', 'oleo'],
  bike: 'Honda PCX 125',
  preferredDate: '2026-11-26', // Thursday
  timeSlot: 'morning',
  name: 'João Silva',
  phone: '+351 912 345 678',
  email: 'joao.silva@example.pt',
  notes: 'Revisão dos 12.000 km',
  gdprAccepted: true,
  lang: 'pt',
  website: '',
  startedAt: Date.now() - 5000,
};

describe('validateBookingInput', () => {
  it('accepts a valid weekday booking', () => {
    const result = validateBookingInput(validBase, '2026-11-25');
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('rejects Saturday afternoon bookings while accepting Saturday morning', () => {
    const satMorning = validateBookingInput(
      { ...validBase, preferredDate: '2026-11-28', timeSlot: 'morning' },
      '2026-11-25',
    );
    expect(satMorning.valid).toBe(true);

    const satAfternoon = validateBookingInput(
      { ...validBase, preferredDate: '2026-11-28', timeSlot: 'afternoon' },
      '2026-11-25',
    );
    expect(satAfternoon.valid).toBe(false);
    expect(satAfternoon.errors.timeSlot).toBe('SLOT_UNAVAILABLE');
  });

  it('rejects Sundays, missing services, invalid email, and missing RGPD consent', () => {
    const result = validateBookingInput(
      {
        ...validBase,
        services: [],
        preferredDate: '2026-11-29',
        email: 'not-an-email',
        gdprAccepted: false,
      },
      '2026-11-25',
    );

    expect(result.valid).toBe(false);
    expect(result.errors.services).toBe('REQUIRED');
    expect(result.errors.preferredDate).toBe('SUNDAY_CLOSED');
    expect(result.errors.email).toBe('INVALID_EMAIL');
    expect(result.errors.gdprAccepted).toBe('REQUIRED');
  });
});
