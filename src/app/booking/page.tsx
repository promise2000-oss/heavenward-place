"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Check, User, CreditCard, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice, nightsBetween, generateConfirmationCode } from "@/lib/format";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { properties } from "@/data";

function BookingFlow() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("property") || "luxury-two-bedroom-maisonette-apartment";
  const property = properties.find((p) => p.slug === slug) || properties[0];

  const [step, setStep] = useState(1);
  const [checkIn, setCheckIn] = useState(searchParams.get("checkin") || "");
  const [checkOut, setCheckOut] = useState(searchParams.get("checkout") || "");
  const [guests, setGuests] = useState(Number(searchParams.get("guests")) || 2);
  const [guestDetails, setGuestDetails] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [confirmationCode] = useState(generateConfirmationCode());

  const nights = checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 1;
  const subtotal = nights * property.pricing.nightlyRate;
  const serviceFee = Math.round(subtotal * property.pricing.serviceFeeRate);
  const total = subtotal + serviceFee + (property.pricing.cautionFee || 0);

  const steps = [
    { id: 1, label: "Review", icon: Calendar },
    { id: 2, label: "Guest Details", icon: User },
    { id: 3, label: "Payment", icon: CreditCard },
    { id: 4, label: "Confirmation", icon: Check },
  ];

  return (
    <div className="min-h-screen bg-surface pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors", step >= s.id ? "bg-primary text-white" : "bg-white text-charcoal border border-border")}>
                {step > s.id ? <Check size={18} /> : s.id}
              </div>
              <span className={cn("text-sm font-medium hidden sm:inline", step >= s.id ? "text-ink" : "text-charcoal")}>{s.label}</span>
              {i < steps.length - 1 && <div className={cn("w-12 h-0.5 mx-2", step > s.id ? "bg-primary" : "bg-border")} />}
            </div>
          ))}
        </div>

        {/* Step 1: Review */}
        {step === 1 && (
          <div className="bg-white rounded-2xl border border-border p-6 lg:p-8">
            <h2 className="text-2xl font-display font-semibold text-ink mb-6">Review your trip</h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-xs font-semibold text-charcoal uppercase tracking-wider mb-1 block">Check-in</label>
                <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-border text-sm text-ink outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="text-xs font-semibold text-charcoal uppercase tracking-wider mb-1 block">Check-out</label>
                <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-border text-sm text-ink outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>
            <div className="p-4 bg-surface rounded-xl mb-6">
              <p className="text-sm text-charcoal">Selected property</p>
              <p className="font-semibold text-ink">{property.title}</p>
              <p className="text-sm text-charcoal mt-1">{property.location.neighborhood}, Lagos</p>
            </div>
            {checkIn && checkOut && (
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between text-charcoal"><span>{formatPrice(property.pricing.nightlyRate)} x {nights} nights</span><span>{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between text-charcoal"><span>Service fee</span><span>{formatPrice(serviceFee)}</span></div>
                {property.pricing.cautionFee && <div className="flex justify-between text-charcoal"><span>Caution fee</span><span>{formatPrice(property.pricing.cautionFee)}</span></div>}
                <div className="flex justify-between font-semibold text-ink pt-3 border-t border-border"><span>Total</span><span>{formatPrice(total)}</span></div>
              </div>
            )}
            <Button fullWidth onClick={() => setStep(2)} disabled={!checkIn || !checkOut}>Continue to guest details</Button>
          </div>
        )}

        {/* Step 2: Guest Details */}
        {step === 2 && (
          <div className="bg-white rounded-2xl border border-border p-6 lg:p-8">
            <h2 className="text-2xl font-display font-semibold text-ink mb-6">Guest details</h2>
            <div className="space-y-4 mb-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="First name" value={guestDetails.firstName} onChange={(e) => setGuestDetails({ ...guestDetails, firstName: e.target.value })} placeholder="Enter first name" />
                <Input label="Last name" value={guestDetails.lastName} onChange={(e) => setGuestDetails({ ...guestDetails, lastName: e.target.value })} placeholder="Enter last name" />
              </div>
              <Input label="Email" type="email" value={guestDetails.email} onChange={(e) => setGuestDetails({ ...guestDetails, email: e.target.value })} placeholder="you@example.com" />
              <Input label="Phone" type="tel" value={guestDetails.phone} onChange={(e) => setGuestDetails({ ...guestDetails, phone: e.target.value })} placeholder="+234 801 234 5678" />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button fullWidth onClick={() => setStep(3)} disabled={!guestDetails.firstName || !guestDetails.email}>Continue to payment</Button>
            </div>
          </div>
        )}

        {/* Step 3: Payment */}
        {step === 3 && (
          <div className="bg-white rounded-2xl border border-border p-6 lg:p-8">
            <h2 className="text-2xl font-display font-semibold text-ink mb-6">Payment</h2>
            <div className="space-y-4 mb-6">
              <Input label="Card number" placeholder="4242 4242 4242 4242" />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Expiry" placeholder="MM/YY" />
                <Input label="CVC" placeholder="123" />
              </div>
              <Input label="Name on card" placeholder="Enter cardholder name" />
            </div>
            <div className="p-4 bg-surface rounded-xl mb-6">
              <div className="flex justify-between text-sm"><span className="text-charcoal">Total to pay</span><span className="font-semibold text-ink">{formatPrice(total)}</span></div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
              <Button fullWidth onClick={() => setStep(4)}>Pay {formatPrice(total)}</Button>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && (
          <div className="bg-white rounded-2xl border border-border p-6 lg:p-8 text-center max-w-lg mx-auto">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6"><Check size={32} className="text-success" /></div>
            <h2 className="text-2xl font-display font-semibold text-ink mb-2">Booking Confirmed!</h2>
            <p className="text-charcoal mb-6">Your reservation at {property.title} has been confirmed.</p>
            <div className="p-4 bg-surface rounded-xl mb-6">
              <p className="text-sm text-charcoal">Confirmation code</p>
              <p className="text-xl font-bold font-mono text-primary">{confirmationCode}</p>
            </div>
            <div className="space-y-3 text-sm text-left mb-6">
              <div className="flex justify-between"><span className="text-charcoal">Check-in</span><span className="text-ink">{checkIn}</span></div>
              <div className="flex justify-between"><span className="text-charcoal">Check-out</span><span className="text-ink">{checkOut}</span></div>
              <div className="flex justify-between"><span className="text-charcoal">Guests</span><span className="text-ink">{guests}</span></div>
              <div className="flex justify-between font-semibold pt-3 border-t border-border"><span>Total paid</span><span>{formatPrice(total)}</span></div>
            </div>
            <div className="flex flex-col gap-3">
              <Link href="/dashboard"><Button fullWidth>View my trips</Button></Link>
              <Link href="/"><Button variant="outline" fullWidth>Back to home</Button></Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BookingPage() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}><BookingFlow /></Suspense>;
}
