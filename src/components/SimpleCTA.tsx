import { Button } from "@/components/ui/button";

export const SimpleCTA = () => {
  return (
    <section className="py-10 md:py-16 bg-transparent">
      <div className="container px-4 mx-auto">
        <div className="flex justify-center">
          <Button
            size="lg"
            className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-10 py-6 text-lg"
            asChild
          >
            <a href="https://acceso.revelao.cam/nuevoeventodemo" target="_blank" rel="noopener noreferrer">
              Pruébalo gratis
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};
