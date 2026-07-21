import type { Metadata } from 'next';
import { SectionHeading } from '@/components/ui/section-heading';

export const metadata: Metadata = {
  title: 'Termos de Uso',
  description: 'Termos de uso do site oficial da Tele Gás.',
  alternates: { canonical: '/termos-de-uso' }
};

export default function Termos() {
  return <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-6"><SectionHeading eyebrow="Termos" title="Termos de Uso" description="Estrutura inicial para revisão jurídica e comercial." /><div className="space-y-4 text-sm leading-7 text-foreground/75"><p>O site disponibiliza informações comerciais, canais de contato e fluxo de pedido.</p><p>Preços, horários e dados cadastrais devem ser validados antes da publicação definitiva.</p><p>Integrações de analytics e painel administrativo dependem de credenciais próprias da empresa.</p></div></section>;
}
