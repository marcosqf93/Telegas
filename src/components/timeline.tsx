type Item = { year: string; title: string; text: string };

export function Timeline({ items }: { items: Item[] }) {
  return (
    <div className="relative space-y-0 pl-6 before:absolute before:left-2 before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-gradient-to-b before:from-brand-500 before:to-brand-200">
      {items.map((item) => (
        <div key={item.year + item.title} className="relative pb-6 last:pb-0">
          <span className="absolute left-[-1.4rem] top-1 h-4 w-4 rounded-full border-4 border-white bg-brand-500 shadow-sm" />
          <div className="rounded-3xl border border-border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs font-semibold text-brand-600">{item.year}</p>
              <span className="text-[10px] uppercase tracking-[0.2em] text-foreground/40">Marco</span>
            </div>
            <h3 className="mt-1 text-base font-semibold text-foreground">{item.title}</h3>
            <p className="mt-2 text-xs leading-5 text-foreground/75">{item.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
