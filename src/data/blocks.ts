import { fromDateKey, todayKey, toDateKey } from '@/lib/dates';
import type { DateBlock } from '@/lib/availability';

/**
 * Seed availability.
 *
 * With no booking system behind the site there is no live inventory, so the
 * blocked dates below are the only source of truth for the calendar. They are
 * generated relative to the day the site is built, which keeps the demo looking
 * live whenever it is deployed.
 *
 * Because nothing writes to this, availability is advisory: it stops a guest
 * picking a date we know is taken, but it cannot hold a date. Every date picker
 * says as much and routes the final request to a person.
 */
function seedBlocks(): DateBlock[] {
  const out: DateBlock[] = [];
  const today = todayKey();

  const add = (
    propertyId: string,
    offsetStart: number,
    nights: number,
    reason: DateBlock['reason'],
    note?: string,
  ) => {
    const start = new Date(fromDateKey(today).getTime() + offsetStart * 86_400_000);
    const end = new Date(
      fromDateKey(today).getTime() + (offsetStart + nights - 1) * 86_400_000,
    );
    out.push({
      id: `blk_seed_${out.length}`,
      propertyId,
      startDate: toDateKey(start),
      endDate: toDateKey(end),
      reason,
      source: reason === 'BOOKING' ? 'BOOKING' : 'MANUAL',
      note: note ?? null,
      bookingId: null,
    });
  };

  add('prop_azure', 12, 5, 'BOOKING', 'Corporate relocation — confirmed');
  add('prop_azure', 34, 9, 'BOOKING', 'Long-stay assignment — confirmed');
  add('prop_azure', 62, 14, 'MAINTENANCE', 'Planned deep maintenance');
  add('prop_mariner', 5, 8, 'BOOKING', 'Audit team — confirmed');
  add('prop_mariner', 40, 12, 'BOOKING', 'Relocation — confirmed');
  add('prop_meridian', 3, 4, 'BOOKING', 'Executive stay — confirmed');
  add('prop_meridian', 21, 6, 'BOOKING', 'Board visit — confirmed');
  add('prop_meridian', 55, 21, 'OWNER_BLOCK', 'Owner block');
  add('prop_courtyard', 8, 3, 'BOOKING', 'Short stay — confirmed');
  add('prop_courtyard', 27, 7, 'BOOKING', 'Consultant assignment — confirmed');
  add('prop_orchard', 15, 10, 'BOOKING', 'Team relocation — confirmed');
  add('prop_orchard', 48, 7, 'MAINTENANCE', 'Servicing window');
  add('prop_palmgrove', 9, 6, 'BOOKING', 'Family stay — confirmed');
  add('prop_palmgrove', 38, 11, 'BOOKING', 'Leadership visit — confirmed');

  return out;
}

export const AVAILABILITY_BLOCKS: DateBlock[] = seedBlocks();
