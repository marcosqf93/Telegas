"use client";

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode, type TouchEvent } from 'react';
import { ArrowUpRight, Bell, Building2, ChevronRight, CircleDot, Clock3, LayoutDashboard, ListOrdered, LogOut, MapPinned, Menu, Pencil, Plus, RefreshCcw, Route, Search, Settings2, ShieldCheck, Truck, Trash2, Users, X, KeyRound } from 'lucide-react';
import { orderStatuses, type OrderStatus } from '@/lib/admin';
import { brand, cities, products, type CityKey } from '@/lib/site-data';
import { buildWhatsAppUrl, cityLabel, formatCurrency } from '@/lib/utils';
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

type DriverDraft = {
  id?: string;
  name: string;
  phone: string;
  city: Driver['city'];
  active: boolean;
};

type AdminOrder = {
  id: string;
  customer: string;
  phone: string;
  city: 'aquidauana' | 'anastacio' | 'miranda';
  product: string;
  quantity: number;
  status: OrderStatus;
  driverId: string | null;
  address: string;
  neighborhood: string;
  street: string;
  number: string;
  reference: string;
  paymentMethod: string;
  total: number;
  changeFor: string;
  notes: string;
  unitName: string;
  createdAt: string;
  updatedAt: string;
  history: Array<{ at: string; text: string }>;
};

type Session = {
  email: string;
  token: string;
  trustedAt: string;
};

type AdminProfile = {
  name: string;
  email: string;
  phone: string;
  username: string;
  avatarUrl: string;
};

type PendingCode = {
  email: string;
  code?: string;
  expiresAt: number;
  prompt?: string;
};

type PriceMatrix = Record<CityKey, Record<string, string>>;

const SESSION_KEY = 'telegas:admin-session';
const PROFILE_KEY = 'telegas:admin-profile';
const PENDING_CODE_KEY = 'telegas:admin-pair-code';
const ORDERS_KEY = 'telegas:admin-orders';
const DRIVERS_KEY = 'telegas:admin-drivers';
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? (process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : '')).replace(/\/$/, '');

const seedOrders: AdminOrder[] = [
  {
    id: '#1048', customer: 'Carla Souza', phone: '(67) 99999-1111', city: 'aquidauana', product: 'Gás P13', quantity: 1,
    status: 'Novo', driverId: null, address: 'Rua das Flores, 123 - Santa Terezinha, Aquidauana-MS', neighborhood: 'Santa Terezinha', street: 'Rua das Flores', number: '123', reference: 'Ao lado da padaria', paymentMethod: 'Pix', total: 138, changeFor: '', notes: '', unitName: 'Tele Gás Aquidauana', createdAt: new Date(Date.now() - 11 * 60 * 1000).toISOString(), updatedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(), history: [{ at: new Date(Date.now() - 11 * 60 * 1000).toISOString(), text: 'Pedido recebido' }, { at: new Date(Date.now() - 2 * 60 * 1000).toISOString(), text: 'Aguardando confirmação' }]
  },
  {
    id: '#1049', customer: 'João Pedro', phone: '(67) 98888-2222', city: 'anastacio', product: 'Gás P20', quantity: 2,
    status: 'Em preparação', driverId: 'd2', address: 'Centro, Anastácio-MS', neighborhood: 'Centro', street: 'Av. Principal', number: '456', reference: 'Próximo ao mercado', paymentMethod: 'Dinheiro', total: 408, changeFor: 'R$ 500', notes: 'Entregar na porta lateral', unitName: 'Tele Gás 27 de Julho', createdAt: new Date(Date.now() - 24 * 60 * 1000).toISOString(), updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), history: [{ at: new Date(Date.now() - 24 * 60 * 1000).toISOString(), text: 'Pedido recebido' }, { at: new Date(Date.now() - 5 * 60 * 1000).toISOString(), text: 'Em preparação' }]
  },
  {
    id: '#1050', customer: 'Mariana Alves', phone: '(67) 99999-3333', city: 'miranda', product: 'Gás P13', quantity: 1,
    status: 'Saiu para entrega', driverId: 'd3', address: 'Rua X, 123 - Centro, Miranda-MS', neighborhood: 'Centro', street: 'Rua X', number: '123', reference: 'Casa ao lado da farmácia', paymentMethod: 'Dinheiro', total: 135, changeFor: 'R$ 200', notes: 'Sem troco exato', unitName: 'Tele Gás Miranda', createdAt: new Date(Date.now() - 34 * 60 * 1000).toISOString(), updatedAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(), history: [{ at: new Date(Date.now() - 34 * 60 * 1000).toISOString(), text: 'Pedido recebido' }, { at: new Date(Date.now() - 21 * 60 * 1000).toISOString(), text: 'Em preparação' }, { at: new Date(Date.now() - 12 * 60 * 1000).toISOString(), text: 'Saiu para entrega' }]
  }
];

const seedDrivers: Driver[] = [
  { id: 'd1', name: 'Luiz', city: 'aquidauana', phone: '(67) 99999-1111', active: true, lat: -20.4774, lng: -55.7891, lastSeenAt: new Date().toISOString() },
  { id: 'd2', name: 'Rafael', city: 'anastacio', phone: '(67) 99999-2222', active: true, lat: -20.48, lng: -55.808, lastSeenAt: new Date().toISOString() },
  { id: 'd3', name: 'Paulo', city: 'miranda', phone: '(67) 99999-3333', active: true, lat: -20.2408, lng: -56.3783, lastSeenAt: new Date().toISOString() }
];

function createInitialPriceMatrix(): PriceMatrix {
  return {
    aquidauana: { p13: '138', p20: '204', p45: '495' },
    anastacio: { p13: '138', p20: '204', p45: '495' },
    miranda: { p13: '135', p20: '190', p45: '480' }
  };
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }).format(new Date(value));
}

function minutesAgo(value: string) {
  return Math.max(0, Math.round((Date.now() - new Date(value).getTime()) / 60000));
}

function orderSeverity(order: AdminOrder) {
  const age = minutesAgo(order.createdAt);
  if (order.status === 'Entregue') return 'ok';
  if (age > 20) return 'late';
  if (age > 10) return 'warn';
  return 'normal';
}

function statusLabel(order: AdminOrder) {
  const age = minutesAgo(order.createdAt);
  if (order.status === 'Entregue') return 'Entregue';
  if (age > 20) return `Atrasado · há ${age} min`;
  return `Pedido há ${age} min`;
}

function normalizeOrder(order: AdminOrder): AdminOrder {
  return {
    ...order,
    phone: order.phone ?? '',
    neighborhood: order.neighborhood ?? '',
    street: order.street ?? '',
    number: order.number ?? '',
    reference: order.reference ?? '',
    paymentMethod: order.paymentMethod ?? 'PIX',
    total: order.total ?? 0,
    changeFor: order.changeFor ?? '',
    notes: order.notes ?? '',
    unitName: order.unitName ?? '',
    createdAt: order.createdAt ?? new Date().toISOString(),
    history: Array.isArray(order.history) ? order.history : [],
    updatedAt: order.updatedAt ?? new Date().toISOString()
  };
}

function createDefaultProfile(sessionEmail = ''): AdminProfile {
  const username = sessionEmail ? sessionEmail.split('@')[0] : 'admin';
  return {
    name: 'Administrador',
    email: sessionEmail,
    phone: '',
    username,
    avatarUrl: ''
  };
}

function Badge({ children, tone = 'slate' }: { children: ReactNode; tone?: 'slate' | 'brand' | 'emerald' | 'amber' | 'cyan' }) {
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
  const [profile, setProfile] = useState<AdminProfile>(createDefaultProfile());
  const [profileDraft, setProfileDraft] = useState<AdminProfile>(createDefaultProfile());
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileStatus, setProfileStatus] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pendingCode, setPendingCode] = useState<PendingCode | null>(null);
  const [enteredCode, setEnteredCode] = useState('');
  const [authStage, setAuthStage] = useState<'credentials' | 'approval'>('credentials');
  const [authError, setAuthError] = useState('');
  const [orders, setOrders] = useState<AdminOrder[]>(seedOrders);
  const [drivers, setDrivers] = useState<Driver[]>(seedDrivers);
  const [driverDraft, setDriverDraft] = useState<DriverDraft>({ name: '', phone: '', city: 'aquidauana', active: true });
  const [driverStatus, setDriverStatus] = useState('');
  const [priceDrafts, setPriceDrafts] = useState<PriceMatrix>(createInitialPriceMatrix());
  const [priceStatus, setPriceStatus] = useState('');
  const [saveNotice, setSaveNotice] = useState('');
  const [lastChange, setLastChange] = useState<{ orderId: string; snapshot: AdminOrder } | null>(null);
  const [freshOrderIds, setFreshOrderIds] = useState<string[]>([]);
  const [newOrderNotice, setNewOrderNotice] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [unitFilter, setUnitFilter] = useState<'all' | CityKey>('all');
  const [driverFilter, setDriverFilter] = useState<'all' | string>('all');
  const [lateOnly, setLateOnly] = useState(false);
  const [sortMode, setSortMode] = useState<'newest' | 'oldest' | 'delayed'>('newest');
  const [selectedOrderId, setSelectedOrderId] = useState(seedOrders[2].id);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDetailsOpen, setMobileDetailsOpen] = useState(false);
  const [mobileDetailsClosing, setMobileDetailsClosing] = useState(false);
  const [mobileSheetDragY, setMobileSheetDragY] = useState(0);
  const [mobileSheetTouchStartY, setMobileSheetTouchStartY] = useState<number | null>(null);
  const ordersRef = useRef<AdminOrder[]>(seedOrders);

  const handleAuthExpired = () => {
    setSession(null);
    setAuthStage('credentials');
    setPendingCode(null);
    setEnteredCode('');
    setAuthError('Sua sessão expirou. Entre novamente.');
    setProfileOpen(false);
    setProfileStatus('');
    setMobileMenuOpen(false);
    setMobileDetailsOpen(false);
    setMobileDetailsClosing(false);
    setMobileSheetDragY(0);
    setMobileSheetTouchStartY(null);
  };

  const fetchAdmin = async (input: RequestInfo | URL, init: RequestInit = {}) => {
    const headers = new Headers(init.headers);
    headers.set('Authorization', `Bearer ${session?.token ?? ''}`);

    const response = await fetch(input, {
      ...init,
      headers
    });

    if (response.status === 401) {
      handleAuthExpired();
      throw new Error('Sua sessão expirou. Entre novamente.');
    }

    return response;
  };

  useEffect(() => {
    const savedSession = localStorage.getItem(SESSION_KEY);
    const savedProfile = localStorage.getItem(PROFILE_KEY);
    const savedOrders = localStorage.getItem(ORDERS_KEY);
    const savedDrivers = localStorage.getItem(DRIVERS_KEY);
    const savedPending = localStorage.getItem(PENDING_CODE_KEY);

    if (savedSession) setSession(JSON.parse(savedSession));
    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile) as AdminProfile;
      setProfile(parsedProfile);
      setProfileDraft(parsedProfile);
    }
    if (savedOrders) setOrders((JSON.parse(savedOrders) as AdminOrder[]).map(normalizeOrder));
    if (savedDrivers) setDrivers(JSON.parse(savedDrivers));
    if (savedPending) {
      setPendingCode(JSON.parse(savedPending));
      setAuthStage('approval');
    }
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
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    if (!session?.email) return;
    setProfile((current) => (current.email ? current : { ...current, email: session.email, username: session.email.split('@')[0] }));
  }, [session?.email]);

  useEffect(() => {
    if (!session?.token) return;

    const syncOrders = () => {
      void fetchAdmin(`${API_BASE_URL}/orders`)
        .then(async (response) => {
          const payload = (await response.json()) as { ok?: boolean; orders?: AdminOrder[] };
          if (!response.ok || !payload.orders) return;
          const nextOrders = payload.orders.map(normalizeOrder);
          const previousIds = new Set(ordersRef.current.map((order) => order.id));
          const newIds = nextOrders.filter((order) => !previousIds.has(order.id)).map((order) => order.id);

          if (newIds.length) {
            setFreshOrderIds(newIds);
          }

          ordersRef.current = nextOrders;
          setOrders(nextOrders);
        })
        .catch(() => undefined);
    };

    syncOrders();

    void fetchAdmin(`${API_BASE_URL}/drivers`)
      .then(async (response) => {
        const payload = (await response.json()) as { ok?: boolean; drivers?: Driver[] };
        if (!response.ok || !payload.drivers) return;
        setDrivers(payload.drivers);
      })
      .catch(() => undefined);

    void fetchAdmin(`${API_BASE_URL}/prices`)
      .then(async (response) => {
        const payload = (await response.json()) as { ok?: boolean; prices?: Record<CityKey, Record<string, number>> };
        if (!response.ok || !payload.prices) return;

        const nextDrafts = createInitialPriceMatrix();
        (Object.keys(payload.prices) as CityKey[]).forEach((city) => {
          Object.entries(payload.prices?.[city] ?? {}).forEach(([productId, value]) => {
            nextDrafts[city][productId] = String(value);
          });
        });
        setPriceDrafts(nextDrafts);
      })
      .catch(() => undefined);

    void fetchAdmin(`${API_BASE_URL}/admin/profile`)
      .then(async (response) => {
        const payload = (await response.json()) as { ok?: boolean; profile?: AdminProfile };
        if (!response.ok || !payload.profile) return;
        setProfile(payload.profile);
        setProfileDraft(payload.profile);
      })
      .catch(() => undefined);

    const interval = window.setInterval(syncOrders, 15000);
    return () => window.clearInterval(interval);
  }, [session?.token]);

  useEffect(() => {
    ordersRef.current = orders;
  }, [orders]);

  useEffect(() => {
    if (!freshOrderIds.length) {
      setNewOrderNotice('');
      return;
    }

    setNewOrderNotice(`${freshOrderIds.length} novo${freshOrderIds.length > 1 ? 's' : ''} pedido${freshOrderIds.length > 1 ? 's' : ''}`);
    const timeout = window.setTimeout(() => {
      setFreshOrderIds([]);
      setNewOrderNotice('');
    }, 5000);

    return () => window.clearTimeout(timeout);
  }, [freshOrderIds]);

  useEffect(() => {
    if (!pendingCode) return;
    const timeout = window.setTimeout(() => setPendingCode(null), Math.max(pendingCode.expiresAt - Date.now(), 0));
    return () => window.clearTimeout(timeout);
  }, [pendingCode]);

  const stats = useMemo(() => ({
    orders: orders.length,
    new: orders.filter((order) => order.status === 'Novo').length,
    preparing: orders.filter((order) => order.status === 'Em preparação').length,
    onRoute: orders.filter((order) => order.status === 'Saiu para entrega').length,
    delayed: orders.filter((order) => order.status !== 'Entregue' && minutesAgo(order.createdAt) > 20).length,
    delivered: orders.filter((order) => order.status === 'Entregue').length
  }), [orders]);

  const selectedOrder = orders.find((order) => order.id === selectedOrderId) ?? orders[0] ?? normalizeOrder(seedOrders[0]);
  const selectedDriver = selectedOrder?.driverId ? drivers.find((driver) => driver.id === selectedOrder.driverId) : null;
  const activeDrivers = drivers.filter((driver) => driver.active);
  const alertCount = stats.delayed;
  const profileLabel = profile.name || profile.username || 'Administrador';
  const profileFirstName = profileLabel.split(' ').filter(Boolean)[0] || profileLabel;
  const profileInitials = profileLabel.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'A';
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Pedidos', icon: ListOrdered },
    { id: 'tracking', label: 'Rastreamento', icon: Route },
    { id: 'drivers', label: 'Entregadores', icon: Truck },
    { id: 'units', label: 'Unidades', icon: Building2 },
    { id: 'settings', label: 'Configurações', icon: Settings2 }
  ] as const;
  const kpis = [
    { title: 'Novos pedidos', value: stats.new, helper: '+3 nas ultimas 2h', icon: CircleDot, tone: 'amber' as const },
    { title: 'Em preparação', value: stats.preparing, helper: 'Separação no balcão', icon: Clock3, tone: 'cyan' as const },
    { title: 'Em rota', value: stats.onRoute, helper: `${activeDrivers.length} ativos`, icon: Truck, tone: 'brand' as const },
    { title: 'Atrasados', value: stats.delayed, helper: 'Mais de 20 min', icon: MapPinned, tone: 'amber' as const },
    { title: 'Entregues hoje', value: stats.delivered, helper: 'Finalizados agora', icon: ShieldCheck, tone: 'emerald' as const }
  ] as const;

  const filteredOrders = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return [...orders]
      .filter((order) => {
        if (statusFilter !== 'all' && order.status !== statusFilter) return false;
        if (unitFilter !== 'all' && order.city !== unitFilter) return false;
        if (driverFilter !== 'all' && order.driverId !== driverFilter) return false;
        if (lateOnly && minutesAgo(order.createdAt) <= 20) return false;
        if (!term) return true;

        return [order.id, order.customer, order.phone, order.city, order.product, order.address, order.neighborhood, order.street, order.number, order.reference, order.paymentMethod, order.unitName, order.notes]
          .join(' ')
          .toLowerCase()
          .includes(term);
      })
      .sort((a, b) => {
        if (sortMode === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        if (sortMode === 'delayed') return minutesAgo(b.createdAt) - minutesAgo(a.createdAt);
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [driverFilter, lateOnly, orders, searchTerm, sortMode, statusFilter, unitFilter]);

  const openOrderDetails = (orderId: string) => {
    setSelectedOrderId(orderId);
    setMobileDetailsOpen(true);
    setMobileDetailsClosing(false);
    setMobileSheetDragY(0);
    setMobileSheetTouchStartY(null);
  };

  const closeOrderDetails = () => {
    if (!mobileDetailsOpen) return;
    setMobileDetailsClosing(true);
    window.setTimeout(() => {
      setMobileDetailsOpen(false);
      setMobileDetailsClosing(false);
      setMobileSheetDragY(0);
      setMobileSheetTouchStartY(null);
    }, 180);
  };

  const handleMobileSheetTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    setMobileSheetTouchStartY(event.touches[0]?.clientY ?? null);
  };

  const handleMobileSheetTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    if (mobileSheetTouchStartY == null) return;
    const currentY = event.touches[0]?.clientY;
    if (currentY == null) return;
    setMobileSheetDragY(Math.max(0, currentY - mobileSheetTouchStartY));
  };

  const handleMobileSheetTouchEnd = () => {
    if (mobileSheetDragY > 96) {
      closeOrderDetails();
      return;
    }
    setMobileSheetDragY(0);
    setMobileSheetTouchStartY(null);
  };

  const openProfileEditor = () => {
    setProfileDraft(profile);
    setProfileStatus('');
    setProfileOpen(true);
  };

  const saveProfile = () => {
    const nextProfile = {
      ...profileDraft,
      email: profileDraft.email || session?.email || ''
    };
    void fetchAdmin(`${API_BASE_URL}/admin/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile: nextProfile })
    })
      .then(async (response) => {
        const payload = (await response.json()) as { ok?: boolean; error?: string; profile?: AdminProfile };
        if (!response.ok || !payload.profile) throw new Error(payload.error ?? 'Falha ao salvar perfil.');
        setProfile(payload.profile);
        setProfileDraft(payload.profile);
        setProfileStatus('Perfil salvo.');
        window.setTimeout(() => setProfileOpen(false), 180);
        window.setTimeout(() => setProfileStatus(''), 2400);
      })
      .catch((error: Error) => setProfileStatus(error.message || 'Falha ao salvar perfil.'));
  };

  const updateProfileAvatar = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const avatarUrl = typeof reader.result === 'string' ? reader.result : '';
      setProfileDraft((current) => ({ ...current, avatarUrl }));
    };
    reader.readAsDataURL(file);
  };

  const requestCode = () => {
    if (!email.trim()) return;
    setAuthError('');
    void fetch(`${API_BASE_URL}/admin/auth/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
      .then(async (response) => {
        const payload = (await response.json()) as PendingCode & { ok?: boolean; error?: string };
        if (!response.ok) throw new Error(payload.error ?? 'Falha ao gerar código.');
        setPendingCode(payload);
        setAuthStage('approval');
        setEnteredCode('');
      })
      .catch((error: Error) => {
        setAuthError(error.message || 'Falha ao autenticar.');
        setPendingCode(null);
      });
  };

  const confirmCode = () => {
    if (!pendingCode) return;

    setAuthError('');
    void fetch(`${API_BASE_URL}/admin/auth/confirm`, {
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
      .catch((error: Error) => setAuthError(error.message || 'Código inválido.'));
  };

  const logout = () => {
    setSession(null);
    setMobileMenuOpen(false);
    setMobileDetailsOpen(false);
    setMobileDetailsClosing(false);
    setEnteredCode('');
    setPassword('');
    setAuthStage('credentials');
    setPendingCode(null);
    setAuthError('');
    setDriverDraft({ name: '', phone: '', city: 'aquidauana', active: true });
    setDriverStatus('');
    setPriceStatus('');
    setSaveNotice('');
  };

  const updateOrder = (orderId: string, next: Partial<AdminOrder>) => {
    const now = new Date().toISOString();
    let statusText = '';
    const currentOrder = orders.find((order) => order.id === orderId);
    if (currentOrder) setLastChange({ orderId, snapshot: currentOrder });

    setOrders((current) => current.map((order) => {
      if (order.id !== orderId) return order;

      const history = [...(order.history ?? [])];
      if (next.status && next.status !== order.status) history.unshift({ at: now, text: `Status alterado para ${next.status}` });
      if (next.driverId !== undefined && next.driverId !== order.driverId) {
        const driverName = next.driverId ? (drivers.find((driver) => driver.id === next.driverId)?.name ?? 'Entregador') : 'Sem entregador';
        history.unshift({ at: now, text: `Entregador definido: ${driverName}` });
      }

      if (next.status) statusText = `✓ Status atualizado para “${next.status}”`;
      else if (next.driverId !== undefined) statusText = '✓ Entregador atualizado';

      return { ...order, ...next, history, updatedAt: now };
    }));

    if (statusText) {
      setSaveNotice(statusText);
      window.setTimeout(() => setSaveNotice(''), 2800);
    }
  };

  const undoLastChange = () => {
    if (!lastChange) return;
    setOrders((current) => current.map((order) => (order.id === lastChange.orderId ? lastChange.snapshot : order)));
    setSaveNotice('Alteração desfeita.');
    setLastChange(null);
    window.setTimeout(() => setSaveNotice(''), 2200);
  };

  const updatePrice = (city: CityKey, productId: string, value: string) => {
    setPriceDrafts((current) => ({
      ...current,
      [city]: {
        ...current[city],
        [productId]: value.replace(/[^\d,.-]/g, '')
      }
    }));
    setPriceStatus('');
  };

  const savePrices = async () => {
    if (!session?.token) return;

    const normalized = createInitialPriceMatrix();
    (Object.keys(priceDrafts) as CityKey[]).forEach((city) => {
      products.forEach((product) => {
        const raw = priceDrafts[city][product.id] ?? '';
        const numeric = Number(String(raw).replace(',', '.'));
        normalized[city][product.id] = Number.isFinite(numeric) ? String(numeric) : '';
      });
    });

    try {
      const response = await fetchAdmin(`${API_BASE_URL}/prices`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prices: {
            aquidauana: {
              p13: Number(normalized.aquidauana.p13 || 0),
              p20: Number(normalized.aquidauana.p20 || 0),
              p45: Number(normalized.aquidauana.p45 || 0)
            },
            anastacio: {
              p13: Number(normalized.anastacio.p13 || 0),
              p20: Number(normalized.anastacio.p20 || 0),
              p45: Number(normalized.anastacio.p45 || 0)
            },
            miranda: {
              p13: Number(normalized.miranda.p13 || 0),
              p20: Number(normalized.miranda.p20 || 0),
              p45: Number(normalized.miranda.p45 || 0)
            }
          }
        })
      });
      const payload = (await response.json()) as { ok?: boolean; error?: string; prices?: PriceMatrix };
      if (!response.ok) throw new Error(payload.error ?? 'Falha ao salvar preços.');
      setPriceStatus('Preços salvos.');
    } catch (error) {
      setPriceStatus(error instanceof Error ? error.message : 'Falha ao salvar preços.');
    }
  };

  const openDriverForm = (driver?: Driver, resetStatus = true) => {
    if (resetStatus) setDriverStatus('');
    setDriverDraft(
      driver
        ? { id: driver.id, name: driver.name, phone: driver.phone, city: driver.city, active: driver.active }
        : { name: '', phone: '', city: 'aquidauana', active: true }
    );
  };

  const saveDriver = () => {
    if (!session?.token) return;
    const isEditing = Boolean(driverDraft.id);
    const url = isEditing ? `${API_BASE_URL}/drivers/${driverDraft.id}` : `${API_BASE_URL}/drivers`;

    void fetchAdmin(url, {
      method: isEditing ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(driverDraft)
    })
      .then(async (response) => {
        const payload = (await response.json()) as { ok?: boolean; error?: string; driver?: Driver };
        if (!response.ok || !payload.driver) throw new Error(payload.error ?? 'Falha ao salvar entregador.');
        setDrivers((current) => {
          const exists = current.some((item) => item.id === payload.driver?.id);
          return exists ? current.map((item) => (item.id === payload.driver?.id ? payload.driver! : item)) : [...current, payload.driver!];
        });
        openDriverForm(undefined, false);
        setDriverStatus(isEditing ? 'Entregador atualizado.' : 'Entregador cadastrado.');
        window.setTimeout(() => setDriverStatus(''), 2500);
      })
      .catch((error: Error) => setDriverStatus(error.message || 'Falha ao salvar entregador.'));
  };

  const deleteDriver = (driverId: string) => {
    if (!session?.token) return;
    void fetchAdmin(`${API_BASE_URL}/drivers/${driverId}`, {
      method: 'DELETE',
    })
      .then(async (response) => {
        const payload = (await response.json()) as { ok?: boolean; error?: string };
        if (!response.ok) throw new Error(payload.error ?? 'Falha ao excluir entregador.');
        setDrivers((current) => current.filter((item) => item.id !== driverId));
        if (driverDraft.id === driverId) openDriverForm(undefined, false);
        setDriverStatus('Entregador excluído.');
        window.setTimeout(() => setDriverStatus(''), 2500);
      })
      .catch((error: Error) => setDriverStatus(error.message || 'Falha ao excluir entregador.'));
  };

  const handleLoginKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    if (authStage === 'credentials') requestCode();
    else confirmCode();
  };

  if (!session) {
    return (
      <section className="relative min-h-[calc(100vh-0px)] overflow-hidden bg-[radial-gradient(circle_at_top,#7c3f1c_0%,#4a2311_45%,#1c0f0a_100%)]">
        <div className="absolute inset-0">
          <Image src="https://i.postimg.cc/252ZNJ4v/Chat-GPT-Image-31-de-jul-de-2026-07-54-05.png" alt="Matriz da Tele Gás" fill priority sizes="100vw" className="object-cover object-center opacity-18 blur-[2px] saturate-75" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(8,43,53,0.24),rgba(6,23,36,0.82)_55%,rgba(2,8,23,0.96)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,8,23,0.78)_0%,rgba(8,43,53,0.2)_50%,rgba(2,8,23,0.82)_100%)]" />
        </div>

        <div className="relative mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
          <div className="w-full max-w-[400px] rounded-[2rem] border border-white/12 bg-white/10 px-6 py-7 shadow-[0_30px_90px_rgba(0,0,0,0.42)] backdrop-blur-xl sm:px-8 sm:py-8">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/90 shadow-[0_10px_30px_rgba(0,0,0,0.12)] ring-1 ring-white/50">
              <img src={brand.logo} alt={brand.name} className="h-14 w-14 object-contain" loading="eager" />
            </div>

            <div className="mt-4 text-center">
              <h1 className="text-[1.35rem] font-semibold tracking-tight text-white">Tele Gás</h1>
              <p className="mt-1 text-sm text-slate-200/80">Administrador</p>
            </div>

            <div className="mt-6 space-y-4">
              {authStage === 'credentials' ? (
                <div className="rounded-[1.5rem] border border-white/14 bg-slate-950/28 p-5 shadow-[0_8px_20px_rgba(15,23,42,0.18)] backdrop-blur-md">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-200/90">Email</span>
                    <input value={email} onChange={(event) => setEmail(event.target.value)} onKeyDown={handleLoginKeyDown} className="w-full rounded-2xl border border-white/10 bg-white/92 px-4 py-3 text-[15px] text-slate-700 outline-none shadow-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15" placeholder="exemplo@gmail.com" />
                  </label>

                  <label className="mt-4 block">
                    <span className="mb-2 block text-sm font-medium text-slate-200/90">Senha</span>
                    <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} onKeyDown={handleLoginKeyDown} className="w-full rounded-2xl border border-white/10 bg-white/92 px-4 py-3 text-[15px] text-slate-700 outline-none shadow-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15" placeholder="••••••" />
                  </label>

                  <button type="button" onClick={requestCode} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(90deg,#0f766e_0%,#0f5f70_50%,#0f172a_100%)] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(15,118,110,0.28)] transition hover:brightness-110">
                    <KeyRound className="h-4 w-4" /> Entrar
                  </button>
                </div>
              ) : null}

              {authStage === 'approval' && pendingCode ? (
                <div className="rounded-[1.65rem] border border-white/14 bg-slate-950/28 p-5 shadow-[0_8px_20px_rgba(15,23,42,0.18)] backdrop-blur-md">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-200">Verifique sua identidade</p>
                      <p className="mt-1 text-sm text-slate-200/80">{pendingCode.prompt ?? 'Digite o código recebido no seu email.'}</p>
                    </div>
                    <ShieldCheck className="h-5 w-5 text-brand-200" />
                  </div>
                  <label className="mt-4 block">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-200/70">Código de acesso</span>
                    <input value={enteredCode} onChange={(event) => setEnteredCode(event.target.value.replace(/\D/g, '').slice(0, 6))} onKeyDown={handleLoginKeyDown} inputMode="numeric" maxLength={6} className="w-full rounded-2xl border border-white/10 bg-white/92 px-4 py-3 text-center text-lg font-semibold tracking-[0.35em] outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15" placeholder="000000" />
                    <p className="mt-2 text-right text-xs text-slate-200/60">6 dígitos</p>
                  </label>
                  <button type="button" onClick={confirmCode} className="mt-4 w-full rounded-full bg-[linear-gradient(90deg,#0f766e_0%,#0f5f70_55%,#082b35_100%)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(8,43,53,0.28)] transition hover:brightness-110">Confirmar código</button>
                  <p className="mt-3 text-center text-xs text-slate-200/65">Primeiro acesso neste dispositivo.</p>
                </div>
              ) : null}

              {authError ? <p className="text-sm font-medium text-red-700">{authError}</p> : null}

              {authStage === 'approval' ? <button type="button" onClick={() => setAuthStage('credentials')} className="block w-full text-center text-sm text-slate-700 hover:text-slate-900">Voltar</button> : <button type="button" className="block w-full text-center text-sm text-slate-700 hover:text-slate-900">Esqueci minha senha</button>}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-panel min-h-screen bg-[#eef2f7] text-slate-700">
      <div className="mx-auto flex min-h-screen max-w-[1600px] gap-6 px-4 py-4 sm:px-6 lg:px-8">
        {mobileMenuOpen ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button type="button" aria-label="Fechar menu" onClick={() => setMobileMenuOpen(false)} className="absolute inset-0 bg-slate-950/55 backdrop-blur-[2px]" />
            <div className="absolute left-3 top-3 bottom-3 w-[min(20rem,calc(100vw-1.5rem))] overflow-y-auto rounded-[1.75rem] border border-cyan-950/70 bg-[linear-gradient(180deg,#082b35_0%,#071727_58%,#031219_100%)] p-4 shadow-[0_30px_80px_rgba(2,8,23,0.45)]">
              <div className="flex items-center justify-between gap-3 rounded-[1.35rem] bg-white/8 px-4 py-3 ring-1 ring-white/10">
                <div className="flex items-center gap-3">
                  <img src={brand.logo} alt={brand.name} className="h-10 w-10 rounded-full bg-white object-contain p-1.5" loading="eager" />
                  <div>
                    <p className="text-sm font-semibold text-white">Tele Gás</p>
                    <p className="text-xs text-slate-300">Painel operacional</p>
                  </div>
                </div>
                <button type="button" aria-label="Fechar menu" onClick={() => setMobileMenuOpen(false)} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/6 text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="mt-5 space-y-2">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a key={item.id} href={`#${item.id}`} onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/8 hover:text-white">
                      <span className="flex items-center gap-3">
                        <Icon className="h-4 w-4 text-brand-300" />
                        {item.label}
                      </span>
                      <ChevronRight className="h-4 w-4 text-slate-500" />
                    </a>
                  );
                })}
              </nav>

              <div className="mt-5 rounded-[1.5rem] bg-white/8 p-4 ring-1 ring-white/10">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-200">Resumo</p>
                <div className="mt-4 grid gap-3 text-sm text-slate-200">
                  <div className="flex items-center justify-between"><span>Pedidos</span><strong className="text-white">{stats.orders}</strong></div>
                  <div className="flex items-center justify-between"><span>Em rota</span><strong className="text-white">{stats.onRoute}</strong></div>
                  <div className="flex items-center justify-between"><span>Entregadores</span><strong className="text-white">{activeDrivers.length}</strong></div>
                </div>
              </div>

              <button type="button" onClick={logout} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                <LogOut className="h-4 w-4" /> Sair
              </button>
            </div>
          </div>
        ) : null}

        <aside className="sticky top-4 hidden h-[calc(100vh-2rem)] w-72 shrink-0 flex-col rounded-[2rem] border border-cyan-950/60 bg-[linear-gradient(180deg,#082b35_0%,#071727_58%,#031219_100%)] p-5 shadow-[0_30px_80px_rgba(2,8,23,0.35)] lg:flex">
          <div className="flex items-center gap-3 rounded-[1.5rem] bg-white/8 px-4 py-3 ring-1 ring-white/10">
            <img src={brand.logo} alt={brand.name} className="h-12 w-12 rounded-full bg-white object-contain p-1.5" loading="eager" />
            <div>
              <p className="text-sm font-semibold text-white">Tele Gás</p>
              <p className="text-xs text-slate-300">Painel operacional</p>
            </div>
          </div>

          <nav className="mt-8 space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <a key={item.id} href={`#${item.id}`} className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/8 hover:text-white">
                  <span className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-brand-300" />
                    {item.label}
                  </span>
                  <ChevronRight className="h-4 w-4 text-slate-500" />
                </a>
              );
            })}
          </nav>

          <div className="mt-6 rounded-[1.5rem] bg-white/8 p-4 ring-1 ring-white/10">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-200">Resumo</p>
            <div className="mt-4 grid gap-3 text-sm text-slate-200">
              <div className="flex items-center justify-between"><span>Pedidos</span><strong className="text-white">{stats.orders}</strong></div>
              <div className="flex items-center justify-between"><span>Em rota</span><strong className="text-white">{stats.onRoute}</strong></div>
              <div className="flex items-center justify-between"><span>Entregadores</span><strong className="text-white">{activeDrivers.length}</strong></div>
            </div>
          </div>

          <div className="mt-auto pt-6">
            <button type="button" onClick={logout} className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
              <LogOut className="h-4 w-4" /> Sair
            </button>
          </div>
        </aside>

        <div className="min-w-0 flex-1 space-y-5 sm:space-y-6">
          <header className="rounded-[2rem] border border-orange-100 bg-[linear-gradient(135deg,rgba(255,247,237,0.98)_0%,rgba(255,255,255,0.98)_45%,rgba(255,237,213,0.92)_100%)] p-4 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1 font-[family-name:var(--font-manrope)] text-slate-950">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">Bem-vindo,</p>
                <h1 className="text-[1.8rem] font-normal leading-none tracking-tight sm:text-4xl">{profileFirstName}.</h1>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <button type="button" aria-label={alertCount ? `${alertCount} alertas` : 'Sem alertas'} className={cn('relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-white shadow-sm sm:h-12 sm:w-12', freshOrderIds.length ? 'animate-pulse' : '')}>
                  <Bell className="h-5 w-5 text-white" />
                  {alertCount ? <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">{alertCount > 9 ? '9+' : alertCount}</span> : null}
                </button>
                <button type="button" onClick={() => setMobileMenuOpen(true)} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm lg:hidden">
                  <Menu className="h-5 w-5" />
                </button>
                <div className="hidden items-center gap-2 sm:flex">
                  <button type="button" onClick={openProfileEditor} className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm ring-1 ring-white/80 transition hover:scale-[1.02]">
                    {profile.avatarUrl ? <img src={profile.avatarUrl} alt={profileLabel} className="h-full w-full object-cover" /> : <span className="text-sm font-semibold text-slate-600">{profileInitials}</span>}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(220px,0.45fr)_auto]">
              <label className="relative block">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Buscar pedido, cliente ou telefone..." className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pl-11 text-sm outline-none transition focus:border-brand-500 focus:bg-white" />
              </label>

              <label className="block">
                <select value={unitFilter} onChange={(event) => setUnitFilter(event.target.value as 'all' | CityKey)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:bg-white">
                  <option value="all">Todas as unidades</option>
                  {cities.map((city) => <option key={city.key} value={city.key}>{city.label}</option>)}
                </select>
              </label>

              <button type="button" aria-label="Atualizar" onClick={() => window.location.reload()} className="inline-flex items-center justify-center rounded-2xl bg-[#0f5f5d] px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(15,95,93,0.28)] transition hover:bg-[#0b4e4c]">
                <RefreshCcw className="h-4 w-4" />
              </button>
            </div>

            {newOrderNotice ? <div className="mt-3 inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200"><CircleDot className="h-4 w-4" /> {newOrderNotice}</div> : null}
          </header>

          <div id="dashboard" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {kpis.map((item) => (
              <StatCard key={item.title} title={item.title} value={String(item.value)} helper={item.helper} icon={item.icon} tone={item.tone} />
            ))}
          </div>

          <div className="flex flex-nowrap gap-2 overflow-x-auto rounded-[1.5rem] border border-white bg-white/85 p-3 shadow-[0_12px_40px_rgba(15,23,42,0.06)] sm:flex-wrap sm:overflow-visible">
            {(['all', 'Novo', 'Em preparação', 'Pronto para saída', 'Saiu para entrega', 'Entregue'] as const).map((item) => (
              <button key={item} type="button" onClick={() => setStatusFilter(item)} className={cn('rounded-full px-4 py-2 text-sm font-semibold transition', statusFilter === item ? 'bg-slate-900 text-white shadow-sm' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50')}>
                {item === 'all' ? 'Todos os status' : item}
              </button>
            ))}
            <button type="button" onClick={() => setLateOnly((current) => !current)} className={cn('rounded-full px-4 py-2 text-sm font-semibold transition', lateOnly ? 'bg-amber-500 text-white shadow-sm' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50')}>
              Atrasados
            </button>
            {saveNotice ? <span className="ml-auto rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 ring-1 ring-emerald-200">{saveNotice}</span> : null}
            {lastChange ? <button type="button" onClick={undoLastChange} className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50">Desfazer</button> : null}
          </div>

          <div id="orders" className="grid gap-6 xl:grid-cols-[minmax(0,1.18fr)_minmax(380px,0.82fr)]">
            <section className="rounded-[2rem] border border-white bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700">Pedidos</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Fila operacional</h2>
                  <p className="mt-1 text-sm text-slate-500">Selecione um pedido para abrir os detalhes e o rastreio.</p>
                </div>
                <Badge tone="brand">{filteredOrders.length} visiveis</Badge>
              </div>

              <div className="mt-5 space-y-3">
                {filteredOrders.map((order) => {
                  const isSelected = order.id === selectedOrderId;
                  const severity = orderSeverity(order);
                  const driver = order.driverId ? drivers.find((item) => item.id === order.driverId) : null;

                  return (
                    <button key={order.id} type="button" onClick={() => openOrderDetails(order.id)} className={cn('group w-full rounded-[1.65rem] border p-3.5 text-left transition active:scale-[0.99] sm:p-4', freshOrderIds.includes(order.id) ? 'ring-2 ring-emerald-300' : '', isSelected ? 'border-brand-300 bg-brand-50/70 shadow-[0_0_0_1px_rgba(245,158,11,0.15)]' : 'border-slate-200 bg-white hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md')}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[1rem] font-semibold text-slate-950 sm:text-lg">{order.id}</span>
                            <Badge tone={order.status === 'Entregue' ? 'emerald' : order.status === 'Saiu para entrega' ? 'cyan' : order.status === 'Em preparação' ? 'amber' : 'slate'}>{order.status}</Badge>
                          </div>
                          <p className="mt-2 truncate text-[0.98rem] font-semibold text-slate-900 sm:text-sm">{order.customer}</p>
                          <p className="mt-1 text-xs text-slate-500 sm:text-sm">{cityLabel(order.city)} • {order.neighborhood}</p>
                        </div>

                        <div className="text-right">
                          <p className="text-[1.05rem] font-semibold text-slate-950 sm:text-lg">{formatCurrency(order.total)}</p>
                          <p className="mt-1 text-[11px] text-slate-500 sm:text-xs">há {minutesAgo(order.updatedAt)} min</p>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-nowrap items-center gap-2 overflow-x-auto pb-1 text-sm text-slate-600 sm:flex-wrap sm:overflow-visible sm:pb-0">
                        <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs sm:text-sm">{order.product} × {order.quantity}</span>
                        <span className="hidden shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs sm:inline-flex sm:text-sm">{order.unitName}</span>
                        <span className={cn('shrink-0 rounded-full px-3 py-1 text-xs font-medium sm:text-sm', severity === 'late' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600')}>{statusLabel(order)}</span>
                        {driver ? <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs sm:text-sm">{driver.name}</span> : null}
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400 sm:text-xs">{order.paymentMethod}</p>
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 group-active:translate-x-0.5 sm:group-hover:translate-x-0.5">
                          Ver detalhes <ChevronRight className="h-4 w-4" />
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            <div className="space-y-6">
              <section className="hidden rounded-[2rem] border border-white bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] xl:block">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700">Resumo do pedido</p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{selectedOrder.id}</h2>
                    <p className="mt-1 text-sm text-slate-500">{selectedOrder.customer} • {cityLabel(selectedOrder.city)}</p>
                  </div>
                  <Badge tone={selectedOrder.status === 'Entregue' ? 'emerald' : selectedOrder.status === 'Saiu para entrega' ? 'cyan' : selectedOrder.status === 'Em preparação' ? 'amber' : 'slate'}>{selectedOrder.status}</Badge>
                </div>

                <div className="mt-5 grid gap-4 rounded-[1.5rem] bg-slate-50 p-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Cliente</p>
                      <p className="mt-2 text-base font-semibold text-slate-950">{selectedOrder.customer}</p>
                      <a href={`tel:${selectedOrder.phone.replace(/\D/g, '')}`} className="mt-1 block text-sm text-brand-700">{selectedOrder.phone}</a>
                    </div>
                    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Operação</p>
                      <p className="mt-2 text-base font-semibold text-slate-950">{selectedOrder.unitName}</p>
                      <p className="mt-1 text-sm text-slate-500">Atualizado há {minutesAgo(selectedOrder.updatedAt)} min</p>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Compra</p>
                      <p className="mt-2 text-sm text-slate-700">{selectedOrder.product} • {selectedOrder.quantity} unidade(s)</p>
                      <p className="mt-2 text-lg font-semibold text-slate-950">{formatCurrency(selectedOrder.total)}</p>
                    </div>
                    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Pagamento</p>
                      <p className="mt-2 text-sm text-slate-700">{selectedOrder.paymentMethod}</p>
                      <p className="mt-2 text-sm text-slate-500">Troco: {selectedOrder.changeFor || 'Não precisa'}</p>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Endereço</p>
                    <p className="mt-2 text-sm font-medium text-slate-900">{selectedOrder.address}</p>
                    <p className="mt-1 text-sm text-slate-500">{selectedOrder.reference || 'Sem referência informada'}</p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Status</span>
                      <select value={selectedOrder.status} onChange={(event) => updateOrder(selectedOrder.id, { status: event.target.value as OrderStatus })} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500">
                        {orderStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
                      </select>
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Entregador</span>
                      <select value={selectedOrder.driverId ?? ''} onChange={(event) => updateOrder(selectedOrder.id, { driverId: event.target.value || null })} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500">
                        <option value="">Atribuir depois</option>
                        {drivers.filter((driver) => driver.city === selectedOrder.city || driver.city === 'aquidauana').map((driver) => <option key={driver.id} value={driver.id}>{driver.name}</option>)}
                      </select>
                    </label>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <a href={buildWhatsAppUrl(selectedOrder.phone, `Olá, falando da Tele Gás sobre o pedido ${selectedOrder.id}.`)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(245,158,11,0.25)] hover:bg-brand-600">WhatsApp</a>
                  <a href={`tel:${selectedOrder.phone.replace(/\D/g, '')}`} className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Ligar</a>
                  <button type="button" onClick={() => navigator.clipboard?.writeText(selectedOrder.address)} className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Copiar endereço</button>
                  {selectedOrder.status === 'Saiu para entrega' ? <button type="button" onClick={() => updateOrder(selectedOrder.id, { status: 'Entregue' })} className="rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-black">Marcar entregue</button> : null}
                  {selectedOrder.status !== 'Saiu para entrega' && selectedOrder.status !== 'Entregue' ? <button type="button" onClick={() => updateOrder(selectedOrder.id, { status: 'Saiu para entrega' })} className="rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-black">Atualizar status</button> : null}
                  {selectedOrder.status === 'Saiu para entrega' && selectedDriver ? <a href={`tel:${selectedDriver.phone.replace(/\D/g, '')}`} className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Falar com entregador</a> : null}
                </div>

                <div className="mt-4 grid gap-3 rounded-[1.5rem] bg-slate-50 p-4 sm:grid-cols-3">
                  <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Tempo</p>
                    <p className="mt-2 text-sm font-semibold text-slate-950">{statusLabel(selectedOrder)}</p>
                  </div>
                  <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Urgência</p>
                    <p className={cn('mt-2 text-sm font-semibold', orderSeverity(selectedOrder) === 'late' ? 'text-amber-700' : 'text-slate-950')}>{orderSeverity(selectedOrder) === 'late' ? 'Requer atenção' : 'Normal'}</p>
                  </div>
                  <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Atualização</p>
                    <p className="mt-2 text-sm font-semibold text-slate-950">{formatTime(selectedOrder.updatedAt)}</p>
                  </div>
                </div>

                <div className="mt-4 rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Timeline</p>
                  <div className="mt-3 space-y-3">
                    {selectedOrder.history.map((item) => (
                      <div key={`${item.at}-${item.text}`} className="flex gap-3 text-sm">
                        <span className="min-w-16 text-slate-400">{formatTime(item.at)}</span>
                        <span className="text-slate-700">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section id="tracking" className="hidden rounded-[2rem] border border-white bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] xl:block">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700">Rastreamento</p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-950">Rota ao vivo</h2>
                  </div>
                  <MapPinned className="h-5 w-5 text-brand-600" />
                </div>
                <div className="mt-4 rounded-[1.5rem] border border-dashed border-brand-200 bg-gradient-to-br from-brand-50 via-white to-sky-50 p-4">
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>Pedido selecionado</span>
                    <span className="font-semibold text-slate-950">{selectedOrder.id}</span>
                  </div>
                  <div className="mt-4 flex h-48 items-center justify-center rounded-[1.25rem] bg-white text-center shadow-sm">
                    <div>
                      <MapPinned className="mx-auto h-8 w-8 text-brand-600" />
                      <p className="mt-3 text-sm font-semibold text-slate-900">Rastreamento ainda não disponível</p>
                      <p className="mt-2 text-sm text-slate-500">{selectedDriver ? `O entregador ${selectedDriver.name} está responsável por este pedido.` : 'Atribua um entregador para ativar o rastreio.'}</p>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white px-4 py-3 text-sm shadow-sm">
                      <p className="font-semibold text-slate-900">Entregador</p>
                      <p className="mt-1 text-slate-500">{selectedDriver ? selectedDriver.name : 'Não atribuído'}</p>
                    </div>
                    <div className="rounded-2xl bg-white px-4 py-3 text-sm shadow-sm">
                      <p className="font-semibold text-slate-900">Última posição</p>
                      <p className="mt-1 text-slate-500">{selectedDriver ? `${selectedDriver.lat.toFixed(4)}, ${selectedDriver.lng.toFixed(4)}` : '-'}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <a href={selectedOrder.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedOrder.address)}` : '#'} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600">Abrir rota <ArrowUpRight className="h-4 w-4" /></a>
                    <button type="button" onClick={() => navigator.clipboard?.writeText(selectedOrder.address)} className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Copiar localização</button>
                  </div>
                </div>
              </section>

              <section id="drivers" className="hidden rounded-[2rem] border border-white bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] xl:block">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700">Entregadores</p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-950">Equipe ativa</h2>
                  </div>
                  <Users className="h-5 w-5 text-brand-600" />
                </div>

                <div className="mt-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-950">{driverDraft.id ? 'Editar entregador' : 'Novo entregador'}</p>
                      <p className="text-xs text-slate-500">{driverStatus || 'Cadastre ou altere os dados da equipe.'}</p>
                    </div>
                    {driverDraft.id ? <Badge tone="amber">Editando</Badge> : <button type="button" onClick={() => openDriverForm()} className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-600"><Plus className="h-3.5 w-3.5" /> Novo</button>}
                  </div>

                  <div className="mt-4 grid gap-3">
                    <input value={driverDraft.name} onChange={(event) => setDriverDraft((current) => ({ ...current, name: event.target.value }))} placeholder="Nome" className="w-full rounded-2xl border border-white bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500" />
                    <input value={driverDraft.phone} onChange={(event) => setDriverDraft((current) => ({ ...current, phone: event.target.value }))} placeholder="Telefone" className="w-full rounded-2xl border border-white bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500" />
                    <select value={driverDraft.city} onChange={(event) => setDriverDraft((current) => ({ ...current, city: event.target.value as CityKey }))} className="w-full rounded-2xl border border-white bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500">
                      {cities.map((city) => <option key={city.key} value={city.key}>{city.label}</option>)}
                    </select>
                    <label className="flex items-center gap-3 rounded-2xl border border-white bg-white px-4 py-3 text-sm text-slate-700">
                      <input type="checkbox" checked={driverDraft.active} onChange={(event) => setDriverDraft((current) => ({ ...current, active: event.target.checked }))} className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
                      Ativo
                    </label>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button type="button" onClick={saveDriver} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black">{driverDraft.id ? 'Salvar edição' : 'Cadastrar'}</button>
                    <button type="button" onClick={() => openDriverForm()} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Limpar</button>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {drivers.map((driver) => (
                    <div key={driver.id} className="rounded-[1.35rem] border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-950">{driver.name}</p>
                          <p className="text-sm text-slate-500">{driver.phone} • {cityLabel(driver.city)}</p>
                        </div>
                        <Badge tone={driver.active ? 'emerald' : 'slate'}>{driver.active ? 'Online' : 'Offline'}</Badge>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button type="button" onClick={() => updateOrder(selectedOrder.id, { driverId: driver.id })} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">Atribuir</button>
                        <button type="button" onClick={() => openDriverForm(driver)} className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"><Pencil className="h-3.5 w-3.5" /> Editar</button>
                        <button type="button" onClick={() => deleteDriver(driver.id)} className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100"><Trash2 className="h-3.5 w-3.5" /> Excluir</button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>

          <div id="units" className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
            <section className="hidden rounded-[2rem] border border-white bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] xl:block">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700">Unidades</p>
                  <h2 className="mt-2 text-xl font-semibold text-slate-950">Valores por unidade</h2>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">P13 • P20 • P45</span>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-3">
                {cities.map((city) => (
                  <div key={city.key} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-slate-950">{city.label}</p>
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Tabela</span>
                    </div>
                    <div className="mt-3 space-y-3">
                      {products.map((product) => (
                        <label key={`${city.key}-${product.id}`} className="grid grid-cols-[1fr_96px] items-center gap-3 rounded-2xl border border-white bg-white px-3 py-2 shadow-sm">
                          <span className="text-sm font-medium text-slate-700">{product.name}</span>
                          <input type="number" min={0} step="0.01" value={priceDrafts[city.key][product.id]} onChange={(event) => updatePrice(city.key, product.id, event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-right text-sm font-semibold text-slate-900 outline-none transition focus:border-brand-500" />
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <p className="text-sm text-slate-500">{priceStatus || 'Edite e salve os valores por cidade.'}</p>
                <button type="button" onClick={savePrices} className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600">
                  Salvar preços
                </button>
              </div>
            </section>

            <section id="settings" className="hidden rounded-[2rem] border border-white bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] xl:block">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700">Configurações</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-950">Painel do dia</h2>
              <div className="mt-4 space-y-3 rounded-[1.5rem] bg-slate-50 p-4 text-sm text-slate-700">
                <div className="flex items-center justify-between"><span>Sessão</span><strong className="text-slate-950">{session.email}</strong></div>
                <div className="flex items-center justify-between"><span>Pedidos totais</span><strong className="text-slate-950">{stats.orders}</strong></div>
                <div className="flex items-center justify-between"><span>Alertas</span><strong className="text-slate-950">{stats.delayed}</strong></div>
                <div className="flex items-center justify-between"><span>Entregadores ativos</span><strong className="text-slate-950">{activeDrivers.length}</strong></div>
              </div>
              <div className="mt-4 rounded-[1.5rem] border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-500">
                Layout pensado para operação rápida, com foco em pedidos, rastreio e equipe.
              </div>
            </section>
          </div>

          {mobileDetailsOpen || mobileDetailsClosing ? (
            <div className="fixed inset-0 z-40 xl:hidden">
              <button type="button" aria-label="Fechar detalhes" onClick={closeOrderDetails} className={cn('absolute inset-0 bg-slate-950/45 backdrop-blur-[2px] transition-opacity duration-200', mobileDetailsClosing ? 'opacity-0' : 'opacity-100')} />
              <div
                className={cn('absolute inset-x-0 bottom-0 flex max-h-[86vh] flex-col overflow-hidden rounded-t-[2rem] border-t border-slate-200 bg-[#f8fafc] shadow-[0_-20px_60px_rgba(15,23,42,0.24)] transition-all duration-200 ease-out', mobileDetailsClosing ? 'opacity-0' : 'opacity-100')}
                style={{ transform: mobileDetailsClosing ? 'translateY(100%)' : `translateY(${mobileSheetDragY}px)` }}
              >
                <div
                  className="touch-none px-4 pt-4"
                  onTouchStart={handleMobileSheetTouchStart}
                  onTouchMove={handleMobileSheetTouchMove}
                  onTouchEnd={handleMobileSheetTouchEnd}
                >
                <div className="mx-auto mb-3 h-1.5 w-14 rounded-full bg-slate-300" />

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-700">Resumo do pedido</p>
                    <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">{selectedOrder.id}</h2>
                    <p className="mt-1 text-sm text-slate-500">{selectedOrder.customer} • {cityLabel(selectedOrder.city)}</p>
                  </div>
                  <button type="button" onClick={closeOrderDetails} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 pb-4 pt-4">
                <div className="grid gap-3">
                  <div className="rounded-[1.35rem] border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Cliente</p>
                    <p className="mt-2 text-sm font-semibold text-slate-950">{selectedOrder.customer}</p>
                    <a href={`tel:${selectedOrder.phone.replace(/\D/g, '')}`} className="mt-1 block text-sm text-brand-700">{selectedOrder.phone}</a>
                  </div>

                  <div className="rounded-[1.35rem] border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Compra</p>
                    <p className="mt-2 text-sm text-slate-700">{selectedOrder.product} • {selectedOrder.quantity} unidade(s)</p>
                    <p className="mt-2 text-lg font-semibold text-slate-950">{formatCurrency(selectedOrder.total)}</p>
                    <p className="mt-1 text-sm text-slate-500">{selectedOrder.paymentMethod} • Troco: {selectedOrder.changeFor || 'Não precisa'}</p>
                  </div>

                  <div className="rounded-[1.35rem] border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Endereço</p>
                    <p className="mt-2 text-sm font-medium text-slate-900">{selectedOrder.address}</p>
                    <p className="mt-1 text-sm text-slate-500">{selectedOrder.reference || 'Sem referência informada'}</p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Status</span>
                      <select value={selectedOrder.status} onChange={(event) => updateOrder(selectedOrder.id, { status: event.target.value as OrderStatus })} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand-500">
                        {orderStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
                      </select>
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Entregador</span>
                      <select value={selectedOrder.driverId ?? ''} onChange={(event) => updateOrder(selectedOrder.id, { driverId: event.target.value || null })} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand-500">
                        <option value="">Atribuir depois</option>
                        {drivers.filter((driver) => driver.city === selectedOrder.city || driver.city === 'aquidauana').map((driver) => <option key={driver.id} value={driver.id}>{driver.name}</option>)}
                      </select>
                    </label>
                  </div>

                  <div className="rounded-[1.35rem] border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Timeline</p>
                    <div className="mt-3 space-y-2">
                      {selectedOrder.history.map((item) => (
                        <div key={`${item.at}-${item.text}`} className="flex gap-3 text-sm">
                          <span className="min-w-14 text-slate-400">{formatTime(item.at)}</span>
                          <span className="text-slate-700">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                </div>

                <div className="sticky bottom-0 border-t border-slate-200 bg-[#f8fafc]/95 px-4 py-3 backdrop-blur-sm">
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    <a href={buildWhatsAppUrl(selectedOrder.phone, `Olá, falando da Tele Gás sobre o pedido ${selectedOrder.id}.`)} target="_blank" rel="noreferrer" className="shrink-0 rounded-full bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white">WhatsApp</a>
                    <a href={`tel:${selectedOrder.phone.replace(/\D/g, '')}`} className="shrink-0 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700">Ligar</a>
                    <button type="button" onClick={() => navigator.clipboard?.writeText(selectedOrder.address)} className="shrink-0 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700">Copiar endereço</button>
                    {selectedOrder.status === 'Saiu para entrega' ? <button type="button" onClick={() => updateOrder(selectedOrder.id, { status: 'Entregue' })} className="shrink-0 rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white">Entregue</button> : null}
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {profileOpen ? (
            <div className="fixed inset-0 z-[60]">
              <button type="button" aria-label="Fechar perfil" onClick={() => setProfileOpen(false)} className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]" />
              <div className="absolute right-4 top-20 z-10 w-[min(42rem,calc(100vw-2rem))] overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.24)]">
                <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
                  <div>
                    {profileStatus ? <p className="mt-1 text-sm text-slate-500">{profileStatus}</p> : null}
                  </div>
                  <button type="button" onClick={() => setProfileOpen(false)} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600">Fechar</button>
                </div>

                <div className="grid gap-5 p-5 md:grid-cols-[140px_1fr]">
                  <div className="space-y-3">
                    <button type="button" onClick={() => document.getElementById('profile-avatar-input')?.click()} className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200 transition hover:scale-[1.01]">
                      {profileDraft.avatarUrl ? <img src={profileDraft.avatarUrl} alt={profileDraft.name || profileDraft.username} className="h-full w-full object-cover" /> : <span className="text-3xl font-semibold text-slate-500">{profileInitials}</span>}
                    </button>
                    <input id="profile-avatar-input" type="file" accept="image/*" onChange={(event) => updateProfileAvatar(event.target.files?.[0] ?? undefined)} className="hidden" />
                    <p className="text-center text-xs text-slate-500">Clique na foto para trocar</p>
                  </div>

                  <div className="grid gap-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Nome</span>
                        <input value={profileDraft.name} onChange={(event) => setProfileDraft((current) => ({ ...current, name: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand-500" placeholder="Nome completo" />
                      </label>

                      <label className="block">
                        <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Nome de usuário</span>
                        <input value={profileDraft.username} onChange={(event) => setProfileDraft((current) => ({ ...current, username: event.target.value.replace(/\s/g, '') }))} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand-500" placeholder="quintana.mqf" />
                      </label>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Email</span>
                        <input value={profileDraft.email} onChange={(event) => setProfileDraft((current) => ({ ...current, email: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand-500" placeholder="email@empresa.com" />
                      </label>

                      <label className="block">
                        <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Telefone</span>
                        <input value={profileDraft.phone} onChange={(event) => setProfileDraft((current) => ({ ...current, phone: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand-500" placeholder="(67) 9xxxx-xxxx" />
                      </label>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <div className="flex flex-wrap gap-2">
                        <button type="button" onClick={() => setProfileDraft(profile)} className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Reverter</button>
                        <button type="button" onClick={saveProfile} className="rounded-full bg-[linear-gradient(90deg,#0f766e_0%,#0f5f70_55%,#082b35_100%)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(8,43,53,0.28)] transition hover:brightness-110">Salvar perfil</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function StatCard({ title, value, helper, icon: Icon, tone = 'brand' }: { title: string; value: string; helper: string; icon: typeof CircleDot; tone?: 'brand' | 'emerald' | 'amber' | 'cyan' }) {
  const toneClass =
    tone === 'emerald' ? 'from-emerald-500/10 to-emerald-50 border-emerald-100 text-emerald-700' :
    tone === 'amber' ? 'from-amber-500/10 to-amber-50 border-amber-100 text-amber-700' :
    tone === 'cyan' ? 'from-cyan-500/10 to-cyan-50 border-cyan-100 text-cyan-700' :
    'from-brand-500/10 to-brand-50 border-brand-100 text-brand-700';

  return (
    <div className={cn('relative overflow-hidden rounded-[1.5rem] border bg-gradient-to-br p-4 shadow-[0_14px_30px_rgba(15,23,42,0.06)]', toneClass)}>
      <Icon className="absolute right-4 top-4 h-5 w-5 opacity-60" />
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{title}</p>
      <p className="mt-3 text-3xl font-semibold text-slate-950">{value}</p>
      <p className="mt-2 text-sm text-slate-600">{helper}</p>
    </div>
  );
}
