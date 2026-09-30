'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Badge, Button } from '@/components/ui/primitives';
import { Input, Select } from '@/components/ui/form';
import { CalendarIcon, FilterIcon, SearchIcon, UsersIcon } from '@/components/ui/icons';
import { PropertyCard, type PropertyCardData } from './PropertyCard';
import { track } from '@/lib/analytics';
import { EnquiryHandoff, copyEnquiry, enquiryBody } from '@/components/ui/EnquiryHandoff';

export interface SearchFiltersState {
  area: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  bedrooms: number;
  type: string;
  priceMax: number;
  amenities: string[];
  sort: string;
}

const EMPTY: SearchFiltersState = {
  area: '',
  checkIn: '',
  checkOut: '',
  guests: 2,
  bedrooms: 0,
  type: '',
  priceMax: 0,
  amenities: [],
  sort: 'recommended',
};

interface Facets {
  areas: string[];
  types: string[];
  amenities: string[];
}

interface SearchResponse {
  results: PropertyCardData[];
  total: number;
  page: number;
  pages: number;
  facets: Facets;
  curated: boolean;
}

const POPULAR_AMENITIES = [
  'Private pool',
  'Fibre broadband',
  'Backup power & inverter',
  'Gym access',
  'CCTV coverage',
  'Secure parking',
  'Dedicated work desk',
  'Water treatment',
];

export function StayBrowser({
  all,
  facets,
  priceCeiling,
  initialFilters,
}: {
  /** Every residence, already priced for the published rate list. */
  all: PropertyCardData[];
  facets: Facets;
  priceCeiling: number;
  /** Parsed from the query string by the server component. */
  initialFilters?: Partial<SearchFiltersState>;
}) {
  const router = useRouter();

  const [filters, setFilters] = useState<SearchFiltersState>(() => ({
    ...EMPTY,
    ...initialFilters,
  }));
  const [showFilters, setShowFilters] = useState(false);
  const [priceMax, setPriceMax] = useState(priceCeiling);

  /*
   * Search is a pure derivation over the full residence list, so it is computed
   * during render. No request, no debounce timer and no loading state to
   * flicker — the same inputs always give the same results, which also makes it
   * trivially testable.
   */
  const data = useMemo<SearchResponse>(() => {
    const byPrice = new Map(all.map((card) => [card.slug, card]));

    const matched = all
      .map((card) => byPrice.get(card.slug))
      .filter((card): card is PropertyCardData => Boolean(card))
      .filter((card) => {
        if (filters.area && card.area !== filters.area) return false;
        if (filters.type && card.type !== filters.type) return false;
        if (filters.bedrooms && card.bedrooms < filters.bedrooms) return false;
        if (filters.guests && card.maxGuests < filters.guests) return false;
        if (priceMax && card.displayPrice > priceMax) return false;
        if (filters.amenities.length && !filters.amenities.every((a) => card.amenities.includes(a))) {
          return false;
        }
        return true;
      });

    const sorted = [...matched];
    switch (filters.sort) {
      case 'price_low':
        sorted.sort((a, b) => a.displayPrice - b.displayPrice);
        break;
      case 'price_high':
        sorted.sort((a, b) => b.displayPrice - a.displayPrice);
        break;
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return {
      results: sorted,
      total: sorted.length,
      page: 1,
      pages: 1,
      facets,
      curated: false,
    };
  }, [all, filters, priceMax, facets]);

  const activeCount =
    (filters.area ? 1 : 0) +
    (filters.checkIn ? 1 : 0) +
    (filters.guests !== 2 ? 1 : 0) +
    (filters.bedrooms ? 1 : 0) +
    (filters.type ? 1 : 0) +
    (priceMax ? 1 : 0) +
    filters.amenities.length;

  function update<K extends keyof SearchFiltersState>(key: K, value: SearchFiltersState[K]) {
    setFilters((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'checkIn' && next.checkOut && next.checkOut <= (value as string)) {
        next.checkOut = '';
      }
      return next;
    });
  }

  function submit() {
    const q = new URLSearchParams();
    if (filters.area) q.set('area', filters.area);
    if (filters.checkIn) q.set('checkIn', filters.checkIn);
    if (filters.checkOut) q.set('checkOut', filters.checkOut);
    if (filters.guests) q.set('guests', String(filters.guests));
    if (filters.bedrooms) q.set('bedrooms', String(filters.bedrooms));
    if (filters.type) q.set('type', filters.type);
    if (priceMax) q.set('priceMax', String(priceMax));
    if (filters.amenities.length) q.set('amenities', filters.amenities.join(','));
    q.set('sort', filters.sort);
    router.replace(`/stay?${q.toString()}`, { scroll: false });
    track('search_submitted', {
      source: 'stay_browser',
      results: data.total,
      area: filters.area,
      guests: filters.guests,
    });
  }

  function reset() {
    setFilters(EMPTY);
    setPriceMax(0);
    router.replace('/stay', { scroll: false });
  }

  return (
    <div className="container-hp">
      {/* Search bar */}
      <div className="border border-slate-200 bg-white p-5 shadow-[0_20px_50px_-40px_rgba(0,0,0,0.6)] sm:p-6">
        <div className="grid gap-3 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <Input
              label="Location / Area"
              value={filters.area}
              onChange={(e) => update('area', e.target.value)}
              list="area-options"
              placeholder="Anywhere in Lagos"
            />
            <datalist id="area-options">
              {facets.areas.map((area) => (
                <option key={area} value={area} />
              ))}
            </datalist>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:col-span-4 lg:grid-cols-2">
            <Input
              label="Check-in"
              type="date"
              value={filters.checkIn}
              min={new Date().toISOString().slice(0, 10)}
              onChange={(e) => update('checkIn', e.target.value)}
            />
            <Input
              label="Check-out"
              type="date"
              value={filters.checkOut}
              min={filters.checkIn || new Date().toISOString().slice(0, 10)}
              onChange={(e) => update('checkOut', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 lg:col-span-3">
            <Input
              label="Guests"
              type="number"
              min={1}
              max={20}
              value={filters.guests}
              onChange={(e) => update('guests', Number(e.target.value) || 1)}
            />
            <Select
              label="Bedrooms"
              value={String(filters.bedrooms)}
              onChange={(e) => update('bedrooms', Number(e.target.value))}
              placeholder="Any"
            >
              <option value="0">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </Select>
          </div>

          <div className="flex items-end gap-3 lg:col-span-2">
            <Button onClick={submit} className="flex-1" fullWidth>
              <SearchIcon className="h-4 w-4" /> SEARCH
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowFilters((v) => !v)}
              aria-expanded={showFilters}
              aria-label="More filters"
              className="shrink-0 px-4"
            >
              <FilterIcon className="h-4 w-4" />
              {activeCount > 0 ? (
                <span className="ml-1 flex h-5 min-w-5 items-center justify-center bg-black px-1 text-[10px] text-white">
                  {activeCount}
                </span>
              ) : null}
            </Button>
          </div>
        </div>

        {showFilters ? (
          <div className="mt-5 grid gap-5 border-t border-slate-200 pt-5 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <Select
                label="Property type"
                value={filters.type}
                onChange={(e) => update('type', e.target.value)}
                placeholder="Any type"
              >
                {facets.types.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
            </div>

            <div className="lg:col-span-4">
              <label
                htmlFor="price-range"
                className="font-label text-[10px] tracking-[0.26em] text-black"
              >
                Max nightly rate
              </label>
              <input
                id="price-range"
                type="range"
                min={0}
                max={priceCeiling}
                step={50_000_00}
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="mt-3"
              />
              <p className="mt-1.5 text-[0.78rem] text-slate-500">
                {priceMax === 0
                  ? 'No limit — showing all rates'
                  : `Up to ₦${(priceMax / 100).toLocaleString('en-NG')} per night`}
              </p>
            </div>

            <div className="lg:col-span-5">
              <p className="font-label text-[10px] tracking-[0.26em] text-black">Amenities</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {POPULAR_AMENITIES.map((amenity) => {
                  const active = filters.amenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() =>
                        update(
                          'amenities',
                          active
                            ? filters.amenities.filter((a) => a !== amenity)
                            : [...filters.amenities, amenity],
                        )
                      }
                      aria-pressed={active}
                      className={`border px-3 py-1.5 text-[0.78rem] transition-colors duration-300 ${
                        active
                          ? 'border-[#FF9800] bg-[#FF9800] font-semibold text-black'
                          : 'border-slate-300 text-slate-600 hover:border-black'
                      }`}
                    >
                      {amenity}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-slate-200 pt-4 lg:col-span-12">
              <Select
                label="Sort by"
                value={filters.sort}
                onChange={(e) => update('sort', e.target.value)}
                placeholder="Recommended"
                className="max-w-[220px]"
              >
                <option value="recommended">Recommended</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
                <option value="newest">Newest</option>
              </Select>
              <Button variant="ghost" size="sm" onClick={reset}>
                Clear all filters
              </Button>
            </div>
          </div>
        ) : null}
      </div>

      {/* Results header */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <p className="text-[0.9rem] text-slate-600" aria-live="polite">
          <strong className="font-bold text-black">{data.total}</strong>{' '}
          {data.total === 1 ? 'residence' : 'residences'} available
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {filters.checkIn && filters.checkOut ? (
            <Badge tone="black">
              <CalendarIcon className="h-3 w-3" />
              {filters.checkIn} → {filters.checkOut}
            </Badge>
          ) : null}
          {filters.guests > 2 ? (
            <Badge tone="muted">
              <UsersIcon className="h-3 w-3" />
              {filters.guests} guests
            </Badge>
          ) : null}
          {filters.area ? <Badge tone="muted">{filters.area}</Badge> : null}
        </div>
      </div>

      {/* Results */}
      {data.results.length > 0 ? (
        <div
          className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-3"
        >
          {data.results.map((property, index) => (
            <PropertyCard key={property.slug} property={property} index={index} priority={index < 3} />
          ))}
        </div>
      ) : (
        <NoMatchState filters={filters} onReset={reset} />
      )}
    </div>
  );
}

/**
 * No-match state.
 * If filters return nothing, offer the assisted-search path rather than a dead
 * end. The request is routed to the admin dashboard for manual sourcing.
 */
function NoMatchState({
  filters,
  onReset,
}: {
  filters: SearchFiltersState;
  onReset: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-8 border border-slate-200 bg-cream-soft p-8 sm:p-12">
      <p className="eyebrow text-black">— No exact match</p>
      <h2 className="mt-5 max-w-2xl text-balance text-2xl font-extrabold text-black sm:text-3xl">
        Tell us what you need — we will source it.
      </h2>
      <p className="mt-4 max-w-2xl text-[0.95rem] leading-relaxed text-slate-700">
        Nothing in our published inventory matches those filters right now. Our reservations team
        can source suitable available options — including residences we hold outside the public
        listings — and come back to you with real availability.
      </p>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <Button onClick={() => setOpen(true)}>
          REQUEST AN ASSISTED SEARCH
        </Button>
        <Button variant="outline" onClick={onReset}>
          Clear filters
        </Button>
      </div>

      <div className="mt-8 border-t border-black/10 pt-6">
        <p className="font-label text-[9.5px] tracking-[0.26em] text-slate-500">
          WHAT YOU SEARCHED FOR
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {filters.area ? <Badge tone="muted">{filters.area}</Badge> : null}
          {filters.checkIn ? <Badge tone="muted">From {filters.checkIn}</Badge> : null}
          {filters.checkOut ? <Badge tone="muted">To {filters.checkOut}</Badge> : null}
          <Badge tone="muted">{filters.guests} guests</Badge>
          {filters.bedrooms > 0 ? <Badge tone="muted">{filters.bedrooms}+ bedrooms</Badge> : null}
          {filters.type ? <Badge tone="muted">{filters.type}</Badge> : null}
          {filters.amenities.map((a) => (
            <Badge key={a} tone="muted">
              {a}
            </Badge>
          ))}
        </ul>
      </div>

      {open ? (
        <AssistedSearchDialog filters={filters} onClose={() => setOpen(false)} />
      ) : null}
    </div>
  );
}

function AssistedSearchDialog({
  filters,
  onClose,
}: {
  filters: SearchFiltersState;
  onClose: () => void;
}) {
  const [status, setStatus] = useState<'idle' | 'done'>('idle');
  const [enquiry, setEnquiry] = useState<{ subject: string; body: string } | null>(null);

  /*
   * Validate locally, then prepare the request for the guest to send. There is
   * no reservations inbox behind this form any more, so it is presented as
   * "tell us what you need" rather than a request that has been logged.
   */
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const str = (key: string) => String(form.get(key) ?? '').trim();

    setEnquiry({
      subject: 'Assisted accommodation search',
      body: enquiryBody({
        name: str('name'),
        email: str('email'),
        phone: str('phone'),
        area: filters.area || undefined,
        checkIn: filters.checkIn || undefined,
        checkOut: filters.checkOut || undefined,
        guests: filters.guests,
        requirements: str('requirements'),
      }),
    });
    setStatus('done');
    track('assisted_search_submitted', { area: filters.area, guests: filters.guests });
  }

  if (status === 'done' && enquiry) {
    return (
      <div className="mt-8 border border-slate-200 bg-white p-7">
        <EnquiryHandoff
          subject={enquiry.subject}
          body={enquiry.body}
          onCopy={() => copyEnquiry(enquiry.body)}
        />
        <Button variant="outline" className="mt-6" onClick={onClose}>
          Close
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-8 border border-slate-200 bg-white p-7">
      <p className="eyebrow text-black">— Assisted search request</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Input label="Full name" name="name" required autoComplete="name" />
        <Input label="Email" name="email" type="email" required autoComplete="email" />
        <Input
          label="Phone / WhatsApp"
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          className="sm:col-span-2"
        />
        <TextareaFallback
          label="What do you need?"
          name="requirements"
          defaultValue={`${
            filters.area ? `Area: ${filters.area}. ` : ''
          }${filters.checkIn && filters.checkOut ? `Dates: ${filters.checkIn} to ${filters.checkOut}. ` : ''}${
            filters.guests
          } guests${filters.bedrooms > 0 ? `, ${filters.bedrooms}+ bedrooms` : ''}.`}
          required
        />
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button type="submit">PREPARE MY REQUEST</Button>
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancel
        </Button>
      </div>

      <p className="mt-4 text-[0.78rem] leading-relaxed text-slate-500">
        This prepares a message for you to send. It does not search anything on our side.
      </p>
    </form>
  );
}

function TextareaFallback(props: React.ComponentProps<'textarea'> & { label: string }) {
  const { label, ...rest } = props;
  const id = `ta-${rest.name}`;
  return (
    <div className="flex flex-col gap-2 sm:col-span-2">
      <label htmlFor={id} className="font-label text-[10px] tracking-[0.26em] text-black">
        {label}
      </label>
      <textarea
        id={id}
        rows={4}
        className="w-full rounded-[3px] border border-slate-300 bg-white px-4 py-3 text-[0.95rem] text-black transition-colors duration-300 focus:border-[#FF9800] focus:outline-none"
        {...rest}
      />
    </div>
  );
}
