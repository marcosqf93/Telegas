"use client";

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ExternalLink, Instagram, PhoneCall } from 'lucide-react';
import type { Unit } from '@/lib/site-data';
import { buildWhatsAppUrl } from '@/lib/utils';
import { trackEvent } from '@/lib/analytics';
import { brand } from '@/lib/site-data';
import { HoursDisclosure } from './hours-disclosure';

type Slide = {
  key: string;
  title: string;
  address: string;
  phoneDisplay: string;
  whatsappDisplay: string;
  mapUrl?: string;
  image?: string;
};

type Props = {
  unit: Unit;
  slides: Slide[];
};

export function UnitCarouselCard({ unit, slides }: Props) {
  const safeSlides = slides.length
    ? slides
    : [{
        key: unit.key,
        title: unit.name.replace(/^Tele Gás\s+/i, ''),
        address: unit.address,
        phoneDisplay: unit.phoneDisplay ?? unit.phones[0],
        whatsappDisplay: unit.whatsappDisplay ?? unit.whatsapp,
        mapUrl: unit.mapUrl
      }];

  const [activeIndex, setActiveIndex] = useState(0);
  const [queuedIndex, setQueuedIndex] = useState(1);
  const [isTurning, setIsTurning] = useState(false);

  const activeSlide = safeSlides[activeIndex] ?? safeSlides[0];
  const nextIndex = useMemo(() => (safeSlides.length > 1 ? (activeIndex + 1) % safeSlides.length : 0), [activeIndex, safeSlides.length]);
  const nextSlide = safeSlides[nextIndex] ?? activeSlide;

  useEffect(() => {
    setQueuedIndex(nextIndex);
  }, [nextIndex]);

  useEffect(() => {
    if (!isTurning) return undefined;
    const timer = window.setTimeout(() => {
      setActiveIndex(queuedIndex);
      setIsTurning(false);
    }, 520);
    return () => window.clearTimeout(timer);
  }, [isTurning, queuedIndex]);

  const handleNext = () => {
    if (safeSlides.length < 2 || isTurning) return;
    setQueuedIndex(nextIndex);
    setIsTurning(true);
  };

  const whatsappHref = buildWhatsAppUrl(activeSlide.whatsappDisplay, `Olá, quero atendimento da unidade ${unit.city}.`);
  const whatsappExternal = whatsappHref.startsWith('http');

  return (
    <article className="relative overflow-visible rounded-[1.75rem] border border-white/25 bg-white/70 p-5 shadow-[0_12px_30px_rgba(0,0,0,0.08)] backdrop-blur-md sm:p-6">
      <div className="absolute right-6 top-[46%] z-20 -translate-y-1/2 sm:right-8">
        {safeSlides.length > 1 ? (
          <button
            type="button"
            onClick={handleNext}
            aria-label={`Ver próxima unidade de ${unit.city}`}
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-brand-500/70 bg-white/85 text-brand-500 shadow-md backdrop-blur-sm transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <ArrowRight className="h-5 w-5 animate-swipe-right" />
          </button>
        ) : null}
      </div>

      <div style={{ perspective: '1200px' }}>
        <div
          className="relative min-h-[560px] transition-transform duration-500 ease-out"
          style={{ transformStyle: 'preserve-3d', transform: isTurning ? 'rotateY(-180deg)' : 'rotateY(0deg)' }}
        >
          <div style={{ backfaceVisibility: 'hidden' }}>
            <UnitFace unit={unit} slide={activeSlide} />
          </div>
          <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
            <UnitFace unit={unit} slide={nextSlide} />
          </div>
        </div>
      </div>
    </article>
  );
}

function UnitFace({ unit, slide }: { unit: Unit; slide: Slide }) {
  const whatsappHref = buildWhatsAppUrl(slide.whatsappDisplay, `Olá, quero atendimento da unidade ${unit.city}.`);
  const whatsappExternal = whatsappHref.startsWith('http');
  const displayTitle = slide.key === 'nova-aquidauana' || slide.key === 'chapecoense' || slide.key === '27-de-julho' || slide.key === 'vila-maior' || slide.key === 'cristo-rei' ? 'Filial' : slide.title;
  const displayAddress = slide.key === 'nova-aquidauana'
    ? 'Av. Mato Grosso do Sul, 576, Nova Aquidauana'
    : slide.key === '27-de-julho'
      ? '27 de Julho, Centro, Anastácio'
      : slide.key === 'vila-maior'
        ? 'Acogo, 1486, Vila Maior, Anastácio'
        : slide.key === 'cristo-rei'
          ? 'Rua das Acácias, Quadra E, Lote E1, Cristo Rei'
      : slide.address;

  return (
    <>
      {slide.image ?? unit.image ? (
        <div className="relative mb-5 h-52 overflow-hidden rounded-[1.5rem] bg-white/60">
          <Image src={slide.image ?? unit.image!} alt={slide.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
        </div>
      ) : null}
      <div className="mb-4 flex justify-start">
        <div className="h-8 w-24 overflow-hidden rounded-2xl border border-white/20 bg-white px-2 py-1 shadow-sm">
          <img src={brand.logo} alt={brand.name} className="h-full w-full object-contain object-left-top" loading="eager" />
        </div>
      </div>
      <h3 className="text-xl font-semibold text-foreground">Tele Gás {displayTitle}</h3>
      <p className="mt-1 text-sm text-foreground/60">{unit.city}</p>
      <p className="mt-4 text-sm leading-6 text-foreground/80">{displayAddress}</p>
      <div className="mt-3">
        <HoursDisclosure hours={unit.hours} />
      </div>
      {unit.googleRating ? (
        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50/80 px-3 py-1 text-sm font-semibold text-amber-700 backdrop-blur-sm">
          <span>Google {unit.googleRating}</span>
          {unit.googleReviewsCount ? <span className="text-amber-600/70">{unit.googleReviewsCount}</span> : null}
        </div>
      ) : null}
      <div className="mt-4 space-y-2 text-sm text-foreground/70">
        <p className="flex items-center gap-2"><PhoneCall className="h-4 w-4" />{slide.phoneDisplay}</p>
        <p className="flex items-center gap-2"><svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.05 4.95A10.78 10.78 0 0 0 12.01 2C6.49 2 2 6.48 2 12c0 1.76.46 3.48 1.34 4.99L2 22l5.16-1.35A9.96 9.96 0 0 0 12 22c5.52 0 10-4.48 10-10 0-2.67-1.04-5.18-2.95-7.05Zm-7.04 15.3c-1.58 0-3.13-.42-4.48-1.22l-.32-.19-3.06.8.82-2.98-.21-.33A7.95 7.95 0 0 1 4 12c0-4.42 3.59-8 8.01-8 2.14 0 4.15.83 5.66 2.34A7.94 7.94 0 0 1 20 12c0 4.42-3.58 8.25-7.99 8.25Zm4.42-5.9c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.02-.37-1.94-1.18-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.46-.39-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.86.84-.86 2.05s.88 2.38 1 2.55c.12.16 1.74 2.65 4.22 3.72.59.26 1.06.41 1.42.52.6.19 1.14.16 1.57.1.48-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" /></svg>{slide.whatsappDisplay}</p>
        {unit.instagramUrl ? <a href={unit.instagramUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-brand-600"><Instagram className="h-4 w-4" />Instagram</a> : null}
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link href={`/pedido?cidade=${unit.key}`} onClick={() => trackEvent({ name: 'click_unit_order', params: { city: unit.key } })} className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600">
          Pedir nesta unidade
        </Link>
        <a href={whatsappHref} target={whatsappExternal ? '_blank' : undefined} rel={whatsappExternal ? 'noreferrer' : undefined} className="rounded-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-110">
          WhatsApp
        </a>
        <a href={slide.mapUrl ?? unit.mapUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground">
          Mapa <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </>
  );
}
