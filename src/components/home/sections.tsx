'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Reveal, Stagger, StaggerItem, DrawRule, Parallax, SectionReveal } from '@/components/motion/Motion';
import { ArrowRight, Badge, Section, SectionHeading, Container } from '@/components/ui/primitives';
import { OPPORTUNITY_ICONS } from '@/components/ui/icons';
import { PropertyCard, type PropertyCardData } from '@/components/stay/PropertyCard';
import { opportunityCategories } from '@/data/opportunities';
import {
  PROCESS_HOSPITALITY,
  PROCESS_OPPORTUNITY,
  TRUST_POINTS,
  WHY_POINTS,
} from '@/data/site';
import type { InsightPost } from '@/data/types';
import { formatDate } from '@/lib/dates';

/* ═════════════════════════════════════════════════════════════════════════════
   1 · HERO  (src/components/home/Hero.tsx)
   2 · HOSPITALITY OVERVIEW
   ═════════════════════════════════════════════════════════════════════════════ */

export function HospitalityOverview() {
  return (
    <Section tone="white" id="hospitality">
      <Container className="grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-16">
        <div className="lg:col-span-6">
          <SectionHeading
            eyebrow="Corporate Housing & Shortlet"
            title={
              <>
                A residence that works while
                <br className="hidden sm:block" /> you do.
              </>
            }
            intro="Every Heavenward Place residence is fully serviced, professionally secured and priced in public. We host corporate clients, business travellers, expatriates, investors and individuals who need accommodation that performs from the first night to the last."
          />

          <Stagger className="mt-10 grid gap-5 sm:grid-cols-2" stagger={0.08}>
            {WHY_POINTS.slice(0, 4).map((point) => (
              <StaggerItem key={point.title}>
                <div className="border-l-[3px] border-[#FF9800] pl-4">
                  <h3 className="font-heading text-[0.98rem] font-extrabold text-black">
                    {point.title}
                  </h3>
                  <p className="mt-2 text-[0.88rem] leading-relaxed text-slate-600">
                    {point.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/stay"
              className="group inline-flex items-center justify-center gap-2.5 border border-[#FF9800] bg-[#FF9800] px-8 py-4 font-label text-xs tracking-[0.2em] text-black transition-colors duration-400 hover:bg-transparent hover:text-[#FF9800]"
            >
              EXPLORE RESIDENCES
              <ArrowRight className="transition-transform duration-400 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/concierge"
              className="inline-flex items-center justify-center gap-2.5 border border-black px-8 py-4 font-label text-xs tracking-[0.2em] text-black transition-colors duration-400 hover:bg-black hover:text-white"
            >
              CONCIERGE SERVICES
            </Link>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="grid grid-cols-2 gap-4">
            <Reveal className="space-y-4">
              <Parallax distance={40} className="aspect-[3/4]">
                <Image
                  src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=900&q=80"
                  alt="Contemporary garden villa exterior at dusk"
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </Parallax>
            </Reveal>
            <Reveal delay={0.12} className="mt-10 space-y-4">
              <Parallax distance={50} className="aspect-[3/4]">
                <Image
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80"
                  alt="Serviced apartment interior with skyline view"
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </Parallax>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <div className="mt-4 border border-slate-200 bg-cream-soft p-6">
              <p className="font-label text-[9.5px] tracking-[0.26em] text-[#e08600]">
                SERVICED DAILY
              </p>
              <p className="mt-3 text-[0.9rem] leading-relaxed text-slate-700">
                Housekeeping, linen changes, laundry, maintenance response and a resident manager
                on our larger residences. The operational layer is the product.
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

/* ═════════════════════════════════════════════════════════════════════════════
   3 · FEATURED APARTMENTS
   ═════════════════════════════════════════════════════════════════════════════ */

export function FeaturedApartments({ properties }: { properties: PropertyCardData[] }) {
  return (
    <Section tone="cream-soft" id="featured">
      <Container>
        <SectionHeading
          eyebrow="Available Now"
          title="Featured residences"
          intro="Live availability from our inventory. Published nightly rates, serviced inclusions and a calendar that reflects confirmed bookings in real time."
          action={
            <Link
              href="/stay"
              className="group inline-flex items-center gap-2.5 border border-black px-7 py-3.5 font-label text-[10.5px] tracking-[0.2em] text-black transition-colors duration-400 hover:bg-black hover:text-white"
            >
              VIEW ALL RESIDENCES
              <ArrowRight className="transition-transform duration-400 group-hover:translate-x-1" />
            </Link>
          }
        />

        <Stagger className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-3" stagger={0.09}>
          {properties.slice(0, 3).map((property, index) => (
            <StaggerItem key={property.slug}>
              <PropertyCard property={property} index={index} priority={index < 3} />
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}

/* ═════════════════════════════════════════════════════════════════════════════
   4 · WHY HEAVENWARD PLACE
   ═════════════════════════════════════════════════════════════════════════════ */

export function WhyHeavenward() {
  return (
    <Section tone="black" id="why">
      <div className="grid-texture-dark absolute inset-0 opacity-70" aria-hidden="true" />
      <Container className="relative">
        <SectionHeading
          tone="light"
          eyebrow="Why Heavenward Place"
          title="Five things that decide whether a stay actually works"
          intro="We publish these because they are what we are judged on — not the photograph, and not the square footage."
        />

        <div className="mt-16">
          <DrawRule />
          <Stagger className="grid sm:grid-cols-2 lg:grid-cols-5" stagger={0.08}>
            {WHY_POINTS.map((point, index) => (
              <StaggerItem key={point.title}>
                <div className="flex h-full flex-col border-b border-white/12 py-9 pr-6 lg:border-b-0 lg:border-r lg:pr-7 lg:last:border-r-0">
                  <span className="font-display text-5xl text-[#FF9800]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-6 font-heading text-[1.05rem] font-extrabold text-white">
                    {point.title}
                  </h3>
                  <p className="mt-3 text-[0.88rem] leading-relaxed text-slate-400">
                    {point.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Container>
    </Section>
  );
}

/* ═════════════════════════════════════════════════════════════════════════════
   5–6 · BUSINESS & INVESTMENT OVERVIEW + CATEGORIES
   ═════════════════════════════════════════════════════════════════════════════ */

export function OpportunityOverview() {
  return (
    <Section tone="white" id="opportunities">
      <Container className="grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Reveal>
            <SectionHeading
              eyebrow="Our Second Offering"
              title="A curated gateway to selected business and investment opportunities"
              intro="Heavenward Place introduces carefully selected opportunities across six categories. We present them at a high level, capture your interest, and start a relationship — we do not run a public marketplace, and we do not promise returns."
            />
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-9 border-l-[3px] border-black bg-cream p-6">
              <p className="font-label text-[9.5px] tracking-[0.26em] text-[#e08600]">
                BEFORE YOU CONTINUE
              </p>
              <p className="mt-4 text-[0.9rem] leading-relaxed text-slate-700">
                Heavenward Place does not take custody of, hold, pool or manage customer investment
                funds through this website. The website is intended to introduce and facilitate
                discussions around selected opportunities. You should conduct appropriate due
                diligence and review the specific terms and agreements before committing funds. No
                returns are guaranteed.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.16}>
            <Link
              href="/opportunities"
              className="group mt-9 inline-flex items-center gap-3 border border-[#FF9800] bg-[#FF9800] px-8 py-4 font-label text-xs tracking-[0.2em] text-black transition-colors duration-400 hover:bg-transparent hover:text-[#FF9800]"
            >
              EXPLORE OPPORTUNITIES
              <ArrowRight className="transition-transform duration-400 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <Reveal delay={0.08}>
            <p className="eyebrow text-black">— Six categories</p>
            <h3 className="mt-5 text-balance text-2xl font-extrabold text-black sm:text-[1.75rem]">
              Each presented with its structure, its indicative capital range and its key
              consideration.
            </h3>
          </Reveal>

          <Stagger className="mt-9 grid gap-px bg-slate-200 sm:grid-cols-2" stagger={0.07}>
            {opportunityCategories.map((category) => {
              const Icon = OPPORTUNITY_ICONS[category.icon];
              return (
                <StaggerItem key={category.slug} y={14}>
                  <Link
                    href={`/opportunities/${category.slug}`}
                    className="group flex h-full flex-col bg-white p-6 transition-colors duration-400 hover:bg-cream-soft"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span className="flex h-11 w-11 items-center justify-center border border-[#FF9800] text-black transition-colors duration-400 group-hover:bg-[#FF9800]">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="font-display text-2xl text-slate-200">
                        {String(category.order).padStart(2, '0')}
                      </span>
                    </div>
                    <h4 className="mt-5 font-heading text-[0.98rem] font-extrabold leading-snug text-black">
                      {category.name}
                    </h4>
                    <p className="mt-2.5 flex-1 text-[0.85rem] leading-relaxed text-slate-600">
                      {category.shortDescription}
                    </p>
                  </Link>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </Container>
    </Section>
  );
}

/* ═════════════════════════════════════════════════════════════════════════════
   7 · HOW IT WORKS
   ═════════════════════════════════════════════════════════════════════════════ */

export function HowItWorks() {
  return (
    <Section tone="cream" id="how-it-works">
      <Container>
        <SectionHeading
          eyebrow="Two Journeys"
          title="How it works"
          intro="Two ways to work with us. Hospitality is our primary offering and stays visually dominant — but both run through the same team."
          align="center"
        />

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          <TrackCard
            tone="black"
            eyebrow="Journey One"
            title="Hospitality"
            subtitle="Stay in comfort & luxury"
            steps={PROCESS_HOSPITALITY}
            cta={{ href: '/stay', label: 'Book your stay' }}
          />
          <TrackCard
            tone="white"
            eyebrow="Journey Two"
            title="Business & Investment"
            subtitle="Explore opportunities & experience premium hospitality"
            steps={PROCESS_OPPORTUNITY}
            cta={{ href: '/opportunities', label: 'Register your interest' }}
          />
        </div>
      </Container>
    </Section>
  );
}

function TrackCard({
  tone,
  eyebrow,
  title,
  subtitle,
  steps,
  cta,
}: {
  tone: 'black' | 'white';
  eyebrow: string;
  title: string;
  subtitle: string;
  steps: ReadonlyArray<{ title: string; description: string }>;
  cta: { href: string; label: string };
}) {
  return (
    <div
      className={`edge-orange flex flex-col p-8 sm:p-10 ${
        tone === 'black' ? 'bg-black text-white' : 'border border-black/10 bg-white'
      }`}
    >
      <p className={`eyebrow ${tone === 'black' ? 'text-[#FF9800]' : 'text-black'}`}>
        — {eyebrow}
      </p>
      <h3
        className={`mt-5 text-2xl font-extrabold sm:text-[1.75rem] ${
          tone === 'black' ? 'text-white' : 'text-black'
        }`}
      >
        {title}
      </h3>
      <p
        className={`mt-2 text-[0.95rem] font-semibold ${
          tone === 'black' ? 'text-[#FF9800]' : 'text-[#e08600]'
        }`}
      >
        {subtitle}
      </p>
      <span className="mt-6 block h-[3px] w-16 bg-[#FF9800]" aria-hidden="true" />

      <ol className="mt-8 flex flex-1 flex-col gap-6">
        {steps.map((step, index) => (
          <li key={step.title} className="flex gap-4">
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center font-label text-[10px] tracking-[0.1em] ${
                tone === 'black' ? 'bg-[#FF9800] text-black' : 'bg-black text-white'
              }`}
            >
              {String(index + 1).padStart(2, '0')}
            </span>
            <div>
              <p
                className={`font-heading text-[0.95rem] font-bold ${
                  tone === 'black' ? 'text-white' : 'text-black'
                }`}
              >
                {step.title}
              </p>
              <p
                className={`mt-1 text-[0.85rem] leading-relaxed ${
                  tone === 'black' ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                {step.description}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <Link
        href={cta.href}
        className={`group mt-9 inline-flex items-center justify-center gap-2.5 px-7 py-3.5 font-label text-[10.5px] tracking-[0.2em] transition-colors duration-400 ${
          tone === 'black'
            ? 'border border-[#FF9800] text-[#FF9800] hover:bg-[#FF9800] hover:text-black'
            : 'border border-black bg-black text-white hover:bg-transparent hover:text-black'
        }`}
      >
        {cta.label.toUpperCase()}
        <ArrowRight className="transition-transform duration-400 group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════════════════
   8 · TRUST & DISCLAIMER
   ═════════════════════════════════════════════════════════════════════════════ */

export function TrustSection() {
  return (
    <Section tone="white" id="trust">
      <Container>
        <SectionHeading
          eyebrow="Trust & Transparency"
          title="What we will never do"
          intro="The commitments below are structural, not aspirational. They are enforced in the product itself — copy rules, pricing logic, document handling and data access."
        />

        <Stagger className="mt-14 grid gap-px bg-slate-200 sm:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
          {TRUST_POINTS.map((point) => (
            <StaggerItem key={point.title} y={12}>
              <div className="h-full bg-white p-7">
                <span className="block h-[3px] w-10 bg-[#FF9800]" aria-hidden="true" />
                <h3 className="mt-5 font-heading text-[1rem] font-extrabold text-black">
                  {point.title}
                </h3>
                <p className="mt-3 text-[0.87rem] leading-relaxed text-slate-600">
                  {point.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.1}>
          <div className="mt-10 border border-black bg-black p-8 sm:p-10">
            <p className="eyebrow text-[#FF9800]">— Business &amp; investment disclaimer</p>
            <p className="mt-5 max-w-4xl text-pretty text-[1rem] leading-relaxed text-slate-200">
              Heavenward Place does not take custody of, hold, pool or manage customer investment
              funds through this website. The website is intended to introduce and facilitate
              discussions around selected opportunities. You should conduct appropriate due
              diligence and review the specific terms and agreements before committing funds. No
              returns are guaranteed.
            </p>
            <p className="mt-5 text-[0.82rem] text-slate-500">
              Final wording is subject to review and approval by qualified Nigerian legal and
              compliance counsel before launch.
            </p>
            <div className="mt-7 flex flex-wrap gap-4">
              <Link
                href="/legal/opportunity-disclaimer"
                className="inline-flex items-center gap-2.5 border border-[#FF9800] px-7 py-3.5 font-label text-[10.5px] tracking-[0.2em] text-[#FF9800] transition-colors duration-400 hover:bg-[#FF9800] hover:text-black"
              >
                READ THE FULL DISCLAIMER
              </Link>
              <Link
                href="/legal/privacy"
                className="inline-flex items-center gap-2.5 border border-white/40 px-7 py-3.5 font-label text-[10.5px] tracking-[0.2em] text-white transition-colors duration-400 hover:border-white hover:bg-white hover:text-black"
              >
                PRIVACY POLICY
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

/* ═════════════════════════════════════════════════════════════════════════════
   9 · CONCIERGE & LONG-STAY BENEFITS
   ═════════════════════════════════════════════════════════════════════════════ */

export function ConciergeBenefits() {
  const benefits = [
    {
      threshold: '7+ nights',
      title: 'Complimentary airport / preferred-location pickup',
      description:
        'A trusted driver meets you at Murtala Muhammed International Airport, Lagos, or at your preferred pickup point, and brings you straight to the residence. Share your flight details before you land and it is arranged.',
    },
    {
      threshold: '7+ nights',
      title: '3 complimentary private-chef meals per week',
      description:
        'Maximum one complimentary meal per day. You choose breakfast, lunch or dinner for each meal, subject to availability. Additional chef services beyond the allowance are charged at the published rate.',
    },
    {
      threshold: 'Shorter stays',
      title: 'Pickup and chef as paid add-ons',
      description:
        'If your stay is under seven nights you can still add airport pickup or private-chef meals to your booking. The published rate is shown in your price review before you pay — nothing is added afterwards.',
    },
  ];

  return (
    <Section tone="white" id="benefits">
      <Container className="grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHeading
            eyebrow="Concierge & Long Stays"
            title="Settle in properly, not just check in"
            intro="The first night is easy. The value of a residence shows up in week two, when the working week is compressed and you need the place to run around you."
          />
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/concierge"
              className="group inline-flex items-center gap-2.5 border border-[#FF9800] bg-[#FF9800] px-8 py-4 font-label text-xs tracking-[0.2em] text-black transition-colors duration-400 hover:bg-transparent hover:text-[#FF9800]"
            >
              CONCIERGE DETAILS
              <ArrowRight className="transition-transform duration-400 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-7">
          <Stagger className="flex flex-col gap-5" stagger={0.09}>
            {benefits.map((benefit) => (
              <StaggerItem key={benefit.title} y={16}>
                <div className="edge-orange flex h-full flex-col gap-4 border border-slate-200 p-7 sm:flex-row sm:gap-7">
                  <div className="shrink-0 sm:w-36">
                    <Badge tone={benefit.threshold === '7+ nights' ? 'orange' : 'outline'}>
                      {benefit.threshold}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="font-heading text-[1.02rem] font-extrabold text-black">
                      {benefit.title}
                    </h3>
                    <p className="mt-2.5 text-[0.9rem] leading-relaxed text-slate-600">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Container>
    </Section>
  );
}

/* ═════════════════════════════════════════════════════════════════════════════
   10 · INSIGHTS
   ═════════════════════════════════════════════════════════════════════════════ */

export function InsightsTeaser({ posts }: { posts: InsightPost[] }) {
  return (
    <Section tone="cream-soft" id="insights">
      <Container>
        <SectionHeading
          eyebrow="Insights"
          title="Hospitality, housing and opportunity education"
          intro="Practical writing on corporate housing, due diligence, market movement and running a business on the road."
          action={
            <Link
              href="/insights"
              className="group inline-flex items-center gap-2.5 border border-black px-7 py-3.5 font-label text-[10.5px] tracking-[0.2em] text-black transition-colors duration-400 hover:bg-black hover:text-white"
            >
              ALL ARTICLES
              <ArrowRight className="transition-transform duration-400 group-hover:translate-x-1" />
            </Link>
          }
        />

        <Stagger className="mt-14 grid gap-7 md:grid-cols-3" stagger={0.09}>
          {posts.map((post) => (
            <StaggerItem key={post.slug}>
              <article className="group flex h-full flex-col border border-slate-200 bg-white transition-shadow duration-400 hover:shadow-[0_24px_60px_-34px_rgba(0,0,0,0.45)]">
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-800 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-3">
                    <span className="font-label text-[9px] tracking-[0.24em] text-[#e08600]">
                      {post.category.replace(/-/g, ' ').toUpperCase()}
                    </span>
                    <span className="h-3 w-px bg-slate-300" aria-hidden="true" />
                    <span className="text-[0.75rem] text-slate-500">
                      {post.readingTimeMinutes} min read
                    </span>
                  </div>
                  <h3 className="mt-3 text-balance font-heading text-[1.05rem] font-extrabold leading-snug text-black">
                    <Link href={`/insights/${post.slug}`} className="link-underline-hover">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="mt-3 line-clamp-3 flex-1 text-[0.87rem] leading-relaxed text-slate-600">
                    {post.excerpt}
                  </p>
                  <p className="mt-5 border-t border-slate-100 pt-4 text-[0.78rem] text-slate-500">
                    {formatDate(post.publishedAt, 'medium')}
                  </p>
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}

/* ═════════════════════════════════════════════════════════════════════════════
   11 · CONTACT CTA
   ═════════════════════════════════════════════════════════════════════════════ */

export function ContactCta() {
  return (
    <Section tone="black" id="contact-cta" className="overflow-hidden">
      <Parallax distance={50} className="absolute inset-0 -z-10">
        <Image
          src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2200&q=80"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </Parallax>
      <div className="scrim absolute inset-0 -z-10" />

      <Container className="relative">
        <SectionReveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow text-[#FF9800]">— Talk to us</p>
          <h2 className="mt-6 text-balance font-display text-3xl leading-tight text-white sm:text-5xl">
            Tell us what you need. We will come back with options.
          </h2>
          <p className="mt-7 text-pretty text-[1.02rem] leading-relaxed text-slate-300">
            Whether you are housing a team, need a residence for six weeks, or want to understand
            whether a specific opportunity is worth a conversation — start here. A real
            representative responds within one business day.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3.5 sm:flex-row">
            <Link
              href="/contact"
              className="group inline-flex items-center justify-center gap-3 border border-[#FF9800] bg-[#FF9800] px-9 py-4 font-label text-xs tracking-[0.22em] text-black transition-colors duration-400 hover:bg-transparent hover:text-[#FF9800]"
            >
              CONTACT HEAVENWARD PLACE
              <ArrowRight className="transition-transform duration-400 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/stay"
              className="inline-flex items-center justify-center gap-3 border border-white/50 px-9 py-4 font-label text-xs tracking-[0.22em] text-white transition-colors duration-400 hover:border-white hover:bg-white hover:text-black"
            >
              BOOK YOUR STAY
            </Link>
          </div>
        </SectionReveal>
      </Container>
    </Section>
  );
}
