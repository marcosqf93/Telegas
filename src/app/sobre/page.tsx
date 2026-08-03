import type { Metadata } from 'next';
import Image from 'next/image';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Timeline } from '@/components/timeline';
import { timeline } from '@/lib/site-data';

export const metadata: Metadata = {
  title: 'Sobre',
  description: 'História da Tele Gás e linha do tempo da empresa.',
  alternates: { canonical: '/sobre' }
};

export default function SobrePage() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('https://i.postimg.cc/3wv1zZ1G/unnamed.webp')" }} aria-hidden="true" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,11,11,0.70),rgba(11,11,11,0.82))]" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
        <Breadcrumbs className="text-white/80" items={[{ label: 'Início', href: '/' }, { label: 'Sobre' }]} />
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="space-y-6 text-white">
            <div className="max-w-3xl space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">A história da Tele Gás</h1>
              <p className="text-base leading-7 text-white/80">Conheça a trajetória da empresa desde a fundação até a expansão regional.</p>
            </div>

            <div className="overflow-hidden rounded-[1.75rem] border border-white/25 bg-white/70 shadow-[0_12px_30px_rgba(0,0,0,0.08)] backdrop-blur-md">
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src="https://i.postimg.cc/ZYjdJDf0/j7s-Pj-L7NAwpn-D3IOQ6owh-Ke69d8237B5JRky-Z7JY.png"
                  alt="Equipe da Tele Gás"
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
              </div>
              <div className="space-y-4 p-5 text-sm leading-7 text-foreground/75 sm:p-6">
                <p><strong className="text-foreground">2004.</strong> Os irmãos Claudinei Almeida de Andrade e Cleiton Almeida de Andrade fundaram a TELEGÁS em um espaço alugado, com apenas uma moto para as entregas, feitas por eles mesmos.</p>
                <p><strong className="text-foreground">2006.</strong> A operação já contava com cinco colaboradores nas entregas.</p>
                <p><strong className="text-foreground">2009.</strong> A empresa construiu sede própria e passou por informatização completa, do pedido à entrega, com softwares criados para otimizar o atendimento.</p>
                <p><strong className="text-foreground">2011.</strong> A SUPERGASBRAS reconheceu nacionalmente o trabalho dos irmãos, destacando a agilidade da TELEGÁS, com entregas em até 15 minutos.</p>
                <p><strong className="text-foreground">2012 e 2017.</strong> A expansão seguiu com a primeira filial em Anastácio e, depois, com a segunda filial em Miranda.</p>
                <p>Hoje, a TELEGÁS cresceu e é administrada pelos irmãos em Aquidauana, cidade-sede, além de outras filiais que atendem cidades do sul de Mato Grosso do Sul.</p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/25 bg-white/70 p-4 shadow-[0_12px_30px_rgba(0,0,0,0.08)] backdrop-blur-md sm:p-6 lg:sticky lg:top-24">
            <h3 className="text-xl font-semibold text-foreground">Linha do tempo</h3>
            <div className="mt-4">
              <Timeline items={timeline} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
