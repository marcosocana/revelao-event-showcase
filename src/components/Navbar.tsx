import { Button } from "@/components/ui/button";
import icon from "@/assets/ico.png";
import logoMini from "@/assets/logo-mini.png";
export const Navbar = () => {
  return <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container px-4 mx-auto">
        <div className="flex items-center h-16">
          {/* Left: Logo */}
          <div className="flex items-center">
            <a href="#inicio" className="flex items-center gap-3">
              <img src={icon} alt="Revelao" className="h-8 w-auto hidden md:block" />
              <img src={logoMini} alt="Revelao" className="h-8 w-auto md:hidden" />
              <span className="sr-only">Revelao.cam</span>
              <span className="text-xl font-bold text-foreground hidden md:inline">Revelao.cam</span>
            </a>
          </div>

          {/* Center: Menu */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex items-center gap-8">
              <a href="#como-funciona" className="text-muted-foreground hover:text-foreground transition-colors">
                Cómo funciona
              </a>
              <a href="#casos-de-exito" className="text-muted-foreground hover:text-foreground transition-colors">
                Testimonios
              </a>
              <a href="#plantillas" className="text-muted-foreground hover:text-foreground transition-colors">
                Plantillas
              </a>
              <a href="#precio" className="text-muted-foreground hover:text-foreground transition-colors">
                Precio
              </a>
            <a href="#blog" className="text-muted-foreground hover:text-foreground transition-colors">
              Blog
            </a>
            <a href="#faqs" className="text-muted-foreground hover:text-foreground transition-colors">
              FAQs
            </a>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="hidden md:flex items-center gap-6 ml-auto">
            <a
              href="https://acceso.revelao.cam"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Accede a tu evento
            </a>
            <Button 
              size="sm" 
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              asChild
            >
              <a href="https://acceso.revelao.cam/nuevoeventodemo" target="_blank" rel="noopener noreferrer">
                Pruebalo gratis
              </a>
            </Button>
          </div>

          {/* Mobile CTA Button */}
          <div className="md:hidden ml-auto flex items-center gap-3">
            <a
              href="https://acceso.revelao.cam"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Acceder
            </a>
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              asChild
            >
              <a href="https://acceso.revelao.cam/nuevoeventodemo" target="_blank" rel="noopener noreferrer">
                Probar gratis
              </a>
            </Button>
          </div>
        </div>
      </div>
    </nav>;
};
