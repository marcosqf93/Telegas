import Link from 'next/link';

type Breadcrumb = { label: string; href?: string };

export function Breadcrumbs({ items, className }: { items: Breadcrumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={`text-sm ${className ?? 'text-foreground/60'}`}>
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-2">
            {item.href ? <Link href={item.href} className="text-inherit hover:opacity-80">{item.label}</Link> : <span aria-current="page" className="text-inherit">{item.label}</span>}
            {index < items.length - 1 ? <span aria-hidden="true">/</span> : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}
