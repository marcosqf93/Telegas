import Link from 'next/link';
import { brand } from '@/lib/site-data';
import { ButtonLink } from './ui/button';
import { MobileMenu } from './mobile-menu';

export function Header() {
  return (
    <header className="sticky top-0 z-50 relative border-b border-border bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-8 w-20 sm:h-11 sm:w-28">
            <img src={brand.logo} alt={brand.name} className="h-full w-full object-contain object-left" loading="eager" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wide text-foreground">{brand.name}</p>
            <p className="text-xs text-foreground/60">GLP Aquidauana, Anastácio e Miranda</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/" className="transition hover:text-brand-500">Início</Link>
          <Link href="/produtos" className="transition hover:text-brand-500">Produtos</Link>
          <Link href="/promocoes" className="transition hover:text-brand-500">Promoções</Link>
          <Link href="/sobre" className="transition hover:text-brand-500">Sobre</Link>
          <Link href="/unidades" className="transition hover:text-brand-500">Unidades</Link>
          <Link href="/contato" className="transition hover:text-brand-500">Contato</Link>
        </nav>
        <div className="hidden md:block">
          <ButtonLink href="/pedido" className="px-5 py-3">Pedir gás</ButtonLink>
        </div>
        <MobileMenu />
      </div>
    </header>
  );
}
