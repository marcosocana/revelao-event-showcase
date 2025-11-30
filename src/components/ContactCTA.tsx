import { Button } from "@/components/ui/button";

export const ContactCTA = () => {
  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container px-4 mx-auto text-center">
        <p className="text-lg md:text-xl text-foreground mb-6 max-w-2xl mx-auto">
          ¿Sigues teniendo dudas? Contáctanos por WhatsApp y te ayudaremos encantados.
        </p>
        <Button 
          size="lg" 
          variant="outline" 
          className="border-2 border-primary text-primary hover:bg-primary/10"
          asChild
        >
          <a href="https://wa.me/34695834018?text=Hola! Estoy interesado en contratar Revelao.cam. ¿Puedes darme más información?">
            ¿Hablamos?
          </a>
        </Button>
      </div>
    </section>
  );
};