import weddingImg from "@/assets/testimonial-wedding.jpg";
import birthdayImg from "@/assets/testimonial-birthday.jpg";
import corporateImg from "@/assets/testimonial-corporate.jpg";

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  publishedAt?: string;
  updatedAt?: string;
  excerpt: string;
  contentHtml: string;
  image: string;
  tags?: string[];
};

export type BlogLanguage = "es" | "en" | "it";

export const blogPostsByLang: Record<BlogLanguage, BlogPost[]> = {
  es: [
    {
      slug: "ideas-para-fotos-de-evento",
      title: "10 ideas para fotos que tus invitados sí querrán compartir",
      date: "20 Enero 2026",
      excerpt:
        "Desde rincones con luz suave hasta prompts divertidos, aquí tienes un checklist simple para elevar la participación.",
      image: weddingImg,
      contentHtml:
        "<p>Pon un fondo claro y una luz lateral suave para evitar sombras duras.</p>" +
        "<p>Aprovecha los primeros 30 minutos del evento para captar a la gente con energía.</p>" +
        "<p>Crea 3 prompts cortos: “haz tu mejor pose”, “foto con el anfitrión”, “grupo por mesa”.</p>" +
        "<p>Guarda espacio para fotos espontáneas, no todo debe ser posado.</p>",
      tags: ["Eventos", "Tips", "Participación"],
    },
    {
      slug: "como-elegir-plantillas",
      title: "Cómo elegir la plantilla perfecta según tu tipo de evento",
      date: "05 Febrero 2026",
      excerpt:
        "Bodas, cumpleaños o corporativos: cada evento comunica distinto. Elige tipografías y colores que refuercen el tono.",
      image: corporateImg,
      contentHtml:
        "<p>Eventos elegantes: tipografías serif y colores neutros.</p>" +
        "<p>Eventos casuales: tonos vivos y fuentes sans con buen contraste.</p>" +
        "<p>Corporativos: mantén consistencia con el branding y logo.</p>" +
        "<p>Recuerda: menos es más; una buena plantilla respira.</p>",
      tags: ["Plantillas", "Branding"],
    },
    {
      slug: "como-aumentar-participacion",
      title: "Cómo aumentar la participación de tus invitados en 5 pasos",
      date: "12 Febrero 2026",
      excerpt:
        "Pequeños cambios en el flujo y la comunicación pueden duplicar el número de fotos.",
      image: birthdayImg,
      contentHtml:
        "<p>Haz visible el QR: entrada, mesa y barra.</p>" +
        "<p>Recuerda el CTA en momentos clave del evento.</p>" +
        "<p>Premia con una dinámica simple: “foto + brindis”.</p>" +
        "<p>Muestra un ejemplo de foto para inspirar.</p>",
      tags: ["Participación", "Eventos"],
    },
    {
      slug: "errores-comunes-en-fotos",
      title: "Errores comunes al montar un rincón de fotos (y cómo evitarlos)",
      date: "15 Febrero 2026",
      excerpt:
        "Desde la iluminación hasta el fondo: evita lo que arruina fotos aunque tengas buena cámara.",
      image: weddingImg,
      contentHtml:
        "<p>No coloques el fondo frente a ventanas con luz dura.</p>" +
        "<p>Evita fondos muy cargados que compiten con las personas.</p>" +
        "<p>Deja espacio suficiente para grupos de 4-6 personas.</p>" +
        "<p>Prueba la cámara desde varios ángulos antes del evento.</p>",
      tags: ["Producción", "Tips"],
    },
    {
      slug: "guia-rapida-de-qr",
      title: "Guía rápida: cómo hacer que todos usen el QR",
      date: "16 Febrero 2026",
      excerpt:
        "La adopción mejora cuando reduces fricción y das instrucciones claras.",
      image: corporateImg,
      contentHtml:
        "<p>Coloca el QR a la altura de los ojos.</p>" +
        "<p>Acompáñalo con un texto simple: “Escanea y sube tu foto”.</p>" +
        "<p>Incluye el QR en pantallas o proyecciones si las tienes.</p>" +
        "<p>Evita saturar con demasiados mensajes.</p>",
      tags: ["QR", "Operación"],
    },
    {
      slug: "checklist-evento-perfecto",
      title: "Checklist de evento perfecto para fotos inolvidables",
      date: "18 Febrero 2026",
      excerpt:
        "Una lista corta para que todo el equipo tenga claro el plan de fotos.",
      image: birthdayImg,
      contentHtml:
        "<p>Define 2 zonas de foto: formal y espontánea.</p>" +
        "<p>Asigna a una persona para recordar el uso del QR.</p>" +
        "<p>Revisa iluminación 30 minutos antes.</p>" +
        "<p>Prepara un mensaje de cierre con el CTA final.</p>",
      tags: ["Checklist", "Eventos"],
    },
  ],
  en: [
    {
      slug: "ideas-para-fotos-de-evento",
      title: "10 photo ideas your guests will actually want to share",
      date: "January 20, 2026",
      excerpt:
        "From soft‑light corners to playful prompts, here’s a simple checklist to boost participation.",
      image: weddingImg,
      contentHtml:
        "<p>Use a light backdrop and soft side light to avoid harsh shadows.</p>" +
        "<p>Use the first 30 minutes to capture guests while energy is high.</p>" +
        "<p>Create 3 short prompts: “best pose”, “photo with the host”, “table group”.</p>" +
        "<p>Leave room for candid shots—don’t make everything posed.</p>",
      tags: ["Events", "Tips", "Participation"],
    },
    {
      slug: "como-elegir-plantillas",
      title: "How to choose the perfect template for your event type",
      date: "February 5, 2026",
      excerpt:
        "Weddings, birthdays or corporate events: each one speaks differently. Pick typography and colors that fit the tone.",
      image: corporateImg,
      contentHtml:
        "<p>Elegant events: serif fonts and neutral palettes.</p>" +
        "<p>Casual events: bright tones and clean sans fonts.</p>" +
        "<p>Corporate: keep consistency with branding and logo.</p>" +
        "<p>Remember: less is more; a good template breathes.</p>",
      tags: ["Templates", "Branding"],
    },
    {
      slug: "como-aumentar-participacion",
      title: "How to boost guest participation in 5 steps",
      date: "February 12, 2026",
      excerpt:
        "Small changes in flow and communication can double the number of photos.",
      image: birthdayImg,
      contentHtml:
        "<p>Make the QR visible: entrance, tables, and bar.</p>" +
        "<p>Remind the CTA at key moments.</p>" +
        "<p>Add a simple dynamic: “photo + toast”.</p>" +
        "<p>Show a sample photo to inspire.</p>",
      tags: ["Participation", "Events"],
    },
    {
      slug: "errores-comunes-en-fotos",
      title: "Common mistakes when setting up a photo corner (and how to avoid them)",
      date: "February 15, 2026",
      excerpt:
        "From lighting to backdrops: avoid the issues that ruin photos even with a good camera.",
      image: weddingImg,
      contentHtml:
        "<p>Don’t place the backdrop against harsh window light.</p>" +
        "<p>Avoid busy backgrounds that compete with people.</p>" +
        "<p>Leave enough room for groups of 4–6.</p>" +
        "<p>Test the camera from different angles before the event.</p>",
      tags: ["Production", "Tips"],
    },
    {
      slug: "guia-rapida-de-qr",
      title: "Quick guide: how to get everyone to use the QR",
      date: "February 16, 2026",
      excerpt:
        "Adoption improves when you reduce friction and give clear instructions.",
      image: corporateImg,
      contentHtml:
        "<p>Place the QR at eye level.</p>" +
        "<p>Add a simple line: “Scan and upload your photo”.</p>" +
        "<p>Include the QR on screens or projections if you have them.</p>" +
        "<p>Avoid overcrowding with too many messages.</p>",
      tags: ["QR", "Operations"],
    },
    {
      slug: "checklist-evento-perfecto",
      title: "Perfect-event checklist for unforgettable photos",
      date: "February 18, 2026",
      excerpt:
        "A short list to keep the whole team aligned on the photo plan.",
      image: birthdayImg,
      contentHtml:
        "<p>Define two photo zones: formal and candid.</p>" +
        "<p>Assign someone to remind guests about the QR.</p>" +
        "<p>Check lighting 30 minutes before.</p>" +
        "<p>Prepare a closing message with the final CTA.</p>",
      tags: ["Checklist", "Events"],
    },
  ],
  it: [
    {
      slug: "ideas-para-fotos-de-evento",
      title: "10 idee di foto che gli invitati vorranno davvero condividere",
      date: "20 Gennaio 2026",
      excerpt:
        "Da angoli con luce morbida a prompt divertenti: una checklist semplice per aumentare la partecipazione.",
      image: weddingImg,
      contentHtml:
        "<p>Usa uno sfondo chiaro e una luce laterale morbida per evitare ombre dure.</p>" +
        "<p>Sfrutta i primi 30 minuti per fotografare gli ospiti con più energia.</p>" +
        "<p>Crea 3 prompt brevi: “miglior posa”, “foto con gli sposi”, “foto per tavolo”.</p>" +
        "<p>Lascia spazio alle foto spontanee: non tutto deve essere in posa.</p>",
      tags: ["Eventi", "Consigli", "Partecipazione"],
    },
    {
      slug: "como-elegir-plantillas",
      title: "Come scegliere il template perfetto per il tuo evento",
      date: "05 Febbraio 2026",
      excerpt:
        "Matrimoni, compleanni o eventi aziendali: ogni evento comunica in modo diverso. Scegli font e colori coerenti.",
      image: corporateImg,
      contentHtml:
        "<p>Eventi eleganti: font serif e palette neutre.</p>" +
        "<p>Eventi informali: colori vivaci e font sans leggibili.</p>" +
        "<p>Aziendali: coerenza con branding e logo.</p>" +
        "<p>Ricorda: less is more; un buon template respira.</p>",
      tags: ["Template", "Branding"],
    },
    {
      slug: "como-aumentar-participacion",
      title: "Come aumentare la partecipazione degli invitati in 5 passi",
      date: "12 Febbraio 2026",
      excerpt:
        "Piccoli cambiamenti nel flusso e nella comunicazione possono raddoppiare le foto.",
      image: birthdayImg,
      contentHtml:
        "<p>Rendi il QR visibile: ingresso, tavoli e bar.</p>" +
        "<p>Ricorda il CTA nei momenti chiave.</p>" +
        "<p>Premia con una dinamica semplice: “foto + brindisi”.</p>" +
        "<p>Mostra una foto di esempio per ispirare.</p>",
      tags: ["Partecipazione", "Eventi"],
    },
    {
      slug: "errores-comunes-en-fotos",
      title: "Errori comuni nell’allestire un photo corner (e come evitarli)",
      date: "15 Febbraio 2026",
      excerpt:
        "Dalla luce allo sfondo: evita gli errori che rovinano le foto anche con una buona camera.",
      image: weddingImg,
      contentHtml:
        "<p>Non posizionare lo sfondo davanti a finestre con luce forte.</p>" +
        "<p>Evita fondali troppo pieni che distraggono.</p>" +
        "<p>Lascia spazio per gruppi da 4–6 persone.</p>" +
        "<p>Prova la camera da più angolazioni prima dell’evento.</p>",
      tags: ["Produzione", "Consigli"],
    },
    {
      slug: "guia-rapida-de-qr",
      title: "Guida rapida: come far usare il QR a tutti",
      date: "16 Febbraio 2026",
      excerpt:
        "L’adozione migliora quando riduci la frizione e dai istruzioni chiare.",
      image: corporateImg,
      contentHtml:
        "<p>Posiziona il QR all’altezza degli occhi.</p>" +
        "<p>Aggiungi un testo semplice: “Scansiona e carica la tua foto”.</p>" +
        "<p>Mostra il QR su schermi o proiezioni se possibile.</p>" +
        "<p>Evita troppi messaggi insieme.</p>",
      tags: ["QR", "Operativo"],
    },
    {
      slug: "checklist-evento-perfecto",
      title: "Checklist evento perfetto per foto indimenticabili",
      date: "18 Febbraio 2026",
      excerpt:
        "Una lista breve per allineare il team sul piano foto.",
      image: birthdayImg,
      contentHtml:
        "<p>Definisci due zone foto: formale e spontanea.</p>" +
        "<p>Assegna a qualcuno il compito di ricordare il QR.</p>" +
        "<p>Controlla l’illuminazione 30 minuti prima.</p>" +
        "<p>Prepara un messaggio finale con il CTA conclusivo.</p>",
      tags: ["Checklist", "Eventi"],
    },
  ],
};
