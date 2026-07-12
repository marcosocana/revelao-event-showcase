import { ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const copy = {
  es: {
    badge: "Nuevo producto de Revelao",
    title: "¿Buscas algo para dinamizar a tus capitanes de mesa?",
    description:
      "Descubre Capitanes: retos, pruebas y un ranking en directo para convertir cada mesa en un equipo y llenar vuestra boda de recuerdos.",
    price: "Solo desde 3 € por mesa",
    cta: "Descubrir Capitanes",
  },
  en: {
    badge: "A new product by Revelao",
    title: "Looking for a way to engage your table captains?",
    description:
      "Discover Captains: challenges, games and a live ranking that turn every table into a team and fill your wedding with memories.",
    price: "From just €3 per table",
    cta: "Discover Captains",
  },
  it: {
    badge: "Un nuovo prodotto Revelao",
    title: "Cerchi un modo per coinvolgere i capitani dei tavoli?",
    description:
      "Scopri Capitanes: sfide, giochi e una classifica in diretta per trasformare ogni tavolo in una squadra e riempire il matrimonio di ricordi.",
    price: "A partire da soli 3 € per tavolo",
    cta: "Scopri Capitanes",
  },
} as const;

export const CaptainsPromo = () => {
  const { lang } = useI18n();
  const content = copy[lang];

  return (
    <section className="bg-[#f7f3ec] px-4 py-12 text-[#151515] md:px-6 md:py-20">
      <div className="mx-auto max-w-6xl border-4 border-[#151515] bg-white shadow-[10px_10px_0_#151515]">
        <div className="grid items-center gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_auto] lg:p-12">
          <div>
            <div className="mb-7 flex flex-wrap items-center gap-4">
              <span className="border-2 border-[#151515] bg-[#f4d36f] px-3 py-2 text-xs font-black uppercase tracking-[0.12em] sm:text-sm">
                {content.badge}
              </span>
              <img src="/capitanes-logo.svg" alt="Capitanes por Revelao.cam" className="h-12 w-auto sm:h-14" />
            </div>

            <h2 className="max-w-4xl text-4xl font-black leading-[0.95] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              {content.title}
            </h2>
            <p className="mt-6 max-w-3xl text-lg font-bold leading-7 text-[#151515]/70">
              {content.description}
            </p>
            <p className="mt-5 inline-block border-2 border-[#151515] bg-[#f4d36f] px-4 py-2 text-xl font-black">
              {content.price}
            </p>
          </div>
          <div className="lg:self-end">
            <a
              href="/capitanes"
              className="inline-flex min-h-14 w-fit items-center justify-center gap-3 border-4 border-[#151515] bg-[#ff5f63] px-6 py-3 text-lg font-black text-white transition-transform hover:-translate-y-1"
            >
              {content.cta}
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
