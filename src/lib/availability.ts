import { eachNight, fromDateKey, nightsBetween, todayKey, toDateKey } from '@/lib/dates';
import type { Property } from '@/data/types';

/**
 * ═════════════════════════════════════════════════════════════════════════════
 * AVAILABILITY — SAFE TO SHIP TO THE BROWSER
 * ═════════════════════════════════════════════════════════════════════════════
 *
 * Pure functions over a list of date blocks. There is no database and no I/O:
 * the blocks are seed data (see `src/data/blocks.ts`), so the calendar and the
 * date validation both run entirely in the browser.
 *
 * What this can and cannot promise
 * ───────────────────────────────
 * This evaluates availability against the blocks it is given, so the calendar
 * the guest sees always matches the quote they are given. It is advisory, not a
 * reservation: with no backend there is nothing to hold a date. Every place a
 * guest picks dates says so, and the final step hands the request to a person.
 */

export interface DateBlock {
  id: string;
  propertyId: string;
  /** Inclusive first blocked night. */
  startDate: string;
  /** Inclusive last blocked night. */
  endDate: string;
  reason: 'MANUAL' | 'BOOKING' | 'MAINTENANCE' | 'OWNER_BLOCK';
  source: 'MANUAL' | 'BOOKING';
  note?: string | null;
  bookingId?: string | null;
}

export interface AvailabilityCheck {
  available: boolean;
  reason?: string;
  blockedNights: string[];
  nights: number;
  minStayNights: number;
}

export interface MonthAvailability {
  month: string; // YYYY-MM
  days: Array<{
    date: string;
    available: boolean;
    reason: 'BOOKED' | 'BLOCKED' | 'PAST' | 'MIN_STAY' | 'OK' | 'TURNOVER';
  }>;
}

function overlaps(aStart: string, aEnd: string, bStart: string, bEnd: string) {
  return aStart <= bEnd && bStart <= aEnd;
}

/** Evaluate a requested stay against a property's blocks. */
export function checkAvailability(
  property: Property,
  checkIn: string,
  checkOut: string,
  blocks: DateBlock[],
): AvailabilityCheck {
  const nights = nightsBetween(checkIn, checkOut);
  const wanted = eachNight(checkIn, checkOut);
  const today = todayKey();

  if (nights <= 0) {
    return {
      available: false,
      reason: 'Check-out must be after check-in',
      blockedNights: [],
      nights,
      minStayNights: property.minStayNights,
    };
  }

  if (nights < property.minStayNights) {
    return {
      available: false,
      reason: `This residence has a ${property.minStayNights}-night minimum stay`,
      blockedNights: [],
      nights,
      minStayNights: property.minStayNights,
    };
  }

  if (property.maxStayNights > 0 && nights > property.maxStayNights) {
    return {
      available: false,
      reason: `Stays at this residence are capped at ${property.maxStayNights} nights. Ask us about an extended-stay arrangement.`,
      blockedNights: [],
      nights,
      minStayNights: property.minStayNights,
    };
  }

  if (checkIn < today) {
    return {
      available: false,
      reason: 'Check-in cannot be in the past',
      blockedNights: [],
      nights,
      minStayNights: property.minStayNights,
    };
  }

  /*
   * The conflict window is the nights this stay actually occupies: check-in
   * through the night BEFORE check-out. Including check-out itself would reject
   * a turnover — one guest leaving on the 4th while the next arrives on the 4th
   * is normal and desirable.
   */
  const lastOccupiedNight = toDateKey(
    new Date(fromDateKey(checkOut).getTime() - 86_400_000),
  );
  const conflicting = blocks.filter((b) =>
    overlaps(b.startDate, b.endDate, checkIn, lastOccupiedNight),
  );
  const blockedNights = conflicting.flatMap((b) =>
    wanted.filter((n) => n >= b.startDate && n <= b.endDate),
  );

  if (conflicting.length > 0) {
    return {
      available: false,
      reason: 'Those dates are no longer available',
      blockedNights: [...new Set(blockedNights)].sort(),
      nights,
      minStayNights: property.minStayNights,
    };
  }

  return {
    available: true,
    blockedNights: [],
    nights,
    minStayNights: property.minStayNights,
  };
}

/** Build a month grid for the availability calendar. */
export function buildMonthAvailability(
  property: Property,
  year: number,
  month: number, // 0-indexed
  blocks: DateBlock[],
): MonthAvailability {
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const today = todayKey();
  const days: MonthAvailability['days'] = [];

  for (let d = 1; d <= daysInMonth; d += 1) {
    const date = toDateKey(new Date(Date.UTC(year, month, d)));
    const block = blocks.find((b) => date >= b.startDate && date <= b.endDate);
    let reason: MonthAvailability['days'][number]['reason'] = 'OK';
    let available = true;

    if (date < today) {
      available = false;
      reason = 'PAST';
    } else if (block) {
      available = false;
      reason = block.source === 'BOOKING' ? 'BOOKED' : 'BLOCKED';
    }

    days.push({ date, available, reason });
  }

  return { month: `${year}-${String(month + 1).padStart(2, '0')}`, days };
}

/** The blocks that apply to one property, from the full seed set. */
export function blocksForProperty(all: DateBlock[], propertyId: string): DateBlock[] {
  return all.filter((b) => b.propertyId === propertyId);
}
