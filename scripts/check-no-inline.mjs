#!/usr/bin/env node
/**
 * check-no-inline.mjs — build-tier guard (NOT shipped to the bundle).
 *
 * Enforces the §5 rule "no incidental inline CSS/JS" that stylelint/eslint can't
 * see: inline `style="..."` attributes and inline DOM event handlers
 * (`onclick=`, `onload=`, ...) inside markup. Component-scoped <style> and
 * Astro <script> blocks are the sanctioned behavior/presentation layers and are
 * intentionally allowed (design doc §4).
 *
 * Exits non-zero (fails CI) on any violation.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../src", import.meta.url));
const SCANNED_EXT = new Set([".astro", ".html", ".md", ".mdx"]);

const INLINE_STYLE = /\bstyle\s*=\s*["'{]/;
const INLINE_HANDLER = /\son[a-z]+\s*=\s*["'{]/i;

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (SCANNED_EXT.has(extname(full))) out.push(full);
  }
  return out;
}

const violations = [];
for (const file of walk(ROOT)) {
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, i) => {
    if (INLINE_STYLE.test(line))
      violations.push(`${file}:${i + 1}  inline style attribute`);
    if (INLINE_HANDLER.test(line))
      violations.push(`${file}:${i + 1}  inline event handler`);
  });
}

if (violations.length > 0) {
  console.error("✗ Inline CSS/JS is not allowed (§5):");
  for (const v of violations) console.error("  " + v);
  process.exit(1);
}
console.log("✓ no inline styles/handlers found");
