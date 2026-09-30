import type { InsightPost } from './types';

/**
 * Editorial content, in the shape a CMS would hold it. Reading time, SEO
 * fields and categories are all set.
 */
export const insightPosts: InsightPost[] = [
  {
    id: 'post_1',
    slug: 'what-corporate-housing-should-solve-for-a-relocating-team',
    title: 'What Corporate Housing Should Actually Solve for a Relocating Team',
    excerpt:
      'Relocation fails on the small things. Here is the operational checklist we use when housing a team arriving in Lagos, and why standard hotels fall short after week two.',
    category: 'corporate-housing',
    tags: ['Corporate Housing', 'Relocation', 'Operations'],
    coverImage:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80',
    author: 'Heavenward Place',
    authorRole: 'Hospitality Team',
    status: 'PUBLISHED',
    readingTimeMinutes: 6,
    seoTitle: 'Corporate Housing for Relocating Teams in Lagos | Heavenward Place',
    seoDescription:
      'A practical checklist for housing a relocating team in Lagos: connectivity, power, security, kitchen facilities and the operational details hotels miss.',
    publishedAt: '2026-08-18T09:00:00.000Z',
    body: [
      {
        kind: 'paragraph',
        text: 'A hotel is designed around a single night. Corporate housing has to survive a single night, a fortnight and a quarter — and the failure mode is almost never the first night. It is week two, when the guest has stopped treating the room as temporary and starts needing it to work like a home.',
      },
      { kind: 'heading', level: 2, text: 'The four things that actually decide satisfaction' },
      {
        kind: 'list',
        style: 'numbered',
        items: [
          'Power and connectivity that behave. Unstable power and weak fibre are the two complaints that appear in almost every first-week feedback note. Backup supply and a proper work surface matter more than the view.',
          'A kitchen that is genuinely usable. A team on assignment cooks. A kettle and two mugs is not a kitchen.',
          'Security that is designed, not decorative. Controlled access, working CCTV, a resident manager and a clear escalation path for incidents.',
          'Servicing on a predictable rhythm. Guests do not want to chase a cleaner. They want to know what happens on which day.',
        ],
      },
      {
        kind: 'callout',
        tone: 'info',
        title: 'Our standard',
        text: 'Every Heavenward Place residence is inspected against a fixed corporate-housing checklist before it is listed. Residences that cannot meet the power, connectivity and security standard are not listed at all.',
      },
      { kind: 'heading', level: 2, text: 'Why the first week is generous and the second is not' },
      {
        kind: 'paragraph',
        text: 'Hotels invest heavily in the arrival experience and almost nothing in the second week. Corporate housing inverts that. We treat check-in as a formality and spend the effort on the period when a guest actually needs the residence to perform — laundry, restocking, maintenance response, a chef when the working week gets compressed.',
      },
      {
        kind: 'paragraph',
        text: 'That is also why our long-stay benefits are tied to duration. From seven nights, pickup is arranged and private-chef meals are included, because at that point the guest has stopped treating the neighbourhood as unfamiliar and started needing it to work around them.',
      },
      { kind: 'rule' },
      {
        kind: 'paragraph',
        text: 'If you are housing a team in Lagos and want a specific arrangement designed around your programme, use the assisted search on our Stay page and tell us what you need. We will come back with what is actually available.',
      },
    ],
  },
  {
    id: 'post_2',
    slug: 'due-diligence-before-you-commit-funds',
    title: 'Due Diligence Before You Commit Funds to an Opportunity',
    excerpt:
      'A plain-language guide to the questions worth asking before money moves — and why the answers should arrive in writing.',
    category: 'investment-education',
    tags: ['Due Diligence', 'Education', 'Risk'],
    coverImage:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80',
    author: 'Heavenward Place',
    authorRole: 'Business & Investment Team',
    status: 'PUBLISHED',
    readingTimeMinutes: 7,
    seoTitle: 'Due Diligence Checklist Before Committing Funds | Heavenward Place',
    seoDescription:
      'A plain-language due-diligence guide: the questions to ask, the answers that should arrive in writing, and the warning signs worth stopping for.',
    publishedAt: '2026-08-04T09:00:00.000Z',
    body: [
      {
        kind: 'paragraph',
        text: 'Opportunity presentations are, by their nature, incomplete. They are designed to start a conversation, not to close one. The gap between the two is where due diligence lives, and most avoidable losses happen in that gap.',
      },
      { kind: 'heading', level: 2, text: 'Start with the structure, not the return' },
      {
        kind: 'paragraph',
        text: 'Ask what the structure actually is before asking what it produces. Where does the money go, who operates it, what are the reporting obligations, and what happens if it does not perform. If those four questions are answered clearly, the rest of the conversation is productive. If they are vague, no figure quoted afterwards should be relied upon.',
      },
      { kind: 'heading', level: 2, text: 'Require the answers in writing' },
      {
        kind: 'list',
        style: 'bullet',
        items: [
          'The definitive agreement, reviewed by your own lawyer, not only theirs.',
          'Verification of any asset, holding, title or title claim by an independent party.',
          'A clear statement of what happens to your capital if the venture fails.',
          'The fee structure, including anything payable to the party introducing the opportunity.',
        ],
      },
      {
        kind: 'callout',
        tone: 'warning',
        title: 'Heavenward Place does not manage your funds',
        text: 'Heavenward Place does not take custody of, hold, pool or manage customer investment funds through this website. We introduce opportunities and facilitate discussions. No returns are guaranteed, and no one should represent otherwise.',
      },
      { kind: 'heading', level: 2, text: 'Walk away from pressure' },
      {
        kind: 'paragraph',
        text: 'A legitimate opportunity survives a request for more time. Urgency, exclusivity framing, capped availability and "returning this once only" are all reasons to slow down rather than speed up.',
      },
      {
        kind: 'quote',
        text: 'If an opportunity cannot survive careful questioning, it is not an opportunity. It is a deadline.',
        attribution: 'Heavenward Place — Business & Investment Team',
      },
    ],
  },
  {
    id: 'post_3',
    slug: 'lagos-corporate-housing-demand-2026',
    title: 'Corporate Housing Demand in Lagos: What Changed in 2026',
    excerpt:
      'Longer assignments, tighter budgets and a much stronger expectation of service quality have reshaped how companies house staff in Lagos.',
    category: 'market-insights',
    tags: ['Lagos', 'Market', 'Corporate Housing'],
    coverImage:
      'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?auto=format&fit=crop&w=1600&q=80',
    author: 'Heavenward Place',
    authorRole: 'Market Insights',
    status: 'PUBLISHED',
    readingTimeMinutes: 5,
    seoTitle: 'Lagos Corporate Housing Market 2026 | Heavenward Place',
    seoDescription:
      'What changed in Lagos corporate housing demand through 2026: longer assignments, tighter budgets and higher service expectations.',
    publishedAt: '2026-07-22T09:00:00.000Z',
    body: [
      {
        kind: 'paragraph',
        text: 'Three patterns have held consistently across our 2026 booking data, and they are visible to any company housing staff in Lagos this year.',
      },
      {
        kind: 'list',
        style: 'numbered',
        items: [
          'Assignments are getting longer. A stay that was planned for three weeks is routinely extending past two months, which moves guests from short-let to serviced residential expectations almost immediately.',
          'Budgets are tighter but standards are not. Companies are negotiating harder on nightly rate while expecting the same—or better—servicing level.',
          'Location specificity has increased. Teams are now asking for a named area with a stated drive time to a specific office or airport terminal, not simply "somewhere central".',
        ],
      },
      { kind: 'heading', level: 2, text: 'What this means operationally' },
      {
        kind: 'paragraph',
        text: 'For a housing provider, the implication is that the middle of the market has moved. A guest who stays for eight weeks is no longer served well by either a hotel or a long-let lease. They need a residence that behaves like a home, with a service layer that behaves like hospitality.',
      },
      {
        kind: 'paragraph',
        text: 'We built Heavenward Place around that middle. Premium residences, published pricing, an availability calendar that is actually accurate, and long-stay benefits that apply automatically rather than as a negotiation.',
      },
      {
        kind: 'callout',
        tone: 'info',
        text: 'Booking behaviour is aggregated and anonymised for market insight purposes. No guest-identifying data is used for analytics.',
      },
    ],
  },
];

/** Category metadata for the Insights filter UI. */
export const insightCategories: Array<{ slug: InsightPost['category']; label: string; blurb: string }> = [
  { slug: 'hospitality', label: 'Hospitality', blurb: 'Service standards, hosting practice and the guest experience.' },
  { slug: 'corporate-housing', label: 'Corporate Housing', blurb: 'Housing teams, relocations and long assignments.' },
  { slug: 'business-opportunities', label: 'Business Opportunities', blurb: 'How curated business opportunities are structured.' },
  { slug: 'investment-education', label: 'Investment Education', blurb: 'Due diligence, risk and understanding structures.' },
  { slug: 'market-insights', label: 'Market Insights', blurb: 'Observations from our booking and enquiry data.' },
  { slug: 'real-estate', label: 'Real Estate', blurb: 'Property markets, residential and commercial.' },
  { slug: 'business-lifestyle', label: 'Business Lifestyle', blurb: 'Working and living well while travelling for business.' },
  { slug: 'company-updates', label: 'Company Updates', blurb: 'News from Heavenward Place.' },
];

export function getPost(slug: string) {
  return insightPosts.find((p) => p.slug === slug && p.status === 'PUBLISHED');
}

export function latestPosts(limit = 3) {
  return [...insightPosts]
    .filter((p) => p.status === 'PUBLISHED')
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
    .slice(0, limit);
}
