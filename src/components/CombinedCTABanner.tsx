import { Button } from "@/components/ui/button";

const whatsappMessage = "Hola! Estoy interesado en contratar Revelao.cam. ¿Puedes darme más información?";

export const CombinedCTABanner = () => {
  return (
    <section className="py-16">
      <div className="container px-4 mx-auto">
        <div className="grid md:grid-cols-2 gap-0 max-w-6xl mx-auto">
          {/* Left side - Contact CTA */}
          <div className="text-center md:text-left bg-primary p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">
              ¿A qué estás esperando?
            </h3>
            <p className="text-lg text-white/90 mb-8">
              Contáctanos por WhatsApp y te resolveremos todas tus dudas sin compromiso.
            </p>
            <Button size="lg" asChild className="bg-white text-foreground hover:bg-white/90">
              <a href={`https://wa.me/34695834018?text=${encodeURIComponent(whatsappMessage)}`}>
                Mas información
              </a>
            </Button>
          </div>

          {/* Right side - Access CTA */}
          <div className="text-center md:text-left bg-muted p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
              ¿Ya has creado tu evento?
            </h3>
            <p className="text-lg text-foreground mb-8">
              Si ya nos has contactado y has creado un evento, puedes acceder a nuestra plataforma.
            </p>
            <Button size="lg" asChild className="bg-foreground text-background hover:bg-foreground/90">
              <a href="https://tomorrow-snap-reveal.vercel.app" target="_blank" rel="noopener noreferrer">
                Acceder a Revelao
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
