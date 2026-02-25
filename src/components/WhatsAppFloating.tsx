import whatsappIcon from "@/assets/whatsapp.png";

const WhatsAppFloating = () => {
  return (
    <a
      href="https://wa.me/34695834018?text=Hola%21%20Estoy%20interesado%20en%20Revelao.%20Cu%C3%A9ntame%20m%C3%A1s%21"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="group fixed bottom-5 right-5 z-50 flex items-center gap-3"
    >
      <span className="hidden sm:inline-flex items-center rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-foreground shadow-lg ring-1 ring-black/5">
        ¿Hablamos por WhatsApp?
      </span>
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#4FCE5D] shadow-[0_14px_30px_-12px_rgba(0,0,0,0.65)] transition-transform duration-200 group-hover:scale-[1.06]">
        <img
          src={whatsappIcon}
          alt="WhatsApp"
          className="h-8 w-8"
        />
      </span>
    </a>
  );
};

export default WhatsAppFloating;
