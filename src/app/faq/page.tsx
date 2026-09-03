"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import PageHeader from "@/components/layout/PageHeader";
import { faqs } from "@/data";

export default function FAQPage() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = faqs.filter((f) =>
    f.question.toLowerCase().includes(search.toLowerCase()) ||
    f.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      <PageHeader title="Frequently Asked Questions" subtitle="Find answers to common questions" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <input type="text" placeholder="Search questions..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full px-5 py-4 rounded-2xl border border-border bg-surface text-ink placeholder:text-charcoal/50 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary mb-8" />
        <div className="space-y-3">
          {filtered.map((faq) => (
            <div key={faq.id} className="border border-border rounded-2xl overflow-hidden">
              <button onClick={() => setOpenId(openId === faq.id ? null : faq.id)} className="w-full flex items-center justify-between p-5 text-left cursor-pointer hover:bg-surface/50 transition-colors">
                <span className="font-semibold text-ink pr-4">{faq.question}</span>
                <ChevronDown size={20} className={cn("text-charcoal shrink-0 transition-transform", openId === faq.id && "rotate-180")} />
              </button>
              {openId === faq.id && (
                <div className="px-5 pb-5 text-charcoal leading-relaxed">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
