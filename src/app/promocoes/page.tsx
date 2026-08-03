import type { Metadata } from 'next';
import { promotion } from '@/lib/site-data';
import { SectionHeading } from '@/components/ui/section-heading';
import { ButtonLink } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Promoções',
  description: 'Promoções e campanhas da Tele Gás.',
  alternates: { canonical: '/promocoes' }
};

export default function PromocoesPage() {
  return <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8"><SectionHeading eyebrow="Promoções" title={promotion.title} description={promotion.description} /><div className="rounded-3xl bg-brand-500 p-8 text-white"><p className="max-w-3xl text-white/85">Acompanhe aqui as campanhas e novidades da Tele Gás.</p><div className="mt-6"><ButtonLink href="/chama-premiada" className="bg-white text-foreground hover:bg-slate-100">Ver campanha</ButtonLink></div></div></section>;
}
