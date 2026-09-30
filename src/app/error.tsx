'use client';

import { useEffect } from 'react';
import { Button, Container } from '@/components/ui/primitives';
import { Logo } from '@/components/brand/Logo';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Client-side report. PII is never included.
    console.error('[heavenward] unhandled error', { digest: error.digest, name: error.name });
  }, [error]);

  return (
    <html lang="en-NG">
      <body style={{ margin: 0, fontFamily: 'Roboto, system-ui, sans-serif', background: '#000' }}>
        <Container>
          <div className="flex min-h-screen flex-col items-center justify-center py-20 text-center">
            <Logo variant="light" height={48} href={null} />
            <p className="eyebrow mt-10 text-[#FF9800]">— Something went wrong</p>
            <h1 className="mt-6 max-w-2xl text-balance font-display text-3xl leading-tight text-white sm:text-4xl">
              We could not load that page.
            </h1>
            <p className="mt-6 max-w-lg text-[0.98rem] leading-relaxed text-slate-300">
              This is on us, not on you. Try again — and if it keeps happening, call us on the
              number in the footer and we will sort it out.
            </p>
            {error.digest ? (
              <p className="mt-4 font-mono text-[0.75rem] text-slate-500">Reference: {error.digest}</p>
            ) : null}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button onClick={reset}>TRY AGAIN</Button>
              <Button
                variant="outline"
                className="!border-white/50 !text-white hover:!bg-white hover:!text-black"
                onClick={() => window.location.assign('/')}
              >
                BACK TO HOME
              </Button>
            </div>
          </div>
        </Container>
      </body>
    </html>
  );
}
