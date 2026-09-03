"use client";

import { motion } from "framer-motion";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { TrendingUp, BarChart3, Shield, Globe, CheckCircle, ArrowRight } from "lucide-react";

const stats = [
  { value: "25%+", label: "Projected Annual ROI" },
  { value: "85%", label: "Average Occupancy Rate" },
  { value: "₦5M", label: "Minimum Investment" },
  { value: "3", label: "African Markets" },
];

const steps = [
  { num: "01", title: "Choose a property", description: "Select from our curated portfolio of premium short-let apartments in Lagos." },
  { num: "02", title: "Invest fractional shares", description: "Own a fraction of the property starting from ₦5,000,000." },
  { num: "03", title: "Earn returns", description: "Receive quarterly returns from rental income, projected at 25%+ annually." },
];

const returns = [
  { period: "Year 1", roi: "22%", income: "₦1,100,000", cumulative: "₦1,100,000" },
  { period: "Year 2", roi: "25%", income: "₦1,375,000", cumulative: "₦2,475,000" },
  { period: "Year 3", roi: "28%", income: "₦1,694,000", cumulative: "₦4,169,000" },
  { period: "Year 5", roi: "30%", income: "₦2,197,000", cumulative: "₦10,819,000" },
];

export default function InvestmentPage() {
  return (
    <div className="min-h-screen bg-white">
      <PageHeader title="Invest in Premium Real Estate" subtitle="Own a piece of Africa's booming short-let market" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Stats */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {stats.map((stat) => (
            <motion.div key={stat.label} variants={fadeInUp} className="text-center p-8 bg-surface rounded-2xl">
              <p className="text-3xl lg:text-4xl font-display font-bold text-primary">{stat.value}</p>
              <p className="mt-2 text-sm text-charcoal font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* How it works */}
        <div className="mb-20">
          <h2 className="text-3xl font-display font-semibold text-ink text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.num} className="text-center p-6">
                <span className="text-5xl font-display font-bold text-primary/10">{step.num}</span>
                <h3 className="text-xl font-semibold text-ink mt-4 mb-2">{step.title}</h3>
                <p className="text-charcoal">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Projected Returns */}
        <div className="mb-20" id="returns">
          <h2 className="text-3xl font-display font-semibold text-ink text-center mb-4">Projected Returns</h2>
          <p className="text-center text-charcoal mb-8 max-w-2xl mx-auto">Based on a ₦5,000,000 investment in a premium 2-bedroom apartment in Lekki Phase 1.</p>
          <div className="overflow-x-auto">
            <table className="w-full bg-white border border-border rounded-2xl overflow-hidden">
              <thead>
                <tr className="bg-surface">
                  <th className="text-left text-xs font-medium text-charcoal uppercase tracking-wider px-6 py-4">Period</th>
                  <th className="text-left text-xs font-medium text-charcoal uppercase tracking-wider px-6 py-4">Annual ROI</th>
                  <th className="text-left text-xs font-medium text-charcoal uppercase tracking-wider px-6 py-4">Annual Income</th>
                  <th className="text-left text-xs font-medium text-charcoal uppercase tracking-wider px-6 py-4">Cumulative</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {returns.map((r) => (
                  <tr key={r.period} className="hover:bg-surface/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-ink">{r.period}</td>
                    <td className="px-6 py-4 text-sm text-success font-semibold">{r.roi}</td>
                    <td className="px-6 py-4 text-sm text-charcoal">{r.income}</td>
                    <td className="px-6 py-4 text-sm text-ink font-semibold">{r.cumulative}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <div className="gradient-premium rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-display font-semibold mb-4">Ready to start investing?</h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">Join hundreds of investors earning premium returns through fractional real estate ownership.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="secondary" size="lg" icon={<ArrowRight size={18} />} iconPosition="right">Start investing</Button>
            <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white hover:text-primary-dark">Download prospectus</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
