import type { CityKey } from './site-data';

export function formatCurrency(value: number | null | undefined) {
  if (value == null) return 'Preço a confirmar';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

export function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, digits.length - 4)}-${digits.slice(-4)}`;
  return `+${digits}`;
}

export function cityLabel(key: CityKey) {
  return ({ aquidauana: 'Aquidauana', anastacio: 'Anastácio', miranda: 'Miranda' } satisfies Record<CityKey, string>)[key];
}

export function phoneDigits(phone: string) {
  return phone.replace(/\D/g, '');
}

export function buildWhatsAppUrl(phone: string, message: string) {
  const digits = phoneDigits(phone);
  if (digits.length < 10) return '/contato';
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function getLocalStorage<T>(key: string, fallback: T) {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function setLocalStorage<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function removeLocalStorage(key: string) {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(key);
}
