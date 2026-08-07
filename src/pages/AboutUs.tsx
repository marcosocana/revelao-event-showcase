import { Heart, ScanLine, ShieldCheck, Sparkles } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import WhatsAppFloating from "@/components/WhatsAppFloating";
import productVisual from "@/assets/how-step-create-new.png";
import { PageSeo } from "@/components/PageSeo";

const AboutUs = () => {
  const principles = [
    {
      icon: ScanLine,
      title: "Que participar sea facilísimo",
      text: "Un QR, el navegador del móvil y nada más. Sin pedir a los invitados que descarguen una app o creen una cuenta.",
    },
    {
      icon: Sparkles,
      title: "Que la espera forme parte del recuerdo",
      text: "Durante el evento, el contenido permanece oculto. El Revelado convierte el día siguiente en otro momento compartido.",
    },
    {
      icon: ShieldCheck,
      title: "Que los recuerdos estén bien cuidados",
      text: "La experiencia está pensada para reunir fotos, vídeos y audios en una galería privada, clara y fácil de conservar.",
    },
  ];

  return (
    <div className="min-h-screen bg-background" id="inicio">
      <PageSeo
        title="Quiénes somos: Marcos, fundador de Revelao.cam"
        description="Conoce a Marcos, fundador de Revelao.cam, y la idea detrás de una forma diferente de reunir y revelar los recuerdos de un evento."
        canonicalPath="/quienes-somos"
      />
      <Navbar />
      <main className="pt-16">
        <section className="overflow-hidden border-b border-border bg-[linear-gradient(145deg,#fff_0%,#f7f5f3_100%)] py-14 md:py-24">
          <div className="container mx-auto grid items-center gap-10 px-4 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Quiénes somos</p>
              <h1 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-foreground sm:text-5xl lg:text-6xl">
                Soy Marcos, la persona detrás de Revelao
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                Creé Revelao.cam con una idea sencilla: que los momentos que viven los invitados no terminen perdidos en sus móviles y que descubrirlos también forme parte de la celebración.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button className="rounded-full px-6" asChild>
                  <a href="https://acceso.revelao.cam/nuevoeventodemo2" target="_blank" rel="noopener noreferrer">Probar Revelao gratis</a>
                </Button>
                <Button variant="outline" className="rounded-full px-6" asChild>
                  <a href="/kit-de-prensa">Ver kit de prensa</a>
                </Button>
              </div>
            </div>

            <div className="relative flex min-h-[340px] items-center justify-center rounded-[24px] border border-border bg-white p-5 shadow-[0_24px_70px_-45px_rgba(15,23,42,0.45)] md:min-h-[480px] md:p-8">
              <img src={productVisual} alt="Experiencia Revelao para crear un evento con QR" className="h-auto max-h-[440px] w-full object-contain" />
            </div>
          </div>
        </section>

        <section className="py-14 md:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <Heart className="h-8 w-8 fill-primary text-primary" aria-hidden="true" />
                <h2 className="mt-5 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">Por qué existe Revelao</h2>
              </div>
              <div className="space-y-5 text-lg leading-8 text-muted-foreground">
                <p>En un evento pasan muchas más cosas de las que una sola persona puede ver. Hay abrazos, bailes, bromas, vídeos y voces que solo quedan en los teléfonos de quienes estaban allí.</p>
                <p>Revelao reúne todas esas miradas mediante un QR y recupera algo que hemos perdido con la inmediatez: la emoción de esperar. Nadie ve el contenido durante el evento; al día siguiente, todo aparece junto en el Revelado.</p>
                <p>Estoy construyendo el producto alrededor de esa experiencia: fácil para los invitados, útil para quien organiza y especial cuando llega el momento de recordar.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-neutral-100 py-14 md:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Cómo tomamos decisiones</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Tres principios muy claros</h2>
            </div>
            <div className="mx-auto mt-10 grid max-w-6xl gap-5 md:grid-cols-3">
              {principles.map(({ icon: Icon, title, text }) => (
                <article key={title} className="rounded-[18px] border border-border bg-white p-6 shadow-[0_16px_45px_-35px_rgba(15,23,42,0.5)]">
                  <span className="inline-flex rounded-2xl bg-primary/10 p-3 text-primary"><Icon className="h-5 w-5" aria-hidden="true" /></span>
                  <h3 className="mt-5 text-xl font-semibold tracking-tight">{title}</h3>
                  <p className="mt-3 leading-7 text-muted-foreground">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14 md:py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">¿Quieres hablar conmigo?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">Si tienes una idea, una colaboración o simplemente quieres conocer mejor Revelao, escríbeme.</p>
            <Button className="mt-7 rounded-full px-7" asChild>
              <a href="mailto:revelao.cam@gmail.com">Escribir a Marcos</a>
            </Button>
          </div>
        </section>
      </main>
      <WhatsAppFloating message="Hola Marcos! Me gustaría conocer mejor Revelao." />
      <Footer />
    </div>
  );
};

export default AboutUs;
