"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex">
      {/* Left form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-3 mb-10">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center"><span className="text-white font-display font-bold text-lg">H</span></div>
            <span className="font-display font-semibold text-xl text-ink">Heavenward</span>
          </Link>
          <h1 className="text-3xl font-display font-semibold text-ink mb-2">Welcome back</h1>
          <p className="text-charcoal mb-8">Sign in to your account to continue</p>
          <div className="space-y-4">
            <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            <div className="relative">
              <Input label="Password" type={showPassword ? "text" : "password"} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-charcoal hover:text-ink cursor-pointer">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-charcoal"><input type="checkbox" className="w-4 h-4 accent-primary rounded" />Remember me</label>
              <a href="#" className="text-primary hover:text-primary-light font-medium">Forgot password?</a>
            </div>
            <Button fullWidth size="lg">Log in</Button>
          </div>
          <p className="text-center text-sm text-charcoal mt-6">Don&apos;t have an account? <Link href="/auth/signup" className="text-primary hover:text-primary-light font-semibold">Sign up</Link></p>
        </div>
      </div>
      {/* Right branding */}
      <div className="hidden lg:flex w-[45%] relative overflow-hidden">
        <div className="absolute inset-0 gradient-premium" />
        <div className="absolute inset-0 dot-pattern opacity-[0.05]" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-center text-white relative z-10">
            <div className="w-16 h-16 glass-dark rounded-2xl flex items-center justify-center mx-auto mb-6"><span className="text-3xl font-display font-bold text-white">H</span></div>
            <h2 className="text-3xl font-display font-semibold mb-4">Discover Premium Stays</h2>
            <p className="text-white/80 text-lg max-w-sm">Access curated luxury apartments across Lagos and beyond.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
