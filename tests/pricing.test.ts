import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

import {
  DEFAULT_PRICING_CONFIG,
  buildQuote,
  displayNightly,
  indicativeWeeklyTotals,
  partnerRateList,
} from '@/lib/pricing';
import { quoteFromRate, deriveLongStayBenefits, DEFAULT_LONG_STAY_RULES } from '@/lib/quote';
import { nightsBetween } from '@/lib/dates';
import { properties } from '@/data/properties';
import type { Property } from '@/data/types';

const property = properties[0]!;

function quote(overrides: Partial<Parameters<typeof buildQuote>[0]> = {}) {
  return buildQuote({
    property,
    checkIn: '2027-03-01',
    checkOut: '2027-03-05',
    guests: 1,
    profile: 'HOSPITALITY',
    ...overrides,
  });
}

describe('pricing engine', () => {
  it('returns the stored base price unchanged for the Hospitality profile', () => {
    expect(quote({ profile: 'HOSPITALITY' }).displayPrice).toBe(property.baseNightlyPrice);
  });

  it('derives the Business & Investment price from the config multiplier', () => {
    const q = quote({ profile: 'BUSINESS_INVESTMENT' });
    // 1.5 × base, rounded to the nearest ₦100.
    const expected = Math.round((property.baseNightlyPrice * 1.5) / 10_000) * 10_000;
    expect(q.displayPrice).toBe(expected);
    expect(q.displayPrice).toBeGreaterThan(property.baseNightlyPrice);
  });

  it('never returns the base price or the multiplier in a customer-facing quote', () => {
    const serialised = JSON.stringify(quote({ profile: 'BUSINESS_INVESTMENT' }));
    expect(serialised).not.toMatch(/multiplier/i);
    expect(serialised).not.toMatch(/baseNightly/i);
    expect(serialised).not.toMatch(/\+50/);
    expect(serialised).not.toMatch(/50%/);
    // The base price value itself must not appear anywhere in the payload.
    expect(serialised).not.toContain(String(property.baseNightlyPrice));
  });

  it('labels which price list the guest is seeing, without explaining why', () => {
    expect(quote({ profile: 'HOSPITALITY' }).priceListLabel).toBe('Hospitality');
    expect(quote({ profile: 'BUSINESS_INVESTMENT' }).priceListLabel).toBe('Business & Investment');
  });

  it('computes the total from nights, discount, add-ons, cleaning and service charge', () => {
    const q = quote({ checkIn: '2027-03-01', checkOut: '2027-03-15' }); // 14 nights
    expect(q.nights).toBe(14);
    expect(q.nightsSubtotal).toBe(q.displayPrice * 14);
    expect(q.weeklyDiscount).toBe(
      Math.round((q.displayPrice * 7 * property.weeklyDiscountPct) / 100) * 2,
    );
    expect(q.total).toBe(
      q.nightsSubtotal - q.weeklyDiscount + q.addOnsSubtotal + q.cleaningFee + q.serviceCharge,
    );
  });

  it('applies the weekly discount only to complete seven-night blocks', () => {
    const six = quote({ checkIn: '2027-03-01', checkOut: '2027-03-07' }); // 6 nights
    const seven = quote({ checkIn: '2027-03-01', checkOut: '2027-03-08' }); // 7 nights
    const fourteen = quote({ checkIn: '2027-03-01', checkOut: '2027-03-15' }); // 14 nights

    expect(six.weeklyDiscount).toBe(0);
    expect(seven.weeklyDiscount).toBeGreaterThan(0);
    expect(fourteen.weeklyDiscount).toBe(seven.weeklyDiscount * 2);
  });

  it('prices a per-stay add-on once regardless of length', () => {
    const perStay = property.paidAddOns.find((a) => a.unit === 'per_stay')!;
    const stay = quote({ addOnKeys: [perStay.key], checkIn: '2027-03-01', checkOut: '2027-03-05' });
    expect(stay.nights).toBe(4);
    expect(stay.addOnsSubtotal).toBe(perStay.price);
  });

  it('prices a specific quantity of chef meals per meal', () => {
    const perMeal = property.paidAddOns.find((a) => a.unit === 'per_meal')!;
    expect(quote({ chefMeals: 2 }).addOnsSubtotal).toBe(perMeal.price * 2);
  });

  /*
   * Regression: a per-meal add-on used to be charged twice when a request
   * carried both the add-on key and a `chefMeals` count — once as qty 1 from the
   * key and again as `price × count`. That is a real over-charge.
   */
  it('never charges a per-meal add-on twice when a key and a count are both sent', () => {
    const perMeal = property.paidAddOns.find((a) => a.unit === 'per_meal')!;

    const byCount = quote({ chefMeals: 3 });
    const byKeyAndCount = quote({ chefMeals: 3, addOnKeys: [perMeal.key] });
    const byKeyOnly = quote({ addOnKeys: [perMeal.key] });

    expect(byKeyAndCount.addOnsSubtotal).toBe(perMeal.price * 3);
    expect(byKeyAndCount.addOnsSubtotal).toBe(byCount.addOnsSubtotal);
    // The key alone still means a single meal, for a client that sends no count.
    expect(byKeyOnly.addOnsSubtotal).toBe(perMeal.price);
    const chefLines = byKeyAndCount.addOns.filter((a) => a.key === perMeal.key);
    expect(chefLines).toHaveLength(1);
  });

  it('charges nothing for chef meals when none are requested', () => {
    expect(quote({ chefMeals: 0 }).addOnsSubtotal).toBe(0);
    expect(quote({ chefMeals: -5 }).addOnsSubtotal).toBe(0);
  });

  it('multiplies a per-night add-on by the number of nights', () => {
    const perNight = properties.flatMap((p) => p.paidAddOns).find((a) => a.unit === 'per_night');
    expect(perNight).toBeDefined();
    const host = properties.find((p) => p.paidAddOns.some((a) => a.key === perNight!.key))!;

    const q = buildQuote({
      property: host,
      checkIn: '2027-03-01',
      checkOut: '2027-03-06', // 5 nights
      guests: 1,
      profile: 'HOSPITALITY',
      addOnKeys: [perNight!.key],
    });
    expect(q.nights).toBe(5);
    expect(q.addOnsSubtotal).toBe(perNight!.price * 5);
  });

  it('ignores add-on keys that are not configured on the property', () => {
    const unconfigured = (['EXTRA_GUEST', 'EXTRA_BEDROOM', 'LATE_CHECKOUT'] as const).find(
      (key) => !property.paidAddOns.some((a) => a.key === key),
    );
    expect(unconfigured).toBeDefined();
    const q = quote({ addOnKeys: [unconfigured!] });
    expect(q.addOnsSubtotal).toBe(0);
    expect(q.addOns).toHaveLength(0);
  });
});

describe('long-stay benefits', () => {
  it('applies at exactly the configured threshold', () => {
    const threshold = DEFAULT_PRICING_CONFIG.longStay.thresholdNights;
    expect(deriveLongStayBenefits(threshold - 1, DEFAULT_LONG_STAY_RULES)).toHaveLength(0);
    expect(deriveLongStayBenefits(threshold, DEFAULT_LONG_STAY_RULES)).toHaveLength(2);
  });

  it('includes pickup and the weekly chef allowance, capped at one meal per day', () => {
    const benefits = deriveLongStayBenefits(7, DEFAULT_LONG_STAY_RULES);
    const codes = benefits.map((b) => b.code);
    expect(codes).toContain('AIRPORT_PICKUP');
    expect(codes).toContain('PRIVATE_CHEF_MEALS');

    const chef = benefits.find((b) => b.code === 'PRIVATE_CHEF_MEALS')!;
    expect(chef.label).toContain('3');
    expect(chef.detail).toMatch(/maximum 1 complimentary meal per day/i);
    expect(chef.detail).toMatch(/breakfast, lunch or dinner/i);
  });

  it('charges nothing beyond the allowance, and the benefit lines are all zero', () => {
    const short = quote({ checkIn: '2027-03-01', checkOut: '2027-03-05' });
    const long = quote({ checkIn: '2027-03-01', checkOut: '2027-03-08' });
    expect(short.complimentaryBenefits).toHaveLength(0);
    expect(long.complimentaryBenefits).toHaveLength(2);
    for (const benefit of long.complimentaryBenefits) expect(benefit.price).toBe(0);
  });
});

/*
 * ═════════════════════════════════════════════════════════════════════════════
 * The confidentiality invariant
 * ═════════════════════════════════════════════════════════════════════════════
 *
 * With no server, the B&I rate has to be resolved at build time and passed to
 * the browser as a plain number. The multiplier must therefore never enter a
 * client bundle. Two tests guard that: the import graph below, and the built
 * output in `scripts/verify.mjs`.
 */

describe('multiplier containment', () => {
  /** Every file reachable from `src/`, transitively, via relative or `@/` imports. */
  function reachableFrom(entry: string): Set<string> {
    const seen = new Set<string>();
    const queue = [entry];

    while (queue.length > 0) {
      const file = queue.pop()!;
      if (seen.has(file) || !file.endsWith('.ts') && !file.endsWith('.tsx')) continue;
      seen.add(file);

      const source = readFileSync(file, 'utf8');
      const specifiers = [
        ...source.matchAll(/from\s+['"]([^'"]+)['"]/g),
        ...source.matchAll(/import\(\s*['"]([^'"]+)['"]\s*\)/g),
      ].map((m) => m[1]!);

      for (const spec of specifiers) {
        if (!spec.startsWith('@/') && !spec.startsWith('.')) continue;
        const base = spec.startsWith('@/')
          ? join('src', spec.slice(2))
          : join(file, '..', spec);
        for (const ext of ['', '.ts', '.tsx', '.d.ts', '/index.ts', '/index.tsx']) {
          const candidate = base + ext;
          try {
            if (statSync(candidate).isFile()) {
              queue.push(candidate);
              break;
            }
          } catch {
            /* not this extension */
          }
        }
      }
    }
    return seen;
  }

  it('does not import the pricing module anywhere in a client component', () => {
    const offenders: string[] = [];

    const walk = (dir: string) => {
      for (const entry of readdirSync(dir)) {
        const path = join(dir, entry);
        if (statSync(path).isDirectory()) {
          walk(path);
          continue;
        }
        if (!path.endsWith('.ts') && !path.endsWith('.tsx')) continue;
        const source = readFileSync(path, 'utf8');
        if (!source.includes("'use client'")) continue;
        if (/from\s+['"][^'"]*lib\/pricing['"]/.test(source)) {
          offenders.push(path);
        }
      }
    };

    walk('src');
    expect(offenders).toEqual([]);
  });

  it('keeps the multiplier out of the client-safe quote module', () => {
    // Strip comments: the module *documents* that it holds no multiplier, and
    // a naive source scan would match its own explanation.
    const code = readFileSync('src/lib/quote.ts', 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*\/\/.*$/gm, '');
    expect(code).not.toMatch(/\bmultiplier\b/);
    expect(code).not.toMatch(/baseNightly/);
    expect(code).not.toMatch(/\b1\.5\b/);
    expect(code).not.toMatch(/DEFAULT_PRICING_CONFIG/);
  });

  it('keeps DEFAULT_PRICING_CONFIG out of every file the quote module reaches', () => {
    for (const file of reachableFrom('src/lib/quote.ts')) {
      const code = readFileSync(file, 'utf8')
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/^\s*\/\/.*$/gm, '');
      expect(code, `${file} must not reference DEFAULT_PRICING_CONFIG`).not.toMatch(
        /DEFAULT_PRICING_CONFIG/,
      );
    }
  });

  it('exposes only the resolved rate, never the derivation, via partnerRateList', () => {
    const list = partnerRateList(properties as Property[]);
    expect(list).toHaveLength(properties.length);
    for (const row of list) {
      expect(typeof row.nightly).toBe('number');
      expect(Object.keys(row)).not.toContain('baseNightlyPrice');
      expect(Object.keys(row)).not.toContain('multiplier');
    }
    const serialised = JSON.stringify(list);
    expect(serialised).not.toMatch(/multiplier/i);
    expect(serialised).not.toMatch(/50%/);
  });
});

describe('indicative totals', () => {
  it('quotes a seven-night stay at the resolved rate, net of the weekly discount', () => {
    const weekly = indicativeWeeklyTotals(property, 'HOSPITALITY');
    const gross = property.baseNightlyPrice * 7;

    expect(weekly.nights).toBe(7);
    expect(weekly.nightly).toBe(property.baseNightlyPrice);
    // The weekly rate is cheaper than seven separate nights.
    expect(weekly.total).toBeLessThan(gross);
    // But still more than the bare nightly rate would suggest for one night.
    expect(weekly.total).toBeGreaterThan(weekly.nightly);
    expect(weekly.discount).toMatch(/weekly rate/i);
  });
});

describe('list prices', () => {
  it('exposes one rate per profile per residence', () => {
    for (const p of properties) {
      expect(displayNightly(p, 'HOSPITALITY')).toBe(p.baseNightlyPrice);
      expect(displayNightly(p, 'BUSINESS_INVESTMENT')).toBeGreaterThan(p.baseNightlyPrice);
    }
  });
});

describe('date arithmetic', () => {
  it('counts nights, not days, between check-in and check-out', () => {
    expect(nightsBetween('2027-03-01', '2027-03-02')).toBe(1);
    expect(nightsBetween('2027-03-01', '2027-03-08')).toBe(7);
    expect(nightsBetween('2027-03-01', '2027-03-01')).toBe(0);
  });

  it('handles month and year boundaries', () => {
    expect(nightsBetween('2027-01-30', '2027-02-02')).toBe(3);
    expect(nightsBetween('2026-12-30', '2027-01-02')).toBe(3);
  });
});

describe('money', () => {
  it('stores every amount in kobo and never as a float', () => {
    for (const p of properties as Property[]) {
      expect(Number.isInteger(p.baseNightlyPrice)).toBe(true);
      expect(Number.isInteger(p.cleaningFee)).toBe(true);
      for (const addOn of p.paidAddOns) expect(Number.isInteger(addOn.price)).toBe(true);
    }
  });
});

describe('client/server split', () => {
  it('quoteFromRate reproduces buildQuote exactly for a given rate', () => {
    const server = buildQuote({
      property,
      checkIn: '2027-03-01',
      checkOut: '2027-03-10',
      guests: 2,
      profile: 'HOSPITALITY',
      addOnKeys: ['PICKUP'],
      chefMeals: 2,
    });

    const client = quoteFromRate({
      property,
      displayPrice: displayNightly(property, 'HOSPITALITY'),
      checkIn: '2027-03-01',
      checkOut: '2027-03-10',
      guests: 2,
      profile: 'HOSPITALITY',
      addOnKeys: ['PICKUP'],
      chefMeals: 2,
    });

    // One implementation, so the figure the browser shows cannot drift from the
    // figure the build produced.
    expect(client).toEqual(server);
  });
});
