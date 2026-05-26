import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";

const rootDir = process.cwd();

const usage = `
Usage:
  node scripts/generate-blog-card.mjs posts/daily/mi-post.md
`;

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
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) throw new Error("El post necesita frontmatter entre ---.");

  const meta = {};
  for (const line of match[1].split(/\r?\n/)) {
    if (!line.trim()) continue;
    const keyMatch = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (!keyMatch) continue;
    meta[keyMatch[1]] = parseScalar(keyMatch[2]);
  }
  return meta;
};

const requireString = (meta, key) => {
  const value = meta[key];
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Falta "${key}" en el frontmatter.`);
  }
  return value.trim();
};

const resolveImagePath = (imageUrl, postDir) => {
  if (/^https?:\/\//.test(imageUrl) || imageUrl.startsWith("data:")) return imageUrl;
  if (imageUrl.startsWith("/")) return path.join(rootDir, "public", imageUrl);
  if (imageUrl.startsWith("public/")) return path.join(rootDir, imageUrl);
  return path.resolve(postDir, imageUrl);
};

const escapeHtml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const fileUrl = (filePath) => `file://${filePath.replaceAll(" ", "%20")}`;

const findChrome = () => {
  const candidates = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
  ];
  return candidates.find((candidate) => fs.existsSync(candidate));
};

const truncateExcerpt = (value) => {
  if (value.length <= 104) return value;
  return `${value.slice(0, 101).trimEnd()}...`;
};

const buildHtml = ({ title, excerpt, imagePath }) => `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      * { box-sizing: border-box; }
      html, body {
        margin: 0;
        width: 892px;
        height: 1531px;
        overflow: hidden;
        background: #ffffff;
        font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif;
      }
      .frame {
        width: 892px;
        height: 1531px;
        padding: 28px 48px 62px;
      }
      .hero {
        width: 796px;
        height: 626px;
        border-radius: 21px;
        object-fit: cover;
        display: block;
      }
      .card {
        width: 796px;
        height: 789px;
        margin-top: 25px;
        border-radius: 21px;
        background: #f5f5f5;
        padding: 57px 49px 47px;
      }
      h1 {
        margin: 0;
        color: #111111;
        font-size: 54px;
        line-height: 1.5;
        letter-spacing: 0;
        font-weight: 760;
      }
      p {
        margin: 47px 0 0;
        color: #757575;
        font-size: 42px;
        line-height: 1.42;
        letter-spacing: 0;
        font-weight: 400;
      }
      .button {
        width: 698px;
        height: 107px;
        margin-top: 39px;
        border-radius: 15px;
        border: 2px solid #dedede;
        background: #ffffff;
        color: #171717;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 42px;
        line-height: 1;
        font-weight: 500;
      }
    </style>
  </head>
  <body>
    <main class="frame">
      <img class="hero" src="${escapeHtml(fileUrl(imagePath))}" />
      <section class="card">
        <h1>${escapeHtml(title)}</h1>
        <p>${escapeHtml(truncateExcerpt(excerpt))}</p>
        <div class="button">Leer más</div>
      </section>
    </main>
  </body>
</html>`;

const main = () => {
  const [postArg] = process.argv.slice(2);
  if (!postArg || postArg === "--help" || postArg === "-h") {
    console.log(usage.trim());
    process.exit(postArg ? 0 : 1);
  }

  const chrome = findChrome();
  if (!chrome) throw new Error("No se encontro Google Chrome o Chromium para renderizar la card.");

  const postPath = path.resolve(rootDir, postArg);
  const raw = fs.readFileSync(postPath, "utf8");
  const meta = parseFrontmatter(raw);
  const title = requireString(meta, "title");
  const excerpt = requireString(meta, "excerpt");
  const image = requireString(meta, "image");
  const slug = requireString(meta, "slug");
  const imagePath = resolveImagePath(image, path.dirname(postPath));
  if (!fs.existsSync(imagePath)) throw new Error(`No existe la imagen local: ${image}`);

  const outputDir = path.join(rootDir, "public", "blog", "cards");
  fs.mkdirSync(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, `${slug}.png`);
  const htmlPath = path.join(os.tmpdir(), `${slug}-blog-card.html`);
  fs.writeFileSync(htmlPath, buildHtml({ title, excerpt, imagePath }));

  const result = spawnSync(
    chrome,
    [
      "--headless",
      "--disable-gpu",
      "--hide-scrollbars",
      "--screenshot=" + outputPath,
      "--window-size=892,1531",
      fileUrl(htmlPath),
    ],
    { encoding: "utf8" },
  );

  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || "Chrome no pudo renderizar la card.");
  }

  console.log(outputPath);
};

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
