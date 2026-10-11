import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C } from "../theme";
import { Headline, SceneBg, usePop } from "../ui";

export const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const logo = usePop(0, 12);
  const btn = usePop(30, 10);
  return (
    <SceneBg>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 50, padding: "0 90px", paddingBottom: 160 }}>
        <Img src={staticFile("capitanes-logo.svg")} style={{ width: 600, marginLeft: 114, scale: String(logo) }} />
        <Headline text="Convierte tu boda en un *juego*" size={112} delay={6} />
        <div
          style={{
            fontSize: 52,
            fontWeight: 500,
            color: C.muted,
            opacity: interpolate(frame, [22, 32], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          Mándaselo a tu pareja
        </div>
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
          Prueba la demo
        </div>
        <div style={{ fontSize: 44, fontWeight: 600, color: C.muted, opacity: btn }}>revelao.cam/capitanes</div>
      </AbsoluteFill>
    </SceneBg>
  );
};
