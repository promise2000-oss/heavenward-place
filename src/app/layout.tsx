import type { Metadata, Viewport } from 'next';
import './globals.css';
import { organizationJsonLd } from '@/lib/seo';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SITE } from '@/data/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.direction}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  publisher: SITE.name,
  formatDetection: { telephone: true, address: false, email: true },
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/brand/house-mark.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/apple-icon', sizes: '180x180' }],
  },
  category: 'travel',
  alternates: { canonical: '/' },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FF9800' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    /*
     * `data-scroll-behavior="smooth"` opts back in to the pre-v16 behaviour of
     * temporarily forcing `scroll-behavior: auto` during an SPA route change,
     * so navigating to a new page jumps to the top instantly while in-page
     * anchor scrolling (e.g. the skip link) stays smooth.
     */
    <html lang="en-NG" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="min-h-screen bg-white antialiased">
        <script
          type="application/ld+json"
          // Structured data is a static, first-party constant.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main id="main" className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </>
      </body>
    </html>
  );
}
