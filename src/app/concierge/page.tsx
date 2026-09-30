import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { PageHeader } from '@/components/layout/PageHeader';
import { ConciergeRequestForm } from '@/components/concierge/ConciergeRequestForm';
import { CONCIERGE_SERVICES } from '@/data/types';
import { Alert, Badge, Container, Section, SectionHeading } from '@/components/ui/primitives';
import { Stagger, StaggerItem, Reveal } from '@/components/motion/Motion';
import { CarIcon, ChefIcon, HousekeepingIcon, SparkleIcon, ToolIcon, TruckIcon } from '@/components/concierge/concierge-icons';
import { CarIcon as CarAlt, ChefIcon as ChefAlt } from '@/components/ui/icons';
import { SITE } from '@/data/site';

export const metadata: Metadata = buildMetadata({
  title: 'Concierge',
  path: '/concierge',
  description:
    'Airport pickup, premium private chef, housekeeping, chauffeur hire and technical support for your Heavenward Place stay. Request during booking or after check-in.',
  keywords: [
    'concierge services Lagos',
    'airport pickup Lagos',
    'private chef Lagos',
    'chauffeur hire Nigeria',
    'corporate housing concierge',
  ],
});

const ICONS: Record<string, (p: { className?: string }) => React.JSX.Element> = {
  PICKUP: CarIcon,
  PRIVATE_CHEF: ChefIcon,
  HOUSEKEEPING: HousekeepingIcon,
  MAINTENANCE: ToolIcon,
  TRANSPORT: TruckIcon,
  OTHER: SparkleIcon,
};

export default function ConciergePage() {
  return (
    <>
      <PageHeader
        eyebrow="Concierge"
        title="Everything around the residence, handled."
        intro="All applicable concierge services are available on request — during the booking process or at any point after check-in. One team, one booking reference, no chasing."
        image="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=2200&q=80"
        breadcrumbs={[{ name: 'Home', url: '/' }, { name: 'Concierge', url: '/concierge' }]}
      />

      {/* Long-stay benefits */}
      <Section tone="white">
        <Container>
          <SectionHeading
            eyebrow="Long-Stay Benefits"
            title="Applied automatically at seven nights"
            intro="You do not need to request these and there is nothing to negotiate. On any booking of 7 nights or more, the following are included as standard and shown in your price review before you pay."
          />

          <div className="mt-14 grid gap-px bg-slate-200 lg:grid-cols-2">
            <Reveal>
              <div className="h-full bg-black p-8 sm:p-10">
                <CarAlt className="h-8 w-8 text-[#FF9800]" />
                <p className="mt-6 font-label text-[9.5px] tracking-[0.24em] text-[#FF9800]">
                  COMPLIMENTARY
                </p>
                <h3 className="mt-4 text-2xl font-extrabold text-white">
                  Airport / preferred-location pickup
                </h3>
                <p className="mt-4 text-[0.93rem] leading-relaxed text-slate-300">
                  A trusted driver meets you at Murtala Muhammed International Airport, Lagos, or at
                  your preferred pickup point, and brings you straight to the residence. Share your
                  flight details before you land and it is arranged.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="h-full border border-black p-8 sm:p-10">
                <ChefAlt className="h-8 w-8 text-[#FF9800]" />
                <p className="mt-6 font-label text-[9.5px] tracking-[0.24em] text-[#e08600]">
                  COMPLIMENTARY
                </p>
                <h3 className="mt-4 text-2xl font-extrabold text-black">
                  3 private-chef meals per week
                </h3>
                <p className="mt-4 text-[0.93rem] leading-relaxed text-slate-700">
                  Maximum one complimentary meal per day. You choose breakfast, lunch or dinner for
                  each meal, subject to availability. Additional private-chef services beyond the
                  complimentary allocation are charged at the published rate — and we always tell
                  you before anything is charged.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.16}>
            <Alert tone="info" title="Shorter stays" className="mt-8">
              If your stay is under seven nights, airport pickup and private-chef meals remain
              available as paid add-ons. The published rate is shown in your price review before
              you pay, and appears as a line item on your booking.
            </Alert>
          </Reveal>
        </Container>
      </Section>

      {/* All services */}
      <Section tone="cream-soft">
        <Container>
          <SectionHeading
            eyebrow="What We Offer"
            title="Six services, one request form"
            intro="Every service is available on request. Complimentary entitlements are applied automatically at the point of booking — you never have to ask for what you are already owed."
          />

          <Stagger className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
            {CONCIERGE_SERVICES.map((service) => {
              const Icon = ICONS[service.key] ?? SparkleIcon;
              return (
                <StaggerItem key={service.key}>
                  <div className="edge-orange flex h-full flex-col border border-slate-200 bg-white p-7">
                    <span className="flex h-12 w-12 items-center justify-center border border-[#FF9800] text-black">
                      <Icon className="h-5.5 w-5.5" />
                    </span>
                    <h3 className="mt-6 font-heading text-[1.02rem] font-extrabold leading-snug text-black">
                      {service.name}
                    </h3>
                    <p className="mt-3 flex-1 text-[0.88rem] leading-relaxed text-slate-600">
                      {service.description}
                    </p>
                    <div className="mt-6 border-t border-slate-100 pt-4">
                      {service.complimentaryFromNights > 0 ? (
                        <Badge tone="orange">
                          Complimentary at {service.complimentaryFromNights}+ nights
                        </Badge>
                      ) : null}
                      <p className="mt-2.5 font-label text-[8.5px] tracking-[0.22em] text-slate-500">
                        {service.priceLabel.toUpperCase()}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        </Container>
      </Section>

      {/* Request form */}
      <Section tone="white">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="Make a Request"
              title="Tell us what you need"
              intro="If you already have a booking reference, include it so we can attach the request to your stay. If you are still deciding, submit anyway — we will help with the whole arrangement."
            />
            <div className="mt-9 border-l-[3px] border-[#FF9800] bg-cream-soft p-6">
              <p className="font-label text-[9.5px] tracking-[0.24em] text-[#e08600]">
                PREFERRED TIMES
              </p>
              <p className="mt-3 text-[0.88rem] leading-relaxed text-slate-700">
                Concierge requests are handled between 8:00 AM and 8:00 PM (WAT), Monday to
                Saturday. Guests in residence have an emergency line available at any hour.
              </p>
            </div>
            <div className="mt-6 flex flex-col gap-3">
              <a
                href={`tel:${SITE.contact.phoneHref}`}
                className="flex items-center gap-3 border border-slate-200 p-4 transition-colors duration-300 hover:border-black"
              >
                <CarAlt className="h-5 w-5 text-[#FF9800]" />
                <span>
                  <span className="block font-label text-[8.5px] tracking-[0.22em] text-slate-500">
                    CALL CONCIERGE
                  </span>
                  <span className="mt-1 block font-heading text-[0.98rem] font-bold text-black">
                    {SITE.contact.phone}
                  </span>
                </span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 xl:col-span-8">
            <ConciergeRequestForm />
          </div>
        </Container>
      </Section>

      {/* How it works */}
      <Section tone="black">
        <div className="grid-texture-dark absolute inset-0 opacity-70" aria-hidden="true" />
        <Container className="relative">
          <SectionHeading
            tone="light"
            eyebrow="How It Works"
            title="Three steps, no back-and-forth"
            align="center"
          />
          <Stagger className="mx-auto mt-14 grid max-w-4xl gap-6 sm:grid-cols-3" stagger={0.09}>
            {[
              {
                title: 'You request',
                body: 'Before you arrive or once you are in residence, using the form on this page. Nothing is arranged until we have replied.',
              },
              {
                title: 'We confirm',
                body: 'A member of the concierge team confirms availability, timing and — where anything is chargeable — the cost, before anything is committed.',
              },
              {
                title: 'It happens',
                body: 'Your driver arrives, your chef cooks, your housekeeping schedule is set. You are told when, and who is coming.',
              },
            ].map((step, index) => (
              <StaggerItem key={step.title}>
                <div className="h-full border border-white/15 p-7">
                  <span className="font-display text-4xl text-[#FF9800]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-5 font-heading text-[1rem] font-extrabold text-white">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-[0.87rem] leading-relaxed text-slate-400">{step.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>
    </>
  );
}
