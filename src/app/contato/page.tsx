import type { Metadata } from 'next';
import { SectionHeading } from '@/components/ui/section-heading';
import { contactChannels, units } from '@/lib/site-data';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contato',
  description: 'Canais de contato e atendimento da Tele Gás.',
  alternates: { canonical: '/contato' }
};

export default function ContatoPage() {
  return <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8"><SectionHeading eyebrow="Contato" title="Fale com a Tele Gás" description="Canal central para dúvidas, comercial e suporte." /><div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"><div className="rounded-3xl border border-border bg-white p-6 shadow-sm"><p className="font-semibold">WhatsApp</p><p className="mt-2 text-sm text-foreground/70">Use a unidade da sua cidade na página de pedido.</p></div><div className="rounded-3xl border border-border bg-white p-6 shadow-sm"><p className="font-semibold">Email</p><p className="mt-2 text-sm text-foreground/70">{contactChannels.email}</p></div><div className="rounded-3xl border border-border bg-white p-6 shadow-sm"><p className="font-semibold">Instagram</p><p className="mt-2 text-sm text-foreground/70">Instagram a confirmar</p></div><div className="rounded-3xl border border-border bg-white p-6 shadow-sm"><p className="font-semibold">Google</p><p className="mt-2 text-sm text-foreground/70">Perfil no Google a confirmar</p></div><div className="rounded-3xl border border-border bg-white p-6 shadow-sm"><p className="font-semibold">Unidades</p><ul className="mt-2 text-sm text-foreground/70">{units.map((unit) => <li key={unit.key}><Link href={`/unidades/${unit.key}`}>{unit.city}</Link></li>)}</ul></div></div></section>;
}
