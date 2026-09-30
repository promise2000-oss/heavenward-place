import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { buildMetadata, breadcrumbJsonLd } from '@/lib/seo';
import { displayNightly, indicativeWeeklyTotals } from '@/lib/pricing';
import { findPropertyBySlug, listProperties } from '@/lib/catalog';
import { AVAILABILITY_BLOCKS } from '@/data/blocks';
import { blocksForProperty } from '@/lib/availability';
import { PropertyGallery } from '@/components/stay/PropertyGallery';
import { BookingCard } from '@/components/stay/BookingCard';
import { Stagger, StaggerItem } from '@/components/motion/Motion';
import { Badge, Container, Section, SectionHeading } from '@/components/ui/primitives';
import {
  BathIcon,
  BedIcon,
  CarIcon,
  CheckIcon,
  ClockIcon,
  PinIcon,
  ShieldIcon,
  SparkleIcon,
  StarIcon,
  UsersIcon,
  WifiIcon,
} from '@/components/ui/icons';
import { formatNaira } from '@/lib/money';
import { PropertyDetailClient } from '@/components/stay/PropertyDetailClient';
import Link from 'next/link';

export async function generateStaticParams() {
  return listProperties().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const property = findPropertyBySlug(slug);
  if (!property) return buildMetadata({ title: 'Residence not found', path: `/stay/${slug}`, noIndex: true });

  return buildMetadata({
    title: `${property.name} — ${property.bedrooms || 'Studio'} ${property.bedrooms === 1 ? 'bedroom' : 'bedrooms'} in ${property.area}`,
    path: `/stay/${property.slug}`,
    description: property.shortDescription,
    image: property.images[0]?.url,
    keywords: [
      `${property.type} ${property.area}`,
      `serviced apartment ${property.area} Lagos`,
      `${property.bedrooms} bedroom shortlet Lagos`,
    ],
  });
}

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = findPropertyBySlug(slug);
  if (!property) notFound();

  /*
   * There is no signed deep link any more: without a backend there is nothing
   * to sign a token with, and an unsigned query parameter would be trivially
   * forged. The site therefore publishes one rate, and the Business &amp;
   * Investment partner list is published openly on /opportunities.
   */
  const displayPrice = displayNightly(property, 'HOSPITALITY');
  const weekly = indicativeWeeklyTotals(property, 'HOSPITALITY');

  const blocks = blocksForProperty(AVAILABILITY_BLOCKS, property.id);

  const facts = [
    { icon: BedIcon, label: property.bedrooms === 0 ? 'Studio' : `${property.bedrooms} bedroom${property.bedrooms === 1 ? '' : 's'}` },
    { icon: BathIcon, label: `${property.bathrooms} bathroom${property.bathrooms === 1 ? '' : 's'}` },
    { icon: UsersIcon, label: `Up to ${property.maxGuests} guests` },
    { icon: SparkleIcon, label: `${property.sizeSqM} m²` },
    { icon: PinIcon, label: `${property.area}, Lagos` },
    { icon: ClockIcon, label: `Built ${property.yearBuilt}` },
  ];

  return (
    <>
      <Container className="pt-8">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 font-label text-[9px] tracking-[0.24em] text-slate-500">
            <li>
              <Link href="/" className="transition-colors hover:text-black">
                HOME
              </Link>
            </li>
            <li className="text-[#FF9800]" aria-hidden="true">
              /
            </li>
            <li>
              <Link href="/stay" className="transition-colors hover:text-black">
                STAY WITH US
              </Link>
            </li>
            <li className="text-[#FF9800]" aria-hidden="true">
              /
            </li>
            <li className="text-black">{property.name.toUpperCase()}</li>
          </ol>
        </nav>

        <PropertyGallery images={property.images} name={property.name} />
      </Container>

      <Container className="py-12 sm:py-14">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Main column */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone="orange">{property.type}</Badge>
              {property.isFeatured ? <Badge tone="black">Featured residence</Badge> : null}
            </div>

            <h1 className="mt-5 text-balance text-3xl font-extrabold leading-tight text-black sm:text-[2.6rem]">
              {property.name}
            </h1>

            <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.9rem] text-slate-600">
              <span className="flex items-center gap-1.5">
                <StarIcon className="h-4 w-4 text-[#FF9800]" />
                <strong className="font-bold text-black">{property.rating.toFixed(1)}</strong>
                ({property.reviewCount} reviews)
              </span>
              <span className="flex items-center gap-1.5">
                <PinIcon className="h-4 w-4 text-[#FF9800]" />
                {property.area}, {property.city}
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldIcon className="h-4 w-4 text-[#FF9800]" />
                24-hour secured residence
              </span>
            </p>

            <p className="mt-7 text-pretty text-[1.02rem] leading-relaxed text-slate-700">
              {property.shortDescription}
            </p>

            {/* Facts */}
            <Stagger className="mt-9 grid grid-cols-2 gap-px border border-slate-200 bg-slate-200 sm:grid-cols-3" stagger={0.05}>
              {facts.map((fact) => (
                <StaggerItem key={fact.label} y={10}>
                  <div className="flex h-full flex-col items-center gap-2.5 bg-white px-4 py-6 text-center">
                    <fact.icon className="h-5 w-5 text-[#FF9800]" />
                    <span className="text-[0.82rem] font-semibold text-black">{fact.label}</span>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>

            {/* Description */}
            <div className="mt-12">
              <h2 className="text-xl font-extrabold text-black">About this residence</h2>
              <span className="mt-4 block h-[3px] w-14 bg-[#FF9800]" aria-hidden="true" />
              <div className="mt-6 flex flex-col gap-5 text-[0.97rem] leading-relaxed text-slate-700">
                {property.description.split('\n\n').map((paragraph) => (
                  <p key={paragraph.slice(0, 40)} className="text-pretty">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="mt-12">
              <h2 className="text-xl font-extrabold text-black">Amenities &amp; facilities</h2>
              <span className="mt-4 block h-[3px] w-14 bg-[#FF9800]" aria-hidden="true" />
              <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {property.amenities.map((amenity) => (
                  <li key={amenity} className="flex items-center gap-2.5 text-[0.88rem] text-slate-700">
                    <CheckIcon className="h-4 w-4 shrink-0 text-[#FF9800]" />
                    {amenity}
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div className="mt-12">
              <h2 className="text-xl font-extrabold text-black">Services available</h2>
              <span className="mt-4 block h-[3px] w-14 bg-[#FF9800]" aria-hidden="true" />
              <ul className="mt-6 flex flex-wrap gap-2.5">
                {property.services.map((service) => (
                  <li
                    key={service}
                    className="border border-slate-200 bg-slate-50 px-4 py-2.5 text-[0.85rem] text-slate-700"
                  >
                    {service}
                  </li>
                ))}
              </ul>
            </div>

            {/* Availability calendar */}
            <div className="mt-12">
              <h2 className="text-xl font-extrabold text-black">Check availability</h2>
              <p className="mt-2.5 max-w-2xl text-[0.92rem] leading-relaxed text-slate-600">
                Dates already booked or blocked by the host are unavailable and cannot be selected.
                Availability is shown from our current schedule — we confirm every request personally before anything is reserved.
              </p>
              <div className="mt-6">
                <PropertyDetailClient
                  propertySlug={property.slug}
                  minStayNights={property.minStayNights}
                  blocks={blocks}
                  displayPrice={displayPrice}
                />
              </div>
            </div>

            {/* Location */}
            <div className="mt-12">
              <h2 className="text-xl font-extrabold text-black">Location &amp; area</h2>
              <span className="mt-4 block h-[3px] w-14 bg-[#FF9800]" aria-hidden="true" />
              <div className="mt-6 border border-slate-200 bg-slate-50 p-6">
                <p className="flex items-center gap-2.5 font-heading text-[0.98rem] font-bold text-black">
                  <PinIcon className="h-4.5 w-4.5 text-[#FF9800]" />
                  {property.area}, {property.city}, {property.state}
                </p>
                <p className="mt-3 text-[0.9rem] leading-relaxed text-slate-700">
                  {property.publicLocationDetail}
                </p>
                <p className="mt-4 border-t border-slate-200 pt-4 text-[0.8rem] text-slate-500">
                  The exact address is shared with confirmed guests only, ahead of arrival.
                </p>
              </div>
            </div>

            {/* House rules */}
            <div className="mt-12">
              <h2 className="text-xl font-extrabold text-black">House rules</h2>
              <span className="mt-4 block h-[3px] w-14 bg-[#FF9800]" aria-hidden="true" />
              <ul className="mt-6 flex flex-col gap-2.5">
                {property.houseRules.map((rule) => (
                  <li key={rule} className="flex gap-3 text-[0.9rem] text-slate-700">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-[#FF9800]" aria-hidden="true" />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>

            {/* Cancellation */}
            <div className="mt-12">
              <h2 className="text-xl font-extrabold text-black">Cancellation policy</h2>
              <span className="mt-4 block h-[3px] w-14 bg-[#FF9800]" aria-hidden="true" />
              <ul className="mt-6 flex flex-col gap-3 text-[0.9rem] text-slate-700">
                <li className="border-l-[3px] border-[#FF9800] pl-4">
                  <strong className="font-bold text-black">Free cancellation</strong> up to 7 days
                  before your check-in date.
                </li>
                <li className="border-l-[3px] border-slate-300 pl-4">
                  <strong className="font-bold text-black">7 to 3 days before check-in</strong> —
                  50% of the total booking value is refundable.
                </li>
                <li className="border-l-[3px] border-slate-300 pl-4">
                  <strong className="font-bold text-black">Less than 3 days before check-in</strong> —
                  non-refundable.
                </li>
              </ul>
              <p className="mt-5 text-[0.85rem] text-slate-600">
                Full terms are set out in the{' '}
                <Link href="/legal/cancellation" className="link-underline-hover font-semibold text-black">
                  Booking &amp; Cancellation Policy
                </Link>
                .
              </p>
            </div>
          </div>

          {/* Sticky booking card */}
          <div className="lg:col-span-5 xl:col-span-4">
            <BookingCard
              property={property}
              blocks={blocks}
              displayPrice={displayPrice}
              priceListLabel="Hospitality"
            />

            <div className="mt-6 border border-slate-200 bg-cream-soft p-6">
              <p className="font-label text-[9px] tracking-[0.24em] text-[#e08600]">
                WEEKLY RATE
              </p>
              <p className="mt-2.5 font-display text-2xl text-black">{formatNaira(weekly.total)}</p>
              <p className="mt-1.5 text-[0.82rem] text-slate-600">
                7 nights including cleaning, service charge and{' '}
                {property.weeklyDiscountPct > 0
                  ? `a ${property.weeklyDiscountPct}% weekly discount`
                  : 'the standard nightly rate'}
                .
              </p>
            </div>
          </div>
        </div>
      </Container>

      <Section tone="cream-soft">
        <Container>
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <SectionHeading
                eyebrow="Included"
                title="Complimentary benefits"
                intro="Applied automatically on qualifying stays — no request needed, no negotiation."
              />
              <ul className="mt-8 flex flex-col gap-4">
                {property.complimentary.map((item) => (
                  <li key={item} className="flex gap-3.5 border border-slate-200 bg-white p-5">
                    <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-[#12805c]" />
                    <p className="text-[0.9rem] leading-relaxed text-slate-700">{item}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <SectionHeading
                eyebrow="Optional"
                title="Paid add-ons"
                intro="Priced at the published rate and shown in your price review before you pay. Nothing is added after payment."
              />
              <ul className="mt-8 flex flex-col gap-4">
                {property.paidAddOns
                  .filter((a) => a.isActive)
                  .map((addOn) => (
                    <li key={addOn.key} className="border border-slate-200 bg-white p-5">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="font-heading text-[0.95rem] font-extrabold text-black">
                          {addOn.name}
                        </h3>
                        <p className="shrink-0 font-display text-lg text-black">
                          {formatNaira(addOn.price)}
                        </p>
                      </div>
                      <p className="mt-2 text-[0.85rem] leading-relaxed text-slate-600">
                        {addOn.description}
                      </p>
                      <p className="mt-3 font-label text-[8.5px] tracking-[0.22em] text-slate-500">
                        {addOn.unit === 'per_night'
                          ? 'PER NIGHT'
                          : addOn.unit === 'per_meal'
                            ? 'PER MEAL'
                            : 'PER STAY'}
                      </p>
                    </li>
                  ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center gap-4 border-t border-slate-200 pt-10 text-center">
            <p className="flex items-center gap-2.5 text-[0.88rem] text-slate-600">
              <CarIcon className="h-4 w-4 text-[#FF9800]" />
              Need airport pickup or a private chef?{' '}
              <Link href="/concierge" className="link-underline-hover font-semibold text-black">
                See concierge services
              </Link>
            </p>
            <p className="flex items-center gap-2.5 text-[0.88rem] text-slate-600">
              <WifiIcon className="h-4 w-4 text-[#FF9800]" />
              Working through your stay?{' '}
              <Link href="/contact" className="link-underline-hover font-semibold text-black">
                Ask us about a team booking or an extended stay
              </Link>
              .
            </p>
          </div>
        </Container>
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: 'Home', url: '/' },
              { name: 'Stay With Us', url: '/stay' },
              { name: property.name, url: `/stay/${property.slug}` },
            ]),
          ),
        }}
      />
    </>
  );
}
