'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from '@/components/ui/icons';
import { addDays, eachNight, fromDateKey, monthLabel, toDateKey, todayKey } from '@/lib/dates';

export interface CalendarBlock {
  startDate: string;
  endDate: string;
  reason: string;
}

const REASON_LABEL: Record<string, string> = {
  BOOKED: 'Already booked',
  BOOKING: 'Already booked',
  BLOCKED: 'Unavailable — blocked by the host',
  MANUAL: 'Unavailable — blocked by the host',
  MAINTENANCE: 'Unavailable — maintenance window',
  OWNER_BLOCK: 'Unavailable — owner block',
};

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

/**
 * Availability calendar.
 *
 * Unavailable dates cannot be selected. Confirmed bookings block their nights
 * automatically because the booking service writes the date-block rows in the
 * same critical section as the booking itself. Admin blocks appear alongside
 * them, so the calendar always reflects booking status.
 */
export function AvailabilityCalendar({
  minStayNights,
  blocks,
  checkIn,
  checkOut,
  onChange,
  monthsToShow = 2,
}: {
  propertySlug?: string;
  minStayNights: number;
  blocks: CalendarBlock[];
  checkIn: string;
  checkOut: string;
  onChange: (range: { checkIn: string; checkOut: string }) => void;
  monthsToShow?: number;
}) {
  const today = todayKey();

  const [cursor, setCursor] = useState(() => {
    const base = checkIn || today;
    const d = fromDateKey(base);
    return { year: d.getUTCFullYear(), month: d.getUTCMonth() };
  });

  const [hovered, setHovered] = useState<string | null>(null);
  const [selecting, setSelecting] = useState<'start' | 'end'>('start');

  // date -> blocking reason
  const blocked = useMemo(() => {
    const map = new Map<string, string>();
    for (const block of blocks) {
      for (const night of eachNight(block.startDate, toDateKey(addDays(fromDateKey(block.endDate), 1)))) {
        if (!map.has(night)) map.set(night, block.reason);
      }
    }
    return map;
  }, [blocks]);

  useEffect(() => {
    setSelecting(!checkIn || checkOut ? 'start' : 'end');
  }, [checkIn, checkOut]);

  const isSelectable = useCallback(
    (date: string) => date >= today && !blocked.has(date),
    [today, blocked],
  );

  const inRange = useCallback(
    (date: string) => Boolean(checkIn && checkOut && date >= checkIn && date < checkOut),
    [checkIn, checkOut],
  );

  function handleSelect(date: string) {
    if (!isSelectable(date)) return;

    if (selecting === 'start' || !checkIn || checkOut) {
      // Start a new range. If the following night is blocked, advance to the
      // first available night so an invalid stay can never be produced.
      let out = toDateKey(addDays(fromDateKey(date), 1));
      let guard = 0;
      while (blocked.has(out) && guard < 60) {
        out = toDateKey(addDays(fromDateKey(out), 1));
        guard += 1;
      }
      onChange({ checkIn: date, checkOut: out });
      setSelecting('end');
      return;
    }

    if (date <= checkIn) {
      onChange({ checkIn: date, checkOut: '' });
      return;
    }

    // Selecting the end: reject any range that crosses a blocked night.
    const wanted = eachNight(checkIn, date);
    if (wanted.some((night) => blocked.has(night))) return;
    onChange({ checkIn, checkOut: date });
    setSelecting('start');
  }

  const months = Array.from({ length: monthsToShow }, (_, i) => {
    const d = new Date(Date.UTC(cursor.year, cursor.month + i, 1));
    return { year: d.getUTCFullYear(), month: d.getUTCMonth() };
  });

  const currentMonthStart = toDateKey(new Date(Date.UTC(cursor.year, cursor.month, 1)));
  const canGoBack = currentMonthStart > today;

  return (
    <div className="border border-slate-200 bg-white p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-heading text-[0.95rem] font-extrabold text-black">Availability</h3>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() =>
              setCursor((c) => {
                const d = new Date(Date.UTC(c.year, c.month - 1, 1));
                return { year: d.getUTCFullYear(), month: d.getUTCMonth() };
              })
            }
            disabled={!canGoBack}
            aria-label="Previous month"
            className="flex h-9 w-9 items-center justify-center border border-slate-300 text-black transition-colors duration-300 hover:border-black disabled:opacity-35"
          >
            <ChevronLeft className="h-3.5 w-3.5 -rotate-90" />
          </button>
          <button
            type="button"
            onClick={() =>
              setCursor((c) => {
                const d = new Date(Date.UTC(c.year, c.month + 1, 1));
                return { year: d.getUTCFullYear(), month: d.getUTCMonth() };
              })
            }
            aria-label="Next month"
            className="flex h-9 w-9 items-center justify-center border border-slate-300 text-black transition-colors duration-300 hover:border-black"
          >
            <ChevronRight className="h-3.5 w-3.5 -rotate-90" />
          </button>
        </div>
      </div>

      <p className="mt-2 text-[0.8rem] text-slate-500" aria-live="polite">
        {selecting === 'start' ? 'Select your check-in date.' : 'Select your check-out date.'}
        {minStayNights > 1 ? ` Minimum stay ${minStayNights} nights.` : ''}
      </p>

      <div className="mt-5 grid gap-8 md:grid-cols-2">
        {months.map(({ year, month }) => (
          <MonthGrid
            key={`${year}-${month}`}
            year={year}
            month={month}
            today={today}
            blocked={blocked}
            isSelectable={isSelectable}
            inRange={inRange}
            checkIn={checkIn}
            checkOut={checkOut}
            hovered={hovered}
            onHover={setHovered}
            onSelect={handleSelect}
          />
        ))}
      </div>

      <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-slate-100 pt-4 text-[0.78rem] text-slate-600">
        <li className="flex items-center gap-2">
          <span className="h-3.5 w-3.5 border border-slate-300 bg-white" aria-hidden="true" />
          Available
        </li>
        <li className="flex items-center gap-2">
          <span className="h-3.5 w-3.5 bg-slate-200" aria-hidden="true" />
          Unavailable
        </li>
        <li className="flex items-center gap-2">
          <span className="h-3.5 w-3.5 bg-[#FF9800]" aria-hidden="true" />
          Your stay
        </li>
      </ul>
    </div>
  );
}

function MonthGrid({
  year,
  month,
  today,
  blocked,
  isSelectable,
  inRange,
  checkIn,
  checkOut,
  hovered,
  onHover,
  onSelect,
}: {
  year: number;
  month: number;
  today: string;
  blocked: Map<string, string>;
  isSelectable: (date: string) => boolean;
  inRange: (date: string) => boolean;
  checkIn: string;
  checkOut: string;
  hovered: string | null;
  onHover: (date: string | null) => void;
  onSelect: (date: string) => void;
}) {
  const first = new Date(Date.UTC(year, month, 1));
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const offset = (first.getUTCDay() + 6) % 7; // Monday-first
  const cells: Array<string | null> = [
    ...Array.from({ length: offset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => toDateKey(new Date(Date.UTC(year, month, i + 1)))),
  ];

  return (
    <div>
      <p className="mb-3 text-center font-label text-[10px] tracking-[0.24em] text-black">
        {monthLabel(year, month).toUpperCase()}
      </p>
      <div className="grid grid-cols-7 gap-1">
        {WEEKDAYS.map((d) => (
          <div key={d} className="pb-1 text-center font-label text-[8.5px] tracking-[0.12em] text-slate-400">
            {d}
          </div>
        ))}
        {cells.map((date, index) => {
          if (!date) return <div key={`pad-${index}`} aria-hidden="true" />;
          const reason = blocked.get(date);
          const past = date < today;
          const selectable = isSelectable(date);
          const selected = date === checkIn || date === checkOut || inRange(date);
          const preview = Boolean(hovered && checkIn && !checkOut && date > checkIn && date <= hovered);

          return (
            <button
              key={date}
              type="button"
              onClick={() => onSelect(date)}
              onMouseEnter={() => selectable && onHover(date)}
              onMouseLeave={() => onHover(null)}
              disabled={!selectable}
              aria-label={`${date}${reason ? ` — ${REASON_LABEL[reason] ?? 'unavailable'}` : past ? ' — past date' : ' — available'}`}
              aria-pressed={selected}
              title={reason ? (REASON_LABEL[reason] ?? 'Unavailable') : past ? 'Past date' : 'Available'}
              className={`relative aspect-square text-[0.8rem] font-semibold transition-colors duration-200 ${
                reason
                  ? 'cursor-not-allowed bg-slate-200 text-slate-400 line-through'
                  : past
                    ? 'cursor-not-allowed bg-slate-50 text-slate-300'
                    : selected || preview
                      ? 'bg-[#FF9800] text-black'
                      : 'text-black hover:bg-cream'
              } ${date === checkIn || date === checkOut ? 'ring-2 ring-inset ring-black' : ''}`}
            >
              {Number(date.slice(-2))}
            </button>
          );
        })}
      </div>
    </div>
  );
}
