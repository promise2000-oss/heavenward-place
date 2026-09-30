import Image from 'next/image';
import Link from 'next/link';
import type { RichBlock } from '@/data/types';

/**
 * Rich-text renderer for editorial blocks.
 * A deliberately small, safe block set — no arbitrary HTML is ever rendered.
 */
export function RichContent({ blocks }: { blocks: RichBlock[] }) {
  return (
    <div className="flex flex-col gap-6">
      {blocks.map((block, index) => {
        switch (block.kind) {
          case 'heading':
            return block.level === 2 ? (
              <h2
                key={index}
                id={slugify(block.text)}
                className="mt-6 scroll-mt-28 text-xl font-extrabold text-black sm:text-2xl"
              >
                {block.text}
              </h2>
            ) : (
              <h3
                key={index}
                id={slugify(block.text)}
                className="mt-4 scroll-mt-28 text-lg font-extrabold text-black"
              >
                {block.text}
              </h3>
            );

          case 'paragraph':
            return (
              <p key={index} className="text-pretty text-[1.01rem] leading-[1.8] text-slate-700">
                {block.text}
              </p>
            );

          case 'list':
            return block.style === 'numbered' ? (
              <ol key={index} className="flex flex-col gap-3.5">
                {block.items.map((item, i) => (
                  <li key={i} className="flex gap-4 text-[0.98rem] leading-[1.75] text-slate-700">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center bg-black font-label text-[10px] text-white">
                      {i + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ol>
            ) : (
              <ul key={index} className="flex flex-col gap-3">
                {block.items.map((item, i) => (
                  <li key={i} className="flex gap-3.5 text-[0.98rem] leading-[1.75] text-slate-700">
                    <span
                      className="mt-3 h-1.5 w-1.5 shrink-0 bg-[#FF9800]"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            );

          case 'quote':
            return (
              <figure key={index} className="border-l-[3px] border-[#FF9800] pl-6">
                <blockquote className="text-balance font-heading text-[1.1rem] font-bold leading-relaxed text-black sm:text-[1.25rem]">
                  “{block.text}”
                </blockquote>
                {block.attribution ? (
                  <figcaption className="mt-3 font-label text-[9.5px] tracking-[0.24em] text-slate-500">
                    {block.attribution.toUpperCase()}
                  </figcaption>
                ) : null}
              </figure>
            );

          case 'callout': {
            const map = {
              info: 'border-[#1f5f9e]/30 bg-[#1f5f9e]/[0.05]',
              warning: 'border-[#b26a00]/35 bg-[#b26a00]/[0.06]',
              legal: 'border-black bg-cream',
            } as const;
            const bar = { info: '#1f5f9e', warning: '#b26a00', legal: '#000000' } as const;
            return (
              <div key={index} className={`border-l-[3px] p-6 ${map[block.tone]}`}>
                <span
                  className="absolute left-0 h-full w-[3px]"
                  style={{ background: bar[block.tone] }}
                  aria-hidden="true"
                />
                {block.title ? (
                  <p className="font-label text-[9.5px] tracking-[0.24em] text-black">
                    {block.title.toUpperCase()}
                  </p>
                ) : null}
                <p className="mt-3 text-[0.92rem] leading-relaxed text-slate-700">{block.text}</p>
              </div>
            );
          }

          case 'rule':
            return <hr key={index} className="my-4 border-0 border-t border-slate-200" />;

          default:
            return null;
        }
      })}
    </div>
  );
}

export function ArticleCard({
  post,
  featured = false,
}: {
  post: {
    slug: string;
    title: string;
    excerpt: string;
    coverImage: string;
    category: string;
    tags: string[];
    readingTimeMinutes: number;
    publishedAt: string;
    author: string;
  };
  featured?: boolean;
}) {
  return (
    <article
      className={`group flex h-full flex-col border border-slate-200 bg-white transition-shadow duration-400 hover:shadow-[0_24px_60px_-36px_rgba(0,0,0,0.45)] ${
        featured ? 'lg:flex-row' : ''
      }`}
    >
      <div
        className={`relative overflow-hidden bg-slate-100 ${
          featured ? 'aspect-[16/10] lg:aspect-auto lg:w-1/2' : 'aspect-[16/10]'
        }`}
      >
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          sizes={featured ? '(max-width: 1024px) 100vw, 50vw' : '(max-width: 768px) 100vw, 33vw'}
          className="object-cover transition-transform duration-800 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
        />
      </div>
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-label text-[9px] tracking-[0.24em] text-[#e08600]">
            {post.category.replace(/-/g, ' ').toUpperCase()}
          </span>
          <span className="h-3 w-px bg-slate-300" aria-hidden="true" />
          <span className="text-[0.78rem] text-slate-500">{post.readingTimeMinutes} min read</span>
        </div>
        <h3
          className={`mt-3.5 text-balance font-heading font-extrabold leading-snug text-black ${
            featured ? 'text-2xl sm:text-[1.75rem]' : 'text-[1.05rem]'
          }`}
        >
          <Link href={`/insights/${post.slug}`} className="link-underline-hover">
            {post.title}
          </Link>
        </h3>
        <p
          className={`mt-3 flex-1 leading-relaxed text-slate-600 ${
            featured ? 'text-[0.98rem]' : 'line-clamp-3 text-[0.87rem]'
          }`}
        >
          {post.excerpt}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
          {post.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-[0.75rem] text-slate-500">
              #{tag.replace(/\s+/g, '')}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}
