import { useEffect } from "react";
import { Download, Mail, MessageSquareQuote } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import WhatsAppFloating from "@/components/WhatsAppFloating";
import mainLogo from "@/assets/LogoMiniRevelao.png";
import compactLogo from "@/assets/logo-mini.png";
import symbolLogo from "@/assets/ico.png";
import productVisual from "@/assets/how-step-reveal-new.png";

const brandAssets = [
  { name: "Logotipo principal", description: "Versión horizontal sobre fondo claro.", image: mainLogo, filename: "revelao-logo-principal.png", imageClass: "max-h-20 max-w-[88%]" },
  { name: "Logotipo compacto", description: "Versión reducida para espacios pequeños.", image: compactLogo, filename: "revelao-logo-compacto.png", imageClass: "max-h-16 max-w-[80%]" },
  { name: "Símbolo Revelao", description: "Icono independiente de la marca.", image: symbolLogo, filename: "revelao-simbolo.png", imageClass: "max-h-20 max-w-[80%]" },
];

const PressKit = () => {
  useEffect(() => {
    document.title = "Kit de prensa | Revelao.cam";
    const description = "Logos, descripción oficial, datos básicos y recursos de prensa de Revelao.cam.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", description);
  }, []);

  return (
    <div className="min-h-screen bg-background" id="inicio">
      <Navbar />
      <main className="pt-16">
        <section className="border-b border-border bg-[linear-gradient(145deg,#fff_0%,#f7f5f3_100%)] py-14 md:py-24">
          <div className="container mx-auto grid items-center gap-10 px-4 lg:grid-cols-[1fr_0.85fr]">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Recursos de marca</p>
              <h1 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-5xl lg:text-6xl">Kit de prensa de Revelao</h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">Información, mensajes y recursos visuales para hablar de Revelao.cam de forma clara y consistente.</p>
              <Button className="mt-8 rounded-full px-6" asChild>
                <a href="mailto:revelao.cam@gmail.com?subject=Consulta%20de%20prensa%20sobre%20Revelao.cam"><Mail className="mr-2 h-4 w-4" />Contacto de prensa</a>
              </Button>
            </div>
            <div className="rounded-[24px] border border-border bg-white p-6 shadow-[0_24px_70px_-45px_rgba(15,23,42,0.45)]">
              <img src={productVisual} alt="Galería de recuerdos de Revelao" className="mx-auto h-auto max-h-[400px] w-full object-contain" />
            </div>
          </div>
        </section>

        <section className="py-14 md:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-6xl">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">La marca, en breve</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Qué es Revelao.cam</h2>
                <p className="mt-5 text-lg leading-8 text-muted-foreground">Revelao.cam es una galería privada para eventos a la que los invitados acceden mediante un QR. Desde el navegador del móvil pueden subir fotos, vídeos y mensajes de audio sin instalar ninguna app. El contenido permanece oculto durante el evento y se descubre después en el Revelado.</p>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ["Producto", "Galería colaborativa con QR"],
                  ["Experiencia", "Sin apps ni registros para invitados"],
                  ["Contenido", "Fotos, vídeos y mensajes de audio"],
                  ["Usos", "Bodas, fiestas y eventos de empresa"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-[16px] border border-border bg-neutral-50 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{label}</p>
                    <p className="mt-2 font-semibold leading-6 text-foreground">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-neutral-100 py-14 md:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-6xl">
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Logos para descargar</h2>
              <p className="mt-3 text-muted-foreground">Utiliza los archivos sin deformarlos, recolorearlos ni alterar sus proporciones.</p>
              <div className="mt-8 grid gap-5 md:grid-cols-3">
                {brandAssets.map((asset) => (
                  <article key={asset.name} className="overflow-hidden rounded-[18px] border border-border bg-white">
                    <div className="flex h-48 items-center justify-center bg-[#f7f7f7] p-6">
                      <img src={asset.image} alt={asset.name} className={`h-auto w-auto object-contain ${asset.imageClass}`} />
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-semibold">{asset.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{asset.description}</p>
                      <a href={asset.image} download={asset.filename} className="mt-5 inline-flex h-10 items-center rounded-full border border-border bg-white px-4 text-sm font-semibold shadow-sm hover:bg-muted">
                        <Download className="mr-2 h-4 w-4" />Descargar PNG
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 md:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
              <article className="rounded-[20px] border border-border bg-white p-6 md:p-8">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Texto para copiar</p>
                <h2 className="mt-3 text-2xl font-semibold">Descripción oficial</h2>
                <p className="mt-5 leading-7 text-muted-foreground">Revelao.cam convierte las fotos, vídeos y mensajes de audio de los invitados en una experiencia compartida. Un QR permite subir contenido sin apps y una galería privada lo mantiene oculto hasta el momento del Revelado.</p>
              </article>
              <article className="rounded-[20px] bg-neutral-950 p-6 text-white md:p-8">
                <MessageSquareQuote className="h-7 w-7 text-primary" aria-hidden="true" />
                <blockquote className="mt-5 text-2xl font-medium leading-snug tracking-tight">“Los mejores momentos de un evento ocurren desde muchos puntos de vista. Revelao los reúne y devuelve la emoción de descubrirlos.”</blockquote>
                <p className="mt-6 text-sm text-white/60">Marcos · Fundador de Revelao.cam</p>
              </article>
            </div>
          </div>
        </section>

        <section className="border-t border-border py-14 text-center md:py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">Contacto de prensa</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">Para entrevistas, colaboraciones o materiales adicionales, escribe directamente a Marcos.</p>
            <Button className="mt-7 rounded-full px-7" asChild><a href="mailto:revelao.cam@gmail.com">revelao.cam@gmail.com</a></Button>
          </div>
        </section>
      </main>
      <WhatsAppFloating message="Hola Marcos! Me gustaría contactar con Revelao por una consulta de prensa." />
      <Footer />
    </div>
  );
};

export default PressKit;
