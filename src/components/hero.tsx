import { CheckCircle2 } from 'lucide-react';
import { brand, deliveryBenefits, units } from '@/lib/site-data';
import { WhatsAppButton } from './whatsapp-button';
import { ButtonLink } from './ui/button';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-graphite text-white">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        data-parallax
        style={{ backgroundImage: `url('${brand.heroImage}')` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,11,11,0.58),rgba(11,11,11,0.88))]" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
        <div className="max-w-2xl">
          <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">Seu gás entregue com rapidez e segurança.</h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-white/80">Entrega de gás P13, P20 e P45 em Aquidauana, Anastácio e Miranda. Escolha sua cidade e faça seu pedido.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/pedido" className="bg-brand-500 hover:bg-brand-600">Pedir gás agora</ButtonLink>
            <WhatsAppButton phone={units[0].whatsapp} message="Olá, quero fazer um pedido na Tele Gás." label="Falar pelo WhatsApp" className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-green-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-110" />
          </div>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {deliveryBenefits.map((item) => (
              <li key={item} className="inline-flex items-center gap-2 rounded-2xl bg-white/5 px-4 py-3 text-sm text-white/85">
                <CheckCircle2 className="h-4 w-4 text-brand-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
