import { type ChangeEvent, type PointerEvent as ReactPointerEvent, useEffect, useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { Download, ImagePlus, QrCode, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

type TemplateFormat = "table-card" | "entrance-poster" | "table-poster" | "custom";
type BackgroundMode = "solid" | "gradient" | "image";
type GradientType = "linear" | "radial" | "conic";
type AlignMode = "left" | "center" | "right";
type BaseElementKey = "title" | "description" | "qr" | "logo";
type SelectionKey = BaseElementKey | `decor-${string}`;
type FontOption = {
  id: string;
  label: string;
  family: string;
  googleHref?: string;
};

type EditableElement = {
  x: number;
  y: number;
  width: number;
  fontSize?: number;
};

type DecorativeElement = {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
};

type ActiveGesture = {
  key: SelectionKey;
  mode: "move" | "resize";
  startX: number;
  startY: number;
  origin: EditableElement | DecorativeElement;
};

const FONT_OPTIONS: FontOption[] = [
  { id: "system", label: "System", family: 'ui-sans-serif, system-ui, sans-serif' },
  {
    id: "dancing-script",
    label: "Dancing Script",
    family: '"Dancing Script", cursive',
    googleHref: "https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;700&display=swap",
  },
  {
    id: "great-vibes",
    label: "Great Vibes",
    family: '"Great Vibes", cursive',
    googleHref: "https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap",
  },
  {
    id: "allura",
    label: "Allura",
    family: '"Allura", cursive',
    googleHref: "https://fonts.googleapis.com/css2?family=Allura&display=swap",
  },
  {
    id: "parisienne",
    label: "Parisienne",
    family: '"Parisienne", cursive',
    googleHref: "https://fonts.googleapis.com/css2?family=Parisienne&display=swap",
  },
  {
    id: "playfair-display",
    label: "Playfair Display",
    family: '"Playfair Display", serif',
    googleHref: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap",
  },
  {
    id: "merriweather",
    label: "Merriweather",
    family: '"Merriweather", serif',
    googleHref: "https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap",
  },
  {
    id: "pacifico",
    label: "Pacifico",
    family: '"Pacifico", cursive',
    googleHref: "https://fonts.googleapis.com/css2?family=Pacifico&display=swap",
  },
  {
    id: "cormorant-garamond",
    label: "Cormorant Garamond",
    family: '"Cormorant Garamond", serif',
    googleHref: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&display=swap",
  },
  {
    id: "eb-garamond",
    label: "EB Garamond",
    family: '"EB Garamond", serif',
    googleHref: "https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600;700&display=swap",
  },
  {
    id: "cinzel",
    label: "Cinzel",
    family: '"Cinzel", serif',
    googleHref: "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&display=swap",
  },
  {
    id: "sacramento",
    label: "Sacramento",
    family: '"Sacramento", cursive',
    googleHref: "https://fonts.googleapis.com/css2?family=Sacramento&display=swap",
  },
  {
    id: "lora",
    label: "Lora",
    family: '"Lora", serif',
    googleHref: "https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap",
  },
  {
    id: "manrope",
    label: "Manrope",
    family: '"Manrope", sans-serif',
    googleHref: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap",
  },
  {
    id: "prata",
    label: "Prata",
    family: '"Prata", serif',
    googleHref: "https://fonts.googleapis.com/css2?family=Prata&display=swap",
  },
  {
    id: "belleza",
    label: "Belleza",
    family: '"Belleza", sans-serif',
    googleHref: "https://fonts.googleapis.com/css2?family=Belleza&display=swap",
  },
];

const DEFAULT_DESCRIPTION =
  "📸✨ Escanea el QR y captura los momentos más divertidos de la fiesta\n\n🎄 Mañana a las 12:00 AM se revelarán todas las fotos y podrás verlas\n\n📶 ¿Sin cobertura? No te preocupes ¡tenemos wifi!";

const FORMAT_CONFIG: Record<Exclude<TemplateFormat, "custom">, { label: string; widthCm: number; heightCm: number }> = {
  "table-card": { label: "Tarjeta para la mesa · 20 x 20 cm", widthCm: 20, heightCm: 20 },
  "entrance-poster": { label: "Cartel de entrada · A3", widthCm: 29.7, heightCm: 42 },
  "table-poster": { label: "Cartel de mesa", widthCm: 20, heightCm: 10 },
};

const ALIGN_OPTIONS: Array<{ value: AlignMode; label: string }> = [
  { value: "left", label: "Izquierda" },
  { value: "center", label: "Centro" },
  { value: "right", label: "Derecha" },
];

const GRADIENT_TYPE_OPTIONS: Array<{ value: GradientType; label: string }> = [
  { value: "linear", label: "Lineal" },
  { value: "radial", label: "Radial" },
  { value: "conic", label: "Cónico" },
];

const PRESET_TEMPLATES = [
  {
    id: "classic-olive",
    label: "Clásica oliva",
    titleFontId: "parisienne",
    descriptionFontId: "system",
    titleColor: "#5e804b",
    descriptionColor: "#5b5b5b",
    titleAlign: "center" as AlignMode,
    descriptionAlign: "center" as AlignMode,
    backgroundMode: "solid" as BackgroundMode,
    gradientType: "linear" as GradientType,
    backgroundColorA: "#f2ddb2",
    backgroundColorB: "#ead29e",
  },
  {
    id: "romantic-blush",
    label: "Romántica blush",
    titleFontId: "great-vibes",
    descriptionFontId: "lora",
    titleColor: "#8f5f6b",
    descriptionColor: "#6f5c60",
    titleAlign: "center" as AlignMode,
    descriptionAlign: "center" as AlignMode,
    backgroundMode: "gradient" as BackgroundMode,
    gradientType: "radial" as GradientType,
    backgroundColorA: "#fff2f1",
    backgroundColorB: "#f1d6d3",
  },
  {
    id: "modern-night",
    label: "Moderna noche",
    titleFontId: "cinzel",
    descriptionFontId: "manrope",
    titleColor: "#f6f0d8",
    descriptionColor: "#eef2f5",
    titleAlign: "center" as AlignMode,
    descriptionAlign: "center" as AlignMode,
    backgroundMode: "gradient" as BackgroundMode,
    gradientType: "linear" as GradientType,
    backgroundColorA: "#182231",
    backgroundColorB: "#314a62",
  },
  {
    id: "editorial-minimal",
    label: "Editorial minimal",
    titleFontId: "prata",
    descriptionFontId: "manrope",
    titleColor: "#232323",
    descriptionColor: "#555555",
    titleAlign: "left" as AlignMode,
    descriptionAlign: "left" as AlignMode,
    backgroundMode: "solid" as BackgroundMode,
    gradientType: "linear" as GradientType,
    backgroundColorA: "#f7f5ef",
    backgroundColorB: "#ece7dc",
  },
];

const CM_TO_PX = 118.11;

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("No se pudo leer el archivo"));
    reader.readAsDataURL(file);
  });

const buildDefaultLayout = (width: number, height: number): Record<BaseElementKey, EditableElement> => {
  const qrSize = Math.min(width, height) * 0.34;
  const logoWidth = Math.min(width * 0.18, 320);
  const isLandscape = width > height;

  if (!isLandscape) {
    const titleWidth = width * 0.54;
    const descriptionWidth = width * 0.64;
    const portraitQrSize = Math.min(width, height) * 0.33;
    const portraitLogoWidth = Math.min(width * 0.13, 120);

    return {
      title: {
        x: width / 2 - titleWidth / 2,
        y: height * 0.07,
        width: titleWidth,
        fontSize: Math.round(width * 0.067),
      },
      description: {
        x: width / 2 - descriptionWidth / 2,
        y: height * 0.315,
        width: descriptionWidth,
        fontSize: Math.round(width * 0.0148),
      },
      qr: {
        x: width / 2 - portraitQrSize / 2,
        y: height * 0.53,
        width: portraitQrSize,
      },
      logo: {
        x: width / 2 - portraitLogoWidth / 2,
        y: height * 0.915,
        width: portraitLogoWidth,
      },
    };
  }

  return {
    title: {
      x: isLandscape ? width * 0.09 : width * 0.13,
      y: height * 0.14,
      width: isLandscape ? width * 0.45 : width * 0.74,
      fontSize: Math.round(width * 0.035),
    },
    description: {
      x: isLandscape ? width * 0.11 : width * 0.15,
      y: isLandscape ? height * 0.34 : height * 0.30,
      width: isLandscape ? width * 0.44 : width * 0.70,
      fontSize: Math.round(width * 0.0105),
    },
    qr: {
      x: width / 2 - qrSize / 2,
      y: isLandscape ? height * 0.28 : height * 0.52,
      width: qrSize,
    },
    logo: {
      x: width / 2 - logoWidth / 2,
      y: height - Math.min(height * 0.09, 170),
      width: logoWidth,
    },
  };
};

const getGradientCss = (type: GradientType, colorA: string, colorB: string) => {
  if (type === "radial") return `radial-gradient(circle at center, ${colorA} 0%, ${colorB} 100%)`;
  if (type === "conic") return `conic-gradient(from 180deg at 50% 50%, ${colorA} 0deg, ${colorB} 220deg, ${colorA} 360deg)`;
  return `linear-gradient(135deg, ${colorA} 0%, ${colorB} 100%)`;
};

const isDecorativeSelection = (key: SelectionKey): key is `decor-${string}` => key.startsWith("decor-");

type PosterProps = {
  canvasWidth: number;
  canvasHeight: number;
  backgroundCss: string;
  backgroundImageUrl: string | null;
  titleText: string;
  descriptionText: string;
  titleFont: FontOption;
  descriptionFont: FontOption;
  titleColor: string;
  descriptionColor: string;
  titleAlign: AlignMode;
  descriptionAlign: AlignMode;
  qrImageUrl: string | null;
  logoImageUrl: string | null;
  layout: Record<BaseElementKey, EditableElement>;
  decorativeElements: DecorativeElement[];
  selectedElement: SelectionKey | null;
  onSelectElement?: (key: SelectionKey) => void;
  onPointerDownElement?: (event: ReactPointerEvent, key: SelectionKey, mode: "move" | "resize") => void;
  interactive?: boolean;
};

const PosterCanvas = ({
  canvasWidth,
  canvasHeight,
  backgroundCss,
  backgroundImageUrl,
  titleText,
  descriptionText,
  titleFont,
  descriptionFont,
  titleColor,
  descriptionColor,
  titleAlign,
  descriptionAlign,
  qrImageUrl,
  logoImageUrl,
  layout,
  decorativeElements,
  selectedElement,
  onSelectElement,
  onPointerDownElement,
  interactive = false,
}: PosterProps) => {
  const renderHandle = (key: SelectionKey) => {
    if (!interactive || selectedElement !== key) return null;
    return (
      <div
        role="presentation"
        className="absolute -bottom-3 -right-3 z-20 h-5 w-5 rounded-full bg-black"
        onPointerDown={(event) => onPointerDownElement?.(event, key, "resize")}
        aria-hidden="true"
      />
    );
  };

  const renderSelection = (key: SelectionKey, extraClass = "") =>
    interactive && selectedElement === key ? (
      <div className={`pointer-events-none absolute inset-0 rounded-md border-2 border-dashed border-black ${extraClass}`} />
    ) : null;

  return (
    <div
      className="relative overflow-hidden bg-white"
      style={{
        width: `${canvasWidth}px`,
        height: `${canvasHeight}px`,
        background: backgroundCss,
        backgroundImage: backgroundImageUrl ? `url(${backgroundImageUrl})` : undefined,
        backgroundSize: backgroundImageUrl ? "cover" : undefined,
        backgroundPosition: backgroundImageUrl ? "center" : undefined,
        backgroundRepeat: backgroundImageUrl ? "no-repeat" : undefined,
        borderRadius: "4px",
      }}
    >
      {decorativeElements.map((item) => {
        const key = `decor-${item.id}` as const;

        return (
          <button
            key={item.id}
            type="button"
            onPointerDown={(event) => onPointerDownElement?.(event, key, "move")}
            onClick={() => onSelectElement?.(key)}
            className="absolute bg-transparent p-0"
            style={{
              left: `${item.x}px`,
              top: `${item.y}px`,
              width: `${item.width}px`,
              cursor: interactive ? "move" : "default",
            }}
          >
            <div className="relative">
              <img src={item.src} alt="" className="h-auto w-full object-contain" draggable={false} />
              {renderSelection(key)}
              {renderHandle(key)}
            </div>
          </button>
        );
      })}

      <button
        type="button"
        onPointerDown={(event) => onPointerDownElement?.(event, "title", "move")}
        onClick={() => onSelectElement?.("title")}
        className="absolute bg-transparent p-0"
        style={{
          left: `${layout.title.x}px`,
          top: `${layout.title.y}px`,
          width: `${layout.title.width}px`,
          textAlign: titleAlign,
          cursor: interactive ? "move" : "default",
        }}
      >
        <div className="relative">
          <h1
            className="whitespace-pre-line break-words"
            style={{
              color: titleColor,
              fontFamily: titleFont.family,
              fontSize: `${layout.title.fontSize ?? 84}px`,
              lineHeight: 0.92,
              textAlign: titleAlign,
            }}
          >
            {titleText}
          </h1>
          {renderSelection("title")}
          {renderHandle("title")}
        </div>
      </button>

      <button
        type="button"
        onPointerDown={(event) => onPointerDownElement?.(event, "description", "move")}
        onClick={() => onSelectElement?.("description")}
        className="absolute bg-transparent p-0"
        style={{
          left: `${layout.description.x}px`,
          top: `${layout.description.y}px`,
          width: `${layout.description.width}px`,
          textAlign: descriptionAlign,
          cursor: interactive ? "move" : "default",
        }}
      >
        <div className="relative">
          <p
            className="whitespace-pre-line break-words"
            style={{
              color: descriptionColor,
              fontFamily: descriptionFont.family,
              fontSize: `${layout.description.fontSize ?? 32}px`,
              lineHeight: 1.42,
              textAlign: descriptionAlign,
            }}
          >
            {descriptionText}
          </p>
          {renderSelection("description")}
          {renderHandle("description")}
        </div>
      </button>

      <button
        type="button"
        onPointerDown={(event) => onPointerDownElement?.(event, "qr", "move")}
        onClick={() => onSelectElement?.("qr")}
        className="absolute bg-transparent p-0"
        style={{
          left: `${layout.qr.x}px`,
          top: `${layout.qr.y}px`,
          width: `${layout.qr.width}px`,
          cursor: interactive ? "move" : "default",
        }}
      >
        <div className="relative rounded-[18px] bg-white p-[9%]">
          {qrImageUrl ? (
            <img src={qrImageUrl} alt="QR" className="w-full object-contain" />
          ) : (
            <div className="flex aspect-square w-full items-center justify-center rounded-[12px] bg-[#f8fafc] text-slate-400">
              <QrCode className="h-[28%] w-[28%]" />
            </div>
          )}
          {renderSelection("qr", "rounded-[18px]")}
          {renderHandle("qr")}
        </div>
      </button>

      {logoImageUrl ? (
        <button
          type="button"
          onPointerDown={(event) => onPointerDownElement?.(event, "logo", "move")}
          onClick={() => onSelectElement?.("logo")}
          className="absolute bg-transparent p-0"
          style={{
            left: `${layout.logo.x}px`,
            top: `${layout.logo.y}px`,
            width: `${layout.logo.width}px`,
            cursor: interactive ? "move" : "default",
          }}
        >
          <div className="relative">
            <img src={logoImageUrl} alt="Logo" className="w-full object-contain" />
            {renderSelection("logo")}
            {renderHandle("logo")}
          </div>
        </button>
      ) : null}
    </div>
  );
};

const TemplateCreator = () => {
  const { toast } = useToast();
  const previewAreaRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window === "undefined" ? true : window.innerWidth >= 1024,
  );

  const [format, setFormat] = useState<TemplateFormat>("custom");
  const [customWidthCm, setCustomWidthCm] = useState("29.7");
  const [customHeightCm, setCustomHeightCm] = useState("42");

  const [titleFontId, setTitleFontId] = useState("parisienne");
  const [descriptionFontId, setDescriptionFontId] = useState("system");
  const [eventName, setEventName] = useState("David y María");
  const [description, setDescription] = useState(DEFAULT_DESCRIPTION);

  const [titleColor, setTitleColor] = useState("#5e804b");
  const [descriptionColor, setDescriptionColor] = useState("#5b5b5b");
  const [titleAlign, setTitleAlign] = useState<AlignMode>("center");
  const [descriptionAlign, setDescriptionAlign] = useState<AlignMode>("center");

  const [backgroundMode, setBackgroundMode] = useState<BackgroundMode>("solid");
  const [gradientType, setGradientType] = useState<GradientType>("linear");
  const [backgroundColorA, setBackgroundColorA] = useState("#f2ddb2");
  const [backgroundColorB, setBackgroundColorB] = useState("#ead29e");
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string | null>(null);

  const [qrImageUrl, setQrImageUrl] = useState<string | null>(null);
  const [logoImageUrl, setLogoImageUrl] = useState<string | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState(PRESET_TEMPLATES[0].id);
  const [selectedElement, setSelectedElement] = useState<SelectionKey | null>("title");
  const [layout, setLayout] = useState<Record<BaseElementKey, EditableElement>>(() =>
    buildDefaultLayout(Math.round(29.7 * CM_TO_PX), Math.round(42 * CM_TO_PX)),
  );
  const [decorativeElements, setDecorativeElements] = useState<DecorativeElement[]>([]);
  const [previewScale, setPreviewScale] = useState(0.18);
  const [gesture, setGesture] = useState<ActiveGesture | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const widthCm = useMemo(() => {
    if (format !== "custom") return FORMAT_CONFIG[format].widthCm;
    const parsed = Number(customWidthCm);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 20;
  }, [customWidthCm, format]);

  const heightCm = useMemo(() => {
    if (format !== "custom") return FORMAT_CONFIG[format].heightCm;
    const parsed = Number(customHeightCm);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 20;
  }, [customHeightCm, format]);

  const canvasWidth = Math.round(widthCm * CM_TO_PX);
  const canvasHeight = Math.round(heightCm * CM_TO_PX);
  const backgroundCss =
    backgroundMode === "solid"
      ? backgroundColorA
      : backgroundMode === "gradient"
        ? getGradientCss(gradientType, backgroundColorA, backgroundColorB)
        : backgroundColorA;
  const activeTitleFont = FONT_OPTIONS.find((font) => font.id === titleFontId) ?? FONT_OPTIONS[0];
  const activeDescriptionFont =
    FONT_OPTIONS.find((font) => font.id === descriptionFontId) ?? FONT_OPTIONS[0];

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    FONT_OPTIONS.forEach((font) => {
      if (!font.googleHref) return;
      const id = `font-${font.id}`;
      if (document.getElementById(id)) return;
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href = font.googleHref;
      document.head.appendChild(link);
    });
  }, []);

  useEffect(() => {
    setLayout(buildDefaultLayout(canvasWidth, canvasHeight));
    setDecorativeElements((current) =>
      current.map((item) => ({
        ...item,
        x: Math.min(item.x, canvasWidth - item.width),
        y: Math.min(item.y, canvasHeight - item.width),
      })),
    );
  }, [canvasHeight, canvasWidth]);

  useEffect(() => {
    if (!previewAreaRef.current) return;

    const updateScale = () => {
      if (!previewAreaRef.current) return;
      const bounds = previewAreaRef.current.getBoundingClientRect();
      const maxWidth = bounds.width - 32;
      const maxHeight = bounds.height - 32;
      const scale = Math.min(maxWidth / canvasWidth, maxHeight / canvasHeight, 1);
      setPreviewScale(scale);
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(previewAreaRef.current);
    window.addEventListener("resize", updateScale);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateScale);
    };
  }, [canvasHeight, canvasWidth]);

  useEffect(() => {
    if (!gesture) return;

    const handlePointerMove = (event: PointerEvent) => {
      const dx = (event.clientX - gesture.startX) / previewScale;
      const dy = (event.clientY - gesture.startY) / previewScale;

      if (isDecorativeSelection(gesture.key)) {
        const decorId = gesture.key.replace("decor-", "");
        setDecorativeElements((current) =>
          current.map((item) => {
            if (item.id !== decorId) return item;
            if (gesture.mode === "move") {
              return {
                ...item,
                x: (gesture.origin as DecorativeElement).x + dx,
                y: (gesture.origin as DecorativeElement).y + dy,
              };
            }

            return {
              ...item,
              width: Math.max(1, (gesture.origin as DecorativeElement).width + dx),
            };
          }),
        );
        return;
      }

      setLayout((current) => {
        const next = { ...current };
        const element = next[gesture.key];

        if (gesture.mode === "move") {
          element.x = (gesture.origin as EditableElement).x + dx;
          element.y = (gesture.origin as EditableElement).y + dy;
        } else if (gesture.key === "title" || gesture.key === "description") {
          element.width = Math.max(1, (gesture.origin as EditableElement).width + dx);
          element.fontSize = Math.max(1, ((gesture.origin as EditableElement).fontSize ?? 32) + dy * 0.18);
        } else {
          element.width = Math.max(1, (gesture.origin as EditableElement).width + dx);
        }

        return next;
      });
    };

    const handlePointerUp = () => setGesture(null);

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [gesture, previewScale]);

  const handlePointerDownElement = (
    event: ReactPointerEvent,
    key: SelectionKey,
    mode: "move" | "resize",
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedElement(key);

    const origin = isDecorativeSelection(key)
      ? decorativeElements.find((item) => item.id === key.replace("decor-", ""))
      : layout[key];

    if (!origin) return;

    setGesture({
      key,
      mode,
      startX: event.clientX,
      startY: event.clientY,
      origin: { ...origin },
    });
  };

  const handleImagePick = async (
    event: ChangeEvent<HTMLInputElement>,
    target: "qr" | "logo",
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await readFileAsDataUrl(file);
      if (target === "qr") setQrImageUrl(dataUrl);
      if (target === "logo") setLogoImageUrl(dataUrl);
    } catch {
      toast({
        title: "No se pudo cargar la imagen",
        description: "Prueba con otro archivo en PNG o JPG.",
        variant: "destructive",
      });
    } finally {
      event.target.value = "";
    }
  };

  const handlePresetChange = (presetId: string) => {
    const preset = PRESET_TEMPLATES.find((item) => item.id === presetId);
    if (!preset) return;
    setSelectedPresetId(preset.id);
    setTitleFontId(preset.titleFontId);
    setDescriptionFontId(preset.descriptionFontId);
    setTitleColor(preset.titleColor);
    setDescriptionColor(preset.descriptionColor);
    setTitleAlign(preset.titleAlign);
    setDescriptionAlign(preset.descriptionAlign);
    setBackgroundMode(preset.backgroundMode);
    setGradientType(preset.gradientType);
    setBackgroundColorA(preset.backgroundColorA);
    setBackgroundColorB(preset.backgroundColorB);
  };

  const handleDecorativeUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    try {
      const uploaded = await Promise.all(files.map((file) => readFileAsDataUrl(file)));
      setDecorativeElements((current) => {
        const next = [...current];
        uploaded.forEach((src, index) => {
          next.push({
            id: `upload-${Date.now()}-${index}`,
            src,
            x: canvasWidth * 0.08 + index * 24,
            y: canvasHeight * 0.08 + (current.length + index) * 24,
            width: Math.max(90, canvasWidth * 0.12),
          });
        });
        return next;
      });
    } catch {
      toast({
        title: "No se pudieron cargar los elementos",
        description: "Prueba con imágenes PNG, SVG o JPG.",
        variant: "destructive",
      });
    } finally {
      event.target.value = "";
    }
  };

  const handleBackgroundImagePick = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setBackgroundImageUrl(dataUrl);
      setBackgroundMode("image");
    } catch {
      toast({
        title: "No se pudo cargar la imagen de fondo",
        description: "Prueba con un archivo PNG o JPG.",
        variant: "destructive",
      });
    } finally {
      event.target.value = "";
    }
  };

  const handleExport = async () => {
    if (!exportRef.current) return;
    setIsExporting(true);

    try {
      await document.fonts.ready;
      const canvas = await html2canvas(exportRef.current, {
        backgroundColor: null,
        scale: 1,
        useCORS: true,
        width: canvasWidth,
        height: canvasHeight,
      });

      const imageData = canvas.toDataURL("image/jpeg", 0.92);

      const pdf = new jsPDF({
        orientation: widthCm > heightCm ? "landscape" : "portrait",
        unit: "mm",
        format: [widthCm * 10, heightCm * 10],
        compress: true,
      });

      pdf.addImage(imageData, "JPEG", 0, 0, widthCm * 10, heightCm * 10, undefined, "FAST");
      pdf.save(`plantilla-${format}.pdf`);

      toast({
        title: "Exportación completada",
        description: "Se ha descargado un PDF igual a la previsualización.",
      });
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast({
        title: "No se pudo exportar",
        description: "Revisa el QR o el logo adjunto e inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  if (!isDesktop) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-[#f2f1ed] px-6 py-12">
        <Card className="w-full max-w-xl border-white/70 bg-white/95 p-8 text-center shadow-[0_24px_80px_-42px_rgba(15,23,42,0.45)]">
          <p className="text-2xl font-semibold text-slate-900">Creador de plantillas</p>
          <p className="mt-4 text-base leading-7 text-slate-600">
            El creador de plantillas de Revelao solo esta disponible en ordenador.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] overflow-hidden bg-[#f2f1ed] px-4 py-4 md:px-6">
      <div className="mx-auto grid h-full max-w-[1760px] grid-cols-1 gap-6 lg:grid-cols-[520px_1fr]">
        <Card className="h-full min-h-0 overflow-y-auto border-white/70 bg-white/92 p-5 shadow-[0_24px_80px_-42px_rgba(15,23,42,0.45)]">
          <div className="space-y-6 pr-1">
            <div className="space-y-2">
              <Label>Formato</Label>
              <Select value={format} onValueChange={(value) => setFormat(value as TemplateFormat)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(FORMAT_CONFIG).map(([value, config]) => (
                    <SelectItem key={value} value={value}>
                      {config.label}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">Personalizar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {format === "custom" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="custom-width">Ancho en cm</Label>
                  <Input id="custom-width" value={customWidthCm} onChange={(e) => setCustomWidthCm(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="custom-height">Largo en cm</Label>
                  <Input id="custom-height" value={customHeightCm} onChange={(e) => setCustomHeightCm(e.target.value)} />
                </div>
              </div>
            )}

            <div className="rounded-3xl border border-[#e8ddcd] bg-[#fbf7ef] p-4 space-y-4">
              <p className="text-sm font-semibold text-slate-900">Plantillas predefinidas</p>
              <div className="space-y-2">
                <Label>Elegir plantilla</Label>
                <Select value={selectedPresetId} onValueChange={handlePresetChange}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PRESET_TEMPLATES.map((preset) => (
                      <SelectItem key={preset.id} value={preset.id}>
                        {preset.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-3xl border border-[#e8ddcd] bg-[#fbf7ef] p-4 space-y-4">
              <p className="text-sm font-semibold text-slate-900">Título</p>
              <div className="space-y-2">
                <Label htmlFor="event-name">Texto</Label>
                <Input id="event-name" value={eventName} onChange={(e) => setEventName(e.target.value)} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Tipografía</Label>
                  <Select value={titleFontId} onValueChange={setTitleFontId}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {FONT_OPTIONS.map((font) => (
                        <SelectItem key={font.id} value={font.id}>
                          <span style={{ fontFamily: font.family }}>{font.label}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Color</Label>
                  <div className="flex items-center gap-3 rounded-2xl border border-[#e8ddcd] bg-white px-3 py-2">
                    <input type="color" value={titleColor} onChange={(e) => setTitleColor(e.target.value)} className="h-10 w-14 rounded border-none bg-transparent p-0" />
                    <span className="text-sm text-slate-600">{titleColor}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Alineamiento</Label>
                <Select value={titleAlign} onValueChange={(value) => setTitleAlign(value as AlignMode)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ALIGN_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-3xl border border-[#e8ddcd] bg-[#fbf7ef] p-4 space-y-4">
              <p className="text-sm font-semibold text-slate-900">Descripción</p>
              <div className="space-y-2">
                <Label htmlFor="description">Texto</Label>
                <Textarea id="description" rows={6} value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Tipografía</Label>
                  <Select value={descriptionFontId} onValueChange={setDescriptionFontId}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {FONT_OPTIONS.map((font) => (
                        <SelectItem key={font.id} value={font.id}>
                          <span style={{ fontFamily: font.family }}>{font.label}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Color</Label>
                  <div className="flex items-center gap-3 rounded-2xl border border-[#e8ddcd] bg-white px-3 py-2">
                    <input type="color" value={descriptionColor} onChange={(e) => setDescriptionColor(e.target.value)} className="h-10 w-14 rounded border-none bg-transparent p-0" />
                    <span className="text-sm text-slate-600">{descriptionColor}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Alineamiento</Label>
                <Select value={descriptionAlign} onValueChange={(value) => setDescriptionAlign(value as AlignMode)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ALIGN_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-3xl border border-[#e8ddcd] bg-[#fbf7ef] p-4 space-y-4">
              <p className="text-sm font-semibold text-slate-900">Fondo</p>
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select value={backgroundMode} onValueChange={(value) => setBackgroundMode(value as BackgroundMode)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solid">Sólido</SelectItem>
                    <SelectItem value="gradient">Degradado</SelectItem>
                    <SelectItem value="image">Imagen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {backgroundMode === "gradient" && (
                <div className="space-y-2">
                  <Label>Tipo de degradado</Label>
                  <Select value={gradientType} onValueChange={(value) => setGradientType(value as GradientType)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {GRADIENT_TYPE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>{backgroundMode === "solid" ? "Color" : "Color 1"}</Label>
                  <div className="flex items-center gap-3 rounded-2xl border border-[#e8ddcd] bg-white px-3 py-2">
                    <input type="color" value={backgroundColorA} onChange={(e) => setBackgroundColorA(e.target.value)} className="h-10 w-14 rounded border-none bg-transparent p-0" />
                    <span className="text-sm text-slate-600">{backgroundColorA}</span>
                  </div>
                </div>
                {backgroundMode === "gradient" && (
                  <div className="space-y-2">
                    <Label>Color 2</Label>
                    <div className="flex items-center gap-3 rounded-2xl border border-[#e8ddcd] bg-white px-3 py-2">
                      <input type="color" value={backgroundColorB} onChange={(e) => setBackgroundColorB(e.target.value)} className="h-10 w-14 rounded border-none bg-transparent p-0" />
                      <span className="text-sm text-slate-600">{backgroundColorB}</span>
                    </div>
                  </div>
                )}
              </div>
              {backgroundMode === "image" && (
                <div className="space-y-2">
                  <Label htmlFor="background-upload">Imagen de fondo</Label>
                  <label
                    htmlFor="background-upload"
                    className="flex min-h-[116px] cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-[#d8ccb8] bg-white px-4 text-center text-sm text-slate-500 transition hover:border-[#bba17d] hover:bg-[#f7f0e4]"
                  >
                    <ImagePlus className="mb-2 h-5 w-5" />
                    {backgroundImageUrl ? "Cambiar imagen de fondo" : "Subir imagen de fondo"}
                  </label>
                  <Input
                    id="background-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => void handleBackgroundImagePick(e)}
                  />
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-[#e8ddcd] bg-[#fbf7ef] p-4 space-y-4">
              <p className="text-sm font-semibold text-slate-900">QR, Logo</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="qr-upload">Adjuntar código QR</Label>
                  <label htmlFor="qr-upload" className="flex min-h-[116px] cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-[#d8ccb8] bg-white px-4 text-center text-sm text-slate-500 transition hover:border-[#bba17d] hover:bg-[#f7f0e4]">
                    <QrCode className="mb-2 h-5 w-5" />
                    {qrImageUrl ? "Cambiar QR adjunto" : "Adjuntar QR"}
                  </label>
                  <Input id="qr-upload" type="file" accept="image/*" className="hidden" onChange={(e) => void handleImagePick(e, "qr")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logo-upload">Logo</Label>
                  <label htmlFor="logo-upload" className="flex min-h-[116px] cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-[#d8ccb8] bg-white px-4 text-center text-sm text-slate-500 transition hover:border-[#bba17d] hover:bg-[#f7f0e4]">
                    <ImagePlus className="mb-2 h-5 w-5" />
                    {logoImageUrl ? "Cambiar logo adjunto" : "Usar logo propio"}
                  </label>
                  <Input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={(e) => void handleImagePick(e, "logo")} />
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-[#e8ddcd] bg-[#fbf7ef] p-4 space-y-4">
              <p className="text-sm font-semibold text-slate-900">Añadir elementos</p>
              <label
                htmlFor="decor-upload"
                className="flex min-h-[116px] cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-[#d8ccb8] bg-white px-4 text-center text-sm text-slate-500 transition hover:border-[#bba17d] hover:bg-[#f7f0e4]"
              >
                <Upload className="mb-2 h-5 w-5" />
                Subir uno o varios elementos
              </label>
              <Input
                id="decor-upload"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => void handleDecorativeUpload(e)}
              />
              <p className="text-sm text-slate-600">
                Puedes subir varios archivos y luego moverlos y redimensionarlos desde la visualización.
              </p>
            </div>

            <Button className="w-full rounded-full bg-[#111827] text-white hover:bg-[#1f2937]" onClick={() => void handleExport()} disabled={isExporting}>
              <Download className="mr-2 h-4 w-4" />
              {isExporting ? "Exportando..." : "Exportar en PDF"}
            </Button>
          </div>
        </Card>

        <Card className="h-full min-h-0 overflow-hidden border-white/70 bg-[#f3f3f1] p-5 shadow-[0_20px_80px_-48px_rgba(15,23,42,0.35)]">
          <div ref={previewAreaRef} className="flex h-full items-center justify-center rounded-[28px] bg-[#ececeb] p-4">
            <div
              style={{
                width: `${canvasWidth * previewScale}px`,
                height: `${canvasHeight * previewScale}px`,
              }}
            >
              <div
                style={{
                  transform: `scale(${previewScale})`,
                  transformOrigin: "top left",
                  width: `${canvasWidth}px`,
                  height: `${canvasHeight}px`,
                }}
              >
                <PosterCanvas
                  canvasWidth={canvasWidth}
                  canvasHeight={canvasHeight}
                  backgroundCss={backgroundCss}
                  backgroundImageUrl={backgroundMode === "image" ? backgroundImageUrl : null}
                  titleText={eventName}
                  descriptionText={description}
                  titleFont={activeTitleFont}
                  descriptionFont={activeDescriptionFont}
                  titleColor={titleColor}
                  descriptionColor={descriptionColor}
                  titleAlign={titleAlign}
                  descriptionAlign={descriptionAlign}
                  qrImageUrl={qrImageUrl}
                  logoImageUrl={logoImageUrl}
                  layout={layout}
                  decorativeElements={decorativeElements}
                  selectedElement={selectedElement}
                  onSelectElement={setSelectedElement}
                  onPointerDownElement={handlePointerDownElement}
                  interactive
                />
              </div>
            </div>
          </div>
        </Card>

      </div>

      <div className="pointer-events-none fixed left-[-10000px] top-0 opacity-0">
        <div
          ref={exportRef}
          style={{
            width: `${canvasWidth}px`,
            height: `${canvasHeight}px`,
            overflow: "hidden",
            lineHeight: 0,
          }}
        >
          <PosterCanvas
            canvasWidth={canvasWidth}
            canvasHeight={canvasHeight}
            backgroundCss={backgroundCss}
            backgroundImageUrl={backgroundMode === "image" ? backgroundImageUrl : null}
            titleText={eventName}
            descriptionText={description}
            titleFont={activeTitleFont}
            descriptionFont={activeDescriptionFont}
            titleColor={titleColor}
            descriptionColor={descriptionColor}
            titleAlign={titleAlign}
            descriptionAlign={descriptionAlign}
            qrImageUrl={qrImageUrl}
            logoImageUrl={logoImageUrl}
            layout={layout}
            decorativeElements={decorativeElements}
            selectedElement={null}
          />
        </div>
      </div>
    </div>
  );
};

export default TemplateCreator;
