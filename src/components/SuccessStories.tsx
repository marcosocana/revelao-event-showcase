import { Star } from "lucide-react";
import weddingPhoto from "@/assets/wedding-photo.jpg";
import corporatePhoto from "@/assets/corporate-photo.jpg";
import birthdayPhoto from "@/assets/birthday-photo.jpg";

const stories = [
  {
    image: weddingPhoto,
    name: "María & Carlos",
    event: "Boda",
    testimonial: "¡Increíble! Nuestros invitados compartieron más de 400 fotos. Pudimos revivir nuestra boda desde todos los ángulos. Una experiencia mágica.",
    rating: 5,
  },
  {
    image: corporatePhoto,
    name: "Tech Solutions S.A.",
    event: "Evento Corporativo",
    testimonial: "Perfecto para nuestra cena de empresa. Todos participaron y conseguimos fotos auténticas del equipo. El proceso fue súper sencillo.",
    rating: 5,
  },
  {
    image: birthdayPhoto,
    name: "Laura",
    event: "Cumpleaños 30",
    testimonial: "Mi cumpleaños quedó inmortalizado desde cada perspectiva. Mis amigos se lo pasaron genial subiendo fotos. ¡Totalmente recomendado!",
    rating: 5,
  },
];

export const SuccessStories = () => {
  return (
    <section className="py-24 bg-muted/50" id="casos-de-exito">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Casos de éxito
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Miles de eventos ya confían en Revelao.cam para capturar sus momentos especiales
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {stories.map((story, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-glow transition-all duration-300 animate-fade-in border border-border"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={story.image}
                  alt={`Evento de ${story.name}`}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
              
              <div className="p-6">
                <div className="flex gap-1 mb-3">
                  {[...Array(story.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-accent text-accent"
                    />
                  ))}
                </div>
                
                <p className="text-muted-foreground mb-4 leading-relaxed italic">
                  "{story.testimonial}"
                </p>
                
                <div className="border-t border-border pt-4">
                  <p className="font-semibold text-card-foreground">
                    {story.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {story.event}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
