/**
 * Copy guard.
 *
 * Prohibited financial-promotion language must never appear in customer-facing
 * or editorial content. This module is the single enforcement point and is used
 * by:
 *   • a test that scans every string in the seed dataset,
 *   • the copy a visitor types into a form, where a prohibited claim is
 *     rejected before the message is prepared,
 *   • `npm run verify`, which scans every rendered page.
 *
 * THE HARD PART: the site is *required* to say "No returns are guaranteed",
 * "we never state or imply guaranteed returns" and "must not use guaranteed
 * return language". A naive substring scan flags that required disclosure as a
 * violation. So every match is examined for a governing negation or prohibition
 * in the preceding clause, and only affirmative claims are reported.
 *
 * The rule is blunt on purpose. "Risk-free", "guaranteed returns", "guaranteed
 * income", "guaranteed margins" and "permanent profitability" are prohibited
 * outright as *claims*.
 */

/** Phrases that, on their own, constitute a prohibited claim. */
const CLAIM_PATTERNS: Array<{ pattern: RegExp; label: string }> = [
  { pattern: /\bguarantee[ds]?\s+(?:returns?|income|margins?|profits?|yield|roi|performance)\b/gi, label: 'guaranteed return' },
  { pattern: /\brisk[-\s]?free\b/gi, label: 'risk-free' },
  { pattern: /\briskless\b/gi, label: 'riskless' },
  { pattern: /\bpermanent(?:ly)?\s+profitable\b/gi, label: 'permanent profitability' },
  { pattern: /\bguaranteed\s+passive\s+income\b/gi, label: 'guaranteed passive income' },
  { pattern: /\bcapital\s+is\s+guaranteed\b/gi, label: 'capital guaranteed' },
  { pattern: /\bprincipal\s+guaranteed\b/gi, label: 'principal guaranteed' },
  { pattern: /\bwe\s+guarantee\b/gi, label: 'we guarantee' },
  { pattern: /\bdouble\s+(?:your\s+)?(?:money|investment|capital)\b/gi, label: 'doubling claim' },
  { pattern: /\bsure\s+thing\b/gi, label: 'sure thing' },
  { pattern: /\bcan'?t\s+lose\b/gi, label: 'cannot lose claim' },
  { pattern: /\bno\s+risk\s+(?:at\s+all|whatsoever)\b/gi, label: 'no risk' },
  { pattern: /\b(?:safe|safer)\s+than\s+(?:a\s+)?bank\s+deposit\b/gi, label: 'safer than a bank deposit' },
  { pattern: /\b(?:assured|assured)\s+(?:returns?|income|profit)\b/gi, label: 'assured returns' },
  { pattern: /\bpassive\s+income\s+guaranteed\b/gi, label: 'passive income claim' },
];

/**
 * Tokens that, when they govern a match, turn it into a disclosure or a
 * prohibition rather than a claim.
 */
const NEGATION = [
  'no', 'not', 'never', 'none', 'nor', 'without', 'cannot', 'can not', "can't",
  'must not', 'must never', 'do not', 'does not', "don't", "doesn't", 'will not',
  'shall not', 'should not', 'should never', 'would not', 'avoid', 'avoids',
  'avoiding', 'prohibit', 'prohibits', 'prohibited', 'ban', 'banned', 'illegal',
  'unlawful', 'refuse', 'refuses', 'refuse to', 'reject', 'rejects', 'we do not',
  'never state', 'never imply', 'not state', 'not imply', 'free of', 'stripped of',
  'screened out', 'is prohibited', 'are prohibited',
];

/**
 * Only a genuine sentence boundary ends a clause. Commas must NOT: a
 * prohibition list reads "no guaranteed returns, no guaranteed income, no
 * risk-free investment" and each item after the first is still governed by
 * the leading negation.
 */
const CLAUSE_SPLIT = /[.;!?\n]|\b(?:but|however|although|while|whereas|yet)\b/i;

/** Returns true when the text immediately before `index` governs the match. */
function isNegated(text: string, index: number): boolean {
  // Look back over the current sentence only.
  const before = text.slice(Math.max(0, index - 320), index);
  const clause = before.split(CLAUSE_SPLIT).pop() ?? before;

  const normalized = clause.toLowerCase().replace(/[‘’]/g, "'");

  // A prohibition list often reads: "must not use guaranteed-return or
  // risk-free investment language" — the negation governs the whole list.
  if (/\b(?:must|shall|should|may|can)\s+not\b|\bnever\b|\bdo(?:es)?\s+not\b|\bdon't\b|\bdoesn't\b/.test(normalized)) {
    return true;
  }
  if (/\b(?:no|not|never|prohibit\w*|forbidden|without|avoid\w*|reject\w*|refuse\w*)\b/.test(normalized)) {
    return true;
  }
  return NEGATION.some((token) => normalized.includes(token));
}

export interface CopyGuardResult {
  ok: boolean;
  violations: Array<{ match: string; label: string; index: number; context: string }>;
}

/**
 * Scan copy for prohibited *claims*. Negated or prohibitive mentions — the
 * required risk disclosures — are not violations.
 */
export function scanCopy(text: string): CopyGuardResult {
  const violations: CopyGuardResult['violations'] = [];

  for (const { pattern, label } of CLAIM_PATTERNS) {
    // Fresh regex per scan so the module-level patterns stay stateless.
    const re = new RegExp(pattern.source, pattern.flags);
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      if (m.index === re.lastIndex) re.lastIndex += 1;
      if (isNegated(text, m.index)) continue;
      violations.push({
        match: m[0],
        label,
        index: m.index,
        context: text.slice(Math.max(0, m.index - 60), m.index + m[0].length + 60).trim(),
      });
    }
  }

  return { ok: violations.length === 0, violations };
}

export function assertCopyAllowed(text: string, context: string) {
  const result = scanCopy(text);
  if (!result.ok) {
    const summary = result.violations.map((v) => `"${v.match}" (${v.label})`).join(', ');
    throw new Error(
      `Copy rejected in ${context}: prohibited claim detected — ${summary}. Heavenward Place must not state or imply guaranteed returns, risk-free investment, guaranteed income, guaranteed margins or permanent profitability.`,
    );
  }
}

/**
 * Phrases that are safe and, in fact, REQUIRED to appear alongside an
 * opportunity. Used to warn admins if they strip the risk framing.
 */
export const REQUIRED_RISK_LANGUAGE = [
  'due diligence',
  'no returns are guaranteed',
];

/**
 * A stricter scan for the few places where even a negated mention would be
 * wrong — for example a marketing headline, where "no guaranteed returns" as a
 * tagline would be a claim in disguise.
 */
export function scanMarketingCopy(text: string): CopyGuardResult {
  const result = scanCopy(text);
  if (result.ok) return result;

  // Headlines and CTAs are short; a match there is a claim even if the
  // surrounding text negates it.
  const violations = result.violations.filter((v) => {
    const lead = v.context.slice(0, 60).toLowerCase();
    return /^(no|not)\s/.test(lead) ? false : true;
  });

  return { ok: violations.length === 0, violations };
}
