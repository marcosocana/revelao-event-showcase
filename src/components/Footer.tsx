import icon from "@/assets/ico.png";

type FooterProps = {
  text?: string;
  keywordsTitle?: string;
  keywords?: string[];
};

export const Footer = ({ text, keywordsTitle, keywords = [] }: FooterProps) => {
  return (
    <footer className="py-10 border-t border-border">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-3">
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

        <div className="mt-8 text-center">
          <a
            href="/blog/admin"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            © 2026 Revelao.cam
          </a>
        </div>
      </div>
    </footer>
  );
};
