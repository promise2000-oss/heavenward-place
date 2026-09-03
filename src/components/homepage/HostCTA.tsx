"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import Button from "@/components/ui/Button";
import { Home, DollarSign, Headphones, ArrowRight, Sparkles } from "lucide-react";

const benefits = [
  { icon: Home, title: "List your property", description: "Create a stunning listing with photos, amenities, and pricing in minutes." },
  { icon: DollarSign, title: "Earn premium income", description: "Set your rates and earn more than traditional renting with our 80/20 split." },
  { icon: Headphones, title: "We handle everything", description: "Guest screening, payments, support, and marketing — we've got you covered." },
];

export default function HostCTA() {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-[0.02]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div variants={fadeInUp}>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-primary/10 rounded-full text-sm font-medium text-primary mb-8">
              <Sparkles size={14} className="text-secondary" />
              For Property Owners
            </span>
            <h2 className="text-3xl lg:text-5xl font-display font-semibold text-ink leading-tight tracking-tight">
              Turn your property into a <span className="gradient-text">premium income stream</span>
            </h2>
            <p className="mt-6 text-lg text-charcoal leading-relaxed max-w-lg">
              Join hundreds of property owners who are earning premium income through Heavenward. We handle marketing, bookings, and guest support so you can focus on what matters.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/host">
                <Button size="lg" icon={<ArrowRight size={18} />} iconPosition="right">
                  Start hosting
                </Button>
              </Link>
              <Link href="/propose-destination">
                <Button variant="outline" size="lg">
                  Propose a destination
                </Button>
              </Link>
            </div>
          </motion.div>
          
          <motion.div variants={fadeInUp} className="grid grid-cols-1 gap-5">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="flex items-start gap-6 p-7 bg-white rounded-2xl shadow-sm border border-border/60 glow-on-hover group">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shrink-0 shadow-md group-hover:shadow-lg transition-shadow duration-300">
                  <benefit.icon size={28} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-ink group-hover:text-primary transition-colors duration-300">{benefit.title}</h3>
                  <p className="mt-2 text-sm text-charcoal leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
