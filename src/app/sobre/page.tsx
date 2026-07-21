import type { Metadata } from 'next';
import { SectionHeading } from '@/components/ui/section-heading';
import { Timeline } from '@/components/timeline';
import { timeline } from '@/lib/site-data';

export const metadata: Metadata = {
  title: 'Sobre',
  description: 'História da Tele Gás e linha do tempo da empresa.',
  alternates: { canonical: '/sobre' }
};

export default function SobrePage() {
  return <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8"><SectionHeading eyebrow="Sobre" title="A história da Tele Gás" description="A linha do tempo foi reorganizada para leitura rápida e para SEO local." /><Timeline items={timeline} /></section>;
}
