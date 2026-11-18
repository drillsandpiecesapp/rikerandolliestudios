// Edit these two lines, then you are done.
const GH = "drillsandpiecesapp/my-apps"; // your GitHub username/repository
const DONATE = ""; // donation link: empty on purpose, so no donation buttons show
document.querySelectorAll("[data-apk]").forEach(a => {
  a.href = "https://github.com/" + GH + "/releases/download/" + a.dataset.apk + "/" + a.dataset.apk + ".apk";;
});
document.querySelectorAll("[data-donate]").forEach(e => {
  if (DONATE) e.href = DONATE; else e.style.display = "none";
});
window.addEventListener("load", () => {
  document.querySelectorAll(".shots").forEach(box => {
    let n = 0;
    box.querySelectorAll("img").forEach(i => {
      if (i.complete && i.naturalWidth > 0) n++; else i.closest("figure").style.display = "none";
    });
    if (!n) box.closest("section").style.display = "none";
  });
  document.querySelectorAll("img[data-optional]").forEach(i => {
    if (!(i.complete && i.naturalWidth > 0)) i.style.display = "none";
  });
});

// Scrollable card wheel on the home page
(function () {
  const wheel = document.getElementById("wheel");
  if (!wheel) return;
  const cards = Array.from(wheel.querySelectorAll(".card"));
  const dots = document.getElementById("wdots");
  const prev = document.getElementById("wprev");
  const next = document.getElementById("wnext");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const dotEls = cards.map((card, i) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "wdot";
    b.setAttribute("aria-label", "Show " + (card.querySelector("h3") || {}).textContent);
    b.addEventListener("click", () => goTo(i));
    dots.appendChild(b);
    return b;
  });
  function center(card) { return card.offsetLeft + card.offsetWidth / 2; }
  function goTo(i) {
    i = Math.max(0, Math.min(cards.length - 1, i));
    wheel.scrollTo({ left: center(cards[i]) - wheel.clientWidth / 2, behavior: reduce ? "auto" : "smooth" });
  }
  function update() {
    const mid = wheel.scrollLeft + wheel.clientWidth / 2;
    let best = 0, bestD = Infinity;
    cards.forEach((card, i) => {
      const dist = Math.abs(mid - center(card));
      if (dist < bestD) { bestD = dist; best = i; }
      card.style.setProperty("--d", Math.min(1, dist / (card.offsetWidth * 1.1)).toFixed(3));
    });
    dotEls.forEach((d, i) => d.setAttribute("aria-current", i === best ? "true" : "false"));
    prev.disabled = best === 0;
    next.disabled = best === cards.length - 1;
    wheel.dataset.active = best;
  }
  prev.addEventListener("click", () => goTo(+wheel.dataset.active - 1));
  next.addEventListener("click", () => goTo(+wheel.dataset.active + 1));
  wheel.addEventListener("keydown", e => {
    if (e.target !== wheel) return;
    if (e.key === "ArrowRight") { e.preventDefault(); goTo(+wheel.dataset.active + 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); goTo(+wheel.dataset.active - 1); }
  });
  let raf = 0;
  wheel.addEventListener("scroll", () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); }, { passive: true });
  window.addEventListener("resize", update);
  window.addEventListener("load", update);
  update();
})();
