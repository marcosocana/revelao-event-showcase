import { ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const copy = {
  es: {
    title: "Otros productos de Revelao",
    description: "Dos experiencias creadas para convertir vuestra boda en un recuerdo todavía más especial.",
    captains: {
      title: "Capitanes",
      description: "Retos, pruebas y un ranking en directo para que cada mesa compita, participe y llene la boda de momentos inolvidables.",
      cta: "Descubrir Capitanes",
      badge: "Nuevo diseño",
      screensAlt: ["Elige tu capitán de mesa", "Ranking en directo de las mesas", "Reto de la mesa"],
    },
    carreteo: {
      title: "Carreteo",
      description: "Una cámara desechable en el móvil de cada invitado: 25 fotos por carrete y todas se revelan juntas cuando termina la fiesta.",
      cta: "Descubrir Carreteo",
    },
  },
  en: {
    title: "Other products by Revelao",
    description: "Two experiences designed to make your wedding an even more memorable celebration.",
    captains: {
      title: "Captains",
      description: "Challenges, games and a live ranking that get every table competing, participating and creating unforgettable moments.",
      cta: "Discover Captains",
      badge: "New design",
      screensAlt: ["Choose your table captain", "Live table ranking", "Table challenge"],
    },
    carreteo: {
      title: "Carreteo",
      description: "A disposable camera on every guest's phone: 25 shots per roll, all revealed together when the party is over.",
      cta: "Discover Carreteo",
    },
  },
  it: {
    title: "Altri prodotti Revelao",
    description: "Due esperienze create per rendere il vostro matrimonio ancora più speciale e memorabile.",
    captains: {
      title: "Capitanes",
      description: "Sfide, giochi e una classifica in diretta per coinvolgere ogni tavolo e riempire il matrimonio di momenti indimenticabili.",
      cta: "Scopri Capitanes",
      badge: "Nuovo design",
      screensAlt: ["Scegli il capitano del tavolo", "Classifica dei tavoli in diretta", "Sfida del tavolo"],
    },
    carreteo: {
      title: "Carreteo",
      description: "Una macchina usa e getta sul telefono di ogni invitato: 25 foto per rullino, svelate tutte insieme a fine festa.",
      cta: "Scopri Carreteo",
    },
  },
} as const;

// Pantallas reales del juego Capitanes (diseño v2), capturadas de la demo de acceso.revelao.cam.
const captainScreens = [
  { src: "/capitanes-v2-capitan.jpg", className: "left-[6%] z-0 translate-y-[18%] -rotate-[8deg] group-hover:-rotate-[11deg] group-hover:translate-y-[14%]" },
  { src: "/capitanes-v2-ranking.jpg", className: "left-1/2 z-10 w-[36%] max-w-[176px] -translate-x-1/2 translate-y-[6%] group-hover:translate-y-[2%]" },
  { src: "/capitanes-v2-reto.jpg", className: "right-[6%] z-0 translate-y-[18%] rotate-[8deg] group-hover:rotate-[11deg] group-hover:translate-y-[14%]" },
];

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

        <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-2 md:gap-7">
          <article className="group flex min-h-[430px] flex-col overflow-hidden rounded-[24px] border border-black/10 bg-white shadow-[0_20px_55px_-38px_rgba(0,0,0,0.45)]">
            <div className="relative h-72 overflow-hidden bg-[radial-gradient(120%_90%_at_50%_100%,#f06a5f_0%,#f6a39a_45%,#fbe9e6_100%)] sm:h-80">
              <span className="absolute left-5 top-5 z-10 inline-flex items-center gap-1.5 rounded-full bg-[#e9ff2a] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#151515] shadow-sm">
                <span className="grid h-4 w-4 place-items-center rounded-[4px] bg-[#151515] text-[9px] font-black text-[#e9ff2a]">C</span>
                {content.captains.badge}
              </span>
              {captainScreens.map((screen, index) => (
                <div
                  key={screen.src}
                  className={`absolute bottom-0 w-[31%] max-w-[150px] rounded-t-[20px] bg-[#151515] p-[5px] pb-0 shadow-[0_24px_45px_-18px_rgba(80,20,15,0.6)] transition-transform duration-500 ${screen.className}`}
                >
                  <img
                    src={screen.src}
                    alt={content.captains.screensAlt[index]}
                    className="block aspect-[390/600] w-full rounded-t-[16px] object-cover object-top"
                    loading="lazy"
                  />
                </div>
              ))}
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
            <div className="relative flex h-72 items-center justify-center overflow-hidden bg-[radial-gradient(120%_90%_at_50%_100%,#3a3b40_0%,#25262a_60%)] px-6 sm:h-80 sm:px-10">
              <div className="w-full max-w-[420px] -rotate-3 rounded-[22px] bg-[#0b0b0c] p-1.5 shadow-[0_24px_50px_-20px_rgba(0,0,0,0.8)] ring-1 ring-white/15 transition-transform duration-500 group-hover:rotate-0 group-hover:scale-[1.03]">
                <img
                  src="/carreteo/camara-lista.jpg"
                  alt="Cámara desechable digital Carreteo en un móvil, lista para disparar"
                  className="block aspect-[2532/1170] w-full rounded-[17px] object-cover"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="flex flex-1 flex-col p-6 sm:p-8">
              <h3 className="text-3xl font-bold tracking-tight">{content.carreteo.title}</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{content.carreteo.description}</p>
              <a href="/carreteo" className="mt-7 inline-flex w-fit items-center gap-2 font-semibold text-foreground transition-colors hover:text-primary">
                {content.carreteo.cta} <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};
