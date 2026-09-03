import PageHeader from "@/components/layout/PageHeader";
import { Shield, Heart, Globe, Users } from "lucide-react";

const values = [
  { icon: Shield, title: "Trust & Safety", description: "Every property is verified. Every host is vetted. Your safety is non-negotiable." },
  { icon: Heart, title: "Exceptional Hospitality", description: "We obsess over the details so you can focus on creating memories." },
  { icon: Globe, title: "African Excellence", description: "Showcasing the best of African hospitality to the world." },
  { icon: Users, title: "Community First", description: "Building bridges between guests, hosts, and local communities." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <PageHeader title="About Heavenward" subtitle="Redefining premium hospitality across Africa" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-charcoal leading-relaxed mb-8">
            Heavenward Place was founded with a singular vision: to make premium short-let accommodation accessible, reliable, and exceptional across Africa. We believe that luxury hospitality isn&apos;t just about beautiful spaces — it&apos;s about trust, consistency, and the confidence that every detail has been considered.
          </p>
          <p className="text-lg text-charcoal leading-relaxed mb-12">
            Based in Lagos, Nigeria, we curate the finest apartments, penthouses, and homes, ensuring each property meets our rigorous standards for quality, safety, and comfort. Whether you&apos;re a guest seeking the perfect stay or a host looking to maximize your property&apos;s potential, Heavenward delivers an experience that&apos;s unmistakably premium.
          </p>
        </div>

        <h2 className="text-3xl font-display font-semibold text-ink mb-8">Our Values</h2>
        <div className="grid sm:grid-cols-2 gap-6 mb-16">
          {values.map((value) => (
            <div key={value.title} className="p-6 bg-surface rounded-2xl">
              <value.icon size={28} className="text-primary mb-4" />
              <h3 className="font-semibold text-ink mb-2">{value.title}</h3>
              <p className="text-sm text-charcoal leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>

        <h2 className="text-3xl font-display font-semibold text-ink mb-8">Leadership</h2>
        <div className="bg-surface rounded-2xl p-8 flex items-start gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary-light/60 flex items-center justify-center shrink-0">
            <span className="text-2xl font-display font-bold text-white">PS</span>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-ink">Promise Shedrack</h3>
            <p className="text-primary font-medium mb-3">Founder & CEO</p>
            <p className="text-charcoal leading-relaxed">A visionary entrepreneur passionate about hospitality and real estate across Africa. Promise founded Heavenward to bridge the gap between premium accommodation and accessible luxury.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
