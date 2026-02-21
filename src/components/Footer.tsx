import icon from "@/assets/ico.png";
import { useI18n, translations } from "@/lib/i18n";
export const Footer = () => {
  const { lang } = useI18n();
  const t = translations[lang];
  return <footer className="py-12 border-t border-border">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src={icon} alt="Revelao" className="h-6 w-auto" />
            <span className="text-lg font-bold text-foreground">Revelao.cam</span>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <a href="#como-funciona" className="hover:text-foreground transition-colors">
              {t.footer.how}
            </a>
            <a href="#precio" className="hover:text-foreground transition-colors">
              {t.footer.pricing}
            </a>
            <a href="#casos-de-exito" className="hover:text-foreground transition-colors">
              {t.footer.cases}
            </a>
            <a href="/#blog" className="hover:text-foreground transition-colors">
              {t.footer.blog}
            </a>
            <a href="https://tomorrow-snap-reveal.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              {t.footer.access}
            </a>
            <a href="https://wa.me/34695834018?text=Hola! Estoy interesado en contratar Revelao.cam. ¿Puedes darme más información?" className="hover:text-foreground transition-colors">
              {t.footer.contact}
            </a>
          </div>

          <p className="text-sm text-muted-foreground">
            <a href="/blog/admin" className="hover:text-foreground transition-colors">
              ©
            </a>{" "}
            2026 Revelao.cam
          </p>
        </div>
      </div>
    </footer>;
};
