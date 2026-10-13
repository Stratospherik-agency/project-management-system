/* Plateforme — Console d'administration : messagerie, destinataires, notifications par e-mail, aperçu et journal */
"use strict";
let ADM = null, admTab = "messagerie", admDirty = false, admApercu = { type: "quotidien", messages: null, sel: 0 };
const JOURS_L = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const RYTHMES = [["complet", "Tout : résumé du matin, plan du lundi et alertes immédiates"], ["sans-immediat", "Résumé du matin et plan du lundi (alertes reprises dans le résumé suivant)"], ["hebdo", "Plan du lundi uniquement"], ["immediat", "Alertes immédiates uniquement"], ["aucun", "Aucun e-mail"]];
const MODE_L = { "quotidien": "Résumé du matin", "immédiat": "Alerte immédiate", "planifié": "Envoi planifié" };

async function admLoad() {
  const r = await apiFetch("admin/notifications"); const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || "Accès refusé");
  ADM = j; ADM.config.smtp.motDePasse = ""; admDirty = false;
}
function admRule(id) { const def = ADM.catalogue.find(r => r.id === id), r = ADM.config.regles[id] = ADM.config.regles[id] || {}; if (!r.params) r.params = {}; return { def, r }; }
function admRuleOn(id) { const r = ADM.config.regles[id]; return !r || r.actif !== false; }
function admMark() { admDirty = true; const b = $("#admSave"); if (b) { b.disabled = false; b.textContent = "Enregistrer les modifications"; } const s = $("#admState"); if (s) s.textContent = "Modifications non enregistrées"; }

function vAdmin() {
  if (!SERVER) return el(`<p class="muted intro">La console d'administration n'est disponible qu'en mode serveur (plateforme en ligne).</p>`);
  if (ROLE !== "admin") return el(`<p class="muted intro">Réservé aux administrateurs.</p>`);
  const wrap = el(`<div id="admRoot"><p class="muted">Chargement de la configuration…</p></div>`);
  (ADM ? Promise.resolve() : admLoad()).then(() => admRender($("#admRoot", wrap))).catch(e => { $("#admRoot", wrap).innerHTML = `<p class="red">${esc(e.message)}</p>`; });
  return wrap;
}

function admRender(root) {
  const c = ADM.config, n = ADM.catalogue.length, on = ADM.catalogue.filter(r => admRuleOn(r.id)).length;
  const ok = c.smtp.hote && c.smtp.expediteur && (c.smtp.motDePasseDefini || !c.smtp.utilisateur);
  const nbDest = new Set(Object.values(c.destinataires.roles || {}).flat().concat(c.destinataires.admins || [])).size;
  root.innerHTML = `<p class="muted intro">Console d'administration de la plateforme : configurez la messagerie, associez une adresse e-mail à chaque rôle du projet et choisissez les notifications envoyées. Rien n'est envoyé tant que l'envoi n'est pas activé.</p>
    <div class="bento" style="margin-bottom:var(--gap)">
      <div class="card c3 kpi ${c.actif ? "dark" : ""}"><div class="v">${c.actif ? "Activé" : "Désactivé"}</div><div class="l">Envoi des e-mails</div></div>
      <div class="card c3 kpi"><div class="v ${ok ? "" : "red"}">${ok ? "Prête" : "À configurer"}</div><div class="l">Messagerie (SMTP)</div></div>
      <div class="card c3 kpi"><div class="v">${nbDest}</div><div class="l">adresse(s) de destinataires${ADM.sansDestinataire.length ? ` · <span class="red">${ADM.sansDestinataire.length} rôle(s) sans adresse</span>` : ""}</div></div>
      <div class="card c3 kpi"><div class="v">${on}<small> / ${n}</small></div><div class="l">notifications activées</div></div>
    </div>
    <div class="bar adm-bar"><span class="grow">${tabs("adm", [["messagerie", "Messagerie"], ["calendrier", "Calendrier d'envoi"], ["destinataires", "Destinataires"], ["regles", "Notifications"], ["apercu", "Aperçu & journal"], ["sync", "Synchronisation du dossier"]], admTab)}</span>
      <span class="small muted" id="admState">${admDirty ? "Modifications non enregistrées" : "Enregistré"}</span><button class="btn sm" id="admSave" ${admDirty ? "" : "disabled"}>${admDirty ? "Enregistrer les modifications" : "Enregistré"}</button></div>
    <div id="admBody"></div>`;
  bindTabs(root, "adm", k => { admTab = k; admRender(root); });
  $("#admSave", root).onclick = () => admSave(root);
  const b = $("#admBody", root);
  ({ messagerie: admMessagerie, calendrier: admCalendrier, destinataires: admDest, regles: admRegles, apercu: admApercuView, sync: admSync })[admTab](b, root);
  const dirty = e => { if (!e.target.closest(".no-dirty")) admMark(); }; b.addEventListener("input", dirty); b.addEventListener("change", dirty);
}
async function admSave(root) {
  const c = clone(ADM.config); const pw = c.smtp.motDePasse; if (!pw) delete c.smtp.motDePasse;
  const r = await apiFetch("admin/notifications", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ config: c, effacerMotDePasse: !!ADM.effacerMdp }) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) { toast(j.error || "Échec de l'enregistrement"); return; }
  await admLoad(); ADM.effacerMdp = false; toast("Configuration enregistrée"); admRender(root);
}
const admBind = (root, sel, obj, key, conv) => { const e = $(sel, root); if (!e) return; e.addEventListener(e.type === "checkbox" || e.tagName === "SELECT" ? "change" : "input", () => { obj[key] = e.type === "checkbox" ? e.checked : conv ? conv(e.value) : e.value; }); };

/* ---------- Messagerie */
function admMessagerie(b, root) {
  const c = ADM.config, s = c.smtp;
  b.innerHTML = `<div class="bento">
    <div class="card c12 ${c.actif ? "blue" : ""}"><div class="hrow"><h2>Envoi des e-mails</h2><label class="switch big"><input type="checkbox" id="aActif" ${c.actif ? "checked" : ""}><span></span><b>${c.actif ? "Activé" : "Désactivé"}</b></label></div>
      <p class="small">Désactivé : aucun e-mail ne part (les états sont tout de même suivis, pour éviter une avalanche d'alertes à l'activation). Activez après avoir réussi l'e-mail de test.</p></div>
    <div class="card c7"><h2>Serveur d'envoi (SMTP)</h2>
      <div class="formgrid">
        <div><label for="aHote">Serveur</label><input id="aHote" value="${esc(s.hote)}" placeholder="mail.infomaniak.com"></div>
        <div><label for="aSec">Sécurité</label><select id="aSec">${[["ssl", "SSL/TLS (port 465)"], ["starttls", "STARTTLS (port 587)"], ["aucune", "Aucune (réseau interne uniquement)"]].map(([v, l]) => `<option value="${v}" ${s.securite === v ? "selected" : ""}>${l}</option>`).join("")}</select></div>
        <div><label for="aPort">Port</label><input id="aPort" type="number" value="${esc(s.port)}"></div>
        <div><label for="aUser">Identifiant (adresse de la boîte d'envoi)</label><input id="aUser" value="${esc(s.utilisateur)}" autocomplete="off" placeholder="pilotage@stratospherik.ch"></div>
        <div class="full"><label for="aPw">Mot de passe de la boîte d'envoi</label><input id="aPw" type="password" autocomplete="new-password" placeholder="${s.motDePasseEnv ? "Fourni par la variable d'environnement SMTP_PASSWORD" : s.motDePasseDefini ? "•••••••• enregistré — laisser vide pour le conserver" : "Saisir le mot de passe"}" ${s.motDePasseEnv ? "disabled" : ""}>
          <p class="small muted" style="margin:6px 0 0">Stocké sur le serveur hors du site web (fichier protégé), jamais renvoyé au navigateur. ${s.motDePasseDefini && !s.motDePasseEnv ? '<button class="btn ghost sm" id="aPwDel" type="button">Effacer le mot de passe enregistré</button>' : ""}</p></div>
      </div>
      <h3 style="margin-top:18px">Expéditeur</h3>
      <div class="formgrid">
        <div><label for="aFrom">Adresse d'expédition</label><input id="aFrom" value="${esc(s.expediteur)}" placeholder="pilotage@stratospherik.ch"></div>
        <div><label for="aName">Nom affiché</label><input id="aName" value="${esc(s.nomExpediteur)}"></div>
        <div><label for="aReply">Adresse de réponse (facultatif)</label><input id="aReply" value="${esc(s.repondreA)}" placeholder="communication@hepl.ch"></div>
        <div><label for="aPref">Préfixe des sujets</label><input id="aPref" value="${esc(c.prefixeSujet)}"></div>
        <div class="full"><label for="aUrl">Adresse de la plateforme (pour les liens dans les e-mails)</label><input id="aUrl" value="${esc(c.urlPlateforme)}" placeholder="${esc(location.origin)}"></div>
      </div></div>
    <div class="card c5"><h2>Tester la messagerie</h2>
      <p class="small">Enregistrez d'abord, puis envoyez un e-mail de test. En cas d'échec, le message d'erreur du serveur s'affiche ici.</p>
      <div class="no-dirty"><label for="aTo">Adresse de test</label><div class="row"><input id="aTo" style="flex:1" value="${esc((c.destinataires.admins || [])[0] || "")}" placeholder="vous@hepl.ch"><button class="btn sm" id="aTest" type="button">Envoyer un test</button></div>
      </div><div id="aTestRes" class="small" style="margin-top:10px"></div>
      <h3 style="margin-top:20px">Réglages Infomaniak</h3>
      <ul class="small" style="padding-left:18px;margin:6px 0"><li>Créer une adresse dédiée (ex. <code>pilotage@stratospherik.ch</code>) dans le Service Mail.</li><li>Serveur <code>mail.infomaniak.com</code>, SSL/TLS port 465 (ou STARTTLS 587).</li><li>Identifiant = l'adresse complète, mot de passe = celui de cette adresse.</li><li>Adresse d'expédition = la même adresse (sinon refus ou classement en spam).</li></ul>
      <p class="small muted">Données transmises par e-mail : titres, échéances et responsables. Le contenu détaillé reste dans la plateforme (décision D-009 à confirmer).</p></div></div>`;
  admBind(b, "#aActif", c, "actif"); admBind(b, "#aHote", s, "hote", v => v.trim()); admBind(b, "#aPort", s, "port", v => +v); admBind(b, "#aUser", s, "utilisateur", v => v.trim()); admBind(b, "#aPw", s, "motDePasse");
  admBind(b, "#aFrom", s, "expediteur", v => v.trim()); admBind(b, "#aName", s, "nomExpediteur"); admBind(b, "#aReply", s, "repondreA", v => v.trim()); admBind(b, "#aPref", c, "prefixeSujet"); admBind(b, "#aUrl", c, "urlPlateforme", v => v.trim());
  $("#aSec", b).addEventListener("change", e => { s.securite = e.target.value; const p = { ssl: 465, starttls: 587, aucune: 25 }[s.securite]; s.port = p; $("#aPort", b).value = p; });
  $("#aActif", b).addEventListener("change", e => { e.target.parentNode.querySelector("b").textContent = e.target.checked ? "Activé" : "Désactivé"; });
  if ($("#aPwDel", b)) $("#aPwDel", b).onclick = () => { ADM.effacerMdp = true; admMark(); toast("Le mot de passe sera effacé à l'enregistrement"); };
  if (!c.urlPlateforme) { c.urlPlateforme = location.origin; $("#aUrl", b).value = c.urlPlateforme; }
  $("#aTest", b).onclick = async () => {
    if (admDirty) { toast("Enregistrez d'abord les modifications"); return; }
    const out = $("#aTestRes", b); out.innerHTML = "Envoi en cours…";
    const r = await apiFetch("admin/notifications/test", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ to: $("#aTo", b).value }) }); const j = await r.json().catch(() => ({}));
    out.innerHTML = r.ok ? `<span class="tag st-termine">Envoyé</span> Vérifiez la boîte de réception (et les indésirables).` : `<span class="tag st-bloque">Échec</span> ${esc(j.error || "Erreur")}`;
  };
}

/* ---------- Calendrier */
function admCalendrier(b) {
  const k = ADM.config.calendrier, opt = (v, cur) => JOURS_L.map((l, i) => `<option value="${i}" ${+cur === i ? "selected" : ""}>${l}</option>`).join("");
  b.innerHTML = `<div class="bento">
    <div class="card c6"><h2>Résumé du matin</h2><div class="formgrid">
      <div><label for="cH">Heure d'envoi</label><input id="cH" type="time" value="${esc(k.heureResume)}"></div>
      <div><label class="chk" style="margin-top:28px"><input type="checkbox" id="cJO" ${k.joursOuvres ? "checked" : ""}> Jours ouvrés uniquement (lundi–vendredi)</label></div></div>
      <p class="small muted">Envoyé uniquement s'il y a au moins un point à signaler pour la personne.</p></div>
    <div class="card c6"><h2>Planification de la semaine</h2><div class="formgrid">
      <div><label for="cPJ">Jour</label><select id="cPJ">${opt(0, k.jourPlan)}</select></div><div><label for="cPH">Heure</label><input id="cPH" type="time" value="${esc(k.heurePlan)}"></div></div>
      <p class="small muted">Ce jour-là, le plan remplace le résumé du matin (un seul e-mail).</p></div>
    <div class="card c6"><h2>Rappel du rapport hebdomadaire</h2><div class="formgrid">
      <div><label for="cRJ">Jour</label><select id="cRJ">${opt(0, k.jourRapport)}</select></div><div><label for="cRH">Heure</label><input id="cRH" type="time" value="${esc(k.heureRapport)}"></div></div>
      <p class="small muted">Non envoyé si le rapport de la semaine est déjà enregistré.</p></div>
    <div class="card c6"><h2>Alertes immédiates</h2><div class="formgrid">
      <div><label for="cDI">Regrouper les modifications pendant (minutes)</label><input id="cDI" type="number" min="0" max="60" value="${esc(k.delaiImmediat)}"></div></div>
      <p class="small muted">Plusieurs modifications rapprochées donnent un seul e-mail par personne.</p></div>
    <div class="card c12"><h2>Pauses</h2><div class="formgrid">
      <div><label for="cPD">Suspendre les envois du</label><input id="cPD" type="date" value="${esc(k.pauseDu)}"></div><div><label for="cPA">au</label><input id="cPA" type="date" value="${esc(k.pauseAu)}"></div>
      <div class="full"><label for="cJS">Jours sans envoi (jours fériés, fermetures) — une date AAAA-MM-JJ par ligne ou séparées par des virgules</label><textarea id="cJS" rows="3">${esc(k.joursSansEnvoi)}</textarea></div></div>
      <p class="small muted">Pendant une pause, aucun e-mail n'est envoyé (sauf alertes de sécurité) ; les rappels reprennent ensuite selon les règles.</p></div></div>`;
  admBind(b, "#cH", k, "heureResume"); admBind(b, "#cJO", k, "joursOuvres"); admBind(b, "#cPJ", k, "jourPlan", v => +v); admBind(b, "#cPH", k, "heurePlan");
  admBind(b, "#cRJ", k, "jourRapport", v => +v); admBind(b, "#cRH", k, "heureRapport"); admBind(b, "#cDI", k, "delaiImmediat", v => +v);
  admBind(b, "#cPD", k, "pauseDu"); admBind(b, "#cPA", k, "pauseAu"); admBind(b, "#cJS", k, "joursSansEnvoi");
}

/* ---------- Destinataires */
function admDest(b) {
  const d = ADM.config.destinataires; d.roles = d.roles || {}; d.pilotage = d.pilotage || [];
  const toS = v => (Array.isArray(v) ? v : String(v || "").split(/[\s,;]+/)).filter(Boolean).join(", ");
  const toA = v => String(v).split(/[\s,;]+/).map(x => x.trim()).filter(Boolean);
  const all = [...new Set(Object.values(d.roles).flat().concat(d.admins || [], d.copie || []).map(x => String(x).toLowerCase()))].sort();
  b.innerHTML = `<div class="bento">
    <div class="card c12"><h2>Adresses par rôle</h2><p class="small">Les notifications sont adressées au rôle responsable de chaque élément (tâche, action, risque, question…). Plusieurs adresses possibles, séparées par des virgules. La colonne « Pilotage » désigne les rôles qui reçoivent les alertes de pilotage (gates, décisions, budget, escalades).</p>
      ${ADM.sansDestinataire.length ? `<p class="small"><span class="tag st-bloque">À compléter</span> Rôles responsables d'éléments en cours sans adresse : <b>${ADM.sansDestinataire.map(esc).join(", ")}</b> — leurs rappels ne seront pas envoyés.</p>` : ""}
      <div class="tw flat"><table><thead><tr><th>Code</th><th>Rôle</th><th>Personne(s)</th><th style="min-width:280px">Adresse(s) e-mail</th><th>Pilotage</th></tr></thead><tbody>
      ${S.roles.map(r => `<tr class="static"><td><b>${esc(r.code)}</b></td><td>${esc(r.nom)}</td><td class="small">${esc(r.personne || "—")}</td><td><input class="dr" data-c="${esc(r.code)}" value="${esc(toS(d.roles[r.code]))}" placeholder="prenom.nom@hepl.ch" style="width:100%" aria-label="Adresses du rôle ${esc(r.code)}"></td><td><label class="switch"><input type="checkbox" class="dp" data-c="${esc(r.code)}" ${d.pilotage.includes(r.code) ? "checked" : ""} aria-label="Pilotage ${esc(r.code)}"><span></span></label></td></tr>`).join("")}
      </tbody></table></div></div>
    <div class="card c6"><h2>Administrateurs</h2><p class="small">Reçoivent les alertes de sécurité et le rappel de sauvegarde mensuelle.</p><label for="dAd">Adresse(s)</label><input id="dAd" style="width:100%" value="${esc(toS(d.admins))}"></div>
    <div class="card c6"><h2>Copie</h2><p class="small">Adresses ajoutées aux règles pour lesquelles le destinataire « Copie » est coché (onglet Notifications).</p><label for="dCp">Adresse(s)</label><input id="dCp" style="width:100%" value="${esc(toS(d.copie))}"></div>
    <div class="card c12"><h2>Rythme de réception par personne</h2><p class="small">Chaque personne peut recevoir moins d'e-mails. Les adresses apparaissent ici après enregistrement.</p>
      ${all.length ? `<div class="tw flat"><table><thead><tr><th>Adresse</th><th>Rythme</th></tr></thead><tbody>${all.map(m => `<tr class="static"><td>${esc(m)}</td><td><select class="dy" data-m="${esc(m)}">${RYTHMES.map(([v, l]) => `<option value="${v}" ${((ADM.config.preferences[m] || {}).rythme || "complet") === v ? "selected" : ""}>${l}</option>`).join("")}</select></td></tr>`).join("")}</tbody></table></div>` : '<p class="empty">Aucune adresse enregistrée.</p>'}</div></div>`;
  $$(".dr", b).forEach(i => i.addEventListener("input", () => { const v = toA(i.value); if (v.length) d.roles[i.dataset.c] = v; else delete d.roles[i.dataset.c]; }));
  $$(".dp", b).forEach(i => i.addEventListener("change", () => { d.pilotage = d.pilotage.filter(x => x !== i.dataset.c); if (i.checked) d.pilotage.push(i.dataset.c); }));
  $("#dAd", b).addEventListener("input", e => d.admins = toA(e.target.value)); $("#dCp", b).addEventListener("input", e => d.copie = toA(e.target.value));
  $$(".dy", b).forEach(s => s.addEventListener("change", () => { ADM.config.preferences[s.dataset.m] = { rythme: s.value }; }));
}

/* ---------- Notifications (règles) */
function admRegles(b, root) {
  const cats = [...new Set(ADM.catalogue.map(r => r.cat))];
  b.innerHTML = `<div class="bar"><span class="small muted grow">Chaque notification peut être activée ou désactivée et réglée. Les notifications « Résumé du matin » sont regroupées dans un seul e-mail quotidien ; les « alertes immédiates » partent quelques minutes après la modification.</span>
      <button class="btn sec sm" id="rAllOn" type="button">Tout activer</button><button class="btn sec sm" id="rAllOff" type="button">Tout désactiver</button><button class="btn ghost sm" id="rReset" type="button">Valeurs par défaut</button></div>
    ${cats.map(cat => { const L = ADM.catalogue.filter(r => r.cat === cat); return `<div class="card c12 adm-cat"><div class="hrow"><h2>${esc(cat)}</h2><span class="small muted">${L.filter(r => admRuleOn(r.id)).length}/${L.length} activée(s) <button class="btn ghost sm cOn" data-cat="${esc(cat)}" type="button">Activer</button><button class="btn ghost sm cOff" data-cat="${esc(cat)}" type="button">Désactiver</button></span></div>
      ${L.map(def => { const r = ADM.config.regles[def.id] || {}, act = r.actif !== false, dest = Array.isArray(r.dest) ? r.dest : def.dest, prm = r.params || {}; const destOpts = def.id === "question_repondue" ? ["auteur", "responsable", "pilotage", "copie"] : def.id.startsWith("securite") || def.id === "sauvegarde_mensuelle" ? ["admins", "pilotage", "copie"] : def.id === "resume_quotidien" ? [] : ["responsable", "pilotage", "admins", "copie"];
        return `<div class="rule ${act ? "" : "off"}" data-id="${def.id}"><label class="switch"><input type="checkbox" class="rOn" ${act ? "checked" : ""} aria-label="Activer : ${esc(def.titre)}"><span></span></label>
        <div class="rule-b"><div class="rule-t"><b>${esc(def.titre)}</b> <span class="tag mode-${norm(def.mode).replace(/[^a-z]/g, "")}">${MODE_L[def.mode] || def.mode}</span></div><div class="small muted">${esc(def.pourquoi)}</div>
        ${destOpts.length ? `<div class="rule-d small"><span>Destinataires :</span>${destOpts.map(k => `<label class="chk"><input type="checkbox" class="rD" value="${k}" ${dest.includes(k) ? "checked" : ""}> ${esc(ADM.destLabels[k] || k)}</label>`).join("")}</div>` : ""}
        ${Object.keys(def.params).length ? `<div class="rule-p">${Object.entries(def.params).map(([k, p]) => `<div><label for="p_${def.id}_${k}">${esc(p.l)}</label>${p.type === "textarea" ? `<textarea id="p_${def.id}_${k}" class="rP" data-k="${k}" rows="2">${esc(prm[k] ?? p.v)}</textarea>` : `<input id="p_${def.id}_${k}" class="rP" data-k="${k}" type="${p.type === "number" ? "number" : "text"}" value="${esc(prm[k] ?? p.v)}">`}${p.aide ? `<div class="small muted">${esc(p.aide)}</div>` : ""}</div>`).join("")}</div>` : ""}
        </div></div>`; }).join("")}</div>`; }).join("")}`;
  $$(".rule", b).forEach(row => {
    const id = row.dataset.id, { def, r } = admRule(id);
    $(".rOn", row).addEventListener("change", e => { r.actif = e.target.checked; row.classList.toggle("off", !r.actif); });
    $$(".rD", row).forEach(cb => cb.addEventListener("change", () => { r.dest = $$(".rD", row).filter(x => x.checked).map(x => x.value); }));
    $$(".rP", row).forEach(i => i.addEventListener("input", () => { const p = def.params[i.dataset.k]; r.params[i.dataset.k] = p.type === "number" ? (i.value === "" ? "" : +i.value) : i.value; }));
  });
  const setAll = (v, cat) => { ADM.catalogue.filter(d => !cat || d.cat === cat).forEach(d => admRule(d.id).r.actif = v); admMark(); admRender(root); };
  $("#rAllOn", b).onclick = () => setAll(true); $("#rAllOff", b).onclick = () => setAll(false);
  $$(".cOn", b).forEach(x => x.onclick = () => setAll(true, x.dataset.cat)); $$(".cOff", b).forEach(x => x.onclick = () => setAll(false, x.dataset.cat));
  $("#rReset", b).onclick = () => { if (!confirm("Rétablir toutes les notifications (activation, destinataires, réglages) aux valeurs par défaut ?")) return; ADM.config.regles = {}; admMark(); admRender(root); };
}

/* ---------- Aperçu & journal */
function admApercuView(b) {
  b.innerHTML = `<div class="bento">
    <div class="card c12"><div class="hrow"><h2>Aperçu des e-mails</h2><span>${tabs("apt", [["quotidien", "Résumé du matin (aujourd'hui)"], ["hebdo", "Planification de la semaine"], ["immediat", "Alertes en attente"]], admApercu.type)}</span></div>
      <p class="small muted">Ce que chaque destinataire recevrait aujourd'hui, calculé sur les données actuelles. Rien n'est envoyé. Dernier résumé envoyé : ${ADM.etat.dernier && ADM.etat.dernier.resume ? fd(ADM.etat.dernier.resume) : "jamais"}.</p>
      <div id="apList" class="small muted">Calcul…</div></div>
    <div class="card c12"><div class="hrow"><h2>Journal des envois</h2><button class="btn sec sm" id="jrRef" type="button">Actualiser</button></div><div id="jrList" class="small muted">Chargement…</div></div></div>`;
  bindTabs(b, "apt", k => { admApercu.type = k; admApercu.sel = 0; admApercuView(b); });
  (async () => {
    const r = await apiFetch("admin/notifications/apercu", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: admApercu.type }) }); const j = await r.json().catch(() => ({ messages: [] }));
    const M = j.messages || [], box = $("#apList", b);
    if (!M.length) { box.innerHTML = `<p class="empty">Aucun e-mail ${admApercu.type === "immediat" ? "en attente" : "à envoyer aujourd'hui"} avec les réglages actuels.</p>`; return; }
    box.classList.remove("muted");
    box.innerHTML = `<div class="ap-grid"><div class="ap-list">${M.map((m, i) => `<button type="button" class="ap-item ${i === admApercu.sel ? "on" : ""}" data-i="${i}"><b>${esc(m.to)}</b><span>${esc(m.sujet)}</span><span class="muted">${m.n} point(s) · ${esc((RYTHMES.find(x => x[0] === m.rythme) || ["", m.rythme])[1])}</span></button>`).join("")}
      <p style="margin-top:12px"><button class="btn sm" id="apSend" type="button">${admApercu.type === "immediat" ? "Envoyer les alertes maintenant" : "Envoyer maintenant"}</button></p></div><div class="ap-view" id="apView"></div></div>`;
    const show = i => { admApercu.sel = i; $$(".ap-item", box).forEach(x => x.classList.toggle("on", +x.dataset.i === i)); const v = $("#apView", box); v.innerHTML = ""; const f = document.createElement("iframe"); f.setAttribute("sandbox", ""); f.title = "Aperçu de l'e-mail"; f.srcdoc = M[i].html; v.appendChild(f); };
    $$(".ap-item", box).forEach(x => x.onclick = () => show(+x.dataset.i)); show(Math.min(admApercu.sel, M.length - 1));
    $("#apSend", box).onclick = async () => {
      if (!ADM.config.actif && !confirm("L'envoi automatique est désactivé. Envoyer quand même ces e-mails maintenant ?")) return;
      if (ADM.config.actif && !confirm(`Envoyer ${M.length} e-mail(s) maintenant ?`)) return;
      const r2 = await apiFetch("admin/notifications/envoyer", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: admApercu.type }) }); const j2 = await r2.json().catch(() => ({}));
      toast(r2.ok ? `${j2.envoyes || 0} e-mail(s) envoyé(s)${j2.echecs && j2.echecs.length ? `, ${j2.echecs.length} échec(s) : ${j2.echecs[0].erreur}` : ""}` : (j2.error || "Échec")); admApercuView(b);
    };
  })();
  const loadJ = async () => {
    const r = await apiFetch("admin/notifications/journal"); const j = await r.json().catch(() => ({ journal: [] })), L = j.journal || [];
    const TL = { quotidien: "Résumé du matin", hebdo: "Plan de la semaine", immediat: "Alerte", rapport: "Rappel rapport", test: "Test" };
    $("#jrList", b).classList.remove("muted");
    $("#jrList", b).innerHTML = L.length ? `<div class="tw flat"><table><thead><tr><th>Date</th><th>Type</th><th>Destinataire</th><th>Sujet</th><th>Résultat</th></tr></thead><tbody>${L.map(x => `<tr class="static"><td class="nowrap">${fdt(x.ts)}</td><td>${esc(TL[x.type] || x.type)}</td><td>${esc(x.to)}</td><td>${esc(x.sujet)}</td><td>${x.ok ? tag("Envoyé", "st-termine") : tag("Échec", "st-bloque") + ` <span class="small">${esc(x.erreur)}</span>`}</td></tr>`).join("")}</tbody></table></div>` : '<p class="empty">Aucun envoi pour le moment.</p>';
  };
  $("#jrRef", b).onclick = loadJ; loadJ();
}

/* ---------- Synchronisation du dossier projet */
function admSync(b) {
  b.classList.add("no-dirty");
  b.innerHTML = `<div class="bento no-dirty"><div class="card c12" id="syEtat"><p class="muted">Chargement…</p></div></div>`;
  const charger = async () => {
    const r = await apiFetch("admin/sync"); const j = await r.json().catch(() => ({}));
    const box = $("#syEtat", b);
    if (!r.ok) { box.innerHTML = `<p class="red">${esc(j.error || "Erreur")}</p>`; return; }
    if (!j.miroir) { box.innerHTML = `<h2>Synchronisation</h2><p>La plateforme lit directement le dossier projet de cet ordinateur : aucune synchronisation n'est nécessaire.</p>`; return; }
    const actifs = j.jetons.filter(x => !x.revoque);
    box.outerHTML = `<div class="card c7"><h2>Dossier projet en ligne</h2>
        <p><b>${j.fichiers}</b> fichier(s) en ligne · ${tailleF(j.octets || 0)}. Consultation : <a href="#fichiers">Dossier projet</a>.</p>
        <h3 style="margin-top:16px">Mise en place (une fois, sur le Mac)</h3>
        <ol class="small" style="padding-left:20px;line-height:1.7"><li>Créer un jeton ci-contre et le copier.</li><li>Double-cliquer <code>00_PILOTAGE/Tableau-de-bord/Synchroniser-le-projet.command</code> (Terminal), coller l'adresse du site et le jeton : ils sont enregistrés dans <code>~/.hepvd-synchronisation.json</code>, jamais dans Git.</li><li>Ensuite, un double-clic suffit : seuls les fichiers nouveaux ou modifiés sont envoyés ; les fichiers supprimés sur le Mac sont retirés du site (conservés dans une corbeille sur le serveur).</li><li>Synchronisation automatique chaque soir : dans le Terminal, <code>node outils/synchroniser.js --planifier=18:30</code> depuis le dossier Tableau-de-bord.</li></ol>
        <p class="small muted">Le dossier <code>Tableau-de-bord</code> (code) n'est jamais envoyé. Options : <code>--simulation</code> (voir sans envoyer), <code>--sans-suppression</code>, <code>--configurer</code>, <code>--deplanifier</code>.</p></div>
      <div class="card c5"><h2>Jetons de synchronisation</h2>
        <div class="row"><input id="syNom" placeholder="Nom (ex. MacBook U-Com)" style="flex:1"><button class="btn sm" id="syNew" type="button">Créer un jeton</button></div>
        <div id="syTok" style="margin-top:10px"></div>
        <div class="tw flat" style="margin-top:12px"><table><thead><tr><th>Nom</th><th>Créé</th><th>Dernier usage</th><th></th></tr></thead><tbody>${j.jetons.map(x => `<tr class="static"><td>${esc(x.nom)}${x.revoque ? " " + tag("Révoqué", "st-bloque") : ""}</td><td class="small">${fdt(x.cree)}<br>${esc(x.par || "")}</td><td class="small">${fdt(x.dernierUsage)}</td><td>${x.revoque ? "" : `<button class="btn ghost sm syRev" data-id="${x.id}" type="button">Révoquer</button>`}</td></tr>`).join("") || '<tr><td colspan="4" class="empty">Aucun jeton</td></tr>'}</tbody></table></div>
        <p class="small muted">${actifs.length} jeton(s) actif(s). Révoquer un jeton perdu ou celui d'un ordinateur remplacé.</p></div>
      <div class="card c12"><h2>Dernières synchronisations</h2>${j.journal.length ? `<div class="tw flat"><table><thead><tr><th>Date</th><th>Jeton</th><th>Envoyés</th><th>Retirés</th><th>Volume</th><th>Total en ligne</th></tr></thead><tbody>${j.journal.map(x => `<tr class="static"><td class="nowrap">${fdt(x.fin || x.ts)}</td><td>${esc(x.jeton || "")}</td><td>${x.envoyes}</td><td>${x.supprimes}</td><td>${tailleF(x.octets || 0)}</td><td>${x.total}</td></tr>`).join("")}</tbody></table></div>` : '<p class="empty">Aucune synchronisation pour le moment.</p>'}</div>`;
    $("#syNew", b).onclick = async () => {
      const r2 = await apiFetch("admin/sync/jetons", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nom: $("#syNom", b).value || "Mac" }) }); const j2 = await r2.json().catch(() => ({}));
      if (!r2.ok) return toast(j2.error || "Échec");
      const t = $("#syTok", b); t.innerHTML = `<div class="newv"><b>Copiez ce jeton maintenant</b> : il ne sera plus affiché.<div class="row" style="margin-top:6px"><input id="syVal" readonly value="${esc(j2.jeton)}" style="flex:1;font-family:ui-monospace,Menlo,monospace;font-size:12.5px"><button class="btn sm" id="syCopy" type="button">Copier</button></div></div>`;
      $("#syCopy", b).onclick = () => { const i = $("#syVal", b); i.select(); (navigator.clipboard ? navigator.clipboard.writeText(i.value) : Promise.reject()).then(() => toast("Jeton copié"), () => { document.execCommand("copy"); toast("Jeton copié"); }); };
    };
    $$(".syRev", b).forEach(x => x.onclick = async () => { if (!confirm("Révoquer ce jeton ? L'ordinateur qui l'utilise ne pourra plus synchroniser.")) return; await apiFetch("admin/sync/jetons/" + x.dataset.id, { method: "DELETE" }); toast("Jeton révoqué"); admSync(b); });
  };
  charger();
}
