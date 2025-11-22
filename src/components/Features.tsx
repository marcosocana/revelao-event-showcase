import { Upload, Eye, Download } from "lucide-react";
import phoneVideo from "@/assets/ScreenRecording_11-22-2025 17-05-16_1.mp4";
import { useEffect, useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
const features = [{
  icon: Upload,
  title: "Escanea el código QR",
  description: "Tus invitados escanean el código QR e introducen la contraseña del evento para acceder al espacio del evento"
}, {
  icon: Upload,
  title: "Captura los mejores momentos",
  description: "Todos los invitados pueden tomar fotos durante el evento de forma anónima"
}, {
  icon: Eye,
  title: "La expectación aumenta...",
  description: "Las fotos permanecen ocultas durante el evento, creando misterio y emoción"
}, {
  icon: Download,
  title: "Día de revelado",
  description: "Al día siguiente, todas las fotos se revelan en una galería privada para revivir los mejores momentos y que todos puedan volver a revivir el evento"
}];
export const Features = () => {
  const [api, setApi] = useState<CarouselApi>();
  useEffect(() => {
    if (!api) return;
    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [api]);
  return <section className="py-24 bg-secondary/50" id="como-funciona">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">
            Cómo funciona
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Explora la experiencia Revelao en solo 4 pasos:</p>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex items-center gap-12 max-w-6xl mx-auto">
          {/* Steps on the left */}
          <div className="flex flex-col gap-8 flex-1">
            {features.map((feature, index) => <div key={index} className="flex items-center gap-6 animate-fade-in" style={{
            animationDelay: `${index * 150}ms`
          }}>
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
              </div>)}
          </div>

          {/* Video on the right */}
          <div className="flex-shrink-0 w-[320px]">
            <video src={phoneVideo} autoPlay loop muted playsInline className="w-full h-auto rounded-[2px] object-cover border-2 border-muted-foreground" />
          </div>
        </div>

        {/* Mobile Layout - Mockup on top, Carousel below */}
        <div className="md:hidden">
          {/* Video */}
          <div className="flex justify-center mb-12">
            <video src={phoneVideo} autoPlay loop muted playsInline className="w-64 h-auto rounded-[2px] object-cover border-2 border-muted-foreground" />
          </div>

          {/* Carousel for steps */}
          <Carousel setApi={setApi} className="max-w-sm mx-auto" opts={{
          align: "start",
          loop: true
        }}>
            <CarouselContent>
              {features.map((feature, index) => <CarouselItem key={index}>
                  <div className="flex flex-col items-center text-center gap-6 p-6">
                    <div className="w-16 h-16 rounded-full bg-foreground flex items-center justify-center text-background text-2xl font-bold">
                      {index + 1}
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold mb-3 text-foreground">
                        {index === 1 ? <>Captura los mejores<br />momentos</> : feature.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CarouselItem>)}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        </div>
      </div>
    </section>;
};