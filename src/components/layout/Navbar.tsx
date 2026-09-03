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
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
      scrolled 
        ? "glass-card shadow-md" 
        : "bg-transparent"
    )}>
      {/* Elegant Bottom Border */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-secondary/20 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center group-hover:shadow-lg transition-all duration-300">
              <span className="text-white font-display font-bold text-lg">H</span>
            </div>
            <span className="font-display font-semibold text-xl text-ink hidden sm:block tracking-tight">
              Heavenward
            </span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden lg:block flex-1 max-w-xl mx-8">
            <SearchBar variant="navbar" />
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/host" className="px-5 py-2.5 text-sm font-medium text-charcoal hover:text-primary transition-colors neon-line">
              List your property
            </Link>
            <Link href="/investment" className="px-5 py-2.5 text-sm font-medium text-charcoal hover:text-primary transition-colors neon-line">
              Invest
            </Link>
            
            <div className="relative">
              <button 
                onClick={() => setProfileOpen(!profileOpen)} 
                className="flex items-center gap-2.5 px-4 py-2.5 bg-white border border-border rounded-full hover:shadow-md transition-all duration-300 cursor-pointer"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
                <ChevronDown size={16} className={cn("text-charcoal transition-transform duration-300", profileOpen && "rotate-180")} />
              </button>
              
              {profileOpen && (
                <div className="absolute right-0 top-full mt-3 w-60 bg-white rounded-2xl shadow-xl border border-border py-2">
                  <Link href="/auth/login" className="block px-5 py-3 text-sm text-ink hover:bg-surface transition-colors">Log in</Link>
                  <Link href="/auth/signup" className="block px-5 py-3 text-sm text-ink hover:bg-surface transition-colors">Sign up</Link>
                  <div className="my-2 h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />
                  <Link href="/host" className="block px-5 py-3 text-sm text-ink hover:bg-surface transition-colors">List your property</Link>
                  <Link href="/help" className="block px-5 py-3 text-sm text-ink hover:bg-surface transition-colors">Help Centre</Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileOpen(!mobileOpen)} 
            className="lg:hidden p-3 bg-white border border-border rounded-xl text-ink hover:shadow-md transition-all duration-300 cursor-pointer"
            aria-label="Menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden glass-card border-t border-border animate-in slide-in-from-top-4">
          <div className="px-6 py-6 space-y-4">
            <SearchBar variant="compact" />
            <Link href="/host" className="block py-3 text-ink font-medium hover:text-primary transition-colors">List your property</Link>
            <Link href="/investment" className="block py-3 text-ink font-medium hover:text-primary transition-colors">Invest</Link>
            <div className="h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />
            <Link href="/auth/login" className="block py-3 text-ink font-medium hover:text-primary transition-colors">Log in</Link>
            <Link href="/auth/signup" className="block py-3 text-ink font-medium hover:text-primary transition-colors">Sign up</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
