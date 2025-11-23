import { Button } from "@/components/ui/button";
const whatsappMessage = "Hola! Estoy interesado en contratar Revelao.cam. ¿Puedes darme más información?";
export const CTABanner = () => {
  return <section className="py-16 bg-primary">
      <div className="container px-4 mx-auto text-center">
        <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">
          ¿A qué estás esperando?
        </h3>
        <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
          Contáctanos por WhatsApp y te resolveremos todas tus dudas sin compromiso.
        </p>
        <Button size="lg" asChild className="bg-white text-foreground hover:bg-white/90">
          <a href={`https://wa.me/34695834018?text=${encodeURIComponent(whatsappMessage)}`}>Mas información</a>
        </Button>
      </div>
    </section>;
};