import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import phoneMockup from "@/assets/phone-mockup.png";

export const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 px-4 overflow-hidden" id="inicio">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/path-to-your-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-8 rounded-full bg-primary/10">
              <Camera className="w-10 h-10 text-primary" />
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
              Captura hoy,{" "}
              <span className="text-primary">revela mañana</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Tus invitados suben fotos de forma anónima durante el evento. 
              La magia ocurre al día siguiente cuando todas las imágenes se revelan.
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-8 text-sm text-muted-foreground mb-8">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-foreground" />
                <span>100% anónimo</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-foreground" />
                <span>Sin apps</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-foreground" />
                <span>Máxima expectación</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start items-center">
              <Button size="lg" asChild>
                <a href="http://www.revelao.cam" target="_blank" rel="noopener noreferrer">
                  Acceder a la app
                </a>
              </Button>
              
              <Button size="lg" variant="outline" asChild>
                <a href="https://wa.me/34695834018?text=Hola! Estoy interesado en contratar Revelao.cam. ¿Puedes darme más información?" target="_blank" rel="noopener noreferrer">
                  Contactar
                </a>
              </Button>
            </div>
          </div>

          <div className="flex justify-center animate-fade-in" style={{ animationDelay: "200ms" }}>
            <div className="relative w-full max-w-md">
              <img 
                src={phoneMockup} 
                alt="Revelao.cam mobile app" 
                className="w-full h-auto drop-shadow-2xl"
              />
              {/* Placeholder for video - user will add their own video */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-12 py-16">
                <div className="w-full h-full bg-muted/20 rounded-3xl flex items-center justify-center">
                  <p className="text-xs text-foreground/80 bg-background/80 px-3 py-2 rounded">
                    Tu video aquí
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
