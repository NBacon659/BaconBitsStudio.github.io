// work-filter.ts — behavior island for the /work index category filter (§4).
// Progressive enhancement: the full list renders server-side and is fully usable
// with JS off; this only hides/shows cards by category and reflects the choice in
// the URL + button state. No layout numbers here — CSS owns presentation.

const ACTIVE = "is-active";

function setActiveButton(buttons: HTMLButtonElement[], value: string): void {
  for (const b of buttons) {
    const on = b.dataset.filter === value;
    b.classList.toggle(ACTIVE, on);
    b.setAttribute("aria-pressed", String(on));
  }
}

function applyFilter(cards: HTMLElement[], value: string): number {
  let shown = 0;
  for (const card of cards) {
    const match = value === "all" || card.dataset.category === value;
    card.hidden = !match;
    if (match) shown += 1;
  }
  return shown;
}

export function initWorkFilter(): void {
  const root = document.querySelector<HTMLElement>("[data-work-filter]");
  if (!root) return;
  const buttons = Array.from(
    root.querySelectorAll<HTMLButtonElement>("[data-filter]"),
  );
  const cards = Array.from(
    document.querySelectorAll<HTMLElement>("[data-work-card]"),
  );
  const empty = document.querySelector<HTMLElement>("[data-work-empty]");

  function select(value: string): void {
    setActiveButton(buttons, value);
    const shown = applyFilter(cards, value);
    if (empty) empty.hidden = shown !== 0;
    const url = new URL(window.location.href);
    if (value === "all") url.searchParams.delete("category");
    else url.searchParams.set("category", value);
    window.history.replaceState({}, "", url);
  }

  for (const b of buttons) {
    b.addEventListener("click", () => select(b.dataset.filter ?? "all"));
  }

  const initial = new URL(window.location.href).searchParams.get("category");
  select(initial ?? "all");
}

initWorkFilter();
