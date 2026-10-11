import React from "react";
import { Img, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import { C } from "../theme";
import { Headline, Phone, SceneBg, Tap, TopText, usePop } from "../ui";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const N = 25;
const isFinder = (x: number, y: number) =>
  (x < 7 && y < 7) || (x >= N - 7 && y < 7) || (x < 7 && y >= N - 7);
const finderOn = (x: number, y: number) => {
  const fx = x >= N - 7 ? x - (N - 7) : x;
  const fy = y >= N - 7 ? y - (N - 7) : y;
  const ring = fx === 0 || fx === 6 || fy === 0 || fy === 6;
  const core = fx >= 2 && fx <= 4 && fy >= 2 && fy <= 4;
  return ring || core;
};

/** QR decorativo (determinista) con los tres cuadros de posición. */
const QrCode: React.FC<{ size: number }> = ({ size }) => {
  const m = size / N;
  const cells: React.ReactNode[] = [];
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const on = isFinder(x, y) ? finderOn(x, y) : (x === 7 || y === 7 || (x === N - 8 && y < 8) || (y === N - 8 && x < 8)) ? false : random(`qr-${x}-${y}`) > 0.52;
      if (on) cells.push(<rect key={`${x}-${y}`} x={x * m} y={y * m} width={m + 0.5} height={m + 0.5} rx={isFinder(x, y) ? 0 : m * 0.2} />);
    }
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill={C.ink}>
      {cells}
    </svg>
  );
};

const QR_SIZE = 460;

export const Mesa: React.FC = () => {
  const frame = useCurrentFrame();
  const card = usePop(2, 13);
  const exit = interpolate(frame, [50, 62], [0, 1], clamp);
  const scan = frame - 12;
  const ok = frame >= 42;
  return (
    <SceneBg>
      <TopText>
        <Headline text="Escanea su QR y *elige su mesa*" size={96} />
      </TopText>
      {exit < 1 ? (
        <div
          style={{
            position: "absolute",
            left: (1080 - 600) / 2,
            top: 660,
            width: 600,
            borderRadius: 36,
            backgroundColor: "#FFFFFF",
            border: `1px solid ${C.border}`,
            boxShadow: "0 40px 80px rgba(21,21,21,0.14)",
            padding: "44px 70px 40px",
            textAlign: "center",
            scale: String(card * (1 - exit * 0.4)),
            opacity: 1 - exit,
            translate: `0 ${exit * -200}px`,
            rotate: `${(1 - card) * -8}deg`,
          }}
        >
          <Img src={staticFile("capitanes-logo.svg")} style={{ width: 300, marginLeft: 57 }} />
          <div style={{ position: "relative", width: QR_SIZE, height: QR_SIZE, marginTop: 34 }}>
            <QrCode size={QR_SIZE} />
            {/* Línea de escaneo */}
            {scan > 0 && !ok ? (
              <div
                style={{
                  position: "absolute",
                  left: -20,
                  right: -20,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: C.red,
                  boxShadow: `0 0 30px ${C.red}`,
                  top: interpolate(Math.sin((scan / 30) * Math.PI * 1.5), [-1, 1], [0, QR_SIZE]),
                }}
              />
            ) : null}
            {ok ? (
              <div
                style={{
                  position: "absolute",
                  inset: -20,
                  borderRadius: 20,
                  border: `10px solid ${C.green}`,
                  scale: String(interpolate(frame, [42, 48], [1.15, 1], clamp)),
                  opacity: interpolate(frame, [42, 45], [0, 1], clamp),
                }}
              />
            ) : null}
          </div>
          <div style={{ fontSize: 30, fontWeight: 600, color: C.muted, marginTop: 30 }}>Capitán de la Mesa 1</div>
        </div>
      ) : null}
      {frame >= 50 ? (
        <Phone delay={52} island={false}>
          <Img src={staticFile("capitanes-paso-capitan.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <Tap x={141} y={332} at={88} />
          <Tap x={266} y={773} at={114} />
        </Phone>
      ) : null}
    </SceneBg>
  );
};
