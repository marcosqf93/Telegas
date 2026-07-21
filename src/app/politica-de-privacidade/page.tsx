import type { Metadata } from 'next';
import { SectionHeading } from '@/components/ui/section-heading';

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description: 'Política de privacidade e tratamento de dados da Tele Gás.',
  alternates: { canonical: '/politica-de-privacidade' }
};

export default function Politica() {
  return <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-6"><SectionHeading eyebrow="Privacidade" title="Política de Privacidade" description="Documento-base para revisão jurídica antes da publicação final." /><div className="space-y-4 text-sm leading-7 text-foreground/75"><p>Os dados informados no pedido são usados para atendimento e comunicação do pedido.</p><p>O armazenamento local de nome e endereço depende do consentimento do usuário no fluxo de pedido.</p><p>Campos sensíveis, autenticação e integrações externas devem ser configurados com variáveis de ambiente e aprovação do cliente.</p></div></section>;
}
