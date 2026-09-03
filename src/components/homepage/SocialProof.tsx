"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { testimonials } from "@/data";
import { Star, Quote } from "lucide-react";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true;
        const duration = 2000;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) { setCount(target); clearInterval(timer); }
          else { setCount(Math.floor(current)); }
        }, duration / steps);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

const counterStats = [
  { value: 10000, suffix: "+", label: "Guests Served" },
  { value: 150, suffix: "+", label: "Properties" },
  { value: 4.8, suffix: "", label: "Average Rating" },
  { value: 15, suffix: "+", label: "Cities" },
];

export default function SocialProof() {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] gradient-mesh rounded-full blur-3xl opacity-30" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {counterStats.map((stat) => (
              <div key={stat.label} className="text-center p-8 glass-card rounded-2xl glow-on-hover">
                <p className="text-4xl lg:text-5xl font-display font-bold text-primary"><AnimatedCounter target={stat.value} suffix={stat.suffix} /></p>
                <p className="mt-3 text-sm text-charcoal font-medium">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          <motion.div variants={fadeInUp} className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full text-sm font-medium text-primary mb-6">Testimonials</span>
            <h2 className="text-3xl lg:text-5xl font-display font-semibold text-ink tracking-tight">What Our Guests Say</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <motion.div key={testimonial.id} variants={fadeInUp} className="relative p-7 glass-card rounded-2xl glow-on-hover group">
                <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity"><Quote size={48} className="text-primary" /></div>
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={16} className={i < testimonial.rating ? "fill-secondary text-secondary" : "text-border"} />
                  ))}
                </div>
                <p className="text-ink leading-relaxed relative z-10">{testimonial.text}</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-neon-teal/60 flex items-center justify-center ring-2 ring-white shadow-md">
                    <span className="text-sm font-semibold text-white">{testimonial.name.split(" ").map((n) => n[0]).join("")}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink">{testimonial.name}</p>
                    <p className="text-xs text-charcoal">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
