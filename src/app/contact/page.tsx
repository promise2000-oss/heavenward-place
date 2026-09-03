"use client";

import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  return (
    <div className="min-h-screen bg-white">
      <PageHeader title="Contact Us" subtitle="Get in touch with our team" />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-surface rounded-2xl p-8">
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Name" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <Input label="Subject" placeholder="How can we help?" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Message</label>
              <textarea rows={5} placeholder="Tell us more..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-border bg-white text-ink text-sm placeholder:text-charcoal/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200" />
            </div>
            <Button fullWidth size="lg">Send message</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
