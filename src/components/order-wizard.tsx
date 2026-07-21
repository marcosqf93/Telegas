"use client";

import { forwardRef, useEffect, useMemo, useState, type InputHTMLAttributes } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { orderSchema, type OrderFormInput, type OrderFormValues } from '@/lib/order-schema';
import { cities, orderPayments, products, units, aquidauanaBranches, type AquidauanaBranch } from '@/lib/site-data';
import { buildWhatsAppUrl, cityLabel, getLocalStorage, removeLocalStorage, setLocalStorage } from '@/lib/utils';
import { Button } from './ui/button';
import { trackEvent } from '@/lib/analytics';
import { useCity } from './city-provider';

const LAST_ORDER_KEY = 'telegas:last-order';
const LOCATION_KEY = 'telegas:location-consent';

export function OrderWizard({ defaultCity, defaultProduct }: { defaultCity?: string; defaultProduct?: string }) {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [remembered, setRemembered] = useState<OrderFormValues | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<AquidauanaBranch>(aquidauanaBranches[0]);
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

  const product = products.find((item) => item.slug === productId || item.id === productId);
  const unit = units.find((item) => item.key === city) ?? units[0];
  const price = product?.pricesByUnit[city as keyof typeof product.pricesByUnit] ?? null;
  const total = price == null ? null : price * (Number(quantity) || 1);

  const steps = 6;

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
    if (city !== 'aquidauana') return;
    const saved = getLocalStorage<{ accepted: boolean; branchKey?: AquidauanaBranch['key'] } | null>(LOCATION_KEY, null);
    if (saved?.branchKey) {
      const matched = aquidauanaBranches.find((branch) => branch.key === saved.branchKey);
      if (matched) setSelectedBranch(matched);
    }
  }, [city]);

  useEffect(() => {
    const onLocationUpdated = (event: Event) => {
      const custom = event as CustomEvent<AquidauanaBranch>;
      if (city === 'aquidauana') setSelectedBranch(custom.detail);
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
      if (step < 6) trackEvent({ name: 'order_abandoned', params: { step } });
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [step]);

  const progress = (step / steps) * 100;

  const onSubmit = form.handleSubmit((values) => {
    setIsSubmitted(true);
    if (values.storeDataConsent) {
      setLocalStorage(LAST_ORDER_KEY, values);
    }
    const message = [
      'Olá, gostaria de fazer um pedido na Tele Gás.',
      '',
      `Cidade: ${cityLabel(values.city)}`,
      `Produto: ${product?.name ?? 'Produto não selecionado'}`,
      `Quantidade: ${values.quantity}`,
      `Valor: ${total == null ? 'A confirmar' : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}`,
      `Nome: ${values.name}`,
      `Telefone: ${values.whatsapp}`,
      `Endereço: ${values.street}, ${values.number} - ${values.neighborhood}${values.complement ? `, ${values.complement}` : ''}`,
      `Forma de pagamento: ${values.paymentMethod}`,
      `Troco: ${values.needChange ? values.changeFor || 'Sim' : 'Não'}`,
      `Unidade escolhida: ${city === 'aquidauana' ? `${selectedBranch.name} - ${selectedBranch.address}` : unit.name}`,
      `Unidade escolhida: ${city === 'aquidauana' ? `${selectedBranch.name} - ${selectedBranch.address}` : unit.name}`,
      `Observação: ${values.notes || '-'}`
    ].join('\n');
    trackEvent({ name: 'order_completed', params: { city: values.city, product: product?.slug ?? '', unit: unit.key } });
    window.open(buildWhatsAppUrl(unit.whatsapp, message), '_blank', 'noopener,noreferrer');
  });

  const goNext = async () => {
    const fieldsByStep: Array<Array<keyof OrderFormValues>> = [
      ['city'],
      ['productId', 'quantity'],
      ['name', 'whatsapp', 'cep', 'street', 'number', 'neighborhood', 'complement', 'reference'],
      ['paymentMethod', 'needChange', 'changeFor', 'notes'],
      ['city', 'productId', 'quantity', 'name', 'whatsapp', 'street', 'number', 'neighborhood', 'paymentMethod'],
      []
    ];
    const valid = await form.trigger(fieldsByStep[step - 1], { shouldFocus: true });
    if (valid) setStep((current) => Math.min(current + 1, 6));
  };

  const summary = useMemo(() => ({ city, product, quantity, total, unit }), [city, product, quantity, total, unit]);

  const handlePhoneChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <form onSubmit={onSubmit} className="rounded-3xl border border-border bg-white p-6 shadow-soft">
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-foreground/60">
            <span>Etapa {step} de {steps}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-slate-100">
            <div className="h-2 rounded-full bg-brand-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {step === 1 ? (
          <fieldset className="space-y-4">
            <legend className="text-xl font-semibold text-foreground">1. Selecione sua cidade</legend>
            <div className="grid gap-3 sm:grid-cols-3">
              {cities.map((item) => (
                <label key={item.key} className={`cursor-pointer rounded-2xl border px-4 py-4 ${city === item.key ? 'border-brand-500 bg-brand-50' : 'border-border'}`}>
                  <input type="radio" {...form.register('city')} value={item.key} className="sr-only" />
                  <span className="block font-semibold">{item.label}</span>
                </label>
              ))}
            </div>
            {city === 'aquidauana' ? (
              <div className="space-y-3 rounded-3xl border border-border bg-slate-50 p-4">
                <div>
                  <p className="text-sm font-semibold text-foreground">Escolha a unidade mais próxima</p>
                  <p className="mt-1 text-xs leading-5 text-foreground/55">Se você permitir localização, sugerimos automaticamente a mais próxima. Bairro e cidade continuam como confirmação no pedido.</p>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  {aquidauanaBranches.map((branch) => {
                    const active = branch.key === selectedBranch.key;
                    return (
                      <button
                        key={branch.key}
                        type="button"
                        onClick={() => {
                          setSelectedBranch(branch);
                          setLocalStorage(LOCATION_KEY, { accepted: true, branchKey: branch.key });
                        }}
                        className={`rounded-2xl border px-4 py-4 text-left transition ${active ? 'border-brand-500 bg-brand-50' : 'border-border bg-white hover:bg-slate-50'}`}
                      >
                        <span className="block text-sm font-semibold text-foreground">{branch.name}</span>
                        <span className="mt-1 block text-xs leading-5 text-foreground/60">{branch.address}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </fieldset>
        ) : null}

        {step === 2 ? (
          <fieldset className="space-y-4">
            <legend className="text-xl font-semibold text-foreground">2. Produto e quantidade</legend>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-foreground">Produto</span>
              <select {...form.register('productId')} className="w-full rounded-2xl border border-border px-4 py-3">
                <option value="">Selecione</option>
                {products.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-foreground">Quantidade</span>
              <input {...form.register('quantity', { valueAsNumber: true })} type="number" min={1} inputMode="numeric" className="w-full rounded-2xl border border-border px-4 py-3" />
            </label>
          </fieldset>
        ) : null}

        {step === 3 ? (
          <fieldset className="grid gap-4 md:grid-cols-2">
            <legend className="mb-2 text-xl font-semibold text-foreground md:col-span-2">3. Dados de entrega</legend>
            <Input label="Nome" error={form.formState.errors.name?.message} {...form.register('name')} />
            <Input label="WhatsApp" error={form.formState.errors.whatsapp?.message} {...form.register('whatsapp', { onChange: (event) => form.setValue('whatsapp', handlePhoneChange(event.target.value)) })} inputMode="numeric" autoComplete="tel" />
            <Input label="CEP" {...form.register('cep')} autoComplete="postal-code" inputMode="numeric" />
            <Input label="Rua" error={form.formState.errors.street?.message} {...form.register('street')} autoComplete="street-address" />
            <Input label="Número" error={form.formState.errors.number?.message} {...form.register('number')} inputMode="numeric" />
            <Input label="Bairro" error={form.formState.errors.neighborhood?.message} {...form.register('neighborhood')} autoComplete="address-level3" />
            <Input label="Complemento" {...form.register('complement')} />
            <Input label="Ponto de referência" {...form.register('reference')} />
          </fieldset>
        ) : null}

        {step === 4 ? (
          <fieldset className="space-y-4">
            <legend className="text-xl font-semibold text-foreground">4. Pagamento</legend>
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
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Observações</span>
              <textarea {...form.register('notes')} rows={4} className="w-full rounded-2xl border border-border px-4 py-3" />
            </label>
            <label className="inline-flex items-center gap-3 rounded-2xl border border-border px-4 py-3 text-sm">
              <input type="checkbox" {...form.register('storeDataConsent')} />
              Salvar meu nome e endereço neste dispositivo para repetir o último pedido.
            </label>
          </fieldset>
        ) : null}

        {step === 5 ? (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">5. Resumo</h2>
            <div className="grid gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-foreground/75">
              <p><strong>Cidade:</strong> {cityLabel(summary.city)}</p>
              <p><strong>Produto:</strong> {summary.product?.name ?? 'Não selecionado'}</p>
              <p><strong>Quantidade:</strong> {summary.quantity}</p>
              <p><strong>Valor total:</strong> {summary.total == null ? 'A confirmar' : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(summary.total)}</p>
              <p><strong>Unidade responsável:</strong> {summary.unit.name}</p>
              {city === 'aquidauana' ? <p><strong>Unidade escolhida:</strong> {selectedBranch.name}</p> : null}
            </div>
            <Button type="button" onClick={goNext}>Finalizar no WhatsApp</Button>
          </section>
        ) : null}

        {step === 6 ? (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">6. Confirmação</h2>
            <p className="text-sm leading-6 text-foreground/70">Ao confirmar, o pedido será aberto no WhatsApp da unidade responsável. Nenhuma mensagem é enviada automaticamente.</p>
            <div className="flex flex-wrap gap-3">
              <Button type="submit">Confirmar pedido</Button>
              <Button type="button" className="bg-slate-200 text-foreground hover:bg-slate-300" onClick={() => removeLocalStorage(LAST_ORDER_KEY)}>Apagar dados salvos</Button>
            </div>
          </section>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-3">
          {step > 1 ? <Button type="button" className="bg-slate-200 text-foreground hover:bg-slate-300" onClick={() => setStep((current) => Math.max(current - 1, 1))}>Voltar</Button> : null}
          {step < 5 ? <Button type="button" onClick={goNext}>Continuar</Button> : null}
          {remembered ? <Button type="button" className="bg-graphite text-white hover:bg-black" onClick={() => form.reset({ ...form.getValues(), ...remembered, storeDataConsent: true })}>Repetir último pedido</Button> : null}
        </div>
      </form>

      <aside className="rounded-3xl border border-border bg-white p-6 shadow-soft">
        <h2 className="text-xl font-semibold text-foreground">Resumo em tempo real</h2>
        <div className="mt-4 space-y-3 text-sm text-foreground/75">
          <p><strong>Cidade:</strong> {cityLabel(city)}</p>
          <p><strong>Produto:</strong> {product?.name ?? 'Selecione um produto'}</p>
          <p><strong>Quantidade:</strong> {quantity || 1}</p>
          <p><strong>Total:</strong> {total == null ? 'A confirmar' : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</p>
          <p><strong>Unidade:</strong> {unit.name}</p>
          {city === 'aquidauana' ? <p><strong>Unidade escolhida:</strong> {selectedBranch.name}</p> : null}
        </div>
        {isSubmitted ? <p className="mt-6 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-900">Pedido preparado. O WhatsApp será aberto para confirmação final.</p> : null}
      </aside>
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
