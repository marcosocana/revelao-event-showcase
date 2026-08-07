import { ChangeEvent, PointerEvent as ReactPointerEvent, Ref, useEffect, useMemo, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import "svg2pdf.js";
import QRCode from "qrcode";
import jsQR from "jsqr";
import { Download, Eye, EyeOff, ImagePlus, Link2, Loader2, Printer, RotateCcw, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import brandLogo from "@/assets/LogoMiniRevelao.png";

const QR_PLACEHOLDER_VALUE = "https://www.revelao.cam";
const SVG_WIDTH = 210;
const SVG_HEIGHT = 297;

export type QrTemplateTheme = "minimal" | "garden" | "frame" | "arch" | "split" | "waves" | "confetti" | "night" | "ribbon" | "sun";
export type QrColorPreset = { name: string; background: string; text: string; accent: string };
export type QrTemplate = {
  id: number;
  title: string;
  theme: QrTemplateTheme;
  category: string;
  variant: number;
  defaultBackground: string;
  defaultText: string;
  defaultAccent: string;
  colorPresets: QrColorPreset[];
};

type PosterFormat = "a6" | "a5" | "a4";
const FORMATS: Record<PosterFormat, { label: string; width: number; height: number; previewWidth: string }> = {
  a6: { label: "A6 · Tarjeta de mesa", width: 105, height: 148, previewWidth: "max-w-[260px]" },
  a5: { label: "A5 · Cartel pequeño", width: 148, height: 210, previewWidth: "max-w-[335px]" },
  a4: { label: "A4 · Cartel grande", width: 210, height: 297, previewWidth: "max-w-[410px]" },
};

export type PosterElementId = "ornaments" | "eyebrow" | "title" | "details" | "qr" | "message" | "logo";
export type PosterElementTransform = { x: number; y: number; scale: number; hidden?: boolean };
export type PosterLayout = Record<PosterElementId, PosterElementTransform>;
type CustomLogoSvg = { markup: string; viewBox: string } | null;

const ELEMENT_BOXES: Record<PosterElementId, { width: number; height: number }> = {
  ornaments: { width: 18, height: 12 },
  eyebrow: { width: 78, height: 4 },
  title: { width: 84, height: 16 },
  details: { width: 76, height: 4 },
  qr: { width: 56, height: 40 },
  message: { width: 80, height: 8 },
  logo: { width: 34, height: 8 },
};

const getDefaultPosterLayout = (template: QrTemplate): PosterLayout => {
  const ornamentRight = template.variant % 2 === 1;
  return {
    ornaments: { x: ornamentRight ? 87 : 13, y: 87, scale: 0.85 + (template.variant % 4) * 0.05 },
    eyebrow: { x: 50, y: 7, scale: 1 },
    title: { x: 50, y: 18, scale: 1 },
    details: { x: 50, y: 29, scale: 1 },
    qr: { x: 50, y: 52, scale: 1 },
    message: { x: 50, y: 77, scale: 1 },
    logo: { x: 50, y: 91, scale: 1 },
  };
};

const overlaps = (first: PosterElementTransform, firstId: PosterElementId, second: PosterElementTransform, secondId: PosterElementId) => {
  if (first.hidden || second.hidden) return false;
  const firstBox = ELEMENT_BOXES[firstId];
  const secondBox = ELEMENT_BOXES[secondId];
  const firstHalfWidth = firstBox.width * first.scale / 2;
  const firstHalfHeight = firstBox.height * first.scale / 2;
  const secondHalfWidth = secondBox.width * second.scale / 2;
  const secondHalfHeight = secondBox.height * second.scale / 2;
  return Math.abs(first.x - second.x) < firstHalfWidth + secondHalfWidth + 0.7
    && Math.abs(first.y - second.y) < firstHalfHeight + secondHalfHeight + 0.7;
};

const isLayoutChangeValid = (layout: PosterLayout, element: PosterElementId, candidate: PosterElementTransform, showLogo: boolean) => {
  const box = ELEMENT_BOXES[element];
  const halfWidth = box.width * candidate.scale / 2;
  const halfHeight = box.height * candidate.scale / 2;
  if (candidate.x - halfWidth < 1 || candidate.x + halfWidth > 99 || candidate.y - halfHeight < 1 || candidate.y + halfHeight > 99) return false;
  return (Object.keys(layout) as PosterElementId[]).every((otherId) => {
    if (otherId === element || layout[otherId].hidden || (otherId === "logo" && !showLogo)) return true;
    return !overlaps(candidate, element, layout[otherId], otherId);
  });
};

const splitIntoLines = (text: string, maxCharacters: number, maxLines = 3) => {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  words.forEach((word) => {
    const last = lines[lines.length - 1];
    if (!last || (last.length + word.length + 1 > maxCharacters && lines.length < maxLines)) lines.push(word);
    else lines[lines.length - 1] = `${last} ${word}`;
  });
  return lines.slice(0, maxLines);
};

const visualProfiles = [
  { eyebrow: "— NUESTRA BODA —", titleFont: "Times", titleStyle: "normal", titleWeight: "400", titleTracking: 0, titleFactor: 1, detailsStyle: "plain", qrStyle: "double", messageStyle: "italic" },
  { eyebrow: "SAVE THE DATE", titleFont: "Times", titleStyle: "italic", titleWeight: "400", titleTracking: 0.3, titleFactor: 1.04, detailsStyle: "spaced", qrStyle: "soft", messageStyle: "rule" },
  { eyebrow: "EL ÁLBUM · 2026", titleFont: "Helvetica", titleStyle: "normal", titleWeight: "700", titleTracking: 0.8, titleFactor: 0.82, detailsStyle: "pill", qrStyle: "editorial", messageStyle: "caps" },
  { eyebrow: "BIENVENIDOS", titleFont: "Times", titleStyle: "italic", titleWeight: "400", titleTracking: 0, titleFactor: 1.08, detailsStyle: "plain", qrStyle: "arch", messageStyle: "italic" },
  { eyebrow: "BODA · EDICIÓN ESPECIAL", titleFont: "Helvetica", titleStyle: "normal", titleWeight: "600", titleTracking: 1.2, titleFactor: 0.78, detailsStyle: "spaced", qrStyle: "square", messageStyle: "rule" },
  { eyebrow: "NUESTRO GRAN DÍA", titleFont: "Times", titleStyle: "normal", titleWeight: "400", titleTracking: 0.2, titleFactor: 0.96, detailsStyle: "pill", qrStyle: "botanical", messageStyle: "plain" },
  { eyebrow: "WEDDING · VOL. 01", titleFont: "Helvetica", titleStyle: "normal", titleWeight: "700", titleTracking: 1.4, titleFactor: 0.76, detailsStyle: "spaced", qrStyle: "offset", messageStyle: "caps" },
  { eyebrow: "— PARA SIEMPRE —", titleFont: "Times", titleStyle: "italic", titleWeight: "400", titleTracking: 0.1, titleFactor: 1.02, detailsStyle: "plain", qrStyle: "seal", messageStyle: "italic" },
  { eyebrow: "RECUERDOS · 2026", titleFont: "Helvetica", titleStyle: "normal", titleWeight: "500", titleTracking: 1, titleFactor: 0.84, detailsStyle: "pill", qrStyle: "grid", messageStyle: "rule" },
  { eyebrow: "CELEBREMOS", titleFont: "Times", titleStyle: "normal", titleWeight: "400", titleTracking: 0, titleFactor: 1.06, detailsStyle: "spaced", qrStyle: "sun", messageStyle: "plain" },
] as const;

const vectorQrRuns = (value: string) => {
  const modules = QRCode.create(value || QR_PLACEHOLDER_VALUE, { errorCorrectionLevel: "M" }).modules;
  const runs: Array<{ x: number; y: number; width: number }> = [];
  for (let row = 0; row < modules.size; row += 1) {
    let start = -1;
    for (let column = 0; column <= modules.size; column += 1) {
      const filled = column < modules.size && modules.get(row, column);
      if (filled && start === -1) start = column;
      if (!filled && start !== -1) {
        runs.push({ x: start, y: row, width: column - start });
        start = -1;
      }
    }
  }
  return { size: modules.size, runs };
};

const OrnamentArtwork = ({ template, accent }: { template: QrTemplate; accent: string }) => {
  const variant = template.variant % 5;
  switch (template.theme) {
    case "garden":
      return <g fill={accent}><ellipse cx="-7" cy="2" rx="7" ry="3" transform="rotate(-35 -7 2)" /><ellipse cx="5" cy="-5" rx="7" ry="3" transform="rotate(35 5 -5)" /><ellipse cx="6" cy="7" rx="6" ry="2.5" transform="rotate(-25 6 7)" /><path d="M-12 12 C-4 3 2 -3 13 -12" fill="none" stroke={accent} strokeWidth="1.2" /></g>;
    case "frame":
      return <g fill="none" stroke={accent} strokeWidth={1 + variant * 0.15}><path d="M-15 9 V-9 H2" /><path d="M-10 13 V-4 H7" /><circle cx="10" cy="-8" r="3" /></g>;
    case "arch":
      return <g fill="none" stroke={accent} strokeWidth="1.3"><path d="M-14 11 V1 A14 14 0 0 1 14 1 V11" /><path d="M-9 11 V2 A9 9 0 0 1 9 2 V11" opacity=".55" /></g>;
    case "split":
      return <g><rect x="-15" y="-11" width={7 + variant} height="22" fill={accent} /><path d="M-4 -8 H15 M-4 0 H10 M-4 8 H15" stroke={accent} strokeWidth="1.4" /></g>;
    case "waves":
      return <g fill="none" stroke={accent} strokeWidth="2"><path d="M-16 -5 C-10 -13 -3 3 4 -5 S14 -10 17 -4" /><path d="M-16 5 C-10 -3 -3 13 4 5 S14 0 17 6" opacity=".55" /></g>;
    case "confetti":
      return <g fill={accent}><circle cx="-11" cy="-7" r="2" /><rect x="-2" y="-11" width="4" height="8" transform="rotate(25)" /><circle cx="11" cy="-3" r="1.7" /><path d="M-12 9 l5 -5 l3 7 z" /><rect x="6" y="5" width="6" height="3" transform="rotate(-22 9 6)" /></g>;
    case "night":
      return <g fill={accent}><path d="M0 -14 L2 -3 L12 0 L2 3 L0 14 L-2 3 L-12 0 L-2 -3 Z" /><circle cx="13" cy="-10" r="2" opacity=".65" /><circle cx="-12" cy="10" r="1.5" opacity=".5" /></g>;
    case "ribbon":
      return <g fill={accent}><path d="M-16 -8 H16 V7 H-16 Z" opacity=".9" /><path d="M-16 7 L-10 13 L-4 7 M16 7 L10 13 L4 7" /></g>;
    case "sun":
      return <g fill="none" stroke={accent} strokeWidth="1.5"><circle r="7" fill={accent} opacity=".22" />{Array.from({ length: 12 }).map((_, index) => <line key={index} x1="0" y1="-11" x2="0" y2="-16" transform={`rotate(${index * 30})`} />)}</g>;
    case "minimal":
      return <g fill="none" stroke={accent} strokeWidth="1.4"><circle r={7 + variant} /><path d="M-16 0 H16 M0 -14 V14" opacity=".45" /></g>;
    default:
      return null;
  }
};

type PosterProps = {
  posterRef?: Ref<SVGSVGElement>;
  template: QrTemplate;
  eventName: string;
  eventDetails: string;
  message: string;
  background: string;
  textColor: string;
  accent: string;
  qrImage?: string;
  qrValue?: string;
  showLogo: boolean;
  customLogo?: CustomLogoSvg;
  layout?: PosterLayout;
  editable?: boolean;
  selectedElement?: PosterElementId | null;
  onSelectElement?: (element: PosterElementId) => void;
  onLayoutChange?: (layout: PosterLayout) => void;
  onDeleteElement?: (element: PosterElementId) => void;
};

export const TemplatePoster = ({
  posterRef, template, eventName, eventDetails, message, background, textColor, accent, qrImage, qrValue,
  showLogo, customLogo, layout, editable = false, selectedElement, onSelectElement, onLayoutChange, onDeleteElement,
}: PosterProps) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const dragging = useRef<PosterElementId | null>(null);
  const resizing = useRef<{ id: PosterElementId; startX: number; startY: number; startScale: number } | null>(null);
  const activeLayout = layout ?? getDefaultPosterLayout(template);
  const profile = visualProfiles[template.variant % visualProfiles.length];
  const titleLines = splitIntoLines(eventName || "Tu evento", eventName.length > 28 ? 17 : 21);
  const messageLines = splitIntoLines(message || "Escanea el QR y comparte tus fotos y vídeos.", 42, 3);
  const qr = useMemo(() => qrValue ? vectorQrRuns(qrValue) : null, [qrValue]);

  const setSvgRef = (node: SVGSVGElement | null) => {
    svgRef.current = node;
    if (typeof posterRef === "function") posterRef(node);
    else if (posterRef) (posterRef as { current: SVGSVGElement | null }).current = node;
  };

  const pointerPosition = (event: ReactPointerEvent<SVGGElement | SVGCircleElement>) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const matrix = svg.getScreenCTM()?.inverse();
    if (!matrix) return null;
    const local = point.matrixTransform(matrix);
    return { x: local.x / SVG_WIDTH * 100, y: local.y / SVG_HEIGHT * 100 };
  };

  const updateElement = (id: PosterElementId, candidate: PosterElementTransform) => {
    if (!onLayoutChange || !isLayoutChangeValid(activeLayout, id, candidate, showLogo)) return;
    onLayoutChange({ ...activeLayout, [id]: candidate });
  };

  const moveElement = (event: ReactPointerEvent<SVGGElement>, id: PosterElementId) => {
    if (dragging.current !== id) return;
    event.preventDefault();
    const position = pointerPosition(event);
    if (position) updateElement(id, { ...activeLayout[id], ...position });
  };

  const resizeElement = (event: ReactPointerEvent<SVGCircleElement>, id: PosterElementId) => {
    const state = resizing.current;
    if (!state || state.id !== id || !svgRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    const rect = svgRef.current.getBoundingClientRect();
    const movement = ((event.clientX - state.startX) - (event.clientY - state.startY)) / rect.width;
    updateElement(id, { ...activeLayout[id], scale: Math.min(1.8, Math.max(0.4, state.startScale + movement * 2.2)) });
  };

  const renderEditorControls = (id: PosterElementId) => {
    if (!editable || selectedElement !== id) return null;
    const box = ELEMENT_BOXES[id];
    const width = box.width * SVG_WIDTH / 100;
    const height = box.height * SVG_HEIGHT / 100;
    return (
      <g data-editor-control="true">
        <rect x={-width / 2 - 2} y={-height / 2 - 2} width={width + 4} height={height + 4} rx="2" fill="none" stroke="#ef4444" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <g transform={`translate(${width / 2 + 4} ${-height / 2 - 4})`} className="cursor-pointer" onPointerDown={(event) => event.stopPropagation()} onClick={(event) => { event.stopPropagation(); onDeleteElement?.(id); }}>
          <circle r="4.5" fill="#ef4444" />
          <path d="M-1.8 -1.8 L1.8 1.8 M1.8 -1.8 L-1.8 1.8" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
        </g>
        <circle
          cx={width / 2 + 4}
          cy={height / 2 + 4}
          r="4.5"
          fill="white"
          stroke="#ef4444"
          strokeWidth="1"
          className="cursor-se-resize"
          onPointerDown={(event) => { event.preventDefault(); event.stopPropagation(); resizing.current = { id, startX: event.clientX, startY: event.clientY, startScale: activeLayout[id].scale }; event.currentTarget.setPointerCapture(event.pointerId); }}
          onPointerMove={(event) => resizeElement(event, id)}
          onPointerUp={() => { resizing.current = null; }}
          onPointerCancel={() => { resizing.current = null; }}
        />
        <path d={`M${width / 2 + 1.5} ${height / 2 + 6.5} L${width / 2 + 6.5} ${height / 2 + 1.5}`} stroke="#ef4444" strokeWidth="1" pointerEvents="none" />
      </g>
    );
  };

  const element = (id: PosterElementId, content: React.ReactNode) => {
    const transform = activeLayout[id];
    if (transform.hidden || (id === "logo" && !showLogo)) return null;
    return (
      <g
        key={id}
        data-poster-element={id}
        transform={`translate(${transform.x * SVG_WIDTH / 100} ${transform.y * SVG_HEIGHT / 100}) scale(${transform.scale})`}
        className={editable ? "cursor-move" : undefined}
        onPointerDown={(event) => { if (!editable) return; dragging.current = id; event.currentTarget.setPointerCapture(event.pointerId); onSelectElement?.(id); }}
        onPointerMove={(event) => moveElement(event, id)}
        onPointerUp={() => { dragging.current = null; }}
        onPointerCancel={() => { dragging.current = null; }}
      >
        {content}
        {renderEditorControls(id)}
      </g>
    );
  };

  const titleSize = (eventName.length > 30 ? 13.5 : eventName.length > 20 ? 16 : 19) * profile.titleFactor;
  const messageSize = message.length > 80 ? 5.1 : message.length > 55 ? 5.7 : 6.3;
  const qrBoxSize = 103;
  const qrInner = 88;

  const eyebrowArtwork = (
    <g>
      {template.variant % 3 === 0 ? <><line x1="-78" y1="0" x2="-48" y2="0" stroke={accent} strokeWidth=".7" /><line x1="48" y1="0" x2="78" y2="0" stroke={accent} strokeWidth=".7" /></> : null}
      <text textAnchor="middle" dominantBaseline="middle" fill={accent} fontFamily="Helvetica" fontSize="4.7" fontWeight="600" letterSpacing="1.4">{profile.eyebrow}</text>
    </g>
  );

  const detailsArtwork = (
    <g>
      {profile.detailsStyle === "pill" ? <rect x="-66" y="-7" width="132" height="14" rx="7" fill={accent} opacity=".12" /> : null}
      {profile.detailsStyle === "spaced" ? <><circle cx="-68" cy="0" r="1.2" fill={accent} /><circle cx="68" cy="0" r="1.2" fill={accent} /></> : null}
      <text textAnchor="middle" dominantBaseline="middle" fill={textColor} opacity=".78" fontFamily="Helvetica" fontSize="4.8" letterSpacing={profile.detailsStyle === "spaced" ? "1.8" : "1.05"}>{eventDetails || "EL GRAN DÍA"}</text>
    </g>
  );

  const qrFrame = (() => {
    switch (profile.qrStyle) {
      case "double": return <><rect x="-55" y="-55" width="110" height="110" rx="8" fill="none" stroke={accent} strokeWidth="1" /><rect x="-51.5" y="-51.5" width="103" height="103" rx="6" fill="white" stroke={accent} strokeWidth=".45" /></>;
      case "soft": return <><rect x="-56" y="-56" width="112" height="112" rx="18" fill={accent} opacity=".13" /><rect x="-51.5" y="-51.5" width="103" height="103" rx="14" fill="white" /></>;
      case "editorial": return <><rect x="-56" y="-56" width="112" height="112" fill={accent} /><rect x="-51.5" y="-51.5" width="103" height="103" fill="white" /><text x="-47" y="-48" fill={accent} fontSize="2.7" fontFamily="Helvetica" letterSpacing=".8">SCAN · 01</text></>;
      case "arch": return <><path d="M-54 52 V-7 A54 54 0 0 1 54 -7 V52 Z" fill={accent} opacity=".16" /><path d="M-49 49 V-5 A49 49 0 0 1 49 -5 V49 Z" fill="white" /></>;
      case "square": return <><rect x="-55" y="-55" width="110" height="110" fill="none" stroke={accent} strokeWidth="2" /><rect x="-50.5" y="-50.5" width="101" height="101" fill="white" /></>;
      case "botanical": return <><rect x="-51.5" y="-51.5" width="103" height="103" rx="8" fill="white" /><g fill={accent}><ellipse cx="-52" cy="-47" rx="7" ry="2.5" transform="rotate(-35 -52 -47)" /><ellipse cx="51" cy="47" rx="7" ry="2.5" transform="rotate(-35 51 47)" /></g></>;
      case "offset": return <><rect x="-46" y="-46" width="103" height="103" fill={accent} opacity=".8" /><rect x="-53" y="-53" width="103" height="103" fill="white" /></>;
      case "seal": return <><circle r="58" fill={accent} opacity=".13" /><circle r="54" fill="none" stroke={accent} strokeWidth="1" strokeDasharray="2 3" /><rect x="-49" y="-49" width="98" height="98" rx="5" fill="white" /></>;
      case "grid": return <><rect x="-55" y="-55" width="110" height="110" fill="none" stroke={accent} strokeWidth="1" strokeDasharray="4 3" /><rect x="-51" y="-51" width="102" height="102" fill="white" /></>;
      case "sun": return <><circle r="58" fill={accent} opacity=".12" /><rect x="-49.5" y="-49.5" width="99" height="99" rx="12" fill="white" /></>;
      default: return <rect x={-qrBoxSize / 2} y={-qrBoxSize / 2} width={qrBoxSize} height={qrBoxSize} rx="6" fill="white" />;
    }
  })();

  const messageArtwork = (
    <g>
      {profile.messageStyle === "rule" ? <><line x1="-68" y1="-12" x2="68" y2="-12" stroke={accent} strokeWidth=".55" /><line x1="-68" y1="12" x2="68" y2="12" stroke={accent} strokeWidth=".55" /></> : null}
      <text textAnchor="middle" dominantBaseline="middle" fill={textColor} fontFamily={profile.messageStyle === "italic" ? "Times" : "Helvetica"} fontStyle={profile.messageStyle === "italic" ? "italic" : "normal"} fontSize={profile.messageStyle === "caps" ? messageSize * .86 : messageSize} letterSpacing={profile.messageStyle === "caps" ? ".65" : "0"}>
        {messageLines.map((line, index) => <tspan key={line + index} x="0" dy={index === 0 ? `${-(messageLines.length - 1) * messageSize * 0.52}` : `${messageSize * 1.05}`}>{profile.messageStyle === "caps" ? line.toUpperCase() : line}</tspan>)}
      </text>
    </g>
  );

  return (
    <svg ref={setSvgRef} viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} xmlns="http://www.w3.org/2000/svg" className="block aspect-[210/297] w-full touch-none" style={{ backgroundColor: background }}>
      <rect width={SVG_WIDTH} height={SVG_HEIGHT} fill={background} />
      {element("ornaments", <OrnamentArtwork template={template} accent={accent} />)}
      {element("eyebrow", eyebrowArtwork)}
      {element("title", <text textAnchor="middle" dominantBaseline="middle" fill={textColor} fontFamily={profile.titleFont} fontStyle={profile.titleStyle} fontWeight={profile.titleWeight} letterSpacing={profile.titleTracking} fontSize={titleSize}>{titleLines.map((line, index) => <tspan key={line + index} x="0" dy={index === 0 ? `${-(titleLines.length - 1) * titleSize * 0.48}` : `${titleSize * 0.96}`}>{line}</tspan>)}</text>)}
      {element("details", detailsArtwork)}
      {element("qr", <g>{qrFrame}{qr ? <g transform={`translate(${-qrInner / 2} ${-qrInner / 2}) scale(${qrInner / qr.size})`} fill="#000">{qr.runs.map((run, index) => <rect key={`${run.x}-${run.y}-${index}`} x={run.x} y={run.y} width={run.width} height="1.01" />)}</g> : <image href={qrImage} x={-qrInner / 2} y={-qrInner / 2} width={qrInner} height={qrInner} preserveAspectRatio="xMidYMid meet" />}</g>)}
      {element("message", messageArtwork)}
      {element("logo", customLogo ? <svg x="-34" y="-12" width="68" height="24" viewBox={customLogo.viewBox} dangerouslySetInnerHTML={{ __html: customLogo.markup }} /> : <image href={brandLogo} x="-35" y="-6.9" width="70" height="13.8" preserveAspectRatio="xMidYMid meet" />)}
    </svg>
  );
};

export const TemplateThumbnail = ({ template }: { template: QrTemplate }) => (
  <TemplatePoster template={template} eventName="Boda de María y Marcos" eventDetails="20 · 09 · 2026" message="Escanea y comparte tus recuerdos" background={template.defaultBackground} textColor={template.defaultText} accent={template.defaultAccent} qrValue={QR_PLACEHOLDER_VALUE} showLogo />
);

const sanitizeCustomSvg = (source: string): CustomLogoSvg => {
  const documentNode = new DOMParser().parseFromString(source, "image/svg+xml");
  const root = documentNode.documentElement;
  if (root.nodeName.toLowerCase() !== "svg" || documentNode.querySelector("parsererror")) return null;
  root.querySelectorAll("script, foreignObject, iframe, object, embed, style").forEach((node) => node.remove());
  root.querySelectorAll("*").forEach((node) => Array.from(node.attributes).forEach((attribute) => {
    if (attribute.name.toLowerCase().startsWith("on") || /javascript:/i.test(attribute.value)) node.removeAttribute(attribute.name);
  }));
  const viewBox = root.getAttribute("viewBox") || `0 0 ${root.getAttribute("width") || 100} ${root.getAttribute("height") || 100}`;
  return { markup: root.innerHTML, viewBox };
};

const decodeQrFile = async (file: File) => {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const nextImage = new Image();
    nextImage.onload = () => resolve(nextImage);
    nextImage.onerror = reject;
    nextImage.src = dataUrl;
  });
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("Canvas unavailable");
  context.drawImage(image, 0, 0);
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
  const decoded = jsQR(pixels.data, pixels.width, pixels.height);
  if (!decoded?.data) throw new Error("QR unreadable");
  return decoded.data;
};

export const TemplateCustomizerModal = ({ template, onClose }: { template: QrTemplate | null; onClose: () => void }) => {
  const { toast } = useToast();
  const previewRef = useRef<SVGSVGElement>(null);
  const [eventName, setEventName] = useState("");
  const [eventDetails, setEventDetails] = useState("");
  const [message, setMessage] = useState("");
  const [format, setFormat] = useState<PosterFormat>("a6");
  const [quantity, setQuantity] = useState("10");
  const [background, setBackground] = useState("#f7f3ea");
  const [textColor, setTextColor] = useState("#2f2926");
  const [accent, setAccent] = useState("#bd4b35");
  const [qrMethod, setQrMethod] = useState<"url" | "image">("url");
  const [eventUrl, setEventUrl] = useState("");
  const [qrValue, setQrValue] = useState(QR_PLACEHOLDER_VALUE);
  const [customLogo, setCustomLogo] = useState<CustomLogoSvg>(null);
  const [showLogo, setShowLogo] = useState(true);
  const [layout, setLayout] = useState<PosterLayout | null>(null);
  const [selectedElement, setSelectedElement] = useState<PosterElementId | null>("title");
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (!template) return;
    setEventName("Boda de María y Marcos");
    setEventDetails("Madrid · 20.09.2026");
    setMessage("Escanea el QR y comparte tus fotos y vídeos del evento.");
    setFormat("a6");
    setQuantity("10");
    setBackground(template.defaultBackground);
    setTextColor(template.defaultText);
    setAccent(template.defaultAccent);
    setQrMethod("url");
    setEventUrl("");
    setQrValue(QR_PLACEHOLDER_VALUE);
    setCustomLogo(null);
    setShowLogo(true);
    setLayout(getDefaultPosterLayout(template));
    setSelectedElement("title");
  }, [template]);

  useEffect(() => {
    if (!template || qrMethod !== "url" || !eventUrl.trim()) return;
    const timer = window.setTimeout(() => setQrValue(/^https?:\/\//i.test(eventUrl.trim()) ? eventUrl.trim() : `https://${eventUrl.trim()}`), 200);
    return () => window.clearTimeout(timer);
  }, [eventUrl, qrMethod, template]);

  if (!template) return null;

  const revealLogo = () => {
    if (layout && !isLayoutChangeValid(layout, "logo", layout.logo, true)) {
      toast({ title: "No hay espacio para el logo", description: "Mueve el elemento que ocupa su zona o restablece la composición.", variant: "destructive" });
      return false;
    }
    setShowLogo(true);
    return true;
  };

  const handleQrUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const decodedValue = await decodeQrFile(file);
      setQrValue(decodedValue);
      toast({ title: "QR convertido a vector", description: "Se ha reconstruido para que no se pixele en el PDF." });
    } catch {
      toast({ title: "No se pudo leer el QR", description: "Usa una imagen nítida o introduce directamente la URL del evento.", variant: "destructive" });
    }
  };

  const handleLogoUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type !== "image/svg+xml" && !file.name.toLowerCase().endsWith(".svg")) {
      toast({ title: "Utiliza un logo SVG", description: "Para conservar una exportación completamente vectorial, el logo debe ser SVG.", variant: "destructive" });
      return;
    }
    const sanitized = sanitizeCustomSvg(await file.text());
    if (!sanitized) {
      toast({ title: "SVG no válido", description: "No se ha podido interpretar el archivo.", variant: "destructive" });
      return;
    }
    setCustomLogo(sanitized);
    revealLogo();
  };

  const handleExport = async () => {
    if (!previewRef.current) return;
    setIsExporting(true);
    try {
      await document.fonts.ready;
      const dimensions = FORMATS[format];
      const cleanSvg = previewRef.current.cloneNode(true) as SVGSVGElement;
      cleanSvg.querySelectorAll("[data-editor-control]").forEach((node) => node.remove());
      cleanSvg.setAttribute("width", String(SVG_WIDTH));
      cleanSvg.setAttribute("height", String(SVG_HEIGHT));
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: [dimensions.width, dimensions.height], compress: true });
      await pdf.svg(cleanSvg, { x: 0, y: 0, width: dimensions.width, height: dimensions.height });
      const safeName = eventName.trim().toLowerCase().replace(/[^a-z0-9áéíóúüñ]+/gi, "-").replace(/(^-|-$)/g, "") || "evento";
      pdf.save(`plantilla-qr-${safeName}-${format}-vectorial.pdf`);
      toast({ title: "PDF vectorial listo", description: "El PDF conserva trazados, textos y QR sin pixelación." });
    } catch {
      toast({ title: "No se pudo generar el PDF", description: "Prueba de nuevo en unos segundos.", variant: "destructive" });
    } finally {
      setIsExporting(false);
    }
  };

  const printMessage = encodeURIComponent(`¡Hola! Quiero imprimir una plantilla QR con Revelao.\nPlantilla: ${template.title}\nEvento: ${eventName || "Sin indicar"}\nFormato: ${format.toUpperCase()}\nCantidad: ${quantity} unidades.`);
  const posterProps = { template, eventName, eventDetails, message, background, textColor, accent, qrValue, showLogo, customLogo };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[94dvh] w-[calc(100%-1rem)] max-w-6xl gap-0 overflow-y-auto rounded-2xl border-0 p-0 shadow-2xl">
        <DialogHeader className="border-b px-5 py-5 pr-16 sm:px-7">
          <DialogTitle className="font-serif text-2xl">Personaliza {template.title}</DialogTitle>
          <DialogDescription>La previsualización SVG es la misma composición vectorial que se exportará al PDF.</DialogDescription>
        </DialogHeader>
        <div className="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(380px,1.1fr)]">
          <div className="space-y-5 p-5 sm:p-7">
            <div className="grid gap-4">
              <div className="space-y-2"><Label htmlFor="template-event-name">Nombre del evento</Label><Input id="template-event-name" value={eventName} maxLength={42} onChange={(event) => setEventName(event.target.value)} /></div>
              <div className="space-y-2"><Label htmlFor="template-event-details">Fecha y lugar</Label><Input id="template-event-details" value={eventDetails} maxLength={52} onChange={(event) => setEventDetails(event.target.value)} /></div>
              <div className="space-y-2"><Label htmlFor="template-message">Texto del cartel</Label><Textarea id="template-message" value={message} maxLength={120} rows={2} onChange={(event) => setMessage(event.target.value)} /></div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[["Fondo", background, setBackground], ["Texto", textColor, setTextColor], ["Acento", accent, setAccent]].map(([label, value, setter]) => (
                <label key={String(label)} className="flex cursor-pointer flex-col gap-2 rounded-xl border bg-white p-3 text-xs font-medium shadow-sm">{label as string}<span className="flex items-center gap-2"><input type="color" value={value as string} onChange={(event) => (setter as (value: string) => void)(event.target.value)} className="h-8 w-8 cursor-pointer rounded border-0 bg-transparent p-0" /><span className="hidden uppercase text-muted-foreground sm:inline">{value as string}</span></span></label>
              ))}
            </div>

            <div className="space-y-2">
              <Label>Combinaciones de color</Label>
              <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
                {template.colorPresets.map((preset) => {
                  const active = background === preset.background && textColor === preset.text && accent === preset.accent;
                  return <button key={preset.name} type="button" onClick={() => { setBackground(preset.background); setTextColor(preset.text); setAccent(preset.accent); }} aria-label={`Usar colores ${preset.name}`} title={preset.name} className={`aspect-square rounded-lg border-2 p-0.5 transition-transform hover:scale-105 ${active ? "border-primary ring-2 ring-primary/20" : "border-white shadow-sm ring-1 ring-border"}`}><span className="block h-full w-full rounded-[5px]" style={{ background: `linear-gradient(135deg, ${preset.background} 0 46%, ${preset.accent} 46% 73%, ${preset.text} 73% 100%)` }} /></button>;
                })}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Código QR vectorial</Label>
              <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted p-1">
                <button type="button" onClick={() => { setQrMethod("url"); setEventUrl(qrValue === QR_PLACEHOLDER_VALUE ? "" : qrValue); }} className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${qrMethod === "url" ? "bg-white text-foreground shadow-sm" : "text-muted-foreground"}`}><Link2 className="h-4 w-4" />URL del evento</button>
                <button type="button" onClick={() => setQrMethod("image")} className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${qrMethod === "image" ? "bg-white text-foreground shadow-sm" : "text-muted-foreground"}`}><Upload className="h-4 w-4" />Subir QR</button>
              </div>
              {qrMethod === "url" ? <div className="space-y-2"><Input aria-label="URL del evento" type="url" value={eventUrl} onChange={(event) => setEventUrl(event.target.value)} placeholder="https://acceso.revelao.cam/tu-evento" /><p className="text-xs text-muted-foreground">Se muestra un QR neutro de ejemplo hasta que introduzcas la URL.</p></div> : <><label htmlFor="template-qr-upload" className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-dashed bg-muted/30 p-3 text-sm hover:border-primary"><span className="flex items-center gap-3"><span className="rounded-lg bg-white p-2 shadow-sm"><Upload className="h-4 w-4" /></span>Seleccionar imagen del QR</span><span className="text-xs text-muted-foreground">Se convertirá a vector</span></label><Input id="template-qr-upload" type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={handleQrUpload} /></>}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3"><Label>Logo inferior</Label><button type="button" onClick={() => { if (showLogo) setShowLogo(false); else revealLogo(); }} className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground">{showLogo ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}{showLogo ? "Visible" : "Oculto"}</button></div>
              <div className="grid grid-cols-2 gap-2"><label htmlFor="template-logo-upload" className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed px-3 py-2 text-sm font-medium hover:border-primary"><ImagePlus className="h-4 w-4" /> Sustituir SVG</label><button type="button" onClick={() => { setCustomLogo(null); revealLogo(); }} className="flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-muted"><RotateCcw className="h-4 w-4" /> Logo Revelao</button></div>
              <Input id="template-logo-upload" type="file" accept="image/svg+xml,.svg" className="sr-only" onChange={handleLogoUpload} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label htmlFor="template-format">Tamaño</Label><select id="template-format" value={format} onChange={(event) => setFormat(event.target.value as PosterFormat)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">{Object.entries(FORMATS).map(([value, item]) => <option key={value} value={value}>{item.label}</option>)}</select></div>
              <div className="space-y-2"><Label htmlFor="template-quantity">Cantidad para imprimir</Label><select id="template-quantity" value={quantity} onChange={(event) => setQuantity(event.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">{[10, 20, 30, 50, 100].map((value) => <option key={value} value={value}>{value} unidades</option>)}</select></div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2"><Button onClick={handleExport} disabled={isExporting} className="rounded-full">{isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}{isExporting ? "Preparando PDF" : "Descargar PDF vectorial"}</Button><Button asChild variant="outline" className="rounded-full border-primary text-primary hover:bg-primary/5"><a href={`https://wa.me/34695834018?text=${printMessage}`} target="_blank" rel="noreferrer"><Printer className="mr-2 h-4 w-4" />Imprimir con nosotros</a></Button></div>
          </div>

          <div className="flex min-h-[620px] flex-col items-center justify-center bg-[#eeeae3] p-5 sm:p-8">
            <div className="mb-3 flex flex-wrap items-center justify-center gap-2"><span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-muted-foreground shadow-sm">{FORMATS[format].width} × {FORMATS[format].height} mm · SVG</span><span className="rounded-full bg-white/90 px-3 py-1 text-xs text-muted-foreground shadow-sm">Todo es editable; las colisiones se bloquean</span><button type="button" onClick={() => { setLayout(getDefaultPosterLayout(template)); setShowLogo(true); setSelectedElement("title"); }} className="flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm"><RotateCcw className="h-3.5 w-3.5" /> Restablecer</button></div>
            <div className={`w-full ${FORMATS[format].previewWidth} overflow-hidden bg-white shadow-[0_24px_65px_rgba(55,42,35,0.2)] transition-[max-width] duration-300`}>
              <TemplatePoster {...posterProps} posterRef={previewRef} layout={layout ?? undefined} editable selectedElement={selectedElement} onSelectElement={setSelectedElement} onLayoutChange={setLayout} onDeleteElement={(element) => { if (element === "logo") setShowLogo(false); else if (layout) setLayout({ ...layout, [element]: { ...layout[element], hidden: true } }); setSelectedElement(null); }} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
