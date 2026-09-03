"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, User, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import SearchBar from "@/components/ui/SearchBar";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-300", scrolled ? "glass-card shadow-sm" : "bg-transparent")}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-white font-display font-bold text-lg">H</span>
            </div>
            <span className="font-display font-semibold text-xl text-ink hidden sm:block">Heavenward</span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden lg:block flex-1 max-w-xl mx-8">
            <SearchBar variant="navbar" />
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-2">
            <Link href="/host" className="px-4 py-2 text-sm font-medium text-ink hover:text-primary transition-colors neon-line">List your property</Link>
            <Link href="/investment" className="px-4 py-2 text-sm font-medium text-ink hover:text-primary transition-colors neon-line">Invest</Link>
            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 px-3 py-2 border border-border rounded-full hover:shadow-md transition-all cursor-pointer">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
                <ChevronDown size={16} className={cn("text-charcoal transition-transform", profileOpen && "rotate-180")} />
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-border py-2">
                  <Link href="/auth/login" className="block px-4 py-2.5 text-sm text-ink hover:bg-surface transition-colors">Log in</Link>
                  <Link href="/auth/signup" className="block px-4 py-2.5 text-sm text-ink hover:bg-surface transition-colors">Sign up</Link>
                  <div className="my-1 border-t border-border" />
                  <Link href="/host" className="block px-4 py-2.5 text-sm text-ink hover:bg-surface transition-colors">List your property</Link>
                  <Link href="/help" className="block px-4 py-2.5 text-sm text-ink hover:bg-surface transition-colors">Help Centre</Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-ink cursor-pointer" aria-label="Menu">
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden glass-card border-t border-border">
          <div className="px-4 py-4 space-y-3">
            <SearchBar variant="compact" />
            <Link href="/host" className="block py-2.5 text-ink font-medium">List your property</Link>
            <Link href="/investment" className="block py-2.5 text-ink font-medium">Invest</Link>
            <Link href="/auth/login" className="block py-2.5 text-ink font-medium">Log in</Link>
            <Link href="/auth/signup" className="block py-2.5 text-ink font-medium">Sign up</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
