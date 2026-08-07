import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Heart, Star } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SubpageTopBar } from "@/components/SubpageTopBar";
import { Button } from "@/components/ui/button";
import { testimonials, type TestimonialCategory } from "@/data/testimonials";
import testimonialCouple from "@/assets/testimonial-feature-couple.avif";
import testimonialFriends from "@/assets/testimonial-feature-friends.avif";
import testimonialFamily from "@/assets/testimonial-feature-family.avif";
import testimonialDance from "@/assets/testimonial-feature-dance.avif";

const categories: Array<"Todos" | TestimonialCategory> = ["Todos", "Boda", "Cumpleaños", "Empresa", "Celebración"];
const heroImages = [testimonialCouple, testimonialFriends, testimonialFamily, testimonialDance];

const Testimonials = () => {
  const [category, setCategory] = useState<(typeof categories)[number]>("Todos");
  const [visibleCount, setVisibleCount] = useState(18);

  useEffect(() => {
    document.title = "Testimonios y opiniones sobre Revelao | Revelao.cam";
    const description = "Descubre experiencias de bodas y eventos que reunieron fotos, vídeos y mensajes de sus invitados con Revelao.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", description);
  }, []);

  const filteredTestimonials = useMemo(
    () => category === "Todos" ? testimonials : testimonials.filter((item) => item.category === category),
    [category],
  );

  const visibleTestimonials = filteredTestimonials.slice(0, visibleCount);

  const changeCategory = (nextCategory: (typeof categories)[number]) => {
    setCategory(nextCategory);
    setVisibleCount(18);
  };

  return (
    <div className="min-h-screen bg-background" id="inicio">
      <SubpageTopBar />
      <Navbar withTopBar />
      <main className="pt-[6.5rem]">
        <section className="overflow-hidden border-b border-border bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.10),transparent_38%),linear-gradient(to_bottom,#fff,#fafafa)] py-14 md:py-24">
          <div className="container mx-auto grid items-center gap-12 px-4 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary">
                <Heart className="h-4 w-4 fill-current" aria-hidden="true" />
                Testimonios · bodas · celebraciones
              </div>
              <h1 className="text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-foreground sm:text-5xl lg:text-6xl">
                Momentos contados por quienes los vivieron
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                Historias de parejas, familias y equipos que reunieron las fotos, vídeos y voces de sus invitados en un solo lugar.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1 text-primary" aria-label="Valoración media de 4,9 sobre 5">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="h-5 w-5 fill-current" aria-hidden="true" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">4,9 sobre 5</span> · Más de 300 historias compartidas
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button className="rounded-full px-6" asChild>
                  <a href="https://acceso.revelao.cam/nuevoeventodemo2" target="_blank" rel="noopener noreferrer">Probar gratis</a>
                </Button>
                <Button variant="outline" className="rounded-full px-6" asChild>
                  <Link to="/">Volver a la landing</Link>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3" aria-hidden="true">
              {heroImages.map((image, index) => (
                <img
                  key={image}
                  src={image}
                  alt=""
                  className={`aspect-[4/3] w-full rounded-[18px] object-cover shadow-lg ${index % 2 ? "translate-y-5" : ""}`}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="py-14 md:py-20" id="testimonios">
          <div className="container mx-auto px-4">
            <div className="flex flex-col gap-6 border-b border-border pb-8 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">312 testimonios</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">Cada evento tiene muchas miradas</h2>
              </div>
              <div className="flex flex-wrap gap-2" aria-label="Filtrar testimonios">
                {categories.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => changeCategory(item)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                      category === item
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-white text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <p className="mt-5 text-sm text-muted-foreground">
              Mostrando {Math.min(visibleCount, filteredTestimonials.length)} de {filteredTestimonials.length} testimonios
            </p>

            <div className="mt-6 grid items-start gap-4 md:grid-cols-2 xl:grid-cols-3">
              {visibleTestimonials.map((testimonial) => (
                <article key={testimonial.id} className="rounded-[18px] border border-border bg-white p-6 shadow-[0_14px_38px_-30px_rgba(15,23,42,0.5)]">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex gap-0.5 text-primary" aria-label={`${testimonial.rating} de 5 estrellas`}>
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star key={index} className={`h-4 w-4 ${index < testimonial.rating ? "fill-current" : "text-border"}`} aria-hidden="true" />
                      ))}
                    </div>
                    <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">{testimonial.category}</span>
                  </div>
                  <h3 className="mt-5 text-xl font-semibold leading-snug tracking-tight text-foreground">“{testimonial.title}”</h3>
                  <p className="mt-3 leading-7 text-muted-foreground">{testimonial.quote}</p>
                  <div className="mt-6 border-t border-border pt-4 text-sm">
                    <p className="font-semibold text-foreground">{testimonial.author}</p>
                    <p className="mt-1 text-muted-foreground">{testimonial.location} · {testimonial.date}</p>
                  </div>
                </article>
              ))}
            </div>

            {visibleCount < filteredTestimonials.length ? (
              <div className="mt-10 flex justify-center">
                <Button variant="outline" className="rounded-full px-6" onClick={() => setVisibleCount((count) => count + 18)}>
                  Ver más testimonios
                  <ChevronDown className="ml-2 h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            ) : null}
          </div>
        </section>

        <section className="bg-neutral-950 py-14 text-white md:py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">Tu evento también merece recordarse entero</h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/65">Crea una prueba gratuita y descubre cómo tus invitados pueden compartir recuerdos sin instalar ninguna app.</p>
            <Button className="mt-8 rounded-full px-7" asChild>
              <a href="https://acceso.revelao.cam/nuevoeventodemo2" target="_blank" rel="noopener noreferrer">Probar gratis</a>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Testimonials;
