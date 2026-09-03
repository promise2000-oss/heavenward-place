"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import Button from "@/components/ui/Button";
import { Send, ArrowRight } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="relative py-24 lg:py-40 overflow-hidden">
      <div className="absolute inset-0 gradient-premium" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] orb orb-teal opacity-20" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] orb orb-gold opacity-15" />
      <div className="absolute inset-0 dot-pattern opacity-[0.03]" />
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-secondary/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
          <motion.div variants={fadeInUp}>
            <h2 className="text-4xl lg:text-6xl font-display font-bold text-white leading-tight tracking-tight">
              Ready to find your{" "}
              <span className="bg-gradient-to-r from-secondary-light to-secondary bg-clip-text text-transparent">perfect stay</span>?
            </h2>
          </motion.div>
          
          <motion.p variants={fadeInUp} className="mt-10 text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            Whether you&apos;re visiting for business, planning a getaway, or looking to invest — Heavenward has the perfect property for you.
          </motion.p>
          
          <motion.div variants={fadeInUp} className="mt-14 flex flex-wrap items-center justify-center gap-6">
            <Link href="/search">
              <Button variant="secondary" size="lg" icon={<Send size={18} />}>
                Explore properties
              </Button>
            </Link>
            <Link href="/host">
              <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white hover:text-primary-dark" icon={<ArrowRight size={18} />} iconPosition="right">
                Become a host
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
