import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import { BRAND } from '@/data/site';

/* ═════════════════════════════════════════════════════════════════════════════
   BUTTON
   ═════════════════════════════════════════════════════════════════════════════ */

type Variant = 'primary' | 'dark' | 'outline' | 'ghost' | 'cream' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const VARIANTS: Record<Variant, string> = {
  // Orange fill with black text — the only CTA pairing that meets AA.
  primary:
    'bg-[#FF9800] text-black border border-[#FF9800] hover:bg-[#e08600] hover:border-[#e08600] active:bg-[#c87700]',
  dark: 'bg-black text-white border border-black hover:bg-graphite hover:border-graphite',
  outline: 'bg-transparent text-black border-2 border-black hover:bg-black hover:text-white',
  ghost:
    'bg-transparent text-black border border-transparent hover:bg-black hover:text-white',
  cream: 'bg-cream text-black border border-cream hover:bg-[#ffd08a] hover:border-[#ffd08a]',
  danger: 'bg-[#c02626] text-white border border-[#c02626] hover:bg-[#a01f1f]',
};

const SIZES: Record<Size, string> = {
  sm: 'text-[11px] px-4 py-2.5 tracking-[0.18em]',
  md: 'text-xs px-6 py-3.5 tracking-[0.2em]',
  lg: 'text-[13px] px-8 py-4.5 tracking-[0.22em]',
};

export function buttonClass(variant: Variant = 'primary', size: Size = 'md', extra = '') {
  return [
    'inline-flex items-center justify-center gap-2.5 font-label uppercase',
    'transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]',
    'rounded-[3px] disabled:opacity-45 disabled:pointer-events-none',
    VARIANTS[variant],
    SIZES[size],
    extra,
  ].join(' ');
}

interface ButtonProps extends ComponentProps<'button'> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  children: ReactNode;
}

export function Button({ variant, size, fullWidth, className = '', children, ...rest }: ButtonProps) {
  return (
    <button className={buttonClass(variant, size, `${fullWidth ? 'w-full' : ''} ${className}`)} {...rest}>
      {children}
    </button>
  );
}

interface LinkButtonProps extends ComponentProps<typeof Link> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  children: ReactNode;
}

export function LinkButton({
  variant,
  size,
  fullWidth,
  className = '',
  children,
  ...rest
}: LinkButtonProps) {
  return (
    <Link className={buttonClass(variant, size, `${fullWidth ? 'w-full' : ''} ${className}`)} {...rest}>
      {children}
    </Link>
  );
}

export function ArrowRight({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} width="16" height="16" fill="none" aria-hidden="true">
      <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
    </svg>
  );
}

export function ArrowLeft({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} width="16" height="16" fill="none" aria-hidden="true">
      <path d="M20 12H5M11 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
    </svg>
  );
}

export function ChevronDown({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} width="14" height="14" fill="none" aria-hidden="true">
      <path d="M5 9l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
    </svg>
  );
}

/* ═════════════════════════════════════════════════════════════════════════════
   LAYOUT
   ═════════════════════════════════════════════════════════════════════════════ */

export function Container({ className = '', children }: { className?: string; children: ReactNode }) {
  return <div className={`container-hp ${className}`}>{children}</div>;
}

export function Section({
  children,
  className = '',
  tone = 'white',
  id,
  label,
}: {
  children: ReactNode;
  className?: string;
  tone?: 'white' | 'cream' | 'cream-soft' | 'black' | 'soft';
  id?: string;
  label?: string;
}) {
  const toneClass =
    tone === 'cream'
      ? 'section-cream'
      : tone === 'cream-soft'
        ? 'bg-cream-soft'
        : tone === 'black'
          ? 'section-black'
          : tone === 'soft'
            ? 'bg-slate-50'
            : 'bg-white';
  return (
    <section
      id={id}
      aria-label={label}
      className={`relative py-20 sm:py-24 lg:py-28 ${toneClass} ${className}`}
    >
      {children}
    </section>
  );
}

export function Rule({ className = '' }: { className?: string }) {
  return <span className={`block h-[3px] w-full ${className || 'bg-[#FF9800]'}`} aria-hidden="true" />;
}

/* ═════════════════════════════════════════════════════════════════════════════
   SECTION HEADING
   ═════════════════════════════════════════════════════════════════════════════ */

export function Eyebrow({ children, tone = 'dark' }: { children: ReactNode; tone?: 'dark' | 'light' }) {
  return (
    <span className={`eyebrow ${tone === 'light' ? 'text-[#FF9800]' : 'text-black'}`}>
      <span className={tone === 'light' ? 'text-[#FF9800]' : 'text-black'}>—</span> {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = 'left',
  tone = 'dark',
  maxWidth = 'max-w-3xl',
  className = '',
  action,
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: 'left' | 'center';
  tone?: 'dark' | 'light';
  maxWidth?: string;
  className?: string;
  action?: ReactNode;
}) {
  const headingColor = tone === 'light' ? 'text-white' : 'text-black';
  return (
    <div
      className={`${align === 'center' ? 'mx-auto text-center' : ''} ${maxWidth} ${className} ${
        action ? 'flex flex-col gap-6 md:flex-row md:items-end md:justify-between' : ''
      }`}
    >
      <div className={align === 'center' ? 'flex flex-col items-center' : ''}>
        {eyebrow ? <Eyebrow tone={tone}>{eyebrow}</Eyebrow> : null}
        <h2
          className={`mt-5 text-balance text-3xl font-extrabold sm:text-4xl lg:text-[2.9rem] ${headingColor}`}
        >
          {title}
        </h2>
        {intro ? (
          <p
            className={`mt-5 text-pretty text-[1.02rem] leading-relaxed ${
              tone === 'light' ? 'text-slate-300' : 'text-slate-700'
            }`}
          >
            {intro}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════════════════
   BADGES / PILLS / ALERTS
   ═════════════════════════════════════════════════════════════════════════════ */

type BadgeTone = 'orange' | 'black' | 'cream' | 'outline' | 'success' | 'warning' | 'danger' | 'info' | 'muted';

const BADGE_TONES: Record<BadgeTone, string> = {
  orange: 'bg-[#FF9800] text-black border-[#FF9800]',
  black: 'bg-black text-white border-black',
  cream: 'bg-cream text-black border-cream',
  outline: 'bg-transparent text-black border-black/25',
  success: 'bg-[#12805c] text-white border-[#12805c]',
  warning: 'bg-[#b26a00] text-white border-[#b26a00]',
  danger: 'bg-[#c02626] text-white border-[#c02626]',
  info: 'bg-[#1f5f9e] text-white border-[#1f5f9e]',
  muted: 'bg-slate-100 text-slate-700 border-slate-200',
};

export function Badge({
  children,
  tone = 'muted',
  className = '',
  dot = false,
}: {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
  dot?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 border px-2.5 py-1 font-label text-[9.5px] leading-none tracking-[0.22em] ${
        BADGE_TONES[tone]
      } ${className}`}
    >
      {dot ? <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" /> : null}
      {children}
    </span>
  );
}

export function Alert({
  tone = 'info',
  title,
  children,
  className = '',
}: {
  tone?: 'info' | 'warning' | 'danger' | 'success' | 'legal';
  title?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const map = {
    info: 'border-[#1f5f9e]/30 bg-[#1f5f9e]/[0.06]',
    warning: 'border-[#b26a00]/35 bg-[#b26a00]/[0.07]',
    danger: 'border-[#c02626]/30 bg-[#c02626]/[0.06]',
    success: 'border-[#12805c]/30 bg-[#12805c]/[0.06]',
    legal: 'border-black bg-cream',
  } as const;

  const bar = {
    info: BRAND.orange,
    warning: '#b26a00',
    danger: '#c02626',
    success: '#12805c',
    legal: BRAND.black,
  } as const;

  return (
    <div className={`relative border-l-[3px] pl-5 pr-4 py-4 ${map[tone]} ${className}`}>
      <span
        className="absolute left-0 top-0 h-full w-[3px]"
        style={{ background: bar[tone] }}
        aria-hidden="true"
      />
      {title ? <p className="mb-1.5 font-heading text-sm font-bold text-black">{title}</p> : null}
      <div className="text-[0.9rem] leading-relaxed text-slate-700">{children}</div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════════════════
   STAT / MISC
   ═════════════════════════════════════════════════════════════════════════════ */

export function Stat({
  value,
  label,
  tone = 'dark',
  className = '',
}: {
  value: ReactNode;
  label: string;
  tone?: 'dark' | 'light';
  className?: string;
}) {
  return (
    <div className={className}>
      <div
        className={`font-display text-4xl sm:text-5xl ${tone === 'light' ? 'text-[#FF9800]' : 'text-black'}`}
      >
        {value}
      </div>
      <div
        className={`mt-2 font-label text-[10px] tracking-[0.3em] ${
          tone === 'light' ? 'text-white/70' : 'text-slate-500'
        }`}
      >
        {label}
      </div>
    </div>
  );
}

export function Divider({ className = '' }: { className?: string }) {
  return <hr className={`border-0 border-t border-slate-200 ${className}`} />;
}

export { BRAND };
