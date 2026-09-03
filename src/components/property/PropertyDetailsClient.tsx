"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, MapPin, Users, Bed, Bath, Heart, Share2, ChevronLeft, ChevronRight, Wifi, Snowflake, Tv, Shield, Car, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";
import BookingWidget from "@/components/ui/BookingWidget";
import ReviewCard from "@/components/ui/ReviewCard";
import PropertyCard from "@/components/ui/PropertyCard";
import { reviews, properties } from "@/data";
import type { Property } from "@/types";

interface PropertyDetailsClientProps {
  property: Property;
}

export default function PropertyDetailsClient({ property }: PropertyDetailsClientProps) {
  const router = useRouter();
  const [currentImage, setCurrentImage] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  const propertyReviews = reviews.filter((r) => r.propertyId === property.id);
  const similarProperties = properties.filter((p) => p.id !== property.id && p.type === property.type).slice(0, 3);

  const handleBook = (data: { checkIn: string; checkOut: string; guests: number }) => {
    const params = new URLSearchParams({ property: property.slug, checkin: data.checkIn, checkout: data.checkOut, guests: data.guests.toString() });
    router.push(`/booking?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-4">
        <nav className="flex items-center gap-2 text-sm text-charcoal">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/search" className="hover:text-primary transition-colors">Search</Link>
          <span>/</span>
          <span className="text-ink font-medium truncate">{property.title}</span>
        </nav>
      </div>

      {/* Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="relative rounded-2xl overflow-hidden aspect-[21/9] bg-surface">
          <Image src={property.images[currentImage]?.url || property.images[0]?.url} alt={property.images[currentImage]?.alt || property.title} fill className="object-cover" priority sizes="(max-width: 1280px) 100vw, 1280px" />
          {property.images.length > 1 && (
            <>
              <button onClick={() => setCurrentImage((c) => (c === 0 ? property.images.length - 1 : c - 1))} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-white/90 transition-colors cursor-pointer"><ChevronLeft size={20} /></button>
              <button onClick={() => setCurrentImage((c) => (c === property.images.length - 1 ? 0 : c + 1))} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-white/90 transition-colors cursor-pointer"><ChevronRight size={20} /></button>
            </>
          )}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {property.images.map((_, i) => (
              <button key={i} onClick={() => setCurrentImage(i)} className={cn("w-2 h-2 rounded-full transition-colors cursor-pointer", i === currentImage ? "bg-white" : "bg-white/50")} />
            ))}
          </div>
        </div>
        {/* Thumbnails */}
        {property.images.length > 1 && (
          <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
            {property.images.map((img, i) => (
              <button key={img.id} onClick={() => setCurrentImage(i)} className={cn("relative w-20 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-colors cursor-pointer", i === currentImage ? "border-primary" : "border-transparent")}>
                <Image src={img.url} alt={img.alt} fill className="object-cover" sizes="80px" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid lg:grid-cols-[1fr_380px] gap-12">
          {/* Main Content */}
          <div>
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {property.isLuxury && <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">Luxury</span>}
                  {property.isNew && <span className="px-2.5 py-1 gradient-animated text-white text-xs font-semibold rounded-full">New</span>}
                </div>
                <h1 className="text-2xl lg:text-3xl font-display font-semibold text-ink">{property.title}</h1>
                <div className="flex items-center gap-4 mt-2 text-sm text-charcoal">
                  <div className="flex items-center gap-1"><Star size={14} className="fill-secondary text-secondary" /><span className="font-semibold">{property.ratings.average}</span><span>({property.ratings.count} reviews)</span></div>
                  <div className="flex items-center gap-1"><MapPin size={14} className="text-primary/60" /><span>{property.location.neighborhood}, Lagos</span></div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => setIsSaved(!isSaved)} className="p-2.5 border border-border rounded-full hover:border-primary/30 transition-colors cursor-pointer"><Heart size={18} className={cn(isSaved && "fill-error text-error")} /></button>
                <button className="p-2.5 border border-border rounded-full hover:border-primary/30 transition-colors cursor-pointer"><Share2 size={18} /></button>
              </div>
            </div>

            {/* Key Info */}
            <div className="flex items-center gap-6 py-4 border-y border-border text-sm text-ink">
              <div className="flex items-center gap-2"><Users size={16} className="text-charcoal" /><span>{property.capacity.guests} guests</span></div>
              <div className="flex items-center gap-2"><Bed size={16} className="text-charcoal" /><span>{property.capacity.bedrooms} bedrooms</span></div>
              <div className="flex items-center gap-2"><Bath size={16} className="text-charcoal" /><span>{property.capacity.bathrooms} bathrooms</span></div>
            </div>

            {/* Host */}
            <div className="py-6 border-b border-border flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-light/60 flex items-center justify-center">
                <span className="text-sm font-semibold text-white">{property.host.firstName[0]}{property.host.lastName[0]}</span>
              </div>
              <div>
                <p className="font-semibold text-ink">Hosted by {property.host.firstName}</p>
                <p className="text-sm text-charcoal">Host since {property.host.hostSince} · {property.host.superhost ? "Superhost" : ""}</p>
              </div>
            </div>

            {/* Description */}
            <div className="py-6 border-b border-border">
              <p className="text-ink leading-relaxed whitespace-pre-line">{property.description}</p>
            </div>

            {/* Amenities */}
            <div className="py-6 border-b border-border">
              <h3 className="font-semibold text-ink mb-4">What this place offers</h3>
              <div className="grid grid-cols-2 gap-3">
                {property.amenities.map((amenity) => (
                  <div key={amenity.id} className="flex items-center gap-3 text-sm text-charcoal">
                    <Check size={16} className="text-primary shrink-0" />
                    <span>{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rules */}
            <div className="py-6 border-b border-border">
              <h3 className="font-semibold text-ink mb-4">House rules</h3>
              <ul className="space-y-2">
                {property.rules.map((rule, i) => (
                  <li key={i} className="text-sm text-charcoal flex items-start gap-2">
                    <span className="text-primary mt-0.5">·</span>
                    {rule}
                  </li>
                ))}
              </ul>
            </div>

            {/* Cancellation */}
            <div className="py-6 border-b border-border">
              <h3 className="font-semibold text-ink mb-2">Cancellation policy</h3>
              <p className="text-sm text-charcoal">{property.cancellationDescription}</p>
            </div>

            {/* Reviews */}
            <div className="py-6">
              <h3 className="font-semibold text-ink mb-4">Reviews</h3>
              {propertyReviews.length > 0 ? (
                <div className="space-y-4">
                  {propertyReviews.map((review) => <ReviewCard key={review.id} review={review} />)}
                </div>
              ) : (
                <p className="text-sm text-charcoal">No reviews yet.</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:block">
            <BookingWidget property={property} onBook={handleBook} />
          </div>
        </div>

        {/* Similar Properties */}
        {similarProperties.length > 0 && (
          <div className="mt-16 pt-12 border-t border-border">
            <h3 className="text-2xl font-display font-semibold text-ink mb-8">Similar properties</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarProperties.map((p) => <PropertyCard key={p.id} property={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
