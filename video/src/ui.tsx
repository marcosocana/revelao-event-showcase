import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  random,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Camera, Check, Flag, Trophy } from "lucide-react";
import { C, fontFamily } from "./theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const usePop = (delay = 0, damping = 14) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, mass: 0.8 } });
};

/** Fondo de escena con un zoom lento constante para que nunca haya un fotograma quieto. */
export const SceneBg: React.FC<{ bg?: string; children: React.ReactNode }> = ({ bg = "#FFFFFF", children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: bg, fontFamily, overflow: "hidden" }}>
      <AbsoluteFill style={{ scale: interpolate(frame, [0, durationInFrames], [1, 1.04]) }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

/**
 * Titular palabra a palabra, estilo subtítulo de TikTok.
 * Las palabras entre *asteriscos* se resaltan (pueden abarcar varias palabras).
 */
export const Headline: React.FC<{
  text: string;
  delay?: number;
  size?: number;
  color?: string;
  stagger?: number;
  marker?: boolean;
  style?: React.CSSProperties;
}> = ({ text, delay = 0, size = 96, color = C.ink, stagger = 3, marker = false, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  let inHi = false;
  const words = text.split(" ").map((raw) => {
    const starts = raw.startsWith("*");
    const ends = raw.replace(/[.,!?]$/, "").endsWith("*");
    if (starts) inHi = true;
    const hi = inHi;
    if (ends) inHi = false;
    return { word: raw.replace(/\*/g, ""), hi };
  });
  return (
    <div
      style={{
        fontFamily,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.08,
        letterSpacing: "-0.045em",
        textAlign: "center",
        color,
        ...style,
      }}
    >
      {words.map(({ word, hi }, i) => {
        const runStart = hi && !(words[i - 1]?.hi ?? false);
        const runEnd = hi && !(words[i + 1]?.hi ?? false);
        const p = spring({ frame: frame - delay - i * stagger, fps, config: { damping: 13, mass: 0.7 } });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              marginRight: hi && marker && !runEnd ? 0 : "0.22em",
              opacity: interpolate(p, [0, 0.4], [0, 1], clamp),
              translate: `0 ${(1 - p) * 50}px`,
              scale: String(0.85 + 0.15 * p),
              color: hi ? (marker ? "#FFFFFF" : C.red) : undefined,
              backgroundColor: hi && marker ? C.red : undefined,
              padding: hi && marker ? `0 ${runEnd ? "0.14em" : "0.22em"} 0 ${runStart ? "0.14em" : "0"}` : undefined,
              borderRadius: hi && marker ? `${runStart ? 14 : 0}px ${runEnd ? 14 : 0}px ${runEnd ? 14 : 0}px ${runStart ? 14 : 0}px` : undefined,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

/** Etiqueta en píldora, como .captains-kicker de la landing. */
export const Kicker: React.FC<{ children: React.ReactNode; delay?: number; active?: boolean }> = ({
  children,
  delay = 0,
  active = false,
}) => {
  const p = usePop(delay);
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        fontFamily,
        fontSize: 30,
        fontWeight: 600,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: active ? "#FFFFFF" : C.muted,
        backgroundColor: active ? C.red : "#FFFFFF",
        border: `1px solid ${active ? C.red : C.border}`,
        borderRadius: 999,
        padding: "12px 26px",
        opacity: p,
        scale: String(0.7 + 0.3 * p),
      }}
    >
      {children}
    </div>
  );
};

export const SCREEN_W = 532;
export const SCREEN_H = 832;

/** Mockup de iPhone. Los hijos se pintan dentro de la pantalla (532x832). */
export const Phone: React.FC<{ children: React.ReactNode; delay?: number; island?: boolean; style?: React.CSSProperties }> = ({
  children,
  delay = 0,
  island = true,
  style,
}) => {
  const p = usePop(delay, 15);
  return (
    <div
      style={{
        position: "absolute",
        left: (1080 - 560) / 2,
        top: 640,
        width: 560,
        height: 860,
        borderRadius: 80,
        backgroundColor: "#151515",
        padding: 14,
        boxShadow: "0 50px 90px rgba(21,21,21,0.22)",
        translate: `0 ${(1 - p) * 1200}px`,
        rotate: `${(1 - p) * 10}deg`,
        ...style,
      }}
    >
      <div
        style={{
          position: "relative",
          width: SCREEN_W,
          height: SCREEN_H,
          borderRadius: 66,
          overflow: "hidden",
          backgroundColor: C.appBg,
          fontFamily,
        }}
      >
        {children}
        <div
          style={{
            display: island ? "block" : "none",
            position: "absolute",
            top: 16,
            left: (SCREEN_W - 150) / 2,
            width: 150,
            height: 42,
            borderRadius: 21,
            backgroundColor: "#000",
            zIndex: 50,
          }}
        />
      </div>
    </div>
  );
};

/** Indicador de toque (dedo + onda) en coordenadas de pantalla del móvil. */
export const Tap: React.FC<{ x: number; y: number; at: number }> = ({ x, y, at }) => {
  const frame = useCurrentFrame();
  const f = frame - at;
  if (f < -14 || f > 18) return null;
  return (
    <div style={{ position: "absolute", left: x - 40, top: y - 40, width: 80, height: 80, zIndex: 40 }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 40,
          border: "4px solid rgba(255,255,255,0.95)",
          scale: String(interpolate(f, [0, 16], [0.6, 2.2], clamp)),
          opacity: interpolate(f, [0, 16], [0.9, 0], clamp),
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 40,
          backgroundColor: "rgba(255,255,255,0.85)",
          boxShadow: "0 6px 24px rgba(0,0,0,0.3)",
          opacity: interpolate(f, [-14, -6, 8, 18], [0, 1, 1, 0], clamp),
          scale: String(interpolate(f, [-14, -6, -2, 1, 5], [1.4, 1, 1, 0.78, 1], clamp)),
        }}
      />
    </div>
  );
};

/** Número que sube de `from` a `to` entre dos frames. */
export const useCount = (from: number, to: number, start: number, end: number) => {
  const frame = useCurrentFrame();
  return Math.round(interpolate(frame, [start, end], [from, to], clamp));
};

/** Cabecera de la pantalla de juego, copiada de la app real. */
export const GameHeader: React.FC<{ points: number; done: number; total?: number; mesa?: string; capitan?: string }> = ({
  points,
  done,
  total = 24,
  mesa = "Mesa 1",
  capitan = "José Manuel",
}) => (
  <div style={{ padding: "74px 28px 0" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ width: 84, height: 84, borderRadius: 22, overflow: "hidden", backgroundColor: "#F9DCD6" }}>
        <Img src={staticFile("avatar-1.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", color: C.appMuted, textTransform: "uppercase" }}>
          Vamos, {capitan} ✦
        </div>
        <div style={{ fontSize: 36, fontWeight: 700, color: C.appInk, letterSpacing: "-0.02em" }}>{mesa}</div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 48, fontWeight: 800, color: C.appInk, lineHeight: 1 }}>{points}</div>
        <div style={{ fontSize: 15, color: C.appMuted }}>puntos</div>
      </div>
    </div>
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24, fontSize: 16, color: C.appMuted }}>
      <span>Vuestra aventura</span>
      <span style={{ fontWeight: 600, color: C.appInk }}>
        {done} / {total} retos
      </span>
    </div>
    <div style={{ display: "flex", gap: 5, marginTop: 10 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ flex: 1, height: 7, borderRadius: 4, backgroundColor: i < done ? C.coral : "#F0D9D5" }} />
      ))}
    </div>
  </div>
);

export const TabBar: React.FC<{ active?: "retos" | "ranking" }> = ({ active = "retos" }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      height: 96,
      backgroundColor: "#FFFFFF",
      borderTop: `1px solid ${C.appBorder}`,
      display: "flex",
      gap: 12,
      padding: "10px 22px 18px",
    }}
  >
    {(["retos", "ranking"] as const).map((t) => (
      <div
        key={t}
        style={{
          flex: 1,
          borderRadius: 18,
          backgroundColor: active === t ? "#FCE7E3" : "transparent",
          color: active === t ? C.coral : C.appMuted,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          fontSize: 15,
          fontWeight: 600,
        }}
      >
        {t === "retos" ? <Flag size={24} /> : <Trophy size={24} />}
        {t === "retos" ? "Retos" : "Ranking"}
      </div>
    ))}
  </div>
);

/** Tarjeta de reto con el estilo de la app (degradado rosa, icono en baldosa, botón coral). */
export const ChallengeCard: React.FC<{
  n: string;
  points: number;
  kind: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  pressAt?: number;
}> = ({ n, points, kind, icon, title, desc, pressAt = -100 }) => {
  const frame = useCurrentFrame();
  const pressed = interpolate(frame, [pressAt - 2, pressAt + 1, pressAt + 6], [1, 0.95, 1], clamp);
  return (
    <div
      style={{
        margin: "24px 22px 0",
        borderRadius: 28,
        border: `1px solid ${C.appBorder}`,
        background: `linear-gradient(180deg, ${C.cardTop}, ${C.cardBottom})`,
        padding: "22px 24px 26px",
        textAlign: "center",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 19, fontWeight: 700, color: C.appInk }}>
          <span style={{ color: C.coral }}>●</span> Reto {n}
        </span>
        <span
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: C.appInk,
            backgroundColor: "rgba(255,255,255,0.75)",
            borderRadius: 10,
            padding: "6px 12px",
          }}
        >
          {points} puntos
        </span>
      </div>
      <div
        style={{
          width: 116,
          height: 116,
          margin: "18px auto 10px",
          borderRadius: 32,
          background: "linear-gradient(160deg, #FDF1EF, #EFD3CE)",
          boxShadow: "0 12px 24px rgba(132,83,70,0.18)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#8A5A55",
        }}
      >
        {icon}
      </div>
      <div style={{ fontSize: 17, color: C.appMuted }}>{kind}</div>
      <div style={{ fontSize: 36, fontWeight: 800, color: C.appInk, letterSpacing: "-0.03em", marginTop: 4 }}>{title}</div>
      <div style={{ fontSize: 19, lineHeight: 1.4, color: C.appMuted, marginTop: 8 }}>{desc}</div>
      <div
        style={{
          marginTop: 20,
          height: 66,
          borderRadius: 18,
          backgroundColor: C.coral,
          color: "#FFFFFF",
          fontSize: 21,
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          scale: String(pressed),
        }}
      >
        Aceptar reto
      </div>
      <div
        style={{
          marginTop: 12,
          height: 60,
          borderRadius: 18,
          backgroundColor: "#FFFFFF",
          color: C.appInk,
          fontSize: 20,
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Rechazar reto
      </div>
    </div>
  );
};

/** Aviso de prueba conseguida con los puntos ganados. */
export const Success: React.FC<{ at: number; title: string; points: number }> = ({ at, title, points }) => {
  const frame = useCurrentFrame();
  const p = usePop(at, 11);
  if (frame < at) return null;
  return (
    <AbsoluteFill style={{ backgroundColor: `rgba(47,41,45,${0.45 * Math.min(p, 1)})`, alignItems: "center", justifyContent: "center", zIndex: 30 }}>
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
        <div
          style={{
            width: 104,
            height: 104,
            borderRadius: 52,
            margin: "0 auto",
            backgroundColor: C.coral,
            color: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Check size={60} strokeWidth={3} />
        </div>
        <div style={{ fontSize: 36, fontWeight: 800, color: C.appInk, marginTop: 22, letterSpacing: "-0.03em" }}>{title}</div>
        <div style={{ fontSize: 60, fontWeight: 800, color: C.red, marginTop: 6, letterSpacing: "-0.04em" }}>+{points}</div>
        <div style={{ fontSize: 20, color: C.appMuted }}>puntos para tu mesa</div>
      </div>
    </AbsoluteFill>
  );
};

/** Interfaz de cámara superpuesta sobre una foto. */
export const CameraUI: React.FC<{ rec?: boolean; seconds?: number }> = ({ rec = false, seconds = 0 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ zIndex: 10 }}>
      {[
        { top: 110, left: 40, borderWidth: "6px 0 0 6px" },
        { top: 110, right: 40, borderWidth: "6px 6px 0 0" },
        { bottom: 190, left: 40, borderWidth: "0 0 6px 6px" },
        { bottom: 190, right: 40, borderWidth: "0 6px 6px 0" },
      ].map((s, i) => (
        <div key={i} style={{ position: "absolute", width: 70, height: 70, borderStyle: "solid", borderColor: "rgba(255,255,255,0.9)", ...s }} />
      ))}
      {rec ? (
        <div
          style={{
            position: "absolute",
            top: 78,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              backgroundColor: "rgba(0,0,0,0.5)",
              color: "#FFFFFF",
              borderRadius: 12,
              padding: "8px 16px",
              fontSize: 22,
              fontWeight: 700,
              marginTop: 40,
            }}
          >
            <div style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: C.red, opacity: Math.floor(frame / 8) % 2 ? 0.3 : 1 }} />
            REC 00:{String(seconds).padStart(2, "0")}
          </div>
        </div>
      ) : null}
      <div
        style={{
          position: "absolute",
          bottom: 50,
          left: (SCREEN_W - 110) / 2,
          width: 110,
          height: 110,
          borderRadius: 55,
          border: "7px solid #FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ width: rec ? 44 : 80, height: rec ? 44 : 80, borderRadius: rec ? 10 : 40, backgroundColor: rec ? C.red : "#FFFFFF" }} />
      </div>
      {!rec ? (
        <div style={{ position: "absolute", bottom: 86, left: 60, color: "#FFFFFF" }}>
          <Camera size={40} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/** Confeti determinista (mismo resultado en cada render). */
export const Confetti: React.FC<{ start: number; count?: number }> = ({ start, count = 110 }) => {
  const frame = useCurrentFrame();
  const f = frame - start;
  if (f < 0) return null;
  const colors = [C.red, C.coral, ...C.teams, "#FFD84D"];
  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 60 }}>
      {Array.from({ length: count }).map((_, i) => {
        const x0 = random(`x${i}`) * 1080;
        const vx = (random(`vx${i}`) - 0.5) * 14;
        const vy = -18 - random(`vy${i}`) * 22;
        const t = f;
        const x = x0 + vx * t;
        const y = 1100 + vy * t + 0.9 * t * t;
        const rot = random(`r${i}`) * 360 + t * (random(`vr${i}`) * 20 - 10);
        const w = 14 + random(`w${i}`) * 14;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: w,
              height: w * 0.45,
              borderRadius: 3,
              backgroundColor: colors[i % colors.length],
              rotate: `${rot}deg`,
              opacity: interpolate(t, [0, 50, 80], [1, 1, 0], clamp),
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export const TopText: React.FC<{ children: React.ReactNode; top?: number }> = ({ children, top = 250 }) => (
  <div style={{ position: "absolute", top, left: 90, right: 90, display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
    {children}
  </div>
);
