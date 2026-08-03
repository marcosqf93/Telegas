import type { Metadata } from 'next';
import { SectionHeading } from '@/components/ui/section-heading';
import { reviews } from '@/lib/site-data';
import { ReviewCard } from '@/components/review-card';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Avaliações',
  description: 'Avaliações e link para o perfil da empresa no Google.',
  alternates: { canonical: '/avaliacoes' }
};

export default function AvaliacoesPage() {
  return <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8"><SectionHeading eyebrow="Avaliações" title="Depoimentos de clientes" description="Avaliações reais da empresa e das unidades." />{reviews.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{reviews.map((review) => <ReviewCard key={review.name} review={review} />)}</div> : <div className="rounded-3xl border border-border bg-white p-6 shadow-sm"><p className="text-sm text-foreground/70">As avaliações estão disponíveis nas páginas das unidades.</p><div className="mt-4 flex flex-wrap gap-3"><Link href="/unidades" className="rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white">Ver unidades</Link><Link href="/contato" className="rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground">Falar com a Tele Gás</Link></div></div>}</section>;
}
