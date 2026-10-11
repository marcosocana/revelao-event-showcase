import React from "react";
import { AbsoluteFill, Img, interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { Image as ImageIcon, Mic, Video as VideoIcon } from "lucide-react";
import { C } from "../theme";
import { CameraUI, Headline, Kicker, Phone, SceneBg, Tap, TopText, SCREEN_W } from "../ui";
import { CoverVideo, NAMES, rv, scriptFont, Toast, Waveform, WelcomeScreen } from "./ui";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const SEG = 90;
export const CAPTURA_DURATION = SEG * 3;

// Posiciones de los botones Foto / Vídeo / Audio en la pantalla de bienvenida.
const TILE_Y = 548;
const TILE_X = [18 + 80, SCREEN_W / 2, SCREEN_W - 18 - 80];

const Flash: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{ backgroundColor: "#FFFFFF", zIndex: 20, opacity: interpolate(frame, [at, at + 2, at + 10], [0, 1, 0], clamp) }} />;
};

const Intro: React.FC<{ index: number; counts: { fotos: number; videos: number; audios: number } }> = ({ index, counts }) => (
  <Sequence durationInFrames={22} layout="none">
    <WelcomeScreen counts={counts} pressIndex={index} pressAt={14} />
    <Tap x={TILE_X[index]} y={TILE_Y} at={14} />
  </Sequence>
);

const FotoPart: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      <Intro index={0} counts={{ fotos: 12, videos: 3, audios: 2 }} />
      <Sequence from={22} layout="none">
        <Img
          src={rv("still-esc2-5.jpg")}
          style={{ width: "100%", height: "100%", objectFit: "cover", scale: String(interpolate(frame, [22, 90], [1.12, 1.02], clamp)) }}
        />
        <CameraUI />
      </Sequence>
      <Tap x={SCREEN_W / 2} y={727} at={46} />
      <Flash at={48} />
      <Toast at={56} title="¡Foto subida!" />
    </>
  );
};

const VideoPart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <>
      <Intro index={1} counts={{ fotos: 13, videos: 3, audios: 2 }} />
      <Sequence from={22} layout="none">
        <CoverVideo src="esc6.mp4" width={SCREEN_W} height={832} trimBefore={30} />
        <CameraUI rec seconds={Math.max(1, Math.floor((frame - 22) / fps) + 1)} />
      </Sequence>
      <Toast at={62} title="¡Vídeo subido!" />
    </>
  );
};

const AudioPart: React.FC = () => {
  const frame = useCurrentFrame();
  const secs = Math.max(0, Math.floor((frame - 22) / 12));
  return (
    <>
      <Intro index={2} counts={{ fotos: 13, videos: 4, audios: 2 }} />
      <Sequence from={22} layout="none">
        <AbsoluteFill style={{ backgroundColor: "#111111", alignItems: "center", paddingTop: 150, color: "#FFFFFF" }}>
          <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: "0.12em", color: "rgba(255,255,255,0.6)" }}>MENSAJE DE VOZ</div>
          <div style={{ fontFamily: scriptFont, fontSize: 56, marginTop: 10 }}>para {NAMES}</div>
          <div style={{ marginTop: 70 }}>
            <Waveform color={C.red} />
          </div>
          <div style={{ fontSize: 44, fontWeight: 700, marginTop: 40, fontVariantNumeric: "tabular-nums" }}>00:{String(secs).padStart(2, "0")}</div>
          <div style={{ position: "absolute", bottom: 80, width: 150, height: 150, borderRadius: 75, backgroundColor: "rgba(239,67,67,0.25)", display: "flex", alignItems: "center", justifyContent: "center", scale: String(1 + 0.08 * Math.sin(frame / 4)) }}>
            <div style={{ width: 112, height: 112, borderRadius: 56, backgroundColor: C.red, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Mic size={52} />
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>
      <Toast at={62} title="¡Audio enviado!" />
    </>
  );
};

export const RvCaptura: React.FC = () => {
  const frame = useCurrentFrame();
  const active = Math.min(2, Math.floor(frame / SEG));
  const chips = [
    { icon: <ImageIcon size={30} />, label: "Foto" },
    { icon: <VideoIcon size={30} />, label: "Vídeo" },
    { icon: <Mic size={30} />, label: "Audio" },
  ];
  return (
    <SceneBg>
      <TopText>
        <Headline text="Y capturan *tu boda*" size={110} />
        <div style={{ display: "flex", gap: 16 }}>
          {chips.map((c, i) => (
            <Kicker key={c.label} delay={i === active ? active * SEG + 4 : -30} active={i === active}>
              {c.icon}
              {c.label}
            </Kicker>
          ))}
        </div>
      </TopText>
      <Phone delay={-30}>
        <Sequence durationInFrames={SEG} layout="none">
          <FotoPart />
        </Sequence>
        <Sequence from={SEG} durationInFrames={SEG} layout="none">
          <VideoPart />
        </Sequence>
        <Sequence from={SEG * 2} durationInFrames={SEG} layout="none">
          <AudioPart />
        </Sequence>
      </Phone>
    </SceneBg>
  );
};
