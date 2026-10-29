import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { PageHeader } from '@/components/layout/PageHeader';
import { DisclaimerGate } from '@/components/opportunities/DisclaimerGate';
import { InterestForm } from '@/components/opportunities/InterestForm';
import { BusinessContent } from '@/components/opportunities/BusinessContent';
import { Container, Section, SectionHeading } from '@/components/ui/primitives';
import { currentDisclaimer, areas } from '@/lib/catalog';

export const metadata: Metadata = buildMetadata({
  title: 'Business Opportunities',
  path: '/opportunities/business',
  description:
    'Frequently updated business openings where the customer and Heavenward Place’s associates facilitate the business together, each with a defined role. No promised profits, no guaranteed returns.',
  keywords: [
    'business opportunities Nigeria',
    'business partnership Lagos',
    'operating business opportunity',
    'distribution business Nigeria',
  ],
});

export default function BusinessJourneyPage() {
  const disclaimer = currentDisclaimer();

  return (
    <>
      <PageHeader
        eyebrow="Business Opportunities"
        title="Openings we add and update as they arise."
        intro="This is the Business journey. Here the customer and Heavenward Place’s business associates facilitate the business together, each performing a different role — and Heavenward Place has a defined role in every listing. No business is promised to generate high profits indefinitely, and no return is guaranteed. Detailed terms are agreed privately."
        image="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=2200&q=80"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Opportunities', url: '/opportunities' },
          { name: 'Business', url: '/opportunities/business' },
        ]}
      >
        <div className="border-l-[3px] border-[#FF9800] bg-white/[0.06] p-5 backdrop-blur-sm">
          <p className="text-[0.85rem] leading-relaxed text-slate-300">
            Entering this section requires acknowledging our opportunity notice. It appears every
            time you open the section and is stored in your own browser.
          </p>
        </div>
      </PageHeader>

      <DisclaimerGate disclaimer={disclaimer} storageKey="business">
        <BusinessContent />

        {/* Interest form — inherits the BUSINESS category (PRD §3) */}
        <Section tone="white" id="interest">
          <Container className="grid gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-5 xl:col-span-4">
              <SectionHeading
                eyebrow="Register Your Interest"
                title="Start a conversation"
                intro="One short form. A representative reviews your interest and responds personally. Because you opened this from the Business journey, your enquiry is already classified as a Business Opportunity — there is nothing extra to choose."
              />
              <div className="mt-9 border-l-[3px] border-black bg-cream p-6">
                <p className="font-label text-[9.5px] tracking-[0.24em] text-[#e08600]">BEFORE YOU SUBMIT</p>
                <p className="mt-3.5 text-[0.89rem] leading-relaxed text-slate-700">
                  Business openings change as suitable opportunities arise. Detailed
                  responsibilities, costs, risks, duration and commercial terms are discussed
                  privately and recorded in the applicable agreement. We never ask for payment
                  details, and we never ask you to send funds to us.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 xl:col-span-8">
              <InterestForm disclaimerVersion={disclaimer.version} journey="BUSINESS" stayAreas={areas} />
            </div>
          </Container>
        </Section>
      </DisclaimerGate>
    </>
  );
}
