export const WhyRevelaoSection = () => {
  return (
    <section className="py-12 md:py-24 bg-transparent" id="por-que-revelao">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="revelao-h2 mb-2 text-center">¿Por qué Revelao?</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 md:gap-6 lg:grid-cols-4">
          <article className="group rounded-2xl border border-border/60 bg-white/80 p-4 shadow-[0_14px_40px_rgba(15,23,42,0.08)] transition-shadow hover:shadow-[0_18px_50px_rgba(15,23,42,0.12)] sm:rounded-3xl sm:p-6 md:p-7">
            <h4 className="mb-2 text-base font-semibold leading-tight text-foreground sm:text-xl md:text-2xl">
              Sin apps ni registros
            </h4>
            <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm md:text-base">
              Tus invitados solo escanean el QR y suben fotos, vídeos y mensajes de voz al instante. Sin descargas.
            </p>
          </article>

          <article className="group rounded-2xl border border-border/60 bg-white/80 p-4 shadow-[0_14px_40px_rgba(15,23,42,0.08)] transition-shadow hover:shadow-[0_18px_50px_rgba(15,23,42,0.12)] sm:rounded-3xl sm:p-6 md:p-7">
            <h4 className="mb-2 text-base font-semibold leading-tight text-foreground sm:text-xl md:text-2xl">
              100% anónimo y privado
            </h4>
            <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm md:text-base">
              No se recopilan datos personales. La galería es cerrada y exclusiva para tu evento.
            </p>
          </article>

          <article className="group rounded-2xl border border-border/60 bg-white/80 p-4 shadow-[0_14px_40px_rgba(15,23,42,0.08)] transition-shadow hover:shadow-[0_18px_50px_rgba(15,23,42,0.12)] sm:rounded-3xl sm:p-6 md:p-7">
            <h4 className="mb-2 text-base font-semibold leading-tight text-foreground sm:text-xl md:text-2xl">
              Revelado al día siguiente
            </h4>
            <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm md:text-base">
              El contenido no aparece en tiempo real. Se desbloquea todo a la vez al día siguiente.
            </p>
          </article>

          <article className="group rounded-2xl border border-border/60 bg-white/80 p-4 shadow-[0_14px_40px_rgba(15,23,42,0.08)] transition-shadow hover:shadow-[0_18px_50px_rgba(15,23,42,0.12)] sm:rounded-3xl sm:p-6 md:p-7">
            <h4 className="mb-2 text-base font-semibold leading-tight text-foreground sm:text-xl md:text-2xl">
              Experiencia colectiva y real
            </h4>
            <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm md:text-base">
              Todos pueden ver y escuchar lo de todos. Un recuerdo común, no carpetas sueltas ni enlaces perdidos.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};
