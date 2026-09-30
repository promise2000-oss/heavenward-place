import next from 'eslint-config-next';

/**
 * Flat config (ESLint 9 / Next.js 16).
 *
 * `next lint` was removed in Next.js 16 and `next build` no longer lints, so
 * linting is run explicitly via `npm run lint` (`eslint .`).
 * `eslint-config-next` ships a flat-config array covering `core-web-vitals`
 * and the TypeScript rules.
 */
export default [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      'public/**',
    ],
  },
  ...next,
  {
    /*
     * Scoped to TypeScript files, because `eslint-config-next` registers the
     * `@typescript-eslint` plugin for `**\/*.{ts,tsx}` only — a rule from that
     * plugin cannot be applied to `.mjs`/`.js` files or ESLint errors out.
     */
    files: ['**/*.{ts,tsx}'],
    rules: {
      // The codebase is fully typed; `any` is never intentional.
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  {
    rules: {
      'react-hooks/exhaustive-deps': 'warn',
      /*
       * The React Compiler rule, downgraded from error to warning.
       *
       * It flags synchronous `setState` at the top of an effect. Every remaining
       * hit in this codebase is one of two deliberate, correct patterns:
       *
       *   1. A data-fetch effect that sets `loading` / clears `error` before
       *      awaiting the server. This is synchronising with an external system,
       *      which is exactly what `useEffect` is for. Removing it would mean
       *      adopting `use()` + Suspense or a data-fetching library.
       *   2. `useMounted()` (`src/components/motion/Motion.tsx`) — the standard
       *      SSR hydration guard. There is no alternative that avoids a
       *      post-mount state flip.
       *
       * Genuine instances of this anti-pattern WERE fixed rather than
       * suppressed, each with a test or an explanation in place:
       *   • `usePageView` depended on state instead of the route, so client-side
       *     navigations were never tracked — now stateless.
       *   • `Modal` built its title id from a module counter incremented on every
       *     render and read a ref during render — now `useId()`.
       *   • The Navbar and console sidebar were closed by an effect on
       *     `pathname` — now derived, so they close in the same render.
       *   • The booking KYC prefill ran in an effect, flashing empty fields —
       *     now the documented adjust-during-render pattern.
       *
       * Kept as a warning so any *new* occurrence stays visible on review.
       */
      'react-hooks/set-state-in-effect': 'warn',
      // Superseded by the TypeScript-aware rule above.
      'no-unused-vars': 'off',
      // Email and notification templates log to the console on purpose.
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  {
    // Tests and scripts may legitimately reach for Node globals and looser types.
    files: ['tests/**/*.{ts,tsx}', 'scripts/**/*.mjs'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-console': 'off',
    },
  },
];
