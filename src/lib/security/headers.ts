/**
 * Response headers.
 *
 * There is no server, so these are applied by `next.config.ts` at build time and
 * served by whichever host serves the static output. Nothing here depends on a
 * runtime, which is exactly why it still works.
 *
 * The policy is unchanged in spirit from when there was an API: strict framing
 * protection, no MIME sniffing, HSTS, a conservative referrer policy, and a
 * permissions policy that denies the camera, microphone and geolocation — none
 * of which this site uses.
 */
export function createSecurityHeaders() {
  return [
    {
      source: '/:path*',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
        { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=(), payment=(), interest-cohort=()',
        },
        {
          key: 'Content-Security-Policy',
          value: [
            "default-src 'self'",
            // Next.js injects inline bootstrap; styles carry inline custom properties.
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' data: https://fonts.gstatic.com",
            'img-src ' +
              "'self' data: blob: https://images.unsplash.com https://res.cloudinary.com",
            "connect-src 'self'",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "object-src 'none'",
            'upgrade-insecure-requests',
          ].join('; '),
        },
      ],
    },
  ];
}
