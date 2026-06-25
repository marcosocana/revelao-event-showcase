import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const CookiePolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 p-4 flex items-center gap-4 bg-card border-b border-border">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold text-foreground">Política de Cookies</h1>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        <p className="text-sm text-muted-foreground">Última actualización: 25-06-2026</p>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">1. Qué son las cookies</h2>
          <p className="text-muted-foreground leading-relaxed">
            Las cookies son pequeños archivos que se almacenan en el dispositivo del usuario cuando visita
            una página web. Sirven para recordar preferencias, mejorar el funcionamiento del sitio y obtener
            información agregada sobre el uso del servicio.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">2. Cookies que utilizamos</h2>
          <p className="text-muted-foreground leading-relaxed">
            Revelao utiliza cookies técnicas necesarias para que la web funcione correctamente y para
            recordar la preferencia de consentimiento de cookies. También podemos utilizar herramientas de
            medición o analítica para entender el uso de la web y mejorar el servicio.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">3. Cookies técnicas</h2>
          <p className="text-muted-foreground leading-relaxed">
            Son necesarias para navegar por la web, mantener la seguridad, recordar ajustes básicos y
            permitir el funcionamiento normal de la plataforma. Estas cookies no requieren consentimiento
            previo cuando son imprescindibles para prestar el servicio solicitado.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">4. Cookies de análisis</h2>
          <p className="text-muted-foreground leading-relaxed">
            Las cookies de análisis nos ayudan a conocer de forma agregada cómo se utiliza la web, qué
            páginas se visitan y qué aspectos podemos mejorar. Solo se utilizarán cuando el usuario haya
            aceptado su uso, cuando así lo exija la normativa aplicable.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">5. Gestión del consentimiento</h2>
          <p className="text-muted-foreground leading-relaxed">
            Al acceder a la web se muestra un aviso que permite aceptar o rechazar las cookies no necesarias.
            El usuario puede cambiar o eliminar sus preferencias borrando los datos del sitio desde la
            configuración de su navegador.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">6. Cómo desactivar cookies</h2>
          <p className="text-muted-foreground leading-relaxed">
            Puede bloquear o eliminar cookies desde la configuración de su navegador. Tenga en cuenta que
            desactivar algunas cookies técnicas puede afectar al funcionamiento normal de la web.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">7. Contacto</h2>
          <p className="text-muted-foreground leading-relaxed">
            Para cualquier consulta sobre esta política puede escribir a: revelao.cam@gmail.com
          </p>
        </section>
      </main>
    </div>
  );
};

export default CookiePolicy;
