import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import icon from "@/assets/ico.png";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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
            <Button asChild size="sm">
              <a href="http://www.revelao.cam" target="_blank" rel="noopener noreferrer">Acceder</a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-4">
              <a href="#como-funciona" onClick={() => setIsMenuOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                Cómo funciona
              </a>
              <a href="#precio" onClick={() => setIsMenuOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                Precio
              </a>
              <a href="#casos-de-exito" onClick={() => setIsMenuOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                Casos de éxito
              </a>
              <Button asChild className="w-full">
                <a href="http://www.revelao.cam" target="_blank" rel="noopener noreferrer">Acceder</a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
