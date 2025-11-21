import icon from "@/assets/ico.png";

export const Footer = () => {
  return (
    <footer className="py-12 border-t border-border">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src={icon} alt="Revelao" className="h-6 w-auto" />
            <span className="font-bold text-foreground">Revelao.cam</span>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <a href="#como-funciona" className="hover:text-foreground transition-colors">
              Cómo funciona
            </a>
            <a href="#precio" className="hover:text-foreground transition-colors">
              Precio
            </a>
            <a href="#casos-de-exito" className="hover:text-foreground transition-colors">
              Casos de éxito
            </a>
            <a
              href="https://wa.me/34695834018?text=Hola! Estoy interesado en contratar Revelao.cam. ¿Puedes darme más información?"
              className="hover:text-foreground transition-colors"
            >
              Contacto
            </a>
          </div>

          <p className="text-sm text-muted-foreground">
            © 2024 Revelao.cam
          </p>
        </div>
      </div>
    </footer>
  );
};
