import React from "react";
import { Series } from "remotion";
import { Hook } from "./scenes/Hook";
import { Logo } from "./scenes/Logo";
import { Captain } from "./scenes/Captain";
import { Mesa } from "./scenes/Mesa";
import { Retos } from "./scenes/Retos";
import { Novios } from "./scenes/Novios";
import { Ranking } from "./scenes/Ranking";
import { Recuerdos } from "./scenes/Recuerdos";
import { Cta } from "./scenes/Cta";

// 30 fps. Las duraciones deben coincidir con SCENES en theme.ts.
export const Capitanes: React.FC = () => (
  <Series>
    <Series.Sequence name="Hook" durationInFrames={105}>
      <Hook />
    </Series.Sequence>
    <Series.Sequence name="Logo" durationInFrames={60}>
      <Logo />
    </Series.Sequence>
    <Series.Sequence name="Capitán" durationInFrames={105}>
      <Captain />
    </Series.Sequence>
    <Series.Sequence name="Elige mesa" durationInFrames={135}>
      <Mesa />
    </Series.Sequence>
    <Series.Sequence name="Retos" durationInFrames={315}>
      <Retos />
    </Series.Sequence>
    <Series.Sequence name="Novios" durationInFrames={105}>
      <Novios />
    </Series.Sequence>
    <Series.Sequence name="Ranking" durationInFrames={120}>
      <Ranking />
    </Series.Sequence>
    <Series.Sequence name="Recuerdos" durationInFrames={110}>
      <Recuerdos />
    </Series.Sequence>
    <Series.Sequence name="CTA" durationInFrames={90}>
      <Cta />
    </Series.Sequence>
  </Series>
);
