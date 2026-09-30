'use client';

import { useState } from 'react';
import { Container, Section } from '@/components/ui/primitives';
import { ArticleCard } from '@/components/insights/RichContent';
import type { InsightPost } from '@/data/types';

export function InsightsBrowser({
  posts,
  categories,
}: {
  posts: InsightPost[];
  categories: Array<{ slug: string; label: string; blurb: string }>;
}) {
  const [active, setActive] = useState<string>('all');
  const [query, setQuery] = useState('');

  const filtered = posts
    .filter((p) => active === 'all' || p.category === active)
    .filter((p) => {
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    });

  const [featured, ...rest] = filtered;

  return (
    <>
      {/* Filter bar */}
      <div className="border-b border-slate-200 bg-slate-50">
        <Container className="py-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              <FilterChip active={active === 'all'} onClick={() => setActive('all')}>
                All articles
              </FilterChip>
              {categories.map((c) => (
                <FilterChip key={c.slug} active={active === c.slug} onClick={() => setActive(c.slug)}>
                  {c.label}
                </FilterChip>
              ))}
            </div>
            <div className="lg:w-72">
              <label htmlFor="insight-search" className="sr-only">
                Search articles
              </label>
              <input
                id="insight-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search insights…"
                className="w-full border border-slate-300 bg-white px-4 py-2.5 text-[0.88rem] text-black placeholder:text-slate-400 focus:border-[#FF9800] focus:outline-none"
              />
            </div>
          </div>
        </Container>
      </div>

      <Section tone="white">
        <Container>
          <p className="text-[0.88rem] text-slate-600" aria-live="polite">
            <strong className="font-bold text-black">{filtered.length}</strong>{' '}
            {filtered.length === 1 ? 'article' : 'articles'}
            {active !== 'all' ? ` in ${categories.find((c) => c.slug === active)?.label}` : ''}
          </p>

          {filtered.length === 0 ? (
            <div className="mt-8 border border-slate-200 bg-cream-soft p-10 text-center">
              <h2 className="text-xl font-extrabold text-black">No articles match that search</h2>
              <p className="mx-auto mt-3 max-w-md text-[0.92rem] leading-relaxed text-slate-600">
                Try a different keyword, or clear the filter to see everything we have published.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActive('all');
                  setQuery('');
                }}
                className="mt-6 inline-flex items-center border border-black px-6 py-3 font-label text-[10px] tracking-[0.2em] text-black transition-colors duration-400 hover:bg-black hover:text-white"
              >
                CLEAR FILTERS
              </button>
            </div>
          ) : (
            <>
              {featured ? (
                <div className="mt-8">
                  <ArticleCard post={featured} featured />
                </div>
              ) : null}

              {rest.length > 0 ? (
                <div className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((post) => (
                    <ArticleCard key={post.slug} post={post} />
                  ))}
                </div>
              ) : null}
            </>
          )}
        </Container>
      </Section>
    </>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`border px-4 py-2 font-label text-[9px] tracking-[0.2em] transition-colors duration-300 ${
        active
          ? 'border-[#FF9800] bg-[#FF9800] text-black'
          : 'border-slate-300 bg-white text-slate-600 hover:border-black hover:text-black'
      }`}
    >
      {children}
    </button>
  );
}
