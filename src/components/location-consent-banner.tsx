"use client";

import { useEffect, useState } from 'react';
import { MapPin, ShieldCheck, X } from 'lucide-react';
import { getLocalStorage, setLocalStorage } from '@/lib/utils';
import { nearestBranch } from '@/lib/location-utils';
import { aquidauanaBranches } from '@/lib/site-data';

type SavedLocation = { accepted: boolean; branchKey?: string };

const STORAGE_KEY = 'telegas:location-consent';

export function LocationConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [branchName, setBranchName] = useState<string | null>(null);

  useEffect(() => {
    const saved = getLocalStorage<SavedLocation | null>(STORAGE_KEY, null);
    if (!saved?.accepted) setVisible(true);
    else if (saved.branchKey) {
      const match = aquidauanaBranches.find((branch) => branch.key === saved.branchKey);
      if (match) setBranchName(match.name);
    }
  }, []);

  const requestLocation = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const branch = nearestBranch(
          { lat: position.coords.latitude, lng: position.coords.longitude },
          aquidauanaBranches
        );

        setBranchName(branch.name);
        setLocalStorage(STORAGE_KEY, { accepted: true, branchKey: branch.key });
        setVisible(false);
        window.dispatchEvent(new CustomEvent('telegas:location-updated', { detail: branch }));
      },
      () => {
        setLocalStorage(STORAGE_KEY, { accepted: true });
        setVisible(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  if (!visible) return branchName ? <div className="mx-auto max-w-7xl px-4 pt-3 sm:px-6 lg:px-8"><div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">Unidade sugerida: {branchName}</div></div> : null;

  return (
    <div className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-start gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-600"><MapPin className="h-5 w-5" /></div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">Usar sua localização?</p>
          <p className="mt-1 text-sm leading-6 text-foreground/70">Isso ajuda a sugerir a unidade mais próxima em Aquidauana para entrega mais rápida. Bairro e cidade continuam como confirmação no pedido.</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <button type="button" onClick={requestLocation} className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white"><ShieldCheck className="h-4 w-4" />Permitir localização</button>
            <button type="button" onClick={() => { setLocalStorage(STORAGE_KEY, { accepted: false }); setVisible(false); }} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-semibold text-foreground"><X className="h-4 w-4" />Agora não</button>
          </div>
        </div>
      </div>
    </div>
  );
}
