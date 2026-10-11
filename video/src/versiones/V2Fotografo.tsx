import React from "react";
import { AbsoluteFill, Img, interpolate, Sequence, Series, staticFile, useCurrentFrame } from "remotion";
import { C } from "../theme";
import { Headline, SceneBg, TopText, usePop } from "../ui";
import { RvEscanea } from "../revelao/Intro";
import { RvCta } from "../revelao/Revelado";
import { CoverVideo, Waveform } from "../revelao/ui";
import { clamp } from "./shared";

/** Hook: lo que ve el visor del fotógrafo… y lo que pasa fuera de plano. */
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const cut = frame >= 50;
  return (
    <SceneBg bg="#111111">
      <Sequence durationInFrames={50} layout="absolute-fill">
        <CoverVideo src="esc33.mp4" width={1080} height={1920} trimBefore={10} />
      </Sequence>
      <Sequence from={50} layout="absolute-fill">
        <CoverVideo src="esc1.mp4" width={1080} height={1920} trimBefore={20} />
      </Sequence>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.2), rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.3))" }} />
      {!cut ? (
        <AbsoluteFill style={{ zIndex: 5 }}>
          {[
            { top: 260, left: 90, borderWidth: "8px 0 0 8px" },
            { top: 260, right: 90, borderWidth: "8px 8px 0 0" },
            { bottom: 460, left: 90, borderWidth: "0 0 8px 8px" },
            { bottom: 460, right: 90, borderWidth: "0 8px 8px 0" },
          ].map((s, i) => (
            <div key={i} style={{ position: "absolute", width: 110, height: 110, borderStyle: "solid", borderColor: "rgba(255,255,255,0.9)", ...s }} />
          ))}
          <div style={{ position: "absolute", top: 290, left: 130, fontSize: 30, fontWeight: 700, color: "#FFFFFF", letterSpacing: "0.1em" }}>● FOTÓGRAFO</div>
        </AbsoluteFill>
      ) : null}
      <AbsoluteFill style={{ backgroundColor: "#FFFFFF", opacity: interpolate(frame, [50, 56], [0.7, 0], clamp) }} />
      <AbsoluteFill style={{ justifyContent: "center", padding: "0 80px", paddingBottom: 120 }}>
        <Headline text="Lo que tu fotógrafo *no vio* en tu boda" size={108} color="#FFFFFF" marker delay={4} stagger={4} style={{ textShadow: "0 4px 30px rgba(0,0,0,0.45)" }} />
      </AbsoluteFill>
    </SceneBg>
  );
};

type Item = { n: number; caption: string; media: React.ReactNode };

const MomentCard: React.FC<Item> = ({ n, caption, media }) => {
  const num = usePop(0, 9);
  const card = usePop(4, 14);
  return (
    <SceneBg>
      <TopText top={230}>
        <div style={{ fontSize: 200, fontWeight: 800, color: C.red, letterSpacing: "-0.06em", lineHeight: 0.9, scale: String(num), rotate: `${(1 - num) * -20}deg` }}>{n}</div>
        <Headline text={caption} size={80} delay={6} stagger={2} />
      </TopText>
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 760,
          width: 900,
          height: 720,
          borderRadius: 28,
          overflow: "hidden",
          boxShadow: "0 40px 80px rgba(21,21,21,0.18)",
          backgroundColor: "#111",
          scale: String(0.8 + 0.2 * card),
          opacity: Math.min(1, card * 2),
          translate: `0 ${(1 - card) * 300}px`,
        }}
      >
        {media}
      </div>
    </SceneBg>
  );
};

const Photo: React.FC<{ src: string }> = ({ src }) => {
  const frame = useCurrentFrame();
  return <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", scale: String(interpolate(frame, [0, 75], [1.12, 1.02], clamp)) }} />;
};

const VoiceNote: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#111111", alignItems: "center", justifyContent: "center", gap: 40, color: "#FFFFFF", padding: 60 }}>
    <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: "0.12em", color: "rgba(255,255,255,0.6)" }}>MENSAJE DE VOZ · LUCÍA · 0:48</div>
    <Waveform color={C.red} width={700} height={160} bars={40} />
    <div style={{ fontSize: 46, fontWeight: 700, textAlign: "center", lineHeight: 1.25 }}>“Sois lo más bonito que me ha pasado en la vida”</div>
  </AbsoluteFill>
);

const items: Item[] = [
  { n: 1, caption: "El amigo del novio con *el zapato* en la mano", media: <CoverVideo src="esc1.mp4" width={900} height={720} trimBefore={30} zoom={1.05} /> },
  { n: 2, caption: "El brindis improvisado de *la mesa 7*", media: <Photo src="stock/champan.jpg" /> },
  { n: 3, caption: "La novia *tirándose* a la piscina", media: <CoverVideo src="esc4.mp4" width={900} height={720} trimBefore={10} zoom={1.05} /> },
  { n: 4, caption: "Las bengalas a *las 2 AM*", media: <Photo src="stock/bengalas.jpg" /> },
  { n: 5, caption: "El audio de *tu mejor amiga*", media: <VoiceNote /> },
];

const ITEM = 75;
export const V2_DURATION = 95 + ITEM * items.length + 150 + 120;

export const V2Fotografo: React.FC = () => (
  <Series>
    <Series.Sequence name="Hook" durationInFrames={95}>
      <Hook />
    </Series.Sequence>
    {items.map((it) => (
      <Series.Sequence key={it.n} name={`Momento ${it.n}`} durationInFrames={ITEM}>
        <MomentCard {...it} />
      </Series.Sequence>
    ))}
    <Series.Sequence name="QR" durationInFrames={150}>
      <RvEscanea text="Tus invitados lo capturan todo con un *QR*" />
    </Series.Sequence>
    <Series.Sequence name="CTA" durationInFrames={120}>
      <RvCta title="Que no se te escape *nada*" />
    </Series.Sequence>
  </Series>
);
