'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { DURATION, EASE } from '@/components/motion/Motion';
import { Badge } from '@/components/ui/primitives';
import { BathIcon, BedIcon, PinIcon, StarIcon, UsersIcon } from '@/components/ui/icons';
import { formatNaira } from '@/lib/money';
import { track } from '@/lib/analytics';

export interface PropertyCardData {
  slug: string;
  name: string;
  type: string;
  shortDescription: string;
  area: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  sizeSqM: number;
  coverImage: string;
  imageCount: number;
  amenities: string[];
  minStayNights: number;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  displayPrice: number;
  weekly: { total: number; discount: string };
  profile: 'HOSPITALITY' | 'BUSINESS_INVESTMENT';
  availability?: { available: boolean; reason?: string } | null;
}

export function PropertyCard({
  property,
  priority = false,
  index = 0,
}: {
  property: PropertyCardData;
  priority?: boolean;
  index?: number;
}) {
  const reduce = useReducedMotion();
  const available = property.availability?.available ?? true;

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 26 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: DURATION.base, ease: EASE, delay: Math.min(index, 5) * 0.07 }}
      className="edge-orange group h-full"
    >
      <motion.div
        whileHover={reduce ? undefined : { y: -6 }}
        transition={{ duration: DURATION.fast, ease: EASE }}
        className="flex h-full flex-col border border-slate-200 bg-white transition-shadow duration-400 hover:shadow-[0_24px_60px_-30px_rgba(0,0,0,0.4)]"
      >
        <Link
          href={`/stay/${property.slug}`}
          onClick={() => track('property_viewed', { property: property.slug, source: 'card' })}
          className="relative block aspect-[4/3] overflow-hidden bg-slate-100"
          tabIndex={-1}
          aria-hidden="true"
        >
          <Image
            src={property.coverImage}
            alt={`${property.name} — ${property.shortDescription}`}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-800 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

          <div className="absolute left-0 top-0 flex flex-wrap gap-2 p-4">
            {property.isFeatured ? <Badge tone="orange">Featured</Badge> : null}
            {available ? (
              <Badge tone="black" dot>
                Available
              </Badge>
            ) : (
              <Badge tone="danger">Unavailable for these dates</Badge>
            )}
          </div>

          <span className="absolute bottom-4 right-4 bg-black/80 px-2.5 py-1 font-label text-[9px] tracking-[0.2em] text-white">
            {property.imageCount} PHOTOS
          </span>
        </Link>

        <div className="flex flex-1 flex-col p-6">
          <div className="flex items-center justify-between gap-3">
            <span className="font-label text-[9px] tracking-[0.26em] text-[#e08600]">
              {property.type.toUpperCase()}
            </span>
            <span className="flex items-center gap-1.5">
              <StarIcon className="h-3.5 w-3.5 text-[#FF9800]" />
              <span className="text-[0.8rem] font-bold text-black">
                {property.rating.toFixed(1)}
              </span>
              <span className="text-[0.75rem] text-slate-500">({property.reviewCount})</span>
            </span>
          </div>

          <h3 className="mt-3 text-balance text-[1.15rem] font-extrabold leading-snug text-black">
            <Link href={`/stay/${property.slug}`} className="link-underline-hover">
              {property.name}
            </Link>
          </h3>

          <p className="mt-2.5 flex items-center gap-1.5 text-[0.82rem] text-slate-500">
            <PinIcon className="h-3.5 w-3.5 text-[#FF9800]" />
            {property.area}, Lagos
          </p>

          <p className="mt-3 line-clamp-2 text-[0.88rem] leading-relaxed text-slate-600">
            {property.shortDescription}
          </p>

          <ul className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-slate-100 pt-5 text-[0.8rem] text-slate-600">
            <li className="flex items-center gap-1.5">
              <BedIcon className="h-4 w-4 text-slate-400" />
              {property.bedrooms === 0 ? 'Studio' : `${property.bedrooms} bed`}
            </li>
            <li className="flex items-center gap-1.5">
              <BathIcon className="h-4 w-4 text-slate-400" />
              {property.bathrooms} bath
            </li>
            <li className="flex items-center gap-1.5">
              <UsersIcon className="h-4 w-4 text-slate-400" />
              {property.maxGuests} guests
            </li>
            <li className="text-slate-400">{property.sizeSqM} m²</li>
          </ul>

          <div className="mt-6 flex items-end justify-between gap-4 border-t border-slate-100 pt-5">
            <div>
              <p className="font-label text-[9px] tracking-[0.24em] text-slate-500">
                {property.profile === 'BUSINESS_INVESTMENT'
                  ? 'BUSINESS & INVESTMENT RATE'
                  : 'PER NIGHT'}
              </p>
              <p className="mt-1.5 font-display text-2xl text-black">
                {formatNaira(property.displayPrice)}
              </p>
            </div>
            <Link
              href={`/stay/${property.slug}`}
              onClick={() => track('property_viewed', { property: property.slug, source: 'card_cta' })}
              className="group/cta inline-flex items-center gap-2 border border-black px-4 py-2.5 font-label text-[9.5px] tracking-[0.2em] text-black transition-colors duration-400 hover:bg-black hover:text-white"
            >
              VIEW
              <svg
                viewBox="0 0 24 24"
                width="13"
                height="13"
                fill="none"
                className="transition-transform duration-400 group-hover/cta:translate-x-1"
                aria-hidden="true"
              >
                <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
              </svg>
            </Link>
          </div>

          {property.minStayNights > 1 ? (
            <p className="mt-3 text-[0.75rem] text-slate-500">
              {property.minStayNights}-night minimum stay · {property.weekly.discount}
            </p>
          ) : (
            <p className="mt-3 text-[0.75rem] text-slate-500">
              Single-night stays available · {property.weekly.discount}
            </p>
          )}
        </div>
      </motion.div>
    </motion.article>
  );
}
