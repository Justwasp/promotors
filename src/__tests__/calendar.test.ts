import { describe, expect, it } from 'vitest';
import {
  buildMonthGrid,
  formatDisplayDate,
  formatMonthTitle,
  getWeekdayLabels,
} from '../lib/calendar';

describe('calendar datepicker engine', () => {
  it('builds a Monday-first grid disabling past dates and all Sundays', () => {
    // November 2026: Nov 1 is Sunday, Nov 25 is Wednesday, Nov 28 is Saturday, Nov 29 is Sunday
    const cells = buildMonthGrid(2026, 10, '2026-11-25');
    expect(cells.length % 7).toBe(0);
    expect(cells.length).toBeGreaterThanOrEqual(35);

    const pastDay = cells.find((c) => c.isoDate === '2026-11-24');
    const today = cells.find((c) => c.isoDate === '2026-11-25');
    const thursday = cells.find((c) => c.isoDate === '2026-11-26');
    const saturday = cells.find((c) => c.isoDate === '2026-11-28');
    const sunday = cells.find((c) => c.isoDate === '2026-11-29');

    expect(pastDay?.disabled).toBe(true);
    expect(pastDay?.isPast).toBe(true);

    expect(today?.isToday).toBe(true);
    expect(today?.disabled).toBe(false);

    expect(thursday?.disabled).toBe(false);
    expect(thursday?.isSaturday).toBe(false);

    expect(saturday?.disabled).toBe(false);
    expect(saturday?.isSaturday).toBe(true);

    expect(sunday?.isSunday).toBe(true);
    expect(sunday?.disabled).toBe(true);
  });

  it('returns Monday-first weekday labels in pt and en', () => {
    expect(getWeekdayLabels('pt')).toEqual(['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']);
    expect(getWeekdayLabels('en')).toEqual(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
  });

  it('formats display date and month title cleanly in pt and en', () => {
    expect(formatDisplayDate('2026-11-28', 'pt')).toBe('Sáb, 28/11/2026');
    expect(formatDisplayDate('2026-11-28', 'en')).toBe('Sat, 28 Nov 2026');
    expect(formatMonthTitle(2026, 10, 'pt')).toBe('Novembro 2026');
    expect(formatMonthTitle(2026, 10, 'en')).toBe('November 2026');
  });
});
