type AnalyticsEvent = {
  name: string;
  params?: Record<string, string | number | boolean | null | undefined>;
};

export function trackEvent(event: AnalyticsEvent) {
  if (typeof window === 'undefined') return;
  const payload = {
    ...event,
    timestamp: new Date().toISOString()
  };
  window.dispatchEvent(new CustomEvent('telegas:analytics', { detail: payload }));

  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (gtag) {
    gtag('event', event.name, event.params ?? {});
  }
}
