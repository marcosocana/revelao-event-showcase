import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Language = "es" | "en" | "it";

type LanguageContextValue = {
  lang: Language;
  setLang: (lang: Language) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "revelao-lang";

export const getAccessBase = (lang: Language) => {
  const suffix = lang === "es" ? "" : `/${lang}`;
  return `https://acceso.revelao.cam${suffix}`;
};

export const getAccessDemoUrl = (lang: Language) =>
  `${getAccessBase(lang)}/nuevoeventodemo`;

export const getAdminLoginUrl = (lang: Language) =>
  `${getAccessBase(lang)}/admin-login`;

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
      tryFree: "Pruébalo gratis",
      accessShort: "Acceder",
      tryShort: "Probar gratis",
    },
    hero: {
      title: "Galería de fotos para eventos",
      titleHighlight: "con QR",
      subtitle:
        "Crea una galería de fotos para eventos como bodas, fiestas o eventos corporativos. Comparte el QR con tus invitados y sube fotos sin app en segundos.",
      bulletAnon: "100% anónimo",
      bulletNoApps: "Sin apps",
      ctaTalk: "¿Hablamos?",
      ctaFree: "Prueba gratis",
      videoFallback: "Tu navegador no soporta el elemento de video.",
    },
    seoHomeMeta: {
      title: "Galería de Fotos para Eventos con QR | Sin App | Revelao.cam",
      description:
        "Galería colaborativa para bodas, fiestas o eventos con QR. Comparte fotos sin app y crea un evento gratis en minutos. Empieza ahora con Revelao.cam.",
      keywords:
        "galería de fotos para eventos, evento con QR, compartir fotos sin app, bodas, fiestas, eventos corporativos",
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
    gallery: {
      title: "¿Para dónde es Revelao?",
      subtitle: "Bodas, fiestas, eventos corporativos y más.",
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
          event: "Fiesta de pueblo",
          quote:
            "En la fiesta del pueblo todo el mundo escaneó el QR y subió fotos sin parar. Al día siguiente fue un espectáculo verlas todas juntas.",
          author: "María G.",
        },
        {
          event: "Aniversario de 25 años",
          quote:
            "Una forma única de capturar momentos especiales. Nuestros invitados no pararon de hacer fotos durante toda la celebración.",
          author: "Roberto P.",
        },
        {
          event: "Boda",
          quote:
            "En nuestra boda los invitados se engancharon al momento del revelado. Fue emocionante ver las fotos aparecer todas a la vez.",
          author: "Claudia T.",
        },
      ],
    },
    templates: {
      title: "Plantillas",
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
        { title: "Demo", subtitle: "Hasta 10 fotos", cta: "Pruébalo gratis" },
        { title: "Start", cta: "Elegir" },
        { title: "Plus", cta: "Elegir", badge: "Más popular" },
        { title: "Pro", cta: "Elegir" },
      ],
      more: "¿No te encaja ningún plan?",
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
      title: "¿Quieres probarlo?",
      subtitle:
        "Crea un evento de prueba gratuito y descubre cómo funciona la experiencia completa de Revelao. Sin compromiso, sin tarjeta.",
      cta: "Prueba gratis",
      badges: "✓ Sin registro · ✓ Sin tarjeta · ✓ Listo en 30 segundos",
    },
    trialReminder: {
      title: "¿Listo para tu próximo evento?",
      subtitle:
        "Activa tu QR en minutos y deja que tus invitados llenen la galería sin esfuerzo.",
      cta: "Crear evento gratis",
      badges: "✓ Sin apps · ✓ QR instantáneo · ✓ Galería privada",
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
          a: "Cada plan tiene unas características concretas. Elige el que mejor se adapte a tu evento.",
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
        "Entonces puedes acceder al panel de control para gestionarlo en cualquier momento.",
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
    seoHome: {
      title: "¿Qué es Revelao?",
      intro:
        "Revelao.cam es una galería de fotos para eventos con QR pensada para bodas, fiestas y celebraciones donde quieres reunir todas las imágenes en un solo lugar. En lugar de depender de grupos de WhatsApp o carpetas dispersas, creas un evento, compartes un código QR y tus invitados suben fotos al instante, sin app y sin registros largos. El resultado es una galería colaborativa limpia, organizada y lista para revivir el evento.",
      sections: [
        {
          title: "¿Por qué una galería de fotos para eventos con QR?",
          body: [
            "En eventos reales la gente hace fotos en muchos móviles y luego es un caos encontrarlas. Con Revelao, la galería se centraliza desde el primer minuto. Cada invitado escanea el QR y accede directamente a subir sus fotos. No hay fricción, por eso la participación es más alta y la colección final es mucho más completa.",
            "Además, al ser una galería colaborativa, todos pueden aportar desde cualquier lugar del evento y en cualquier momento. El QR puede estar en mesas, carteles o tarjetas. Así, la experiencia es simple y natural para cualquier invitado.",
            "El resultado es una galería de fotos para eventos que no depende de una sola persona. Todos contribuyen y la historia del evento queda completa.",
          ],
        },
        {
          title: "Sin app, rápido y con control total",
          body: [
            "La mayoría de soluciones fallan porque obligan a descargar una app. Aquí no hace falta: el acceso es por navegador y el QR abre el evento en segundos. Eso elimina barreras y mejora la cantidad de fotos subidas.",
            "Tú decides cuánto dura la subida y cuándo se revela el contenido. La galería queda protegida y lista para compartir con los invitados cuando quieras.",
            "También puedes descargar todas las fotos al final o mantenerlas disponibles durante el tiempo que necesites.",
          ],
        },
        {
          title: "Ideal para bodas, fiestas y eventos corporativos",
          body: [
            "Para una boda, el QR te permite reunir fotos de todos los invitados sin perder nada. Para una fiesta, crea un ambiente colaborativo y divertido. Para eventos corporativos, centraliza la cobertura y facilita el acceso a la galería final.",
            "En todos los casos, Revelao te ofrece una galería de fotos para eventos con QR, sin app y con una experiencia clara para anfitriones e invitados.",
            "Funciona igual de bien para aniversarios, graduaciones o reuniones familiares donde todos quieren compartir fotos.",
          ],
        },
      ],
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
      title: "Photo gallery for events",
      titleHighlight: "with QR",
      subtitle:
        "Create a collaborative gallery for weddings, parties or corporate events. Share the QR and let guests upload photos without any app.",
      bulletAnon: "100% anonymous",
      bulletNoApps: "No apps",
      ctaTalk: "Let's talk",
      ctaFree: "Try for free",
      videoFallback: "Your browser does not support the video tag.",
    },
    seoHomeMeta: {
      title: "Event Photo Gallery with QR | No App | Revelao.cam",
      description:
        "Collaborative gallery for weddings, parties or events with QR. Share photos without an app and create a free event in minutes.",
      keywords:
        "event photo gallery, qr event, share photos without app, weddings, parties, corporate events",
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
    gallery: {
      title: "Where is Revelao for?",
      subtitle: "Weddings, parties, corporate events, and more.",
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
        { title: "Demo", subtitle: "Up to 10 photos", cta: "Try for free" },
        { title: "Start", cta: "Choose" },
        { title: "Plus", cta: "Choose", badge: "Most popular" },
        { title: "Pro", cta: "Choose" },
      ],
      more: "Doesn’t any plan fit?",
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
      title: "Want to try it?",
      subtitle:
        "Create a free demo event and discover the full Revelao experience. No commitment, no card.",
      cta: "Try for free",
      badges: "✓ No signup · ✓ No card · ✓ Ready in 30 seconds",
    },
    trialReminder: {
      title: "Ready for your next event?",
      subtitle:
        "Generate your QR in minutes and let guests fill the gallery effortlessly.",
      cta: "Create free event",
      badges: "✓ No apps · ✓ Instant QR · ✓ Private gallery",
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
          a: "Each plan has specific features. Choose the one that best fits your event.",
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
        "Then you can access the control panel to manage it anytime.",
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
    seoHome: {
      title: "What is Revelao?",
      intro:
        "Revelao.cam is a QR-based photo gallery for events designed for weddings, parties and celebrations where you want all images in one place. Instead of relying on WhatsApp groups or messy folders, you create an event, share a QR code, and guests upload photos instantly without an app. The result is a clean, collaborative gallery ready to relive the day.",
      sections: [
        {
          title: "Why a QR photo gallery for events?",
          body: [
            "At real events, photos live on many phones and it’s hard to collect them. With Revelao, the gallery is centralized from minute one. Each guest scans the QR and uploads photos right away. No friction means higher participation and a richer gallery.",
            "Because it’s collaborative, everyone contributes from anywhere during the event. Place the QR on tables, signs or cards so it feels effortless for guests.",
            "The final result is a complete event story, not just a few isolated photos.",
          ],
        },
        {
          title: "No app, fast, and fully controlled",
          body: [
            "Most tools fail because they require an app. Here, access is via browser and the QR opens the event in seconds. That removes barriers and increases uploads.",
            "You control the upload window and when the gallery is revealed. The result is private, organized, and ready to share.",
            "You can also download everything later or keep the gallery available for guests.",
          ],
        },
        {
          title: "Perfect for weddings, parties, and corporate events",
          body: [
            "For weddings, the QR lets you collect photos from every guest. For parties, it creates a fun collaborative vibe. For corporate events, it centralizes coverage and simplifies sharing.",
            "In every case, Revelao delivers a QR photo gallery for events with no app and a clear experience for hosts and guests.",
            "It also works well for anniversaries, graduations, and family gatherings.",
          ],
        },
      ],
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
      title: "Galleria foto per eventi",
      titleHighlight: "con QR",
      subtitle:
        "Crea una galleria collaborativa per matrimoni, feste o eventi aziendali. Condividi il QR e gli invitati caricano foto senza app.",
      bulletAnon: "100% anonimo",
      bulletNoApps: "Senza app",
      ctaTalk: "Parliamone",
      ctaFree: "Prova gratis",
      videoFallback: "Il tuo browser non supporta il video.",
    },
    seoHomeMeta: {
      title: "Galleria Foto per Eventi con QR | Senza App | Revelao.cam",
      description:
        "Galleria collaborativa per matrimoni, feste o eventi con QR. Condividi foto senza app e crea un evento gratis in pochi minuti.",
      keywords:
        "galleria foto per eventi, evento con QR, condividere foto senza app, matrimoni, feste, eventi aziendali",
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
    gallery: {
      title: "Per quali eventi è Revelao?",
      subtitle: "Matrimoni, feste, eventi aziendali e molto altro.",
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
        { title: "Demo", subtitle: "Fino a 10 foto", cta: "Prova gratis" },
        { title: "Start", cta: "Scegli" },
        { title: "Plus", cta: "Scegli", badge: "Più popolare" },
        { title: "Pro", cta: "Scegli" },
      ],
      more: "Nessun piano fa al caso tuo?",
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
      title: "Vuoi provarlo?",
      subtitle:
        "Crea un evento demo gratuito e scopri l’esperienza completa di Revelao. Senza impegno.",
      cta: "Prova gratis",
      badges: "✓ Nessuna registrazione · ✓ Nessuna carta · ✓ Pronto in 30 secondi",
    },
    trialReminder: {
      title: "Pronto per il tuo prossimo evento?",
      subtitle:
        "Crea il QR in pochi minuti e lascia che gli invitati riempiano la galleria senza sforzo.",
      cta: "Crea evento gratis",
      badges: "✓ Nessuna app · ✓ QR istantaneo · ✓ Galleria privata",
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
          a: "Ogni piano ha caratteristiche specifiche. Scegli quello più adatto al tuo evento.",
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
        "Puoi accedere al pannello di controllo per gestirlo in qualsiasi momento.",
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
    seoHome: {
      title: "Che cos'è Revelao?",
      intro:
        "Revelao.cam è una galleria fotografica per eventi con QR pensata per matrimoni, feste e celebrazioni dove vuoi tutte le immagini in un unico posto. Invece di usare gruppi WhatsApp o cartelle disordinate, crei un evento, condividi un QR e gli invitati caricano foto subito senza app. Il risultato è una galleria collaborativa pulita e pronta da rivivere.",
      sections: [
        {
          title: "Perché una galleria foto per eventi con QR?",
          body: [
            "Durante gli eventi reali le foto finiscono su tanti telefoni e poi è difficile raccoglierle. Con Revelao la galleria è centralizzata fin dal primo minuto. Ogni invitato scansiona il QR e carica le foto in un attimo.",
            "Essendo una galleria collaborativa, tutti possono contribuire da qualsiasi punto dell’evento. Metti il QR sui tavoli o sui cartelli e diventa naturale partecipare.",
            "Il risultato è un racconto completo dell’evento, non solo poche foto sparse.",
          ],
        },
        {
          title: "Senza app, veloce e sotto controllo",
          body: [
            "Molte soluzioni falliscono perché richiedono un’app. Qui l’accesso è via browser e il QR apre l’evento in pochi secondi. Meno attriti, più foto.",
            "Puoi decidere la durata del caricamento e quando rivelare la galleria. Tutto rimane privato e ordinato.",
            "Puoi anche scaricare tutte le foto o mantenere la galleria attiva per gli invitati.",
          ],
        },
        {
          title: "Ideale per matrimoni, feste ed eventi aziendali",
          body: [
            "Per un matrimonio, il QR raccoglie le foto di tutti gli invitati. Per una festa, crea un’esperienza condivisa. Per eventi aziendali, centralizza la copertura e semplifica la condivisione.",
            "In ogni caso, Revelao offre una galleria foto per eventi con QR senza app e con un’esperienza chiara per host e invitati.",
            "È adatto anche per anniversari, lauree e riunioni di famiglia.",
          ],
        },
      ],
    },
  },
};

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
    return saved ?? "es";
  });

  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith("/en/") || path === "/en") {
      setLang("en");
      return;
    }
    if (path.startsWith("/it/") || path === "/it") {
      setLang("it");
      return;
    }
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
