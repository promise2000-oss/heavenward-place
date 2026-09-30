'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { DURATION, EASE, Parallax, useMounted } from '@/components/motion/Motion';
import { Logo } from '@/components/brand/Logo';
import { ArrowRight } from '@/components/ui/primitives';
import { track } from '@/lib/analytics';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2400&q=85';

const STATS = [
  { value: '6', label: 'Premium residences' },
  { value: '4', label: 'Lagos locations' },
  { value: '7+', label: 'Nights for long-stay benefits' },
  { value: '24/7', label: 'Guest support' },
];

/**
 * Home hero.
 * Dark, photography-led, reversed logo, orange accents, parallax image,
 * "Stay. Experience. Explore Opportunities." as the direction line.
 */
export function Hero() {
  const reduce = useReducedMotion();
  const mounted = useMounted();

  return (
    <section className="relative isolate overflow-hidden bg-black" aria-labelledby="hero-heading">
      {/* Parallax background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <Parallax distance={70} scale>
          <Image
            src={HERO_IMAGE}
            alt="Premium serviced apartment living area overlooking the Lagos skyline at dusk"
            fill
            priority
            quality={85}
            sizes="100vw"
            className="object-cover"
          />
        </Parallax>
        <div className="scrim absolute inset-0" />
        <div className="scrim-bottom absolute inset-0 opacity-70" />
        <div className="grid-texture-dark absolute inset-0 opacity-60" />
      </div>

      <div className="container-hp relative">
        <div className="grid items-center gap-14 py-20 sm:py-24 lg:grid-cols-12 lg:gap-10 lg:py-32">
          <div className="lg:col-span-7">
            <motion.div
              initial={mounted && !reduce ? { opacity: 0, y: 24 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DURATION.base, ease: EASE }}
            >
              <Logo variant="light" height={46} href={null} className="mb-10" />

              <p className="eyebrow text-[#FF9800]">— Premium Corporate Housing · Lagos</p>

              <h1
                id="hero-heading"
                className="mt-7 text-balance font-display text-[2.6rem] leading-[0.94] text-white sm:text-6xl lg:text-[4.5rem]"
              >
                Stay.
                <br />
                Experience.
                <br />
                <span className="text-[#FF9800]">Explore Opportunities.</span>
              </h1>

              <p className="mt-8 max-w-xl text-pretty text-[1.05rem] leading-relaxed text-slate-200 sm:text-[1.15rem]">
                Secure, serviced residences for corporate clients, business travellers,
                expatriates and individuals — and a curated introduction to selected business
                and investment opportunities across six categories.
              </p>

              <div className="mt-10 flex flex-col gap-3.5 sm:flex-row sm:items-center">
                <Link
                  href="/stay"
                  onClick={() => track('booking_started', { source: 'hero' })}
                  className="group inline-flex items-center justify-center gap-3 border border-[#FF9800] bg-[#FF9800] px-9 py-4.5 font-label text-xs tracking-[0.22em] text-black transition-colors duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-transparent hover:text-[#FF9800]"
                >
                  BOOK YOUR STAY
                  <ArrowRight className="transition-transform duration-400 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/opportunities"
                  onClick={() => track('opportunities_viewed', { source: 'hero' })}
                  className="group inline-flex items-center justify-center gap-3 border border-white/50 px-9 py-4.5 font-label text-xs tracking-[0.22em] text-white transition-colors duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-[#FF9800] hover:text-[#FF9800]"
                >
                  EXPLORE BUSINESS &amp; INVESTMENT
                  <ArrowRight className="transition-transform duration-400 group-hover:translate-x-1" />
                </Link>
              </div>

              <p className="mt-8 max-w-lg border-l-[3px] border-[#FF9800] pl-4 text-[0.82rem] leading-relaxed text-slate-400">
                Heavenward Place does not take custody of, hold, pool or manage customer
                investment funds. The Business &amp; Investment section introduces selected
                opportunities for discussion. No returns are guaranteed.
              </p>
            </motion.div>
          </div>

          <div className="lg:col-span-5">
            <motion.div
              initial={mounted && !reduce ? { opacity: 0, y: 32 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DURATION.slow, ease: EASE, delay: 0.15 }}
              className="border border-white/15 bg-white/[0.04] p-8 backdrop-blur-sm sm:p-10"
            >
              <p className="eyebrow text-white/60">— What you get</p>
              <ul className="mt-7 flex flex-col gap-5">
                {[
                  'Fully serviced residences with daily housekeeping',
                  'Live availability — confirmed bookings block dates instantly',
                  'Long stays of 7+ nights include pickup and private-chef meals',
                  'Concierge during booking and after check-in',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3.5">
                    <span className="mt-1.5 h-2 w-2 shrink-0 bg-[#FF9800]" aria-hidden="true" />
                    <span className="text-[0.92rem] leading-relaxed text-slate-200">{item}</span>
                  </li>
                ))}
              </ul>
              <span className="mt-8 block h-[3px] w-16 bg-[#FF9800]" aria-hidden="true" />
              <p className="mt-6 font-display text-lg text-white">
                More Than A Place, It’s A Higher Calling.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Stat band */}
        <div className="grid grid-cols-2 gap-px border-t border-white/15 bg-white/10 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="bg-black/85 px-6 py-7 backdrop-blur-sm">
              <div className="font-display text-3xl text-[#FF9800] sm:text-4xl">{stat.value}</div>
              <div className="mt-2 font-label text-[9px] leading-relaxed tracking-[0.28em] text-white/60">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
