import type { NextConfig } from 'next';
import { createSecurityHeaders } from './src/lib/security/headers';

/**
 * Heavenward Place — Next.js configuration.
 *
 * Security headers live in `src/lib/security/headers.ts` so the same policy can be
 * re-used by the build config and asserted in tests.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,
  images: {
    // Placeholder photography is served from Unsplash until the real property
    // library is delivered. Swap `remotePatterns` for the production CDN host.
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 480, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [96, 160, 240, 320, 480],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async headers() {
    return createSecurityHeaders();
  },
  async redirects() {
    return [
      { source: '/opportunity', destination: '/opportunities', permanent: true },
      { source: '/invest', destination: '/opportunities', permanent: true },
      { source: '/partners', destination: '/about', permanent: true },
      { source: '/stay-with-us', destination: '/stay', permanent: true },
    ];
  },
};

export default nextConfig;
