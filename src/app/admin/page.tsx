import type { Metadata } from 'next';
import { AdminPanel } from '@/components/admin-panel';

export const metadata: Metadata = {
  title: 'Admin',
  description: 'Painel administrativo da Tele Gás.',
  alternates: { canonical: '/admin' }
};

export default function AdminPage() {
  return <AdminPanel />;
}
