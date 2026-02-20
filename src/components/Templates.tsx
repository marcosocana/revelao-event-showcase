import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import template1 from "@/assets/template-1.png";
import template2 from "@/assets/template-2.png";
import template3 from "@/assets/template-3.png";
import template4 from "@/assets/template-4.png";

const templates = [
  { id: 1, title: "Julia y Alex", image: template1, downloadUrl: template1 },
  { id: 2, title: "David y Jose", image: template2, downloadUrl: template2 },
  { id: 3, title: "Paola y Toni", image: template3, downloadUrl: template3 },
  { id: 4, title: "Christmas Album", image: template4, downloadUrl: template4 },
];

const TemplateCard = ({ template }: { template: typeof templates[0] }) => (
  <div className="revelao-card">
    <div className="aspect-[3/4] bg-background overflow-hidden">
      <img 
        src={template.image} 
        alt={template.title}
        className="w-full h-full object-cover"
      />
    </div>
    <div className="p-4">
      <a 
        href={template.downloadUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-full"
      >
        <Button className="w-full" variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Descargar
        </Button>
      </a>
    </div>
  </div>
);

export const Templates = () => {
  return (
    <section className="py-12 md:py-24 bg-primary/5" id="plantillas">
      <div className="container px-4 mx-auto">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 text-center animate-fade-in">
            <h2 className="font-bold mb-4 text-foreground md:text-5xl text-3xl">
              Plantillas personalizadas
            </h2>
            <p className="text-base text-muted-foreground md:text-xl max-w-3xl mx-auto">
              Descarga carteles con código QR para tu evento. Si no sabes cómo hacerlo, te lo hacemos nosotros de forma gratuita
            </p>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>

          {/* Mobile Carousel */}
          <div className="md:hidden px-8">
            <Carousel className="w-full">
              <CarouselContent>
                {templates.map((template) => (
                  <CarouselItem key={template.id}>
                    <TemplateCard template={template} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
};
