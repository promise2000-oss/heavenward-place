import type { Metadata } from 'next';
import { buildMetadata, breadcrumbJsonLd } from '@/lib/seo';
import { Container, Section, SectionHeading, Badge } from '@/components/ui/primitives';
import { Reveal, Stagger, StaggerItem, Parallax } from '@/components/motion/Motion';
import { BUSINESS_SERVICES } from '@/data/site';
import { OPPORTUNITY_ICONS } from '@/components/ui/icons';
import { opportunityCategories } from '@/data/opportunities';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from '@/components/ui/primitives';
import { PageHeader } from '@/components/layout/PageHeader';

export const metadata: Metadata = buildMetadata({
  title: 'About Heavenward Place',
  path: '/about',
  description:
    'Who we are, our vision and mission, our hospitality services, and how the Business & Investment opportunity concept works. Elegant, modern, trustworthy, welcoming.',
  keywords: [
    'about Heavenward Place',
    'corporate housing company Lagos',
    'premium serviced apartments Nigeria',
    'business opportunity discovery Nigeria',
  ],
});

const VISION =
  'To become a trusted global platform where comfort, corporate hospitality and opportunity access converge, creating premium living experiences while connecting individuals, companies and investors to valuable business and investment opportunities.';

const MISSION =
  'To consistently deliver exceptional corporate housing solutions through comfort, security and personalized services, while building a trusted ecosystem that connects businesses, investors and high-net-worth individuals to selected opportunities and growth prospects.';

const PHILOSOPHY = [
  {
    title: 'Elegant',
    description:
      'Restraint and precision in everything we present — the residences we choose, the language we use and the way we handle a request.',
  },
  {
    title: 'Modern',
    description:
      'A current, digital-first experience with published pricing, live availability and self-service booking, backed by people who answer.',
  },
  {
    title: 'Trustworthy',
    description:
      'Published rates, verified identity, role-restricted access to guest records, and an immutable log of sensitive administrative actions.',
  },
  {
    title: 'Welcoming',
    description:
      'From the first enquiry to the day you leave, one relationship — a team that knows your booking rather than a queue.',
  },
  {
    title: 'Forward-looking',
    description:
      'Architecture built so a mobile app, an AI support assistant and richer integrations extend the same secure APIs rather than replace them.',
  },
];

const AUDIENCE = [
  'Corporate clients and organizations accommodating employees, executives, consultants, auditors and visiting partners.',
  'Business owners and entrepreneurs seeking quality accommodation, business connections and selected opportunities.',
  'Investors and high-net-worth individuals exploring alternative business and investment opportunities.',
  'Cooperatives, investment clubs and other organized groups seeking selected opportunities for their members.',
  'International visitors and expatriates seeking secure, comfortable and professionally managed accommodation.',
  'Individuals seeking premium shortlet accommodation and lifestyle services.',
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About Heavenward Place"
        title="More Than A Place, It’s A Higher Calling."
        intro="Heavenward Place is a corporate housing and lifestyle solutions company providing secure, comfortable and premium accommodation experiences — and a trusted gateway connecting clients to carefully selected business and investment opportunities."
        image="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2200&q=80"
        breadcrumbs={[{ name: 'Home', url: '/' }, { name: 'About', url: '/about' }]}
      />

      {/* Who we are */}
      <Section tone="white">
        <Container className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SectionHeading lead eyebrow="Who We Are" title="Two connected offerings, one standard" />
            <div className="mt-8 flex flex-col gap-6 text-[1rem] leading-relaxed text-slate-700">
              <p>
                We are a hospitality business first. Everything about how we operate — the
                residences we accept, the pricing we publish, the way we handle a booking that
                goes wrong — is built around a simple claim: a corporate guest should not have to
                think about their accommodation while they are thinking about their work.
              </p>
              <p>
                Alongside that, we act as a gateway to selected business and investment
                opportunities. We do this carefully and within clear limits. We introduce, we
                explain, we facilitate discussion, and we make ourselves useful — but we do not
                hold, pool or manage customer funds, we do not run an open marketplace, and we
                never state or imply guaranteed returns.
              </p>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              <div className="border border-black bg-black p-7">
                <p className="eyebrow text-[#FF9800]">— Vision</p>
                <p className="mt-5 text-[0.92rem] leading-relaxed text-slate-200">{VISION}</p>
              </div>
              <div className="border border-black p-7">
                <p className="eyebrow text-black">— Mission</p>
                <p className="mt-5 text-[0.92rem] leading-relaxed text-slate-700">{MISSION}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <Reveal>
              <Parallax distance={40} className="aspect-[4/5]">
                <Image
                  src="https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1000&q=80"
                  alt="Executive apartment interior with skyline view"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </Parallax>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="mt-5 border-l-[3px] border-[#FF9800] bg-cream-soft p-6">
                <p className="font-label text-[9.5px] tracking-[0.26em] text-[#e08600]">
                  BRAND PERSONALITY
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {['Elegant', 'Modern', 'Trustworthy', 'Welcoming', 'Premium', 'Secure', 'Forward-looking'].map(
                    (t) => (
                      <li key={t}>
                        <Badge tone="outline">{t}</Badge>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Philosophy */}
      <Section tone="black">
        <div className="grid-texture-dark absolute inset-0 opacity-70" aria-hidden="true" />
        <Container className="relative">
          <SectionHeading
            tone="light"
            eyebrow="Brand Philosophy"
            rule
            title="Five words that decide how we work"
            intro="These are not decoration. They are the criteria we apply when we choose a residence, write a message, or handle a difficult request."
          />
          <Stagger className="mt-14 grid gap-px bg-white/12 sm:grid-cols-2 lg:grid-cols-5" stagger={0.08}>
            {PHILOSOPHY.map((item, index) => (
              <StaggerItem key={item.title} y={14}>
                <div className="h-full bg-black p-7">
                  <span className="font-display text-4xl text-[#FF9800]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-5 font-heading text-[1rem] font-extrabold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[0.85rem] leading-relaxed text-slate-400">
                    {item.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* Hospitality services */}
      <Section tone="white">
        <Container className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <SectionHeading
              eyebrow="What We Do"
              title="Hospitality services"
              display
              intro="Our primary offering: secure, comfortable and premium shortlet accommodation, purpose-built for corporate clients, business travellers, expatriates and individuals."
            />
            <Stagger className="mt-10 flex flex-col gap-5" stagger={0.08}>
              {[
                {
                  title: 'Corporate housing & shortlet accommodation',
                  description:
                    'Serviced residences for companies, executives, consultants, auditors, investors and visiting personnel — with options suited to both short and extended stays.',
                },
                {
                  title: 'Concierge services',
                  description:
                    'All applicable concierge services on request, during the booking process or after check-in, handled by one team that knows your booking.',
                },
                {
                  title: 'Airport / preferred-location pickup',
                  description:
                    'Pickup from the airport, your preferred location or an agreed pickup point. Complimentary on stays of 7 nights or more; a paid add-on for shorter stays.',
                },
                {
                  title: 'Premium private chef service',
                  description:
                    'A private chef preparing breakfast, lunch or dinner in your residence. Three meals per week are complimentary on 7+ night stays, maximum one per day; anything beyond is a paid service.',
                },
              ].map((service) => (
                <StaggerItem key={service.title} y={14}>
                  <div className="edge-orange border border-slate-200 p-6">
                    <h3 className="font-heading text-[1rem] font-extrabold text-black">
                      {service.title}
                    </h3>
                    <p className="mt-2.5 text-[0.88rem] leading-relaxed text-slate-600">
                      {service.description}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
            <div className="mt-9">
              <Link
                href="/stay"
                className="group inline-flex items-center gap-2.5 border border-[#FF9800] bg-[#FF9800] px-8 py-4 font-label text-xs tracking-[0.2em] text-black transition-colors duration-400 hover:bg-transparent hover:text-[#FF9800]"
              >
                EXPLORE RESIDENCES
                <ArrowRight className="transition-transform duration-400 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <SectionHeading
              eyebrow="What We Do"
              title="Business services"
              display
              intro="Alongside hospitality, we provide advisory support to businesses and investors. These are professional services — they are separate from, and not offered as, investment categories."
            />
            <Stagger className="mt-10 flex flex-col gap-5" stagger={0.08}>
              {BUSINESS_SERVICES.map((service) => (
                <StaggerItem key={service.title} y={14}>
                  <div className="border border-black p-6">
                    <h3 className="font-heading text-[1rem] font-extrabold text-black">
                      {service.title}
                    </h3>
                    <p className="mt-2.5 text-[0.88rem] leading-relaxed text-slate-600">
                      {service.description}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
            <Reveal delay={0.15}>
              <div className="mt-6 border-l-[3px] border-black bg-cream p-6">
                <p className="text-[0.85rem] leading-relaxed text-slate-700">
                  <strong className="font-bold text-black">A note on how we present these.</strong>{' '}
                  Financial Consulting, Corporate Advisory and Strategic Planning are business
                  services, not investment products. They are not part of the six opportunity
                  categories, and engaging them does not commit you to any opportunity.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Business & investment concept */}
      <Section tone="cream-soft">
        <Container>
          <SectionHeading
            eyebrow="The Concept"
            title="Business & Investment Opportunities"
            intro="A curated opportunity-discovery service, presented with clarity about both what it is and what it is not."
            align="center"
          />

          <Stagger className="mt-14 grid gap-px bg-slate-200 sm:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
            {opportunityCategories.map((category) => {
              const Icon = OPPORTUNITY_ICONS[category.icon];
              return (
                <StaggerItem key={category.slug} y={12}>
                  <Link
                    href={`/opportunities/${category.slug}`}
                    className="group flex h-full flex-col bg-white p-7 transition-colors duration-400 hover:bg-cream"
                  >
                    <span className="flex h-11 w-11 items-center justify-center border border-[#FF9800] text-black transition-colors duration-400 group-hover:bg-[#FF9800]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-5 font-heading text-[0.98rem] font-extrabold leading-snug text-black">
                      {category.name}
                    </h3>
                    <p className="mt-2.5 flex-1 text-[0.85rem] leading-relaxed text-slate-600">
                      {category.shortDescription}
                    </p>
                  </Link>
                </StaggerItem>
              );
            })}
          </Stagger>

          <Reveal delay={0.1}>
            <div className="mt-10 border border-black bg-black p-8 sm:p-10">
              <p className="eyebrow text-[#FF9800]">— How this works</p>
              <p className="mt-5 max-w-4xl text-pretty text-[1rem] leading-relaxed text-slate-200">
                You register your interest, we review it against your stated interest, capital
                range, geographic preference and area, and a representative responds — often with
                a curated selection of residences relevant to a visit, and an invitation to a
                consultation. Detailed documentation, terms and any arrangement are handled
                privately through that conversation. Participation occurs only under the applicable
                opportunity structure and agreement.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/opportunities"
                  className="inline-flex items-center gap-2.5 border border-[#FF9800] px-7 py-3.5 font-label text-[10.5px] tracking-[0.2em] text-[#FF9800] transition-colors duration-400 hover:bg-[#FF9800] hover:text-black"
                >
                  EXPLORE OPPORTUNITIES
                </Link>
                <Link
                  href="/legal/opportunity-disclaimer"
                  className="inline-flex items-center gap-2.5 border border-white/40 px-7 py-3.5 font-label text-[10.5px] tracking-[0.2em] text-white transition-colors duration-400 hover:border-white hover:bg-white hover:text-black"
                >
                  FULL DISCLAIMER
                </Link>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* Who we serve */}
      <Section tone="white">
        <Container className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="Who We Serve"
              rule
              title="Six audiences, one standard of service"
              intro="We are built for guests whose time is expensive and whose trust is not."
            />
          </div>
          <div className="lg:col-span-7">
            <Stagger className="grid gap-4 sm:grid-cols-2" stagger={0.06}>
              {AUDIENCE.map((item, index) => (
                <StaggerItem key={item} y={10}>
                  <div className="flex h-full gap-4 border border-slate-200 p-5">
                    <span className="font-display text-2xl text-[#FF9800]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <p className="text-[0.88rem] leading-relaxed text-slate-700">{item}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </Container>
      </Section>

      {/* Trust */}
      <Section tone="black">
        <div className="grid-texture-dark absolute inset-0 opacity-70" aria-hidden="true" />
        <Container className="relative">
          <SectionHeading
            tone="light"
            eyebrow="Trust & Professionalism"
            lead
            title="Where trust is enforced, not promised"
            align="center"
          />
          <div className="mx-auto mt-14 grid max-w-4xl gap-5 sm:grid-cols-2">
            {[
              {
                title: 'Published pricing',
                body: 'The rate you see is the rate you are charged. There is no negotiation step and no figure added after payment.',
              },
              {
                title: 'Verified identity',
                body: 'Guest identity is verified before check-in. Records are encrypted, private and visible only to role-authorised staff — and every view is logged.',
              },
              {
                title: 'No custody of funds',
                body: 'Heavenward Place does not take custody of, hold, pool or manage customer investment funds through this website.',
              },
              {
                title: 'No guaranteed returns',
                body: 'Never stated, never implied, and screened out of any copy entered into the platform.',
              },
            ].map((item) => (
              <div key={item.title} className="border-l-[3px] border-[#FF9800] pl-5">
                <h3 className="font-heading text-[0.98rem] font-extrabold text-white">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-[0.87rem] leading-relaxed text-slate-400">{item.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: 'Home', url: '/' },
              { name: 'About', url: '/about' },
            ]),
          ),
        }}
      />
    </>
  );
}
