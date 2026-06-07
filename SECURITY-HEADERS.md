# Security headers — target set (§14a groundwork, ships in Sprint 3)

GitHub Pages cannot set custom response headers. The static front is hardened
**in markup** today (Sprint 2); the HTTP **header** layer is applied at the edge
once the domain is delegated to Cloudflare in **Sprint 3** (Transform Rule /
Response Header rule, or `_headers` if the host ever supports it). This file is
the authoritative spec of what that rule must emit, so Sprint 3 is a transcription
task, not a design task.

## Already enforced in Sprint 2 (markup tier)

- **No inline CSS/JS** — enforced by `check-no-inline.mjs` + stylelint; the sole
  exception is the documented no-FOUC theme bootstrap (`is:inline` in `BaseLayout`).
- **`rel="noopener noreferrer"`** on every outbound/`target="_blank"` link
  (project links, downloads, social).
- **Sandboxed iframes** — `EmbedFrame` sets `sandbox="allow-scripts
  allow-same-origin allow-popups"` + `referrerpolicy="no-referrer"`.
- **No secrets in the bundle** — the Cloudflare Analytics token is a *public*
  site token, read from `PUBLIC_CF_BEACON_TOKEN`; no private values are shipped.

## Target HTTP headers (apply at Cloudflare in Sprint 3)

| Header | Value (target) |
|---|---|
| `Content-Security-Policy` | `default-src 'self'; img-src 'self' data: https:; script-src 'self' https://static.cloudflareinsights.com; style-src 'self'; frame-src https:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests` |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), interest-cohort=()` |
| `X-Frame-Options` | `DENY` (belt-and-suspenders with `frame-ancestors 'none'`) |
| `Cross-Origin-Opener-Policy` | `same-origin` |

### CSP notes / Sprint sequencing

- **No `unsafe-inline`** is the goal (DoD §14, §8). The theme bootstrap is the one
  inline `<script>`; before flipping CSP to strict in Sprint 8, replace it with a
  nonce/hash (Cloudflare can inject a per-response nonce) **or** move theme init to
  an external `is:inline`-free module accepting a first-paint flash. Track as a
  Sprint 8 audit item.
- `script-src` allows `static.cloudflareinsights.com` for the analytics beacon.
- `frame-src https:` permits game/WebGL embeds; tighten to an explicit allowlist
  of embed hosts once the real projects are known (Sprint 8 / decision J).
- Add `cal.baconbitsstudio.com` (or the hosted Cal.com origin) to `frame-src` when
  the scheduling embed lands in Sprint 8.
- Verify the final set against `securityheaders.com` during the Sprint 8 audit.
