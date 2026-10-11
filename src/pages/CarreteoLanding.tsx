import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Camera,
  Check,
  Images,
  Loader2,
  LockKeyhole,
  Mail,
  Play,
  QrCode,
  ScanLine,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { PageSeo } from "@/components/PageSeo";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { CarreteoCameraDemo } from "@/components/carreteo/CarreteoCameraDemo";
import { CarreteoGalleryDemo } from "@/components/carreteo/CarreteoGalleryDemo";
import { CarreteoQrCards } from "@/components/carreteo/CarreteoQrCards";
import { startCarreteoCheckout, type CarreteoPlanId } from "@/lib/carreteoCheckout";
import { CarreteoDemo } from "./CarreteoDemo";
import styles from "./carreteo.module.css";

type DemoView = "closed" | "choose" | "camera" | "gallery";
type CheckoutNotice = "success" | "cancel" | "error" | null;

const pasos = [
  {
    numero: "01",
    icono: QrCode,
    titulo: "Crea tu carrete",
    texto: "Ponle nombre al evento y elige cuándo se abre la cámara, cuándo se cierra y cuándo se revelan las fotos.",
  },
  {
    numero: "02",
    icono: ScanLine,
    titulo: "Comparte el QR",
    texto: "Déjalo en las mesas o envíalo por WhatsApp. Cada invitado abre su cámara desde el móvil, sin descargar nada.",
  },
  {
    numero: "03",
    icono: LockKeyhole,
    titulo: "25 fotos por cámara",
    texto: "Gira la rueda, dispara y sigue con la fiesta. Las fotos se guardan ocultas: nadie las ve hasta el revelado.",
  },
  {
    numero: "04",
    icono: Sparkles,
    titulo: "Revelad juntos",
    texto: "A la hora que elegiste se abre el álbum con las fotos de todos los invitados, listas para ver y descargar.",
  },
];

const planes: { id: CarreteoPlanId; nombre: string; precio: string; carretes: number; descripcion: string; destacado?: boolean }[] = [
  {
    id: "carreteo_50",
    nombre: "Básico",
    precio: "25",
    carretes: 50,
    descripcion: "Para cumpleaños, cenas y celebraciones íntimas.",
  },
  {
    id: "carreteo_150",
    nombre: "Pro",
    precio: "59",
    carretes: 150,
    descripcion: "El punto justo para bodas y eventos medianos.",
    destacado: true,
  },
  {
    id: "carreteo_250",
    nombre: "Ultra",
    precio: "99",
    carretes: 250,
    descripcion: "Para bodas grandes y eventos con muchos invitados.",
  },
];

// es-ES no agrupa los números de cuatro cifras (1250), así que se fuerza el punto de miles.
const formatNumber = (value: number) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

export default function CarreteoPage() {
  const [demoView, setDemoView] = useState<DemoView>("closed");
  const [demoPhotos, setDemoPhotos] = useState<string[]>([]);
  const [buyingPlan, setBuyingPlan] = useState<CarreteoPlanId | null>(null);
  const [checkoutNotice, setCheckoutNotice] = useState<CheckoutNotice>(null);

  // ?demo=camara abre la cámara directamente (es el enlace de las tarjetas QR de ejemplo)
  // y ?checkout=success|cancel llega de vuelta desde Stripe.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const demo = params.get("demo");
    const checkout = params.get("checkout");
    if (demo === "camara") setDemoView("camera");
    else if (demo === "galeria") setDemoView("gallery");
    if (checkout === "success" || checkout === "cancel") setCheckoutNotice(checkout);
    if (demo || checkout) {
      params.delete("demo");
      params.delete("checkout");
      const query = params.toString();
      window.history.replaceState(null, "", `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`);
    }
  }, []);

  // Las fotos de la demo son blobs locales: se liberan al salir de la página.
  const demoPhotosRef = useRef(demoPhotos);
  demoPhotosRef.current = demoPhotos;
  useEffect(() => () => demoPhotosRef.current.forEach((url) => { if (url.startsWith("blob:")) URL.revokeObjectURL(url); }), []);

  const buy = async (planId: CarreteoPlanId) => {
    setBuyingPlan(planId);
    try {
      await startCarreteoCheckout(planId);
    } catch (error) {
      console.error("Carreteo checkout error:", error);
      setCheckoutNotice("error");
      setBuyingPlan(null);
    }
  };

  const goToPlans = () => {
    setDemoView("closed");
    window.setTimeout(() => document.getElementById("planes")?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const openDemo = () => setDemoView("choose");

  return (
    <div className={styles.page}>
      <PageSeo
        title="Carreteo · La cámara desechable digital para tu evento | Revelao"
        description="Cada invitado recibe un carrete de 25 fotos en su móvil. Las fotos se revelan todas juntas cuando termina la fiesta. Pruébalo gratis en la demo."
        canonicalPath="/carreteo"
      />
      <header className={styles.header}>
        <a className={styles.brand} href="/carreteo" aria-label="Carreteo, inicio">
          <span>CARRETEO</span><span className={styles.brandDot}>.</span>
        </a>
        <nav className={styles.nav} aria-label="Navegación de Carreteo">
          <a href="#como-funciona">Cómo funciona</a>
          <a href="#camara">La cámara</a>
          <a href="#tarjetas">Tarjetas QR</a>
          <a href="#planes">Precios</a>
        </nav>
        <a className={styles.headerCta} href="#planes">Crear mi carrete <ArrowRight size={16} /></a>
      </header>

      {checkoutNotice ? (
        <div className={`${styles.notice} ${checkoutNotice === "success" ? styles.noticeSuccess : ""}`} role="status">
          {checkoutNotice === "success" ? <Mail size={20} /> : null}
          <p>
            {checkoutNotice === "success"
              ? <><strong>¡Pago completado!</strong> Te hemos enviado un email con el enlace y el código para registrar tu evento. Si no lo ves, revisa la carpeta de spam.</>
              : checkoutNotice === "cancel"
                ? "Has cancelado el pago. Puedes elegir otro plan cuando quieras."
                : "No hemos podido abrir el pago. Inténtalo de nuevo en unos segundos o escríbenos a hola@revelao.cam."}
          </p>
          <button type="button" onClick={() => setCheckoutNotice(null)} aria-label="Cerrar aviso"><X size={18} /></button>
        </div>
      ) : null}

      <main>
        <section className={styles.hero}>
          <div className={styles.grain} aria-hidden="true" />
          <div className={styles.heroCopy}>
            <p className={styles.kicker}><span>●</span> Cámara desechable digital</p>
            <h1>Tu fiesta,<br />sin <em>posados.</em></h1>
            <p className={styles.heroLead}>
              Cada invitado escanea un QR y tiene en su móvil una cámara de un solo uso con 25 fotos. Nadie ve nada hasta que llega el revelado.
            </p>
            <div className={styles.heroActions}>
              <a className={styles.primaryButton} href="#planes">Crear mi carrete <ArrowRight size={18} /></a>
              <button type="button" className={styles.textButton} onClick={openDemo}>Ver la demo <Play size={17} /></button>
            </div>
            <ul className={styles.heroFacts}>
              <li><Check size={16} /> Sin descargar ninguna app</li>
              <li><Check size={16} /> 25 fotos por carrete</li>
              <li><Check size={16} /> Revelado a la hora que elijas</li>
            </ul>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.sunburst} aria-hidden="true" />
            <figure className={styles.phoneLandscape}>
              <img
                src="/carreteo/camara-lista-visor.jpg"
                alt="La cámara Carreteo en un móvil: visor abierto, contador en 7 de 25 y listo para disparar"
                width={1600}
                height={739}
                loading="eager"
              />
            </figure>
            <div className={styles.tape}>NO MIRES. DISPARA.</div>
          </div>
        </section>

        <div className={styles.marquee} aria-hidden="true">
          <div>UN QR · UN CARRETE POR INVITADO · 25 FOTOS · SIN APPS · SIN POSADOS · REVELADO SORPRESA · UN QR · UN CARRETE POR INVITADO · 25 FOTOS · SIN APPS · SIN POSADOS · REVELADO SORPRESA ·</div>
        </div>

        <section className={styles.stepsSection} id="como-funciona">
          <div className={styles.sectionIntro}>
            <p className={styles.sectionLabel}>Así funciona</p>
            <h2>Tan fácil como<br /><em>pasarlo bien.</em></h2>
            <p>Sin cámaras de papel repartidas por las mesas, sin perseguir fotos por WhatsApp y sin que nadie se pase la fiesta mirando la galería.</p>
          </div>
          <div className={styles.stepsGrid}>
            {pasos.map(({ numero, icono: Icono, titulo, texto }) => (
              <article className={styles.stepCard} key={numero}>
                <div className={styles.stepMeta}><span>{numero}</span><Icono size={25} strokeWidth={1.8} /></div>
                <h3>{titulo}</h3>
                <p>{texto}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.demoSection} id="camara">
          <div className={styles.demoCopy}>
            <p className={styles.sectionLabel}>La cámara, tal cual</p>
            <h2>Una desechable<br />de <em>verdad.</em></h2>
            <p>Esto es lo que ven tus invitados al escanear el QR. Gira el móvil en horizontal y funciona como una cámara de carrete: rueda, disparador, flash y contador.</p>
          </div>
          <div className={styles.demoColumn}>
            <CarreteoDemo />
            <button type="button" className={styles.demoButton} onClick={openDemo}>Probar la demo <Play size={17} /></button>
          </div>
        </section>

        <section className={styles.revealSection}>
          <div className={styles.revealImage}>
            <figure className={styles.phonePortrait}>
              <img
                src="/carreteo/galeria-revelada.jpg"
                alt="Álbum revelado de Carreteo: portada del evento y las fotos de todos los invitados"
                width={600}
                height={1300}
                loading="lazy"
              />
            </figure>
          </div>
          <div className={styles.revealCopy}>
            <p className={styles.sectionLabel}>La gran revelación</p>
            <h2>Lo mejor pasa cuando <em>nadie está mirando.</em></h2>
            <p>Durante la fiesta, las fotos permanecen ocultas. A la hora del revelado aparecen todas juntas en un álbum: la pista, la mesa de los primos y ese momento que tú ni viste.</p>
            <button type="button" className={styles.galleryButton} onClick={() => setDemoView("gallery")}>Ver galería de ejemplo <Images size={17} /></button>
            <div className={styles.miniStats}>
              <div><Images /><strong>25</strong><span>fotos por carrete</span></div>
              <div><LockKeyhole /><strong>0</strong><span>fotos vistas antes de tiempo</span></div>
              <div><Sparkles /><strong>1</strong><span>álbum con todo el evento</span></div>
            </div>
          </div>
        </section>

        <section className={styles.qrSection} id="tarjetas">
          <div className={styles.qrHead}>
            <p className={styles.sectionLabel}>Tarjetas QR</p>
            <h2>Un QR en cada mesa.<br /><em>Un carrete en cada móvil.</em></h2>
            <p>Imprime tu QR en tarjetas para las mesas, la barra o el photocall. Estos son algunos ejemplos: escanea cualquiera con el móvil y prueba la cámara.</p>
          </div>
          <CarreteoQrCards />
        </section>

        <section className={styles.pricingSection} id="planes">
          <div className={styles.pricingHead}>
            <div>
              <p className={styles.sectionLabel}>Precios por evento</p>
              <h2>Un pago por evento.<br /><em>Todos los recuerdos.</em></h2>
            </div>
            <p>Cada carrete es una cámara de 25 fotos para un invitado. Elige cuántos necesitas, paga una vez y el álbum es vuestro.</p>
          </div>
          <div className={styles.pricingGrid}>
            {planes.map((plan) => (
              <article className={`${styles.priceCard} ${plan.destacado ? styles.featured : ""}`} key={plan.nombre}>
                {plan.destacado && <span className={styles.popular}>EL MÁS ELEGIDO</span>}
                <p className={styles.planName}>{plan.nombre}</p>
                <p className={styles.price}>{plan.precio}<span className={styles.currency}>€</span><small>/ evento</small></p>
                <p className={styles.planDescription}>{plan.descripcion}</p>
                <ul>
                  <li><Check size={17} />Hasta {plan.carretes} carretes</li>
                  <li><Check size={17} />25 fotos por carrete</li>
                  <li><Check size={17} />Hasta {formatNumber(plan.carretes * 25)} fotos en total</li>
                  <li><Check size={17} />QR, galería y revelado programado</li>
                </ul>
                <button type="button" onClick={() => void buy(plan.id)} disabled={buyingPlan !== null}>
                  {buyingPlan === plan.id ? <>Abriendo el pago… <Loader2 size={17} className={styles.spin} /></> : <>Comprar {plan.nombre} <ArrowRight size={17} /></>}
                </button>
              </article>
            ))}
          </div>
          <p className={styles.priceNote}>Pago único y seguro con Stripe. Al pagar recibirás un email con el enlace para registrar tu evento. Todos los planes incluyen QR, álbum privado y descarga de las fotos.</p>
        </section>

        <section className={styles.quoteSection}>
          <div className={styles.stars} aria-label="5 de 5 estrellas">{[1, 2, 3, 4, 5].map((n) => <Star key={n} fill="currentColor" size={18} />)}</div>
          <blockquote>“Creíamos que ya habíamos visto toda la boda. Cuando abrimos el carrete al día siguiente, la vivimos otra vez.”</blockquote>
          <p>Clara & Dani · Valencia, 2026</p>
        </section>

        <section className={styles.finalCta} id="crear">
          <div className={styles.finalStamp}>25 EXP.<br /><span>READY</span></div>
          <p>Próxima parada: tu fiesta</p>
          <h2>Los mejores recuerdos<br />no se <em>planean.</em></h2>
          <div className={styles.finalActions}>
            <a href="#planes">Crear mi carrete <ArrowRight size={19} /></a>
            <button type="button" onClick={openDemo}>Ver la demo <Play size={18} /></button>
          </div>
          <small>Tardas menos de 2 minutos · Pago único por evento</small>
        </section>
      </main>

      <Dialog open={demoView === "choose"} onOpenChange={(open) => { if (!open) setDemoView("closed"); }}>
        <DialogContent className="max-w-2xl rounded-2xl p-6 sm:p-8">
          <DialogTitle className="text-2xl font-bold tracking-tight">¿Qué quieres ver?</DialogTitle>
          <DialogDescription>Prueba Carreteo como lo vivirán tus invitados o mira cómo queda el álbum revelado.</DialogDescription>
          <div className={styles.demoChoices}>
            <button type="button" onClick={() => setDemoView("camera")}>
              <img src="/carreteo/camara-inicio.jpg" alt="" />
              <span><Camera size={18} /> Ver cómo se vería la cámara</span>
              <small>Usa la cámara de tu móvil. Las fotos no se suben a ningún sitio.</small>
            </button>
            <button type="button" onClick={() => setDemoView("gallery")}>
              <img src="/carreteo/galeria-revelada.jpg" alt="" className={styles.demoChoiceGallery} />
              <span><Images size={18} /> Ver una galería de ejemplo</span>
              <small>Así se ve el álbum cuando se revelan las fotos.</small>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {demoView === "camera" ? (
        <CarreteoCameraDemo
          photos={demoPhotos}
          onPhoto={(url) => setDemoPhotos((current) => [url, ...current])}
          onClose={() => setDemoView("closed")}
          onOpenGallery={() => setDemoView("gallery")}
        />
      ) : null}
      {demoView === "gallery" ? (
        <CarreteoGalleryDemo ownPhotos={demoPhotos} onClose={() => setDemoView("closed")} onBuy={goToPlans} />
      ) : null}

      <footer className={styles.footer}>
        <a className={styles.brand} href="/carreteo"><span>CARRETEO</span><span className={styles.brandDot}>.</span></a>
        <p>Hecho para recordar lo que pasó mientras lo pasabas bien.</p>
        <div><a href="#como-funciona">Cómo funciona</a><a href="#planes">Precios</a><a href="mailto:hola@revelao.cam">Contacto</a></div>
        <span>© 2026 Carreteo · Revelao</span>
      </footer>
    </div>
  );
}
