'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Badge, Container, Section, SectionHeading } from '@/components/ui/primitives';
import { OPPORTUNITY_ICONS, ArrowIcon, LockIcon, MapIcon } from './opportunity-ui';
import { PhoneIcon } from '@/components/ui/icons';
import { SITE } from '@/data/site';
import { opportunityCategories, opportunities } from '@/data/opportunities';
import { track } from '@/lib/analytics';

/**
 * Opportunity catalogue — shown only after the disclaimer has been acknowledged.
 */
export function OpportunityContent() {
  const [kind, setKind] = useState<'ALL' | 'BUSINESS' | 'INVESTMENT'>('ALL');

  const categories = opportunityCategories.filter(
    (c) => kind === 'ALL' || c.kind === 'BOTH' || c.kind === kind,
  );

  const rows = opportunities.filter(
    (o) => o.status === 'PUBLISHED' && (kind === 'ALL' || o.kind === 'BOTH' || o.kind === kind),
  );

  return (
    <>
      {/* Positioning */}
      <Section tone="white">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-5">
              <SectionHeading
                eyebrow="What This Is"
                title="Opportunity discovery. Not a marketplace."
                intro="This is a curated introduction service. It is designed to start a conversation with people whose interest, capital range and geography actually match a selected opportunity — not to transact publicly at scale."
              />
            </div>
            <div className="lg:col-span-7">
              <div className="grid gap-px bg-slate-200 sm:grid-cols-2">
                <div className="bg-white p-7">
                  <p className="font-label text-[9.5px] tracking-[0.24em] text-[#12805c]">
                    WHAT WE DO
                  </p>
                  <ul className="mt-4 flex flex-col gap-3">
                    {[
                      'Identify and present selected opportunities at a high level',
                      'Capture a short expression of interest',
                      'Review the interest and respond personally',
                      'Arrange a discussion, a consultation and, where useful, a visit with curated accommodation',
                      'Handle documentation, terms and any arrangement privately',
                    ].map((item) => (
                      <li key={item} className="flex gap-2.5 text-[0.87rem] leading-relaxed text-slate-700">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-[#12805c]" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white p-7">
                  <p className="font-label text-[9.5px] tracking-[0.24em] text-[#c02626]">
                    WHAT WE DO NOT DO
                  </p>
                  <ul className="mt-4 flex flex-col gap-3">
                    {[
                      'We do not take custody of, hold, pool or manage customer investment funds',
                      'We are not a public investment marketplace or an investment portal',
                      'We do not state or imply guaranteed returns, risk-free investment, guaranteed margins or guaranteed income',
                      'We do not publish investment documents as public downloads',
                      'We do not approve participation or make binding decisions',
                    ].map((item) => (
                      <li key={item} className="flex gap-2.5 text-[0.87rem] leading-relaxed text-slate-700">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-[#c02626]" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Interest type filter */}
      <Section tone="black" className="!py-0">
        <Container className="py-14">
          <p className="eyebrow text-[#FF9800]">— Choose your interest</p>
          <h2 className="mt-5 text-balance text-2xl font-extrabold text-white sm:text-3xl">
            Business Opportunity or Investment Opportunity
          </h2>
          <p className="mt-4 max-w-3xl text-[0.95rem] leading-relaxed text-slate-300">
            One combined profile and one combined form. Select the type that best describes what
            you are looking for — the categories below adjust to match, and you can submit interest
            in either or both.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            {(
              [
                { value: 'ALL', label: 'Show everything' },
                { value: 'BUSINESS', label: 'Business Opportunity' },
                { value: 'INVESTMENT', label: 'Investment Opportunity' },
              ] as const
            ).map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setKind(option.value)}
                aria-pressed={kind === option.value}
                className={`border px-6 py-3.5 font-label text-[10.5px] tracking-[0.2em] transition-colors duration-400 ${
                  kind === option.value
                    ? 'border-[#FF9800] bg-[#FF9800] text-black'
                    : 'border-white/40 text-white hover:border-white'
                }`}
              >
                {option.label.toUpperCase()}
              </button>
            ))}
          </div>
        </Container>
      </Section>

      {/* Categories */}
      <Section tone="cream-soft">
        <Container>
          <SectionHeading
            eyebrow="Six Categories"
            title="Where the opportunities sit"
            intro="Each category is presented with its short description, and every individual opportunity carries a mandatory key-consideration notice."
          />

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const Icon = OPPORTUNITY_ICONS[category.icon];
              const count = rows.filter((o) => o.categorySlug === category.slug).length;
              return (
                <article
                  key={category.slug}
                  className="edge-orange flex h-full flex-col border border-slate-200 bg-white p-7"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex h-12 w-12 items-center justify-center border border-[#FF9800] text-black">
                      <Icon className="h-5.5 w-5.5" />
                    </span>
                    <span className="font-display text-2xl text-slate-200">
                      {String(category.order).padStart(2, '0')}
                    </span>
                  </div>

                  <h3 className="mt-6 font-heading text-[1.05rem] font-extrabold leading-snug text-black">
                    <Link
                      href={`/opportunities/${category.slug}`}
                      className="link-underline-hover"
                    >
                      {category.name}
                    </Link>
                  </h3>
                  <p className="mt-3 flex-1 text-[0.88rem] leading-relaxed text-slate-600">
                    {category.shortDescription}
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-2">
                    <Badge tone="outline">
                      {category.kind === 'BOTH'
                        ? 'Business & Investment'
                        : category.kind === 'BUSINESS'
                          ? 'Business'
                          : 'Investment'}
                    </Badge>
                    <Badge tone="muted">
                      {count} {count === 1 ? 'opportunity' : 'opportunities'}
                    </Badge>
                  </div>

                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <p className="text-[0.76rem] font-semibold uppercase tracking-wide text-[#c02626]">
                      Key consideration
                    </p>
                    <p className="mt-2 line-clamp-3 text-[0.79rem] leading-relaxed text-slate-600">
                      {category.riskNotice}
                    </p>
                  </div>

                  <Link
                    href={`/opportunities/${category.slug}`}
                    className="group mt-5 inline-flex items-center gap-2.5 border border-black px-5 py-3 font-label text-[9.5px] tracking-[0.2em] text-black transition-colors duration-400 hover:bg-black hover:text-white"
                  >
                    VIEW CATEGORY
                    <ArrowIcon className="transition-transform duration-400 group-hover:translate-x-1" />
                  </Link>
                </article>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* Opportunity list */}
      <Section tone="white">
        <Container>
          <SectionHeading
            eyebrow="Currently Presented"
            title="Selected opportunities"
            intro="High-level information only, and deliberately so. Nothing here is complete, independently verified by us, or investment, legal or tax advice."
          />

          <div className="mt-14 flex flex-col gap-6">
            {rows.map((opportunity) => {
              const category = opportunityCategories.find(
                (c) => c.slug === opportunity.categorySlug,
              );
              return (
                <article
                  key={opportunity.slug}
                  className="border border-slate-200 bg-white p-6 transition-shadow duration-400 hover:shadow-[0_24px_60px_-40px_rgba(0,0,0,0.4)] sm:p-8"
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <Badge tone="orange">{category?.name ?? 'Opportunity'}</Badge>
                        <Badge tone="outline">
                          {opportunity.kind === 'BOTH'
                            ? 'Business & Investment'
                            : opportunity.kind === 'BUSINESS'
                              ? 'Business'
                              : 'Investment'}
                        </Badge>
                      </div>

                      <h3 className="mt-4 text-balance text-xl font-extrabold leading-snug text-black sm:text-[1.4rem]">
                        <Link href={`/opportunities/${opportunity.slug}`} className="link-underline-hover">
                          {opportunity.title}
                        </Link>
                      </h3>

                      <p className="mt-3 text-[0.92rem] leading-relaxed text-slate-600">
                        {opportunity.summary}
                      </p>

                      <dl className="mt-6 grid gap-4 sm:grid-cols-3">
                        <div>
                          <dt className="font-label text-[8.5px] tracking-[0.22em] text-slate-500">
                            LOCATION / MARKET
                          </dt>
                          <dd className="mt-1.5 flex items-start gap-1.5 text-[0.85rem] text-slate-700">
                            <MapIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#FF9800]" />
                            {opportunity.locationMarket}
                          </dd>
                        </div>
                        <div>
                          <dt className="font-label text-[8.5px] tracking-[0.22em] text-slate-500">
                            BASIC STRUCTURE
                          </dt>
                          <dd className="mt-1.5 text-[0.85rem] leading-relaxed text-slate-700">
                            {opportunity.structure}
                          </dd>
                        </div>
                        <div>
                          <dt className="font-label text-[8.5px] tracking-[0.22em] text-slate-500">
                            INDICATIVE CAPITAL RANGE
                          </dt>
                          <dd className="mt-1.5 text-[0.85rem] font-semibold text-black">
                            {opportunity.capitalRangeLabel}
                          </dd>
                        </div>
                      </dl>

                      <div className="mt-6 border-l-[3px] border-[#c02626] bg-[#c02626]/[0.04] p-4">
                        <p className="font-label text-[8.5px] tracking-[0.22em] text-[#c02626]">
                          KEY CONSIDERATION / RISK NOTICE
                        </p>
                        <p className="mt-2 text-[0.83rem] leading-relaxed text-slate-700">
                          {opportunity.riskNotice}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-col gap-3 lg:w-56">
                      <Link
                        href={`/opportunities/${opportunity.slug}`}
                        className="group inline-flex items-center justify-center gap-2.5 border border-[#FF9800] bg-[#FF9800] px-6 py-3.5 font-label text-[10px] tracking-[0.2em] text-black transition-colors duration-400 hover:bg-transparent hover:text-[#FF9800]"
                      >
                        FULL DETAIL
                        <ArrowIcon className="transition-transform duration-400 group-hover:translate-x-1" />
                      </Link>
                      <a
                        href="#interest"
                        onClick={() =>
                          track('interest_type_selected', {
                            source: 'opportunity_card',
                            category: opportunity.categorySlug,
                          })
                        }
                        className="inline-flex items-center justify-center gap-2.5 border border-black px-6 py-3.5 font-label text-[10px] tracking-[0.2em] text-black transition-colors duration-400 hover:bg-black hover:text-white"
                      >
                        ENQUIRE
                      </a>
                      <p className="flex items-start gap-2 text-[0.74rem] leading-relaxed text-slate-500">
                        <LockIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        Detailed documentation is not a public download. It is shared through a
                        controlled follow-up process.
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-10 border border-slate-200 bg-cream-soft p-7 text-center">
            <p className="text-[0.95rem] leading-relaxed text-slate-700">
              Interested in something here? Tell us which and a member of the team will come back
              with the detail, the structure and an honest read on whether it suits you.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="#interest"
                className="inline-flex items-center justify-center border border-[#FF9800] bg-[#FF9800] px-7 py-3.5 font-label text-[10.5px] tracking-[0.2em] text-black transition-colors duration-400 hover:bg-transparent hover:text-[#FF9800]"
              >
                REGISTER INTEREST
              </Link>
              <a
                href={`tel:${SITE.contact.phoneHref}`}
                className="inline-flex items-center justify-center gap-2.5 border border-black px-7 py-3.5 font-label text-[10.5px] tracking-[0.2em] text-black transition-colors duration-400 hover:bg-black hover:text-white"
              >
                <PhoneIcon className="h-4 w-4" />
                {SITE.contact.phone}
              </a>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

