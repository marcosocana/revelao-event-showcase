import { useEffect } from "react";
import { ArrowRight, Camera, Check, Download, Images, QrCode, Sparkles } from "lucide-react";
import { Footer } from "@/components/Footer";
import { PageSeo } from "@/components/PageSeo";
import icon from "@/assets/ico.png";

const createUrl = "https://acceso.revelao.cam/admin/photostrip/new";

const steps = [
  ["01", "Creas el evento", "Personaliza el nombre, las fechas y el acabado de la tira."],
  ["02", "Compartes el QR", "Los invitados entran al fotomatón desde su propio móvil."],
  ["03", "Posan una sola vez", "Una cuenta atrás captura cuatro fotos de forma automática."],
  ["04", "Se revela la tira", "Pueden descargarla y verla en el mural común del evento."],
];

const faqs = [
  ["¿Hace falta descargar una app?", "No. Photostrip funciona directamente en el navegador del móvil al escanear el QR."],
  ["¿Cuántas fotos hace cada invitado?", "Cada participación crea una tira con cuatro fotografías. La captura es automática después de pulsar Start."],
  ["¿Se puede elegir color o blanco y negro?", "Sí. Puedes permitir color, blanco y negro o dejar que cada invitado elija antes de empezar."],
  ["¿Dónde se guardan las tiras?", "Cada persona descarga la suya y las tiras terminadas aparecen en la galería compartida del evento, según la privacidad que configures."],
  ["¿Los invitados pueden repetir sin límite?", "No. Cada navegador dispone de una única participación por evento, evitando repeticiones accidentales y manteniendo la experiencia ágil."],
];

const MiniStrip = ({ rotate = "-rotate-2", compact = false }: { rotate?: string; compact?: boolean }) => (
  <div className={`${rotate} mx-auto w-full max-w-[170px] border border-black/15 bg-[#fffdf6] p-2 shadow-[7px_9px_0_rgba(32,25,20,.18)] sm:max-w-[190px]`}>
    <div className="space-y-2">
      {["bg-[#cc7668]", "bg-[#d7b86c]", "bg-[#719188]", "bg-[#78686f]"].map((color, index) => (
        <div key={color} className={`relative aspect-[4/3] overflow-hidden ${color}`}>
          <span className={`absolute rounded-full bg-[#f3d0b7] ${compact ? "left-[37%] top-[18%] h-8 w-8" : "left-[35%] top-[16%] h-10 w-10"}`} />
          <span className="absolute bottom-0 left-[24%] h-[48%] w-[52%] rounded-t-full bg-[#302823]" />
          <span className="absolute left-2 top-2 font-mono text-[8px] font-bold text-white/80">0{index + 1}</span>
        </div>
      ))}
    </div>
    <div className="px-1 pb-1 pt-4 text-center text-[#241c18]">
      <p className="font-serif text-sm font-black uppercase leading-none">Laura & Miguel</p>
      <p className="mt-1 font-mono text-[7px] font-bold tracking-[.16em]">PHOTOSTRIP · REVELAO</p>
    </div>
  </div>
);

const BoothIllustration = () => (
  <div className="relative mx-auto w-full max-w-[420px] px-3 pb-8 pt-3" aria-label="Ilustración de un fotomatón Photostrip">
    <div className="relative h-[550px] border-[4px] border-[#241c18] bg-[#eee2ca] p-5 pt-20 shadow-[9px_10px_0_#241c18] [clip-path:polygon(1%_0,99%_1%,100%_99%,2%_100%,0_53%)] sm:h-[610px] sm:p-7 sm:pt-24">
      <div className="absolute left-5 top-5 h-12 w-12 rounded-full border-[5px] border-double border-[#241c18] bg-[radial-gradient(circle,#171412_0_22%,#756c60_24%_38%,#171412_40%)]" />
      <p className="absolute left-1/2 top-7 -translate-x-1/2 -rotate-2 font-mono text-[11px] font-black tracking-[.17em]">PHOTO BOOTH</p>
      <span className="absolute right-6 top-7 h-4 w-4 rounded-full border-2 border-[#241c18] bg-[#e7675d]" />
      <div className="grid h-full place-items-center overflow-hidden border-[3px] border-[#241c18] bg-[#fffdf6] px-6 shadow-inner">
        <div className="w-full text-center">
          <p className="font-mono text-[10px] font-black tracking-[.2em] text-[#9d3933]">MIRA A CÁMARA</p>
          <p className="mt-4 font-serif text-6xl font-black">3</p>
          <div className="mx-auto mt-5 grid max-w-[250px] grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((number) => <span key={number} className={`grid aspect-square place-items-center border-2 border-[#241c18] font-mono text-xs font-black ${number === 1 ? "bg-[#e6675c] text-white" : "bg-[#efe5d0]"}`}>{number}</span>)}
          </div>
          <p className="mt-6 font-mono text-xs font-black">FOTO 1 / 4</p>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 h-3 w-1/2 -translate-x-1/2 border-[3px] border-[#241c18] bg-[#171310]" />
      <span className="absolute bottom-8 left-8 h-7 w-7 rounded-full border-[3px] border-[#241c18] bg-[#e6675c]" />
    </div>
    <div className="absolute -bottom-5 right-2 w-[34%] min-w-[120px] sm:-right-7"><MiniStrip rotate="rotate-3" compact /></div>
  </div>
);

const PhotostripLanding = () => {
  useEffect(() => {
    const schema = document.createElement("script");
    schema.id = "ld-photostrip";
    schema.type = "application/ld+json";
    schema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      name: "Photostrip by Revelao",
      description: "Fotomatón digital para bodas y eventos con cuatro fotos, tira descargable y galería compartida mediante QR.",
      brand: { "@type": "Brand", name: "Revelao" },
      url: "https://www.revelao.cam/photostrip",
    });
    document.getElementById(schema.id)?.remove();
    document.head.appendChild(schema);
    return () => schema.remove();
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f7f1e5] text-[#241c18]">
      <PageSeo
        title="Photostrip para bodas y eventos | Fotomatón con QR | Revelao"
        description="Convierte cada móvil en un fotomatón. Tus invitados hacen cuatro fotos, reciben su tira y comparten un mural del evento sin descargar ninguna app."
        canonicalPath="/photostrip"
      />

      <nav className="sticky top-0 z-50 border-b-2 border-[#241c18] bg-[#f7f1e5]/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
          <a href="/" className="flex min-w-0 items-center gap-2.5" aria-label="Volver a Revelao">
            <img src={icon} alt="Revelao" className="h-7 w-auto shrink-0" />
            <span className="truncate font-mono text-xs font-black tracking-[.12em] sm:text-sm">PHOTOSTRIP</span>
          </a>
          <div className="ml-auto flex items-center gap-2 sm:gap-4">
            <a href="#como-funciona" className="hidden font-mono text-xs font-bold sm:inline">CÓMO FUNCIONA</a>
            <a href={createUrl} className="inline-flex min-h-10 items-center border-2 border-[#241c18] bg-[#241c18] px-3 font-mono text-[10px] font-black tracking-wide text-white shadow-[3px_3px_0_#e6675c] sm:px-5 sm:text-xs">
              CREAR PHOTOSTRIP
            </a>
          </div>
        </div>
      </nav>

      <main>
        <section className="relative overflow-hidden border-b-2 border-[#241c18] px-4 py-14 sm:px-6 sm:py-20 lg:py-24">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#241c18_0.7px,transparent_0.7px)] opacity-[.13] [background-size:5px_5px]" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_.95fr]">
            <div className="max-w-3xl">
              <p className="mb-5 inline-flex -rotate-1 border-2 border-[#241c18] bg-[#e6675c] px-3 py-2 font-mono text-[10px] font-black tracking-[.18em] text-white">NUEVO · BY REVELAO</p>
              <h1 className="max-w-3xl font-serif text-[clamp(3.2rem,11vw,7.4rem)] font-black leading-[.82] tracking-[-.055em]">
                El fotomatón que cabe en un QR.
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-relaxed sm:text-xl">
                Cuatro fotos, una tira y un mural lleno de invitados. Sin cabina, sin app y sin complicaciones.
              </p>
              <div className="mt-9 flex flex-col items-stretch gap-3 min-[420px]:flex-row min-[420px]:items-center">
                <a href={createUrl} className="inline-flex min-h-14 items-center justify-center gap-2 border-[3px] border-[#241c18] bg-[#241c18] px-6 font-mono text-xs font-black tracking-[.08em] text-white shadow-[5px_5px_0_#e6675c]">
                  CREAR MI PHOTOSTRIP <ArrowRight className="h-4 w-4" />
                </a>
                <a href="#como-funciona" className="inline-flex min-h-14 items-center justify-center border-[3px] border-[#241c18] px-6 font-mono text-xs font-black tracking-[.08em]">VER CÓMO FUNCIONA</a>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 font-mono text-[10px] font-bold uppercase tracking-wide sm:text-xs">
                <span className="flex items-center gap-2"><Check className="h-4 w-4 text-[#b83f37]" /> Sin descargar app</span>
                <span className="flex items-center gap-2"><Check className="h-4 w-4 text-[#b83f37]" /> Desde cualquier móvil</span>
              </div>
            </div>
            <BoothIllustration />
          </div>
        </section>

        <section className="bg-[#241c18] px-4 py-10 text-[#fffaf0] sm:px-6">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px border border-white/25 bg-white/25 lg:grid-cols-4">
            {[[Camera, "4 fotos automáticas"], [QrCode, "Acceso con un QR"], [Download, "Tira descargable"], [Images, "Galería compartida"]].map(([Icon, label]) => {
              const ItemIcon = Icon as typeof Camera;
              return <div key={label as string} className="flex min-h-32 flex-col items-center justify-center gap-3 bg-[#241c18] p-4 text-center"><ItemIcon className="h-6 w-6 text-[#e6675c]" /><p className="font-mono text-[11px] font-black uppercase tracking-wide sm:text-xs">{label as string}</p></div>;
            })}
          </div>
        </section>

        <section id="como-funciona" className="px-4 py-20 sm:px-6 sm:py-28">
          <div className="mx-auto max-w-7xl">
            <p className="font-mono text-xs font-black tracking-[.2em] text-[#a83d36]">ASÍ DE FÁCIL</p>
            <h2 className="mt-4 max-w-3xl font-serif text-4xl font-black leading-none sm:text-6xl">Del QR a una tira inolvidable.</h2>
            <div className="mt-12 grid border-l-2 border-t-2 border-[#241c18] sm:grid-cols-2 lg:grid-cols-4">
              {steps.map(([number, title, description]) => <article key={number} className="min-h-64 border-b-2 border-r-2 border-[#241c18] bg-[#fffdf6] p-6 sm:p-7"><p className="font-mono text-4xl font-black text-[#e6675c]">{number}</p><h3 className="mt-8 font-serif text-2xl font-black">{title}</h3><p className="mt-3 text-sm leading-relaxed text-[#5e5149]">{description}</p></article>)}
            </div>
          </div>
        </section>

        <section className="border-y-2 border-[#241c18] bg-[#d8cbb3] px-4 py-20 sm:px-6 sm:py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
            <div className="relative mx-auto grid w-full max-w-md grid-cols-2 items-start gap-5 px-3">
              <MiniStrip rotate="-rotate-3" />
              <div className="mt-16"><MiniStrip rotate="rotate-2" /></div>
            </div>
            <div>
              <p className="font-mono text-xs font-black tracking-[.2em] text-[#8b302b]">EL MURAL DE LA FIESTA</p>
              <h2 className="mt-4 font-serif text-4xl font-black leading-none sm:text-6xl">Cada tira cuenta una historia distinta.</h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed">Al terminar, la tira aparece en la galería común. Los invitados descubren las poses, las risas y los pequeños grupos que se han formado durante el evento.</p>
              <ul className="mt-8 space-y-4 font-mono text-xs font-bold uppercase tracking-wide">
                <li className="flex gap-3"><Check className="h-5 w-5 shrink-0 text-[#a83d36]" /> Galería pública, para participantes o solo para ti</li>
                <li className="flex gap-3"><Check className="h-5 w-5 shrink-0 text-[#a83d36]" /> Moderación y descargas desde tu panel</li>
                <li className="flex gap-3"><Check className="h-5 w-5 shrink-0 text-[#a83d36]" /> Color o blanco y negro</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="px-4 py-20 sm:px-6 sm:py-28">
          <div className="mx-auto max-w-6xl text-center">
            <Sparkles className="mx-auto h-8 w-8 text-[#c64b43]" />
            <p className="mt-5 font-mono text-xs font-black tracking-[.2em] text-[#a83d36]">BODAS · FIESTAS · EMPRESA</p>
            <h2 className="mx-auto mt-4 max-w-4xl font-serif text-4xl font-black leading-none sm:text-6xl">Un photocall espontáneo, siempre en el bolsillo.</h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed">Coloca el QR en las mesas, la barra o la pista de baile. Cada invitado pone la cámara y Revelao se encarga del resto.</p>
          </div>
        </section>

        <section className="border-y-2 border-[#241c18] bg-[#fffdf6] px-4 py-20 sm:px-6 sm:py-28">
          <div className="mx-auto max-w-4xl">
            <p className="font-mono text-xs font-black tracking-[.2em] text-[#a83d36]">PREGUNTAS FRECUENTES</p>
            <h2 className="mt-4 font-serif text-4xl font-black leading-none sm:text-6xl">Lo esencial, sin letra pequeña.</h2>
            <div className="mt-10 border-t-2 border-[#241c18]">
              {faqs.map(([question, answer]) => <details key={question} className="group border-b-2 border-[#241c18] py-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-xl font-black"><span>{question}</span><span className="font-mono text-2xl group-open:rotate-45">+</span></summary><p className="max-w-2xl pt-4 leading-relaxed text-[#5e5149]">{answer}</p></details>)}
            </div>
          </div>
        </section>

        <section className="bg-[#e6675c] px-4 py-20 sm:px-6 sm:py-28">
          <div className="mx-auto max-w-5xl text-center">
            <p className="font-mono text-xs font-black tracking-[.2em]">LA MÁQUINA ESTÁ LISTA</p>
            <h2 className="mt-5 font-serif text-5xl font-black leading-[.9] sm:text-7xl">Que empiecen las fotos.</h2>
            <p className="mx-auto mt-6 max-w-xl text-lg">Crea el evento, descarga el QR y deja que tus invitados llenen el mural.</p>
            <a href={createUrl} className="mt-9 inline-flex min-h-14 items-center justify-center gap-2 border-[3px] border-[#241c18] bg-[#241c18] px-7 font-mono text-xs font-black tracking-[.08em] text-white shadow-[5px_5px_0_#fff4df]">CREAR MI PHOTOSTRIP <ArrowRight className="h-4 w-4" /></a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PhotostripLanding;
