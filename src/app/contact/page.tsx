import type { Metadata } from 'next';
import { Suspense } from 'react';
import { buildMetadata } from '@/lib/seo';
import { PageHeader } from '@/components/layout/PageHeader';
import { ContactForm, ContactDetails } from '@/components/contact/ContactForm';
import { Container, Section, SectionHeading } from '@/components/ui/primitives';
import { FAQS } from '@/data/faqs';
import { Accordion } from '@/components/ui/overlay';

export const metadata: Metadata = buildMetadata({
  title: 'Contact',
  path: '/contact',
  description:
    'Speak to Heavenward Place about serviced accommodation in Lagos, concierge services, or selected business and investment opportunities. Phone, email, WhatsApp and contact form.',
  keywords: [
    'contact Heavenward Place',
    'corporate housing enquiry Lagos',
    'serviced apartment enquiry',
    'opportunity enquiry Nigeria',
  ],
});

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  /*
   * Parsed here rather than in the client component: `useSearchParams()` in a
   * client component opts it out of prerendering, which meant the contact form
   * — the most important element on the page — was absent from the HTML.
   */
  const params = await searchParams;
  const raw = params.category;
  const requested = Array.isArray(raw) ? raw[0] : raw;
  const category =
    requested === 'HOSPITALITY' || requested === 'BUSINESS_INVESTMENT' || requested === 'GENERAL'
      ? requested
      : 'GENERAL';

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Tell us what you need. We will come back with options."
        intro="A real representative responds within one business day. Whether you are housing a team, need a residence for six weeks, or want to understand whether a specific opportunity warrants a conversation — start here."
        image="https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=2200&q=80"
        breadcrumbs={[{ name: 'Home', url: '/' }, { name: 'Contact', url: '/contact' }]}
      />

      <Section tone="white">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5 xl:col-span-4">
            <ContactDetails />
          </div>
          <div className="lg:col-span-7 xl:col-span-8">
            <Suspense fallback={<div className="skeleton h-96 w-full" />}>
              <ContactForm initialCategory={category} />
            </Suspense>
          </div>
        </Container>
      </Section>

      <Section tone="cream-soft">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="FAQ"
              rule
              title="Questions we are asked most"
              intro="If your question is not here, ask it directly — we would rather answer it than have you guess."
            />
            <p className="mt-8 border-l-[3px] border-[#FF9800] bg-white p-6 text-[0.9rem] leading-relaxed text-slate-700">
              For anything relating to business or investment opportunities, please read the{' '}
              <a
                href="/legal/opportunity-disclaimer"
                className="font-semibold text-black underline"
              >
                Business &amp; Investment Opportunity Disclaimer
              </a>{' '}
              first — it sets out exactly what our opportunity service is and is not.
            </p>
          </div>
          <div className="lg:col-span-7">
            <Accordion items={FAQS.map((f) => ({ question: f.question, answer: f.answer }))} />
          </div>
        </Container>
      </Section>
    </>
  );
}
