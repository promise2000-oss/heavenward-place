import { properties, areas, propertyTypes, allAmenities } from '@/data/properties';
import { opportunityDisclaimer } from '@/data/opportunities';
import type { Property } from '@/data/types';

/**
 * ═════════════════════════════════════════════════════════════════════════════
 * CATALOGUE — pure reads over the seed data
 * ═════════════════════════════════════════════════════════════════════════════
 *
 * Everything the pages used to ask a repository for is a pure function over
 * `src/data`. There is no database, so this is the whole query layer: filtering,
 * faceting and lookups, with no I/O and nothing to keep in sync.
 *
 * These run at build time (they are called from Server Components), so the
 * results are baked into the static HTML.
 */

export interface PropertyFilter {
  area?: string;
  type?: string;
  guests?: number;
  bedrooms?: number;
  minStayNights?: number;
  amenities?: string[];
  query?: string;
  sort?: 'featured' | 'price_asc' | 'price_desc' | 'rating';
}

export function listProperties(filter: PropertyFilter = {}): Property[] {
  const q = filter.query?.trim().toLowerCase();

  const matched = properties.filter((property) => {
    if (filter.area && property.area !== filter.area) return false;
    if (filter.type && property.type !== filter.type) return false;
    if (filter.guests && property.maxGuests < filter.guests) return false;
    if (filter.bedrooms && property.bedrooms < filter.bedrooms) return false;
    if (filter.minStayNights && property.minStayNights > filter.minStayNights) return false;
    if (filter.amenities?.length) {
      const has = filter.amenities.every((a) => property.amenities.includes(a));
      if (!has) return false;
    }
    if (q) {
      const haystack = [
        property.name,
        property.type,
        property.area,
        property.shortDescription,
      ]
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  const sorted = [...matched];
  switch (filter.sort) {
    case 'price_asc':
      sorted.sort((a, b) => a.baseNightlyPrice - b.baseNightlyPrice);
      break;
    case 'price_desc':
      sorted.sort((a, b) => b.baseNightlyPrice - a.baseNightlyPrice);
      break;
    case 'rating':
      sorted.sort((a, b) => b.rating - a.rating);
      break;
    default:
      break;
  }
  return sorted;
}

/** The residences promoted on the home page. */
export function featuredProperties(limit = 3): Property[] {
  return properties.slice(0, limit);
}

export function findPropertyBySlug(slug: string): Property | undefined {
  return properties.find((property) => property.slug === slug);
}

export function findPropertyById(id: string): Property | undefined {
  return properties.find((property) => property.id === id);
}

export interface PriceBounds {
  min: number;
  max: number;
}

/**
 * Bounds for the price range filter.
 *
 * Returns the lowest and highest *published* nightly rate. Both profiles use
 * the same bounds so the filter reads the same on every page; only the rate
 * shown against a card changes with the list being viewed.
 */
export function publishedPriceBounds(): PriceBounds {
  const prices = properties.map((p) => p.baseNightlyPrice);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export { areas, propertyTypes, allAmenities };

/** The disclaimer text and its current version. */
export function currentDisclaimer() {
  return opportunityDisclaimer;
}
