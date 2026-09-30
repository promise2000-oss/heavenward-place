export {
  OPPORTUNITY_ICONS,
  SproutIcon,
  BuildingIcon,
  MetalIcon,
  GemIcon,
  HandshakeIcon,
  DistributionIcon,
  CheckIcon,
  ClockIcon,
  DocumentIcon,
  InfoIcon,
  StarIcon,
} from '@/components/ui/icons';

import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement>;

const base = (props: P) => ({
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'square' as const,
  'aria-hidden': true,
  ...props,
});

export function ArrowIcon(props: P) {
  return (
    <svg {...base({ strokeWidth: 1.8, ...props })}>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

export function MapIcon(props: P) {
  return (
    <svg {...base({ strokeWidth: 1.7, ...props })}>
      <path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  );
}

export function LockIcon(props: P) {
  return (
    <svg {...base({ strokeWidth: 1.7, ...props })}>
      <rect x="4" y="10" width="16" height="11" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}
