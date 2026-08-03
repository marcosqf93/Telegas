"use client";

import { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';

type Props = {
  hours: string;
  label?: string;
};

export function HoursDisclosure({ hours, label = 'Horário de atendimento' }: Props) {
  const [open, setOpen] = useState(false);
  const lines = useMemo(() => hours.split('\n').filter(Boolean), [hours]);

  if (lines.length <= 1) {
    return (
      <button type="button" className="inline-flex items-center gap-2 text-sm font-semibold text-foreground" aria-expanded="false">
        <span className="text-foreground/80">{hours}</span>
        <ChevronDown className="h-4 w-4 text-brand-500" />
      </button>
    );
  }

  const [firstLine, ...rest] = lines;

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-2 text-sm font-semibold text-foreground"
        aria-expanded={open}
      >
        <span className="text-foreground/80">{firstLine.split(': ')[1] ?? firstLine}</span>
        <ChevronDown className={`h-4 w-4 text-brand-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <div className="mt-2">
        <p className="text-xs text-foreground/55">{label}</p>
        {open ? (
          <div className="mt-2 space-y-1 text-sm leading-6 text-foreground/70">
            <p>{firstLine}</p>
            {rest.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
