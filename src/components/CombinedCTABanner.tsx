import { Button } from "@/components/ui/button";
export const CombinedCTABanner = () => {
  return <section className="py-8 md:py-16">
      <div className="container px-4 mx-auto">
        <div className="grid md:grid-cols-2 gap-4 md:gap-0 max-w-6xl mx-auto">
          {/* Left side - Contact/Questions CTA */}
          <div className="text-center md:text-left bg-primary p-8 md:p-12 md:rounded-l-lg">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">
              ¿Sigues teniendo dudas?
            </h3>
            <p className="text-lg text-white/90 mb-8">Contáctanos por WhatsApp y te estaremos encantados de poder ayudarte.</p>
            <Button size="lg" className="bg-white text-foreground hover:bg-white/90" asChild>
              <a href="https://wa.me/34695834018?text=Hola! Estoy interesado en contratar Revelao.cam. ¿Puedes darme más información?">
                ¿Hablamos?
              </a>
            </Button>
          </div>

          {/* Right side - Access CTA */}
          <div className="text-center md:text-left bg-muted p-8 md:p-12 md:rounded-r-lg">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
              ¿Ya has creado tu evento?
            </h3>
            <p className="text-lg text-foreground mb-8">
              Si ya nos has contactado y has creado un evento, puedes acceder a nuestra plataforma.
            </p>
            <Button size="lg" asChild className="bg-foreground text-background hover:bg-foreground/90">
              <a href="https://acceso.revelao.cam" target="_blank" rel="noopener noreferrer">
                Acceder a Revelao
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>;
};