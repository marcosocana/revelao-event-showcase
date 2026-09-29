import {
  ArrowDown,
  ArrowRight,
  Check,
  Heart,
  Images,
  LockKeyhole,
  QrCode,
  ScanLine,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { PageSeo } from "@/components/PageSeo";
import { CarreteoDemo } from "./CarreteoDemo";
import styles from "./carreteo.module.css";

const createUrl = "https://acceso.revelao.cam";

const pasos = [
  {
    numero: "01",
    icono: QrCode,
    titulo: "Crea tu carrete",
    texto: "Ponle nombre a la fiesta, elige un filtro y decide cuántas fotos tendrá cada invitado.",
  },
  {
    numero: "02",
    icono: ScanLine,
    titulo: "Comparte el QR",
    texto: "Déjalo en las mesas o envíalo por WhatsApp. Entran desde el móvil, sin registros ni líos.",
  },
  {
    numero: "03",
    icono: LockKeyhole,
    titulo: "Que pase de todo",
    texto: "Cada foto queda guardada y oculta. Nadie repite veinte veces: aquí cada disparo cuenta.",
  },
  {
    numero: "04",
    icono: Sparkles,
    titulo: "Revelad juntos",
    texto: "Al terminar, abrid el carrete y descubrid la fiesta desde todos los ojos a la vez.",
  },
];

const planes = [
  {
    nombre: "La previa",
    precio: "29",
    descripcion: "Para cumpleaños, cenas y fiestas pequeñas.",
    detalles: ["Hasta 30 invitados", "20 fotos por persona", "1 filtro de película", "Álbum durante 3 meses"],
  },
  {
    nombre: "El fiestón",
    precio: "59",
    descripcion: "El punto justo para una noche que promete.",
    detalles: ["Hasta 100 invitados", "Fotos ilimitadas", "3 filtros de película", "Descarga en alta calidad"],
    destacado: true,
  },
  {
    nombre: "La boda",
    precio: "99",
    descripcion: "Todo el día, todos los invitados, todo el carrete.",
    detalles: ["Hasta 250 invitados", "Fotos ilimitadas", "Filtros personalizados", "Álbum durante 12 meses"],
  },
];

export default function CarreteoPage() {
  return (
    <div className={styles.page}>
      <PageSeo
        title="Carreteo · La cámara desechable de tu fiesta | Revelao"
        description="Tus invitados hacen las fotos. Carreteo les da alma de carrete y las revela todas juntas cuando termina la fiesta."
        canonicalPath="/carreteo"
      />
      <header className={styles.header}>
        <a className={styles.brand} href="/carreteo" aria-label="Carreteo, inicio">
          <span className={styles.brandMark} aria-hidden="true"><span /></span>
          <span>carreteo</span>
        </a>
        <nav className={styles.nav} aria-label="Navegación de Carreteo">
          <a href="#como-funciona">Cómo funciona</a>
          <a href="#demo">Pruébalo</a>
          <a href="#planes">Planes</a>
        </nav>
        <a className={styles.headerCta} href="#planes">Crear mi carrete <ArrowRight size={16} /></a>
      </header>

      <main>
        <section className={styles.hero}>
          <div className={styles.grain} aria-hidden="true" />
          <div className={styles.heroCopy}>
            <p className={styles.kicker}><span>●</span> Cámara desechable digital</p>
            <h1>Tu fiesta,<br />sin <em>posados.</em></h1>
            <p className={styles.heroLead}>
              Tus invitados hacen las fotos. Carreteo les da alma de película y las revela todas juntas cuando tú decidas.
            </p>
            <div className={styles.heroActions}>
              <a className={styles.primaryButton} href="#planes">Crear mi carrete <ArrowRight size={18} /></a>
              <a className={styles.textButton} href="#demo">Probar la cámara <ArrowDown size={18} /></a>
            </div>
            <div className={styles.socialProof}>
              <div className={styles.avatarStack} aria-hidden="true">
                <span>A</span><span>M</span><span>L</span>
              </div>
              <div><strong>+2.400 carretes revelados</strong><span>4,9/5 · recuerdos de verdad</span></div>
            </div>
          </div>

          <div className={styles.heroVisual} aria-label="Recuerdo de una fiesta capturado con Carreteo">
            <div className={styles.sunburst} aria-hidden="true" />
            <div className={styles.photoFrame}>
              <img src="/carreteo/fiesta-candid.png" alt="Tres amigos riendo durante una fiesta" loading="eager" />
              <span className={styles.photoDate}>SÁB 21 · 01:43</span>
            </div>
            <div className={styles.cameraCard}>
              <div className={styles.cameraTop}><span /><b>27</b></div>
              <div className={styles.viewfinder}><div className={styles.lens}><i /></div></div>
              <div className={styles.cameraBottom}><span>ISO 400</span><strong>carreteo</strong><span>FLASH</span></div>
            </div>
            <div className={styles.tape}>NO MIRES. DISPARA.</div>
          </div>
        </section>

        <div className={styles.marquee} aria-hidden="true">
          <div>UNA NOCHE · UN CARRETE · MIL PUNTOS DE VISTA · SIN APPS · SIN POSADOS · UNA NOCHE · UN CARRETE · MIL PUNTOS DE VISTA ·</div>
        </div>

        <section className={styles.stepsSection} id="como-funciona">
          <div className={styles.sectionIntro}>
            <p className={styles.sectionLabel}>Así funciona</p>
            <h2>Tan fácil como<br /><em>pasarlo bien.</em></h2>
            <p>Sin cámaras repartidas, sin perseguir enlaces después y sin que nadie se pase la fiesta mirando la galería.</p>
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

        <section className={styles.demoSection} id="demo">
          <div className={styles.demoCopy}>
            <p className={styles.sectionLabel}>Demo interactiva</p>
            <h2>Ponte detrás<br />de la <em>cámara.</em></h2>
            <p>Haz una foto de prueba. Verás cómo funciona para tus invitados: encuadrar, disparar y seguir con la fiesta.</p>
            <ul>
              <li><Check size={17} /> Acceso directo con QR</li>
              <li><Check size={17} /> Sin descargar ninguna app</li>
              <li><Check size={17} /> Disparos limitados, momentos mejores</li>
            </ul>
          </div>
          <CarreteoDemo />
        </section>

        <section className={styles.revealSection}>
          <div className={styles.revealImage}>
            <img src="/carreteo/fiesta-candid.png" alt="Amigos disfrutando del álbum después de la fiesta" loading="lazy" />
            <div className={styles.filmStrip} aria-hidden="true" />
          </div>
          <div className={styles.revealCopy}>
            <p className={styles.sectionLabel}>La gran revelación</p>
            <h2>Lo mejor pasa cuando <em>nadie está mirando.</em></h2>
            <p>Durante la fiesta, las fotos permanecen ocultas. Al abrir el carrete aparecen todas de golpe: la pista, la mesa de los primos y ese momento que tú ni viste.</p>
            <div className={styles.miniStats}>
              <div><Images /><strong>186</strong><span>fotos inesperadas</span></div>
              <div><Users /><strong>42</strong><span>miradas distintas</span></div>
              <div><Heart /><strong>1</strong><span>historia completa</span></div>
            </div>
          </div>
        </section>

        <section className={styles.pricingSection} id="planes">
          <div className={styles.pricingHead}>
            <div><p className={styles.sectionLabel}>Planes por evento</p><h2>Un precio.<br /><em>Todos los recuerdos.</em></h2></div>
            <p>Sin suscripciones ni sorpresas. Pagas una vez por tu evento y el carrete es vuestro.</p>
          </div>
          <div className={styles.pricingGrid}>
            {planes.map((plan) => (
              <article className={`${styles.priceCard} ${plan.destacado ? styles.featured : ""}`} key={plan.nombre}>
                {plan.destacado && <span className={styles.popular}>EL MÁS ELEGIDO</span>}
                <p className={styles.planName}>{plan.nombre}</p>
                <p className={styles.price}><sup>€</sup>{plan.precio}<small>/ evento</small></p>
                <p className={styles.planDescription}>{plan.descripcion}</p>
                <ul>{plan.detalles.map((item) => <li key={item}><Check size={17} />{item}</li>)}</ul>
                <a href={createUrl}>Elegir {plan.nombre.toLowerCase()} <ArrowRight size={17} /></a>
              </article>
            ))}
          </div>
          <p className={styles.priceNote}>Todos los planes incluyen QR personalizado, galería privada y descarga sin marca de agua.</p>
        </section>

        <section className={styles.quoteSection}>
          <div className={styles.stars} aria-label="5 de 5 estrellas">{[1,2,3,4,5].map((n) => <Star key={n} fill="currentColor" size={18} />)}</div>
          <blockquote>“Creíamos que ya habíamos visto toda la boda. Cuando abrimos el carrete al día siguiente, la vivimos otra vez.”</blockquote>
          <p>Clara & Dani · Valencia, 2026</p>
        </section>

        <section className={styles.finalCta} id="crear">
          <div className={styles.finalStamp}>36 EXP.<br /><span>READY</span></div>
          <p>Próxima parada: tu fiesta</p>
          <h2>Los mejores recuerdos<br />no se <em>planean.</em></h2>
          <a href={createUrl}>Crear mi carrete <ArrowRight size={19} /></a>
          <small>Tardas menos de 2 minutos · Sin permanencia</small>
        </section>
      </main>

      <footer className={styles.footer}>
        <a className={styles.brand} href="/carreteo"><span className={styles.brandMark}><span /></span><span>carreteo</span></a>
        <p>Hecho para recordar lo que pasó mientras lo pasabas bien.</p>
        <div><a href="#como-funciona">Cómo funciona</a><a href="#planes">Planes</a><a href="mailto:hola@revelao.cam">Contacto</a></div>
        <span>© 2026 Carreteo</span>
      </footer>
    </div>
  );
}
