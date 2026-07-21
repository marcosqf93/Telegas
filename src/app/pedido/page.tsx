import type { Metadata } from 'next';
import { SectionHeading } from '@/components/ui/section-heading';
import { OrderWizard } from '@/components/order-wizard';

export const metadata: Metadata = {
  title: 'Pedido',
  description: 'Fluxo de pedido da Tele Gás com etapas e resumo final.',
  alternates: { canonical: '/pedido' }
};

export default async function PedidoPage(props: { searchParams?: Promise<{ cidade?: string; produto?: string }> }) {
  const searchParams = (await props.searchParams) ?? {};

  return <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8"><SectionHeading eyebrow="Pedido" title="Faça seu pedido" description="Fluxo de múltiplas etapas com validação, resumo e abertura final no WhatsApp." /><OrderWizard defaultCity={searchParams.cidade} defaultProduct={searchParams.produto} /></section>;
}
