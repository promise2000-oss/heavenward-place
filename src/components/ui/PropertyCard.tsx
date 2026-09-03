"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";
import { Heart, Star, MapPin, Users } from "lucide-react";
import { useState } from "react";
import type { Property } from "@/types";

interface PropertyCardProps {
  property: Property;
  className?: string;
  variant?: "default" | "horizontal" | "compact";
}

export default function PropertyCard({ property, className, variant = "default" }: PropertyCardProps) {
  const [isSaved, setIsSaved] = useState(false);

  if (variant === "horizontal") {
    return (
      <Link href={`/property/${property.slug}`} className={cn("group flex flex-col sm:flex-row bg-white rounded-2xl overflow-hidden premium-card shadow-sm", className)}>
        <div className="relative w-full sm:w-72 h-52 sm:h-auto overflow-hidden">
          <Image src={property.images[0]?.url || "/images/properties/1/cover.jpg"} alt={property.images[0]?.alt || property.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out-expo" sizes="(max-width: 640px) 100vw, 288px" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          {property.isNew && <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold gradient-animated text-white rounded-full shadow-lg">New</span>}
        </div>
        <div className="flex-1 p-5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-ink line-clamp-1 group-hover:text-primary transition-colors duration-300">{property.title}</h3>
            <button onClick={(e) => { e.preventDefault(); setIsSaved(!isSaved); }} className="p-1.5 shrink-0 rounded-full hover:bg-error/10 transition-colors cursor-pointer" aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}>
              <Heart size={16} className={cn("transition-all duration-300", isSaved ? "fill-error text-error scale-110" : "text-charcoal hover:text-error")} />
            </button>
          </div>
          <div className="flex items-center gap-1 mt-1.5 text-sm text-charcoal">
            <MapPin size={14} className="text-primary/60" />
            <span>{property.location.neighborhood}</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Star size={14} className="fill-secondary text-secondary" />
            <span className="text-sm font-semibold">{property.ratings.average}</span>
            <span className="text-sm text-charcoal">({property.ratings.count})</span>
          </div>
          <p className="mt-2 text-sm text-charcoal line-clamp-2 leading-relaxed">{property.shortDescription}</p>
          <div className="mt-4 pt-3 border-t border-border/60">
            <span className="text-xl font-bold text-primary">{formatPrice(property.pricing.nightlyRate, property.pricing.currency)}</span>
            <span className="text-sm text-charcoal ml-1">/ night</span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link href={`/property/${property.slug}`} className={cn("group flex items-center gap-4 p-3 rounded-xl hover:bg-primary-lighter/30 transition-all duration-300", className)}>
        <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 ring-2 ring-white shadow-md">
          <Image src={property.images[0]?.url || "/images/properties/1/cover.jpg"} alt={property.images[0]?.alt || property.title} fill className="object-cover" sizes="64px" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-medium text-sm text-ink line-clamp-1 group-hover:text-primary transition-colors">{property.title}</h4>
          <div className="flex items-center gap-1 mt-0.5">
            <Star size={12} className="fill-secondary text-secondary" />
            <span className="text-xs font-semibold">{property.ratings.average}</span>
            <span className="text-xs text-charcoal">· {property.location.neighborhood}</span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="font-bold text-sm text-primary">{formatPrice(property.pricing.nightlyRate, property.pricing.currency)}</p>
          <p className="text-xs text-charcoal">/ night</p>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/property/${property.slug}`} className={cn("group block bg-white rounded-2xl overflow-hidden premium-card shadow-sm", className)}>
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image src={property.images[0]?.url || "/images/properties/1/cover.jpg"} alt={property.images[0]?.alt || property.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out-expo" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <button onClick={(e) => { e.preventDefault(); setIsSaved(!isSaved); }} className="absolute top-3 right-3 w-9 h-9 glass rounded-full flex items-center justify-center hover:bg-white/90 transition-all duration-300 cursor-pointer z-10" aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}>
          <Heart size={16} className={cn("transition-all duration-300", isSaved ? "fill-error text-error scale-110" : "text-ink")} />
        </button>
        {property.isNew && <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold gradient-animated text-white rounded-full shadow-lg z-10">New</span>}
        {property.isFeatured && !property.isNew && <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold bg-secondary/90 text-white rounded-full shadow-lg z-10">Featured</span>}
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold text-ink line-clamp-1 group-hover:text-primary transition-colors duration-300">{property.title}</h3>
          <div className="flex items-center gap-1 shrink-0">
            <Star size={14} className="fill-secondary text-secondary" />
            <span className="text-sm font-bold">{property.ratings.average}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 mt-1.5 text-sm text-charcoal">
          <MapPin size={14} className="text-primary/60" />
          <span>{property.location.neighborhood}</span>
        </div>
        <div className="flex items-center gap-3 mt-3 text-sm text-charcoal">
          <span>{property.capacity.bedrooms} bed</span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span>{property.capacity.bathrooms} bath</span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span>{property.capacity.guests} guests</span>
        </div>
        <div className="mt-4 pt-3 border-t border-border/60 flex items-baseline gap-1">
          <span className="text-xl font-bold text-primary">{formatPrice(property.pricing.nightlyRate, property.pricing.currency)}</span>
          <span className="text-sm text-charcoal">/ night</span>
        </div>
      </div>
    </Link>
  );
}
