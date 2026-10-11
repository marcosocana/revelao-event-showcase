import React from "react";
import { AbsoluteFill, Img, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { C } from "../theme";
import { Headline, Kicker, Phone, SceneBg, Tap, TopText, usePop, SCREEN_W } from "../ui";
import { CoverVideo, rv, WelcomeScreen } from "./ui";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Clips reales de boda del hook: [archivo, segundo de inicio]
const clips: [string, number][] = [
  ["esc4.mp4", 0.5],
  ["esc1.mp4", 1],
  ["esc33.mp4", 0.5],
  ["esc2.mp4", 0.5],
];
const CUT = 27;

/** Cortes rápidos de clips (o fotos .jpg) a pantalla completa con un titular encima. */
export const RvHook: React.FC<{ text?: string; clips?: [string, number][]; cut?: number; flashFirst?: boolean }> = ({
  text = "Las mejores fotos de tu boda *no las hará el fotógrafo*",
  clips: list = clips,
  cut = CUT,
}) => {
  const frame = useCurrentFrame();
  const local = frame % cut;
  return (
    <SceneBg bg="#111111">
      {list.map(([src, start], i) => (
        <Sequence key={src + i} from={i * cut} durationInFrames={i === list.length - 1 ? 600 : cut} layout="absolute-fill">
          {src.endsWith(".mp4") ? (
            <CoverVideo src={src} width={1080} height={1920} trimBefore={Math.round(start * 30)} />
          ) : (
            <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", scale: String(interpolate(frame - i * cut, [0, cut], [1.12, 1.02], clamp)) }} />
          )}
        </Sequence>
      ))}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0.25) 100%)" }} />
      <AbsoluteFill style={{ backgroundColor: "#FFFFFF", opacity: frame < cut ? 0 : interpolate(local, [0, 5], [0.5, 0], clamp) }} />
      <AbsoluteFill style={{ justifyContent: "center", padding: "0 80px", paddingBottom: 120 }}>
        <Headline
          text={text}
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

const LOGO_W = 860;
const LOGO_H = (LOGO_W * 104) / 486;

export const RvLogo: React.FC = () => {
  const frame = useCurrentFrame();
  const p = usePop(0, 9);
  const mask = `url(${rv("logo.png")})`;
  return (
    <SceneBg>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative", width: LOGO_W, height: LOGO_H, scale: String(p), rotate: `${(1 - p) * -12}deg`, opacity: interpolate(frame, [0, 4], [0, 1], clamp) }}>
          <Img src={rv("logo.png")} style={{ width: LOGO_W, height: LOGO_H }} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              maskImage: mask,
              WebkitMaskImage: mask,
              maskSize: "100% 100%",
              WebkitMaskSize: "100% 100%",
              background: `linear-gradient(100deg, transparent ${interpolate(frame, [18, 42], [-40, 110], clamp)}%, rgba(255,255,255,0.85) ${interpolate(frame, [18, 42], [-25, 125], clamp)}%, transparent ${interpolate(frame, [18, 42], [-10, 140], clamp)}%)`,
            }}
          />
        </div>
      </AbsoluteFill>
      {/* Flash de cámara al entrar */}
      <AbsoluteFill style={{ backgroundColor: "#FFFFFF", opacity: interpolate(frame, [0, 8], [1, 0], clamp) }} />
    </SceneBg>
  );
};

// Tarjeta de la foto del plato: 900x767, el QR está en el 51% / 51,3% de la imagen.
const CARD_W = 900;
const CARD_H = Math.round((CARD_W * 1364) / 1600);
const QR_X = 0.51 * CARD_W;
const QR_Y = 0.513 * CARD_H;

export const RvMesa: React.FC<{ text?: string; children?: React.ReactNode }> = ({ text = "Pon un *QR* en cada mesa", children }) => {
  const frame = useCurrentFrame();
  const p = usePop(4, 14);
  const ring = frame - 34;
  return (
    <SceneBg bg={C.gray}>
      <TopText>
        <Headline text={text} size={text.length > 30 ? 92 : 104} />
        {children}
      </TopText>
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 620,
          width: CARD_W,
          height: CARD_H,
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: "0 40px 80px rgba(21,21,21,0.18)",
          scale: String(0.8 + 0.2 * p),
          opacity: Math.min(1, p * 2),
          translate: `0 ${(1 - p) * 300}px`,
        }}
      >
        <Img
          src={rv("boda-qr.jpg")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transformOrigin: `${QR_X}px ${QR_Y}px`,
            scale: String(interpolate(frame, [20, 120], [1, 1.35], clamp)),
          }}
        />
        {ring > 0 ? (
          <div
            style={{
              position: "absolute",
              left: QR_X - 110,
              top: QR_Y - 110,
              width: 220,
              height: 220,
              borderRadius: 30,
              border: `8px solid ${C.red}`,
              scale: String(interpolate(ring, [0, 10, 20, 30], [0.4, 1.08, 0.96, 1.04], clamp)),
              opacity: interpolate(ring, [0, 6], [0, 1], clamp),
            }}
          />
        ) : null}
      </div>
    </SceneBg>
  );
};

/** Vista de cámara del móvil apuntando al QR de la tarjeta. */
const ScanView: React.FC = () => {
  const frame = useCurrentFrame();
  const pill = usePop(26, 12);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Img
        src={rv("boda-qr.jpg")}
        style={{
          position: "absolute",
          width: 1600,
          height: 1364,
          left: SCREEN_W / 2 - 816,
          top: 400 - 700,
          scale: String(interpolate(frame, [0, 40], [0.9, 1.1], clamp)),
          transformOrigin: "816px 700px",
        }}
      />
      {/* Marco de enfoque sobre el QR */}
      <div
        style={{
          position: "absolute",
          left: SCREEN_W / 2 - 110,
          top: 400 - 110,
          width: 220,
          height: 220,
          borderRadius: 26,
          border: "6px solid #FFD84D",
          scale: String(interpolate(frame, [4, 18], [1.5, 1], clamp)),
          opacity: interpolate(frame, [4, 10], [0, 1], clamp),
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: 560,
          height: 64,
          borderRadius: 32,
          backgroundColor: "#FFD84D",
          color: C.ink,
          fontSize: 21,
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          scale: String(pill),
          opacity: pill,
        }}
      >
        revelao.cam · Abrir
      </div>
      <div style={{ position: "absolute", bottom: 50, left: (SCREEN_W - 104) / 2, width: 104, height: 104, borderRadius: 52, border: "7px solid #FFFFFF" }}>
        <div style={{ margin: 8, width: 74, height: 74, borderRadius: 37, backgroundColor: "#FFFFFF" }} />
      </div>
    </AbsoluteFill>
  );
};

export const RvEscanea: React.FC<{ text?: string }> = ({ text = "Tus invitados lo *escanean*" }) => (
  <SceneBg>
    <TopText>
      <Headline text={text} size={text.length > 30 ? 90 : 100} />
      <div style={{ display: "flex", gap: 14 }}>
        <Kicker delay={62} active>
          Sin apps
        </Kicker>
        <Kicker delay={70} active>
          Sin registro
        </Kicker>
        <Kicker delay={78} active>
          100% anónimo
        </Kicker>
      </div>
    </TopText>
    <Phone delay={0}>
      <Sequence durationInFrames={48} layout="none">
        <ScanView />
        <Tap x={SCREEN_W / 2} y={592} at={42} />
      </Sequence>
      <Sequence from={48} layout="none">
        <WelcomeScreen counts={{ fotos: 0, videos: 0, audios: 0 }} />
      </Sequence>
    </Phone>
  </SceneBg>
);
