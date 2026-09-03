import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";
import { HelpCircle, Mail, Phone, MessageCircle } from "lucide-react";

const channels = [
  { icon: HelpCircle, title: "Help Centre", description: "Browse our FAQ and guides", href: "/faq" },
  { icon: Mail, title: "Email Us", description: "support@heavenwardplace.com", href: "mailto:support@heavenwardplace.com" },
  { icon: Phone, title: "Call Us", description: "+234 801 234 5678", href: "tel:+2348012345678" },
  { icon: MessageCircle, title: "WhatsApp", description: "Chat with our team", href: "#" },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-white">
      <PageHeader title="Help Centre" subtitle="We're here to help you with anything you need" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          {channels.map((ch) => (
            <Link key={ch.title} href={ch.href} className="flex items-start gap-5 p-6 bg-surface rounded-2xl hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                <ch.icon size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-ink mb-1">{ch.title}</h3>
                <p className="text-sm text-charcoal">{ch.description}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="bg-surface rounded-2xl p-8 text-center">
          <h3 className="text-xl font-display font-semibold text-ink mb-2">Still need help?</h3>
          <p className="text-charcoal mb-6">Our support team is available 24/7 to assist you</p>
          <Link href="/contact" className="inline-flex px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-light transition-colors">Contact support</Link>
        </div>
      </div>
    </div>
  );
}
