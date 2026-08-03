import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { contactChannels, units } from '@/lib/site-data';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contato',
  description: 'Canais de contato e atendimento da Tele Gás.',
  alternates: { canonical: '/contato' }
};

export default function ContatoPage() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative min-h-[420px] w-full bg-[length:100%_auto] bg-center bg-no-repeat sm:min-h-[520px] lg:min-h-[600px]" style={{ backgroundImage: "url('https://i.postimg.cc/jqp2JKcq/Chat-GPT-Image-31-de-jul-de-2026-08-27-45.png')" }} aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,11,11,0.18),rgba(11,11,11,0.68))]" />
        <div className="relative mx-auto flex min-h-[420px] max-w-7xl flex-col justify-end px-4 py-12 text-white sm:min-h-[520px] sm:px-6 lg:min-h-[600px] lg:px-8">
          <Breadcrumbs className="text-white/80" items={[{ label: 'Início', href: '/' }, { label: 'Contato' }]} />
          <h1 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">Fale com a Tele Gás</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-white/85">Canal central para dúvidas, comercial e suporte.</p>
        </div>
      </div>
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-[1.75rem] border border-white/25 bg-white/70 p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)] backdrop-blur-md"><p className="font-semibold text-foreground">WhatsApp</p><p className="mt-2 text-sm text-foreground/70">Use a unidade da sua cidade na página de pedido.</p></div>
          <div className="rounded-[1.75rem] border border-white/25 bg-white/70 p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)] backdrop-blur-md"><p className="font-semibold text-foreground">Email</p><p className="mt-2 text-sm text-foreground/70">{contactChannels.email}</p></div>
          <div className="rounded-[1.75rem] border border-white/25 bg-white/70 p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)] backdrop-blur-md"><p className="font-semibold text-foreground">Instagram</p><p className="mt-2 text-sm text-foreground/70"><a href={contactChannels.instagram ?? '#'} target="_blank" rel="noreferrer">Instagram da matriz</a></p></div>
          <div className="rounded-[1.75rem] border border-white/25 bg-white/70 p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)] backdrop-blur-md"><p className="font-semibold text-foreground">Google</p><p className="mt-2 text-sm text-foreground/70"><a href={contactChannels.googleReview ?? '#'} target="_blank" rel="noreferrer">Abrir perfil no Google</a></p></div>
          <div className="rounded-[1.75rem] border border-white/25 bg-white/70 p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)] backdrop-blur-md"><p className="font-semibold text-foreground">Unidades</p><ul className="mt-2 text-sm text-foreground/70">{units.map((unit) => <li key={unit.key}><Link href={`/unidades/${unit.key}`}>{unit.city}</Link></li>)}</ul></div>
        </div>
      </div>
    </section>
  );
}
