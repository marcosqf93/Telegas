import type { Metadata } from 'next';
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
  return (
    <section className="relative overflow-hidden">
      <div className="relative min-h-[420px] w-full bg-[length:100%_auto] bg-center bg-no-repeat sm:min-h-[520px] lg:min-h-[600px]" style={{ backgroundImage: "url('https://i.postimg.cc/MKLDBn4V/Chat-GPT-Image-31-de-jul-de-2026-08-33-13.png')" }} aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,11,11,0.18),rgba(11,11,11,0.68))]" />
        <div className="relative mx-auto flex min-h-[420px] max-w-7xl flex-col justify-end px-4 py-12 text-white sm:min-h-[520px] sm:px-6 lg:min-h-[600px] lg:px-8">
          <Breadcrumbs className="text-white/80" items={[{ label: 'Início', href: '/' }, { label: 'Produtos' }]} />
          <h1 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">Escolha o botijão certo</h1>
        </div>
      </div>
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <JsonLd data={products.map((product) => ({ '@context': 'https://schema.org', '@type': 'Product', name: product.name, description: product.description, offers: Object.entries(product.pricesByUnit).map(([city, price]) => ({ '@type': 'Offer', areaServed: city, priceCurrency: 'BRL', price: price ?? undefined, availability: product.available ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' })) }))} />
        <div className="rounded-[1.75rem] border border-white/25 bg-white/70 p-4 shadow-[0_12px_30px_rgba(0,0,0,0.08)] backdrop-blur-md sm:p-6"><ProductGrid /></div>
      </div>
    </section>
  );
}
