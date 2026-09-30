import type { SVGProps } from 'react';
import type { OpportunityIconKey } from '@/data/types';

type P = SVGProps<SVGSVGElement>;

const base = (props: P) => ({
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'square' as const,
  strokeLinejoin: 'miter' as const,
  'aria-hidden': true,
  ...props,
});

/* ── Opportunity category icons ────────────────────────────────────────────── */

export function SproutIcon(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M12 21V11" />
      <path d="M12 11c0-3.3 2.7-6 6-6 0 3.3-2.7 6-6 6Z" />
      <path d="M12 13c0-2.8-2.2-5-5-5 0 2.8 2.2 5 5 5Z" />
      <path d="M7 21h10" />
    </svg>
  );
}

export function BuildingIcon(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M3 21h18" />
      <path d="M5 21V4h9v17" />
      <path d="M14 10h5v11" />
      <path d="M8 8h2M8 12h2M8 16h2M16 14h1M16 18h1" />
    </svg>
  );
}

export function MetalIcon(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M4 9h16" />
      <path d="M6 9v6c0 1.7 1.3 3 3 3h6c1.7 0 3-1.3 3-3V9" />
      <path d="M9 9c0-2.8 1.3-5 3-5s3 2.2 3 5" />
      <path d="M4 9l2-4h12l2 4" />
    </svg>
  );
}

export function GemIcon(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M7 3h10l4 6-9 12L3 9l4-6Z" />
      <path d="M3 9h18" />
      <path d="M9 3 7 9l5 12 5-12-2-6" />
    </svg>
  );
}

export function HandshakeIcon(props: P) {
  return (
    <svg {...base(props)}>
      <path d="m11 6 2.5 2.5a1.5 1.5 0 0 0 2.1 0L18 6" />
      <path d="M6 6 2 10l4 4" />
      <path d="M18 6l4 4-4 4" />
      <path d="m2 10 4 4 4-4" />
      <path d="m22 10-4 4-4-4" />
      <path d="M9 13.5 11 15.5a1.4 1.4 0 0 0 2 0l1-1" />
    </svg>
  );
}

export function DistributionIcon(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M12 3v6" />
      <path d="M12 9 5 13" />
      <path d="M12 9l7 4" />
      <rect x="2" y="13" width="6" height="6" />
      <rect x="9" y="15" width="6" height="6" />
      <rect x="16" y="13" width="6" height="6" />
    </svg>
  );
}

export const OPPORTUNITY_ICONS: Record<OpportunityIconKey, (props: P) => React.JSX.Element> = {
  sprout: SproutIcon,
  building: BuildingIcon,
  metal: MetalIcon,
  gem: GemIcon,
  handshake: HandshakeIcon,
  distribution: DistributionIcon,
};

/* ── UI icons ──────────────────────────────────────────────────────────────── */

export function BedIcon(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M2 18v-8" />
      <path d="M2 12h20v6" />
      <path d="M6 12V8h6a3 3 0 0 1 3 3v1" />
      <path d="M2 18v2M22 18v2" />
    </svg>
  );
}

export function BathIcon(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M3 11h18v3a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5v-3Z" />
      <path d="M6 11V5a2 2 0 0 1 4 0" />
      <path d="M2 21h20" />
    </svg>
  );
}

export function UsersIcon(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
      <path d="M2 20v-1.5A5.5 5.5 0 0 1 7.5 13h3a5.5 5.5 0 0 1 5.5 5.5V20" />
      <path d="M17 5.2A3.5 3.5 0 0 1 17 12" />
      <path d="M18 13.2A5.5 5.5 0 0 1 22 18.6V20" />
    </svg>
  );
}

export function RulerIcon(props: P) {
  return (
    <svg {...base(props)}>
      <path d="m3 15 6-6 6 6 6-6" />
      <path d="M3 20h18" />
    </svg>
  );
}

export function WifiIcon(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M2 8.5a16 16 0 0 1 20 0" />
      <path d="M5 12a11.5 11.5 0 0 1 14 0" />
      <path d="M8.5 15.5a6.5 6.5 0 0 1 7 0" />
      <path d="M12 19h.01" />
    </svg>
  );
}

export function ShieldIcon(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M12 2.5 20 6v6c0 5-3.4 8.6-8 9.5-4.6-.9-8-4.5-8-9.5V6l8-3.5Z" />
      <path d="m8.5 12 2.5 2.5L15.5 9" />
    </svg>
  );
}

export function SparkleIcon(props: P) {
  return (
    <svg {...base(props)}>
      <path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Z" />
      <path d="M19 16.5 19.8 19 22 19.8 19.8 20.5 19 23l-.8-2.5L16 19.8 18.2 19 19 16.5Z" />
    </svg>
  );
}

export function StarIcon(props: P) {
  return (
    <svg {...base({ fill: 'currentColor', stroke: 'none', ...props })}>
      <path d="m12 3 2.6 5.6 6.1.8-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L3.3 9.4l6.1-.8L12 3Z" />
    </svg>
  );
}

export function CalendarIcon(props: P) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="5" width="18" height="16" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}

export function CheckIcon(props: P) {
  return (
    <svg {...base(props)}>
      <path d="m4 12.5 5 5L20 6.5" />
    </svg>
  );
}

export function CheckCircleIcon(props: P) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 3 3 5-6" />
    </svg>
  );
}

export function MenuIcon(props: P) {
  return (
    <svg {...base({ strokeWidth: 2, ...props })}>
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  );
}

export function CloseIcon(props: P) {
  return (
    <svg {...base({ strokeWidth: 2, ...props })}>
      <path d="M5 5l14 14M19 5L5 19" />
    </svg>
  );
}

export function PhoneIcon(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M21 16.5v3a2 2 0 0 1-2.2 2 19.5 19.5 0 0 1-8.5-3 19.2 19.2 0 0 1-6-6 19.5 19.5 0 0 1-3-8.6A2 2 0 0 1 3.3 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L7.4 9.8a16 16 0 0 0 6 6l1.2-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.5 1.6Z" />
    </svg>
  );
}

export function MailIcon(props: P) {
  return (
    <svg {...base(props)}>
      <rect x="2" y="5" width="20" height="14" />
      <path d="m2 6 10 7L22 6" />
    </svg>
  );
}

export function WhatsAppIcon(props: P) {
  return (
    <svg {...base({ fill: 'currentColor', stroke: 'none', ...props })}>
      <path d="M12.04 2C6.6 2 2.2 6.4 2.2 11.84c0 1.74.46 3.44 1.32 4.94L2 22l5.36-1.4a9.8 9.8 0 0 0 4.68 1.2h.01c5.43 0 9.84-4.4 9.84-9.84C21.89 6.4 17.48 2 12.04 2Zm5.76 14.06c-.24.68-1.42 1.32-1.96 1.36-.54.04-1.02.24-3.44-.72-2.9-1.14-4.7-4.08-4.84-4.28-.14-.2-1.16-1.54-1.16-2.94 0-1.4.72-2.08.98-2.36.26-.28.56-.36.74-.36.18 0 .36 0 .52.01.18.01.4-.07.63.48.24.56.8 1.94.88 2.08.06.14.12.3.02.48-.1.18-.16.3-.3.46-.14.16-.3.36-.42.48-.14.14-.28.28-.12.54.16.26.72 1.18 1.54 1.92 1.06.94 1.94 1.24 2.2 1.38.26.14.42.12.58-.06.16-.18.66-.78.84-1.04.18-.26.36-.22.6-.14.24.08 1.56.74 1.82.88.26.14.44.2.5.32.06.12.06.7-.18 1.38Z" />
    </svg>
  );
}

export function PinIcon(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  );
}

export function ClockIcon(props: P) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.5l3.5 2" />
    </svg>
  );
}

export function PlaneIcon(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M10.5 13.5 3 11l1.5-1.5 7 .5 5-5.5c1.2-1.2 3-1.2 4.2 0s1.2 3 0 4.2l-5.5 5 .5 7L14 22l-2.5-7.5" />
    </svg>
  );
}

export function ChefIcon(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M7 20h10" />
      <path d="M6.5 17h11v3h-11z" />
      <path d="M18 15.5a3.5 3.5 0 0 0 0-7 4.5 4.5 0 0 0-8.4-1.6A4 4 0 0 0 6 10.5a3.5 3.5 0 0 0 0 5" />
    </svg>
  );
}

export function CarIcon(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M3 16v-3.2L4.8 8h14.4L21 12.8V16" />
      <path d="M3 13h18" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  );
}

export function KeyIcon(props: P) {
  return (
    <svg {...base(props)}>
      <circle cx="8" cy="12" r="4.5" />
      <path d="M12.5 12H21l-2 2.5M17 12v3" />
    </svg>
  );
}

export function LockIcon(props: P) {
  return (
    <svg {...base(props)}>
      <rect x="4" y="10" width="16" height="11" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export function DocumentIcon(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M14 2H6v20h12V6l-4-4Z" />
      <path d="M14 2v4h4" />
      <path d="M9 12h6M9 16h6" />
    </svg>
  );
}

export function ChartIcon(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M3 21h18" />
      <path d="M6 21V11M11 21V5M16 21v-7M21 21V8" />
    </svg>
  );
}

export function AlertIcon(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M12 3 22 20H2L12 3Z" />
      <path d="M12 10v4.5M12 17.2h.01" />
    </svg>
  );
}

export function InfoIcon(props: P) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </svg>
  );
}

export function ExternalIcon(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M14 4h6v6" />
      <path d="M20 4 10 14" />
      <path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </svg>
  );
}

export function SearchIcon(props: P) {
  return (
    <svg {...base(props)}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

export function FilterIcon(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M3 5h18l-7 8v6l-4 2v-8L3 5Z" />
    </svg>
  );
}

export function ChevronLeft(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M15 5l-7 7 7 7" />
    </svg>
  );
}

export function ChevronRight(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M9 5l7 7-7 7" />
    </svg>
  );
}
