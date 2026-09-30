import type { Disclaimer, Opportunity, OpportunityCategory } from './types';

/**
 * The six Business & Investment opportunity categories.
 *
 * PRESENTATION RULES (enforced across the product):
 *  • Every category and opportunity carries a key-consideration / risk notice.
 *  • No guaranteed-return, risk-free or guaranteed-margin language anywhere.
 *  • Investment documents are never publicly downloadable.
 *  • The exact disclaimer wording is admin-editable and pending Nigerian
 *    legal/compliance counsel review.
 */

const STANDARD_RISK =
  'Opportunity performance depends on the specific business, market conditions, structure and applicable agreement. Capital is at risk. Conduct your own due diligence and obtain independent professional advice before committing funds. No returns are guaranteed.';

export const opportunityCategories: OpportunityCategory[] = [
  {
    id: 'cat_agro',
    slug: 'agro-real-estate',
    name: 'Agro Real Estate Opportunities',
    order: 1,
    icon: 'sprout',
    shortDescription:
      'Agricultural land and processing assets presented for consideration in high-growth food and agri-hub corridors.',
    description:
      'Agro real estate covers agricultural land, produce-processing facilities and storage assets positioned along identified food-production corridors. Presented opportunities typically involve land title documentation, produce offtake arrangements and a defined operating partner.\n\nHeavenward Place presents these opportunities at a high level only. Site inspections, title verification, agronomic assessment and full commercial documentation are handled privately through a follow-up process with the operating partner.',
    riskNotice: STANDARD_RISK,
    kind: 'BOTH',
    imageUrl:
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    isActive: true,
  },
  {
    id: 'cat_rental',
    slug: 'rental-income-property',
    name: 'Rental Income Property Opportunities',
    order: 2,
    icon: 'building',
    shortDescription:
      'Residential and commercial properties positioned for long-let occupancy in established Lagos markets.',
    description:
      'Rental income opportunities are income-producing properties — serviced residential units, commercial space and mixed-use assets — presented for consideration with an identified letting profile and market context.\n\nOccupancy, rent benchmarks and building condition are reviewed as part of the private follow-up process. All figures shown are indicative and subject to the specific structure and terms that follow.',
    riskNotice: STANDARD_RISK,
    kind: 'INVESTMENT',
    imageUrl:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    isActive: true,
  },
  {
    id: 'cat_metals',
    slug: 'precious-metals',
    name: 'Precious Metals Opportunities',
    order: 3,
    icon: 'metal',
    shortDescription:
      'Opportunities in gold and other precious metals, presented with structure and market context.',
    description:
      'Precious metals opportunities are introduced where there is a defined route into a market position — refining, trading, secured storage or structured participation in an operating entity.\n\nMetal prices move in both directions. Currency exposure, storage and custody arrangements, and the counterparty involved all materially affect outcomes. These risks are explained in detail during private follow-up.',
    riskNotice: `${STANDARD_RISK} Commodity and currency prices can move adversely, and metals carry additional storage, custody and liquidity considerations.`,
    kind: 'INVESTMENT',
    imageUrl:
      'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1200&q=80',
    isActive: true,
  },
  {
    id: 'cat_stones',
    slug: 'precious-stones',
    name: 'Precious Stones Opportunities',
    order: 4,
    icon: 'gem',
    shortDescription:
      'Gemstone and precious-stone opportunities with a defined sourcing, grading and offtake structure.',
    description:
      'Precious stones opportunities are introduced where a sourcing and grading chain is identified and an offtake route exists. Grading, treatment disclosure, provenance and marketability vary considerably between stones and between operators.\n\nIndependent gemological inspection forms part of the due-diligence process and is arranged privately before any commitment.',
    riskNotice: `${STANDARD_RISK} Gemstone valuation is inherently judgement-based, and liquidity in individual stones can be limited. Independent grading is essential.`,
    kind: 'INVESTMENT',
    imageUrl:
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80',
    isActive: true,
  },
  {
    id: 'cat_jv',
    slug: 'joint-venture',
    name: 'Joint Venture Opportunities',
    order: 5,
    icon: 'handshake',
    shortDescription:
      'Structured joint-venture propositions where a defined contribution meets a defined operating need.',
    description:
      'Joint venture opportunities bring a contributing party and an operating party together under a defined structure — capital, assets, distribution reach or operational capability on one side; a proven team, market access or management on the other.\n\nGovernance, decision rights, reporting obligations and exit provisions are negotiated in the definitive agreement. Nothing is committed until that agreement is executed by all parties.',
    riskNotice: `${STANDARD_RISK} Joint-venture outcomes depend on the other party, the governance arrangement and the terms of the definitive agreement.`,
    kind: 'BOTH',
    imageUrl:
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80',
    isActive: true,
  },
  {
    id: 'cat_distribution',
    slug: 'distribution-income',
    name: 'Distribution Income Opportunities',
    order: 6,
    icon: 'distribution',
    shortDescription:
      'Route-to-market and distribution propositions where revenue follows volume throughput.',
    description:
      'Distribution income opportunities sit within an established value chain — consumer goods, FMCG, agricultural produce, pharmaceuticals and industrial supplies — where a defined territory or channel produces revenue from volume moved through the network.\n\nTerritory definitions, channel agreements and stock movement are reviewed during the follow-up process. Volume-dependent income carries execution risk.',
    riskNotice: `${STANDARD_RISK} Distribution income depends on volume, territory performance and channel agreements, none of which are within your control.`,
    kind: 'BOTH',
    imageUrl:
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    isActive: true,
  },
];

export const opportunities: Opportunity[] = [
  {
    id: 'opp_agro_1',
    categorySlug: 'agro-real-estate',
    slug: 'lekki-agri-hub-processing-site',
    title: 'Agri-Hub Processing Site — Lekki Agricultural Corridor',
    summary:
      'A processing and storage site positioned within an established agricultural production corridor, with an identified operating partner and produce offtake interest.',
    description:
      'This proposition concerns a processing and storage site within an established agricultural production corridor. The asset sits close to production volumes rather than at the edge of the corridor, which is the main operational argument for the site.\n\nA potential operating partner has been identified and is willing to be introduced. Full site documentation, title verification and agronomic assessment are provided privately during follow-up and are not published as public downloads.',
    locationMarket: 'Lekki Agricultural Corridor, Lagos State, Nigeria',
    structure:
      'Long-term ground lease or participation in the operating entity, subject to the definitive agreement. Terms are set privately and are indicative only until documented.',
    capitalRangeLabel: 'Indicative range from ₦25,000,000',
    capitalRangeMin: 25_000_000_00,
    capitalRangeMax: 250_000_000_00,
    riskNotice: STANDARD_RISK,
    kind: 'BOTH',
    status: 'PUBLISHED',
    documentsPubliclyDownloadable: false,
    imageUrl:
      'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=1200&q=80',
    sortOrder: 1,
  },
  {
    id: 'opp_agro_2',
    categorySlug: 'agro-real-estate',
    slug: 'guinea-savanna-outgrower-land',
    title: 'Outgrower Aggregation Land — Guinea Savanna Zone',
    summary:
      'Aggregation acreage under a multi-season outgrower programme, with a defined buyer commitment under discussion.',
    description:
      'Aggregation acreage under a multi-season outgrower programme, located in a zone with established smallholder production. The programme structure links growers, aggregation and an identified buyer channel.\n\nSoil testing, water access, tenure documentation and the buyer agreement are all part of the private due-diligence pack provided on request.',
    locationMarket: 'Guinea Savanna Zone, Nigeria',
    structure: 'Participation in a managed aggregation programme. Indicative structures are discussed during follow-up.',
    capitalRangeLabel: 'Indicative range from ₦10,000,000',
    capitalRangeMin: 10_000_000_00,
    capitalRangeMax: 100_000_000_00,
    riskNotice: STANDARD_RISK,
    kind: 'BOTH',
    status: 'PUBLISHED',
    documentsPubliclyDownloadable: false,
    imageUrl:
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1200&q=80',
    sortOrder: 2,
  },
  {
    id: 'opp_rental_1',
    categorySlug: 'rental-income-property',
    slug: 'leki-phase-1-serviced-residences',
    title: 'Serviced Residences — Lekki Phase 1',
    summary:
      'A block of serviced residential units in an established Lagos market with a corporate letting profile.',
    description:
      'A residential block in Lekki Phase 1 offered for long-let occupancy. The corporate and expatriate rental market in this corridor is well established, which is the core of the letting case.\n\nCurrent occupancy history, rent benchmarks, service-charge position and building condition are provided in the private information pack. All yield figures referenced in discussion are estimates based on current market conditions, not commitments.',
    locationMarket: 'Lekki Phase 1, Lagos, Nigeria',
    structure: 'Long-let purchase or ground lease subject to the definitive agreement. Indicative only.',
    capitalRangeLabel: 'Indicative range from ₦100,000,000',
    capitalRangeMin: 100_000_000_00,
    capitalRangeMax: 900_000_000_00,
    riskNotice: STANDARD_RISK,
    kind: 'INVESTMENT',
    status: 'PUBLISHED',
    documentsPubliclyDownloadable: false,
    imageUrl:
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    sortOrder: 1,
  },
  {
    id: 'opp_rental_2',
    categorySlug: 'rental-income-property',
    slug: 'ikeja-commercial-retail-units',
    title: 'Commercial Retail Units — Ikeja',
    summary:
      'Ground-floor retail units on a high-footfall Ikeja corridor with existing tenant occupancy.',
    description:
      'Ground-floor retail units on a high-footfall corridor in Ikeja, with existing tenancy and visible footfall characteristics. Retail occupancy, service charge position and tenant profile are covered in the private pack.',
    locationMarket: 'Ikeja, Lagos, Nigeria',
    structure: 'Purchase or participation subject to the definitive agreement. Indicative only.',
    capitalRangeLabel: 'Indicative range from ₦50,000,000',
    capitalRangeMin: 50_000_000_00,
    capitalRangeMax: 400_000_000_00,
    riskNotice: STANDARD_RISK,
    kind: 'INVESTMENT',
    status: 'PUBLISHED',
    documentsPubliclyDownloadable: false,
    imageUrl:
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
    sortOrder: 2,
  },
  {
    id: 'opp_metals_1',
    categorySlug: 'precious-metals',
    slug: 'gold-asset-participation-programme',
    title: 'Gold Asset Participation Programme',
    summary:
      'A defined route into a gold position through refining and secure custody, with structure explained privately.',
    description:
      'This proposition introduces a defined route into a gold position rather than a speculative trade. Refining, custody and structuring are the substance of the discussion.\n\nMetal prices can move adversely, currency exposure applies, and counterparty and custody arrangements matter. Independent verification of holdings and title is part of the due-diligence process.',
    locationMarket: 'International market, with Nigerian structuring',
    structure: 'Structured participation in a defined position. Terms set privately.',
    capitalRangeLabel: 'Indicative range from ₦5,000,000',
    capitalRangeMin: 5_000_000_00,
    capitalRangeMax: 150_000_000_00,
    riskNotice: STANDARD_RISK,
    kind: 'INVESTMENT',
    status: 'PUBLISHED',
    documentsPubliclyDownloadable: false,
    imageUrl:
      'https://images.unsplash.com/photo-1610375461369-d613b564f4c4?auto=format&fit=crop&w=1200&q=80',
    sortOrder: 1,
  },
  {
    id: 'opp_stones_1',
    categorySlug: 'precious-stones',
    slug: 'graded-gemstone-consignment-programme',
    title: 'Graded Gemstone Consignment Programme',
    summary:
      'Consignment participation against independently graded stones with an established market channel.',
    description:
      'Consignment participation against stones that have been independently graded, with disclosure of treatment and provenance. The market channel is an existing one, which is the central operational question.\n\nIndividual stones can be difficult to realise at a chosen price. Independent gemological inspection is arranged before any commitment is contemplated.',
    locationMarket: 'International market',
    structure: 'Consignment or pre-purchase arrangement, subject to the definitive agreement.',
    capitalRangeLabel: 'Indicative range from ₦5,000,000',
    capitalRangeMin: 5_000_000_00,
    capitalRangeMax: 100_000_000_00,
    riskNotice: STANDARD_RISK,
    kind: 'INVESTMENT',
    status: 'PUBLISHED',
    documentsPubliclyDownloadable: false,
    imageUrl:
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80',
    sortOrder: 1,
  },
  {
    id: 'opp_jv_1',
    categorySlug: 'joint-venture',
    slug: 'logistics-and-last-mile-jv',
    title: 'Logistics & Last-Mile Distribution Joint Venture',
    summary:
      'A structured joint venture pairing capital and distribution reach with an operating logistics team.',
    description:
      'This joint venture pairs contributing capital and existing distribution reach with an operating logistics team already handling last-mile volume in Lagos. The contribution on each side is specific, which is what makes a joint venture work or fail.\n\nGovernance, reporting, decision rights and exit provisions are negotiated in a definitive agreement. Participation is not open-ended; it is bounded by that agreement.',
    locationMarket: 'Lagos, Nigeria',
    structure: 'Defined joint-venture entity with negotiated governance and exit provisions.',
    capitalRangeLabel: 'Indicative range from ₦25,000,000',
    capitalRangeMin: 25_000_000_00,
    capitalRangeMax: 300_000_000_00,
    riskNotice: STANDARD_RISK,
    kind: 'BOTH',
    status: 'PUBLISHED',
    documentsPubliclyDownloadable: false,
    imageUrl:
      'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=1200&q=80',
    sortOrder: 1,
  },
  {
    id: 'opp_jv_2',
    categorySlug: 'joint-venture',
    slug: 'hospitality-brand-operations-jv',
    title: 'Hospitality Brand & Operations Joint Venture',
    summary:
      'A brand-and-operations partnership bringing an established hospitality standard into a new market.',
    description:
      'A partnership model in which an operator brings brand standards, systems and distribution while a local partner brings market access, premises and local operations. It suits parties who have assets or capital but not a hospitality operating system.',
    locationMarket: 'Nigeria, with expansion markets under discussion',
    structure: 'Negotiated joint-venture entity. Terms set privately during consultation.',
    capitalRangeLabel: 'Indicative range from ₦50,000,000',
    capitalRangeMin: 50_000_000_00,
    capitalRangeMax: 500_000_000_00,
    riskNotice: STANDARD_RISK,
    kind: 'BUSINESS',
    status: 'PUBLISHED',
    documentsPubliclyDownloadable: false,
    imageUrl:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    sortOrder: 2,
  },
  {
    id: 'opp_dist_1',
    categorySlug: 'distribution-income',
    slug: 'fmcg-territory-distribution',
    title: 'FMCG Territory Distribution',
    summary:
      'An established consumer-goods category with an open territory channel and defined trade terms.',
    description:
      'An established consumer-goods category with an open territory channel. Trade terms, territory boundaries and stock movement expectations are the substance of the arrangement and are provided in the private pack.',
    locationMarket: 'South-West Nigeria',
    structure: 'Distributor appointment under negotiated trade terms. Indicative only until documented.',
    capitalRangeLabel: 'Indicative range from ₦5,000,000',
    capitalRangeMin: 5_000_000_00,
    capitalRangeMax: 80_000_000_00,
    riskNotice: STANDARD_RISK,
    kind: 'BOTH',
    status: 'PUBLISHED',
    documentsPubliclyDownloadable: false,
    imageUrl:
      'https://images.unsplash.com/photo-1601598851547-4302969d7bbb?auto=format&fit=crop&w=1200&q=80',
    sortOrder: 1,
  },
  {
    id: 'opp_dist_2',
    categorySlug: 'distribution-income',
    slug: 'agricultural-produce-offtake',
    title: 'Agricultural Produce Offtake & Channel',
    summary:
      'A produce offtake and channel arrangement connecting production volumes with a downstream buyer network.',
    description:
      'A produce offtake and channel arrangement connecting production volumes with a downstream buyer network. It suits parties with logistics reach or aggregation capability rather than working capital alone.',
    locationMarket: 'Nigeria',
    structure: 'Offtake or channel agreement. Terms set privately.',
    capitalRangeLabel: 'Indicative range from ₦10,000,000',
    capitalRangeMin: 10_000_000_00,
    capitalRangeMax: 120_000_000_00,
    riskNotice: STANDARD_RISK,
    kind: 'BUSINESS',
    status: 'PUBLISHED',
    documentsPubliclyDownloadable: false,
    imageUrl:
      'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1200&q=80',
    sortOrder: 2,
  },
];

/**
 * Mandatory entry disclaimer. Fully admin-editable; the direction of wording is
 * fixed but the final text is PENDING NIGERIAN LEGAL / COMPLIANCE COUNSEL REVIEW.
 */
export const opportunityDisclaimer: Disclaimer = {
  id: 'disc_opportunity_entry',
  key: 'opportunity_entry',
  title: 'Before you continue',
  version: 1,
  pendingLegalReview: true,
  body:
    'Heavenward Place does not take custody of, hold, pool or manage customer investment funds through this website. The website is intended to introduce and facilitate discussions around selected opportunities. You should conduct appropriate due diligence and review the specific terms and agreements before committing funds. No returns are guaranteed.',
};

export function getCategory(slug: string) {
  return opportunityCategories.find((c) => c.slug === slug);
}

export function getOpportunity(slug: string) {
  return opportunities.find((o) => o.slug === slug);
}

export function opportunitiesForCategory(slug: string) {
  return opportunities
    .filter((o) => o.categorySlug === slug && o.status === 'PUBLISHED')
    .sort((a, b) => a.sortOrder - b.sortOrder);
}
