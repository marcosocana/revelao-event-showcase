import { ArrowRight, BookOpen, Camera, Gamepad2, Lightbulb, QrCode, Trophy, Users } from "lucide-react";
import captainsSeoPages from "@/data/captainsSeoPages.json";

const icons = [Users, Gamepad2, Trophy, Camera, Lightbulb, BookOpen, QrCode];

export const CaptainsResources = () => (
  <section className="bg-white px-4 py-14 text-[#151515] sm:px-6 lg:px-10 lg:py-20" aria-labelledby="captains-resources-title">
    <div className="mx-auto max-w-7xl">
      <div className="max-w-4xl">
        <p className="captains-section-label">Guías para tu boda</p>
        <h2 id="captains-resources-title" className="captains-heading mt-4">Ideas y recursos para organizar tus capitanes de mesa</h2>
        <p className="mt-5 text-lg font-bold leading-7 text-[#151515]/70">
          Descubre cómo elegir capitanes, preparar juegos por mesas, diseñar tarjetas con QR y crear retos que incluyan a todos tus invitados.
        </p>
      </div>
      <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {captainsSeoPages.map((page, index) => {
          const Icon = icons[index % icons.length];
          return (
            <article className="captains-panel flex h-full flex-col bg-[#f7f3ec] p-5 sm:p-6" key={page.path}>
              <Icon className="h-9 w-9" aria-hidden="true" />
              <h3 className="mt-5 text-2xl font-black leading-7">{page.h1}</h3>
              <p className="mt-3 flex-1 font-bold leading-6 text-[#151515]/68">{page.intro}</p>
              <a className="mt-6 inline-flex items-center gap-2 font-black underline decoration-2 underline-offset-4" href={page.path}>
                Leer la guía <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </article>
          );
        })}
      </div>
    </div>
  </section>
);
