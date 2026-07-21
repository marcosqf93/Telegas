import type { Metadata } from 'next';
import { units } from '@/lib/site-data';
import { UnitCard } from '@/components/unit-card';

export const metadata: Metadata = {
  title: 'Unidade Miranda',
  description: 'Informações da unidade Tele Gás Miranda.',
  alternates: { canonical: '/unidades/miranda' }
};

export default function MirandaPage() { return <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><UnitCard unit={units[2]} /></section>; }
