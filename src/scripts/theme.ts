// theme.ts — behavior island for the light/dark toggle (§4 islands, §5 SoC).
// Presentation lives in CSS via the [data-theme] attribute (tokens.css); this
// module only flips the attribute, persists the choice, and keeps the button's
// accessible state in sync. Loaded only on pages that render the toggle.

const STORAGE_KEY = "bbs-theme";
const ATTR = "data-theme";
type Theme = "light" | "dark";

function systemPrefersDark(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function currentTheme(): Theme {
  const set = document.documentElement.getAttribute(ATTR);
  if (set === "light" || set === "dark") return set;
  return systemPrefersDark() ? "dark" : "light";
}

function apply(theme: Theme): void {
  document.documentElement.setAttribute(ATTR, theme);
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* storage may be unavailable (private mode); the toggle still works in-session */
  }
}

function syncButton(button: HTMLButtonElement, theme: Theme): void {
  const isDark = theme === "dark";
  button.setAttribute("aria-pressed", String(isDark));
  const label = isDark ? "Switch to light theme" : "Switch to dark theme";
  button.setAttribute("aria-label", label);
  button.dataset.theme = theme;
}

export function initThemeToggle(): void {
  const button =
    document.querySelector<HTMLButtonElement>("[data-theme-toggle]");
  if (!button) return;
  syncButton(button, currentTheme());
  button.addEventListener("click", () => {
    const next: Theme = currentTheme() === "dark" ? "light" : "dark";
    apply(next);
    syncButton(button, next);
  });
}

initThemeToggle();
