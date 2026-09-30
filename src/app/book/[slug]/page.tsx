import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { buildMetadata } from '@/lib/seo';
import { displayNightly } from '@/lib/pricing';
import { findPropertyBySlug } from '@/lib/catalog';
import { AVAILABILITY_BLOCKS } from '@/data/blocks';
import { blocksForProperty } from '@/lib/availability';
import { BookingFlow } from '@/components/book/BookingFlow';
import { properties } from '@/data/properties';

export const metadata: Metadata = buildMetadata({
  title: 'Complete Your Booking',
  path: '/book',
  description:
    'Choose your dates, review the full price breakdown and send your booking request to the Heavenward Place team.',
  noIndex: true,
});

/**
 * Only real residences get a booking page.
 *
 * Without this, `/book/<anything>` renders the not-found page but answers with
 * HTTP 200, because the dynamic route has already begun streaming by the time
 * `notFound()` runs. Search engines would then treat `/book/return` and
 * `/book/simulated-checkout` — routes deleted long ago — as live pages.
 * `dynamicParams = false` turns them into real 404s.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return properties.map((property) => ({ slug: property.slug }));
}

export default async function BookPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const property = findPropertyBySlug(slug);
  if (!property) notFound();

  /*
   * The date selection from the property page is carried across in the query
   * string and read here, so the flow opens on the dates the guest chose.
   *
   * Reading it here — rather than in the client after hydration — is what puts
   * the entire quote in the served HTML: the indicative total, the weekly
   * discount, the long-stay pickup and private-chef benefits. None of that is
   * content we want to exist only once JavaScript has run.
   */
  const query = await searchParams;
  const str = (key: string) => {
    const value = query[key];
    return (Array.isArray(value) ? value[0] : value) ?? '';
  };

  const checkIn = str('checkIn');
  const checkOut = str('checkOut');
  const guests = Number(str('guests')) || 1;
  const addOns = str('addOns')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <BookingFlow
      property={property}
      blocks={blocksForProperty(AVAILABILITY_BLOCKS, property.id)}
      displayPrice={displayNightly(property, 'HOSPITALITY')}
      initialDates={checkIn && checkOut ? { checkIn, checkOut } : undefined}
      initialGuests={guests}
      initialAddOns={addOns}
    />
  );
}
