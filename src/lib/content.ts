// content.ts — the typed content interface (§5 DIP, §6.1/§6.2). Presentation
// depends on THESE types, not on where content comes from. In Sprint 4 the same
// interfaces are fed by the Payload CMS client; for now they are satisfied by
// clearly-labeled PLACEHOLDER data (decision J — never invent Nick's real work).

export type ProjectCategory = "web" | "game" | "software";
export type ProjectStatus = "live" | "in-progress" | "archived";

export interface ProjectLink {
  readonly label: string;
  readonly href: string;
}

export interface MediaItem {
  /** Path under /public, OR an absolute URL. Base-applied at render. */
  readonly src: string;
  /** Required alt text — schema enforces this in Sprint 4 (§4, §11). */
  readonly alt: string;
}

export interface Project {
  readonly slug: string;
  readonly title: string;
  readonly summary: string;
  readonly category: ProjectCategory;
  readonly status: ProjectStatus;
  readonly roles: readonly string[];
  readonly tech: readonly string[];
  readonly links: readonly ProjectLink[];
  /** Embed URL for game/WebGL projects (rendered in a sandboxed iframe). */
  readonly embed?: string;
  /** Download slot for software projects (wired fully in Sprint 5). */
  readonly download?: { readonly version: string; readonly note: string };
  readonly media: readonly MediaItem[];
  readonly featured: boolean;
  readonly date: string; // ISO date
  readonly placeholder: true; // flag — swapped for real content in Sprint 8
}

export interface Post {
  readonly slug: string;
  readonly title: string;
  readonly excerpt: string;
  readonly date: string; // ISO date
  readonly tags: readonly string[];
  readonly category: string;
  readonly cover?: MediaItem;
  readonly draft: boolean;
  readonly placeholder: true;
}

export const CATEGORY_LABELS: Readonly<Record<ProjectCategory, string>> = {
  web: "Web",
  game: "Game",
  software: "Software",
};

// --- PLACEHOLDER content (decision J). Representative, clearly-labeled sample
//     items across all three categories so the routes/render paths are exercised.
const projects: readonly Project[] = [
  {
    slug: "sample-web-app",
    title: "Sample Web App",
    summary:
      "Placeholder case study for a web project — live site link plus screenshots. Replace with a real build before launch.",
    category: "web",
    status: "live",
    roles: ["Design", "Frontend", "Backend"],
    tech: ["Astro", "TypeScript", "Cloudflare"],
    links: [{ label: "Live site", href: "https://example.com" }],
    media: [
      { src: "og-default.png", alt: "Placeholder screenshot of the sample web app." },
    ],
    featured: true,
    date: "2026-05-01",
    placeholder: true,
  },
  {
    slug: "sample-webgl-game",
    title: "Sample WebGL Game",
    summary:
      "Placeholder case study for a game — an embed slot frames the playable build. Replace with a real game before launch.",
    category: "game",
    status: "in-progress",
    roles: ["Gameplay", "Art"],
    tech: ["WebGL", "C#", "Unity"],
    links: [{ label: "Play page", href: "https://example.com/play" }],
    embed: "https://example.com/embed/sample",
    media: [
      { src: "og-default.png", alt: "Placeholder key art for the sample WebGL game." },
    ],
    featured: true,
    date: "2026-04-12",
    placeholder: true,
  },
  {
    slug: "sample-desktop-tool",
    title: "Sample Desktop Tool",
    summary:
      "Placeholder case study for a software project — a versioned download card with checksum lands in Sprint 5. Replace with a real release before launch.",
    category: "software",
    status: "live",
    roles: ["Architecture", "Engineering"],
    tech: ["Rust", "Tauri"],
    links: [{ label: "Repository", href: "https://github.com/NBacon659" }],
    download: { version: "v0.1.0", note: "Checksum + signed installer arrive in Sprint 5." },
    media: [
      { src: "og-default.png", alt: "Placeholder UI shot of the sample desktop tool." },
    ],
    featured: false,
    date: "2026-03-20",
    placeholder: true,
  },
];

const posts: readonly Post[] = [
  {
    slug: "building-in-the-open",
    title: "Building This Site In The Open",
    excerpt:
      "Placeholder post — how the portfolio is built sprint by sprint. Real writing replaces this before launch.",
    date: "2026-05-15",
    tags: ["process", "astro"],
    category: "Engineering",
    cover: { src: "og-default.png", alt: "Placeholder cover for the build-in-the-open post." },
    draft: false,
    placeholder: true,
  },
  {
    slug: "design-tokens-no-magic-numbers",
    title: "Design Tokens And The No-Magic-Numbers Rule",
    excerpt:
      "Placeholder post — why every value resolves to a token. Real writing replaces this before launch.",
    date: "2026-04-28",
    tags: ["css", "design-system"],
    category: "Design",
    draft: false,
    placeholder: true,
  },
];

// --- Accessors (mirror the build-time CMS client API shape of Sprint 4) ------
export function getProjects(): readonly Project[] {
  return [...projects].sort((a, b) => b.date.localeCompare(a.date));
}

export function getFeaturedProjects(): readonly Project[] {
  return getProjects().filter((p) => p.featured);
}

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getPosts(): readonly Post[] {
  return [...posts]
    .filter((p) => !p.draft) // draft:true excluded from build (§6.2)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug && !p.draft);
}
