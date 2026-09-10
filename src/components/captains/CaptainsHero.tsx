import { ArrowUpRight, Camera, ChevronRight, Play, Trophy } from "lucide-react";
import logo from "@/assets/logo-mini.png";

export function CaptainsHero({ onDemoOpen }: { onDemoOpen: () => void }) {
  return (
    <>
      <header className="captains-navigation fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-white/95 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-10" aria-label="Navegación de Capitanes">
          <a href="/" className="flex items-center gap-3" aria-label="Ir a Revelao.cam">
            <img src={logo} alt="Revelao.cam" className="h-8 w-auto" />
            <span className="border-l border-border pl-3 text-sm font-semibold">Capitanes</span>
          </a>
          <div className="hidden items-center gap-7 text-sm text-muted-foreground lg:flex">
            <a href="#como-se-juega">Cómo se juega</a>
            <a href="#retos">Los retos</a>
            <a href="#precios">Precios</a>
            <a href="#boda-real">Una boda real</a>
          </div>
          <a href="#precios" className="captains-top-link captains-top-link-primary">Comprar <ArrowUpRight className="ml-1 h-4 w-4" /></a>
        </nav>
      </header>
      <section className="captains-new-hero px-4 pb-16 pt-28 sm:px-6 lg:px-10 lg:pt-36" aria-labelledby="captains-title">
        <div className="mx-auto max-w-4xl text-center">
          <p className="captains-kicker"><span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-primary" /> Capitanes, por Revelao.cam</p>
          <h1 id="captains-title" className="captains-title mt-5">Vuestra boda.<br />Un juego <span className="text-primary">inolvidable.</span></h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Un capitán por mesa. Retos para romper el hielo, picarse un poco y crear recuerdos entre todos.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <a href="#precios" className="captains-button captains-button-primary">Quiero jugar en mi boda <ChevronRight className="h-4 w-4" /></a>
            <button type="button" onClick={onDemoOpen} className="captains-button captains-button-secondary"><Play className="h-4 w-4" /> Probar la demo</button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Desde 4,95 € por mesa · Retos 100% personalizables</p>
        </div>
        <div className="captains-memory-grid mx-auto mt-12 max-w-7xl">
          <figure className="captains-memory-photo">
            <img src="/capitanes-andrea-rafa-manos-arriba.jpg" alt="Invitados de Andrea y Rafa superando el reto de manos arriba" fetchPriority="high" />
            <figcaption><Camera className="h-4 w-4" /> Una mesa. Mil anécdotas.</figcaption>
          </figure>
          <button type="button" onClick={onDemoOpen} className="captains-product-preview" aria-label="Probar la demo de Capitanes">
            <span className="text-sm font-semibold text-muted-foreground">Así empieza el juego</span>
            <img src="/capitanes-hero.png" alt="Pantallas del juego Capitanes con los retos y la clasificación" decoding="async" />
            <span className="inline-flex items-center gap-2 text-sm font-semibold">Descubre la experiencia <ArrowUpRight className="h-4 w-4" /></span>
          </button>
          <figure className="captains-memory-photo">
            <img src="/capitanes-andrea-rafa-foto-novios.jpg" alt="Una mesa posa con los novios durante el juego" decoding="async" />
            <figcaption><Trophy className="h-4 w-4" /> El mejor premio: vivirlo juntos.</figcaption>
          </figure>
        </div>
      </section>
    </>
  );
}
