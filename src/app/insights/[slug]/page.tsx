import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { buildMetadata, articleJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { getPost, insightPosts, insightCategories } from '@/data/insights';
import { formatDate } from '@/lib/dates';
import { RichContent, ArticleCard, slugify } from '@/components/insights/RichContent';
import { Container, Badge } from '@/components/ui/primitives';

export function generateStaticParams() {
  return insightPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return buildMetadata({ title: 'Article not found', path: `/insights/${slug}`, noIndex: true });

  return buildMetadata({
    title: post.seoTitle || post.title,
    path: `/insights/${post.slug}`,
    description: post.seoDescription || post.excerpt,
    image: post.coverImage,
    type: 'article',
    publishedTime: post.publishedAt,
    keywords: post.tags,
  });
}

export default async function InsightPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = insightPosts
    .filter((p) => p.status === 'PUBLISHED' && p.slug !== post.slug)
    .sort((a, b) => Number(b.category === post.category) - Number(a.category === post.category))
    .slice(0, 3);

  const headings = post.body.filter(
    (b): b is Extract<typeof b, { kind: 'heading' }> => b.kind === 'heading' && b.level === 2,
  );

  const categoryLabel =
    insightCategories.find((c) => c.slug === post.category)?.label ?? post.category;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            articleJsonLd({
              title: post.title,
              excerpt: post.excerpt,
              publishedAt: post.publishedAt,
              author: post.author,
              image: post.coverImage,
              slug: post.slug,
            }),
          ),
        }}
      />

      <article>
        <header className="section-black grid-texture-dark">
          <Container className="py-16 sm:py-20">
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
                <li>
                  <Link href="/insights" className="hover:text-[#FF9800]">
                    INSIGHTS
                  </Link>
                </li>
                <li className="text-[#FF9800]" aria-hidden="true">
                  /
                </li>
                <li className="text-white/90">{categoryLabel.toUpperCase()}</li>
              </ol>
            </nav>

            <div className="max-w-4xl">
              <p className="eyebrow text-[#FF9800]">— {categoryLabel}</p>
              <h1 className="mt-6 text-balance font-display text-[2rem] leading-[1.02] text-white sm:text-[3rem] lg:text-[3.4rem]">
                {post.title}
              </h1>
              <p className="mt-7 max-w-2xl text-pretty text-[1.05rem] leading-relaxed text-slate-300">
                {post.excerpt}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.85rem] text-slate-400">
                <span className="font-heading font-semibold text-white">{post.author}</span>
                <span aria-hidden="true">·</span>
                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, 'long')}</time>
                <span aria-hidden="true">·</span>
                <span>{post.readingTimeMinutes} min read</span>
              </div>
            </div>
          </Container>
        </header>

        <Container className="py-12 sm:py-16">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-8">
              <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover"
                />
              </div>

              <div className="mt-10">
                <RichContent blocks={post.body} />
              </div>

              <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-slate-200 pt-8">
                <span className="font-label text-[9px] tracking-[0.24em] text-slate-500">TAGS</span>
                {post.tags.map((tag) => (
                  <Badge key={tag} tone="muted">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <aside className="lg:col-span-4">
              {headings.length > 0 ? (
                <div className="border border-slate-200 p-6 lg:sticky lg:top-[100px]">
                  <p className="font-label text-[9px] tracking-[0.24em] text-black">
                    IN THIS ARTICLE
                  </p>
                  <ul className="mt-4 flex flex-col gap-2.5">
                    {headings.map((h) => (
                      <li key={h.text}>
                        <a
                          href={`#${slugify(h.text)}`}
                          className="text-[0.86rem] leading-relaxed text-slate-600 transition-colors duration-300 hover:text-black"
                        >
                          {h.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="mt-6 border border-black bg-black p-6 text-white lg:sticky lg:top-[calc(100px+18rem)]">
                <p className="eyebrow text-[#FF9800]">— Work with us</p>
                <p className="mt-4 text-[0.92rem] leading-relaxed text-slate-300">
                  Need serviced accommodation in Lagos, or want to understand whether a specific
                  opportunity warrants a conversation?
                </p>
                <div className="mt-6 flex flex-col gap-2.5">
                  <Link
                    href="/stay"
                    className="inline-flex items-center justify-center border border-[#FF9800] bg-[#FF9800] px-5 py-3 font-label text-[9.5px] tracking-[0.2em] text-black transition-colors duration-400 hover:bg-transparent hover:text-[#FF9800]"
                  >
                    BOOK YOUR STAY
                  </Link>
                  <Link
                    href="/opportunities"
                    className="inline-flex items-center justify-center border border-white/40 px-5 py-3 font-label text-[9.5px] tracking-[0.2em] text-white transition-colors duration-400 hover:border-white hover:bg-white hover:text-black"
                  >
                    OPPORTUNITIES
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </article>

      <section className="border-t border-slate-200 bg-cream-soft py-16">
        <Container>
          <p className="eyebrow text-black">— Keep reading</p>
          <h2 className="mt-5 text-2xl font-extrabold text-black sm:text-3xl">Related articles</h2>
          <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <ArticleCard key={r.slug} post={r} />
            ))}
          </div>
        </Container>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: 'Home', url: '/' },
              { name: 'Insights', url: '/insights' },
              { name: post.title, url: `/insights/${post.slug}` },
            ]),
          ),
        }}
      />
    </>
  );
}
