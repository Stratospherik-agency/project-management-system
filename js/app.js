/* Plateforme — démarrage */
"use strict";
$("#modalClose").onclick = closeModal;
$("#modalBg").addEventListener("mousedown", e => { if (e.target.id === "modalBg") closeModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape" && !$("#modalBg").hidden) closeModal(); });
$("#menuBtn").onclick = () => $("#side").classList.toggle("open");
$("#userPill").onclick = () => askUser(true);
window.addEventListener("hashchange", () => { render(); $("#main").focus({ preventScroll: true }); window.scrollTo(0, 0); });
(async function init() {
  if (!SEED) { document.body.innerHTML = "<p style='padding:30px'>Fichier data/projet-data.js introuvable.</p>"; return; }
  await load();
  if (!location.hash) history.replaceState(null, "", "#overview");
  render();
  if (!USER) askUser();
})();
