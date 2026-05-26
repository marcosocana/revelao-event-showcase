import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const rootDir = process.cwd();
const distDir = path.join(rootDir, "dist");
const templatePath = path.join(distDir, "index.html");
const siteUrl = "https://revelao.cam";

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
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');
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
  const canonical = `${siteUrl}${page.path === "/" ? "/" : page.path}`;
  const image = page.image?.startsWith("http") ? page.image : `${siteUrl}${page.image || "/og-image.jpg"}`;
  const jsonLd = JSON.stringify(page.schema);
  let html = template;
  html = html.replace(/<html lang="[^"]*">/, '<html lang="es">');
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(page.title)}</title>`);
  html = setTag(html, /<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${escapeHtml(page.description)}" />`);
  html = setTag(html, /<meta name="keywords" content="[^"]*" \/>/, `<meta name="keywords" content="${escapeHtml(page.keywords || "")}" />`);
  html = setTag(html, /<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${canonical}" />`);
  html = setTag(html, /<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${escapeHtml(page.title)}" />`);
  html = setTag(html, /<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${escapeHtml(page.description)}" />`);
  html = setTag(html, /<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${canonical}" />`);
  html = setTag(html, /<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="${image}" />`);
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
};

const landingPages = [
  {
    path: "/",
    title: "QR para bodas y eventos: fotos, vídeos y audios sin app | Revelao.cam",
    description:
      "Crea una galería privada con QR para tu boda o evento. Tus invitados suben fotos, vídeos y mensajes de audio sin app y todo se revela después.",
    keywords: "qr boda, fotos boda qr, galeria privada boda, compartir fotos boda, subir fotos boda sin app",
    image: "/og-image.jpg",
    bodyHtml:
      '<main><h1>QR para bodas y eventos con fotos, vídeos y audios sin app</h1><p>Revelao.cam crea una galería privada para que los invitados suban recuerdos desde el móvil escaneando un QR.</p><h2>Especialmente pensado para bodas</h2><p>Reúne fotos espontáneas, vídeos y mensajes de audio en una experiencia sencilla y privada con momento de revelado.</p></main>',
    schema: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Revelao.cam",
      url: siteUrl,
      publisher: baseSchema,
    },
  },
  {
    path: "/evento-qr",
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
];

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
  bodyHtml: `<main><h1>${escapeHtml(title)}</h1><p>${escapeHtml(description)}</p><h2>Cómo funciona</h2><p>Crea el evento, comparte el QR y deja que los invitados suban recuerdos desde su móvil.</p></main>`,
  schema: {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    url: `${siteUrl}/eventos/${slug}`,
    publisher: baseSchema,
  },
}));

const weddingSeoPages = [
  [
    "/bodas/qr-fotos-boda",
    "QR para fotos de boda: galería privada sin app | Revelao.cam",
    "Crea un QR para que tus invitados suban fotos de la boda sin instalar apps. Todo queda reunido en una galería privada con momento de revelado.",
    "qr boda, fotos boda qr, qr para fotos de boda, codigo qr boda",
    "QR para fotos de boda",
  ],
  [
    "/bodas/galeria-privada-boda",
    "Galería privada para boda con QR | Revelao.cam",
    "Reúne fotos, vídeos y mensajes de audio de tu boda en una galería privada. Tus invitados participan con un QR sencillo y sin apps.",
    "galeria privada boda, galeria fotos boda invitados, album colaborativo boda",
    "Galería privada para boda",
  ],
  [
    "/bodas/recopilar-fotos-invitados",
    "Cómo recopilar fotos de invitados de boda sin perseguir a nadie",
    "Consejos para recopilar fotos de invitados de una boda con QR, evitar grupos de WhatsApp y no perder recuerdos espontáneos.",
    "recopilar fotos invitados boda, compartir fotos boda, fotos invitados boda",
    "Recopilar fotos de invitados",
  ],
  [
    "/bodas/fotos-videos-audio-boda",
    "Fotos, vídeos y mensajes de audio de boda con QR | Revelao.cam",
    "Guarda fotos, vídeos y mensajes de audio de tus invitados en una galería privada de boda creada con QR.",
    "fotos boda qr, videos boda invitados, mensajes audio boda, recuerdos de boda",
    "Fotos, vídeos y audios de boda",
  ],
].map(([pagePath, title, description, keywords, h1]) => ({
  path: pagePath,
  title,
  description,
  keywords,
  image: "/og-image.jpg",
  bodyHtml:
    `<main><article><h1>${escapeHtml(h1)}</h1><p>${escapeHtml(description)}</p>` +
    "<h2>Cómo ayuda Revelao</h2><p>Los invitados escanean un QR y suben fotos, vídeos y mensajes de audio desde el móvil, sin instalar aplicaciones. Todo queda reunido en una galería privada que puede revelarse después de la boda.</p>" +
    "<h2>Por qué mejora el recuerdo de la boda</h2><p>Además de las fotos oficiales, la pareja recibe momentos espontáneos desde muchas miradas: mesas, baile, cóctel, discursos y mensajes personales.</p>" +
    "<h2>Qué puedes recopilar</h2><ul><li>Fotos espontáneas de invitados durante la ceremonia, el cóctel y la fiesta.</li><li>Vídeos cortos de brindis, bailes, discursos y momentos inesperados.</li><li>Mensajes de audio con felicitaciones y recuerdos personales.</li></ul>" +
    "<h2>Dónde colocar el QR</h2><p>Funciona especialmente bien en la entrada, las mesas, el seating plan, la barra, el photocall y la zona de baile. Cuanto más natural sea encontrarlo, más recuerdos suben los invitados.</p>" +
    "<h2>Por qué no usar solo WhatsApp</h2><p>Los grupos de WhatsApp mezclan conversaciones, reducen la calidad de algunos archivos y dejan muchas fotos perdidas en móviles personales. Una galería privada centraliza todo y permite revivir la boda con calma.</p></article></main>",
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
        mainEntity: [
          {
            "@type": "Question",
            name: "¿Los invitados necesitan instalar una app?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. Los invitados escanean el QR y suben el contenido desde el navegador del móvil.",
            },
          },
          {
            "@type": "Question",
            name: "¿Se pueden subir vídeos y mensajes de audio además de fotos?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Sí. Revelao permite reunir fotos, vídeos y mensajes de audio en una galería privada.",
            },
          },
        ],
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
      `${supabaseUrl}/rest/v1/blog_posts?select=slug,title,excerpt,content_html,image_url,tags,updated_at&lang=eq.es&order=created_at.desc`,
      { headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` } },
    );
    if (!response.ok) return [];
    const rows = await response.json();
    return rows.map((row) => ({
      slug: row.slug,
      title: row.title,
      excerpt: row.excerpt,
      image: row.image_url,
      tags: row.tags || [],
      contentHtml: row.content_html,
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
      image: post.image,
      lastmod: toIsoDate(post.updatedAt),
      bodyHtml: `<main><article><h1>${escapeHtml(post.title)}</h1>${post.image ? `<img src="${escapeHtml(post.image)}" alt="${escapeHtml(post.title)}" />` : ""}${post.contentHtml}</article></main>`,
      schema: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "BlogPosting",
            headline: post.title,
            description,
            image: post.image?.startsWith("http") ? post.image : `${siteUrl}${post.image || ""}`,
            mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
            author: baseSchema,
            publisher: baseSchema,
            dateModified: toIsoDate(post.updatedAt),
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Inicio", item: `${siteUrl}/` },
              { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/#blog` },
              { "@type": "ListItem", position: 3, name: post.title, item: `${siteUrl}/blog/${post.slug}` },
            ],
          },
        ],
      },
    };
  });
};

const getBlogIndexPage = (blogPages) => ({
  path: "/blog",
  title: "Blog de bodas con QR, fotos de invitados y recuerdos | Revelao.cam",
  description:
    "Guías sobre QR para bodas, galerías privadas, fotos de invitados, vídeos, mensajes de audio y el momento del revelado.",
  keywords: "blog bodas qr, fotos boda qr, qr boda, recopilar fotos invitados boda",
  image: "/og-image.jpg",
  bodyHtml:
    "<main><h1>Blog de bodas con QR y recuerdos de invitados</h1><p>Ideas prácticas para recopilar fotos, vídeos y mensajes de audio de una boda con Revelao.</p><ul>" +
    blogPages
      .map((page) => `<li><a href="${page.path}">${escapeHtml(page.title.replace(" | Revelao.cam", ""))}</a><p>${escapeHtml(page.description)}</p></li>`)
      .join("") +
    "</ul></main>",
  schema: {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Blog de Revelao",
    description: "Consejos sobre bodas, QR, fotos de invitados y galerías privadas.",
    url: `${siteUrl}/blog`,
    publisher: baseSchema,
  },
});

const writeSitemap = (pages) => {
  const entries = pages
    .map(
      (page) =>
        `  <url>\n    <loc>${siteUrl}${page.path === "/" ? "/" : page.path}</loc>\n    <lastmod>${page.lastmod || new Date().toISOString().slice(0, 10)}</lastmod>\n    <changefreq>${page.path.startsWith("/blog/") ? "weekly" : "monthly"}</changefreq>\n    <priority>${page.path === "/" ? "1.0" : page.path.startsWith("/blog/") ? "0.7" : "0.8"}</priority>\n  </url>`,
    )
    .join("\n");
  fs.writeFileSync(
    path.join(distDir, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`,
  );
};

const main = async () => {
  loadEnvFile(path.join(rootDir, ".env"));
  loadEnvFile(path.join(rootDir, ".env.local"));
  if (!fs.existsSync(templatePath)) {
    throw new Error("No existe dist/index.html. Ejecuta vite build antes de generar SEO.");
  }
  const template = fs.readFileSync(templatePath, "utf8");
  const blogPages = await getBlogPages();
  const pages = [...landingPages, ...useCasePages, ...weddingSeoPages, getBlogIndexPage(blogPages), ...blogPages];
  for (const page of pages) writePage(template, page);
  writeSitemap(pages);
  console.log(`Generated SEO HTML for ${pages.length} routes.`);
};

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
