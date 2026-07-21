"use client";

import { MessageCircle } from 'lucide-react';
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
      className={className}
    >
      <MessageCircle className="h-4 w-4" />
      {label}
    </a>
  );
}
