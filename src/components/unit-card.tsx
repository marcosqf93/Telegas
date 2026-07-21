"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, PhoneCall, MessageCircle, Instagram } from 'lucide-react';
import type { Unit } from '@/lib/site-data';
import { buildWhatsAppUrl } from '@/lib/utils';
import { trackEvent } from '@/lib/analytics';
import { brand } from '@/lib/site-data';

export function UnitCard({ unit }: { unit: Unit }) {
  const whatsappHref = buildWhatsAppUrl(unit.whatsapp, `Olá, quero atendimento da unidade ${unit.city}.`);
  const whatsappExternal = whatsappHref.startsWith('http');

  return (
    <article className="rounded-3xl border border-border bg-white p-6 shadow-sm">
      {unit.image ? (
        <div className="relative mb-5 h-52 overflow-hidden rounded-3xl bg-slate-100">
          <Image src={unit.image} alt={unit.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
        </div>
      ) : null}
      <div className="mb-4 flex justify-start">
        <div className="relative h-8 w-24">
          <Image src={brand.logo} alt={brand.name} fill sizes="96px" className="object-contain object-left-top" />
        </div>
      </div>
      <h3 className="text-xl font-semibold text-foreground">{unit.name}</h3>
      <p className="mt-1 text-sm text-foreground/60">{unit.city}</p>
      <p className="mt-4 text-sm leading-6 text-foreground/80">{unit.address}</p>
      <p className="mt-3 text-sm text-foreground/70">{unit.hours}</p>
      {unit.googleRating ? (
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">
          <span>Google {unit.googleRating}</span>
          {unit.googleReviewsCount ? <span className="text-amber-600/70">{unit.googleReviewsCount}</span> : null}
        </div>
      ) : null}
      <div className="mt-4 space-y-2 text-sm text-foreground/70">
        <p className="flex items-center gap-2"><PhoneCall className="h-4 w-4" />{unit.phoneDisplay ?? unit.phones[0]}</p>
        <p className="flex items-center gap-2"><MessageCircle className="h-4 w-4" />{unit.whatsappDisplay ?? 'WhatsApp a confirmar'}</p>
        {unit.instagramUrl ? <a href={unit.instagramUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-brand-600"><Instagram className="h-4 w-4" />Instagram</a> : null}
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link href={`/pedido?cidade=${unit.key}`} onClick={() => trackEvent({ name: 'click_unit_order', params: { city: unit.key } })} className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white">
          Pedir nesta unidade
        </Link>
        <a href={whatsappHref} target={whatsappExternal ? '_blank' : undefined} rel={whatsappExternal ? 'noreferrer' : undefined} className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground">
          WhatsApp
        </a>
        <a href={unit.mapUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground">
          Mapa <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </article>
  );
}
