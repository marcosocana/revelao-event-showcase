import React from "react";
import { AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import { Mic, Play } from "lucide-react";
import { C, fontFamily } from "../theme";
import { usePop } from "../ui";
import { NAMES, rv, scriptFont, Waveform } from "../revelao/ui";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const stock = (file: string) => staticFile(`stock/${file}`);

/** Pantalla de bloqueo del iPhone con una notificación de Revelao. */
export const LockScreen: React.FC<{ notifAt: number; title: string; body: string }> = ({ notifAt, title, body }) => {
  const p = usePop(notifAt, 12);
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #2B2B35 0%, #4A3F4F 55%, #1C1C22 100%)", color: "#FFFFFF", alignItems: "center" }}>
      <div style={{ marginTop: 110, fontSize: 22, fontWeight: 600, opacity: 0.85 }}>domingo, 27 de septiembre</div>
      <div style={{ fontSize: 118, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1 }}>10:02</div>
      <div
        style={{
          position: "absolute",
          top: 330,
          left: 16,
          right: 16,
          borderRadius: 26,
          backgroundColor: "rgba(245,245,245,0.92)",
          color: C.ink,
          padding: "18px 18px 20px",
          display: "flex",
          gap: 14,
          translate: `0 ${(1 - p) * -260}px`,
          opacity: Math.min(1, p * 2),
          scale: String(0.9 + 0.1 * p),
        }}
      >
        <div style={{ width: 58, height: 58, borderRadius: 14, backgroundColor: "#FFFFFF", overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Img src={rv("heart.png")} style={{ width: 46, height: 46, objectFit: "contain" }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, color: C.muted, fontWeight: 600 }}>
            <span>REVELAO.CAM</span>
            <span>ahora</span>
          </div>
          <div style={{ fontSize: 21, fontWeight: 700, marginTop: 3 }}>{title}</div>
          <div style={{ fontSize: 18, lineHeight: 1.35, marginTop: 2 }}>{body}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Grabadora de mensaje de voz (pantalla del invitado). */
export const AudioRecorder: React.FC<{ who?: string; start?: number }> = ({ who, start = 0 }) => {
  const frame = useCurrentFrame();
  const secs = Math.max(0, Math.floor((frame - start) / 12));
  return (
    <AbsoluteFill style={{ backgroundColor: "#111111", alignItems: "center", paddingTop: 150, color: "#FFFFFF" }}>
      <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: "0.12em", color: "rgba(255,255,255,0.6)" }}>MENSAJE DE VOZ</div>
      <div style={{ fontFamily: scriptFont, fontSize: 56, marginTop: 10 }}>para {NAMES}</div>
      {who ? <div style={{ fontSize: 22, marginTop: 14, color: "rgba(255,255,255,0.75)" }}>{who} está grabando…</div> : null}
      <div style={{ marginTop: 60 }}>
        <Waveform color={C.red} />
      </div>
      <div style={{ fontSize: 44, fontWeight: 700, marginTop: 36, fontVariantNumeric: "tabular-nums" }}>00:{String(secs).padStart(2, "0")}</div>
      <div
        style={{
          position: "absolute",
          bottom: 80,
          width: 150,
          height: 150,
          borderRadius: 75,
          backgroundColor: "rgba(239,67,67,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          scale: String(1 + 0.08 * Math.sin(frame / 4)),
        }}
      >
        <div style={{ width: 112, height: 112, borderRadius: 56, backgroundColor: C.red, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Mic size={52} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Tarjeta de mensaje de voz (galería). */
export const AudioCard: React.FC<{ name: string; duration: string; delay?: number; progress?: number; width?: number }> = ({
  name,
  duration,
  delay = 0,
  progress = 0,
  width = 900,
}) => {
  const p = usePop(delay, 13);
  return (
    <div
      style={{
        width,
        borderRadius: 26,
        backgroundColor: "#FFFFFF",
        border: `1px solid ${C.border}`,
        padding: "22px 26px",
        display: "flex",
        alignItems: "center",
        gap: 22,
        fontFamily,
        opacity: Math.min(1, p * 2),
        translate: `${(1 - p) * 300}px 0`,
      }}
    >
      <div style={{ width: 76, height: 76, borderRadius: 38, backgroundColor: C.red, color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Play size={34} fill="#FFFFFF" />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 34, fontWeight: 700, color: C.ink, letterSpacing: "-0.02em" }}>{name}</div>
        <div style={{ position: "relative", marginTop: 6 }}>
          <Waveform bars={30} height={40} width={width - 280} color="#D4D4D4" live={false} />
          <div style={{ position: "absolute", inset: 0, width: `${progress * 100}%`, overflow: "hidden" }}>
            <Waveform bars={30} height={40} width={width - 280} color={C.red} live={false} />
          </div>
        </div>
      </div>
      <div style={{ fontSize: 28, fontWeight: 600, color: C.muted }}>{duration}</div>
    </div>
  );
};

/** Burbuja de chat de WhatsApp. */
export const ChatBubble: React.FC<{ from?: string; text: string; time: string; mine?: boolean; delay: number; color?: string }> = ({
  from,
  text,
  time,
  mine = false,
  delay,
  color = "#1F8A70",
}) => {
  const p = usePop(delay, 13);
  return (
    <div style={{ display: "flex", justifyContent: mine ? "flex-end" : "flex-start", opacity: Math.min(1, p * 2), scale: String(0.85 + 0.15 * p), transformOrigin: mine ? "right" : "left" }}>
      <div
        style={{
          maxWidth: 380,
          borderRadius: 16,
          padding: "10px 14px 8px",
          backgroundColor: mine ? "#D9FDD3" : "#FFFFFF",
          boxShadow: "0 1px 1px rgba(0,0,0,0.08)",
          fontSize: 21,
          color: "#111B21",
          lineHeight: 1.3,
        }}
      >
        {from ? <div style={{ fontSize: 17, fontWeight: 700, color }}>{from}</div> : null}
        {text}
        <div style={{ fontSize: 14, color: "#667781", textAlign: "right", marginTop: 2 }}>{time}</div>
      </div>
    </div>
  );
};

/** Separador de fecha del chat. */
export const ChatDate: React.FC<{ label: string; delay: number }> = ({ label, delay }) => {
  const p = usePop(delay, 13);
  return (
    <div style={{ display: "flex", justifyContent: "center", opacity: p }}>
      <div style={{ backgroundColor: "#FFFFFF", borderRadius: 10, padding: "6px 14px", fontSize: 16, color: "#54656F", boxShadow: "0 1px 1px rgba(0,0,0,0.08)" }}>{label}</div>
    </div>
  );
};

/** Móvil en miniatura (icono). */
export const MiniPhone: React.FC<{ size?: number; on?: number }> = ({ size = 54, on = 1 }) => (
  <div
    style={{
      width: size,
      height: size * 1.9,
      borderRadius: size * 0.22,
      backgroundColor: "#151515",
      padding: size * 0.08,
    }}
  >
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: size * 0.15,
        background: on > 0 ? `linear-gradient(160deg, rgba(239,67,67,${on}), rgba(243,131,104,${on}))` : "#333",
      }}
    />
  </div>
);

/** Cámara desechable dibujada en SVG. */
export const DisposableCamera: React.FC<{ width?: number }> = ({ width = 640 }) => (
  <svg width={width} height={width * 0.62} viewBox="0 0 640 400">
    <rect x="10" y="40" width="620" height="340" rx="36" fill="#F2C94C" />
    <rect x="10" y="40" width="620" height="120" rx="36" fill="#E2B33B" />
    <rect x="10" y="120" width="620" height="40" fill="#E2B33B" />
    <rect x="40" y="170" width="560" height="170" rx="18" fill="#1F4E8C" />
    <text x="320" y="275" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="54" fill="#FFFFFF" letterSpacing="-2">
      27 EXP
    </text>
    <rect x="70" y="60" width="130" height="80" rx="10" fill="#FFFFFF" opacity="0.9" />
    <rect x="80" y="70" width="110" height="60" rx="6" fill="#9FB7D6" />
    <circle cx="430" cy="120" r="78" fill="#151515" />
    <circle cx="430" cy="120" r="56" fill="#2B3A55" />
    <circle cx="410" cy="100" r="16" fill="#FFFFFF" opacity="0.45" />
    <rect x="540" y="10" width="70" height="40" rx="8" fill="#151515" />
    <rect x="250" y="60" width="90" height="46" rx="8" fill="#FFFFFF" opacity="0.85" />
  </svg>
);

/** Grano de película sobre la escena (determinista por frame). */
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.18 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity, zIndex: 80, mixBlendMode: "overlay" }}>
      {Array.from({ length: 220 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: random(`gx${i}-${frame % 6}`) * 1080,
            top: random(`gy${i}-${frame % 6}`) * 1920,
            width: 3 + random(`gs${i}`) * 4,
            height: 3 + random(`gs${i}`) * 4,
            borderRadius: 4,
            backgroundColor: random(`gc${i}`) > 0.5 ? "#FFFFFF" : "#000000",
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

/** Tira de carrete con fotogramas que se "revelan" uno a uno. */
export const FilmStrip: React.FC<{ photos: string[]; start: number; step?: number; frameW?: number }> = ({ photos, start, step = 10, frameW = 300 }) => {
  const frame = useCurrentFrame();
  const h = frameW * 0.75;
  return (
    <div style={{ backgroundColor: "#1A1410", padding: "38px 20px", display: "flex", gap: 18, position: "relative", borderRadius: 10 }}>
      {[0, 1].map((row) => (
        <div key={row} style={{ position: "absolute", left: 0, right: 0, [row ? "bottom" : "top"]: 10, display: "flex", justifyContent: "space-around" }}>
          {Array.from({ length: Math.round((photos.length * (frameW + 18)) / 34) }).map((_, i) => (
            <div key={i} style={{ width: 16, height: 18, borderRadius: 3, backgroundColor: "#E9E1D6" }} />
          ))}
        </div>
      ))}
      {photos.map((src, i) => {
        const t = interpolate(frame, [start + i * step, start + i * step + 24], [0, 1], clamp);
        return (
          <div key={src + i} style={{ width: frameW, height: h, overflow: "hidden", borderRadius: 4, backgroundColor: "#3A2A1E" }}>
            <Img
              src={src}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: `sepia(${1 - t}) brightness(${0.15 + 0.85 * t}) contrast(${1.4 - 0.4 * t}) invert(${(1 - t) * 0.85})`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
