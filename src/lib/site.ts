// site.ts — central site configuration (§5.1: config, never inlined literals).
// Everything route/SEO/identity-related that components and endpoints need
// resolves here, so there is one source of truth and no scattered magic strings.

export interface NavItem {
  readonly label: string;
  readonly href: string;
}

export interface SocialLink {
  readonly label: string;
  readonly href: string;
}

/** Base-aware path helper. BASE_URL is "/" on the user site, "/<repo>/" on a
 *  project repo, so every internal link must run through this (never hardcoded). */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL;
  return `${base}/${path}`.replace(/\/{2,}/g, "/");
}

/** Absolute URL for canonical/OG tags, derived from the configured site origin. */
export function absoluteUrl(path: string): string {
  const origin = import.meta.env.SITE ?? "https://nbacon659.github.io";
  return new URL(withBase(path), origin).toString();
}

export const site = {
  name: "Bacon Bits Studio",
  shortName: "BBS",
  author: "Nick",
  tagline: "Websites, WebGL games, and software — built in the open.",
  description:
    "Portfolio of Nick — a multidisciplinary builder shipping production websites, WebGL games, and desktop/software projects. Case studies, live demos, and a build-in-the-open blog.",
  locale: "en",
  // Default social-share image lives in /public; base-aware at use sites.
  ogImage: "og-default.svg",
  email: "baconbitsstudio@gmail.com",
} as const;

export const primaryNav: readonly NavItem[] = [
  { label: "Work", href: "work" },
  { label: "Blog", href: "blog" },
  { label: "About", href: "about" },
  { label: "Contact", href: "contact" },
];

export const socialLinks: readonly SocialLink[] = [
  { label: "GitHub", href: "https://github.com/NBacon659" },
  { label: "Email", href: "mailto:baconbitsstudio@gmail.com" },
];
