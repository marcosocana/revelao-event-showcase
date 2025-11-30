import { Button } from "@/components/ui/button";

export const ContactCTA = () => {
  return (
    <section className="py-8 md:py-16">
      <div className="container px-4 mx-auto">
        <div className="max-w-6xl mx-auto">
          <div className="text-center bg-primary p-8 md:p-12 rounded-lg">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">
              ¿Sigues teniendo dudas?
            </h3>
            <p className="text-lg text-white/90 mb-8">
              Contáctanos por WhatsApp y te ayudaremos encantados.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-foreground hover:bg-white/90"
              asChild
            >
              <a href="https://wa.me/34695834018?text=Hola! Estoy interesado en contratar Revelao.cam. ¿Puedes darme más información?">
                ¿Hablamos?
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};