"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { type CityKey } from '@/lib/site-data';
import { getLocalStorage, setLocalStorage } from '@/lib/utils';

const STORAGE_KEY = 'telegas:city';

type CityContextValue = {
  city: CityKey;
  setCity: (city: CityKey) => void;
};

const CityContext = createContext<CityContextValue | null>(null);

export function CityProvider({ children }: { children: ReactNode }) {
  const [city, setCityState] = useState<CityKey>('aquidauana');

  useEffect(() => {
    setCityState(getLocalStorage<CityKey>(STORAGE_KEY, 'aquidauana'));
  }, []);

  const setCity = (nextCity: CityKey) => {
    setCityState(nextCity);
    setLocalStorage(STORAGE_KEY, nextCity);
  };

  const value = useMemo(() => ({ city, setCity }), [city]);

  return <CityContext.Provider value={value}>{children}</CityContext.Provider>;
}

export function useCity() {
  const context = useContext(CityContext);
  if (!context) throw new Error('useCity must be used within CityProvider');
  return context;
}
