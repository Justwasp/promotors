import type { Locale } from '../i18n/types';

export interface CalendarCell {
  isoDate: string;
  dayNumber: number;
  inCurrentMonth: boolean;
  isToday: boolean;
  isPast: boolean;
  isSaturday: boolean;
  isSunday: boolean;
  disabled: boolean;
}

const WEEKDAYS_PT = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'] as const;
const WEEKDAYS_EN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

const WEEKDAYS_SHORT_SUN_FIRST_PT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'] as const;
const WEEKDAYS_SHORT_SUN_FIRST_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

const MONTHS_PT = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
] as const;

const MONTHS_EN = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

const MONTHS_SHORT_EN = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

function toIsoDate(year: number, monthIndex: number, day: number): string {
  const d = new Date(Date.UTC(year, monthIndex, day));
  return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())}`;
}

export function getWeekdayLabels(locale: Locale): string[] {
  return locale === 'en' ? [...WEEKDAYS_EN] : [...WEEKDAYS_PT];
}

export function formatMonthTitle(year: number, monthIndex: number, locale: Locale): string {
  const normalized = new Date(Date.UTC(year, monthIndex, 1));
  const y = normalized.getUTCFullYear();
  const m = normalized.getUTCMonth();
  const monthName = locale === 'en' ? MONTHS_EN[m] : MONTHS_PT[m];
  return `${monthName} ${y}`;
}

export function formatDisplayDate(isoDate: string, locale: Locale): string {
  const match = isoDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return isoDate;
  const year = Number(match[1]);
  const monthIndex = Number(match[2]) - 1;
  const day = Number(match[3]);
  const utc = new Date(Date.UTC(year, monthIndex, day));
  const dow = utc.getUTCDay();

  if (locale === 'en') {
    return `${WEEKDAYS_SHORT_SUN_FIRST_EN[dow]}, ${pad2(day)} ${MONTHS_SHORT_EN[monthIndex]} ${year}`;
  }
  return `${WEEKDAYS_SHORT_SUN_FIRST_PT[dow]}, ${pad2(day)}/${pad2(monthIndex + 1)}/${year}`;
}

/**
 * Builds a Monday-first calendar grid for the requested month.
 * Automatically disables past dates (relative to Europe/Lisbon today) and Sundays.
 */
export function buildMonthGrid(
  year: number,
  monthIndex: number,
  todayLisbonIso: string,
): CalendarCell[] {
  const firstOfMonth = new Date(Date.UTC(year, monthIndex, 1));
  const targetYear = firstOfMonth.getUTCFullYear();
  const targetMonth = firstOfMonth.getUTCMonth();

  // Monday-first offset: Mon=0 .. Sat=5, Sun=6
  const startOffset = (firstOfMonth.getUTCDay() + 6) % 7;
  const daysInMonth = new Date(Date.UTC(targetYear, targetMonth + 1, 0)).getUTCDate();
  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;

  const cells: CalendarCell[] = [];

  for (let i = 0; i < totalCells; i += 1) {
    const dayOffset = i - startOffset + 1;
    const cellDate = new Date(Date.UTC(targetYear, targetMonth, dayOffset));
    const isoDate = toIsoDate(
      cellDate.getUTCFullYear(),
      cellDate.getUTCMonth(),
      cellDate.getUTCDate(),
    );
    const dow = cellDate.getUTCDay();
    const isSunday = dow === 0;
    const isSaturday = dow === 6;
    const isPast = isoDate < todayLisbonIso;
    const inCurrentMonth =
      cellDate.getUTCFullYear() === targetYear && cellDate.getUTCMonth() === targetMonth;

    cells.push({
      isoDate,
      dayNumber: cellDate.getUTCDate(),
      inCurrentMonth,
      isToday: isoDate === todayLisbonIso,
      isPast,
      isSaturday,
      isSunday,
      disabled: isPast || isSunday,
    });
  }

  return cells;
}
