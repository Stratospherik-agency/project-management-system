"use strict";
(async function () {
  const $ = s => document.querySelector(s);
  let setup = false;
  try { setup = (await (await fetch("/api/etat-installation", { cache: "no-store" })).json()).installation; } catch (e) { }
  if (setup) { $("#setupFields").hidden = false; $("#pwHint").hidden = false; $("#lt").textContent = "Installation"; $("#sb").textContent = "Créer le compte administrateur"; $("#password").autocomplete = "new-password"; $("#code").focus(); }
  else $("#login").focus();
  $("#lf").addEventListener("submit", async e => {
    e.preventDefault(); $("#err").textContent = ""; $("#sb").disabled = true;
    const body = { login: $("#login").value.trim().toLowerCase(), password: $("#password").value };
    if (setup) { body.code = $("#code").value; body.nom = $("#nom").value.trim(); }
    try {
      const r = await fetch(setup ? "/api/installation" : "/api/connexion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const j = await r.json().catch(() => ({}));
      if (r.ok) { location.href = "/#overview"; return; }
      $("#err").textContent = j.error || "Erreur " + r.status;
    } catch (x) { $("#err").textContent = "Serveur injoignable."; }
    $("#sb").disabled = false;
  });
})();
