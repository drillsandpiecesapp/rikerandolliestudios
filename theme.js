// Light/dark theme: runs in <head> so the page never flashes the wrong colors.
(function () {
  var root = document.documentElement, KEY = "theme", t = null;
  try { t = localStorage.getItem(KEY); } catch (e) {}
  if (t !== "light" && t !== "dark") {
    t = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }
  root.setAttribute("data-theme", t);
  document.addEventListener("DOMContentLoaded", function () {
    var b = document.createElement("button");
    b.type = "button"; b.className = "theme-toggle";
    b.innerHTML =
      '<svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5.3 5.3l1.7 1.7M17 17l1.7 1.7M18.7 5.3L17 7M7 17l-1.7 1.7"/></svg>' +
      '<svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7z"/></svg>';
    function label() {
      b.setAttribute("aria-label", root.getAttribute("data-theme") === "light" ? "Switch to dark mode" : "Switch to light mode");
    }
    b.addEventListener("click", function () {
      var n = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.setAttribute("data-theme", n);
      try { localStorage.setItem(KEY, n); } catch (e) {}
      label();
    });
    label();
    document.body.appendChild(b);
  });
})();
