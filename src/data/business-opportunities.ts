import type { BusinessOpportunity } from './types';

/**
 * Business Opportunities (PRD §1.2).
 *
 * These are a SEPARATE category from the six Investment categories. Listings are
 * added, updated, paused and removed frequently as suitable openings arise, based
 * on market openings, customer demand, operating seasons and cash-flow potential.
 *
 * PRESENTATION RULES (enforced across the product):
 *  • Every listing has a DEFINED ROLE for Heavenward Place.
 *  • Every listing explains the expected roles of the customer/client and of
 *    Heavenward Place's business associates — they facilitate the business
 *    together, each performing a different role.
 *  • A listing may be short-term or long-term; it must never promise that a
 *    business will generate high profits indefinitely or guarantee a return.
 *  • Every listing carries a key-consideration / risk notice.
 *  • Detailed responsibilities, costs, risks, duration and commercial terms are
 *    discussed privately and recorded in the applicable agreement.
 *
 * HOW TO MANAGE LISTINGS (static site): edit this file and rebuild. Set
 * `status` to `'PUBLISHED'` to show a listing, `'PAUSED'` to hide it without
 * deleting it, `'DRAFT'` to work on it privately, or remove the entry to
 * delete it. The sitemap and every page follow `status` automatically.
 */

const STANDARD_BUSINESS_RISK =
  'A business opportunity depends on execution, market conditions, the other parties involved and the terms of the applicable agreement. Returns are variable and not guaranteed, and the business can make a loss. Conduct your own due diligence and obtain independent professional advice before committing time, money or resources. No particular return is promised or implied.';

export const businessOpportunities: BusinessOpportunity[] = [
  {
    id: 'biz_hospitality_jv',
    slug: 'hospitality-brand-operations-partnership',
    title: 'Hospitality Brand & Operations Partnership',
    summary:
      'Bring an established hospitality operating standard into a new market, pairing brand, systems and distribution with local premises and operations.',
    description:
      'This partnership model suits parties who hold assets, premises or capital but not a hospitality operating system. Heavenward Place’s business associates bring brand standards, operating systems and distribution reach; a local partner brings market access, premises and day-to-day operations.\n\nThe roles on each side are specific, which is what makes a partnership of this kind work or fail. Detailed responsibilities, costs, risks, duration and commercial terms are discussed privately and recorded in the operating agreement.',
    locationMarket: 'Nigeria, with expansion markets under discussion',
    durationLabel: 'Long-term',
    heavenwardRole:
      'Heavenward Place convenes the introduction, provides the hospitality brand standard and operating playbook, and coordinates the working relationship between the parties. It does not take custody of partner funds and does not guarantee any outcome.',
    customerRole:
      'The customer provides premises, local market access and operational capacity, and participates in governance under the agreed structure.',
    associateRole:
      'Heavenward Place’s business associates deliver brand standards, systems, training and distribution, and are accountable for the operating performance of their scope.',
    riskNotice: `${STANDARD_BUSINESS_RISK} Partnership outcomes depend on the other party, the governance arrangement and the terms of the definitive agreement.`,
    status: 'PUBLISHED',
    imageUrl:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    sortOrder: 1,
  },
  {
    id: 'biz_produce_offtake',
    slug: 'agricultural-produce-offtake-channel',
    title: 'Agricultural Produce Offtake & Channel',
    summary:
      'A produce offtake and channel arrangement connecting production volumes with a downstream buyer network.',
    description:
      'A produce offtake and channel arrangement connecting production volumes with a downstream buyer network. It suits parties with logistics reach or aggregation capability rather than working capital alone.\n\nVolume, seasonality, quality acceptance and payment terms are the substance of the arrangement and are set in the applicable agreement. Income follows volume moved and is not guaranteed.',
    locationMarket: 'Nigeria',
    durationLabel: 'Seasonal to long-term',
    heavenwardRole:
      'Heavenward Place introduces the offtake channel, helps frame the working terms between producer and buyer, and stays available to help resolve operational friction during the season. It does not hold, pool or manage customer funds.',
    customerRole:
      'The customer aggregates, stores and moves produce to the agreed specification and schedule, and carries the operational risk of delivery.',
    associateRole:
      'Heavenward Place’s business associates provide the downstream buyer channel, quality-acceptance standards and the offtake commitment recorded in the agreement.',
    riskNotice: `${STANDARD_BUSINESS_RISK} Ofﬁtake income depends on volume, quality, seasonality and the buyer’s performance, none of which are entirely within your control.`,
    status: 'PUBLISHED',
    imageUrl:
      'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1200&q=80',
    sortOrder: 2,
  },
  {
    id: 'biz_last_mile',
    slug: 'last-mile-delivery-operation',
    title: 'Last-Mile Delivery Operation',
    summary:
      'Operate a branded last-mile delivery service for a defined territory, where revenue follows delivery volume.',
    description:
      'A last-mile delivery operation serving a defined territory, built on an existing route network and a steady base of e-commerce and quick-commerce demand. The opportunity suits an operator who can run riders, routes and service levels rather than an absentee investor.\n\nTerritory definition, service levels, pricing and the split of revenue and cost are set in the operating agreement.',
    locationMarket: 'Lagos, Nigeria',
    durationLabel: 'Long-term',
    heavenwardRole:
      'Heavenward Place provides the operating standard, route-planning and service-level framework, and supports the partner through launch and steady state. It does not guarantee delivery volumes or income.',
    customerRole:
      'The customer runs the day-to-day operation — riders, vehicles, routing and customer service — to the agreed service levels, and carries the operating cost base.',
    associateRole:
      'Heavenward Place’s business associates provide the demand channel, the operating playbook and shared infrastructure such as dispatch and tooling.',
    riskNotice: `${STANDARD_BUSINESS_RISK} Delivery income depends on demand volume, fuel and vehicle costs, rider availability and service performance, all of which vary.`,
    status: 'PUBLISHED',
    imageUrl:
      'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=1200&q=80',
    sortOrder: 3,
  },
  {
    id: 'biz_facilities',
    slug: 'corporate-facilities-management',
    title: 'Corporate Facilities Management Service',
    summary:
      'A service business providing cleaning, maintenance and technical support to corporate premises under recurring contracts.',
    description:
      'A facilities-management service serving corporate premises with recurring cleaning, maintenance and in-building technical support. Recurring contracts give the model its stability, but contracts are won and lost on performance.\n\nScope, service levels, staffing and contract length are set in each client agreement.',
    locationMarket: 'Lagos & South-West Nigeria',
    durationLabel: 'Long-term, contract-based',
    heavenwardRole:
      'Heavenward Place lends its service standard and quality-assurance system, helps open the corporate client channel, and supports training. It does not guarantee contract awards or renewal.',
    customerRole:
      'The customer mobilises and supervises the on-site teams, meets the service levels, and manages the client relationship day to day.',
    associateRole:
      'Heavenward Place’s business associates bring an operating manual, quality controls and introductions to an initial client base.',
    riskNotice: `${STANDARD_BUSINESS_RISK} Service income depends on winning and keeping contracts, staffing reliably and controlling labour costs.`,
    status: 'PUBLISHED',
    imageUrl:
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80',
    sortOrder: 4,
  },
];

export function getBusinessOpportunity(slug: string) {
  return businessOpportunities.find((o) => o.slug === slug);
}

/** Published business opportunities, in display order. Paused and draft listings are withheld. */
export function publishedBusinessOpportunities() {
  return businessOpportunities
    .filter((o) => o.status === 'PUBLISHED')
    .sort((a, b) => a.sortOrder - b.sortOrder);
}
