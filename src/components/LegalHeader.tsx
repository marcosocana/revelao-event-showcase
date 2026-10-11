import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logoMini from "@/assets/logo-mini.png";

// Cabecera de las páginas legales: volver atrás si se llegó desde la web y, si se entró
// directamente (sin historial dentro de la web), a la home. El logo siempre lleva a la home.
export const LegalHeader = ({ title }: { title: string }) => {
  const navigate = useNavigate();
  const goBack = () => {
    const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0;
    if (idx > 0) navigate(-1);
    else navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 flex items-center gap-4 border-b border-border bg-card p-4">
      <Button variant="ghost" size="icon" onClick={goBack} className="rounded-full" aria-label="Volver">
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <h1 className="text-xl font-bold text-foreground">{title}</h1>
      <a href="/" className="ml-auto flex-none" aria-label="Ir a la página principal de Revelao">
        <img src={logoMini} alt="Revelao" className="h-8 w-auto" />
      </a>
    </header>
  );
};
