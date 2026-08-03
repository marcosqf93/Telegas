import type { Metadata } from 'next';
import { OfflineActions } from '@/components/offline-actions';

export const metadata: Metadata = {
  title: 'Offline',
  description: 'Página offline da Tele Gás.'
};

export default function OfflinePage() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-3xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-700">Modo offline</p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Você está sem conexão</h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-foreground/75">Acesse novamente quando a internet voltar para continuar navegando e fazer seu pedido.</p>
      <OfflineActions />
    </section>
  );
}
