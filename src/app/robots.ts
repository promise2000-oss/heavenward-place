import type { MetadataRoute } from 'next';
import { SITE } from '@/data/site';

/**
 * The booking flow is a private, per-residence page with no content worth
 * indexing, so it is disallowed. `/*?*` covers anything carrying a query
 * string, which is where curated links used to live.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/book', '/book/', '/*?*'],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
