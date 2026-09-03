import PageHeader from "@/components/layout/PageHeader";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <PageHeader title="Terms of Service" subtitle="Rules and guidelines for using Heavenward" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="space-y-8 text-charcoal leading-relaxed">
          <p>Last updated: January 2025</p>
          <section>
            <h2 className="text-2xl font-display font-semibold text-ink mt-8 mb-4">1. Acceptance of Terms</h2>
            <p>By using Heavenward Place, you agree to these Terms of Service. If you do not agree, please do not use our platform.</p>
          </section>
          <section>
            <h2 className="text-2xl font-display font-semibold text-ink mt-8 mb-4">2. Booking Terms</h2>
            <p>Bookings are subject to availability and host approval. Payment is required at the time of booking. Cancellation policies vary by property.</p>
          </section>
          <section>
            <h2 className="text-2xl font-display font-semibold text-ink mt-8 mb-4">3. Payment Terms</h2>
            <p>All payments are processed securely. Prices are displayed in Nigerian Naira (NGN) unless otherwise stated. Service fees and taxes are included in the total price.</p>
          </section>
          <section>
            <h2 className="text-2xl font-display font-semibold text-ink mt-8 mb-4">4. User Conduct</h2>
            <p>Users must treat properties with respect and follow house rules. Violations may result in account suspension.</p>
          </section>
          <section>
            <h2 className="text-2xl font-display font-semibold text-ink mt-8 mb-4">5. Limitation of Liability</h2>
            <p>Heavenward acts as a platform connecting guests and hosts. We are not liable for property conditions or guest conduct.</p>
          </section>
          <section>
            <h2 className="text-2xl font-display font-semibold text-ink mt-8 mb-4">6. Dispute Resolution</h2>
            <p>Disputes should be reported within 48 hours of checkout. Our support team will mediate to reach a fair resolution.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
