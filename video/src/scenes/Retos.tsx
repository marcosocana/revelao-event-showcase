import React from "react";
import { AbsoluteFill, Img, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Camera, Check, CircleHelp, Film } from "lucide-react";
import { C } from "../theme";
import {
  CameraUI,
  ChallengeCard,
  GameHeader,
  Headline,
  Kicker,
  Phone,
  Success,
  TabBar,
  Tap,
  TopText,
  SceneBg,
  SCREEN_W,
} from "../ui";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Las tres clases de reto. La activa va en rojo. */
const RetoChips: React.FC<{ active: number; start: number }> = ({ active, start }) => (
  <div style={{ display: "flex", gap: 16 }}>
    {[
      { icon: <Camera size={30} />, label: "Foto" },
      { icon: <Film size={30} />, label: "Vídeo" },
      { icon: <CircleHelp size={30} />, label: "Pregunta" },
    ].map((c, i) => (
      <Kicker key={c.label} delay={i === active ? start + 4 : -30} active={i === active}>
        {c.icon}
        {c.label}
      </Kicker>
    ))}
  </div>
);

const Flash: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{ backgroundColor: "#FFFFFF", zIndex: 20, opacity: interpolate(frame, [at, at + 2, at + 10], [0, 1, 0], clamp) }} />;
};

const FotoScreen: React.FC = () => {
  const frame = useCurrentFrame();
  return frame < 44 ? (
          <>
            <GameHeader points={45} done={4} />
            <ChallengeCard
              n="05"
              points={20}
              kind="Foto"
              icon={<Camera size={50} />}
              title="Brindis por los novios"
              desc="Haced una foto de toda la mesa brindando por los novios"
              pressAt={36}
            />
            <TabBar />
            <Tap x={SCREEN_W / 2} y={612} at={36} />
          </>
        ) : (
          <>
            <Img
              src={staticFile("capitanes-andrea-rafa-4.jpg")}
              style={{ width: "100%", height: "100%", objectFit: "cover", scale: String(interpolate(frame, [44, 120], [1.15, 1.05], clamp)) }}
            />
            <CameraUI />
            <Tap x={SCREEN_W / 2} y={727} at={64} />
            <Flash at={66} />
            <Success at={76} title="¡Prueba enviada!" points={20} />
          </>
        );
};

const VideoScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame < 30 ? (
          <>
            <Img src={staticFile("capitanes-paso-retos.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <Tap x={SCREEN_W / 2} y={652} at={22} />
          </>
        ) : (
          <>
            <Img
              src={staticFile("capitanes-andrea-rafa-manos-arriba.jpg")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                scale: String(interpolate(frame, [30, 90], [1.05, 1.25], clamp)),
                translate: `${interpolate(frame, [30, 90], [30, -30], clamp)}px 0`,
              }}
            />
            <CameraUI rec seconds={Math.floor((frame - 30) / fps) + 1} />
            <Success at={70} title="¡Vídeo enviado!" points={25} />
          </>
        );
};

const options = ["En un restaurante", "En la playa", "En un concierto", "En casa de amigos"];

const PreguntaScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const chosen = frame >= 46;
  return (
    <>
        <GameHeader points={90} done={6} />
        <div
          style={{
            margin: "24px 22px 0",
            borderRadius: 28,
            border: `1px solid ${C.appBorder}`,
            background: `linear-gradient(180deg, ${C.cardTop}, ${C.cardBottom})`,
            padding: "22px 24px 26px",
            textAlign: "center",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 19, fontWeight: 700, color: C.appInk }}>
              <span style={{ color: C.coral }}>●</span> Reto 07
            </span>
            <span style={{ fontSize: 15, fontWeight: 600, color: C.appInk, backgroundColor: "rgba(255,255,255,0.75)", borderRadius: 10, padding: "6px 12px" }}>
              30 puntos
            </span>
          </div>
          <div
            style={{
              width: 88,
              height: 88,
              margin: "14px auto 8px",
              borderRadius: 26,
              background: "linear-gradient(160deg, #FDF1EF, #EFD3CE)",
              boxShadow: "0 12px 24px rgba(132,83,70,0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#8A5A55",
            }}
          >
            <CircleHelp size={44} />
          </div>
          <div style={{ fontSize: 17, color: C.appMuted }}>Pregunta</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: C.appInk, letterSpacing: "-0.03em", marginTop: 2, lineHeight: 1.15 }}>
            ¿Dónde fue su primera cita?
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 18 }}>
            {options.map((o, i) => {
              const right = i === 0 && chosen;
              return (
                <div
                  key={o}
                  style={{
                    height: 58,
                    borderRadius: 16,
                    backgroundColor: right ? C.coral : "#FFFFFF",
                    color: right ? "#FFFFFF" : C.appInk,
                    border: `1px solid ${right ? C.coral : C.appBorder}`,
                    fontSize: 20,
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 20px",
                  }}
                >
                  <span>
                    {String.fromCharCode(65 + i)}. {o}
                  </span>
                  {right ? <Check size={26} strokeWidth={3} /> : null}
                </div>
              );
            })}
          </div>
        </div>
        <TabBar />
        <Tap x={200} y={511} at={44} />
        <Success at={60} title="¡Respuesta correcta!" points={30} />
    </>
  );
};

// Cada tramo del móvil dentro de la escena de retos (frames).
const FOTO = 120;
const VIDEO = 90;
const PREGUNTA = 105;
export const RETOS_DURATION = FOTO + VIDEO + PREGUNTA;

/** Escena de retos: el titular queda fijo y cambian la píldora activa y el móvil. */
export const Retos: React.FC = () => {
  const frame = useCurrentFrame();
  const active = frame < FOTO ? 0 : frame < FOTO + VIDEO ? 1 : 2;
  const inVideoScreenshot = frame >= FOTO && frame < FOTO + 30;
  return (
    <SceneBg>
      <TopText>
        <Headline text="Le llegan *retos*" size={110} />
        <RetoChips active={active} start={[0, FOTO, FOTO + VIDEO][active]} />
      </TopText>
      <Phone delay={0} island={!inVideoScreenshot}>
        <Sequence durationInFrames={FOTO} name="Foto" layout="none">
          <FotoScreen />
        </Sequence>
        <Sequence from={FOTO} durationInFrames={VIDEO} name="Vídeo" layout="none">
          <VideoScreen />
        </Sequence>
        <Sequence from={FOTO + VIDEO} durationInFrames={PREGUNTA} name="Pregunta" layout="none">
          <PreguntaScreen />
        </Sequence>
      </Phone>
    </SceneBg>
  );
};
