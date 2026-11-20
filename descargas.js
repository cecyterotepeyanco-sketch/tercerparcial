const navigationLinks = [...document.querySelectorAll(".nav-link")];
const navigationSections = navigationLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const currentSection = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!currentSection) return;

      navigationLinks.forEach((link) => {
        const active = link.hash === `#${currentSection.target.id}`;
        link.classList.toggle("is-active", active);
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    },
    { rootMargin: "-15% 0px -70% 0px", threshold: [0, 0.25, 0.5] }
  );

  navigationSections.forEach((section) => sectionObserver.observe(section));
}

const mainContent = document.querySelector(".main-content");
const imageViewer = document.querySelector("[data-image-viewer]");
const enlargedImage = imageViewer?.querySelector("img");
let lastFocusedImage = null;

function showImage(image) {
  if (!imageViewer || !enlargedImage) return;

  lastFocusedImage = image;
  enlargedImage.src = image.currentSrc || image.src;
  enlargedImage.alt = image.alt;
  imageViewer.showModal();
}

mainContent?.querySelectorAll("img").forEach((image) => {
  image.tabIndex = 0;
  image.setAttribute("role", "button");
  image.setAttribute("aria-label", `Ampliar imagen: ${image.alt}`);
});

mainContent?.addEventListener("click", (event) => {
  const image = event.target instanceof Element ? event.target.closest("img") : null;
  if (!image) return;

  event.preventDefault();
  showImage(image);
});

mainContent?.addEventListener("keydown", (event) => {
  if (!(event.target instanceof HTMLImageElement) || !["Enter", " "].includes(event.key)) return;

  event.preventDefault();
  showImage(event.target);
});

imageViewer?.querySelector("[data-close-image]")?.addEventListener("click", () => imageViewer.close());
imageViewer?.addEventListener("click", (event) => {
  if (event.target === imageViewer) imageViewer.close();
});
imageViewer?.addEventListener("close", () => {
  lastFocusedImage?.focus({ preventScroll: true });
  lastFocusedImage = null;
});
