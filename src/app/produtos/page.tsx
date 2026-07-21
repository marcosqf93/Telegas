import type { Metadata } from 'next';
import { SectionHeading } from '@/components/ui/section-heading';
import { ProductGrid } from '@/components/product-grid';
import { JsonLd } from '@/components/json-ld';
import { products } from '@/lib/site-data';
import { Breadcrumbs } from '@/components/breadcrumbs';

export const metadata: Metadata = {
  title: 'Produtos',
  description: 'Veja os produtos de GLP da Tele Gás: P13, P20 e P45.',
  alternates: { canonical: '/produtos' }
};

export default function ProdutosPage() {
  return <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-6"><Breadcrumbs items={[{ label: 'Início', href: '/' }, { label: 'Produtos' }]} /><SectionHeading eyebrow="Produtos" title="Escolha o botijão certo" description="Os preços são exibidos conforme a cidade selecionada." /><JsonLd data={products.map((product) => ({ '@context': 'https://schema.org', '@type': 'Product', name: product.name, description: product.description, offers: Object.entries(product.pricesByUnit).map(([city, price]) => ({ '@type': 'Offer', areaServed: city, priceCurrency: 'BRL', price: price ?? undefined, availability: product.available ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' })) }))} /><div className="mt-8"><ProductGrid /></div></section>;
}
