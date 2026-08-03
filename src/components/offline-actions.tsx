"use client";

import Link from 'next/link';

export function OfflineActions() {
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600"
      >
        Tentar novamente
      </button>
      <Link href="/" className="rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-slate-50">
        Ir para início
      </Link>
      <Link href="/pedido" className="rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-slate-50">
        Fazer pedido
      </Link>
    </div>
  );
}
