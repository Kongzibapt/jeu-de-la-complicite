type EventParams = Record<string, string | number | boolean>;

export function useAnalytics() {
  function trackEvent(name: string, params?: EventParams) {
    if (import.meta.client && typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', name, params ?? {});
    }
  }

  return { trackEvent };
}
