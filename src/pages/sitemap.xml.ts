// sitemap.xml — generated endpoint (§3, §11). Enumerates static routes plus the
// dynamic work/blog entries from the typed content interface, so it regenerates
// from real collections in Sprint 4 with no template change (§5 DIP).
import type { APIRoute } from "astro";
import { absoluteUrl } from "../lib/site";
import { getProjects, getPosts } from "../lib/content";

interface UrlEntry {
  path: string;
  lastmod?: string;
}

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export const GET: APIRoute = () => {
  const staticPaths: UrlEntry[] = [
    { path: "" },
    { path: "work" },
    { path: "blog" },
    { path: "about" },
    { path: "contact" },
  ];
  const projectPaths: UrlEntry[] = getProjects().map((p) => ({
    path: `work/${p.slug}`,
    lastmod: p.date,
  }));
  const postPaths: UrlEntry[] = getPosts().map((p) => ({
    path: `blog/${p.slug}`,
    lastmod: p.date,
  }));
  const all = [...staticPaths, ...projectPaths, ...postPaths];

  const urls = all
    .map((entry) => {
      const loc = xmlEscape(absoluteUrl(entry.path));
      const lastmod = entry.lastmod ? `\n    <lastmod>${entry.lastmod}</lastmod>` : "";
      return `  <url>\n    <loc>${loc}</loc>${lastmod}\n  </url>`;
    })
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
