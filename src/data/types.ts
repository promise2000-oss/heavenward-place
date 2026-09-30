/**
 * Domain types for Heavenward Place.
 *
 * These describe the content the site renders. They are plain types over seed
 * data — there is no database behind them, and no I/O anywhere in `src/data/`.
 *
 * MONEY RULES: every monetary value is an integer in the minor unit (kobo).
 * 1 Naira = 100 kobo. No price is ever a float.
 */

export type ProfileType = 'HOSPITALITY' | 'BUSINESS_INVESTMENT';

export type OpportunityCategorySlug =
  | 'agro-real-estate'
  | 'rental-income-property'
  | 'precious-metals'
  | 'precious-stones'
  | 'joint-venture'
  | 'distribution-income';

export type PropertyType =
  | 'Serviced Apartment'
  | 'Executive Suite'
  | 'Corporate Apartment'
  | 'Penthouse'
  | 'Garden Villa';

export interface PropertyImage {
  url: string;
  alt: string;
  isCover?: boolean;
}

export interface PaidAddOn {
  key: 'PICKUP' | 'CHEF_MEAL' | 'EXTRA_GUEST' | 'EXTRA_BEDROOM' | 'LATE_CHECKOUT';
  name: string;
  description: string;
  /** minor units */
  price: number;
  unit: 'per_stay' | 'per_night' | 'per_meal';
  isActive: boolean;
}

export interface Property {
  id: string;
  slug: string;
  name: string;
  type: PropertyType;
  shortDescription: string;
  description: string;
  area: string;
  city: string;
  state: string;
  country: string;
  /** Admin-configurable public location detail (never the exact address). */
  publicLocationDetail: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  sizeSqM: number;
  yearBuilt: number;
  /**
   * BASE HOSPITALITY PRICE — the only price stored on the property.
   * The Business & Investment price is derived server-side and never persisted.
   */
  baseNightlyPrice: number;
  currency: 'NGN';
  weeklyDiscountPct: number;
  cleaningFee: number;
  serviceChargePct: number;
  minStayNights: number;
  maxStayNights: number;
  checkInTime: string;
  checkOutTime: string;
  amenities: string[];
  services: string[];
  houseRules: string[];
  complimentary: string[];
  paidAddOns: PaidAddOn[];
  images: PropertyImage[];
  isActive: boolean;
  isFeatured: boolean;
  serviceEligible: boolean;
  rating: number;
  reviewCount: number;
}

export interface OpportunityCategory {
  id: string;
  slug: OpportunityCategorySlug;
  name: string;
  order: number;
  icon: OpportunityIconKey;
  shortDescription: string;
  description: string;
  /** Mandatory key-consideration / risk notice. */
  riskNotice: string;
  kind: 'BUSINESS' | 'INVESTMENT' | 'BOTH';
  imageUrl: string;
  isActive: boolean;
}

export type OpportunityIconKey =
  | 'sprout'
  | 'building'
  | 'metal'
  | 'gem'
  | 'handshake'
  | 'distribution';

export interface Opportunity {
  id: string;
  categorySlug: OpportunityCategorySlug;
  slug: string;
  title: string;
  summary: string;
  description: string;
  locationMarket: string;
  structure: string;
  capitalRangeLabel: string;
  capitalRangeMin: number | null;
  capitalRangeMax: number | null;
  riskNotice: string;
  kind: 'BUSINESS' | 'INVESTMENT' | 'BOTH';
  status: 'DRAFT' | 'PUBLISHED';
  /** Always false — investment documents are never publicly downloadable. */
  documentsPubliclyDownloadable: false;
  imageUrl: string;
  sortOrder: number;
}

export type InsightCategorySlug =
  | 'hospitality'
  | 'corporate-housing'
  | 'business-opportunities'
  | 'investment-education'
  | 'market-insights'
  | 'real-estate'
  | 'business-lifestyle'
  | 'company-updates';

export interface InsightPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  /** Lightweight block content — rendered by `<RichContent />`. */
  body: RichBlock[];
  category: InsightCategorySlug;
  tags: string[];
  coverImage: string;
  author: string;
  authorRole: string;
  status: 'DRAFT' | 'PUBLISHED';
  readingTimeMinutes: number;
  seoTitle: string;
  seoDescription: string;
  publishedAt: string;
}

export type RichBlock =
  | { kind: 'paragraph'; text: string }
  | { kind: 'heading'; level: 2 | 3; text: string }
  | { kind: 'list'; style: 'bullet' | 'numbered'; items: string[] }
  | { kind: 'quote'; text: string; attribution?: string }
  | { kind: 'callout'; tone: 'info' | 'warning' | 'legal'; title?: string; text: string }
  | { kind: 'rule' };

export type LegalPageSlug =
  | 'terms'
  | 'privacy'
  | 'cancellation'
  | 'hospitality-terms'
  | 'opportunity-disclaimer';

export interface LegalPage {
  slug: LegalPageSlug;
  title: string;
  summary: string;
  body: RichBlock[];
  pendingLegalReview: boolean;
  seoTitle: string;
  seoDescription: string;
  updatedAt: string;
}

export interface Disclaimer {
  id: string;
  key: 'opportunity_entry';
  title: string;
  body: string;
  version: number;
  pendingLegalReview: boolean;
}

/** The six investment capital ranges offered on the interest form. */
export const CAPITAL_RANGES = [
  'Under ₦5,000,000',
  '₦5,000,000 – ₦25,000,000',
  '₦25,000,000 – ₦100,000,000',
  '₦100,000,000 – ₦500,000,000',
  'Above ₦500,000,000',
] as const;

export const COUNTRIES = [
  'Nigeria',
  'Ghana',
  'United Kingdom',
  'United States',
  'United Arab Emirates',
  'Canada',
  'South Africa',
  'Kenya',
  'Other',
] as const;

export const ID_TYPES = [
  'NIN (National Identification Number)',
  'International Passport',
  'Driver’s Licence',
  'Voter’s Card',
  'Company Registration Certificate',
] as const;

export const CONCIERGE_SERVICES = [
  {
    key: 'PICKUP',
    name: 'Airport / Preferred-Location Pickup',
    description:
      'A trusted driver meets you at Murtala Muhammed International Airport, Lagos or at your preferred pickup point and brings you straight to your apartment.',
    complimentaryFromNights: 7,
    priceLabel: 'Paid add-on for shorter stays',
  },
  {
    key: 'PRIVATE_CHEF',
    name: 'Premium Private Chef',
    description:
      'A private chef prepares breakfast, lunch or dinner in your apartment. For stays of 7 nights or more, 3 meals per week are complimentary with a maximum of 1 per day.',
    complimentaryFromNights: 7,
    priceLabel: '3 complimentary meals per week on 7+ night stays',
  },
  {
    key: 'HOUSEKEEPING',
    name: 'Scheduled Housekeeping',
    description:
      'Daily or scheduled servicing, linen changes and restocking, arranged around your working rhythm.',
    complimentaryFromNights: 0,
    priceLabel: 'Available on request',
  },
  {
    key: 'MAINTENANCE',
    name: 'In-Apartment Technical Support',
    description:
      'Power, plumbing, cooling and appliance support handled by our on-call maintenance team.',
    complimentaryFromNights: 0,
    priceLabel: 'Included with every stay',
  },
  {
    key: 'TRANSPORT',
    name: 'Business Travel & Chauffeur',
    description:
      'Hourly or daily chauffeur hire for meetings, site visits and airport runs. Ideal for corporate guests on tight schedules.',
    complimentaryFromNights: 0,
    priceLabel: 'Available on request',
  },
  {
    key: 'OTHER',
    name: 'Everything Else',
    description:
      'Grocery runs, pharmacy pickups, document couriers, gym access, event space and more. Tell us what you need.',
    complimentaryFromNights: 0,
    priceLabel: 'Quoted on request',
  },
] as const;

