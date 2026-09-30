'use client';

import { useId, type ComponentProps, type ReactNode } from 'react';

const FIELD_BASE =
  'w-full rounded-[3px] border border-slate-300 bg-white px-4 py-3 text-[0.95rem] text-black placeholder:text-slate-400 transition-colors duration-300 hover:border-slate-400 focus:border-[#FF9800] focus:outline-none focus-visible:border-[#FF9800] disabled:bg-slate-50 disabled:text-slate-400';
const FIELD_ERROR = 'border-[#c02626] focus:border-[#c02626]';

export function Field({
  label,
  htmlFor,
  hint,
  error,
  required,
  children,
  className = '',
}: {
  label?: ReactNode;
  htmlFor?: string;
  hint?: ReactNode;
  error?: string | null;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label ? (
        <label htmlFor={htmlFor} className="font-label text-[10px] tracking-[0.26em] text-black">
          {label}
          {required ? <span className="ml-1 text-[#FF9800]">*</span> : null}
        </label>
      ) : null}
      {children}
      {hint && !error ? <p className="text-[0.78rem] leading-snug text-slate-500">{hint}</p> : null}
      {error ? (
        <p role="alert" className="flex items-start gap-1.5 text-[0.78rem] font-medium text-[#c02626]">
          <svg viewBox="0 0 20 20" className="mt-0.5 h-3.5 w-3.5 shrink-0" fill="currentColor" aria-hidden="true">
            <path d="M10 1.6 19 18H1L10 1.6Zm0 5.4a.9.9 0 0 0-.9.9v4.2a.9.9 0 1 0 1.8 0V7.9a.9.9 0 0 0-.9-.9Zm0 7.4a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z" />
          </svg>
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function Input({
  label,
  hint,
  error,
  className = '',
  ...rest
}: ComponentProps<'input'> & { label?: ReactNode; hint?: ReactNode; error?: string | null }) {
  const id = useId();
  return (
    <Field label={label} htmlFor={id} hint={hint} error={error} required={rest.required}>
      <input
        id={id}
        className={`${FIELD_BASE} ${error ? FIELD_ERROR : ''} ${className}`}
        aria-invalid={error ? true : undefined}
        {...rest}
      />
    </Field>
  );
}

export function Textarea({
  label,
  hint,
  error,
  className = '',
  rows = 4,
  ...rest
}: ComponentProps<'textarea'> & { label?: ReactNode; hint?: ReactNode; error?: string | null }) {
  const id = useId();
  return (
    <Field label={label} htmlFor={id} hint={hint} error={error} required={rest.required}>
      <textarea
        id={id}
        rows={rows}
        className={`${FIELD_BASE} resize-y leading-relaxed ${error ? FIELD_ERROR : ''} ${className}`}
        aria-invalid={error ? true : undefined}
        {...rest}
      />
    </Field>
  );
}

export function Select({
  label,
  hint,
  error,
  className = '',
  children,
  placeholder = 'Select…',
  ...rest
}: Omit<ComponentProps<'select'>, 'placeholder'> & {
  label?: ReactNode;
  hint?: ReactNode;
  error?: string | null;
  placeholder?: string;
}) {
  const id = useId();
  return (
    <Field label={label} htmlFor={id} hint={hint} error={error} required={rest.required}>
      <div className="relative">
        <select
          id={id}
          className={`${FIELD_BASE} appearance-none pr-10 ${error ? FIELD_ERROR : ''} ${className}`}
          aria-invalid={error ? true : undefined}
          {...rest}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {children}
        </select>
        <svg
          viewBox="0 0 24 24"
          className="pointer-events-none absolute right-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-black"
          fill="none"
          aria-hidden="true"
        >
          <path d="M5 9l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
        </svg>
      </div>
    </Field>
  );
}

export function Checkbox({
  label,
  hint,
  error,
  className = '',
  ...rest
}: ComponentProps<'input'> & { label?: ReactNode; hint?: ReactNode; error?: string | null }) {
  const id = useId();
  return (
    <div className={`flex gap-3 ${className}`}>
      <input
        type="checkbox"
        id={id}
        className={`mt-0.5 h-[18px] w-[18px] shrink-0 cursor-pointer appearance-none rounded-[2px] border-[1.5px] border-black bg-white transition-colors duration-200 checked:border-[#FF9800] checked:bg-[#FF9800] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF9800] ${
          error ? 'border-[#c02626]' : ''
        }`}
        style={{
          backgroundImage: 'none',
        }}
        aria-invalid={error ? true : undefined}
        {...rest}
      />
      <div className="flex flex-col gap-1">
        {label ? (
          <label htmlFor={id} className="cursor-pointer text-[0.9rem] leading-snug text-slate-700">
            {label}
          </label>
        ) : null}
        {hint && !error ? <p className="text-[0.78rem] text-slate-500">{hint}</p> : null}
        {error ? (
          <p role="alert" className="text-[0.78rem] font-medium text-[#c02626]">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}

/** Checkbox with an orange tick drawn in CSS. */
export function BrandCheckbox({
  label,
  hint,
  error,
  className = '',
  ...rest
}: ComponentProps<'input'> & { label?: ReactNode; hint?: ReactNode; error?: string | null }) {
  const id = useId();
  return (
    <div className={`flex gap-3 ${className}`}>
      <span className="relative mt-0.5 h-[19px] w-[19px] shrink-0">
        <input
          type="checkbox"
          id={id}
          className="peer absolute inset-0 h-full w-full cursor-pointer appearance-none rounded-[2px] border-[1.5px] border-black bg-white transition-colors duration-200 checked:border-[#FF9800] checked:bg-[#FF9800] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF9800]"
          aria-invalid={error ? true : undefined}
          {...rest}
        />
        <svg
          viewBox="0 0 20 20"
          className="pointer-events-none absolute left-[3px] top-[3px] h-[13px] w-[13px] scale-0 text-black transition-transform duration-200 peer-checked:scale-100"
          fill="none"
          aria-hidden="true"
        >
          <path d="M4 10.5 8 14.5 16 5.5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="square" />
        </svg>
      </span>
      <div className="flex flex-col gap-1">
        {label ? (
          <label htmlFor={id} className="cursor-pointer text-[0.9rem] leading-snug text-slate-700">
            {label}
          </label>
        ) : null}
        {hint && !error ? <p className="text-[0.78rem] text-slate-500">{hint}</p> : null}
        {error ? (
          <p role="alert" className="text-[0.78rem] font-medium text-[#c02626]">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function RadioCard({
  label,
  description,
  icon,
  checked,
  className = '',
  ...rest
}: ComponentProps<'input'> & {
  label: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
}) {
  const id = useId();
  return (
    <label
      htmlFor={id}
      className={`group relative flex cursor-pointer items-start gap-4 border-[1.5px] p-5 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] has-[:checked]:border-[#FF9800] has-[:checked]:bg-[#FF9800]/[0.07] hover:border-slate-400 ${
        checked ? 'border-[#FF9800] bg-[#FF9800]/[0.07]' : 'border-slate-200 bg-white'
      } ${className}`}
    >
      <input type="radio" id={id} className="peer sr-only" checked={checked} {...rest} />
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-[1.5px] transition-colors ${
          checked ? 'border-[#FF9800]' : 'border-slate-400'
        } peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#FF9800]`}
        aria-hidden="true"
      >
        <span
          className={`h-2.5 w-2.5 rounded-full bg-[#FF9800] transition-transform duration-300 ${
            checked ? 'scale-100' : 'scale-0'
          }`}
        />
      </span>
      <span className="flex flex-col gap-1.5">
        <span className="flex items-center gap-2.5 font-heading text-[0.98rem] font-bold text-black">
          {icon}
          {label}
        </span>
        {description ? <span className="text-[0.85rem] leading-relaxed text-slate-600">{description}</span> : null}
      </span>
    </label>
  );
}

export function FormStatus({
  status,
  message,
}: {
  /** `success` is never set now that there is no server to confirm a post. */
  status: 'idle' | 'sending' | 'success' | 'error' | 'invalid';
  message?: string | null;
}) {
  if (status === 'idle' || status === 'sending' || !message) return null;
  const ok = status === 'success';
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex items-start gap-3 border-l-[3px] px-4 py-3.5 text-[0.88rem] ${
        ok ? 'border-[#12805c] bg-[#12805c]/[0.06] text-[#0d5f44]' : 'border-[#c02626] bg-[#c02626]/[0.06] text-[#96201f]'
      }`}
    >
      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-current" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}

/** Honeypot — visually and programmatically hidden from real users. */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden">
      <label htmlFor="website">Website</label>
      <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
    </div>
  );
}
