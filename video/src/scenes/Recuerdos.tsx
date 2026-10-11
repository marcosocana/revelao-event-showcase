import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Check, Lock, Play } from "lucide-react";
import { C } from "../theme";
import { Headline, SceneBg, TopText, usePop } from "../ui";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

type TileData = { kind: "photo" | "video" | "answer"; src?: string; caption: string };

const tiles: TileData[] = [
  { kind: "photo", src: "capitanes-andrea-rafa-foto-novios.jpg", caption: "Mesa 5 · Foto con los novios" },
  { kind: "video", src: "capitanes-andrea-rafa-manos-arriba.jpg", caption: "Mesa 7 · Manos arriba" },
  { kind: "photo", src: "capitanes-andrea-rafa-3.jpg", caption: "Mesa 3 · Selfie de mesa" },
  { kind: "answer", caption: "Mesa 2 · Pregunta" },
];

const AnswerCard: React.FC = () => (
  <div
    style={{
      width: "100%",
      height: "100%",
      background: `linear-gradient(180deg, ${C.cardTop}, ${C.cardBottom})`,
      padding: "40px 30px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      gap: 22,
    }}
  >
    <div style={{ fontSize: 36, fontWeight: 800, color: C.appInk, letterSpacing: "-0.03em", lineHeight: 1.15 }}>¿Dónde fue su primera cita?</div>
    <div
      style={{
        height: 64,
        borderRadius: 16,
        backgroundColor: C.coral,
        color: "#FFFFFF",
        fontSize: 26,
        fontWeight: 600,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
      }}
    >
      En un restaurante
      <Check size={30} strokeWidth={3} />
    </div>
  </div>
);

const Tile: React.FC<TileData & { i: number }> = ({ kind, src, caption, i }) => {
  const frame = useCurrentFrame();
  const p = usePop(10 + i * 4, 14);
  const unlock = 36 + i * 7;
  const u = interpolate(frame, [unlock, unlock + 12], [0, 1], clamp);
  return (
    <div
      style={{
        position: "relative",
        width: 440,
        height: 370,
        borderRadius: 16,
        overflow: "hidden",
        backgroundColor: C.gray,
        scale: String(0.6 + 0.4 * p),
        opacity: Math.min(1, p * 2),
      }}
    >
      <div style={{ width: "100%", height: "100%", filter: `blur(${(1 - u) * 26}px)`, scale: String(1.15 - 0.1 * u) }}>
        {kind === "answer" ? <AnswerCard /> : <Img src={staticFile(src!)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
      </div>
      {kind === "video" ? (
        <div
          style={{
            position: "absolute",
            left: 180,
            top: 125,
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: "rgba(0,0,0,0.5)",
            color: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: u,
          }}
        >
          <Play size={38} fill="#FFFFFF" />
        </div>
      ) : null}
      <div
        style={{
          position: "absolute",
          inset: "auto 0 0",
          padding: "60px 20px 18px",
          fontSize: 26,
          fontWeight: 600,
          color: "#FFFFFF",
          background: kind === "answer" ? "linear-gradient(transparent, rgba(47,41,45,0.75))" : "linear-gradient(transparent, rgba(0,0,0,0.7))",
          opacity: u,
        }}
      >
        {caption}
      </div>
      <div
        style={{
          position: "absolute",
          left: 170,
          top: 135,
          width: 100,
          height: 100,
          borderRadius: 50,
          backgroundColor: "rgba(255,255,255,0.9)",
          color: C.ink,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 1 - u,
          scale: String(1 + u * 0.6),
        }}
      >
        <Lock size={46} />
      </div>
    </div>
  );
};

export const Recuerdos: React.FC = () => (
  <SceneBg>
    <TopText top={230}>
      <Headline text="Al final, todos podrán ver las *fotos, vídeos y respuestas* de todas las mesas" size={82} stagger={2} />
    </TopText>
    <div style={{ position: "absolute", left: 90, top: 720, width: 900, display: "flex", flexWrap: "wrap", gap: 20 }}>
      {tiles.map((t, i) => (
        <Tile key={t.caption} {...t} i={i} />
      ))}
    </div>
  </SceneBg>
);
