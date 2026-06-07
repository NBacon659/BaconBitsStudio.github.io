// rss.xml — generated feed (§3, §11). Built from the typed post collection; no
// external dependency so the Sprint 1 lockfile stays valid. Regenerates from
// real content in Sprint 4 unchanged.
import type { APIRoute } from "astro";
import { absoluteUrl, site } from "../lib/site";
import { getPosts } from "../lib/content";

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export const GET: APIRoute = () => {
  const items = getPosts()
    .map((post) => {
      const link = absoluteUrl(`blog/${post.slug}`);
      return [
        "    <item>",
        `      <title>${xmlEscape(post.title)}</title>`,
        `      <link>${xmlEscape(link)}</link>`,
        `      <guid isPermaLink="true">${xmlEscape(link)}</guid>`,
        `      <pubDate>${new Date(post.date).toUTCString()}</pubDate>`,
        `      <description>${xmlEscape(post.excerpt)}</description>`,
        ...post.tags.map((t) => `      <category>${xmlEscape(t)}</category>`),
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    "  <channel>",
    `    <title>${xmlEscape(site.name)} — Blog</title>`,
    `    <link>${xmlEscape(absoluteUrl("blog"))}</link>`,
    `    <description>${xmlEscape(site.description)}</description>`,
    `    <language>${site.locale}</language>`,
    items,
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
