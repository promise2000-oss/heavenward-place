import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { PageHeader } from '@/components/layout/PageHeader';
import { DisclaimerGate } from '@/components/opportunities/DisclaimerGate';
import { InterestForm } from '@/components/opportunities/InterestForm';
import { OpportunityContent } from '@/components/opportunities/OpportunityContent';
import { Container, Section, SectionHeading } from '@/components/ui/primitives';
import { PROCESS_OPPORTUNITY } from '@/data/site';
import { currentDisclaimer } from '@/lib/catalog';
import { Stagger, StaggerItem } from '@/components/motion/Motion';

export const metadata: Metadata = buildMetadata({
  title: 'Business & Investment Opportunities',
  path: '/opportunities',
  description:
    'A curated opportunity-discovery service across six categories: agro real estate, rental income property, precious metals, precious stones, joint ventures and distribution income. No guaranteed returns.',
  keywords: [
    'business opportunities Nigeria',
    'investment opportunities Lagos',
    'agro real estate opportunity',
    'rental income property Nigeria',
    'joint venture opportunity Nigeria',
    'opportunity discovery platform',
  ],
});

export default function OpportunitiesPage() {
  const disclaimer = currentDisclaimer();

  return (
    <>
      <PageHeader
        eyebrow="Business & Investment"
        title="A curated gateway to selected opportunities."
        intro="Heavenward Place introduces carefully selected business and investment opportunities across six categories. We present them at a high level, capture your interest, and start a relationship — we do not run a public marketplace, and we do not promise returns."
        image="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=2200&q=80"
        breadcrumbs={[{ name: 'Home', url: '/' }, { name: 'Business & Investment', url: '/opportunities' }]}
      >
        <div className="border-l-[3px] border-[#FF9800] bg-white/[0.06] p-5 backdrop-blur-sm">
          <p className="text-[0.85rem] leading-relaxed text-slate-300">
            Entering this section requires acknowledging our opportunity notice. It appears every
            time you open the section and is recorded with a timestamp.
          </p>
        </div>
      </PageHeader>

      <DisclaimerGate disclaimer={disclaimer} storageKey="opportunities">
        <OpportunityContent />

        {/* How it works */}
        <Section tone="black">
          <div className="grid-texture-dark absolute inset-0 opacity-70" aria-hidden="true" />
          <Container className="relative">
            <SectionHeading
              tone="light"
              eyebrow="The Process"
              title="From interest to arrangement"
              intro="Participation occurs only under the applicable opportunity structure and agreement. Nothing is committed until that agreement is executed."
              align="center"
            />
            <Stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" stagger={0.07}>
              {PROCESS_OPPORTUNITY.map((step, index) => (
                <StaggerItem key={step.title}>
                  <div className="h-full border border-white/15 p-6">
                    <span className="font-display text-3xl text-[#FF9800]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="mt-4 font-heading text-[0.95rem] font-extrabold text-white">
                      {step.title}
                    </h3>
                    <p className="mt-2.5 text-[0.84rem] leading-relaxed text-slate-400">
                      {step.description}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </Container>
        </Section>

        {/* Interest form */}
        <Section tone="white" id="interest">
          <Container className="grid gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-5">
              <SectionHeading
                eyebrow="Register Your Interest"
                title="Start a conversation"
                intro="One short form. A real representative reviews it and responds — often with a curated selection of residences for a visit, and an invitation to a consultation."
              />
              <div className="mt-9 border-l-[3px] border-black bg-cream p-6">
                <p className="font-label text-[9.5px] tracking-[0.24em] text-[#e08600]">
                  BEFORE YOU SUBMIT
                </p>
                <p className="mt-3.5 text-[0.89rem] leading-relaxed text-slate-700">
                  We do not collect your experience, objectives, risk appetite, investment
                  duration, exit preference or deployment timeline on this form. Those are handled
                  properly in follow-up. We also never ask for payment details, and we never ask
                  you to send funds to us.
                </p>
              </div>
              <div className="mt-6 border-l-[3px] border-[#c02626] bg-[#c02626]/[0.05] p-6">
                <p className="font-label text-[9.5px] tracking-[0.24em] text-[#c02626]">
                  NEVER DO THIS
                </p>
                <p className="mt-3.5 text-[0.89rem] leading-relaxed text-slate-700">
                  Do not send funds to anyone in order to &ldquo;unlock&rdquo; an opportunity or to
                  meet a threshold. Heavenward Place does not take custody of, hold, pool or manage
                  customer investment funds through this website. If you are asked to do so,
                  contact us before proceeding.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 xl:col-span-8">
              <InterestForm disclaimerVersion={disclaimer.version} />
            </div>
          </Container>
        </Section>
      </DisclaimerGate>
    </>
  );
}
