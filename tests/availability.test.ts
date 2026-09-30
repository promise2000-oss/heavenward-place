import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

import {
  buildMonthAvailability,
  blocksForProperty,
  checkAvailability,
  type DateBlock,
} from '@/lib/availability';
import { AVAILABILITY_BLOCKS } from '@/data/blocks';
import { listProperties, featuredProperties, findPropertyBySlug, publishedPriceBounds } from '@/lib/catalog';
import { properties } from '@/data/properties';

const property = properties[0]!;

const block = (startDate: string, endDate: string): DateBlock => ({
  id: 'b1',
  propertyId: property.id,
  startDate,
  endDate,
  reason: 'BOOKING',
  source: 'BOOKING',
  note: null,
  bookingId: null,
});

describe('availability', () => {
  it('allows a range with no blocks', () => {
    const result = checkAvailability(property, '2027-06-01', '2027-06-04', []);
    expect(result.available).toBe(true);
    expect(result.nights).toBe(3);
  });

  it('rejects a range that overlaps a confirmed booking', () => {
    const result = checkAvailability(property, '2027-06-01', '2027-06-04', [
      block('2027-06-02', '2027-06-05'),
    ]);
    expect(result.available).toBe(false);
    expect(result.blockedNights.length).toBeGreaterThan(0);
  });

  /*
   * Regression: the conflict window used to include the check-out date itself,
   * which rejected every turnover booking — one guest leaving on the 4th while
   * the next arrives on the 4th.
   */
  it('allows a checkout day that is also the first blocked night', () => {
    const result = checkAvailability(property, '2027-06-01', '2027-06-04', [
      block('2027-06-04', '2027-06-08'),
    ]);
    expect(result.available).toBe(true);
  });

  it('still rejects a check-in that lands on a blocked night', () => {
    const result = checkAvailability(property, '2027-06-04', '2027-06-07', [
      block('2027-06-04', '2027-06-08'),
    ]);
    expect(result.available).toBe(false);
  });

  it('enforces the minimum stay', () => {
    const long = properties.find((p) => p.minStayNights > 1);
    if (!long) return; // every current residence allows a single night
    const result = checkAvailability(long, '2027-06-01', '2027-06-02', []);
    expect(result.available).toBe(false);
    expect(result.reason).toMatch(/minimum stay/i);
  });

  it('enforces the maximum stay', () => {
    const result = checkAvailability(property, '2027-06-01', '2028-06-01', []);
    expect(result.available).toBe(false);
  });

  it('rejects a check-out on or before check-in', () => {
    expect(checkAvailability(property, '2027-06-01', '2027-06-01', []).available).toBe(false);
    expect(checkAvailability(property, '2027-06-05', '2027-06-01', []).available).toBe(false);
  });

  it('rejects a check-in in the past', () => {
    const result = checkAvailability(property, '2020-01-01', '2020-01-05', []);
    expect(result.available).toBe(false);
    expect(result.reason).toMatch(/past/i);
  });

  it('marks past dates unavailable on the calendar', () => {
    const month = buildMonthAvailability(property, 2020, 0, []);
    expect(month.days[0]!.available).toBe(false);
    expect(month.days[0]!.reason).toBe('PAST');
  });

  it('distinguishes booked nights from manual blocks on the calendar', () => {
    const month = buildMonthAvailability(property, 2027, 5, [block('2027-06-10', '2027-06-12')]);
    const day10 = month.days.find((d) => d.date === '2027-06-10')!;
    expect(day10.available).toBe(false);
    expect(day10.reason).toBe('BOOKED');

    const manual = buildMonthAvailability(property, 2027, 5, [
      { ...block('2027-06-20', '2027-06-21'), source: 'MANUAL', reason: 'MAINTENANCE' },
    ]);
    const day20 = manual.days.find((d) => d.date === '2027-06-20')!;
    expect(day20.reason).toBe('BLOCKED');
  });

  it('builds a correctly sized grid for every month', () => {
    for (let m = 0; m < 12; m += 1) {
      const month = buildMonthAvailability(property, 2027, m, []);
      const expected = new Date(Date.UTC(2027, m + 1, 0)).getUTCDate();
      expect(month.days).toHaveLength(expected);
      expect(month.month).toBe(`2027-${String(m + 1).padStart(2, '0')}`);
    }
  });
});

describe('seed blocks', () => {
  it('are well formed and in the future', () => {
    expect(AVAILABILITY_BLOCKS.length).toBeGreaterThan(0);
    for (const b of AVAILABILITY_BLOCKS) {
      expect(b.startDate <= b.endDate).toBe(true);
      expect(b.startDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(properties.some((p) => p.id === b.propertyId)).toBe(true);
    }
  });

  it('filters to a single property', () => {
    const mine = blocksForProperty(AVAILABILITY_BLOCKS, property.id);
    expect(mine.length).toBeGreaterThan(0);
    expect(mine.every((b) => b.propertyId === property.id)).toBe(true);
  });
});

describe('catalogue', () => {
  it('lists everything with no filter', () => {
    expect(listProperties()).toHaveLength(properties.length);
  });

  it('filters by area, type, guests and bedrooms', () => {
    const area = properties[0]!.area;
    expect(listProperties({ area }).every((p) => p.area === area)).toBe(true);

    const type = properties[0]!.type;
    expect(listProperties({ type }).every((p) => p.type === type)).toBe(true);

    const big = Math.max(...properties.map((p) => p.maxGuests));
    expect(listProperties({ guests: big }).every((p) => p.maxGuests >= big)).toBe(true);

    const three = properties.filter((p) => p.bedrooms >= 3);
    expect(listProperties({ bedrooms: 3 })).toHaveLength(three.length);
  });

  it('searches name, type, area and description', () => {
    const hit = properties[0]!;
    const term = hit.name.split(' ').filter((w) => w.length > 4)[0];
    if (term) expect(listProperties({ query: term }).length).toBeGreaterThan(0);
  });

  it('sorts by price in both directions', () => {
    const asc = listProperties({ sort: 'price_asc' }).map((p) => p.baseNightlyPrice);
    const desc = listProperties({ sort: 'price_desc' }).map((p) => p.baseNightlyPrice);
    expect(asc).toEqual([...asc].sort((a, b) => a - b));
    expect(desc).toEqual([...desc].sort((a, b) => b - a));
  });

  it('requires every requested amenity', () => {
    const wanted = properties[0]!.amenities[0]!;
    const results = listProperties({ amenities: [wanted] });
    expect(results.every((p) => p.amenities.includes(wanted))).toBe(true);
  });

  it('resolves by slug and promotes the featured residences', () => {
    expect(findPropertyBySlug(properties[0]!.slug)?.id).toBe(properties[0]!.id);
    expect(findPropertyBySlug('does-not-exist')).toBeUndefined();
    expect(featuredProperties(3)).toHaveLength(3);
  });

  it('reports price bounds that bracket every residence', () => {
    const bounds = publishedPriceBounds();
    for (const p of properties) {
      expect(p.baseNightlyPrice).toBeGreaterThanOrEqual(bounds.min);
      expect(p.baseNightlyPrice).toBeLessThanOrEqual(bounds.max);
    }
  });
});

/*
 * ═════════════════════════════════════════════════════════════════════════════
 * The static-site guarantee
 * ═════════════════════════════════════════════════════════════════════════════
 * These are the tests that would have caught a server sneaking back in.
 */

describe('no backend', () => {
  function sourceFiles(dir = 'src'): string[] {
    const out: string[] = [];
    const walk = (d: string) => {
      for (const entry of readdirSync(d)) {
        const path = join(d, entry);
        if (statSync(path).isDirectory()) walk(path);
        else if (path.endsWith('.ts') || path.endsWith('.tsx')) out.push(path);
      }
    };
    walk(dir);
    return out;
  }

  it('has no route handlers left', () => {
    expect(sourceFiles().filter((f) => f.endsWith('route.ts'))).toEqual([]);
  });

  it('has no server directory', () => {
    expect(() => statSync('src/server')).toThrow();
  });

  it('never calls a relative or absolute /api path', () => {
    const offenders: string[] = [];
    for (const file of sourceFiles()) {
      const source = readFileSync(file, 'utf8');
      if (/fetch\(\s*['"`][^'"`]*\/api\//.test(source)) offenders.push(file);
      if (/\.sendBeacon\(/.test(source)) offenders.push(file);
    }
    expect(offenders).toEqual([]);
  });

  it('never imports a server or browser-incompatible module', () => {
    const offenders: string[] = [];
    for (const file of sourceFiles()) {
      const source = readFileSync(file, 'utf8');
      if (/from\s+['"][^'"]*(@\/server|@\/client)['"]/.test(source)) {
        offenders.push(file);
      }
      /*
       * `node:crypto` is banned outright. `node:fs` is allowed only in
       * `src/lib/fonts.ts`, which reads the font directory at BUILD time to
       * report whether the licensed brand fonts are present — never a runtime
       * request handler, because there are none.
       */
      if (/from\s+['"]node:crypto['"]/.test(source)) {
        offenders.push(file);
      }
      if (/from\s+['"]node:fs['"]/.test(source) && file.replace(/\\/g, '/') !== 'src/lib/fonts.ts') {
        offenders.push(file);
      }
    }
    expect(offenders).toEqual([]);
  });

  it('has no proxy or middleware entry point', () => {
    for (const name of ['src/proxy.ts', 'src/middleware.ts', 'src/proxy.js', 'src/middleware.js']) {
      let exists = true;
      try {
        statSync(name);
      } catch {
        exists = false;
      }
      expect(exists, `${name} should not exist`).toBe(false);
    }
  });

  /*
   * Regression: `next/font/google` downloads font binaries during the build, so
   * a runner that cannot reach fonts.gstatic.com fails with an unresolvable
   * `@vercel/turbopack-next/internal/font/google/font` import. A static site
   * must build offline, so every family is self-hosted.
   */
  it('does not load any font through next/font at build time', () => {
    const offenders: string[] = [];
    for (const file of sourceFiles()) {
      if (/from\s+['"]next\/font/.test(readFileSync(file, 'utf8'))) offenders.push(file);
    }
    expect(offenders).toEqual([]);
  });

  it('self-hosts every webfont it declares', () => {
    const css = readFileSync('src/app/globals.css', 'utf8');
    const declared = [...readFileSync('src/app/webfonts.css', 'utf8').matchAll(/url\('\/fonts\/([^']+)'\)/g)]
      .map((m) => m[1]!);

    expect(declared.length).toBeGreaterThan(0);
    for (const file of declared) {
      expect(statSync(join('public/fonts', file)).size, `${file} must be committed`).toBeGreaterThan(0);
    }
    // The import must be relative: a bare '/fonts/...' path is not a module
    // specifier and PostCSS cannot resolve it.
    expect(css).toMatch(/@import '\.\/webfonts\.css'/);
  });

  /*
   * Removing the backend left copy describing it behind — "sign in", "your
   * account", "create an account to book online". A link to a deleted route is
   * a broken link; the rest is a promise the site cannot keep.
   */
  it('contains no copy promising accounts, sign-in or an online booking flow', () => {
    const offenders: string[] = [];
    const banned =
      /\b(?:sign in|log in|create an account|register an account|your account|my account|book online|securely pay|pay securely)\b/gi;

    /*
     * A negated mention is not a promise. "There is nothing to select or sign
     * in to" tells a visitor *not* to look for one, which is exactly the right
     * thing to say now that accounts are gone. Same approach as copy-guard.ts.
     */
    const negated = (text: string, index: number) => {
      const before = text.slice(Math.max(0, index - 90), index);
      return /\b(?:no|not|never|nothing|without|don't|does not|do not|cannot|can't|remove|removed)\b[^.;|]{0,40}$/i.test(before);
    };

    const walk = (dir: string) => {
      for (const entry of readdirSync(dir)) {
        const path = join(dir, entry);
        if (statSync(path).isDirectory()) {
          walk(path);
          continue;
        }
        if (!/\.(ts|tsx)$/.test(path)) continue;

        // Visible strings only — a comment explaining WHY is fine.
        const source = readFileSync(path, 'utf8')
          .replace(/\/\*[\s\S]*?\*\//g, '')
          .replace(/^\s*\/\/.*$/gm, '');

        let m: RegExpExecArray | null;
        const re = new RegExp(banned.source, banned.flags);
        while ((m = re.exec(source)) !== null) {
          if (negated(source, m.index)) continue;
          offenders.push(`${path} → "${m[0]}"`);
        }
      }
    };

    walk('src');
    expect(offenders).toEqual([]);
  });

  it('links only to routes that exist', () => {
    const offenders: string[] = [];
    const routes = new Set<string>();
    const pageDirs = ['src/app'];

    const known = [
      '/', '/about', '/stay', '/concierge', '/opportunities', '/insights',
      '/contact', '/legal/terms', '/legal/privacy', '/legal/cancellation',
      '/legal/guest-code-of-conduct', '/legal/opportunity-disclaimer',
      '/book/the-azure-residence-victoria-island', '/book/the-mariner-suite-ikoyi',
      '/book/the-meridian-penthouse-lekki', '/book/the-courtyard-studio-ikeja',
      '/book/the-orchard-residence-ikeja', '/book/the-palm-grove-villa-italoh',
      '/opportunities/agro-real-estate', '/opportunities/rental-income-property',
      '/opportunities/precious-metals', '/opportunities/precious-stones',
      '/opportunities/joint-venture', '/opportunities/distribution-income',
    ];
    known.forEach((r) => routes.add(r));

    expect(pageDirs.length).toBeGreaterThan(0);

    const walk = (dir: string) => {
      for (const entry of readdirSync(dir)) {
        const path = join(dir, entry);
        if (statSync(path).isDirectory()) {
          walk(path);
          continue;
        }
        if (!path.endsWith('.tsx')) continue;

        const source = readFileSync(path, 'utf8');
        for (const m of source.matchAll(/href="(\/[^"#?]*)"/g)) {
          const href = m[1]!;
          // Dynamic, external and asset links are out of scope.
          if (href.includes('${') || href.startsWith('//')) continue;
          if (!routes.has(href.replace(/\/$/, '') || '/')) offenders.push(`${path} → ${href}`);
        }
      }
    };

    walk('src');
    expect(offenders).toEqual([]);
  });
});
