import React from "react";
import { AbsoluteFill, Img, interpolate, Sequence, Series, useCurrentFrame } from "remotion";
import { Headline, Phone, SceneBg, TopText } from "../ui";
import { RvHook, RvMesa } from "../revelao/Intro";
import { Confetti } from "../ui";
import { GalleryScreen, Hearts, RvCta, WaitingScreen } from "../revelao/Revelado";
import { clamp, LockScreen, stock } from "./shared";

const COUNTS = { fotos: 347, videos: 52, audios: 31 };

const Pov: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <SceneBg bg="#111111">
      <AbsoluteFill style={{ scale: String(interpolate(frame, [0, 90], [1.08, 1.0], clamp)) }}>
        <Img src={stock("cama.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(6px) brightness(0.55)" }} />
      </AbsoluteFill>
      <TopText top={230}>
        <Headline text="POV: es el día después de tu boda y te llega *esto*" size={88} color="#FFFFFF" marker stagger={3} style={{ textShadow: "0 4px 30px rgba(0,0,0,0.45)" }} />
      </TopText>
      <Phone delay={0} style={{ top: 700 }}>
        <LockScreen notifAt={34} title="📸 ¡Vuestro revelado está listo!" body="Rodrigo & María, 347 fotos, 52 vídeos y 31 audios os esperan" />
      </Phone>
    </SceneBg>
  );
};

const REVEAL = 30;

const Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <SceneBg>
      <TopText>
        <Headline text="*347 fotos,* 52 vídeos y 31 audios de tus invitados" size={88} stagger={2} />
      </TopText>
      <Phone delay={-30}>
        <Sequence durationInFrames={REVEAL} layout="none">
          <WaitingScreen secs={interpolate(frame, [0, REVEAL], [3, 0], clamp)} counts={COUNTS} />
        </Sequence>
        <Sequence from={REVEAL} layout="none">
          <GalleryScreen counts={COUNTS} />
        </Sequence>
        <AbsoluteFill style={{ backgroundColor: "#FFFFFF", zIndex: 20, opacity: interpolate(frame, [REVEAL - 2, REVEAL, REVEAL + 12], [0, 1, 0], clamp) }} />
      </Phone>
      <Confetti start={REVEAL} />
      <Hearts start={REVEAL + 20} />
    </SceneBg>
  );
};

/** Efecto de rebobinado entre la galería y la explicación. */
const Rewind: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      <RvMesa text="Solo hizo falta un *QR* en cada mesa" />
      <AbsoluteFill
        style={{
          backgroundColor: "#111111",
          opacity: interpolate(frame, [0, 14], [0.85, 0], clamp),
          alignItems: "center",
          justifyContent: "center",
          color: "#FFFFFF",
          fontSize: 140,
          fontWeight: 800,
        }}
      >
        ◀◀
      </AbsoluteFill>
    </>
  );
};

export const V1_DURATION = 90 + 150 + 150 + 150 + 120;

export const V1Pov: React.FC = () => (
  <Series>
    <Series.Sequence name="POV" durationInFrames={90}>
      <Pov />
    </Series.Sequence>
    <Series.Sequence name="Revelado" durationInFrames={150}>
      <Reveal />
    </Series.Sequence>
    <Series.Sequence name="Momentos" durationInFrames={150}>
      <RvHook
        text="Momentos que *no viste*"
        cut={30}
        clips={[
          ["esc1.mp4", 1],
          ["stock/bengalas.jpg", 0],
          ["esc4.mp4", 0.5],
          ["stock/champan.jpg", 0],
          ["esc2.mp4", 0.5],
        ]}
      />
    </Series.Sequence>
    <Series.Sequence name="Rebobinado" durationInFrames={150}>
      <Rewind />
    </Series.Sequence>
    <Series.Sequence name="CTA" durationInFrames={120}>
      <RvCta />
    </Series.Sequence>
  </Series>
);
