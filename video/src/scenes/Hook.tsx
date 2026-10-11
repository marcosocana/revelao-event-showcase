import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Headline, SceneBg } from "../ui";

const photos = [
  "capitanes-andrea-rafa-manos-arriba.jpg",
  "capitanes-andrea-rafa-4.jpg",
  "capitanes-andrea-rafa-3.jpg",
  "capitanes-andrea-rafa-foto-novios.jpg",
];
const CUT = 26;

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const idx = Math.min(photos.length - 1, Math.floor(frame / CUT));
  const local = frame - idx * CUT;
  return (
    <SceneBg bg="#151515">
      <AbsoluteFill style={{ scale: String(interpolate(local, [0, CUT], [1.14, 1.02], { extrapolateRight: "clamp" })) }}>
        <Img src={staticFile(photos[idx])} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background: "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0.25) 100%)",
        }}
      />
      {/* Flash blanco en cada corte */}
      <AbsoluteFill style={{ backgroundColor: "#FFFFFF", opacity: interpolate(local, [0, 5], [idx === 0 ? 0 : 0.5, 0], { extrapolateRight: "clamp" }) }} />
      <AbsoluteFill style={{ justifyContent: "center", padding: "0 80px", paddingBottom: 120 }}>
        <Headline
          text="Este es el juego que está *revolucionando* todas las bodas este año"
          size={104}
          color="#FFFFFF"
          marker
          delay={4}
          stagger={4}
          style={{ textShadow: "0 4px 30px rgba(0,0,0,0.45)" }}
        />
      </AbsoluteFill>
    </SceneBg>
  );
};
