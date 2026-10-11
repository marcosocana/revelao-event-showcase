import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

// Con un ancla (/#precio desde el menú de otra página) se baja hasta esa sección en vez de
// subir arriba. La sección puede tardar en montarse, así que se reintenta unos instantes.
const scrollToHashTarget = (hash: string) => {
  const id = decodeURIComponent(hash.slice(1));
  if (!id) return () => undefined;
  let attempts = 0;
  let timer = 0;
  const tryScroll = () => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "auto", block: "start" });
      // Segunda pasada: las imágenes de encima pueden cambiar la altura al cargar.
      if (attempts < 40) timer = window.setTimeout(() => target.scrollIntoView({ behavior: "auto", block: "start" }), 400);
      return;
    }
    attempts += 1;
    if (attempts < 40) timer = window.setTimeout(tryScroll, 100);
  };
  tryScroll();
  return () => window.clearTimeout(timer);
};

export const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useLayoutEffect(() => {
    if (hash) return scrollToHashTarget(hash);

    const scrollToPageTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    scrollToPageTop();
    const frame = window.requestAnimationFrame(scrollToPageTop);
    const timeout = window.setTimeout(scrollToPageTop, 0);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
    };
  }, [pathname, hash]);

  return null;
};
