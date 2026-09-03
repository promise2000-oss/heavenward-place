import Link from "next/link";
import { Globe, MessageCircle } from "lucide-react";

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
    { label: "Host resources", href: "/host" },
    { label: "Community forum", href: "/host" },
  ],
  "Company": [
    { label: "About us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/about" },
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
    <footer className="bg-ink text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-4 lg:mb-0">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-white font-display font-bold text-lg">H</span>
              </div>
              <span className="font-display font-semibold text-xl text-white">Heavenward</span>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs">
              Premium short-let properties across Africa. Luxury living, redefined.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a href="#" className="w-9 h-9 flex items-center justify-center text-white/50 hover:text-neon-teal hover:bg-white/5 rounded-lg transition-all" aria-label="Website"><Globe size={18} /></a>
              <a href="#" className="w-9 h-9 flex items-center justify-center text-white/50 hover:text-neon-teal hover:bg-white/5 rounded-lg transition-all" aria-label="WhatsApp"><MessageCircle size={18} /></a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-white mb-4 text-sm">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-white/60 hover:text-white transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/50">&copy; {new Date().getFullYear()} Heavenward Place. All rights reserved.</p>
          <div className="flex items-center gap-6 text-sm text-white/50">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/help" className="hover:text-white transition-colors">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
