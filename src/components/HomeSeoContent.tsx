import { useI18n, translations } from "@/lib/i18n";

export const HomeSeoContent = () => {
  const { lang } = useI18n();
  const t = translations[lang].seoHome;

  if (!t) return null;

  return (
    <section className="container px-4 mx-auto py-12 md:py-16">
      <div className="max-w-4xl mx-auto space-y-6">
        <p className="text-muted-foreground">{t.intro}</p>
        {t.sections.map((section) => (
          <div key={section.title} className="space-y-3">
            <h2 className="text-2xl font-semibold">{section.title}</h2>
            {section.body.map((paragraph) => (
              <p key={paragraph} className="text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};
