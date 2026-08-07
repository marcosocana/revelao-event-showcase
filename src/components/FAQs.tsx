import { useState } from "react";
import { useI18n, translations, type Language } from "@/lib/i18n";

type FAQItem = {
  q: string;
  a: string;
  link?: {
    label: string;
    href?: string;
    example?: "in-progress" | "finished";
  };
};
type FAQPhase = "before" | "during" | "after";

type FAQsProps = {
  className?: string;
  title?: string;
  subtitle?: string;
  items?: FAQItem[];
};

const lifecycleFaqs: Record<Language, {
  subtitle: string;
  labels: Record<FAQPhase, string>;
  groups: Record<FAQPhase, FAQItem[]>;
}> = {
  es: {
    subtitle: "Todo lo que necesitas saber antes, durante y después de tu evento",
    labels: {
      before: "Antes del evento",
      during: "Durante el evento",
      after: "Después del evento",
    },
    groups: {
      before: [
        {
          q: "¿Cómo funciona Revelao?",
          a: "Creas tu evento en pocos minutos, personalizas la experiencia y compartes el QR. Durante la celebración, tus invitados suben fotos, vídeos y mensajes de voz sin instalar ninguna app. Cuando llega el Revelado, todo aparece junto en la galería privada.",
        },
        {
          q: "¿Puedo preparar Revelao con antelación?",
          a: "Sí. Puedes crear el evento, personalizar su nombre e imagen, configurar el momento del revelado y dejar preparados el QR y los carteles mucho antes de la fecha.",
        },
        {
          q: "¿Cómo recibo el código QR?",
          a: "Al crear el evento te enviamos un QR exclusivo por email. Puedes descargarlo, incluirlo en nuestras plantillas y colocarlo en mesas, carteles, invitaciones o pantallas.",
        },
        {
          q: "¿Qué plan necesito para mi evento?",
          a: "Depende del volumen que esperes. Start incluye 200 fotos, 30 vídeos y 60 audios; Plus amplía a 5.000 fotos, 200 vídeos y 500 audios; Pro ofrece contenido ilimitado.",
        },
        {
          q: "¿Puedo probar la experiencia antes de comprar?",
          a: "Sí. La demo gratuita te permite crear un evento de prueba y comprobar cómo entran los invitados, cómo suben contenido y cómo se verá la galería.",
          link: {
            label: "Probar gratis",
            href: "https://acceso.revelao.cam/nuevoeventodemo2",
          },
        },
        {
          q: "¿Necesito diseñar mis propios carteles?",
          a: "No. Los planes Start, Plus y Pro incluyen plantillas QR para que puedas preparar la señalética del evento de forma rápida y coherente.",
        },
      ],
      during: [
        {
          q: "¿Por qué esperar para ver el contenido?",
          a: "Porque esa es la esencia de Revelao: recuperar la emoción de no saber qué han capturado los invitados hasta el Revelado. La espera convierte la galería en una sorpresa compartida al terminar el evento.",
          link: {
            label: "Ver ejemplo durante el evento",
            example: "in-progress",
          },
        },
        {
          q: "¿Los invitados tienen que descargar una app?",
          a: "No. Solo escanean el QR con la cámara del móvil y acceden desde el navegador. No necesitan instalar nada ni crear una cuenta.",
        },
        {
          q: "¿Qué pueden compartir durante el evento?",
          a: "Pueden hacer y subir fotos, grabar vídeos y dejar mensajes de voz. A partir del plan Plus también pueden seleccionar fotos y vídeos que ya tengan en la galería del móvil.",
        },
        {
          q: "¿Se ve el contenido mientras se está subiendo?",
          a: "Revelao está pensado para mantener la sorpresa: el contenido permanece oculto hasta el momento que hayas configurado para el Revelado.",
        },
        {
          q: "¿Puedo proyectar fotos en una televisión o pantalla?",
          a: "Sí. Los planes Start, Plus y Pro incluyen TV Slideshow en directo para mostrar fotos en vivo durante el evento cuando quieras activar esa experiencia.",
        },
        {
          q: "¿Qué ocurre si hay poca cobertura o wifi?",
          a: "Los invitados pueden volver a entrar con el mismo QR cuando recuperen conexión. Por eso recomendamos colocar también el enlace corto junto al código y repetirlo en varios puntos del espacio.",
        },
      ],
      after: [
        {
          q: "¿Qué ocurre cuando llega el Revelado?",
          a: "Las fotos, vídeos y mensajes de voz aparecen juntos en la galería privada. Todos pueden volver a entrar desde el mismo QR para descubrir el evento desde la mirada de los demás.",
          link: {
            label: "Ver aquí un ejemplo después del evento",
            example: "finished",
          },
        },
        {
          q: "¿Puedo descargar todos los recuerdos?",
          a: "Sí. Desde el panel de gestión puedes descargar el contenido incluido en tu evento y conservar una copia de las fotos, vídeos y audios.",
        },
        {
          q: "¿Cuánto tiempo permanece online la galería?",
          a: "La duración depende del plan contratado. Por ejemplo, la galería online del plan Plus permanece disponible durante 100 días.",
        },
        {
          q: "¿Los invitados pueden seguir entrando después?",
          a: "Sí, mientras la galería esté activa pueden acceder con el mismo QR o enlace para ver el contenido revelado y revivir el evento.",
        },
        {
          q: "¿Puedo gestionar el contenido después del evento?",
          a: "Sí. El panel te permite revisar la galería y mantener el control de los recuerdos compartidos durante el periodo incluido en tu plan.",
        },
      ],
    },
  },
  en: {
    subtitle: "Everything you need to know before, during and after your event",
    labels: { before: "Before the event", during: "During the event", after: "After the event" },
    groups: {
      before: [
        { q: "Can I prepare Revelao in advance?", a: "Yes. Create and customize the event, choose the reveal time, and prepare the QR signs well before the event date." },
        { q: "How do I get the QR code?", a: "Your event includes a unique QR code that you can download and place on templates, tables, invitations, signs or screens." },
        { q: "Which plan do I need?", a: "Choose based on expected volume: Start includes 200 photos, 30 videos and 60 audios; Plus includes 5,000 photos, 200 videos and 500 audios; Pro is unlimited." },
        { q: "Can I try it before buying?", a: "Yes. The free demo lets you test the guest upload flow and see how the gallery works." },
        { q: "Do I have to design my own signs?", a: "No. Start, Plus and Pro include QR templates to help you prepare your event signage." },
      ],
      during: [
        { q: "Do guests need to download an app?", a: "No. They scan the QR with their phone camera and upload from the browser without installing anything or creating an account." },
        { q: "What can guests share?", a: "They can take and upload photos, record videos and leave voice messages. Plus and Pro also allow uploads from the phone gallery." },
        { q: "Is uploaded content visible immediately?", a: "Revelao keeps the surprise: content stays hidden until the reveal time you have configured." },
        { q: "Can I show photos on a TV or screen?", a: "Yes. Start, Plus and Pro include a live TV slideshow that you can activate during the event." },
        { q: "What if the venue has poor coverage?", a: "Guests can use the same QR again when their connection returns. We recommend printing the short link next to it too." },
      ],
      after: [
        { q: "What happens at the reveal?", a: "Photos, videos and voice messages appear together in the private gallery, accessible from the same QR." },
        { q: "Can I download all the memories?", a: "Yes. Use the management panel to download your event content and keep your own copy." },
        { q: "How long does the gallery stay online?", a: "Availability depends on your plan. The Plus online gallery, for example, stays available for 100 days." },
        { q: "Can guests return afterwards?", a: "Yes. While the gallery is active they can use the same QR or link to view the revealed content." },
        { q: "Can I manage content after the event?", a: "Yes. Your panel lets you review the gallery and manage shared memories during the period included in your plan." },
      ],
    },
  },
  it: {
    subtitle: "Tutto quello che devi sapere prima, durante e dopo il tuo evento",
    labels: { before: "Prima dell’evento", during: "Durante l’evento", after: "Dopo l’evento" },
    groups: {
      before: [
        { q: "Posso preparare Revelao in anticipo?", a: "Sì. Puoi creare e personalizzare l’evento, scegliere il momento della rivelazione e preparare il QR con largo anticipo." },
        { q: "Come ricevo il codice QR?", a: "Ogni evento include un QR esclusivo da scaricare e inserire su modelli, tavoli, inviti, cartelli o schermi." },
        { q: "Quale piano mi serve?", a: "Scegli in base al volume: Start include 200 foto, 30 video e 60 audio; Plus 5.000 foto, 200 video e 500 audio; Pro è illimitato." },
        { q: "Posso provarlo prima dell’acquisto?", a: "Sì. La demo gratuita permette di provare il caricamento degli invitati e il funzionamento della galleria." },
        { q: "Devo creare i cartelli da solo?", a: "No. Start, Plus e Pro includono modelli QR per preparare rapidamente la segnaletica dell’evento." },
      ],
      during: [
        { q: "Gli invitati devono scaricare un’app?", a: "No. Scansionano il QR con la fotocamera e caricano dal browser, senza installazioni né account." },
        { q: "Cosa possono condividere?", a: "Possono scattare e caricare foto, registrare video e lasciare messaggi vocali. Plus e Pro consentono anche il caricamento dalla galleria del telefono." },
        { q: "I contenuti sono visibili subito?", a: "Revelao conserva la sorpresa: i contenuti restano nascosti fino al momento della rivelazione configurato." },
        { q: "Posso mostrare le foto su una TV o uno schermo?", a: "Sì. Start, Plus e Pro includono uno slideshow TV in diretta da attivare durante l’evento." },
        { q: "Cosa succede se c’è poca copertura?", a: "Gli invitati possono usare di nuovo lo stesso QR quando torna la connessione. Consigliamo di stampare anche il link breve." },
      ],
      after: [
        { q: "Cosa succede al momento della rivelazione?", a: "Foto, video e messaggi vocali appaiono insieme nella galleria privata, accessibile dallo stesso QR." },
        { q: "Posso scaricare tutti i ricordi?", a: "Sì. Dal pannello puoi scaricare i contenuti dell’evento e conservarne una copia." },
        { q: "Per quanto tempo resta online la galleria?", a: "La durata dipende dal piano. La galleria online Plus, ad esempio, resta disponibile per 100 giorni." },
        { q: "Gli invitati possono tornare dopo?", a: "Sì. Finché la galleria è attiva possono usare lo stesso QR o link per vedere i contenuti rivelati." },
        { q: "Posso gestire i contenuti dopo l’evento?", a: "Sì. Il pannello consente di controllare la galleria durante il periodo incluso nel piano." },
      ],
    },
  },
};

const phases: FAQPhase[] = ["before", "during", "after"];

export const FAQs = ({ className, title, subtitle, items: itemsOverride }: FAQsProps) => {
  const { lang } = useI18n();
  const t = translations[lang];
  const content = lifecycleFaqs[lang];
  const [activePhase, setActivePhase] = useState<FAQPhase>("before");
  const [openIndex, setOpenIndex] = useState(-1);
  const items = itemsOverride ?? content.groups[activePhase];
  const resolvedSubtitle = subtitle ?? (itemsOverride ? t.faqs.subtitle : content.subtitle);

  const selectPhase = (phase: FAQPhase) => {
    setActivePhase(phase);
    setOpenIndex(-1);
  };

  const openExample = (example: "in-progress" | "finished") => {
    window.dispatchEvent(new CustomEvent("openExamplePreview", { detail: { example } }));
  };

  return (
    <div className={className}>
      <div className="mb-7 text-center md:mb-9">
        <h2 className="revelao-h2 mb-2 text-center">{title ?? t.faqs.title}</h2>
        {resolvedSubtitle ? (
          <p className="revelao-h3 mx-auto mb-2 max-w-2xl text-center">{resolvedSubtitle}</p>
        ) : null}
      </div>

      {!itemsOverride ? (
        <div className="mx-auto mb-6 grid w-full max-w-[680px] grid-cols-3 gap-1 rounded-[14px] border border-border bg-white p-1.5 shadow-sm" role="tablist" aria-label="Momento del evento">
          {phases.map((phase) => (
            <button
              key={phase}
              type="button"
              role="tab"
              aria-selected={activePhase === phase}
              onClick={() => selectPhase(phase)}
              className={`min-h-11 rounded-[10px] px-2 py-2 text-xs font-semibold leading-tight transition-colors sm:px-4 sm:text-sm ${
                activePhase === phase
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {content.labels[phase]}
            </button>
          ))}
        </div>
      ) : null}

      <div className="mx-auto flex w-full max-w-[680px] flex-col gap-3">
        {items.map((faq, index) => {
          const isOpen = index === openIndex;
          return (
            <div key={faq.q} className="overflow-hidden rounded-[10px] border border-border bg-white">
              <button
                type="button"
                className="flex w-full cursor-pointer items-center bg-white px-4 py-3 text-left transition-colors hover:bg-neutral-50"
                onClick={() => setOpenIndex((current) => (current === index ? -1 : index))}
                aria-expanded={isOpen}
              >
                <div className="flex size-10 shrink-0 items-center justify-center">
                  <div className="relative size-[14px]">
                    <div className="absolute left-0 top-1/2 h-px w-[14px] -translate-y-1/2 rounded-sm bg-neutral-900" />
                    <div
                      className={`absolute left-1/2 top-0 h-[14px] w-px -translate-x-1/2 rounded-full bg-neutral-900 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
                    />
                  </div>
                </div>
                <span className="flex-1 text-base leading-[21px] tracking-[-0.01em] text-neutral-900">{faq.q}</span>
              </button>
              <div className={`grid bg-white transition-all duration-200 ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                <div className="overflow-hidden">
                  <div className="px-4 pb-4 pl-[50px] text-sm leading-relaxed text-neutral-600">
                    <p>{faq.a}</p>
                    {faq.link?.href ? (
                      <a
                        href={faq.link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex font-semibold text-primary underline-offset-4 hover:underline"
                      >
                        {faq.link.label}
                      </a>
                    ) : faq.link?.example ? (
                      <button
                        type="button"
                        onClick={() => openExample(faq.link!.example!)}
                        className="mt-3 inline-flex font-semibold text-primary underline-offset-4 hover:underline"
                      >
                        {faq.link.label}
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
