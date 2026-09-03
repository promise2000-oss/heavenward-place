"use client";

import { motion } from "framer-motion";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { MapPin, Clock, Briefcase } from "lucide-react";

const positions = [
  { title: "Senior Frontend Engineer", location: "Lagos, Nigeria", type: "Full-time", department: "Engineering" },
  { title: "Product Designer", location: "Lagos, Nigeria", type: "Full-time", department: "Design" },
  { title: "Growth Marketing Manager", location: "Remote", type: "Full-time", department: "Marketing" },
  { title: "Guest Experience Lead", location: "Lagos, Nigeria", type: "Full-time", department: "Operations" },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-white">
      <PageHeader title="Careers" subtitle="Join us in redefining premium hospitality across Africa" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-surface rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-display font-semibold text-ink mb-4">Why Heavenward?</h2>
          <p className="text-charcoal leading-relaxed mb-6">We&apos;re building the future of premium hospitality in Africa. Join a team that values excellence, innovation, and impact. We offer competitive compensation, flexible work arrangements, and the opportunity to shape an industry.</p>
          <div className="grid sm:grid-cols-3 gap-4">
            {["Competitive Salary", "Remote-Friendly", "Growth Opportunities"].map((perk) => (
              <div key={perk} className="bg-white rounded-xl p-4 text-center border border-border"><p className="font-semibold text-ink text-sm">{perk}</p></div>
            ))}
          </div>
        </div>

        <h2 className="text-2xl font-display font-semibold text-ink mb-6">Open Positions</h2>
        <div className="space-y-4">
          {positions.map((pos) => (
            <div key={pos.title} className="flex items-center justify-between p-5 bg-white border border-border rounded-2xl hover:shadow-md transition-shadow">
              <div>
                <h3 className="font-semibold text-ink">{pos.title}</h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-charcoal">
                  <span className="flex items-center gap-1"><MapPin size={14} />{pos.location}</span>
                  <span className="flex items-center gap-1"><Clock size={14} />{pos.type}</span>
                  <span className="flex items-center gap-1"><Briefcase size={14} />{pos.department}</span>
                </div>
              </div>
              <Button variant="outline" size="sm">Apply</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
