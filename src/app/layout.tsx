import type { Metadata } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { CityProvider } from '@/components/city-provider';
import { FloatingOrderCTA } from '@/components/floating-order-cta';
import { JsonLd } from '@/components/json-ld';
import { AnalyticsScripts } from '@/components/analytics-scripts';
import { ScrollEffects } from '@/components/scroll-effects';
import { LocationConsentBanner } from '@/components/location-consent-banner';
import { brand } from '@/lib/site-data';
import type { ReactNode } from 'react';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' });

export const metadata: Metadata = {
  metadataBase: new URL(`https://${brand.domain}`),
  title: {
    default: 'Tele Gás',
    template: `%s | Tele Gás`
  },
  description: 'Site oficial da Tele Gás para pedidos de GLP em Aquidauana, Anastácio e Miranda.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: `https://${brand.domain}`,
    siteName: 'Tele Gás'
  },
  twitter: { card: 'summary_large_image' },
  verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } : undefined
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${montserrat.variable}`}>
      <body>
        <JsonLd data={{
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: brand.name,
          url: `https://${brand.domain}`,
          areaServed: ['Aquidauana', 'Anastácio', 'Miranda']
        }} />
        <AnalyticsScripts />
        <CityProvider>
          <LocationConsentBanner />
          <ScrollEffects />
          <Header />
          <main className="pb-24 md:pb-0">{children}</main>
          <Footer />
          <FloatingOrderCTA />
        </CityProvider>
      </body>
    </html>
  );
}
