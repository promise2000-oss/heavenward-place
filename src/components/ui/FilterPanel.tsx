"use client";

import { useState } from "react";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { categories, amenities } from "@/data";

interface FilterState {
  category: string;
  type: string;
  minPrice: number;
  maxPrice: number;
  bedrooms: number;
  guests: number;
  amenities: string[];
  sortBy: string;
}

interface FilterPanelProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onClose?: () => void;
  isDrawer?: boolean;
}

export default function FilterPanel({ filters, onChange, onClose, isDrawer }: FilterPanelProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onChange({ ...filters, [key]: value });
  };

  const toggleAmenity = (amenityId: string) => {
    const current = filters.amenities;
    updateFilter("amenities", current.includes(amenityId) ? current.filter((a) => a !== amenityId) : [...current, amenityId]);
  };

  const clearAll = () => {
    onChange({ category: "", type: "", minPrice: 0, maxPrice: 500000, bedrooms: 0, guests: 0, amenities: [], sortBy: "featured" });
  };

  const activeCount = [filters.category, filters.type, filters.bedrooms > 0, filters.guests > 0, filters.amenities.length > 0].filter(Boolean).length;

  return (
    <div className={cn("bg-white", isDrawer ? "p-6 h-full overflow-y-auto" : "rounded-2xl border border-border p-6")}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={18} className="text-ink" />
          <h3 className="font-semibold text-ink">Filters</h3>
          {activeCount > 0 && <span className="w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">{activeCount}</span>}
        </div>
        <div className="flex items-center gap-2">
          {activeCount > 0 && <button onClick={clearAll} className="text-sm text-primary hover:text-primary-light font-medium cursor-pointer">Clear all</button>}
          {isDrawer && onClose && <button onClick={onClose} className="p-1 text-charcoal hover:text-ink cursor-pointer"><X size={20} /></button>}
        </div>
      </div>

      {/* Category */}
      <div className="border-b border-border py-4">
        <button onClick={() => toggleSection("category")} className="flex items-center justify-between w-full text-left cursor-pointer">
          <span className="font-medium text-ink">Category</span>
          <ChevronDown size={18} className={cn("text-charcoal transition-transform", expandedSection === "category" && "rotate-180")} />
        </button>
        {expandedSection === "category" && (
          <div className="mt-3 space-y-2">
            {categories.map((cat) => (
              <label key={cat.id} className="flex items-center gap-2 text-sm text-charcoal hover:text-ink cursor-pointer">
                <input type="radio" name="category" checked={filters.category === cat.slug} onChange={() => updateFilter("category", filters.category === cat.slug ? "" : cat.slug)} className="w-4 h-4 accent-primary" />
                {cat.name}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Bedrooms */}
      <div className="border-b border-border py-4">
        <button onClick={() => toggleSection("bedrooms")} className="flex items-center justify-between w-full text-left cursor-pointer">
          <span className="font-medium text-ink">Bedrooms</span>
          <ChevronDown size={18} className={cn("text-charcoal transition-transform", expandedSection === "bedrooms" && "rotate-180")} />
        </button>
        {expandedSection === "bedrooms" && (
          <div className="mt-3 flex gap-2">
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <button key={n} onClick={() => updateFilter("bedrooms", n)} className={cn("px-4 py-2 rounded-lg text-sm font-medium border transition-colors cursor-pointer", filters.bedrooms === n ? "bg-primary text-white border-primary" : "border-border text-charcoal hover:border-primary/30")}>
                {n === 0 ? "Any" : `${n}+`}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Guests */}
      <div className="border-b border-border py-4">
        <button onClick={() => toggleSection("guests")} className="flex items-center justify-between w-full text-left cursor-pointer">
          <span className="font-medium text-ink">Guests</span>
          <ChevronDown size={18} className={cn("text-charcoal transition-transform", expandedSection === "guests" && "rotate-180")} />
        </button>
        {expandedSection === "guests" && (
          <div className="mt-3 flex gap-2">
            {[0, 2, 4, 6, 8, 12].map((n) => (
              <button key={n} onClick={() => updateFilter("guests", n)} className={cn("px-4 py-2 rounded-lg text-sm font-medium border transition-colors cursor-pointer", filters.guests === n ? "bg-primary text-white border-primary" : "border-border text-charcoal hover:border-primary/30")}>
                {n === 0 ? "Any" : `${n}+`}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Amenities */}
      <div className="py-4">
        <button onClick={() => toggleSection("amenities")} className="flex items-center justify-between w-full text-left cursor-pointer">
          <span className="font-medium text-ink">Amenities</span>
          <ChevronDown size={18} className={cn("text-charcoal transition-transform", expandedSection === "amenities" && "rotate-180")} />
        </button>
        {expandedSection === "amenities" && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            {amenities.slice(0, 12).map((a) => (
              <label key={a.id} className="flex items-center gap-2 text-sm text-charcoal hover:text-ink cursor-pointer">
                <input type="checkbox" checked={filters.amenities.includes(a.id)} onChange={() => toggleAmenity(a.id)} className="w-4 h-4 accent-primary rounded" />
                {a.name}
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
