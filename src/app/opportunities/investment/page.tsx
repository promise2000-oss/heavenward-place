import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { PageHeader } from '@/components/layout/PageHeader';
import { DisclaimerGate } from '@/components/opportunities/DisclaimerGate';
import { InterestForm } from '@/components/opportunities/InterestForm';
import { InvestmentContent } from '@/components/opportunities/InvestmentContent';
import { Container, Section, SectionHeading } from '@/components/ui/primitives';
import { currentDisclaimer, areas } from '@/lib/catalog';

export const metadata: Metadata = buildMetadata({
  title: 'Investment Opportunities',
  path: '/opportunities/investment',
  description:
    'Six curated investment categories — agro real estate, rental income property, precious metals, precious stones, joint ventures and distribution income. Roles, terms, risks and time horizon set out up front. No guaranteed returns.',
  keywords: [
    'investment opportunities Lagos',
    'agro real estate opportunity Nigeria',
    'rental income property Nigeria',
    'precious metals opportunity',
    'joint venture opportunity Nigeria',
  ],
});

export default function InvestmentJourneyPage() {
  const disclaimer = currentDisclaimer();

  return (
    <>
      <PageHeader
        eyebrow="Investment Opportunities"
        title="Six categories. Considered, not sold."
        intro="This is the Investment journey. It presents six curated investment categories at a high level — each opportunity sets out the roles of Heavenward Place and of you, the applicable terms, the risks and any expected time horizon before you decide to proceed. No returns are guaranteed."
        image="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=2200&q=80"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Opportunities', url: '/opportunities' },
          { name: 'Investment', url: '/opportunities/investment' },
        ]}
      >
        <div className="border-l-[3px] border-[#FF9800] bg-white/[0.06] p-5 backdrop-blur-sm">
          <p className="text-[0.85rem] leading-relaxed text-slate-300">
            Entering this section requires acknowledging our opportunity notice. It appears every
            time you open the section and is stored in your own browser.
          </p>
        </div>
      </PageHeader>

      <DisclaimerGate disclaimer={disclaimer} storageKey="investment">
        <InvestmentContent />

        {/* Interest form — inherits the INVESTMENT category (PRD §3) */}
        <Section tone="white" id="interest">
          <Container className="grid gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-5 xl:col-span-4">
              <SectionHeading
                eyebrow="Register Your Interest"
                title="Start a conversation"
                intro="One short form. A representative reviews your interest and responds personally. Because you opened this from the Investment journey, your enquiry is already classified as an Investment Opportunity — there is nothing extra to choose."
              />
              <div className="mt-9 border-l-[3px] border-black bg-cream p-6">
                <p className="font-label text-[9.5px] tracking-[0.24em] text-[#e08600]">BEFORE YOU SUBMIT</p>
                <p className="mt-3.5 text-[0.89rem] leading-relaxed text-slate-700">
                  We do not collect your experience, objectives, risk appetite, investment duration,
                  exit preference or deployment timeline on this form. Those are handled properly in
                  follow-up. We also never ask for payment details, and we never ask you to send
                  funds to us.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 xl:col-span-8">
              <InterestForm disclaimerVersion={disclaimer.version} journey="INVESTMENT" stayAreas={areas} />
            </div>
          </Container>
        </Section>
      </DisclaimerGate>
    </>
  );
}
