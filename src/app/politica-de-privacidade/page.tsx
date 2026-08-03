import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/breadcrumbs';

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description: 'Política de privacidade e tratamento de dados da Tele Gás.',
  alternates: { canonical: '/politica-de-privacidade' }
};

export default function Politica() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative min-h-[420px] w-full bg-[length:100%_auto] bg-center bg-no-repeat sm:min-h-[520px] lg:min-h-[600px]" style={{ backgroundImage: "url('https://i.postimg.cc/MGWQ4xjJ/Chat-GPT-Image-31-de-jul-de-2026-07-55-46.png')" }} aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,11,11,0.20),rgba(11,11,11,0.68))]" />
        <div className="relative mx-auto flex min-h-[420px] max-w-7xl flex-col justify-end px-4 py-12 text-white sm:min-h-[520px] sm:px-6 lg:min-h-[600px] lg:px-8">
          <Breadcrumbs className="text-white/80" items={[{ label: 'Início', href: '/' }, { label: 'Privacidade' }]} />
          <h1 className="mt-4 max-w-2xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">Política de Privacidade</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-white/85">Tratamento de dados conforme a LGPD, com foco em transparência, segurança e uso responsável das informações enviadas pelo site.</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
          <div className="space-y-8">
            <div className="grid gap-4 md:grid-cols-2">
              {[
                ['1. Dados coletados', 'Podemos coletar nome, telefone, endereço, bairro, cidade, preferências de pedido e informações enviadas voluntariamente nos formulários do site, sempre em conformidade com a LGPD.'],
                ['2. Finalidade', 'Os dados são usados para processar pedidos, responder mensagens, prestar atendimento, melhorar a experiência do usuário e cumprir obrigações legais ou regulatórias previstas na LGPD.'],
                ['3. Compartilhamento', 'As informações podem ser compartilhadas apenas com parceiros e ferramentas necessários para funcionamento do site, atendimento, métricas e entrega do pedido.'],
                ['4. Armazenamento', 'Alguns dados podem ser armazenados localmente no dispositivo do usuário, quando houver consentimento, para facilitar a repetição de pedidos.'],
                ['5. Cookies', 'Utilizamos cookies para melhorar a experiência de navegação, lembrar preferências e apoiar funcionalidades do site.'],
                ['6. Segurança', 'Adotamos medidas razoáveis para proteger as informações contra acesso não autorizado, alteração, divulgação ou destruição indevida.'],
                ['7. Direitos do titular', 'Nos termos da LGPD, o usuário pode solicitar acesso, correção, atualização, portabilidade ou exclusão de dados pelos canais de contato informados no site.'],
                ['8. Alterações', 'Esta política pode ser atualizada a qualquer momento para refletir mudanças operacionais, legais ou técnicas.']
              ].map(([title, text]) => (
                <section key={title} className="rounded-[1.5rem] border border-white/25 bg-white/75 p-5 shadow-[0_12px_30px_rgba(0,0,0,0.08)] backdrop-blur-md">
                  <h2 className="text-lg font-semibold tracking-tight text-brand-700 sm:text-xl">{title}</h2>
                  <p className="mt-2 text-sm leading-7 text-foreground/75">{text}</p>
                  {title === '5. Cookies' ? (
                    <div className="mt-4 space-y-3 text-sm leading-7 text-foreground/75">
                      <p><strong>Cookies relacionados a boletins por e-mail:</strong> podem ser usados para lembrar se você já está inscrito e para exibir notificações específicas para usuários inscritos ou não inscritos.</p>
                      <p><strong>Cookies relacionados a pesquisas:</strong> podem lembrar se você já participou de uma pesquisa ou questionário, ajudando a fornecer resultados mais precisos.</p>
                      <p><strong>Cookies relacionados a formulários:</strong> podem lembrar detalhes enviados em formulários de contato para facilitar correspondências futuras.</p>
                      <p><strong>Cookies de preferências do site:</strong> servem para lembrar suas preferências de uso e manter sua experiência consistente ao navegar pelo site.</p>
                    </div>
                  ) : null}
                </section>
              ))}
            </div>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24">
            <div className="rounded-[1.75rem] border border-white/25 bg-white/70 p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)] backdrop-blur-md">
              <h3 className="text-lg font-semibold text-foreground">Resumo rápido</h3>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-foreground/75">
                <li>• Dados usados apenas para pedido e atendimento.</li>
                <li>• Cookies de preferência e formulários.</li>
                <li>• Direitos garantidos pela LGPD.</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
