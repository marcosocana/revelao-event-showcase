import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, random, Sequence, useCurrentFrame } from "remotion";
import { Download, Heart, LayoutGrid, List, Lock, Mic, Play, Share2 } from "lucide-react";
import { C } from "../theme";
import { Confetti, Headline, Phone, SceneBg, TopText, usePop, SCREEN_W } from "../ui";
import { CoverVideo, Hero, MediaTile, rv, Waveform, type Counts } from "./ui";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const fmt = (s: number) => {
  const v = Math.max(0, Math.round(s));
  const h = Math.floor(v / 3600);
  const m = Math.floor((v % 3600) / 60);
  const sec = v % 60;
  return [h, m, sec].map((n) => String(n).padStart(2, "0")).join(":");
};

const HIDDEN = ["still-esc2-5.jpg", "still-esc6-2.jpg", "still-esc1-2.jpg", "capitanes-andrea-rafa-manos-arriba.jpg"];

/** Pantalla de espera: el contenido está oculto hasta el revelado. */
export const WaitingScreen: React.FC<{ secs: number; hideFrom?: number; counts?: Counts }> = ({ secs, hideFrom = -100, counts = { fotos: 31, videos: 12, audios: 8 } }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#FAFAFA" }}>
      <Hero height={330} counts={counts} />
      <div style={{ textAlign: "center", marginTop: 26 }}>
        <div style={{ fontSize: 19, color: C.muted }}>Las fotos se revelarán pronto</div>
        <div style={{ fontSize: 34, fontWeight: 800, color: C.ink, marginTop: 4, letterSpacing: "-0.02em" }}>Mañana a las 12:00</div>
      </div>
      <div style={{ display: "flex", gap: 8, padding: "20px 18px 0" }}>
        {HIDDEN.map((src, i) => {
          const t = interpolate(frame, [hideFrom + i * 5, hideFrom + i * 5 + 12], [0, 1], clamp);
          return (
            <div key={src} style={{ position: "relative", borderRadius: 14, overflow: "hidden" }}>
              <MediaTile src={src} size={117} blur={t * 18} locked={t} />
              <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", color: "#FFFFFF", opacity: t, scale: String(0.6 + 0.4 * t) }}>
                <Lock size={36} />
              </AbsoluteFill>
            </div>
          );
        })}
      </div>
      <div
        style={{
          margin: "22px 18px 0",
          padding: "20px 22px",
          borderRadius: 20,
          backgroundColor: "#FFFFFF",
          border: `1px solid ${C.border}`,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 17, color: C.muted }}>Quedan</div>
        <div style={{ fontSize: 64, fontWeight: 800, color: C.ink, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums", lineHeight: 1.1 }}>{fmt(secs)}</div>
        <div style={{ fontSize: 17, fontWeight: 600, color: C.ink, marginTop: 4 }}>para que se revelen las fotos. ¡Qué nervios!</div>
      </div>
    </AbsoluteFill>
  );
};

export const RvOculto: React.FC = () => {
  const frame = useCurrentFrame();
  const secs = interpolate(frame, [24, 135], [12 * 3600 + 59 * 60 + 47, 9], { ...clamp, easing: Easing.bezier(0.55, 0, 0.85, 0.5) });
  return (
    <SceneBg>
      <TopText>
        <Headline text="Pero nadie ve *nada* hasta mañana" size={104} />
      </TopText>
      <Phone delay={-30}>
        <WaitingScreen secs={secs} hideFrom={8} />
      </Phone>
    </SceneBg>
  );
};

const GALLERY = [
  "still-esc33-1.jpg",
  "capitanes-andrea-rafa-foto-novios.jpg",
  "still-esc1-2.jpg",
  "capitanes-andrea-rafa-4.jpg",
  "still-esc4-1.jpg",
  "still-esc6-6.jpg",
  "capitanes-andrea-rafa-manos-arriba.jpg",
  "still-esc5-2.jpg",
  "capitanes-andrea-rafa-3.jpg",
];

/** Galería del evento ya revelada. */
export const GalleryScreen: React.FC<{ counts?: Counts }> = ({ counts = { fotos: 31, videos: 12, audios: 8 } }) => {
  const frame = useCurrentFrame();
  const size = (SCREEN_W - 4) / 3;
  return (
    <AbsoluteFill style={{ backgroundColor: "#FAFAFA" }}>
      <Hero height={320} counts={counts} revealed />
      <div style={{ display: "flex", margin: "14px 60px", padding: 5, borderRadius: 16, backgroundColor: "#EDEDED" }}>
        <div style={{ flex: 1, height: 44, borderRadius: 12, backgroundColor: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <LayoutGrid size={22} />
        </div>
        <div style={{ flex: 1, height: 44, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted }}>
          <List size={22} />
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {GALLERY.map((src, i) => {
          const f = frame - 4 - i * 3;
          const p = interpolate(f, [0, 10], [0, 1], { ...clamp, easing: Easing.bezier(0.34, 1.56, 0.64, 1) });
          return (
            <div key={src} style={{ scale: String(p), opacity: Math.min(1, p * 2) }}>
              <MediaTile src={src} size={size} video={i === 5} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** Corazones que suben, como likes en directo. */
export const Hearts: React.FC<{ start: number; count?: number }> = ({ start, count = 18 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 70 }}>
      {Array.from({ length: count }).map((_, i) => {
        const f = frame - start - i * 4;
        if (f < 0 || f > 60) return null;
        const x = 700 + random(`hx${i}`) * 260;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + Math.sin(f / 6 + i) * 20,
              top: 1450 - f * 12,
              color: C.red,
              opacity: interpolate(f, [0, 6, 45, 60], [0, 1, 1, 0], clamp),
              scale: String(0.7 + random(`hs${i}`) * 0.8),
            }}
          >
            <Heart size={64} fill={C.red} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const REVEAL = 36;

export const RvRevelado: React.FC<{ text?: string; counts?: Counts }> = ({ text = "Al día siguiente llega *el revelado*", counts }) => {
  const frame = useCurrentFrame();
  const secs = interpolate(frame, [0, REVEAL], [9, 0], clamp);
  return (
    <SceneBg>
      <TopText>
        <Headline text={text} size={text.length > 36 ? 90 : 100} />
      </TopText>
      <Phone delay={-30}>
        <Sequence durationInFrames={REVEAL} layout="none">
          <WaitingScreen secs={secs} hideFrom={-100} counts={counts} />
        </Sequence>
        <Sequence from={REVEAL} layout="none">
          <GalleryScreen counts={counts} />
        </Sequence>
        <AbsoluteFill style={{ backgroundColor: "#FFFFFF", zIndex: 20, opacity: interpolate(frame, [REVEAL - 2, REVEAL, REVEAL + 12], [0, 1, 0], clamp) }} />
      </Phone>
      <Confetti start={REVEAL} />
      <Hearts start={REVEAL + 20} />
    </SceneBg>
  );
};

const Tile: React.FC<{ i: number; children: React.ReactNode }> = ({ i, children }) => {
  const p = usePop(6 + i * 4, 13);
  return (
    <div style={{ position: "relative", width: 290, height: 290, borderRadius: 18, overflow: "hidden", scale: String(0.6 + 0.4 * p), opacity: Math.min(1, p * 2) }}>
      {children}
    </div>
  );
};

const Pill: React.FC<{ icon: React.ReactNode; label: string; delay: number; active?: boolean }> = ({ icon, label, delay, active }) => {
  const p = usePop(delay, 11);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "18px 30px",
        borderRadius: 999,
        backgroundColor: active ? C.red : "#FFFFFF",
        color: active ? "#FFFFFF" : C.ink,
        border: `1px solid ${active ? C.red : C.border}`,
        fontSize: 34,
        fontWeight: 700,
        scale: String(0.6 + 0.4 * p),
        opacity: p,
      }}
    >
      {icon}
      {label}
    </div>
  );
};

export const RvGaleria: React.FC = () => {
  const frame = useCurrentFrame();
  const likes = Math.round(interpolate(frame, [40, 90], [96, 128], clamp));
  return (
    <SceneBg bg={C.gray}>
      <TopText top={230}>
        <Headline text="Fotos, vídeos y audios de todos en una *galería privada*" size={88} stagger={2} />
      </TopText>
      <div style={{ position: "absolute", left: 90, top: 690, width: 900, display: "flex", flexWrap: "wrap", gap: 15 }}>
        <Tile i={0}>
          <Img src={rv("capitanes-andrea-rafa-manos-arriba.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </Tile>
        <Tile i={1}>
          <CoverVideo src="esc33.mp4" width={290} height={290} />
          <div style={{ position: "absolute", right: 14, bottom: 14, width: 70, height: 70, borderRadius: 35, backgroundColor: C.red, color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Play size={32} fill="#FFFFFF" />
          </div>
        </Tile>
        <Tile i={2}>
          <AbsoluteFill style={{ backgroundColor: "#111111", padding: 26, justifyContent: "space-between", color: "#FFFFFF" }}>
            <div style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: C.red, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Mic size={32} />
            </div>
            <Waveform bars={18} height={70} width={238} />
            <div>
              <div style={{ fontSize: 26, fontWeight: 700 }}>Mensaje de voz</div>
              <div style={{ fontSize: 22, color: "rgba(255,255,255,0.6)" }}>Tía Carmen · 0:24</div>
            </div>
          </AbsoluteFill>
        </Tile>
        <Tile i={3}>
          <Img src={rv("still-esc1-2.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </Tile>
        <Tile i={4}>
          <Img src={rv("capitanes-andrea-rafa-foto-novios.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </Tile>
        <Tile i={5}>
          <Img src={rv("still-esc4-1.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </Tile>
      </div>
      <div style={{ position: "absolute", top: 1330, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 16 }}>
        <Pill icon={<Heart size={34} fill="#FFFFFF" />} label={String(likes)} delay={34} active />
        <Pill icon={<Download size={34} />} label="Descargar" delay={40} />
        <Pill icon={<Share2 size={34} />} label="Compartir" delay={46} />
      </div>
    </SceneBg>
  );
};

export const RvCta: React.FC<{ title?: string; subtitle?: string; button?: string }> = ({
  title = "Vive tu boda *dos veces*",
  subtitle = "Mándaselo a tu pareja",
  button = "Pruébalo gratis",
}) => {
  const frame = useCurrentFrame();
  const logo = usePop(0, 12);
  const btn = usePop(30, 10);
  return (
    <SceneBg>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 50, padding: "0 90px", paddingBottom: 160 }}>
        <Img src={rv("logo.png")} style={{ width: 560, scale: String(logo) }} />
        <Headline text={title} size={title.length > 30 ? 100 : 116} delay={6} />
        <div style={{ fontSize: 52, fontWeight: 500, color: C.muted, opacity: interpolate(frame, [22, 32], [0, 1], clamp) }}>{subtitle}</div>
        <div
          style={{
            marginTop: 10,
            backgroundColor: C.red,
            color: "#FFFFFF",
            borderRadius: 999,
            padding: "34px 70px",
            fontSize: 48,
            fontWeight: 700,
            scale: String(btn * (1 + Math.sin(frame / 5) * 0.025)),
          }}
        >
          {button}
        </div>
        <div style={{ fontSize: 44, fontWeight: 600, color: C.muted, opacity: btn }}>revelao.cam</div>
      </AbsoluteFill>
    </SceneBg>
  );
};
