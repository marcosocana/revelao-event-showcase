# Blog posts

Escribe los posts en Markdown con frontmatter y publicalos en Supabase con:

```bash
npm run blog:publish -- posts/drafts/mi-post.md
```

Para publicar un post diario, crea un archivo en `posts/daily/` cuyo nombre empiece por la fecha del dia:

```text
posts/daily/2026-05-27-mi-post.md
```

Despues ejecuta:

```bash
npm run blog:publish:today
```

Ese comando busca el archivo de hoy en `posts/daily/`. Tambien puedes usar `publishDate: YYYY-MM-DD` en el frontmatter si prefieres otro nombre de archivo.

Para revisar lo que se enviaria a Supabase sin publicar:

```bash
npm run blog:preview -- posts/drafts/mi-post.md
```

## Plantilla

```md
---
lang: es
title: "Titulo del post"
slug: "titulo-del-post"
excerpt: "Resumen corto para la tarjeta del blog."
image: "https://..."
tags: ["Eventos", "QR"]
publishDate: 2026-05-27
---

## Subtitulo

Contenido del post en Markdown.
```

Campos obligatorios: `title`, `excerpt`, `image`.

Campos opcionales: `lang` (`es`, `en`, `it`), `slug`, `tags`, `publishDate`.

Puedes usar imagenes locales del proyecto:

```md
image: "/blog/mi-imagen.png"

![Descripcion de la imagen](/blog/mi-imagen-en-el-cuerpo.png)
```

Al publicar, el script sube esas imagenes locales a Supabase Storage y guarda en el post las URLs publicas resultantes.

## Automatizacion diaria con OpenAI

El comando automatico con OpenAI crea el post, genera dos imagenes y lo publica:

```bash
npm run blog:auto:today
```

Necesita estas variables:

```text
OPENAI_API_KEY
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
```

Opcionales:

```text
OPENAI_TEXT_MODEL=gpt-4o-mini
OPENAI_IMAGE_MODEL=gpt-image-1.5
BLOG_AUTO_DATE=YYYY-MM-DD
BLOG_AUTO_SLOT=morning|evening
```

El workflow `.github/workflows/publish-blog-daily.yml` lo ejecuta dos veces al dia:

- 05:00 UTC, usando `BLOG_AUTO_SLOT=morning`.
- 20:45 UTC, usando `BLOG_AUTO_SLOT=evening`.

Cada franja elige un angulo distinto para evitar publicar dos posts iguales el mismo dia.

## Automatizacion sin OpenAI con cola

Para publicar sin billing de OpenAI, prepara posts completos en `posts/queue/`.

Cada archivo debe ser Markdown con el mismo frontmatter de siempre:

```md
---
lang: es
title: "Titulo del post"
slug: "titulo-del-post"
excerpt: "Resumen corto para la tarjeta del blog."
image: "/blog/imagen-existente.avif"
tags: ["Bodas", "QR"]
---

## Subtitulo

Contenido del post en Markdown.
```

El workflow publica el primer `.md` de `posts/queue/` en orden alfabetico:

- Lo mueve a `posts/daily/`.
- Le anade `publishDate` con la fecha de Espana.
- Le anade `autoSlot` con `morning` o `evening`.
- Lo publica en Supabase.
- Hace commit quitandolo de la cola.

Para probarlo localmente sin publicar:

```bash
npm run blog:publish:queued -- --dry-run
```

Para publicar manualmente el siguiente post de la cola:

```bash
npm run blog:publish:queued
```

Con este flujo solo hacen falta los secrets de Supabase en GitHub Actions:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
```
