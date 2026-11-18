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
