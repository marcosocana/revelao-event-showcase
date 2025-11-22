import { Upload, Eye, Download } from "lucide-react";
import phoneMockupFeatures from "@/assets/phone-mockup-features.png";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

const features = [
  {
    icon: Upload,
    title: "Escanea el código QR",
    description: "Tus invitados escanean el código QR para acceder a la galería del evento",
  },
  {
    icon: Upload,
    title: "Captura los mejores momentos",
    description: "Todos pueden tomar fotos durante el evento de forma anónima",
  },
  {
    icon: Eye,
    title: "Genera expectación",
    description: "Las fotos permanecen ocultas durante el evento, creando misterio y emoción",
  },
  {
    icon: Download,
    title: "Día de revelado",
    description: "Al día siguiente, todas las fotos se revelan en una galería privada para revivir los mejores momentos",
  },
];

export const Features = () => {
  const [api, setApi] = useState<CarouselApi>();
  
  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [api]);

  return (
    <section className="py-24 bg-secondary/50" id="como-funciona">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">
            Cómo funciona
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Cuatro pasos para crear anticipación y capturar cada momento
          </p>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex items-center gap-12 max-w-6xl mx-auto">
          {/* Steps on the left */}
          <div className="flex flex-col gap-8 flex-1">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-6 animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-foreground flex items-center justify-center text-background text-xl font-bold">
                  {index + 1}
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Phone mockup on the right */}
          <div className="flex-shrink-0 w-[320px]">
            <img 
              src={phoneMockupFeatures} 
              alt="App mockup" 
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Mobile Layout - Mockup on top, Carousel below */}
        <div className="md:hidden">
          {/* Phone mockup */}
          <div className="flex justify-center mb-12">
            <img 
              src={phoneMockupFeatures} 
              alt="App mockup" 
              className="w-64 h-auto"
            />
          </div>

          {/* Carousel for steps */}
          <Carousel 
            setApi={setApi}
            className="max-w-sm mx-auto"
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent>
              {features.map((feature, index) => (
                <CarouselItem key={index}>
                  <div className="flex flex-col items-center text-center gap-6 p-6">
                    <div className="w-16 h-16 rounded-full bg-foreground flex items-center justify-center text-background text-2xl font-bold">
                      {index + 1}
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold mb-3 text-foreground">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};
