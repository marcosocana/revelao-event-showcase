import "./index.css";
import React from "react";
import { Composition, Folder } from "remotion";
import { Capitanes } from "./Capitanes";
import { FPS, HEIGHT, SCENES, TOTAL, WIDTH } from "./theme";
import { Hook } from "./scenes/Hook";
import { Logo } from "./scenes/Logo";
import { Captain } from "./scenes/Captain";
import { Mesa } from "./scenes/Mesa";
import { Retos } from "./scenes/Retos";
import { Novios } from "./scenes/Novios";
import { Ranking } from "./scenes/Ranking";
import { Recuerdos } from "./scenes/Recuerdos";
import { Cta } from "./scenes/Cta";
import { Revelao, RV_SCENES, RV_TOTAL } from "./revelao/Revelao";
import { RvEscanea, RvHook, RvLogo, RvMesa } from "./revelao/Intro";
import { RvCaptura } from "./revelao/Captura";
import { RvCta, RvGaleria, RvOculto, RvRevelado } from "./revelao/Revelado";
import { V1Pov, V1_DURATION } from "./versiones/V1Pov";
import { V2Fotografo, V2_DURATION } from "./versiones/V2Fotografo";
import { V3Whatsapp, V3_DURATION } from "./versiones/V3Whatsapp";
import { V4Voces, V4_DURATION } from "./versiones/V4Voces";
import { V5Desechable, V5_DURATION } from "./versiones/V5Desechable";

const versiones: { id: string; component: React.FC; d: number }[] = [
  { id: "Revelao-V1-POV", component: V1Pov, d: V1_DURATION },
  { id: "Revelao-V2-Fotografo", component: V2Fotografo, d: V2_DURATION },
  { id: "Revelao-V3-Whatsapp", component: V3Whatsapp, d: V3_DURATION },
  { id: "Revelao-V4-Voces", component: V4Voces, d: V4_DURATION },
  { id: "Revelao-V5-Desechable", component: V5Desechable, d: V5_DURATION },
];

const scenes = [
  { id: "Hook", component: Hook, d: SCENES.hook },
  { id: "Logo", component: Logo, d: SCENES.logo },
  { id: "Capitan", component: Captain, d: SCENES.captain },
  { id: "Mesa", component: Mesa, d: SCENES.mesa },
  { id: "Retos", component: Retos, d: SCENES.retos },
  { id: "Novios", component: Novios, d: SCENES.novios },
  { id: "Ranking", component: Ranking, d: SCENES.ranking },
  { id: "Recuerdos", component: Recuerdos, d: SCENES.recuerdos },
  { id: "CTA", component: Cta, d: SCENES.cta },
];

const rvScenes: { id: string; component: React.FC; d: number }[] = [
  { id: "Rv-Hook", component: RvHook, d: RV_SCENES.hook },
  { id: "Rv-Logo", component: RvLogo, d: RV_SCENES.logo },
  { id: "Rv-Mesa", component: RvMesa, d: RV_SCENES.mesa },
  { id: "Rv-Escanea", component: RvEscanea, d: RV_SCENES.escanea },
  { id: "Rv-Captura", component: RvCaptura, d: RV_SCENES.captura },
  { id: "Rv-Oculto", component: RvOculto, d: RV_SCENES.oculto },
  { id: "Rv-Revelado", component: RvRevelado, d: RV_SCENES.revelado },
  { id: "Rv-Galeria", component: RvGaleria, d: RV_SCENES.galeria },
  { id: "Rv-CTA", component: RvCta, d: RV_SCENES.cta },
];

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Capitanes" component={Capitanes} durationInFrames={TOTAL} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="Revelao" component={Revelao} durationInFrames={RV_TOTAL} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Folder name="Revelao-Versiones">
      {versiones.map((v) => (
        <Composition key={v.id} id={v.id} component={v.component} durationInFrames={v.d} fps={FPS} width={WIDTH} height={HEIGHT} />
      ))}
    </Folder>
    <Folder name="Escenas-Revelao">
      {rvScenes.map((s) => (
        <Composition key={s.id} id={s.id} component={s.component} durationInFrames={s.d} fps={FPS} width={WIDTH} height={HEIGHT} />
      ))}
    </Folder>
    <Folder name="Escenas">
      {scenes.map((s) => (
        <Composition key={s.id} id={s.id} component={s.component} durationInFrames={s.d} fps={FPS} width={WIDTH} height={HEIGHT} />
      ))}
    </Folder>
  </>
);
