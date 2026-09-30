import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { buildMetadata, breadcrumbJsonLd } from '@/lib/seo';
import { getLegalPage, legalPages } from '@/data/legal';
import { RichContent } from '@/components/insights/RichContent';
import { Badge, Container } from '@/components/ui/primitives';
import { formatDate } from '@/lib/dates';
import { SITE } from '@/data/site';

export function generateStaticParams() {
  return legalPages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getLegalPage(slug);
  if (!page) return buildMetadata({ title: 'Legal', path: `/legal/${slug}`, noIndex: true });
  return buildMetadata({
    title: page.seoTitle || page.title,
    path: `/legal/${page.slug}`,
    description: page.seoDescription || page.summary,
  });
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getLegalPage(slug);
  if (!page) notFound();

  const others = legalPages.filter((p) => p.slug !== page.slug);

  return (
    <>
      <section className="section-black grid-texture-dark">
        <Container className="py-14 sm:py-16">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 font-label text-[9px] tracking-[0.24em] text-white/55">
              <li>
                <Link href="/" className="hover:text-[#FF9800]">
                  HOME
                </Link>
              </li>
              <li className="text-[#FF9800]" aria-hidden="true">
                /
              </li>
              <li className="text-white/90">{page.title.toUpperCase()}</li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <p className="eyebrow text-[#FF9800]">— Legal &amp; policies</p>
            <h1 className="mt-6 text-balance font-display text-[2rem] leading-[1.02] text-white sm:text-[2.9rem]">
              {page.title}
            </h1>
            <p className="mt-6 text-[1rem] leading-relaxed text-slate-300">{page.summary}</p>
            <p className="mt-5 font-label text-[9px] tracking-[0.24em] text-white/50">
              LAST UPDATED {formatDate(page.updatedAt, 'long').toUpperCase()}
            </p>
          </div>
        </Container>
      </section>

      <Container className="py-14 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-8">
            {page.pendingLegalReview ? (
              <div className="mb-9 flex flex-wrap items-center gap-3 border-l-[3px] border-[#b26a00] bg-[#b26a00]/[0.07] p-5">
                <Badge tone="warning">Pending legal review</Badge>
                <p className="text-[0.85rem] leading-relaxed text-slate-700">
                  This document is placeholder wording prepared by Heavenward Place and must be
                  finalised by qualified Nigerian legal and compliance counsel before launch. It is
                  fully editable, and counsel-approved wording can be inserted here without any code
                  change.
                </p>
              </div>
            ) : null}

            <RichContent blocks={page.body} />

            <div className="mt-12 border-t border-slate-200 pt-8">
              <p className="font-label text-[9px] tracking-[0.24em] text-slate-500">
                QUESTIONS ABOUT THIS DOCUMENT
              </p>
              <p className="mt-3 text-[0.92rem] leading-relaxed text-slate-700">
                Contact us at{' '}
                <a href={`mailto:${SITE.contact.email}`} className="font-semibold text-black underline">
                  {SITE.contact.email}
                </a>{' '}
                or{' '}
                <a href={`tel:${SITE.contact.phoneHref}`} className="font-semibold text-black underline">
                  {SITE.contact.phone}
                </a>
                . Plain-language summaries are available on the{' '}
                <Link href="/contact" className="font-semibold text-black underline">
                  contact page
                </Link>
                .
              </p>
            </div>
          </div>

          <aside className="lg:col-span-4">
            <div className="border border-slate-200 p-6 lg:sticky lg:top-[100px]">
              <p className="font-label text-[9px] tracking-[0.24em] text-black">
                ALL LEGAL DOCUMENTS
              </p>
              <ul className="mt-5 flex flex-col gap-1">
                {others.map((other) => (
                  <li key={other.slug}>
                    <Link
                      href={`/legal/${other.slug}`}
                      className="group flex items-center justify-between gap-3 border-b border-slate-100 py-3 text-[0.88rem] text-slate-600 transition-colors duration-300 hover:text-black"
                    >
                      <span>{other.title}</span>
                      <span className="font-label text-[8px] tracking-[0.2em] text-slate-400 transition-colors duration-300 group-hover:text-[#e08600]">
                        {other.pendingLegalReview ? 'DRAFT' : 'LIVE'}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </Container>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: 'Home', url: '/' },
              { name: 'Legal', url: '/legal' },
              { name: page.title, url: `/legal/${page.slug}` },
            ]),
          ),
        }}
      />
    </>
  );
}
