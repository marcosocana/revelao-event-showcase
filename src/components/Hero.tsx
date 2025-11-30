import { Button } from "@/components/ui/button";
import ruedaVideo from "@/assets/rueda.mp4";
import corazon from "@/assets/corazon.svg";
export const Hero = () => {
  return <section className="relative h-[80vh] px-4 overflow-hidden flex items-center" id="inicio">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video autoPlay loop muted playsInline preload="auto" className="w-full h-full object-cover blur-sm" style={{
        filter: 'blur(4px)'
      }}>
          <source src={ruedaVideo} type="video/mp4" />
          Tu navegador no soporta el elemento de video.
        </video>
      </div>
      <div className="absolute inset-0 z-0 bg-white/85" />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="flex flex-col items-center justify-center">
          <div className="text-center animate-fade-in max-w-3xl">
            <div className="inline-flex items-center justify-center w-20 h-20 md:w-56 md:h-56 mb-8">
              <img src={corazon} alt="Revelao.cam" className="w-16 h-16 md:w-48 md:h-48 shadow-none" />
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-black">
              Captura hoy,{" "}
              <span className="text-primary">revela mañana</span>
            </h1>
            
            <p className="text-lg md:text-xl text-black/90 mb-8">
              Tus invitados suben fotos de forma anónima durante el evento. La magia ocurre al día siguiente cuando todas las imágenes se revelan a la misma hora.
            </p>

            <div className="flex flex-wrap justify-center gap-8 text-sm text-black/80 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-black" />
                <span>100% anónimo</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-black" />
                <span>Sin apps</span>
              </div>
              
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                size="lg" 
                variant="ghost" 
                className="border border-border hover:bg-muted" 
                asChild
              >
                <a href="https://wa.me/34695834018?text=Hola! Estoy interesado en contratar Revelao.cam. ¿Puedes darme más información?">
                  ¿Hablamos?
                </a>
              </Button>
              <Button 
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => {
                  const event = new CustomEvent('openPricingModal');
                  window.dispatchEvent(event);
                }}
              >
                Comenzar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
