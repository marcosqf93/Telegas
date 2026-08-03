"use client";

import { usePathname } from 'next/navigation';
import { Footer } from './footer';
import { FloatingOrderCTA } from './floating-order-cta';
import { BackToTopButton } from './back-to-top-button';

export function SiteChrome() {
  const pathname = usePathname();

  if (pathname.startsWith('/pedido') || pathname.startsWith('/admin')) return null;

  return (
    <>
      <Footer />
      <FloatingOrderCTA />
      <BackToTopButton />
    </>
  );
}
