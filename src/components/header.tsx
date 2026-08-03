"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { brand } from '@/lib/site-data';
import { ButtonLink } from './ui/button';
import { MobileMenu } from './mobile-menu';

export function Header() {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) return null;

  return (
    <header className="sticky top-0 z-50 relative border-b border-white/20 bg-[linear-gradient(90deg,#ff7a1a_0%,#ff5a1f_45%,#e34c17_100%)] text-white backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-8 w-20 overflow-hidden rounded-full border border-white/20 bg-white px-2 py-1 shadow-sm sm:h-11 sm:w-28">
            <img src={brand.logo} alt={brand.name} className="h-full w-full object-contain object-left" loading="eager" />
          </div>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/" className="transition hover:text-white/80">Início</Link>
          <Link href="/produtos" className="transition hover:text-white/80">Produtos</Link>
          <Link href="/promocoes" className="transition hover:text-white/80">Promoções</Link>
          <Link href="/sobre" className="transition hover:text-white/80">Sobre</Link>
          <Link href="/unidades" className="transition hover:text-white/80">Unidades</Link>
          <Link href="/contato" className="transition hover:text-white/80">Contato</Link>
        </nav>
        <div className="hidden md:block">
          <ButtonLink href="/pedido" className="bg-white px-5 py-3 !text-brand-700 hover:bg-orange-50 [&_svg]:!text-brand-700">Pedir meu gás</ButtonLink>
        </div>
        <MobileMenu />
      </div>
    </header>
  );
}
