import Link from 'next/link';
import { Container, Section, SectionHeading } from '@/components/ui/primitives';
import { ArrowIcon } from './opportunity-ui';

/**
 * The two journeys (PRD §2).
 *
 * Rendered on `/opportunities`, the one place a visitor chooses which journey to
 * enter. Business Opportunities and Investment Opportunities are separate from
 * here on — once a journey is selected, only that journey's content is shown.
 */
export function JourneyChooser() {
  return (
    <Section tone="cream-soft">
      <Container>
        <SectionHeading
          eyebrow="Choose Your Journey"
          rule
          title="Two kinds of opportunity, kept separate"
          intro="Business Opportunities and Investment Opportunities are different in how they work, so each has its own journey. Pick the one that describes what you are looking for — you will only ever see that journey's content."
          align="center"
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {/* Investment */}
          <article className="edge-orange flex h-full flex-col border border-slate-200 bg-white p-8">
            <p className="font-label text-[9.5px] tracking-[0.24em] text-[#e08600]">JOURNEY 01</p>
            <h3 className="mt-5 font-heading text-2xl font-extrabold leading-tight text-black">
              Investment Opportunities
            </h3>
            <p className="mt-4 text-[0.92rem] leading-relaxed text-slate-600">
              Six curated investment categories — agro real estate, rental income property, precious
              metals, precious stones, joint ventures and distribution income. Each opportunity sets
              out the roles of Heavenward Place and of you, the applicable terms, the risks and any
              expected time horizon before you decide to proceed.
            </p>
            <ul className="mt-5 flex flex-col gap-2.5">
              {[
                'Six established investment categories',
                'Heavenward Place facilitates the opportunity and the process',
                'Roles, terms, risks and time horizon set out up front',
              ].map((item) => (
                <li key={item} className="flex gap-2.5 text-[0.85rem] leading-relaxed text-slate-600">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-[#FF9800]" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-7 flex-1" />
            <Link
              href="/opportunities/investment"
              className="group inline-flex items-center justify-center gap-2.5 border border-[#FF9800] bg-[#FF9800] px-7 py-4 font-label text-[10.5px] tracking-[0.2em] text-black transition-colors duration-400 hover:bg-transparent hover:text-[#FF9800]"
            >
              EXPLORE INVESTMENT OPPORTUNITIES
              <ArrowIcon className="transition-transform duration-400 group-hover:translate-x-1" />
            </Link>
          </article>

          {/* Business */}
          <article className="edge-orange flex h-full flex-col border border-slate-200 bg-white p-8">
            <p className="font-label text-[9.5px] tracking-[0.24em] text-[#e08600]">JOURNEY 02</p>
            <h3 className="mt-5 font-heading text-2xl font-extrabold leading-tight text-black">
              Business Opportunities
            </h3>
            <p className="mt-4 text-[0.92rem] leading-relaxed text-slate-600">
              Openings we add and update as they arise. Here the customer and Heavenward Place’s
              business associates facilitate the business together, each with a defined role — and
              Heavenward Place has a defined role in every listing. No business is promised to
              generate high profits indefinitely, and no return is guaranteed.
            </p>
            <ul className="mt-5 flex flex-col gap-2.5">
              {[
                'Frequently updated as suitable openings arise',
                'Defined roles for you, Heavenward Place and our associates',
                'Short-term or long-term; details agreed privately',
              ].map((item) => (
                <li key={item} className="flex gap-2.5 text-[0.85rem] leading-relaxed text-slate-600">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-[#FF9800]" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-7 flex-1" />
            <Link
              href="/opportunities/business"
              className="group inline-flex items-center justify-center gap-2.5 border border-black px-7 py-4 font-label text-[10.5px] tracking-[0.2em] text-black transition-colors duration-400 hover:bg-black hover:text-white"
            >
              EXPLORE BUSINESS OPPORTUNITIES
              <ArrowIcon className="transition-transform duration-400 group-hover:translate-x-1" />
            </Link>
          </article>
        </div>
      </Container>
    </Section>
  );
}
