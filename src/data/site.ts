/**
 * Site configuration, brand constants and copy.
 *
 * `SITE` is the single source of truth for metadata, contact details and
 * navigation so nothing is hard-coded in a page.
 */

export const SITE = {
  name: 'Heavenward Place',
  shortName: 'Heavenward',
  legalName: 'Heavenward Place',
  url: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  tagline: 'More Than A Place, It’s A Higher Calling.',
  direction: 'Stay. Experience. Explore Opportunities.',
  description:
    'Heavenward Place provides premium corporate housing and shortlet apartments for corporate clients, business travellers, expatriates and individuals — and introduces selected business and investment opportunities across six categories.',
  locale: 'en_NG',
  twitter: '@heavenwardplace',
  contact: {
    phone: process.env.NEXT_PUBLIC_SUPPORT_PHONE ?? '+234 800 000 0000',
    phoneHref: '+2348000000000',
    email: process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? 'stay@heavenwardplace.com',
    whatsapp: process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP ?? '2348000000000',
    address: 'Lagos, Nigeria',
    hours: 'Reservations & concierge: Monday – Saturday, 8:00 AM – 8:00 PM (WAT). Emergency line available to guests in residence.',
  },
  social: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/heavenwardplace' },
    { label: 'Instagram', href: 'https://www.instagram.com/heavenwardplace' },
    { label: 'X', href: 'https://x.com/heavenwardplace' },
    { label: 'Facebook', href: 'https://www.facebook.com/heavenwardplace' },
  ],
} as const;

/** Primary navigation — exactly as specified in PRD §4.10. */
export const NAV: ReadonlyArray<{ label: string; href: string; long?: boolean }> = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Stay With Us', href: '/stay' },
  { label: 'Concierge', href: '/concierge' },
  { label: 'Business & Investment Opportunities', href: '/opportunities', long: true },
  { label: 'Insights', href: '/insights' },
  { label: 'Contact', href: '/contact' },
];


/** Brand palette (Sept 2026 brand deck). */
export const BRAND = {
  orange: '#FF9800',
  orangeDark: '#E08600',
  black: '#000000',
  cream: '#FFE0B1',
  creamSoft: '#FFF5E6',
  white: '#FFFFFF',
} as const;

export const WHY_POINTS = [
  {
    title: 'Luxury',
    description:
      'Considered interiors, premium fixtures and residences selected to a standard, not a budget. Every listing is inspected before it is published.',
  },
  {
    title: 'Comfort',
    description:
      'Serviced daily, laundered weekly, with the practical details that decide whether a stay works: power, connectivity, a real kitchen, a proper bed.',
  },
  {
    title: 'Security',
    description:
      'Controlled access, CCTV coverage, 24-hour presence and a resident manager on our larger residences. Guest identity is verified before check-in.',
  },
  {
    title: 'Convenience',
    description:
      'Airports, business districts and major commercial areas within a realistic drive time. Airport pickup arranged before you land, not after.',
  },
  {
    title: 'Personalised Service',
    description:
      'One relationship from enquiry to checkout. Concierge requests handled during booking and after check-in, by a person who knows your booking.',
  },
] as const;

export const TRUST_POINTS = [
  {
    title: 'Published pricing',
    description:
      'The price you see is the price you pay. Availability shown on the calendar reflects confirmed bookings and blocks in real time.',
  },
  {
    title: 'Secure payment',
    description:
      'Payments are processed through an established payment provider. A booking is confirmed only after payment has been verified by our servers.',
  },
  {
    title: 'Verified identity',
    description:
      'Identity details and documents are collected only as required for identification, booking administration and security, stored privately, and visible to authorised staff only.',
  },
  {
    title: 'No guaranteed returns',
    description:
      'We never state or imply guaranteed returns, risk-free investment, guaranteed margins or guaranteed income. Every opportunity carries a key-consideration notice.',
  },
  {
    title: 'We do not hold your funds',
    description:
      'Heavenward Place does not take custody of, hold, pool or manage customer investment funds through this website.',
  },
  {
    title: 'No public investment documents',
    description:
      'Detailed opportunity documentation is never published as a public download. It is shared through a controlled follow-up process.',
  },
] as const;

/*
 * The journey as it actually works now.
 *
 * It ends with a person confirming, not with a payment screen. There is no
 * identity-document step either: a site that stores nothing has nowhere to put
 * a passport number, so verification happens when we confirm the booking.
 */
export const PROCESS_HOSPITALITY = [
  { title: 'Search & Filter', description: 'Search by area, dates, guests, bedrooms, type, price and amenities.' },
  { title: 'Select a Residence', description: 'Review the gallery, amenities, services, pricing and availability calendar.' },
  { title: 'Choose Dates', description: 'Dates already taken or blocked by us cannot be selected. The price updates as you choose.' },
  { title: 'Review the Price', description: 'The full breakdown — long-stay benefits, add-ons, cleaning and service charge — before you commit to anything.' },
  { title: 'Send Your Request', description: 'Tell us who is staying and how to reach you. Nothing is reserved until we confirm.' },
  { title: 'We Confirm & Arrange', description: 'We check the dates, send a final quote and invoice, and verify your identity over a secure channel.' },
  { title: 'Stay & Concierge', description: 'Airport pickup, private chef, housekeeping and a responsive concierge team.' },
] as const;

export const PROCESS_OPPORTUNITY = [
  { title: 'Enter the Section', description: 'Read and acknowledge the opportunity disclaimer before any detail is shown.' },
  { title: 'Choose Your Interest', description: 'A business opportunity or an investment opportunity — tell us which interests you.' },
  { title: 'Explore Categories', description: 'Six curated categories, each presented at a high level with a risk notice.' },
  { title: 'Send Your Interest', description: 'A short form capturing only what is needed to begin the conversation.' },
  { title: 'We Review & Respond', description: 'A representative reviews your interest and responds with relevant detail and, where useful, residences to view.' },
  { title: 'Discussion & Arrangement', description: 'Detailed terms, documentation and any arrangement are handled privately and in writing.' },
] as const;

export const BUSINESS_SERVICES = [
  {
    title: 'Financial Consulting',
    description:
      'Structured financial guidance for individuals, companies and investor groups — structuring, planning and disciplined capital allocation.',
  },
  {
    title: 'Corporate Advisory',
    description:
      'Advisory support for businesses: strategy, governance, operational structuring and the decisions that shape a company over time.',
  },
  {
    title: 'Strategic Planning',
    description:
      'Multi-year planning across growth, market entry, capital requirements and the operational capability needed to execute a plan.',
  },
] as const;
