const DEFAULT_SITE = "http://127.0.0.1:43147";

export function resolveSite(site: string | URL | undefined): string {
  if (site instanceof URL) return site.href;
  if (typeof site === "string" && site.trim() !== "") return site.trim();
  return DEFAULT_SITE;
}

export function absoluteUrl(site: string | URL | undefined, pathname: string): string {
  const base = resolveSite(site);
  return new URL(pathname, base.endsWith("/") ? base : `${base}/`).href;
}

function xmlEscape(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function renderSitemap(site: string | URL | undefined, dates: readonly string[]): string {
  const updates = [...new Set(dates)].sort((a, b) => b.localeCompare(a));
  const entries: { path: string; lastmod?: string }[] = [
    updates[0] ? { path: "/", lastmod: updates[0] } : { path: "/" },
    { path: "/about/" },
    ...updates.map((date) => ({ path: `/updates/${date}/`, lastmod: date })),
  ];

  const urls = entries
    .map((entry) => {
      const loc = xmlEscape(absoluteUrl(site, entry.path));
      const lastmod = entry.lastmod ? `\n    <lastmod>${xmlEscape(entry.lastmod)}</lastmod>` : "";
      return `  <url>\n    <loc>${loc}</loc>${lastmod}\n  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export function renderRobots(site: string | URL | undefined): string {
  return `User-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl(site, "/sitemap.xml")}\n`;
}
