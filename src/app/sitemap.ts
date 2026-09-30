import type { MetadataRoute } from 'next';
import { SITE } from '@/data/site';
import { listProperties } from '@/lib/catalog';
import { legalPages } from '@/data/legal';
import { insightPosts } from '@/data/insights';
import { opportunityCategories, opportunities } from '@/data/opportunities';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: '/', changeFrequency: 'weekly', priority: 1 },
    { url: '/stay', changeFrequency: 'daily', priority: 0.95 },
    { url: '/about', changeFrequency: 'monthly', priority: 0.7 },
    { url: '/concierge', changeFrequency: 'monthly', priority: 0.7 },
    { url: '/opportunities', changeFrequency: 'weekly', priority: 0.85 },
    { url: '/insights', changeFrequency: 'weekly', priority: 0.75 },
    { url: '/contact', changeFrequency: 'monthly', priority: 0.7 },
  ];

  const propertyRoutes: MetadataRoute.Sitemap = listProperties().map((p) => ({
    url: `/stay/${p.slug}`,
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  const opportunityRoutes: MetadataRoute.Sitemap = [
    ...opportunityCategories.map((c) => ({
      url: `/opportunities/${c.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...opportunities
      .filter((o) => o.status === 'PUBLISHED')
      .map((o) => ({
        url: `/opportunities/${o.slug}`,
        changeFrequency: 'weekly' as const,
        priority: 0.65,
      })),
  ];

  const articleRoutes: MetadataRoute.Sitemap = insightPosts
    .filter((p) => p.status === 'PUBLISHED')
    .map((p) => ({
      url: `/insights/${p.slug}`,
      lastModified: new Date(p.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

  const legalRoutes: MetadataRoute.Sitemap = legalPages.map((p) => ({
    url: `/legal/${p.slug}`,
    changeFrequency: 'yearly' as const,
    priority: 0.3,
  }));

  return [...staticRoutes, ...propertyRoutes, ...opportunityRoutes, ...articleRoutes, ...legalRoutes].map(
    (entry) => ({
      ...entry,
      url: `${SITE.url}${entry.url}`,
      lastModified: entry.lastModified ?? now,
    }),
  );
}
