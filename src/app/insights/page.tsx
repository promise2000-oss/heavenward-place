import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { PageHeader } from '@/components/layout/PageHeader';
import { InsightsBrowser } from '@/components/insights/InsightsBrowser';
import { insightPosts, insightCategories } from '@/data/insights';

export const metadata: Metadata = buildMetadata({
  title: 'Insights',
  path: '/insights',
  description:
    'Hospitality, corporate housing, business opportunities, investment education, market insights, real estate and business lifestyle from Heavenward Place.',
  keywords: [
    'corporate housing articles',
    'investment education Nigeria',
    'due diligence guide',
    'Lagos real estate market',
    'business lifestyle Nigeria',
  ],
});

export default function InsightsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Insights"
        title="Practical writing, not marketing filler."
        intro="Corporate housing, opportunity education, market movement and running a business on the road — written for people who have to make decisions."
        image="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=2200&q=80"
        breadcrumbs={[{ name: 'Home', url: '/' }, { name: 'Insights', url: '/insights' }]}
      />

      <InsightsBrowser
        posts={insightPosts.filter((p) => p.status === 'PUBLISHED')}
        categories={insightCategories}
      />
    </>
  );
}
