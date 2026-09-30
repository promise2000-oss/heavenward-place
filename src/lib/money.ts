/**
 * Money helpers. All amounts are integers in kobo (1 Naira = 100 kobo).
 */

export const KOBO = 100;

export function formatNaira(minor: number, options: { compact?: boolean; withSymbol?: boolean } = {}) {
  const { compact = false, withSymbol = true } = options;
  const naira = minor / KOBO;
  const value = new Intl.NumberFormat('en-NG', {
    style: withSymbol ? 'currency' : 'decimal',
    currency: 'NGN',
    maximumFractionDigits: 0,
    notation: compact && Math.abs(naira) >= 1_000_000 ? 'compact' : 'standard',
  }).format(naira);
  return value.replace(/₦\s?/, '₦');
}

export function formatNairaExact(minor: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
  }).format(minor / KOBO);
}

export function parseNairaToMinor(input: string | number): number {
  if (typeof input === 'number') return Math.round(input * KOBO);
  const cleaned = input.replace(/[^\d.]/g, '');
  const value = Number.parseFloat(cleaned);
  return Number.isFinite(value) ? Math.round(value * KOBO) : 0;
}

/** Round to a commercially sensible figure. Used by the server-side pricing engine. */
export function roundMinor(amount: number, mode: 'exact' | 'nearest_50' | 'nearest_100' | 'nearest_500' = 'nearest_100') {
  if (mode === 'exact') return Math.round(amount);
  const step = mode === 'nearest_50' ? 50 * KOBO : mode === 'nearest_100' ? 100 * KOBO : 500 * KOBO;
  return Math.round(amount / step) * step;
}

export function sumMinor(values: number[]) {
  return values.reduce((acc, v) => acc + v, 0);
}

export function pctOf(amount: number, pct: number) {
  return Math.round((amount * pct) / 100);
}
