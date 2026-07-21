import { products } from '@/lib/site-data';
import { ProductCard } from './product-card';
import { EmptyState } from './ui/empty-state';

export function ProductGrid() {
  if (!products.length) {
    return <EmptyState title="Produtos em atualização" description="A lista de produtos será preenchida após a confirmação do catálogo com o cliente." actionHref="/contato" actionLabel="Falar com a Tele Gás" />;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
