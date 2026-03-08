import icon from "@/assets/ico.png";
import { useLocation } from "react-router-dom";

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
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <a href={`${langPrefix}/terms`} className="hover:text-foreground transition-colors">
              Términos y condiciones
            </a>
            <a href={`${langPrefix}/privacy`} className="hover:text-foreground transition-colors">
              Política de privacidad
            </a>
            <a href="/blog/admin" className="hover:text-foreground transition-colors">
              © 2026 Revelao.cam
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
