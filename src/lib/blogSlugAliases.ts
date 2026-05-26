export const blogSlugAliases: Record<string, string> = {
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

export const getCanonicalBlogSlug = (slug: string) => blogSlugAliases[slug] ?? slug;
