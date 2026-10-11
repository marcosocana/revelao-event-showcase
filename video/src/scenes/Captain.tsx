import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C } from "../theme";
import { Headline, Kicker, SceneBg, TopText, usePop } from "../ui";

export const Captain: React.FC = () => {
  const frame = useCurrentFrame();
  const p = usePop(6, 13);
  const ring = frame - 42;
  return (
    <SceneBg bg={C.gray}>
      <TopText>
        <Headline text="En cada mesa hay un *capitán* que lidera a los suyos" size={96} />
      </TopText>
      <Img
        src={staticFile("welcome-captain-v3.png")}
        style={{
          position: "absolute",
          left: 121,
          top: 770,
          width: 837,
          translate: `0 ${(1 - p) * 900 + Math.sin(frame / 12) * 6}px`,
        }}
      />
      {ring > 0 ? (
        <>
          <div
            style={{
              position: "absolute",
              left: 824 - 110,
              top: 1500 - 110,
              width: 220,
              height: 220,
              borderRadius: 110,
              border: `8px solid ${C.red}`,
              scale: String(interpolate(ring, [0, 10, 20, 30], [0.4, 1.08, 0.96, 1.04], { extrapolateRight: "clamp" })),
              opacity: interpolate(ring, [0, 6], [0, 1], { extrapolateRight: "clamp" }),
            }}
          />
          <div style={{ position: "absolute", left: 150, top: 1370 }}>
            <Kicker delay={48} active>
              Brazalete de capitán
            </Kicker>
          </div>
        </>
      ) : null}
    </SceneBg>
  );
};
