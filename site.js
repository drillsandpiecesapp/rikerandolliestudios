const DONATE = ""; // donation link: empty on purpose, so no donation buttons show
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

// Contact and requirements forms are delivered by Web3Forms (web3forms.com).
// Paste your Web3Forms access key between the quotes. The key is meant to be public.
// While it is empty, the forms fall back to opening the visitor's email app.
const WEB3FORMS_KEY = "3f164a13-3d92-44b6-a844-2d6c43cabb87";
window.rosSend = function (subject, name, email, message, honey) {
  if (!WEB3FORMS_KEY) return Promise.reject(new Error("nokey"));
  return fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify({
      access_key: WEB3FORMS_KEY, subject: subject, from_name: name, name: name,
      email: email, message: message, botcheck: !!honey
    })
  }).then(function (r) { return r.json(); }).then(function (j) {
    if (!j.success) throw new Error(j.message || "failed");
    return true;
  });
};

// Contact dialog in the footer of the home page and the apps page
(function(){
  var d=document.getElementById("contactDlg"),f=document.getElementById("contactForm"),btn=document.getElementById("contactBtn");
  if(!d||!btn)return;
  var box=document.getElementById("cmsg"),t=document.getElementById("cmsgtxt"),o=document.getElementById("cout");
  function close(){if(d.close)d.close();else d.removeAttribute("open");}
  btn.addEventListener("click",function(){box.hidden=true;if(d.showModal)d.showModal();else d.setAttribute("open","");document.getElementById("cname").focus();});
  document.getElementById("contactX").addEventListener("click",close);
  document.getElementById("contactCancel").addEventListener("click",close);
  d.addEventListener("click",function(e){if(e.target===d)close();});
  f.addEventListener("submit",function(e){
    e.preventDefault();
    var n=document.getElementById("cname").value.trim(),em=document.getElementById("cemail").value.trim(),tp=document.getElementById("ctopic").value,m=document.getElementById("cmessage").value.trim();
    var body="Name: "+n+"\n"+"Email: "+em+"\n"+"Topic: "+tp+"\n\n"+m;
    var go=f.querySelector('button[type="submit"]'),hp=document.getElementById("chp");
    function fallback(){
      window.location.href="mailto:melissa@rikerandolliestudios.com?subject="+encodeURIComponent("Website contact: "+tp)+"&body="+encodeURIComponent(body);
      o.value=body;o.hidden=false;box.hidden=false;
      t.textContent="If your email app didn’t open, copy this text and email it to melissa@rikerandolliestudios.com.";
    }
    go.disabled=true;
    window.rosSend("Website contact: "+tp,n,em,body,hp&&hp.checked).then(function(){
      o.hidden=true;box.hidden=false;t.textContent="Thank you! Your message was sent. I’ll reply by email.";f.reset();
    },function(err){
      if(err&&err.message==="nokey"){fallback();}
      else{o.value=body;o.hidden=false;box.hidden=false;t.textContent="Sorry, your message couldn’t be sent. Please copy it and email melissa@rikerandolliestudios.com.";}
    }).then(function(){go.disabled=false;});
  });
})();
