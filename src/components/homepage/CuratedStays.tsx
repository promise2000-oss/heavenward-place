"use client";

import { motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import PropertyCard from "@/components/ui/PropertyCard";
import { properties } from "@/data";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CuratedStays() {
  const featured = properties.filter((p) => p.isFeatured);

  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-[0.02]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8 mb-16">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-primary/10 rounded-full text-sm font-medium text-primary mb-6">
                <Sparkles size={14} className="text-secondary" />
                Hand-picked
              </span>
              <h2 className="text-3xl lg:text-5xl font-display font-semibold text-ink tracking-tight">Curated Stays</h2>
              <p className="mt-4 text-lg text-charcoal max-w-xl">Hand-picked properties for an exceptional experience</p>
            </div>
            <Link href="/search">
              <Button variant="outline" size="md" icon={<ArrowRight size={16} />} iconPosition="right">
                View all properties
              </Button>
            </Link>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {featured.slice(0, 6).map((property) => (
              <motion.div key={property.id} variants={fadeInUp}>
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
