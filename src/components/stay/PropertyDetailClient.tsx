'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AvailabilityCalendar, type CalendarBlock } from './AvailabilityCalendar';
import { formatNaira } from '@/lib/money';
import { addDays, formatDate, toDateKey, fromDateKey, todayKey } from '@/lib/dates';
import { track } from '@/lib/analytics';

/**
 * Availability calendar + a lightweight "check these dates" summary.
 * Choosing dates here carries through to the booking flow via the URL.
 */
export function PropertyDetailClient({
  propertySlug,
  minStayNights,
  blocks,
  displayPrice,
}: {
  propertySlug: string;
  minStayNights: number;
  blocks: CalendarBlock[];
  displayPrice: number;
}) {
  const [range, setRange] = useState({ checkIn: '', checkOut: '' });

  const nights = range.checkIn && range.checkOut
    ? Math.round(
        (fromDateKey(range.checkOut).getTime() - fromDateKey(range.checkIn).getTime()) / 86_400_000,
      )
    : 0;

  const checkInHref = `/book/${propertySlug}${
    range.checkIn
      ? `?checkIn=${range.checkIn}&checkOut=${range.checkOut}&guests=1`
      : ''
  }`;

  return (
    <>
      <AvailabilityCalendar
        propertySlug={propertySlug}
        minStayNights={minStayNights}
        blocks={blocks}
        checkIn={range.checkIn}
        checkOut={range.checkOut}
        onChange={setRange}
      />

      {range.checkIn && range.checkOut ? (
        <div className="mt-5 flex flex-col gap-4 border border-[#FF9800]/40 bg-[#FF9800]/[0.07] p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-label text-[9px] tracking-[0.24em] text-[#e08600]">YOUR SELECTION</p>
            <p className="mt-2 font-heading text-[1.05rem] font-extrabold text-black">
              {formatDate(range.checkIn, 'medium')} — {formatDate(range.checkOut, 'medium')}
            </p>
            <p className="mt-1 text-[0.85rem] text-slate-600">
              {nights} night{nights === 1 ? '' : 's'} · from {formatNaira(displayPrice)} per night
              {nights >= 7 ? ' · long-stay benefits apply' : ''}
            </p>
          </div>
          <Link
            href={checkInHref}
            onClick={() =>
              track('booking_started', {
                property: propertySlug,
                source: 'detail_calendar',
                nights,
              })
            }
            className="inline-flex items-center justify-center gap-2.5 border border-[#FF9800] bg-[#FF9800] px-7 py-3.5 font-label text-[10.5px] tracking-[0.2em] text-black transition-colors duration-400 hover:bg-transparent hover:text-[#FF9800]"
          >
            CONTINUE TO BOOKING
          </Link>
        </div>
      ) : (
        <p className="mt-5 text-[0.85rem] text-slate-500">
          Select your dates above, or{' '}
          <Link
            href={`/book/${propertySlug}?checkIn=${toDateKey(addDays(new Date(), 7))}&checkOut=${toDateKey(
              addDays(new Date(), 10),
            )}&guests=1`}
            className="link-underline-hover font-semibold text-black"
          >
            start with a 3-night stay
          </Link>{' '}
          from {formatDate(todayKey(), 'medium')}.
        </p>
      )}
    </>
  );
}
