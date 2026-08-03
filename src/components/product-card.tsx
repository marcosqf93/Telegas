"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Flame, TriangleAlert } from 'lucide-react';
import { cityLabel, formatCurrency } from '@/lib/utils';
import type { Product, CityKey } from '@/lib/site-data';
import { useCity } from './city-provider';
import { trackEvent } from '@/lib/analytics';

type Props = { product: Product; cityOverride?: CityKey };

export function ProductCard({ product, cityOverride }: Props) {
  const { city, hasSelectedCity } = useCity();
  const selectedCity = cityOverride ?? (hasSelectedCity ? city : null);
  const price = selectedCity ? product.pricesByUnit[selectedCity] : null;
  const isP13 = product.slug === 'gas-p13';
  const isP20 = product.slug === 'gas-p20';
  const isP45 = product.slug === 'gas-p45';

  return (
    <article className={`relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border shadow-[0_12px_30px_rgba(0,0,0,0.08)] transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.12)] ${isP13 ? 'border-cyan-200/20 bg-gradient-to-br from-sky-950 via-cyan-950 to-slate-900 text-white backdrop-blur-md md:scale-[1.03] md:shadow-[0_18px_44px_rgba(0,0,0,0.18)]' : isP20 ? 'border-slate-200 bg-slate-100/80 backdrop-blur-md' : isP45 ? 'border-white/25 bg-white/70 backdrop-blur-md' : 'border-white/25 bg-white/70 backdrop-blur-md'}`}>
      <span className={`absolute left-3 top-3 z-10 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.22em] shadow-md ${isP13 ? 'bg-orange-500 text-white' : isP20 ? 'bg-orange-700 text-white' : 'bg-amber-700 text-white'}`}>{isP13 ? 'Mais pedido' : isP20 ? 'Uso comercial' : 'Alta demanda'}</span>
      <div className={`relative aspect-[4/3] ${isP13 ? 'bg-white/10' : isP20 ? 'bg-slate-200/80' : 'bg-white/55'}`}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-contain p-6"
            priority={product.featured}
          />
        </div>
      <div className={`flex flex-1 flex-col gap-4 p-5 ${isP13 ? 'text-white' : 'text-foreground'}`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className={`text-xl font-semibold ${isP13 ? 'text-white' : 'text-foreground'}`}>{product.name}</h3>
            <p className={`mt-1 text-sm ${isP13 ? 'text-white/80' : isP20 ? 'text-foreground/60' : 'text-foreground/65'}`}>{product.description}</p>
          </div>
          {isP13 || product.slug === 'gas-p20' || product.slug === 'gas-p45' ? <Flame className={`h-5 w-5 ${isP13 ? 'text-red-500' : product.slug === 'gas-p20' ? 'text-orange-500' : 'text-amber-600'}`} /> : null}
        </div>
        <div className="flex flex-wrap gap-2" />
        <div className={`rounded-[1.35rem] border ${isP13 ? 'border-white/10 bg-white/10' : isP20 ? 'border-slate-300 bg-white/55' : 'border-white/30 bg-white/60'} p-4`}>
          <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${isP13 ? 'text-white/70' : 'text-foreground/50'}`}>{selectedCity ? `Preço em ${cityLabel(selectedCity)}` : 'Selecione sua cidade para consultar o preço'}</p>
          <p className={`mt-1 text-2xl font-semibold ${isP13 ? 'text-white' : 'text-foreground'}`}>{formatCurrency(price)}</p>
        </div>
        {!product.available ? (
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50/80 px-3 py-2 text-sm text-amber-900 backdrop-blur-sm">
            <TriangleAlert className="h-4 w-4" />
            Produto indisponível
          </div>
        ) : null}
        <div className="mt-auto">
          <Link
            href={`/pedido?produto=${product.id}`}
            onClick={() => trackEvent({ name: 'click_product', params: { product: product.slug, city: selectedCity ?? city } })}
            className="inline-flex w-full items-center justify-center rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600"
          >
            {product.slug === 'gas-p13' ? 'Pedir P13' : product.slug === 'gas-p20' ? 'Pedir P20' : 'Pedir P45'}
          </Link>
        </div>
      </div>
    </article>
  );
}
