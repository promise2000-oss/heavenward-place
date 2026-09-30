/**
 * Date helpers. The platform operates on Africa/Lagos (WAT, UTC+1) calendar
 * nights. Every stored "night" is a date-only value at 00:00 WAT.
 */

export const TIMEZONE = 'Africa/Lagos';
export const NIGHT_MS = 24 * 60 * 60 * 1000;

export function toDateKey(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().slice(0, 10);
}

export function fromDateKey(key: string): Date {
  return new Date(`${key}T00:00:00.000Z`);
}

export function todayKey(): string {
  return toDateKey(new Date());
}

export function addDays(date: Date | string, days: number): Date {
  const d = typeof date === 'string' ? fromDateKey(date) : new Date(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  const a = fromDateKey(checkIn).getTime();
  const b = fromDateKey(checkOut).getTime();
  return Math.round((b - a) / NIGHT_MS);
}

export function eachNight(checkIn: string, checkOut: string): string[] {
  const nights: string[] = [];
  const total = nightsBetween(checkIn, checkOut);
  let cursor = fromDateKey(checkIn);
  for (let i = 0; i < total; i += 1) {
    nights.push(toDateKey(cursor));
    cursor = addDays(cursor, 1);
  }
  return nights;
}

/** The last night occupied is check-out minus one night. */
export function lastOccupiedNight(checkOut: string): string {
  return toDateKey(addDays(fromDateKey(checkOut), -1));
}

/** Accepts either a YYYY-MM-DD night key or a full ISO timestamp. */
export function toDate(value: string | Date): Date {
  if (value instanceof Date) return value;
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? fromDateKey(value) : new Date(value);
}

export function formatDate(key: string | Date, style: 'short' | 'long' | 'medium' = 'medium') {
  const d = toDate(key);
  if (Number.isNaN(d.getTime())) return '';
  const opts: Intl.DateTimeFormatOptions =
    style === 'short'
      ? { day: '2-digit', month: 'short', timeZone: TIMEZONE }
      : style === 'long'
        ? { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: TIMEZONE }
        : { day: 'numeric', month: 'short', year: 'numeric', timeZone: TIMEZONE };
  return new Intl.DateTimeFormat('en-GB', opts).format(d);
}

export function formatDateRange(checkIn: string, checkOut: string) {
  return `${formatDate(checkIn, 'short')} — ${formatDate(checkOut, 'short')}`;
}

export function monthLabel(year: number, monthIndex: number) {
  return new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(Date.UTC(year, monthIndex, 1)),
  );
}

export function isValidDateKey(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = fromDateKey(value);
  return !Number.isNaN(d.getTime()) && toDateKey(d) === value;
}

export function isWeekend(key: string) {
  const day = fromDateKey(key).getUTCDay();
  return day === 0 || day === 6;
}

export function diffDays(a: string, b: string) {
  return Math.round((fromDateKey(b).getTime() - fromDateKey(a).getTime()) / NIGHT_MS);
}
