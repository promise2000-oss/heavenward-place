import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

/** Apple touch icon — the standalone house/H mark on the brand orange. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#FF9800',
        }}
      >
        <svg viewBox="0 0 120 104" width={150} height={130} fill="none">
          <path d="M60 6 L120 50 L112 60 L60 22 L8 60 L0 50 Z" fill="#000" />
          <path d="M34 25 L44 18 L44 2 L34 9 Z" fill="#000" />
          <path d="M30 46 H42 V88 H30 Z" fill="#FFF" />
          <path d="M56 46 H68 V88 H56 Z" fill="#FFF" />
          <path d="M42 63 H56 V71 H42 Z" fill="#FFF" />
          <path d="M78 46 H90 V88 H78 Z" fill="#000" />
          <path d="M90 46 L112 60 L90 74 Z" fill="#000" />
          <path d="M14 88 H106 V100 H97 V94 H23 V100 H14 Z" fill="#000" />
        </svg>
      </div>
    ),
    size,
  );
}
