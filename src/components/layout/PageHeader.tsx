import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/primitives';
import { Reveal, Parallax } from '@/components/motion/Motion';
import { breadcrumbJsonLd } from '@/lib/seo';

/**
 * Shared page header.
 * Dark, photography-led, reversed logo treatment with an orange rule —
 * consistent across every non-home page.
 */
export function PageHeader({
  eyebrow,
  title,
  intro,
  image,
  breadcrumbs,
  children,
  compact = false,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  image: string;
  breadcrumbs?: Array<{ name: string; url: string }>;
  children?: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-black">
      <Parallax distance={60} className="absolute inset-0 -z-10">
        <Image
          src={image}
          alt=""
          fill
          priority
          quality={80}
          sizes="100vw"
          className="object-cover"
        />
      </Parallax>
      <div className="scrim absolute inset-0 -z-10" />
      <div className="grid-texture-dark absolute inset-0 -z-10 opacity-60" aria-hidden="true" />

      <Container className={compact ? 'py-16 sm:py-20' : 'py-20 sm:py-24 lg:py-28'}>
        {breadcrumbs ? (
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 font-label text-[9px] tracking-[0.24em] text-white/55">
              {breadcrumbs.map((crumb, index) => (
                <li key={crumb.url} className="flex items-center gap-2">
                  {index > 0 ? (
                    <span className="text-[#FF9800]" aria-hidden="true">
                      /
                    </span>
                  ) : null}
                  {index === breadcrumbs.length - 1 ? (
                    <span className="text-white/90">{crumb.name.toUpperCase()}</span>
                  ) : (
                    <Link href={crumb.url} className="transition-colors hover:text-[#FF9800]">
                      {crumb.name.toUpperCase()}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        <Reveal>
          <p className="eyebrow text-[#FF9800]">— {eyebrow}</p>
          <h1 className="mt-6 max-w-4xl text-balance font-display text-[2.1rem] leading-[0.98] text-white sm:text-[3.2rem] lg:text-[3.9rem]">
            {title}
          </h1>
          {intro ? (
            <p className="mt-7 max-w-2xl text-pretty text-[1.02rem] leading-relaxed text-slate-300">
              {intro}
            </p>
          ) : null}
          <span className="mt-9 block h-[3px] w-16 bg-[#FF9800]" aria-hidden="true" />
          {children ? <div className="mt-9">{children}</div> : null}
        </Reveal>
      </Container>

      {breadcrumbs ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }}
        />
      ) : null}
    </section>
  );
}
