import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { SceneBg, usePop } from "../ui";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const LOGO_W = 900;
const LOGO_H = (LOGO_W * 46) / 233;

export const Logo: React.FC = () => {
  const frame = useCurrentFrame();
  const p = usePop(0, 9);
  const logoMask = `url(${staticFile("capitanes-logo.svg")})`;
  return (
    <SceneBg>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            position: "relative",
            // El SVG tiene aire a la derecha: se compensa para centrar el dibujo.
            marginLeft: LOGO_W * 0.19,
            width: LOGO_W,
            height: LOGO_H,
            scale: String(p),
            rotate: `${(1 - p) * -12}deg`,
            opacity: interpolate(frame, [0, 4], [0, 1], clamp),
          }}
        >
          <Img src={staticFile("capitanes-logo.svg")} style={{ width: LOGO_W, height: LOGO_H }} />
          {/* Brillo que recorre el logo, recortado a su silueta */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              maskImage: logoMask,
              WebkitMaskImage: logoMask,
              maskSize: "100% 100%",
              WebkitMaskSize: "100% 100%",
              background: `linear-gradient(100deg, transparent ${interpolate(frame, [18, 42], [-40, 110], clamp)}%, rgba(255,255,255,0.85) ${interpolate(frame, [18, 42], [-25, 125], clamp)}%, transparent ${interpolate(frame, [18, 42], [-10, 140], clamp)}%)`,
            }}
          />
        </div>
      </AbsoluteFill>
    </SceneBg>
  );
};
