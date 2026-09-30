'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button, Alert } from '@/components/ui/primitives';
import { Input, Textarea } from '@/components/ui/form';
import { CheckCircleIcon, CheckIcon, PlaneIcon, ChefIcon, CarIcon, LockIcon } from '@/components/ui/icons';
import { EnquiryHandoff, copyEnquiry, enquiryBody } from '@/components/ui/EnquiryHandoff';
import { formatNaira } from '@/lib/money';
import { formatDate, nightsBetween } from '@/lib/dates';
import { quoteFromRate } from '@/lib/quote';
import { checkAvailability, type DateBlock } from '@/lib/availability';
import { track } from '@/lib/analytics';
import type { Property } from '@/data/types';

/**
 * Booking flow: dates → guest details → review → request sent.
 *
 * What changed and why
 * ────────────────────
 * This used to end in identity verification and a card payment. Both are gone,
 * and neither should be reintroduced here:
 *
 *   • **No identity documents on a static site.** There is nowhere encrypted to
 *     put a passport number and nowhere to control access to it. Asking for one
 *     in a form that posts nowhere would be worse than not asking. Identity is
 *     verified properly, face to face or over a secure channel, when we
 *     confirm the booking — which is what the copy now says.
 *   • **No card payment in the browser.** Taking money without a backend to
 *     authorise, reconcile or refund against would be reckless. Payment happens
 *     against an invoice once a person has confirmed the stay.
 *
 * The quote is computed in the browser with `quoteFromRate`, a pure function
 * that holds no multiplier and no base price. It is an indication, not an
 * invoice: the total is re-confirmed by a person before anything is reserved.
 */

const STEPS = [
  { key: 'dates', label: 'Dates' },
  { key: 'guests', label: 'Your details' },
  { key: 'review', label: 'Review' },
] as const;

type StepKey = (typeof STEPS)[number]['key'];

export function BookingFlow({
  property,
  blocks,
  displayPrice,
  initialDates,
  initialGuests = 1,
  initialAddOns = [],
}: {
  property: Property;
  blocks: DateBlock[];
  displayPrice: number;
  /** Pre-selection carried across from the property page. */
  initialDates?: { checkIn: string; checkOut: string };
  initialGuests?: number;
  initialAddOns?: string[];
}) {
  const [step, setStep] = useState<StepKey>('dates');
  const [checkIn, setCheckIn] = useState(initialDates?.checkIn ?? '');
  const [checkOut, setCheckOut] = useState(initialDates?.checkOut ?? '');
  const [guests, setGuests] = useState(Math.max(1, initialGuests));
  const [addOns, setAddOns] = useState<string[]>(initialAddOns);
  const [chefMeals, setChefMeals] = useState(0);

  const [guest, setGuest] = useState({
    fullName: '',
    email: '',
    phone: '',
    nationality: '',
    arrivalTime: '',
    flightNumber: '',
    notes: '',
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [ready, setReady] = useState(false);

  const hasRange = Boolean(checkIn && checkOut);
  const paidAddOns = property.paidAddOns.filter((a) => a.isActive);

  /*
   * One synchronous derivation, no fetch. `checkAvailability` and
   * `quoteFromRate` are both pure, so the figure on screen is always the figure
   * for the dates on screen.
   */
  const { quote, blockedReason } = useMemo(() => {
    if (!hasRange) return { quote: null, blockedReason: null as string | null };

    const check = checkAvailability(property, checkIn, checkOut, blocks);
    if (!check.available) {
      return { quote: null, blockedReason: check.reason ?? 'Those dates are not available' };
    }
    if (guests > property.maxGuests) {
      return { quote: null, blockedReason: `This residence takes up to ${property.maxGuests} guests` };
    }

    return {
      quote: quoteFromRate({
        property,
        displayPrice,
        checkIn,
        checkOut,
        guests,
        profile: 'HOSPITALITY',
        addOnKeys: addOns as Property['paidAddOns'][number]['key'][],
        chefMeals,
      }),
      blockedReason: null,
    };
  }, [property, blocks, displayPrice, checkIn, checkOut, guests, addOns, chefMeals, hasRange]);

  function validateGuest() {
    const errors: Record<string, string> = {};
    if (guest.fullName.trim().length < 2) errors.fullName = 'Please tell us your name';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(guest.email)) errors.email = 'Please enter a valid email address';
    if (guest.phone.replace(/[^\d]/g, '').length < 7) errors.phone = 'Please enter a contact number';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function submit() {
    if (!validateGuest() || !quote) return;
    setReady(true);
    track('booking_started', { property: property.slug, source: 'booking_flow' });
  }

  const body = enquiryBody({
    residence: property.name,
    area: property.area,
    checkIn: checkIn ? formatDate(checkIn, 'long') : '',
    checkOut: checkOut ? formatDate(checkOut, 'long') : '',
    nights: quote?.nights,
    guests,
    addOns: quote?.addOns.map((a) => a.name).join(', '),
    chefMeals: chefMeals || undefined,
    'Indicative total': quote ? formatNaira(quote.total) : '',
    name: guest.fullName,
    email: guest.email,
    phone: guest.phone,
    nationality: guest.nationality,
    'Arrival time': guest.arrivalTime,
    flight: guest.flightNumber,
    notes: guest.notes,
  });

  /* ── Ready to send ─────────────────────────────────────────────────────── */
  if (ready && quote) {
    return (
      <div className="container-hp py-16 sm:py-20">
        <div className="mx-auto max-w-2xl">
          <p className="eyebrow text-[#e08600]">— Booking request</p>
          <h1 className="mt-5 text-balance text-3xl font-extrabold text-black sm:text-4xl">
            One last step, and it is a real one.
          </h1>
          <p className="mt-5 text-[0.98rem] leading-relaxed text-slate-700">
            Your request for <strong className="text-black">{property.name}</strong> is ready. Send
            it through whichever channel suits you and a member of the team will come back with
            confirmed availability and a final total.
          </p>

          <div className="mt-8">
            <EnquiryHandoff
              subject={`Booking request — ${property.name} — ${checkIn} to ${checkOut}`}
              body={body}
              reference={`HP-REQ-${property.slug.slice(0, 6).toUpperCase()}-${checkIn.replace(/-/g, '').slice(4)}`}
              onCopy={() => copyEnquiry(body)}
            />
          </div>

          <div className="mt-8 border border-slate-200 bg-white p-6">
            <p className="font-label text-[9px] tracking-[0.24em] text-slate-500">
              WHAT HAPPENS NEXT
            </p>
            <ol className="mt-4 flex flex-col gap-4">
              {[
                'We check the dates against our live schedule and confirm your residence.',
                'You receive a final quote and an invoice. Nothing is charged yet.',
                'We verify your identity over a secure channel, then send access details.',
                'Your address, access instructions and concierge contact are shared before you land.',
              ].map((text, i) => (
                <li key={text} className="flex gap-3.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center border border-black text-[0.7rem] font-bold text-black">
                    {i + 1}
                  </span>
                  <span className="text-[0.9rem] leading-relaxed text-slate-700">{text}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/stay/${property.slug}`}
              className="inline-flex items-center justify-center border border-black px-7 py-3.5 font-label text-[10.5px] tracking-[0.2em] text-black transition-colors duration-400 hover:bg-black hover:text-white"
            >
              BACK TO THE RESIDENCE
            </Link>
            <Link
              href="/stay"
              className="inline-flex items-center justify-center border border-[#FF9800] px-7 py-3.5 font-label text-[10.5px] tracking-[0.2em] text-black transition-colors duration-400 hover:bg-[#FF9800]"
            >
              EXPLORE MORE
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── Steps ─────────────────────────────────────────────────────────────── */
  return (
    <div className="container-hp py-12 sm:py-16">
      {/* Residence summary */}
      <div className="flex flex-col gap-5 border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:p-6">
        {property.images[0] ? (
          <div className="relative h-28 w-full shrink-0 overflow-hidden sm:h-24 sm:w-36">
            <Image
              src={property.images[0].url}
              alt={property.images[0].alt}
              fill
              sizes="(max-width: 640px) 100vw, 144px"
              className="object-cover"
            />
          </div>
        ) : null}
        <div className="min-w-0 flex-1">
          <p className="font-label text-[9px] tracking-[0.24em] text-[#e08600]">YOUR RESIDENCE</p>
          <h1 className="mt-2 text-xl font-extrabold text-black">{property.name}</h1>
          <p className="mt-1 text-[0.85rem] text-slate-600">
            {property.type} · {property.area} · up to {property.maxGuests} guests ·{' '}
            {formatNaira(displayPrice)} per night
          </p>
        </div>
        <Link
          href={`/stay/${property.slug}`}
          className="link-underline-hover shrink-0 text-[0.82rem] font-semibold text-black"
        >
          View residence
        </Link>
      </div>

      {/* Stepper */}
      <ol className="mt-8 flex items-center gap-2 sm:gap-4" aria-label="Booking progress">
        {STEPS.map((s, i) => {
          const currentIndex = STEPS.findIndex((x) => x.key === step);
          const state = i < currentIndex ? 'done' : i === currentIndex ? 'current' : 'todo';
          return (
            <li key={s.key} className="flex flex-1 items-center gap-2 sm:gap-3">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center border text-[0.7rem] font-bold ${
                  state === 'todo'
                    ? 'border-slate-300 text-slate-400'
                    : 'border-black bg-black text-white'
                }`}
                aria-current={state === 'current' ? 'step' : undefined}
              >
                {state === 'done' ? <CheckIcon className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <span
                className={`hidden font-label text-[9.5px] tracking-[0.2em] sm:inline ${
                  state === 'todo' ? 'text-slate-400' : 'text-black'
                }`}
              >
                {s.label.toUpperCase()}
              </span>
              {i < STEPS.length - 1 ? (
                <span className="h-px flex-1 bg-slate-200" aria-hidden="true" />
              ) : null}
            </li>
          );
        })}
      </ol>

      <div className="mt-9 grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-12">
        <div>
          {/* ── Dates ──────────────────────────────────────────────────── */}
          {step === 'dates' ? (
            <section aria-labelledby="step-dates">
              <h2 id="step-dates" className="text-xl font-extrabold text-black">
                When would you like to stay?
              </h2>
              <p className="mt-2.5 text-[0.92rem] leading-relaxed text-slate-600">
                Pick your dates and we will price the stay immediately. Nothing is reserved until we
                confirm with you.
              </p>

              <div className="mt-7 grid gap-5 sm:grid-cols-3">
                <div>
                  <label
                    htmlFor="check-in"
                    className="font-label text-[9px] tracking-[0.22em] text-slate-500"
                  >
                    CHECK-IN
                  </label>
                  <input
                    id="check-in"
                    type="date"
                    value={checkIn}
                    min={new Date().toISOString().slice(0, 10)}
                    onChange={(e) => {
                      setCheckIn(e.target.value);
                      if (checkOut && checkOut <= e.target.value) setCheckOut('');
                    }}
                    className="mt-2 w-full border border-slate-300 bg-white px-4 py-3 text-[0.95rem] font-semibold text-black focus:border-[#FF9800] focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="check-out"
                    className="font-label text-[9px] tracking-[0.22em] text-slate-500"
                  >
                    CHECK-OUT
                  </label>
                  <input
                    id="check-out"
                    type="date"
                    value={checkOut}
                    min={checkIn || new Date().toISOString().slice(0, 10)}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="mt-2 w-full border border-slate-300 bg-white px-4 py-3 text-[0.95rem] font-semibold text-black focus:border-[#FF9800] focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="guests"
                    className="font-label text-[9px] tracking-[0.22em] text-slate-500"
                  >
                    GUESTS
                  </label>
                  <select
                    id="guests"
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="mt-2 w-full border border-slate-300 bg-white px-4 py-3 text-[0.95rem] font-semibold text-black focus:border-[#FF9800] focus:outline-none"
                  >
                    {Array.from({ length: Math.max(1, property.maxGuests) }, (_, i) => i + 1).map(
                      (n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? 'guest' : 'guests'}
                        </option>
                      ),
                    )}
                  </select>
                </div>
              </div>

              {property.minStayNights > 1 ? (
                <p className="mt-4 text-[0.83rem] text-slate-500">
                  This residence has a {property.minStayNights}-night minimum stay.
                </p>
              ) : null}

              {blockedReason ? (
                <Alert tone="danger" className="mt-6" title="Those dates will not work">
                  {blockedReason}
                </Alert>
              ) : null}

              {/* Add-ons */}
              {quote ? (
                <div className="mt-9">
                  <p className="font-label text-[9.5px] tracking-[0.24em] text-black">
                    ADD SERVICES TO YOUR STAY
                  </p>
                  <div className="mt-4 flex flex-col gap-3">
                    {paidAddOns.map((addOn) => {
                      const Icon = addOn.key === 'PICKUP' ? CarIcon : ChefIcon;

                      /*
                       * A per-meal service is a quantity, not a switch. The count
                       * goes to the server as `chefMeals`; the add-on key is
                       * deliberately not also sent, because the quantity is
                       * authoritative and both together would double-charge.
                       */
                      if (addOn.unit === 'per_meal') {
                        const stayNights =
                          checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 1;
                        const max = Math.max(1, Math.min(stayNights * 3, 30));
                        return (
                          <div
                            key={addOn.key}
                            className={`flex items-start gap-4 border p-4 transition-colors duration-300 ${
                              chefMeals > 0
                                ? 'border-[#FF9800] bg-[#FF9800]/[0.07]'
                                : 'border-slate-200 hover:border-slate-400'
                            }`}
                          >
                            <span className="flex-1">
                              <span className="flex items-center gap-2.5 font-heading text-[0.92rem] font-bold text-black">
                                <Icon className="h-4 w-4 text-[#FF9800]" />
                                {addOn.name}
                              </span>
                              <span className="mt-1 block text-[0.84rem] leading-relaxed text-slate-600">
                                {addOn.description}
                              </span>
                            </span>

                            <span className="flex shrink-0 items-center gap-3">
                              <span className="text-right">
                                <span className="block font-display text-lg text-black">
                                  {formatNaira(addOn.price * chefMeals)}
                                </span>
                                <span className="block font-label text-[8px] tracking-[0.2em] text-slate-500">
                                  {formatNaira(addOn.price)} PER MEAL
                                </span>
                              </span>
                              <span className="flex items-center border border-black/20">
                                <button
                                  type="button"
                                  onClick={() => setChefMeals((n) => Math.max(0, n - 1))}
                                  disabled={chefMeals === 0}
                                  aria-label={`Remove one ${addOn.name}`}
                                  className="h-9 w-9 border-r border-black/20 text-lg leading-none text-black transition-colors duration-300 hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-black"
                                >
                                  −
                                </button>
                                <output
                                  className="w-10 text-center font-heading text-sm font-bold text-black"
                                  aria-live="polite"
                                >
                                  {chefMeals}
                                </output>
                                <button
                                  type="button"
                                  onClick={() => setChefMeals((n) => Math.min(max, n + 1))}
                                  disabled={chefMeals >= max}
                                  aria-label={`Add one ${addOn.name}`}
                                  className="h-9 w-9 border-l border-black/20 text-lg leading-none text-black transition-colors duration-300 hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-black"
                                >
                                  +
                                </button>
                              </span>
                            </span>
                          </div>
                        );
                      }

                      const active = addOns.includes(addOn.key);
                      return (
                        <label
                          key={addOn.key}
                          className="flex cursor-pointer items-start gap-4 border border-slate-200 p-4 transition-colors duration-300 hover:border-slate-400 has-[:checked]:border-[#FF9800] has-[:checked]:bg-[#FF9800]/[0.07]"
                        >
                          <input
                            type="checkbox"
                            checked={active}
                            onChange={() => {
                              setAddOns((prev) =>
                                active
                                  ? prev.filter((k) => k !== addOn.key)
                                  : [...prev, addOn.key],
                              );
                              track('add_on_selected', { addOn: addOn.key, added: !active });
                            }}
                            className="mt-1 h-4 w-4 shrink-0 cursor-pointer appearance-none border-[1.5px] border-black bg-white checked:border-[#FF9800] checked:bg-[#FF9800]"
                          />
                          <span className="flex-1">
                            <span className="flex items-center gap-2.5 font-heading text-[0.92rem] font-bold text-black">
                              <Icon className="h-4 w-4 text-[#FF9800]" />
                              {addOn.name}
                            </span>
                            <span className="mt-1 block text-[0.84rem] leading-relaxed text-slate-600">
                              {addOn.description}
                            </span>
                          </span>
                          <span className="shrink-0 text-right">
                            <span className="block font-display text-lg text-black">
                              {formatNaira(addOn.price)}
                            </span>
                            <span className="block font-label text-[8px] tracking-[0.2em] text-slate-500">
                              {addOn.unit === 'per_night' ? 'PER NIGHT' : 'PER STAY'}
                            </span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              <Button
                onClick={() => setStep('guests')}
                disabled={!quote}
                className="mt-9"
                size="lg"
              >
                {quote ? 'CONTINUE' : 'SELECT VALID DATES TO CONTINUE'}
              </Button>
            </section>
          ) : null}

          {/* ── Guest details ──────────────────────────────────────────── */}
          {step === 'guests' ? (
            <section aria-labelledby="step-guests">
              <h2 id="step-guests" className="text-xl font-extrabold text-black">
                Who is staying?
              </h2>
              <p className="mt-2.5 text-[0.92rem] leading-relaxed text-slate-600">
                Just enough for us to prepare and to reach you about this stay.
              </p>

              <Alert tone="info" className="mt-6" title="No documents needed here">
                We do not ask for a passport or ID number on this site — there is nowhere encrypted
                to store one. We verify your identity properly when we confirm the booking, over a
                secure channel and directly with you.
              </Alert>

              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <Input
                  label="Full name"
                  id="g-name"
                  value={guest.fullName}
                  onChange={(e) => setGuest({ ...guest, fullName: e.target.value })}
                  error={fieldErrors.fullName}
                  autoComplete="name"
                  required
                />
                <Input
                  label="Email"
                  id="g-email"
                  type="email"
                  value={guest.email}
                  onChange={(e) => setGuest({ ...guest, email: e.target.value })}
                  error={fieldErrors.email}
                  autoComplete="email"
                  required
                />
                <Input
                  label="Phone"
                  id="g-phone"
                  type="tel"
                  value={guest.phone}
                  onChange={(e) => setGuest({ ...guest, phone: e.target.value })}
                  error={fieldErrors.phone}
                  autoComplete="tel"
                  required
                />
                <Input
                  label="Nationality"
                  id="g-nat"
                  value={guest.nationality}
                  onChange={(e) => setGuest({ ...guest, nationality: e.target.value })}
                  autoComplete="country-name"
                />
                <Input
                  label="Arrival time (optional)"
                  id="g-arrival"
                  value={guest.arrivalTime}
                  onChange={(e) => setGuest({ ...guest, arrivalTime: e.target.value })}
                  placeholder="e.g. 18:30"
                />
                <Input
                  label="Flight number (optional)"
                  id="g-flight"
                  value={guest.flightNumber}
                  onChange={(e) => setGuest({ ...guest, flightNumber: e.target.value })}
                  placeholder="e.g. AIB 1452"
                />
              </div>

              <div className="mt-5">
                <Textarea
                  label="Anything we should know? (optional)"
                  id="g-notes"
                  rows={4}
                  value={guest.notes}
                  onChange={(e) => setGuest({ ...guest, notes: e.target.value })}
                  placeholder="Dietary requirements, accessibility needs, a colleague joining you, an early arrival…"
                />
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button variant="outline" onClick={() => setStep('dates')}>
                  BACK
                </Button>
                <Button onClick={submit} size="lg">
                  REVIEW REQUEST
                </Button>
              </div>
            </section>
          ) : null}
        </div>

        {/* ── Summary rail ──────────────────────────────────────────────── */}
        <aside className="lg:sticky lg:top-[100px] lg:self-start">
          <div className="border border-slate-200 bg-white">
            <span className="block h-[3px] w-full bg-[#FF9800]" aria-hidden="true" />
            <div className="p-6">
              <p className="font-label text-[9px] tracking-[0.24em] text-slate-500">
                {quote ? 'YOUR STAY' : 'INDICATIVE RATE'}
              </p>

              {quote ? (
                <>
                  <p className="mt-3 font-heading text-[1.05rem] font-extrabold text-black">
                    {formatDate(checkIn, 'medium')} — {formatDate(checkOut, 'medium')}
                  </p>
                  <p className="mt-1 text-[0.85rem] text-slate-600">
                    {quote.nights} night{quote.nights === 1 ? '' : 's'} · {guests}{' '}
                    {guests === 1 ? 'guest' : 'guests'}
                  </p>

                  <div className="mt-6 flex flex-col gap-2.5 border-t border-slate-100 pt-5 text-[0.85rem]">
                    <Row
                      label={`${formatNaira(quote.displayPrice)} × ${quote.nights} night${quote.nights === 1 ? '' : 's'}`}
                      value={formatNaira(quote.nightsSubtotal)}
                    />
                    {quote.weeklyDiscount > 0 ? (
                      <Row
                        label="Weekly rate discount"
                        value={`−${formatNaira(quote.weeklyDiscount)}`}
                        tone="credit"
                      />
                    ) : null}
                    {quote.addOns.length > 0 ? (
                      <Row label="Services" value={formatNaira(quote.addOnsSubtotal)} />
                    ) : null}
                    {quote.cleaningFee > 0 ? (
                      <Row label="Cleaning & setup" value={formatNaira(quote.cleaningFee)} />
                    ) : null}
                    {quote.serviceCharge > 0 ? (
                      <Row label="Service charge" value={formatNaira(quote.serviceCharge)} />
                    ) : null}

                    <div className="mt-2 flex items-end justify-between border-t border-black pt-4">
                      <span className="font-heading text-[0.95rem] font-extrabold text-black">
                        Indicative total
                      </span>
                      <span className="font-display text-2xl text-black">
                        {formatNaira(quote.total)}
                      </span>
                    </div>
                  </div>

                  {quote.complimentaryBenefits.length > 0 ? (
                    <div className="mt-5 border border-[#FF9800]/40 bg-[#FF9800]/[0.08] p-4">
                      <p className="font-label text-[9px] tracking-[0.22em] text-[#e08600]">
                        COMPLIMENTARY
                      </p>
                      <ul className="mt-3 flex flex-col gap-2.5">
                        {quote.complimentaryBenefits.map((b) => (
                          <li key={b.code} className="flex gap-2.5">
                            <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#12805c]" />
                            <span className="text-[0.82rem] leading-relaxed text-slate-700">
                              <strong className="font-semibold text-black">{b.label}.</strong>{' '}
                              {b.detail}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : quote.nightsUntilDiscountEligible > 0 ? (
                    <p className="mt-5 border border-slate-200 bg-slate-50 p-4 text-[0.8rem] leading-relaxed text-slate-600">
                      Stay{' '}
                      <strong className="font-semibold text-black">
                        {quote.nightsUntilDiscountEligible} more night
                        {quote.nightsUntilDiscountEligible === 1 ? '' : 's'}
                      </strong>{' '}
                      to unlock complimentary airport pickup and private-chef meals.
                    </p>
                  ) : null}
                </>
              ) : (
                <p className="mt-3 text-[0.9rem] leading-relaxed text-slate-600">
                  Choose your dates and the full breakdown appears here, including any long-stay
                  benefits.
                </p>
              )}

              <div className="mt-6 border-t border-slate-100 pt-5">
                <p className="flex gap-2.5 text-[0.78rem] leading-relaxed text-slate-600">
                  <LockIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#12805c]" />
                  This total is an indication. We re-confirm availability and send a final quote
                  before anything is reserved or charged.
                </p>
                <ul className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4 text-[0.78rem] text-slate-600">
                  <li className="flex items-center gap-2">
                    <PlaneIcon className="h-3.5 w-3.5 shrink-0 text-[#FF9800]" />
                    Check-in from {property.checkInTime} · out by {property.checkOutTime}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircleIcon className="h-3.5 w-3.5 shrink-0 text-[#12805c]" />
                    Free cancellation up to 7 days before check-in
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: 'credit';
}) {
  return (
    <div className="flex items-center justify-between">
      <span className={tone === 'credit' ? 'text-[#12805c]' : 'text-slate-600'}>{label}</span>
      <span className={tone === 'credit' ? 'font-semibold text-[#12805c]' : 'font-semibold text-black'}>
        {value}
      </span>
    </div>
  );
}
