import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import phoneMockup from "@/assets/phone-mockup.png";
import ruedaVideo from "@/assets/rueda.mp4";

export const Hero = () => {
  return (
    <section className="relative min-h-screen px-4 overflow-hidden flex items-center" id="inicio">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          preload="auto"
          className="w-full h-full object-cover blur-sm"
          style={{ filter: 'blur(4px)' }}
        >
          <source src={ruedaVideo} type="video/mp4" />
          Tu navegador no soporta el elemento de video.
        </video>
      </div>
      <div className="absolute inset-0 z-0 bg-white/85" />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-8 rounded-full bg-primary/10">
              <Camera className="w-10 h-10 text-primary" />
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-black">
              Captura hoy,{" "}
              <span className="text-primary">revela mañana</span>
            </h1>
            
            <p className="text-lg md:text-xl text-black/90 mb-8">
              Tus invitados suben fotos de forma anónima durante el evento. 
              La magia ocurre al día siguiente cuando todas las imágenes se revelan.
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-8 text-sm text-black/80 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-black" />
                <span>100% anónimo</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-black" />
                <span>Sin apps</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-black" />
                <span>Máxima expectación</span>
              </div>
            </div>
            
            <div className="flex justify-center md:justify-start">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                <a href="https://wa.me/34695834018?text=Hola! Estoy interesado en contratar Revelao.cam. ¿Puedes darme más información?">
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
                className="w-auto h-[70vh] object-contain"
              />
              {/* Placeholder for video - user will add their own video */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-xs text-muted-foreground bg-background/80 px-3 py-2 rounded">
                  Video placeholder
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
