"use client";

import { motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { TrendingUp, BarChart3, Shield, Globe, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";
import Link from "next/link";

const stats = [
  { icon: TrendingUp, value: "25%+", label: "Average ROI", description: "Higher than traditional real estate" },
  { icon: BarChart3, value: "85%", label: "Occupancy Rate", description: "Year-round bookings" },
  { icon: Shield, value: "100%", label: "Asset-Backed", description: "Real property investment" },
  { icon: Globe, value: "3", label: "African Markets", description: "Lagos, Accra, Nairobi" },
];

export default function InvestmentTeaser() {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 gradient-premium" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] orb orb-teal opacity-20" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] orb orb-gold opacity-15" />
      <div className="absolute inset-0 dot-pattern opacity-[0.03]" />
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-secondary/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div variants={fadeInUp}>
            <span className="inline-flex items-center gap-2 px-4 py-2 glass-dark rounded-full text-sm font-medium text-secondary mb-8">
              <Sparkles size={14} />
              Investment Opportunity
            </span>
            <h2 className="text-3xl lg:text-5xl font-display font-semibold text-white leading-tight tracking-tight">
              Own a piece of Africa&apos;s <span className="bg-gradient-to-r from-secondary-light to-secondary bg-clip-text text-transparent">booming short-let market</span>
            </h2>
            <p className="mt-6 text-lg text-white/80 leading-relaxed max-w-lg">
              Earn premium returns while owning real property. Our fractional ownership model lets you invest in luxury short-let apartments across Lagos, with projected yields of 25%+ annually.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/investment">
                <Button variant="secondary" size="lg" icon={<TrendingUp size={18} />}>
                  Learn about investing
                </Button>
              </Link>
              <Link href="/investment">
                <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white hover:text-primary-dark">
                  View returns
                </Button>
              </Link>
            </div>
          </motion.div>
          
          <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-5">
            {stats.map((stat) => (
              <div key={stat.label} className="glass-dark p-7 rounded-2xl glow-on-hover group">
                <stat.icon size={28} className="text-secondary mb-4 group-hover:scale-110 transition-transform duration-300" />
                <p className="text-3xl font-bold font-display text-white">{stat.value}</p>
                <p className="text-sm font-semibold text-white/90 mt-2">{stat.label}</p>
                <p className="text-xs text-white/60 mt-1">{stat.description}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
