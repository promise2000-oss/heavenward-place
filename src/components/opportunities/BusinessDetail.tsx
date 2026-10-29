'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Badge, Container, Section, SectionHeading } from '@/components/ui/primitives';
import { ArrowIcon, MapIcon } from './opportunity-ui';
import { InterestForm } from './InterestForm';
import { Reveal } from '@/components/motion/Motion';
import type { BusinessOpportunity } from '@/data/types';

/**
 * Business opportunity detail (PRD §1.2).
 *
 * Sets out the defined roles on each side — the customer/client and Heavenward
 * Place’s business associates facilitate the business together — along with the
 * expected duration, the risk notice, and the reminder that detailed terms are
 * agreed privately. The interest form inherits the BUSINESS category.
 */
export function BusinessDetail({
  opportunity,
  related,
  disclaimerVersion,
  stayAreas,
}: {
  opportunity: BusinessOpportunity;
  related: Array<{ slug: string; title: string; summary: string; riskNotice: string }>;
  disclaimerVersion: number;
  stayAreas: string[];
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
                <Link href="/opportunities/business" className="hover:text-[#FF9800]">
                  BUSINESS
                </Link>
              </li>
              <li className="text-[#FF9800]" aria-hidden="true">
                /
              </li>
              <li className="text-white/90">{opportunity.title.toUpperCase()}</li>
            </ol>
          </nav>

          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <p className="eyebrow text-[#FF9800]">— Business Opportunity</p>
              <h1 className="mt-5 text-balance font-display text-3xl leading-tight text-white sm:text-[2.9rem]">
                {opportunity.title}
              </h1>
              <p className="mt-6 max-w-2xl text-[1rem] leading-relaxed text-slate-300">{opportunity.summary}</p>
              <div className="mt-7 flex flex-wrap gap-2.5">
                <Badge tone="orange">Business Opportunity</Badge>
                <Badge tone="outline">{opportunity.durationLabel}</Badge>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={opportunity.imageUrl}
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
                <DetailRow label="Location / market" value={opportunity.locationMarket} />
                <DetailRow label="Expected duration" value={opportunity.durationLabel} />
              </dl>
            </div>

            <div className="lg:col-span-5">
              <div className="border-l-[3px] border-[#c02626] bg-[#c02626]/[0.04] p-6">
                <p className="font-label text-[9.5px] tracking-[0.24em] text-[#c02626]">KEY CONSIDERATION / RISK NOTICE</p>
                <p className="mt-3.5 text-[0.92rem] leading-relaxed text-slate-700">{opportunity.riskNotice}</p>
              </div>

              <div className="mt-6 flex items-start gap-3 border border-slate-200 p-5">
                <MapIcon className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#FF9800]" />
                <p className="text-[0.85rem] leading-relaxed text-slate-600">
                  Detailed responsibilities, costs, risks, duration and commercial terms are discussed
                  privately and recorded in the applicable agreement.
                </p>
              </div>

              <a
                href="#interest"
                className="mt-6 inline-flex w-full items-center justify-center gap-2.5 border border-[#FF9800] bg-[#FF9800] px-7 py-4 font-label text-[10.5px] tracking-[0.2em] text-black transition-colors duration-400 hover:bg-transparent hover:text-[#FF9800]"
              >
                ENQUIRE ABOUT THIS OPPORTUNITY
              </a>
            </div>
          </div>
        </Container>
      </Section>

      {/* Roles */}
      <Section tone="cream-soft">
        <Container>
          <SectionHeading
            eyebrow="Who Does What"
            title="Defined roles on every side"
            intro="In a business opportunity the customer and Heavenward Place’s business associates facilitate the business together, each performing a different role. Heavenward Place has a defined role in every listing."
          />
          <div className="mt-12 grid gap-px bg-slate-200 md:grid-cols-3">
            <RoleBlock label="HEAVENWARD PLACE'S ROLE" text={opportunity.heavenwardRole} />
            <RoleBlock label="YOUR ROLE (CUSTOMER / CLIENT)" text={opportunity.customerRole} />
            <RoleBlock label="OUR ASSOCIATES' ROLE" text={opportunity.associateRole} />
          </div>
        </Container>
      </Section>

      {related.length > 0 ? (
        <Section tone="white">
          <Container>
            <SectionHeading display eyebrow="Also Open" title="Other business opportunities" />
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.map((r, index) => (
                <Reveal key={r.slug} delay={Math.min(index, 4) * 0.06}>
                  <Link
                    href={`/opportunities/business/${r.slug}`}
                    className="group flex h-full flex-col border border-slate-200 bg-white p-6 transition-colors duration-400 hover:bg-cream"
                  >
                    <h3 className="font-heading text-[1rem] font-extrabold leading-snug text-black">{r.title}</h3>
                    <p className="mt-3 flex-1 text-[0.86rem] leading-relaxed text-slate-600">{r.summary}</p>
                    <p className="mt-5 line-clamp-2 border-t border-slate-100 pt-4 text-[0.76rem] leading-relaxed text-slate-500">
                      {r.riskNotice}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-2 font-label text-[9.5px] tracking-[0.2em] text-black">
                      VIEW
                      <ArrowIcon className="transition-transform duration-400 group-hover:translate-x-1" />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      <Section tone="white" id="interest">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5 xl:col-span-4">
            <SectionHeading
              eyebrow="Register Your Interest"
              title="Start the conversation"
              lead
              intro="A representative reviews your interest and responds. Detailed terms and any arrangement are handled privately. Your enquiry is already classified as a Business Opportunity, so there is nothing extra to choose."
            />
          </div>
          <div className="lg:col-span-7 xl:col-span-8">
            <InterestForm
              disclaimerVersion={disclaimerVersion}
              journey="BUSINESS"
              defaultArea="GENERAL"
              stayAreas={stayAreas}
            />
          </div>
        </Container>
      </Section>
    </>
  );
}

function RoleBlock({ label, text }: { label: string; text: string }) {
  return (
    <div className="bg-white p-7">
      <p className="font-label text-[9px] tracking-[0.22em] text-[#e08600]">{label}</p>
      <p className="mt-4 text-[0.88rem] leading-relaxed text-slate-700">{text}</p>
    </div>
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
