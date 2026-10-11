import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, Download, LayoutGrid, LayoutList, X } from "lucide-react";

/*
 * Galería de ejemplo con el mismo aspecto que la galería revelada real
 * (tomorrow-snap-reveal/src/components/carreteo/CarreteoGallery.tsx).
 * Las fotos hechas en la demo de la cámara aparecen las primeras.
 */

const COVER_PHOTO = "/hero/14.jpg";
const SAMPLE_PHOTOS = [12, 17, 11, 20, 21, 19, 13, 16, 18, 15].map((n) => `/hero/${n}.jpg`);

type Props = {
  ownPhotos: string[];
  onClose: () => void;
  onBuy: () => void;
};

export const CarreteoGalleryDemo = ({ ownPhotos, onClose, onBuy }: Props) => {
  const photos = [...ownPhotos, ...SAMPLE_PHOTOS];
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia("(min-width: 1024px)").matches);
  const [viewMode, setViewMode] = useState<"normal" | "grid">("grid");
  const [selected, setSelected] = useState<string | null>(null);
  const effectiveView = isDesktop ? "grid" : viewMode;

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const onKey = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key !== "Escape") return;
      if (selected) setSelected(null);
      else onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, selected]);

  const download = (url: string) => {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "carreteo-ejemplo.jpg";
    anchor.click();
  };

  return createPortal(
    <div className="fixed inset-0 z-[30000] overflow-y-auto bg-background text-foreground" role="dialog" aria-modal="true" aria-label="Galería de ejemplo de Carreteo">
      <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-black/10 bg-[#ffcb22] px-4 py-3 text-[#111113] sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.12em] sm:text-sm">Galería de ejemplo</p>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onBuy} className="inline-flex items-center gap-1.5 rounded-full bg-[#111113] px-4 py-2 text-xs font-bold text-white sm:text-sm">
            Crear mi carrete <ArrowRight className="h-4 w-4" />
          </button>
          <button type="button" onClick={onClose} aria-label="Cerrar la galería" className="grid h-9 w-9 place-items-center rounded-full bg-white/70">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <header className="relative w-full">
        <div className="relative h-[50vh] max-h-[450px] min-h-[320px] w-full overflow-hidden rounded-b-3xl">
          <img src={COVER_PHOTO} alt="Boda de Lucía y Pablo" className="absolute inset-0 h-full w-full object-cover object-top lg:object-center" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        </div>
        <div className="relative -mt-20 px-6 pb-6 text-center">
          <h1 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">Boda de Lucía y Pablo</h1>
          <p className="text-sm tracking-wide text-muted-foreground">Revelado el día después, a las 12:00</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {photos.length} fotos{ownPhotos.length ? ` · ${ownPhotos.length} ${ownPhotos.length === 1 ? "es tuya" : "son tuyas"}` : ""}
          </p>
        </div>
      </header>

      {!isDesktop ? (
        <div className="mx-auto mb-4 max-w-7xl px-6">
          <div className="mx-auto flex w-full max-w-2xl rounded-2xl bg-muted p-1">
            {(["normal", "grid"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setViewMode(mode)}
                className={`flex flex-1 items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  viewMode === mode ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
                aria-label={mode === "normal" ? "Vista de lista" : "Vista de cuadrícula"}
              >
                {mode === "normal" ? <LayoutList className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {effectiveView === "grid" ? (
        <div className="grid grid-cols-3 gap-[2px] bg-white sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {photos.map((photo, index) => (
            <button
              key={`${photo}-${index}`}
              type="button"
              onClick={() => setSelected(photo)}
              className="group relative aspect-square overflow-hidden bg-muted outline-none focus-visible:ring focus-visible:ring-primary/60"
            >
              <img src={photo} alt="Foto del carrete" loading="lazy" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
              {index < ownPhotos.length ? (
                <span className="absolute left-1.5 top-1.5 rounded-full bg-[#ffcb22] px-2 py-0.5 text-[10px] font-bold text-[#111113]">TUYA</span>
              ) : null}
            </button>
          ))}
        </div>
      ) : (
        <div className="mx-auto max-w-7xl space-y-3 px-6 pb-6">
          {photos.map((photo, index) => (
            <button
              key={`${photo}-${index}`}
              type="button"
              onClick={() => setSelected(photo)}
              className="relative block aspect-[4/5] w-full overflow-hidden rounded-2xl outline-none focus-visible:ring focus-visible:ring-primary/60"
            >
              <img src={photo} alt="Foto del carrete" loading="lazy" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {selected ? (
        <div className="fixed inset-0 z-20 grid place-items-center bg-black/80 p-4" onClick={() => setSelected(null)}>
          <div className="w-full max-w-4xl space-y-4 rounded-xl bg-card p-4 sm:p-6" onClick={(clickEvent) => clickEvent.stopPropagation()}>
            <div className="flex justify-end">
              <button type="button" onClick={() => setSelected(null)} aria-label="Cerrar foto" className="grid h-8 w-8 place-items-center rounded-full bg-muted">
                <X className="h-4 w-4" />
              </button>
            </div>
            <img src={selected} alt="Foto ampliada" className="h-auto max-h-[65vh] w-full rounded-lg object-contain" />
            <button
              type="button"
              onClick={() => download(selected)}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-secondary px-3 py-2 text-sm font-medium uppercase tracking-wide"
            >
              <Download className="h-4 w-4" /> Descargar
            </button>
          </div>
        </div>
      ) : null}
    </div>,
    document.body,
  );
};
