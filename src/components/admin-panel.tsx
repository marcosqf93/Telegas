"use client";

import { useEffect, useMemo, useState } from 'react';
import { ChevronRight, CircleDot, Clock3, LogOut, MapPinned, ShieldCheck, Truck, Users, KeyRound } from 'lucide-react';
import { orderStatuses, type OrderStatus } from '@/lib/admin';
import { cn } from './ui/cn';

type Driver = {
  id: string;
  name: string;
  city: 'aquidauana' | 'anastacio' | 'miranda';
  phone: string;
  active: boolean;
  lat: number;
  lng: number;
  lastSeenAt: string;
};

type AdminOrder = {
  id: string;
  customer: string;
  city: 'aquidauana' | 'anastacio' | 'miranda';
  product: string;
  quantity: number;
  status: OrderStatus;
  driverId: string | null;
  address: string;
  updatedAt: string;
};

type Session = {
  email: string;
  token: string;
  trustedAt: string;
};

type PendingCode = {
  email: string;
  code: string;
  expiresAt: number;
};

const SESSION_KEY = 'telegas:admin-session';
const PENDING_CODE_KEY = 'telegas:admin-pair-code';
const ORDERS_KEY = 'telegas:admin-orders';
const DRIVERS_KEY = 'telegas:admin-drivers';
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/$/, '');

const seedOrders: AdminOrder[] = [
  { id: '#1048', customer: 'Carla Souza', city: 'aquidauana', product: 'Gás P13', quantity: 1, status: 'Novo', driverId: null, address: 'Santa Terezinha, Aquidauana', updatedAt: new Date().toISOString() },
  { id: '#1049', customer: 'João Pedro', city: 'anastacio', product: 'Gás P20', quantity: 2, status: 'Em preparação', driverId: 'd2', address: 'Centro, Anastácio', updatedAt: new Date().toISOString() },
  { id: '#1050', customer: 'Mariana Alves', city: 'miranda', product: 'Gás P13', quantity: 1, status: 'Saiu para entrega', driverId: 'd3', address: 'Centro, Miranda', updatedAt: new Date().toISOString() }
];

const seedDrivers: Driver[] = [
  { id: 'd1', name: 'Luiz', city: 'aquidauana', phone: '(67) 99999-1111', active: true, lat: -20.4774, lng: -55.7891, lastSeenAt: new Date().toISOString() },
  { id: 'd2', name: 'Rafael', city: 'anastacio', phone: '(67) 99999-2222', active: true, lat: -20.48, lng: -55.808, lastSeenAt: new Date().toISOString() },
  { id: 'd3', name: 'Paulo', city: 'miranda', phone: '(67) 99999-3333', active: true, lat: -20.2408, lng: -56.3783, lastSeenAt: new Date().toISOString() }
];

function formatTime(value: string) {
  return new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }).format(new Date(value));
}

function Badge({ children, tone = 'slate' }: { children: string; tone?: 'slate' | 'brand' | 'emerald' | 'amber' | 'cyan' }) {
  const toneClass =
    tone === 'brand' ? 'bg-brand-50 text-brand-700 ring-brand-200' :
    tone === 'emerald' ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' :
    tone === 'amber' ? 'bg-amber-50 text-amber-700 ring-amber-200' :
    tone === 'cyan' ? 'bg-cyan-50 text-cyan-700 ring-cyan-200' :
    'bg-slate-100 text-slate-700 ring-slate-200';

  return <span className={cn('inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1', toneClass)}>{children}</span>;
}

export function AdminPanel() {
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState('');
  const [pendingCode, setPendingCode] = useState<PendingCode | null>(null);
  const [enteredCode, setEnteredCode] = useState('');
  const [orders, setOrders] = useState<AdminOrder[]>(seedOrders);
  const [drivers, setDrivers] = useState<Driver[]>(seedDrivers);
  const [selectedOrderId, setSelectedOrderId] = useState(seedOrders[2].id);

  useEffect(() => {
    const savedSession = localStorage.getItem(SESSION_KEY);
    const savedOrders = localStorage.getItem(ORDERS_KEY);
    const savedDrivers = localStorage.getItem(DRIVERS_KEY);
    const savedPending = localStorage.getItem(PENDING_CODE_KEY);

    if (savedSession) setSession(JSON.parse(savedSession));
    if (savedOrders) setOrders(JSON.parse(savedOrders));
    if (savedDrivers) setDrivers(JSON.parse(savedDrivers));
    if (savedPending) setPendingCode(JSON.parse(savedPending));
  }, []);

  useEffect(() => {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(DRIVERS_KEY, JSON.stringify(drivers));
  }, [drivers]);

  useEffect(() => {
    if (pendingCode) localStorage.setItem(PENDING_CODE_KEY, JSON.stringify(pendingCode));
    else localStorage.removeItem(PENDING_CODE_KEY);
  }, [pendingCode]);

  useEffect(() => {
    if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else localStorage.removeItem(SESSION_KEY);
  }, [session]);

  useEffect(() => {
    if (!pendingCode) return;
    const timeout = window.setTimeout(() => setPendingCode(null), Math.max(pendingCode.expiresAt - Date.now(), 0));
    return () => window.clearTimeout(timeout);
  }, [pendingCode]);

  const stats = useMemo(() => ({
    orders: orders.length,
    activeDrivers: drivers.filter((driver) => driver.active).length,
    onRoute: orders.filter((order) => order.status === 'Saiu para entrega' || order.status === 'Em preparação').length,
    delivered: orders.filter((order) => order.status === 'Entregue').length
  }), [orders, drivers]);

  const selectedOrder = orders.find((order) => order.id === selectedOrderId) ?? orders[0];
  const selectedDriver = selectedOrder?.driverId ? drivers.find((driver) => driver.id === selectedOrder.driverId) : null;

  const requestCode = () => {
    if (!email.trim()) return;
    void fetch(`${API_BASE_URL}/admin/pair/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
      .then(async (response) => {
        const payload = (await response.json()) as PendingCode & { ok?: boolean; error?: string };
        if (!response.ok) throw new Error(payload.error ?? 'Falha ao gerar código.');
        setPendingCode(payload);
        setEnteredCode('');
      })
      .catch(() => setPendingCode(null));
  };

  const confirmCode = () => {
    if (!pendingCode) return;

    void fetch(`${API_BASE_URL}/admin/pair/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code: enteredCode })
    })
      .then(async (response) => {
        const payload = (await response.json()) as { ok?: boolean; error?: string; session?: Session };
        if (!response.ok || !payload.session) throw new Error(payload.error ?? 'Código inválido.');
        setSession(payload.session);
        setPendingCode(null);
        setEnteredCode('');
      })
      .catch(() => undefined);
  };

  const logout = () => {
    setSession(null);
    setEnteredCode('');
  };

  const updateOrder = (orderId: string, next: Partial<AdminOrder>) => {
    setOrders((current) => current.map((order) => (order.id === orderId ? { ...order, ...next, updatedAt: new Date().toISOString() } : order)));
  };

  if (!session) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2rem] border border-border bg-white p-6 shadow-soft">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700">
              <ShieldCheck className="h-4 w-4" /> Admin seguro
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">Painel administrativo</h1>
            <p className="mt-3 text-sm leading-6 text-foreground/70">Primeiro acesso com código temporário de 2 dígitos. Depois a sessão fica salva neste dispositivo.</p>
            <div className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-foreground">E-mail do admin</span>
                <input value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-2xl border border-border px-4 py-3 outline-none focus:border-brand-500" placeholder="admin@telegas.com" />
              </label>
              <button type="button" onClick={requestCode} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-950 via-cyan-950 to-slate-900 px-5 py-3 text-sm font-semibold text-white hover:brightness-110">
                <KeyRound className="h-4 w-4" /> Gerar código temporário
              </button>
              {pendingCode ? (
                <div className="rounded-3xl border border-cyan-200 bg-cyan-50 p-4">
                  <p className="text-sm font-semibold text-cyan-900">Código de 2 dígitos</p>
                  <div className="mt-3 flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-3xl font-bold tracking-[0.35em] text-foreground">
                    <span>{pendingCode.code}</span>
                    <span className="text-xs tracking-normal text-foreground/50">expira em 10 min</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-cyan-900/80">Digite o código para confirmar o primeiro acesso neste aparelho.</p>
                  <div className="mt-4 flex gap-3">
                    <input value={enteredCode} onChange={(event) => setEnteredCode(event.target.value.replace(/\D/g, '').slice(0, 2))} inputMode="numeric" maxLength={2} className="w-full rounded-2xl border border-cyan-200 px-4 py-3 text-center text-lg font-semibold tracking-[0.35em] outline-none focus:border-cyan-500" placeholder="00" />
                    <button type="button" onClick={confirmCode} className="rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-600">Confirmar</button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          <div className="rounded-[2rem] border border-border bg-slate-50 p-6 shadow-soft">
            <h2 className="text-xl font-semibold text-foreground">O que você controla aqui</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-foreground/75">
              <li className="flex gap-2"><CircleDot className="mt-1 h-4 w-4 text-brand-600" /> Pedidos em tempo real</li>
              <li className="flex gap-2"><Truck className="mt-1 h-4 w-4 text-brand-600" /> Entregador atribuído</li>
              <li className="flex gap-2"><MapPinned className="mt-1 h-4 w-4 text-brand-600" /> Rastreamento no mapa</li>
              <li className="flex gap-2"><Clock3 className="mt-1 h-4 w-4 text-brand-600" /> Status de entrega</li>
            </ul>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-border bg-white p-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">Admin</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">Painel de pedidos e rastreio</h1>
            <p className="mt-2 text-sm text-foreground/65">Logado como {session.email}</p>
          </div>
          <button type="button" onClick={logout} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-slate-50">
            <LogOut className="h-4 w-4" /> Sair
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Pedidos" value={String(stats.orders)} helper="Total no painel" />
          <StatCard title="Em rota" value={String(stats.onRoute)} helper="Separando ou saindo" />
          <StatCard title="Entregadores" value={String(stats.activeDrivers)} helper="Ativos agora" />
          <StatCard title="Entregues" value={String(stats.delivered)} helper="Concluídos" />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
          <div className="space-y-4">
            {orders.map((order) => (
              <article key={order.id} className={cn('rounded-[1.5rem] border p-4 transition', order.id === selectedOrderId ? 'border-brand-500 bg-brand-50/40' : 'border-border bg-white')}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-semibold text-foreground">{order.id}</h2>
                      <Badge tone={order.status === 'Entregue' ? 'emerald' : order.status === 'Saiu para entrega' ? 'cyan' : order.status === 'Em preparação' ? 'amber' : 'slate'}>{order.status}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-foreground/70">{order.customer} · {order.city} · {order.product} x{order.quantity}</p>
                    <p className="mt-1 text-sm text-foreground/60">{order.address}</p>
                  </div>
                  <button type="button" onClick={() => setSelectedOrderId(order.id)} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-950 via-cyan-950 to-slate-900 px-4 py-2 text-sm font-semibold text-white hover:brightness-110">
                    Ver mapa <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-foreground/55">Status</span>
                    <select value={order.status} onChange={(event) => updateOrder(order.id, { status: event.target.value as OrderStatus })} className="w-full rounded-2xl border border-border px-4 py-3 text-sm">
                      {orderStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-foreground/55">Entregador</span>
                    <select value={order.driverId ?? ''} onChange={(event) => updateOrder(order.id, { driverId: event.target.value || null })} className="w-full rounded-2xl border border-border px-4 py-3 text-sm">
                      <option value="">Atribuir depois</option>
                      {drivers.filter((driver) => driver.city === order.city || driver.city === 'aquidauana').map((driver) => <option key={driver.id} value={driver.id}>{driver.name}</option>)}
                    </select>
                  </label>
                  <div className="rounded-2xl border border-border bg-slate-50 px-4 py-3 text-sm">
                    <p className="font-semibold text-foreground">Atualizado</p>
                    <p className="mt-1 text-foreground/65">{formatTime(order.updatedAt)}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="space-y-4">
            <div className="rounded-[1.5rem] border border-border bg-white p-4 shadow-soft">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">Mapa</p>
                  <h2 className="mt-1 text-xl font-semibold text-foreground">Rastreio ao vivo</h2>
                </div>
                <MapPinned className="h-5 w-5 text-brand-600" />
              </div>
              <div className="mt-4 rounded-[1.5rem] border border-dashed border-sky-200 bg-gradient-to-br from-sky-50 via-white to-cyan-50 p-5">
                <div className="flex items-center justify-between text-sm text-foreground/70">
                  <span>Pedido selecionado</span>
                  <span className="font-semibold text-foreground">{selectedOrder.id}</span>
                </div>
                <div className="mt-4 flex h-56 items-center justify-center rounded-[1.25rem] bg-white/80 text-center">
                  <div>
                    <MapPinned className="mx-auto h-8 w-8 text-brand-600" />
                    <p className="mt-3 text-sm font-semibold text-foreground">Mapa Leaflet entra na próxima etapa</p>
                    <p className="mt-2 text-sm text-foreground/65">Aqui vamos desenhar a posição do entregador em tempo real.</p>
                  </div>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white px-4 py-3 text-sm">
                    <p className="font-semibold text-foreground">Entregador</p>
                    <p className="mt-1 text-foreground/65">{selectedDriver ? selectedDriver.name : 'Não atribuído'}</p>
                  </div>
                  <div className="rounded-2xl bg-white px-4 py-3 text-sm">
                    <p className="font-semibold text-foreground">Última posição</p>
                    <p className="mt-1 text-foreground/65">{selectedDriver ? `${selectedDriver.lat.toFixed(4)}, ${selectedDriver.lng.toFixed(4)}` : '-'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-border bg-white p-4 shadow-soft">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">Entregadores</p>
                  <h2 className="mt-1 text-xl font-semibold text-foreground">Equipe ativa</h2>
                </div>
                <Users className="h-5 w-5 text-brand-600" />
              </div>
              <div className="mt-4 space-y-3">
                {drivers.map((driver) => (
                  <div key={driver.id} className="rounded-2xl border border-border px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-foreground">{driver.name}</p>
                        <p className="text-sm text-foreground/65">{driver.phone} · {driver.city}</p>
                      </div>
                      <Badge tone={driver.active ? 'emerald' : 'slate'}>{driver.active ? 'Online' : 'Offline'}</Badge>
                    </div>
                    <p className="mt-2 text-xs text-foreground/55">Último sinal: {formatTime(driver.lastSeenAt)}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function StatCard({ title, value, helper }: { title: string; value: string; helper: string }) {
  return (
    <div className="rounded-[1.35rem] border border-border bg-slate-50 p-4">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground/55">{title}</p>
      <p className="mt-2 text-3xl font-semibold text-foreground">{value}</p>
      <p className="mt-1 text-sm text-foreground/60">{helper}</p>
    </div>
  );
}
