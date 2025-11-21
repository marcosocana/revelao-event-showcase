import { Button } from "@/components/ui/button";
import { Camera, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Personas celebrando y tomando fotos en un evento" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-background/95" />
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4 py-20 mx-auto text-center animate-fade-in">
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-full shadow-soft">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-secondary-foreground">
              Captura cada momento especial
            </span>
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground leading-tight">
          Comparte los mejores{" "}
          <span className="bg-gradient-hero bg-clip-text text-transparent">
            momentos
          </span>
          <br />
          de tu evento
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          Revelao.cam permite a tus invitados subir y compartir fotos en tiempo real. 
          Crea una galería colaborativa inolvidable de tu boda, cumpleaños o evento corporativo.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            variant="hero" 
            size="lg"
            asChild
            className="gap-2"
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
          >
            <a href="https://wa.me/34695834018?text=Hola! Estoy interesado en contratar Revelao.cam. ¿Puedes darme más información?">
              Contactar
            </a>
          </Button>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span>Sin descargas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span>Fácil de usar</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span>En tiempo real</span>
          </div>
        </div>
      </div>
    </section>
  );
};
