"use client";

import { Star, Quote } from "lucide-react";
import type { Review } from "@/types";
import { formatDate } from "@/lib/format";

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-border p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-1 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={16} className={i < review.rating ? "fill-secondary text-secondary" : "text-border"} />
        ))}
      </div>
      <p className="text-ink leading-relaxed">{review.text}</p>
      <div className="mt-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-light/60 flex items-center justify-center">
          <span className="text-sm font-semibold text-white">
            {review.guest.firstName[0]}{review.guest.lastName[0]}
          </span>
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">{review.guest.firstName} {review.guest.lastName}</p>
          <p className="text-xs text-charcoal">{formatDate(review.date)}</p>
        </div>
      </div>
      {review.response && (
        <div className="mt-4 pt-4 border-t border-border bg-surface rounded-xl p-4">
          <p className="text-xs font-semibold text-ink mb-1">Host response</p>
          <p className="text-sm text-charcoal leading-relaxed">{review.response}</p>
        </div>
      )}
    </div>
  );
}
