import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { initGoogleAnalytics, trackPageView } from "@/lib/analytics";

export const Analytics = () => {
  const location = useLocation();

  useEffect(() => {
    initGoogleAnalytics();
  }, []);

  useEffect(() => {
    const path = `${location.pathname}${location.search}${location.hash}`;
    trackPageView(path);
  }, [location]);

  return null;
};
