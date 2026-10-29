'use client';

import Link from 'next/link';
import { Badge, Container, Section, SectionHeading } from '@/components/ui/primitives';
import { ArrowIcon, MapIcon } from './opportunity-ui';
import { PhoneIcon } from '@/components/ui/icons';
import { SITE } from '@/data/site';
import { publishedBusinessOpportunities } from '@/data/business-opportunities';
import type { BusinessOpportunity } from '@/data/types';

/**
 * The BUSINESS journey catalogue (PRD §1.2, §2).
 *
 * Shown only inside `/opportunities/business`, and only after the disclaimer has
 * been acknowledged. It presents business opportunities — a separate category
 * from the six investment categories — and never mixes investment opportunities
 * into this journey.
 *
 * Every listing explains the defined roles: the customer/client and Heavenward
 * Place’s business associates facilitate the business together, and Heavenward
 * Place itself has a defined role. No listing promises perpetual high profit or
 * a guaranteed return.
 */
export function BusinessContent() {
  const rows = publishedBusinessOpportunities();

  return (
    <>
      {/* Positioning */}
      <Section tone="white">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-5">
              <SectionHeading
                eyebrow="Business Opportunities"
                title="Run a business, with defined roles on every side."
                intro="Business Opportunities are openings we add and update as they arise — based on market openings, customer demand, operating seasons and cash-flow potential. In this model the customer and Heavenward Place’s business associates facilitate the business together, each performing a different role."
              />
            </div>
            <div className="lg:col-span-7">
              <div className="grid gap-px bg-slate-200 sm:grid-cols-2">
                <div className="bg-white p-7">
                  <p className="font-label text-[9.5px] tracking-[0.24em] text-[#12805c]">HOW THIS WORKS</p>
                  <ul className="mt-4 flex flex-col gap-3">
                    {[
                      'Each listing has a defined role for Heavenward Place',
                      'The customer/client and Heavenward Place’s associates each play a different part',
                      'Listings may be short-term or long-term, and change as openings arise',
                      'Detailed responsibilities, costs, risks, duration and terms are agreed privately',
                    ].map((item) => (
                      <li key={item} className="flex gap-2.5 text-[0.87rem] leading-relaxed text-slate-700">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-[#12805c]" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white p-7">
                  <p className="font-label text-[9.5px] tracking-[0.24em] text-[#c02626]">WHAT WE PROMISE — AND DO NOT</p>
                  <ul className="mt-4 flex flex-col gap-3">
                    {[
                      'We do not promise that a business will generate high profits indefinitely',
                      'We do not guarantee any particular return, margin or income',
                      'We do not take custody of, hold, pool or manage customer funds',
                      'Any return depends on execution, market conditions and the applicable agreement',
                    ].map((item) => (
                      <li key={item} className="flex gap-2.5 text-[0.87rem] leading-relaxed text-slate-700">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-[#c02626]" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <p className="mt-6 text-[0.85rem] leading-relaxed text-slate-500">
                Looking for an Investment Opportunity instead?{' '}
                <Link href="/opportunities/investment" className="link-underline-hover font-semibold text-black">
                  Explore the Investment journey
                </Link>
                .
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Listings */}
      <Section tone="cream-soft">
        <Container>
          <SectionHeading
            eyebrow="Currently Open"
            display
            title="Business opportunities"
            intro="Each listing sets out who does what. Detailed responsibilities, costs, risks, duration and commercial terms are discussed privately and recorded in the applicable agreement."
          />

          <div className="mt-14 flex flex-col gap-8">
            {rows.map((opportunity) => (
              <BusinessCard key={opportunity.slug} opportunity={opportunity} />
            ))}
          </div>

          <div className="mt-10 border border-slate-200 bg-white p-7 text-center">
            <p className="text-[0.95rem] leading-relaxed text-slate-700">
              Business openings change as suitable opportunities arise. If none of these fit right now,
              register your interest and we will reach out when something matching comes up.
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

function BusinessCard({ opportunity }: { opportunity: BusinessOpportunity }) {
  return (
    <article className="border border-slate-200 bg-white transition-shadow duration-400 hover:shadow-[0_24px_60px_-40px_rgba(0,0,0,0.4)]">
      <span className="block h-[3px] w-full bg-[#FF9800]" aria-hidden="true" />
      <div className="p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge tone="orange">Business Opportunity</Badge>
              <Badge tone="outline">{opportunity.durationLabel}</Badge>
            </div>

            <h3 className="mt-4 text-balance text-xl font-extrabold leading-snug text-black sm:text-[1.4rem]">
              <Link href={`/opportunities/business/${opportunity.slug}`} className="link-underline-hover">
                {opportunity.title}
              </Link>
            </h3>

            <p className="mt-3 text-[0.92rem] leading-relaxed text-slate-600">{opportunity.summary}</p>

            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="font-label text-[8.5px] tracking-[0.22em] text-slate-500">LOCATION / MARKET</dt>
                <dd className="mt-1.5 flex items-start gap-1.5 text-[0.85rem] text-slate-700">
                  <MapIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#FF9800]" />
                  {opportunity.locationMarket}
                </dd>
              </div>
              <div>
                <dt className="font-label text-[8.5px] tracking-[0.22em] text-slate-500">EXPECTED DURATION</dt>
                <dd className="mt-1.5 text-[0.85rem] leading-relaxed text-slate-700">{opportunity.durationLabel}</dd>
              </div>
            </dl>

            <div className="mt-6 border-l-[3px] border-[#c02626] bg-[#c02626]/[0.04] p-4">
              <p className="font-label text-[8.5px] tracking-[0.22em] text-[#c02626]">KEY CONSIDERATION / RISK NOTICE</p>
              <p className="mt-2 text-[0.83rem] leading-relaxed text-slate-700">{opportunity.riskNotice}</p>
            </div>
          </div>

          <div className="flex shrink-0 flex-col gap-3 lg:w-56">
            <Link
              href={`/opportunities/business/${opportunity.slug}`}
              className="group inline-flex items-center justify-center gap-2.5 border border-[#FF9800] bg-[#FF9800] px-6 py-3.5 font-label text-[10px] tracking-[0.2em] text-black transition-colors duration-400 hover:bg-transparent hover:text-[#FF9800]"
            >
              FULL DETAIL
              <ArrowIcon className="transition-transform duration-400 group-hover:translate-x-1" />
            </Link>
            <Link
              href="#interest"
              className="inline-flex items-center justify-center gap-2.5 border border-black px-6 py-3.5 font-label text-[10px] tracking-[0.2em] text-black transition-colors duration-400 hover:bg-black hover:text-white"
            >
              ENQUIRE
            </Link>
          </div>
        </div>

        <div className="mt-7 grid gap-px border-t border-slate-200 bg-slate-200 sm:grid-cols-3">
          <RoleCell label="HEAVENWARD PLACE'S ROLE" text={opportunity.heavenwardRole} />
          <RoleCell label="YOUR ROLE (CUSTOMER / CLIENT)" text={opportunity.customerRole} />
          <RoleCell label="OUR ASSOCIATES' ROLE" text={opportunity.associateRole} />
        </div>
      </div>
    </article>
  );
}

export function RoleCell({ label, text }: { label: string; text: string }) {
  return (
    <div className="bg-white p-5">
      <p className="font-label text-[8.5px] tracking-[0.2em] text-[#e08600]">{label}</p>
      <p className="mt-2.5 text-[0.84rem] leading-relaxed text-slate-700">{text}</p>
    </div>
  );
}
