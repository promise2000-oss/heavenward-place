import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { buildMetadata } from '@/lib/seo';
import { getBusinessOpportunity, publishedBusinessOpportunities } from '@/data/business-opportunities';
import { currentDisclaimer, areas } from '@/lib/catalog';
import { DisclaimerGate } from '@/components/opportunities/DisclaimerGate';
import { BusinessDetail } from '@/components/opportunities/BusinessDetail';

interface Params {
  slug: string;
}

export async function generateStaticParams() {
  return publishedBusinessOpportunities().map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const opportunity = getBusinessOpportunity(slug);
  if (!opportunity || opportunity.status !== 'PUBLISHED') {
    return buildMetadata({ title: 'Opportunity not found', path: `/opportunities/business/${slug}`, noIndex: true });
  }
  return buildMetadata({
    title: opportunity.title,
    path: `/opportunities/business/${slug}`,
    description: opportunity.summary,
    image: opportunity.imageUrl,
  });
}

export default async function BusinessOpportunityPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const opportunity = getBusinessOpportunity(slug);
  if (!opportunity || opportunity.status !== 'PUBLISHED') notFound();

  const disclaimer = currentDisclaimer();

  const related = publishedBusinessOpportunities()
    .filter((o) => o.slug !== opportunity.slug)
    .map((o) => ({ slug: o.slug, title: o.title, summary: o.summary, riskNotice: o.riskNotice }));

  return (
    <DisclaimerGate disclaimer={disclaimer} storageKey={`business-${opportunity.slug}`}>
      <BusinessDetail
        opportunity={opportunity}
        related={related}
        disclaimerVersion={disclaimer.version}
        stayAreas={areas}
      />
    </DisclaimerGate>
  );
}
