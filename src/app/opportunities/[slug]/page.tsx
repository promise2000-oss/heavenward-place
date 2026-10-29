import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { buildMetadata } from '@/lib/seo';
import { getCategory, getOpportunity, opportunitiesForCategory } from '@/data/opportunities';
import { currentDisclaimer, areas } from '@/lib/catalog';
import { DisclaimerGate } from '@/components/opportunities/DisclaimerGate';
import { OpportunityDetail } from '@/components/opportunities/OpportunityDetail';

interface Params {
  slug: string;
}

export async function generateStaticParams() {
  return [
    ...['agro-real-estate', 'rental-income-property', 'precious-metals', 'precious-stones', 'joint-venture', 'distribution-income'].map(
      (slug) => ({ slug }),
    ),
  ];
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (category) {
    return buildMetadata({
      title: category.name,
      path: `/opportunities/${slug}`,
      description: category.shortDescription,
      image: category.imageUrl,
    });
  }
  const opportunity = getOpportunity(slug);
  if (opportunity) {
    return buildMetadata({
      title: opportunity.title,
      path: `/opportunities/${slug}`,
      description: opportunity.summary,
      image: opportunity.imageUrl,
    });
  }
  return buildMetadata({ title: 'Opportunity not found', path: `/opportunities/${slug}`, noIndex: true });
}

export default async function OpportunityPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const category = getCategory(slug);
  const opportunity = getOpportunity(slug);

  if (!category && !opportunity) notFound();

  const disclaimer = currentDisclaimer();

  if (category) {
    return (
      <DisclaimerGate disclaimer={disclaimer} storageKey={`category-${category.slug}`}>
        <OpportunityDetail
          kind="category"
          category={category}
          opportunities={opportunitiesForCategory(category.slug).map((o) => ({
            slug: o.slug,
            title: o.title,
            summary: o.summary,
            locationMarket: o.locationMarket,
            structure: o.structure,
            capitalRangeLabel: o.capitalRangeLabel,
            riskNotice: o.riskNotice,
            kind: o.kind,
            imageUrl: o.imageUrl,
          }))}
          disclaimerVersion={disclaimer.version}
          stayAreas={areas}
        />
      </DisclaimerGate>
    );
  }

  return (
    <DisclaimerGate disclaimer={disclaimer} storageKey={`opportunity-${opportunity!.slug}`}>
      <OpportunityDetail
        kind="opportunity"
        opportunity={{
          slug: opportunity!.slug,
          title: opportunity!.title,
          summary: opportunity!.summary,
          description: opportunity!.description,
          categorySlug: opportunity!.categorySlug,
          categoryName: getCategory(opportunity!.categorySlug)?.name ?? '',
          locationMarket: opportunity!.locationMarket,
          structure: opportunity!.structure,
          capitalRangeLabel: opportunity!.capitalRangeLabel,
          riskNotice: opportunity!.riskNotice,
          kind: opportunity!.kind,
          imageUrl: opportunity!.imageUrl,
        }}
        related={opportunitiesForCategory(opportunity!.categorySlug)
          .filter((o) => o.slug !== opportunity!.slug)
          .map((o) => ({ slug: o.slug, title: o.title, summary: o.summary, riskNotice: o.riskNotice }))}
        disclaimerVersion={disclaimer.version}
        stayAreas={areas}
      />
    </DisclaimerGate>
  );
}
