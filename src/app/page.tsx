import type { Metadata } from 'next';
import { Hero } from '@/components/hero';
import { ProductGrid } from '@/components/product-grid';
import { SectionHeading } from '@/components/ui/section-heading';
import { aquidauanaBranches, anastacioBranches, units, faq } from '@/lib/site-data';
import { FaqAccordion } from '@/components/faq-accordion';
import { UnitCard } from '@/components/unit-card';
import { UnitCarouselCard } from '@/components/unit-carousel-card';
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
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
        <ProductGrid />
      </section>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 space-y-8">
        <SectionHeading eyebrow="Avaliações e confiança" title="Avaliações por unidade" description="" />
        <UnitReviewsTabs />
      </section>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 space-y-8">
        <SectionHeading eyebrow="Unidades" title="Atendimento por cidade" />
        <div className="grid gap-6 md:grid-cols-3">
          <UnitCarouselCard
            unit={units[0]}
            slides={aquidauanaBranches.map((branch) => ({
              key: branch.key,
              title: branch.name,
              address: branch.address,
              phoneDisplay: branch.phoneDisplay,
              whatsappDisplay: branch.whatsappDisplay,
              mapUrl: branch.mapUrl,
              image: branch.key === 'nova-aquidauana'
                ? 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkzdd1vpUGbrRFkSyElrq-KWG4qh7FnHansQCYYdf_1CpavPVQZB9ldlylugRs5vc1H6FesDmBZ4HdZzR57I-b7gmLgJWWUJ3oBF3ZhH6CGD1gQKBmbDDXCmdN4suWZL3JIKJsS2A=s680-w680-h510-rw'
                : branch.key === 'chapecoense'
                  ? 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkxuxk9oaGA6KebxeVDKmRdrZTslf6baO8KzqHZCNLdZvrOj4zdnM-crMgOma7rl070x6_5UeC0sqjLRdmsgwHuc2h5WY3Asp6ULq57cM9u8jGoYhG6RD4G3sH_t9Q-mJjQ2GYO=s680-w680-h510-rw'
                : undefined
            }))}
          />
          <UnitCarouselCard
            unit={units[1]}
            slides={anastacioBranches.map((branch) => ({
              key: branch.key,
              title: branch.name,
              address: branch.address,
              phoneDisplay: branch.phoneDisplay,
              whatsappDisplay: branch.whatsappDisplay,
              mapUrl: branch.mapUrl
            }))}
          />
          <UnitCard key={units[2].key} unit={units[2]} />
        </div>
      </section>
      <section className="py-14"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8"><SectionHeading eyebrow="FAQ" title="Perguntas frequentes" /><FaqAccordion items={faq} /></div></section>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"><div className="rounded-[1.75rem] border border-white/20 bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-700 p-7 text-white shadow-[0_12px_30px_rgba(0,0,0,0.12)] backdrop-blur-md sm:p-8 lg:flex lg:items-center lg:justify-between"><div><h2 className="text-3xl font-semibold">Pronto para pedir?</h2><p className="mt-3 text-white/80">Escolha sua cidade, revise os dados e finalize no WhatsApp com a unidade correta.</p></div><div className="mt-6 flex flex-wrap gap-3 lg:mt-0"><ButtonLink href="/pedido" className="bg-gradient-to-r from-brand-500 via-brand-600 to-brand-700 text-white hover:brightness-110">Pedir gás agora</ButtonLink><ButtonLink href="/links" className="border border-white/20 bg-white/10 text-white hover:bg-white/20">Ver canais de atendimento</ButtonLink></div></div></section>
    </>
  );
}
