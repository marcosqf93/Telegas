"use client";

import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import { forwardRef, useEffect, useMemo, useState, type InputHTMLAttributes } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { orderSchema, type OrderFormInput, type OrderFormValues } from '@/lib/order-schema';
import {
  cities,
  orderPayments,
  products,
  units,
  aquidauanaBranches,
  aquidauanaNeighborhoods,
  anastacioNeighborhoods,
  mirandaNeighborhoods,
  anastacioBranches,
  type AquidauanaBranch,
  type AnastacioBranch
} from '@/lib/site-data';
import { buildWhatsAppUrl, cityLabel, formatCurrency, getLocalStorage, removeLocalStorage, setLocalStorage } from '@/lib/utils';
import { Button } from './ui/button';
import { trackEvent } from '@/lib/analytics';
import { useCity } from './city-provider';

const LAST_ORDER_KEY = 'telegas:last-order';
const LOCATION_KEY = 'telegas:location-consent';
const ANASTACIO_BRANCH_KEY = 'telegas:anastacio-branch';

function normalizeText(value: string) {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function productBadge(slug: string) {
  if (slug === 'gas-p13') return 'Uso residencial';
  if (slug === 'gas-p20') return 'Maior autonomia';
  return 'Comércio e empresas';
}

function productHint(slug: string) {
  if (slug === 'gas-p13') return 'Botijão tradicional';
  if (slug === 'gas-p20') return 'Mais autonomia no uso diário';
  return 'Ideal para empresas e consumo maior';
}

function WhatsAppIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.05 4.95A10.78 10.78 0 0 0 12.01 2C6.49 2 2 6.48 2 12c0 1.76.46 3.48 1.34 4.99L2 22l5.16-1.35A9.96 9.96 0 0 0 12 22c5.52 0 10-4.48 10-10 0-2.67-1.04-5.18-2.95-7.05Zm-7.04 15.3c-1.58 0-3.13-.42-4.48-1.22l-.32-.19-3.06.8.82-2.98-.21-.33A7.95 7.95 0 0 1 4 12c0-4.42 3.59-8 8.01-8 2.14 0 4.15.83 5.66 2.34A7.94 7.94 0 0 1 20 12c0 4.42-3.58 8.25-7.99 8.25Zm4.42-5.9c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.02-.37-1.94-1.18-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.46-.39-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.86.84-.86 2.05s.88 2.38 1 2.55c.12.16 1.74 2.65 4.22 3.72.59.26 1.06.41 1.42.52.6.19 1.14.16 1.57.1.48-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" />
    </svg>
  );
}

function resolveAquidauanaBranch(neighborhood: string, preferredKey?: AquidauanaBranch['key']) {
  const text = normalizeText(neighborhood);
  const matchedNeighborhood = aquidauanaNeighborhoods.find((item) => normalizeText(item.label) === text);
  if (matchedNeighborhood) return aquidauanaBranches.find((branch) => branch.key === matchedNeighborhood.branchKey) ?? aquidauanaBranches[0];

  if (preferredKey) {
    const saved = aquidauanaBranches.find((branch) => branch.key === preferredKey);
    if (saved) return saved;
  }

  if (text.includes('santa terezinha')) return aquidauanaBranches[0];
  if (text.includes('cidade nova') || text.includes('chapecoense')) return aquidauanaBranches[2];
  if (text.includes('centro') || text.includes('mato grosso') || text.includes('nova aquidauana')) return aquidauanaBranches[1];
  return aquidauanaBranches[0];
}

function resolveAnastacioBranch(neighborhood: string, preferredKey?: AnastacioBranch['key']) {
  const text = normalizeText(neighborhood);
  const matchedNeighborhood = anastacioNeighborhoods.find((item) => normalizeText(item.label) === text);
  if (matchedNeighborhood) return anastacioBranches.find((branch) => branch.key === matchedNeighborhood.branchKey) ?? anastacioBranches[1];

  if (preferredKey) {
    const saved = anastacioBranches.find((branch) => branch.key === preferredKey);
    if (saved) return saved;
  }

  if (text.includes('cristo rei') || text.includes('sam rafael')) return anastacioBranches[2];
  if (text.includes('27') || text.includes('centro')) return anastacioBranches[0];
  if (text.includes('vila maior')) return anastacioBranches[1];
  return anastacioBranches[1];
}

export function OrderWizard({ defaultCity, defaultProduct }: { defaultCity?: string; defaultProduct?: string }) {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [remembered, setRemembered] = useState<OrderFormValues | null>(null);
  const [selectedAquidauanaBranch, setSelectedAquidauanaBranch] = useState<AquidauanaBranch>(aquidauanaBranches[0]);
  const [selectedAnastacioBranch, setSelectedAnastacioBranch] = useState<AnastacioBranch>(anastacioBranches[1]);
  const { city: selectedCity } = useCity();

  const form = useForm<OrderFormInput, unknown, OrderFormValues>({
    resolver: zodResolver(orderSchema),
    shouldFocusError: true,
    defaultValues: {
      city: (defaultCity as OrderFormValues['city']) ?? 'aquidauana',
      productId: defaultProduct ?? '',
      quantity: 1,
      name: '',
      whatsapp: '',
      cep: '',
      street: '',
      number: '',
      neighborhood: '',
      complement: '',
      reference: '',
      paymentMethod: 'PIX',
      needChange: false,
      changeFor: '',
      notes: '',
      storeDataConsent: false
    }
  });

  const city = form.watch('city') as OrderFormValues['city'];
  const productId = form.watch('productId');
  const quantity = form.watch('quantity');
  const paymentMethod = form.watch('paymentMethod');
  const needChange = form.watch('needChange');
  const neighborhood = form.watch('neighborhood');
  const street = form.watch('street');
  const number = form.watch('number');
  const complement = form.watch('complement');
  const reference = form.watch('reference');

  const product = products.find((item) => item.slug === productId || item.id === productId);
  const fallbackUnit = units.find((item) => item.key === city) ?? units[0];
  const price = product?.pricesByUnit[city as keyof typeof product.pricesByUnit] ?? null;
  const total = price == null ? null : price * (Number(quantity) || 1);
  const neighborhoodOptions = city === 'aquidauana' ? aquidauanaNeighborhoods : city === 'anastacio' ? anastacioNeighborhoods : city === 'miranda' ? mirandaNeighborhoods : [];
  const showNeighborhoodSelect = neighborhoodOptions.length > 0;

  const steps = 4;

  useEffect(() => {
    if (!needChange) form.setValue('changeFor', '');
  }, [needChange, form]);

  useEffect(() => {
    if (paymentMethod !== 'Dinheiro') {
      form.setValue('needChange', false);
      form.setValue('changeFor', '');
    }
  }, [paymentMethod, form]);

  useEffect(() => {
    const stored = getLocalStorage<OrderFormValues | null>(LAST_ORDER_KEY, null);
    setRemembered(stored);
    if (stored) {
      form.reset({ ...form.getValues(), ...stored, storeDataConsent: true });
    }
  }, [form]);

  useEffect(() => {
    if (!defaultCity) {
      form.setValue('city', selectedCity);
    }
  }, [defaultCity, form, selectedCity]);

  useEffect(() => {
    const validNeighborhoods = city === 'aquidauana' ? aquidauanaNeighborhoods : city === 'anastacio' ? anastacioNeighborhoods : city === 'miranda' ? mirandaNeighborhoods : [];
    const currentNeighborhood = form.getValues('neighborhood');
    if (currentNeighborhood && validNeighborhoods.length > 0 && !validNeighborhoods.some((item) => item.label === currentNeighborhood)) {
      form.setValue('neighborhood', '');
    }
  }, [city, form]);

  useEffect(() => {
    const savedAquidauana = getLocalStorage<{ branchKey?: AquidauanaBranch['key'] } | null>(LOCATION_KEY, null);
    if (city === 'aquidauana') {
      setSelectedAquidauanaBranch(resolveAquidauanaBranch(neighborhood, savedAquidauana?.branchKey));
    }
    if (city === 'anastacio') {
      const savedAnastacio = getLocalStorage<{ branchKey?: AnastacioBranch['key'] } | null>(ANASTACIO_BRANCH_KEY, null);
      setSelectedAnastacioBranch(resolveAnastacioBranch(neighborhood, savedAnastacio?.branchKey));
    }
  }, [city, neighborhood]);

  useEffect(() => {
    const onLocationUpdated = (event: Event) => {
      const custom = event as CustomEvent<AquidauanaBranch>;
      if (city === 'aquidauana') setSelectedAquidauanaBranch(custom.detail);
    };

    window.addEventListener('telegas:location-updated', onLocationUpdated as EventListener);
    return () => window.removeEventListener('telegas:location-updated', onLocationUpdated as EventListener);
  }, [city]);

  useEffect(() => {
    trackEvent({ name: 'start_order' });
  }, []);

  useEffect(() => {
    trackEvent({ name: 'advance_step', params: { step } });
  }, [step]);

  useEffect(() => {
    const onBeforeUnload = () => {
      if (step < 4) trackEvent({ name: 'order_abandoned', params: { step } });
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [step]);

  const progress = (step / steps) * 100;
  const responsibleBranch = city === 'aquidauana' ? selectedAquidauanaBranch : city === 'anastacio' ? selectedAnastacioBranch : null;
  const responsibleUnitLabel = responsibleBranch ? `${responsibleBranch.name} - ${responsibleBranch.address}` : fallbackUnit.name;

  const onSubmit = form.handleSubmit((values) => {
    setIsSubmitted(true);
    if (values.storeDataConsent) {
      setLocalStorage(LAST_ORDER_KEY, values);
    }

    const destinationPhone = responsibleBranch?.whatsappDisplay ?? fallbackUnit.whatsapp;
    const message = [
      'Olá, gostaria de fazer um pedido na Tele Gás.',
      '',
      `Cidade: ${cityLabel(values.city)}`,
      `Produto: ${product?.name ?? 'Produto não selecionado'}`,
      `Quantidade: ${values.quantity}`,
      `Valor: ${total == null ? 'Consulte a unidade' : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}`,
      `Nome: ${values.name}`,
      `Telefone: ${values.whatsapp}`,
      `Endereço: ${values.street}, ${values.number} - ${values.neighborhood}${values.complement ? `, ${values.complement}` : ''}`,
      `Forma de pagamento: ${values.paymentMethod}`,
      `Troco: ${values.needChange ? values.changeFor || 'Sim' : 'Não'}`,
      `Unidade escolhida: ${responsibleUnitLabel}`,
      `Observação: ${values.notes || '-'}`
    ].join('\n');

    trackEvent({ name: 'order_completed', params: { city: values.city, product: product?.slug ?? '', unit: responsibleBranch?.name ?? fallbackUnit.key } });
    window.open(buildWhatsAppUrl(destinationPhone, message), '_blank', 'noopener,noreferrer');
  });

  const goNext = async () => {
    const fieldsByStep: Array<Array<keyof OrderFormValues>> = [
      ['city', 'productId', 'quantity'],
      ['name', 'whatsapp', 'neighborhood', 'street', 'number', 'reference', 'complement'],
      ['paymentMethod', 'needChange', 'changeFor'],
      []
    ];
    const valid = await form.trigger(fieldsByStep[step - 1], { shouldFocus: true });
    if (valid) setStep((current) => Math.min(current + 1, 4));
  };

  const summary = useMemo(
    () => ({ city, product, quantity, total, responsibleUnitLabel }),
    [city, product, quantity, total, responsibleUnitLabel]
  );

  const handlePhoneChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const changeQuantity = (delta: number) => {
    const next = Math.max(1, Number(quantity || 1) + delta);
    form.setValue('quantity', next, { shouldDirty: true, shouldValidate: true });
  };

  const selectProduct = (productId: string) => {
    form.setValue('productId', productId, { shouldValidate: true, shouldDirty: true });
  };

  const changeProductQuantity = (productId: string, delta: number) => {
    selectProduct(productId);
    changeQuantity(delta);
  };

  const primaryAction = step < 4 ? goNext : onSubmit;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-[1.75rem] border border-border bg-white p-5 shadow-soft md:hidden">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-700">Faça seu pedido</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground">Receba seu gás com rapidez e segurança.</h1>
        <div className="mt-4 flex items-center gap-2 text-sm text-foreground/70">
          <span className="font-semibold text-foreground">Etapa {step} de 4</span>
          <span>Escolha onde e o que deseja receber</span>
        </div>
        <div className="mt-3 flex items-center gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <span key={index} className={`h-2.5 flex-1 rounded-full ${index < step ? 'bg-brand-500' : index === step - 1 ? 'bg-brand-400' : 'bg-slate-200'}`} />
          ))}
        </div>
      </div>

      <form onSubmit={onSubmit} className="rounded-3xl border border-border bg-white p-5 shadow-soft sm:p-6">
        <div className="mb-6 hidden md:block">
          <div className="flex items-center justify-between text-sm text-foreground/60">
            <span>Etapa {step} de {steps}</span>
            <span>Escolha onde e o que deseja receber</span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <span key={index} className={`h-2.5 flex-1 rounded-full ${index < step ? 'bg-brand-500' : index === step - 1 ? 'bg-brand-400' : 'bg-slate-200'}`} />
            ))}
          </div>
        </div>

        {step === 1 ? (
          <fieldset className="space-y-5">
            <legend className="text-xl font-semibold text-foreground">1. Cidade, produto e quantidade</legend>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-foreground">Cidade</span>
              <select
                {...form.register('city', {
                  onChange: (event) => form.setValue('city', event.target.value as OrderFormValues['city'], { shouldValidate: true, shouldDirty: true })
                })}
                className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-base text-foreground outline-none focus:border-brand-500"
              >
                {cities.map((item) => (
                  <option key={item.key} value={item.key}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((item) => {
                const selected = productId === item.id;
                const cityPrice = item.pricesByUnit[city as keyof typeof item.pricesByUnit] ?? null;
                return (
                  <div
                    key={item.id}
                    className={`relative overflow-hidden rounded-[1.5rem] border text-left transition ${selected ? 'border-brand-500 ring-2 ring-brand-500/20' : 'border-border bg-white hover:border-brand-200'} ${item.slug === 'gas-p13' ? 'bg-gradient-to-br from-sky-950 via-cyan-950 to-slate-900 text-white' : ''}`}
                  >
                    {item.slug === 'gas-p13' ? (
                      <div className="absolute left-3 top-3 z-10 rounded-full bg-orange-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white shadow-md">
                        Mais pedido
                      </div>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => {
                        selectProduct(item.id);
                        trackEvent({ name: 'click_product', params: { product: item.slug, city } });
                      }}
                      className="block w-full text-left"
                    >
                      <div className={`relative h-36 ${item.slug === 'gas-p13' ? 'bg-white/10' : 'bg-slate-50'}`}>
                        <Image src={item.image} alt={item.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-contain p-5" />
                      </div>
                      <div className="space-y-2 p-4 pb-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className={`text-sm font-semibold uppercase tracking-[0.2em] ${item.slug === 'gas-p13' ? 'text-cyan-200' : 'text-brand-700'}`}>{productBadge(item.slug)}</p>
                            <h3 className={`mt-1 text-lg font-semibold ${item.slug === 'gas-p13' ? 'text-white' : 'text-foreground'}`}>{item.name}</h3>
                          </div>
                          {selected ? <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.slug === 'gas-p13' ? 'bg-cyan-300 text-slate-950' : 'bg-brand-500 text-white'}`}>Selecionado</span> : null}
                        </div>
                        <p className={`text-sm leading-6 ${item.slug === 'gas-p13' ? 'text-cyan-50/85' : 'text-foreground/70'}`}>{productHint(item.slug)}</p>
                        <p className={`text-sm font-semibold ${item.slug === 'gas-p13' ? 'text-white' : 'text-foreground'}`}>{cityPrice == null ? 'Consulte a unidade' : formatCurrency(cityPrice)}</p>
                      </div>
                    </button>

                    <div className={`border-t px-4 py-3 ${item.slug === 'gas-p13' ? 'border-white/15' : 'border-border/70'}`}>
                      <div className="flex items-center justify-between gap-3">
                        <span className={`text-sm font-medium ${item.slug === 'gas-p13' ? 'text-white' : 'text-foreground'}`}>Quantidade</span>
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => changeProductQuantity(item.id, -1)} className={`inline-flex h-9 w-9 items-center justify-center rounded-full border text-lg transition ${item.slug === 'gas-p13' ? 'border-white/25 text-white hover:bg-white/10' : 'border-border text-foreground hover:bg-slate-50'}`}>−</button>
                          <span className={`min-w-8 text-center text-base font-semibold ${item.slug === 'gas-p13' ? 'text-white' : 'text-foreground'}`}>{selected ? quantity : quantity}</span>
                          <button type="button" onClick={() => changeProductQuantity(item.id, 1)} className={`inline-flex h-9 w-9 items-center justify-center rounded-full border text-lg transition ${item.slug === 'gas-p13' ? 'border-white/25 text-white hover:bg-white/10' : 'border-border text-foreground hover:bg-slate-50'}`}>+</button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <input {...form.register('quantity', { valueAsNumber: true })} type="number" min={1} inputMode="numeric" className="sr-only" />
          </fieldset>
        ) : null}

        {step === 2 ? (
          <fieldset className="grid gap-4 md:grid-cols-2">
            <legend className="mb-2 text-xl font-semibold text-foreground md:col-span-2">2. Entrega</legend>
            <Input label="Nome" error={form.formState.errors.name?.message} {...form.register('name')} />
            <Input label="Telefone" error={form.formState.errors.whatsapp?.message} {...form.register('whatsapp', { onChange: (event) => form.setValue('whatsapp', handlePhoneChange(event.target.value)) })} inputMode="numeric" autoComplete="tel" />
            {showNeighborhoodSelect ? (
              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-medium text-foreground">Bairro</span>
                <select
                  {...form.register('neighborhood', {
                    onChange: (event) => form.setValue('neighborhood', event.target.value, { shouldValidate: true })
                  })}
                  className="w-full rounded-2xl border border-border px-4 py-3"
                >
                  <option value="">Selecione seu bairro</option>
                  {neighborhoodOptions.map((item) => <option key={item.label} value={item.label}>{item.label}</option>)}
                </select>
                {form.formState.errors.neighborhood ? <span className="mt-2 block text-xs text-red-700">{form.formState.errors.neighborhood.message}</span> : null}
              </label>
            ) : (
              <Input label="Bairro" error={form.formState.errors.neighborhood?.message} {...form.register('neighborhood')} autoComplete="address-level3" />
            )}
            <Input label="Rua" error={form.formState.errors.street?.message} {...form.register('street')} autoComplete="street-address" />
            <Input label="Número" error={form.formState.errors.number?.message} {...form.register('number')} inputMode="numeric" />
            <Input label="Referência" {...form.register('reference')} />
            <Input label="Complemento" {...form.register('complement')} />
          </fieldset>
        ) : null}

        {step === 3 ? (
          <fieldset className="space-y-4">
            <legend className="text-xl font-semibold text-foreground">3. Pagamento</legend>
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Forma de pagamento</span>
              <select {...form.register('paymentMethod')} className="w-full rounded-2xl border border-border px-4 py-3">
                {orderPayments.map((method) => <option key={method}>{method}</option>)}
              </select>
            </label>
            {paymentMethod === 'Dinheiro' ? (
              <label className="block">
                <span className="mb-2 block text-sm font-medium">Precisa de troco?</span>
                <input type="checkbox" {...form.register('needChange')} />
                {needChange ? <input {...form.register('changeFor')} placeholder="Troco para qual valor?" className="mt-3 w-full rounded-2xl border border-border px-4 py-3" /> : null}
              </label>
            ) : null}
          </fieldset>
        ) : null}

        {step === 4 ? (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">4. Revisão</h2>
            <div className="hidden grid gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-foreground/75 md:grid">
              <p><strong>Cidade:</strong> {cityLabel(summary.city)}</p>
              <p><strong>Produto:</strong> {summary.product?.name ?? 'Não selecionado'}</p>
              <p><strong>Quantidade:</strong> {summary.quantity}</p>
              <p><strong>Preço:</strong> {summary.total == null ? 'Consulte a unidade' : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(summary.total)}</p>
              <p><strong>Unidade responsável:</strong> {summary.responsibleUnitLabel}</p>
              <p><strong>Atendimento automático:</strong> Seu pedido será atendido pela unidade {responsibleBranch?.name ?? fallbackUnit.name}.</p>
              <p><strong>Endereço:</strong> {street}, {number} - {form.watch('neighborhood')}{complement ? `, ${complement}` : ''}</p>
              <p><strong>Pagamento:</strong> {paymentMethod}</p>
            </div>
            <details className="rounded-2xl border border-border bg-white p-4 shadow-soft md:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">Resumo do pedido</p>
                  <p className="text-sm text-foreground/65">{summary.product ? `${summary.product.name} × ${summary.quantity} • ${cityLabel(summary.city)}` : `Selecione um produto • ${cityLabel(summary.city)}`}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-foreground/60" />
              </summary>
              <div className="mt-4 space-y-2 text-sm text-foreground/75">
                <p><strong>Total:</strong> {summary.total == null ? 'Consulte a unidade' : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(summary.total)}</p>
                <p><strong>Unidade:</strong> {summary.responsibleUnitLabel}</p>
                <p><strong>Pagamento:</strong> {paymentMethod}</p>
              </div>
            </details>
            <label className="inline-flex items-center gap-3 rounded-2xl border border-border px-4 py-3 text-sm">
              <input type="checkbox" {...form.register('storeDataConsent')} />
              Salvar meu nome e endereço neste dispositivo para repetir o último pedido.
            </label>
            <Button type="submit" className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-green-600 hover:brightness-110">
              <WhatsAppIcon />
              Finalizar no WhatsApp
            </Button>
          </section>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-3 pb-24 md:pb-0">
          {step > 1 ? <Button type="button" className="bg-gradient-to-r from-slate-800 via-zinc-800 to-black text-white hover:brightness-110" onClick={() => setStep((current) => Math.max(current - 1, 1))}>Voltar</Button> : null}
          {step < 4 ? <Button type="button" onClick={goNext}>Continuar pedido</Button> : null}
          {remembered ? <Button type="button" className="!bg-gradient-to-r !from-sky-950 !via-cyan-950 !to-slate-900 text-white hover:!brightness-110" onClick={() => form.reset({ ...form.getValues(), ...remembered, storeDataConsent: true })}>Repetir último pedido</Button> : null}
        </div>
      </form>

      <aside className="hidden rounded-3xl border border-border bg-white p-6 shadow-soft md:block">
        <h2 className="text-xl font-semibold text-foreground">Resumo em tempo real</h2>
        <div className="mt-4 space-y-3 text-sm text-foreground/75">
          <p><strong>Cidade:</strong> {cityLabel(city)}</p>
          <p><strong>Produto:</strong> {product?.name ?? 'Selecione um produto'}</p>
          <p><strong>Quantidade:</strong> {quantity || 1}</p>
          <p><strong>Total:</strong> {total == null ? 'Consulte a unidade' : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</p>
          <p><strong>Unidade:</strong> {responsibleUnitLabel}</p>
        </div>
        {isSubmitted ? <p className="mt-6 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-900">Pedido pronto. O WhatsApp será aberto para finalizar.</p> : null}
      </aside>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-white/95 px-4 pb-[calc(0.85rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur md:hidden">
        <div className="mx-auto max-w-7xl">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="font-semibold text-foreground">Total</span>
            <span className="font-semibold text-brand-700">{total == null ? 'Consulte a unidade' : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</span>
          </div>
          <Button type="button" onClick={primaryAction} className={`w-full rounded-2xl py-4 text-base ${step < 4 ? 'bg-brand-500 hover:bg-brand-600' : 'bg-gradient-to-r from-emerald-500 via-emerald-600 to-green-600 hover:brightness-110'}`}>
            {step < 4 ? 'Continuar pedido' : <><WhatsAppIcon /><span>Finalizar no WhatsApp</span></>}
          </Button>
          <p className="mt-2 text-center text-xs text-foreground/60">Seu pedido será preenchido automaticamente.</p>
        </div>
      </div>
    </div>
  );
}

const Input = forwardRef<HTMLInputElement, { label: string; error?: string } & InputHTMLAttributes<HTMLInputElement>>(function Input(
  { label, error, className, ...props },
  ref
) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-foreground">{label}</span>
      <input ref={ref} {...props} className={`w-full rounded-2xl border border-border px-4 py-3 outline-none focus:border-brand-500 ${className ?? ''}`} />
      {error ? <span className="mt-2 block text-xs text-red-700">{error}</span> : null}
    </label>
  );
});
