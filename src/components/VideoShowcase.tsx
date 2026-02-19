export const VideoShowcase = () => {
  return (
    <section className="py-16 md:py-28 bg-primary/5 relative overflow-hidden" id="video-demo">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">
            Mira Revelao en acción
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Descubre en este video cómo se vive la experiencia completa, desde el QR hasta la revelación.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="aspect-video w-full rounded-3xl border border-primary/20 shadow-[0_30px_70px_-30px_rgba(180,38,38,0.35)] overflow-hidden bg-black/95 ring-1 ring-primary/30">
            <iframe
              src="https://www.youtube.com/embed/_VakaDTWYJA"
              title="Revelao - Video demostración"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
          <div className="mt-6 flex flex-col items-center gap-3 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Activa el sonido y siente el hype del revelado.</span>
            <span>Ideal para bodas, cumpleaños y eventos corporativos.</span>
          </div>
        </div>
      </div>
    </section>
  );
};
