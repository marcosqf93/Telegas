import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/breadcrumbs';

export const metadata: Metadata = {
  title: 'Termos de Uso',
  description: 'Termos de uso do site oficial da Tele Gás.',
  alternates: { canonical: '/termos-de-uso' }
};

export default function Termos() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative min-h-[420px] w-full bg-[length:100%_auto] bg-center bg-no-repeat sm:min-h-[520px] lg:min-h-[600px]" style={{ backgroundImage: "url('https://i.postimg.cc/d1zHGn5c/Chat-GPT-Image-31-de-jul-de-2026-08-45-33.png')" }} aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,11,11,0.18),rgba(11,11,11,0.68))]" />
        <div className="relative mx-auto flex min-h-[420px] max-w-7xl flex-col justify-end px-4 py-12 text-white sm:min-h-[520px] sm:px-6 lg:min-h-[600px] lg:px-8">
          <Breadcrumbs className="text-white/80" items={[{ label: 'Início', href: '/' }, { label: 'Termos' }]} />
          <h1 className="mt-4 max-w-2xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">Termos de Uso</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-white/85">Condições de navegação e uso do site com foco em clareza, responsabilidade e proteção dos dados.</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
          <div className="space-y-8">
            <div className="grid gap-4 md:grid-cols-2">
              {[
                ['1. Aceitação', 'Ao navegar no site ou enviar informações por formulários, o usuário concorda com estes termos de uso.'],
                ['2. Conteúdo do site', 'As informações publicadas têm finalidade comercial e informativa. Preços, horários e condições podem mudar sem aviso prévio.'],
                ['3. Uso permitido', 'O site deve ser usado de forma lícita, respeitosa e compatível com a finalidade de atendimento e pedido de gás.'],
                ['4. Responsabilidades', 'O usuário é responsável pelas informações enviadas. A empresa se responsabiliza pela gestão do atendimento e pela atualização razoável do conteúdo.'],
                ['5. Dados e privacidade', 'O tratamento de dados pessoais segue a Política de Privacidade do site e a legislação aplicável, incluindo a LGPD.'],
                ['6. Alterações', 'Estes termos podem ser atualizados a qualquer momento para refletir mudanças operacionais, legais ou técnicas.']
              ].map(([title, text]) => (
                <section key={title} className="rounded-[1.5rem] border border-white/25 bg-white/75 p-5 shadow-[0_12px_30px_rgba(0,0,0,0.08)] backdrop-blur-md">
                  <h2 className="text-lg font-semibold tracking-tight text-brand-700 sm:text-xl">{title}</h2>
                  <p className="mt-2 text-sm leading-7 text-foreground/75">{text}</p>
                </section>
              ))}
            </div>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24">
            <div className="rounded-[1.75rem] border border-white/25 bg-white/70 p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)] backdrop-blur-md">
              <h3 className="text-lg font-semibold text-foreground">Resumo rápido</h3>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-foreground/75">
                <li>• Conteúdo comercial e informativo.</li>
                <li>• Responsabilidade sobre dados enviados.</li>
                <li>• Alterações podem ocorrer sem aviso prévio.</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
