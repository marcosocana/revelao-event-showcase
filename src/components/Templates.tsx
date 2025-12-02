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
import template5 from "@/assets/template-5.png";
import template6 from "@/assets/template-6.png";
import template7 from "@/assets/template-7.png";
import template8 from "@/assets/template-8.png";

const templates = [
  { id: 1, title: "Boda Clásica", image: template1 },
  { id: 2, title: "Boda Moderna", image: template2 },
  { id: 3, title: "Boda Vintage", image: template3 },
  { id: 4, title: "Boda Romántica", image: template4 },
  { id: 5, title: "Boda Elegante", image: template5 },
  { id: 6, title: "Boda Minimalista", image: template6 },
  { id: 7, title: "Boda Rústica", image: template7 },
  { id: 8, title: "Boda Bohemia", image: template8 },
];

const TemplateCard = ({ template }: { template: typeof templates[0] }) => (
  <div className="bg-muted/30 rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow">
    <div className="aspect-square bg-background overflow-hidden">
      <img 
        src={template.image} 
        alt={template.title}
        className="w-full h-full object-cover"
      />
    </div>
    <div className="p-4">
      <Button className="w-full" variant="outline" size="sm">
        <Download className="w-4 h-4 mr-2" />
        Descargar
      </Button>
    </div>
  </div>
);

export const Templates = () => {
  return (
    <section className="py-12 md:py-24 bg-background" id="plantillas">
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
