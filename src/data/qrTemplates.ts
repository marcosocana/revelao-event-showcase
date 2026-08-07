import type { QrColorPreset, QrTemplate, QrTemplateTheme } from "@/components/TemplateCustomizerModal";

const palettes: QrColorPreset[] = [
  { name: "Terracota", background: "#f7f3ed", text: "#292522", accent: "#c14e38" },
  { name: "Oliva", background: "#eef0e7", text: "#2d382e", accent: "#70846a" },
  { name: "Mar", background: "#eaf2f4", text: "#23343c", accent: "#5c9aaa" },
  { name: "Lavanda", background: "#f3ecf4", text: "#3c3040", accent: "#9a749b" },
  { name: "Arena", background: "#f5eadc", text: "#302521", accent: "#b98669" },
  { name: "Coral", background: "#fff1eb", text: "#422c2a", accent: "#df735a" },
  { name: "Bosque", background: "#e8eee9", text: "#20352d", accent: "#4e806b" },
  { name: "Noche", background: "#172b3c", text: "#fff8ed", accent: "#d8a85f" },
  { name: "Burdeos", background: "#3d1f2a", text: "#fff7ed", accent: "#d49a73" },
  { name: "Grafito", background: "#eae9e6", text: "#20242a", accent: "#626b73" },
];

const designs: Array<{ name: string; category: string; theme: QrTemplateTheme }> = [
  { name: "Aura", category: "Minimalista", theme: "minimal" },
  { name: "Oliva", category: "Botánica", theme: "garden" },
  { name: "Lienzo", category: "Editorial", theme: "frame" },
  { name: "Arco", category: "Romántica", theme: "arch" },
  { name: "Pulso", category: "Moderna", theme: "split" },
  { name: "Marea", category: "Orgánica", theme: "waves" },
  { name: "Chispa", category: "Festiva", theme: "confetti" },
  { name: "Noche", category: "Elegante", theme: "night" },
  { name: "Lazo", category: "Clásica", theme: "ribbon" },
  { name: "Sol", category: "Mediterránea", theme: "sun" },
];

const additionalFamilies: Array<{ name: string; category: string; theme: QrTemplateTheme }> = [
  { name: "Prisma", category: "Moderna", theme: "split" },
  { name: "Jardín", category: "Botánica", theme: "garden" },
  { name: "Órbita", category: "Minimalista", theme: "sun" },
  { name: "Velvet", category: "Elegante", theme: "night" },
  { name: "Serif", category: "Editorial", theme: "frame" },
  { name: "Pétalo", category: "Romántica", theme: "arch" },
  { name: "Ritmo", category: "Festiva", theme: "confetti" },
  { name: "Costa", category: "Mediterránea", theme: "waves" },
  { name: "Trazo", category: "Orgánica", theme: "minimal" },
  { name: "Sello", category: "Clásica", theme: "ribbon" },
];

const styleNames = ["Alba", "Brisa", "Calma", "Duna", "Esencia", "Luz", "Marea", "Nube", "Ritual", "Vela"];
const additionalDesigns = additionalFamilies.flatMap((family) =>
  styleNames.map((styleName) => ({ ...family, name: `${family.name} ${styleName}` })),
);

export const qrTemplates: QrTemplate[] = [...designs, ...additionalDesigns].map((design, index) => {
  const colorPresets = palettes;
  const firstPalette = colorPresets[index % colorPresets.length];

  return {
    id: index + 1,
    title: design.name,
    theme: design.theme,
    category: design.category,
    variant: index,
    defaultBackground: firstPalette.background,
    defaultText: firstPalette.text,
    defaultAccent: firstPalette.accent,
    colorPresets,
  };
});
