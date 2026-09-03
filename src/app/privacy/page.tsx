import PageHeader from "@/components/layout/PageHeader";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <PageHeader title="Privacy Policy" subtitle="How we protect your data" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="space-y-8 text-charcoal leading-relaxed">
          <p>Last updated: January 2025</p>
          <section>
            <h2 className="text-2xl font-display font-semibold text-ink mt-8 mb-4">1. Information We Collect</h2>
            <p>We collect information you provide directly: name, email, phone number, payment details, and communication preferences. We also collect usage data to improve our services.</p>
          </section>
          <section>
            <h2 className="text-2xl font-display font-semibold text-ink mt-8 mb-4">2. How We Use Your Information</h2>
            <p>We use your information to process bookings, communicate with you, improve our services, and ensure platform safety. We never sell your personal data to third parties.</p>
          </section>
          <section>
            <h2 className="text-2xl font-display font-semibold text-ink mt-8 mb-4">3. Data Sharing</h2>
            <p>We share your information only with hosts (for booking confirmation), payment processors, and as required by law. We implement strict data protection measures.</p>
          </section>
          <section>
            <h2 className="text-2xl font-display font-semibold text-ink mt-8 mb-4">4. Data Security</h2>
            <p>We use industry-standard encryption and security practices to protect your data. All payment information is processed through PCI-compliant systems.</p>
          </section>
          <section>
            <h2 className="text-2xl font-display font-semibold text-ink mt-8 mb-4">5. Your Rights</h2>
            <p>You can access, update, or delete your personal data at any time by contacting us or through your account settings.</p>
          </section>
          <section>
            <h2 className="text-2xl font-display font-semibold text-ink mt-8 mb-4">6. Contact Us</h2>
            <p>For privacy-related inquiries, contact us at privacy@heavenwardplace.com.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
