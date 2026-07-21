"use client";

import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, Flame, TriangleAlert } from 'lucide-react';
import { cityLabel, formatCurrency } from '@/lib/utils';
import type { Product, CityKey } from '@/lib/site-data';
import { useCity } from './city-provider';
import { trackEvent } from '@/lib/analytics';

type Props = { product: Product; cityOverride?: CityKey };

export function ProductCard({ product, cityOverride }: Props) {
  const { city } = useCity();
  const selectedCity = cityOverride ?? city;
  const price = product.pricesByUnit[selectedCity];

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
      <div className="relative aspect-[4/3] bg-slate-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-contain p-6"
          priority={product.featured}
        />
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold text-foreground">{product.name}</h3>
            <p className="mt-1 text-sm text-foreground/70">{product.description}</p>
          </div>
          {product.featured ? <Flame className="h-5 w-5 text-brand-600" /> : null}
        </div>
        <p className="text-sm text-foreground/70">{product.useCase}</p>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/50">Preço em {cityLabel(selectedCity)}</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">{formatCurrency(price)}</p>
          <p className="mt-2 text-sm text-foreground/70">{product.deliveryInfo}</p>
        </div>
        {!product.available ? (
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-2 text-sm text-amber-900">
            <TriangleAlert className="h-4 w-4" />
            Produto indisponível
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
            <CheckCircle2 className="h-4 w-4" />
            Disponível para pedido
          </div>
        )}
        <div className="mt-auto">
          <Link
            href={`/pedido?produto=${product.id}`}
            onClick={() => trackEvent({ name: 'click_product', params: { product: product.slug, city: selectedCity } })}
            className="inline-flex w-full items-center justify-center rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600"
          >
            Pedir agora
          </Link>
        </div>
      </div>
    </article>
  );
}
