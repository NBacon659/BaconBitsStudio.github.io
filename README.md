# Bacon Bits Studio — site

Static [Astro](https://astro.build) front-end for `baconbitsstudio.com`, deployed
to GitHub Pages. This is the **walking skeleton** (Sprint 1): a thin, real,
auto-deploying site built on the no-magic-numbers token foundation. The full
design system, routes, CMS pipeline, and polish arrive in later sprints — see
`../Sprint Schedule - BaconBitsStudio.com.md` and `../Session_Handoff.md`.

## Commands

| Command            | What it does                                              |
| ------------------ | -------------------------------------------------------- |
| `npm install`      | Install dependencies                                     |
| `npm run dev`      | Local dev server                                         |
| `npm run build`    | Static build to `dist/`                                  |
| `npm run lint`     | No-inline guard + stylelint (no magic numbers) + eslint  |
| `npm run check`    | Astro type/content check                                 |
| `npm run verify`   | `lint` + `check` + `build` (what CI runs)                |

## Design rules (enforced, not aspirational — §5 / §5.1)

- **No magic numbers.** Components never use a raw `px`/`rem`/hex/`ms`. Every
  literal lives once in `src/styles/tokens.css`; everything else uses
  `var(--token)`. Enforced by `stylelint-declaration-strict-value`
  (`.stylelintrc.json`); `tokens.css` is the one ignored file.
- **No incidental inline CSS/JS.** Inline `style="…"` attributes and DOM event
  handlers fail the build via `scripts/check-no-inline.mjs`. Component-scoped
  `<style>` and Astro `<script>` blocks are the sanctioned layers.
- **Dynamic is king.** Fluid `clamp()` type/space scales, container-derived
  layout, config over constants. Deploy URLs are `SITE_URL` / `SITE_BASE`
  env values (`astro.config.mjs`), never hardcoded.

## Deploy config

`astro.config.mjs` reads `SITE_URL` and `SITE_BASE` from the environment
(set in `.github/workflows/deploy.yml`):

- **User site** (`NBacon659.github.io`): `SITE_BASE=/`.
- **Project repo**: `SITE_BASE=/<repo>/`.
- **Custom domain** (Sprint 3): set `SITE_URL=https://baconbitsstudio.com` and
  add the `CNAME` file.

## Structure (design-doc §13A)

```
src/lib/        build-time CMS client      (Sprint 4)
src/components/ single-responsibility UI    (Sprint 2)
src/blocks/     blockType -> component map  (Sprint 5)
src/layouts/    page shells
src/styles/     tokens.css + per-concern CSS (no inline)
src/scripts/    behavior islands            (Sprint 2)
src/pages/      routes
```
