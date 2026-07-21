import { ButtonLink } from './ui/button';

export function FloatingOrderCTA() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/95 p-3 backdrop-blur md:hidden">
      <ButtonLink href="/pedido" className="w-full rounded-2xl py-3 text-base">
        Pedir gás
      </ButtonLink>
    </div>
  );
}
