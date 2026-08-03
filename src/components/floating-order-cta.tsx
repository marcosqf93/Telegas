import { ButtonLink } from './ui/button';

export function FloatingOrderCTA() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/95 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur md:hidden">
      <ButtonLink href="/pedido" className="w-full rounded-2xl py-3 text-base">
        Pedir meu gás
      </ButtonLink>
    </div>
  );
}
