import type { Metadata } from 'next';
import { Hero } from '@/components/hero';
import { CitySelector } from '@/components/city-selector';
import { ProductGrid } from '@/components/product-grid';
import { SectionHeading } from '@/components/ui/section-heading';
import { howToOrder, deliveryBenefits, promotion, units, faq, timeline } from '@/lib/site-data';
import { FaqAccordion } from '@/components/faq-accordion';
import { Timeline } from '@/components/timeline';
import { UnitCard } from '@/components/unit-card';
import { ButtonLink } from '@/components/ui/button';
import { UnitReviewsTabs } from '@/components/unit-reviews-tabs';

export const metadata: Metadata = {
  title: 'Início',
  description: 'Pedir gás em Aquidauana, Anastácio e Miranda com agilidade e estrutura local.',
  alternates: { canonical: '/' }
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><CitySelector /></section>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
        <SectionHeading eyebrow="Produtos" title="Gás pronto para pedir" description="Os preços são centralizados e podem variar por unidade. Confirme o valor na cidade selecionada." />
        <ProductGrid />
      </section>
      <section className="bg-slate-50 py-14"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8"><SectionHeading eyebrow="Pedido" title="Como fazer o pedido" /><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{howToOrder.map((item, index) => <div key={item} className="rounded-3xl border border-border bg-white p-5 shadow-sm"><p className="text-sm font-semibold text-brand-600">0{index + 1}</p><p className="mt-3 font-medium text-foreground">{item}</p></div>)}</div></div></section>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 space-y-8">
        <SectionHeading eyebrow="Diferenciais" title="Por que pedir na Tele Gás" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{deliveryBenefits.map((item) => <div key={item} className="rounded-3xl border border-border bg-white p-5 shadow-sm"><p className="font-medium text-foreground">{item}</p></div>)}</div>
      </section>
      <section className="bg-brand-500 py-14 text-white"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center"><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">Promoção</p><h2 className="mt-2 text-3xl font-semibold">{promotion.title}</h2><p className="mt-3 max-w-2xl text-white/80">{promotion.description}</p></div><ButtonLink href="/chama-premiada" className="bg-white text-foreground hover:bg-slate-100">{promotion.cta}</ButtonLink></div></section>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 space-y-8">
        <SectionHeading eyebrow="Avaliações do Google" title="Avaliações por unidade" description="" />
        <UnitReviewsTabs />
      </section>
      <section className="bg-slate-50 py-14"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8"><SectionHeading eyebrow="História" title="Trajetória da Tele Gás" /><Timeline items={timeline} /></div></section>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 space-y-8">
        <SectionHeading eyebrow="Unidades" title="Atendimento por cidade" />
        <div className="grid gap-6 md:grid-cols-3">{units.map((unit) => <UnitCard key={unit.key} unit={unit} />)}</div>
      </section>
      <section className="bg-slate-50 py-14"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8"><SectionHeading eyebrow="FAQ" title="Perguntas frequentes" /><FaqAccordion items={faq} /></div></section>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"><div className="rounded-3xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-700 p-8 text-white lg:flex lg:items-center lg:justify-between"><div><h2 className="text-3xl font-semibold">Pronto para pedir?</h2><p className="mt-3 text-white/80">Escolha sua cidade e finalize o pedido no menor número de passos possível.</p></div><div className="mt-6 flex flex-wrap gap-3 lg:mt-0"><ButtonLink href="/pedido" className="bg-gradient-to-r from-brand-500 via-brand-600 to-brand-700 text-white hover:brightness-110">Pedir gás agora</ButtonLink><ButtonLink href="/links" className="border border-white/20 bg-white/10 text-white hover:bg-white/20">Abrir link da bio</ButtonLink></div></div></section>
    </>
  );
}
