import Link from 'next/link';
import Image from 'next/image';
import { MapPinned, Mail, Instagram } from 'lucide-react';
import { brand, units } from '@/lib/site-data';

export function Footer() {
  const marketingHref = 'https://wa.me/67999638295';
  const aquidauana = units[0];
  const mapHref = 'https://www.google.com/maps?vet=10CAAQoqAOahcKEwiYhfD5keKVAxUAAAAAHQAAAAAQDA..i&pvq=Cg0vZy8xMWRfZDlnazR2Ig0KB3RlbGVnYXMQAhgD&lqi=Cgd0ZWxlZ2FzSJqJ3cT9rICACFoNEAAYACIHdGVsZWdhc5IBC2dhc19jb21wYW55&fvr=1&cs=1&um=1&ie=UTF-8&fb=1&gl=br&sa=X&ftid=0x947de66f3fcf0dfb:0x9173466e91a7f5db';
  const mapEmbedHref = `https://www.google.com/maps?q=${encodeURIComponent('Oscar Trindade de Barros, 458, Santa Terezinha, Aquidauana, MS')}&output=embed`;

  return (
    <footer className="border-t border-border bg-graphite text-white pb-28 md:pb-0">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:px-8 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="relative h-8 w-20 overflow-hidden rounded-full border border-white/15 bg-white px-2 py-1 shadow-sm sm:h-12 sm:w-32">
            <img src={brand.logo} alt={brand.name} className="h-full w-full object-contain object-left" loading="eager" />
          </div>
          <div className="mt-4 flex items-center gap-3 text-white/70">
            <a href={aquidauana.instagramUrl ?? '#'} target="_blank" rel="noreferrer" aria-label="Instagram da matriz" className="transition hover:text-white">
              <Instagram className="h-5 w-5" />
            </a>
            <a href={aquidauana.whatsapp ? `https://wa.me/${aquidauana.whatsapp.replace(/\D/g, '')}` : '#'} target="_blank" rel="noreferrer" aria-label="WhatsApp da matriz" className="transition hover:text-white">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M19.05 4.95A10.78 10.78 0 0 0 12.01 2C6.49 2 2 6.48 2 12c0 1.76.46 3.48 1.34 4.99L2 22l5.16-1.35A9.96 9.96 0 0 0 12 22c5.52 0 10-4.48 10-10 0-2.67-1.04-5.18-2.95-7.05Zm-7.04 15.3c-1.58 0-3.13-.42-4.48-1.22l-.32-.19-3.06.8.82-2.98-.21-.33A7.95 7.95 0 0 1 4 12c0-4.42 3.59-8 8.01-8 2.14 0 4.15.83 5.66 2.34A7.94 7.94 0 0 1 20 12c0 4.42-3.58 8.25-7.99 8.25Zm4.42-5.9c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.02-.37-1.94-1.18-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.46-.39-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.86.84-.86 2.05s.88 2.38 1 2.55c.12.16 1.74 2.65 4.22 3.72.59.26 1.06.41 1.42.52.6.19 1.14.16 1.57.1.48-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" />
              </svg>
            </a>
            <a href={`mailto:telegas_aquidauana@outlook.com`} aria-label="Email da matriz" className="transition hover:text-white">
              <Mail className="h-5 w-5" />
            </a>
          </div>
          <div className="mt-8 space-y-2 text-sm leading-6 text-white/70">
            <p>Entrega de gás com foco em rapidez, segurança e atendimento local.</p>
            <p>Matriz: Oscar Trindade de Barros, 458, Santa Terezinha, Aquidauana-MS</p>
            <p>CNPJ: 00.462.645/0001-46</p>
          </div>
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
            <li><Link href="/contato">Contato</Link></li>
            <li><Link href="/politica-de-privacidade">Política de Privacidade</Link></li>
            <li><Link href="/termos-de-uso">Termos de Uso</Link></li>
          </ul>
        </div>
        <div className="md:col-span-2 lg:col-span-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">Mapa</h3>
          <a href={mapHref} target="_blank" rel="noreferrer" className="group mt-4 block overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-0.5 hover:border-white/20">
            <div className="relative h-72 w-full sm:h-80 lg:h-80">
              <iframe
                title="Mapa da matriz Tele Gás Aquidauana"
                src={mapEmbedHref}
                className="h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/30 to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent" />
              <div className="absolute left-4 top-4 flex items-center gap-3 rounded-2xl bg-black/55 px-4 py-3 text-white backdrop-blur-sm">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-500/20 text-brand-300">
                  <MapPinned className="h-5 w-5 animate-pulse" />
                </span>
                <div>
                  <p className="text-sm font-semibold">Tele Gás Aquidauana</p>
                  <p className="text-xs text-white/75">Abrir rotas e localização</p>
                </div>
              </div>
              <div className="absolute bottom-4 right-4 rounded-full bg-brand-500 px-4 py-2 text-xs font-semibold text-white shadow-lg transition group-hover:brightness-110">
                Traçar rota
              </div>
            </div>
          </a>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 sm:px-6 lg:px-8">
          <p>Copyright {new Date().getFullYear()} {brand.name}.</p>
          <a href={marketingHref} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-4 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-left text-white shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-white/10 hover:border-white/20">
            <span className="flex h-9 items-center rounded-full bg-white/10 px-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">Site desenvolvido por</span>
            <span className="relative h-7 w-40 sm:h-8 sm:w-48 transition-transform duration-300 group-hover:scale-[1.02] md:hidden">
              <Image src="https://i.postimg.cc/z30rXGTV/mf-dev-studio-horizontal-transparente.png" alt="MF Dev Studio" fill sizes="192px" className="object-contain" />
            </span>
            <span className="relative hidden h-8 w-56 transition-transform duration-300 group-hover:scale-[1.02] md:block">
              <Image src="https://i.postimg.cc/ZKhKH9RF/mf-dev-studio-horizontal-transparente.png" alt="MF Dev Studio" fill sizes="224px" className="object-contain" />
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
