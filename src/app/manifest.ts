import type { MetadataRoute } from 'next';
import { SITE } from '@/data/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.name} — ${SITE.direction}`,
    short_name: SITE.name,
    description: SITE.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFFFF',
    theme_color: '#FF9800',
    orientation: 'portrait-primary',
    categories: ['travel', 'business', 'lifestyle'],
    icons: [
      { src: '/brand/heavenward-mark-dark.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
      { src: '/brand/heavenward-secondary.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'maskable' },
    ],
    shortcuts: [
      { name: 'Book a stay', short_name: 'Book', url: '/stay', description: 'Search and book a residence' },
      {
        name: 'Business & Investment Opportunities',
        short_name: 'Opportunities',
        url: '/opportunities',
        description: 'Explore selected opportunities',
      },
      { name: 'Concierge', short_name: 'Concierge', url: '/concierge', description: 'Request a service' },
    ],
  };
}
