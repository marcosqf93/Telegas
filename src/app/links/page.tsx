import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { brand, promotion, units } from '@/lib/site-data';
import { buildWhatsAppUrl } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Links',
  description: 'Página otimizada para link da bio da Tele Gás.',
  alternates: { canonical: '/links' }
};

const links = [
  ['Pedir gás', '/pedido'],
  ['Aquidauana', '/unidades/aquidauana'],
  ['Anastácio', '/unidades/anastacio'],
  ['Miranda', '/unidades/miranda'],
  ['Chama Premiada', '/chama-premiada'],
  ['Contato', '/contato']
] as const;

export default function LinksPage() {
  const whatsappHref = buildWhatsAppUrl(units[0].whatsapp, 'Olá, quero falar com a Tele Gás.');
  const whatsappExternal = whatsappHref.startsWith('http');

  return <section className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-xl flex-col items-center px-4 py-10 text-center sm:px-6 lg:px-8"><div className="w-full rounded-[2rem] border border-border bg-white p-6 shadow-soft"><div className="relative mx-auto h-14 w-40 overflow-hidden rounded-2xl border border-brand-500/20 bg-white px-2 py-1 shadow-sm"><Image src={brand.logo} alt={brand.name} fill sizes="160px" className="object-contain" /></div><h1 className="mt-4 text-3xl font-semibold text-brand-700">Links rápidos</h1><p className="mt-2 text-sm text-foreground/70">Acesse os principais canais da Tele Gás sem perder o foco no pedido.</p><div className="mt-6 grid gap-3">{links.map(([label, href]) => <Link key={href} href={href} className="rounded-2xl bg-slate-50 px-4 py-4 font-semibold text-foreground hover:bg-slate-100">{label}</Link>)}<a href={whatsappHref} target={whatsappExternal ? '_blank' : undefined} rel={whatsappExternal ? 'noreferrer' : undefined} className="rounded-2xl bg-brand-500 px-4 py-4 font-semibold text-white">WhatsApp</a><a href={brand.social.instagram} target="_blank" rel="noreferrer" className="rounded-2xl bg-slate-50 px-4 py-4 font-semibold text-foreground/70">Instagram da matriz</a><a href={brand.social.googleReview} target="_blank" rel="noreferrer" className="rounded-2xl bg-slate-50 px-4 py-4 font-semibold text-foreground/70">Google</a></div><Link href="/chama-premiada" className="mt-6 block rounded-2xl bg-brand-500 px-4 py-4 font-semibold text-white">{promotion.title}</Link></div></section>;
}
