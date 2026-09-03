"use client";

import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Check, Home, DollarSign, Headphones } from "lucide-react";

const steps = [
  { icon: Home, title: "List your property", description: "Create a listing with photos, amenities, and pricing" },
  { icon: DollarSign, title: "Set your rates", description: "You control pricing. We handle the rest" },
  { icon: Headphones, title: "We manage everything", description: "Guest screening, payments, support, and marketing" },
];

export default function HostPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", propertyType: "", location: "", message: "" });

  return (
    <div className="min-h-screen bg-white">
      <PageHeader title="Become a Host" subtitle="Earn premium income from your property" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-display font-semibold text-ink mb-8">How it works</h2>
            <div className="space-y-6">
              {steps.map((step, i) => (
                <div key={step.title} className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <step.icon size={24} className="text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-primary">Step {i + 1}</span>
                    </div>
                    <h3 className="font-semibold text-ink mb-1">{step.title}</h3>
                    <p className="text-sm text-charcoal">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 p-6 bg-surface rounded-2xl">
              <h3 className="font-semibold text-ink mb-3">Host Benefits</h3>
              <ul className="space-y-2">
                {["80/20 revenue split in your favour", "Professional photography included", "24/7 guest support", "Flexible cancellation policies"].map((b) => (
                  <li key={b} className="flex items-center gap-2 text-sm text-charcoal"><Check size={16} className="text-success shrink-0" />{b}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-surface rounded-2xl p-8">
            <h2 className="text-2xl font-display font-semibold text-ink mb-6">Apply to host</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Full name" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <Input label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <Input label="Phone" type="tel" placeholder="+234 801 234 5678" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <Input label="Property type" placeholder="Apartment, House, Penthouse..." value={form.propertyType} onChange={(e) => setForm({ ...form, propertyType: e.target.value })} />
              <Input label="Location" placeholder="Lekki, VI, Ikoyi..." value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">Tell us about your property</label>
                <textarea rows={4} placeholder="Describe your property..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-border bg-white text-ink text-sm placeholder:text-charcoal/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200" />
              </div>
              <Button fullWidth size="lg">Submit application</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
