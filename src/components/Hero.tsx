import { Button } from "@/components/ui/button";
import { Camera, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

export const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="container max-w-4xl mx-auto text-center animate-fade-in">
        <div className="mb-8 inline-block px-4 py-1.5 bg-secondary rounded-full">
          <span className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
            Beta Experience
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground">
          Captura hoy,{" "}
          <span className="text-primary">revela mañana</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
          Tus invitados suben fotos durante el evento. Todo permanece anónimo y oculto. 
          Al día siguiente, todas las fotos se revelan. El hype es real.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Button 
            size="lg"
            asChild
            className="gap-2 min-w-[200px]"
          >
            <a href="http://www.revelao.cam">
              <Camera className="w-5 h-5" />
              Acceder a la App
            </a>
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            asChild
            className="min-w-[200px]"
          >
            <a href="https://wa.me/34695834018?text=Hola! Estoy interesado en contratar Revelao.cam. ¿Puedes darme más información?">
              Contactar
            </a>
          </Button>
        </div>

        <div className="flex flex-wrap justify-center gap-12 text-sm text-muted-foreground">
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
      </div>
    </section>
  );
};
