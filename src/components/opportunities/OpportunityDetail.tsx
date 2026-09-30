'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Alert, Badge, Button, Container, Section, SectionHeading } from '@/components/ui/primitives';
import { OPPORTUNITY_ICONS, ArrowIcon, DocumentIcon, LockIcon, MapIcon } from './opportunity-ui';
import { InterestForm } from './InterestForm';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Motion';
import { track } from '@/lib/analytics';
import type { OpportunityCategory, Opportunity } from '@/data/types';

interface OpportunityRow {
  slug: string;
  title: string;
  summary: string;
  locationMarket?: string;
  structure?: string;
  capitalRangeLabel?: string;
  riskNotice: string;
  kind: 'BUSINESS' | 'INVESTMENT' | 'BOTH';
  imageUrl?: string;
}

function kindLabel(kind: 'BUSINESS' | 'INVESTMENT' | 'BOTH') {
  return kind === 'BOTH' ? 'Business & Investment' : kind === 'BUSINESS' ? 'Business' : 'Investment';
}

/** Category detail view. */
export function OpportunityDetailCategoryView({
  category,
  opportunities,
  disclaimerVersion,
}: {
  category: OpportunityCategory;
  opportunities: OpportunityRow[];
  disclaimerVersion: number;
}) {
  const Icon = OPPORTUNITY_ICONS[category.icon];
  return (
    <>
      <section className="section-black grid-texture-dark">
        <Container className="py-16 sm:py-20">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 font-label text-[9px] tracking-[0.24em] text-white/55">
              <li>
                <Link href="/" className="hover:text-[#FF9800]">
                  HOME
                </Link>
              </li>
              <li className="text-[#FF9800]" aria-hidden="true">
                /
              </li>
              <li>
                <Link href="/opportunities" className="hover:text-[#FF9800]">
                  OPPORTUNITIES
                </Link>
              </li>
              <li className="text-[#FF9800]" aria-hidden="true">
                /
              </li>
              <li className="text-white/90">{category.name.toUpperCase()}</li>
            </ol>
          </nav>

          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <span className="flex h-14 w-14 items-center justify-center border border-[#FF9800] text-[#FF9800]">
                <Icon className="h-7 w-7" />
              </span>
              <p className="eyebrow mt-8 text-[#FF9800]">— Category {String(category.order).padStart(2, '0')}</p>
              <h1 className="mt-5 text-balance font-display text-3xl leading-tight text-white sm:text-5xl">
                {category.name}
              </h1>
              <p className="mt-6 max-w-2xl text-[1rem] leading-relaxed text-slate-300">
                {category.shortDescription}
              </p>
              <div className="mt-7 flex flex-wrap gap-2.5">
                <Badge tone="orange">{kindLabel(category.kind)}</Badge>
                <Badge tone="outline">
                  {opportunities.length} {opportunities.length === 1 ? 'opportunity' : 'opportunities'}
                </Badge>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={category.imageUrl}
                  alt={category.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Section tone="white">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <SectionHeading eyebrow="About This Category" title="What this category covers" />
              <div className="mt-7 flex flex-col gap-5 text-[0.98rem] leading-relaxed text-slate-700">
                {category.description.split('\n\n').map((p) => (
                  <p key={p.slice(0, 40)} className="text-pretty">
                    {p}
                  </p>
                ))}
              </div>

              <div className="mt-9 border-l-[3px] border-[#c02626] bg-[#c02626]/[0.04] p-6">
                <p className="font-label text-[9.5px] tracking-[0.24em] text-[#c02626]">
                  KEY CONSIDERATION / RISK NOTICE
                </p>
                <p className="mt-3.5 text-[0.92rem] leading-relaxed text-slate-700">
                  {category.riskNotice}
                </p>
              </div>
            </div>

            <div className="lg:col-span-5">
              <Alert tone="warning" title="Before you enquire">
                Opportunity information is presented at a high level to support an initial decision
                about whether to proceed. It is not complete, is not independently verified by us,
                and is not investment, legal or tax advice. Obtain independent professional advice
                before acting.
              </Alert>
              <div className="mt-6 flex items-start gap-3 border border-slate-200 p-5">
                <LockIcon className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#FF9800]" />
                <p className="text-[0.86rem] leading-relaxed text-slate-600">
                  Detailed investment documents are not published as public downloads. Where
                  relevant, they are provided physically or through a controlled follow-up process.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="cream-soft">
        <Container>
          <SectionHeading
            eyebrow="Opportunities"
            title={`${category.name} — currently presented`}
            intro="Each opportunity is shown with its structure, indicative capital range and key consideration."
          />
          <div className="mt-14 flex flex-col gap-6">
            {opportunities.map((o, index) => (
              <Reveal key={o.slug} delay={Math.min(index, 4) * 0.06}>
                <OpportunityRowCard opportunity={o} />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="white" id="interest">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="Register Your Interest"
              title="Interested in this category?"
              intro="One short form. A representative reviews your interest, capital range, geographic preference and area, and responds personally."
            />
          </div>
          <div className="lg:col-span-7 xl:col-span-8">
            <InterestForm
              disclaimerVersion={disclaimerVersion}
              defaultArea={category.slug.toUpperCase().replace(/-/g, '_')}
            />
          </div>
        </Container>
      </Section>
    </>
  );
}

/** Individual opportunity detail view. */
export function OpportunityDetailOpportunityView({
  opportunity,
  related,
  disclaimerVersion,
}: {
  opportunity: OpportunityRow & {
    description: string;
    categorySlug: string;
    categoryName: string;
  };
  related: Array<{ slug: string; title: string; summary: string; riskNotice: string }>;
  disclaimerVersion: number;
}) {
  return (
    <>
      <section className="section-black grid-texture-dark">
        <Container className="py-16 sm:py-20">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 font-label text-[9px] tracking-[0.24em] text-white/55">
              <li>
                <Link href="/" className="hover:text-[#FF9800]">
                  HOME
                </Link>
              </li>
              <li className="text-[#FF9800]" aria-hidden="true">
                /
              </li>
              <li>
                <Link href="/opportunities" className="hover:text-[#FF9800]">
                  OPPORTUNITIES
                </Link>
              </li>
              <li className="text-[#FF9800]" aria-hidden="true">
                /
              </li>
              <li>
                <Link
                  href={`/opportunities/${opportunity.categorySlug}`}
                  className="hover:text-[#FF9800]"
                >
                  {opportunity.categoryName.toUpperCase()}
                </Link>
              </li>
            </ol>
          </nav>

          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <p className="eyebrow text-[#FF9800]">— {opportunity.categoryName}</p>
              <h1 className="mt-5 text-balance font-display text-3xl leading-tight text-white sm:text-[2.9rem]">
                {opportunity.title}
              </h1>
              <p className="mt-6 max-w-2xl text-[1rem] leading-relaxed text-slate-300">
                {opportunity.summary}
              </p>
              <div className="mt-7 flex flex-wrap gap-2.5">
                <Badge tone="orange">{kindLabel(opportunity.kind)}</Badge>
                <Badge tone="outline">{opportunity.categoryName}</Badge>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={opportunity.imageUrl ?? ''}
                  alt={opportunity.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Section tone="white">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <SectionHeading eyebrow="The Opportunity" title="What is being presented" />
              <div className="mt-7 flex flex-col gap-5 text-[0.98rem] leading-relaxed text-slate-700">
                {opportunity.description.split('\n\n').map((p) => (
                  <p key={p.slice(0, 40)} className="text-pretty">
                    {p}
                  </p>
                ))}
              </div>

              <dl className="mt-10 border border-slate-200">
                <DetailRow label="Location / market" value={opportunity.locationMarket ?? '—'} />
                <DetailRow label="Basic structure" value={opportunity.structure ?? '—'} />
                <DetailRow
                  label="Indicative capital range"
                  value={opportunity.capitalRangeLabel ?? 'Discussed privately'}
                />
                <DetailRow label="Category" value={opportunity.categoryName} />
              </dl>
            </div>

            <div className="lg:col-span-5">
              <div className="border-l-[3px] border-[#c02626] bg-[#c02626]/[0.04] p-6">
                <p className="font-label text-[9.5px] tracking-[0.24em] text-[#c02626]">
                  KEY CONSIDERATION / RISK NOTICE
                </p>
                <p className="mt-3.5 text-[0.92rem] leading-relaxed text-slate-700">
                  {opportunity.riskNotice}
                </p>
              </div>

              <div className="mt-6 flex items-start gap-3 border border-slate-200 p-5">
                <DocumentIcon className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#FF9800]" />
                <div>
                  <p className="font-heading text-[0.9rem] font-bold text-black">
                    Investment documents
                  </p>
                  <p className="mt-1.5 text-[0.85rem] leading-relaxed text-slate-600">
                    Not publicly downloadable. Provided physically or through an appropriate
                    controlled follow-up process, subject to confidentiality terms.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-start gap-3 border border-slate-200 p-5">
                <LockIcon className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#FF9800]" />
                <p className="text-[0.85rem] leading-relaxed text-slate-600">
                  Heavenward Place does not take custody of, hold, pool or manage customer
                  investment funds through this website. No returns are guaranteed.
                </p>
              </div>

              <a
                href="#interest"
                onClick={() => track('interest_type_selected', { source: 'opportunity_detail' })}
                className="mt-6 inline-flex w-full items-center justify-center gap-2.5 border border-[#FF9800] bg-[#FF9800] px-7 py-4 font-label text-[10.5px] tracking-[0.2em] text-black transition-colors duration-400 hover:bg-transparent hover:text-[#FF9800]"
              >
                ENQUIRE ABOUT THIS OPPORTUNITY
              </a>
            </div>
          </div>
        </Container>
      </Section>

      {related.length > 0 ? (
        <Section tone="cream-soft">
          <Container>
            <SectionHeading eyebrow="Also In This Category" title="Related opportunities" />
            <Stagger className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
              {related.map((r) => (
                <StaggerItem key={r.slug}>
                  <Link
                    href={`/opportunities/${r.slug}`}
                    className="group flex h-full flex-col border border-slate-200 bg-white p-6 transition-colors duration-400 hover:bg-cream"
                  >
                    <h3 className="font-heading text-[1rem] font-extrabold leading-snug text-black">
                      {r.title}
                    </h3>
                    <p className="mt-3 flex-1 text-[0.86rem] leading-relaxed text-slate-600">
                      {r.summary}
                    </p>
                    <p className="mt-5 line-clamp-2 border-t border-slate-100 pt-4 text-[0.76rem] leading-relaxed text-slate-500">
                      {r.riskNotice}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-2 font-label text-[9.5px] tracking-[0.2em] text-black">
                      VIEW
                      <ArrowIcon className="transition-transform duration-400 group-hover:translate-x-1" />
                    </span>
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>
          </Container>
        </Section>
      ) : null}

      <Section tone="white" id="interest">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="Register Your Interest"
              title="Start the conversation"
              intro="A representative reviews your interest and responds. Detailed terms and any arrangement are handled privately."
            />
          </div>
          <div className="lg:col-span-7 xl:col-span-8">
            <InterestForm
              disclaimerVersion={disclaimerVersion}
              defaultArea={opportunity.categorySlug.toUpperCase().replace(/-/g, '_')}
            />
          </div>
        </Container>
      </Section>
    </>
  );
}

function OpportunityRowCard({ opportunity }: { opportunity: OpportunityRow }) {
  return (
    <article className="border border-slate-200 bg-white p-6 transition-shadow duration-400 hover:shadow-[0_24px_60px_-40px_rgba(0,0,0,0.4)] sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge tone="outline">{kindLabel(opportunity.kind)}</Badge>
          </div>
          <h3 className="mt-4 text-balance text-xl font-extrabold leading-snug text-black">
            <Link href={`/opportunities/${opportunity.slug}`} className="link-underline-hover">
              {opportunity.title}
            </Link>
          </h3>
          <p className="mt-3 text-[0.92rem] leading-relaxed text-slate-600">{opportunity.summary}</p>

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

        <div className="flex shrink-0 flex-col gap-3 lg:w-52">
          <Link
            href={`/opportunities/${opportunity.slug}`}
            className="group inline-flex items-center justify-center gap-2.5 border border-[#FF9800] bg-[#FF9800] px-6 py-3.5 font-label text-[10px] tracking-[0.2em] text-black transition-colors duration-400 hover:bg-transparent hover:text-[#FF9800]"
          >
            FULL DETAIL
            <ArrowIcon className="transition-transform duration-400 group-hover:translate-x-1" />
          </Link>
          <a
            href="#interest"
            className="inline-flex items-center justify-center gap-2.5 border border-black px-6 py-3.5 font-label text-[10px] tracking-[0.2em] text-black transition-colors duration-400 hover:bg-black hover:text-white"
          >
            ENQUIRE
          </a>
        </div>
      </div>
    </article>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-slate-100 px-5 py-4 last:border-b-0">
      <dt className="font-label text-[9px] tracking-[0.22em] text-slate-500">{label.toUpperCase()}</dt>
      <dd className="max-w-sm text-right text-[0.9rem] leading-relaxed text-slate-700">{value}</dd>
    </div>
  );
}

export function OpportunityDetail(props: {
  kind: 'category' | 'opportunity';
  category?: OpportunityCategory;
  opportunities?: OpportunityRow[];
  opportunity?: OpportunityRow & {
    description: string;
    categorySlug: string;
    categoryName: string;
  };
  related?: Array<{ slug: string; title: string; summary: string; riskNotice: string }>;
  disclaimerVersion: number;
}) {
  if (props.kind === 'category' && props.category) {
    return (
      <OpportunityDetailCategoryView
        category={props.category}
        opportunities={props.opportunities ?? []}
        disclaimerVersion={props.disclaimerVersion}
      />
    );
  }
  if (props.opportunity) {
    return (
      <OpportunityDetailOpportunityView
        opportunity={props.opportunity}
        related={props.related ?? []}
        disclaimerVersion={props.disclaimerVersion}
      />
    );
  }
  return <Button>Opportunity unavailable</Button>;
}

export type { Opportunity };
