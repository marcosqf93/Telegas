import type { Metadata } from 'next';
import { SectionHeading } from '@/components/ui/section-heading';
import { faq } from '@/lib/site-data';
import { FaqAccordion } from '@/components/faq-accordion';
import { JsonLd } from '@/components/json-ld';
import { Breadcrumbs } from '@/components/breadcrumbs';

export const metadata: Metadata = {
  title: 'Dúvidas',
  description: 'Perguntas frequentes sobre pedido, entrega e atendimento.',
  alternates: { canonical: '/duvidas' }
};

export default function DuvidasPage() {
  return <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8"><Breadcrumbs items={[{ label: 'Início', href: '/' }, { label: 'Dúvidas' }]} /><SectionHeading eyebrow="FAQ" title="Perguntas frequentes" /><JsonLd data={{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) }} /><FaqAccordion items={faq} /></section>;
}
