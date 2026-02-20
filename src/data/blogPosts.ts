import weddingImg from "@/assets/testimonial-wedding.jpg";
import birthdayImg from "@/assets/testimonial-birthday.jpg";
import corporateImg from "@/assets/testimonial-corporate.jpg";

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  contentHtml: string;
  image: string;
  tags?: string[];
};

export const blogPosts: BlogPost[] = [
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
];
