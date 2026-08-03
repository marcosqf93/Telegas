import Link from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { Flame } from 'lucide-react';
import { cn } from '@/components/ui/cn';

type BaseProps = { children: ReactNode; className?: string };

function renderWithIcon(children: ReactNode) {
  if (typeof children === 'string' && (children.includes('Pedir meu gás') || children.includes('Pedir nesta unidade'))) {
    return (
      <>
        <Flame className="h-5 w-5 text-current" aria-hidden="true" />
        {children}
      </>
    );
  }

  return children;
}

export function Button({ children, className, ...props }: BaseProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        'bg-brand-500 text-white hover:bg-brand-600',
        className
      )}
    >
      {renderWithIcon(children)}
    </button>
  );
}

export function ButtonLink({ children, className, ...props }: BaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return (
    <Link
      {...props}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
        'bg-brand-500 text-white hover:bg-brand-600',
        className
      )}
    >
      {renderWithIcon(children)}
    </Link>
  );
}
