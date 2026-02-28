import { useState } from "react";
import { useI18n, translations } from "@/lib/i18n";

export const HomeSeoContent = () => {
  const { lang } = useI18n();
  const t = translations[lang].seoHome;
  const [isExpanded, setIsExpanded] = useState(false);

  if (!t) return null;

  return (
    <section className="container px-4 mx-auto py-12 md:py-16">
      <div className="max-w-5xl mx-auto grid gap-6">
        <div className="revelao-card border-0 bg-white p-6 md:p-8 shadow-[0_14px_32px_-22px_rgba(0,0,0,0.22)]">
          <p className="text-muted-foreground">{t.intro}</p>
        </div>
        <div className={`grid gap-6 ${isExpanded ? "" : "max-md:max-h-[520px] max-md:overflow-hidden max-md:relative"}`}>
          {t.sections.map((section) => (
            <div
              key={section.title}
              className="revelao-card border-0 bg-white p-6 md:p-8 shadow-[0_14px_32px_-22px_rgba(0,0,0,0.22)]"
            >
              <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
              <div className="space-y-4">
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
          {!isExpanded && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent md:hidden" />
          )}
        </div>
        <div className="md:hidden flex justify-center">
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="rounded-full border border-border px-4 py-2 text-xs uppercase tracking-wide text-muted-foreground"
          >
            {isExpanded ? "Ver menos" : "Leer más"}
          </button>
        </div>
      </div>
    </section>
  );
};
