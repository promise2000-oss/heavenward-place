"use client";

import { useState } from "react";
import { Calendar, Users, Star, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice, nightsBetween } from "@/lib/format";
import type { Property } from "@/types";

interface BookingWidgetProps {
  property: Property;
  onBook?: (data: { checkIn: string; checkOut: string; guests: number }) => void;
}

export default function BookingWidget({ property, onBook }: BookingWidgetProps) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);

  const nights = checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0;
  const subtotal = nights * property.pricing.nightlyRate;
  const serviceFee = Math.round(subtotal * property.pricing.serviceFeeRate);
  const total = subtotal + serviceFee + (property.pricing.cautionFee || 0);

  const handleBook = () => {
    if (!checkIn || !checkOut) return;
    onBook?.({ checkIn, checkOut, guests });
  };

  return (
    <div className="bg-white rounded-2xl border border-border shadow-lg p-6 sticky top-24">
      <div className="flex items-baseline gap-2 mb-6">
        <span className="text-2xl font-bold text-primary">{formatPrice(property.pricing.nightlyRate, property.pricing.currency)}</span>
        <span className="text-charcoal">/ night</span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="border border-border rounded-xl p-3">
            <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block mb-1">Check-in</label>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-charcoal" />
              <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="text-sm text-ink outline-none w-full" />
            </div>
          </div>
          <div className="border border-border rounded-xl p-3">
            <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block mb-1">Check-out</label>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-charcoal" />
              <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="text-sm text-ink outline-none w-full" />
            </div>
          </div>
        </div>
        <div className="border border-border rounded-xl p-3">
          <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block mb-1">Guests</label>
          <div className="flex items-center gap-2">
            <Users size={16} className="text-charcoal" />
            <select value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="text-sm text-ink outline-none w-full bg-transparent">
              {Array.from({ length: property.capacity.guests }, (_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1} guest{i > 0 ? "s" : ""}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <button onClick={handleBook} disabled={!checkIn || !checkOut} className="w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md cursor-pointer">
        Reserve
      </button>

      <p className="text-center text-sm text-charcoal mt-3">You won&apos;t be charged yet</p>

      {nights > 0 && (
        <div className="mt-6 pt-6 border-t border-border space-y-3">
          <div className="flex justify-between text-sm text-charcoal">
            <span>{formatPrice(property.pricing.nightlyRate, property.pricing.currency)} x {nights} nights</span>
            <span>{formatPrice(subtotal, property.pricing.currency)}</span>
          </div>
          <div className="flex justify-between text-sm text-charcoal">
            <span>Service fee ({Math.round(property.pricing.serviceFeeRate * 100)}%)</span>
            <span>{formatPrice(serviceFee, property.pricing.currency)}</span>
          </div>
          {property.pricing.cautionFee && (
            <div className="flex justify-between text-sm text-charcoal">
              <span>Caution fee</span>
              <span>{formatPrice(property.pricing.cautionFee, property.pricing.currency)}</span>
            </div>
          )}
          <div className="flex justify-between font-semibold text-ink pt-3 border-t border-border">
            <span>Total</span>
            <span>{formatPrice(total, property.pricing.currency)}</span>
          </div>
        </div>
      )}

      <div className="mt-6 flex items-center gap-2 text-xs text-charcoal">
        <Shield size={14} className="text-success" />
        <span>Free cancellation up to 48 hours before check-in</span>
      </div>
    </div>
  );
}
