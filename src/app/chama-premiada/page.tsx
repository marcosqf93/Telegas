import type { Metadata } from 'next';
import { SectionHeading } from '@/components/ui/section-heading';
import { ButtonLink } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/breadcrumbs';

export const metadata: Metadata = {
  title: 'Chama Premiada',
  description: 'Página da promoção Chama Premiada.',
  alternates: { canonical: '/chama-premiada' }
};

export default function ChamaPremiadaPage() {
  return (
    <section className="mx-auto max-w-7xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'Início', href: '/' }, { label: 'Chama Premiada' }]} />
      <SectionHeading eyebrow="Promoção" title="Chama Premiada" description="Acompanhe as regras, datas e ganhadores da campanha oficial." />
      <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Como participar</h2>
            <p className="mt-3 text-sm leading-6 text-foreground/75">As orientações da campanha ficam publicadas nesta página quando houver atualização oficial.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4"><strong className="block">Datas</strong><span className="text-sm text-foreground/70">Consulte a campanha</span></div>
            <div className="rounded-2xl bg-slate-50 p-4"><strong className="block">Premiações</strong><span className="text-sm text-foreground/70">Consulte a campanha</span></div>
            <div className="rounded-2xl bg-slate-50 p-4"><strong className="block">Regulamento</strong><span className="text-sm text-foreground/70">Consulte a campanha</span></div>
            <div className="rounded-2xl bg-slate-50 p-4"><strong className="block">Últimos ganhadores</strong><span className="text-sm text-foreground/70">Consulte a campanha</span></div>
          </div>
          <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Galeria</h2>
            <p className="mt-3 text-sm leading-6 text-foreground/75">Fotos oficiais da campanha, entrega e ganhadores.</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="aspect-square rounded-2xl bg-slate-100" />
              <div className="aspect-square rounded-2xl bg-slate-100" />
              <div className="aspect-square rounded-2xl bg-slate-100" />
              <div className="aspect-square rounded-2xl bg-slate-100" />
            </div>
          </div>
        </div>
        <div className="rounded-3xl bg-brand-500 p-6 text-white shadow-sm">
          <h2 className="text-xl font-semibold">Acompanhe a campanha</h2>
          <p className="mt-3 text-sm leading-6 text-white/80">As atualizações aparecem aqui e nas unidades participantes.</p>
          <ButtonLink href="/pedido" className="mt-5 bg-white text-foreground hover:bg-slate-100">Pedir gás</ButtonLink>
        </div>
      </div>
    </section>
  );
}
