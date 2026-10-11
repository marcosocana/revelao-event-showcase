import React from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";
import { C } from "../theme";
import { Headline, Phone, SceneBg, TopText, usePop } from "../ui";

const Bubble: React.FC<{ name: string; text: string; delay: number }> = ({ name, text, delay }) => {
  const p = usePop(delay, 12);
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        border: `1px solid ${C.appBorder}`,
        borderRadius: 20,
        padding: "18px 22px",
        opacity: Math.min(1, p * 2),
        translate: `0 ${(1 - p) * 40}px`,
        scale: String(0.9 + 0.1 * p),
      }}
    >
      <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: "0.12em", color: C.red }}>{name}</div>
      <div style={{ fontSize: 25, fontWeight: 600, color: C.appInk, marginTop: 6, lineHeight: 1.3 }}>{text}</div>
    </div>
  );
};

export const Novios: React.FC = () => {
  const frame = useCurrentFrame();
  const btn = usePop(64);
  return (
    <SceneBg>
      <TopText>
        <Headline text="Y los novios *pican* a las mesas" size={100} />
      </TopText>
      <Phone delay={-30}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #FBF1E7 0%, #F6E4E0 45%, #FDF7F5 100%)" }} />
        <Img
          src={staticFile("novios.png")}
          style={{
            position: "absolute",
            left: 26,
            top: 80,
            width: 480,
            maskImage: "radial-gradient(ellipse at center, black 58%, transparent 72%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 58%, transparent 72%)",
            translate: `0 ${Math.sin(frame / 7) * 5}px`,
          }}
        />
        <div style={{ position: "absolute", left: 26, right: 26, top: 440, display: "flex", flexDirection: "column", gap: 14 }}>
          <Bubble name="MARCOS" text="Malas noticias" delay={20} />
          <Bubble name="MARÍA" text="La Mesa 3 os acaba de adelantar" delay={40} />
          <div
            style={{
              marginTop: 8,
              height: 70,
              borderRadius: 18,
              backgroundColor: C.coral,
              color: "#FFFFFF",
              fontSize: 22,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: btn,
            }}
          >
            Ver clasificación
          </div>
        </div>
      </Phone>
    </SceneBg>
  );
};
