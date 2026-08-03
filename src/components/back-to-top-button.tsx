"use client";

import { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';

export function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Voltar ao topo"
      className="fixed bottom-20 right-4 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-500 text-white shadow-lg transition hover:bg-brand-600 md:bottom-6 md:right-6"
    >
      <ChevronUp className="h-5 w-5" />
    </button>
  );
}
