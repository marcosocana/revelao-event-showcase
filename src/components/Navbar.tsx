import { Button } from "@/components/ui/button";
import { Camera, Menu, X } from "lucide-react";
import { useState } from "react";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-hero flex items-center justify-center">
              <Camera className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Revelao.cam</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#como-funciona" className="text-foreground hover:text-primary transition-colors font-medium">
              Cómo funciona
            </a>
            <a href="#precio" className="text-foreground hover:text-primary transition-colors font-medium">
              Precios
            </a>
            <a href="#casos-de-exito" className="text-foreground hover:text-primary transition-colors font-medium">
              Casos de éxito
            </a>
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" asChild>
              <a href="https://wa.me/34695834018?text=Hola! Estoy interesado en contratar Revelao.cam. ¿Puedes darme más información?">
                Contactar
              </a>
            </Button>
            <Button variant="default" asChild>
              <a href="http://www.revelao.cam">
                Acceder
              </a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 text-foreground hover:bg-muted rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-4">
              <a
                href="#como-funciona"
                onClick={toggleMenu}
                className="px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors font-medium"
              >
                Cómo funciona
              </a>
              <a
                href="#precio"
                onClick={toggleMenu}
                className="px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors font-medium"
              >
                Precios
              </a>
              <a
                href="#casos-de-exito"
                onClick={toggleMenu}
                className="px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors font-medium"
              >
                Casos de éxito
              </a>
              <div className="flex flex-col gap-2 px-4 pt-2">
                <Button variant="ghost" asChild className="w-full">
                  <a href="https://wa.me/34695834018?text=Hola! Estoy interesado en contratar Revelao.cam. ¿Puedes darme más información?">
                    Contactar
                  </a>
                </Button>
                <Button variant="default" asChild className="w-full">
                  <a href="http://www.revelao.cam">
                    Acceder
                  </a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
