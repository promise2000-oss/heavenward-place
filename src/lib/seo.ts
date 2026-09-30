import type { Metadata } from 'next';
import { SITE } from '@/data/site';

export function absoluteUrl(path: string) {
  return new URL(path, SITE.url).toString();
}

export function buildMetadata(options: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
  noIndex?: boolean;
  publishedTime?: string;
  keywords?: string[];
}) {
  const {
    title,
    description = SITE.description,
    path = '/',
    image = '/opengraph-image',
    type = 'website',
    noIndex = false,
    publishedTime,
    keywords,
  } = options;

  const fullTitle = title ? `${title} | ${SITE.name}` : `${SITE.name} — ${SITE.direction}`;
  const url = absoluteUrl(path);

  return {
    /*
     * `fullTitle` always carries the branded form: it is what Open Graph,
     * Twitter and image alt text render, none of which run through the root
     * layout's `title.template`.
     *
     * The `title` field must NOT carry that brand too — the layout already
     * appends it (`%s | Heavenward Place`) for every nested route, which is
     * how pages were ending up as "Insights | Heavenward Place | Heavenward
     * Place". A bare segment name is passed through for that template to
     * consume. The home page is the one exception: it has no segment name of
     * its own, so it renders `fullTitle` directly, exactly as the layout's
     * `title.default` spells it.
     */
    title: title ?? fullTitle,
    description,
    keywords,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, 'max-image-preview': 'large' as const },
        },
    openGraph: {
      type,
      url,
      title: fullTitle,
      description,
      siteName: SITE.name,
      locale: SITE.locale,
      images: [{ url: absoluteUrl(image), width: 1200, height: 630, alt: fullTitle }],
      ...(publishedTime ? { publishedTime } : {}),
    } as Metadata['openGraph'],
    twitter: {
      card: 'summary_large_image' as const,
      title: fullTitle,
      description,
      site: SITE.twitter,
      images: [absoluteUrl(image)],
    },
  };
}

/** LodgingBusiness / Organization structured data. */
export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    '@id': `${SITE.url}/#organization`,
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    logo: absoluteUrl('/brand/heavenward-primary.svg'),
    image: absoluteUrl('/opengraph-image'),
    description: SITE.description,
    slogan: SITE.tagline,
    telephone: SITE.contact.phoneHref,
    email: SITE.contact.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Lagos',
      addressCountry: 'NG',
    },
    areaServed: 'Nigeria',
    sameAs: SITE.social.map((s) => s.href),
    makesOffer: {
      '@type': 'Offer',
      name: 'Corporate Housing & Shortlet Accommodation',
      category: 'Corporate Housing',
    },
    subOrganization: {
      '@type': 'Organization',
      name: 'Heavenward Place — Business & Investment Opportunities',
      description:
        'A curated opportunity-discovery service introducing selected business and investment opportunities. Heavenward Place does not take custody of, hold, pool or manage customer investment funds through this website. No returns are guaranteed.',
    },
  };
}

export function breadcrumbJsonLd(trail: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: absoluteUrl(t.url),
    })),
  };
}

export function articleJsonLd(post: {
  title: string;
  excerpt: string;
  publishedAt: string;
  author: string;
  image: string;
  slug?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: [absoluteUrl(post.image)],
    datePublished: post.publishedAt,
    author: { '@type': 'Organization', name: post.author },
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
      logo: { '@type': 'ImageObject', url: absoluteUrl('/brand/heavenward-primary.svg') },
    },
    mainEntityOfPage: absoluteUrl(`/insights/${post.slug ?? ''}`),
  };
}
