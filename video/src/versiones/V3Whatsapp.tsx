import React from "react";
import { AbsoluteFill, Img, interpolate, random, Series, useCurrentFrame } from "remotion";
import { ArrowLeft, Phone as PhoneIcon, Video as VideoIcon } from "lucide-react";
import { Headline, Phone, SceneBg, TopText, usePop } from "../ui";
import { RvRevelado, RvCta } from "../revelao/Revelado";
import { rv, WelcomeScreen } from "../revelao/ui";
import { ChatBubble, ChatDate, clamp, MiniPhone } from "./shared";

const Chat: React.FC = () => (
  <SceneBg>
    <TopText top={230}>
      <Headline text="Las fotos de tu boda acabarán *perdidas* en 150 móviles" size={84} stagger={2} />
    </TopText>
    <Phone delay={0}>
      <AbsoluteFill style={{ backgroundColor: "#EFEAE2" }}>
        <div style={{ height: 150, backgroundColor: "#008069", color: "#FFFFFF", display: "flex", alignItems: "flex-end", padding: "0 18px 16px", gap: 14 }}>
          <ArrowLeft size={28} />
          <div style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: "#DFE5E7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>💍</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 23, fontWeight: 700 }}>Boda R&M 💍</div>
            <div style={{ fontSize: 15, opacity: 0.85 }}>Carmen, Luis, Marta y 147 más</div>
          </div>
          <VideoIcon size={26} />
          <PhoneIcon size={24} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "18px 16px" }}>
          <ChatDate label="Domingo" delay={8} />
          <ChatBubble from="Carmen" text="¿Alguien tiene fotos del baile? 🙏" time="11:04" delay={14} />
          <ChatBubble from="Luis" color="#C2410C" text="Yo tengo un montón, luego las paso" time="11:20" delay={32} />
          <ChatDate label="Hace 1 semana" delay={52} />
          <ChatBubble from="Carmen" text="Luis, ¿las pasaste? 👀" time="18:37" delay={58} />
          <ChatDate label="Hace 3 semanas" delay={80} />
          <ChatBubble mine text="¿Alguien tiene ALGUNA foto de nuestra boda? 😭" time="21:12" delay={88} />
          <ChatBubble from="Luis" color="#C2410C" text="Uy, se me olvidó jajaja" time="23:50" delay={108} />
        </div>
      </AbsoluteFill>
    </Phone>
  </SceneBg>
);

/** 150 móviles que se dispersan y se apagan. */
const Scatter: React.FC = () => {
  const frame = useCurrentFrame();
  const cols = 15;
  return (
    <SceneBg>
      <TopText>
        <Headline text="Y nadie las pasa *nunca*" size={110} />
      </TopText>
      {Array.from({ length: 150 }).map((_, i) => {
        const x0 = 90 + (i % cols) * 62;
        const y0 = 700 + Math.floor(i / cols) * 76;
        const t = interpolate(frame, [18 + random(`d${i}`) * 20, 70], [0, 1], clamp);
        const ang = random(`a${i}`) * Math.PI * 2;
        const dist = 200 + random(`r${i}`) * 500;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x0 + Math.cos(ang) * dist * t,
              top: y0 + Math.sin(ang) * dist * t,
              opacity: 1 - t * 0.85,
              rotate: `${t * (random(`rt${i}`) * 80 - 40)}deg`,
            }}
          >
            <MiniPhone size={34} on={1 - t} />
          </div>
        );
      })}
    </SceneBg>
  );
};

const HastaAhora: React.FC = () => {
  const p = usePop(0, 10);
  return (
    <SceneBg>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 60 }}>
        <Img src={rv("logo.png")} style={{ width: 760, scale: String(p) }} />
        <Headline text="Hasta *ahora*" size={120} delay={10} />
      </AbsoluteFill>
    </SceneBg>
  );
};

/** Los móviles de los invitados vuelan hacia la misma galería. */
const Converge: React.FC = () => {
  const frame = useCurrentFrame();
  const counts = {
    fotos: Math.round(interpolate(frame, [30, 240], [0, 312], clamp)),
    videos: Math.round(interpolate(frame, [40, 240], [0, 48], clamp)),
    audios: Math.round(interpolate(frame, [50, 240], [0, 27], clamp)),
  };
  return (
    <SceneBg>
      <TopText>
        <Headline text="Con Revelao todo va a *un mismo sitio*" size={96} />
      </TopText>
      <Phone delay={0}>
        <WelcomeScreen counts={counts} />
      </Phone>
      {Array.from({ length: 44 }).map((_, i) => {
        const startF = 20 + i * 5;
        const t = interpolate(frame, [startF, startF + 28], [0, 1], { ...clamp, easing: (x) => x * x });
        if (frame < startF || t >= 1) return null;
        const side = i % 4;
        const r = random(`c${i}`);
        const x0 = side === 0 ? -80 : side === 1 ? 1100 : r * 1080;
        const y0 = side < 2 ? 700 + r * 900 : side === 2 ? 1950 : 560;
        return (
          <div key={i} style={{ position: "absolute", left: x0 + (520 - x0) * t, top: y0 + (1000 - y0) * t, scale: String(1 - t * 0.6), opacity: 1 - t * 0.3, zIndex: 20 }}>
            <MiniPhone size={46} />
          </div>
        );
      })}
    </SceneBg>
  );
};

export const V3_DURATION = 135 + 90 + 75 + 270 + 135 + 120;

export const V3Whatsapp: React.FC = () => (
  <Series>
    <Series.Sequence name="Chat" durationInFrames={135}>
      <Chat />
    </Series.Sequence>
    <Series.Sequence name="Móviles" durationInFrames={90}>
      <Scatter />
    </Series.Sequence>
    <Series.Sequence name="Hasta ahora" durationInFrames={75}>
      <HastaAhora />
    </Series.Sequence>
    <Series.Sequence name="Todo junto" durationInFrames={270}>
      <Converge />
    </Series.Sequence>
    <Series.Sequence name="Revelado" durationInFrames={135}>
      <RvRevelado text="Y al día siguiente *se revela*" counts={{ fotos: 312, videos: 48, audios: 27 }} />
    </Series.Sequence>
    <Series.Sequence name="CTA" durationInFrames={120}>
      <RvCta title="Todas las fotos de tu boda en *un solo lugar*" />
    </Series.Sequence>
  </Series>
);
