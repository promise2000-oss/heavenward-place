"use client";

import { useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SlidersHorizontal, X, Grid3X3, LayoutList } from "lucide-react";
import { cn } from "@/lib/utils";
import PropertyCard from "@/components/ui/PropertyCard";
import FilterPanel from "@/components/ui/FilterPanel";
import PageHeader from "@/components/layout/PageHeader";
import { properties } from "@/data";

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

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [filters, setFilters] = useState<FilterState>({
    category: searchParams.get("category") || "",
    type: "",
    minPrice: 0,
    maxPrice: 500000,
    bedrooms: 0,
    guests: 0,
    amenities: [],
    sortBy: "featured",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const query = searchParams.get("q") || "";

  const filtered = useMemo(() => {
    let result = [...properties];

    if (query) {
      const q = query.toLowerCase();
      result = result.filter((p) =>
        p.title.toLowerCase().includes(q) ||
        p.location.neighborhood.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    if (filters.category) {
      result = result.filter((p) => p.categories.some((c) => c.slug === filters.category));
    }
    if (filters.bedrooms > 0) {
      result = result.filter((p) => p.capacity.bedrooms >= filters.bedrooms);
    }
    if (filters.guests > 0) {
      result = result.filter((p) => p.capacity.guests >= filters.guests);
    }
    if (filters.amenities.length > 0) {
      result = result.filter((p) => filters.amenities.every((a) => p.amenities.some((pa) => pa.id === a)));
    }
    result = result.filter((p) => p.pricing.nightlyRate >= filters.minPrice && p.pricing.nightlyRate <= filters.maxPrice);

    switch (filters.sortBy) {
      case "price-low": result.sort((a, b) => a.pricing.nightlyRate - b.pricing.nightlyRate); break;
      case "price-high": result.sort((a, b) => b.pricing.nightlyRate - a.pricing.nightlyRate); break;
      case "rating": result.sort((a, b) => b.ratings.average - a.ratings.average); break;
      default: result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return result;
  }, [query, filters]);

  return (
    <div className="min-h-screen bg-white">
      <PageHeader title={query ? `Results for "${query}"` : "Search Properties"} subtitle={`Discover premium short-let properties in Lagos`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl text-sm font-medium text-ink hover:border-primary/30 transition-colors cursor-pointer">
              <SlidersHorizontal size={16} />
              Filters
            </button>
            <span className="text-sm text-charcoal">{filtered.length} properties</span>
          </div>
          <div className="flex items-center gap-3">
            <select value={filters.sortBy} onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })} className="px-3 py-2 border border-border rounded-xl text-sm text-ink bg-white cursor-pointer">
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
            <div className="hidden sm:flex items-center gap-1 border border-border rounded-xl p-1">
              <button onClick={() => setViewMode("grid")} className={cn("p-1.5 rounded-lg cursor-pointer", viewMode === "grid" ? "bg-surface" : "")}><Grid3X3 size={16} /></button>
              <button onClick={() => setViewMode("list")} className={cn("p-1.5 rounded-lg cursor-pointer", viewMode === "list" ? "bg-surface" : "")}><LayoutList size={16} /></button>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filter Sidebar */}
          <div className={cn("shrink-0", showFilters ? "block" : "hidden lg:block", "w-72")}>
            <FilterPanel filters={filters} onChange={setFilters} />
          </div>

          {/* Results */}
          <div className="flex-1 min-w-0">
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-lg font-semibold text-ink mb-2">No properties found</p>
                <p className="text-charcoal">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <div className={cn(viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4")}>
                {filtered.map((property) => (
                  <PropertyCard key={property.id} property={property} variant={viewMode === "list" ? "horizontal" : "default"} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
