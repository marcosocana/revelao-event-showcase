const BASE_DATE = "2026-03-01";
const BASE = { events: 179, weddings: 88, photos: 161700, users: 24321 };
const INCREMENTS = { eventsPerDay: 1, weddingsPerDays: 8, photosPerDay: 111, usersPerDay: 11 };

const getDaysSinceBase = () => {
  const base = new Date(BASE_DATE);
  const now = new Date();
  const msPerDay = 1000 * 60 * 60 * 24;
  const days = Math.floor((now.getTime() - base.getTime()) / msPerDay);
  return days < 0 ? 0 : days;
};

const formatNumber = (value: number) => new Intl.NumberFormat("es-ES").format(value);

export const KpiStrip = () => {
  const days = getDaysSinceBase();
  const events = BASE.events + days * INCREMENTS.eventsPerDay;
  const weddings = BASE.weddings + Math.floor(days / INCREMENTS.weddingsPerDays);
  const photos = BASE.photos + days * INCREMENTS.photosPerDay;
  const users = BASE.users + days * INCREMENTS.usersPerDay;

  return (
    <section className="w-full bg-neutral-100 border-y border-border/60">
      <div className="container px-4 mx-auto">
        <div className="pt-5 md:pt-6 text-center">
          <p className="text-[0.68rem] md:text-sm font-semibold uppercase tracking-[0.3em] text-neutral-500">
            Desde que empezamos...
          </p>
        </div>
        <dl className="grid grid-cols-2 md:grid-cols-4 gap-6 py-5 md:py-7 text-center">
          <div className="flex flex-col items-center gap-1">
            <dd className="text-2xl md:text-3xl font-semibold text-foreground">
              +{formatNumber(events)}
            </dd>
            <dt className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Eventos
            </dt>
          </div>
          <div className="flex flex-col items-center gap-1">
            <dd className="text-2xl md:text-3xl font-semibold text-foreground">
              +{formatNumber(weddings)}
            </dd>
            <dt className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Bodas
            </dt>
          </div>
          <div className="flex flex-col items-center gap-1">
            <dd className="text-2xl md:text-3xl font-semibold text-foreground">
              +{formatNumber(photos)}
            </dd>
            <dt className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Fotos
            </dt>
          </div>
          <div className="flex flex-col items-center gap-1">
            <dd className="text-2xl md:text-3xl font-semibold text-foreground">
              +{formatNumber(users)}
            </dd>
            <dt className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Usuarios
            </dt>
          </div>
        </dl>
      </div>
    </section>
  );
};
