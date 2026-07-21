"use client";

import { MapPin } from 'lucide-react';
import { cities } from '@/lib/site-data';
import { useCity } from './city-provider';
import { trackEvent } from '@/lib/analytics';

export function CitySelector() {
  const { city, setCity } = useCity();

  return (
    <section className="rounded-3xl border border-border bg-white p-6 shadow-soft">
      <div className="flex items-center gap-3">
        <MapPin className="h-5 w-5 text-brand-600" />
        <h2 className="text-xl font-semibold text-foreground">Em qual cidade você está?</h2>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {cities.map((item) => {
          const active = item.key === city;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => {
                setCity(item.key);
                trackEvent({ name: 'city_selected', params: { city: item.key } });
              }}
              className={`rounded-2xl border px-4 py-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${active ? 'border-brand-500 bg-brand-50' : 'border-border bg-slate-50 hover:bg-slate-100'}`}
            >
              <span className="block text-sm text-foreground/60">Cidade</span>
              <span className="block text-lg font-semibold text-foreground">{item.label}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-sm text-foreground/60">A seleção fica salva neste dispositivo e pode ser alterada a qualquer momento.</p>
    </section>
  );
}
