import { ArrowRight, Clock3 } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const copy = {
  es: {
    title: "Otros productos de Revelao",
    description: "Dos experiencias creadas para convertir vuestra boda en un recuerdo todavía más especial.",
    captains: {
      title: "Capitanes",
      description: "Retos, pruebas y un ranking en directo para que cada mesa compita, participe y llene la boda de momentos inolvidables.",
      cta: "Descubrir Capitanes",
    },
    capsule: {
      title: "Cápsula del tiempo",
      description: "Los invitados graban vídeos durante la boda y vosotros los descubrís juntos años después, en la fecha que elijáis.",
      cta: "Descubrir la cápsula",
    },
  },
  en: {
    title: "Other products by Revelao",
    description: "Two experiences designed to make your wedding an even more memorable celebration.",
    captains: {
      title: "Captains",
      description: "Challenges, games and a live ranking that get every table competing, participating and creating unforgettable moments.",
      cta: "Discover Captains",
    },
    capsule: {
      title: "Time capsule",
      description: "Guests record videos during the wedding and you discover them together years later, on the date you choose.",
      cta: "Discover the capsule",
    },
  },
  it: {
    title: "Altri prodotti Revelao",
    description: "Due esperienze create per rendere il vostro matrimonio ancora più speciale e memorabile.",
    captains: {
      title: "Capitanes",
      description: "Sfide, giochi e una classifica in diretta per coinvolgere ogni tavolo e riempire il matrimonio di momenti indimenticabili.",
      cta: "Scopri Capitanes",
    },
    capsule: {
      title: "Capsula del tempo",
      description: "Gli invitati registrano video durante il matrimonio e voi li scoprite insieme anni dopo, nella data che scegliete.",
      cta: "Scopri la capsula",
    },
  },
} as const;

export const OtherProducts = () => {
  const { lang } = useI18n();
  const content = copy[lang];

  return (
    <section className="bg-[#f7f3ec] px-4 py-14 text-[#151515] md:px-6 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-9 max-w-2xl text-center md:mb-12">
          <h2 className="revelao-h2">{content.title}</h2>
          <p className="revelao-h3 mt-4">{content.description}</p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 md:gap-7">
          <article className="group flex min-h-[430px] flex-col overflow-hidden rounded-[24px] border border-black/10 bg-white shadow-[0_20px_55px_-38px_rgba(0,0,0,0.45)]">
            <div className="relative flex h-52 items-center justify-center overflow-hidden bg-[#f4d36f] px-8 sm:h-60">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(21,21,21,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(21,21,21,0.08)_1px,transparent_1px)] bg-[size:22px_22px]" />
              <img
                src="/capitanes-hero.png"
                alt="Juego por mesas Capitanes de Revelao"
                className="relative h-[88%] w-auto max-w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                loading="lazy"
              />
            </div>
            <div className="flex flex-1 flex-col p-6 sm:p-8">
              <h3 className="text-3xl font-bold tracking-tight">{content.captains.title}</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{content.captains.description}</p>
              <a href="/capitanes" className="mt-7 inline-flex w-fit items-center gap-2 font-semibold text-foreground transition-colors hover:text-primary">
                {content.captains.cta} <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </article>

          <article className="group flex min-h-[430px] flex-col overflow-hidden rounded-[24px] border border-black/10 bg-white shadow-[0_20px_55px_-38px_rgba(0,0,0,0.45)]">
            <div className="relative h-52 overflow-hidden bg-[#ead8d0] sm:h-60">
              <img
                src="/time-capsule-cover.jpg"
                alt="Cápsula del tiempo para guardar mensajes en vídeo de una boda"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
              <span className="absolute bottom-5 left-5 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-primary shadow-lg backdrop-blur">
                <Clock3 className="h-5 w-5" />
              </span>
            </div>
            <div className="flex flex-1 flex-col p-6 sm:p-8">
              <h3 className="text-3xl font-bold tracking-tight">{content.capsule.title}</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{content.capsule.description}</p>
              <a href="/capsuladeltiempo" className="mt-7 inline-flex w-fit items-center gap-2 font-semibold text-foreground transition-colors hover:text-primary">
                {content.capsule.cta} <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};
