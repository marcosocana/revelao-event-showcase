const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export const isAnalyticsEnabled = Boolean(GA_MEASUREMENT_ID);

export const initGoogleAnalytics = () => {
  if (!isAnalyticsEnabled || window.gtag) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = (...args: unknown[]) => {
    window.dataLayer?.push(args);
  };

  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, {
    send_page_view: false,
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);
};

export const trackPageView = (path: string, title = document.title) => {
  if (!isAnalyticsEnabled) return;

  initGoogleAnalytics();
  window.gtag?.("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: title,
  });
};
