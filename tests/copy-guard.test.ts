import { describe, expect, it } from 'vitest';
import { assertCopyAllowed, scanCopy, scanMarketingCopy } from '@/lib/copy-guard';
import { opportunityCategories, opportunities, opportunityDisclaimer } from '@/data/opportunities';
import { businessOpportunities } from '@/data/business-opportunities';
import { ACKNOWLEDGEMENT_MESSAGE, NEXT_STEPS } from '@/data/enquiry';
import { insightPosts } from '@/data/insights';
import { legalPages } from '@/data/legal';


describe('copy guard — prohibited claims', () => {
  const CLAIMS = [
    'Guaranteed returns of 20% per year.',
    'GUARANTEED RETURNS on every deal.',
    'A risk-free investment opportunity.',
    'This is RISK-FREE capital.',
    'Guaranteed income for life.',
    'Guaranteed margins on every sale.',
    'A permanently profitable venture.',
    'We guarantee your capital back.',
    'A sure thing, every time.',
    "You can't lose with this one.",
    'Guaranteed passive income.',
    'Safer than a bank deposit.',
  ];

  for (const claim of CLAIMS) {
    it(`rejects: "${claim}"`, () => {
      expect(scanCopy(claim).ok).toBe(false);
    });
  }
});

describe('copy guard — required disclosures must not be flagged', () => {
  const DISCLOSURES = [
    'No returns are guaranteed.',
    'We never state or imply guaranteed returns.',
    'Heavenward Place must not use guaranteed return or risk-free investment language.',
    'This is not a risk-free investment.',
    'There is no guaranteed income here.',
    'Avoid guaranteed returns, risk-free claims and permanent profitability.',
    'Prohibited: guaranteed margins.',
  ];

  for (const text of DISCLOSURES) {
    it(`allows: "${text}"`, () => {
      expect(scanCopy(text).ok).toBe(true);
    });
  }
});

describe('copy guard — the seeded opportunity disclaimer', () => {
  it('passes the guard as written', () => {
    expect(scanCopy(opportunityDisclaimer.body).ok).toBe(true);
  });
});

describe('copy guard — the whole seeded dataset is clean', () => {
  const corpus: Array<[string, string]> = [];

  for (const category of opportunityCategories) {
    corpus.push([`category:${category.slug}`, category.name]);
    corpus.push([`category:${category.slug}:short`, category.shortDescription]);
    corpus.push([`category:${category.slug}:desc`, category.description]);
    corpus.push([`category:${category.slug}:risk`, category.riskNotice]);
  }

  for (const opportunity of opportunities) {
    corpus.push([`opportunity:${opportunity.slug}`, opportunity.title]);
    corpus.push([`opportunity:${opportunity.slug}:summary`, opportunity.summary]);
    corpus.push([`opportunity:${opportunity.slug}:desc`, opportunity.description]);
    corpus.push([`opportunity:${opportunity.slug}:risk`, opportunity.riskNotice]);
    corpus.push([`opportunity:${opportunity.slug}:structure`, opportunity.structure]);
  }

  for (const biz of businessOpportunities) {
    corpus.push([`business:${biz.slug}`, biz.title]);
    corpus.push([`business:${biz.slug}:summary`, biz.summary]);
    corpus.push([`business:${biz.slug}:desc`, biz.description]);
    corpus.push([`business:${biz.slug}:risk`, biz.riskNotice]);
    corpus.push([`business:${biz.slug}:heavenward`, biz.heavenwardRole]);
    corpus.push([`business:${biz.slug}:customer`, biz.customerRole]);
    corpus.push([`business:${biz.slug}:associate`, biz.associateRole]);
    corpus.push([`business:${biz.slug}:duration`, biz.durationLabel]);
  }

  corpus.push(['enquiry:acknowledgement', ACKNOWLEDGEMENT_MESSAGE]);
  for (const step of NEXT_STEPS) {
    corpus.push([`enquiry:next-step:${step.key}`, `${step.title} ${step.description} ${step.footnote}`]);
  }

  for (const post of insightPosts) {
    corpus.push([`insight:${post.slug}`, post.title]);
    corpus.push([`insight:${post.slug}:excerpt`, post.excerpt]);
    for (const block of post.body) {
      if ('text' in block) corpus.push([`insight:${post.slug}:body`, block.text]);
      if (block.kind === 'list') corpus.push([`insight:${post.slug}:list`, block.items.join(' ')]);
    }
  }

  for (const page of legalPages) {
    corpus.push([`legal:${page.slug}`, page.summary]);
    for (const block of page.body) {
      if ('text' in block) corpus.push([`legal:${page.slug}`, block.text]);
      if (block.kind === 'list') corpus.push([`legal:${page.slug}:list`, block.items.join(' ')]);
      if (block.kind === 'quote') corpus.push([`legal:${page.slug}:quote`, block.text]);
    }
  }


  it.each(corpus)('%s contains no prohibited claim', (_label, text) => {
    const result = scanCopy(text);
    if (!result.ok) {
      const detail = result.violations
        .map((v) => `${v.match} (${v.label}) in "${v.context}"`)
        .join('; ');
      throw new Error(detail);
    }
  });
});

describe('copy guard — every opportunity carries risk language', () => {
  it('gives every category a key consideration notice', () => {
    for (const category of opportunityCategories) {
      expect(category.riskNotice.length).toBeGreaterThan(60);
      expect(scanCopy(category.riskNotice).ok).toBe(true);
    }
  });

  it('gives every opportunity a key consideration notice', () => {
    for (const opportunity of opportunities) {
      expect(opportunity.riskNotice.length).toBeGreaterThan(60);
      expect(scanCopy(opportunity.riskNotice).ok).toBe(true);
    }
  });

  it('marks every opportunity as not publicly downloadable', () => {
    for (const opportunity of opportunities) {
      expect(opportunity.documentsPubliclyDownloadable).toBe(false);
    }
  });
});

describe('PRD — business opportunities carry defined roles', () => {
  it('gives every business opportunity a defined role for Heavenward Place', () => {
    for (const biz of businessOpportunities) {
      expect(biz.heavenwardRole.length).toBeGreaterThan(20);
      expect(biz.customerRole.length).toBeGreaterThan(20);
      expect(biz.associateRole.length).toBeGreaterThan(20);
    }
  });

  it('states a duration and a risk notice on every business opportunity', () => {
    for (const biz of businessOpportunities) {
      expect(biz.durationLabel.length).toBeGreaterThan(0);
      expect(biz.riskNotice.length).toBeGreaterThan(60);
    }
  });

  it('keeps the six investment categories investment-only', async () => {
    const { opportunityCategories: cats } = await import('@/data/opportunities');
    for (const category of cats) {
      expect(category.kind).toBe('INVESTMENT');
    }
  });
});

describe('assertCopyAllowed', () => {
  it('passes clean copy', () => {
    expect(() => assertCopyAllowed('A quiet introduction to farmland.', 'test')).not.toThrow();
  });

  it('throws with an actionable message on a prohibited claim', () => {
    expect(() => assertCopyAllowed('Guaranteed returns await.', 'test')).toThrow(/prohibited claim/i);
  });
});

describe('marketing copy scan', () => {
  it('is stricter for short promotional strings', () => {
    const text = 'Guaranteed returns. No risk. Start today.';
    expect(scanCopy(text).ok).toBe(false);
    expect(scanMarketingCopy(text).ok).toBe(false);
  });
});
