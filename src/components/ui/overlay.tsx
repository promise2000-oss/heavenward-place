'use client';

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { EASE, DURATION } from '@/components/motion/Motion';
import { Logo } from '@/components/brand/Logo';
import { Button } from './primitives';


/* ═════════════════════════════════════════════════════════════════════════════
   MODAL — focus trap, scroll lock, Escape to close, ARIA dialog semantics
   ═════════════════════════════════════════════════════════════════════════════ */

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  eyebrow?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  dismissible?: boolean;
  closeLabel?: string;
  tone?: 'default' | 'legal';
}

const SIZES = {
  sm: 'max-w-md',
  md: 'max-w-xl',
  lg: 'max-w-3xl',
  xl: 'max-w-5xl',
} as const;

export function Modal({
  open,
  onClose,
  title,
  eyebrow,
  children,
  footer,
  size = 'md',
  dismissible = true,
  closeLabel = 'Close',
  tone = 'default',
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  /*
   * `useId` rather than a module-level counter: the id must be stable across
   * re-renders, unique across every modal, and identical on the server and the
   * client so hydration does not mismatch. A `useRef(++seq)` increments the
   * counter on every render and reads a ref during render, which breaks both.
   * The `:` characters `useId` emits are valid in `id` and `aria-*` values.
   */
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const { overflow, paddingRight } = document.body.style;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && dismissible) {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0]!;
      const last = focusables[focusables.length - 1]!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    const focusTimer = window.setTimeout(() => {
      const target = panelRef.current?.querySelector<HTMLElement>(
        '[data-autofocus], button, input, a[href], textarea, select',
      );
      target?.focus();
    }, 60);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      window.clearTimeout(focusTimer);
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      previous?.focus?.();
    };
  }, [open, onClose, dismissible]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[120] flex items-end justify-center overflow-y-auto bg-black/78 p-0 backdrop-blur-[2px] sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DURATION.fast, ease: EASE }}
          onMouseDown={(event) => {
            if (dismissible && event.target === event.currentTarget) onClose();
          }}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className={`relative w-full ${SIZES[size]} ${
              tone === 'legal' ? 'bg-cream' : 'bg-white'
            } my-auto max-h-[92vh] overflow-y-auto rounded-t-[6px] border border-slate-200 shadow-2xl sm:rounded-[4px]`}
            initial={{ opacity: 0, y: 40, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.99 }}
            transition={{ duration: DURATION.base, ease: EASE }}
          >
            <span className="block h-[4px] w-full bg-[#FF9800]" aria-hidden="true" />
            <div className="flex items-start justify-between gap-6 px-6 pt-6 sm:px-9 sm:pt-8">
              <div className="flex flex-col gap-3">
                {eyebrow ? (
                  <span className="eyebrow text-black">— {eyebrow}</span>
                ) : null}
                <h2
                  id={titleId}
                  className="text-balance text-2xl font-extrabold leading-tight text-black sm:text-[1.75rem]"
                >
                  {title}
                </h2>
              </div>
              {dismissible ? (
                <button
                  type="button"
                  onClick={onClose}
                  aria-label={closeLabel}
                  className="-mr-1 -mt-1 flex h-10 w-10 shrink-0 items-center justify-center border border-transparent text-black transition-colors duration-300 hover:border-black"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
                    <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
                  </svg>
                </button>
              ) : null}
            </div>
            <div className="px-6 py-6 sm:px-9 sm:py-7">{children}</div>
            {footer ? (
              <div className="border-t border-slate-200 bg-slate-50 px-6 py-5 sm:px-9">{footer}</div>
            ) : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/* ═════════════════════════════════════════════════════════════════════════════
   ACCORDION
   ═════════════════════════════════════════════════════════════════════════════ */

export function Accordion({
  items,
  tone = 'dark',
  defaultOpen = 0,
  className = '',
}: {
  items: Array<{ question: string; answer: ReactNode }>;
  tone?: 'dark' | 'light';
  defaultOpen?: number | null;
  className?: string;
}) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  return (
    <div className={`divide-y ${tone === 'light' ? 'divide-white/15' : 'divide-slate-200'} ${className}`}>
      {items.map((item, index) => {
        const isOpen = open === index;
        return (
          <div key={item.question}>
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : index)}
                aria-expanded={isOpen}
                aria-controls={`acc-panel-${index}`}
                className={`flex w-full items-center justify-between gap-6 py-5 text-left transition-colors duration-300 ${
                  tone === 'light' ? 'text-white hover:text-[#FF9800]' : 'text-black hover:text-[#e08600]'
                }`}
              >
                <span className="font-heading text-[1.02rem] font-bold">{item.question}</span>
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center border transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    tone === 'light' ? 'border-white/40' : 'border-black/25'
                  } ${isOpen ? 'rotate-45 border-[#FF9800]' : ''}`}
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none">
                    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
                  </svg>
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  id={`acc-panel-${index}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: DURATION.base, ease: EASE }}
                  className="overflow-hidden"
                >
                  <div
                    className={`pb-6 pr-8 text-[0.94rem] leading-relaxed ${
                      tone === 'light' ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {item.answer}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════════════════
   LIGHTBOX
   ═════════════════════════════════════════════════════════════════════════════ */

export function Lightbox({
  images,
  index,
  onClose,
  onNavigate,
  name,
}: {
  images: Array<{ url: string; alt: string }>;
  index: number | null;
  onClose: () => void;
  onNavigate: (next: number) => void;
  name: string;
}) {
  const open = index !== null;
  const next = useCallback(() => {
    if (index === null) return;
    onNavigate((index + 1) % images.length);
  }, [index, images.length, onNavigate]);

  const prev = useCallback(() => {
    if (index === null) return;
    onNavigate((index - 1 + images.length) % images.length);
  }, [index, images.length, onNavigate]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') next();
      if (event.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, next, prev, onClose]);

  return (
    <AnimatePresence>
      {open && index !== null ? (
        <motion.div
          className="fixed inset-0 z-[130] flex flex-col bg-black/96"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DURATION.fast, ease: EASE }}
          role="dialog"
          aria-modal="true"
          aria-label={`${name} — photo gallery`}
        >
          <div className="flex items-center justify-between border-b border-white/15 px-5 py-4 text-white sm:px-8">
            <div className="flex items-center gap-4">
              <Logo variant="light" style="stacked" height={30} href={null} showWordmark={false} />
              <span className="font-label text-[10px] tracking-[0.3em] text-white/70">
                {String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close gallery"
              className="flex h-10 w-10 items-center justify-center border border-white/30 text-white transition-colors duration-300 hover:border-[#FF9800] hover:text-[#FF9800]"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
                <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
              </svg>
            </button>
          </div>

          <div className="relative flex flex-1 items-center justify-center px-4 py-6 sm:px-16">
            {images.length > 1 ? (
              <button
                type="button"
                onClick={prev}
                aria-label="Previous photo"
                className="absolute left-3 z-10 flex h-12 w-12 items-center justify-center border border-white/30 bg-black/40 text-white transition-colors duration-300 hover:border-[#FF9800] hover:text-[#FF9800] sm:left-6"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
                  <path d="M20 12H5M11 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
                </svg>
              </button>
            ) : null}

            <AnimatePresence mode="wait">
              <motion.img
                key={images[index]!.url}
                src={images[index]!.url}
                alt={images[index]!.alt}
                className="max-h-full max-w-full object-contain"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: DURATION.base, ease: EASE }}
              />
            </AnimatePresence>

            {images.length > 1 ? (
              <button
                type="button"
                onClick={next}
                aria-label="Next photo"
                className="absolute right-3 z-10 flex h-12 w-12 items-center justify-center border border-white/30 bg-black/40 text-white transition-colors duration-300 hover:border-[#FF9800] hover:text-[#FF9800] sm:right-6"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
                  <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
                </svg>
              </button>
            ) : null}
          </div>

          <div className="border-t border-white/15 px-5 py-4 sm:px-8">
            <p className="text-center text-[0.82rem] text-white/65">{images[index]!.alt}</p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {images.map((image, i) => (
                <button
                  key={image.url}
                  type="button"
                  onClick={() => onNavigate(i)}
                  aria-label={`View photo ${i + 1}`}
                  aria-current={i === index}
                  className={`h-1.5 w-8 transition-colors duration-300 ${
                    i === index ? 'bg-[#FF9800]' : 'bg-white/25 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/* ═════════════════════════════════════════════════════════════════════════════
   CONFIRMATION DIALOG
   ═════════════════════════════════════════════════════════════════════════════ */

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  destructive = false,
  busy = false,
}: {
  open: boolean;
  title: string;
  message: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean;
  busy?: boolean;
}) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      size="sm"
      footer={
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="outline" size="sm" onClick={onCancel} disabled={busy}>
            {cancelLabel}
          </Button>
          <Button
            variant={destructive ? 'danger' : 'primary'}
            size="sm"
            onClick={onConfirm}
            disabled={busy}
            data-autofocus
          >
            {busy ? 'Working…' : confirmLabel}
          </Button>
        </div>
      }
    >
      <div className="text-[0.94rem] leading-relaxed text-slate-600">{message}</div>
    </Modal>
  );
}
