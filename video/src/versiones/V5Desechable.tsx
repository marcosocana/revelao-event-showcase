import React from "react";
import { AbsoluteFill, interpolate, Series, staticFile, useCurrentFrame } from "remotion";
import { Camera, Clock, EyeOff, Mic, Sparkles, Users } from "lucide-react";
import { C } from "../theme";
import { Headline, SceneBg, TopText, usePop } from "../ui";
import { RvCta, RvRevelado } from "../revelao/Revelado";
import { clamp, DisposableCamera, FilmStrip, Grain } from "./shared";

const SEPIA = "#EFE4D2";

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const p = usePop(6, 11);
  const flash = interpolate(frame, [52, 55, 70], [0, 1, 0], clamp);
  return (
    <SceneBg bg={SEPIA}>
      <TopText top={230}>
        <Headline text="¿Te acuerdas de las *cámaras desechables* en las bodas?" size={92} stagger={3} />
      </TopText>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingTop: 520 }}>
        <div style={{ scale: String(p), rotate: `${(1 - p) * -30 + Math.sin(frame / 14) * 3}deg` }}>
          <DisposableCamera width={760} />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: "#FFFFFF", opacity: flash }} />
      <Grain />
    </SceneBg>
  );
};

const Row: React.FC<{ icon: React.ReactNode; text: string; delay: number; dark?: boolean }> = ({ icon, text, delay, dark }) => {
  const p = usePop(delay, 13);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 24,
        fontSize: 52,
        fontWeight: 700,
        letterSpacing: "-0.03em",
        color: dark ? "#6B5A45" : C.ink,
        opacity: Math.min(1, p * 2),
        translate: `${(1 - p) * -120}px 0`,
      }}
    >
      <div
        style={{
          width: 84,
          height: 84,
          borderRadius: 42,
          flexShrink: 0,
          backgroundColor: dark ? "#D9C9AE" : C.red,
          color: dark ? "#6B5A45" : "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </div>
      {text}
    </div>
  );
};

const Label: React.FC<{ children: string; red?: boolean; delay: number }> = ({ children, red, delay }) => {
  const p = usePop(delay, 12);
  return (
    <div
      style={{
        alignSelf: "flex-start",
        fontSize: 34,
        fontWeight: 700,
        letterSpacing: "0.14em",
        padding: "10px 26px",
        borderRadius: 999,
        backgroundColor: red ? C.red : "#6B5A45",
        color: "#FFFFFF",
        scale: String(p),
      }}
    >
      {children}
    </div>
  );
};

const AntesAhora: React.FC = () => (
  <SceneBg>
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 960, backgroundColor: SEPIA }} />
      <div style={{ position: "absolute", left: 100, right: 100, top: 250, display: "flex", flexDirection: "column", gap: 34 }}>
        <Label delay={0}>ANTES</Label>
        <Row dark icon={<Camera size={42} />} text="27 fotos por cámara" delay={8} />
        <Row dark icon={<EyeOff size={42} />} text="La mitad, borrosas" delay={16} />
        <Row dark icon={<Clock size={42} />} text="Semanas para revelar" delay={24} />
      </div>
      <div style={{ position: "absolute", left: 100, right: 100, top: 1010, display: "flex", flexDirection: "column", gap: 34 }}>
        <Label red delay={60}>AHORA</Label>
        <Row icon={<Mic size={42} />} text="Fotos, vídeos y audios" delay={68} />
        <Row icon={<Users size={42} />} text="De todos tus invitados" delay={76} />
        <Row icon={<Sparkles size={42} />} text="Revelado al día siguiente" delay={84} />
      </div>
    </AbsoluteFill>
    <Grain opacity={0.08} />
  </SceneBg>
);

const Carrete: React.FC = () => (
  <SceneBg bg={SEPIA}>
    <TopText>
      <Headline text="La misma emoción de *esperar al revelado*" size={96} stagger={2} />
    </TopText>
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 860 }}>
      <div style={{ rotate: "-4deg" }}>
        <FilmStrip
          start={30}
          step={25}
          frameW={300}
          photos={[staticFile("revelao/capitanes-andrea-rafa-foto-novios.jpg"), staticFile("revelao/still-esc33-1.jpg"), staticFile("revelao/capitanes-andrea-rafa-manos-arriba.jpg")]}
        />
      </div>
    </AbsoluteFill>
    <Grain opacity={0.12} />
  </SceneBg>
);

export const V5_DURATION = 100 + 180 + 150 + 120 + 120;

export const V5Desechable: React.FC = () => (
  <Series>
    <Series.Sequence name="Hook" durationInFrames={100}>
      <Hook />
    </Series.Sequence>
    <Series.Sequence name="Antes / Ahora" durationInFrames={180}>
      <AntesAhora />
    </Series.Sequence>
    <Series.Sequence name="Carrete" durationInFrames={150}>
      <Carrete />
    </Series.Sequence>
    <Series.Sequence name="Móvil" durationInFrames={120}>
      <RvRevelado text="Pero ahora, con el móvil de *tus invitados*" />
    </Series.Sequence>
    <Series.Sequence name="CTA" durationInFrames={120}>
      <RvCta title="La cámara desechable de *tu boda*" />
    </Series.Sequence>
  </Series>
);
