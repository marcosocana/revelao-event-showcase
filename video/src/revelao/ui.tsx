import React from "react";
import { AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/GreatVibes";
import { Video } from "@remotion/media";
import { Camera, Check, Image as ImageIcon, LogOut, Mic, Play, Share2, Video as VideoIcon } from "lucide-react";
import { C } from "../theme";
import { usePop } from "../ui";

export const { fontFamily: scriptFont } = loadFont("normal", { weights: ["400"], subsets: ["latin"] });

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const rv = (file: string) => staticFile(`revelao/${file}`);

export const NAMES = "Rodrigo & María";

export type Counts = { fotos: number; videos: number; audios: number };

const IconBtn: React.FC<{ children: React.ReactNode; right?: boolean }> = ({ children, right }) => (
  <div
    style={{
      position: "absolute",
      top: 68,
      [right ? "right" : "left"]: 18,
      width: 48,
      height: 48,
      borderRadius: 12,
      backgroundColor: "rgba(0,0,0,0.35)",
      color: "#FFFFFF",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {children}
  </div>
);

/** Cabecera del evento tal y como la ve el invitado: foto de portada, nombres y contadores. */
export const Hero: React.FC<{ height?: number; counts: Counts; revealed?: boolean }> = ({ height = 400, counts, revealed = false }) => (
  <div style={{ position: "relative", height, overflow: "hidden" }}>
    <Img src={rv("still-esc33-1.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%" }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.7) 100%)" }} />
    <IconBtn>
      <LogOut size={24} />
    </IconBtn>
    <IconBtn right>
      <Share2 size={24} />
    </IconBtn>
    <div style={{ position: "absolute", left: 22, right: 22, bottom: 20, color: "#FFFFFF" }}>
      <div style={{ fontFamily: scriptFont, fontSize: 60, lineHeight: 1.05 }}>{NAMES}</div>
      <div style={{ fontSize: 19, marginTop: 6, opacity: 0.95 }}>26/09/2026</div>
      <div style={{ fontSize: 20, marginTop: 4 }}>¡Bienvenidos a nuestra boda!</div>
      {revealed ? <div style={{ fontSize: 17, marginTop: 6 }}>✨ Ya se ha revelado el contenido del evento</div> : null}
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 17, marginTop: 6, opacity: 0.95 }}>
        <Camera size={18} /> {counts.fotos} fotos / <VideoIcon size={18} /> {counts.videos} vídeos / <Mic size={18} /> {counts.audios} audios
      </div>
    </div>
  </div>
);

const ActionTile: React.FC<{ icon: React.ReactNode; label: string; pressed: number }> = ({ icon, label, pressed }) => (
  <div
    style={{
      flex: 1,
      height: 150,
      borderRadius: 24,
      border: `1px solid ${C.border}`,
      backgroundColor: "#FFFFFF",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 14,
      scale: String(pressed),
    }}
  >
    <div style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: "#111111", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {icon}
    </div>
    <div style={{ fontSize: 20, fontWeight: 600, color: C.ink }}>{label}</div>
  </div>
);

/** Pantalla de bienvenida del invitado con los tres botones de captura. */
export const WelcomeScreen: React.FC<{ counts: Counts; pressIndex?: number; pressAt?: number }> = ({ counts, pressIndex = -1, pressAt = -100 }) => {
  const frame = useCurrentFrame();
  const press = interpolate(frame, [pressAt - 2, pressAt + 1, pressAt + 6], [1, 0.92, 1], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: "#FAFAFA" }}>
      <Hero counts={counts} />
      <div style={{ textAlign: "center", fontSize: 26, fontWeight: 700, color: C.ink, marginTop: 22 }}>¿Qué quieres hacer?</div>
      <div style={{ display: "flex", gap: 14, padding: "18px 18px 0" }}>
        <ActionTile icon={<ImageIcon size={30} />} label="Foto" pressed={pressIndex === 0 ? press : 1} />
        <ActionTile icon={<VideoIcon size={30} />} label="Vídeo" pressed={pressIndex === 1 ? press : 1} />
        <ActionTile icon={<Mic size={30} />} label="Audio" pressed={pressIndex === 2 ? press : 1} />
      </div>
      <div
        style={{
          margin: "18px 0 0",
          padding: "18px 26px",
          backgroundColor: "#FFFFFF",
          borderTop: `1px solid ${C.border}`,
          borderBottom: `1px solid ${C.border}`,
          textAlign: "center",
          fontSize: 17,
          fontWeight: 600,
          lineHeight: 1.4,
          color: C.ink,
        }}
      >
        Puedes subir todas las fotos que quieras hasta mañana a las 10:22 horas. ¡Solo quedan 11 horas y 21 minutos!
      </div>
      <div style={{ textAlign: "center", fontSize: 17, lineHeight: 1.5, color: C.muted, padding: "14px 26px" }}>
        Mañana a las 12:00 todas las imágenes serán reveladas en este mismo espacio
      </div>
    </AbsoluteFill>
  );
};

/** Aviso de subida correcta, con el estilo en blanco y negro de la app. */
export const Toast: React.FC<{ at: number; title: string; subtitle?: string }> = ({ at, title, subtitle = "Se revelará mañana a las 12:00" }) => {
  const frame = useCurrentFrame();
  const p = usePop(at, 11);
  if (frame < at) return null;
  return (
    <AbsoluteFill style={{ backgroundColor: `rgba(0,0,0,${0.45 * Math.min(p, 1)})`, alignItems: "center", justifyContent: "center", zIndex: 30 }}>
      <div
        style={{
          width: 420,
          borderRadius: 32,
          backgroundColor: "#FFFFFF",
          padding: "40px 30px",
          textAlign: "center",
          scale: String(0.6 + 0.4 * p),
          opacity: Math.min(1, p * 2),
        }}
      >
        <div style={{ width: 100, height: 100, borderRadius: 50, margin: "0 auto", backgroundColor: "#111111", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Check size={58} strokeWidth={3} />
        </div>
        <div style={{ fontSize: 36, fontWeight: 800, color: C.ink, marginTop: 22, letterSpacing: "-0.03em" }}>{title}</div>
        <div style={{ fontSize: 20, color: C.muted, marginTop: 8 }}>{subtitle}</div>
      </div>
    </AbsoluteFill>
  );
};

/** Barras de onda de audio animadas. */
export const Waveform: React.FC<{ bars?: number; height?: number; color?: string; live?: boolean; width?: number }> = ({
  bars = 34,
  height = 120,
  color = "#FFFFFF",
  live = true,
  width = 440,
}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, height, width }}>
      {Array.from({ length: bars }).map((_, i) => {
        const base = 0.25 + random(`wf${i}`) * 0.6;
        const wobble = live ? 0.5 + 0.5 * Math.sin(frame / 3 + i * 0.9) : 1;
        return <div key={i} style={{ flex: 1, height: Math.max(8, height * base * (0.35 + 0.65 * wobble)), borderRadius: 4, backgroundColor: color }} />;
      })}
    </div>
  );
};

/** Miniatura de la galería. */
export const MediaTile: React.FC<{ src: string; size: number; video?: boolean; blur?: number; locked?: number; radius?: number }> = ({
  src,
  size,
  video = false,
  blur = 0,
  locked = 0,
  radius = 0,
}) => (
  <div style={{ position: "relative", width: size, height: size, overflow: "hidden", borderRadius: radius, backgroundColor: "#222" }}>
    <Img src={rv(src)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: blur ? `blur(${blur}px)` : undefined, scale: blur ? "1.2" : "1" }} />
    {video ? (
      <div
        style={{
          position: "absolute",
          right: 10,
          bottom: 10,
          width: size * 0.3,
          height: size * 0.3,
          borderRadius: size,
          backgroundColor: C.red,
          color: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Play size={size * 0.14} fill="#FFFFFF" />
      </div>
    ) : null}
    {locked > 0 ? <AbsoluteFill style={{ backgroundColor: `rgba(17,17,17,${0.35 * locked})` }} /> : null}
  </div>
);

// Tamaño real de cada clip, para recortarlo tipo "cover" (Video de @remotion/media no aplica objectFit).
const CLIP_SIZE: Record<string, [number, number]> = {
  "esc1.mp4": [854, 480],
  "esc4.mp4": [854, 480],
  "esc2.mp4": [854, 1518],
  "esc33.mp4": [854, 1518],
  "esc5.mp4": [854, 1518],
  "esc6.mp4": [854, 1518],
};

/** Vídeo recortado para llenar el contenedor. `zoom` > 1 deja fuera la marca de agua de las esquinas. */
export const CoverVideo: React.FC<{ src: string; width: number; height: number; zoom?: number; trimBefore?: number }> = ({
  src,
  width,
  height,
  zoom = 1.12,
  trimBefore = 0,
}) => {
  const [vw, vh] = CLIP_SIZE[src];
  const s = Math.max(width / vw, height / vh) * zoom;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <Video
        src={rv(src)}
        muted
        trimBefore={trimBefore}
        style={{ position: "absolute", width: vw * s, height: vh * s, left: (width - vw * s) / 2, top: (height - vh * s) / 2 }}
      />
    </div>
  );
};
