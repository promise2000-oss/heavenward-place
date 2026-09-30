import Link from 'next/link';
import { Container } from '@/components/ui/primitives';
import { HouseMark } from '@/components/brand/HouseMark';

export default function NotFound() {
  return (
    <section className="section-black grid-texture-dark">
      <Container className="flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
        <HouseMark variant="light" className="h-16 w-auto" />
        <p className="eyebrow mt-10 text-[#FF9800]">— 404</p>
        <h1 className="mt-6 text-balance font-display text-4xl leading-tight text-white sm:text-5xl">
          We cannot find that page.
        </h1>
        <p className="mt-6 max-w-lg text-[0.98rem] leading-relaxed text-slate-300">
          The page may have moved, or the link may be incorrect. Nothing is lost — head back to the
          residences, or tell us what you were looking for and we will point you to it.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center border border-[#FF9800] bg-[#FF9800] px-8 py-4 font-label text-xs tracking-[0.22em] text-black transition-colors duration-400 hover:bg-transparent hover:text-[#FF9800]"
          >
            BACK TO HOME
          </Link>
          <Link
            href="/stay"
            className="inline-flex items-center justify-center border border-white/50 px-8 py-4 font-label text-xs tracking-[0.22em] text-white transition-colors duration-400 hover:border-white hover:bg-white hover:text-black"
          >
            EXPLORE RESIDENCES
          </Link>
        </div>
      </Container>
    </section>
  );
}
