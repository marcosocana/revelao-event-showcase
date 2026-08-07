import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const rootDir = process.cwd();
const distDir = path.join(rootDir, "dist");
const templatePath = path.join(distDir, "index.html");
const siteUrl = "https://www.revelao.cam";
const captainsSeoPages = JSON.parse(
  fs.readFileSync(path.join(rootDir, "src/data/captainsSeoPages.json"), "utf8"),
);
const blogSlugAliases = {
  "cdigos-qr-para-bodas-qu-son-y-por-qu-cada-vez-ms-parejas-los-usan":
    "codigos-qr-para-bodas-que-son-y-por-que-cada-vez-mas-parejas-los-usan",
  "15-ideas-originales-para-bodas-en-espaa-que-sorprendern-a-tus-invitados":
    "15-ideas-originales-para-bodas-en-espana-que-sorprenderan-a-tus-invitados",
  "tendencias-en-bodas-en-espaa-2026-tecnologa-emocin-y-experiencias-compartidas":
    "tendencias-bodas-espana-2026-tecnologia-emocion-experiencias-compartidas",
  "cmo-recoger-las-fotos-de-todos-los-invitados-en-tu-boda-sin-perseguir-a-nadie":
    "como-recoger-fotos-invitados-boda-sin-perseguir-a-nadie",
  "cmo-recoger-todas-las-fotos-de-tu-boda-sin-whatsapp-gua-2026":
    "como-recoger-fotos-boda-sin-whatsapp-guia-2026",
};

const getCanonicalBlogSlug = (slug) => blogSlugAliases[slug] || slug;

const loadEnvFile = (filePath) => {
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) continue;
    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
};

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const stripHtml = (value = "") => value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
const isRemoteImage = (value = "") => /^https?:\/\//.test(value);
const isLocalImage = (value = "") => value.startsWith("/");
const isIndexableImage = (value = "") => isRemoteImage(value) || isLocalImage(value);

const getAbsoluteImage = (value = "") => {
  if (!isIndexableImage(value)) return `${siteUrl}/og-image.jpg`;
  return isRemoteImage(value) ? value : `${siteUrl}${value}`;
};

const sanitizeBlogHtml = (value = "") =>
  value.replace(/<img\b[^>]*\bsrc=["']data:[^"']+["'][^>]*>/gi, "");

const toIsoDate = (value) => {
  if (!value) return new Date().toISOString().slice(0, 10);
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return new Date().toISOString().slice(0, 10);
  return date.toISOString().slice(0, 10);
};

const parseScalar = (value) => {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    try {
      return JSON.parse(trimmed.replaceAll("'", '"'));
    } catch {
      return trimmed
        .slice(1, -1)
        .split(",")
        .map((item) => item.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
    }
  }
  return trimmed;
};

const parseFrontmatter = (raw) => {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return null;
  const meta = {};
  for (const line of match[1].split(/\r?\n/)) {
    if (!line.trim()) continue;
    const keyMatch = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (!keyMatch) continue;
    meta[keyMatch[1]] = parseScalar(keyMatch[2]);
  }
  return { meta, markdown: match[2].trim() };
};

const renderInlineMarkdown = (value) => {
  let html = escapeHtml(value);
  html = html.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    '<img src="$2" alt="$1" loading="lazy" decoding="async" />',
  );
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  return html;
};

const markdownToHtml = (markdown) =>
  markdown
    .split(/\n{2,}/)
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      const lines = trimmed.split(/\r?\n/);
      const heading = trimmed.match(/^(#{1,3})\s+(.+)$/);
      if (heading) return `<h${heading[1].length}>${renderInlineMarkdown(heading[2])}</h${heading[1].length}>`;
      if (lines.every((line) => /^\s*[-*]\s+/.test(line))) {
        return `<ul>${lines
          .map((line) => `<li>${renderInlineMarkdown(line.replace(/^\s*[-*]\s+/, ""))}</li>`)
          .join("")}</ul>`;
      }
      return `<p>${renderInlineMarkdown(lines.join(" "))}</p>`;
    })
    .filter(Boolean)
    .join("\n");

const setTag = (html, pattern, replacement) =>
  pattern.test(html) ? html.replace(pattern, replacement) : html.replace("</head>", `${replacement}\n  </head>`);

const renderPage = (template, page) => {
  const canonical = page.canonical || `${siteUrl}${page.path === "/" ? "/" : page.path}`;
  const image = getAbsoluteImage(page.image);
  const jsonLd = JSON.stringify(page.schema);
  const lang = page.lang || "es";
  const robots = page.robots || "index, follow";
  const alternates = (page.alternates || [])
    .map(
      ({ hreflang, href }) =>
        `<link rel="alternate" hreflang="${escapeHtml(hreflang)}" href="${escapeHtml(href)}" />`,
    )
    .join("\n  ");
  let html = template;
  html = html.replace(/<html lang="[^"]*">/, `<html lang="${escapeHtml(lang)}">`);
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(page.title)}</title>`);
  html = setTag(html, /<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${escapeHtml(page.description)}" />`);
  html = setTag(html, /<meta name="keywords" content="[^"]*" \/>/, `<meta name="keywords" content="${escapeHtml(page.keywords || "")}" />`);
  html = setTag(html, /<meta name="robots" content="[^"]*" \/>/, `<meta name="robots" content="${escapeHtml(robots)}" />`);
  html = setTag(html, /<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${canonical}" />`);
  if (alternates) {
    html = html.replace("</head>", `  ${alternates}\n  </head>`);
  }
  html = setTag(html, /<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${escapeHtml(page.title)}" />`);
  html = setTag(html, /<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${escapeHtml(page.description)}" />`);
  html = setTag(html, /<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${canonical}" />`);
  html = setTag(html, /<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="${image}" />`);
  html = setTag(html, /<meta property="og:type" content="[^"]*" \/>/, `<meta property="og:type" content="${escapeHtml(page.ogType || "website")}" />`);
  html = setTag(html, /<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${escapeHtml(page.title)}" />`);
  html = setTag(html, /<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${escapeHtml(page.description)}" />`);
  html = setTag(html, /<meta name="twitter:image" content="[^"]*" \/>/, `<meta name="twitter:image" content="${image}" />`);
  html = html.replace(
    "</head>",
    `  <script type="application/ld+json">${jsonLd.replaceAll("</", "<\\/")}</script>\n  </head>`,
  );
  html = html.replace('<div id="root"></div>', `<div id="root">${page.bodyHtml}</div>`);
  return html;
};

const writePage = (template, page) => {
  const html = renderPage(template, page);
  const outputPath =
    page.path === "/"
      ? path.join(distDir, "index.html")
      : path.join(distDir, page.path.replace(/^\//, ""), "index.html");
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, html);
};

const baseSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Revelao.cam",
  url: siteUrl,
  logo: `${siteUrl}/favicon.ico`,
};

const qrLandingAlternates = [
  { hreflang: "es", href: `${siteUrl}/evento-qr` },
  { hreflang: "en", href: `${siteUrl}/en/qr-event` },
  { hreflang: "it", href: `${siteUrl}/it/evento-qr` },
  { hreflang: "x-default", href: `${siteUrl}/evento-qr` },
];

const homeAlternates = [
  { hreflang: "es", href: `${siteUrl}/` },
  { hreflang: "en", href: `${siteUrl}/en/qr-event` },
  { hreflang: "it", href: `${siteUrl}/it/evento-qr` },
  { hreflang: "x-default", href: `${siteUrl}/` },
];

const landingPages = [
  {
    path: "/",
    alternates: homeAlternates,
    title: "QR para bodas y eventos: fotos, vídeos y audios sin app | Revelao.cam",
    description:
      "Crea una galería privada con QR para tu boda o evento. Tus invitados suben fotos, vídeos y mensajes de audio sin app y todo se revela después.",
    keywords: "qr boda, fotos boda qr, galeria privada boda, compartir fotos boda, subir fotos boda sin app",
    image: "/og-image.jpg",
    bodyHtml:
      "<main><article><h1>QR para bodas y eventos con fotos, vídeos y audios sin app</h1>" +
      "<p>Revelao.cam crea una galería privada para que los invitados suban recuerdos desde el móvil escaneando un QR. La experiencia está pensada para bodas, fiestas y eventos donde quieres reunir fotos espontáneas, vídeos cortos y mensajes de audio sin pedir a nadie que instale una app.</p>" +
      "<p>El problema habitual no es que los invitados no hagan fotos. El problema es que esas fotos se quedan repartidas en móviles, chats de WhatsApp, carpetas incompletas o mensajes enviados días después. Con un QR visible durante el evento, cada recuerdo puede llegar a un único espacio privado cuando todavía está ocurriendo la celebración.</p>" +
      "<h2>Especialmente pensado para bodas</h2><p>En una boda pasan cientos de momentos que los novios no pueden ver en directo: una mesa riéndose, un vídeo en la barra, una felicitación de audio, una escena divertida en la pista o un abrazo antes del baile. Revelao ayuda a guardar esas miradas de los invitados junto al reportaje profesional.</p>" +
      "<h2>Cómo funciona Revelao</h2><p>Creas el evento, compartes el QR en carteles, tarjetas o invitaciones y los invitados suben contenido desde el navegador del móvil. No hay descargas, registros largos ni instrucciones complicadas. Todo queda centralizado en una galería privada preparada para revivir el evento después.</p>" +
      "<h2>Por qué usar una galería privada con QR</h2><p>Una galería privada evita que los recuerdos importantes se mezclen con conversaciones. También permite reunir fotos, vídeos y audios en un entorno más ordenado que un grupo de WhatsApp o una carpeta genérica. Para la pareja, el valor está en descubrir el evento desde muchas perspectivas sin tener que perseguir archivos.</p>" +
      "<h2>Ideas para conseguir más participación</h2><p>Coloca el QR en la entrada, las mesas, la barra, el photocall y la zona de baile. Acompáñalo con frases cortas como “Sube tus fotos de la boda” o “Déjanos un recuerdo para el revelado”. Cuanto más natural sea encontrarlo, más contenido subirán los invitados.</p>" +
      '<p><a href="https://acceso.revelao.cam/nuevoeventodemo2">Crear mi evento con QR</a></p></article></main>',
    schema: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Revelao.cam",
      url: siteUrl,
      publisher: baseSchema,
    },
  },
  {
    path: "/quienes-somos",
    title: "Quiénes somos: Marcos, fundador de Revelao.cam",
    description:
      "Conoce a Marcos, fundador de Revelao.cam, y la idea detrás de una forma diferente de reunir y revelar los recuerdos de un evento.",
    keywords: "quienes somos Revelao, Marcos fundador Revelao, historia Revelao.cam",
    image: "/og-image.jpg",
    bodyHtml:
      "<main><article><h1>Soy Marcos, la persona detrás de Revelao</h1>" +
      "<p>Creé Revelao.cam para que las fotos, vídeos y mensajes de audio de los invitados no terminen perdidos en sus móviles y para que descubrirlos también forme parte de la celebración.</p>" +
      "<h2>Por qué existe Revelao</h2><p>Un evento sucede desde muchos puntos de vista. Revelao reúne esas miradas mediante un QR, sin apps ni registros para los invitados, y mantiene el contenido oculto hasta el momento del Revelado.</p>" +
      "<h2>Cómo construimos el producto</h2><p>La experiencia se diseña para que participar sea fácil, los recuerdos estén bien cuidados y la espera añada emoción al día siguiente del evento.</p>" +
      '<p><a href="mailto:revelao.cam@gmail.com">Contactar con Marcos</a></p></article></main>',
    schema: {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: "Quiénes somos en Revelao.cam",
      url: `${siteUrl}/quienes-somos`,
      mainEntity: baseSchema,
    },
  },
  {
    path: "/kit-de-prensa",
    title: "Kit de prensa de Revelao.cam: logos y recursos",
    description:
      "Descarga logos y consulta la descripción oficial, datos básicos y recursos de prensa de Revelao.cam.",
    keywords: "kit de prensa Revelao, logo Revelao, recursos de marca Revelao.cam",
    image: "/og-image.jpg",
    bodyHtml:
      "<main><article><h1>Kit de prensa de Revelao.cam</h1>" +
      "<p>Recursos visuales, información y mensajes oficiales para hablar de Revelao.cam de forma clara y consistente.</p>" +
      "<h2>Qué es Revelao.cam</h2><p>Revelao.cam es una galería privada para eventos a la que los invitados acceden mediante un QR. Pueden subir fotos, vídeos y mensajes de audio desde el navegador, sin instalar una app, y descubrirlo todo después en el Revelado.</p>" +
      "<h2>Recursos de marca</h2><p>La página incluye el logotipo principal, el logotipo compacto y el símbolo de Revelao listos para descargar.</p>" +
      '<p><a href="mailto:revelao.cam@gmail.com">Contacto de prensa</a></p></article></main>',
    schema: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Kit de prensa de Revelao.cam",
      url: `${siteUrl}/kit-de-prensa`,
      publisher: baseSchema,
    },
  },
  {
    path: "/plantillas-qr",
    title: "Plantillas QR personalizables para bodas y eventos | Revelao.cam",
    description:
      "Elige una plantilla QR para tu boda o evento, personaliza textos y colores y descárgala en PDF o pídenos que la imprimamos.",
    keywords: "plantillas qr, plantilla qr boda, cartel qr evento, tarjeta qr boda, imprimir qr evento",
    image: "/og-image.jpg",
    bodyHtml:
      '<main><article><h1>Plantillas QR personalizables para bodas y eventos</h1>' +
      '<p>Elige un diseño de Revelao, añade el QR exclusivo de tu evento y personaliza nombres, fecha, mensaje y colores viendo el resultado en directo.</p>' +
      '<h2>Descarga tu plantilla lista para imprimir</h2><p>Genera el diseño en PDF con medidas A6, A5 o A4 para utilizarlo en mesas, carteles, entradas o zonas de fotografía.</p>' +
      '<h2>También podemos imprimirla por ti</h2><p>Selecciona el formato y la cantidad y envía una solicitud de impresión directamente a Revelao.</p>' +
      '<p><a href="/plantillas-qr#catalogo-plantillas">Ver todas las plantillas QR</a></p></article></main>',
    schema: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Plantillas QR para eventos",
      url: `${siteUrl}/plantillas-qr`,
      publisher: baseSchema,
    },
  },
  {
    path: "/evento-qr",
    lang: "es",
    alternates: qrLandingAlternates,
    title: "Evento con QR para recopilar fotos, vídeos y audios | Revelao.cam",
    description:
      "Usa un QR en tu evento para que los invitados suban fotos, vídeos y mensajes de audio sin instalar apps.",
    keywords: "evento con QR, galeria para eventos con QR, compartir fotos sin app",
    image: "/og-image.jpg",
    bodyHtml:
      '<main><h1>Evento con QR para recopilar recuerdos</h1><p>Comparte un código QR y centraliza fotos, vídeos y audios de tus invitados en una galería privada.</p></main>',
    schema: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Evento con QR",
      url: `${siteUrl}/evento-qr`,
      publisher: baseSchema,
    },
  },
  {
    path: "/en/qr-event",
    lang: "en",
    alternates: qrLandingAlternates,
    title: "QR photo gallery for weddings and events | No app | Revelao.cam",
    description:
      "Create a collaborative QR photo gallery for weddings, parties or company events. Guests upload photos, videos and voice messages without an app.",
    keywords: "QR photo gallery, wedding photo sharing, event photos without app, wedding QR code",
    image: "/og-image.jpg",
    bodyHtml:
      '<main><article><h1>QR photo gallery for weddings and events</h1>' +
      '<p>Create your private event gallery, share its QR code and let every guest upload photos, videos and voice messages directly from their phone browser.</p>' +
      '<h2>No app and no complicated registration</h2><p>Guests scan the code, choose what they want to share and upload it in seconds. Everything stays together in one private space.</p>' +
      '<h2>Discover every memory after the event</h2><p>Content remains hidden during the celebration and is revealed afterwards, turning the gallery into a shared experience.</p>' +
      '<p><a href="https://acceso.revelao.cam/en/nuevoeventodemo2">Create a free test event</a></p></article></main>',
    schema: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "QR photo gallery for weddings and events",
      inLanguage: "en",
      url: `${siteUrl}/en/qr-event`,
      publisher: baseSchema,
    },
  },
  {
    path: "/it/evento-qr",
    lang: "it",
    alternates: qrLandingAlternates,
    title: "Galleria foto con QR per matrimoni ed eventi | Revelao.cam",
    description:
      "Crea una galleria collaborativa con QR per matrimoni, feste o eventi aziendali. Gli invitati caricano foto, video e messaggi vocali senza app.",
    keywords: "galleria foto QR, foto matrimonio QR, condividere foto evento senza app, codice QR matrimonio",
    image: "/og-image.jpg",
    bodyHtml:
      '<main><article><h1>Galleria foto con QR per matrimoni ed eventi</h1>' +
      '<p>Crea la galleria privata del tuo evento, condividi il codice QR e consenti a ogni invitato di caricare foto, video e messaggi vocali dal browser del telefono.</p>' +
      '<h2>Senza app e senza registrazioni complicate</h2><p>Gli invitati scansionano il codice, scelgono cosa condividere e lo caricano in pochi secondi. Tutto rimane ordinato in un unico spazio privato.</p>' +
      '<h2>Scopri ogni ricordo dopo l’evento</h2><p>Durante la festa i contenuti restano nascosti e vengono rivelati in seguito, trasformando la galleria in un’esperienza condivisa.</p>' +
      '<p><a href="https://acceso.revelao.cam/it/nuevoeventodemo2">Crea un evento di prova gratuito</a></p></article></main>',
    schema: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Galleria foto con QR per matrimoni ed eventi",
      inLanguage: "it",
      url: `${siteUrl}/it/evento-qr`,
      publisher: baseSchema,
    },
  },
  {
    path: "/capitanes",
    title: "Capitanes by Revelao: juego para bodas con retos por mesas",
    description:
      "Capitanes by Revelao convierte tu boda en un juego por mesas. 3€ por mesa, hasta 25 retos personalizables y configuración por enlace tras la compra.",
    keywords: "juego para bodas, retos por mesas boda, dinamica boda, juego boda invitados, capitanes revelao, precio juego boda",
    image: "/capitanes-logo.svg",
    bodyHtml:
      "<main><article><h1>Capitanes by Revelao</h1>" +
      "<p>Capitanes by Revelao es una dinámica para bodas donde cada mesa elige capitán, completa retos y compite en un ranking en directo.</p>" +
      "<p>Funciona con QR desde el móvil y recoge fotos y vídeos espontáneos de la cena, el photocall y la fiesta.</p>" +
      "<p>El precio es de 3€ por mesa e incluye hasta 25 retos personalizables al 100%. Tras la compra, recibirás por email un enlace para crear y configurar la partida.</p>" +
      "<h2>Ideas y recursos para organizar tus capitanes de mesa</h2><ul>" +
      captainsSeoPages.map((page) => `<li><a href="${page.path}">${escapeHtml(page.h1)}</a></li>`).join("") +
      "</ul>" +
      '<p><a href="https://acceso.revelao.cam/capitanes/demo-capitanes">Ver demo de Capitanes</a></p></article></main>',
    schema: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Capitanes by Revelao",
      url: `${siteUrl}/capitanes`,
      description: "Juego para bodas por mesas con capitanes, retos, pruebas, ranking y recuerdos en directo.",
      publisher: baseSchema,
    },
  },
];

const legalPages = [
  {
    path: "/privacy",
    title: "Política de privacidad | Revelao.cam",
    description: "Consulta cómo Revelao.cam trata, conserva y protege los datos personales y el contenido de los eventos.",
    h1: "Política de Privacidad",
    sections: [
      ["Responsable del tratamiento", "Revelao es responsable del tratamiento. Puedes contactar en revelao.cam@gmail.com."],
      ["Datos y finalidad", "Tratamos los datos necesarios para prestar el servicio y el contenido que los usuarios deciden subir a sus eventos."],
      ["Derechos del usuario", "Puedes solicitar acceso, rectificación o supresión escribiendo al correo de contacto."],
    ],
  },
  {
    path: "/terms",
    title: "Términos y condiciones | Revelao.cam",
    description: "Consulta las condiciones de contratación, uso, almacenamiento y responsabilidad aplicables al servicio Revelao.cam.",
    h1: "Términos y Condiciones",
    sections: [
      ["Uso del servicio", "El uso de Revelao está sujeto a estas condiciones y a la normativa aplicable."],
      ["Contenido y almacenamiento", "El usuario es responsable del contenido que publica y debe respetar los límites del plan contratado."],
      ["Contacto", "Para cualquier consulta sobre estas condiciones puedes escribir a revelao.cam@gmail.com."],
    ],
  },
  {
    path: "/cookies",
    title: "Política de cookies | Revelao.cam",
    description: "Información sobre las cookies técnicas y analíticas utilizadas por Revelao.cam y cómo configurar el consentimiento.",
    h1: "Política de Cookies",
    sections: [
      ["Qué son las cookies", "Las cookies son pequeños archivos que permiten recordar preferencias y prestar determinadas funciones."],
      ["Cookies utilizadas", "Revelao utiliza cookies técnicas y, con consentimiento, herramientas de medición y análisis."],
      ["Gestionar el consentimiento", "Puedes aceptar, rechazar o volver a configurar las cookies desde el enlace disponible en el pie de página."],
    ],
  },
  {
    path: "/devoluciones",
    title: "Política de devoluciones | Revelao.cam",
    description: "Consulta las condiciones de desistimiento, cancelación y devolución para servicios digitales y productos impresos de Revelao.",
    h1: "Política de devoluciones",
    sections: [
      ["Servicios digitales", "El derecho de desistimiento puede quedar limitado cuando la prestación digital haya comenzado con consentimiento previo."],
      ["Productos personalizados", "Los productos impresos personalizados no admiten devolución salvo defecto o incidencia imputable a la producción."],
      ["Solicitar una devolución", "Escribe a revelao.cam@gmail.com indicando el pedido y el motivo de la solicitud."],
    ],
  },
  {
    path: "/envios",
    title: "Política de envíos | Revelao.cam",
    description: "Información sobre producción, plazos, entrega y posibles incidencias de los productos impresos de Revelao.cam.",
    h1: "Política de envíos",
    sections: [
      ["Servicios digitales", "Los servicios digitales se entregan mediante acceso online y no requieren transporte físico."],
      ["Productos impresos", "Los plazos dependen del formato, la cantidad, la producción y la dirección de entrega."],
      ["Incidencias", "Comunica cualquier incidencia de transporte a revelao.cam@gmail.com para que podamos revisarla."],
    ],
  },
  {
    path: "/rgpd",
    title: "Información RGPD | Revelao.cam",
    description: "Información sobre el tratamiento de datos, las bases jurídicas y los derechos reconocidos por el RGPD en Revelao.cam.",
    h1: "Información RGPD",
    sections: [
      ["Quién trata los datos", "Revelao trata los datos necesarios para crear y gestionar eventos y prestar sus servicios."],
      ["Bases jurídicas y conservación", "Los tratamientos se basan en la ejecución del servicio, obligaciones legales o consentimiento, según corresponda."],
      ["Ejercicio de derechos", "Puedes ejercer tus derechos de protección de datos escribiendo a revelao.cam@gmail.com."],
    ],
  },
].map((page) => ({
  ...page,
  keywords: "Revelao, información legal, eventos",
  image: "/og-image.jpg",
  bodyHtml:
    `<main><article><h1>${escapeHtml(page.h1)}</h1>` +
    page.sections
      .map(([title, text]) => `<section><h2>${escapeHtml(title)}</h2><p>${escapeHtml(text)}</p></section>`)
      .join("") +
    '</article></main>',
  schema: {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.h1,
    url: `${siteUrl}${page.path}`,
    inLanguage: "es",
    publisher: baseSchema,
  },
}));

const testimonialsPage = {
  path: "/testimonios",
  title: "Testimonios y opiniones sobre Revelao | Revelao.cam",
  description:
    "Descubre experiencias reales de bodas y eventos que reunieron las fotos, vídeos y mensajes de sus invitados con Revelao.",
  keywords: "opiniones Revelao, testimonios Revelao, fotos invitados boda, QR boda opiniones",
  image: "/og-image.jpg",
  bodyHtml:
    '<main><article><h1>Momentos contados por quienes los vivieron</h1>' +
    '<p>Más de 300 experiencias de parejas, familias y equipos que reunieron las fotos, vídeos y voces de sus invitados en un solo lugar.</p>' +
    '<section><h2>Bodas</h2><p>Éramos casi 150 invitados y subieron más de 800 fotos. Al día siguiente pudimos descubrir momentos que no habíamos visto.</p></section>' +
    '<section><h2>Cumpleaños y celebraciones</h2><p>El QR hizo que todos participaran sin instalar aplicaciones ni registrarse.</p></section>' +
    '<section><h2>Eventos de empresa</h2><p>Las fotos, vídeos y audios quedaron reunidos en una galería privada y ordenada.</p></section>' +
    '<p><a href="https://acceso.revelao.cam/nuevoeventodemo2">Probar Revelao gratis</a></p></article></main>',
  schema: {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Testimonios y opiniones sobre Revelao",
    url: `${siteUrl}/testimonios`,
    inLanguage: "es",
    publisher: baseSchema,
  },
};

const nonIndexablePages = [
  ["/blog/admin", "Administración del blog"],
  ["/crearplantilla", "Editor de plantillas QR"],
  ["/entornodemo", "Entorno de demostración"],
  ["/pruebas", "Pruebas de Revelao"],
].map(([pagePath, title]) => ({
  path: pagePath,
  title: `${title} | Revelao.cam`,
  description: "Área funcional de Revelao.cam no destinada a resultados de búsqueda.",
  keywords: "",
  robots: "noindex, nofollow",
  image: "/og-image.jpg",
  bodyHtml: `<main><h1>${escapeHtml(title)}</h1><p>Cargando la aplicación de Revelao…</p></main>`,
  schema: {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    url: `${siteUrl}${pagePath}`,
  },
}));

const captainsPagesByPath = new Map(captainsSeoPages.map((page) => [page.path, page]));

const renderCaptainsPageBody = (page) => {
  const highlights = page.highlights.map((highlight) => `<li>${escapeHtml(highlight)}</li>`).join("");
  const sections = page.sections
    .map((section) => {
      const paragraphs = section.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");
      const items = section.items?.length
        ? `<div>${section.items.map((item) => `<article><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.text)}</p></article>`).join("")}</div>`
        : "";
      return `<section><h2>${escapeHtml(section.title)}</h2>${paragraphs}${items}</section>`;
    })
    .join("");
  const template = page.template
    ? `<section><h2>Ejemplo de tarjeta para capitán de mesa</h2><article><p>${escapeHtml(page.template.eyebrow)}</p><h3>${escapeHtml(page.template.title)}</h3><p>${escapeHtml(page.template.text)}</p></article></section>`
    : "";
  const faqs = page.faqs
    .map((faq) => `<article><h3>${escapeHtml(faq.question)}</h3><p>${escapeHtml(faq.answer)}</p></article>`)
    .join("");
  const related = page.related
    .map((relatedPath) => {
      const relatedPage = captainsPagesByPath.get(relatedPath);
      return relatedPage ? `<li><a href="${relatedPath}">${escapeHtml(relatedPage.h1)}</a></li>` : "";
    })
    .join("");

  return `<main><nav aria-label="Migas de pan"><a href="/">Inicio</a> &gt; <a href="/capitanes">Capitanes</a> &gt; <span>${escapeHtml(page.eyebrow)}</span></nav>` +
    `<article><header><p>${escapeHtml(page.eyebrow)}</p><h1>${escapeHtml(page.h1)}</h1><p>${escapeHtml(page.intro)}</p><ul>${highlights}</ul><p><a href="/capitanes#precios">${escapeHtml(page.ctaLabel)}</a></p></header>` +
    `${sections}${template}<section><h2>Preguntas frecuentes</h2>${faqs}</section>` +
    `<section><h2>Ideas y recursos relacionados</h2><ul>${related}</ul></section>` +
    `<section><h2>${escapeHtml(page.ctaTitle)}</h2><p>${escapeHtml(page.ctaText)}</p><p><a href="/capitanes#precios">${escapeHtml(page.ctaLabel)}</a></p></section>` +
    `</article></main>`;
};

const captainsClusterPages = captainsSeoPages.map((page) => {
  const canonicalUrl = `${siteUrl}${page.path}`;
  return {
    path: page.path,
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    image: "/capitanes-hero.png",
    bodyHtml: renderCaptainsPageBody(page),
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          name: page.h1,
          url: canonicalUrl,
          description: page.description,
          isPartOf: { "@type": "WebSite", name: "Revelao.cam", url: siteUrl },
          about: { "@type": "Product", name: "Capitanes by Revelao", url: `${siteUrl}/capitanes` },
          publisher: baseSchema,
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Inicio", item: `${siteUrl}/` },
            { "@type": "ListItem", position: 2, name: "Capitanes", item: `${siteUrl}/capitanes` },
            { "@type": "ListItem", position: 3, name: page.h1, item: canonicalUrl },
          ],
        },
        {
          "@type": "FAQPage",
          mainEntity: page.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        },
      ],
    },
  };
});

const useCasePages = [
  ["bodas", "QR para bodas: fotos, vídeos y audios de invitados", "Crea una galería privada para tu boda con QR. Los invitados suben fotos, vídeos y mensajes de audio sin app y lo descubrís en el revelado.", "qr boda, fotos boda qr, qr para fotos de boda, galeria privada boda"],
  ["comuniones", "QR para comuniones: recuerdos familiares en una galería privada", "Recoge fotos, vídeos y audios de una comunión con un QR sencillo para toda la familia.", "qr comunion, fotos comunion, galeria privada comunion"],
  ["cumpleanos", "QR para cumpleaños: fotos y vídeos de todos los invitados", "Reúne recuerdos de cumpleaños en una galería privada con QR, sin apps ni registros complicados.", "qr cumpleaños, fotos cumpleaños, galeria cumpleaños"],
  ["empresa", "QR para eventos de empresa: contenido privado y ordenado", "Centraliza fotos, vídeos y audios de eventos corporativos con una experiencia QR sencilla y profesional.", "qr evento empresa, fotos evento corporativo, galeria privada empresa"],
  ["conferencias", "QR para conferencias: fotos y vídeos de asistentes", "Recopila contenido real de una conferencia con QR y una galería privada fácil de compartir.", "qr conferencia, fotos conferencia, galeria evento"],
].map(([slug, title, description, keywords]) => ({
  path: `/eventos/${slug}`,
  title,
  description,
  keywords,
  image: "/og-image.jpg",
  bodyHtml:
    slug === "bodas"
      ? "<main><article><h1>QR para bodas: fotos, vídeos y audios de invitados</h1>" +
        "<p>Crea una galería privada para tu boda con QR. Los invitados suben fotos, vídeos y mensajes de audio sin app y lo descubrís después en el momento del revelado.</p>" +
        "<p>Una boda no se vive desde un único punto de vista. El fotógrafo captura los momentos principales, pero los invitados guardan escenas que ocurren en mesas, barra, photocall, pista de baile y conversaciones pequeñas. El QR convierte esos móviles en una memoria compartida sin obligar a nadie a descargar una aplicación.</p>" +
        "<h2>Qué puede subir cada invitado</h2><p>Los invitados pueden aportar fotos espontáneas, vídeos cortos de la fiesta y mensajes de audio con felicitaciones o anécdotas. Ese material complementa el reportaje profesional y permite descubrir detalles que la pareja no vio en directo.</p>" +
        "<h2>Dónde colocar el QR en la boda</h2><p>Funciona mejor cuando aparece en varios puntos: cartel de bienvenida, seating plan, tarjetas de mesa, barra, photocall y zona de baile. Cada ubicación cumple un papel distinto: presentar la dinámica, recordarla durante la cena y activar la participación cuando la fiesta está viva.</p>" +
        "<h2>Por qué no depender solo de WhatsApp</h2><p>WhatsApp sirve para avisar o recordar el enlace, pero no es el mejor archivo para una boda. Las fotos se mezclan con mensajes, algunos vídeos no llegan y la pareja termina buscando recuerdos en conversaciones dispersas. Una galería privada con QR reúne todo en un único sitio.</p>" +
        "<h2>El valor del revelado</h2><p>Después de la boda, la pareja puede abrir la galería y descubrir lo que vivieron sus invitados: bailes, bromas, audios, brindis y escenas únicas. Ese revelado convierte la recopilación de fotos en una segunda experiencia emocional.</p>" +
        "<h2>Para parejas, wedding planners y espacios</h2><p>El QR también facilita la coordinación con wedding planners, fincas y venues. Todos pueden usar el mismo enlace, imprimir soportes coherentes y explicar la dinámica con una frase sencilla. Así no depende de una única persona recordar a los invitados que participen.</p>" +
        "<h2>Qué hace que los invitados participen</h2><p>La participación depende de tres cosas: que el QR sea visible, que el mensaje sea claro y que subir contenido no requiera instalar nada. Cuando esos tres puntos se cumplen, llegan más fotos espontáneas, vídeos de fiesta y mensajes personales que completan la historia de la boda.</p>" +
        '<p><a href="https://acceso.revelao.cam/nuevoeventodemo2">Crear mi QR de boda</a></p></article></main>'
      : `<main><h1>${escapeHtml(title)}</h1><p>${escapeHtml(description)}</p><h2>Cómo funciona</h2><p>Crea el evento, comparte el QR y deja que los invitados suban recuerdos desde su móvil.</p></main>`,
  schema: {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    url: `${siteUrl}/eventos/${slug}`,
    publisher: baseSchema,
  },
}));

const defaultWeddingFaqs = [
  {
    question: "¿Los invitados necesitan instalar una app?",
    answer: "No. Los invitados escanean el QR y suben el contenido desde el navegador del móvil.",
  },
  {
    question: "¿Se pueden subir vídeos y mensajes de audio además de fotos?",
    answer: "Sí. Revelao permite reunir fotos, vídeos y mensajes de audio en una galería privada.",
  },
];

const weddingLongLandingContent = {
  "/bodas/qr-fotos-boda": {
    cta: "Crear mi QR para fotos de boda",
    related: [
      ["/bodas/cartel-qr-boda", "Cartel QR para boda"],
      ["/bodas/tarjetas-qr-boda", "Tarjetas QR para mesas"],
      ["/bodas/whatsapp-fotos-boda", "WhatsApp vs galería privada"],
    ],
    faqs: [
      {
        question: "¿Qué es un QR para fotos de boda?",
        answer:
          "Es un código que los invitados escanean con su móvil para subir fotos, vídeos y mensajes de audio a una galería privada de la boda.",
      },
      {
        question: "¿Los invitados necesitan instalar una app?",
        answer:
          "No. El QR abre una página en el navegador del móvil para que puedan participar sin descargar nada.",
      },
      {
        question: "¿Por qué es mejor que pedir fotos por WhatsApp?",
        answer:
          "Porque centraliza todos los recuerdos en una galería privada, evita chats dispersos y facilita descubrir el contenido en el momento del revelado.",
      },
    ],
    sections: [
      [
        "La guía principal para recoger fotos de boda con QR",
        [
          "Un QR para fotos de boda sirve para que los invitados suban sus recuerdos en el mismo momento en que los están viviendo. En lugar de pedir archivos días después, la pareja crea una galería privada y coloca un código QR en puntos visibles de la celebración.",
          "Esta página funciona como guía pilar del cluster de Revelao sobre bodas y QR. Desde aquí se conectan temas más concretos como carteles, tarjetas de mesa, alternativas a WhatsApp, subida sin app y momento del revelado.",
          "El objetivo principal es aumentar la participación sin complicar la experiencia. Si el invitado tiene que descargar una app o registrarse, muchas fotos se quedan en su móvil. Si solo tiene que escanear y subir, el recuerdo llega cuando todavía está fresco.",
        ],
      ],
      [
        "Qué recuerdos puede aportar cada invitado",
        [
          "El fotógrafo profesional es imprescindible, pero no puede estar en todas partes a la vez. Los invitados capturan mesas, abrazos, vídeos de la barra, bromas antes del baile, reacciones espontáneas y pequeños momentos que completan la historia del día.",
          "Con Revelao, esos recuerdos no se limitan a fotos. También pueden subirse vídeos y mensajes de audio. Esto permite guardar voces, felicitaciones y anécdotas que tienen un valor emocional enorme cuando la boda ya ha pasado.",
          "La galería privada ayuda a que todo quede en un único lugar. La pareja no tiene que revisar conversaciones, descargar archivos sueltos ni perseguir a quienes prometieron enviar fotos después.",
        ],
      ],
      [
        "Dónde colocar el QR para conseguir más participación",
        [
          "La colocación del QR importa tanto como la herramienta. En la entrada sirve para presentar la dinámica. En las mesas funciona como recordatorio. En la barra y el photocall aparece justo cuando los invitados suelen sacar el móvil.",
          "También conviene repetir el mensaje en distintos soportes: cartel principal, tarjetas pequeñas, minutas o un recordatorio del DJ antes de la fiesta. La repetición bien planteada no molesta, simplemente hace que más personas recuerden participar.",
          "El texto debe ser directo. Frases como “Escanea y sube tus fotos de la boda” o “Déjanos un recuerdo para el revelado” funcionan mejor que explicaciones largas. Primero la acción, después los detalles.",
        ],
      ],
      [
        "Cómo encaja con carteles, tarjetas y WhatsApp",
        [
          "El QR para fotos de boda es la página pilar porque resuelve la intención principal: recoger fotos de invitados. Las páginas de cartel QR y tarjetas QR explican soportes concretos para mostrar ese mismo QR durante el evento.",
          "La página de WhatsApp vs galería privada aborda otra duda frecuente: por qué no basta con crear un grupo y pedir fotos después. WhatsApp puede servir para recordar el enlace, pero no debería ser el archivo principal de la boda.",
          "La subida sin app es otra pieza del cluster. Cuantos menos pasos haya, más recuerdos llegan. Por eso el flujo ideal es escanear, elegir foto, vídeo o audio y subir directamente desde el navegador.",
        ],
      ],
      [
        "El valor del revelado después de la boda",
        [
          "Recoger fotos con QR no solo consiste en almacenar archivos. El momento del revelado convierte esa galería en una segunda experiencia: la pareja descubre escenas que no vio, mensajes que no esperaba y vídeos grabados desde dentro de la celebración.",
          "Este enfoque también mejora la calidad del recuerdo. Los invitados participan durante la boda, pero la pareja puede verlo después con calma, sin estar pendiente del móvil durante el evento.",
          "Si buscas una solución completa, empieza por la página pilar de QR para fotos de boda y profundiza después en los soportes específicos: cartel, tarjetas, subida sin app, WhatsApp y revelado.",
        ],
      ],
    ],
  },
  "/bodas/codigo-qr-boda": {
    cta: "Crear mi QR de boda",
    related: [
      ["/bodas/cartel-qr-boda", "Cómo preparar el cartel QR de boda"],
      ["/bodas/subir-fotos-boda-sin-app", "Subir fotos de boda sin app"],
      ["/blog/captar-mejores-fotos-boda", "Por qué no perder ninguna foto importante"],
    ],
    faqs: [
      {
        question: "¿Qué debe incluir un código QR para boda?",
        answer:
          "Debe abrir una experiencia muy clara: subir fotos, vídeos o mensajes de audio sin app, con una frase sencilla y una galería privada asociada al evento.",
      },
      {
        question: "¿Cuándo hay que crear el QR de la boda?",
        answer:
          "Lo ideal es crearlo antes de imprimir carteles, tarjetas o minutas, para que el mismo QR aparezca en todos los puntos de la celebración.",
      },
      {
        question: "¿Dónde se coloca mejor el QR?",
        answer:
          "Funciona mejor en bienvenida, seating plan, mesas, barra, photocall y zona de baile, siempre acompañado de una instrucción corta.",
      },
    ],
    sections: [
      [
        "Qué es un código QR para boda y por qué ayuda tanto",
        [
          "Un código QR para boda es una forma sencilla de conectar a todos los invitados con una galería privada del evento. En lugar de pedir fotos por WhatsApp días después, cada persona puede escanear el QR durante la celebración y subir en ese momento las fotos, vídeos o mensajes de audio que acaba de capturar.",
          "La diferencia está en el momento. Si esperas a que los invitados recuerden enviar sus fotos después de la boda, muchas imágenes se quedan en sus móviles. Si el QR está presente mientras ocurre la emoción, el recuerdo se guarda cuando todavía está vivo.",
          "Para una boda, esto es especialmente útil porque los novios no pueden verlo todo. Mientras saludan a una mesa, otra está brindando. Mientras el fotógrafo cubre la entrada, alguien está grabando una reacción espontánea. El QR convierte todas esas miradas en una memoria compartida.",
        ],
      ],
      [
        "Cómo debería funcionar para que los invitados lo usen",
        [
          "El QR no debe llevar a una página confusa. Debe abrir una acción clara: subir recuerdos de la boda. Cuantos menos pasos haya, mayor será la participación. Por eso Revelao está pensado para que el invitado escanee, elija una foto, vídeo o audio y lo suba desde el navegador del móvil.",
          "No pedir instalaciones es clave. En una boda nadie quiere descargar una app, crear una cuenta o aprender un sistema nuevo. La experiencia tiene que parecer tan natural como hacer una foto. Si el invitado entiende qué hacer en tres segundos, probablemente participará.",
          "También conviene explicar que no se trata de sustituir al fotógrafo. El valor del QR está en recoger lo espontáneo: fotos de mesas, vídeos de amigos, audios de familiares, escenas de baile y pequeños momentos que no siempre entran en el reportaje oficial.",
        ],
      ],
      [
        "Ejemplos concretos de uso durante la boda",
        [
          "En la entrada, el QR puede aparecer junto a una frase como: “Escanea y deja tu recuerdo para el revelado”. En las mesas, puede estar en una tarjeta pequeña con una instrucción directa. En la barra o photocall, funciona bien porque los invitados ya tienen el móvil en la mano.",
          "Durante el cóctel, el QR ayuda a capturar reencuentros, abrazos y grupos de amigos. En la cena, recoge fotos de mesa y mensajes de audio más personales. En la fiesta, aparecen vídeos cortos y escenas que quizá nadie habría compartido después.",
          "El resultado no es solo una carpeta de fotos. Es una galería privada que cuenta la boda desde muchas perspectivas. Y si se activa el momento del revelado, descubrir todo al día siguiente convierte el recuerdo en una segunda experiencia emocional.",
        ],
      ],
      [
        "Errores comunes al preparar el QR",
        [
          "El primer error es esconderlo. Un QR colocado solo en una esquina de la entrada se olvida rápido. El segundo es acompañarlo con demasiado texto. Los invitados no necesitan leer instrucciones largas, solo entender la acción principal.",
          "Otro error habitual es usar el QR para enlazar a una carpeta genérica o a un formulario incómodo. Si subir contenido exige demasiados pasos, se pierde participación. La tecnología debe desaparecer detrás del momento.",
          "Por último, evita depender solo de un grupo de WhatsApp. En los chats se mezclan conversaciones, se pierde calidad y mucha gente nunca envía nada. Una galería privada ordenada da más control y mejora la experiencia para la pareja.",
        ],
      ],
    ],
  },
  "/bodas/cartel-qr-boda": {
    cta: "Crear cartel QR de boda",
    related: [
      ["/bodas/codigo-qr-boda", "Código QR para boda"],
      ["/bodas/tarjetas-qr-boda", "Tarjetas QR para mesas e invitaciones"],
      ["/bodas/checklist-fotos-invitados-boda", "Checklist para recopilar fotos"],
    ],
    faqs: [
      {
        question: "¿Qué texto poner en un cartel QR de boda?",
        answer:
          "Debe ser corto y orientado a la acción: “Sube tus fotos de la boda”, “Déjanos tu recuerdo” o “Escanea para participar en el revelado”.",
      },
      {
        question: "¿Cuántos carteles QR conviene poner?",
        answer:
          "Depende del espacio, pero suele funcionar bien combinar entrada, mesas, barra, photocall y zona de baile.",
      },
      {
        question: "¿El cartel QR sustituye a las tarjetas de mesa?",
        answer:
          "No necesariamente. Lo ideal es combinar un cartel visible con tarjetas pequeñas en puntos donde los invitados pasan más tiempo.",
      },
    ],
    sections: [
      [
        "Por qué el cartel QR decide la participación",
        [
          "Un cartel QR de boda no es solo decoración. Es el punto de entrada para que los invitados entiendan que pueden formar parte del recuerdo del evento. Si el cartel está bien colocado y el mensaje es claro, la galería recibe más fotos, vídeos y audios.",
          "Muchas parejas crean un QR, pero luego lo colocan en un único sitio poco visible. El resultado es que los invitados no lo ven o no recuerdan usarlo. La cartelería tiene que acompañar el recorrido real de la boda: llegada, cóctel, cena y fiesta.",
          "La clave es tratar el QR como una dinámica de evento. Debe estar integrado en el espacio, pero también destacar lo suficiente para que se entienda. Un buen cartel reduce la fricción antes de que el invitado toque el móvil.",
        ],
      ],
      [
        "Dónde colocar el cartel QR en una boda",
        [
          "La entrada es el primer punto lógico, porque marca la dinámica desde el inicio. Un cartel junto al seating plan o la mesa de bienvenida permite que los invitados lo vean mientras esperan o buscan su mesa.",
          "Durante el banquete, las mesas son un lugar perfecto para reforzar el mensaje. No hace falta un cartel grande en cada mesa: una tarjeta o soporte pequeño puede recordar que pueden subir sus fotos y dejar mensajes de audio.",
          "La barra, el photocall y la zona de baile suelen funcionar especialmente bien. Son momentos donde la gente usa el móvil de forma natural y donde aparecen recuerdos muy espontáneos: selfies, vídeos, brindis, bailes y bromas entre amigos.",
        ],
      ],
      [
        "Qué texto usar para que se entienda rápido",
        [
          "El texto debe ser corto. Frases como “Sube tus fotos de la boda”, “Escanea y deja tu recuerdo” o “Comparte tu mejor momento” funcionan mejor que explicaciones largas. El objetivo es que el invitado sepa qué hacer en un vistazo.",
          "Si quieres reforzar el momento del revelado, puedes usar una frase más emocional: “Déjanos un recuerdo para descubrir mañana”. Esto explica que el contenido no es solo una subida de archivos, sino parte de una experiencia posterior.",
          "Evita frases demasiado técnicas. No hace falta hablar de galería colaborativa, almacenamiento o plataforma. En el cartel, la acción debe ganar. Los detalles pueden quedar para la pantalla que se abre después de escanear.",
        ],
      ],
      [
        "Diseño, tamaño y errores a evitar",
        [
          "El QR debe tener suficiente tamaño y contraste. Si se imprime pequeño, con poco margen o sobre un fondo con demasiado detalle, algunos móviles pueden tardar en leerlo. En un cartel principal, conviene dejar aire alrededor del código.",
          "También es importante probarlo antes de imprimir. Escanéalo desde varios móviles, con distinta luz y distancia. Una prueba de treinta segundos puede evitar que el día de la boda el QR no funcione bien.",
          "El mayor error es confiar en un único cartel. La repetición bien planteada no molesta: ayuda. Entrada, mesas y zona de fiesta cumplen funciones distintas y multiplican las oportunidades de participación.",
          "Un buen detalle final es preparar una versión digital del cartel para enviarla al grupo de organización, al wedding planner o al responsable del venue. Así todos conocen el mismo enlace y pueden ayudar si algún invitado pregunta cómo subir sus recuerdos.",
        ],
      ],
    ],
  },
  "/bodas/whatsapp-fotos-boda": {
    cta: "Probar galería privada",
    related: [
      ["/bodas/galeria-privada-boda", "Galería privada para boda"],
      ["/bodas/compartir-fotos-boda", "Compartir fotos de boda sin perder calidad"],
      ["/blog/como-recoger-fotos-boda-sin-whatsapp-guia-2026", "Guía para recoger fotos sin WhatsApp"],
    ],
    faqs: [
      {
        question: "¿Por qué WhatsApp no es ideal para fotos de boda?",
        answer:
          "Porque mezcla conversaciones, reduce orden, depende de que la gente recuerde enviar archivos y no está pensado como archivo privado del evento.",
      },
      {
        question: "¿Una galería privada evita perder fotos?",
        answer:
          "Sí. Centraliza las subidas desde el momento de la boda y evita que cada recuerdo quede disperso en un chat distinto.",
      },
      {
        question: "¿Se puede seguir compartiendo el enlace por WhatsApp?",
        answer:
          "Sí. Puedes usar WhatsApp para enviar el enlace o recordar el QR, pero la subida y organización se hacen en la galería privada.",
      },
    ],
    sections: [
      [
        "El problema de pedir fotos de boda por WhatsApp",
        [
          "Pedir las fotos de boda por WhatsApp parece cómodo porque todo el mundo lo usa. Pero precisamente por eso se convierte en un canal ruidoso. Entre felicitaciones, comentarios, stickers y conversaciones, las fotos importantes se mezclan y muchas acaban perdidas.",
          "También hay un problema de momento. Después de la boda, cada invitado vuelve a su rutina. Aunque muchos digan “luego te paso las fotos”, no siempre ocurre. Y cuando ocurre, suele llegar en conversaciones separadas, con archivos sueltos y sin orden.",
          "Una boda genera cientos de recuerdos desde muchos móviles. Si todos dependen de chats privados, la pareja tiene que perseguir, descargar, ordenar y revisar manualmente. Es un trabajo poco agradecido justo cuando debería estar disfrutando del recuerdo.",
        ],
      ],
      [
        "WhatsApp sirve para avisar, no para archivar",
        [
          "WhatsApp puede ser útil para mandar un recordatorio, compartir el enlace o avisar de que la galería ya está disponible. Pero no es el mejor sitio para construir el archivo emocional de una boda.",
          "Una galería privada tiene otra lógica: cada foto, vídeo o mensaje de audio llega al mismo espacio. La pareja no tiene que revisar veinte conversaciones distintas ni depender de que alguien reenvíe el archivo correcto.",
          "Además, el QR permite capturar contenido durante la celebración, no solo después. Esto cambia mucho la participación. El invitado sube el recuerdo en el momento en que lo acaba de vivir, antes de que se olvide o quede enterrado en el carrete.",
        ],
      ],
      [
        "Qué se pierde cuando solo usas grupos",
        [
          "Se pierden fotos espontáneas que nadie considera importantes hasta que se ven después. Se pierden vídeos cortos que no se envían porque pesan demasiado. Se pierden mensajes personales que quizá no encajan en un grupo lleno de gente.",
          "También se pierde contexto. Una galería de boda puede reunir la historia del día: ceremonia, cóctel, mesas, baile, mensajes y revelado. Un chat, en cambio, organiza el recuerdo según el orden de llegada de los mensajes.",
          "Para parejas que quieren guardar la boda desde muchas miradas, esa diferencia importa. No se trata de recibir más archivos sin control, sino de crear un espacio único donde todo tenga sentido.",
        ],
      ],
      [
        "La alternativa: QR y galería privada",
        [
          "Con Revelao, los invitados escanean un QR y suben fotos, vídeos y audios sin instalar una app. La pareja puede colocar el QR en carteles, tarjetas de mesa, seating plan o zona de fiesta para que participar sea natural.",
          "El momento del revelado añade una capa emocional. En lugar de ir recibiendo archivos desordenados, la pareja descubre la galería después de la boda, con calma y con la sorpresa de ver momentos que no pudo vivir en directo.",
          "WhatsApp puede seguir formando parte de la comunicación, pero deja de ser el archivo principal. Esa es la diferencia: usar el chat para recordar la dinámica y usar una galería privada para conservar de verdad los recuerdos.",
          "También resulta más cómodo para los invitados que no quieren escribir en un grupo grande o enviar archivos uno a uno. Escanean el QR, participan en privado y la pareja recibe el contenido en un espacio pensado para la boda.",
        ],
      ],
    ],
  },
  "/bodas/subir-fotos-boda-sin-app": {
    cta: "Crear galería sin app",
    related: [
      ["/bodas/qr-fotos-boda", "QR para fotos de boda"],
      ["/bodas/app-fotos-boda", "App de fotos para boda vs QR sin app"],
      ["/bodas/codigo-qr-boda", "Código QR para boda"],
    ],
    faqs: [
      {
        question: "¿Cómo pueden subir fotos los invitados sin app?",
        answer:
          "Escanean el QR, se abre una página en el navegador del móvil y desde ahí eligen fotos, vídeos o audios para subir a la galería.",
      },
      {
        question: "¿Se necesita crear cuenta?",
        answer:
          "No. La experiencia está pensada para reducir pasos y facilitar que participen más invitados durante la boda.",
      },
      {
        question: "¿Funciona en iPhone y Android?",
        answer:
          "Sí. Al funcionar desde navegador, los invitados pueden participar desde móviles iPhone y Android sin instalación previa.",
      },
    ],
    sections: [
      [
        "Por qué evitar una app mejora la participación",
        [
          "Subir fotos de boda sin app es una de las mejores formas de conseguir más recuerdos de los invitados. En una celebración, cualquier paso extra reduce la participación. Si alguien tiene que buscar una app, descargarla, registrarse y aceptar permisos, probablemente lo dejará para luego.",
          "El problema es que “luego” casi nunca funciona igual. La emoción ya ha pasado, las fotos se mezclan con otras imágenes y muchos invitados no recuerdan enviarlas. Por eso el sistema tiene que funcionar en el mismo momento de la boda.",
          "Un QR que abre una página sencilla en el navegador elimina esa fricción. El invitado escanea, selecciona el recuerdo y lo sube. No necesita aprender nada nuevo ni comprometer espacio en su móvil.",
        ],
      ],
      [
        "Cómo funciona el flujo ideal",
        [
          "El flujo ideal tiene tres pasos: escanear, elegir archivo y subir. Puede ser una foto de la ceremonia, un vídeo del baile o un mensaje de audio para la pareja. Cuanto más directo sea, más contenido llega a la galería.",
          "Revelao está diseñado para ese contexto: bodas con invitados de distintas edades, distintos móviles y diferentes niveles de comodidad tecnológica. La experiencia debe ser suficientemente clara para una amiga de los novios y para un familiar que solo quiere dejar una felicitación.",
          "La ausencia de app también ayuda a que la dinámica sea más fácil de explicar en un cartel. No hay instrucciones largas. Basta con una frase como “Escanea y sube tus recuerdos de la boda”.",
        ],
      ],
      [
        "Qué recuerdos se consiguen cuando es fácil participar",
        [
          "Cuando subir recuerdos no cuesta esfuerzo, aparecen fotos más espontáneas. No solo llegan las imágenes bonitas y preparadas, sino también momentos de mesa, abrazos rápidos, risas, brindis, vídeos de la pista y mensajes de audio que tienen mucho valor con el tiempo.",
          "La pareja obtiene una visión más completa del día. El fotógrafo sigue siendo esencial, pero los invitados capturan ángulos imposibles para una sola cámara. Sus móviles están en medio de la experiencia.",
          "Además, los mensajes de audio añaden una capa muy personal. Hay felicitaciones, anécdotas y voces que no se guardan en una foto, pero que pueden emocionar muchísimo durante el revelado.",
        ],
      ],
      [
        "Dónde recordar que se puede subir sin app",
        [
          "La entrada sirve para presentar la dinámica. Las mesas funcionan para recordarla cuando los invitados están tranquilos. La barra y la zona de baile ayudan a capturar los momentos más sociales. La clave es que el QR aparezca varias veces sin resultar invasivo.",
          "También puedes pedir al DJ, maestro de ceremonias o wedding planner que lo recuerde en un momento concreto. Un aviso breve antes del baile puede multiplicar las subidas porque los invitados ya están con el móvil preparado.",
          "Subir fotos sin app no es solo una mejora técnica. Es una decisión de experiencia: pedir menos para recibir más. Y en una boda, esa sencillez marca la diferencia entre tener unos pocos archivos y conservar una memoria compartida de verdad.",
          "Para reforzarlo, conviene usar el mismo mensaje en todos los soportes: cartel, minuta, tarjeta de mesa y recordatorio por WhatsApp si lo hay. La repetición clara evita dudas y hace que el invitado recuerde la acción en varios momentos del día.",
        ],
      ],
    ],
  },
  "/bodas/whatsapp-vs-galeria-privada-fotos-boda": {
    cta: "Probar galería privada para mi boda",
    related: [
      ["/bodas/whatsapp-fotos-boda", "Fotos de boda por WhatsApp"],
      ["/bodas/galeria-privada-boda", "Galería privada para boda"],
      ["/bodas/qr-fotos-boda", "QR para fotos de boda"],
    ],
    faqs: [
      {
        question: "¿WhatsApp sirve para recoger fotos de boda?",
        answer:
          "Sirve para avisar o recordar el enlace, pero no es la mejor opción para organizar y conservar todos los recuerdos de la boda.",
      },
      {
        question: "¿Qué ventaja tiene una galería privada?",
        answer:
          "Centraliza fotos, vídeos y audios en un único espacio, evita chats dispersos y facilita el momento del revelado.",
      },
      {
        question: "¿Puedo usar WhatsApp y galería privada a la vez?",
        answer:
          "Sí. Lo recomendable es usar WhatsApp como canal de recordatorio y la galería privada como lugar donde se suben y guardan los recuerdos.",
      },
    ],
    sections: [
      [
        "WhatsApp vs galería privada: la comparación real",
        [
          "WhatsApp parece la forma más rápida de pedir fotos de boda porque todos lo tienen en el móvil. El problema aparece después: archivos mezclados con conversaciones, fotos enviadas por chats separados, vídeos que no llegan y recuerdos que se quedan en el carrete de cada invitado.",
          "Una galería privada funciona con otra lógica. En lugar de depender de mensajes sueltos, la pareja crea un espacio único para la boda y los invitados suben sus fotos, vídeos y audios escaneando un QR. La conversación puede seguir en WhatsApp, pero el archivo importante queda ordenado.",
          "La decisión no es si WhatsApp es útil o no. La pregunta correcta es qué herramienta debe conservar los recuerdos. Para avisar, WhatsApp funciona. Para guardar una boda, una galería privada es mucho más sólida.",
        ],
      ],
      [
        "Participación de invitados",
        [
          "En WhatsApp, la participación suele depender de la memoria de cada invitado. Muchos prometen enviar fotos después, pero el día siguiente llega con viajes, cansancio y conversaciones acumuladas. La intención era buena, pero el recuerdo no siempre llega.",
          "Con una galería privada y QR, el gesto ocurre durante la boda. El invitado escanea cuando acaba de hacer la foto o grabar el vídeo. Esa inmediatez aumenta la participación porque no convierte la subida en una tarea pendiente.",
          "Además, hay invitados que no quieren escribir en un grupo grande o compartir ciertos momentos con todos. Una subida directa a la galería permite participar de forma más privada y cómoda.",
        ],
      ],
      [
        "Orden, calidad y privacidad",
        [
          "WhatsApp mezcla fotos con audios, respuestas, emojis y conversaciones. Si la pareja quiere reconstruir la boda después, tiene que buscar, descargar y ordenar manualmente. Ese trabajo suele acabar incompleto.",
          "La galería privada reúne el contenido bajo el mismo evento. Fotos, vídeos y mensajes de audio llegan al mismo lugar y pueden revisarse con calma. También evita depender de que alguien reenvíe archivos desde otro chat.",
          "Para una boda, la privacidad importa. Una galería pensada para el evento permite separar el recuerdo de la conversación social. No todo tiene que vivir en un grupo donde participan decenas de personas.",
        ],
      ],
      [
        "Cuándo elegir cada opción",
        [
          "Usa WhatsApp para comunicar: enviar el enlace antes de la boda, recordar el QR durante el evento o avisar de que la galería ya está lista. Es el canal que la gente mira rápido.",
          "Usa una galería privada para recopilar y conservar. Ahí es donde conviene recibir las fotos espontáneas, los vídeos del baile y los mensajes de audio que la pareja descubrirá después.",
          "La mejor estrategia comercial no es sustituir por completo WhatsApp, sino darle un papel correcto. WhatsApp informa; Revelao guarda, ordena y convierte el contenido en una experiencia de revelado.",
        ],
      ],
    ],
  },
  "/bodas/google-drive-vs-qr-boda": {
    cta: "Crear QR de boda sin carpetas",
    related: [
      ["/bodas/qr-fotos-boda", "QR para fotos de boda"],
      ["/bodas/subir-fotos-boda-sin-app", "Subir fotos sin app"],
      ["/bodas/galeria-privada-boda", "Galería privada para boda"],
    ],
    faqs: [
      {
        question: "¿Google Drive sirve para fotos de boda?",
        answer:
          "Puede servir como carpeta de almacenamiento, pero no está pensado como experiencia sencilla para invitados durante una boda.",
      },
      {
        question: "¿Qué diferencia hay entre Drive y un QR de boda?",
        answer:
          "Drive organiza archivos en carpetas; un QR de boda guía al invitado para subir recuerdos sin app y reúne el contenido en una experiencia privada del evento.",
      },
      {
        question: "¿El QR sustituye a una copia de seguridad?",
        answer:
          "No. El QR ayuda a recopilar recuerdos. Después puedes descargar o guardar una copia donde prefieras.",
      },
    ],
    sections: [
      [
        "Google Drive vs QR de boda: dos usos distintos",
        [
          "Google Drive es una buena herramienta para almacenar documentos y carpetas. Pero una boda no se comporta como una oficina. Los invitados están celebrando, moviéndose, hablando y sacando el móvil en momentos espontáneos. Pedirles que entren en una carpeta y entiendan permisos puede reducir mucho la participación.",
          "Un QR de boda está diseñado para el contexto del evento. El invitado escanea, abre una página clara y sube fotos, vídeos o audios sin instalar nada. La experiencia está pensada para actuar rápido, no para gestionar archivos.",
          "La diferencia principal es la intención. Drive responde a “dónde guardo archivos”. Un QR de boda responde a “cómo consigo que más invitados suban recuerdos mientras ocurre la boda”.",
        ],
      ],
      [
        "Permisos y fricción",
        [
          "En Google Drive, los permisos pueden generar dudas: quién puede ver, quién puede editar, si hace falta cuenta de Google, dónde se sube cada archivo o si el enlace permite escribir. Aunque todo esté bien configurado, muchos invitados no quieren pensarlo durante la fiesta.",
          "Con Revelao, la pantalla de subida reduce el proceso a una acción concreta. No hay carpetas que elegir ni estructura que entender. Esa sencillez es lo que convierte una intención bonita en participación real.",
          "Cuantos más pasos hay, más recuerdos se pierden. En bodas, la facilidad no es un detalle técnico: es la diferencia entre recibir veinte archivos o construir una galería completa.",
        ],
      ],
      [
        "Experiencia para la pareja",
        [
          "Una carpeta de Drive puede acabar llena de nombres de archivo, duplicados y vídeos sin contexto. La pareja recibe contenido, sí, pero no necesariamente una experiencia preparada para revivir la boda.",
          "Una galería privada puede ordenar el contenido alrededor del evento, sumar mensajes de audio y preparar el momento del revelado. La pareja no solo descarga archivos: descubre la boda desde los móviles de sus invitados.",
          "Después, si quiere guardar una copia externa, puede hacerlo. Pero la captura inicial debería ser lo más simple posible para quienes están en la celebración.",
        ],
      ],
      [
        "Cuándo usar Drive y cuándo usar QR",
        [
          "Drive puede ser útil para una copia interna, una entrega final o un backup posterior. No es mala herramienta; simplemente no es la mejor puerta de entrada para invitados.",
          "El QR debe estar en carteles, mesas, invitaciones o photocall porque funciona en el lugar donde nace el recuerdo. Es visible, rápido y fácil de explicar.",
          "La combinación ideal es recopilar con QR y conservar después como prefieras. Revelao cubre la parte crítica: conseguir que los invitados participen sin convertirlo en una tarea.",
        ],
      ],
    ],
  },
  "/bodas/app-fotos-boda-vs-qr-sin-app": {
    cta: "Crear galería QR sin app",
    related: [
      ["/bodas/app-fotos-boda", "App de fotos para boda"],
      ["/bodas/subir-fotos-boda-sin-app", "Subir fotos sin app"],
      ["/bodas/qr-fotos-boda", "QR para fotos de boda"],
    ],
    faqs: [
      {
        question: "¿Es mejor una app de fotos o un QR sin app?",
        answer:
          "Para participación durante la boda, un QR sin app suele funcionar mejor porque evita descargas, registros y permisos innecesarios.",
      },
      {
        question: "¿Una app puede tener más funciones?",
        answer:
          "Sí, pero más funciones no siempre significan más uso. En una boda, la prioridad es que los invitados participen en segundos.",
      },
      {
        question: "¿El QR funciona en iPhone y Android?",
        answer:
          "Sí. Al abrirse en navegador, funciona desde móviles iPhone y Android sin instalación previa.",
      },
    ],
    sections: [
      [
        "App de fotos de boda vs QR sin app",
        [
          "Una app de fotos para boda puede sonar completa, pero introduce una barrera en el peor momento posible. El invitado tiene que descargar, esperar, aceptar permisos y quizá crear una cuenta. Durante una celebración, cada paso extra reduce la participación.",
          "Un QR sin app elimina esa fricción. El invitado escanea desde la cámara del móvil, abre una página y sube su recuerdo. Es una experiencia más ligera y más fácil de explicar en un cartel o tarjeta de mesa.",
          "La comparación no va de tecnología avanzada contra tecnología simple. Va de comportamiento real de invitados. La mejor herramienta es la que la gente usa sin pensarlo.",
        ],
      ],
      [
        "Instalación, registro y permisos",
        [
          "Las apps dependen de la conexión, del espacio en el móvil, de la tienda de aplicaciones y de que el usuario quiera instalar algo para un evento puntual. Algunas personas lo harán, pero muchas lo dejarán para luego.",
          "El QR sin app reduce el compromiso. No pide al invitado que adopte una herramienta nueva; solo le pide que comparta una foto, un vídeo o un audio en ese instante.",
          "Esto es especialmente importante en bodas con edades variadas. Una experiencia web sencilla funciona mejor para amigos jóvenes, familiares mayores y personas que no quieren tocar demasiados ajustes del móvil.",
        ],
      ],
      [
        "Qué opción consigue más recuerdos",
        [
          "Si una app tiene más funciones pero menos invitados la usan, la galería acaba vacía. En cambio, una experiencia QR puede parecer más directa, pero precisamente por eso recibe más contenido espontáneo.",
          "Las mejores fotos de invitados suelen capturarse en momentos rápidos: una mesa riéndose, un abrazo, una copa en la barra, un baile improvisado. El sistema debe estar listo para esos segundos.",
          "Revelao prioriza ese flujo: escanear, seleccionar y subir. Menos pasos, más recuerdos, menos dependencia de recordatorios después de la boda.",
        ],
      ],
      [
        "Cuándo tiene sentido cada opción",
        [
          "Una app puede tener sentido si quieres una comunidad cerrada que usará la herramienta durante mucho tiempo. Para una boda concreta, donde la participación se concentra en unas horas, el QR sin app suele ser más eficaz.",
          "También es más fácil integrarlo físicamente: cartel de bienvenida, tarjetas QR, minutas, photocall o pantalla del DJ. El QR se convierte en parte del evento, no en una descarga pendiente.",
          "Si tu prioridad comercial es recibir fotos, vídeos y audios de la boda, elige el camino con menos fricción. La participación vale más que una lista larga de funciones.",
        ],
      ],
    ],
  },
  "/bodas/fotografo-profesional-fotos-invitados-boda": {
    cta: "Combinar fotógrafo y QR",
    related: [
      ["/bodas/qr-fotos-boda", "QR para fotos de boda"],
      ["/bodas/checklist-fotos-invitados-boda", "Checklist para fotos de invitados"],
      ["/bodas/revelado-fotos-boda", "Revelado de fotos de boda"],
    ],
    faqs: [
      {
        question: "¿El QR sustituye al fotógrafo de boda?",
        answer:
          "No. El fotógrafo profesional cubre el reportaje principal. El QR complementa con recuerdos espontáneos capturados por invitados.",
      },
      {
        question: "¿Por qué combinar fotógrafo y fotos de invitados?",
        answer:
          "Porque el fotógrafo no puede estar en todas partes y los invitados capturan momentos íntimos, mesas, bromas y reacciones desde dentro de la celebración.",
      },
      {
        question: "¿Cómo explicar esto a los invitados?",
        answer:
          "Con un cartel simple: “El fotógrafo captura lo esencial, tú puedes dejarnos tu mirada escaneando este QR”.",
      },
    ],
    sections: [
      [
        "Fotógrafo profesional + fotos de invitados: no compiten",
        [
          "El fotógrafo profesional es una de las inversiones más importantes de una boda. Su trabajo aporta mirada, técnica, criterio y seguridad en los momentos clave. Un QR para fotos de invitados no sustituye eso; lo complementa.",
          "Los invitados están dentro de escenas a las que el fotógrafo no siempre llega: una conversación en una mesa, una broma en la barra, un vídeo espontáneo antes del baile o un audio de un familiar emocionado.",
          "La combinación funciona porque cada fuente tiene un papel distinto. El reportaje profesional cuenta la boda con intención estética. Las fotos de invitados añaden memoria emocional desde dentro.",
        ],
      ],
      [
        "Qué captura mejor el fotógrafo",
        [
          "El fotógrafo debe centrarse en ceremonia, pareja, familia, detalles, luz, composición y momentos irrepetibles. Es quien garantiza que la boda tenga un relato visual cuidado y consistente.",
          "También sabe anticipar escenas importantes: entrada, votos, anillos, salida, retratos, discursos y primer baile. Esas imágenes requieren oficio y no deberían depender de móviles.",
          "Por eso conviene presentar el QR como complemento, no como sustituto. La pareja gana más recuerdos sin restar valor al trabajo profesional.",
        ],
      ],
      [
        "Qué capturan mejor los invitados",
        [
          "Los invitados capturan cercanía. Están sentados en mesas, se mueven con sus grupos, ven reacciones laterales y graban vídeos desde ángulos muy personales. Sus fotos quizá no son perfectas, pero suelen tener verdad.",
          "También pueden dejar mensajes de audio. Esto añade una dimensión que el reportaje fotográfico no cubre: voces, bromas, felicitaciones y recuerdos contados en primera persona.",
          "Con Revelao, todo ese material llega a una galería privada sin que la pareja tenga que perseguirlo después. El QR transforma móviles dispersos en una memoria colectiva.",
        ],
      ],
      [
        "Cómo coordinarlo el día de la boda",
        [
          "La mejor forma de combinar ambos mundos es avisar con claridad. El fotógrafo sigue haciendo su trabajo y los invitados pueden subir sus recuerdos personales escaneando un QR visible en mesas, entrada, barra o photocall.",
          "También puedes pedir al wedding planner o al DJ que lo recuerde en un momento concreto. No hace falta interrumpir la boda: basta una frase breve antes del baile o durante el cóctel.",
          "Después llega el revelado. La pareja recibe el reportaje profesional por un lado y descubre la galería de invitados por otro. Juntas, ambas miradas hacen que la boda se recuerde con más profundidad.",
        ],
      ],
    ],
  },
  "/bodas/tarjetas-qr-boda": {
    cta: "Crear tarjetas QR para mi boda",
    related: [
      ["/bodas/cartel-qr-boda", "Cartel QR para boda"],
      ["/bodas/codigo-qr-boda", "Código QR para boda"],
      ["/bodas/subir-fotos-boda-sin-app", "Subir fotos sin app"],
    ],
    faqs: [
      {
        question: "¿Dónde poner tarjetas QR en una boda?",
        answer:
          "Funcionan especialmente bien en mesas, minutas, invitaciones, seating plan, barra, photocall y zonas donde los invitados pasan tiempo.",
      },
      {
        question: "¿Qué texto debe acompañar a la tarjeta QR?",
        answer:
          "Una frase corta orientada a la acción, como “Escanea y sube tus fotos” o “Déjanos un recuerdo para el revelado”.",
      },
      {
        question: "¿Las tarjetas QR sustituyen al cartel principal?",
        answer:
          "No. Lo ideal es combinar un cartel visible con tarjetas pequeñas que recuerden la dinámica durante toda la celebración.",
      },
    ],
    sections: [
      [
        "Por qué las tarjetas QR reciben más recuerdos",
        [
          "Las tarjetas QR para boda funcionan porque acompañan al invitado en los momentos donde tiene tiempo para mirar, leer y participar. En una mesa, una minuta o un pequeño soporte junto al centro floral, el QR deja de ser una instrucción puntual y se convierte en parte natural de la celebración.",
          "A diferencia de un cartel único en la entrada, las tarjetas mantienen viva la dinámica durante la cena, el cóctel y la fiesta. Muchos invitados no suben fotos la primera vez que ven el QR, pero sí lo hacen cuando acaban de capturar una escena divertida o un vídeo espontáneo.",
          "El objetivo no es llenar la boda de códigos, sino colocar recordatorios útiles en lugares donde el móvil ya aparece de forma natural.",
        ],
      ],
      [
        "Formatos que mejor funcionan",
        [
          "Una tarjeta de mesa puede incluir el QR, una frase corta y suficiente espacio en blanco para que el código se escanee rápido. También puede integrarse en la minuta, en una tarjeta de agradecimiento o en un pequeño soporte junto al seating plan.",
          "Para la barra y el photocall, conviene usar tarjetas algo más visibles y resistentes, porque son zonas con movimiento, copas, poca luz y más ruido. En la pista de baile, un soporte cerca del DJ o de la zona de accesorios puede activar muchas subidas de fotos divertidas.",
          "La clave está en adaptar el soporte al momento: elegante y discreto en mesa, claro y visible en zonas de participación.",
        ],
      ],
      [
        "Qué mensaje poner en cada tarjeta",
        [
          "El texto debe explicar la acción en un segundo. Frases como “Sube tus fotos de la boda”, “Comparte tu mejor momento” o “Déjanos un recuerdo para descubrir mañana” funcionan porque son directas y tienen intención emocional.",
          "Si la boda tendrá momento de revelado, merece la pena mencionarlo. Los invitados entienden que no están subiendo archivos a una carpeta cualquiera, sino preparando una sorpresa para la pareja.",
          "Evita instrucciones largas. La tarjeta no debe parecer un manual. La pantalla que se abre después de escanear puede dar más contexto, pero el soporte físico debe invitar a participar.",
        ],
      ],
      [
        "Cómo combinarlas con Revelao",
        [
          "Con Revelao, todas las tarjetas pueden apuntar al mismo evento privado. Los invitados escanean y suben fotos, vídeos o mensajes de audio desde el navegador del móvil, sin instalar apps ni registrarse.",
          "Esto permite que la pareja reciba recuerdos desde muchos puntos de la boda sin crear enlaces distintos ni carpetas separadas. Las tarjetas hacen de recordatorio físico; la galería privada se encarga de centralizar el contenido.",
          "Para mejorar el resultado, imprime las tarjetas después de probar el QR con varios móviles y deja margen suficiente alrededor del código. Una buena impresión evita fricción justo cuando quieres que la gente participe.",
        ],
      ],
    ],
  },
  "/bodas/revelado-fotos-boda": {
    cta: "Crear mi revelado de boda",
    related: [
      ["/bodas/qr-fotos-boda", "QR para fotos de boda"],
      ["/bodas/galeria-privada-boda", "Galería privada para boda"],
      ["/blog/fotos-divertidas-fiesta-boda-qr", "Fotos divertidas de la fiesta"],
    ],
    faqs: [
      {
        question: "¿Qué es el revelado de fotos de boda?",
        answer:
          "Es el momento en el que la pareja descubre después de la boda las fotos, vídeos y audios que han subido los invitados.",
      },
      {
        question: "¿Por qué esperar al revelado en vez de ver todo al momento?",
        answer:
          "Porque convierte los recuerdos en una experiencia emocional y permite vivir una segunda sorpresa cuando la boda ya ha terminado.",
      },
      {
        question: "¿Qué contenido puede formar parte del revelado?",
        answer:
          "Fotos espontáneas, vídeos de la fiesta, mensajes de audio, felicitaciones, bromas, brindis y escenas capturadas por invitados.",
      },
    ],
    sections: [
      [
        "El revelado convierte la galería en una experiencia",
        [
          "El revelado de fotos de boda no es solo abrir una carpeta con archivos. Es reservar un momento para descubrir cómo vivieron la celebración tus invitados: lo que pasó en otras mesas, los vídeos de la pista, las bromas de amigos y los mensajes de audio que nadie pudo escuchar durante el evento.",
          "Durante la boda, la pareja está pendiente de saludar, emocionarse, bailar y disfrutar. Ver todo el contenido en directo puede distraer. Esperar al revelado permite vivir la fiesta sin mirar el móvil y dejar la sorpresa para después.",
          "Ese pequeño retraso cambia el valor del recuerdo. Las fotos ya no son notificaciones sueltas, sino una colección preparada para revivir el día con calma.",
        ],
      ],
      [
        "Qué recuerdos aparecen en el revelado",
        [
          "Aparecen escenas que el fotógrafo quizá no vio: un grupo cantando en la barra, familiares riéndose en una mesa, amigos haciendo una foto absurda, vídeos de baile y felicitaciones grabadas con naturalidad.",
          "También aparecen audios. Escuchar la voz de una abuela, un amigo o un hermano después de la boda puede tener un valor emocional enorme. No todo recuerdo importante cabe en una imagen.",
          "Por eso Revelao reúne fotos, vídeos y mensajes de audio en la misma galería privada. El revelado se vuelve más completo porque combina imagen, movimiento y voz.",
        ],
      ],
      [
        "Cómo preparar el revelado desde antes de la boda",
        [
          "Para que el revelado tenga contenido, el QR debe estar bien presente durante el evento. Colócalo en carteles, tarjetas de mesa, barra y photocall. Recuérdalo en los momentos de más energía: cóctel, cena y pista de baile.",
          "El texto también ayuda. Una frase como “Déjanos un recuerdo para el revelado” explica que los invitados están participando en algo que la pareja descubrirá después, no en una simple subida de archivos.",
          "Cuanto más clara sea la dinámica, más diverso será el contenido final: fotos bonitas, escenas divertidas, vídeos cortos y mensajes personales.",
        ],
      ],
      [
        "Por qué funciona mejor que pedir fotos días después",
        [
          "Pedir fotos después de la boda depende de la memoria y la buena voluntad de cada invitado. Muchos quieren enviar sus recuerdos, pero el cansancio, los viajes y las conversaciones acumuladas hacen que se olviden.",
          "El QR captura el contenido cuando la emoción todavía está viva. El revelado se construye durante el evento, aunque la pareja lo descubra más tarde.",
          "Así, el recuerdo no llega disperso en chats. Llega a una galería privada pensada para volver a mirar la boda desde muchos ojos.",
        ],
      ],
    ],
  },
  "/bodas/galeria-privada-boda": {
    cta: "Crear galería privada de boda",
    related: [
      ["/bodas/qr-fotos-boda", "QR para fotos de boda"],
      ["/bodas/whatsapp-vs-galeria-privada-fotos-boda", "WhatsApp vs galería privada"],
      ["/bodas/revelado-fotos-boda", "Momento del revelado"],
    ],
    faqs: [
      {
        question: "¿Qué es una galería privada de boda?",
        answer:
          "Es un espacio privado donde la pareja reúne fotos, vídeos y audios subidos por invitados mediante un QR.",
      },
      {
        question: "¿Quién puede acceder a la galería?",
        answer:
          "Solo las personas con el enlace o QR del evento, según la configuración y dinámica que elija la pareja.",
      },
      {
        question: "¿Es mejor que un grupo de WhatsApp?",
        answer:
          "Para conservar recuerdos, sí. La galería centraliza el contenido y evita que fotos y vídeos se pierdan entre mensajes.",
      },
    ],
    sections: [
      [
        "Para qué sirve una galería privada de boda",
        [
          "Una galería privada de boda sirve para reunir en un único lugar los recuerdos que capturan los invitados. No sustituye al fotógrafo profesional; añade una capa más íntima y espontánea de la celebración.",
          "La pareja recibe fotos de mesas, vídeos de la barra, audios de familiares, escenas divertidas de fiesta y pequeños momentos que no siempre aparecen en el reportaje oficial. Todo queda asociado al mismo evento.",
          "La privacidad es importante porque una boda no es contenido público. Una galería privada permite compartir la dinámica con invitados sin convertir cada recuerdo en una publicación abierta o en un grupo caótico.",
        ],
      ],
      [
        "Qué diferencia hay frente a WhatsApp o Drive",
        [
          "WhatsApp es útil para avisar, pero no para ordenar recuerdos. Las fotos se mezclan con conversaciones, se pierden vídeos y la pareja termina descargando archivos de distintos chats.",
          "Drive puede servir como almacenamiento, pero no está pensado para que un invitado participe en segundos desde la pista de baile. Los permisos, carpetas y cuentas pueden frenar subidas.",
          "Una galería privada con QR resuelve la intención del evento: escanear, subir y centralizar. Menos pasos para el invitado y más orden para la pareja.",
        ],
      ],
      [
        "Cómo conseguir que la galería tenga contenido real",
        [
          "La galería necesita visibilidad. El QR debe aparecer en entrada, mesas, barra, photocall y zona de baile. También conviene repetir una frase corta que explique la acción: subir fotos, vídeos o mensajes para el revelado.",
          "La participación crece cuando el QR está cerca del momento. Si un invitado acaba de grabar un baile o una escena divertida, necesita encontrar el QR sin preguntar.",
          "También ayuda mostrar la dinámica con naturalidad, no como una obligación. El mensaje debe sonar cercano: “Comparte tu mejor momento” funciona mejor que instrucciones largas.",
        ],
      ],
      [
        "Cómo encaja Revelao",
        [
          "Revelao crea esa galería privada y la conecta con un QR sencillo. Los invitados no instalan apps y pueden subir recuerdos desde el navegador del móvil.",
          "La pareja conserva fotos, vídeos y mensajes de audio en un espacio pensado para la boda. Después puede vivir el momento del revelado y descubrir la celebración desde muchos puntos de vista.",
          "El resultado es una memoria más completa: reportaje profesional por un lado, mirada de invitados por otro, y una galería privada que guarda lo espontáneo sin dispersarlo.",
        ],
      ],
    ],
  },
  "/bodas/recopilar-fotos-invitados": {
    cta: "Recopilar fotos de mis invitados",
    related: [
      ["/bodas/qr-fotos-boda", "QR para fotos de boda"],
      ["/bodas/checklist-fotos-invitados-boda", "Checklist fotos invitados"],
      ["/bodas/compartir-fotos-boda", "Compartir fotos de boda"],
    ],
    faqs: [
      {
        question: "¿Cómo recopilar fotos de invitados de boda?",
        answer:
          "La forma más sencilla es crear una galería privada con QR para que los invitados suban fotos, vídeos y audios durante la celebración.",
      },
      {
        question: "¿Cuándo pedir a los invitados que suban fotos?",
        answer:
          "Durante la boda, especialmente en cóctel, mesas, barra, photocall y fiesta, cuando el recuerdo acaba de ocurrir.",
      },
      {
        question: "¿Qué pasa si alguien se olvida?",
        answer:
          "Puedes enviar el enlace por WhatsApp después, pero el QR visible durante el evento aumenta mucho la participación inmediata.",
      },
    ],
    sections: [
      [
        "El reto de recopilar fotos de invitados",
        [
          "Recopilar fotos de invitados parece fácil hasta que la boda termina. Cada persona tiene sus imágenes en el carrete, algunos vídeos pesan demasiado, otros se envían por chats privados y muchas escenas nunca llegan a la pareja.",
          "La solución no es insistir más al día siguiente, sino preparar un flujo claro antes del evento. Si los invitados saben dónde subir sus recuerdos mientras los están viviendo, se pierde mucho menos contenido.",
          "Un QR para fotos de boda convierte esa intención en una acción sencilla: escanear, elegir y subir.",
        ],
      ],
      [
        "Qué momentos suelen aportar los invitados",
        [
          "Los invitados capturan escenas muy distintas a las del fotógrafo: una mesa brindando, amigos cantando, niños jugando, detalles de decoración, vídeos de la pista y reacciones espontáneas que ocurren lejos de los focos.",
          "Esas fotos no siempre son perfectas, pero suelen tener verdad. Muestran la boda desde dentro, con cercanía y humor.",
          "También pueden aportar mensajes de audio. Una felicitación grabada en el momento puede emocionar más que una foto formal porque conserva la voz y la intención de quien la deja.",
        ],
      ],
      [
        "Plan práctico para no perder fotos",
        [
          "Primero, crea la galería y prueba el QR antes de imprimir nada. Segundo, colócalo en varios soportes: cartel, mesas, barra y photocall. Tercero, usa una frase corta y repetida en todos los materiales.",
          "Durante la boda, pide un recordatorio breve en el cóctel o antes del baile. No hace falta interrumpir: basta con una frase que recuerde a los invitados que pueden subir el contenido que acaban de capturar.",
          "Después de la boda, envía el enlace una vez más para recuperar fotos pendientes. Pero el grueso de la participación debería ocurrir durante la celebración.",
        ],
      ],
      [
        "Por qué centralizarlo en una galería privada",
        [
          "Centralizar evita que la pareja revise veinte conversaciones y carpetas. Todo llega al mismo espacio, con menos riesgo de olvidar vídeos, audios o fotos enviadas a otra persona.",
          "También mejora la experiencia emocional. En lugar de recibir archivos sueltos durante días, la pareja puede descubrir la galería con calma y revivir la boda desde muchas miradas.",
          "Revelao está diseñado para ese proceso: QR visible, subida sin app, galería privada y revelado posterior.",
        ],
      ],
    ],
  },
};

const weddingSeoStrategy = {
  "/bodas/qr-fotos-boda": {
    primaryKeyword: "qr fotos boda",
    role: "pilar",
    keywords: "qr fotos boda, qr para fotos de boda, fotos boda invitados qr",
  },
  "/bodas/codigo-qr-boda": {
    primaryKeyword: "codigo qr boda",
    role: "soporte",
    keywords: "codigo qr boda, codigo qr para bodas, crear qr boda",
  },
  "/bodas/cartel-qr-boda": {
    primaryKeyword: "cartel qr boda",
    role: "soporte",
    keywords: "cartel qr boda, cartel para qr boda, texto cartel qr boda",
  },
  "/bodas/tarjetas-qr-boda": {
    primaryKeyword: "tarjetas qr boda",
    role: "soporte",
    keywords: "tarjetas qr boda, tarjetas con qr boda, qr mesas boda",
  },
  "/bodas/whatsapp-fotos-boda": {
    primaryKeyword: "whatsapp fotos boda",
    role: "soporte",
    keywords: "whatsapp fotos boda, fotos boda por whatsapp, alternativa whatsapp boda",
  },
  "/bodas/whatsapp-vs-galeria-privada-fotos-boda": {
    primaryKeyword: "whatsapp vs galeria privada fotos boda",
    role: "comparativa",
    keywords: "whatsapp vs galeria privada fotos boda, alternativa whatsapp fotos boda, galeria privada fotos boda",
  },
  "/bodas/google-drive-vs-qr-boda": {
    primaryKeyword: "google drive vs qr boda",
    role: "comparativa",
    keywords: "google drive vs qr boda, google drive fotos boda, qr boda fotos invitados",
  },
  "/bodas/app-fotos-boda-vs-qr-sin-app": {
    primaryKeyword: "app fotos boda vs qr sin app",
    role: "comparativa",
    keywords: "app fotos boda vs qr sin app, app fotos boda, qr sin app boda",
  },
  "/bodas/fotografo-profesional-fotos-invitados-boda": {
    primaryKeyword: "fotografo profesional fotos invitados boda",
    role: "comparativa",
    keywords: "fotografo profesional fotos invitados boda, fotos invitados boda, combinar fotografo boda qr",
  },
  "/bodas/subir-fotos-boda-sin-app": {
    primaryKeyword: "subir fotos boda sin app",
    role: "soporte",
    keywords: "subir fotos boda sin app, compartir fotos boda sin app, invitados suben fotos boda",
  },
  "/bodas/revelado-fotos-boda": {
    primaryKeyword: "revelado fotos boda",
    role: "soporte",
    keywords: "revelado fotos boda, revelar fotos boda invitados, recuerdos boda revelado",
  },
  "/bodas/galeria-privada-boda": {
    primaryKeyword: "galeria privada boda",
    role: "soporte",
    keywords: "galeria privada boda, galeria fotos boda invitados, album privado boda",
  },
  "/bodas/recopilar-fotos-invitados": {
    primaryKeyword: "recopilar fotos invitados boda",
    role: "soporte",
    keywords: "recopilar fotos invitados boda, recoger fotos invitados boda, fotos invitados boda",
  },
  "/bodas/fotos-videos-audio-boda": {
    primaryKeyword: "fotos videos audio boda",
    role: "soporte",
    keywords: "fotos videos audio boda, videos boda invitados, mensajes audio boda",
  },
  "/bodas/album-colaborativo-boda": {
    primaryKeyword: "album colaborativo boda",
    role: "soporte",
    keywords: "album colaborativo boda, album fotos invitados boda, galeria colaborativa boda",
  },
  "/bodas/compartir-fotos-boda": {
    primaryKeyword: "compartir fotos boda",
    role: "soporte",
    keywords: "compartir fotos boda, compartir fotos invitados boda, enviar fotos boda",
  },
  "/bodas/app-fotos-boda": {
    primaryKeyword: "app fotos boda",
    role: "soporte",
    keywords: "app fotos boda, app para fotos de boda, qr sin app boda",
  },
  "/bodas/checklist-fotos-invitados-boda": {
    primaryKeyword: "checklist fotos boda",
    role: "soporte",
    keywords: "checklist fotos boda, checklist fotos invitados boda, lista fotos boda",
  },
};

const weddingClusterSupportLinks = [
  ["/bodas/cartel-qr-boda", "Cartel QR para boda"],
  ["/bodas/tarjetas-qr-boda", "Tarjetas QR para mesas e invitaciones"],
  ["/bodas/whatsapp-fotos-boda", "WhatsApp vs galería privada"],
  ["/bodas/whatsapp-vs-galeria-privada-fotos-boda", "Comparativa: WhatsApp vs galería privada"],
  ["/bodas/google-drive-vs-qr-boda", "Comparativa: Google Drive vs QR de boda"],
  ["/bodas/app-fotos-boda-vs-qr-sin-app", "Comparativa: app de fotos vs QR sin app"],
  ["/bodas/fotografo-profesional-fotos-invitados-boda", "Fotógrafo profesional + fotos de invitados"],
  ["/bodas/subir-fotos-boda-sin-app", "Subir fotos de boda sin app"],
  ["/bodas/revelado-fotos-boda", "Momento del revelado de fotos"],
  ["/bodas/galeria-privada-boda", "Galería privada para boda"],
];

const renderWeddingClusterLinks = (pagePath) => {
  const strategy = weddingSeoStrategy[pagePath];
  if (!strategy) return "";
  const links =
    strategy.role === "pilar"
      ? weddingClusterSupportLinks.filter(([href]) => href !== pagePath)
      : [["/bodas/qr-fotos-boda", "Guía pilar: QR para fotos de boda"], ...weddingClusterSupportLinks.filter(([href]) => href !== pagePath)];
  const intro =
    strategy.role === "pilar"
      ? "Esta es la página pilar del cluster sobre QR para fotos de boda. Desde aquí puedes profundizar en carteles, tarjetas, alternativas a WhatsApp, subida sin app y revelado."
      : `Esta página trabaja la intención específica “${strategy.primaryKeyword}”. Para la guía general del cluster, empieza por la página pilar de QR para fotos de boda.`;

  return (
    `<section><h2>Cluster SEO de bodas y QR</h2><p>${escapeHtml(intro)}</p><ul>` +
    links.map(([href, label]) => `<li><a href="${href}">${escapeHtml(label)}</a></li>`).join("") +
    "</ul></section>"
  );
};

const renderLongWeddingLandingBody = ({ h1, description, pagePath }) => {
  const content = weddingLongLandingContent[pagePath];
  if (!content) return null;
  const relatedLinks = content.related
    .map(([href, label]) => `<li><a href="${href}">${escapeHtml(label)}</a></li>`)
    .join("");
  return (
    `<main><article><h1>${escapeHtml(h1)}</h1><p>${escapeHtml(description)}</p>` +
    content.sections
      .map(
        ([heading, paragraphs]) =>
          `<h2>${escapeHtml(heading)}</h2>${paragraphs
            .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
            .join("")}`,
      )
      .join("") +
    `<h2>Cómo encaja Revelao</h2><p>Revelao permite crear una galería privada de boda con QR para que los invitados suban fotos, vídeos y mensajes de audio desde el móvil. Todo queda centralizado y puede descubrirse en el momento del revelado, sin depender de apps ni de chats dispersos.</p>` +
    `<p><a href="https://acceso.revelao.cam/nuevoeventodemo2">${escapeHtml(content.cta)}</a></p>` +
    `<h2>Preguntas frecuentes</h2>${content.faqs
      .map(
        (faq) =>
          `<h3>${escapeHtml(faq.question)}</h3><p>${escapeHtml(faq.answer)}</p>`,
      )
      .join("")}` +
    `<h2>También te puede interesar</h2><ul>${relatedLinks}</ul>` +
    renderWeddingClusterLinks(pagePath) +
    "</article></main>"
  );
};

const weddingSeoPages = [
  [
    "/bodas/qr-fotos-boda",
    "QR para fotos de boda: consigue todas las fotos de tus invitados",
    "Crea un QR para que tus invitados suban fotos, vídeos y audios de la boda sin apps. Reúne todos los recuerdos en una galería privada.",
    "qr boda, fotos boda qr, qr para fotos de boda, codigo qr boda",
    "QR para fotos de boda",
  ],
  [
    "/bodas/galeria-privada-boda",
    "Galería privada para boda: fotos y vídeos de invitados en un QR",
    "Crea una galería privada para tu boda y deja que los invitados suban fotos, vídeos y audios escaneando un QR sencillo.",
    "galeria privada boda, galeria fotos boda invitados, album colaborativo boda",
    "Galería privada para boda",
  ],
  [
    "/bodas/recopilar-fotos-invitados",
    "Recopilar fotos de invitados: cómo no perder recuerdos de tu boda",
    "Recopila fotos de invitados con QR, evita perseguir a nadie por WhatsApp y guarda recuerdos espontáneos en una galería privada.",
    "recopilar fotos invitados boda, compartir fotos boda, fotos invitados boda",
    "Recopilar fotos de invitados",
  ],
  [
    "/bodas/fotos-videos-audio-boda",
    "Fotos, vídeos y audios de boda: guarda todo lo que tus invitados viven",
    "Recoge fotos, vídeos y mensajes de audio de tus invitados con QR y descubre la boda desde muchas miradas.",
    "fotos boda qr, videos boda invitados, mensajes audio boda, recuerdos de boda",
    "Fotos, vídeos y audios de boda",
    "Convierte cada móvil de los invitados en una pequeña cámara documental de la boda.",
    "Es ideal para parejas que quieren conservar no solo imágenes bonitas, sino también voces, movimiento y felicitaciones espontáneas.",
  ],
  [
    "/bodas/codigo-qr-boda",
    "Código QR para boda: cómo conseguir todas las fotos de tus invitados",
    "Usa un código QR en tu boda para que los invitados suban fotos, vídeos y audios sin apps, grupos ni complicaciones.",
    "codigo qr boda, qr boda, qr para fotos de boda, fotos invitados boda",
    "Código QR para boda",
    "Un código QR de boda funciona como una puerta directa a la galería privada del evento.",
    "La clave está en colocarlo donde los invitados ya prestan atención: bienvenida, mesas, barra, photocall y zona de baile.",
  ],
  [
    "/bodas/album-colaborativo-boda",
    "Álbum colaborativo de boda: reúne fotos de todos tus invitados",
    "Crea un álbum colaborativo de boda con fotos, vídeos y mensajes de audio subidos por invitados desde el móvil.",
    "album colaborativo boda, galeria fotos boda invitados, compartir fotos boda",
    "Álbum colaborativo de boda",
    "Un álbum colaborativo permite que la boda se recuerde desde muchas miradas, no solo desde la cámara principal.",
    "Cada invitado aporta escenas distintas: mesas, abrazos, bailes, risas, brindis y pequeños momentos que completan la historia.",
  ],
  [
    "/bodas/subir-fotos-boda-sin-app",
    "Subir fotos de boda sin app: invitados participan en segundos",
    "Haz que tus invitados suban fotos de la boda sin instalar apps: escanean un QR y comparten sus recuerdos al momento.",
    "subir fotos boda sin app, fotos boda qr, compartir fotos boda",
    "Subir fotos de boda sin app",
    "Cuanta menos fricción tenga el proceso, más invitados participan y más recuerdos llegan a la pareja.",
    "Eliminar instalaciones, registros y pasos innecesarios es una de las mejores formas de aumentar la participación.",
  ],
  [
    "/bodas/compartir-fotos-boda",
    "Compartir fotos de boda: cómo reunirlas sin perder archivos",
    "Comparte y reúne fotos de boda en una galería privada con QR, sin conversaciones dispersas ni recuerdos perdidos.",
    "compartir fotos boda, recopilar fotos invitados boda, galeria privada boda",
    "Compartir fotos de boda",
    "Compartir fotos después de una boda suele acabar en mensajes sueltos, carpetas incompletas y archivos que nunca llegan.",
    "Un flujo con QR centraliza el momento de compartir mientras la emoción sigue viva y la participación es más natural.",
  ],
  [
    "/bodas/revelado-fotos-boda",
    "Revelado de fotos de boda: descubre lo que tus invitados vivieron",
    "Convierte las fotos, vídeos y audios de invitados en un revelado emocionante para revivir la boda desde dentro.",
    "revelado fotos boda, recuerdos de boda, galeria privada boda",
    "Revelado de fotos de boda",
    "El revelado transforma una galería en una experiencia: descubrir después lo que pasó desde la mirada de todos.",
    "Funciona especialmente bien porque la pareja ya no está pendiente de organizar nada, solo de revivir el día con calma.",
  ],
  [
    "/bodas/cartel-qr-boda",
    "Cartel QR para boda: dónde ponerlo para recibir más fotos",
    "Crea un cartel QR de boda claro y visible para que los invitados suban fotos, vídeos y audios sin dudas.",
    "cartel qr boda, codigo qr boda, qr para fotos de boda",
    "Cartel QR para boda",
    "Un buen cartel QR debe ser visible, claro y estar cerca de los momentos donde los invitados ya tienen el móvil en la mano.",
    "El texto debe pedir una acción concreta, como subir fotos de la boda o dejar un recuerdo para el revelado.",
  ],
  [
    "/bodas/tarjetas-qr-boda",
    "Tarjetas QR para boda: consigue fotos desde mesas e invitaciones",
    "Usa tarjetas QR en mesas, invitaciones y detalles para que los invitados compartan recuerdos durante la boda.",
    "tarjetas qr boda, codigo qr boda, compartir fotos boda",
    "Tarjetas QR para boda",
    "Las tarjetas QR funcionan muy bien en mesas, invitaciones, minutas y pequeños detalles porque acompañan al invitado de forma natural.",
    "Son una forma discreta de recordar la dinámica sin interrumpir el ritmo de la celebración.",
  ],
  [
    "/bodas/app-fotos-boda",
    "App de fotos para boda: por qué un QR sin app recibe más recuerdos",
    "Compara una app de fotos para boda con una galería QR sin app y descubre qué opción facilita más subidas.",
    "app fotos boda, subir fotos boda sin app, fotos boda qr",
    "App de fotos para boda vs QR sin app",
    "Una app puede parecer completa, pero muchos invitados no quieren descargar nada durante una boda.",
    "Un QR sin app reduce pasos y hace que compartir recuerdos sea más rápido, especialmente en momentos sociales como el cóctel o la fiesta.",
  ],
  [
    "/bodas/whatsapp-fotos-boda",
    "Fotos de boda por WhatsApp: por qué pierdes recuerdos importantes",
    "Pedir fotos de boda por WhatsApp parece cómodo, pero mezcla chats, dispersa archivos y deja recuerdos sin enviar.",
    "whatsapp fotos boda, compartir fotos boda, galeria privada boda",
    "Fotos de boda por WhatsApp",
    "WhatsApp es útil para hablar, pero no siempre es el mejor lugar para conservar los recuerdos de una boda.",
    "Una galería privada evita que las fotos se mezclen con conversaciones y permite reunir también vídeos y mensajes de audio.",
  ],
  [
    "/bodas/checklist-fotos-invitados-boda",
    "Checklist fotos boda: qué hacer para no perder fotos de invitados",
    "Sigue una checklist práctica con QR, carteles, recordatorios y momentos clave para recopilar más fotos de invitados.",
    "checklist fotos boda, recopilar fotos invitados boda, fotos invitados boda",
    "Checklist para recopilar fotos de invitados",
    "Preparar el sistema antes de la boda evita tener que perseguir fotos cuando el evento ya ha pasado.",
    "La mejor estrategia combina QR visible, mensajes claros, recordatorios en momentos clave y una galería privada fácil de usar.",
  ],
  [
    "/bodas/whatsapp-vs-galeria-privada-fotos-boda",
    "WhatsApp vs galería privada: qué usar para fotos de boda",
    "Compara WhatsApp con una galería privada con QR y elige la opción que evita perder fotos de invitados.",
    "whatsapp vs galeria privada fotos boda",
    "WhatsApp vs galería privada para fotos de boda",
  ],
  [
    "/bodas/google-drive-vs-qr-boda",
    "Google Drive vs QR de boda: cómo recibir más fotos sin líos",
    "Compara Google Drive con un QR de boda y evita carpetas confusas, permisos y fotos de invitados perdidas.",
    "google drive vs qr boda",
    "Google Drive vs QR de boda",
  ],
  [
    "/bodas/app-fotos-boda-vs-qr-sin-app",
    "App de fotos de boda vs QR sin app: qué consigue más participación",
    "Compara una app de fotos con un QR sin app y descubre qué opción logra que más invitados suban recuerdos.",
    "app fotos boda vs qr sin app",
    "App de fotos de boda vs QR sin app",
  ],
  [
    "/bodas/fotografo-profesional-fotos-invitados-boda",
    "Fotógrafo profesional + fotos de invitados: la combinación perfecta",
    "Combina el reportaje profesional de boda con fotos, vídeos y audios de invitados recopilados con QR.",
    "fotografo profesional fotos invitados boda",
    "Fotógrafo profesional + fotos de invitados",
  ],
].map(([pagePath, title, description, keywords, h1, intro, useCase]) => ({
  path: pagePath,
  title,
  description,
  keywords: weddingSeoStrategy[pagePath]?.keywords || keywords,
  image: "/og-image.jpg",
  bodyHtml:
    renderLongWeddingLandingBody({ h1, description, pagePath }) ||
    (`<main><article><h1>${escapeHtml(h1)}</h1><p>${escapeHtml(description)}</p>` +
      `<p>${escapeHtml(intro)}</p>` +
      "<h2>Cómo ayuda Revelao</h2><p>Los invitados escanean un QR y suben fotos, vídeos y mensajes de audio desde el móvil, sin instalar aplicaciones. Todo queda reunido en una galería privada que puede revelarse después de la boda.</p>" +
      `<h2>Cuándo tiene más sentido</h2><p>${escapeHtml(useCase)}</p>` +
      "<h2>Por qué mejora el recuerdo de la boda</h2><p>Además de las fotos oficiales, la pareja recibe momentos espontáneos desde muchas miradas: mesas, baile, cóctel, discursos y mensajes personales.</p>" +
      "<h2>Qué puedes recopilar</h2><ul><li>Fotos espontáneas de invitados durante la ceremonia, el cóctel y la fiesta.</li><li>Vídeos cortos de brindis, bailes, discursos y momentos inesperados.</li><li>Mensajes de audio con felicitaciones y recuerdos personales.</li></ul>" +
      "<h2>Dónde colocar el QR</h2><p>Funciona especialmente bien en la entrada, las mesas, el seating plan, la barra, el photocall y la zona de baile. Cuanto más natural sea encontrarlo, más recuerdos suben los invitados.</p>" +
      "<h2>Por qué no usar solo WhatsApp</h2><p>Los grupos de WhatsApp mezclan conversaciones, reducen la calidad de algunos archivos y dejan muchas fotos perdidas en móviles personales. Una galería privada centraliza todo y permite revivir la boda con calma.</p>" +
      renderWeddingClusterLinks(pagePath) +
      "</article></main>"),
  schema: {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: title,
        description,
        url: `${siteUrl}${pagePath}`,
        publisher: baseSchema,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: `${siteUrl}/` },
          { "@type": "ListItem", position: 2, name: "Bodas", item: `${siteUrl}/eventos/bodas` },
          { "@type": "ListItem", position: 3, name: h1, item: `${siteUrl}${pagePath}` },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: (weddingLongLandingContent[pagePath]?.faqs || defaultWeddingFaqs).map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  },
}));

const getLocalBlogPosts = () => {
  const dailyDir = path.join(rootDir, "posts", "daily");
  if (!fs.existsSync(dailyDir)) return [];
  return fs
    .readdirSync(dailyDir)
    .filter((fileName) => fileName.endsWith(".md"))
    .flatMap((fileName) => {
      const parsed = parseFrontmatter(fs.readFileSync(path.join(dailyDir, fileName), "utf8"));
      if (!parsed) return [];
      return [
        {
          slug: parsed.meta.slug,
          title: parsed.meta.title,
          excerpt: parsed.meta.excerpt,
          image: parsed.meta.image,
          tags: parsed.meta.tags || [],
          contentHtml: markdownToHtml(parsed.markdown),
          publishedAt: parsed.meta.publishDate,
          updatedAt: parsed.meta.publishDate,
        },
      ];
    })
    .filter((post) => post.slug && post.title && post.excerpt);
};

const getSupabaseBlogPosts = async () => {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anonKey) return [];
  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/blog_posts?select=slug,title,excerpt,content_html,image_url,tags,created_at,updated_at&lang=eq.es&order=created_at.desc`,
      { headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` } },
    );
    if (!response.ok) return [];
    const rows = await response.json();
    return rows.map((row) => ({
      slug: getCanonicalBlogSlug(row.slug),
      title: row.title,
      excerpt: row.excerpt,
      image: row.image_url,
      tags: row.tags || [],
      contentHtml: sanitizeBlogHtml(row.content_html),
      publishedAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  } catch {
    return [];
  }
};

const getBlogPages = async () => {
  const bySlug = new Map();
  for (const post of getLocalBlogPosts()) bySlug.set(post.slug, post);
  for (const post of await getSupabaseBlogPosts()) bySlug.set(post.slug, post);
  return [...bySlug.values()].map((post) => {
    const description = post.excerpt || stripHtml(post.contentHtml).slice(0, 155);
    return {
      path: `/blog/${post.slug}`,
      title: `${post.title} | Revelao.cam`,
      description,
      keywords: Array.isArray(post.tags) ? post.tags.join(", ") : "",
      image: isIndexableImage(post.image) ? post.image : "/og-image.jpg",
      ogType: "article",
      lastmod: toIsoDate(post.updatedAt),
      bodyHtml: `<main><article><h1>${escapeHtml(post.title)}</h1>${isIndexableImage(post.image) ? `<img src="${escapeHtml(post.image)}" alt="${escapeHtml(post.title)}" loading="eager" decoding="async" fetchpriority="high" />` : ""}${post.contentHtml}</article></main>`,
      schema: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "BlogPosting",
            headline: post.title,
            description,
            image: getAbsoluteImage(post.image),
            mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
            author: baseSchema,
            publisher: baseSchema,
            datePublished: toIsoDate(post.publishedAt || post.updatedAt),
            dateModified: toIsoDate(post.updatedAt),
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Inicio", item: `${siteUrl}/` },
              { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog` },
              { "@type": "ListItem", position: 3, name: post.title, item: `${siteUrl}/blog/${post.slug}` },
            ],
          },
        ],
      },
    };
  });
};

const blogHubCategories = [
  {
    name: "QR en bodas",
    href: "/bodas/codigo-qr-boda",
    description: "Guías para crear, colocar y explicar códigos QR en bodas sin complicar la experiencia de los invitados.",
  },
  {
    name: "Fotos de invitados",
    href: "/bodas/qr-fotos-boda",
    description: "Ideas para recopilar fotos espontáneas, vídeos cortos y recuerdos que no siempre aparecen en el reportaje oficial.",
  },
  {
    name: "Alternativas a WhatsApp",
    href: "/bodas/whatsapp-fotos-boda",
    description: "Comparativas y consejos para no perder archivos en grupos, chats privados o mensajes enviados días después.",
  },
  {
    name: "Mensajes de audio",
    href: "/bodas/mensajes-audio-boda",
    description: "Cómo recoger felicitaciones, voces de familiares y anécdotas que hacen más emocionante el momento del revelado.",
  },
];

const blogHubInternalLinks = [
  ["/bodas/cartel-qr-boda", "Cartel QR para boda"],
  ["/bodas/subir-fotos-boda-sin-app", "Subir fotos de boda sin app"],
  ["/bodas/galeria-privada-boda", "Galería privada para boda"],
  ["/bodas/checklist-fotos-invitados-boda", "Checklist para no perder fotos"],
  ["/bodas/revelado-fotos-boda", "El momento del revelado"],
  ["/bodas/wedding-planner-qr-boda", "QR para wedding planners"],
];

const getBlogIndexPage = (blogPages) => {
  const posts = blogPages.slice(0, 12);
  const latestPostsHtml = posts
    .map(
      (page) =>
        `<article><h3><a href="${page.path}">${escapeHtml(page.title.replace(" | Revelao.cam", ""))}</a></h3><p>${escapeHtml(page.description)}</p></article>`,
    )
    .join("");
  const categoriesHtml = blogHubCategories
    .map(
      (category) =>
        `<li><h3><a href="${category.href}">${escapeHtml(category.name)}</a></h3><p>${escapeHtml(category.description)}</p></li>`,
    )
    .join("");
  const internalLinksHtml = blogHubInternalLinks
    .map(([href, label]) => `<li><a href="${href}">${escapeHtml(label)}</a></li>`)
    .join("");

  return {
    path: "/blog",
    title: "Blog de bodas con QR, fotos de invitados y recuerdos | Revelao.cam",
    description:
      "Guías sobre QR para bodas, galerías privadas, fotos de invitados, vídeos, mensajes de audio y el momento del revelado.",
    keywords: "blog bodas qr, fotos boda qr, qr boda, recopilar fotos invitados boda",
    image: "/og-image.jpg",
    bodyHtml:
      "<main><article>" +
      "<h1>Blog de bodas con QR, fotos de invitados y recuerdos</h1>" +
      "<p>El blog de Revelao reúne guías prácticas para parejas, wedding planners y espacios de celebración que quieren guardar más recuerdos reales de una boda. Aquí encontrarás ideas para usar códigos QR, recopilar fotos de invitados, recibir vídeos, conservar mensajes de audio y preparar un momento de revelado emocionante después del evento.</p>" +
      "<p>El objetivo no es subir contenido por subir. Cada artículo responde a una duda concreta: dónde colocar el QR, cómo conseguir que más invitados participen, qué hacer para no depender de WhatsApp, cómo explicar la dinámica en un cartel y cómo convertir los móviles de la boda en una memoria compartida.</p>" +
      "<h2>Categorías principales</h2><ul>" +
      categoriesHtml +
      "</ul>" +
      "<h2>Últimos artículos del blog</h2>" +
      latestPostsHtml +
      "<h2>Guías SEO sobre bodas, QR y galerías privadas</h2>" +
      "<p>Una boda se vive desde muchos puntos de vista. El fotógrafo profesional captura los momentos esenciales, pero los invitados guardan escenas espontáneas: una mesa que se ríe, un vídeo de la barra, un abrazo antes del baile, una felicitación en audio o una reacción que los novios no pudieron ver en directo.</p>" +
      "<p>Por eso Revelao trabaja alrededor de una idea sencilla: hacer que compartir recuerdos sea tan fácil como escanear un QR. Sin instalar apps, sin perseguir a los invitados días después y sin mezclar fotos importantes en conversaciones de WhatsApp. La galería privada centraliza fotos, vídeos y mensajes de audio para que la pareja pueda descubrirlos con calma.</p>" +
      "<p>Si estás organizando una boda, empieza por decidir dónde aparecerá el QR: entrada, seating plan, mesas, barra, photocall y zona de baile. Después, acompáñalo con un mensaje corto y repetido en todos los soportes. Cuanto más claro sea el gesto, más recuerdos llegarán al revelado.</p>" +
      "<h2>Landings recomendadas</h2><ul>" +
      internalLinksHtml +
      "</ul>" +
      '<p><a href="https://acceso.revelao.cam/nuevoeventodemo2">Crear mi evento con QR</a></p>' +
      "</article></main>",
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Blog",
          name: "Blog de Revelao",
          description: "Consejos sobre bodas, QR, fotos de invitados y galerías privadas.",
          url: `${siteUrl}/blog`,
          publisher: baseSchema,
          blogPost: posts.map((page) => ({
            "@type": "BlogPosting",
            headline: page.title.replace(" | Revelao.cam", ""),
            url: `${siteUrl}${page.path}`,
            description: page.description,
          })),
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Inicio", item: `${siteUrl}/` },
            { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog` },
          ],
        },
      ],
    },
  };
};

const writeSitemap = (pages) => {
  const entries = pages
    .map(
      (page) => {
        const lastmod = page.lastmod ? `\n    <lastmod>${page.lastmod}</lastmod>` : "";
        return `  <url>\n    <loc>${siteUrl}${page.path === "/" ? "/" : page.path}</loc>${lastmod}\n  </url>`;
      },
    )
    .join("\n");
  fs.writeFileSync(
    path.join(distDir, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`,
  );
};

const writeNotFoundPage = (template) => {
  const page = {
    path: "/404",
    title: "Página no encontrada | Revelao.cam",
    description: "La página que buscas no existe o ha cambiado de dirección.",
    keywords: "",
    robots: "noindex, nofollow",
    image: "/og-image.jpg",
    bodyHtml:
      '<main><article><h1>404</h1><p>La página que buscas no existe o ha cambiado de dirección.</p><p><a href="/">Volver a Revelao.cam</a></p></article></main>',
    schema: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Página no encontrada",
      url: `${siteUrl}/404`,
    },
  };
  fs.writeFileSync(path.join(distDir, "404.html"), renderPage(template, page));
};

const main = async () => {
  loadEnvFile(path.join(rootDir, ".env"));
  loadEnvFile(path.join(rootDir, ".env.local"));
  if (!fs.existsSync(templatePath)) {
    throw new Error("No existe dist/index.html. Ejecuta vite build antes de generar SEO.");
  }
  const template = fs.readFileSync(templatePath, "utf8");
  const blogPages = await getBlogPages();
  const pages = [
    ...landingPages,
    testimonialsPage,
    ...legalPages,
    ...captainsClusterPages,
    ...useCasePages,
    ...weddingSeoPages,
    getBlogIndexPage(blogPages),
    ...blogPages,
  ];
  for (const page of pages) writePage(template, page);
  for (const page of nonIndexablePages) writePage(template, page);
  writeNotFoundPage(template);
  writeSitemap(pages);
  console.log(`Generated SEO HTML for ${pages.length} indexable routes and ${nonIndexablePages.length} private routes.`);
};

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
