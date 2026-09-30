'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/primitives';
import { formatNaira } from '@/lib/money';
import { quoteFromRate, type PriceQuote } from '@/lib/quote';
import { checkAvailability, type DateBlock } from '@/lib/availability';
import { CheckCircleIcon, StarIcon } from '@/components/ui/icons';
import { track } from '@/lib/analytics';
import type { Property } from '@/data/types';

/**
 * Sticky booking card.
 *
 * The quote is derived in the browser with `quoteFromRate` — a pure function
 * that takes the nightly rate for the published price list and returns the
 * breakdown. It has no multiplier and no base price, so nothing confidential
 * reaches the bundle; see `src/lib/quote.ts` for why the engine is split in two.
 *
 * Nothing is reserved by choosing dates here. The card is explicit about that,
 * and the final step hands the request to a person.
 */
export function BookingCard({
  property,
  blocks,
  displayPrice,
  priceListLabel,
}: {
  property: Property;
  blocks: DateBlock[];
  displayPrice: number;
  priceListLabel: string;
}) {
  const router = useRouter();

  const [range, setRange] = useState({ checkIn: '', checkOut: '' });
  const [guests, setGuests] = useState(1);
  const [addOns, setAddOns] = useState<string[]>([]);

  const hasRange = Boolean(range.checkIn && range.checkOut);

  /*
   * Derived, not fetched. A single synchronous calculation, so there is no
   * loading state to flicker and no request to make.
   */
  const { quote, unavailableReason } = useMemo(() => {
    if (!hasRange) return { quote: null as PriceQuote | null, unavailableReason: null as string | null };

    const check = checkAvailability(property, range.checkIn, range.checkOut, blocks);
    if (!check.available) {
      return { quote: null, unavailableReason: check.reason ?? 'Those dates are not available' };
    }
    if (guests > property.maxGuests) {
      return { quote: null, unavailableReason: `This residence takes up to ${property.maxGuests} guests` };
    }

    return {
      quote: quoteFromRate({
        property,
        displayPrice,
        checkIn: range.checkIn,
        checkOut: range.checkOut,
        guests,
        profile: 'HOSPITALITY',
        addOnKeys: addOns as Property['paidAddOns'][number]['key'][],
      }),
      unavailableReason: null,
    };
  }, [property, blocks, displayPrice, range.checkIn, range.checkOut, guests, addOns, hasRange]);

  function proceed() {
    if (!quote) return;
    const query = new URLSearchParams({
      checkIn: range.checkIn,
      checkOut: range.checkOut,
      guests: String(guests),
      addOns: addOns.join(','),
    });
    track('booking_started', { property: property.slug, source: 'booking_card' });
    router.push(`/book/${property.slug}?${query.toString()}`);
  }

  const paidAddOns = property.paidAddOns.filter((a) => a.isActive);

  return (
    <aside className="lg:sticky lg:top-[100px]">
      <div className="border border-slate-200 bg-white shadow-[0_30px_70px_-50px_rgba(0,0,0,0.6)]">
        <span className="block h-[3px] w-full bg-[#FF9800]" aria-hidden="true" />

        <div className="p-6 sm:p-7">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-label text-[9px] tracking-[0.24em] text-slate-500">
                {priceListLabel.toUpperCase()} RATE
              </p>
              <p className="mt-1.5 font-display text-3xl text-black">{formatNaira(displayPrice)}</p>
              <p className="mt-1 text-[0.78rem] text-slate-500">per night</p>
            </div>
            <span className="flex items-center gap-1.5">
              <StarIcon className="h-4 w-4 text-[#FF9800]" />
              <span className="text-[0.85rem] font-bold text-black">{property.rating.toFixed(1)}</span>
              <span className="text-[0.75rem] text-slate-500">({property.reviewCount})</span>
            </span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-px border border-slate-200 bg-slate-200">
            <div className="bg-white p-3.5">
              <label
                htmlFor="card-check-in"
                className="font-label text-[8.5px] tracking-[0.22em] text-slate-500"
              >
                CHECK-IN
              </label>
              <input
                id="card-check-in"
                type="date"
                value={range.checkIn}
                min={new Date().toISOString().slice(0, 10)}
                onChange={(e) =>
                  setRange((r) => ({
                    checkIn: e.target.value,
                    checkOut: r.checkOut && r.checkOut > e.target.value ? r.checkOut : '',
                  }))
                }
                className="mt-1 w-full border-0 bg-transparent p-0 text-[0.9rem] font-semibold text-black focus:outline-none"
              />
            </div>
            <div className="bg-white p-3.5">
              <label
                htmlFor="card-check-out"
                className="font-label text-[8.5px] tracking-[0.22em] text-slate-500"
              >
                CHECK-OUT
              </label>
              <input
                id="card-check-out"
                type="date"
                value={range.checkOut}
                min={range.checkIn || new Date().toISOString().slice(0, 10)}
                onChange={(e) => setRange((r) => ({ ...r, checkOut: e.target.value }))}
                className="mt-1 w-full border-0 bg-transparent p-0 text-[0.9rem] font-semibold text-black focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-3">
            <label htmlFor="card-guests" className="font-label text-[8.5px] tracking-[0.22em] text-slate-500">
              GUESTS
            </label>
            <select
              id="card-guests"
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="mt-1.5 w-full border border-slate-300 bg-white px-3 py-2.5 text-[0.9rem] font-semibold text-black focus:border-[#FF9800] focus:outline-none"
            >
              {Array.from({ length: Math.max(1, property.maxGuests) }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? 'guest' : 'guests'}
                </option>
              ))}
            </select>
          </div>

          {/* Add-ons */}
          {paidAddOns.length > 0 ? (
            <div className="mt-6 border-t border-slate-100 pt-5">
              <p className="font-label text-[9px] tracking-[0.24em] text-black">ADD TO YOUR STAY</p>
              <div className="mt-3 flex flex-col gap-2.5">
                {paidAddOns.map((addOn) => {
                  const active = addOns.includes(addOn.key);
                  return (
                    <label
                      key={addOn.key}
                      className="flex cursor-pointer items-start gap-3 border border-slate-200 p-3.5 transition-colors duration-300 hover:border-slate-400 has-[:checked]:border-[#FF9800] has-[:checked]:bg-[#FF9800]/[0.07]"
                    >
                      <input
                        type="checkbox"
                        checked={active}
                        onChange={() => {
                          setAddOns((prev) =>
                            active ? prev.filter((k) => k !== addOn.key) : [...prev, addOn.key],
                          );
                          track('add_on_selected', { addOn: addOn.key, added: !active });
                        }}
                        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer appearance-none border-[1.5px] border-black bg-white checked:border-[#FF9800] checked:bg-[#FF9800]"
                      />
                      <span className="flex-1">
                        <span className="block text-[0.85rem] font-semibold text-black">
                          {addOn.name}
                        </span>
                        <span className="mt-0.5 block text-[0.75rem] text-slate-500">
                          {formatNaira(addOn.price)}
                          {addOn.unit === 'per_night'
                            ? ' per night'
                            : addOn.unit === 'per_meal'
                              ? ' per meal'
                              : ' per stay'}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ) : null}

          {/* Price breakdown */}
          {quote ? (
            <div className="mt-6 border-t border-slate-100 pt-5" aria-live="polite">
              <div className="flex items-center justify-between text-[0.85rem]">
                <span className="text-slate-600">
                  {formatNaira(quote.displayPrice)} × {quote.nights} night
                  {quote.nights === 1 ? '' : 's'}
                </span>
                <span className="font-semibold text-black">{formatNaira(quote.nightsSubtotal)}</span>
              </div>
              {quote.weeklyDiscount > 0 ? (
                <div className="mt-2 flex items-center justify-between text-[0.85rem]">
                  <span className="text-[#12805c]">Weekly rate discount</span>
                  <span className="font-semibold text-[#12805c]">−{formatNaira(quote.weeklyDiscount)}</span>
                </div>
              ) : null}
              {quote.addOns.length > 0 ? (
                <div className="mt-2 flex items-center justify-between text-[0.85rem]">
                  <span className="text-slate-600">Add-ons</span>
                  <span className="font-semibold text-black">{formatNaira(quote.addOnsSubtotal)}</span>
                </div>
              ) : null}
              {quote.cleaningFee > 0 ? (
                <div className="mt-2 flex items-center justify-between text-[0.85rem]">
                  <span className="text-slate-600">Cleaning &amp; setup</span>
                  <span className="font-semibold text-black">{formatNaira(quote.cleaningFee)}</span>
                </div>
              ) : null}
              {quote.serviceCharge > 0 ? (
                <div className="mt-2 flex items-center justify-between text-[0.85rem]">
                  <span className="text-slate-600">Service charge</span>
                  <span className="font-semibold text-black">{formatNaira(quote.serviceCharge)}</span>
                </div>
              ) : null}

              <div className="mt-4 flex items-end justify-between border-t border-black pt-4">
                <span className="font-heading text-[0.95rem] font-extrabold text-black">Total</span>
                <span className="font-display text-2xl text-black">{formatNaira(quote.total)}</span>
              </div>

              {quote.complimentaryBenefits.length > 0 ? (
                <div className="mt-5 border border-[#FF9800]/40 bg-[#FF9800]/[0.08] p-4">
                  <p className="font-label text-[9px] tracking-[0.22em] text-[#e08600]">
                    COMPLIMENTARY WITH THIS STAY
                  </p>
                  <ul className="mt-3 flex flex-col gap-2.5">
                    {quote.complimentaryBenefits.map((benefit) => (
                      <li key={benefit.code} className="flex gap-2.5">
                        <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#12805c]" />
                        <span className="text-[0.82rem] leading-relaxed text-slate-700">
                          <strong className="font-semibold text-black">{benefit.label}.</strong>{' '}
                          {benefit.detail}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : quote.nightsUntilDiscountEligible > 0 ? (
                <p className="mt-5 border border-slate-200 bg-slate-50 p-4 text-[0.8rem] leading-relaxed text-slate-600">
                  Add{' '}
                  <strong className="font-semibold text-black">
                    {quote.nightsUntilDiscountEligible} more night
                    {quote.nightsUntilDiscountEligible === 1 ? '' : 's'}
                  </strong>{' '}
                  to unlock complimentary airport pickup and private-chef meals.
                </p>
              ) : null}
            </div>
          ) : null}

          {unavailableReason ? (
            <p
              role="alert"
              className="mt-5 border-l-[3px] border-[#c02626] bg-[#c02626]/[0.06] px-4 py-3 text-[0.85rem] text-[#96201f]"
            >
              {unavailableReason}
            </p>
          ) : null}

          <Button
            onClick={proceed}
            disabled={!quote}
            className="mt-6"
            fullWidth
            size="lg"
          >
            {quote ? 'CONTINUE TO BOOKING' : hasRange ? 'UNAVAILABLE' : 'SELECT YOUR DATES'}
          </Button>

          <p className="mt-3 text-center text-[0.78rem] text-slate-500">
            Nothing is reserved until we confirm with you directly.
          </p>

          <ul className="mt-6 flex flex-col gap-2 border-t border-slate-100 pt-5 text-[0.78rem] text-slate-600">
            <li className="flex items-center gap-2">
              <CheckCircleIcon className="h-3.5 w-3.5 text-[#12805c]" />
              Check-in from {property.checkInTime} · Check-out by {property.checkOutTime}
            </li>
            <li className="flex items-center gap-2">
              <CheckCircleIcon className="h-3.5 w-3.5 text-[#12805c]" />
              {property.minStayNights > 1
                ? `${property.minStayNights}-night minimum stay`
                : 'Single-night stays available'}
            </li>
            <li className="flex items-center gap-2">
              <CheckCircleIcon className="h-3.5 w-3.5 text-[#12805c]" />
              Free cancellation up to 7 days before check-in
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
