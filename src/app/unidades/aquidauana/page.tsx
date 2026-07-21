import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, PhoneCall, MessageCircle, Instagram, Star, BadgeCheck } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { JsonLd } from '@/components/json-ld';
import { SectionHeading } from '@/components/ui/section-heading';
import { units, brand, aquidauanaReviews, aquidauanaBranches } from '@/lib/site-data';
import { UnitCard } from '@/components/unit-card';
import { AutoSlideReviews } from './reviews-auto-slide';

export const metadata: Metadata = {
  title: 'Unidade Aquidauana',
  description: 'Unidade matriz da Tele Gás em Aquidauana, com contatos, mapa e avaliações do Google.',
  alternates: { canonical: '/unidades/aquidauana' }
};

export default function AquidauanaPage() {
  const unit = units[0];

  return (
    <section className="mx-auto max-w-7xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'Início', href: '/' }, { label: 'Unidades', href: '/unidades' }, { label: 'Aquidauana' }]} />
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'LocalBusiness', name: unit.name, url: `https://${brand.domain}/unidades/aquidauana`, telephone: unit.phoneDisplay, areaServed: ['Aquidauana'] }} />
      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-6">
          <SectionHeading eyebrow="Matriz" title={unit.name} description="Unidade principal com contato, atendimento e avaliações reais do Google." />
          <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600"><MapPin className="h-5 w-5" /></div>
              <div>
                <p className="text-sm text-foreground/60">Cidade</p>
                <p className="font-semibold text-foreground">Aquidauana</p>
                <p className="mt-2 text-sm leading-6 text-foreground/70">{unit.address}</p>
              </div>
            </div>
            <div className="mt-6 grid gap-3 text-sm text-foreground/75">
              <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3"><PhoneCall className="h-4 w-4 text-brand-600" />{unit.phoneDisplay}</div>
              <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3"><MessageCircle className="h-4 w-4 text-brand-600" />{unit.whatsappDisplay}</div>
              <a href={unit.instagramUrl ?? '#'} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3"><Instagram className="h-4 w-4 text-brand-600" />Instagram da unidade</a>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-graphite p-5 text-white shadow-sm">
              <p className="text-sm text-white/70">Nota média</p>
              <p className="mt-2 text-3xl font-semibold">{unit.googleRating}</p>
            </div>
            <div className="rounded-3xl border border-border bg-white p-5 shadow-sm sm:col-span-2">
              <p className="text-sm text-foreground/60">Volume no Google</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">{unit.googleReviewsCount}</p>
              <p className="mt-2 text-sm leading-6 text-foreground/70">Avaliações reais da unidade matriz, organizadas para leitura rápida no celular.</p>
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-foreground">Unidades em Aquidauana</h2>
            <p className="mt-2 text-sm leading-6 text-foreground/70">Na hora do pedido, o cliente escolhe a unidade mais próxima para agilizar a entrega.</p>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {aquidauanaBranches.map((branch) => (
                <article key={branch.key} className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-foreground">{branch.name}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-brand-600">Aquidauana</p>
                  <p className="mt-3 text-sm leading-6 text-foreground/70">{branch.address}</p>
                  <div className="mt-4 space-y-1 text-sm text-foreground/70">
                    <p>{branch.phoneDisplay}</p>
                    <p>{branch.whatsappDisplay}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-foreground">Atendimento e pedido</h2>
            <p className="mt-2 text-sm leading-6 text-foreground/70">Escolha a unidade matriz para agilizar a entrega em Aquidauana.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href={`/pedido?cidade=${unit.key}`} className="rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white">Pedir na matriz</Link>
              <a href={unit.mapUrl} target="_blank" rel="noreferrer" className="rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground">Abrir mapa</a>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <SectionHeading eyebrow="Avaliações" title="O que falam da matriz" description="Depoimentos reais organizados em um carrossel leve para celular." />
          <AutoSlideReviews reviews={aquidauanaReviews} />
          <div className="rounded-3xl bg-slate-50 p-5 text-sm leading-6 text-foreground/70">
            5,0 estrelas · mais de 2 mil avaliações
          </div>
        </div>
      </div>

      <div className="pt-2">
        <UnitCard unit={unit} />
      </div>
    </section>
  );
}
