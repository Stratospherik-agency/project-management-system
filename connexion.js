"use strict";
(async function () {
  const $ = s => document.querySelector(s);
  let setup = false;
  try { setup = (await (await fetch("/api/etat-installation", { cache: "no-store" })).json()).installation; } catch (e) { }
  if (setup) { $("#setupFields").hidden = false; $("#pwHint").hidden = false; $("#lt").textContent = "Installation"; $("#sb").textContent = "Créer le compte administrateur"; $("#password").autocomplete = "new-password"; $("#code").focus(); }
  else $("#login").focus();
  const post = async (url, body) => { const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), credentials: "same-origin" }); return { r, j: await r.json().catch(() => ({})) }; };
  /* étape 2 : code de l'application d'authentification (ou première activation) */
  let etape = "";
  function deuxiemeEtape(j) {
    etape = j.etape; $("#lf").hidden = true; $("#mf").hidden = false; $("#merr").textContent = ""; $("#mcode").value = "";
    $("#mfAct").hidden = etape !== "activation"; $("#mfAsk").hidden = etape !== "code";
    $("#lt").textContent = etape === "activation" ? "Double authentification" : "Vérification en deux étapes";
    if (etape === "activation") {
      $("#mfSec").textContent = j.secret.replace(/(.{4})/g, "$1 ").trim();
      try { const q = qrcode(0, "M"); q.addData(j.uri); q.make(); $("#mfQr").innerHTML = q.createSvgTag({ cellSize: 4, margin: 2, scalable: true }); } catch (e) { $("#mfQr").textContent = ""; }
      $("#mb").textContent = "Activer";
    } else $("#mb").textContent = "Valider";
    $("#mcode").focus();
  }
  function recommencer(msg) { etape = ""; $("#mf").hidden = true; $("#lf").hidden = false; $("#password").value = ""; $("#lt").textContent = "Plateforme de pilotage"; $("#err").textContent = msg || ""; $("#password").focus(); }
  $("#mback").onclick = () => recommencer("");
  $("#lf").addEventListener("submit", async e => {
    e.preventDefault(); $("#err").textContent = ""; $("#sb").disabled = true; const lbl = $("#sb").textContent; $("#sb").textContent = "Vérification…";
    const body = { login: $("#login").value.trim().toLowerCase(), password: $("#password").value };
    if (setup) { body.code = $("#code").value; body.nom = $("#nom").value.trim(); }
    try {
      const { r, j } = await post(setup ? "/api/installation" : "/api/connexion", body);
      if (r.ok && j.etape) { setup = false; $("#setupFields").hidden = true; $("#sb").disabled = false; $("#sb").textContent = "Se connecter"; deuxiemeEtape(j); return; }
      if (r.ok) { location.href = "/#overview"; return; }
      $("#err").textContent = j.error || "Erreur " + r.status;
    } catch (x) { $("#err").textContent = "Serveur injoignable."; }
    $("#sb").disabled = false; $("#sb").textContent = lbl; $("#err").scrollIntoView({ block: "center" });
  });
  $("#mf").addEventListener("submit", async e => {
    e.preventDefault(); $("#merr").textContent = ""; $("#mb").disabled = true;
    try {
      const { r, j } = await post(etape === "activation" ? "/api/connexion/activer" : "/api/connexion/code", { code: $("#mcode").value.trim() });
      if (r.ok && j.codesSecours) { $("#mf").hidden = true; $("#mok").hidden = false; $("#lt").textContent = "Codes de secours"; $("#mcodes").replaceChildren(...j.codesSecours.map(c => { const d = document.createElement("div"); d.textContent = c; return d; })); $("#mnote").focus(); }
      else if (r.ok) { if (j.secoursRestants !== undefined) alert(`Connexion avec un code de secours. Il vous en reste ${j.secoursRestants}. Pensez à en générer de nouveaux dans « Mon compte ».`); location.href = "/#overview"; return; }
      else if (j.recommencer) recommencer(j.error);
      else { $("#merr").textContent = j.error || "Erreur " + r.status; $("#mcode").select(); }
    } catch (x) { $("#merr").textContent = "Serveur injoignable."; }
    $("#mb").disabled = false;
  });
  $("#mnote").onchange = e => { $("#mgo").disabled = !e.target.checked; };
  $("#mgo").onclick = () => { location.href = "/#overview"; };
})();
