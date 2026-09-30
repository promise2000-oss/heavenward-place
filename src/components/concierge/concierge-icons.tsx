import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement>;

const base = (props: P) => ({
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'square' as const,
  'aria-hidden': true,
  ...props,
});

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

export function ChefIcon(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M7 20h10" />
      <path d="M6.5 17h11v3h-11z" />
      <path d="M18 15.5a3.5 3.5 0 0 0 0-7 4.5 4.5 0 0 0-8.4-1.6A4 4 0 0 0 6 10.5a3.5 3.5 0 0 0 0 5" />
    </svg>
  );
}

export function HousekeepingIcon(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M14 3 5 13h5l-1 8 9-10h-5l1-8Z" />
    </svg>
  );
}

export function ToolIcon(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M14.5 3.5a4.5 4.5 0 0 0-5.8 5.8L3 15v3h3l5.7-5.7a4.5 4.5 0 0 0 5.8-5.8L15 8.5 13.5 7 15 5.5l-0.5-2Z" />
    </svg>
  );
}

export function TruckIcon(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M2 6h12v10H2z" />
      <path d="M14 9h4l3 3.5V16h-7" />
      <circle cx="6" cy="18.5" r="1.8" />
      <circle cx="17" cy="18.5" r="1.8" />
    </svg>
  );
}

export function SparkleIcon(props: P) {
  return (
    <svg {...base(props)}>
      <path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Z" />
    </svg>
  );
}
