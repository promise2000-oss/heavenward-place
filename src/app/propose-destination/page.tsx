"use client";

import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function ProposeDestinationPage() {
  const [form, setForm] = useState({ name: "", email: "", city: "", country: "", reason: "" });

  return (
    <div className="min-h-screen bg-white">
      <PageHeader title="Propose a Destination" subtitle="Help us expand to new cities across Africa" />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-surface rounded-2xl p-8">
          <p className="text-charcoal mb-6">Know a city that deserves premium short-let accommodation? Tell us where we should go next. We&apos;re always looking to expand our presence across Africa.</p>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Your name" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="City" placeholder="e.g. Accra" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              <Input label="Country" placeholder="e.g. Ghana" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Why this destination?</label>
              <textarea rows={4} placeholder="Tell us why this city would be a great fit..." value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-border bg-white text-ink text-sm placeholder:text-charcoal/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200" />
            </div>
            <Button fullWidth size="lg">Submit proposal</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
