import { roundMinor } from '@/lib/money';
import type { Property } from '@/data/types';
import {
  DEFAULT_LONG_STAY_RULES,
  indicativeWeeklyTotals as indicativeFromRate,
  quoteFromRate,
  type LongStayBenefit,
  type LongStayRules,
  type PriceQuote,
  type PricingProfile,
} from '@/lib/quote';

/**
 * ═════════════════════════════════════════════════════════════════════════════
 * PRICING ENGINE — BUILD TIME ONLY
 * ═════════════════════════════════════════════════════════════════════════════
 *
 *  • The ONLY price stored on a property is the base Hospitality nightly price.
 *  • The Business & Investment price = base × multiplier. The multiplier lives
 *    here and nowhere else.
 *  • `displayPrice` is a SINGLE number for the active list. The base price, the
 *    multiplier, "+50%", the formula and any ratio never leave this module.
 *
 * ── Do not import this from a `'use client'` module ────────────────────────────
 * This file contains `DEFAULT_PRICING_CONFIG`. Importing it into a client
 * component would put the multiplier in the JavaScript bundle, where anyone can
 * read it in the browser. Client components use `@/lib/quote`, which does the
 * same arithmetic from a rate that has already been resolved here.
 *
 * `tests/quote.test.ts` asserts the separation, and the built output is checked
 * by `scripts/verify.mjs`, which greps the client chunks for the multiplier.
 */

export interface PricingConfig {
  /** e.g. 1.5 means "Hospitality price + 50%". Never exposed to clients. */
  multiplier: number;
  roundingMode: 'exact' | 'nearest_50' | 'nearest_100' | 'nearest_500';
  longStay: LongStayRules;
}

/**
 * The authoritative configuration.
 *
 * With no admin console and no database, this is edited here and applied on the
 * next build. Keeping it in one constant is what makes the invariant auditable:
 * `rg 'multiplier' src/` should return this file and nothing else.
 */
export const DEFAULT_PRICING_CONFIG: PricingConfig = {
  multiplier: 1.5,
  roundingMode: 'nearest_100',
  longStay: DEFAULT_LONG_STAY_RULES,
};

export type { LongStayBenefit, PriceQuote, PricingProfile };

/** Resolve the nightly rate for a price list. NEVER returns the base price. */
function nightlyForProfile(
  baseNightly: number,
  profile: PricingProfile,
  config: PricingConfig,
): number {
  if (profile === 'HOSPITALITY') return baseNightly;
  return roundMinor(baseNightly * config.multiplier, config.roundingMode);
}

export interface QuoteInput {
  property: Property;
  checkIn: string;
  checkOut: string;
  guests: number;
  profile: PricingProfile;
  addOnKeys?: Array<Property['paidAddOns'][number]['key']>;
  chefMeals?: number;
  config?: PricingConfig;
}

/**
 * Build a full quote. Resolves the rate for the requested list, then hands the
 * arithmetic to the client-safe module so there is exactly one implementation.
 */
export function buildQuote(input: QuoteInput): PriceQuote {
  const config = input.config ?? DEFAULT_PRICING_CONFIG;

  return quoteFromRate({
    property: input.property,
    displayPrice: nightlyForProfile(
      input.property.baseNightlyPrice,
      input.profile,
      config,
    ),
    checkIn: input.checkIn,
    checkOut: input.checkOut,
    guests: input.guests,
    profile: input.profile,
    addOnKeys: input.addOnKeys,
    chefMeals: input.chefMeals,
    longStay: config.longStay,
  });
}

/** A single list price for browsing. */
export function displayNightly(
  property: Property,
  profile: PricingProfile,
  config: PricingConfig = DEFAULT_PRICING_CONFIG,
): number {
  return nightlyForProfile(property.baseNightlyPrice, profile, config);
}

/** Indicative 7-night totals for a property page. */
export function indicativeWeeklyTotals(
  property: Property,
  profile: PricingProfile,
  config: PricingConfig = DEFAULT_PRICING_CONFIG,
) {
  return indicativeFromRate(
    property,
    nightlyForProfile(property.baseNightlyPrice, profile, config),
  );
}

/**
 * The published Business & Investment price list.
 *
 * This is the rate partners see, so it is rendered on the opportunities section.
 * Note what is *not* here: the Hospitality base it derives from, the multiplier,
 * and the arithmetic connecting the two. Publishing a rate is not the same as
 * publishing how it was calculated, and only the latter is confidential.
 */
export function partnerRateList(
  properties: Property[],
  config: PricingConfig = DEFAULT_PRICING_CONFIG,
) {
  return properties.map((property) => ({
    slug: property.slug,
    name: property.name,
    area: property.area,
    type: property.type,
    bedrooms: property.bedrooms,
    maxGuests: property.maxGuests,
    nightly: nightlyForProfile(property.baseNightlyPrice, 'BUSINESS_INVESTMENT', config),
  }));
}
