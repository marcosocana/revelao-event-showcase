import { Upload, Users, Image } from "lucide-react";

const features = [
  {
    icon: Upload,
    title: "Sube tus fotos",
    description: "Tus invitados escanean un código QR y suben sus fotos directamente desde su móvil. Sin apps, sin complicaciones.",
  },
  {
    icon: Users,
    title: "Comparte en tiempo real",
    description: "Todas las fotos aparecen instantáneamente en una galería compartida donde todos pueden verlas y disfrutarlas.",
  },
  {
    icon: Image,
    title: "Descarga tu galería",
    description: "Al finalizar el evento, descarga todas las fotos en alta calidad. Conserva los recuerdos para siempre.",
  },
];

export const Features = () => {
  return (
    <section className="py-24 bg-muted/50" id="como-funciona">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            ¿Cómo funciona?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tres pasos simples para crear la galería perfecta de tu evento
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative p-8 bg-card rounded-2xl shadow-soft hover:shadow-glow transition-all duration-300 animate-fade-in border border-border"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="absolute -top-4 left-8">
                <div className="w-12 h-12 rounded-full bg-gradient-hero flex items-center justify-center shadow-soft">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-2xl font-bold mb-3 text-card-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
