/**
 * The Heavenward Place house mark.
 *
 * Faithful geometry to the September 2026 brand deck: an angular black house
 * chevron with a chimney, an orange "H" and a black "P" bowl inside, sitting on
 * a black base bracket. Squares, no curves — matching the wordmark.
 *
 * The same path data is written to `/public/brand/*.svg` for favicons, PWA
 * icons, email headers and watermarks.
 */

export const MARK_VIEWBOX = '0 0 120 104';

export interface MarkProps {
  className?: string;
  /** `light` renders the reversed (white) variant for dark backgrounds. */
  variant?: 'dark' | 'light';
  title?: string;
}

export function HouseMark({ className, variant = 'dark', title }: MarkProps) {
  const roof = variant === 'light' ? '#FFFFFF' : '#000000';
  const letter = variant === 'light' ? '#FFFFFF' : '#000000';
  const accent = '#FF9800';

  return (
    <svg
      viewBox={MARK_VIEWBOX}
      className={className}
      role={title ? 'img' : 'presentation'}
      aria-hidden={title ? undefined : true}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {title ? <title>{title}</title> : null}
      {/* Roof chevron */}
      <path d="M60 6 L120 50 L112 60 L60 22 L8 60 L0 50 Z" fill={roof} />
      {/* Chimney */}
      <path d="M34 25 L44 18 L44 2 L34 9 Z" fill={roof} />
      {/* Orange H */}
      <path d="M30 46 H42 V88 H30 Z" fill={accent} />
      <path d="M56 46 H68 V88 H56 Z" fill={accent} />
      <path d="M42 63 H56 V71 H42 Z" fill={accent} />
      {/* Black P */}
      <path d="M78 46 H90 V88 H78 Z" fill={letter} />
      <path d="M90 46 L112 60 L90 74 Z" fill={letter} />
      {/* Base bracket */}
      <path d="M14 88 H106 V100 H97 V94 H23 V100 H14 Z" fill={roof} />
    </svg>
  );
}

export const MARK_SVG_DARK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${MARK_VIEWBOX}" fill="none">
  <path d="M60 6 L120 50 L112 60 L60 22 L8 60 L0 50 Z" fill="#000000"/>
  <path d="M34 25 L44 18 L44 2 L34 9 Z" fill="#000000"/>
  <path d="M30 46 H42 V88 H30 Z" fill="#FF9800"/>
  <path d="M56 46 H68 V88 H56 Z" fill="#FF9800"/>
  <path d="M42 63 H56 V71 H42 Z" fill="#FF9800"/>
  <path d="M78 46 H90 V88 H78 Z" fill="#000000"/>
  <path d="M90 46 L112 60 L90 74 Z" fill="#000000"/>
  <path d="M14 88 H106 V100 H97 V94 H23 V100 H14 Z" fill="#000000"/>
</svg>`;

export const MARK_SVG_LIGHT = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${MARK_VIEWBOX}" fill="none">
  <path d="M60 6 L120 50 L112 60 L60 22 L8 60 L0 50 Z" fill="#FFFFFF"/>
  <path d="M34 25 L44 18 L44 2 L34 9 Z" fill="#FFFFFF"/>
  <path d="M30 46 H42 V88 H30 Z" fill="#FF9800"/>
  <path d="M56 46 H68 V88 H56 Z" fill="#FF9800"/>
  <path d="M42 63 H56 V71 H42 Z" fill="#FF9800"/>
  <path d="M78 46 H90 V88 H78 Z" fill="#FFFFFF"/>
  <path d="M90 46 L112 60 L90 74 Z" fill="#FFFFFF"/>
  <path d="M14 88 H106 V100 H97 V94 H23 V100 H14 Z" fill="#FFFFFF"/>
</svg>`;
