import Link from "next/link";
import { Globe, MessageCircle, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  "Explore": [
    { label: "Search properties", href: "/search" },
    { label: "Lagos", href: "/search?city=lagos" },
    { label: "Luxury stays", href: "/search?category=luxury" },
    { label: "Beachfront", href: "/search?category=beachfront" },
    { label: "New listings", href: "/search?category=new" },
  ],
  "Hosting": [
    { label: "Become a host", href: "/host" },
    { label: "Propose a destination", href: "/propose-destination" },
    { label: "Host resources", href: "/host/resources" },
    { label: "Community forum", href: "/host/community" },
  ],
  "Company": [
    { label: "About us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/about/press" },
    { label: "Blog", href: "/blog" },
    { label: "Investment", href: "/investment" },
  ],
  "Support": [
    { label: "Help Centre", href: "/help" },
    { label: "Contact us", href: "/contact" },
    { label: "FAQ", href: "/faq" },
    { label: "Privacy policy", href: "/privacy" },
    { label: "Terms of service", href: "/terms" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative bg-ink overflow-hidden">
      {/* Subtle Background */}
      <div className="absolute inset-0 dot-pattern opacity-[0.02]" />
      <div className="orb orb-teal w-[400px] h-[400px] -bottom-40 -left-40 opacity-30" />
      <div className="orb orb-gold w-[300px] h-[300px] -bottom-20 right-1/4 opacity-20" />
      
      {/* Top Divider */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-secondary/30 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 lg:gap-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-6 lg:mb-0">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-11 h-11 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center group-hover:shadow-lg transition-all duration-300">
                <span className="text-white font-display font-bold text-xl">H</span>
              </div>
              <span className="font-display font-semibold text-2xl text-white tracking-tight">
                Heavenward
              </span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs mb-8">
              Premium short-let properties across Africa. Luxury living, redefined.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-8">
              <a href="mailto:hello@heavenwardplace.com" className="flex items-center gap-3 text-white/40 hover:text-secondary transition-colors text-sm">
                <Mail size={16} />
                <span>hello@heavenwardplace.com</span>
              </a>
              <a href="tel:+2348012345678" className="flex items-center gap-3 text-white/40 hover:text-secondary transition-colors text-sm">
                <Phone size={16} />
                <span>+234 801 234 5678</span>
              </a>
              <div className="flex items-center gap-3 text-white/40 text-sm">
                <MapPin size={16} />
                <span>Lagos, Nigeria</span>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 flex items-center justify-center text-white/40 hover:text-secondary bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300" aria-label="Website">
                <Globe size={18} />
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center text-white/40 hover:text-secondary bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300" aria-label="WhatsApp">
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-white mb-6 text-sm uppercase tracking-wider">{title}</h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-white/50 hover:text-secondary transition-all duration-300 neon-line">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-20 pt-10 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="text-sm text-white/40">
              &copy; {new Date().getFullYear()} Heavenward Place. All rights reserved.
            </p>
            <div className="flex items-center gap-8 text-sm text-white/40">
              <Link href="/privacy" className="hover:text-secondary transition-colors neon-line">Privacy</Link>
              <Link href="/terms" className="hover:text-secondary transition-colors neon-line">Terms</Link>
              <Link href="/help" className="hover:text-secondary transition-colors neon-line">Support</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
