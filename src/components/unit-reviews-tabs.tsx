"use client";

import { useState } from 'react';
import Link from 'next/link';
import { aquidauanaReviews, brand, type CityKey } from '@/lib/site-data';
import { AutoSlideReviews } from '@/app/unidades/aquidauana/reviews-auto-slide';

type UnitReviewTab = {
  key: CityKey;
  label: string;
  summary: string;
  score: string;
  reviewsLabel: string;
};

const tabs: UnitReviewTab[] = [
  { key: 'aquidauana', label: 'Aquidauana', summary: 'Avaliações reais publicadas no Google.', score: '5,0', reviewsLabel: '2 mil+ avaliações' },
  { key: 'anastacio', label: 'Anastácio', summary: 'Avaliações em preparação.', score: 'a confirmar', reviewsLabel: 'a confirmar' },
  { key: 'miranda', label: 'Miranda', summary: 'Avaliações em preparação.', score: 'a confirmar', reviewsLabel: 'a confirmar' }
];

export function UnitReviewsTabs() {
  const [active, setActive] = useState<CityKey>('aquidauana');

  const activeIndex = tabs.findIndex((tab) => tab.key === active);

  return (
    <section className="rounded-[2rem] border border-border bg-white p-4 shadow-soft sm:p-6">
      <div className="flex gap-2 overflow-x-auto rounded-full bg-slate-100 p-1.5 sm:inline-flex sm:w-auto">
        {tabs.map((tab) => {
          const isActive = tab.key === active;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActive(tab.key)}
              className={`min-w-0 flex-1 rounded-full px-3 py-2 text-xs font-semibold transition sm:flex-none sm:px-4 sm:py-2.5 sm:text-sm ${isActive ? 'bg-gradient-to-r from-brand-500 via-brand-600 to-brand-700 text-white shadow-sm ring-1 ring-brand-700/20' : 'text-foreground/60 hover:text-foreground'}`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="mt-5 overflow-hidden">
        <div className="flex transition-[transform,opacity] duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform" style={{ transform: `translate3d(-${activeIndex * 100}%,0,0)`, width: `${tabs.length * 100}%`, opacity: 1 }}>
          {tabs.map((tab) => {
            return (
              <div key={tab.key} className="shrink-0 px-0 lg:px-0" style={{ width: `${100 / tabs.length}%` }}>
                <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-2 text-sm font-semibold text-foreground">
                        <span className="text-brand-500" aria-hidden="true">★</span>
                        Google
                        <span className="text-foreground/40">•</span>
                        {tab.score}
                      </span>
                      <span className="text-sm text-foreground/60">{tab.reviewsLabel}</span>
                    </div>

                    {tab.key === 'aquidauana' ? (
                      <div className="mt-5">
                        <AutoSlideReviews reviews={aquidauanaReviews} />
                      </div>
                    ) : (
                      <div className="mt-5 rounded-2xl bg-slate-50 p-5">
                        <p className="text-sm text-foreground/70">{tab.summary}</p>
                        <p className="mt-2 text-sm text-foreground/55">Quando os comentários reais forem confirmados, esta aba passa a exibi-los em texto, no mesmo padrão da matriz.</p>
                      </div>
                    )}
                  </div>

                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 text-white">
                    <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('${brand.heroImage}')` }} aria-hidden="true" />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,75,0,0.18),rgba(11,11,11,0.72))]" />
                    <div className="relative flex min-h-[320px] flex-col justify-end p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="mt-2 text-2xl font-semibold">{tab.label}</h3>
                          <p className="mt-2 text-sm leading-6 text-white/75">{tab.summary}</p>
                        </div>
                      </div>
                      <div className="mt-6 flex flex-wrap gap-3">
                        <Link href={`/unidades/${tab.key}`} className="rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white">Ver unidade</Link>
                        <Link href="/avaliacoes" className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white">Todas as avaliações</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
