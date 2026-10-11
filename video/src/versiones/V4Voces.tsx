import React from "react";
import { AbsoluteFill, Img, interpolate, Series, useCurrentFrame } from "remotion";
import { C } from "../theme";
import { Headline, Kicker, Phone, SceneBg, TopText, usePop } from "../ui";
import { RvMesa } from "../revelao/Intro";
import { RvCta } from "../revelao/Revelado";
import { Waveform } from "../revelao/ui";
import { AudioCard, AudioRecorder, clamp, stock } from "./shared";

const Regalos: React.FC = () => {
  const frame = useCurrentFrame();
  const p = usePop(4, 14);
  const out = interpolate(frame, [70, 100], [0, 1], clamp);
  return (
    <SceneBg>
      <TopText top={230}>
        <Headline text="El mejor regalo de nuestra boda *no estaba* en la mesa de regalos" size={84} stagger={2} />
      </TopText>
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 800,
          width: 900,
          height: 600,
          borderRadius: 28,
          overflow: "hidden",
          boxShadow: "0 40px 80px rgba(21,21,21,0.18)",
          scale: String((0.8 + 0.2 * p) * (1 - out * 0.15)),
          opacity: Math.min(1, p * 2) * (1 - out * 0.6),
          filter: `blur(${out * 16}px) grayscale(${out})`,
        }}
      >
        <Img src={stock("regalos.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", scale: String(interpolate(frame, [0, 105], [1.05, 1.15], clamp)) }} />
      </div>
    </SceneBg>
  );
};

const Grabando: React.FC = () => (
  <SceneBg>
    <TopText>
      <Headline text="Estaba *aquí*" size={130} />
    </TopText>
    <Phone delay={0}>
      <AudioRecorder who="La abuela Rosa" start={10} />
    </Phone>
  </SceneBg>
);

// Líneas del audio (dramatización de ejemplo) con el frame en que aparece cada una.
const lines: [number, string][] = [
  [18, "Os deseo que seáis tan felices"],
  [80, "como lo fui yo con vuestro abuelo"],
  [150, "Os quiero, mis niños"],
];

const Subtitulos: React.FC = () => {
  const frame = useCurrentFrame();
  const idx = lines.reduce((acc, [f], i) => (frame >= f ? i : acc), -1);
  const lineStart = idx >= 0 ? lines[idx][0] : 0;
  const p = interpolate(frame - lineStart, [0, 10], [0, 1], clamp);
  return (
    <SceneBg bg="#111111">
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 300, color: "#FFFFFF", gap: 40 }}>
        <div style={{ width: 200, height: 200, borderRadius: 100, backgroundColor: C.red, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 80, fontWeight: 800 }}>
          AR
        </div>
        <div style={{ fontSize: 34, fontWeight: 600, letterSpacing: "0.1em", color: "rgba(255,255,255,0.6)" }}>ABUELA ROSA · 0:42</div>
        <div style={{ position: "relative" }}>
          <Waveform bars={44} height={130} width={860} color="rgba(255,255,255,0.25)" live={false} />
          <div style={{ position: "absolute", inset: 0, width: `${interpolate(frame, [0, 240], [0, 100], clamp)}%`, overflow: "hidden" }}>
            <Waveform bars={44} height={130} width={860} color={C.red} live={false} />
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingTop: 640, padding: "640px 80px 0" }}>
        {idx >= 0 ? (
          <div
            style={{
              fontSize: 88,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1.08,
              textAlign: "center",
              color: "#FFFFFF",
              opacity: p,
              translate: `0 ${(1 - p) * 30}px`,
            }}
          >
            “{lines[idx][1]}”
          </div>
        ) : null}
      </AbsoluteFill>
    </SceneBg>
  );
};

const Lista: React.FC = () => (
  <SceneBg bg={C.gray}>
    <TopText>
      <Headline text="*31 mensajes* de voz de vuestros invitados" size={92} stagger={2} />
    </TopText>
    <div style={{ position: "absolute", left: 90, top: 660, display: "flex", flexDirection: "column", gap: 20 }}>
      <AudioCard name="Tía Carmen" duration="0:24" delay={14} progress={0.3} />
      <AudioCard name="Mesa de los primos" duration="1:02" delay={22} progress={0} />
      <AudioCard name="Tu mejor amiga" duration="0:48" delay={30} progress={0} />
      <AudioCard name="Abuelo Paco" duration="0:31" delay={38} progress={0} />
      <AudioCard name="Compañeros de trabajo" duration="0:55" delay={46} progress={0} />
    </div>
  </SceneBg>
);

const Qr: React.FC = () => (
  <RvMesa text="Solo tienen que escanear un *QR*">
    <div style={{ display: "flex", gap: 14 }}>
      <Kicker delay={30} active>
        Sin apps
      </Kicker>
      <Kicker delay={38} active>
        Se revela al día siguiente
      </Kicker>
    </div>
  </RvMesa>
);

export const V4_DURATION = 105 + 120 + 240 + 180 + 120 + 120;

export const V4Voces: React.FC = () => (
  <Series>
    <Series.Sequence name="Regalos" durationInFrames={105}>
      <Regalos />
    </Series.Sequence>
    <Series.Sequence name="Grabando" durationInFrames={120}>
      <Grabando />
    </Series.Sequence>
    <Series.Sequence name="Subtítulos" durationInFrames={240}>
      <Subtitulos />
    </Series.Sequence>
    <Series.Sequence name="Lista" durationInFrames={180}>
      <Lista />
    </Series.Sequence>
    <Series.Sequence name="QR" durationInFrames={120}>
      <Qr />
    </Series.Sequence>
    <Series.Sequence name="CTA" durationInFrames={120}>
      <RvCta title="Guarda *sus voces* para siempre" />
    </Series.Sequence>
  </Series>
);
