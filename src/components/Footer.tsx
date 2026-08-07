import icon from "@/assets/ico.png";
import { useLocation } from "react-router-dom";
import { openCookieSettings } from "@/lib/cookieConsent";

const seoLinks = [
  { href: "/plantillas-qr", label: "Plantillas QR" },
  { href: "/testimonios", label: "Testimonios" },
  { href: "/blog", label: "Blog" },
  { href: "/bodas/qr-fotos-boda", label: "QR para fotos de boda" },
  { href: "/bodas/galeria-privada-boda", label: "Galería privada boda" },
  { href: "/bodas/recopilar-fotos-invitados", label: "Recopilar fotos invitados" },
  { href: "/bodas/fotos-videos-audio-boda", label: "Fotos, vídeos y audios" },
  { href: "/bodas/codigo-qr-boda", label: "Código QR boda" },
  { href: "/bodas/subir-fotos-boda-sin-app", label: "Subir fotos sin app" },
  { href: "/bodas/album-colaborativo-boda", label: "Álbum colaborativo" },
  { href: "/bodas/revelado-fotos-boda", label: "Revelado fotos boda" },
  { href: "/bodas/cartel-qr-boda", label: "Cartel QR boda" },
  { href: "/eventos/bodas", label: "Revelao para bodas" },
];

type FooterProps = {
  text?: string;
  keywordsTitle?: string;
  keywords?: string[];
};

export const Footer = ({ text, keywordsTitle, keywords = [] }: FooterProps) => {
  const { pathname } = useLocation();
  const langPrefix = pathname.startsWith("/en")
    ? "/en"
    : pathname.startsWith("/it")
      ? "/it"
      : "";

  return (
    <footer className="py-10 border-t border-border">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3 max-w-2xl">
            <div className="hidden md:flex items-center gap-3">
              <img src={icon} alt="Revelao" className="h-6 w-auto" />
              <span className="text-lg font-bold text-foreground">Revelao.cam</span>
            </div>
            {text ? <p className="text-sm text-muted-foreground">{text}</p> : null}
          </div>

          {keywords.length > 0 ? (
            <div className="space-y-3">
              {keywordsTitle ? (
                <p className="text-sm font-semibold text-foreground">{keywordsTitle}</p>
              ) : null}
              <div className="flex flex-wrap gap-2">
                {keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="text-xs px-3 py-1 rounded-full border border-border text-muted-foreground"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 md:justify-center">
          <div className="flex items-center gap-2 md:hidden">
            <img src={icon} alt="Revelao" className="h-5 w-auto" />
            <span className="text-sm font-semibold text-foreground">Revelao.cam</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <a href="/quienes-somos" className="hover:text-foreground transition-colors">
              Quiénes somos
            </a>
            <a href="/kit-de-prensa" className="hover:text-foreground transition-colors">
              Kit de prensa
            </a>
            <a href={`${langPrefix}/privacy`} className="hover:text-foreground transition-colors">
              Política de privacidad
            </a>
            <a href={`${langPrefix}/terms`} className="hover:text-foreground transition-colors">
              Términos
            </a>
            <a href="/devoluciones" className="hover:text-foreground transition-colors">
              Devoluciones
            </a>
            <a href="/envios" className="hover:text-foreground transition-colors">
              Envíos
            </a>
            <a href="/rgpd" className="hover:text-foreground transition-colors">
              RGPD
            </a>
            <a href={`${langPrefix}/cookies`} className="hover:text-foreground transition-colors">
              Cookies
            </a>
            <button type="button" onClick={openCookieSettings} className="hover:text-foreground transition-colors">
              Configurar cookies
            </button>
            <span>
              © 2026 Revelao.cam
            </span>
          </div>
        </div>
        <nav aria-label="Enlaces SEO de bodas" className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
          {seoLinks.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-foreground transition-colors">
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
};
