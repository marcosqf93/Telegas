import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { aquidauanaBranches, anastacioBranches, units } from '@/lib/site-data';
import { UnitCard } from '@/components/unit-card';
import { UnitCarouselCard } from '@/components/unit-carousel-card';

export const metadata: Metadata = {
  title: 'Unidades',
  description: 'Conheça as unidades da Tele Gás em Aquidauana, Anastácio e Miranda.',
  alternates: { canonical: '/unidades' }
};

export default function UnidadesPage() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative min-h-[420px] w-full bg-[length:100%_auto] bg-center bg-no-repeat sm:min-h-[520px] lg:min-h-[600px]" style={{ backgroundImage: "url('https://i.postimg.cc/252ZNJ4v/Chat-GPT-Image-31-de-jul-de-2026-07-54-05.png')" }} aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,11,11,0.18),rgba(11,11,11,0.70))]" />
        <div className="relative mx-auto flex min-h-[420px] max-w-7xl flex-col justify-end px-4 py-12 text-white sm:min-h-[520px] sm:px-6 lg:min-h-[600px] lg:px-8">
          <Breadcrumbs className="text-white/80" items={[{ label: 'Início', href: '/' }, { label: 'Unidades' }]} />
          <h1 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">Encontre a Tele Gás mais próxima</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-white/85">Consulte endereço, horário, contato e avaliações das unidades em Aquidauana, Anastácio e Miranda.</p>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          <UnitCarouselCard
            unit={units[0]}
            slides={aquidauanaBranches.map((branch) => ({
              key: branch.key,
              title: branch.name,
              address: branch.address,
              phoneDisplay: branch.phoneDisplay,
              whatsappDisplay: branch.whatsappDisplay,
              mapUrl: branch.mapUrl,
              image: branch.key === 'nova-aquidauana'
                ? 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkzdd1vpUGbrRFkSyElrq-KWG4qh7FnHansQCYYdf_1CpavPVQZB9ldlylugRs5vc1H6FesDmBZ4HdZzR57I-b7gmLgJWWUJ3oBF3ZhH6CGD1gQKBmbDDXCmdN4suWZL3JIKJsS2A=s680-w680-h510-rw'
                : branch.key === 'chapecoense'
                  ? 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkxuxk9oaGA6KebxeVDKmRdrZTslf6baO8KzqHZCNLdZvrOj4zdnM-crMgOma7rl070x6_5UeC0sqjLRdmsgwHuc2h5WY3Asp6ULq57cM9u8jGoYhG6RD4G3sH_t9Q-mJjQ2GYO=s680-w680-h510-rw'
                : undefined
            }))}
          />
          <UnitCarouselCard
            unit={units[1]}
            slides={anastacioBranches.map((branch) => ({
              key: branch.key,
              title: branch.name,
              address: branch.address,
              phoneDisplay: branch.phoneDisplay,
              whatsappDisplay: branch.whatsappDisplay,
              mapUrl: branch.mapUrl
            }))}
          />
          <UnitCard key={units[2].key} unit={units[2]} />
        </div>
      </div>
    </section>
  );
}
