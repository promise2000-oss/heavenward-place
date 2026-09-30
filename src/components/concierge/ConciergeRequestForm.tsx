'use client';

import { useState } from 'react';
import { Alert, Button } from '@/components/ui/primitives';
import { Input, Textarea } from '@/components/ui/form';
import { CarIcon, ChefIcon, HousekeepingIcon, SparkleIcon, ToolIcon, TruckIcon } from './concierge-icons';
import { track } from '@/lib/analytics';
import { EnquiryHandoff, copyEnquiry, enquiryBody } from '@/components/ui/EnquiryHandoff';

export const CONCIERGE_OPTIONS = [
  {
    key: 'PICKUP',
    label: 'Airport / preferred-location pickup',
    description: 'A trusted driver from Murtala Muhammed International Airport or your preferred pickup point.',
    Icon: CarIcon,
  },
  {
    key: 'PRIVATE_CHEF',
    label: 'Private chef',
    description: 'Breakfast, lunch or dinner prepared in your residence by our private chef.',
    Icon: ChefIcon,
  },
  {
    key: 'HOUSEKEEPING',
    label: 'Extra housekeeping',
    description: 'Additional servicing, linen changes or restocking, scheduled around your working rhythm.',
    Icon: HousekeepingIcon,
  },
  {
    key: 'MAINTENANCE',
    label: 'Technical support',
    description: 'Power, plumbing, cooling or appliance support from our on-call maintenance team.',
    Icon: ToolIcon,
  },
  {
    key: 'TRANSPORT',
    label: 'Chauffeur / transport',
    description: 'Hourly or daily chauffeur hire for meetings, site visits and airport runs.',
    Icon: TruckIcon,
  },
  {
    key: 'OTHER',
    label: 'Something else',
    description: 'Grocery runs, pharmacy pickups, document couriers, gym access and more.',
    Icon: SparkleIcon,
  },
] as const;

/**
 * Concierge request form.
 *
 * Selects a service and hands the request to the guest to send. With no server
 * there is nothing to queue it in, so the form says plainly that it is a
 * request and not a booking, and offers WhatsApp as the fastest route for guests
 * already in residence who need something urgently.
 */
export function ConciergeRequestForm({ compact = false }: { compact?: boolean }) {
  const [type, setType] = useState<string>('PICKUP');
  const [mealSlot, setMealSlot] = useState<string>('');
  const [preferredTime, setPreferredTime] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<'idle' | 'ready'>('idle');
  const [enquiry, setEnquiry] = useState<{ subject: string; body: string } | null>(null);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const option = CONCIERGE_OPTIONS.find((o) => o.key === type);

    setEnquiry({
      subject: `Concierge request — ${option?.label ?? type}`,
      body: enquiryBody({
        service: option?.label ?? type,
        'Meal slot': mealSlot || undefined,
        'Preferred time': preferredTime || undefined,
        notes: notes || undefined,
      }),
    });
    setStatus('ready');
    track('concierge_requested', { type });
  }

  if (status === 'ready' && enquiry) {
    return (
      <div className="border border-slate-200 bg-white">
        <span className="block h-[3px] w-full bg-[#FF9800]" aria-hidden="true" />
        <div className="p-6 sm:p-8">
          <EnquiryHandoff
            subject={enquiry.subject}
            body={enquiry.body}
            onCopy={() => copyEnquiry(enquiry.body)}
          />
          <button
            type="button"
            onClick={() => {
              setStatus('idle');
              setEnquiry(null);
            }}
            className="link-underline-hover mt-6 text-[0.85rem] font-semibold text-black"
          >
            Change my request
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="border border-slate-200 bg-white">
      <span className="block h-[3px] w-full bg-[#FF9800]" aria-hidden="true" />
      <div className={compact ? 'p-6' : 'p-6 sm:p-8'}>
        <p className="eyebrow text-black">— Concierge</p>
        <h2 className="mt-5 text-xl font-extrabold text-black">
          What can we arrange?
        </h2>
        <p className="mt-3 text-[0.9rem] leading-relaxed text-slate-600">
          Tell us what you need. Our concierge team confirms every request personally — nothing
          is arranged, and nothing is charged, until we have replied.
        </p>

        <Alert tone="info" title="Long-stay benefits" className="mt-6">
          On stays of 7 nights or more, airport pickup and 3 private-chef meals per week (maximum
          1 per day) are complimentary. Anything beyond that allowance is charged at the published
          rate, and we will tell you before anything is charged.
        </Alert>

        <fieldset className="mt-6">
          <legend className="font-label text-[10px] tracking-[0.26em] text-black">
            SERVICE REQUESTED
          </legend>
          <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
            {CONCIERGE_OPTIONS.map((option) => {
              const active = type === option.key;
              return (
                <label
                  key={option.key}
                  className={`flex cursor-pointer items-start gap-3 border p-4 transition-colors duration-300 ${
                    active
                      ? 'border-[#FF9800] bg-[#FF9800]/[0.07]'
                      : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="concierge-type"
                    value={option.key}
                    checked={active}
                    onChange={() => setType(option.key)}
                    className="sr-only"
                  />
                  <span
                    className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-[1.5px] ${
                      active ? 'border-[#FF9800]' : 'border-slate-400'
                    }`}
                    aria-hidden="true"
                  >
                    <span
                      className={`h-2 w-2 rounded-full bg-[#FF9800] transition-transform duration-200 ${
                        active ? 'scale-100' : 'scale-0'
                      }`}
                    />
                  </span>
                  <span>
                    <span className="flex items-center gap-2 font-heading text-[0.9rem] font-bold text-black">
                      <option.Icon className="h-4 w-4 text-[#FF9800]" />
                      {option.label}
                    </span>
                    <span className="mt-1 block text-[0.8rem] leading-relaxed text-slate-600">
                      {option.description}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        {type === 'PRIVATE_CHEF' ? (
          <fieldset className="mt-6">
            <legend className="font-label text-[10px] tracking-[0.26em] text-black">
              MEAL PREFERENCE
            </legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {['BREAKFAST', 'LUNCH', 'DINNER'].map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setMealSlot(mealSlot === slot ? '' : slot)}
                  aria-pressed={mealSlot === slot}
                  className={`border px-4 py-2.5 font-label text-[9.5px] tracking-[0.2em] transition-colors duration-300 ${
                    mealSlot === slot
                      ? 'border-[#FF9800] bg-[#FF9800] font-semibold text-black'
                      : 'border-slate-300 text-slate-600 hover:border-black'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
            <p className="mt-2.5 text-[0.8rem] text-slate-500">
              On 7+ night stays, three meals per week are complimentary with a maximum of one per
              day. Additional meals are charged at the published rate.
            </p>
          </fieldset>
        ) : null}

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Input
            label="Preferred date & time"
            value={preferredTime}
            onChange={(e) => setPreferredTime(e.target.value)}
            placeholder="e.g. 28th, 6:30 PM"
          />
          <Input
            label="Flight number (for pickup)"
            placeholder="e.g. AIB 1452"
            hint="Only used to arrange pickup."
          />
        </div>

        <div className="mt-4">
          <Textarea
            label="Notes for our team"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Number of passengers, dietary requirements, luggage, preferred meeting point…"
          />
        </div>

        <Button type="submit" className="mt-6" fullWidth>
          PREPARE MY REQUEST
        </Button>

        <p className="mt-4 text-center text-[0.78rem] leading-relaxed text-slate-500">
          This prepares a message for you to send. It does not book anything on its own.
        </p>
      </div>
    </form>
  );
}
