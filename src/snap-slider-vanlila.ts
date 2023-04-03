import { createSnapSlider } from "./lib/snap-slider";

export function createSnapSliderVanilla(element: HTMLElement) {
  const count = Number(element.getAttribute("data-slider"));
  const nextBtn = element.parentNode?.querySelector("[data-next]");
  const prevBtn = element.parentNode?.querySelector("[data-prev]");
  let nav: HTMLElement | null;
  const navSelector = element.getAttribute("data-nav");
  if (navSelector) {
    nav = document.querySelector<HTMLElement>(navSelector);
  }
  const btnClass = element.getAttribute("data-nav-btn");
  const btnClassActive = element.getAttribute("data-nav-btn-active");
  const { jumpTo, goNext, goPrev, subscribe } = createSnapSlider({
    element,
    // itemSelector: "article",
    count: count,
    index: 0,
  });
  subscribe((obj) => {
    // console.log("onChange", obj);
    if (obj.nextEnabled) {
      nextBtn?.removeAttribute("disabled");
    } else {
      nextBtn?.setAttribute("disabled", "true");
    }
    if (obj.prevEnabled) {
      prevBtn?.removeAttribute("disabled");
    } else {
      prevBtn?.setAttribute("disabled", "true");
    }
    if (nav) {
      nav.innerHTML = "";
      for (let i = 0; i < obj.count; i++) {
        const classes = `${btnClass} ${i === obj.index ? btnClassActive : ""}`;
        const button = document.createElement("button");
        button.addEventListener("click", () => jumpTo(i));
        button.className = classes;
        nav.append(button);
      }
    }
  });
  prevBtn?.addEventListener("click", goPrev);
  nextBtn?.addEventListener("click", goNext);
}
