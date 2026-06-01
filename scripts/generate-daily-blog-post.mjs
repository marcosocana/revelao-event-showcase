import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";

const rootDir = process.cwd();
const postsDir = path.join(rootDir, "posts", "daily");
const publicBlogDir = path.join(rootDir, "public", "blog");

const usage = `
Usage:
  npm run blog:generate:today
  npm run blog:auto:today

Optional env:
  OPENAI_API_KEY
  OPENAI_TEXT_MODEL=gpt-4o-mini
  OPENAI_IMAGE_MODEL=gpt-image-1.5
  BLOG_AUTO_DATE=YYYY-MM-DD
  BLOG_AUTO_SLOT=morning|evening
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

const today = () => {
  if (process.env.BLOG_AUTO_DATE) return process.env.BLOG_AUTO_DATE;

  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Madrid",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const getPart = (type) => parts.find((part) => part.type === type)?.value;
  return `${getPart("year")}-${getPart("month")}-${getPart("day")}`;
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

const themes = [
  {
    angle: "Como funciona Revelao en una boda con fotos, videos y mensajes de audio",
    primaryKeyword: "qr boda",
    secondaryKeywords: ["fotos boda qr", "subir fotos boda sin app", "galeria privada boda"],
    intent: "explicar el producto a parejas que buscan una forma sencilla de reunir recuerdos",
  },
  {
    angle: "Como conseguir que los invitados suban mas fotos durante la boda",
    primaryKeyword: "recopilar fotos invitados boda",
    secondaryKeywords: ["compartir fotos boda", "codigo qr boda", "fotos invitados boda"],
    intent: "resolver baja participacion de invitados",
  },
  {
    angle: "Por que el momento del revelado hace mas emocionante la galeria de boda",
    primaryKeyword: "revelado fotos boda",
    secondaryKeywords: ["recuerdos de boda", "galeria fotos boda invitados", "album colaborativo boda"],
    intent: "conectar la funcionalidad de Revelao con el valor emocional del recuerdo",
  },
  {
    angle: "Donde colocar el QR en una boda para que todos lo usen",
    primaryKeyword: "codigo qr boda",
    secondaryKeywords: ["cartel qr boda", "tarjetas qr boda", "qr para fotos de boda"],
    intent: "dar consejos practicos de colocacion y senaletica",
  },
  {
    angle: "Por que una galeria privada funciona mejor que un grupo de WhatsApp",
    primaryKeyword: "galeria privada boda",
    secondaryKeywords: ["compartir fotos boda", "subir fotos boda sin app", "recuerdos de boda"],
    intent: "comparar alternativas y posicionar una solucion centralizada",
  },
  {
    angle: "Como guardar fotos, videos y audios espontaneos de los invitados",
    primaryKeyword: "fotos boda qr",
    secondaryKeywords: ["videos boda invitados", "mensajes audio boda", "album colaborativo boda"],
    intent: "mostrar que Revelao recoge mas que fotos",
  },
  {
    angle: "Errores que hacen que se pierdan las mejores fotos de una boda",
    primaryKeyword: "fotos invitados boda",
    secondaryKeywords: ["recopilar fotos invitados boda", "recuerdos de boda", "qr para fotos de boda"],
    intent: "prevenir errores comunes y ofrecer un flujo simple",
  },
];

const pickTheme = (date, slot) => {
  const compact = Number(date.replaceAll("-", ""));
  const slotOffset = slot === "evening" ? 1 : 0;
  return themes[(compact + slotOffset) % themes.length];
};

const requireEnv = (key) => {
  const value = process.env[key];
  if (!value) throw new Error(`Falta ${key} en el entorno.`);
  return value;
};

const extractText = (response) => {
  if (typeof response.output_text === "string") return response.output_text;
  const chunks = [];
  for (const item of response.output || []) {
    for (const content of item.content || []) {
      if (content.type === "output_text" && content.text) chunks.push(content.text);
    }
  }
  return chunks.join("");
};

const generatePostData = async ({ date, slot, theme }) => {
  const apiKey = requireEnv("OPENAI_API_KEY");
  const model = process.env.OPENAI_TEXT_MODEL || "gpt-4o-mini";
  const schema = {
    type: "object",
    additionalProperties: false,
    required: [
      "title",
      "slug",
      "excerpt",
      "tags",
      "bodyMarkdown",
      "featuredImagePrompt",
      "inlineImagePrompt",
    ],
    properties: {
      title: { type: "string" },
      slug: { type: "string" },
      excerpt: { type: "string" },
      tags: { type: "array", items: { type: "string" } },
      bodyMarkdown: { type: "string" },
      featuredImagePrompt: { type: "string" },
      inlineImagePrompt: { type: "string" },
    },
  };

  const input = [
    {
      role: "system",
      content:
        "Eres el redactor SEO de Revelao.cam. Escribe en espanol de Espana, con tono claro, calido y util. Prioriza bodas, QR para fotos de boda, galeria privada, fotos, videos, mensajes de audio, recuerdos y el momento del revelado. Evita relleno generico y promesas exageradas.",
    },
    {
      role: "user",
      content:
        `Crea un post de blog para publicar el ${date}.\n` +
        `Franja automatica: ${slot === "morning" ? "manana" : "noche"}.\n` +
        `Tema: ${theme.angle}\n` +
        `Keyword principal: ${theme.primaryKeyword}\n` +
        `Keywords secundarias: ${theme.secondaryKeywords.join(", ")}\n` +
        `Intencion de busqueda: ${theme.intent}\n\n` +
        "Requisitos: titulo SEO natural, excerpt de menos de 165 caracteres, slug corto, 900-1200 palabras, cuerpo en Markdown empezando por ##, incluir exactamente un placeholder de imagen inline como {{INLINE_IMAGE}}, y terminar con una conclusion sutil hacia Revelao sin sonar agresivo.\n\n" +
        "Prompts de imagen: ultrarrealistas de bodas, gente joven, telefono en mano, a veces leyendo QR, escenas de dia/noche segun encaje, imperfecciones reales, sin logos, sin texto legible, sin watermark.",
    },
  ];

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      input,
      text: {
        format: {
          type: "json_schema",
          name: "revelao_blog_post",
          strict: true,
          schema,
        },
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI text respondio ${response.status}: ${await response.text()}`);
  }

  const payload = await response.json();
  return JSON.parse(extractText(payload));
};

const generateImage = async ({ prompt, filePath }) => {
  const apiKey = requireEnv("OPENAI_API_KEY");
  const model = process.env.OPENAI_IMAGE_MODEL || "gpt-image-1.5";
  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      prompt,
      size: "1536x1024",
      quality: "medium",
      output_format: "png",
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI image respondio ${response.status}: ${await response.text()}`);
  }

  const payload = await response.json();
  const item = payload.data?.[0];
  if (item?.b64_json) {
    fs.writeFileSync(filePath, Buffer.from(item.b64_json, "base64"));
    return;
  }
  if (item?.url) {
    const imageResponse = await fetch(item.url);
    if (!imageResponse.ok) {
      throw new Error(`No se pudo descargar la imagen generada: ${imageResponse.status}`);
    }
    fs.writeFileSync(filePath, Buffer.from(await imageResponse.arrayBuffer()));
    return;
  }
  throw new Error("OpenAI no devolvio una imagen utilizable.");
};

const convertImageToAvif = (sourcePath) => {
  const avifPath = sourcePath.replace(/\.[^.]+$/, ".avif");
  const result = spawnSync(
    "ffmpeg",
    [
      "-y",
      "-i",
      sourcePath,
      "-vf",
      "scale=1400:-2",
      "-frames:v",
      "1",
      "-c:v",
      "libsvtav1",
      "-crf",
      "35",
      avifPath,
    ],
    { cwd: rootDir, stdio: "ignore" },
  );

  if (result.status === 0 && fs.existsSync(avifPath)) {
    fs.rmSync(sourcePath, { force: true });
    return avifPath;
  }

  return sourcePath;
};

const writePost = async ({ date, postData }) => {
  fs.mkdirSync(postsDir, { recursive: true });
  fs.mkdirSync(publicBlogDir, { recursive: true });

  const slug = toSlug(postData.slug || postData.title);
  let fileSlug = slug;
  let postPath = path.join(postsDir, `${date}-${fileSlug}.md`);
  let suffix = 2;
  while (fs.existsSync(postPath)) {
    fileSlug = `${slug}-${suffix}`;
    postPath = path.join(postsDir, `${date}-${fileSlug}.md`);
    suffix += 1;
  }

  const featuredImagePng = `/blog/${date}-${fileSlug}-portada.png`;
  const inlineImagePng = `/blog/${date}-${fileSlug}-detalle.png`;
  const featuredImagePath = path.join(rootDir, "public", featuredImagePng);
  const inlineImagePath = path.join(rootDir, "public", inlineImagePng);

  await generateImage({ prompt: postData.featuredImagePrompt, filePath: featuredImagePath });
  await generateImage({ prompt: postData.inlineImagePrompt, filePath: inlineImagePath });

  const optimizedFeaturedImagePath = convertImageToAvif(featuredImagePath);
  const optimizedInlineImagePath = convertImageToAvif(inlineImagePath);
  const featuredImage = `/blog/${path.basename(optimizedFeaturedImagePath)}`;
  const inlineImage = `/blog/${path.basename(optimizedInlineImagePath)}`;

  const bodyMarkdown = postData.bodyMarkdown.replace(
    "{{INLINE_IMAGE}}",
    `![Invitados de boda usando Revelao para guardar recuerdos](${inlineImage})`,
  );

  const markdown =
    "---\n" +
    "lang: es\n" +
    `title: "${postData.title.replaceAll('"', '\\"')}"\n` +
    `slug: "${fileSlug}"\n` +
    `excerpt: "${postData.excerpt.replaceAll('"', '\\"')}"\n` +
    `image: "${featuredImage}"\n` +
    `tags: ${JSON.stringify(postData.tags)}\n` +
    `publishDate: ${date}\n` +
    "---\n\n" +
    bodyMarkdown.trim() +
    "\n";

  fs.writeFileSync(postPath, markdown);
  return postPath;
};

const main = async () => {
  loadEnvFile(path.join(rootDir, ".env"));
  loadEnvFile(path.join(rootDir, ".env.local"));

  const args = process.argv.slice(2);
  if (args.includes("--help") || args.includes("-h")) {
    console.log(usage.trim());
    return;
  }

  const date = today();
  const slot = autoSlot();
  const theme = pickTheme(date, slot);
  const postData = await generatePostData({ date, slot, theme });
  const postPath = await writePost({ date, postData });

  if (args.includes("--publish")) {
    const result = spawnSync(process.execPath, ["scripts/publish-blog-post.mjs", postPath], {
      cwd: rootDir,
      stdio: "inherit",
      env: process.env,
    });
    if (result.status !== 0) process.exit(result.status ?? 1);
  }

  console.log(postPath);
};

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
