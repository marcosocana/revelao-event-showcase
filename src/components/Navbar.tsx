import { Button } from "@/components/ui/button";
import icon from "@/assets/ico.png";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#inicio" className="flex items-center gap-3">
            <img src={icon} alt="Revelao" className="h-8 w-auto" />
            <span className="text-xl font-bold text-foreground">Revelao.cam</span>
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#como-funciona" className="text-muted-foreground hover:text-foreground transition-colors">
              Cómo funciona
            </a>
            <a href="#precio" className="text-muted-foreground hover:text-foreground transition-colors">
              Precio
            </a>
            <a href="#casos-de-exito" className="text-muted-foreground hover:text-foreground transition-colors">
              Casos de éxito
            </a>
            <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <a href={`https://wa.me/34695834018?text=${encodeURIComponent("Hola! Estoy interesado en contratar Revelao.cam. ¿Puedes darme más información?")}`}>
                Contratar
              </a>
            </Button>
          </div>

          {/* Mobile CTA Button */}
          <Button asChild size="sm" className="md:hidden bg-primary text-primary-foreground hover:bg-primary/90">
            <a href={`https://wa.me/34695834018?text=${encodeURIComponent("Hola! Estoy interesado en contratar Revelao.cam. ¿Puedes darme más información?")}`}>
              Contratar
            </a>
          </Button>
        </div>
      </div>
    </nav>
  );
};
