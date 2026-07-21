import Link from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/components/ui/cn';

type BaseProps = { children: ReactNode; className?: string };

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
      {children}
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
      {children}
    </Link>
  );
}
