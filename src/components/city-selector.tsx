"use client";

import { MapPin } from 'lucide-react';
import { cities } from '@/lib/site-data';
import { useCity } from './city-provider';
import { trackEvent } from '@/lib/analytics';

export function CitySelector() {
  const { city, hasSelectedCity, setCity } = useCity();

  return (
    <section className="rounded-[1.4rem] border border-white/20 bg-white/10 p-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.18)] backdrop-blur-md sm:p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/15">
          <MapPin className="h-4 w-4 text-white" />
        </div>
        <h2 className="text-base font-semibold text-white sm:text-lg">Em qual cidade você está?</h2>
      </div>
      <label className="mt-3 block sm:mt-4">
        <span className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-white/70">Cidade</span>
        <select
          value={hasSelectedCity ? city : ''}
          onChange={(event) => {
            const nextCity = event.target.value as (typeof cities)[number]['key'];
            setCity(nextCity);
            trackEvent({ name: 'city_selected', params: { city: nextCity } });
          }}
          className="w-full rounded-[1.4rem] border border-white/20 bg-white/90 px-4 py-2.5 text-sm font-semibold text-foreground outline-none transition focus:border-brand-500 focus:bg-white sm:py-3 sm:text-base"
        >
          <option value="" disabled>Selecione</option>
          {cities.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
        </select>
      </label>
      <p className="mt-2 text-xs text-white/70 sm:mt-3 sm:text-sm">Selecione sua cidade para consultar o preço.</p>
    </section>
  );
}
