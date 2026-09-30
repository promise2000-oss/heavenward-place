import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { Hero } from '@/components/home/Hero';
import {
  ConciergeBenefits,
  ContactCta,
  FeaturedApartments,
  HospitalityOverview,
  HowItWorks,
  InsightsTeaser,
  OpportunityOverview,
  TrustSection,
  WhyHeavenward,
} from '@/components/home/sections';
import { displayNightly, indicativeWeeklyTotals } from '@/lib/pricing';
import { featuredProperties } from '@/lib/catalog';
import { latestPosts } from '@/data/insights';
import type { PropertyCardData } from '@/components/stay/PropertyCard';

export const metadata: Metadata = buildMetadata({
  path: '/',
  title: undefined,
  description:
    'Heavenward Place provides premium corporate housing and serviced shortlet apartments in Lagos for corporate clients, business travellers, expatriates and individuals — and introduces selected business and investment opportunities across six categories.',
  keywords: [
    'corporate housing Lagos',
    'serviced apartments Lagos',
    'shortlet accommodation Nigeria',
    'executive apartments Victoria Island',
    'long stay accommodation Lagos',
    'business travel accommodation Nigeria',
  ],
});

/**
 * Home renders the twelve sections in the order specified by the PRD:
 * hero → hospitality overview → featured apartments → why → business &
 * investment overview → six categories → how it works → trust → concierge &
 * long stay → insights → contact → footer.
 */
export default function HomePage() {
  const featured: PropertyCardData[] = featuredProperties(3).map((property) => ({
    slug: property.slug,
    name: property.name,
    type: property.type,
    shortDescription: property.shortDescription,
    area: property.area,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    maxGuests: property.maxGuests,
    sizeSqM: property.sizeSqM,
    coverImage: property.images.find((i) => i.isCover)?.url ?? property.images[0]?.url ?? '',
    imageCount: property.images.length,
    amenities: property.amenities,
    minStayNights: property.minStayNights,
    rating: property.rating,
    reviewCount: property.reviewCount,
    isFeatured: property.isFeatured,
    // Signed-out visitors see the Hospitality rate — the primary offer.
    displayPrice: displayNightly(property, 'HOSPITALITY'),
    weekly: {
      total: indicativeWeeklyTotals(property, 'HOSPITALITY').total,
      discount:
        property.weeklyDiscountPct > 0
          ? `${property.weeklyDiscountPct}% weekly rate applied`
          : 'Weekly rate available on request',
    },
    profile: 'HOSPITALITY',
    availability: null,
  }));

  const posts = latestPosts(3);

  return (
    <>
      <Hero />
      <HospitalityOverview />
      <FeaturedApartments properties={featured} />
      <WhyHeavenward />
      <OpportunityOverview />
      <HowItWorks />
      <TrustSection />
      <ConciergeBenefits />
      <InsightsTeaser posts={posts} />
      <ContactCta />
    </>
  );
}
