import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Camera, ChevronRight, QrCode, Trophy, Users, Video } from "lucide-react";
import WhatsAppFloating from "@/components/WhatsAppFloating";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";

const demoUrl = "https://acceso.revelao.cam/capitanes/demo-capitanes?embed=1";
const demoOpenUrl = "https://acceso.revelao.cam/capitanes/demo-capitanes";
const demoQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=12&data=${encodeURIComponent(demoOpenUrl)}`;
const contactUrl =
  "https://wa.me/34695834018?text=Hola%21%20Quiero%20saber%20m%C3%A1s%20sobre%20Capitanes%20para%20bodas.";

const steps = [
  {
    title: "Un capitán por mesa",
    text: "Solo entra el capitán. El resto de la mesa juega con él.",
    icon: QrCode,
  },
  {
    title: "Retos a medida",
    text: "Fotos, vídeos, gritos de guerra y preguntas sobre la pareja.",
    icon: Users,
  },
  {
    title: "Pruebas con móvil",
    text: "Haz una foto, graba un baile o cumple la misión que toque.",
    icon: Camera,
  },
  {
    title: "Ranking en directo",
    text: "Cada reto suma puntos y mueve la clasificación de la boda.",
    icon: Trophy,
  },
];

const moments = ["Durante la cena", "En el photocall", "En la pista", "Antes del baile"];
const challengeTypes = [
  {
    title: "Reto foto",
    text: "Hazte una foto con el hermano de la novia, con la mesa más marchosa o con quien tú elijas",
    example: "Foto con el hermano de la novia",
    action: "Subir foto",
    icon: Camera,
  },
  {
    title: "Reto vídeo",
    text: "Grabad un baile, una entrada triunfal o una declaración rápida para los novios",
    example: "Baile de 10 segundos",
    action: "Grabar vídeo",
    icon: Video,
  },
  {
    title: "Pregunta pareja",
    text: "Preguntas personalizables sobre los novios para ver qué mesa les conoce mejor",
    example: "¿Dónde fue su primera cita?",
    action: "Responder",
    icon: Users,
  },
];
const pricePerTable = 3;
const captainBoxPricePerTable = 12.95;
const rankingSnapshots = [
  [
    { table: "Mesa amigos", points: 430 },
    { table: "Mesa familia", points: 390 },
    { table: "Mesa primos", points: 360 },
    { table: "Mesa trabajo", points: 280 },
  ],
  [
    { table: "Mesa familia", points: 465 },
    { table: "Mesa amigos", points: 450 },
    { table: "Mesa primos", points: 405 },
    { table: "Mesa trabajo", points: 330 },
  ],
  [
    { table: "Mesa primos", points: 520 },
    { table: "Mesa familia", points: 490 },
    { table: "Mesa amigos", points: 475 },
    { table: "Mesa trabajo", points: 390 },
  ],
  [
    { table: "Mesa amigos", points: 610 },
    { table: "Mesa primos", points: 575 },
    { table: "Mesa familia", points: 540 },
    { table: "Mesa trabajo", points: 455 },
  ],
];

const CaptainsLanding = () => {
  const [tableCount, setTableCount] = useState(12);
  const [includeCaptainBox, setIncludeCaptainBox] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [rankingStep, setRankingStep] = useState(0);
  const rankingRowRefs = useRef(new Map<string, HTMLDivElement>());
  const previousRankingPositions = useRef(new Map<string, number>());
  const normalizedTableCount = Math.max(1, tableCount || 1);
  const gameTotal = useMemo(() => normalizedTableCount * pricePerTable, [normalizedTableCount]);
  const captainBoxTotal = useMemo(
    () => (includeCaptainBox ? normalizedTableCount * captainBoxPricePerTable : 0),
    [includeCaptainBox, normalizedTableCount],
  );
  const totalPrice = useMemo(() => gameTotal + captainBoxTotal, [captainBoxTotal, gameTotal]);
  const formattedTotalPrice = useMemo(
    () =>
      new Intl.NumberFormat("es-ES", {
        minimumFractionDigits: Number.isInteger(totalPrice) ? 0 : 2,
        maximumFractionDigits: 2,
      }).format(totalPrice),
    [totalPrice],
  );
  const currentRanking = rankingSnapshots[rankingStep];

  useEffect(() => {
    document.title = "Capitanes by Revelao | Juego para bodas con retos por mesas";
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      captureRankingPositions();
      setRankingStep((current) => (current + 1) % rankingSnapshots.length);
    }, 3000);

    return () => window.clearInterval(interval);
  }, []);

  useLayoutEffect(() => {
    const nextPositions = new Map<string, number>();

    currentRanking.forEach((row) => {
      const element = rankingRowRefs.current.get(row.table);
      if (!element) return;

      const nextTop = element.getBoundingClientRect().top;
      const previousTop = previousRankingPositions.current.get(row.table);
      nextPositions.set(row.table, nextTop);

      if (previousTop === undefined) return;

      const delta = previousTop - nextTop;
      if (Math.abs(delta) < 1) return;

      element.style.transition = "none";
      element.style.transform = `translateY(${delta}px)`;
      element.style.zIndex = "2";

      window.requestAnimationFrame(() => {
        element.style.transition = "transform 680ms cubic-bezier(0.2, 0.9, 0.2, 1), background-color 260ms ease";
        element.style.transform = "translateY(0)";

        window.setTimeout(() => {
          element.style.zIndex = "";
        }, 700);
      });
    });

    previousRankingPositions.current = nextPositions;
  }, [currentRanking]);

  const captureRankingPositions = () => {
    const positions = new Map<string, number>();

    rankingRowRefs.current.forEach((element, table) => {
      positions.set(table, element.getBoundingClientRect().top);
    });

    previousRankingPositions.current = positions;
  };

  const handleDemoOpen = () => {
    if (window.matchMedia("(max-width: 767px)").matches) {
      window.location.href = demoOpenUrl;
      return;
    }

    setIsDemoModalOpen(true);
  };

  return (
    <main className="captains-page min-h-screen overflow-hidden bg-white text-[#151515]">
      <section className="captains-hero bg-white px-4 pb-6 pt-28 sm:px-6 sm:pt-32 lg:px-10">
        <header className="fixed left-0 right-0 top-0 z-50 bg-white px-4 py-3 sm:px-6 lg:px-10">
          <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <a href="/" className="captains-logo-link" aria-label="Volver a Revelao">
              <img src="/capitanes-logo.svg" alt="Capitanes por Revelao.cam" className="h-14 w-auto sm:h-16" />
            </a>
            <div className="flex items-center gap-2 sm:gap-3">
              <button type="button" className="captains-top-link" onClick={handleDemoOpen}>
                Ver demo
              </button>
              <a className="captains-top-link captains-top-link-primary" href="#precios">
                Comprar
              </a>
            </div>
          </nav>
        </header>

        <div className="mx-auto grid max-w-7xl gap-10 pb-14 pt-6 lg:grid-cols-[0.94fr_0.86fr] lg:items-center lg:pb-20 lg:pt-8">
          <div className="max-w-3xl">
            <p className="captains-kicker">El juego más divertido para bodas</p>
            <h1 className="captains-title mt-5 text-[clamp(3rem,8vw,6.8rem)] leading-[0.9]">
              Convierte tu boda en un juego
            </h1>
            <p className="mt-6 max-w-xl text-xl font-bold leading-7 text-[#151515]/72 sm:text-2xl sm:leading-8">
              Cada mesa tiene un capitán. Solo él entra al juego, lidera a su equipo y supera retos 100%
              personalizables
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a className="captains-button captains-button-primary" href={contactUrl} target="_blank" rel="noopener noreferrer">
                Pedir para mi boda <ChevronRight className="h-5 w-5" />
              </a>
              <button type="button" className="captains-button captains-button-secondary" onClick={handleDemoOpen}>
                Abrir demo
              </button>
            </div>
          </div>

          <div className="captains-demo-wrap">
            <div className="captains-demo-phone" aria-label="Demo de Capitanes en móvil">
              <iframe
                title="Demo Capitanes by Revelao"
                src={demoUrl}
                loading="lazy"
                allow="camera; fullscreen; clipboard-write"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f3ec] px-4 py-12 text-[#151515] sm:px-6 lg:px-10 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="captains-section-label">Cómo se juega</p>
            <h2 className="captains-heading mt-3">Retos para que cada mesa se pique</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {steps.map((step) => (
              <article className="captains-panel" key={step.title}>
                <step.icon className="h-7 w-7" />
                <h3 className="mt-4 text-2xl font-black">{step.title}</h3>
                <p className="mt-2 text-base font-bold leading-6 text-[#151515]/68">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-12 text-[#151515] sm:px-6 lg:px-10 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div className="captains-arcade-screen">
            <div className="flex items-center justify-between border-b-4 border-[#151515] bg-[#ff5f63] px-4 py-3 text-white">
              <span className="font-black uppercase">Ranking boda</span>
              <span className="font-black">08:42</span>
            </div>
            <div className="space-y-3 p-4">
              {currentRanking.map((row, index) => (
                <div
                  className="captains-ranking-row"
                  key={row.table}
                  ref={(element) => {
                    if (element) {
                      rankingRowRefs.current.set(row.table, element);
                    } else {
                      rankingRowRefs.current.delete(row.table);
                    }
                  }}
                >
                  <span>#{index + 1}</span>
                  <span>{row.table}</span>
                  <span>{row.points} pts</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="captains-section-label">Momentos</p>
            <h2 className="captains-heading mt-3">Jugad donde queráis, cuando queráis</h2>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {moments.map((moment, index) => {
                const Icon = index % 2 === 0 ? Camera : Video;
                return (
                  <div className="captains-mini-tile" key={moment}>
                    <Icon className="h-5 w-5" />
                    <span>{moment}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-12 text-[#151515] sm:px-6 lg:px-10 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="captains-section-label">Tipos de retos</p>
            <h2 className="captains-heading mt-3">Todo se puede personalizar para vuestra boda</h2>
            <p className="mt-4 text-lg font-bold leading-7 text-[#151515]/70">
              Mezcla retos de foto, vídeo y preguntas sobre la pareja. Tú decides qué tiene que hacer cada mesa y
              cuándo aparece cada prueba
            </p>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {challengeTypes.map((challenge) => (
              <article className="captains-challenge-type" key={challenge.title}>
                <div className="captains-game-shot" aria-label={`Imagen del juego: ${challenge.title}`}>
                  <div className="captains-game-shot-top">
                    <span>Mesa 7</span>
                    <strong>+50 pts</strong>
                  </div>
                  <div className="captains-game-shot-body">
                    <challenge.icon className="h-9 w-9" />
                    <p>{challenge.example}</p>
                  </div>
                  <div className="captains-game-shot-button">{challenge.action}</div>
                </div>
                <h3 className="mt-5 text-2xl font-black">{challenge.title}</h3>
                <p className="mt-2 text-base font-bold leading-6 text-[#151515]/68">{challenge.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f3ec] px-4 py-12 text-[#151515] sm:px-6 lg:px-10 lg:py-16" id="precios">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div className="max-w-xl">
            <p className="captains-section-label">Precios</p>
            <h2 className="captains-heading mt-3">Juego desde 3€ por mesa</h2>
            <p className="mt-4 text-lg font-bold leading-7 text-[#151515]/70">
              Compra solo el juego o añade la Caja Capitán como extra. Recibirás un enlace por email para personalizar
              retos, preguntas sobre la pareja y pruebas para cada mesa
            </p>
          </div>

          <div className="captains-pricing-panel">
            <div>
              <label htmlFor="captains-table-count" className="block text-sm font-black uppercase tracking-[0.08em]">
                Número de mesas
              </label>
              <div className="mt-3 flex items-center gap-3">
                <input
                  id="captains-table-count"
                  type="number"
                  min="1"
                  inputMode="numeric"
                  value={tableCount}
                  onChange={(event) => setTableCount(Math.max(1, Number(event.target.value) || 1))}
                  className="captains-pricing-input"
                />
                <span className="text-lg font-black">x {pricePerTable}€ juego</span>
              </div>
            </div>

            <label className="captains-addon-row">
              <input
                type="checkbox"
                checked={includeCaptainBox}
                onChange={(event) => setIncludeCaptainBox(event.target.checked)}
              />
              <span>
                <strong>Añadir Caja Capitán</strong>
                <small>{captainBoxPricePerTable.toLocaleString("es-ES")}€ por mesa con gafas, tarjeta QR y brazalete</small>
              </span>
            </label>

            <div className="captains-price-lines">
              <span>Juego: {gameTotal.toLocaleString("es-ES")}€</span>
              <span>Caja Capitán: {captainBoxTotal.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€</span>
            </div>

            <div className="captains-price-total">
              <span>Total</span>
              <strong>{formattedTotalPrice}€</strong>
            </div>

            <div className="grid gap-3 text-sm font-bold text-[#151515]/70 sm:grid-cols-3">
              <span>Hasta 25 retos</span>
              <span>Preguntas sobre la pareja</span>
              <span>Enlace por email</span>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a className="captains-button captains-button-primary" href="https://stripe.com" target="_blank" rel="noopener noreferrer">
                Comprar
              </a>
              <a className="captains-button captains-button-secondary" href={contactUrl} target="_blank" rel="noopener noreferrer">
                Ayuda por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-12 text-[#151515] sm:px-6 lg:px-10 lg:py-16">
        <div className="captains-pack-card mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.78fr_1fr] lg:items-center">
          <div className="captains-pack-image overflow-hidden bg-white">
            <img
              src="/capitanes-pack.png"
              alt="Pack Capitán con caja, gafas, tarjeta QR personalizada y brazalete"
              className="block aspect-[4/3] w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>

          <div className="captains-pack-panel">
            <p className="captains-section-label">Pack Capitán</p>
            <h2 className="captains-heading mt-3">Despreocúpate de todo</h2>
            <p className="mt-4 text-lg font-bold leading-7 text-[#151515]/70">
              La Caja Capitán es un extra opcional para que cada mesa reciba sus gafas personalizadas, su tarjeta QR y
              su brazalete de capitán
            </p>
            <ul className="mt-6 grid gap-3 text-base font-black">
              <li>Gafas de sol personalizadas</li>
              <li>Tarjeta con QR personalizada para tu boda</li>
              <li>Brazalete de capitán</li>
            </ul>
            <a className="captains-button captains-button-primary mt-7" href="https://stripe.com" target="_blank" rel="noopener noreferrer">
              Añadir Caja Capitán
            </a>
          </div>
        </div>
      </section>

      <section className="bg-[#151515] px-4 py-14 text-white sm:px-6 lg:px-10 lg:py-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="captains-section-label captains-section-label-dark">Capitanes</p>
            <h2 className="captains-heading mt-3">Una excusa para llenar la boda de recuerdos reales</h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a className="captains-button captains-button-light" href={contactUrl} target="_blank" rel="noopener noreferrer">
              Hablar por WhatsApp
            </a>
            <button type="button" className="captains-button captains-button-dark-outline" onClick={handleDemoOpen}>
              Ver demo
            </button>
          </div>
        </div>
      </section>
      <section className="bg-white px-4 py-10 text-[#151515] sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 border-t-4 border-[#151515] pt-8 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p className="text-lg font-black leading-6">
            Este es un producto de Revelao.cam hecho con amor.
          </p>
          <a className="captains-button captains-button-secondary" href="/" aria-label="Acceder a la web de Revelao">
            Acceder a Revelao
          </a>
        </div>
      </section>
      <Dialog open={isDemoModalOpen} onOpenChange={setIsDemoModalOpen}>
        <DialogContent className="captains-demo-modal max-h-[92dvh] max-w-[94vw] overflow-y-auto border-4 border-[#151515] bg-white p-5 shadow-none sm:rounded-none lg:max-w-5xl">
          <DialogHeader className="sr-only">
            <DialogTitle>Demo de Capitanes</DialogTitle>
            <DialogDescription>Prueba la demo de Capitanes desde un mockup de móvil o con un QR.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-7 lg:grid-cols-[360px_1fr] lg:items-center">
            <div className="captains-demo-wrap">
              <div className="captains-demo-phone captains-demo-phone-modal" aria-label="Demo de Capitanes en móvil">
                <iframe
                  title="Demo Capitanes by Revelao"
                  src={demoUrl}
                  loading="lazy"
                  allow="camera; fullscreen; clipboard-write"
                />
              </div>
            </div>

            <div className="captains-demo-qr-panel">
              <img src={demoQrUrl} alt="Código QR para probar Capitanes desde el móvil" className="captains-demo-qr" />
              <p>También puedes probarlo directamente desde tu movil leyendo este código QR.</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <WhatsAppFloating message="Hola! Quiero saber más sobre Capitanes para mi boda." />
    </main>
  );
};

export default CaptainsLanding;
