'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/primitives';
import { BrandCheckbox, FormStatus, Input, Textarea } from '@/components/ui/form';
import { CheckCircleIcon, LockIcon, UsersIcon } from '@/components/ui/icons';
import { CAPITAL_RANGES, COUNTRIES } from '@/data/types';
import { track } from '@/lib/analytics';
import { EnquiryHandoff, copyEnquiry, enquiryBody } from '@/components/ui/EnquiryHandoff';

const AREAS = [
  { value: 'AGRO_REAL_ESTATE', label: 'Agro Real Estate' },
  { value: 'RENTAL_INCOME_PROPERTY', label: 'Rental Income Property' },
  { value: 'PRECIOUS_METALS', label: 'Precious Metals' },
  { value: 'PRECIOUS_STONES', label: 'Precious Stones' },
  { value: 'JOINT_VENTURE', label: 'Joint Venture' },
  { value: 'DISTRIBUTION_INCOME', label: 'Distribution Income' },
  { value: 'GENERAL', label: 'Not sure yet / general' },
];

/**
 * Initial interest form.
 *
 * APPROVED FIELDS ONLY. The schema on the server is `.strict()`, so experience,
 * objectives, risk appetite, investment duration, exit preference and
 * deployment timeline are rejected outright if submitted. Those matters are
 * handled during follow-up calls or physical meetings.
 *
 * Group enquiries are flagged here; the group name and authorised contact are
 * captured later by an admin during follow-up.
 */
export function InterestForm({
  disclaimerVersion,
  defaultInterestType,
  defaultArea,
}: {
  disclaimerVersion: number;
  defaultInterestType?: 'BUSINESS' | 'INVESTMENT';
  defaultArea?: string;
}) {
  const [interestType, setInterestType] = useState<'BUSINESS' | 'INVESTMENT'>(
    defaultInterestType ?? 'INVESTMENT',
  );
  const [isGroup, setIsGroup] = useState(false);
  const [status, setStatus] = useState<'idle' | 'invalid' | 'ready'>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [enquiry, setEnquiry] = useState<{ subject: string; body: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [acknowledged, setAcknowledged] = useState(true);

  /*
   * Validate locally, then prepare the enquiry for the guest to send.
   *
   * APPROVED FIELDS ONLY — nothing here asks for experience, objectives, risk
   * appetite, investment duration, exit preference or deployment timeline. Those
   * belong in a conversation, not a web form, and this form never collected
   * them even when there was a server.
   *
   * The disclaimer acknowledgement is still required before this will run, and
   * is restated in the message itself.
   */
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setErrors({});

    if (!acknowledged) {
      setStatus('invalid');
      setMessage('Please acknowledge the notice before sending your interest.');
      return;
    }

    const form = new FormData(event.currentTarget);
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

    if (Object.keys(next).length > 0) {
      setErrors(next);
      setStatus('invalid');
      setMessage('Please check the highlighted fields.');
      return;
    }

    const prepared = enquiryBody({
      interest: interestType === 'BUSINESS' ? 'Business opportunity' : 'Investment opportunity',
      area: area.replace(/_/g, ' ').toLowerCase(),
      'Capital range': capital,
      'Geographic preference': geography.replace(/_/g, ' ').toLowerCase(),
      'Group enquiry': isGroup ? 'Yes' : 'No',
      name: fullName,
      email,
      phone,
      'Country of residence': country,
      brief: brief || undefined,
    });

    setEnquiry({
      subject: `Interest registration — ${area.replace(/_/g, ' ').toLowerCase()}`,
      body:
        `I have read and acknowledge the opportunity notice (version ${disclaimerVersion}).\n` +
        `No returns are guaranteed and I understand Heavenward Place does not take custody of funds.\n\n` +
        prepared,
    });
    setStatus('ready');
    track('interest_submitted', { type: interestType, group: isGroup });
  }

  if (status === 'ready' && enquiry) {
    return (
      <div className="border border-slate-200 bg-white p-8 sm:p-10">
        <CheckCircleIcon className="h-12 w-12 text-[#12805c]" />
        <p className="eyebrow mt-7 text-[#0d5f44]">— Interest registered</p>
        <h3 className="mt-5 text-2xl font-extrabold text-black">
          Send it, and we will review it personally.
        </h3>
        <p className="mt-4 text-[0.95rem] leading-relaxed text-slate-700">
          A representative will read your stated interest, capital range, geographic preference and
          area of interest, then get back to you to arrange a discussion.
          {isGroup ? ' We will ask for the group name and an authorised contact during that call.' : ''}
        </p>

        {isGroup ? (
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
            setStatus('idle');
            setEnquiry(null);
          }}
          className="link-underline-hover mt-6 text-[0.85rem] font-semibold text-black"
        >
          Edit my details
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="border border-slate-200 bg-white">
      <span className="block h-[3px] w-full bg-[#FF9800]" aria-hidden="true" />
      <div className="p-6 sm:p-9">
        <p className="eyebrow text-black">— Register your interest</p>
        <h3 className="mt-5 text-2xl font-extrabold text-black">
          One form, two journeys
        </h3>
        <p className="mt-3 text-[0.92rem] leading-relaxed text-slate-600">
          Choose whether you are interested in a Business Opportunity or an Investment Opportunity.
          We only ask for what is needed to start the conversation — detailed qualification happens
          in follow-up.
        </p>

        {/* Interest type */}
        <fieldset className="mt-8">
          <legend className="font-label text-[10px] tracking-[0.26em] text-black">
            INTEREST TYPE <span className="text-[#FF9800]">*</span>
          </legend>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {(
              [
                {
                  value: 'BUSINESS',
                  label: 'Business Opportunity',
                  description: 'A commercial, operational or joint-venture proposition where you contribute capital, resources or reach.',
                },
                {
                  value: 'INVESTMENT',
                  label: 'Investment Opportunity',
                  description: 'A defined opportunity presented for consideration under a documented structure and agreement.',
                },
              ] as const
            ).map((option) => {
              const active = interestType === option.value;
              return (
                <label
                  key={option.value}
                  className={`flex cursor-pointer items-start gap-4 border-[1.5px] p-5 transition-colors duration-400 ${
                    active
                      ? 'border-[#FF9800] bg-[#FF9800]/[0.07]'
                      : 'border-slate-200 hover:border-slate-400'
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

        {/* Approved fields */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <Input
            label="Full name"
            name="fullName"
            required
            autoComplete="name"
            error={errors.fullName}
          />
          <Input
            label="Email"
            name="email"
            type="email"
            required
            autoComplete="email"
            error={errors.email}
          />
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
              {AREAS.map((area) => (
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
          error={errors.acknowledgedDisclaimer}
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
