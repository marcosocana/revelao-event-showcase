import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";

const rootDir = process.cwd();
const postsDir = path.join(rootDir, "posts");
const queueDir = path.join(postsDir, "queue");
const dailyDir = path.join(postsDir, "daily");

const usage = `
Usage:
  npm run blog:publish:queued
  npm run blog:publish:queued -- --dry-run

Optional env:
  BLOG_AUTO_DATE=YYYY-MM-DD
  BLOG_AUTO_SLOT=morning|evening
`;

const madridDateParts = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Madrid",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const getPart = (type) => parts.find((part) => part.type === type)?.value;
  return {
    year: getPart("year"),
    month: getPart("month"),
    day: getPart("day"),
    hour: getPart("hour"),
    minute: getPart("minute"),
    second: getPart("second"),
  };
};

const today = () => {
  if (process.env.BLOG_AUTO_DATE) return process.env.BLOG_AUTO_DATE;

  const parts = madridDateParts();
  return `${parts.year}-${parts.month}-${parts.day}`;
};

const createdAt = () => {
  const parts = madridDateParts();
  return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second} Europe/Madrid`;
};

const autoSlot = () => {
  const slot = String(process.env.BLOG_AUTO_SLOT || "morning").toLowerCase().trim();
  if (["morning", "evening"].includes(slot)) return slot;
  throw new Error('BLOG_AUTO_SLOT debe ser "morning" o "evening".');
};

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
  return trimmed;
};

const parseFrontmatter = (raw) => {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    throw new Error("El post necesita frontmatter entre --- al inicio del archivo.");
  }

  const meta = {};
  for (const line of match[1].split(/\r?\n/)) {
    if (!line.trim()) continue;
    const keyMatch = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (!keyMatch) continue;
    meta[keyMatch[1]] = parseScalar(keyMatch[2]);
  }

  return { frontmatter: match[1], markdown: match[2].trim(), meta };
};

const upsertFrontmatterValue = (frontmatter, key, value) => {
  const line = `${key}: ${value}`;
  const pattern = new RegExp(`^${key}:.*$`, "m");
  if (pattern.test(frontmatter)) return frontmatter.replace(pattern, line);
  return `${frontmatter.trim()}\n${line}`;
};

const displayCreatedAt = (value) => {
  const match = String(value).match(
    /^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):\d{2}\s+Europe\/Madrid$/,
  );
  if (!match) return `Creado el ${value}.`;

  const [, year, month, day, hour, minute] = match;
  const months = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];
  return `Creado el ${Number(day)} de ${months[Number(month) - 1]} de ${year} a las ${hour}:${minute} (hora de Madrid).`;
};

const addVisibleCreatedAt = (markdown, value) => {
  const visibleLine = `*${displayCreatedAt(value)}*`;
  if (/^\*Creado el .*hora de Madrid\.\*\n?/m.test(markdown)) {
    return markdown.replace(/^\*Creado el .*hora de Madrid\.\*\n?/m, `${visibleLine}\n\n`);
  }

  return markdown.replace(/^(## .+)\n+/, `$1\n\n${visibleLine}\n\n`);
};

const getNextQueuedPost = () => {
  if (!fs.existsSync(queueDir)) return null;

  const candidates = fs
    .readdirSync(queueDir)
    .filter((fileName) => fileName.endsWith(".md"))
    .sort();

  if (!candidates.length) return null;
  return path.join(queueDir, candidates[0]);
};

const buildDailyPath = ({ date, slot, sourcePath, meta }) => {
  const slug = toSlug(String(meta.slug || meta.title || path.basename(sourcePath, ".md")));
  const baseName = `${date}-${slot}-${slug}`;
  let dailyPath = path.join(dailyDir, `${baseName}.md`);
  let suffix = 2;

  while (fs.existsSync(dailyPath)) {
    dailyPath = path.join(dailyDir, `${baseName}-${suffix}.md`);
    suffix += 1;
  }

  return dailyPath;
};

const main = () => {
  const args = process.argv.slice(2);
  if (args.includes("--help") || args.includes("-h")) {
    console.log(usage.trim());
    return;
  }

  const dryRun = args.includes("--dry-run");
  const sourcePath = getNextQueuedPost();
  if (!sourcePath) {
    console.log("No hay posts pendientes en posts/queue. No se publica nada.");
    return;
  }

  const date = today();
  const slot = autoSlot();
  const raw = fs.readFileSync(sourcePath, "utf8");
  const { frontmatter, markdown, meta } = parseFrontmatter(raw);
  const createdAtValue = createdAt();
  let nextFrontmatter = upsertFrontmatterValue(frontmatter, "publishDate", date);
  nextFrontmatter = upsertFrontmatterValue(nextFrontmatter, "createdAt", `"${createdAtValue}"`);
  nextFrontmatter = upsertFrontmatterValue(nextFrontmatter, "autoSlot", slot);
  const nextRaw = `---\n${nextFrontmatter.trim()}\n---\n\n${addVisibleCreatedAt(markdown, createdAtValue)}\n`;
  const dailyPath = buildDailyPath({ date, slot, sourcePath, meta });

  if (dryRun) {
    console.log(`Siguiente post: ${path.relative(rootDir, sourcePath)}`);
    console.log(`Destino: ${path.relative(rootDir, dailyPath)}`);
    return;
  }

  fs.mkdirSync(dailyDir, { recursive: true });
  fs.writeFileSync(dailyPath, nextRaw);
  fs.rmSync(sourcePath);

  const result = spawnSync(
    process.execPath,
    ["scripts/publish-blog-post.mjs", dailyPath],
    { cwd: rootDir, stdio: "inherit", env: process.env },
  );
  if (result.status !== 0) process.exit(result.status ?? 1);

  console.log(`Post movido desde la cola: ${path.relative(rootDir, sourcePath)}`);
  console.log(`Post diario: ${path.relative(rootDir, dailyPath)}`);
};

main();
