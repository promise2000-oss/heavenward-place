import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { NAV, SITE } from '@/data/site';
import { legalNav } from '@/data/legal';
import { MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from '@/components/ui/icons';
import { ArrowRight } from '@/components/ui/primitives';

const WHATSAPP_HREF = `https://wa.me/${SITE.contact.whatsapp}?text=${encodeURIComponent(
  'Hello Heavenward Place, I would like to enquire about accommodation.',
)}`;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="section-black grid-texture-dark overflow-hidden">
      <span className="block h-[4px] w-full bg-[#FF9800]" aria-hidden="true" />

      {/* Tagline band */}
      <div className="border-b border-white/12">
        <div className="container-hp py-14 sm:py-16">
          <div className="flex flex-col items-center gap-6 text-center">
            <Logo variant="light" height={54} href={null} />
            <p className="max-w-2xl text-balance font-display text-2xl leading-tight text-white sm:text-3xl">
              More Than A Place, It’s A Higher Calling.
            </p>
            <span className="rule-short" aria-hidden="true" />
            <p className="max-w-3xl text-pretty text-[0.95rem] leading-relaxed text-slate-300">
              Premium corporate housing, serviced shortlet apartments and concierge services for
              corporate clients, business travellers, expatriates and individuals — alongside a
              curated introduction to selected business and investment opportunities.
            </p>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/stay"
                className="group inline-flex items-center justify-center gap-2.5 border border-[#FF9800] bg-[#FF9800] px-8 py-4 font-label text-xs tracking-[0.2em] text-black transition-colors duration-400 hover:bg-transparent hover:text-[#FF9800]"
              >
                BOOK YOUR STAY
                <ArrowRight className="transition-transform duration-400 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/opportunities"
                className="group inline-flex items-center justify-center gap-2.5 border border-white px-8 py-4 font-label text-xs tracking-[0.2em] text-white transition-colors duration-400 hover:border-[#FF9800] hover:text-[#FF9800]"
              >
                EXPLORE OPPORTUNITIES
                <ArrowRight className="transition-transform duration-400 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Link columns */}
      <div className="container-hp grid gap-12 py-16 sm:py-20 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <Logo variant="light" height={46} href={null} />
          <p className="mt-6 max-w-sm text-[0.9rem] leading-relaxed text-slate-400">
            A corporate housing and lifestyle solutions company providing secure, comfortable and
            premium accommodation — and a trusted gateway to selected business and investment
            opportunities.
          </p>
          <div className="mt-7 flex flex-wrap gap-2.5">
            {SITE.social.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-white/25 px-3.5 py-2 font-label text-[9px] tracking-[0.24em] text-slate-300 transition-colors duration-300 hover:border-[#FF9800] hover:text-[#FF9800]"
              >
                {s.label.toUpperCase()}
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Footer — company" className="lg:col-span-3">
          <h2 className="font-label text-[10px] tracking-[0.32em] text-[#FF9800]">COMPANY</h2>
          <ul className="mt-6 flex flex-col gap-3.5">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="link-underline-hover text-[0.9rem] text-slate-300 transition-colors duration-300 hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Footer — legal" className="lg:col-span-2">
          <h2 className="font-label text-[10px] tracking-[0.32em] text-[#FF9800]">LEGAL</h2>
          <ul className="mt-6 flex flex-col gap-3.5">
            {legalNav.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/legal/${item.slug}`}
                  className="link-underline-hover text-[0.9rem] text-slate-300 transition-colors duration-300 hover:text-white"
                >
                  {item.title}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/legal/privacy#cookies"
                className="link-underline-hover text-[0.9rem] text-slate-300 transition-colors duration-300 hover:text-white"
              >
                Cookie Notice
              </Link>
            </li>
          </ul>
        </nav>

        <div className="lg:col-span-3">
          <h2 className="font-label text-[10px] tracking-[0.32em] text-[#FF9800]">CONTACT</h2>
          <ul className="mt-6 flex flex-col gap-4">
            <li>
              <a
                href={`tel:${SITE.contact.phoneHref}`}
                className="flex items-start gap-3 text-[0.9rem] text-slate-300 transition-colors duration-300 hover:text-white"
              >
                <PhoneIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#FF9800]" />
                <span className="font-heading font-semibold">{SITE.contact.phone}</span>
              </a>
            </li>
            <li>
              <a
                href={`mailto:${SITE.contact.email}`}
                className="flex items-start gap-3 text-[0.9rem] text-slate-300 transition-colors duration-300 hover:text-white"
              >
                <MailIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#FF9800]" />
                <span className="break-all">{SITE.contact.email}</span>
              </a>
            </li>
            <li>
              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 text-[0.9rem] text-slate-300 transition-colors duration-300 hover:text-white"
              >
                <WhatsAppIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#12805c]" />
                <span>Click to chat on WhatsApp</span>
              </a>
            </li>
            <li className="flex items-start gap-3 text-[0.9rem] text-slate-300">
              <PinIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#FF9800]" />
              <span>{SITE.contact.address}</span>
            </li>
          </ul>
          <p className="mt-5 text-[0.78rem] leading-relaxed text-slate-500">
            {SITE.contact.hours}
          </p>
        </div>
      </div>

      {/* Standing risk statement — trust is a site-wide requirement, not a page. */}
      <div className="border-t border-white/12">
        <div className="container-hp py-8">
          <div className="flex flex-col gap-4 border-l-[3px] border-[#FF9800] pl-5">
            <p className="font-label text-[9.5px] tracking-[0.28em] text-[#FF9800]">
              IMPORTANT — BUSINESS & INVESTMENT OPPORTUNITIES
            </p>
            <p className="max-w-4xl text-[0.82rem] leading-relaxed text-slate-400">
              Heavenward Place does not take custody of, hold, pool or manage customer investment
              funds through this website. The website is intended to introduce and facilitate
              discussions around selected opportunities. You should conduct appropriate due
              diligence and review the specific terms and agreements before committing funds. No
              returns are guaranteed.
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/12">
        <div className="container-hp flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="text-[0.78rem] text-slate-500">
            © {year} {SITE.name}. All rights reserved.
          </p>
          <p className="text-center font-label text-[9px] tracking-[0.28em] text-slate-500 sm:text-right">
            STAY. EXPERIENCE. EXPLORE OPPORTUNITIES.
          </p>
        </div>
      </div>
    </footer>
  );
}
