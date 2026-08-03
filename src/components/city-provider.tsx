"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { type CityKey } from '@/lib/site-data';
import { getLocalStorage, setLocalStorage } from '@/lib/utils';

const STORAGE_KEY = 'telegas:city';

type CityContextValue = {
  city: CityKey;
  hasSelectedCity: boolean;
  setCity: (city: CityKey) => void;
};

const CityContext = createContext<CityContextValue | null>(null);

export function CityProvider({ children }: { children: ReactNode }) {
  const [city, setCityState] = useState<CityKey>('aquidauana');
  const [hasSelectedCity, setHasSelectedCity] = useState(false);

  useEffect(() => {
    const storedCity = getLocalStorage<CityKey | null>(STORAGE_KEY, null);
    if (storedCity) {
      setCityState(storedCity);
      setHasSelectedCity(true);
    }
  }, []);

  useEffect(() => {
    const onCityUpdated = (event: Event) => {
      const detail = (event as CustomEvent<{ city: CityKey }>).detail;
      if (!detail?.city) return;
      setCityState(detail.city);
      setHasSelectedCity(true);
      setLocalStorage(STORAGE_KEY, detail.city);
    };

    window.addEventListener('telegas:city-updated', onCityUpdated as EventListener);
    return () => window.removeEventListener('telegas:city-updated', onCityUpdated as EventListener);
  }, []);

  const setCity = (nextCity: CityKey) => {
    setCityState(nextCity);
    setHasSelectedCity(true);
    setLocalStorage(STORAGE_KEY, nextCity);
  };

  const value = useMemo(() => ({ city, hasSelectedCity, setCity }), [city, hasSelectedCity]);

  return <CityContext.Provider value={value}>{children}</CityContext.Provider>;
}

export function useCity() {
  const context = useContext(CityContext);
  if (!context) throw new Error('useCity must be used within CityProvider');
  return context;
}
