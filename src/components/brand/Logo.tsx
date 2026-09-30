import Link from 'next/link';
import { HouseMark } from './HouseMark';
import { SITE } from '@/data/site';

type LogoVariant = 'dark' | 'light';
type LogoStyle = 'primary' | 'stacked' | 'mark';

export interface LogoProps {
  variant?: LogoVariant;
  style?: LogoStyle;
  /** Rendered height in px. Width follows the aspect ratio of the chosen style. */
  height?: number;
  className?: string;
  href?: string | null;
  priority?: boolean;
  showWordmark?: boolean;
}

/**
 * The brand lock-up.
 *
 *  • `primary`  — house mark + HEAVENWARD wordmark + spaced PLACE. Navbar
 *                 (desktop), footer, emails, invoices, documents.
 *  • `stacked`  — HEAVEN / WARD in a black block. Square social graphics,
 *                 ID cards, and the mobile navbar mark.
 *  • `mark`     — house/H icon alone. Favicon, app icon, PWA icon, loading
 *                 states and watermarks.
 *
 * `light` renders the reversed variant: white house, white wordmark, orange H
 * and PLACE, as shown on the deck's black mockups.
 */
export function Logo({
  variant = 'dark',
  style = 'primary',
  height = 40,
  className = '',
  href = '/',
  priority = false,
  showWordmark = true,
}: LogoProps) {
  const light = variant === 'light';
  const wordColor = light ? '#FFFFFF' : '#000000';
  const plateBg = light ? '#FFFFFF' : '#000000';
  const plateText = light ? '#000000' : '#FFFFFF';

  const mark = <HouseMark variant={variant} className="h-full w-auto shrink-0" />;

  const lockup =
    style === 'mark' ? (
      mark
    ) : style === 'stacked' ? (
      <span
        className="flex flex-col items-center justify-center overflow-hidden leading-none"
        style={{ backgroundColor: plateBg, height, width: height * 0.92 }}
      >
        <span
          className="font-display"
          style={{ color: plateText, fontSize: height * 0.3, letterSpacing: '0.02em' }}
        >
          HEAVEN
        </span>
        <span
          className="font-display -mt-[2px]"
          style={{ color: '#FF9800', fontSize: height * 0.3, letterSpacing: '0.02em' }}
        >
          WARD
        </span>
      </span>
    ) : showWordmark ? (
      <span className="flex items-center gap-2.5" style={{ height }}>
        {mark}
        <span className="flex flex-col justify-center leading-none">
          <span
            className="font-display"
            style={{ color: wordColor, fontSize: height * 0.29, letterSpacing: '0.005em' }}
          >
            HEAVENWARD
          </span>
          <span
            className="font-label"
            style={{ color: '#FF9800', fontSize: height * 0.108, letterSpacing: '0.52em' }}
          >
            PLACE
          </span>
        </span>
      </span>
    ) : (
      mark
    );

  const shell = (
    <span
      className={`inline-flex items-center ${className}`}
      style={{ height, lineHeight: 1 }}
      // The lockup is decorative next to the site name in the nav/footer.
      aria-label={href ? undefined : SITE.name}
      data-priority={priority || undefined}
    >
      {lockup}
    </span>
  );

  if (!href) return shell;

  return (
    <Link href={href} className="inline-flex shrink-0 items-center" aria-label={`${SITE.name} — home`}>
      {shell}
    </Link>
  );
}

/** Brand wordmark used on its own, e.g. inside email headers. */
export function BrandWordmark({ variant = 'dark' }: { variant?: LogoVariant }) {
  return (
    <span style={{ color: variant === 'light' ? '#fff' : '#000' }} className="font-display">
      HEAVENWARD
    </span>
  );
}
