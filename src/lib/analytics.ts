'use client';

/**
 * First-party analytics.
 *
 * There is no server, so this deliberately collects nothing. `track()` is kept
 * as a no-op so the call sites stay honest about *what* is measured, and so
 * wiring a real provider later is a one-function change rather than a sweep
 * through every component.
 *
 * What it must never become: a place where guest-identifying data is captured.
 * `properties` is restricted to primitives for that reason.
 */

export function track(
  _name: string,
  _properties?: Record<string, string | number | boolean | null>,
) {
  // Intentionally empty. See the module comment.
}

/**
 * Track a page view whenever the route changes.
 *
 * Stateless by design: depending on state instead of the route meant the effect
 * only ran once with the initial path, so a client-side navigation — the case
 * this hook exists for — was never recorded.
 */
export function usePageView(path?: string) {
  void path;
  track('page_view', path ? { path } : undefined);
}
