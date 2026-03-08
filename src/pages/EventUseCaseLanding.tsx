import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import { Features } from "@/components/Features";
import { Pricing } from "@/components/Pricing";
import { FAQs } from "@/components/FAQs";
import { SimpleCTA } from "@/components/SimpleCTA";
import WhatsAppFloating from "@/components/WhatsAppFloating";
import { getAccessDemoUrl, useI18n } from "@/lib/i18n";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Camera,
  CheckCircle2,
  Heart,
  Mic,
  QrCode,
  Sparkles,
  Video,
} from "lucide-react";
import weddingQr from "@/assets/boda-qr.png";
import weddingHeroImage from "@/assets/image 368.png";
import nightEventImage from "@/assets/nocheqr.png";
import villageEventImage from "@/assets/puebloqr.png";
import stepOneImage from "@/assets/11.png";
import stepTwoImage from "@/assets/22.png";
import stepThreeImage from "@/assets/33.png";
import stepFourImage from "@/assets/44.png";

type UseCaseContent = {
  title: string;
  subtitle: string;
  bullets: string[];
  intro: string;
  valueTitle: string;
  valuePoints: string[];
  flowTitle: string;
  flowSteps: string[];
  faqTitle: string;
  faqs: Array<{ q: string; a: string }>;
};

type UseCaseViewCopy = {
  heroTitle: string;
  howTitle: string;
  highlights: string[];
  ctaTitle: string;
  ctaText: string;
};

const contentBySlug: Record<string, UseCaseContent> = {
  bodas: {
    title: "Revelao para Bodas",
    subtitle:
      "Convierte tu boda en una experiencia colectiva con fotos, vídeos y mensajes de voz que se revelan al día siguiente.",
    bullets: [
      "QR único para todos tus invitados",
      "Sin apps ni registros",
      "Galería privada con revelado al día siguiente",
    ],
    intro:
      "En una boda suceden cientos de momentos que los novios no llegan a ver en directo. Revelao reúne en una sola galería privada todo lo que capturan vuestros invitados para que no se pierda nada: fotos espontáneas, vídeos llenos de emoción y mensajes de voz que os harán volver a ese día.",
    valueTitle: "¿Por qué funciona tan bien en bodas?",
    valuePoints: [
      "Momentos que no visteis: Mientras estáis viviendo vuestro gran día, pasan muchas cosas a vuestro alrededor: abrazos, lágrimas, risas, bailes y escenas que también forman parte de vuestra historia.",
      "Participación natural: Tus invitados solo tienen que escanear el QR para empezar a subir contenido. Es tan fácil que participa mucha más gente, desde el cóctel hasta la fiesta.",
      "Sin apps ni registros: Nadie tiene que descargar nada ni crear una cuenta. Cuanta menos fricción hay, más espontánea es la participación y más recuerdos se generan.",
      "Fotos, vídeos y audios: No todo se recuerda mejor con una foto. Revelao también recoge vídeos y mensajes de voz para que la experiencia sea más viva, más completa y mucho más emocional.",
      "La emoción de esperar: Durante la boda, nada se muestra en tiempo real. Todo permanece oculto hasta el día siguiente, creando expectación y haciendo que el Revelado se viva como un momento especial.",
      "Un recuerdo compartido de verdad: Al día siguiente, todos descubrís la galería privada con las aportaciones de todos. Una boda vista desde muchas miradas, reunida en un solo lugar.",
    ],
    flowTitle: "Cómo aplicarlo en tu boda",
    flowSteps: [
      "Crea tu evento gratis y personaliza nombre, descripción e imagen de fondo.",
      "Imprime el QR en carteles, minutas o pantalla del salón.",
      "Durante la boda, tus invitados suben fotos, vídeos y audios de forma privada.",
      "Al día siguiente, se abre el Revelado con todo el contenido en orden.",
      "Comparte y descarga los mejores recuerdos en una galería única.",
    ],
    faqTitle: "Preguntas frecuentes para bodas",
    faqs: [
      {
        q: "¿Mis invitados necesitan registrarse?",
        a: "No. Solo escanean el QR y suben contenido desde el navegador.",
      },
      {
        q: "¿Se puede usar en iglesia, cóctel y banquete?",
        a: "Sí. El QR funciona igual en cualquier parte del evento.",
      },
      {
        q: "¿Puedo personalizar el estilo visual de mi boda?",
        a: "Sí. Puedes definir imagen de fondo, textos y estilo del evento.",
      },
    ],
  },
  comuniones: {
    title: "Revelao para Primeras Comuniones",
    subtitle:
      "Recoge todos los momentos de la Primera Comunión en una galería privada y vive el revelado al día siguiente con toda la familia.",
    bullets: [
      "QR único para todos los invitados",
      "Fotos, vídeos y mensajes de voz sin apps",
      "Recuerdo familiar completo y ordenado",
    ],
    intro:
      "En una Primera Comunión pasan muchísimas cosas a la vez: ceremonia, fotos familiares, celebración y momentos espontáneos entre amigos. Revelao centraliza todo en un único espacio privado para que no se pierda ningún recuerdo.",
    valueTitle: "¿Por qué encaja tan bien en una Primera Comunión?",
    valuePoints: [
      "Participan padres, abuelos, padrinos y amigos sin complicaciones técnicas.",
      "Evitas perder archivos entre grupos de WhatsApp y móviles distintos.",
      "El revelado genera ilusión y alarga la emoción del día especial.",
      "Todo queda ordenado en una galería privada lista para compartir en familia.",
    ],
    flowTitle: "Cómo usar Revelao en una Primera Comunión",
    flowSteps: [
      "Crea el evento gratis y personaliza nombre, descripción e imagen de portada.",
      "Imprime el QR y colócalo en el recordatorio, mesas o entrada del salón.",
      "Durante la celebración, los invitados suben fotos, vídeos y audios desde su móvil.",
      "Todo permanece oculto mientras dura el evento para mantener la sorpresa.",
      "Al día siguiente se abre el revelado con todos los recuerdos en orden cronológico.",
    ],
    faqTitle: "Preguntas frecuentes para Primeras Comuniones",
    faqs: [
      {
        q: "¿Los invitados tienen que instalar alguna app?",
        a: "No. Solo escanean el QR y suben contenido desde el navegador del móvil.",
      },
      {
        q: "¿Pueden participar familiares mayores sin complicaciones?",
        a: "Sí. El flujo está pensado para ser muy simple: abrir QR, elegir foto/vídeo/audio y subir.",
      },
      {
        q: "¿Se puede personalizar para la Primera Comunión de mi hijo/a?",
        a: "Sí. Puedes personalizar portada, textos y estilo para adaptarlo al evento.",
      },
    ],
  },
  cumpleanos: {
    title: "Revelao para Cumpleaños",
    subtitle:
      "Haz que cada cumpleaños tenga una galería viva con recuerdos compartidos por todos los asistentes.",
    bullets: [
      "Participación alta con solo escanear un QR",
      "Experiencia divertida y anónima",
      "Recuerdos completos del evento",
    ],
    intro:
      "En los cumpleaños siempre hay momentos espontáneos que no entran en la cámara principal. Revelao te ayuda a capturarlos todos.",
    valueTitle: "Por qué usar Revelao en cumpleaños",
    valuePoints: [
      "Configuración rápida en pocos minutos.",
      "Subidas inmediatas sin instalar nada.",
      "Galería compartida para todos los asistentes.",
    ],
    flowTitle: "Cómo funciona en cumpleaños",
    flowSteps: [
      "Crea evento y personaliza portada.",
      "Comparte el QR en invitación o local.",
      "Recibe fotos, vídeos y audios de todos.",
      "Revela el contenido y revivid la fiesta.",
    ],
    faqTitle: "Preguntas frecuentes para cumpleaños",
    faqs: [
      {
        q: "¿Sirve para fiestas pequeñas?",
        a: "Sí, funciona igual para grupos pequeños o grandes.",
      },
      {
        q: "¿Los invitados pueden compartir desde su móvil?",
        a: "Sí, todo el flujo está pensado para móvil.",
      },
    ],
  },
  empresa: {
    title: "Revelao para Eventos de Empresa",
    subtitle:
      "Centraliza fotos, vídeos y mensajes de voz de tu evento corporativo sin fricción y con una experiencia premium.",
    bullets: [
      "Ideal para team buildings, lanzamientos y celebraciones",
      "Sin dependencia de apps externas",
      "Contenido unificado en una galería privada",
    ],
    intro:
      "En eventos corporativos, mantener una narrativa visual ordenada es clave. Revelao permite recopilar cobertura real de asistentes y equipo en un solo punto.",
    valueTitle: "Beneficios para empresa",
    valuePoints: [
      "Mayor participación interna en eventos de marca.",
      "Cobertura distribuida sin perder control.",
      "Experiencia moderna y fácil de activar con QR.",
    ],
    flowTitle: "Aplicación en eventos corporativos",
    flowSteps: [
      "Configura el evento con branding propio.",
      "Muestra el QR en acreditaciones, pantallas o cartelería.",
      "Recibe contenido en tiempo real sin revelarlo.",
      "Activa revelado y comparte resultados con el equipo.",
    ],
    faqTitle: "Preguntas frecuentes para empresa",
    faqs: [
      {
        q: "¿Se puede usar en eventos internos y externos?",
        a: "Sí, en ambos casos funciona igual.",
      },
      {
        q: "¿Permite personalización visual?",
        a: "Sí, puedes adaptar portada y estilo del evento.",
      },
    ],
  },
  conferencias: {
    title: "Revelao para Conferencias",
    subtitle:
      "Recoge la cobertura real de tu conferencia desde la perspectiva de asistentes, staff y ponentes.",
    bullets: [
      "Aporta dinamismo y participación",
      "Captura los mejores insights del evento",
      "Revelado conjunto para amplificar el impacto",
    ],
    intro:
      "Las conferencias generan mucho contenido distribuido. Revelao centraliza momentos clave, backstage y experiencias de asistentes sin depender de herramientas complejas.",
    valueTitle: "Valor para conferencias",
    valuePoints: [
      "Recopila perspectivas múltiples del mismo evento.",
      "Facilita la participación del público asistente.",
      "Mejora la post-comunicación del evento.",
    ],
    flowTitle: "Uso recomendado en conferencias",
    flowSteps: [
      "Crea evento y ajusta tiempos de subida/revelado.",
      "Comparte QR en acreditaciones y salas.",
      "Recibe contenido durante ponencias y networking.",
      "Publica revelado y reutiliza el contenido destacado.",
    ],
    faqTitle: "Preguntas frecuentes para conferencias",
    faqs: [
      {
        q: "¿Pueden subir contenido asistentes y staff?",
        a: "Sí, cualquiera con el QR puede participar.",
      },
      {
        q: "¿Es compatible con eventos de varios días?",
        a: "Sí, puedes ajustar la duración en la configuración.",
      },
    ],
  },
  "cenas-navidad": {
    title: "Revelao para Cenas de Navidad",
    subtitle:
      "Haz de la cena de Navidad una experiencia memorable con una galería compartida llena de momentos espontáneos.",
    bullets: [
      "Perfecto para empresas, grupos y asociaciones",
      "Fotos, vídeos y audios en un solo espacio",
      "Revelado al día siguiente para mantener la emoción",
    ],
    intro:
      "Las cenas de Navidad son perfectas para generar recuerdos colectivos. Con Revelao, todos participan de forma sencilla y el resultado se descubre al día siguiente.",
    valueTitle: "Por qué encaja en cenas de Navidad",
    valuePoints: [
      "Participación natural en ambiente distendido.",
      "Recopila fotos, vídeos y audios de toda la noche.",
      "Revelado que prolonga la experiencia del evento.",
    ],
    flowTitle: "Cómo usarlo en tu cena",
    flowSteps: [
      "Crea evento y genera QR.",
      "Muestra QR en mesas y zonas comunes.",
      "Deja subir contenido durante toda la cena.",
      "Activa revelado al día siguiente.",
    ],
    faqTitle: "Preguntas frecuentes para cenas de Navidad",
    faqs: [
      {
        q: "¿Sirve para cenas de empresa y grupos privados?",
        a: "Sí, en ambos casos funciona de forma idéntica.",
      },
      {
        q: "¿Puedo usarlo con branding de empresa?",
        a: "Sí, puedes personalizar los elementos principales del evento.",
      },
    ],
  },
};

const viewCopyBySlug: Record<string, UseCaseViewCopy> = {
  bodas: {
    heroTitle: "La boda se vive una vez. El recuerdo puede descubrirse dos veces.",
    howTitle: "¿Cómo funciona en una boda?",
    highlights: [
      "Alta del evento en 2 minutos",
      "Participación rápida de invitados",
      "Revelado con máxima emoción",
    ],
    ctaTitle: "Empieza hoy con tu boda demo gratis",
    ctaText:
      "Prueba el flujo real de tu boda: QR, subida de contenido y revelado. Si te encaja, escalas cuando quieras.",
  },
  comuniones: {
    heroTitle:
      "Crea un recuerdo familiar completo de la Primera Comunión y reúnete al día siguiente para vivir el revelado con todos.",
    howTitle: "¿Cómo funciona en una Primera Comunión?",
    highlights: [
      "Configuración rápida para familias",
      "Participación simple para todas las edades",
      "Recuerdo ordenado y compartido",
    ],
    ctaTitle: "Empieza hoy con tu demo de Primera Comunión",
    ctaText:
      "Activa tu evento, comparte el QR y reúne fotos, vídeos y audios de toda la familia en una sola galería privada.",
  },
  cumpleanos: {
    heroTitle:
      "Haz de tu cumpleaños una experiencia compartida: todos suben su visión del evento y el revelado lo convierte en un recuerdo único.",
    howTitle: "¿Cómo funciona en un cumpleaños?",
    highlights: [
      "Perfecto para grupos pequeños o grandes",
      "Subida instantánea sin app",
      "Revelado que prolonga la fiesta",
    ],
    ctaTitle: "Empieza hoy con tu demo de cumpleaños",
    ctaText:
      "Monta tu evento en minutos y consigue una galería viva con fotos, vídeos y audios de todos los invitados.",
  },
  empresa: {
    heroTitle:
      "Centraliza en un solo canal la cobertura real de tu evento corporativo, con participación alta y una experiencia cuidada.",
    howTitle: "¿Cómo funciona en un evento de empresa?",
    highlights: [
      "Activación rápida con QR",
      "Cobertura colaborativa del equipo",
      "Contenido listo para comunicación interna",
    ],
    ctaTitle: "Empieza hoy con tu demo para empresa",
    ctaText:
      "Valida el flujo completo en un evento real y activa una galería privada profesional para tu equipo o clientes.",
  },
  conferencias: {
    heroTitle:
      "Recoge la perspectiva de asistentes, staff y ponentes para multiplicar el valor de tu conferencia antes y después del evento.",
    howTitle: "¿Cómo funciona en una conferencia?",
    highlights: [
      "Más participación del público",
      "Cobertura distribuida y ordenada",
      "Material reutilizable post-evento",
    ],
    ctaTitle: "Empieza hoy con tu demo de conferencia",
    ctaText:
      "Crea tu evento con QR y reúne contenido de sesiones, networking y backstage en una única experiencia privada.",
  },
  "cenas-navidad": {
    heroTitle:
      "Haz que la cena de Navidad no termine al acabar la noche: guarda los mejores momentos y revívelos todos juntos en el revelado.",
    howTitle: "¿Cómo funciona en una cena de Navidad?",
    highlights: [
      "Ideal para empresas y grupos",
      "Momento compartido al día siguiente",
      "Recuerdos espontáneos en un solo lugar",
    ],
    ctaTitle: "Empieza hoy con tu demo de cena de Navidad",
    ctaText:
      "Lanza tu evento en minutos y captura la energía de la noche con fotos, vídeos y audios en una galería privada.",
  },
};

const EventUseCaseLanding = () => {
  const { slug = "" } = useParams();
  const { lang } = useI18n();
  const accessDemoUrl = getAccessDemoUrl(lang);

  const normalizedSlug = useMemo(() => {
    const aliases: Record<string, string> = {
      boda: "bodas",
      wedding: "bodas",
      weddings: "bodas",
      comunion: "comuniones",
      communion: "comuniones",
      birthday: "cumpleanos",
      company: "empresa",
      conference: "conferencias",
      "christmas-dinner": "cenas-navidad",
    };
    return aliases[slug] ?? slug;
  }, [slug]);

  const content = useMemo(() => contentBySlug[normalizedSlug] ?? contentBySlug.bodas, [normalizedSlug]);
  const viewCopy = useMemo(() => viewCopyBySlug[normalizedSlug] ?? viewCopyBySlug.bodas, [normalizedSlug]);
  const useCaseName = content.title.replace("Revelao para ", "");
  const useCaseLower = useCaseName.toLowerCase();
  const heroImages = useMemo(() => {
    const bySlug: Record<string, string[]> = {
      bodas: [weddingHeroImage, nightEventImage, weddingQr],
      comuniones: [stepOneImage, stepTwoImage, stepThreeImage],
      cumpleanos: [stepTwoImage, stepThreeImage, villageEventImage],
      empresa: [stepOneImage, stepFourImage, nightEventImage],
      conferencias: [stepFourImage, stepOneImage, stepTwoImage],
      "cenas-navidad": [nightEventImage, villageEventImage, stepThreeImage],
    };
    return bySlug[normalizedSlug] ?? [weddingQr, stepOneImage, stepTwoImage];
  }, [normalizedSlug]);
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    setHeroIndex(0);
  }, [normalizedSlug]);

  useEffect(() => {
    if (heroImages.length <= 1) return;
    const timer = window.setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 3200);
    return () => window.clearInterval(timer);
  }, [heroImages]);

  const cardTitles = [
    "Participación rápida",
    "Sin fricción",
    "Experiencia",
    "Revelado",
    "Cobertura",
    "Recuerdo compartido",
  ];
  const iconCycle = [QrCode, Camera, Video, Mic, Sparkles, Heart];
  const differentials = content.valuePoints.map((point, index) => {
    const separatorIndex = point.indexOf(":");
    const hasSeparator = separatorIndex > 0;
    const title = hasSeparator ? point.slice(0, separatorIndex).trim() : cardTitles[index % cardTitles.length];
    const text = hasSeparator ? point.slice(separatorIndex + 1).trim() : point;
    return {
      icon: iconCycle[index % iconCycle.length],
      title,
      text,
    };
  });

  const featureSteps = content.flowSteps.map((step, index) => ({
    title: `Paso ${index + 1}`,
    description: step,
  }));

  useEffect(() => {
    document.title = `${content.title} | Revelao.cam`;
  }, [content.title]);

  return (
    <div className="min-h-screen bg-background no-card-hover">
      <header className="fixed top-0 inset-x-0 z-50 border-b border-border bg-white/95 backdrop-blur">
        <div className="container px-4 mx-auto h-14 flex items-center justify-between">
          <a
            href="https://www.revelao.cam"
            className="inline-flex items-center gap-2 rounded-full bg-black text-white px-4 py-2 text-sm font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </a>
          <a
            href={accessDemoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Crear evento
          </a>
        </div>
      </header>
      <main className="pt-14">
        <section className="section-white py-14 md:py-20">
          <div className="container px-4 mx-auto">
            <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="space-y-5">
                <div className="inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
                  {useCaseName} · Demo gratuita disponible
                </div>
                <h1 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight">{viewCopy.heroTitle}</h1>
                <p className="text-base md:text-lg text-muted-foreground max-w-2xl">{content.subtitle}</p>
                <div className="flex flex-wrap gap-2">
                  {content.bullets.map((bullet) => (
                    <span key={bullet} className="rounded-full bg-black text-white px-3 py-1 text-xs">
                      {bullet}
                    </span>
                  ))}
                </div>
                <div className="pt-1 flex flex-wrap gap-3">
                  <Button className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                    <a href={accessDemoUrl} target="_blank" rel="noopener noreferrer">
                      Crear evento
                    </a>
                  </Button>
                </div>
              </div>

              <div className="revelao-card overflow-hidden p-3 md:p-4">
                <div className="relative h-[300px] md:h-[420px] lg:h-[500px]">
                  <img
                    src={heroImages[heroIndex]}
                    alt={`Evento de ${useCaseLower} con QR`}
                    className="h-full w-full rounded-2xl object-cover transition-all duration-500"
                  />
                  {heroImages.length > 1 ? (
                    <>
                      <button
                        type="button"
                        aria-label="Imagen anterior"
                        onClick={() =>
                          setHeroIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length)
                        }
                        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        aria-label="Siguiente imagen"
                        onClick={() => setHeroIndex((prev) => (prev + 1) % heroImages.length)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                        {heroImages.map((_, index) => (
                          <button
                            key={`hero-dot-${index}`}
                            type="button"
                            aria-label={`Ir a imagen ${index + 1}`}
                            onClick={() => setHeroIndex(index)}
                            className={`h-1.5 w-1.5 rounded-full ${
                              index === heroIndex ? "bg-white" : "bg-white/50"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-gray py-8">
          <div className="container px-4 mx-auto">
            <div className="grid gap-4 md:grid-cols-3">
              {viewCopy.highlights.map((item) => (
                <div key={item} className="revelao-card p-5 text-sm md:text-base font-medium">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary" />
                    <span>{item}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="section-gray">
          <Features
            id={`como-funciona-${normalizedSlug}`}
            titleOverride={viewCopy.howTitle}
            ctaOverride="Crear evento"
            cardClassName="!bg-white"
            stepsOverride={featureSteps}
          />
        </div>

        <section className="section-gray py-12">
          <div className="container px-4 mx-auto">
            <div className="revelao-card p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-semibold">{content.valueTitle}</h2>
              <p className="mt-3 text-muted-foreground">{content.intro}</p>
              <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {differentials.map((item) => {
                  const Icon = item.icon;
                  return (
                    <article key={`${item.title}-${item.text}`} className="rounded-2xl border border-border bg-background p-4">
                      <div className="mb-3 inline-flex rounded-full bg-primary/10 p-2 text-primary">
                        <Icon className="h-4 w-4" />
                      </div>
                      <h3 className="text-base font-semibold">{item.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
                    </article>
                  );
                })}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                  <a href={accessDemoUrl} target="_blank" rel="noopener noreferrer">
                    Crear evento
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="section-white pb-12">
          <div className="container px-4 mx-auto">
            <div className="revelao-card !bg-white p-6 md:p-8 text-center">
              <h2 className="text-2xl md:text-3xl font-semibold">{viewCopy.ctaTitle}</h2>
              <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">{viewCopy.ctaText}</p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <Button className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                  <a href={accessDemoUrl} target="_blank" rel="noopener noreferrer">
                    Crear evento
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <div className="section-gray">
          <Pricing />
        </div>
        <div className="section-white">
          <SimpleCTA />
        </div>
        <div className="section-white">
          <section className="py-4 md:py-8 bg-transparent scroll-mt-12 md:scroll-mt-14" id="faqs">
            <div className="container px-4 mx-auto">
              <div className="max-w-3xl mx-auto">
                <FAQs
                  title={content.faqTitle}
                  subtitle=""
                  items={content.faqs}
                />
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
      <WhatsAppFloating />
    </div>
  );
};

export default EventUseCaseLanding;
