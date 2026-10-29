'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/primitives';
import { BrandCheckbox, FormStatus, Input, Textarea } from '@/components/ui/form';
import { CalendarIcon, CheckCircleIcon, LockIcon, UsersIcon } from '@/components/ui/icons';
import { CAPITAL_RANGES, COUNTRIES, type OpportunityJourney } from '@/data/types';
import { ACKNOWLEDGEMENT_MESSAGE, NEXT_STEPS } from '@/data/enquiry';
import { track } from '@/lib/analytics';
import { EnquiryHandoff, copyEnquiry, enquiryBody } from '@/components/ui/EnquiryHandoff';

interface AreaOption {
  value: string;
  label: string;
}

/** Fine-grained "area of interest" for the Investment journey — the six categories. */
const INVESTMENT_AREAS: AreaOption[] = [
  { value: 'AGRO_REAL_ESTATE', label: 'Agro Real Estate' },
  { value: 'RENTAL_INCOME_PROPERTY', label: 'Rental Income Property' },
  { value: 'PRECIOUS_METALS', label: 'Precious Metals' },
  { value: 'PRECIOUS_STONES', label: 'Precious Stones' },
  { value: 'JOINT_VENTURE', label: 'Joint Venture' },
  { value: 'DISTRIBUTION_INCOME', label: 'Distribution Income' },
];

/** Fine-grained "area of interest" for the Business journey. */
const BUSINESS_AREAS: AreaOption[] = [
  { value: 'HOSPITALITY_OPERATIONS', label: 'Hospitality & Operations' },
  { value: 'AGRICULTURE_PRODUCE', label: 'Agriculture & Produce' },
  { value: 'LOGISTICS_DELIVERY', label: 'Logistics & Delivery' },
  { value: 'FACILITIES_SERVICES', label: 'Facilities & Services' },
];

type Stage = 'form' | 'acknowledged' | 'office' | 'apartment' | 'ready';

interface BaseDetails {
  interestType: OpportunityJourney;
  area: string;
  capital: string;
  geography: string;
  isGroup: boolean;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  brief: string;
}

const todayISO = () => new Date().toISOString().slice(0, 10);

/**
 * Initial interest form, with the journey-aware enquiry flow.
 *
 * CATEGORY INHERITANCE (PRD §3): when the form is opened from a Business or an
 * Investment journey it receives that journey as `journey`, classifies the
 * enquiry automatically, and does NOT ask the customer to choose again. The
 * Business/Investment selector only appears on a general enquiry form that was
 * reached without first selecting a journey.
 *
 * APPROVED FIELDS ONLY. Experience, objectives, risk appetite, investment
 * duration, exit preference and deployment timeline are never collected here.
 *
 * After submission the customer receives the acknowledgement (PRD §8) and then
 * chooses how to proceed (PRD §5): request an office visit, or book an
 * apartment near their preferred location. Nothing is posted to a server — the
 * finished enquiry is handed off by email or WhatsApp, and the chosen next step
 * and its details travel inside that message.
 */
export function InterestForm({
  disclaimerVersion,
  journey,
  areaOptions,
  defaultArea,
  stayAreas = [],
}: {
  disclaimerVersion: number;
  /** When set, the category is inherited from the journey and no selector is shown. */
  journey?: OpportunityJourney | null;
  /** Override the fine-grained "area of interest" list. Defaults to the journey's set. */
  areaOptions?: AreaOption[];
  defaultArea?: string;
  /** Known residence areas, used to deep-link the apartment search. */
  stayAreas?: string[];
}) {
  const inherited = Boolean(journey);
  const [interestType, setInterestType] = useState<OpportunityJourney>(journey ?? 'INVESTMENT');
  const [isGroup, setIsGroup] = useState(false);
  const [status, setStatus] = useState<'idle' | 'invalid' | 'ready'>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [stage, setStage] = useState<Stage>('form');
  const [details, setDetails] = useState<BaseDetails | null>(null);
  const [enquiry, setEnquiry] = useState<{ subject: string; body: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [acknowledged, setAcknowledged] = useState(true);
  const [apartmentArea, setApartmentArea] = useState('');

  const areas = areaOptions ?? (journey === 'BUSINESS' ? BUSINESS_AREAS : INVESTMENT_AREAS);

  function validate(form: FormData): { ok: true; value: BaseDetails } | { ok: false; errors: Record<string, string> } {
    const str = (key: string) => String(form.get(key) ?? '').trim();
    const next: Record<string, string> = {};

    const fullName = str('fullName');
    const email = str('email');
    const phone = str('phone');
    const country = str('countryOfResidence');
    const capital = str('capitalRange');
    const brief = str('briefDescription');
    const area = str('areaOfInterest') || defaultArea || 'GENERAL';
    const geography = str('geographicPreference');

    if (fullName.length < 2) next.fullName = 'Please tell us your name';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) next.email = 'Please enter a valid email address';
    if (phone.replace(/[^\d]/g, '').length < 7) next.phone = 'Please enter a contact number';
    if (!country) next.countryOfResidence = 'Please tell us where you are based';
    if (!capital) next.capitalRange = 'Please choose a range';
    if (!geography) next.geographicPreference = 'Please choose a preference';
    if (brief && brief.length > 2000) next.briefDescription = 'Please keep this under 2,000 characters';

    if (Object.keys(next).length > 0) return { ok: false, errors: next };

    return {
      ok: true,
      value: { interestType, area, capital, geography, isGroup, fullName, email, phone, country, brief },
    };
  }

  function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setErrors({});

    if (!acknowledged) {
      setStatus('invalid');
      setMessage('Please acknowledge the notice before sending your interest.');
      return;
    }

    const result = validate(new FormData(event.currentTarget));
    if (!result.ok) {
      setErrors(result.errors);
      setStatus('invalid');
      setMessage('Please check the highlighted fields.');
      return;
    }

    setDetails(result.value);
    setErrors({});
    setStatus('idle');
    setStage('acknowledged');
    track('interest_submitted', { type: result.value.interestType, group: result.value.isGroup });
  }

  function compose(nextStep: 'OFFICE_VISIT' | 'APARTMENT_BOOKING', extra: Record<string, string | undefined>) {
    if (!details) return;
    const prepared = enquiryBody({
      'Journey': details.interestType === 'BUSINESS' ? 'Business Opportunity' : 'Investment Opportunity',
      'Area of interest': details.area.replace(/_/g, ' ').toLowerCase(),
      'Capital range': details.capital,
      'Geographic preference': details.geography.replace(/_/g, ' ').toLowerCase(),
      'Group enquiry': details.isGroup ? 'Yes' : 'No',
      'Next step': nextStep === 'OFFICE_VISIT' ? 'Office visit' : 'Apartment booking',
      ...extra,
      'Name': details.fullName,
      'Email': details.email,
      'Phone': details.phone,
      'Country of residence': details.country,
      'Brief': details.brief || undefined,
      'Submitted': new Date().toISOString().slice(0, 10),
    });

    setEnquiry({
      subject: `Interest registration — ${details.area.replace(/_/g, ' ').toLowerCase()}`,
      body:
        `I have read and acknowledge the opportunity notice (version ${disclaimerVersion}).\n` +
        `No returns are guaranteed and I understand Heavenward Place does not take custody of funds.\n\n` +
        prepared,
    });
    setStage('ready');
  }

  function submitOffice(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const preferredDate = String(new FormData(event.currentTarget).get('preferredDate') ?? '').trim();
    if (!preferredDate) {
      setErrors({ preferredDate: 'Please choose a preferred date' });
      return;
    }
    if (preferredDate < todayISO()) {
      setErrors({ preferredDate: 'Please choose a date from today onwards' });
      return;
    }
    setErrors({});
    compose('OFFICE_VISIT', { 'Preferred visit date': preferredDate });
  }

  function submitApartment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const preferredLocation = String(form.get('apartmentLocation') ?? '').trim();
    const requirements = String(form.get('apartmentRequirements') ?? '').trim();
    if (!preferredLocation && !requirements) {
      setErrors({ apartmentLocation: 'Please tell us a preferred location or what you need' });
      return;
    }
    setErrors({});
    compose('APARTMENT_BOOKING', {
      'Preferred location': preferredLocation || 'Not specified',
      'Accommodation requirements': requirements || undefined,
    });
  }

  /* ─────────────────────────── Ready: hand off ─────────────────────────── */
  if (stage === 'ready' && enquiry && details) {
    return (
      <div className="border border-slate-200 bg-white p-8 sm:p-10">
        <CheckCircleIcon className="h-12 w-12 text-[#12805c]" />
        <p className="eyebrow mt-7 text-[#0d5f44]">— Interest registered</p>
        <h3 className="mt-5 text-2xl font-extrabold text-black">
          Send it, and we will review it personally.
        </h3>
        <p className="mt-4 text-[0.95rem] leading-relaxed text-slate-700">
          A representative will read your stated interest and next-step choice, then get back to you
          with the relevant next steps.
          {details.isGroup ? ' We will ask for the group name and an authorised contact during that call.' : ''}
        </p>

        {details.isGroup ? (
          <p className="mt-4 flex items-start gap-2.5 text-[0.9rem] leading-relaxed text-slate-700">
            <UsersIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#FF9800]" />
            <span>
              You have flagged this as a <strong className="text-black">group enquiry</strong>. We
              will ask for the entity name and an authorised contact when we follow up.
            </span>
          </p>
        ) : null}

        <div className="mt-7">
          <EnquiryHandoff
            subject={enquiry.subject}
            body={enquiry.body}
            onCopy={() => copyEnquiry(enquiry.body)}
          />
        </div>

        <button
          type="button"
          onClick={() => {
            setStage('form');
            setEnquiry(null);
          }}
          className="link-underline-hover mt-6 text-[0.85rem] font-semibold text-black"
        >
          Edit my details
        </button>
      </div>
    );
  }

  /* ──────────────────── Apartment booking next step (PRD §5B) ──────────────────── */
  if (stage === 'apartment' && details) {
    const stayHref = apartmentArea ? `/stay?area=${encodeURIComponent(apartmentArea)}` : '/stay';
    return (
      <div className="border border-slate-200 bg-white p-8 sm:p-10">
        <p className="eyebrow text-black">— Next step</p>
        <h3 className="mt-5 text-2xl font-extrabold text-black">Find an apartment near your preferred location</h3>
        <p className="mt-4 text-[0.92rem] leading-relaxed text-slate-600">
          Tell us where you would like to be and what you need. We point you to available apartments
          in that area — or the closest available areas where practical — so the discussion happens in
          a comfortable, conducive setting.
        </p>

        <div className="mt-7 grid gap-5">
          <label className="flex flex-col gap-2">
            <span className="font-label text-[10px] tracking-[0.26em] text-black">
              PREFERRED LOCATION / AREA
            </span>
            <select
              name="apartmentLocation"
              value={apartmentArea}
              onChange={(e) => setApartmentArea(e.target.value)}
              className="w-full rounded-[3px] border border-slate-300 bg-white px-4 py-3 text-[0.95rem] text-black focus:border-[#FF9800] focus:outline-none"
            >
              <option value="">Select an area…</option>
              {stayAreas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
              <option value="Other">Somewhere else / not sure yet</option>
            </select>
            {errors.apartmentLocation ? (
              <p role="alert" className="text-[0.78rem] font-medium text-[#c02626]">
                {errors.apartmentLocation}
              </p>
            ) : null}
          </label>

          <Textarea
            label="Optional — describe the apartment you need"
            name="apartmentRequirements"
            rows={4}
            maxLength={1000}
            placeholder="For example: a one-bedroom in Lekki for three nights, quiet, with a desk and strong Wi-Fi, for two guests."
            hint="Location, dates, guest count, apartment type and any other requirements."
          />
        </div>

        <div className="mt-7 border border-slate-200 bg-slate-50 p-5">
          <p className="font-label text-[9px] tracking-[0.24em] text-slate-500">BROWSE FIRST</p>
          <p className="mt-3 text-[0.88rem] leading-relaxed text-slate-600">
            You can browse and book an available apartment now. Booking is subject to availability,
            standard booking procedures, applicable pricing and payment terms — and booking an
            apartment does not guarantee access to, acceptance into or success of an opportunity.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link
              href={stayHref}
              className="inline-flex items-center justify-center border border-[#FF9800] bg-[#FF9800] px-6 py-3.5 font-label text-[10px] tracking-[0.2em] text-black transition-colors duration-400 hover:bg-transparent hover:text-[#FF9800]"
            >
              BROWSE APARTMENTS{apartmentArea && apartmentArea !== 'Other' ? ` — ${apartmentArea.toUpperCase()}` : ''}
            </Link>
            <button
              type="button"
              onClick={() => setStage('acknowledged')}
              className="link-underline-hover text-[0.85rem] font-semibold text-black"
            >
              Back to options
            </button>
          </div>
        </div>

        <form onSubmit={submitApartment} className="mt-8">
          <FormStatus status={status === 'ready' ? 'idle' : status} message={message} />
          <Button type="submit" size="lg" fullWidth>
            SEND MY APARTMENT REQUEST
          </Button>
          <p className="mt-4 flex items-start justify-center gap-2 text-center text-[0.78rem] leading-relaxed text-slate-500">
            <LockIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            If no suitable apartment is available, your request reaches our team for manual follow-up
            and alternative options.
          </p>
        </form>
      </div>
    );
  }

  /* ───────────────────── Office visit next step (PRD §5A) ───────────────────── */
  if (stage === 'office' && details) {
    return (
      <div className="border border-slate-200 bg-white p-8 sm:p-10">
        <p className="eyebrow text-black">— Next step</p>
        <h3 className="mt-5 text-2xl font-extrabold text-black">Request an office visit</h3>
        <p className="mt-4 text-[0.92rem] leading-relaxed text-slate-600">
          Tell us your preferred date. We record it as a request, check availability, and respond with
          an available time window for that date — or propose an alternative. Your visit is confirmed
          only once we and you agree on a time.
        </p>

        <form onSubmit={submitOffice} className="mt-7 grid gap-5">
          <Input
            label="Preferred visit date"
            name="preferredDate"
            type="date"
            required
            min={todayISO()}
            error={errors.preferredDate}
            hint="This is a request. It does not automatically confirm an appointment."
          />
          <FormStatus status={status === 'ready' ? 'idle' : status} message={message} />
          <Button type="submit" size="lg" fullWidth>
            REQUEST THIS DATE
          </Button>
        </form>

        <button
          type="button"
          onClick={() => setStage('acknowledged')}
          className="link-underline-hover mt-6 text-[0.85rem] font-semibold text-black"
        >
          Back to options
        </button>
      </div>
    );
  }

  /* ─────────────── Acknowledged: acknowledgement + next-step choice ─────────────── */
  if (stage === 'acknowledged' && details) {
    return (
      <div className="border border-slate-200 bg-white p-8 sm:p-10">
        <CheckCircleIcon className="h-12 w-12 text-[#12805c]" />
        <p className="eyebrow mt-7 text-[#0d5f44]">— Interest received</p>
        <h3 className="mt-5 text-2xl font-extrabold text-black">Thank you — your interest is with us.</h3>
        <p className="mt-4 text-[0.95rem] leading-relaxed text-slate-700">{ACKNOWLEDGEMENT_MESSAGE}</p>

        {details.isGroup ? (
          <p className="mt-4 flex items-start gap-2.5 text-[0.9rem] leading-relaxed text-slate-700">
            <UsersIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#FF9800]" />
            <span>
              You have flagged this as a <strong className="text-black">group enquiry</strong>. We
              will ask for the entity name and an authorised contact when we follow up.
            </span>
          </p>
        ) : null}

        <div className="mt-8 border-t border-slate-200 pt-7">
          <p className="font-label text-[10px] tracking-[0.26em] text-black">HOW WOULD YOU LIKE TO PROCEED?</p>
          <div className="mt-5 grid gap-4">
            {NEXT_STEPS.map((step) => (
              <button
                key={step.key}
                type="button"
                onClick={() => {
                  setStage(step.key === 'OFFICE_VISIT' ? 'office' : 'apartment');
                  track('next_step_selected', { step: step.key });
                }}
                className="group flex items-start gap-4 border-[1.5px] border-slate-200 p-5 text-left transition-colors duration-400 hover:border-[#FF9800] hover:bg-[#FF9800]/[0.05]"
              >
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center border border-[#FF9800] text-[#FF9800]">
                  {step.key === 'OFFICE_VISIT' ? <CalendarIcon className="h-5 w-5" /> : null}
                  {step.key === 'APARTMENT_BOOKING' ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="square" className="h-5 w-5" aria-hidden="true">
                      <path d="M3 11 12 4l9 7" />
                      <path d="M5 10v10h14V10" />
                    </svg>
                  ) : null}
                </span>
                <span className="flex-1">
                  <span className="block font-heading text-[1rem] font-extrabold text-black">{step.title}</span>
                  <span className="mt-1.5 block text-[0.87rem] leading-relaxed text-slate-600">{step.description}</span>
                  <span className="mt-2 block text-[0.78rem] leading-relaxed text-slate-500">{step.footnote}</span>
                </span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setStage('form')}
            className="link-underline-hover mt-6 text-[0.85rem] font-semibold text-black"
          >
            Edit my details
          </button>
        </div>
      </div>
    );
  }

  /* ─────────────────────────── The interest form ─────────────────────────── */
  return (
    <form onSubmit={submitForm} className="border border-slate-200 bg-white">
      <span className="block h-[3px] w-full bg-[#FF9800]" aria-hidden="true" />
      <div className="p-6 sm:p-9">
        <p className="eyebrow text-black">— Register your interest</p>
        <h3 className="mt-5 text-2xl font-extrabold text-black">
          {inherited
            ? interestType === 'BUSINESS'
              ? 'Business opportunity interest'
              : 'Investment opportunity interest'
            : 'One form, two journeys'}
        </h3>

        {inherited ? (
          <p className="mt-3 text-[0.92rem] leading-relaxed text-slate-600">
            You are enquiring about a{' '}
            <strong className="text-black">
              {interestType === 'BUSINESS' ? 'Business Opportunity' : 'Investment Opportunity'}
            </strong>
            , so this enquiry is already classified that way — there is no need to choose again. We
            only ask for what is needed to start the conversation; detailed qualification happens in
            follow-up.
          </p>
        ) : (
          <p className="mt-3 text-[0.92rem] leading-relaxed text-slate-600">
            Choose whether you are interested in a Business Opportunity or an Investment Opportunity.
            We only ask for what is needed to start the conversation — detailed qualification happens
            in follow-up.
          </p>
        )}

        {/* Interest type — only on a general enquiry with no inherited journey (PRD §3) */}
        {!inherited ? (
          <fieldset className="mt-8">
            <legend className="font-label text-[10px] tracking-[0.26em] text-black">
              INTEREST TYPE <span className="text-[#FF9800]">*</span>
            </legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {(
                [
                  {
                    value: 'BUSINESS' as const,
                    label: 'Business Opportunity',
                    description:
                      'A commercial, operational or joint-venture proposition where the customer and Heavenward Place’s associates facilitate the business together, each with a defined role.',
                  },
                  {
                    value: 'INVESTMENT' as const,
                    label: 'Investment Opportunity',
                    description:
                      'A defined opportunity presented for consideration under a documented structure and agreement, with the roles, terms, risks and time horizon set out before you proceed.',
                  },
                ]
              ).map((option) => {
                const active = interestType === option.value;
                return (
                  <label
                    key={option.value}
                    className={`flex cursor-pointer items-start gap-4 border-[1.5px] p-5 transition-colors duration-400 ${
                      active ? 'border-[#FF9800] bg-[#FF9800]/[0.07]' : 'border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="interestType"
                      value={option.value}
                      checked={active}
                      onChange={() => {
                        setInterestType(option.value);
                        track('interest_type_selected', { type: option.value });
                      }}
                      className="sr-only"
                    />
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-[1.5px] ${
                        active ? 'border-[#FF9800]' : 'border-slate-400'
                      }`}
                      aria-hidden="true"
                    >
                      <span
                        className={`h-2.5 w-2.5 rounded-full bg-[#FF9800] transition-transform duration-300 ${
                          active ? 'scale-100' : 'scale-0'
                        }`}
                      />
                    </span>
                    <span>
                      <span className="block font-heading text-[0.98rem] font-extrabold text-black">
                        {option.label}
                      </span>
                      <span className="mt-1.5 block text-[0.85rem] leading-relaxed text-slate-600">
                        {option.description}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        ) : null}

        {/* Approved fields */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <Input label="Full name" name="fullName" required autoComplete="name" error={errors.fullName} />
          <Input label="Email" name="email" type="email" required autoComplete="email" error={errors.email} />
          <Input
            label="Phone / WhatsApp"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            hint="Include your country code if outside Nigeria."
            error={errors.phone}
          />
          <label className="flex flex-col gap-2">
            <span className="font-label text-[10px] tracking-[0.26em] text-black">
              COUNTRY OF RESIDENCE <span className="text-[#FF9800]">*</span>
            </span>
            <select
              name="countryOfResidence"
              required
              defaultValue=""
              className="w-full rounded-[3px] border border-slate-300 bg-white px-4 py-3 text-[0.95rem] text-black focus:border-[#FF9800] focus:outline-none"
            >
              <option value="" disabled>
                Select…
              </option>
              {COUNTRIES.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
            {errors.countryOfResidence ? (
              <p role="alert" className="text-[0.78rem] font-medium text-[#c02626]">
                {errors.countryOfResidence}
              </p>
            ) : null}
          </label>

          <label className="flex flex-col gap-2">
            <span className="font-label text-[10px] tracking-[0.26em] text-black">
              CAPITAL RANGE <span className="text-[#FF9800]">*</span>
            </span>
            <select
              name="capitalRange"
              required
              defaultValue=""
              className="w-full rounded-[3px] border border-slate-300 bg-white px-4 py-3 text-[0.95rem] text-black focus:border-[#FF9800] focus:outline-none"
            >
              <option value="" disabled>
                Select…
              </option>
              {CAPITAL_RANGES.map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>
            {errors.capitalRange ? (
              <p role="alert" className="text-[0.78rem] font-medium text-[#c02626]">
                {errors.capitalRange}
              </p>
            ) : null}
          </label>

          <label className="flex flex-col gap-2">
            <span className="font-label text-[10px] tracking-[0.26em] text-black">
              GEOGRAPHIC PREFERENCE <span className="text-[#FF9800]">*</span>
            </span>
            <select
              name="geographicPreference"
              required
              defaultValue=""
              className="w-full rounded-[3px] border border-slate-300 bg-white px-4 py-3 text-[0.95rem] text-black focus:border-[#FF9800] focus:outline-none"
            >
              <option value="" disabled>
                Select…
              </option>
              <option value="NIGERIA">Nigeria</option>
              <option value="INTERNATIONAL">International</option>
              <option value="BOTH">Both</option>
            </select>
            {errors.geographicPreference ? (
              <p role="alert" className="text-[0.78rem] font-medium text-[#c02626]">
                {errors.geographicPreference}
              </p>
            ) : null}
          </label>

          <label className="flex flex-col gap-2 sm:col-span-2">
            <span className="font-label text-[10px] tracking-[0.26em] text-black">
              AREA OF INTEREST <span className="text-[#FF9800]">*</span>
            </span>
            <select
              name="areaOfInterest"
              required
              defaultValue={defaultArea ?? ''}
              className="w-full rounded-[3px] border border-slate-300 bg-white px-4 py-3 text-[0.95rem] text-black focus:border-[#FF9800] focus:outline-none"
            >
              <option value="" disabled>
                Select…
              </option>
              {defaultArea && !areas.some((a) => a.value === defaultArea) ? (
                <option value={defaultArea}>{defaultArea.replace(/_/g, ' ')}</option>
              ) : null}
              {areas.map((area) => (
                <option key={area.value} value={area.value}>
                  {area.label}
                </option>
              ))}
            </select>
            {errors.areaOfInterest ? (
              <p role="alert" className="text-[0.78rem] font-medium text-[#c02626]">
                {errors.areaOfInterest}
              </p>
            ) : null}
          </label>

          <Textarea
            label="Optional — a brief description of the opportunity you are seeking"
            name="briefDescription"
            rows={4}
            className="sm:col-span-2"
            maxLength={1000}
            placeholder="For example: a commercial real estate opportunity in a growing corridor, or a joint venture where we can contribute distribution reach."
            hint="A sentence or two is plenty. Detailed documentation follows in conversation."
            error={errors.briefDescription}
          />
        </div>

        {/* Group flag */}
        <div className="mt-7 border border-slate-200 bg-slate-50 p-5">
          <BrandCheckbox
            checked={isGroup}
            onChange={(e) => setIsGroup(e.target.checked)}
            label={
              <>
                I am enquiring on behalf of a group (cooperative, investment club or similar
                organised group).
              </>
            }
            hint="This simply flags the enquiry for review. Your group name, authorised contact and member count are captured later by a Heavenward Place representative during follow-up — not on this form."
          />
        </div>

        {/* What we do NOT ask */}
        <div className="mt-7 border border-slate-200 p-5">
          <p className="font-label text-[9px] tracking-[0.22em] text-slate-500">
            WHAT WE DELIBERATELY DO NOT ASK
          </p>
          <p className="mt-3 text-[0.86rem] leading-relaxed text-slate-600">
            This initial form is deliberately short. We do not collect your experience, objectives,
            risk appetite, investment duration, exit preference or deployment timeline here. Those
            matters are handled properly in a follow-up call or a physical meeting, where there is
            time for a real conversation.
          </p>
        </div>

        <BrandCheckbox
          checked={acknowledged}
          onChange={(e) => setAcknowledged(e.target.checked)}
          className="mt-6"
          label={
            <>
              I have read and understood the Business &amp; Investment Opportunity Disclaimer, and I
              understand that Heavenward Place does not hold, pool, custody or manage my funds
              through this website and that no returns are guaranteed.
            </>
          }
        />

        <div className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="hp-website">Website</label>
          <input type="text" id="hp-website" name="website" tabIndex={-1} autoComplete="off" />
        </div>

        <FormStatus status={status === 'ready' ? 'idle' : status} message={message} />

        <Button type="submit" size="lg" fullWidth>
          SEND MY INTEREST
        </Button>

        <p className="mt-4 flex items-start justify-center gap-2 text-center text-[0.78rem] leading-relaxed text-slate-500">
          <LockIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Nothing you type is stored by this site. You choose where it is sent, and we use it
          only to respond and to prepare a discussion. We do not sell personal data.
        </p>
      </div>
    </form>
  );
}
