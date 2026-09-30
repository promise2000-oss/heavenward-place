'use client';

import { useState } from 'react';
import { SITE } from '@/data/site';
import { CheckCircleIcon, MailIcon, PhoneIcon } from '@/components/ui/icons';

/**
 * The hand-off.
 *
 * There is no server, so a form has nowhere to post. Rather than pretend
 * otherwise — or silently drop what the guest typed — every form ends here: a
 * one-click handoff that opens the guest's own mail client or messaging app
 * with the details they just entered already written in.
 *
 * The alternatives were worse: a fake "thank you, we'll be in touch" that
 * sends nothing, or a third-party form endpoint that would handle guest data
 * outside our control. Neither delivers an enquiry. This one does, using the
 * guest's own tools, and the data never touches a server we would have to
 * secure.
 */
export function enquiryBody(details: Record<string, string | number | undefined>) {
  const lines = Object.entries(details)
    .filter(([, value]) => value !== undefined && value !== '')
    .map(([key, value]) => {
      const label = key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (c) => c.toUpperCase());
      return `${label}: ${value}`;
    });

  return [
    `Enquiry for ${SITE.name}`,
    '',
    ...lines,
    '',
    'Please confirm availability and the total before I proceed.',
    '',
    'Sent from the Heavenward Place website.',
  ].join('\n');
}

export function mailtoHref(subject: string, body: string) {
  return `mailto:${SITE.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function whatsappHref(body: string) {
  return `https://wa.me/${SITE.contact.whatsapp}?text=${encodeURIComponent(body)}`;
}

/** Primary hand-off actions, reusable at the end of any form. */
export function EnquiryHandoff({
  subject,
  body,
  reference,
  onCopy,
}: {
  subject: string;
  body: string;
  /** Shown once the guest confirms they have sent it. */
  reference?: string;
  onCopy?: () => void;
}) {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="border border-[#12805c]/30 bg-[#12805c]/[0.06] p-6 sm:p-7">
        <CheckCircleIcon className="h-10 w-10 text-[#12805c]" />
        <p className="eyebrow mt-5 text-[#12805c]">— Next step</p>
        <h3 className="mt-3 text-xl font-extrabold text-black">
          Send it, and we will take it from there.
        </h3>
        <p className="mt-3 text-[0.92rem] leading-relaxed text-slate-700">
          {reference ? <>Quote reference <strong className="text-black">{reference}</strong>. </> : null}
          We reply to every enquiry within one business day, usually much sooner. If it is urgent,
          call us and we will pick it up directly.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a
            href={`tel:${SITE.contact.phoneHref}`}
            className="inline-flex items-center justify-center gap-2.5 border border-[#FF9800] bg-[#FF9800] px-7 py-3.5 font-label text-[10.5px] tracking-[0.2em] text-black transition-colors duration-400 hover:bg-transparent hover:text-[#FF9800]"
          >
            <PhoneIcon className="h-4 w-4" />
            CALL {SITE.contact.phone}
          </a>
          <a
            href={mailtoHref(subject, body)}
            className="inline-flex items-center justify-center gap-2.5 border border-black px-7 py-3.5 font-label text-[10.5px] tracking-[0.2em] text-black transition-colors duration-400 hover:bg-black hover:text-white"
          >
            <MailIcon className="h-4 w-4" />
            EMAIL US
          </a>
        </div>

        {onCopy ? (
          <button
            type="button"
            onClick={onCopy}
            className="link-underline-hover mt-5 text-[0.85rem] font-semibold text-black"
          >
            Copy my details instead
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="border border-slate-200 bg-slate-50 p-6 sm:p-7">
      <p className="font-label text-[9px] tracking-[0.24em] text-slate-500">HOW TO SEND THIS</p>
      <h3 className="mt-3 text-lg font-extrabold text-black">Send it straight to us</h3>
      <p className="mt-2.5 text-[0.9rem] leading-relaxed text-slate-600">
        This site has no server, so it does not store what you type. Choose an option below and
        your details are written into the message for you — you stay in control of what is sent, and
        it goes straight from your device to ours.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <a
          href={mailtoHref(subject, body)}
          onClick={() => setSent(true)}
          className="inline-flex items-center justify-center gap-2.5 border border-[#FF9800] bg-[#FF9800] px-7 py-3.5 font-label text-[10.5px] tracking-[0.2em] text-black transition-colors duration-400 hover:bg-transparent hover:text-[#FF9800]"
        >
          <MailIcon className="h-4 w-4" />
          OPEN IN EMAIL
        </a>
        <a
          href={whatsappHref(body)}
          onClick={() => setSent(true)}
          className="inline-flex items-center justify-center gap-2.5 border border-black px-7 py-3.5 font-label text-[10.5px] tracking-[0.2em] text-black transition-colors duration-400 hover:bg-black hover:text-white"
        >
          SEND ON WHATSAPP
        </a>
      </div>

      <p className="mt-5 text-[0.8rem] leading-relaxed text-slate-500">
        Prefer to talk? Call{' '}
        <a href={`tel:${SITE.contact.phoneHref}`} className="link-underline-hover font-semibold text-black">
          {SITE.contact.phone}
        </a>{' '}
        or email{' '}
        <a href={`mailto:${SITE.contact.email}`} className="link-underline-hover font-semibold text-black">
          {SITE.contact.email}
        </a>
        .
      </p>
    </div>
  );
}

/** Copy a prepared enquiry to the clipboard, for guests who prefer to paste it. */
export async function copyEnquiry(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
