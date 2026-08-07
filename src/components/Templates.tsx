import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useI18n, translations } from "@/lib/i18n";
import { useState } from "react";
import { QrTemplate, TemplateCustomizerModal, TemplateThumbnail } from "@/components/TemplateCustomizerModal";
import { qrTemplates } from "@/data/qrTemplates";

const TemplateCard = ({ template, onSelect }: { template: QrTemplate & { cta: string }; onSelect: () => void }) => (
  <div className="revelao-card group flex flex-col w-[250px] sm:w-[270px] lg:w-[260px] transition-opacity hover:opacity-90">
    <div className="h-[260px] overflow-hidden rounded-[8px] bg-background">
      <TemplateThumbnail template={template} />
    </div>
    <div className="p-3">
      <p className="mb-2 px-1 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">{template.category}</p>
      <div className="mb-3 flex items-center gap-2 px-1 text-xs text-muted-foreground">
        <span
          className="h-5 w-5 rounded-[5px] border border-black/10 shadow-sm"
          style={{ background: `conic-gradient(${template.colorPresets.slice(0, 5).map((preset, index) => `${preset.accent} ${index * 20}% ${(index + 1) * 20}%`).join(", ")})` }}
        />
        Varios colores
      </div>
      <Button className="w-full" variant="outline" size="sm" onClick={onSelect}>
          <Pencil className="w-4 h-4 mr-2" />
          {template.cta}
      </Button>
    </div>
  </div>
);

export const Templates = () => {
  const { lang } = useI18n();
  const t = translations[lang];
  const [selectedTemplate, setSelectedTemplate] = useState<QrTemplate | null>(null);
  const templatesWithCta = qrTemplates.slice(0, 4).map((template) => ({
    ...template,
    cta: t.templates.cta,
  }));
  return (
    <section className="py-12 md:py-24 bg-transparent no-card-hover" id="plantillas">
      <div className="container px-4 mx-auto container-mobile-right-edge">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 md:mb-10 text-center animate-fade-in">
            <h2 className="revelao-h2 mb-2 text-center">
              {t.templates.title}
            </h2>
            <p className="revelao-h3 mb-2 text-center max-w-3xl mx-auto">
              {t.templates.subtitle}
            </p>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
            {templatesWithCta.map((template) => (
              <TemplateCard key={template.id} template={template} onSelect={() => setSelectedTemplate(template)} />
            ))}
          </div>

          {/* Mobile Carousel */}
          <div className="md:hidden px-0">
            <Carousel className="w-full" opts={{ align: "start", containScroll: "trimSnaps" }}>
              <CarouselContent className="!-ml-0 gap-6 px-4">
                {templatesWithCta.map((template) => (
                  <CarouselItem key={template.id} className="basis-[78%] !pl-0 flex justify-center">
                    <TemplateCard template={template} onSelect={() => setSelectedTemplate(template)} />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="/plantillas-qr">
              <Button className="rounded-full bg-primary px-8 text-primary-foreground hover:bg-primary/90">
                Ver todas las plantillas
              </Button>
            </a>
          </div>
        </div>
      </div>
      <TemplateCustomizerModal template={selectedTemplate} onClose={() => setSelectedTemplate(null)} />
    </section>
  );
};
