'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { Modal } from '@/components/ui/overlay';
import { BrandCheckbox, FormStatus } from '@/components/ui/form';
import { Alert, Button } from '@/components/ui/primitives';
import { track } from '@/lib/analytics';

export interface DisclaimerPayload {
  id: string;
  title: string;
  body: string;
  version: number;
  pendingLegalReview: boolean;
  /** Bullet points rendered under the body. */
  points?: string[];
}

const ACK_KEY = 'hp_disclaimer_ack';

/**
 * Mandatory entry disclaimer.
 *
 * Appears EVERY time a visitor enters the Business & Investment section, before
 * any opportunity detail is revealed or any interest can be submitted. The
 * acknowledgement (timestamp, user/session) is logged server-side.
 *
 * The wording lives in `src/data/opportunities.ts` and is versioned, so
 * changing it re-prompts everyone who accepted the previous version. It
 * is currently pending review by qualified Nigerian legal / compliance
 * counsel.
 */
export function DisclaimerGate({
  disclaimer,
  children,
  storageKey = 'opportunities',
}: {
  disclaimer: DisclaimerPayload;
  children: ReactNode;
  storageKey?: string;
}) {
  const [open, setOpen] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scopeKey = `${ACK_KEY}:${storageKey}`;

  /*
   * The acknowledgement is stored in localStorage, keyed by the disclaimer
   * version — so editing the wording re-prompts everyone who had already
   * accepted the old version, which is the behaviour we want.
   *
   * Previously this also POSTed to a server that logged a timestamped
   * acknowledgement. With no backend there is no server-side record, so the
   * panel says plainly that nothing is logged rather than implying a
   * compliance trail that does not exist.
   */
  useEffect(() => {
    const stored = window.localStorage.getItem(`${scopeKey}:${disclaimer.version}`);
    setAcknowledged(stored === 'true');
    setOpen(stored !== 'true');
  }, [scopeKey, disclaimer.version]);

  /* Re-open on any in-session navigation back into the section. */
  useEffect(() => {
    if (acknowledged) setOpen(false);
  }, [acknowledged]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      // Escape deliberately does not dismiss it: this gate is mandatory.
      if (event.key === 'Escape') event.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    track('opportunities_viewed', { gate: 'opened' });
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  function acknowledge() {
    try {
      window.localStorage.setItem(`${scopeKey}:${disclaimer.version}`, 'true');
    } catch {
      // Private browsing or a full quota. Fall back to a session-only
      // acknowledgement so the guest is never trapped behind the gate.
      setError(
        'Your browser is blocking local storage, so this acknowledgement will not be remembered. You can still continue.',
      );
    }
    track('disclaimer_acknowledged', { version: disclaimer.version });
    setAcknowledged(true);
    setOpen(false);
  }

  return (
    <>
      {/* Content is withheld until the disclaimer has been acknowledged. */}
      <div
        aria-hidden={!acknowledged}
        className={acknowledged ? '' : 'pointer-events-none select-none opacity-0'}
      >
        {children}
      </div>

      <Modal
        open={open}
        onClose={() => undefined}
        dismissible={false}
        size="lg"
        title={disclaimer.title}
        eyebrow="Important notice"
        footer={
          <div className="flex flex-col gap-4">
            <BrandCheckbox
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
              label={
                <>
                  I have read and understood this notice, and I understand that no returns are
                  guaranteed and that I should conduct my own due diligence before committing any
                  funds.
                </>
              }
            />
            <FormStatus status={error ? 'error' : 'idle'} message={error} />
            <Button onClick={acknowledge} disabled={!acknowledged} size="lg" fullWidth>
              I UNDERSTAND — CONTINUE
            </Button>
            <p className="text-center text-[0.78rem] leading-relaxed text-slate-500">
              This acknowledgement is stored in your own browser so you are not asked again on this
              device. We do not receive it, and no record of it is kept anywhere.
            </p>
          </div>
        }
      >
        <div className="flex flex-col gap-6">
          <div className="border-l-[3px] border-black bg-cream p-6">
            <p className="text-[1rem] leading-relaxed text-slate-800">{disclaimer.body}</p>
          </div>

          <div>
            <p className="font-label text-[9.5px] tracking-[0.24em] text-black">IN SUMMARY</p>
            <ul className="mt-4 flex flex-col gap-3">
              {[
                'Heavenward Place does not take custody of, hold, pool or manage customer investment funds through this website.',
                'This section introduces selected opportunities and facilitates discussion. It is not a public marketplace, investment portal, offer or solicitation.',
                'No returns are guaranteed, and no outcome should be assumed from any information published here.',
                'Detailed documentation, terms and agreements are provided through a controlled follow-up process, not as public downloads.',
                'Capital is at risk. Conduct your own due diligence and obtain independent professional advice before committing funds.',
              ].map((item) => (
                <li key={item} className="flex gap-3 text-[0.9rem] leading-relaxed text-slate-700">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-[#FF9800]" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {disclaimer.pendingLegalReview ? (
            <Alert tone="legal" title="Pending legal review">
              This wording is placeholder text prepared by Heavenward Place. Final wording is subject
              to review and approval by qualified Nigerian legal and compliance counsel before launch,
              including in relation to applicable SEC and financial-services requirements. The
              wording in this notice can be updated by our team at any time and you will be asked to
              acknowledge the current version.
            </Alert>
          ) : null}

          <p className="text-[0.82rem] text-slate-500">
            Full statement:{' '}
            <a href="/legal/opportunity-disclaimer" className="font-semibold text-black underline">
              Business &amp; Investment Opportunity Disclaimer
            </a>
            .
          </p>
        </div>
      </Modal>
    </>
  );
}
