import { Button } from "@/components/ui/button";
import { Camera, Mail, Phone } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container px-4 mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center">
                <Camera className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold">Revelao.cam</span>
            </div>
            <p className="text-background/80 mb-6 max-w-sm">
              La forma más fácil de compartir y disfrutar las fotos de tu evento. 
              Sin apps, sin complicaciones.
            </p>
            <Button variant="outline" size="lg" asChild className="border-background/30 text-background hover:bg-background/10">
              <a href="http://www.revelao.cam">
                Acceder a la App
              </a>
            </Button>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Enlaces rápidos</h3>
            <ul className="space-y-2">
              <li>
                <a href="#como-funciona" className="text-background/80 hover:text-background transition-colors">
                  Cómo funciona
                </a>
              </li>
              <li>
                <a href="#precio" className="text-background/80 hover:text-background transition-colors">
                  Precios
                </a>
              </li>
              <li>
                <a href="#casos-de-exito" className="text-background/80 hover:text-background transition-colors">
                  Casos de éxito
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="https://wa.me/34695834018?text=Hola! Estoy interesado en contratar Revelao.cam. ¿Puedes darme más información?"
                  className="flex items-center gap-2 text-background/80 hover:text-background transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  +34 695 834 018
                </a>
              </li>
              <li className="flex items-center gap-2 text-background/80">
                <Mail className="w-4 h-4" />
                info@revelao.cam
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-background/60 text-sm">
            © {currentYear} Revelao.cam. Todos los derechos reservados.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-background/60 hover:text-background transition-colors">
              Política de Privacidad
            </a>
            <a href="#" className="text-background/60 hover:text-background transition-colors">
              Términos y Condiciones
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
