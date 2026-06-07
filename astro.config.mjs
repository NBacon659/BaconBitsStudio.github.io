import { defineConfig } from "astro/config";

// --- Deployment config (no magic numbers / no inlined URLs — §5.1) ---------
// `site` and `base` are configuration values, never hardcoded in components.
// They are read from the environment so the same source builds for:
//   * a GitHub user site  (NBacon659.github.io)        -> SITE_BASE = "/"
//   * a project repo       (NBacon659/<repo>)           -> SITE_BASE = "/<repo>/"
//   * the production custom domain (Sprint 3)           -> SITE_URL  = "https://baconbitsstudio.com"
// Local/dev fall back to sensible defaults.
const SITE_URL = process.env.SITE_URL ?? "https://nbacon659.github.io";
const SITE_BASE = process.env.SITE_BASE ?? "/";

export default defineConfig({
  site: SITE_URL,
  base: SITE_BASE,
  // Static output for the GitHub Pages CDN host (§4, §12).
  output: "static",
  // Build-time only; no client JS unless a component opts in (islands — §4).
  trailingSlash: "ignore",
});
