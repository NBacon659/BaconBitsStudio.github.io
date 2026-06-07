// lightbox.ts — behavior island stub for gallery image zoom (§4). Full UX polish
// (transitions, swipe) lands in Sprint 7; this is the accessible baseline:
// click/Enter opens a dialog with the full image, Escape/backdrop closes it.

export function initLightbox(): void {
  const dialog = document.querySelector<HTMLDialogElement>("[data-lightbox]");
  const image = dialog?.querySelector<HTMLImageElement>("[data-lightbox-image]");
  if (!dialog || !image || typeof dialog.showModal !== "function") return;

  const triggers = document.querySelectorAll<HTMLElement>("[data-lightbox-src]");
  for (const trigger of triggers) {
    trigger.addEventListener("click", () => {
      const src = trigger.dataset.lightboxSrc;
      const alt = trigger.dataset.lightboxAlt ?? "";
      if (!src) return;
      image.src = src;
      image.alt = alt;
      dialog.showModal();
    });
  }

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
}

initLightbox();
