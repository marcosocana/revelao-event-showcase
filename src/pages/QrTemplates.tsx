import { useEffect, useMemo, useState } from "react";
import { Download, Palette, Printer, QrCode, Sparkles } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { QrTemplate, TemplateCustomizerModal, TemplateThumbnail } from "@/components/TemplateCustomizerModal";
import { qrTemplates } from "@/data/qrTemplates";
import WhatsAppFloating from "@/components/WhatsAppFloating";

const categories = ["Todas", ...Array.from(new Set(qrTemplates.map((template) => template.category)))];

const QrTemplates = () => {
  const [category, setCategory] = useState("Todas");
  const [sort, setSort] = useState("recommended");
  const [selectedTemplate, setSelectedTemplate] = useState<QrTemplate | null>(null);

  useEffect(() => {
    document.title = "Plantillas QR personalizables para eventos | Revelao.cam";
    const description = "Elige y personaliza una plantilla QR para tu boda o evento. Descárgala en PDF o pide a Revelao que la imprima por ti.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", description);

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = "https://www.revelao.cam/plantillas-qr";
  }, []);

  const visibleTemplates = useMemo(() => {
    const filtered = category === "Todas"
      ? [...qrTemplates]
      : qrTemplates.filter((template) => template.category === category);

    if (sort === "name") filtered.sort((a, b) => a.title.localeCompare(b.title, "es"));
    if (sort === "style") filtered.sort((a, b) => a.category.localeCompare(b.category, "es"));
    return filtered;
  }, [category, sort]);

  return (
    <div className="min-h-screen bg-background" id="inicio">
      <Navbar />
      <main className="pt-16">
        <section className="overflow-hidden border-b border-border bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.12),transparent_38%),linear-gradient(to_bottom,#fff,#faf8f5)] py-14 md:py-24">
          <div className="container mx-auto grid items-center gap-12 px-4 lg:grid-cols-[1fr_0.9fr]">
            <div className="max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary">
                <Sparkles className="h-4 w-4" />
                Plantillas gratuitas y listas para imprimir
              </div>
              <h1 className="text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-foreground sm:text-5xl lg:text-6xl">
                Tu QR también puede formar parte de la decoración
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                Elige una plantilla, cambia los textos y los colores, añade el QR de tu evento y comprueba el resultado al instante.
              </p>
            </div>

            <div className="relative mx-auto h-[390px] w-full max-w-[520px] sm:h-[480px]" aria-hidden="true">
              {qrTemplates.slice(0, 3).map((template, index) => (
                <div
                  key={template.id}
                  className={`absolute top-1/2 aspect-[210/297] w-[42%] -translate-y-1/2 overflow-hidden rounded-xl border-4 border-white shadow-2xl ${
                    index === 0 ? "left-[3%] -rotate-6" : index === 1 ? "left-[29%] z-10 rotate-1" : "right-[2%] rotate-7"
                  }`}
                >
                  <TemplateThumbnail template={template} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-[#faf8f5] py-8 md:py-10">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-6xl">
              <div className="flex flex-col gap-2 text-center md:flex-row md:items-end md:justify-between md:text-left">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Así de sencillo</p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">De la plantilla a tus mesas</h2>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground md:justify-end">
                  <Printer className="h-4 w-4 text-primary" />
                  También podemos imprimirlas por ti.
                </div>
              </div>

              <div className="mt-6 overflow-x-auto pb-2">
                <div className="grid min-w-[720px] grid-cols-3 gap-3">
                  {[
                    { icon: Palette, title: "1. Personaliza", text: "Cambia nombres, fecha, mensaje y colores en directo." },
                    { icon: QrCode, title: "2. Añade tu QR", text: "Introduce la URL o sube la imagen de tu código." },
                    { icon: Download, title: "3. Descarga o imprime", text: "Obtén el PDF vectorial en A6, A5 o A4." },
                  ].map(({ icon: Icon, title, text }) => (
                    <article key={title} className="flex items-start gap-3 rounded-xl border border-border bg-white p-4 shadow-sm">
                      <span className="inline-flex shrink-0 rounded-lg bg-primary/10 p-2 text-primary"><Icon className="h-4 w-4" /></span>
                      <div>
                        <h3 className="text-sm font-semibold md:text-base">{title}</h3>
                        <p className="mt-1 text-xs leading-5 text-muted-foreground md:text-sm">{text}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 md:py-20" id="catalogo-plantillas">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-6xl">
              <div className="flex flex-col gap-5 border-b border-border pb-7 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">110 diseños · Más de 1.000 combinaciones</p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Elige tu plantilla QR</h2>
                  <p className="mt-3 text-muted-foreground">Haz clic en cualquier diseño para empezar a personalizarlo.</p>
                </div>
                <label className="flex items-center gap-3 text-sm text-muted-foreground">
                  Ordenar por
                  <select value={sort} onChange={(event) => setSort(event.target.value)} className="h-10 rounded-full border border-input bg-white px-4 text-sm text-foreground">
                    <option value="recommended">Recomendadas</option>
                    <option value="name">Nombre</option>
                    <option value="style">Estilo</option>
                  </select>
                </label>
              </div>

              <div className="mt-6 flex gap-2 overflow-x-auto pb-2" aria-label="Filtrar por estilo">
                {categories.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                      category === item
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-white text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {visibleTemplates.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => setSelectedTemplate(template)}
                    className="group overflow-hidden rounded-2xl border border-border bg-white text-left shadow-[0_12px_35px_rgba(51,39,32,0.08)] transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_18px_45px_rgba(51,39,32,0.14)]"
                  >
                    <div className="relative aspect-[210/297] overflow-hidden bg-muted transition-transform duration-500 group-hover:scale-[1.01]">
                      <TemplateThumbnail template={template} />
                    </div>
                    <div className="p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{template.category}</p>
                      <div className="mt-2 flex items-center justify-between gap-3">
                        <h3 className="font-serif text-xl text-foreground">{template.title}</h3>
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Personalizar</span>
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                        <span
                          className="h-6 w-6 rounded-[6px] border border-black/10 shadow-sm"
                          style={{ background: `conic-gradient(${template.colorPresets.slice(0, 5).map((preset, index) => `${preset.accent} ${index * 20}% ${(index + 1) * 20}%`).join(", ")})` }}
                        />
                        Varios colores disponibles
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer
        text="Plantillas QR personalizables para bodas, cumpleaños, celebraciones y eventos de empresa."
        keywordsTitle="Plantillas QR para eventos"
        keywords={["Plantilla QR boda", "Cartel QR evento", "Tarjetas QR", "QR personalizado", "Cartel imprimible"]}
      />
      <TemplateCustomizerModal template={selectedTemplate} onClose={() => setSelectedTemplate(null)} />
      <WhatsAppFloating message="Hola! Quiero ayuda para elegir o personalizar una plantilla QR de Revelao." />
    </div>
  );
};

export default QrTemplates;
