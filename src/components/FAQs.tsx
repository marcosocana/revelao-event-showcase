import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "¿Cómo funciona Revelao?",
    answer: "¡Muy fácil! Contáctanos y te explicamos cómo dar de alta tu evento. Todos los invitados —ya sea en una boda, cumpleaños, cena de empresa o concierto— podrán subir sus fotos a la plataforma durante el evento. Y aquí viene la magia: al día siguiente ocurre la \"revelación\". Todas las imágenes estarán disponibles, de forma anónima, en nuestra plataforma para que todos las disfruten."
  },
  {
    question: "¿Por qué esperar para ver las fotos?",
    answer: "Porque esa es la esencia de Revelao.cam: recuperar la emoción de no saber cómo salieron tus fotos hasta que se revelan. Es parte de la experiencia divertida, nostálgica y única."
  },
  {
    question: "¿Necesito instalar algo?",
    answer: "¡Nada! Todo funciona desde tu navegador, sin descargas ni apps. Solo necesitas conexión a internet."
  },
  {
    question: "¿Puedo usarlo en cualquier dispositivo?",
    answer: "Sí, Revelao.cam está optimizado para móviles (iOS y Android) y ordenadores. Solo asegúrate de usar un navegador actualizado."
  },
  {
    question: "¿Cuántas fotos puedo hacer?",
    answer: "¡Sin límites! Cada invitado puede subir tantas fotos como quiera."
  },
  {
    question: "¿Qué pasa cuando se revelan las fotos?",
    answer: "Todos los invitados podrán acceder al mismo QR o entrar en nuestra web para ver el evento. Desde ahí podrán visualizar todas las fotos, descargarlas, dar likes, compartirlas y mucho más."
  },
  {
    question: "¿Es seguro?",
    answer: "Sí. Tus fotos son privadas y solo quienes tengan el código QR podrán verlas."
  },
  {
    question: "¿Cuánto cuesta?",
    answer: "Consulta nuestros planes en la web. Tenemos varias opciones según el número de invitados y el tipo de evento."
  },
  {
    question: "¿Puedo usarlo para bodas, fiestas o viajes?",
    answer: "¡Por supuesto! Revelao.cam es perfecto para cualquier ocasión donde quieras añadir diversión, sorpresa y recuerdos inolvidables."
  }
];

export const FAQs = () => {
  return (
    <section className="py-12 md:py-24 bg-background" id="faqs">
      <div className="container px-4 mx-auto max-w-3xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">
            Preguntas frecuentes
          </h2>
          <p className="text-lg text-muted-foreground">
            Resuelve tus dudas sobre Revelao
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-foreground">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
