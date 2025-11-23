import { Button } from "@/components/ui/button";

export const AccessBanner = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container px-4 mx-auto text-center">
        <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
          ¿Ya has creado tu evento?
        </h3>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Si ya nos has contactado y has creado un evento, puedes acceder a nuestra plataforma.
        </p>
        <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
          <a href="/acceso" target="_blank" rel="noopener noreferrer">
            Acceder a Revelao
          </a>
        </Button>
      </div>
    </section>
  );
};
