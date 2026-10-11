import React from "react";
import { Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Crown } from "lucide-react";
import { C } from "../theme";
import { Confetti, Headline, Kicker, SceneBg, TopText, usePop } from "../ui";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Puntos al inicio y al final de la escena. La Mesa 1 adelanta a la Mesa 3.
const teams = [
  { mesa: "Mesa 3", capitan: "Laura", avatar: "avatar-4.png", from: 160, to: 170, color: C.teams[3], before: 0, after: 1 },
  { mesa: "Mesa 1", capitan: "José Manuel", avatar: "avatar-1.png", from: 140, to: 195, color: C.teams[0], before: 1, after: 0 },
  { mesa: "Mesa 2", capitan: "Sofía", avatar: "avatar-2.png", from: 130, to: 135, color: C.teams[1], before: 2, after: 2 },
  { mesa: "Mesa 5", capitan: "Jorge", avatar: "avatar-3.png", from: 115, to: 125, color: C.teams[2], before: 3, after: 3 },
];

const ROW = 176;
const SWAP: [number, number] = [52, 68];

export const Ranking: React.FC = () => {
  const frame = useCurrentFrame();
  const listIn = usePop(6, 16);
  const swapped = frame >= SWAP[1] - 4;
  return (
    <SceneBg bg={C.gray}>
      <TopText>
        <Headline text="Ranking *en directo*" size={110} />
        <div style={{ fontSize: 48, fontWeight: 500, color: C.muted }}>¿Qué mesa ganará?</div>
      </TopText>
      <div style={{ position: "absolute", left: 90, right: 90, top: 640, height: ROW * 4, opacity: listIn, translate: `0 ${(1 - listIn) * 200}px` }}>
        {teams.map((t, i) => {
          const pos = interpolate(frame, SWAP, [t.before, t.after], { ...clamp, easing: Easing.bezier(0.65, 0, 0.35, 1) });
          const pts = Math.round(interpolate(frame, [30, SWAP[0] + 4], [t.from, t.to], clamp));
          const hero = i === 1;
          const leader = swapped ? t.after === 0 : t.before === 0;
          const bump = hero ? interpolate(frame, [SWAP[0], SWAP[0] + 8, SWAP[1], SWAP[1] + 10], [1, 1.06, 1.06, 1], clamp) : 1;
          const rank = Math.round(pos) + 1;
          return (
            <div
              key={t.mesa}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: pos * ROW,
                height: ROW - 20,
                zIndex: hero ? 2 : 1,
                scale: String(bump),
                backgroundColor: leader ? "#FDECEA" : "#FFFFFF",
                border: `2px solid ${hero ? C.red : C.border}`,
                borderRadius: 24,
                display: "flex",
                alignItems: "center",
                gap: 26,
                padding: "0 34px",
                boxShadow: hero ? "0 18px 40px rgba(239,67,67,0.18)" : "none",
              }}
            >
              <div style={{ width: 50, fontSize: 48, fontWeight: 800, color: leader ? C.red : C.muted, textAlign: "center" }}>{rank}</div>
              <div style={{ position: "relative" }}>
                <div style={{ width: 108, height: 108, borderRadius: 54, overflow: "hidden", backgroundColor: t.color }}>
                  <Img src={staticFile(t.avatar)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                {leader ? (
                  <div style={{ position: "absolute", top: -34, left: 30, color: "#E6A400", rotate: "-12deg" }}>
                    <Crown size={50} fill="#FFD84D" strokeWidth={2.2} />
                  </div>
                ) : null}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 46, fontWeight: 700, color: C.ink, letterSpacing: "-0.03em" }}>{t.mesa}</div>
                <div style={{ fontSize: 28, color: C.muted }}>Capitán: {t.capitan}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 60, fontWeight: 800, color: C.ink, letterSpacing: "-0.04em", lineHeight: 1 }}>{pts}</div>
                <div style={{ fontSize: 24, color: C.muted }}>puntos</div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", top: 1380, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        {frame >= SWAP[1] ? (
          <Kicker delay={SWAP[1]} active>
            ¡La Mesa 1 se pone líder!
          </Kicker>
        ) : null}
      </div>
      <Confetti start={SWAP[1]} />
    </SceneBg>
  );
};
