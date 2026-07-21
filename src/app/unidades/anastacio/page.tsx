import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { BadgeCheck, MapPin, MessageCircle, PhoneCall, Star } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { AutoSlideReviews } from '@/components/auto-slide-reviews';
import { JsonLd } from '@/components/json-ld';
import { SectionHeading } from '@/components/ui/section-heading';
import { anastacioReviews, brand, units } from '@/lib/site-data';

export const metadata: Metadata = {
  title: 'Unidade Anastácio',
  description: 'Unidade Tele Gás Anastácio com endereço, WhatsApp, imagem e avaliações do Google.',
  alternates: { canonical: '/unidades/anastacio' }
};

export default function AnastacioPage() {
  const unit = units[1];

  return (
    <section className="mx-auto max-w-7xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'Início', href: '/' }, { label: 'Unidades', href: '/unidades' }, { label: 'Anastácio' }]} />
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'LocalBusiness', name: unit.name, url: `https://${brand.domain}/unidades/anastacio`, telephone: unit.phoneDisplay, areaServed: ['Anastácio'] }} />

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <SectionHeading eyebrow="Unidade" title={unit.name} description="Endereço confirmado, contato direto e avaliações reais para a cidade de Anastácio." />

          <div className="overflow-hidden rounded-3xl border border-border bg-white shadow-sm">
            <div className="relative h-72 w-full bg-slate-100 sm:h-[28rem]">
              {unit.image ? <Image src={unit.image} alt={unit.name} fill sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover" /> : null}
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <p className="text-sm uppercase tracking-[0.2em] text-white/80">Anastácio</p>
                <h2 className="mt-2 text-3xl font-semibold">Atendimento com cara de loja premium</h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-white/85">Entrega rápida, contato direto e uma presença visual mais forte para destacar a unidade no celular.</p>
              </div>
            </div>

            <div className="grid gap-4 p-6 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground"><MapPin className="h-4 w-4 text-brand-600" />Endereço</div>
                <p className="mt-2 text-sm leading-6 text-foreground/70">{unit.address}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground"><Star className="h-4 w-4 text-amber-500" />Nota Google</div>
                <p className="mt-2 text-3xl font-semibold text-foreground">{unit.googleRating}</p>
                <p className="mt-1 text-sm text-foreground/60">{unit.googleReviewsCount}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground"><PhoneCall className="h-4 w-4 text-brand-600" />Telefone</div>
                <p className="mt-2 text-sm text-foreground/70">{unit.phoneDisplay}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground"><MessageCircle className="h-4 w-4 text-brand-600" />WhatsApp</div>
                <p className="mt-2 text-sm text-foreground/70">{unit.whatsappDisplay}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 border-t border-border p-6">
              <Link href={`/pedido?cidade=${unit.key}`} className="rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white">Pedir em Anastácio</Link>
              <a href={unit.mapUrl} target="_blank" rel="noreferrer" className="rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground">Abrir mapa</a>
            </div>
          </div>

        </div>

        <div className="space-y-6">
          <SectionHeading eyebrow="Avaliações" title="O que falam da unidade" description="Comentários reais organizados para leitura rápida e com foco em conversão." />
          <AutoSlideReviews reviews={anastacioReviews} />
          <div className="rounded-3xl bg-slate-50 p-5 text-sm leading-6 text-foreground/70">
            4,7 estrelas no Google · 4 avaliações confirmadas
          </div>
          <div className="rounded-3xl border border-border bg-white p-5 text-sm leading-6 text-foreground/70 shadow-sm">
            <BadgeCheck className="mb-3 h-5 w-5 text-brand-600" />
            Atendimento local com WhatsApp direto da unidade e acesso rápido ao mapa.
          </div>
        </div>
      </div>
    </section>
  );
}
