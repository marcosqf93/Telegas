"use client";

import { ChevronDown } from 'lucide-react';
import type { FaqItem } from '@/lib/site-data';
import { useState } from 'react';

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const open = openIndex === index;
        return (
          <div key={item.question} className="rounded-[1.4rem] border border-white/25 bg-white/70 shadow-[0_10px_24px_rgba(0,0,0,0.06)] backdrop-blur-md">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              onClick={() => setOpenIndex(open ? null : index)}
            >
              <span className="font-medium text-foreground">{item.question}</span>
              <ChevronDown className={`h-4 w-4 shrink-0 transition ${open ? 'rotate-180' : ''}`} />
            </button>
            {open ? <div className="px-5 pb-4 text-sm leading-6 text-foreground/75">{item.answer}</div> : null}
          </div>
        );
      })}
    </div>
  );
}
