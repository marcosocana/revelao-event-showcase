import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { createPortal } from "react-dom";
import { Aperture, ArrowRight, ArrowUpRight, Lock, X, ZapOff } from "lucide-react";
import { playShutter, playWindLock, playWindTick, unlockCarreteoAudio } from "./carreteoSounds";
import { loadCameraFonts } from "./carreteoFonts";
import "./CarreteoCameraDemo.css";

/*
 * Demo de la cámara real de Carreteo (tomorrow-snap-reveal/src/pages/CarreteoPublic.tsx).
 * Mismo diseño y misma mecánica (rueda, flash, contador, guía de la primera vez), pero sin API:
 * las fotos se quedan en este navegador y se pueden ver en la galería de ejemplo.
 */

type CameraState = "idle" | "starting" | "ready" | "fallback";
type Effect = { kind: "flash" | "blink"; key: number } | null;

const TOTAL_SHOTS = 25;
const WIND_TRAVEL = 88;
const TICK_EVERY = 11;
const WHEEL_WIDTH_UNITS = 131;
const DESIGN_WIDTH = 1000;
const DESIGN_HEIGHT = 461.5;
// Si el visitante no da acceso a la cámara, se "fotografía" esta foto de ejemplo.
const FALLBACK_IMAGE = "/hero/11.jpg";

// Guía de la primera vez, igual que en la cámara real. En la demo sale siempre al abrirla sin fotos.
type CoachStep = { id: "dial" | "flash" | "wind" | "shoot"; badge?: string; title: string; text: (shots: number) => string };
const COACH_STEPS: CoachStep[] = [
  { id: "dial", title: "Tu carrete", text: (shots) => `Tienes ${shots} fotos. Aquí ves cuántas llevas: cuando se acaban, se acabó el carrete.` },
  { id: "flash", title: "Flash", text: () => "Actívalo para hacer fotos con poca luz." },
  { id: "wind", badge: "1", title: "Gira la rueda", text: () => "Antes de cada foto, arrastra la rueda con el dedo hasta que haga clic." },
  { id: "shoot", badge: "2", title: "Dispara", text: () => "Pulsa el botón para hacer la foto. Las verás todas el día del revelado." },
];

const vibrate = (pattern: number | number[]) => {
  try {
    navigator.vibrate?.(pattern);
  } catch {
    // La vibración es un extra; algunos navegadores lanzan fuera de un gesto.
  }
};

type ScreenSize = { width: number; height: number };
const measureScreen = (): ScreenSize => ({ width: window.innerWidth, height: window.innerHeight });

const useScreenSize = () => {
  const [size, setSize] = useState<ScreenSize>(() => measureScreen());
  useEffect(() => {
    const timers: number[] = [];
    const update = () => setSize((current) => {
      const next = measureScreen();
      return current.width === next.width && current.height === next.height ? current : next;
    });
    const settle = () => {
      update();
      timers.splice(0).forEach((timer) => window.clearTimeout(timer));
      [60, 180, 400, 800].forEach((delay) => timers.push(window.setTimeout(update, delay)));
    };
    settle();
    window.addEventListener("resize", settle);
    window.addEventListener("orientationchange", settle);
    window.visualViewport?.addEventListener("resize", settle);
    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener("resize", settle);
      window.removeEventListener("orientationchange", settle);
      window.visualViewport?.removeEventListener("resize", settle);
    };
  }, []);
  return size;
};

type FullscreenTarget = HTMLElement & { webkitRequestFullscreen?: () => Promise<void> | void };
type FullscreenDocument = Document & { webkitFullscreenElement?: Element | null; webkitExitFullscreen?: () => void };
type LockableOrientation = ScreenOrientation & { lock?: (orientation: string) => Promise<void>; unlock?: () => void };

const isTouchDevice = () => window.matchMedia("(pointer: coarse)").matches;

// Pantalla completa y horizontal en móvil, como la cámara real (Android; en iPhone no existe la API).
const enterFullscreen = () => {
  if (!isTouchDevice()) return;
  const doc = document as FullscreenDocument;
  if (doc.fullscreenElement || doc.webkitFullscreenElement) return;
  const root = document.documentElement as FullscreenTarget;
  const request = root.requestFullscreen
    ? () => root.requestFullscreen({ navigationUI: "hide" })
    : root.webkitRequestFullscreen?.bind(root);
  if (!request) return;
  try {
    void Promise.resolve(request())
      .then(() => (screen.orientation as LockableOrientation | undefined)?.lock?.("landscape"))
      .catch(() => undefined);
  } catch {
    // Algunos navegadores lanzan en vez de rechazar; la demo sigue funcionando.
  }
};

const exitFullscreen = () => {
  const doc = document as FullscreenDocument;
  try {
    (screen.orientation as LockableOrientation | undefined)?.unlock?.();
    if (doc.fullscreenElement) void document.exitFullscreen().catch(() => undefined);
    else if (doc.webkitFullscreenElement) doc.webkitExitFullscreen?.();
  } catch {
    // Nada que hacer: el usuario puede salir con el gesto del sistema.
  }
};

const captureFrame = (source: HTMLVideoElement | HTMLImageElement) => new Promise<string>((resolve, reject) => {
  const width = source instanceof HTMLVideoElement ? source.videoWidth : source.naturalWidth;
  const height = source instanceof HTMLVideoElement ? source.videoHeight : source.naturalHeight;
  if (!width || !height) { reject(new Error("CAPTURE_FAILED")); return; }
  const scale = Math.min(1, 1600 / Math.max(width, height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  const context = canvas.getContext("2d");
  if (!context) { reject(new Error("CAPTURE_FAILED")); return; }
  context.drawImage(source, 0, 0, canvas.width, canvas.height);
  canvas.toBlob((blob) => (blob ? resolve(URL.createObjectURL(blob)) : reject(new Error("CAPTURE_FAILED"))), "image/jpeg", 0.86);
});

const WeeeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
    <path d="M7 7h10l-1 13H8L7 7Z" />
    <path d="M6 7h12M10 4h4" />
    <path d="M4 3l16 18M20 3 4 21" />
  </svg>
);

const PersonIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="12" cy="4" r="2.6" />
    <path d="M9.2 8h5.6c1 0 1.7.8 1.7 1.7v5.1c0 .6-.5 1.1-1.1 1.1h-.6V22a1 1 0 0 1-1 1h-3.6a1 1 0 0 1-1-1v-6.1h-.6c-.6 0-1.1-.5-1.1-1.1V9.7C7.5 8.8 8.2 8 9.2 8Z" />
  </svg>
);

const CarreteoWave = () => (
  <svg viewBox="0 0 1000 160" preserveAspectRatio="none" aria-hidden="true">
    <defs>
      <linearGradient id="crt-demo-yellow" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="var(--crt-yellow-top)" />
        <stop offset="100%" stopColor="var(--crt-yellow-bottom)" />
      </linearGradient>
    </defs>
    <path d="M0 0H1000V128C945 143 885 151 822 151C650 149 470 117 310 119C185 120 85 131 0 138Z" fill="url(#crt-demo-yellow)" />
    <path
      d="M0 138C85 131 185 120 310 119C470 117 650 149 822 151C885 151 945 143 1000 128"
      fill="none"
      stroke="var(--crt-red)"
      vectorEffect="non-scaling-stroke"
      style={{ strokeWidth: "calc(var(--u) * 3.2)" }}
    />
  </svg>
);

type Props = {
  photos: string[];
  onPhoto: (url: string) => void;
  onClose: () => void;
  onOpenGallery: () => void;
};

export const CarreteoCameraDemo = ({ photos, onPhoto, onClose, onOpenGallery }: Props) => {
  const shotsTaken = Math.min(photos.length, TOTAL_SHOTS);
  const [wound, setWound] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [cameraState, setCameraState] = useState<CameraState>("idle");
  const [effect, setEffect] = useState<Effect>(null);
  const [filmTipOpen, setFilmTipOpen] = useState(false);
  const [tickKey, setTickKey] = useState(0);
  const [coachStep, setCoachStep] = useState<number>(() => (photos.length === 0 ? 0 : -1));
  const [hint, setHint] = useState<{ target: "wind" | "shoot"; key: number } | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fallbackRef = useRef<HTMLImageElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const wheelRef = useRef<HTMLButtonElement>(null);
  const wheelOffset = useRef(0);
  const windLocked = useRef(false);
  const drag = useRef({ active: false, pointerId: -1, lastX: 0, moved: 0, travel: 0, sinceTick: 0 });

  const rollFinished = shotsTaken >= TOTAL_SHOTS;

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const startCamera = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) { setCameraState("fallback"); return; }
    setCameraState("starting");
    try {
      stopCamera();
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1920 }, height: { ideal: 1080 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => undefined);
      }
      setCameraState("ready");
    } catch {
      setCameraState("fallback");
    }
  }, [stopCamera]);

  useEffect(() => {
    if (rollFinished) { stopCamera(); return; }
    if (cameraState === "idle") void startCamera();
  }, [cameraState, rollFinished, startCamera, stopCamera]);

  useEffect(() => () => { stopCamera(); exitFullscreen(); }, [stopCamera]);
  useEffect(loadCameraFonts, []);

  const close = useCallback(() => {
    stopCamera();
    exitFullscreen();
    onClose();
  }, [onClose, stopCamera]);

  useEffect(() => {
    const onKey = (keyboardEvent: KeyboardEvent) => { if (keyboardEvent.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  const screenSize = useScreenSize();
  // Con el móvil en vertical la cámara se dibuja girada 90° para ocupar toda la pantalla.
  const rotated = screenSize.height > screenSize.width;
  const rotatedRef = useRef(rotated);
  rotatedRef.current = rotated;

  useEffect(() => {
    const roots = [document.documentElement, document.body];
    const scrollY = window.scrollY;
    roots.forEach((element) => element.classList.add("crt-locked"));
    const preventScroll = (touchEvent: TouchEvent) => { if (touchEvent.cancelable) touchEvent.preventDefault(); };
    const preventGesture = (gestureEvent: Event) => gestureEvent.preventDefault();
    document.addEventListener("touchmove", preventScroll, { passive: false });
    document.addEventListener("gesturestart", preventGesture);
    return () => {
      roots.forEach((element) => element.classList.remove("crt-locked"));
      document.removeEventListener("touchmove", preventScroll);
      document.removeEventListener("gesturestart", preventGesture);
      window.scrollTo(0, scrollY);
    };
  }, []);

  const coachOpen = coachStep >= 0;
  const closeCoach = () => setCoachStep(-1);
  const nextCoachStep = () => {
    if (!coachOpen) return;
    setCoachStep(coachStep >= COACH_STEPS.length - 1 ? -1 : coachStep + 1);
  };

  const cameraReady = cameraState === "ready" || cameraState === "fallback";
  const canWind = !wound && !rollFinished;
  const canShoot = wound && !rollFinished && cameraReady;

  const paintWheel = () => {
    wheelRef.current?.style.setProperty("--crt-wheel-offset", `${wheelOffset.current}px`);
  };

  const setWindLocked = (locked: boolean) => {
    windLocked.current = locked;
    setWound(locked);
  };

  const completeWind = () => {
    drag.current = { ...drag.current, active: false, travel: 0, sinceTick: 0 };
    setWindLocked(true);
    playWindLock();
    vibrate([12, 40, 18]);
  };

  const advanceWheel = (units: number, offsetPx: number) => {
    if (windLocked.current) return;
    const state = drag.current;
    wheelOffset.current += offsetPx;
    paintWheel();
    state.travel += units;
    state.sinceTick += units;
    while (state.sinceTick >= TICK_EVERY) {
      state.sinceTick -= TICK_EVERY;
      playWindTick();
      vibrate(4);
    }
    if (state.travel >= WIND_TRAVEL) completeWind();
  };

  const unitPx = () => (wheelRef.current?.offsetWidth ?? WHEEL_WIDTH_UNITS) / WHEEL_WIDTH_UNITS;

  const nudgeWheel = () => {
    if (!canWind) return;
    const px = unitPx();
    for (let step = 0; step < 3; step += 1) {
      window.setTimeout(() => advanceWheel(TICK_EVERY, TICK_EVERY * px), step * 55);
    }
  };

  const onWheelPointerDown = (pointerEvent: ReactPointerEvent<HTMLButtonElement>) => {
    unlockCarreteoAudio();
    if (!canWind) return;
    pointerEvent.currentTarget.setPointerCapture(pointerEvent.pointerId);
    const position = rotatedRef.current ? pointerEvent.clientY : pointerEvent.clientX;
    drag.current = { ...drag.current, active: true, pointerId: pointerEvent.pointerId, lastX: position, moved: 0 };
  };

  const onWheelPointerMove = (pointerEvent: ReactPointerEvent<HTMLButtonElement>) => {
    const state = drag.current;
    if (!state.active || pointerEvent.pointerId !== state.pointerId) return;
    const position = rotatedRef.current ? pointerEvent.clientY : pointerEvent.clientX;
    const dx = position - state.lastX;
    state.lastX = position;
    const units = Math.abs(dx) / unitPx();
    state.moved += units;
    advanceWheel(units, dx);
  };

  const onWheelPointerUp = (pointerEvent: ReactPointerEvent<HTMLButtonElement>) => {
    const state = drag.current;
    if (!state.active || pointerEvent.pointerId !== state.pointerId) return;
    state.active = false;
    if (state.moved < 3) nudgeWheel();
  };

  const shoot = async () => {
    unlockCarreteoAudio();
    if (!canShoot) return;
    const source = cameraState === "ready" ? videoRef.current : fallbackRef.current;
    if (!source) return;
    playShutter();
    vibrate(28);
    setEffect({ kind: flashOn ? "flash" : "blink", key: Date.now() });
    setWindLocked(false);
    setTickKey((key) => key + 1);
    try {
      onPhoto(await captureFrame(source));
    } catch {
      // Si no se pudo leer el fotograma, la demo cuenta el disparo con la foto de ejemplo.
      onPhoto(FALLBACK_IMAGE);
    }
  };

  const status = (() => {
    if (rollFinished) return { text: "CARRETE COMPLETO" };
    if (cameraState === "starting") return { text: "PREPARANDO LA CÁMARA…" };
    if (wound) return { text: "LISTA PARA DISPARAR", icon: <ArrowRight aria-hidden="true" /> };
    return { text: "AVANZA LA RUEDA", icon: <ArrowUpRight aria-hidden="true" /> };
  })();

  const barGap = Math.min(3.4, 186 / (TOTAL_SHOTS * 2));
  const cameraWidth = rotated ? screenSize.height : screenSize.width;
  const cameraHeight = rotated ? screenSize.width : screenSize.height;
  const cameraStyle = {
    width: `${cameraWidth}px`,
    height: `${cameraHeight}px`,
    transform: rotated ? `translateX(${screenSize.width}px) rotate(90deg)` : "none",
    "--u": `${Math.min(cameraWidth / DESIGN_WIDTH, cameraHeight / DESIGN_HEIGHT)}px`,
  } as CSSProperties;

  return createPortal(
    <main
      className={`crt-page ${rotated ? "is-rotated" : ""}`}
      style={cameraStyle}
      onPointerDown={(pointerEvent) => {
        unlockCarreteoAudio();
        enterFullscreen();
        // Como en la cámara real: tocar algo que no sea el paso que toca ilumina la rueda o el disparador.
        if (coachOpen) return;
        const target = canWind ? "wind" : canShoot ? "shoot" : null;
        if (!target) return;
        const touched = (pointerEvent.target as Element).closest(".crt-wheel, .crt-shutter, .crt-flash-toggle, .crt-film, .crt-status, .crt-demo-close, .crt-demo-gallery");
        const expected = target === "wind" ? "crt-wheel" : "crt-shutter";
        if (touched && (touched.classList.contains(expected) || !touched.matches(".crt-wheel, .crt-shutter"))) return;
        setHint({ target, key: Date.now() });
        vibrate(10);
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Demo de la cámara Carreteo"
    >
      <div className="crt-top"><CarreteoWave /></div>
      <div className="crt-stage">
        {[[5, 10], [5, 90], [95, 90]].map(([left, top]) => (
          <span key={`${left}-${top}`} className="crt-at crt-screw" style={{ left: `${left}%`, top: `${top}%` }} aria-hidden="true" />
        ))}
        <button type="button" className="crt-at crt-demo-close" onClick={close} aria-label="Cerrar la demo"><X /></button>
        <span className="crt-at crt-demo-badge" aria-hidden="true">MODO DEMO · TUS FOTOS NO SE SUBEN</span>

        <header className="crt-brand">
          <h1 className="crt-brand-name">CARRETEO<span>.</span></h1>
          <p className="crt-brand-sub">CÁMARA DE UN SOLO USO</p>
        </header>

        <button
          ref={wheelRef}
          type="button"
          className={`crt-at crt-wheel ${canWind ? "" : "is-locked"}`}
          aria-label="Rueda de arrastre: gírala para avanzar el carrete"
          aria-disabled={!canWind}
          onPointerDown={onWheelPointerDown}
          onPointerMove={onWheelPointerMove}
          onPointerUp={onWheelPointerUp}
          onPointerCancel={() => { drag.current.active = false; }}
          onKeyDown={(keyboardEvent) => {
            if (["Enter", " ", "ArrowRight", "ArrowLeft"].includes(keyboardEvent.key)) {
              keyboardEvent.preventDefault();
              unlockCarreteoAudio();
              nudgeWheel();
            }
          }}
        />
        <div className={`crt-at crt-step crt-step-wind ${canWind ? "is-pulsing" : "is-hidden"} ${hint?.target === "wind" ? "is-hinted" : ""}`} aria-hidden="true">
          <span className="crt-step-badge">1</span><ArrowRight />
        </div>

        {/* Cámara desechable: sin visor. El vídeo queda oculto y solo sirve para capturar. */}
        <div className="crt-viewfinder" aria-hidden="true">
          {cameraState === "fallback" ? (
            <img ref={fallbackRef} src={FALLBACK_IMAGE} alt="" />
          ) : (
            <video ref={videoRef} muted playsInline autoPlay />
          )}
        </div>

        <span className={`crt-at crt-led ${flashOn ? "is-on" : ""}`} aria-hidden="true" />
        <button
          type="button"
          role="switch"
          aria-checked={flashOn}
          aria-label="Flash"
          className={`crt-at crt-flash-toggle ${flashOn ? "is-on" : ""}`}
          onClick={() => setFlashOn((on) => !on)}
        >
          <span className="crt-flash-knob" />
          <svg className="crt-flash-bolt" viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 2 4 14h6.5L9.5 22 20 9.5h-6.8L13.5 2Z" /></svg>
        </button>
        <span className="crt-at crt-label crt-flash-label">FLASH</span>
        <span className="crt-at crt-range"><PersonIcon />1–3 m</span>

        <div className="crt-at crt-dial" role="status" aria-label={`${shotsTaken} de ${TOTAL_SHOTS} fotos`}>
          <div className="crt-dial-face">
            <span className="crt-dial-marker" />
            <span key={tickKey} className={`crt-dial-number ${tickKey ? "is-ticking" : ""}`}>{shotsTaken}</span>
            <span className="crt-dial-total">de {TOTAL_SHOTS}</span>
          </div>
        </div>
        <p className="crt-at crt-status" aria-live="polite" style={{ margin: 0 }}>{status.text}{status.icon ?? null}</p>
        <div
          className="crt-at crt-bars"
          style={{ gridTemplateColumns: `repeat(${TOTAL_SHOTS}, 1fr)`, columnGap: `calc(var(--u) * ${barGap})` }}
          aria-hidden="true"
        >
          {Array.from({ length: TOTAL_SHOTS }, (_, index) => <span key={index} className={index < shotsTaken ? "is-on" : ""} />)}
        </div>

        {shotsTaken > 0 ? (
          <button type="button" className="crt-at crt-demo-gallery" onClick={() => { stopCamera(); onOpenGallery(); }}>
            VER EL REVELADO →
          </button>
        ) : (
          <button
            type="button"
            className="crt-at crt-film"
            aria-label="Película Gold 400. En un evento real, las fotos se revelan a la hora que elijas"
            onClick={() => setFilmTipOpen((open) => !open)}
          >
            <Lock aria-hidden="true" />GOLD 400
          </button>
        )}
        {filmTipOpen && shotsTaken === 0 ? <div className="crt-at crt-film-tooltip" role="tooltip">En tu evento, las fotos se revelan a la hora que elijas</div> : null}

        <button
          type="button"
          className={`crt-at crt-shutter ${canShoot ? "is-ready" : ""}`}
          aria-label="Disparar"
          // aria-disabled y no disabled: así el toque llega y se puede iluminar la rueda.
          aria-disabled={!canShoot}
          onClick={() => void shoot()}
        >
          <span className="crt-shutter-ring"><Aperture aria-hidden="true" /></span>
        </button>
        <div className={`crt-at crt-step crt-step-shoot ${canShoot ? "is-pulsing" : "is-hidden"} ${hint?.target === "shoot" ? "is-hinted" : ""}`} aria-hidden="true">
          <span className="crt-step-badge">2</span>
        </div>

        <div className="crt-legal" aria-hidden="true">
          <p>CARRETEO™ · CÁMARA DE UN SOLO USO · APPAREIL PHOTO JETABLE</p>
          <p>PELÍCULA 400 · {TOTAL_SHOTS} EXPOSICIONES · HECHO PARA RECORDAR</p>
          <p>DEVELOP · WIND · SHOOT · REPEAT — Nº 0000 / DEMO</p>
        </div>
        <div className="crt-marks" aria-hidden="true">
          <span className="crt-mark-ce">CE</span>
          <WeeeIcon />
          <ZapOff />
          <span className="crt-mark-iso">800</span>
        </div>

        {hint ? (
          <span
            key={hint.key}
            className={`crt-at crt-hint crt-hint-${hint.target}`}
            aria-hidden="true"
            onAnimationEnd={() => setHint(null)}
          />
        ) : null}

        {coachOpen ? (() => {
          const step = COACH_STEPS[coachStep];
          const last = coachStep === COACH_STEPS.length - 1;
          return (
            <div className="crt-coach" role="dialog" aria-modal="true" aria-labelledby="crt-coach-title" onClick={nextCoachStep}>
              <span className={`crt-at crt-coach-spot crt-coach-spot-${step.id}`} aria-hidden="true" />
              <div className={`crt-at crt-coach-card crt-coach-card-${step.id}`} onClick={(clickEvent) => clickEvent.stopPropagation()}>
                <p className="crt-coach-count">{coachStep + 1} / {COACH_STEPS.length}</p>
                <h2 id="crt-coach-title">{step.badge ? <span className="crt-step-badge">{step.badge}</span> : null}{step.title}</h2>
                <p className="crt-coach-text">{step.text(TOTAL_SHOTS)}</p>
                <div className="crt-coach-actions">
                  {!last ? <button type="button" className="crt-coach-skip" onClick={closeCoach}>Saltar</button> : null}
                  <button type="button" className="crt-coach-next" onClick={nextCoachStep} autoFocus>{last ? "¡A disparar!" : "Siguiente"}</button>
                </div>
              </div>
            </div>
          );
        })() : null}
      </div>

      {effect ? (
        <div
          key={effect.key}
          className={effect.kind === "flash" ? "crt-flash-burst" : "crt-shutter-blink"}
          onAnimationEnd={() => setEffect(null)}
        />
      ) : null}
    </main>,
    document.body,
  );
};
