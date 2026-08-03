import type { Metadata } from 'next';
import { SectionHeading } from '@/components/ui/section-heading';
import { OrderWizard } from '@/components/order-wizard';

export const metadata: Metadata = {
  title: 'Pedido',
  description: 'Pedido de gás da Tele Gás.',
  alternates: { canonical: '/pedido' }
};

export default async function PedidoPage(props: { searchParams?: Promise<{ cidade?: string; produto?: string }> }) {
  const searchParams = (await props.searchParams) ?? {};

  return <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6 md:space-y-8"><div className="hidden md:block"><SectionHeading eyebrow="Pedido" title="Faça seu pedido" description="Preencha os dados e finalize no WhatsApp." /></div><OrderWizard defaultCity={searchParams.cidade} defaultProduct={searchParams.produto} /></section>;
}
