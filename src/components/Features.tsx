import { Upload, Eye, Download } from "lucide-react";

const features = [
  {
    icon: Upload,
    title: "Captura el momento",
    description: "Tus invitados escanean un código QR y suben fotos sin revelar su identidad. Todo queda oculto hasta el final.",
  },
  {
    icon: Eye,
    title: "Genera expectación",
    description: "Nadie ve las fotos durante el evento. La incertidumbre crea hype y mantiene a todos enganchados.",
  },
  {
    icon: Download,
    title: "Revela al día siguiente",
    description: "Al día siguiente, todas las fotos se revelan simultáneamente. Descarga la galería completa en alta calidad.",
  },
];

export const Features = () => {
  return (
    <section className="py-24 bg-secondary/50" id="como-funciona">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">
            Cómo funciona
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tres pasos para crear anticipación y capturar cada momento
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="mx-auto w-16 h-16 rounded-full bg-foreground flex items-center justify-center mb-6">
                <feature.icon className="w-8 h-8 text-background" />
              </div>
              
              <h3 className="text-xl font-bold mb-3 text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
