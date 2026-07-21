import type { Metadata } from 'next';
import { SectionHeading } from '@/components/ui/section-heading';
import { units } from '@/lib/site-data';
import { UnitCard } from '@/components/unit-card';

export const metadata: Metadata = {
  title: 'Unidades',
  description: 'Conheça as unidades da Tele Gás em Aquidauana, Anastácio e Miranda.',
  alternates: { canonical: '/unidades' }
};

export default function UnidadesPage() {
  return <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8"><SectionHeading eyebrow="Unidades" title="Atendimento local" description="Endereços, horários e telefones precisam ser confirmados antes da publicação final." /><div className="grid gap-6 md:grid-cols-3">{units.map((unit) => <UnitCard key={unit.key} unit={unit} />)}</div></section>;
}
