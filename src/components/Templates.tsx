import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const templates = [
  { id: 1, title: "Boda Clásica" },
  { id: 2, title: "Boda Moderna" },
  { id: 3, title: "Boda Vintage" },
  { id: 4, title: "Boda Romántica" },
  { id: 5, title: "Boda Elegante" },
  { id: 6, title: "Boda Minimalista" },
  { id: 7, title: "Boda Rústica" },
  { id: 8, title: "Boda Bohemia" },
];

export const Templates = () => {
  return (
    <section className="py-12 md:py-24 bg-background" id="plantillas">
      <div className="container px-4 mx-auto">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 text-center animate-fade-in">
            <h2 className="font-bold mb-4 text-foreground md:text-5xl text-3xl">
              Plantillas personalizadas
            </h2>
            <p className="text-base text-muted-foreground md:text-xl">
              Descarga carteles con código QR para tu evento
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map((template) => (
              <div
                key={template.id}
                className="bg-muted/30 rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow"
              >
                <div className="aspect-[3/4] bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                  <div className="text-center p-6">
                    <div className="w-24 h-24 mx-auto mb-4 bg-background rounded-lg flex items-center justify-center">
                      <span className="text-4xl">QR</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{template.title}</p>
                  </div>
                </div>
                <div className="p-4">
                  <Button className="w-full" variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Descargar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
