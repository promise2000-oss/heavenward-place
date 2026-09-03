"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-3 mb-10">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center"><span className="text-white font-display font-bold text-lg">H</span></div>
            <span className="font-display font-semibold text-xl text-ink">Heavenward</span>
          </Link>
          <h1 className="text-3xl font-display font-semibold text-ink mb-2">Create an account</h1>
          <p className="text-charcoal mb-8">Join thousands of guests and hosts on Heavenward</p>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="First name" placeholder="First name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
              <Input label="Last name" placeholder="Last name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
            </div>
            <Input label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <div className="relative">
              <Input label="Password" type={showPassword ? "text" : "password"} placeholder="Create a password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-charcoal hover:text-ink cursor-pointer">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
            </div>
            <Button fullWidth size="lg">Sign up</Button>
          </div>
          <p className="text-center text-sm text-charcoal mt-6">Already have an account? <Link href="/auth/login" className="text-primary hover:text-primary-light font-semibold">Log in</Link></p>
        </div>
      </div>
      <div className="hidden lg:flex w-[45%] relative overflow-hidden">
        <div className="absolute inset-0 gradient-premium" />
        <div className="absolute inset-0 dot-pattern opacity-[0.05]" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-center text-white relative z-10">
            <div className="w-16 h-16 glass-dark rounded-2xl flex items-center justify-center mx-auto mb-6"><span className="text-3xl font-display font-bold text-white">H</span></div>
            <h2 className="text-3xl font-display font-semibold mb-4">Start Your Journey</h2>
            <p className="text-white/80 text-lg max-w-sm">Explore luxury stays, earn premium income, or invest in real estate.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
