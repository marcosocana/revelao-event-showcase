import { ArrowUpRight } from "lucide-react";

export function CaptainsHero({ onDemoOpen }: { onDemoOpen: () => void }) {
  return (
    <>
      <header className="captains-navigation fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-white/95 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-10" aria-label="Navegación de Capitanes">
          <a href="/capitanes" className="shrink-0" aria-label="Ir a Capitanes">
            <img src="/capitanes-logo.svg" alt="Capitanes por Revelao.cam" className="captains-nav-logo h-12 w-auto sm:h-[3.25rem]" />
          </a>
          <div className="hidden items-center gap-7 text-sm text-muted-foreground lg:flex">
            <a href="#como-se-juega">Cómo se juega</a>
            <a href="#retos">Los retos</a>
            <a href="#precios">Precios</a>
            <a href="#boda-real">Una boda real</a>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onDemoOpen} className="captains-top-link captains-top-link-demo">Ver demo</button>
            <a href="#precios" className="captains-top-link captains-top-link-primary">Comprar <ArrowUpRight className="ml-1 hidden h-4 w-4 sm:block" /></a>
          </div>
        </nav>
      </header>
      <section className="captains-new-hero px-4 pb-16 pt-28 sm:px-6 lg:px-10 lg:pt-36" aria-labelledby="captains-title">
        <div className="mx-auto max-w-4xl text-center">
          <h1 id="captains-title" className="captains-title">Vuestra boda.<br />Un juego <span className="text-primary">inolvidable.</span></h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Un capitán por mesa. Retos para romper el hielo, picarse un poco y crear recuerdos entre todos.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <a href="#precios" className="captains-button captains-button-primary">Lo quiero</a>
            <button type="button" onClick={onDemoOpen} className="captains-button captains-button-secondary">Probar demo</button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Desde 4,95 € por mesa · Retos 100% personalizables</p>
        </div>
        <div className="mx-auto mt-12 max-w-2xl">
          <button type="button" onClick={onDemoOpen} className="captains-product-preview" aria-label="Probar la demo de Capitanes">
            <img src="/capitanes-demo-v2.png" alt="Pantalla de bienvenida de la demo de Capitanes" decoding="async" />
          </button>
        </div>
      </section>
    </>
  );
}
