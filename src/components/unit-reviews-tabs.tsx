"use client";

import { useState } from 'react';
import { aquidauanaReviews, anastacioReviews, mirandaReviews, type CityKey } from '@/lib/site-data';
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
  { key: 'anastacio', label: 'Anastácio', summary: 'Avaliações reais publicadas no Google.', score: '4,7', reviewsLabel: '4 avaliações' },
  { key: 'miranda', label: 'Miranda', summary: 'Avaliações reais publicadas no Google.', score: '5,0', reviewsLabel: '3 avaliações' }
];

export function UnitReviewsTabs() {
  const [active, setActive] = useState<CityKey>('aquidauana');

  const activeTab = tabs.find((tab) => tab.key === active) ?? tabs[0];

  const reviewsByTab = {
    aquidauana: aquidauanaReviews,
    anastacio: anastacioReviews,
    miranda: mirandaReviews
  } as const;

  return (
    <section className="rounded-[2rem] border border-white/25 bg-white/70 p-4 shadow-[0_12px_30px_rgba(0,0,0,0.08)] backdrop-blur-md sm:p-6">
      <div className="flex gap-2 overflow-x-auto rounded-full border border-white/25 bg-white/60 p-1.5 sm:inline-flex sm:w-auto sm:backdrop-blur-md">
        {tabs.map((tab) => {
          const isActive = tab.key === active;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActive(tab.key)}
              className={`min-w-0 flex-1 rounded-full px-3 py-2 text-xs font-semibold transition sm:flex-none sm:px-4 sm:py-2.5 sm:text-sm ${isActive ? 'bg-gradient-to-r from-sky-950 via-cyan-950 to-slate-900 text-white shadow-sm ring-1 ring-cyan-950/20' : 'text-foreground/60 hover:text-foreground'}`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="mt-5 space-y-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/70 px-3 py-2 text-sm font-semibold text-foreground backdrop-blur-sm">
            <span aria-hidden="true" className="inline-flex items-center gap-[1px] text-[12px] font-bold leading-none">
              <span className="text-blue-600">G</span><span className="text-red-500">o</span><span className="text-yellow-500">o</span><span className="text-blue-600">g</span><span className="text-green-600">l</span><span className="text-red-500">e</span>
            </span>
            <span className="text-foreground/40">•</span>
            {activeTab.score}
            <span className="text-lg leading-none text-amber-500" aria-hidden="true">★</span>
          </span>
          <span className="text-sm text-foreground/60">{activeTab.reviewsLabel}</span>
        </div>
        <div className="overflow-hidden rounded-[1.75rem] border border-white/20 bg-graphite/95 p-2 shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
          <AutoSlideReviews reviews={reviewsByTab[active]} />
        </div>
      </div>
    </section>
  );
}
