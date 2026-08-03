import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Tele Gás',
    short_name: 'Tele Gás',
    description: 'Pedidos de GLP em Aquidauana, Anastácio e Miranda.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ff4b00',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml'
      },
      {
        src: '/apple-icon.svg',
        sizes: 'any',
        type: 'image/svg+xml'
      }
    ]
  };
}
