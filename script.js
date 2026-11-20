const navLinks = [...document.querySelectorAll(".nav-link")];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visibleSections = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visibleSections.length === 0) return;

      const activeId = visibleSections[0].target.id;
      navLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${activeId}`;
        link.classList.toggle("is-active", isActive);
        if (isActive) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    },
    { rootMargin: "-15% 0px -70% 0px", threshold: [0, 0.25, 0.5] }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

document.querySelector("[data-print]")?.addEventListener("click", () => window.print());
