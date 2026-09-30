import { ImageResponse } from 'next/og';

export const alt = 'Heavenward Place — Stay. Experience. Explore Opportunities.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * Open Graph card. White house + white wordmark + orange H and PLACE on black,
 * matching the brand deck's signage / hoodie / polo treatment.
 */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#000000',
          padding: '72px 80px',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 12,
            background: '#FF9800',
            display: 'flex',
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <svg viewBox="0 0 120 104" width={120} height={104} fill="none">
            <path d="M60 6 L120 50 L112 60 L60 22 L8 60 L0 50 Z" fill="#FFF" />
            <path d="M34 25 L44 18 L44 2 L34 9 Z" fill="#FFF" />
            <path d="M30 46 H42 V88 H30 Z" fill="#FF9800" />
            <path d="M56 46 H68 V88 H56 Z" fill="#FF9800" />
            <path d="M42 63 H56 V71 H42 Z" fill="#FF9800" />
            <path d="M78 46 H90 V88 H78 Z" fill="#FFF" />
            <path d="M90 46 L112 60 L90 74 Z" fill="#FFF" />
            <path d="M14 88 H106 V100 H97 V94 H23 V100 H14 Z" fill="#FFF" />
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                color: '#FFFFFF',
                fontSize: 58,
                fontWeight: 900,
                letterSpacing: 1,
                lineHeight: 1,
                fontFamily: 'Impact, Arial Black, sans-serif',
              }}
            >
              HEAVENWARD
            </span>
            <span
              style={{
                color: '#FF9800',
                fontSize: 22,
                letterSpacing: 14,
                marginTop: 8,
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              PLACE
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <span
            style={{
              color: '#FFFFFF',
              fontSize: 68,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -1,
            }}
          >
            Stay. Experience.
            <br />
            Explore Opportunities.
          </span>
          <span style={{ color: '#C9C9C9', fontSize: 26, lineHeight: 1.4 }}>
            Premium corporate housing in Lagos for corporate clients, business travellers, expatriates and individuals.
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ width: 90, height: 4, background: '#FF9800', display: 'flex' }} />
          <span style={{ color: '#FF9800', fontSize: 20, letterSpacing: 6, fontWeight: 600 }}>
            MORE THAN A PLACE — A HIGHER CALLING
          </span>
        </div>
      </div>
    ),
    size,
  );
}
