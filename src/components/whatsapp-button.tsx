"use client";

import { buildWhatsAppUrl } from '@/lib/utils';
import { trackEvent } from '@/lib/analytics';

type Props = {
  phone: string;
  message: string;
  label: string;
  className?: string;
};

export function WhatsAppButton({ phone, message, label, className }: Props) {
  const href = buildWhatsAppUrl(phone, message);
  const external = href.startsWith('http');

  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      onClick={() => trackEvent({ name: 'click_whatsapp', params: { phone } })}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-green-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 ${className ?? ''}`}
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M19.05 4.95A10.78 10.78 0 0 0 12.01 2C6.49 2 2 6.48 2 12c0 1.76.46 3.48 1.34 4.99L2 22l5.16-1.35A9.96 9.96 0 0 0 12 22c5.52 0 10-4.48 10-10 0-2.67-1.04-5.18-2.95-7.05Zm-7.04 15.3c-1.58 0-3.13-.42-4.48-1.22l-.32-.19-3.06.8.82-2.98-.21-.33A7.95 7.95 0 0 1 4 12c0-4.42 3.59-8 8.01-8 2.14 0 4.15.83 5.66 2.34A7.94 7.94 0 0 1 20 12c0 4.42-3.58 8.25-7.99 8.25Zm4.42-5.9c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.02-.37-1.94-1.18-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.46-.39-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.86.84-.86 2.05s.88 2.38 1 2.55c.12.16 1.74 2.65 4.22 3.72.59.26 1.06.41 1.42.52.6.19 1.14.16 1.57.1.48-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" />
      </svg>
      {label}
    </a>
  );
}
