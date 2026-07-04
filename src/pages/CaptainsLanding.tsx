import { useEffect, useMemo, useState } from "react";
import { Camera, ChevronRight, QrCode, Trophy, Users, Video } from "lucide-react";
import WhatsAppFloating from "@/components/WhatsAppFloating";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const demoUrl = "https://acceso.revelao.cam/capitanes/demo-capitanes?embed=1";
const demoOpenUrl = "https://acceso.revelao.cam/capitanes/demo-capitanes";
const demoQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=12&data=${encodeURIComponent(demoOpenUrl)}`;
const contactUrl =
  "https://wa.me/34695834018?text=Hola%21%20Quiero%20saber%20m%C3%A1s%20sobre%20Capitanes%20para%20bodas.";

const steps = [
  {
    title: "Mesas",
    text: "Cada mesa entra con el QR de la boda.",
    icon: QrCode,
  },
  {
    title: "Capitán",
    text: "Un invitado lidera los retos de su equipo.",
    icon: Users,
  },
  {
    title: "Pruebas",
    text: "Fotos y vídeos guardan la fiesta desde dentro.",
    icon: Camera,
  },
  {
    title: "Ranking",
    text: "La competición mantiene viva la cena y la pista.",
    icon: Trophy,
  },
];

const moments = ["Durante la cena", "En el photocall", "En la pista", "Antes del baile"];
const pricePerTable = 3;

const CaptainsLanding = () => {
  const [tableCount, setTableCount] = useState(12);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const totalPrice = useMemo(() => Math.max(1, tableCount || 1) * pricePerTable, [tableCount]);

  useEffect(() => {
    document.title = "Capitanes by Revelao | Juego para bodas con retos por mesas";
  }, []);

  const handleDemoOpen = () => {
    if (window.matchMedia("(max-width: 767px)").matches) {
      window.location.href = demoOpenUrl;
      return;
    }

    setIsDemoModalOpen(true);
  };

  return (
    <main className="captains-page min-h-screen overflow-hidden bg-white text-[#151515]">
      <section className="captains-hero bg-white px-4 py-6 sm:px-6 lg:px-10">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <a href="/" className="captains-logo-link" aria-label="Volver a Revelao">
            <img src="/capitanes-logo.svg" alt="Capitanes por Revelao.cam" className="h-14 w-auto sm:h-16" />
          </a>
          <button type="button" className="captains-top-link" onClick={handleDemoOpen}>
            Demo
          </button>
        </nav>

        <div className="mx-auto grid max-w-7xl gap-10 pb-14 pt-10 lg:grid-cols-[0.94fr_0.86fr] lg:items-center lg:pb-20 lg:pt-14">
          <div className="max-w-3xl">
            <p className="captains-kicker">Juego para bodas</p>
            <h1 className="captains-title mt-5 text-[clamp(3rem,8vw,6.8rem)] leading-[0.9]">
              Convierte cada mesa en un equipo.
            </h1>
            <p className="mt-6 max-w-xl text-xl font-bold leading-7 text-[#151515]/72 sm:text-2xl sm:leading-8">
              Capitanes es una dinámica con QR para bodas: retos por mesas, pruebas con fotos y vídeos, y ranking en
              directo.
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
            <h2 className="captains-heading mt-3">QR, capitán y retos durante la boda.</h2>
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
              {["Mesa amigos", "Mesa familia", "Mesa primos", "Mesa trabajo"].map((table, index) => (
                <div className="captains-ranking-row" key={table}>
                  <span>#{index + 1}</span>
                  <span>{table}</span>
                  <span>{[430, 390, 360, 280][index]} pts</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="captains-section-label">Momentos</p>
            <h2 className="captains-heading mt-3">La boda se juega sin cortar el ritmo.</h2>
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

      <section className="bg-[#f7f3ec] px-4 py-12 text-[#151515] sm:px-6 lg:px-10 lg:py-16" id="precios">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div className="max-w-xl">
            <p className="captains-section-label">Precios</p>
            <h2 className="captains-heading mt-3">3€ por mesa.</h2>
            <p className="mt-4 text-lg font-bold leading-7 text-[#151515]/70">
              Incluye hasta 25 retos personalizables al 100%. Tras la compra recibirás por email un enlace para crear y
              ajustar todo a tu boda.
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
                <span className="text-lg font-black">x {pricePerTable}€</span>
              </div>
            </div>

            <div className="captains-price-total">
              <span>Total</span>
              <strong>{totalPrice}€</strong>
            </div>

            <div className="grid gap-3 text-sm font-bold text-[#151515]/70 sm:grid-cols-3">
              <span>Hasta 25 retos</span>
              <span>100% personalizable</span>
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

      <section className="bg-[#151515] px-4 py-14 text-white sm:px-6 lg:px-10 lg:py-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="captains-section-label captains-section-label-dark">Capitanes</p>
            <h2 className="captains-heading mt-3">Una excusa para llenar la boda de recuerdos reales.</h2>
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
