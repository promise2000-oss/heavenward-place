import { nightsBetween } from '@/lib/dates';
import type { PaidAddOn, Property } from '@/data/types';

/**
 * ═════════════════════════════════════════════════════════════════════════════
 * QUOTE ARITHMETIC — SAFE TO SHIP TO THE BROWSER
 * ═════════════════════════════════════════════════════════════════════════════
 *
 * This module takes a nightly rate that has ALREADY been resolved and turns it
 * into a full quote. It has no multiplier and no base price, so a client
 * component can import it without shipping either.
 *
 * The rate itself is resolved at build time in `src/lib/pricing.ts` (server
 * only) and passed in as a single number. That is the whole confidentiality
 * story: the browser learns the price for the list it is on, and never how that
 * price was derived.
 *
 * Do NOT import `@/lib/pricing` from a `'use client'` module — that module
 * contains `DEFAULT_PRICING_CONFIG`, and importing it would put the multiplier
 * in the client bundle. `tests/quote.test.ts` asserts this separation.
 */

export type PricingProfile = 'HOSPITALITY' | 'BUSINESS_INVESTMENT';

/**
 * The long-stay allowance. These are published benefits, not pricing secrets,
 * so they are safe to ship: a guest is told the threshold and the daily cap in
 * plain English before they book.
 */
export interface LongStayRules {
  thresholdNights: number;
  chefMealsPerWeek: number;
  maxChefMealsPerDay: number;
}

export const DEFAULT_LONG_STAY_RULES: LongStayRules = {
  thresholdNights: 7,
  chefMealsPerWeek: 3,
  maxChefMealsPerDay: 1,
};

export interface LongStayBenefit {
  code: 'AIRPORT_PICKUP' | 'PRIVATE_CHEF_MEALS';
  label: string;
  detail: string;
  /** 0 — complimentary, applies automatically at the long-stay threshold. */
  price: 0;
  currency: 'NGN';
}

export interface PriceQuote {
  /** The single nightly price for the active list. */
  displayPrice: number;
  currency: 'NGN';
  nights: number;
  nightsSubtotal: number;
  weeklyDiscount: number;
  addOnsSubtotal: number;
  cleaningFee: number;
  serviceCharge: number;
  total: number;
  complimentaryBenefits: LongStayBenefit[];
  addOns: Array<{ key: PaidAddOn['key']; name: string; price: number; unit: string }>;
  priceListLabel: string;
  isLongStay: boolean;
  nightsUntilDiscountEligible: number;
}

export function deriveLongStayBenefits(
  nights: number,
  rules: LongStayRules = DEFAULT_LONG_STAY_RULES,
): LongStayBenefit[] {
  if (nights < rules.thresholdNights) return [];
  return [
    {
      code: 'AIRPORT_PICKUP',
      label: 'Complimentary airport / preferred-location pickup',
      detail: `Included automatically on stays of ${rules.thresholdNights} nights or more. Tell us your flight details and we will arrange it before you land.`,
      price: 0,
      currency: 'NGN',
    },
    {
      code: 'PRIVATE_CHEF_MEALS',
      label: `${rules.chefMealsPerWeek} complimentary private-chef meals per week`,
      detail: `Maximum ${rules.maxChefMealsPerDay} complimentary meal per day. You choose breakfast, lunch or dinner for each meal, subject to availability. Additional chef services are charged at the published rate.`,
      price: 0,
      currency: 'NGN',
    },
  ];
}

export interface QuoteFromRateInput {
  property: Property;
  /** The already-resolved nightly rate for the active list. */
  displayPrice: number;
  checkIn: string;
  checkOut: string;
  guests: number;
  profile: PricingProfile;
  addOnKeys?: Array<PaidAddOn['key']>;
  chefMeals?: number;
  longStay?: LongStayRules;
}

/**
 * Build a full quote from a known nightly rate.
 *
 * Pure, deterministic and free of any pricing secret, so this is what runs in
 * the browser when a guest changes their dates.
 */
export function quoteFromRate(input: QuoteFromRateInput): PriceQuote {
  const rules = input.longStay ?? DEFAULT_LONG_STAY_RULES;
  const { property, displayPrice: nightly, profile } = input;

  const nights = Math.max(0, nightsBetween(input.checkIn, input.checkOut));

  const nightsSubtotal = nightly * nights;

  // Weekly discount applies to complete 7-night blocks only.
  const fullWeeks = Math.floor(nights / 7);
  const weeklyDiscount = fullWeeks * Math.round((nightly * 7 * property.weeklyDiscountPct) / 100);

  // ── Add-ons ──────────────────────────────────────────────────────────────
  const selected = new Set(
    (input.addOnKeys ?? []).filter((key) =>
      property.paidAddOns.some((a) => a.key === key && a.isActive),
    ),
  );

  // Extra chef meals beyond the long-stay allowance are always paid.
  const chefMeals = Math.max(0, Math.floor(input.chefMeals ?? 0));

  /*
   * A per-meal add-on takes its quantity from `chefMeals`, never from its key.
   * Without this, a request carrying both `CHEF_MEAL` and a count is charged
   * once for the key (qty 1) and again for the count — a double charge.
   */
  if (chefMeals > 0) selected.delete('CHEF_MEAL');

  const addons: PriceQuote['addOns'] = [];
  let addOnsSubtotal = 0;

  for (const key of selected) {
    const addOn = property.paidAddOns.find((a) => a.key === key);
    if (!addOn) continue;
    const qty = addOn.unit === 'per_night' ? nights : 1;
    const lineTotal = addOn.price * qty;
    addOnsSubtotal += lineTotal;
    addons.push({ key: addOn.key, name: addOn.name, price: lineTotal, unit: addOn.unit });
  }

  if (chefMeals > 0) {
    const chef = property.paidAddOns.find((a) => a.key === 'CHEF_MEAL');
    if (chef && chef.isActive) {
      const lineTotal = chef.price * chefMeals;
      addOnsSubtotal += lineTotal;
      addons.push({ key: 'CHEF_MEAL', name: chef.name, price: lineTotal, unit: chef.unit });
    }
  }

  const isLongStay = nights >= rules.thresholdNights;
  const complimentaryBenefits = deriveLongStayBenefits(nights, rules);

  // Benefits are free, so they never appear as a charge. Short stays may still
  // buy pickup / chef as paid add-ons (handled above).
  const cleaningFee = nights > 0 ? property.cleaningFee : 0;
  const preService = nightsSubtotal - weeklyDiscount + addOnsSubtotal + cleaningFee;
  const serviceCharge = pctMinor(preService, property.serviceChargePct);
  const total = preService + serviceCharge;

  return {
    displayPrice: nightly,
    currency: 'NGN',
    nights,
    nightsSubtotal,
    weeklyDiscount,
    addOnsSubtotal,
    cleaningFee,
    serviceCharge,
    total,
    complimentaryBenefits,
    addOns: addons,
    priceListLabel: profile === 'HOSPITALITY' ? 'Hospitality' : 'Business & Investment',
    isLongStay,
    nightsUntilDiscountEligible: Math.max(0, rules.thresholdNights - nights),
  };
}

function pctMinor(amount: number, pct: number) {
  return Math.round((amount * pct) / 100);
}

/** Indicative 7-night totals for a property page, from a known rate. */
export function indicativeWeeklyTotals(
  property: Property,
  displayPrice: number,
): { nights: 7; nightly: number; total: number; discount: string } {
  const gross = displayPrice * 7;
  const discount = Math.round((gross * property.weeklyDiscountPct) / 100);
  const preService = gross - discount + property.cleaningFee;
  return {
    nights: 7,
    nightly: displayPrice,
    total: preService + pctMinor(preService, property.serviceChargePct),
    discount:
      property.weeklyDiscountPct > 0
        ? `${property.weeklyDiscountPct}% weekly rate applied`
        : 'Weekly rate available on request',
  };
}
