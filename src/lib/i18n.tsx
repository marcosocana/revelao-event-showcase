import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Language = "es" | "en" | "it";

type LanguageContextValue = {
  lang: Language;
  setLang: (lang: Language) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "revelao-lang";

export const translations = {
  es: {
    nav: {
      how: "Cómo funciona",
      testimonials: "Testimonios",
      templates: "Plantillas",
      pricing: "Precio",
      blog: "Blog",
      faqs: "FAQs",
      access: "Accede a tu evento",
      tryFree: "Pruebalo gratis",
      accessShort: "Acceder",
      tryShort: "Probar gratis",
    },
    hero: {
      title: "Captura hoy,",
      titleHighlight: "revela mañana",
      subtitle:
        "Tus invitados suben fotos de forma anónima durante el evento. La magia ocurre al día siguiente cuando todas las imágenes se revelan a la misma hora.",
      bulletAnon: "100% anónimo",
      bulletNoApps: "Sin apps",
      ctaTalk: "¿Hablamos?",
      ctaFree: "Prueba gratis",
      videoFallback: "Tu navegador no soporta el elemento de video.",
    },
    features: {
      title: "Cómo funciona",
      subtitle: "Explora la experiencia Revelao en solo 4 pasos:",
      steps: [
        {
          title: "Escanea el código QR",
          description:
            "Tus invitados escanean el código QR que encontrarán en carteles, tarjetas, etc...",
        },
        {
          title: "Captura los mejores momentos",
          description:
            "Todos los invitados pueden tomar fotos durante el evento de forma anónima",
        },
        {
          title: "La expectación aumenta...",
          description:
            "Las fotos permanecen ocultas durante el evento, creando misterio y emoción",
        },
        {
          title: "Día de revelado",
          description:
            "Al día siguiente, todas las fotos se revelan en una galería privada para revivir los mejores momentos y que todos puedan volver a revivir el evento",
        },
      ],
      videoTitle: "Activa el sonido y siente el hype del revelado.",
      videoSubtitle: "Ideal para bodas, cumpleaños y eventos corporativos.",
      videoLabel: "Revelao - Video demostración",
    },
    stories: {
      title: "Lo que dicen de nosotros",
      subtitle: "Eventos que crearon expectación y capturaron momentos únicos",
      items: [
        {
          event: "Boda de Laura y Carlos",
          quote:
            "Las fotos anónimas crearon un ambiente mágico. Al día siguiente todos estábamos pegados al móvil esperando la revelación.",
          author: "Laura M.",
        },
        {
          event: "Cumpleaños de 30",
          quote:
            "Mis amigos se volvieron locos subiendo fotos. No saber qué había capturado cada uno hizo la espera insoportable (en el buen sentido).",
          author: "Diego R.",
        },
        {
          event: "Cena de empresa",
          quote:
            "Usamos Revelao.cam en nuestro evento corporativo. El nivel de participación fue increíble, todo el equipo involucrado.",
          author: "Ana S., HR Manager",
        },
      ],
      itemsMobileExtra: [
        {
          event: "Fiesta de graduación",
          quote:
            "Todos mis compañeros participaron activamente. La expectación por ver las fotos al día siguiente fue increíble.",
          author: "María G.",
        },
        {
          event: "Aniversario de 25 años",
          quote:
            "Una forma única de capturar momentos especiales. Nuestros invitados no pararon de hacer fotos durante toda la celebración.",
          author: "Roberto P.",
        },
        {
          event: "Evento de networking",
          quote:
            "Revelao rompió el hielo de forma natural. Todo el mundo quería participar y ver qué fotos habían capturado los demás.",
          author: "Claudia T.",
        },
      ],
    },
    templates: {
      title: "Plantillas personalizadas",
      subtitle:
        "Descarga carteles con código QR para tu evento. Si no sabes cómo hacerlo, te lo hacemos nosotros de forma gratuita",
      cta: "Descargar",
    },
    pricing: {
      title: "Precio",
      subtitle: "Elige el plan ideal según el tamaño de tu evento",
      untilGuests: "Hasta {guests} invitados",
      perEvent: "/evento",
      perGuest: "por invitado",
      features: [
        "Fotos ilimitadas",
        "Galería privada 20 días",
        "Descarga en alta calidad",
        "Personalización de marca",
        "Soporte para dudas",
      ],
      plans: [
        { title: "Demo", subtitle: "Solo 10 fotos", cta: "Pruébalo gratis" },
        { title: "Pequeño", cta: "Elegir" },
        { title: "Mediano", cta: "Elegir", badge: "Más popular" },
        { title: "Grande", cta: "Elegir" },
        { title: "XL", cta: "Elegir" },
      ],
      more: "¿Más de 1000 invitados?",
      whatsapp: "Escríbenos por WhatsApp",
    },
    blog: {
      title: "Blog",
      subtitle:
        "Contenido útil e interesante sobre el mundo de los eventos, ideas y tendencias para inspirarte.",
      readMore: "Leer más",
      seeMore: "Ver más",
    },
    freeTrial: {
      title: "¿Quieres probarlo antes?",
      subtitle:
        "Crea un evento de prueba gratuito y descubre cómo funciona la experiencia completa de Revelao. Sin compromiso, sin tarjeta.",
      cta: "Prueba gratis",
      badges: "✓ Sin registro · ✓ Sin tarjeta · ✓ Listo en 30 segundos",
    },
    faqs: {
      title: "Preguntas frecuentes",
      subtitle: "Resuelve tus dudas sobre Revelao",
      items: [
        {
          q: "¿Cómo funciona Revelao?",
          a:
            "¡Muy fácil! Contáctanos y te explicamos cómo dar de alta tu evento. Todos los invitados —ya sea en una boda, cumpleaños, cena de empresa o concierto— podrán subir sus fotos a la plataforma durante el evento. Y aquí viene la magia: al día siguiente ocurre la \"revelación\". Todas las imágenes estarán disponibles, de forma anónima, en nuestra plataforma para que todos las disfruten.",
        },
        {
          q: "¿Por qué esperar para ver las fotos?",
          a:
            "Porque esa es la esencia de Revelao.cam: recuperar la emoción de no saber cómo salieron tus fotos hasta que se revelan. Es parte de la experiencia divertida, nostálgica y única.",
        },
        {
          q: "¿Necesito instalar algo?",
          a:
            "¡Nada! Todo funciona desde tu navegador, sin descargas ni apps. Solo necesitas conexión a internet.",
        },
        {
          q: "¿Puedo usarlo en cualquier dispositivo?",
          a:
            "Sí, Revelao.cam está optimizado para móviles (iOS y Android) y ordenadores. Solo asegúrate de usar un navegador actualizado.",
        },
        {
          q: "¿Cuántas fotos puedo hacer?",
          a: "¡Sin límites! Cada invitado puede subir tantas fotos como quiera.",
        },
        {
          q: "¿Qué pasa cuando se revelan las fotos?",
          a:
            "Todos los invitados podrán acceder al mismo QR o entrar en nuestra web para ver el evento. Desde ahí podrán visualizar todas las fotos, descargarlas, dar likes, compartirlas y mucho más.",
        },
        {
          q: "¿Es seguro?",
          a: "Sí. Tus fotos son privadas y solo quienes tengan el código QR podrán verlas.",
        },
        {
          q: "¿Cuánto cuesta?",
          a:
            "Consulta nuestros planes en la web. Tenemos varias opciones según el número de invitados y el tipo de evento.",
        },
        {
          q: "¿Puedo usarlo para bodas, fiestas o viajes?",
          a:
            "¡Por supuesto! Revelao.cam es perfecto para cualquier ocasión donde quieras añadir diversión, sorpresa y recuerdos inolvidables.",
        },
      ],
    },
    cta: {
      leftTitle: "¿Sigues teniendo dudas?",
      leftText:
        "Contáctanos por WhatsApp y te estaremos encantados de poder ayudarte.",
      leftButton: "¿Hablamos?",
      rightTitle: "¿Ya has creado tu evento?",
      rightText:
        "Si ya nos has contactado y has creado un evento, puedes acceder a nuestra plataforma.",
      rightButton: "Acceder a Revelao",
    },
    footer: {
      how: "Cómo funciona",
      pricing: "Precio",
      cases: "Casos de éxito",
      blog: "Blog",
      access: "Acceso",
      contact: "Contacto",
    },
    pricingModal: {
      title: "Elige tu plan",
      subtitle: "¿Cuántos invitados tiene tu evento?",
      moreGuests: "Más de 1000 invitados",
      untilGuests: "Hasta {guests} invitados",
      perEvent: "/evento",
      perGuest: "por invitado",
      choose: "Elegir plan",
      contact: "Contactar",
      features: [
        "Fotos ilimitadas",
        "Galería privada 20 días",
        "Descarga en alta calidad",
        "Personalización de marca",
        "Soporte para dudas",
      ],
    },
    loginBanner: {
      text:
        "Si todavía no has creado un evento, ahora puedes hacerlo gratis o ver los planes disponibles.",
      free: "Pruébalo gratis",
      plans: "Ver planes",
    },
  },
  en: {
    nav: {
      how: "How it works",
      testimonials: "Testimonials",
      templates: "Templates",
      pricing: "Pricing",
      blog: "Blog",
      faqs: "FAQs",
      access: "Access your event",
      tryFree: "Try for free",
      accessShort: "Access",
      tryShort: "Try free",
    },
    hero: {
      title: "Capture today,",
      titleHighlight: "reveal tomorrow",
      subtitle:
        "Your guests upload photos anonymously during the event. The magic happens the next day when all images are revealed at the same time.",
      bulletAnon: "100% anonymous",
      bulletNoApps: "No apps",
      ctaTalk: "Let's talk",
      ctaFree: "Try for free",
      videoFallback: "Your browser does not support the video tag.",
    },
    features: {
      title: "How it works",
      subtitle: "Explore the Revelao experience in just 4 steps:",
      steps: [
        {
          title: "Scan the QR code",
          description:
            "Guests scan the QR code they’ll find on posters, cards, etc.",
        },
        {
          title: "Capture the best moments",
          description:
            "All guests can take photos during the event anonymously",
        },
        {
          title: "Anticipation grows...",
          description:
            "Photos stay hidden during the event, creating mystery and excitement",
        },
        {
          title: "Reveal day",
          description:
            "The next day, all photos are revealed in a private gallery to relive the best moments",
        },
      ],
      videoTitle: "Turn on the sound and feel the reveal hype.",
      videoSubtitle: "Perfect for weddings, birthdays and corporate events.",
      videoLabel: "Revelao - Demo video",
    },
    stories: {
      title: "What people say",
      subtitle: "Events that built anticipation and captured unique moments",
      items: [
        {
          event: "Laura & Carlos' wedding",
          quote:
            "The anonymous photos created a magical atmosphere. The next day we were glued to our phones waiting for the reveal.",
          author: "Laura M.",
        },
        {
          event: "30th birthday",
          quote:
            "My friends went crazy uploading photos. Not knowing what each person captured made the wait thrilling.",
          author: "Diego R.",
        },
        {
          event: "Company dinner",
          quote:
            "We used Revelao.cam at our corporate event. Participation was incredible; the whole team was involved.",
          author: "Ana S., HR Manager",
        },
      ],
      itemsMobileExtra: [
        {
          event: "Graduation party",
          quote:
            "Everyone participated actively. The anticipation to see the photos the next day was amazing.",
          author: "Maria G.",
        },
        {
          event: "25th anniversary",
          quote:
            "A unique way to capture special moments. Our guests never stopped taking photos.",
          author: "Robert P.",
        },
        {
          event: "Networking event",
          quote:
            "Revelao broke the ice naturally. Everyone wanted to join and see what others captured.",
          author: "Claudia T.",
        },
      ],
    },
    templates: {
      title: "Custom templates",
      subtitle:
        "Download QR posters for your event. If you don’t know how, we’ll do it for you for free.",
      cta: "Download",
    },
    pricing: {
      title: "Pricing",
      subtitle: "Choose the ideal plan based on your event size",
      untilGuests: "Up to {guests} guests",
      perEvent: "/event",
      perGuest: "per guest",
      features: [
        "Unlimited photos",
        "Private gallery for 20 days",
        "High-quality download",
        "Brand customization",
        "Support",
      ],
      plans: [
        { title: "Demo", subtitle: "Only 10 photos", cta: "Try for free" },
        { title: "Small", cta: "Choose" },
        { title: "Medium", cta: "Choose", badge: "Most popular" },
        { title: "Large", cta: "Choose" },
        { title: "XL", cta: "Choose" },
      ],
      more: "More than 1000 guests?",
      whatsapp: "Write to us on WhatsApp",
    },
    blog: {
      title: "Blog",
      subtitle:
        "Useful and interesting content about events, ideas and trends to inspire you.",
      readMore: "Read more",
      seeMore: "See more",
    },
    freeTrial: {
      title: "Want to try it first?",
      subtitle:
        "Create a free demo event and discover the full Revelao experience. No commitment, no card.",
      cta: "Try for free",
      badges: "✓ No signup · ✓ No card · ✓ Ready in 30 seconds",
    },
    faqs: {
      title: "FAQs",
      subtitle: "Solve your doubts about Revelao",
      items: [
        {
          q: "How does Revelao work?",
          a:
            "Very easy! Contact us and we’ll explain how to set up your event. Guests can upload photos during the event. The next day comes the reveal: all images are available anonymously for everyone to enjoy.",
        },
        {
          q: "Why wait to see the photos?",
          a:
            "Because it’s the essence of Revelao.cam: bringing back the excitement of not knowing until the reveal.",
        },
        {
          q: "Do I need to install anything?",
          a:
            "Nope! Everything works in your browser, no downloads or apps required.",
        },
        {
          q: "Can I use it on any device?",
          a:
            "Yes, Revelao.cam is optimized for mobile (iOS and Android) and desktop. Just use an updated browser.",
        },
        {
          q: "How many photos can I take?",
          a: "Unlimited! Each guest can upload as many photos as they want.",
        },
        {
          q: "What happens when photos are revealed?",
          a:
            "Guests can access the same QR or the website to view, download, like and share all photos.",
        },
        {
          q: "Is it safe?",
          a:
            "Yes. Your photos are private and only people with the QR code can see them.",
        },
        {
          q: "How much does it cost?",
          a:
            "Check our plans on the website. We have several options based on guests and event type.",
        },
        {
          q: "Can I use it for weddings, parties or trips?",
          a:
            "Absolutely! Revelao.cam is perfect for any occasion where you want fun, surprise and unforgettable memories.",
        },
      ],
    },
    cta: {
      leftTitle: "Still have questions?",
      leftText:
        "Contact us on WhatsApp and we’ll be happy to help you.",
      leftButton: "Let's talk",
      rightTitle: "Already created your event?",
      rightText:
        "If you’ve already contacted us and created an event, you can access our platform.",
      rightButton: "Access Revelao",
    },
    footer: {
      how: "How it works",
      pricing: "Pricing",
      cases: "Success stories",
      blog: "Blog",
      access: "Access",
      contact: "Contact",
    },
    pricingModal: {
      title: "Choose your plan",
      subtitle: "How many guests does your event have?",
      moreGuests: "More than 1000 guests",
      untilGuests: "Up to {guests} guests",
      perEvent: "/event",
      perGuest: "per guest",
      choose: "Choose plan",
      contact: "Contact",
      features: [
        "Unlimited photos",
        "Private gallery for 20 days",
        "High-quality download",
        "Brand customization",
        "Support",
      ],
    },
    loginBanner: {
      text:
        "If you haven't created an event yet, you can do it for free or view available plans.",
      free: "Try for free",
      plans: "See plans",
    },
  },
  it: {
    nav: {
      how: "Come funziona",
      testimonials: "Testimonianze",
      templates: "Modelli",
      pricing: "Prezzi",
      blog: "Blog",
      faqs: "FAQ",
      access: "Accedi al tuo evento",
      tryFree: "Provalo gratis",
      accessShort: "Accedi",
      tryShort: "Prova gratis",
    },
    hero: {
      title: "Scatta oggi,",
      titleHighlight: "rivela domani",
      subtitle:
        "I tuoi invitati caricano foto in modo anonimo durante l’evento. La magia avviene il giorno dopo quando tutte le immagini vengono rivelate alla stessa ora.",
      bulletAnon: "100% anonimo",
      bulletNoApps: "Senza app",
      ctaTalk: "Parliamone",
      ctaFree: "Prova gratis",
      videoFallback: "Il tuo browser non supporta il video.",
    },
    features: {
      title: "Come funziona",
      subtitle: "Scopri l’esperienza Revelao in soli 4 passaggi:",
      steps: [
        {
          title: "Scansiona il QR",
          description:
            "Gli invitati scansionano il QR che trovano su poster, cartoline, ecc.",
        },
        {
          title: "Cattura i momenti migliori",
          description:
            "Tutti possono scattare foto durante l’evento in modo anonimo",
        },
        {
          title: "L’attesa cresce...",
          description:
            "Le foto restano nascoste durante l’evento, creando mistero ed emozione",
        },
        {
          title: "Giorno della rivelazione",
          description:
            "Il giorno dopo tutte le foto vengono rivelate in una galleria privata",
        },
      ],
      videoTitle: "Attiva l’audio e vivi il reveal.",
      videoSubtitle: "Ideale per matrimoni, compleanni ed eventi aziendali.",
      videoLabel: "Revelao - Video dimostrativo",
    },
    stories: {
      title: "Cosa dicono di noi",
      subtitle: "Eventi che hanno creato attesa e momenti unici",
      items: [
        {
          event: "Matrimonio di Laura e Carlos",
          quote:
            "Le foto anonime hanno creato un’atmosfera magica. Il giorno dopo eravamo tutti incollati al telefono.",
          author: "Laura M.",
        },
        {
          event: "Compleanno dei 30",
          quote:
            "I miei amici hanno caricato tantissime foto. L’attesa è stata bellissima.",
          author: "Diego R.",
        },
        {
          event: "Cena aziendale",
          quote:
            "Abbiamo usato Revelao.cam al nostro evento corporate. Partecipazione incredibile.",
          author: "Ana S., HR Manager",
        },
      ],
      itemsMobileExtra: [
        {
          event: "Festa di laurea",
          quote:
            "Tutti hanno partecipato attivamente. L’attesa per le foto era incredibile.",
          author: "Maria G.",
        },
        {
          event: "Anniversario di 25 anni",
          quote:
            "Un modo unico per catturare momenti speciali. Gli invitati non hanno smesso di scattare foto.",
          author: "Roberto P.",
        },
        {
          event: "Evento di networking",
          quote:
            "Revelao ha rotto il ghiaccio in modo naturale. Tutti volevano partecipare.",
          author: "Claudia T.",
        },
      ],
    },
    templates: {
      title: "Modelli personalizzati",
      subtitle:
        "Scarica poster QR per il tuo evento. Se non sai come fare, lo facciamo noi gratis.",
      cta: "Scarica",
    },
    pricing: {
      title: "Prezzi",
      subtitle: "Scegli il piano ideale in base alla dimensione dell’evento",
      untilGuests: "Fino a {guests} invitati",
      perEvent: "/evento",
      perGuest: "per invitato",
      features: [
        "Foto illimitate",
        "Galleria privata 20 giorni",
        "Download alta qualità",
        "Personalizzazione del brand",
        "Supporto",
      ],
      plans: [
        { title: "Demo", subtitle: "Solo 10 foto", cta: "Prova gratis" },
        { title: "Piccolo", cta: "Scegli" },
        { title: "Medio", cta: "Scegli", badge: "Più popolare" },
        { title: "Grande", cta: "Scegli" },
        { title: "XL", cta: "Scegli" },
      ],
      more: "Più di 1000 invitati?",
      whatsapp: "Scrivici su WhatsApp",
    },
    blog: {
      title: "Blog",
      subtitle:
        "Contenuti utili e interessanti sul mondo degli eventi, idee e tendenze per ispirarti.",
      readMore: "Leggi di più",
      seeMore: "Vedi altro",
    },
    freeTrial: {
      title: "Vuoi provarlo prima?",
      subtitle:
        "Crea un evento demo gratuito e scopri l’esperienza completa di Revelao. Senza impegno.",
      cta: "Prova gratis",
      badges: "✓ Nessuna registrazione · ✓ Nessuna carta · ✓ Pronto in 30 secondi",
    },
    faqs: {
      title: "FAQ",
      subtitle: "Chiarisci i dubbi su Revelao",
      items: [
        {
          q: "Come funziona Revelao?",
          a:
            "È semplice! Contattaci e ti spieghiamo come creare l’evento. Gli invitati caricano le foto durante l’evento, e il giorno dopo avviene la rivelazione.",
        },
        {
          q: "Perché aspettare per vedere le foto?",
          a:
            "Perché è l’essenza di Revelao.cam: l’emozione della rivelazione.",
        },
        {
          q: "Devo installare qualcosa?",
          a:
            "No! Tutto funziona nel browser, senza download né app.",
        },
        {
          q: "Posso usarlo su qualsiasi dispositivo?",
          a:
            "Sì, Revelao.cam è ottimizzato per mobile e desktop. Usa un browser aggiornato.",
        },
        {
          q: "Quante foto posso fare?",
          a: "Illimitate! Ogni invitato può caricare tutte le foto che vuole.",
        },
        {
          q: "Cosa succede quando le foto vengono rivelate?",
          a:
            "Gli invitati possono accedere al QR o al sito per vedere, scaricare e condividere le foto.",
        },
        {
          q: "È sicuro?",
          a:
            "Sì. Le foto sono private e solo chi ha il QR può vederle.",
        },
        {
          q: "Quanto costa?",
          a:
            "Consulta i nostri piani sul sito. Ci sono opzioni per numero di invitati.",
        },
        {
          q: "Posso usarlo per matrimoni, feste o viaggi?",
          a:
            "Certo! Revelao.cam è perfetto per qualsiasi occasione speciale.",
        },
      ],
    },
    cta: {
      leftTitle: "Hai ancora dubbi?",
      leftText:
        "Contattaci su WhatsApp, saremo felici di aiutarti.",
      leftButton: "Parliamone",
      rightTitle: "Hai già creato il tuo evento?",
      rightText:
        "Se hai già creato un evento, puoi accedere alla piattaforma.",
      rightButton: "Accedi a Revelao",
    },
    footer: {
      how: "Come funziona",
      pricing: "Prezzi",
      cases: "Casi di successo",
      blog: "Blog",
      access: "Accesso",
      contact: "Contatto",
    },
    pricingModal: {
      title: "Scegli il tuo piano",
      subtitle: "Quanti invitati ha il tuo evento?",
      moreGuests: "Più di 1000 invitati",
      untilGuests: "Fino a {guests} invitati",
      perEvent: "/evento",
      perGuest: "per invitato",
      choose: "Scegli piano",
      contact: "Contattaci",
      features: [
        "Foto illimitate",
        "Galleria privata 20 giorni",
        "Download alta qualità",
        "Personalizzazione del brand",
        "Supporto",
      ],
    },
    loginBanner: {
      text:
        "Se non hai ancora creato un evento, puoi farlo gratis o vedere i piani disponibili.",
      free: "Prova gratis",
      plans: "Vedi piani",
    },
  },
};

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
    return saved ?? "es";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang }), [lang]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useI18n = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useI18n must be used within LanguageProvider");
  }
  return ctx;
};
