"use client";

import { useState } from "react";
import { Search, Calendar, Users, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { cities } from "@/data";

interface SearchBarProps {
  variant?: "hero" | "compact" | "navbar";
  onSearch?: (filters: { query: string; cityId: string; checkIn: string; checkOut: string; guests: number }) => void;
  className?: string;
  initialFilters?: { query?: string; cityId?: string; checkIn?: string; checkOut?: string; guests?: number };
}

export default function SearchBar({ variant = "hero", onSearch, className, initialFilters }: SearchBarProps) {
  const [query, setQuery] = useState(initialFilters?.query || "");
  const [cityId, setCityId] = useState(initialFilters?.cityId || "");
  const [checkIn, setCheckIn] = useState(initialFilters?.checkIn || "");
  const [checkOut, setCheckOut] = useState(initialFilters?.checkOut || "");
  const [guests, setGuests] = useState(initialFilters?.guests || 2);

  const handleSearch = () => {
    onSearch?.({ query, cityId, checkIn, checkOut, guests });
  };

  if (variant === "navbar") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className="flex items-center gap-2 bg-surface border border-border rounded-full px-4 py-2 text-sm">
          <Search size={16} className="text-charcoal" />
          <input type="text" placeholder="Search destinations..." value={query} onChange={(e) => setQuery(e.target.value)} className="bg-transparent outline-none text-ink placeholder:text-charcoal/50 w-32 lg:w-48" />
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={cn("flex items-center gap-2 bg-white border border-border rounded-xl p-2 shadow-sm", className)}>
        <input type="text" placeholder="Where to?" value={query} onChange={(e) => setQuery(e.target.value)} className="flex-1 px-3 py-2 text-sm outline-none text-ink placeholder:text-charcoal/50" />
        <button onClick={handleSearch} className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-light transition-colors cursor-pointer">
          Search
        </button>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col md:flex-row items-stretch md:items-center gap-3 p-3", className)}>
      <div className="flex-1 min-w-0">
        <label className="text-xs font-semibold text-charcoal uppercase tracking-wider mb-1 block">Location</label>
        <div className="flex items-center gap-2">
          <Search size={18} className="text-charcoal shrink-0" />
          <input type="text" placeholder="Lagos, Nigeria" value={query} onChange={(e) => setQuery(e.target.value)} className="w-full text-sm text-ink placeholder:text-charcoal/50 outline-none" />
        </div>
      </div>
      <div className="hidden md:block w-px h-10 bg-border" />
      <div className="flex-1 min-w-0">
        <label className="text-xs font-semibold text-charcoal uppercase tracking-wider mb-1 block">Check in</label>
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-charcoal shrink-0" />
          <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full text-sm text-ink outline-none" />
        </div>
      </div>
      <div className="hidden md:block w-px h-10 bg-border" />
      <div className="flex-1 min-w-0">
        <label className="text-xs font-semibold text-charcoal uppercase tracking-wider mb-1 block">Check out</label>
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-charcoal shrink-0" />
          <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full text-sm text-ink outline-none" />
        </div>
      </div>
      <div className="hidden md:block w-px h-10 bg-border" />
      <div className="min-w-[120px]">
        <label className="text-xs font-semibold text-charcoal uppercase tracking-wider mb-1 block">Guests</label>
        <div className="flex items-center gap-2">
          <Users size={18} className="text-charcoal shrink-0" />
          <input type="number" min={1} max={20} value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="w-full text-sm text-ink outline-none" />
        </div>
      </div>
      <button onClick={handleSearch} className="mt-2 md:mt-0 md:ml-2 px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-light transition-colors shadow-md hover:shadow-lg cursor-pointer shrink-0">
        Search
      </button>
    </div>
  );
}
