"use client";

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const items = [
  ['Início', '/'],
  ['Produtos', '/produtos'],
  ['Promoções', '/promocoes'],
  ['Sobre', '/sobre'],
  ['Unidades', '/unidades'],
  ['Contato', '/contato']
] as const;

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label="Abrir menu"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/25 bg-white/10 text-white"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      {open ? (
        <div id="mobile-menu" className="absolute left-0 top-full w-full border-b border-white/15 bg-[linear-gradient(180deg,#ff7a1a_0%,#ff5a1f_100%)] shadow-soft">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            <nav className="grid gap-2">
              {items.map(([label, href]) => (
                <Link key={href} href={href} onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 font-medium text-white transition hover:bg-white/10 hover:text-white/90">
                  {label}
                </Link>
              ))}
              <Link href="/pedido" onClick={() => setOpen(false)} className="mt-2 inline-flex items-center justify-center rounded-full bg-white px-5 py-3 font-semibold text-brand-700">
                Pedir meu gás
              </Link>
            </nav>
          </div>
        </div>
      ) : null}
    </div>
  );
}
