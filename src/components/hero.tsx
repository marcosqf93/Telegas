import { brand, units } from '@/lib/site-data';
import { WhatsAppButton } from './whatsapp-button';
import { ButtonLink } from './ui/button';
import { CitySelector } from './city-selector';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-graphite text-white">
      <div
        className="absolute inset-0 bg-[length:115%_auto] bg-[position:75%_center] bg-no-repeat sm:bg-cover sm:bg-center"
        data-parallax
        style={{ backgroundImage: `url('https://i.postimg.cc/MGdQJ4yX/Chat-GPT-Image-31-de-jul-de-2026-07-44-58.png')` }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[length:105%_auto] bg-[position:75%_center] bg-no-repeat sm:hidden"
        data-parallax
        style={{ backgroundImage: `url('https://i.postimg.cc/mg7Zj8fy/Chat-GPT-Image-31-de-jul-de-2026-17-32-22.png')` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.85)_0%,rgba(0,0,0,0.45)_45%,rgba(0,0,0,0.08)_100%)]" aria-hidden="true" />
      <div className="relative mx-auto flex max-w-7xl px-4 py-16 sm:px-6 lg:min-h-[760px] lg:items-center lg:px-8 lg:py-24 xl:min-h-[840px]">
        <div className="max-w-2xl -translate-y-8 sm:translate-y-0 lg:-translate-y-16 xl:-translate-y-20">
          <h1 className="mt-6 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl xl:text-6xl">Pedir gás em Aquidauana, Anastácio e Miranda</h1>
          <p className="mt-5 hidden max-w-xl text-lg leading-8 text-white/80 md:block">Escolha sua cidade, veja o preço e finalize pelo WhatsApp com a unidade correta.</p>
          <div className="mt-8 hidden flex-wrap gap-3 md:flex">
            <ButtonLink href="/pedido" className="bg-brand-500 hover:bg-brand-600">Pedir gás agora</ButtonLink>
            <WhatsAppButton phone={units[0].whatsapp} message="Olá, quero fazer um pedido na Tele Gás." label="Falar pelo WhatsApp" className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-green-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-110" />
          </div>
          <div className="mt-3 max-w-xl text-foreground lg:mt-10">
            <CitySelector />
          </div>
        </div>
      </div>
    </section>
  );
}
