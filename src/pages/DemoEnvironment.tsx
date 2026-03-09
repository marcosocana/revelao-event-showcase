import { Button } from "@/components/ui/button";

type DemoStateItem = {
  title: string;
  description: string;
  url?: string;
};

const demoStates: DemoStateItem[] = [
  {
    title: "Sin empezar",
    description:
      "El evento aun no ha comenzado. Los invitados ven la cuenta atras y no pueden subir contenido.",
    url: "https://acceso.revelao.cam/events/uI6F2Kfv?demo_env=1",
  },
  {
    title: "En curso",
    description:
      "El evento esta activo. Los invitados pueden subir fotos, videos y audios en tiempo real.",
    url: "https://acceso.revelao.cam/events/KrErAopl?demo_env=1",
  },
  {
    title: "Terminado",
    description:
      "El evento termino y el contenido queda bloqueado hasta la hora configurada del revelado.",
    url: "https://acceso.revelao.cam/events/p2Yro6yz?demo_env=1",
  },
  {
    title: "Revelado",
    description:
      "El contenido ya esta revelado y disponible en galeria para visualizar, compartir y descargar.",
    url: "https://acceso.revelao.cam/events/O8igAtwS?demo_env=1",
  },
  {
    title: "Caducado",
    description:
      "El evento ya caduco y no permite mas acceso al contenido desde la ruta publica.",
  },
];

const DemoEnvironment = () => {
  return (
    <main className="min-h-screen bg-neutral-100 py-6 md:py-8">
      <div className="mx-auto w-full max-w-[430px] min-h-[calc(100vh-3rem)] rounded-[28px] border border-neutral-200 bg-white px-4 py-5 shadow-xl md:min-h-[calc(100vh-4rem)]">
        <div className="mx-auto mb-5 h-1.5 w-16 rounded-full bg-neutral-300" />
        <h1 className="text-center text-2xl font-bold tracking-tight text-foreground">Entorno demo</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Estados de ejemplo del evento en formato movil.
        </p>

        <section className="mt-6 space-y-3">
          {demoStates.map((item) => (
            <article key={item.title} className="rounded-2xl border border-border bg-card p-4">
              <h2 className="text-lg font-semibold text-foreground">{item.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              {item.url ? (
                <Button className="mt-3 w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    Ver estado
                  </a>
                </Button>
              ) : (
                <Button
                  className="mt-3 w-full rounded-full"
                  variant="outline"
                  disabled
                >
                  Proximamente
                </Button>
              )}
            </article>
          ))}
        </section>
      </div>
    </main>
  );
};

export default DemoEnvironment;
