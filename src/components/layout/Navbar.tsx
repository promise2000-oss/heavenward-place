'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Logo } from '@/components/brand/Logo';
import { LinkButton } from './navbar-parts';
import { DURATION, EASE } from '@/components/motion/Motion';
import { NAV, SITE } from '@/data/site';
import { CloseIcon, MenuIcon, PhoneIcon, WhatsAppIcon } from '@/components/ui/icons';

const WHATSAPP_HREF = `https://wa.me/${SITE.contact.whatsapp}?text=${encodeURIComponent(
  'Hello Heavenward Place, I would like to enquire about accommodation.',
)}`;

export function Navbar() {
  const pathname = usePathname();
  /*
   * The mobile menu and the account dropdown are keyed by the route they were
   * opened on, so navigating away closes them as a *derived* consequence rather
   * than via an effect. The previous version used an effect on `pathname`,
   * which meant the menu stayed open for one frame after a route change.
   */
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const open = menuPath === pathname;
  const setOpen = useCallback(
    (next: boolean) => setMenuPath(next ? pathname : null),
    [pathname],
  );
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      {/* Utility bar */}
      <div className="hidden bg-black text-white lg:block">
        {/*
         * The primary CTA lives here rather than in the white header below.
         *
         * Logo + navigation + button need 1343px, but the 1280px container
         * gives the header 1240px — a 103px shortfall that collapsed "Stay
         * With Us" onto three lines and wrapped the button. The button alone
         * is 198px of that, so moving it here buys the navigation 94px of
         * genuine breathing room instead of a bar that never fits at any
         * desktop width.
         *
         * `h-11` rather than the old `h-9`: the button is 38.5px tall with its
         * border and would have overflowed a 36px bar.
         */}
        <div className="container-hp flex h-11 items-center justify-between gap-6">
          <p className="font-label text-[9.5px] tracking-[0.3em] text-white/70">
            PREMIUM CORPORATE HOUSING · LAGOS, NIGERIA
          </p>
          <div className="flex items-center gap-6">
            <a
              href={`tel:${SITE.contact.phoneHref}`}
              className="link-underline-hover font-label text-[9.5px] tracking-[0.3em] text-white/85 hover:text-white"
            >
              {SITE.contact.phone}
            </a>
            <span className="h-3 w-px bg-white/25" aria-hidden="true" />
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline-hover flex items-center gap-1.5 font-label text-[9.5px] tracking-[0.3em] text-[#FF9800]"
            >
              <WhatsAppIcon className="h-3 w-3" /> WHATSAPP
            </a>
            <LinkButton href="/stay" variant="primary" size="sm">
              Book Your Stay
            </LinkButton>
          </div>
        </div>
      </div>

      <header
        className={`sticky top-0 z-[90] w-full border-b transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          scrolled
            ? 'border-slate-200 bg-white/97 shadow-[0_1px_0_rgba(0,0,0,0.04),0_8px_24px_-16px_rgba(0,0,0,0.25)] backdrop-blur-md'
            : 'border-transparent bg-white'
        }`}
      >
        <div className="container-hp flex h-[84px] items-center justify-between gap-8 xl:h-[var(--hp-nav-height)]">
          <Logo height={40} className="xl:hidden" style="stacked" showWordmark={false} />
          <Logo
            height={44}
            /*
             * `max-xl:hidden`, not `hidden xl:inline-flex`.
             *
             * The wordmark logo carries its own `inline-flex`, and `hidden` is
             * also a base-level display utility — so which one wins depends on
             * the order Tailwind emits them, not on the order in this
             * attribute. It lost, and the wordmark rendered alongside the
             * stacked mark below `xl`. A variant such as `max-xl:` is always
             * emitted after base utilities, so it wins deterministically.
             */
            className="max-xl:hidden"
          />

          <nav aria-label="Primary" className="hidden xl:block">
            <ul className="flex items-center gap-9">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    className={`group relative font-label text-[10.5px] tracking-[0.18em] transition-colors duration-300 ${
                      isActive(item.href) ? 'text-black' : 'text-slate-600 hover:text-black'
                    }`}
                  >
                    <span className="whitespace-nowrap">
                      {item.label === 'Business & Investment Opportunities'
                        ? 'Business & Investment'
                        : item.label}
                    </span>
                    <span
                      className={`absolute -bottom-2 left-0 h-[2px] bg-[#FF9800] transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        isActive(item.href)
                          ? 'w-full scale-x-100'
                          : 'w-full scale-x-0 origin-right group-hover:scale-x-100 group-hover:origin-left'
                      }`}
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              className="flex h-11 w-11 items-center justify-center border border-slate-300 text-black transition-colors duration-300 hover:border-black xl:hidden"
            >
              <MenuIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        <span className="block h-[2px] w-full bg-[#FF9800]" aria-hidden="true" />
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[110] xl:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.fast, ease: EASE }}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <div
              className="absolute inset-0 bg-black/70"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              className="absolute inset-y-0 right-0 flex w-[min(400px,90vw)] flex-col bg-white"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: DURATION.base, ease: EASE }}
            >
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                <Logo height={34} style="stacked" showWordmark={false} />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="flex h-10 w-10 items-center justify-center border border-slate-300 text-black"
                >
                  <CloseIcon className="h-5 w-5" />
                </button>
              </div>
              <span className="block h-[3px] w-full bg-[#FF9800]" aria-hidden="true" />

              <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-6 py-7">
                <ul className="flex flex-col">
                  {NAV.map((item, index) => (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: DURATION.base, ease: EASE, delay: index * 0.045 }}
                      className="border-b border-slate-100"
                    >
                      <Link
                        href={item.href}
                        aria-current={isActive(item.href) ? 'page' : undefined}
                        className={`flex items-center justify-between py-5 font-heading text-[0.98rem] font-bold transition-colors duration-300 ${
                          isActive(item.href) ? 'text-black' : 'text-slate-700'
                        }`}
                      >
                        {item.label}
                        <span className="font-label text-[9px] tracking-[0.2em] text-[#FF9800]">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              <div className="border-t border-slate-200 bg-slate-50 p-6">
                <div className="flex flex-col gap-2.5">
                  <LinkButton href="/contact" variant="primary" size="sm" fullWidth>
                    Enquire
                  </LinkButton>
                  <a
                    href={`tel:${SITE.contact.phoneHref}`}
                    className="inline-flex w-full items-center justify-center gap-2.5 border border-black px-4 py-2.5 font-label text-[11px] uppercase tracking-[0.18em] text-black transition-colors duration-300 hover:bg-black hover:text-white"
                  >
                    <PhoneIcon className="h-3.5 w-3.5" />
                    {SITE.contact.phone}
                  </a>
                </div>
                <a
                  href={WHATSAPP_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center justify-center gap-2 font-label text-[9.5px] tracking-[0.24em] text-black"
                >
                  <WhatsAppIcon className="h-3.5 w-3.5 text-[#12805c]" /> CHAT ON WHATSAPP
                </a>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
