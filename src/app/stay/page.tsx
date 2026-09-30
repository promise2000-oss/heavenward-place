import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { PageHeader } from '@/components/layout/PageHeader';
import { StayBrowser } from '@/components/stay/StayBrowser';
import { displayNightly, indicativeWeeklyTotals } from '@/lib/pricing';
import { listProperties, publishedPriceBounds, areas, propertyTypes, allAmenities } from '@/lib/catalog';
import type { PropertyCardData } from '@/components/stay/PropertyCard';
import { CONCIERGE_SERVICES } from '@/data/types';

export const metadata: Metadata = buildMetadata({
  title: 'Stay With Us',
  path: '/stay',
  description:
    'Browse and filter premium serviced apartments in Lagos. Live availability, published nightly rates, housekeeping, airport pickup and private chef included.',
  keywords: [
    'serviced apartments Lagos',
    'corporate housing Lagos',
    'shortlet apartments Nigeria',
    'Victoria Island apartments',
    'Ikeja serviced apartment',
    'Lekki penthouse',
  ],
});

export default async function StayPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  /*
   * Parsed on the server rather than in the browser, so a shared link such as
   * `/stay?area=Ikeja&guests=4` arrives already filtered — in the HTML, before
   * any JavaScript runs.
   */
  const params = await searchParams;
  const one = (key: string) => {
    const value = params[key];
    return (Array.isArray(value) ? value[0] : value) ?? '';
  };
  const num = (key: string, fallback: number) => {
    const raw = Number(one(key));
    return Number.isFinite(raw) && raw > 0 ? raw : fallback;
  };

  const initialFilters = {
    area: one('area'),
    checkIn: one('checkIn'),
    checkOut: one('checkOut'),
    guests: num('guests', 2),
    bedrooms: num('bedrooms', 0),
    type: one('type'),
    sort: one('sort') || ('recommended' as const),
  };

  // Server-render the default (Hospitality) view so the page is indexable and
  // fast; the client then applies filters against the live API.
  const all = listProperties();
  const initial: PropertyCardData[] = all.slice(0, 9).map((property) => ({
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

  const bounds = publishedPriceBounds();

  return (
    <>
      <PageHeader
        eyebrow="Stay With Us"
        title="Premium residences, priced in public."
        intro="Search our serviced apartments and villas across Lagos. Availability is live, rates are published, and a stay of seven nights or more automatically includes airport pickup and private-chef meals."
        image="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=2200&q=80"
        breadcrumbs={[{ name: 'Home', url: '/' }, { name: 'Stay With Us', url: '/stay' }]}
      />

      <div className="bg-slate-50 py-14 sm:py-16">
        <div className="container-hp">
          <StayBrowser
            all={initial}
            initialFilters={initialFilters}
            priceCeiling={Math.ceil(bounds.max / 1_000_000) * 1_000_000}
            facets={{
              areas,
              types: propertyTypes,
              amenities: allAmenities,
            }}
          />

          <div className="mt-16 border-t border-slate-200 pt-10">
            <p className="eyebrow text-black">— Included with your stay</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {CONCIERGE_SERVICES.map((service) => (
                <div key={service.key} className="border border-slate-200 bg-white p-5">
                  <h3 className="font-heading text-[0.95rem] font-extrabold text-black">
                    {service.name}
                  </h3>
                  <p className="mt-2 text-[0.84rem] leading-relaxed text-slate-600">
                    {service.description}
                  </p>
                  <p className="mt-3 font-label text-[8.5px] tracking-[0.22em] text-[#e08600]">
                    {service.priceLabel.toUpperCase()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
