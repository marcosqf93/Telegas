import Link from 'next/link';
import { brand, units, cnpj, contactChannels } from '@/lib/site-data';

export function Footer() {
  return (
    <footer className="border-t border-border bg-graphite text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:px-8 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="relative h-8 w-20 sm:h-12 sm:w-32">
            <img src={brand.logo} alt={brand.name} className="h-full w-full object-contain object-left" loading="eager" />
          </div>
          <p className="mt-3 text-sm leading-6 text-white/70">Entrega de gás com foco em rapidez, segurança e atendimento local.</p>
          <p className="mt-4 text-sm text-white/60">{cnpj}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">Unidades</h3>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            {units.map((unit) => (
              <li key={unit.key}><Link href={`/unidades/${unit.key}`}>{unit.city}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">Links úteis</h3>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li><Link href="/pedido">Pedir gás</Link></li>
            <li><Link href="/promocoes">Promoções</Link></li>
            <li><Link href="/avaliacoes">Avaliações</Link></li>
            <li><Link href="/politica-de-privacidade">Política de Privacidade</Link></li>
            <li><Link href="/termos-de-uso">Termos de Uso</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">Contato</h3>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li>{contactChannels.phone}</li>
            <li>{contactChannels.email}</li>
            <li>WhatsApp a confirmar por unidade</li>
            <li>{units[0].hours}</li>
            <li>Instagram a confirmar</li>
            <li>Google a confirmar</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">Copyright {new Date().getFullYear()} {brand.name}.</div>
    </footer>
  );
}
