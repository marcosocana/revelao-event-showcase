import React from "react";
import { Series } from "remotion";
import { RvEscanea, RvHook, RvLogo, RvMesa } from "./Intro";
import { RvCaptura } from "./Captura";
import { RvCta, RvGaleria, RvOculto, RvRevelado } from "./Revelado";

// 30 fps. Las duraciones deben coincidir con RV_SCENES.
export const RV_SCENES = {
  hook: 108,
  logo: 60,
  mesa: 120,
  escanea: 120,
  captura: 270,
  oculto: 135,
  revelado: 135,
  galeria: 105,
  cta: 105,
};
export const RV_TOTAL = Object.values(RV_SCENES).reduce((a, b) => a + b, 0);

export const Revelao: React.FC = () => (
  <Series>
    <Series.Sequence name="Hook" durationInFrames={108}>
      <RvHook />
    </Series.Sequence>
    <Series.Sequence name="Logo" durationInFrames={60}>
      <RvLogo />
    </Series.Sequence>
    <Series.Sequence name="QR en la mesa" durationInFrames={120}>
      <RvMesa />
    </Series.Sequence>
    <Series.Sequence name="Escanea" durationInFrames={120}>
      <RvEscanea />
    </Series.Sequence>
    <Series.Sequence name="Captura" durationInFrames={270}>
      <RvCaptura />
    </Series.Sequence>
    <Series.Sequence name="Oculto" durationInFrames={135}>
      <RvOculto />
    </Series.Sequence>
    <Series.Sequence name="Revelado" durationInFrames={135}>
      <RvRevelado />
    </Series.Sequence>
    <Series.Sequence name="Galería" durationInFrames={105}>
      <RvGaleria />
    </Series.Sequence>
    <Series.Sequence name="CTA" durationInFrames={105}>
      <RvCta />
    </Series.Sequence>
  </Series>
);
