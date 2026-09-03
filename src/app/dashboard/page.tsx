"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, MapPin, Star, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { bookings } from "@/data";
import { formatPrice, formatDate } from "@/lib/format";
import PageHeader from "@/components/layout/PageHeader";

const tabs = ["All", "Upcoming", "Completed", "Cancelled"];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("All");

  const filtered = activeTab === "All" ? bookings : bookings.filter((b) => b.status === activeTab.toLowerCase());

  return (
    <div className="min-h-screen bg-surface">
      <PageHeader title="My Trips" subtitle="Manage your bookings and upcoming stays" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={cn("px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors cursor-pointer", activeTab === tab ? "bg-primary text-white" : "bg-white text-charcoal border border-border hover:border-primary/30")}>
              {tab}
            </button>
          ))}
        </div>

        {/* Bookings */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-border">
              <p className="text-lg font-semibold text-ink mb-2">No bookings found</p>
              <p className="text-charcoal mb-6">Start exploring our premium properties</p>
              <Link href="/search" className="inline-flex px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-light transition-colors">Browse properties</Link>
            </div>
          ) : (
            filtered.map((booking) => (
              <Link key={booking.id} href={`/property/${booking.property.slug}`} className="block bg-white rounded-2xl border border-border p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-5">
                  <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-surface">
                    <img src={booking.property.images[0]?.url} alt={booking.property.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-ink line-clamp-1">{booking.property.title}</h3>
                        <div className="flex items-center gap-1 mt-1 text-sm text-charcoal"><MapPin size={14} /><span>{booking.property.location.neighborhood}</span></div>
                      </div>
                      <span className={cn("px-3 py-1 rounded-full text-xs font-semibold shrink-0", booking.status === "confirmed" ? "bg-success/10 text-success" : booking.status === "completed" ? "bg-surface text-charcoal" : booking.status === "cancelled" ? "bg-error/10 text-error" : "bg-warning/10 text-warning")}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-sm text-charcoal">
                      <div className="flex items-center gap-1"><Calendar size={14} /><span>{formatDate(booking.checkIn)} — {formatDate(booking.checkOut)}</span></div>
                      <span>·</span>
                      <span>{booking.guests} guests</span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-semibold text-ink">{formatPrice(booking.totalPrice)}</span>
                      <span className="text-xs text-charcoal font-mono">{booking.confirmationCode}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
