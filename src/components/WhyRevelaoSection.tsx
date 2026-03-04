export const WhyRevelaoSection = () => {
  return (
    <section className="py-12 md:py-24 bg-transparent" id="por-que-revelao">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="revelao-h2 mb-2 text-center">¿Por qué Revelao?</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <article className="group rounded-3xl border border-border/60 bg-white/80 p-6 md:p-7 shadow-[0_14px_40px_rgba(15,23,42,0.08)] transition-shadow hover:shadow-[0_18px_50px_rgba(15,23,42,0.12)]">
            <h4 className="text-xl md:text-2xl font-semibold text-foreground mb-2">
              Sin apps ni registros
            </h4>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              Tus invitados solo escanean el QR y suben fotos, vídeos y mensajes de voz al instante. Sin descargas. Sin cuentas. Sin fricción.
            </p>
          </article>

          <article className="group rounded-3xl border border-border/60 bg-white/80 p-6 md:p-7 shadow-[0_14px_40px_rgba(15,23,42,0.08)] transition-shadow hover:shadow-[0_18px_50px_rgba(15,23,42,0.12)]">
            <h4 className="text-xl md:text-2xl font-semibold text-foreground mb-2">
              100% anónimo y privado
            </h4>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              No se recopilan datos personales. La galería es cerrada y exclusiva para tu evento.
            </p>
          </article>

          <article className="group rounded-3xl border border-border/60 bg-white/80 p-6 md:p-7 shadow-[0_14px_40px_rgba(15,23,42,0.08)] transition-shadow hover:shadow-[0_18px_50px_rgba(15,23,42,0.12)]">
            <h4 className="text-xl md:text-2xl font-semibold text-foreground mb-2">
              Revelación al día siguiente
            </h4>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              Nada se ve ni se escucha en tiempo real. Todo se desbloquea a la vez en el Revelado, generando expectativa y emoción compartida.
            </p>
          </article>

          <article className="group rounded-3xl border border-border/60 bg-white/80 p-6 md:p-7 shadow-[0_14px_40px_rgba(15,23,42,0.08)] transition-shadow hover:shadow-[0_18px_50px_rgba(15,23,42,0.12)]">
            <h4 className="text-xl md:text-2xl font-semibold text-foreground mb-2">
              Experiencia colectiva real
            </h4>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              Todos pueden ver y escuchar lo de todos. Un recuerdo común, no carpetas sueltas ni enlaces perdidos.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};
