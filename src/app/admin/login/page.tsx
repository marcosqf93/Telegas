import type { Metadata } from 'next';
import { AdminPanel } from '@/components/admin-panel';

export const metadata: Metadata = {
  title: 'Login do Admin',
  description: 'Acesso ao painel administrativo da Tele Gás.',
  alternates: { canonical: '/admin/login' }
};

export default function AdminLoginPage() {
  return <AdminPanel />;
}
