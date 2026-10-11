const FONT_URL = "https://fonts.googleapis.com/css2?family=Nunito:wght@800;900&family=JetBrains+Mono:wght@500;700&display=swap";

// Tipografías de la cámara (Nunito y JetBrains Mono): las usan la demo y el logo de la landing.
export const loadCameraFonts = () => {
  if (document.querySelector(`link[href="${FONT_URL}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = FONT_URL;
  document.head.appendChild(link);
};
