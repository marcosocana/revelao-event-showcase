import { Button } from "@/components/ui/button";
import { Sparkles, Gift } from "lucide-react";

export const FreeTrial = () => {
  return (
    <section className="py-8 md:py-12 bg-primary/5">
      <div className="container px-4 mx-auto">
        <div className="max-w-xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary/10 mb-4">
            <Gift className="w-6 h-6 md:w-7 md:h-7 text-primary" />
          </div>
          
          <h2 className="text-xl md:text-3xl font-bold text-foreground mb-3">
            ¿Quieres probarlo antes?
          </h2>
          
          <p className="text-sm md:text-base text-muted-foreground mb-6 max-w-lg mx-auto">
            Crea un evento de prueba gratuito y descubre cómo funciona la experiencia completa de Revelao. Sin compromiso, sin tarjeta.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Button 
              size="default" 
              className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 text-sm px-6 py-4"
              asChild
            >
              <a href="https://acceso.revelao.cam/nuevoeventodemo" target="_blank" rel="noopener noreferrer">
                <Sparkles className="w-4 h-4 mr-2" />
                Prueba gratis
              </a>
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground mt-4">
            ✓ Sin registro · ✓ Sin tarjeta · ✓ Listo en 30 segundos
          </p>
        </div>
      </div>
    </section>
  );
};
