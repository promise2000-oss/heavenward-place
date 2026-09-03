"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { categories } from "@/data";

export default function Categories() {
  return (
    <section className="py-24 lg:py-32 bg-surface relative overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-[0.02]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-primary/10 rounded-full text-sm font-medium text-primary mb-6">
              Browse
            </span>
            <h2 className="text-3xl lg:text-5xl font-display font-semibold text-ink tracking-tight">Browse by Category</h2>
            <p className="mt-4 text-lg text-charcoal max-w-xl mx-auto">Find the perfect stay for any occasion</p>
          </motion.div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {categories.map((category) => (
              <motion.div key={category.id} variants={fadeInUp}>
                <Link href={`/search?category=${category.slug}`} className="group block relative h-56 rounded-2xl overflow-hidden premium-card">
                  <Image src={category.image} alt={category.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out-expo" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:from-primary/80 transition-colors duration-500" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                    <p className="text-sm text-white/80 mt-1">{category.propertyCount} properties</p>
                    <div className="mt-3 w-0 group-hover:w-10 h-0.5 bg-gradient-to-r from-secondary to-secondary-light transition-all duration-500" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
