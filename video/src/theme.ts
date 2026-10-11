import { loadFont } from "@remotion/google-fonts/Inter";

export const { fontFamily } = loadFont("normal", {
  weights: ["500", "600", "700", "800"],
  subsets: ["latin"],
});

// Look & feel de revelao.cam/capitanes (landing) + pantallas del juego (app).
export const C = {
  red: "#EF4343", // --primary de la landing: hsl(0 84% 60%)
  coral: "#F06A5F", // botones de la app
  ink: "#151515",
  muted: "#737373",
  border: "#E5E5E5",
  gray: "#F5F5F5",
  appInk: "#2F292D",
  appMuted: "#87706D",
  appBorder: "#EAD8D3",
  cardTop: "#F7E7E4",
  cardBottom: "#F2DAD6",
  appBg: "#FDFAF9",
  green: "#22A06B",
  teams: ["#F38368", "#B4A0E4", "#A8BE84", "#E6BD68", "#8FB8DE"],
};

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

// Duraciones de cada escena en frames (30 fps). Suman 1145 ≈ 38,2 s.
export const SCENES = {
  hook: 105,
  logo: 60,
  captain: 105,
  mesa: 135,
  retos: 315,
  novios: 105,
  ranking: 120,
  recuerdos: 110,
  cta: 90,
};

export const TOTAL = Object.values(SCENES).reduce((a, b) => a + b, 0);
