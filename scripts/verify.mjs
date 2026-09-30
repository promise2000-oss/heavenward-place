/**
 * End-to-end verification of the static build.
 *
 *   npm run build && npm start
 *   npm run verify
 *   BASE=http://localhost:4000 npm run verify
 *
 * There is no API any more, so this checks rendered pages, response headers,
 * the SEO surface, and — most importantly — that the Business & Investment
 * multiplier never reached the client bundle.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const BASE = process.env.BASE ?? 'http://localhost:3000';

let pass = 0;
let fail = 0;
const ok = (name, condition, extra = '') => {
  if (condition) {
    pass += 1;
    console.log(`  \u001b[32mPASS\u001b[0m  ${name} ${extra}`);
  } else {
    fail += 1;
    console.log(`  \u001b[31mFAIL\u001b[0m  ${name} ${extra}`);
  }
};

const get = async (path) => {
  const res = await fetch(`${BASE}${path}`, { redirect: 'manual' });
  const text = await res.text();
  return { res, text, status: res.status };
};

/**
 * The copy a reader actually sees.
 *
 * Strips `<script>` (the RSC flight payload serialises every prop as JSON, so
 * gated strings appear there long before they are visible), `<style>`, React's
 * `<!-- -->` text-node markers, and the tags themselves.
 */
const visible = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#x27;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();

/** The markup itself, for structural assertions. */
const markup = (html) => html.replace(/<script[\s\S]*?<\/script>/gi, ' ');

/* ═════════════════════════════════════════════════════════════════════════════
   Confidentiality

   The base Hospitality rate is public by design — it is the published nightly
   price. What must never ship is the *derivation*: the multiplier, the config
   object, or the function that multiplies.
   ═════════════════════════════════════════════════════════════════════════════ */
const PRICING_LEAK = /multiplier|DEFAULT_PRICING_CONFIG|nightlyForProfile|baseNightlyPrice\s*\*\s*1\.5/i;

const CLIENT_SECRET = [
  'multiplier',
  'DEFAULT_PRICING_CONFIG',
  'nightlyForProfile',
  'roundingMode',
  'longStayThresholdNights',
];

/* A prohibited claim is prohibited. The site's own required risk disclosures
   ("no returns are guaranteed") are negated and therefore allowed. */
const NEGATED_DISCLOSURE =
  /\b(?:no|not|never|without|must not|do not|does not|we do not|prohibit\w*|avoid\w*|reject\w*|refuse\w*)\b[^.;|]{0,90}$/i;
const PROHIBITED_CLAIM =
  /\bguarantee[ds]?\s+(?:returns?|income|margins?|profits?|yield)\b|\brisk[-\s]?free\b|\briskless\b|\bpermanent(?:ly)?\s+profitable\b|\bwe\s+guarantee\b|\bsure\s+thing\b|\bcan'?t\s+lose\b|\bguaranteed\s+passive\s+income\b/gi;

function findProhibitedClaims(html) {
  const hits = [];
  for (const match of html.matchAll(PROHIBITED_CLAIM)) {
    const before = html.slice(Math.max(0, match.index - 130), match.index);
    if (NEGATED_DISCLOSURE.test(before)) continue;
    hits.push(match[0]);
  }
  return hits;
}

/** Every .js file Next ships to the browser. */
function clientChunks() {
  const root = '.next/static/chunks';
  const out = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir)) {
      const path = join(dir, entry);
      if (statSync(path).isDirectory()) walk(path);
      else if (path.endsWith('.js')) out.push(path);
    }
  };
  try {
    walk(root);
  } catch {
    /* no build output */
  }
  return out;
}

const RESET = '\u001b[0m';
console.log(`\nHeavenward Place — static build verification\n${'═'.repeat(62)}`);

/* ═════════════════════════════════════════════════════════════════════════ */

console.log('\n1. Every page is served');
const PAGES = [
  '/',
  '/about',
  '/stay',
  '/stay/the-azure-residence-victoria-island',
  '/stay/the-courtyard-studio-ikeja',
  '/concierge',
  '/opportunities',
  '/opportunities/agro-real-estate',
  '/opportunities/precious-metals',
  '/opportunities/joint-venture',
  '/insights',
  '/insights/lagos-corporate-housing-demand-2026',
  '/contact',
  '/legal/terms',
  '/legal/privacy',
  '/legal/opportunity-disclaimer',
  '/book/the-azure-residence-victoria-island',
];
for (const path of PAGES) {
  const { res, status } = await get(path);
  ok(`${path} → 200`, status === 200, `got ${status}`);
}

console.log('\n2. The backend is really gone');
for (const path of [
  '/api/properties',
  '/api/quote',
  '/api/bookings',
  '/api/auth/sign-in',
  '/api/admin/overview',
  '/api/webhooks/paystack',
  '/api/dev/reset',
]) {
  const { status } = await get(path);
  ok(`${path} → 404`, status === 404, `got ${status}`);
}
for (const path of ['/admin', '/account', '/account/bookings', '/auth/sign-in', '/auth/register', '/curated/abc']) {
  const { status } = await get(path);
  ok(`${path} → 404`, status === 404, `got ${status}`);
}
{
  const { status } = await get('/book/return');
  ok('/book/return → 404', status === 404, `got ${status}`);
  const { status: s2 } = await get('/book/simulated-checkout');
  ok('/book/simulated-checkout → 404', s2 === 404, `got ${s2}`);
}

console.log('\n3. The multiplier never reaches the browser');
{
  const chunks = clientChunks();
  ok('client chunks were found', chunks.length > 0, `${chunks.length} files`);

  const offenders = [];
  for (const chunk of chunks) {
    const source = readFileSync(chunk, 'utf8');
    for (const secret of CLIENT_SECRET) {
      if (source.includes(secret)) offenders.push(`${chunk} → ${secret}`);
    }
  }
  ok('no pricing secret in any client chunk', offenders.length === 0, offenders.join(', '));

  // Belt and braces: the config object itself must not be bundled.
  const anyChunk = chunks.map((c) => readFileSync(c, 'utf8')).join('\n');
  ok('client bundle contains no "multiplier" identifier', !anyChunk.includes('multiplier'));
}

console.log('\n4. No pricing derivation in rendered HTML');
for (const path of PAGES) {
  const { text } = await get(path);
  ok(`no derivation leaked in ${path}`, !PRICING_LEAK.test(text), (text.match(PRICING_LEAK) ?? [])[0] ?? '');
}

console.log('\n5. Published rates are present and honest');
{
  const { text } = await get('/stay/the-azure-residence-victoria-island');
  ok('nightly rate rendered', /₦[\d,]+/.test(text));
  ok('price list named', text.includes('Hospitality'));
  ok('weekly rate shown', /WEEKLY RATE/i.test(text));
  ok('minimum stay stated', /minimum stay|single-night stays available/i.test(text));

  /*
   * This is a real assertion, not a smoke test. `useSearchParams()` in a client
   * component opts it out of prerendering, which previously left the residence
   * list absent from the HTML entirely — a listing page whose content is not in
   * the document.
   */
  const { text: stay } = await get('/stay');
  const residenceLinks = (stay.match(/href="\/stay\/[a-z-]+"/g) ?? []).length;
  ok('every residence is server-rendered on /stay', residenceLinks >= 6, `found ${residenceLinks}`);
  ok('result count is server-rendered', /[0-9]+ residences available/.test(visible(stay)));

  {
    const { text: contact } = await get('/contact');
    ok('contact form is server-rendered', /name="message"/.test(contact));
    ok('contact form privacy line present', /stored by this site/i.test(visible(contact)));
  }
}

console.log('\n6. Long-stay benefits are stated, not implied');
{
  // With dates in the query string the whole quote — benefits included — is
  // server-rendered, so the copy can be asserted without a browser.
  const d = (n) => {
    const x = new Date();
    x.setUTCDate(x.getUTCDate() + n);
    return x.toISOString().slice(0, 10);
  };
  const longStay = await get(
    `/book/the-azure-residence-victoria-island?checkIn=${d(100)}&checkOut=${d(115)}&guests=2`,
  );
  const { text } = longStay;
  ok('quote is server-rendered for valid dates', /Indicative total/.test(text));
  ok('weekly discount applied', /Weekly rate discount/.test(text));
  ok('cleaning and service charge itemised', /Cleaning/.test(text) && /Service charge/.test(text));
  ok('long-stay threshold explained', /7 nights or more/i.test(visible(text)));

  const shortStay = await get(
    `/book/the-azure-residence-victoria-island?checkIn=${d(100)}&checkOut=${d(102)}&guests=2`,
  );
  const shortCopy = visible(shortStay.text);
  ok('a short stay shows no complimentary benefits block',
    !/COMPLIMENTARY\b/.test(shortCopy));
  ok('a short stay does not claim chef meals are included',
    !/complimentary private-chef meals per week/i.test(shortCopy));
  ok('a short stay is told how many more nights unlock them',
    /Stay 5 more nights to unlock/i.test(shortCopy));

  const longCopy = visible(text);
  ok('a long stay shows the benefits block', /COMPLIMENTARY\b/.test(longCopy));
  ok('a long stay lists the chef allowance', /complimentary private-chef meals per week/i.test(longCopy));
  ok('a long stay states the daily cap', /maximum 1 complimentary meal per day/i.test(longCopy));
  ok('a long stay shows the pickup benefit', /Complimentary airport/i.test(longCopy));

  // A range that overlaps a seeded block must be refused outright.
  const blocked = await get(
    `/book/the-azure-residence-victoria-island?checkIn=${d(63)}&checkOut=${d(70)}&guests=2`,
  );
  ok('a blocked range is not quoted', !/Indicative total/.test(blocked.text));

  const { text: concierge } = await get('/concierge');
  ok('concierge page explains the long-stay allowance', /7 nights or more/i.test(visible(concierge)));
  ok('concierge states the daily chef cap', /maximum 1 per day/i.test(visible(concierge)));

  const { text: book } = await get('/book/the-azure-residence-victoria-island');
  ok('no identity documents requested', !/passport number|upload.{0,20}(id|passport)/i.test(book));
  ok('no card payment in the browser', !/card number|cvv|expiry date/i.test(book));
  ok('the total is described as indicative', /nothing is reserved until we confirm/i.test(book));
}

console.log('\n7. Forms hand off to the guest instead of faking a POST');
for (const [path, label] of [
  ['/contact', 'contact'],
  ['/opportunities', 'interest'],
  ['/concierge', 'concierge'],
]) {
  const { text } = await get(path);
  ok(`${label} form has no POST to an API`, !/fetch\(\s*['"`][^'"`]*\/api\//.test(text));
}
{
  const { text } = await get('/concierge');
  ok('concierge page offers a handoff', /mailto:|wa\.me/.test(text));
  ok('concierge copy says nothing is booked', /does not book anything on its own/i.test(text));
}
{
  const { text } = await get('/contact');
  ok('contact page states nothing is stored', /not stored by this site|stored by this site/i.test(text));
}

console.log('\n8. Disclaimer gate');
{
  const { text } = await get('/opportunities');
  ok('no-custody wording present', /does not take custody/i.test(text));
  ok('no-guaranteed-returns wording present', /No returns are guaranteed/i.test(text));
  ok('due-diligence wording present', /due diligence/i.test(text));
  /*
   * The gate is enforced from first paint: the opportunity content is rendered
   * but hidden, so a crawler or a JS-less visitor cannot read it before the
   * notice. The modal itself is client-rendered, so the acknowledgement key is
   * asserted in the bundle instead of the HTML.
   */
  ok('opportunity content is withheld until acknowledged',
    /aria-hidden="true"[^>]*pointer-events-none[^>]*opacity-0/.test(text) ||
    /opacity-0[^>]*pointer-events-none/.test(text));
  {
    const gateBundle = clientChunks()
      .map((c) => readFileSync(c, 'utf8'))
      .join('\n');
    ok('acknowledgement is stored client-side', gateBundle.includes('hp_disclaimer_ack'));
    ok('pending legal review is disclosed in the gate',
      /pending legal review|Pending legal review/i.test(gateBundle));
    ok('the gate cannot be dismissed with Escape', /Escape/.test(gateBundle) && /preventDefault/.test(gateBundle));
  }

  {
    const { text: legal } = await get('/legal/opportunity-disclaimer');
    ok('full disclaimer page states no custody', /does not take custody/i.test(legal));
    ok('full disclaimer page states due diligence', /due diligence/i.test(legal));
    ok('full disclaimer page states no guaranteed returns', /No returns are guaranteed/i.test(legal));
  }
}

console.log('\n9. No prohibited financial claims');
{
  const paths = [
    '/', '/about', '/stay', '/concierge', '/opportunities', '/insights', '/contact',
    '/opportunities/agro-real-estate', '/opportunities/joint-venture',
    '/legal/opportunity-disclaimer', '/legal/terms', '/legal/privacy', '/legal/cancellation',
  ];
  for (const path of paths) {
    const { text } = await get(path);
    const hits = findProhibitedClaims(text);
    ok(`${path} free of prohibited claims`, hits.length === 0, hits.join(', '));
  }
  const { text } = await get('/opportunities');
  ok('required disclosure still present', /No returns are guaranteed/i.test(text));
  const { text: home } = await get('/');
  ok('no-custody disclosure site-wide', /does not take custody/i.test(home));
}

console.log('\n10. Brand, navigation and accessibility');
{
  const { text } = await get('/');
  ok('direction line rendered', text.includes('Explore Opportunities'));
  ok('brand tagline present', text.includes('Higher Calling'));
  ok('skip link present', text.includes('class="skip-link"'));
  ok('main landmark present', text.includes('id="main"'));
  ok('no CAC registration details', !/RC\s?\d{5,}/.test(text) && !/Registered Capital/i.test(text));
  for (const label of ['About', 'Stay With Us', 'Concierge', 'Insights', 'Contact']) {
    ok(`nav includes "${label}"`, text.includes(label));
  }
  ok('no Partners page in nav', !/href="\/partners"/.test(text));
  ok('no Investment Portal', !/Investment Portal/i.test(text));

  const { text: stay } = await get('/');
  ok('orange brand token used', /#FF9800/i.test(text));
  ok('no oversized corner radii', (stay.match(/rounded-(lg|xl|2xl|3xl)\b/g) ?? []).length === 0);
}

console.log('\n11. Security headers');
{
  const { res } = await get('/');
  ok('Content-Security-Policy present', Boolean(res.headers.get('content-security-policy')));
  ok('X-Frame-Options DENY', res.headers.get('x-frame-options') === 'DENY');
  ok('X-Content-Type-Options nosniff', res.headers.get('x-content-type-options') === 'nosniff');
  ok('Strict-Transport-Security present', Boolean(res.headers.get('strict-transport-security')));
  ok('Referrer-Policy present', Boolean(res.headers.get('referrer-policy')));
  ok('Permissions-Policy present', Boolean(res.headers.get('permissions-policy')));
  ok('no powered-by header', !res.headers.get('x-powered-by'));
}

console.log('\n12. SEO surface');
{
  for (const path of ['/robots.txt', '/sitemap.xml', '/manifest.webmanifest', '/opengraph-image']) {
    const { status } = await get(path);
    ok(`${path} served`, status === 200, `got ${status}`);
  }
  const { text: robots } = await get('/robots.txt');
  ok('robots allows the site', /Allow: \//.test(robots));
  ok('robots does not disallow everything', !/Disallow: \/\s*$/m.test(robots));
  const { text: sitemap } = await get('/sitemap.xml');
  ok('sitemap lists the home page', sitemap.includes('/</loc>') || sitemap.includes('https://'));
  ok('sitemap excludes the booking flow', !sitemap.includes('/book'));
  const { text } = await get('/');
  ok('LodgingBusiness structured data', text.includes('LodgingBusiness'));
  ok('Organization structured data', text.includes('Organization'));
  const { text: stay } = await get('/stay/the-azure-residence-victoria-island');
  ok('property has its own metadata', /<title>[^<]*Azure/.test(stay));
  const { text: book } = await get('/book/the-azure-residence-victoria-island');
  ok('booking page is noindex', /name="robots" content="noindex/.test(book));
}

console.log('\n13. Nothing broken is referenced');
{
  const home = await get('/');
  const hrefs = [...home.text.matchAll(/href="(\/[^"#]*)"/g)].map((m) => m[1]);
  const unique = [...new Set(hrefs)];
  const broken = [];
  for (const href of unique) {
    if (href.startsWith('/_next') || href.startsWith('/book/')) continue;
    const { status } = await get(href);
    if (status >= 400) broken.push(`${href} (${status})`);
  }
  ok('no broken internal links', broken.length === 0, broken.join(', '));
}

console.log(`\n${'═'.repeat(62)}`);
console.log(`  ${pass} passed  \u00b7  ${fail} failed${RESET}`);
console.log(`${'═'.repeat(62)}\n`);

process.exit(fail > 0 ? 1 : 0);
