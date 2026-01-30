import { Button } from "@/components/ui/button";
import { Sparkles, Gift } from "lucide-react";

export const FreeTrial = () => {
  return (
    <section className="py-12 md:py-20 bg-primary/5">
      <div className="container px-4 mx-auto">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/10 mb-6">
            <Gift className="w-8 h-8 md:w-10 md:h-10 text-primary" />
          </div>
          
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
            ¿Quieres probarlo antes?
          </h2>
          
          <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Crea un evento de prueba gratuito y descubre cómo funciona la experiencia completa de Revelao. Sin compromiso, sin tarjeta.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 text-base px-8 py-6"
              asChild
            >
              <a href="https://acceso.revelao.cam/nuevoeventodemo" target="_blank" rel="noopener noreferrer">
                <Sparkles className="w-5 h-5 mr-2" />
                Prueba gratis
              </a>
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mt-6">
            ✓ Sin registro · ✓ Sin tarjeta · ✓ Listo en 30 segundos
          </p>
        </div>
      </div>
    </section>
  );
};
