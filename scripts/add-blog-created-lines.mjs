import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { execFileSync } from "node:child_process";

const rootDir = process.cwd();
const dailyDir = path.join(rootDir, "posts", "daily");
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

const madridParts = (date) => {
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

const createdAtFromIso = (iso) => {
  const parts = madridParts(new Date(iso));
  return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second} Europe/Madrid`;
};

const displayCreatedAt = (value) => {
  const match = String(value).match(
    /^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):\d{2}\s+Europe\/Madrid$/,
  );
  if (!match) return `Creado el ${value}.`;

  const [, year, month, day, hour, minute] = match;
  return `Creado el ${Number(day)} de ${months[Number(month) - 1]} de ${year} a las ${hour}:${minute} (hora de Madrid).`;
};

const firstCommitIso = (filePath) => {
  try {
    const output = execFileSync(
      "git",
      ["log", "--follow", "--format=%cI", "--reverse", "--", filePath],
      { cwd: rootDir, encoding: "utf8" },
    ).trim();
    return output.split(/\r?\n/).filter(Boolean)[0];
  } catch {
    return null;
  }
};

const upsertFrontmatterValue = (frontmatter, key, value) => {
  const line = `${key}: ${value}`;
  const pattern = new RegExp(`^${key}:.*$`, "m");
  if (pattern.test(frontmatter)) return frontmatter.replace(pattern, line);
  return `${frontmatter.trim()}\n${line}`;
};

const addVisibleCreatedAt = (markdown, value) => {
  const visibleLine = `*${displayCreatedAt(value)}*`;
  if (/^\*Creado el .*hora de Madrid\.\*\n?/m.test(markdown)) {
    return markdown.replace(/^\*Creado el .*hora de Madrid\.\*\n?/m, `${visibleLine}\n\n`);
  }
  return markdown.replace(/^(## .+)\n+/, `$1\n\n${visibleLine}\n\n`);
};

const updatePost = (relativePath) => {
  const absolutePath = path.join(rootDir, relativePath);
  const raw = fs.readFileSync(absolutePath, "utf8");
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) throw new Error(`Frontmatter no encontrado: ${relativePath}`);

  let [, frontmatter, markdown] = match;
  const existingCreatedAt = frontmatter.match(/^createdAt:\s*["']?(.+?)["']?\s*$/m)?.[1];
  const createdAt =
    existingCreatedAt || createdAtFromIso(firstCommitIso(relativePath) || new Date().toISOString());

  frontmatter = upsertFrontmatterValue(frontmatter, "createdAt", `"${createdAt}"`);
  markdown = addVisibleCreatedAt(markdown.trim(), createdAt);
  fs.writeFileSync(absolutePath, `---\n${frontmatter.trim()}\n---\n\n${markdown.trim()}\n`);
  return { relativePath, createdAt };
};

const files = fs
  .readdirSync(dailyDir)
  .filter((fileName) => fileName.endsWith(".md"))
  .sort()
  .map((fileName) => path.join("posts", "daily", fileName));

for (const result of files.map(updatePost)) {
  console.log(`${result.relativePath}: ${result.createdAt}`);
}
