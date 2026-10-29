import type { NextStepChoice } from './types';

/**
 * Enquiry acknowledgement and next-step copy (PRD §4, §5, §8).
 *
 * The site is static: there is no server to send an automatic email, so the
 * acknowledgement is shown to the customer the moment they submit, and their
 * own sent message (email or WhatsApp) is their receipt. The wording follows
 * PRD §8 and must never promise approval, availability or profitability.
 */

/**
 * The acknowledgement shown after a customer submits their interest
 * (PRD §8 — suggested customer acknowledgement).
 *
 * A response timeframe is deliberately NOT promised here. PRD §4 allows a
 * timeframe only if Heavenward Place has configured one and can meet it; on a
 * static site there is no configured service level, so none is stated.
 */
export const ACKNOWLEDGEMENT_MESSAGE =
  'Thank you for expressing interest in this Heavenward Place opportunity. We have received your details, and our team will review your enquiry and contact you with the relevant next steps. You may now choose to request an office visit or explore available apartments near your preferred location for a comfortable and conducive setting. Your enquiry is subject to review, availability and the specific terms of the opportunity; submission does not guarantee participation or financial results.';

/** The two next steps offered after an interest submission (PRD §5). */
export const NEXT_STEPS: Array<{
  key: NextStepChoice;
  title: string;
  description: string;
  footnote: string;
}> = [
  {
    key: 'OFFICE_VISIT',
    title: 'Visit our office',
    description:
      'Prefer to meet in person? Request an office visit and tell us your preferred date. We check availability and respond with an available time window for that date, or propose an alternative.',
    footnote:
      'Your preferred date is a request, not a confirmed appointment. The visit is confirmed only once we and you agree on a time.',
  },
  {
    key: 'APARTMENT_BOOKING',
    title: 'Book an apartment near you',
    description:
      'Want a comfortable, conducive setting for the discussion? Tell us your preferred location and what you need, and we point you to available apartments in that area — or the closest available areas where practical.',
    footnote:
      'Apartment booking is subject to availability, standard booking procedures, applicable pricing and payment terms. Booking an apartment does not guarantee access to, acceptance into or success of an opportunity.',
  },
];
