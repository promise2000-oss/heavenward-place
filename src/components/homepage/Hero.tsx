"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import SearchBar from "@/components/ui/SearchBar";

export default function Hero() {
  const router = useRouter();

  const handleSearch = (filters: { query: string; cityId: string; checkIn: string; checkOut: string; guests: number }) => {
    const params = new URLSearchParams();
    if (filters.query) params.set("q", filters.query);
    if (filters.cityId) params.set("city", filters.cityId);
    if (filters.checkIn) params.set("checkin", filters.checkIn);
    if (filters.checkOut) params.set("checkout", filters.checkOut);
    if (filters.guests) params.set("guests", filters.guests.toString());
    router.push(`/search?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Warm Gradient Background */}
      <div className="absolute inset-0 gradient-hero" />
      <div className="orb orb-teal w-[600px] h-[600px] -top-40 -right-40 animate-float opacity-40" />
      <div className="orb orb-gold w-[500px] h-[500px] -bottom-40 -left-40 animate-float-delayed opacity-35" />
      <div className="absolute inset-0 dot-pattern opacity-[0.025]" />
      
      {/* Elegant Top Line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-32">
        <div className="max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
            <span className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white/80 backdrop-blur-sm border border-primary/10 rounded-full text-sm font-semibold text-primary shadow-sm mb-8">
              <span className="w-2 h-2 bg-secondary rounded-full animate-pulse-glow" />
              Premium Short-Lets Across Africa
            </span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-semibold text-ink leading-[1.1] tracking-tight">
              Discover <span className="text-primary">premium stays</span> across Africa
            </h1>
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }} className="mt-8 text-lg lg:text-xl text-charcoal max-w-xl leading-relaxed">
            Curated luxury apartments and homes in Lagos and beyond. Find your perfect stay — whether for business, leisure, or investment.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }} className="mt-10 max-w-3xl">
            <div className="bg-white rounded-2xl p-2 shadow-lg border border-border/60">
              <SearchBar variant="hero" onSearch={handleSearch} />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.5 }} className="mt-10 flex flex-wrap items-center gap-3 text-sm">
            <span className="text-ink font-semibold">Popular:</span>
            {["Lekki", "Victoria Island", "Ikoyi", "Lagos"].map((tag) => (
              <button key={tag} onClick={() => handleSearch({ query: tag, cityId: "", checkIn: "", checkOut: "", guests: 2 })} className="px-4 py-2 bg-white border border-border rounded-full text-ink font-medium hover:border-primary/30 hover:shadow-md transition-all duration-300 cursor-pointer">
                {tag}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Floating Stats — Desktop */}
        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }} className="hidden xl:block absolute right-8 top-1/2 -translate-y-1/2 space-y-4">
          {[{ label: "Properties", value: "150+", delay: 0.7 }, { label: "Happy Guests", value: "10K+", delay: 0.8 }, { label: "Rating", value: "4.8★", delay: 0.9 }].map((stat) => (
            <motion.div key={stat.label} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: stat.delay, ease: [0.16, 1, 0.3, 1] }} className="bg-white rounded-2xl p-5 w-44 text-center shadow-lg border border-border/60 glow-on-hover">
              <p className="text-2xl font-display font-bold text-primary">{stat.value}</p>
              <p className="text-xs text-charcoal font-medium mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
