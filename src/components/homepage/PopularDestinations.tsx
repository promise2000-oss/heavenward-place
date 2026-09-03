"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { cities } from "@/data";
import { MapPin } from "lucide-react";

export default function PopularDestinations() {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] gradient-mesh rounded-full blur-3xl opacity-40" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-primary/10 rounded-full text-sm font-medium text-primary mb-6">
              <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse-glow" />
              Destinations
            </span>
            <h2 className="text-3xl lg:text-5xl font-display font-semibold text-ink tracking-tight">Popular Destinations</h2>
            <p className="mt-4 text-lg text-charcoal max-w-xl mx-auto">Explore our most sought-after locations across Africa</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {cities.map((city) => (
              <motion.div key={city.id} variants={fadeInUp}>
                <Link href={`/search?city=${city.slug}`} className="group relative block h-80 rounded-2xl overflow-hidden premium-card">
                  <Image src={city.image} alt={city.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out-expo" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="flex items-center gap-2 text-white/80 mb-3">
                      <MapPin size={16} className="text-secondary" />
                      <span className="text-sm font-medium">{city.country}</span>
                    </div>
                    <h3 className="text-2xl font-display font-semibold text-white">{city.name}</h3>
                    <p className="mt-2 text-sm text-white/80">{city.propertyCount} premium properties</p>
                    <div className="mt-4 w-0 group-hover:w-12 h-0.5 bg-gradient-to-r from-secondary to-secondary-light transition-all duration-500" />
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
