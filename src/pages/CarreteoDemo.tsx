import { useEffect, useState } from "react";
import { RotateCcw, Zap } from "lucide-react";
import styles from "./carreteo.module.css";

export function CarreteoDemo() {
  const [fotos, setFotos] = useState(3);
  const [flash, setFlash] = useState(false);
  const [mensaje, setMensaje] = useState("18 fotos disponibles");

  useEffect(() => {
    if (!flash) return;
    const timer = window.setTimeout(() => setFlash(false), 360);
    return () => window.clearTimeout(timer);
  }, [flash]);

  const disparar = () => {
    if (fotos >= 6) {
      setMensaje("¡Carrete de prueba completo!");
      return;
    }
    setFlash(false);
    window.requestAnimationFrame(() => setFlash(true));
    setFotos((actual) => actual + 1);
    setMensaje(`${17 - fotos} fotos disponibles`);
  };

  const reiniciar = () => {
    setFotos(3);
    setMensaje("18 fotos disponibles");
  };

  return (
    <div className={styles.demoWrap}>
      <div className={`${styles.demoFlash} ${flash ? styles.demoFlashActive : ""}`} />
      <div className={styles.demoPhone}>
        <div className={styles.demoStatus}><span>23:48</span><strong>CARRETEO</strong><Zap size={14} fill="currentColor" /></div>
        <div className={styles.demoView}>
          <img src="/carreteo/fiesta-candid.png" alt="Vista previa de la cámara" />
          <span className={styles.cornerOne} /><span className={styles.cornerTwo} /><span className={styles.cornerThree} /><span className={styles.cornerFour} />
          <div className={styles.demoCounter}>{String(fotos).padStart(2, "0")} / 21</div>
        </div>
        <div className={styles.demoControls}>
          <button type="button" className={styles.resetButton} onClick={reiniciar} aria-label="Reiniciar demo"><RotateCcw size={19} /></button>
          <button type="button" className={styles.shutterButton} onClick={disparar} aria-label="Hacer foto"><span /></button>
          <div className={styles.filmThumb}><img src="/carreteo/fiesta-candid.png" alt="Última foto" /></div>
        </div>
        <p aria-live="polite">{mensaje}</p>
      </div>
      <span className={styles.demoHint}>Pulsa el disparador ↑</span>
    </div>
  );
}
