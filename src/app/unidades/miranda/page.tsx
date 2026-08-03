import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { BadgeCheck, MapPin, MessageCircle, PhoneCall, Star, Instagram } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { AutoSlideReviews } from '@/components/auto-slide-reviews';
import { HoursDisclosure } from '@/components/hours-disclosure';
import { JsonLd } from '@/components/json-ld';
import { SectionHeading } from '@/components/ui/section-heading';
import { mirandaReviews, brand, units } from '@/lib/site-data';

export const metadata: Metadata = {
  title: 'Unidade Miranda',
  description: 'Unidade Tele Gás Miranda com endereço, WhatsApp, imagem e avaliações do Google.',
  alternates: { canonical: '/unidades/miranda' }
};

export default function MirandaPage() {
  const unit = units[2];

  return (
    <section className="mx-auto max-w-7xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'Início', href: '/' }, { label: 'Unidades', href: '/unidades' }, { label: 'Miranda' }]} />
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'LocalBusiness', name: unit.name, url: `https://${brand.domain}/unidades/miranda`, telephone: unit.phoneDisplay, areaServed: ['Miranda'] }} />

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <SectionHeading eyebrow="Unidade" title={unit.name} description="Endereço confirmado, contato direto e avaliações reais para a cidade de Miranda." />

          <div className="overflow-hidden rounded-3xl border border-border bg-white shadow-sm">
            <div className="relative h-72 w-full bg-slate-100 sm:h-[28rem]">
              {unit.image ? <Image src={unit.image} alt={unit.name} fill sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover" /> : null}
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <p className="text-sm uppercase tracking-[0.2em] text-white/80">Miranda</p>
                <h2 className="mt-2 text-3xl font-semibold">Atendimento com presença forte no celular</h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-white/85">Entrega rápida, contato direto e uma vitrine mais elegante para a unidade.</p>
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
              <div className="sm:col-span-2">
                <HoursDisclosure hours={unit.hours} />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 border-t border-border p-6">
              <Link href={`/pedido?cidade=${unit.key}`} className="rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white">Pedir em Miranda</Link>
              <a href={unit.mapUrl} target="_blank" rel="noreferrer" className="rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground">Abrir mapa</a>
              {unit.instagramUrl ? <a href={unit.instagramUrl} target="_blank" rel="noreferrer" className="rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground inline-flex items-center gap-2"><Instagram className="h-4 w-4" />Instagram</a> : null}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <SectionHeading eyebrow="Avaliações" title="O que falam da unidade" description="Comentários reais organizados para leitura rápida e com foco em conversão." />
          <AutoSlideReviews reviews={mirandaReviews} />
          <div className="grid gap-4">
            {mirandaReviews.map((review) => (
              <article key={review.name} className="rounded-3xl border border-border bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-foreground">{review.name}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-brand-600">Google</p>
                  </div>
                  <div className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">
                    <Star className="h-4 w-4 fill-current" />
                    {review.rating.toFixed(1)}
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-foreground/75">{review.comment}</p>
              </article>
            ))}
          </div>
          <div className="rounded-3xl bg-slate-50 p-5 text-sm leading-6 text-foreground/70">
            5,0 estrelas no Google · 6 avaliações confirmadas
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
