export type TestimonialCategory = "Boda" | "Cumpleaños" | "Empresa" | "Celebración";

export type Testimonial = {
  id: number;
  title: string;
  quote: string;
  author: string;
  location: string;
  category: TestimonialCategory;
  rating: 4 | 5;
  date: string;
};

const stories = [
  ["Vimos la boda desde cien miradas", "Al abrir la galería aparecieron abrazos, bailes y momentos que nosotros no habíamos visto. Fue como celebrar otra vez."],
  ["Todo el mundo supo usarlo", "Dejamos el QR en las mesas y los invitados empezaron a subir fotos enseguida. Nadie tuvo que instalar una aplicación."],
  ["Las fotos de la cena son oro", "Nuestros amigos captaron las conversaciones, las risas y todos esos pequeños momentos que ocurrían lejos de nuestra mesa."],
  ["El revelado fue precioso", "Nos sentamos juntos al día siguiente y vimos cada foto y cada vídeo. Fue uno de los mejores momentos del fin de semana."],
  ["Por fin, todo en un solo sitio", "No tuvimos que perseguir archivos por grupos ni pedir que nos enviaran las fotos. Estaban todas reunidas y ordenadas."],
  ["Participaron todas las edades", "Nos preocupaba que los mayores no entendieran el QR, pero fue escanear con la cámara y empezar a compartir recuerdos."],
  ["Los audios nos emocionaron", "Escuchar las voces y las felicitaciones con la emoción de ese día nos hizo reír y llorar a partes iguales."],
  ["Mucho más que las fotos posadas", "La galería está llena de imágenes espontáneas: gente bailando, brindis improvisados y amigos volviendo a encontrarse."],
  ["La pista quedó grabada desde dentro", "Recibimos vídeos cortos de todos los grupos de amigos. La energía de la fiesta se siente de verdad al verlos."],
  ["Funcionó desde el primer minuto", "Pusimos un cartel en la entrada y tarjetas en las mesas. Cuando llegamos al cóctel ya había recuerdos subidos."],
  ["Una sorpresa detrás de otra", "Cada invitado había vivido una boda diferente. Verlo todo junto nos enseñó detalles que se nos escaparon por completo."],
  ["Sencillo y sin interrupciones", "Los invitados escaneaban, subían su foto y seguían disfrutando. Era justo la experiencia fácil que buscábamos."],
  ["Nuestro cumpleaños contado por todos", "Entre las fotos y los mensajes de voz quedó un retrato divertidísimo de la noche. Lo hemos visto muchas veces."],
  ["El equipo se volcó", "Usamos el QR en la cena de empresa y la participación fue enorme. Al día siguiente teníamos una galería llena de momentos naturales."],
  ["La familia sigue hablando del revelado", "Esperar para verlo todo junto convirtió las fotos en una pequeña celebración después de la celebración."],
  ["No se perdió ni un brindis", "Los vídeos de nuestros invitados guardaron discursos y reacciones que la cámara principal no podía cubrir a la vez."],
  ["Una galería muy nuestra", "No eran imágenes perfectas ni tenían que serlo. Eran nuestras personas viviendo el día desde cerca."],
  ["Nos olvidamos de pedir fotos", "La gente ya sabía dónde subirlas gracias al QR. Nosotros pudimos disfrutar sin organizar nada durante la fiesta."],
  ["El mejor recuerdo del fin de semana", "La preboda, la ceremonia y el baile acabaron juntos en la misma historia. Tenerlo centralizado fue comodísimo."],
  ["Incluso llegaron fotos inesperadas", "Descubrimos imágenes de la preparación y de la llegada de los invitados que jamás habríamos recibido por WhatsApp."],
] as const;

const people = [
  "Lucía y Marco", "Emma y Marcos", "Tala y Pedro", "Sofía y Daniel", "Marta y Álvaro", "Elena y Jorge",
  "Claudia y David", "Inés y Dani", "Andrea y Pablo", "Sara y Miguel", "Laura y Carlos", "Nuria y Javier",
  "Paula y Gonzalo", "Marina y Diego", "Carmen y Rubén", "Aitana y Jaime", "Rocío y Víctor", "Alba y Sergio",
  "Ana y Mateo", "Irene y Bruno", "María y Adrián", "Cristina y Hugo", "Lola y Álex", "Silvia y Raúl",
] as const;

const locations = [
  "Madrid", "Sevilla", "Valencia", "Bilbao", "Málaga", "Mallorca", "Granada", "Zaragoza",
  "Cádiz", "Alicante", "Valladolid", "Toledo", "Barcelona", "Murcia", "Córdoba", "Santander",
] as const;

const categories: TestimonialCategory[] = ["Boda", "Boda", "Boda", "Celebración", "Cumpleaños", "Empresa"];
const months = ["07.2026", "06.2026", "05.2026", "04.2026", "03.2026", "02.2026", "01.2026", "12.2025"];

export const testimonials: Testimonial[] = Array.from({ length: 312 }, (_, index) => {
  const story = stories[index % stories.length];
  return {
    id: index + 1,
    title: story[0],
    quote: story[1],
    author: people[(index * 7) % people.length],
    location: locations[(index * 5) % locations.length],
    category: categories[index % categories.length],
    rating: index % 11 === 0 ? 4 : 5,
    date: months[index % months.length],
  };
});
