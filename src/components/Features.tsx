import { Upload, Eye, Download } from "lucide-react";

const features = [
  {
    icon: Upload,
    title: "Escanea el código QR",
    description: "Tus invitados escanean el código QR para acceder a la galería del evento",
  },
  {
    icon: Upload,
    title: "Captura los mejores momentos",
    description: "Todos pueden tomar fotos durante el evento de forma anónima",
  },
  {
    icon: Eye,
    title: "Genera expectación",
    description: "Las fotos permanecen ocultas durante el evento, creando misterio y emoción",
  },
  {
    icon: Download,
    title: "Día de revelado",
    description: "Al día siguiente, todas las fotos se revelan en una galería privada para revivir los mejores momentos",
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
            Cuatro pasos para crear anticipación y capturar cada momento
          </p>
        </div>

        <div className="flex flex-col gap-16 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-8 animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-foreground flex items-center justify-center text-background text-2xl font-bold">
                {index + 1}
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-3 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Placeholder for image - will be added later */}
              <div className="flex-shrink-0 w-48 h-48 bg-secondary/50 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
