import type { Metadata, Viewport } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/header';
import { CityProvider } from '@/components/city-provider';
import { JsonLd } from '@/components/json-ld';
import { AnalyticsScripts } from '@/components/analytics-scripts';
import { ScrollEffects } from '@/components/scroll-effects';
import { LocationConsentBanner } from '@/components/location-consent-banner';
import { PwaRegistration } from '@/components/pwa-registration';
import { SiteChrome } from '@/components/site-chrome';
import { brand } from '@/lib/site-data';
import type { ReactNode } from 'react';

const siteUrl = process.env.URL ?? process.env.DEPLOY_PRIME_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? `https://${brand.domain}`;

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Tele Gás',
    template: `%s | Tele Gás`
  },
  description: 'Site oficial da Tele Gás para pedidos de GLP em Aquidauana, Anastácio e Miranda.',
  manifest: '/manifest.webmanifest',
  themeColor: '#ff4b00',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: siteUrl,
    siteName: 'Tele Gás'
  },
  twitter: { card: 'summary_large_image' },
  verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } : undefined
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#ff4b00'
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="bg-background text-foreground antialiased">
        <JsonLd data={{
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: brand.name,
          url: siteUrl,
          areaServed: ['Aquidauana', 'Anastácio', 'Miranda']
        }} />
        <AnalyticsScripts />
        <PwaRegistration />
        <CityProvider>
          <LocationConsentBanner />
          <ScrollEffects />
          <Header />
          <main className="pb-24 md:pb-0">{children}</main>
          <SiteChrome />
        </CityProvider>
      </body>
    </html>
  );
}
