'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from 'framer-motion';

/**
 * Motion system.
 *
 * One easing curve throughout: cubic-bezier(0.22, 1, 0.36, 1).
 * Durations 0.4 – 0.8s.
 * Every component degrades to an instant, non-animated state under
 * `prefers-reduced-motion: reduce`.
 */

export const EASE = [0.22, 1, 0.36, 1] as const;

export const DURATION = {
  fast: 0.4,
  base: 0.6,
  slow: 0.8,
} as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DURATION.slow, ease: EASE } },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0, transition: { duration: DURATION.base, ease: EASE } },
};

export const staggerParent = (stagger = 0.09, delayChildren = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren } },
});

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  duration?: number;
  once?: boolean;
  as?: 'div' | 'section' | 'li' | 'article' | 'header' | 'span';
}

/** Scroll-reveal fade + slide-up. */
export function Reveal({
  children,
  className = '',
  delay = 0,
  y = 28,
  duration = DURATION.base,
  once = true,
  as = 'div',
}: RevealProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: '-12% 0px -8% 0px' });
  const MotionTag = motion[as] as typeof motion.div;

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <MotionTag
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration, ease: EASE, delay }}
    >
      {children}
    </MotionTag>
  );
}

interface StaggerProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}

/** Staggered card entrances. Children should be <Stagger.Item>. */
export function Stagger({ children, className = '', stagger = 0.09, delay = 0 }: StaggerProps) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-10% 0px' }}
      variants={staggerParent(stagger, delay)}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = '',
  y = 24,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} variants={fadeUp} initial="hidden" style={{ willChange: 'transform' }}>
      <motion.div
        initial={{ opacity: 0, y }}
        whileHover={{ y: y - 6 }}
        transition={{ duration: DURATION.fast, ease: EASE }}
        className="h-full"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

interface ParallaxProps {
  children: ReactNode;
  className?: string;
  /** Total travel in px across the scroll range. */
  distance?: number;
  scale?: boolean;
}

/** Image parallax used on the hero and section imagery. */
export function Parallax({ children, className = '', distance = 90, scale = true }: ParallaxProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.4 });
  const y = useTransform(smooth, [0, 1], [distance, -distance]);
  const s = useTransform(smooth, [0, 0.5, 1], [scale ? 1.12 : 1, 1, scale ? 1.12 : 1]);

  if (reduce) return <div ref={ref} className={className}>{children}</div>;

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div style={{ y, scale: s, height: '100%' }} className="h-full">
        {children}
      </motion.div>
    </div>
  );
}

/** Orange underline that draws itself when the section enters view. */
export function DrawRule({ className = '', delay = 0 }: { className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });

  if (reduce) return <span className={`block h-[3px] w-full bg-[#FF9800] ${className}`} />;

  return (
    <span className={`block h-[3px] w-full origin-left bg-[#FF9800] ${className}`}>
      <motion.span
        ref={ref}
        className="block h-full w-full origin-left bg-[#FF9800]"
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: DURATION.slow, ease: EASE, delay }}
      />
    </span>
  );
}

/** Gentle hover lift used by cards and buttons. */
export function Lift({
  children,
  className = '',
  amount = 6,
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      whileHover={{ y: -amount }}
      transition={{ duration: DURATION.fast, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Section wrapper that fades its children in as the section scrolls into view. */
export function SectionReveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-5% 0px' });

  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0.4 }}
      animate={inView ? { opacity: 1 } : { opacity: 0.4 }}
      transition={{ duration: DURATION.slow, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** True once the component has mounted — used to avoid hydration mismatches. */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
