import { ArrowRight, Star } from "lucide-react";
import { Link } from "react-router-dom";
import testimonialCouple from "@/assets/testimonial-feature-couple.avif";
import testimonialFriends from "@/assets/testimonial-feature-friends.avif";
import testimonialFamily from "@/assets/testimonial-feature-family.avif";
import testimonialDance from "@/assets/testimonial-feature-dance.avif";
import { useI18n, translations } from "@/lib/i18n";

const featuredTestimonials = [
  {
    image: testimonialCouple,
    quote: "Éramos casi 150 invitados y subieron más de 800 fotos. Descubrimos momentos que ni sabíamos que habían pasado.",
    author: "Laura y Carlos",
    location: "Sevilla",
    date: "06.2025",
  },
  {
    image: testimonialFriends,
    quote: "92 invitados reunieron 540 fotos y 68 vídeos sin descargar nada. Las fotos de la cena son nuestro recuerdo favorito.",
    author: "Marta y Álvaro",
    location: "Madrid",
    date: "09.2025",
  },
  {
    image: testimonialFamily,
    quote: "Más de 100 invitados subieron 670 fotos. Hasta mi abuela participó a la primera con el QR.",
    author: "Inés y Dani",
    location: "Bilbao",
    date: "04.2026",
  },
  {
    image: testimonialDance,
    quote: "En una noche reunimos 910 fotos y 74 vídeos. Revivir el baile desde los móviles de nuestros amigos fue una pasada.",
    author: "Claudia y Marcos",
    location: "Valencia",
    date: "07.2026",
  },
];

export const SuccessStories = () => {
  const { lang } = useI18n();
  const t = translations[lang];

  return (
    <section className="bg-transparent py-12 md:py-24" id="casos-de-exito">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center md:mb-10">
          <h2 className="revelao-h2 mb-2 text-center">{t.stories.title}</h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">
            Momentos que se habrían quedado en otros móviles, reunidos para siempre.
          </p>
        </div>

        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-auto md:grid md:max-w-[1120px] md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0 xl:grid-cols-4">
          {featuredTestimonials.map((testimonial) => (
            <article
              key={testimonial.author}
              className="w-[82vw] max-w-[310px] shrink-0 snap-center overflow-hidden rounded-[18px] border border-border bg-white shadow-[0_18px_48px_-30px_rgba(15,23,42,0.5)] md:w-auto md:max-w-none"
            >
              <img
                src={testimonial.image}
                alt={`Boda de ${testimonial.author}`}
                className="aspect-[4/3] w-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="flex min-h-[190px] flex-col p-4">
                <div className="mb-3 flex gap-0.5 text-primary" aria-label="5 de 5 estrellas">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-current" aria-hidden="true" />
                  ))}
                </div>
                <blockquote className="text-[15px] font-medium leading-snug tracking-[-0.015em] text-foreground">
                  “{testimonial.quote}”
                </blockquote>
                <p className="mt-auto pt-5 text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{testimonial.author}</span>
                  <span aria-hidden="true"> · </span>
                  {testimonial.location}
                  <span aria-hidden="true"> · </span>
                  {testimonial.date}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            to="/testimonios"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-white px-6 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-muted"
          >
            Ver más reseñas
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
};
