import { useEffect } from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { initGoogleAnalytics, initGoogleTagManager, trackPageView } from "@/lib/analytics";
import { COOKIE_CONSENT_EVENT, getCookieConsent } from "@/lib/cookieConsent";

export const Analytics = () => {
  const location = useLocation();
  const [hasAnalyticsConsent, setHasAnalyticsConsent] = useState(
    () => getCookieConsent() === "accepted",
  );

  useEffect(() => {
    const updateConsent = () => {
      setHasAnalyticsConsent(getCookieConsent() === "accepted");
    };

    window.addEventListener(COOKIE_CONSENT_EVENT, updateConsent);
    window.addEventListener("storage", updateConsent);

    return () => {
      window.removeEventListener(COOKIE_CONSENT_EVENT, updateConsent);
      window.removeEventListener("storage", updateConsent);
    };
  }, []);

  useEffect(() => {
    if (!hasAnalyticsConsent) return;

    initGoogleAnalytics();
    initGoogleTagManager();
    const path = `${location.pathname}${location.search}${location.hash}`;
    trackPageView(path);
  }, [hasAnalyticsConsent, location]);

  return null;
};
