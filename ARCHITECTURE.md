# Architecture — Heavenward Place

Design decisions, and the reasoning behind the ones that are not obvious from
the code.

This is a **static site**. There is no server, no database, no API and no
authentication. That is the defining constraint, and most of what follows is
either a consequence of it or a place where a naive approach would have quietly
broken something.

---

## 1. Layering

```
src/app/            App Router — routes, layout, metadata
src/components/     UI
src/data/           Seed content and domain types — no I/O, ever
src/lib/            Framework-free logic, all pure
```

**The rule: nothing in `data/` or `lib/` imports from `app/` or `components/`.**
Content and logic never reach upward. This is what lets the same functions run
in a Server Component at build time and in a Client Component in the browser —
which is precisely what the pricing split depends on.

`tests/availability.test.ts` asserts the rule, and in the same block asserts
that no route handler, `src/server/`, `proxy.ts` or `fetch('/api/...')` has
crept back in. Those tests exist because the absence of a backend is a design
decision that erodes silently.

---

## 2. Pricing: the split that matters most

The PRD's rule is that the base price, the multiplier, "+50%" and the formula
never reach the customer. That is normally enforced by keeping them on a
server. With no server, the same guarantee has to be reconstructed.

```
base (stored)  ──× multiplier──▶  displayPrice  ──▶  prop  ──▶  browser
     src/lib/pricing.ts            resolved at        one number,
     BUILD TIME ONLY               build time         no derivation
```

| Module | Runs in | Contains |
|---|---|---|
| `src/lib/pricing.ts` | Build time only | `DEFAULT_PRICING_CONFIG` — **the multiplier** |
| `src/lib/quote.ts` | Browser | Quote arithmetic. No multiplier, no base price. |

`buildQuote()` resolves the rate, then delegates to `quoteFromRate()` from the
client-safe module. One implementation, so the browser's figure cannot drift
from the build's — and that equivalence is itself a test.

**How the invariant is enforced, three independent ways:**

1. `tests/pricing.test.ts` walks the import graph from `src/lib/quote.ts` and
   fails if any reachable file mentions `DEFAULT_PRICING_CONFIG`.
2. The same test fails if any `'use client'` file imports `@/lib/pricing`.
3. `npm run verify` greps **every JavaScript chunk Next ships to the browser**
   for `multiplier`, `DEFAULT_PRICING_CONFIG`, `nightlyForProfile` and
   `roundingMode`.

The tests strip comments before scanning. An earlier version failed on its own
documentation — a module that says "this holds no multiplier" matched the word.

### What is published, and what is not

Publishing a rate is not the same as publishing how it was calculated. The
partner rate list (`partnerRateList`) renders the Business & Investment nightly
rate for every residence, openly, on the opportunities page. What never appears
is the Hospitality base it derives from, the multiplier, or the arithmetic
connecting the two.

---

## 3. Add-on quantities are authoritative

A per-meal add-on (private chef) takes its quantity from `chefMeals`, never from
its key in `addOnKeys`. If both arrive, the key is dropped first:

```ts
if (chefMeals > 0) selected.delete('CHEF_MEAL');
```

Without this, a request carrying both is charged once for the key (quantity 1)
and again for the count — a genuine over-charge on a real payment. Regression
test: *never charges a per-meal add-on twice when a key and a count are both
sent*.

The key alone still means a single meal, so a client that sends no count works.
The UI renders a stepper for per-meal services rather than a checkbox, because
a guest ordering three chef dinners cannot express that with a switch.

**Long-stay benefits are not a discount.** `deriveLongStayBenefits` returns
zero-price lines, and the chef allowance always states its "maximum 1
complimentary meal per day" cap. Meals beyond the allowance are charged at the
published rate.

---

## 4. Availability is advisory, and says so

`checkAvailability` is pure over a list of blocks. The last *occupied* night is
check-out **minus one day** — including check-out itself rejects every
turnover, where one guest leaves on the 4th and the next arrives on the 4th.
That was a real bug; the regression test is *allows a checkout day that is also
the first blocked night*.

`maxStayNights` exists on the type and is enforced. It was silently dropped
during the port to `lib/`, which is exactly the kind of regression a rewrite
hides — hence the test.

Nothing is held. There is no lock, no hold table and no 15-minute window,
because there is nothing to hold with. Every date picker, the booking summary
and the review step say so in plain words rather than implying a reservation
was made.

---

## 5. Two Next.js 16 behaviours that broke the site

### `useSearchParams()` opts a client component out of prerendering

On a static page Next cannot know the query string, so a client component that
reads it bails out of the build, the Suspense fallback is shipped, and the
component only appears after hydration.

This silently emptied the residence list from `/stay` and the **entire contact
form** from `/contact` — the most important element on the page, invisible to
crawlers and absent from the first paint. The RSC payload still contained the
data, which is exactly why it was easy to miss.

Both now take their query-string values as **props parsed by the server
component above them**. The server component already had the values; the client
was asking for them a second time, expensively. `usePathname` is unaffected and
is still used in the Navbar.

### A root `loading.tsx` breaks every 404

`loading.tsx` wraps each route in a Suspense boundary, so the 200 status is
flushed before `notFound()` can run. Every unknown URL on the site answered
**HTTP 200** while displaying the not-found page:

```
/book/return          200   (route deleted weeks ago)
/stay/does-not-exist  200
/legal/nope           200
```

A search engine would treat all of them as live pages. There is no root
`loading.tsx`, and `dynamicParams = false` on `/book/[slug]` reinforces it.
The trade is a loading animation on three fast routes against correct status
codes across the whole site — an easy call.

`npm run verify` asserts 404s for every removed route, so this cannot regress
unnoticed.

---

## 6. Forms hand off to the guest

A form with nowhere to post has three options. Pretending it worked is
dishonest. A third-party form endpoint handles guest data outside our control.
The third option is what `EnquiryHandoff` does:

1. Validate locally.
2. Format the values into a readable message.
3. Offer a `mailto:` or WhatsApp link carrying that message.

The guest chooses to send it, from their own device. The data never reaches
infrastructure we would have to secure, and nothing is stored server-side
because there is no server.

The copy states this explicitly — *"This site has no server, so it does not store
what you type"* — rather than showing a confirmation that implies otherwise.

Every form's privacy line was rewritten for the same reason. "We do not sell
personal data" is a claim about a processor that no longer exists; the honest
version is that nothing is stored at all.

### What was removed rather than reimplemented

| Removed | Reason |
|---|---|
| Identity-document collection | Nowhere encrypted to store it, no way to control access. Verified properly when a booking is confirmed. |
| Card payment in the browser | No backend to authorise, reconcile or refund against. |
| Accounts and profiles | Nothing to authenticate against. |
| Admin console | Inherently a backend tool; its content is now seed data. |
| Curated signed links | Need a server-side secret to sign. An unsigned query parameter is trivially forged. |
| Server-side disclaimer logging | The acknowledgement lives in the guest's `localStorage`, and the panel says we receive no record of it. |
| Analytics | `track()` is a no-op; call sites remain so a provider is a one-function change. |

---

## 7. React state discipline

Four genuine defects were found and fixed rather than suppressed:

| Component | Defect | Fix |
|---|---|---|
| `usePageView` | Effect depended on state instead of the route, so **client-side navigations were never tracked** | Made stateless; depends on `path` |
| `Modal` | Title id came from a module counter incremented on *every* render, and read a ref during render | `useId()` |
| `Navbar`, `ConsoleShell` | Menu closed via an effect on `pathname`, so it stayed open for one frame after navigating | State keyed by route; `open = menuPath === pathname` |
| `BookingFlow` | KYC prefill ran in an effect, so fields flashed in empty before being filled | Documented adjust-during-render pattern |

`react-hooks/set-state-in-effect` is configured as a **warning**, not an error.
Every remaining hit is one of two deliberate patterns: a data-fetch effect that
sets `loading` before awaiting, or the `useMounted()` SSR hydration guard. Both
are legitimate synchronisation-with-an-external-system cases; removing them
would mean adopting `use()` + Suspense or a data-fetching library. The rule
stays at warning level so a new occurrence is still visible on review. The
rationale is recorded inline in `eslint.config.mjs`.

---

## 7b. The build has no network dependency

`next/font/google` downloads font binaries from fonts.gstatic.com **during the
build**. That is a network dependency in a build, and it fails in the least
helpful way possible: an unresolvable
`@vercel/turbopack-next/internal/font/google/font` import, with "next/font/google
queries have exactly one entry" printed beneath it. Offline CI, a corporate
proxy and a poisoned Turbopack font cache all produce exactly this.

A static site has no reason to need the network in order to compile. All four
families are self-hosted with plain `@font-face`:

| Family | Source | Files |
|---|---|---|
| Montserrat, Roboto | Google Fonts, vendored by `npm run fonts` | 4 variable fonts, 177 kB, weights 100–900 |
| Pricedown BL, Identification Five | Licensed brand kit, not committed | 0 — hard fallback stacks |

Montserrat and Roboto are requested as variable fonts, so four files cover every
weight. Asking for discrete weights produced twenty files of which only four
were unique — Google serves the same variable binary for each — at 1 MB instead
of 177 kB.

The stylesheet declaring them is generated into `src/app/webfonts.css` and
imported **relatively**. A bare `@import '/fonts/webfonts.css'` is not a module
specifier; PostCSS cannot resolve it and the build fails.

Two tests hold the line: no source file may import `next/font`, and every file
the stylesheet declares must exist on disk. The offline build is verified by
building with `HTTPS_PROXY` pointed at a dead port.

---

## 8. The disclaimer gate

Rendered **with the opportunity content already hidden** — `opacity-0`,
`pointer-events-none`, `aria-hidden` — so the gate holds from first paint, before
any JavaScript runs. A visitor with JS disabled sees a notice, not the
opportunities.

Escape deliberately does not dismiss it. Acknowledgement is stored in
`localStorage` keyed by version, so edited wording re-prompts everyone who
accepted the old version.

The acknowledgement is **not** logged anywhere. An earlier version said "your
acknowledgement is recorded with a timestamp so we can demonstrate what was
shown to you and when" — which described a server-side log that no longer
exists. The copy now says the acknowledgement is stored in the visitor's own
browser, that we do not receive it, and that no record is kept.

---

## 9. The copy guard

The site is *required* to say "No returns are guaranteed" and "we never state or
imply guaranteed returns". A naive substring scan flags the required disclosure
as the violation it exists to prevent.

So the guard distinguishes an affirmative **claim** from a required
**disclosure**. A match governed by a negation or prohibition in the preceding
clause is allowed. Clause boundaries are sentence-level, never comma-level — a
prohibition list reading "must not use guaranteed-return or risk-free investment
language" is one negated statement, and splitting it on commas flagged the
second and third items.

Applied to the entire seed dataset, every legal page, and every rendered page by
`npm run verify`.

---

## 10. Accessibility and SEO

- Skip link, semantic landmarks, one `<h1>` per page, ordered headings.
- Focus-visible rings at 3px brand orange.
- Body text ≥ 4.5:1; orange reserved for large headings, icons and rules.
- The disclaimer modal traps focus, locks scroll and restores focus on close.
- The calendar exposes per-day `aria-label`s and `aria-pressed`; disabled days
  are genuinely `disabled`.
- `prefers-reduced-motion` collapses every animation to an instant state.

Per-page metadata, Open Graph and Twitter cards, a generated OG image, a static
`sitemap.xml`, `robots.txt` disallowing `/book` and any query string, and
JSON-LD: `LodgingBusiness` + `Organization` on the home page, `Article` on
insights, `BreadcrumbList` site-wide.

---

## 11. AI assistant (architecture only)

Out of scope, but the guardrails are architectural rather than advisory:

- It **must not** guarantee returns, promise performance, approve
  participation, or make binding legal or financial decisions.
- It answers first-level questions and escalates to a human.
- It is read-mostly: every mutation goes through a human.
- The copy guard applies to any template it composes, so it cannot generate a
  prohibited claim even by paraphrase.
- Sensitive actions are logged with the acting user, so the audit trail
  distinguishes AI-assisted interactions.

---

## 12. Known limitations

1. **Availability is seed data**, generated relative to the build day. A site
   deployed once and left for months drifts into the past. Re-running the build
   regenerates it. With a real booking system this is a live table.
2. **Nothing is reserved.** A guest can pick a date that someone else has since
   taken. Every step says so, and the final hand-off is a person.
3. **The quote is an indication**, re-confirmed by a person before anything is
   reserved or charged.
4. **One published rate.** The Business & Investment rate is shown openly on the
   opportunities page because signed deep links are impossible without a
   server. The *derivation* is still confidential.
5. **No rate limiting or CAPTCHA**, because there is no endpoint to abuse. The
   hand-off links carry the anti-spam burden, and email/WhatsApp spam filters
   are the real control.
6. **Legal copy is placeholder**, flagged *pending legal review* in
   `src/data/legal.ts`. It must be replaced with counsel-approved wording before
   launch.
7. **Placeholder photography** from Unsplash. Replace with the real property
   library and update `remotePatterns` in `next.config.ts`.
8. **Brand fonts use fallbacks** until the licensed files are supplied.
