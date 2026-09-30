# Heavenward Place

Premium corporate housing and shortlet accommodation in Lagos, alongside a
curated opportunity-discovery service for selected business and investment
opportunities.

> **Stay. Experience. Explore Opportunities.**

A **static Next.js site**. There is no server, no database, no API and no
authentication. Every page is prerendered at build time; the quote, the
availability calendar and the search all run in the visitor's browser.

---

## Status

| Area | State |
|---|---|
| Public pages (all PRD routes) | Complete |
| Brand system, tokens, logo assets, motion | Complete |
| Client-side quote & availability | Complete |
| Business & Investment section, disclaimer gate | Complete |
| Booking request flow (dates → details → hand-off) | Complete |
| Contact, concierge, interest, assisted search | Complete — all hand off to the guest |
| SEO: static metadata, sitemap, robots, JSON-LD, OG image | Complete |
| Security headers (CSP, HSTS, frame, referrer, permissions) | Complete |
| Seed content: 6 residences, 6 categories, articles, legal pages | Complete |
| Automated tests | 273 unit + 142 end-to-end assertions |
| Server, database, API, auth, payments, admin console | **Removed — by design** |
| Rendering | Fully static, except `/book/[slug]` |

---

## Quick start

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. No environment variables, no database, no API keys
and no external services. The whole site runs from seed data.

```bash
npm test          # 273 unit tests
npm run verify    # 142 end-to-end assertions against a running server
npm run typecheck
npm run lint
```

### Trying the booking flow

1. `/stay` → filter → open a residence
2. Pick dates on the availability calendar — the price and long-stay benefits
   update as you go
3. **Continue to booking** → review the full breakdown
4. Fill in your details → **Review request**
5. Send it by email or WhatsApp. That is the hand-off.

---

## What "no backend" actually means here

Being explicit, because several features changed shape rather than simply
disappearing.

### The quote is computed in the browser

`src/lib/quote.ts` is a pure function: given a nightly rate and a set of dates,
it returns nights, discount, add-ons, cleaning, service charge, the total and
any long-stay benefits. No request, no loading state — the figure on screen is
derived from the inputs on screen.

Availability works the same way, from the seeded blocks in `src/data/blocks.ts`.

**This is advisory, not a reservation.** Nothing is held, and the site says so
at every step. Availability stops a guest picking a date we know is taken; it
cannot hold it.

### The Business & Investment price is still confidential

The PRD's rule is that the base price, the multiplier, "+50%" and the formula
never reach the customer. That is harder without a server, so the pricing
engine is split in two:

| Module | Runs in | Contains |
|---|---|---|
| `src/lib/pricing.ts` | Build time only | `DEFAULT_PRICING_CONFIG` — **the multiplier** |
| `src/lib/quote.ts` | Browser | The arithmetic. No multiplier, no base price. |

At build time the rate for each price list is resolved to a single number and
baked into the page as a prop. The browser receives the price for the list it
is on, and never how that price was derived.

This is enforced three ways:
- `tests/pricing.test.ts` walks the import graph from `quote.ts` and fails if
  `DEFAULT_PRICING_CONFIG` is reachable.
- The same test fails if any `'use client'` file imports `@/lib/pricing`.
- `npm run verify` greps **every JavaScript chunk Next ships to the browser**
  for `multiplier`, `DEFAULT_PRICING_CONFIG`, `nightlyForProfile` and
  `roundingMode`.

One implementation serves both, so the browser's figure cannot drift from the
build's. That equivalence is itself a test.

### Forms hand off to the guest

A form with nowhere to post has three honest options: pretend it worked, send
the data to a third party, or hand it to the guest. We do the third.

`EnquiryHandoff` validates the form, formats the values into a message, and
offers a `mailto:` or WhatsApp link. The guest chooses to send it, from their
own device, and the data never touches infrastructure we would have to secure.
The copy says exactly this rather than implying an enquiry was logged.

### What was removed, and why it should not come back

| Removed | Reason |
|---|---|
| **Identity-document collection** | There is nowhere encrypted to store a passport number and no way to control access. Asking for one in a form that posts nowhere would be worse than not asking. Identity is verified properly, over a secure channel, when a booking is confirmed. |
| **Card payment in the browser** | Taking money with no backend to authorise, reconcile or refund against would be reckless. Payment happens against an invoice once a person has confirmed the stay. |
| **Accounts and profiles** | Nothing to authenticate against. A "sign in" that does not sign you in is worse than a phone number. |
| **Admin console** | Inherently a backend tool. Its content is seed data in `src/data/`, ready to be edited there. |
| **Curated signed links** | A signed, expiring token needs a secret on a server. An unsigned query parameter would be trivially forged, so the site publishes one rate and the partner rate list openly. |
| **Server-side disclaimer logging** | The acknowledgement is stored in the guest's own `localStorage`, keyed by version. The panel says plainly that we do not receive it and keep no record, instead of implying a compliance trail that does not exist. |
| **Analytics** | `track()` is a no-op. The call sites stay, so wiring a real provider is a one-function change. |

---

## Architecture

```
src/
├─ app/                    App Router — 12 public routes, all prerendered
│  ├─ stay/ book/          Residence browsing and the booking request
│  ├─ opportunities/       Business & Investment, behind the disclaimer gate
│  └─ insights/ legal/     Editorial and legal
├─ components/             brand · ui · motion · layout · home · stay · book
├─ data/                   Seed content and domain types — no I/O, ever
│  └─ blocks.ts            Seeded availability, generated relative to build day
└─ lib/                    Framework-free logic, all pure
   ├─ pricing.ts           Build-time only. Holds the multiplier.
   ├─ quote.ts             Browser-safe. Quote arithmetic from a known rate.
   ├─ availability.ts      Browser-safe. Calendar and range evaluation.
   ├─ catalog.ts           Filter, facet and lookup over the seed data.
   └─ copy-guard.ts · seo.ts · dates.ts · money.ts · security/headers.ts
```

**The layering rule:** nothing in `data/` or `lib/` imports from `app/` or
`components/`. Content and logic never reach upward. `tests/availability.test.ts`
asserts this, along with the absence of a server, a proxy, and any `/api` call.

### Two Next.js 16 rules this build follows

**`useSearchParams()` opts a client component out of prerendering.** A static
page cannot know the query string, so Next bails, ships the Suspense fallback,
and the component only appears after hydration. That silently emptied the
residence list from `/stay` and the entire form from `/contact`. Both now take
their query-string values as **props parsed by the server component above them**.

**A root `loading.tsx` breaks every 404.** It wraps each route in a Suspense
boundary, so the 200 status is flushed before `notFound()` runs — and
`/book/return`, `/stay/anything` and every unknown URL answered with **200**,
telling search engines they were live pages. There is no root `loading.tsx`.
Correct status codes are worth more than a loading animation on three fast
routes.

---

## Brand system

| Token | Hex | Use |
|---|---|---|
| `--hp-orange` | `#FF9800` | Accent, CTAs, headings, rules |
| `--hp-black` | `#000000` | Dark surfaces, text, nav, footer |
| `--hp-cream` | `#FFE0B1` | Section backgrounds, highlights |
| `--hp-white` | `#FFFFFF` | Base background |

Orange body text on white or cream fails WCAG AA, so orange is reserved for
large headings, icons, rules and buttons with black text. Corners are square
or ≤6px; `rounded-lg` and larger are not used.

**Typography** — all four families are self-hosted and declared with plain
`@font-face`. Montserrat and Roboto ship as four variable-font files (177 kB
total, weights 100–900, latin + latin-ext); regenerate with `npm run fonts`.
*Pricedown BL* and *Identification Five* are the licensed brand faces: they are
not committed, so they carry hard fallback stacks and a missing file degrades
silently instead of failing the build. Drop them into `public/fonts/` and they
are picked up on the next build.

### Why the webfonts are vendored

`next/font/google` downloads font binaries from `fonts.gstatic.com` **during the
build**. That makes the build depend on reaching Google from whatever machine or
CI runner is doing it. When that fetch fails — an offline runner, a corporate
proxy, a poisoned Turbopack font cache — the build dies with an unresolvable
`@vercel/turbopack-next/internal/font/google/font` import and no useful error.

A static site should not have a network dependency in its build. The four
variable-font files are committed to `public/fonts/`, and every family is
declared with plain `@font-face`. The build now works offline, which is
verified by building with the proxy pointed at a dead port. Two tests guard it:
no source file may import `next/font`, and every file the stylesheet declares
must exist on disk.

**Motion** — one easing curve, `cubic-bezier(0.22, 1, 0.36, 1)`, durations
0.4–0.8s, all of it collapsed under `prefers-reduced-motion`.

---

## Business rules encoded

- **7+ nights** → complimentary airport / preferred-location pickup **and** 3
  private-chef meals per week, max 1 per day. Applied in the quote, shown
  before the request, and always stating the cap. Chef meals beyond the
  allowance are charged at the published rate.
- **No-match search** → assisted-search hand-off, offered instead of a dead end.
- **Disclaimer gate** → appears on every entry into the opportunity section,
  blocks the content from first paint, and is keyed by version so edited wording
  re-prompts everyone. Escape deliberately does not dismiss it.
- **Interest form** → approved fields only. Experience, objectives, risk
  appetite, duration, exit preference and timeline are never collected — they
  belong in a conversation. Group enquiries are flagged; the entity name and
  authorised contact are taken during follow-up.
- **No guaranteed-return language** → enforced by `src/lib/copy-guard.ts` over
  the whole seed dataset, which distinguishes an affirmative *claim* from a
  required *disclosure*.
- **Legal copy** → all editable in `src/data/legal.ts`, each flagged *pending
  legal review*.

---

## Security

| Control | Where |
|---|---|
| Content-Security-Policy, HSTS, `X-Frame-Options: DENY`, nosniff, Referrer-Policy, Permissions-Policy | `src/lib/security/headers.ts` via `next.config.ts` |
| `poweredByHeader: false` | `next.config.ts` |
| No third-party scripts, no analytics, no cookies set by JavaScript | — |
| `power` CSP denies camera, microphone, geolocation and payment | `headers.ts` |
| Prohibited-claims scan over all customer-facing copy | `lib/copy-guard.ts` |

There are no sessions, tokens, cookies, PII stores or input-processing
endpoints, because there is no server. What remains is a static document with
strict response headers. The trade-off is stated plainly: **the site collects
nothing, so it has nothing to leak.**

**No CAC registration details appear anywhere.** Asserted by `npm run verify`.

---

## Testing

```bash
npm test          # 273 unit tests
npm run verify    # 142 end-to-end assertions
npm run typecheck
npm run lint      # 0 errors
```

Unit tests cover the quote arithmetic, the add-on quantity rules, the long-stay
threshold, availability (including the turnover and maximum-stay rules), the
catalogue filters, the copy guard over the whole seed dataset, and the
containment of the multiplier.

`npm run verify` runs against a production build and covers: every page
served, the backend genuinely 404ing, **the multiplier absent from every client
chunk**, no pricing derivation in any HTML, server-rendered residence and form
content, the long-stay benefits and the teaser for shorter stays, the forms
handing off rather than faking a POST, the disclaimer gate, no prohibited
claims, brand and accessibility, security headers, the SEO surface, and that no
internal link is broken.

```bash
npm run build && npm start   # in one shell
npm run verify               # in another
```

---

## Environment

Everything has a working default; nothing is required.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_APP_URL` | Absolute site URL for metadata, sitemap, robots |
| `NEXT_PUBLIC_SUPPORT_PHONE` / `_EMAIL` / `_WHATSAPP` | Contact details, and the hand-off targets |
| `NEXT_PUBLIC_ANALYTICS_ID` | Reserved; analytics is currently a no-op |

**The build has no network dependency.** That is deliberate — see
[Why the webfonts are vendored](#why-the-webfonts-are-vendored).

---

## Deployment

Any static host. `npm run build` produces a self-contained `.next` output.

- **Vercel** — zero config. Set `NEXT_PUBLIC_APP_URL` to the production origin.
- **Nginx / S3+CloudFront / Netlify** — `npm run build`, then serve `.next`
  with the Node server (`npm start`) or export the static assets.
- Security headers are emitted at build time, so a CDN needs no extra config.
- If a legal page or the disclaimer is ever edited, bump `version` on the
  disclaimer so everyone is re-prompted.

**Before launch:** every legal page and the opportunity disclaimer must carry
counsel-approved wording. Each is currently flagged *pending legal review* in
`src/data/legal.ts`.

---

## Project structure

```
├─ .env.example
├─ ARCHITECTURE.md          Design decisions and the reasoning behind them
├─ README.md
├─ next.config.ts           Security headers, image hosts, redirects
├─ public/brand/            Logo assets
├─ public/fonts/            Licensed brand fonts (optional)
├─ scripts/verify.mjs       End-to-end suite for the static build
├─ tests/                   Unit tests
└─ src/                     Application code
```

## Not built

The mobile app, the AI support assistant, WhatsApp/SMS delivery and CRM
integration were out of scope. The hand-off component is already the WhatsApp
path, so wiring a provider is a small addition. AI guardrails are specified in
`ARCHITECTURE.md` §11: it must never guarantee returns, approve participation or
make binding decisions, and must escalate sensitive matters to a human.

---

© 2026 Heavenward Place. More Than A Place, It's A Higher Calling.
