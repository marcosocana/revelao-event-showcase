import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const rootDir = process.cwd();
const postsDir = path.join(rootDir, "posts");
const dailyDir = path.join(postsDir, "daily");

const usage = `
Usage:
  npm run blog:publish -- posts/drafts/mi-post.md
  npm run blog:publish:today
  npm run blog:preview -- posts/drafts/mi-post.md

Required frontmatter:
  title, excerpt, image

Optional frontmatter:
  lang, slug, tags, publishDate
`;

const loadEnvFile = (filePath) => {
  if (!fs.existsSync(filePath)) return;

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
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

const normalizeDate = (date = new Date()) => date.toISOString().slice(0, 10);

const toSlug = (value) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

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
  if (!match) {
    throw new Error("El post necesita frontmatter entre --- al inicio del archivo.");
  }

  const meta = {};
  const lines = match[1].split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line.trim()) continue;

    const keyMatch = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (!keyMatch) {
      throw new Error(`Frontmatter no valido en la linea: ${line}`);
    }

    const [, key, inlineValue] = keyMatch;
    if (inlineValue.trim()) {
      meta[key] = parseScalar(inlineValue);
      continue;
    }

    const list = [];
    while (lines[index + 1]?.match(/^\s*-\s+/)) {
      index += 1;
      list.push(parseScalar(lines[index].replace(/^\s*-\s+/, "")));
    }
    meta[key] = list;
  }

  return { meta, markdown: match[2].trim() };
};

const escapeHtml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const renderInlineMarkdown = (value) => {
  let html = escapeHtml(value);
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  return html;
};

const getMimeType = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".webp") return "image/webp";
  if (ext === ".gif") return "image/gif";
  if (ext === ".svg") return "image/svg+xml";
  return "image/png";
};

const resolveLocalImagePath = (imageUrl, postDir) => {
  if (/^https?:\/\//.test(imageUrl) || imageUrl.startsWith("data:")) return null;
  if (imageUrl.startsWith("/")) return path.join(rootDir, "public", imageUrl);
  if (imageUrl.startsWith("public/")) return path.join(rootDir, imageUrl);
  return path.resolve(postDir, imageUrl);
};

const uploadImage = async ({ imageUrl, lang, postDir, supabaseUrl, anonKey }) => {
  const localPath = resolveLocalImagePath(imageUrl, postDir);
  if (!localPath) return imageUrl;
  if (!fs.existsSync(localPath)) {
    throw new Error(`No existe la imagen local: ${imageUrl} (${localPath})`);
  }

  const bytes = fs.readFileSync(localPath);
  const dataUrl = `data:${getMimeType(localPath)};base64,${bytes.toString("base64")}`;
  const response = await fetch(`${supabaseUrl}/functions/v1/blog-upload-image`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${anonKey}`,
      apikey: anonKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ lang, dataUrl, filename: path.basename(localPath) }),
  });

  if (!response.ok) {
    throw new Error(`No se pudo subir la imagen ${imageUrl}: ${response.status} ${await response.text()}`);
  }

  const data = await response.json();
  if (!data.publicUrl) {
    throw new Error(`Supabase no devolvio publicUrl para ${imageUrl}`);
  }
  return data.publicUrl;
};

const uploadMarkdownImages = async ({ markdown, lang, postDir, supabaseUrl, anonKey }) => {
  const imagePattern = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const replacements = [];

  for (const match of markdown.matchAll(imagePattern)) {
    replacements.push({
      fullMatch: match[0],
      alt: match[1],
      imageUrl: match[2],
    });
  }

  let nextMarkdown = markdown;
  for (const replacement of replacements) {
    const publicUrl = await uploadImage({
      imageUrl: replacement.imageUrl,
      lang,
      postDir,
      supabaseUrl,
      anonKey,
    });
    nextMarkdown = nextMarkdown.replace(
      replacement.fullMatch,
      `![${replacement.alt}](${publicUrl})`,
    );
  }

  return nextMarkdown;
};

const renderList = (lines, tag) => {
  const items = lines
    .map((line) => line.replace(/^(\s*[-*]|\s*\d+\.)\s+/, ""))
    .map((line) => `<li>${renderInlineMarkdown(line)}</li>`)
    .join("");
  return `<${tag}>${items}</${tag}>`;
};

const markdownToHtml = (markdown) => {
  const blocks = markdown.split(/\n{2,}/);
  const html = [];

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith("```")) {
      const code = trimmed.replace(/^```[a-zA-Z0-9_-]*\n?/, "").replace(/\n?```$/, "");
      html.push(`<pre><code>${escapeHtml(code)}</code></pre>`);
      continue;
    }

    const lines = trimmed.split(/\r?\n/);
    if (lines.every((line) => /^\s*[-*]\s+/.test(line))) {
      html.push(renderList(lines, "ul"));
      continue;
    }
    if (lines.every((line) => /^\s*\d+\.\s+/.test(line))) {
      html.push(renderList(lines, "ol"));
      continue;
    }
    if (lines.every((line) => /^>\s?/.test(line))) {
      const quote = lines.map((line) => line.replace(/^>\s?/, "")).join(" ");
      html.push(`<blockquote>${renderInlineMarkdown(quote)}</blockquote>`);
      continue;
    }

    const heading = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length;
      html.push(`<h${level}>${renderInlineMarkdown(heading[2])}</h${level}>`);
      continue;
    }

    html.push(`<p>${renderInlineMarkdown(lines.join(" "))}</p>`);
  }

  return html.join("\n");
};

const getPostPathForToday = () => {
  const today = normalizeDate();
  if (!fs.existsSync(dailyDir)) {
    throw new Error("No existe posts/daily. Crea posts diarios ahi o usa blog:publish con una ruta.");
  }

  const candidates = fs
    .readdirSync(dailyDir)
    .filter((fileName) => fileName.endsWith(".md"))
    .sort()
    .map((fileName) => path.join(dailyDir, fileName));

  const exactFile = candidates.find((filePath) => path.basename(filePath).startsWith(today));
  if (exactFile) return exactFile;

  for (const filePath of candidates) {
    const raw = fs.readFileSync(filePath, "utf8");
    const { meta } = parseFrontmatter(raw);
    if (String(meta.publishDate || "") === today) return filePath;
  }

  throw new Error(`No hay ningun post programado para hoy (${today}) en posts/daily.`);
};

const getArgs = () => {
  const args = process.argv.slice(2);
  return {
    dryRun: args.includes("--dry-run"),
    today: args.includes("--today"),
    help: args.includes("--help") || args.includes("-h"),
    filePath: args.find((arg) => !arg.startsWith("--")),
  };
};

const getPostPath = (args) => {
  if (args.today) return getPostPathForToday();
  if (!args.filePath || args.help) {
    console.log(usage.trim());
    process.exit(args.help ? 0 : 1);
  }
  return path.resolve(rootDir, args.filePath);
};

const requireString = (meta, key) => {
  const value = meta[key];
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Falta el campo obligatorio "${key}" en el frontmatter.`);
  }
  return value.trim();
};

const publishPost = async (post) => {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anonKey) {
    throw new Error("Faltan VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_KEY en .env.");
  }

  const response = await fetch(`${supabaseUrl}/functions/v1/blog-upsert`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${anonKey}`,
      apikey: anonKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(post),
  });

  if (!response.ok) {
    throw new Error(`Supabase respondio ${response.status}: ${await response.text()}`);
  }
};

const main = async () => {
  loadEnvFile(path.join(rootDir, ".env"));
  loadEnvFile(path.join(rootDir, ".env.local"));

  const args = getArgs();
  const postPath = getPostPath(args);
  if (!fs.existsSync(postPath)) {
    throw new Error(`No existe el archivo: ${postPath}`);
  }

  const { meta, markdown } = parseFrontmatter(fs.readFileSync(postPath, "utf8"));
  const title = requireString(meta, "title");
  const excerpt = requireString(meta, "excerpt");
  const image = requireString(meta, "image");
  const lang = String(meta.lang || "es").trim();
  const slug = String(meta.slug || toSlug(title)).trim();
  const tags = Array.isArray(meta.tags)
    ? meta.tags.map((tag) => String(tag).trim()).filter(Boolean)
    : String(meta.tags || "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

  if (!["es", "en", "it"].includes(lang)) {
    throw new Error('El campo "lang" debe ser "es", "en" o "it".');
  }
  if (!markdown) {
    throw new Error("El cuerpo Markdown del post esta vacio.");
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;
  if ((!supabaseUrl || !anonKey) && !args.dryRun) {
    throw new Error("Faltan VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_KEY en .env.");
  }

  const postDir = path.dirname(postPath);
  const imageUrl = args.dryRun
    ? image
    : await uploadImage({ imageUrl: image, lang, postDir, supabaseUrl, anonKey });
  const markdownWithUploadedImages = args.dryRun
    ? markdown
    : await uploadMarkdownImages({ markdown, lang, postDir, supabaseUrl, anonKey });

  const post = {
    lang,
    slug,
    title,
    excerpt,
    content_html: markdownToHtml(markdownWithUploadedImages),
    image_url: imageUrl,
    tags,
  };

  if (args.dryRun) {
    console.log(JSON.stringify(post, null, 2));
    return;
  }

  await publishPost(post);

  console.log(`Post publicado: ${title}`);
  console.log(`URL: /blog/${slug}`);
};

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
