import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import template1 from "@/assets/Plantilla1.png";
import template2 from "@/assets/Plantilla2.png";
import template3 from "@/assets/Plantilla3.png";
import template1Download from "@/assets/template-1.png";
import template2Download from "@/assets/template-2.png";
import template3Download from "@/assets/template-3.png";
import template4 from "@/assets/Plantilla4.png";
import template4Download from "@/assets/template-4.png";
import { useI18n, translations } from "@/lib/i18n";

const templates = [
  { id: 1, title: "Julia y Alex", image: template1, downloadUrl: template1Download },
  { id: 2, title: "David y Jose", image: template2, downloadUrl: template3Download },
  { id: 3, title: "Paola y Toni", image: template3, downloadUrl: template2Download },
  { id: 4, title: "Christmas Album", image: template4, downloadUrl: template4Download },
];

const TemplateCard = ({ template }: { template: typeof templates[0] & { cta: string } }) => (
  <div className="revelao-card group flex flex-col w-[250px] sm:w-[270px] lg:w-[260px] transition-opacity hover:opacity-90">
    <div className="bg-background overflow-hidden rounded-[8px]">
      <img
        src={template.image}
        alt={template.title}
        className="block h-[260px] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      />
    </div>
    <div className="p-2">
      <a
        href={template.downloadUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full"
      >
        <Button className="w-full" variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          {template.cta}
        </Button>
      </a>
    </div>
  </div>
);

export const Templates = () => {
  const { lang } = useI18n();
  const t = translations[lang];
  const templatesWithCta = templates.map((template) => ({
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
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>

          {/* Mobile Carousel */}
          <div className="md:hidden px-0">
            <Carousel className="w-full" opts={{ align: "start", containScroll: "trimSnaps" }}>
              <CarouselContent className="!-ml-0 gap-6 px-4">
                {templatesWithCta.map((template) => (
                  <CarouselItem key={template.id} className="basis-[78%] !pl-0 flex justify-center">
                    <TemplateCard template={template} />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>

          <div className="mt-8 flex justify-center">
            <a href="/crearplantilla">
              <Button className="rounded-full bg-[#d62828] px-8 text-white hover:bg-[#b71f1f]">
                Crear plantilla
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
