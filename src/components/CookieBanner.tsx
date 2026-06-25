import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCookieConsent, setCookieConsent, type CookieConsentValue } from "@/lib/cookieConsent";

export const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(!getCookieConsent());
  }, []);

  const saveConsent = (value: CookieConsentValue) => {
    setCookieConsent(value);
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-[80] px-4 pb-4 sm:px-6 sm:pb-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 rounded-lg border border-border bg-background/95 p-4 shadow-2xl backdrop-blur md:flex-row md:items-center md:justify-between">
        <div className="flex gap-3">
          <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Cookie className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">Usamos cookies</p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Utilizamos cookies técnicas y, si nos das permiso, cookies de análisis para mejorar Revelao.
              Puedes aceptar o rechazar las cookies no necesarias.{" "}
              <Link to="/cookies" className="font-medium text-foreground underline underline-offset-4">
                Ver política de cookies
              </Link>
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <Button variant="outline" size="sm" onClick={() => saveConsent("rejected")}>
            Rechazar
          </Button>
          <Button size="sm" onClick={() => saveConsent("accepted")}>
            Aceptar cookies
          </Button>
        </div>
      </div>
    </div>
  );
};
