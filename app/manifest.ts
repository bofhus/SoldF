import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SoldF Utbildningsplattform',
    short_name: 'SoldF',
    description: 'Mobilanpassad utbildningsplattform för SoldF 2001 med offline-stöd och AI-komplement.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0d130d',
    theme_color: '#728d46',
    icons: [
      {
        src: '/icon-192.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
      },
      {
        src: '/icon-512.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
      },
    ],
  };
}
