import type { LegalPage } from './types';

const PENDING =
  'Placeholder wording. This document is pending review and approval by qualified Nigerian legal and compliance counsel and must be finalised before launch.';

/**
 * All legal content lives in this file, in the shape a CMS would hold it, so
 * counsel-approved wording can replace the placeholders before launch without a
 * code change. Every page is flagged `pendingLegalReview: true` for the same
 * reason.
 */
export const legalPages: LegalPage[] = [
  {
    slug: 'terms',
    title: 'Terms & Conditions',
    summary: 'The terms that govern your use of the Heavenward Place website and services.',
    updatedAt: '2026-09-01T00:00:00.000Z',
    pendingLegalReview: true,
    seoTitle: 'Terms & Conditions | Heavenward Place',
    seoDescription: 'Terms and conditions governing use of the Heavenward Place website and services.',
    body: [
      { kind: 'callout', tone: 'legal', title: 'Pending legal review', text: PENDING },
      { kind: 'heading', level: 2, text: '1. About these terms' },
      {
        kind: 'paragraph',
        text: 'These terms govern your access to and use of the Heavenward Place website, the accommodation services offered through it, and the business and investment opportunity information published on it. By using this website or making a booking you accept these terms.',
      },
      { kind: 'heading', level: 2, text: '2. Eligibility' },
      {
        kind: 'paragraph',
        text: 'This website does not create accounts and holds no credentials, so there is nothing for you to safeguard here. Enquiries and booking requests reach us only when you choose to send them, using your own email or messaging app. Please make sure that whatever you send us is accurate and current, and that you are legally able to enter into a binding contract in order to book accommodation or participate in any arrangement. We may ask to verify your identity before confirming a booking, and we will tell you how before we do.',
      },
      { kind: 'heading', level: 2, text: '3. Accommodation bookings' },
      {
        kind: 'paragraph',
        text: 'A booking is formed only when payment has been successfully received and you have received a confirmation. Availability is confirmed at the point of successful payment. Pricing, minimum stay, house rules, check-in and check-out times, and the applicable cancellation terms are shown on the property page and in your confirmation.',
      },
      {
        kind: 'callout',
        tone: 'info',
        title: 'Pricing',
        text: 'Heavenward Place operates two accommodation price lists — a Hospitality list for guests staying with us, and a Business & Investment partner list. The rate that applies to you is the one shown on the residence you are looking at, and it is shown in full before you commit to anything. Where a partner rate applies, it is agreed with you in advance and set out in your quote.',
      },
      { kind: 'heading', level: 2, text: '4. Business & investment opportunities' },
      {
        kind: 'paragraph',
        text: 'The Business & Investment section is a curated opportunity-discovery service. It is not an investment portal, not a public marketplace, and not an offer or solicitation. Information published is high level. Detailed information, documentation, terms and agreements are provided through a separate follow-up process.',
      },
      {
        kind: 'callout',
        tone: 'warning',
        title: 'No custody of funds. No guaranteed returns.',
        text: 'Heavenward Place does not take custody of, hold, pool or manage customer investment funds through this website. No returns are guaranteed. See the Business & Investment Opportunity Disclaimer for the full statement.',
      },
      { kind: 'heading', level: 2, text: '5. Prohibited conduct' },
      {
        kind: 'list',
        style: 'bullet',
        items: [
          'Using the website for any unlawful purpose or in breach of applicable Nigerian law.',
          'Attempting to gain unauthorised access to any system, or to interfere with the operation or security of the website.',
          'Scraping, harvesting or systematically extracting content from the website.',
          'Misrepresenting your identity, authority or intentions in any enquiry or lead submission.',
        ],
      },
      { kind: 'heading', level: 2, text: '6. Intellectual property' },
      {
        kind: 'paragraph',
        text: 'The Heavenward Place name, logo, wordmark, house mark, website content and design are owned by Heavenward Place and may not be reproduced without written permission, except for personal, non-commercial use.',
      },
      { kind: 'heading', level: 2, text: '7. Limitation of liability' },
      {
        kind: 'paragraph',
        text: 'To the extent permitted by law, Heavenward Place is not liable for indirect or consequential loss arising from your use of the website or from any opportunity published on it. Nothing in these terms limits liability that cannot lawfully be limited.',
      },
      { kind: 'heading', level: 2, text: '8. Governing law' },
      {
        kind: 'paragraph',
        text: 'These terms are governed by the laws of the Federal Republic of Nigeria. Where a dispute arises, the parties submit to the jurisdiction of the Nigerian courts, subject to any mandatory consumer protection provisions that may apply.',
      },
      { kind: 'heading', level: 2, text: '9. Changes to these terms' },
      {
        kind: 'paragraph',
        text: 'We may update these terms. Material changes affecting an existing booking will not apply to that booking. The version in force at the time of your booking is the version that governs it.',
      },
    ],
  },
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    summary: 'What personal data we collect, why we collect it, and the controls you have over it.',
    updatedAt: '2026-09-01T00:00:00.000Z',
    pendingLegalReview: true,
    seoTitle: 'Privacy Policy | Heavenward Place',
    seoDescription: 'How Heavenward Place collects, uses, protects and retains personal data and KYC information.',
    body: [
      { kind: 'callout', tone: 'legal', title: 'Pending legal review', text: PENDING },
      { kind: 'heading', level: 2, text: '1. Who we are' },
      {
        kind: 'paragraph',
        text: 'Heavenward Place is a corporate housing and opportunity-discovery company. This policy explains how we handle personal data collected through this website.',
      },
      { kind: 'heading', level: 2, text: '2. What we collect' },
      {
        kind: 'list',
        style: 'bullet',
        items: [
          'This website does not collect or store personal data. It has no accounts, no cookies set by its own code, no analytics and no forms that transmit anything to us. The forms on this site build a message in your own email or messaging app and you decide whether to send it.',
          'Where you do contact us, the categories of data we may then hold are: the contact details you provide; the property, dates and guest numbers relevant to your enquiry or booking; identity information we ask you for directly, over a secure channel, before confirming a booking; and correspondence with you about it.',
          'We hold that information in our own business systems, not in this website, and we use it only to respond, to administer a booking and to meet our legal obligations. We do not sell personal data.',
        ],
      },
      {
        kind: 'callout',
        tone: 'info',
        title: 'What we do not collect on the opportunity form',
        text: 'The initial business and investment interest form deliberately does not ask for your experience, objectives, risk appetite, investment duration, exit preference or deployment timeline. Those matters are handled in follow-up conversations.',
      },
      { kind: 'heading', level: 2, text: '3. How we use it' },
      {
        kind: 'paragraph',
        text: 'To process and administer bookings, verify identity, provide accommodation and concierge services, respond to enquiries, send service notifications, prevent fraud, meet legal and regulatory obligations, and improve the website and our service quality.',
      },
      { kind: 'heading', level: 2, text: '4. How we protect it' },
      {
        kind: 'list',
        style: 'bullet',
        items: [
          'Sensitive identity fields are encrypted at rest and are readable only by authorised staff with a logged access record.',
          'Identification documents are stored privately. They are never publicly accessible and are delivered to authorised staff through short-lived signed links.',
          'Access to customer identity records is restricted by role and every administrative view is recorded in an immutable audit log.',
          'All traffic is served over HTTPS with modern security headers.',
        ],
      },
      { kind: 'heading', level: 2, text: '5. Who we share it with' },
      {
        kind: 'paragraph',
        text: 'We share personal data only with service providers who process it on our instructions — payment processing, email delivery, property management and infrastructure hosting — and where required by law. We do not sell personal data.',
      },
      { kind: 'heading', level: 2, text: '6. Retention and deletion' },
      {
        kind: 'paragraph',
        text: 'We retain booking and identity records for as long as needed to administer the booking, meet legal and tax obligations, resolve disputes and enforce our terms. When data is no longer required it is deleted or irreversibly anonymised. You may request access to, correction of, or deletion of your personal data, subject to retention requirements that apply to us.',
      },
      { kind: 'heading', level: 2, text: '7. Cookies' },
      {
        kind: 'paragraph',
        text: 'We use essential cookies to keep you signed in and to protect forms. We use privacy-respecting analytics to understand how the site is used. You can control non-essential cookies in your browser.',
      },
      { kind: 'heading', level: 2, text: '8. Your rights' },
      {
        kind: 'paragraph',
        text: 'You have the right to request access to your personal data, to have inaccuracies corrected, to withdraw consent where we rely on it, and to complain to the relevant data protection authority. Contact us using the details on the Contact page.',
      },
    ],
  },
  {
    slug: 'cancellation',
    title: 'Booking & Cancellation Policy',
    summary: 'How to cancel, when refunds apply, and how refunds are processed.',
    updatedAt: '2026-09-01T00:00:00.000Z',
    pendingLegalReview: true,
    seoTitle: 'Booking & Cancellation Policy | Heavenward Place',
    seoDescription: 'Cancellation windows, refund amounts and how refunds are processed for Heavenward Place bookings.',
    body: [
      { kind: 'callout', tone: 'legal', title: 'Pending legal review', text: PENDING },
      { kind: 'heading', level: 2, text: '1. Free cancellation window' },
      {
        kind: 'paragraph',
        text: 'Bookings may be cancelled free of charge up to 7 days before the check-in date. Your confirmation email states the exact free-cancellation deadline for your booking.',
      },
      { kind: 'heading', level: 2, text: '2. Inside 7 days of check-in' },
      {
        kind: 'list',
        style: 'bullet',
        items: [
          '7 to 3 days before check-in: 50% of the total booking value is refundable.',
          'Less than 3 days before check-in: the booking is non-refundable.',
          'No-show: the booking is non-refundable.',
        ],
      },
      { kind: 'heading', level: 2, text: '3. Changes of dates' },
      {
        kind: 'paragraph',
        text: 'Date changes are subject to availability and to the cancellation window that applies at the time of the change. A change that cannot be accommodated is treated as a cancellation.',
      },
      { kind: 'heading', level: 2, text: '4. Cancellation by Heavenward Place' },
      {
        kind: 'paragraph',
        text: 'If we are unable to provide the accommodation you booked — for example through a property becoming unavailable or a force majeure event affecting the stay — you are entitled to a full refund of the amount paid, or to an alternative property of equivalent or higher standard at the same price, at your choice.',
      },
      { kind: 'heading', level: 2, text: '5. Refund processing' },
      {
        kind: 'paragraph',
        text: 'Refunds are issued to the original payment method. Where the original method cannot be credited, we agree an alternative with you. Refunds are initiated within 3 business days of an approved cancellation and are not subject to a processing fee charged by us. Your bank or card issuer may take a further 5 to 10 business days to reflect the credit.',
      },
      { kind: 'heading', level: 2, text: '6. Concierge and add-on services' },
      {
        kind: 'paragraph',
        text: 'Paid add-ons and scheduled concierge services are non-refundable once scheduled, because the cost is incurred in preparing and delivering them. Complimentary long-stay benefits carry no charge and therefore carry no refund.',
      },
    ],
  },
  {
    slug: 'hospitality-terms',
    title: 'Hospitality Service Terms',
    summary: 'The specific terms that apply to accommodation, concierge, pickup and private-chef services.',
    updatedAt: '2026-09-01T00:00:00.000Z',
    pendingLegalReview: true,
    seoTitle: 'Hospitality Service Terms | Heavenward Place',
    seoDescription: 'Terms for Heavenward Place accommodation, concierge, airport pickup and private chef services.',
    body: [
      { kind: 'callout', tone: 'legal', title: 'Pending legal review', text: PENDING },
      { kind: 'heading', level: 2, text: '1. Accommodation' },
      {
        kind: 'paragraph',
        text: 'Heavenward Place provides serviced short-let and corporate housing. Each residence is fully furnished, with utilities and internet included as described on the property page. Residences are serviced on the rhythm shown in your booking confirmation.',
      },
      { kind: 'heading', level: 2, text: '2. Check-in, check-out and identification' },
      {
        kind: 'list',
        style: 'bullet',
        items: [
          'Check-in and check-out times are shown on the property page and in your confirmation.',
          'A valid government-issued identification document is required for the lead guest and every additional guest before check-in.',
          'Details supplied at registration must be accurate. A booking may be refused where identification cannot be verified, and in that situation the applicable cancellation terms apply.',
        ],
      },
      { kind: 'heading', level: 2, text: '3. Long-stay benefits' },
      {
        kind: 'paragraph',
        text: 'For bookings of 7 nights or more, airport or preferred-location pickup is complimentary, and 3 private-chef meals per week are included with a maximum of 1 complimentary meal per day. You choose breakfast, lunch or dinner for each complimentary meal, subject to availability. Any chef service beyond the complimentary allocation is a paid service, as is pickup on bookings shorter than 7 nights.',
      },
      { kind: 'heading', level: 2, text: '4. Concierge services' },
      {
        kind: 'paragraph',
        text: 'Concierge services may be requested before you arrive or at any time after check-in, through the concierge page of this website, by telephone, or through the emergency line once you are in residence. Scheduled services are subject to availability and are confirmed to you by a Heavenward Place representative before anything is arranged or charged.',
      },
      { kind: 'heading', level: 2, text: '5. Conduct in the residence' },
      {
        kind: 'list',
        style: 'bullet',
        items: [
          'Residence house rules apply to all guests and are shown on the property page before booking.',
          'Damage caused beyond normal wear is chargeable and may be deducted from the security deposit or invoiced separately.',
          'Guests are responsible for the security of their own valuables. We do not accept liability for items left unattended in a residence.',
        ],
      },
      { kind: 'heading', level: 2, text: '6. Corporate invoicing' },
      {
        kind: 'paragraph',
        text: 'Corporate accounts may request an invoice in the company name in place of payment by card at the time of booking, subject to an approved account and the availability of accommodation.',
      },
    ],
  },
  {
    slug: 'opportunity-disclaimer',
    title: 'Business & Investment Opportunity Disclaimer',
    summary:
      'The full statement of what the Business & Investment section is, what it is not, and the risks that apply.',
    updatedAt: '2026-09-01T00:00:00.000Z',
    pendingLegalReview: true,
    seoTitle: 'Business & Investment Opportunity Disclaimer | Heavenward Place',
    seoDescription:
      'Heavenward Place does not take custody of, hold, pool or manage customer investment funds. Full opportunity disclaimer and risk statement.',
    body: [
      { kind: 'callout', tone: 'legal', title: 'Pending legal review', text: PENDING },
      { kind: 'callout', tone: 'warning', title: 'No custody of funds. No guaranteed returns.', text: 'Heavenward Place does not take custody of, hold, pool or manage customer investment funds through this website. The website is intended to introduce and facilitate discussions around selected opportunities. You should conduct appropriate due diligence and review the specific terms and agreements before committing funds. No returns are guaranteed.' },
      { kind: 'heading', level: 2, text: '1. What this section is' },
      {
        kind: 'paragraph',
        text: 'The Business & Investment section of this website is a curated opportunity-discovery service. It introduces selected business and investment opportunities across defined categories, captures an expression of interest, and starts a relationship.',
      },
      { kind: 'heading', level: 2, text: '2. What this section is not' },
      {
        kind: 'list',
        style: 'bullet',
        items: [
          'It is not a public investment marketplace or an investment portal.',
          'It is not an offer, solicitation or invitation to commit funds.',
          'It is not a place where customers transact directly with third parties without a documented arrangement.',
          'It is not a source of guaranteed returns, guaranteed income, guaranteed margins or risk-free investment.',
        ],
      },
      { kind: 'heading', level: 2, text: '3. Funds' },
      {
        kind: 'paragraph',
        text: 'Heavenward Place does not take custody of, hold, pool or manage customer investment funds through this website. Any arrangement involving funds is documented in a separate agreement between the parties to that arrangement, executed privately.',
      },
      { kind: 'heading', level: 2, text: '4. Risk' },
      {
        kind: 'paragraph',
        text: 'All opportunity participation involves risk, including the risk of loss of capital. Outcomes depend on the specific business, market conditions, the structure, the counterparty and the terms of the applicable agreement. Past activity is not a guide to future results.',
      },
      { kind: 'heading', level: 2, text: '5. Information on this website' },
      {
        kind: 'paragraph',
        text: 'Opportunity information is provided at a high level to support an initial decision about whether to proceed. It is not complete, is not independently verified by us, and is not investment, legal or tax advice. Obtain independent professional advice before acting.',
      },
      { kind: 'heading', level: 2, text: '6. Investment documents' },
      {
        kind: 'paragraph',
        text: 'Detailed investment documents are not published as public downloads. Where relevant, they are provided physically or through a controlled follow-up process, and may be subject to confidentiality terms.',
      },
      { kind: 'heading', level: 2, text: '7. Group enquiries' },
      {
        kind: 'paragraph',
        text: 'Enquiries submitted on behalf of a cooperative, investment club or other organised group are handled through an authorised Heavenward Place representative. Group name and authorised contact details are captured during follow-up, not on the public form.',
      },
    ],
  },
];

export function getLegalPage(slug: string) {
  return legalPages.find((p) => p.slug === slug);
}

/** Nav footer list — CAC registration details are deliberately absent. */
export const legalNav = legalPages.map((p) => ({ slug: p.slug, title: p.title }));
