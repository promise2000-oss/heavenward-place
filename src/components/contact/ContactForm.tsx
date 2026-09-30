'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/primitives';
import { FormStatus, Input, Textarea } from '@/components/ui/form';
import {
  CarIcon,
  ChefIcon,
  HousekeepingIcon,
  SparkleIcon,
  ToolIcon,
  TruckIcon,
} from '@/components/concierge/concierge-icons';
import { MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from '@/components/ui/icons';
import { SITE } from '@/data/site';
import { track } from '@/lib/analytics';
import { EnquiryHandoff, copyEnquiry, enquiryBody } from '@/components/ui/EnquiryHandoff';

const CATEGORIES = [
  {
    value: 'HOSPITALITY',
    label: 'Hospitality',
    description: 'Accommodation, availability, long stays, pickup or chef services.',
    Icon: ChefIcon,
  },
  {
    value: 'BUSINESS_INVESTMENT',
    label: 'Business & Investment',
    description: 'Selected opportunities, group enquiries, consultations or next steps.',
    Icon: SparkleIcon,
  },
  {
    value: 'GENERAL',
    label: 'General',
    description: 'Partnerships, corporate accounts, press or anything else.',
    Icon: ToolIcon,
  },
] as const;

const DETAILS = [
  { label: 'Response time', value: 'Within one business day', Icon: TruckIcon },
  { label: 'Concierge hours', value: 'Mon – Sat, 8:00 AM – 8:00 PM WAT', Icon: HousekeepingIcon },
  { label: 'Guests in residence', value: 'Emergency line available 24/7', Icon: CarIcon },
];

export function ContactForm({
  initialCategory = 'GENERAL',
}: {
  /** Parsed from the query string by the server component. */
  initialCategory?: 'HOSPITALITY' | 'BUSINESS_INVESTMENT' | 'GENERAL';
}) {

  const [category, setCategory] = useState<string>(initialCategory as string);
  const [status, setStatus] = useState<'idle' | 'invalid' | 'ready'>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [enquiry, setEnquiry] = useState<{ subject: string; body: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  /*
   * Validate locally, then hand the enquiry to the guest.
   *
   * There is no server, so this deliberately does not POST anywhere. Instead the
   * validated values are formatted into a message and offered as a mailto or a
   * WhatsApp link — see EnquiryHandoff for why that beats a fake confirmation.
   */
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});
    setMessage(null);

    const form = new FormData(event.currentTarget);
    const str = (key: string) => String(form.get(key) ?? '').trim();

    const next: Record<string, string> = {};
    const name = str('name');
    const email = str('email');
    const body = str('message');

    if (name.length < 2) next.name = 'Please tell us your name';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) next.email = 'Please enter a valid email address';
    if (body.length < 10) next.message = 'Please add a little more detail';

    if (Object.keys(next).length > 0) {
      setErrors(next);
      setStatus('invalid');
      setMessage('Please check the highlighted fields.');
      return;
    }

    const prepared = enquiryBody({
      category: category.replace(/_/g, ' ').toLowerCase(),
      name,
      email,
      phone: str('phone') || undefined,
      subject: str('subject') || undefined,
      message: body,
    });

    setEnquiry({
      subject: str('subject') || `Website enquiry — ${category.replace(/_/g, ' ').toLowerCase()}`,
      body: prepared,
    });
    setStatus('ready');
    track('enquiry_submitted', { category });
  }

  if (status === 'ready' && enquiry) {
    return (
      <div className="border border-slate-200 bg-white">
        <span className="block h-[3px] w-full bg-[#FF9800]" aria-hidden="true" />
        <div className="p-6 sm:p-9">
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
            Edit my message
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="border border-slate-200 bg-white">
      <span className="block h-[3px] w-full bg-[#FF9800]" aria-hidden="true" />
      <div className="p-6 sm:p-9">
        <p className="eyebrow text-black">— Send a message</p>
        <h2 className="mt-5 text-2xl font-extrabold text-black">How can we help?</h2>
        <p className="mt-3 text-[0.92rem] leading-relaxed text-slate-600">
          Tell us what you need and a representative will respond within one business day.
        </p>

        <fieldset className="mt-8">
          <legend className="font-label text-[10px] tracking-[0.26em] text-black">
            ENQUIRY CATEGORY <span className="text-[#FF9800]">*</span>
          </legend>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {CATEGORIES.map((option) => {
              const active = category === option.value;
              return (
                <label
                  key={option.value}
                  className={`flex cursor-pointer flex-col gap-3 border-[1.5px] p-4 transition-colors duration-400 ${
                    active
                      ? 'border-[#FF9800] bg-[#FF9800]/[0.07]'
                      : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="category"
                    value={option.value}
                    checked={active}
                    onChange={() => setCategory(option.value)}
                    className="sr-only"
                  />
                  <span className="flex items-center gap-2.5">
                    <option.Icon className="h-4.5 w-4.5 text-[#FF9800]" />
                    <span className="font-heading text-[0.88rem] font-extrabold text-black">
                      {option.label}
                    </span>
                  </span>
                  <span className="text-[0.79rem] leading-relaxed text-slate-600">
                    {option.description}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <Input label="Full name" name="name" required autoComplete="name" error={errors.name} />
          <Input
            label="Email"
            name="email"
            type="email"
            required
            autoComplete="email"
            error={errors.email}
          />
          <Input
            label="Phone / WhatsApp (optional)"
            name="phone"
            type="tel"
            autoComplete="tel"
            hint="Include your country code if outside Nigeria."
            error={errors.phone}
          />
          <Input label="Subject (optional)" name="subject" error={errors.subject} />
          <Textarea
            label="Message"
            name="message"
            required
            rows={6}
            className="sm:col-span-2"
            maxLength={4000}
            placeholder="Tell us what you need, where you need to be, and when."
            error={errors.message}
          />
        </div>

        <div className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="hp-website">Website</label>
          <input type="text" id="hp-website" name="website" tabIndex={-1} autoComplete="off" />
        </div>

        <FormStatus status={status === 'ready' ? 'idle' : status} message={message} />

        <Button type="submit" size="lg" className="mt-7" fullWidth>
          SEND MESSAGE
        </Button>

        <p className="mt-4 text-center text-[0.78rem] leading-relaxed text-slate-500">
          Nothing you type is stored by this site. You choose where it is sent, and we use it only
          to reply.
        </p>
      </div>
    </form>
  );
}

export function ContactDetails() {
  return (
    <div>
      <div className="border border-slate-200 p-7">
        <p className="eyebrow text-black">— Reach us directly</p>
        <ul className="mt-6 flex flex-col gap-5">
          <li>
            <a
              href={`tel:${SITE.contact.phoneHref}`}
              className="group flex items-start gap-4"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#FF9800] text-black transition-colors duration-400 group-hover:bg-[#FF9800]">
                <PhoneIcon className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-label text-[8.5px] tracking-[0.22em] text-slate-500">
                  PHONE
                </span>
                <span className="mt-1.5 block font-heading text-[1.02rem] font-bold text-black">
                  {SITE.contact.phone}
                </span>
              </span>
            </a>
          </li>

          <li>
            <a href={`mailto:${SITE.contact.email}`} className="group flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#FF9800] text-black transition-colors duration-400 group-hover:bg-[#FF9800]">
                <MailIcon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block font-label text-[8.5px] tracking-[0.22em] text-slate-500">
                  EMAIL
                </span>
                <span className="mt-1.5 block break-all font-heading text-[0.98rem] font-bold text-black">
                  {SITE.contact.email}
                </span>
              </span>
            </a>
          </li>

          <li>
            <a
              href={`https://wa.me/${SITE.contact.whatsapp}?text=${encodeURIComponent(
                'Hello Heavenward Place, I would like to make an enquiry.',
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-4"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#12805c] text-[#12805c] transition-colors duration-400 group-hover:bg-[#12805c] group-hover:text-white">
                <WhatsAppIcon className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-label text-[8.5px] tracking-[0.22em] text-slate-500">
                  WHATSAPP
                </span>
                <span className="mt-1.5 block font-heading text-[0.98rem] font-bold text-black">
                  Click to chat
                </span>
              </span>
            </a>
          </li>

          <li className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#FF9800] text-black">
              <PinIcon className="h-5 w-5" />
            </span>
            <span>
              <span className="block font-label text-[8.5px] tracking-[0.22em] text-slate-500">
                LOCATION
              </span>
              <span className="mt-1.5 block font-heading text-[0.98rem] font-bold text-black">
                {SITE.contact.address}
              </span>
              <span className="mt-1 block text-[0.82rem] text-slate-500">
                Exact residence addresses are shared with confirmed guests only.
              </span>
            </span>
          </li>
        </ul>
      </div>

      <ul className="mt-6 flex flex-col gap-3">
        {DETAILS.map((detail) => (
          <li key={detail.label} className="flex items-center gap-3.5 border border-slate-200 p-4">
            <detail.Icon className="h-4.5 w-4.5 shrink-0 text-[#FF9800]" />
            <span>
              <span className="block font-label text-[8.5px] tracking-[0.22em] text-slate-500">
                {detail.label.toUpperCase()}
              </span>
              <span className="mt-1 block text-[0.88rem] text-slate-700">{detail.value}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
