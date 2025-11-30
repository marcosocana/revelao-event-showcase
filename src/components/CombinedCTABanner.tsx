import { Button } from "@/components/ui/button";

export const CombinedCTABanner = () => {
  return (
    <section className="py-8 md:py-16">
      <div className="container px-4 mx-auto">
        <div className="max-w-6xl mx-auto">
          {/* Access CTA */}
          <div className="text-center bg-muted p-8 md:p-12 rounded-lg">
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
    </section>
  );
};
