/* Plateforme — Contributrices et contributeurs du site : annuaire des entités et des personnes qui éditent le site,
 * recherche, filtres, ajout / modification / suppression, historique, import et export (Excel, CSV), échanges avec Jotform.
 * Les données vivent dans la base (S.annuaire), jamais dans le dépôt Git. */
"use strict";
const ANN_TYPES = ["Filière", "UER", "Centre", "Laboratoire", "Unité administrative", "Commission", "Conseil", "Instance"];
const ANN_OUINON = ["Oui", "Non"];
const ANN_INSC = ["Non inscrit·e", "Inscrit·e", "Formé·e en atelier", "Absent·e", "Dispensé·e"];
const ANN_CRENEAUX = ["1 · lundi 18 janvier 2027 · 9 h 00 – 10 h 45", "2 · mardi 19 janvier 2027 · 14 h 00 – 15 h 45", "3 · jeudi 21 janvier 2027 · 9 h 00 – 10 h 45",
  "4 · lundi 25 janvier 2027 · 14 h 00 – 15 h 45", "5 · mardi 26 janvier 2027 · 9 h 00 – 10 h 45", "6 · jeudi 28 janvier 2027 · 14 h 00 – 15 h 45",
  "7 · lundi 1er février 2027 · 9 h 00 – 10 h 45", "8 · mardi 2 février 2027 · 14 h 00 – 15 h 45", "9 · jeudi 4 février 2027 · 9 h 00 – 10 h 45",
  "10 · lundi 15 février 2027 · 14 h 00 – 15 h 45", "11 · mardi 16 février 2027 · 9 h 00 – 10 h 45", "12 · jeudi 18 février 2027 · 14 h 00 – 15 h 45",
  "R1 · mardi 23 février 2027 · 9 h 00 – 10 h 45", "R2 · jeudi 25 février 2027 · 14 h 00 – 15 h 45"];
const ANN_J_P = "Contributeur·rice", ANN_J_E = "Entité", ANN_J_A = "Annuaire des contributeurs";
/* colonnes d'import / export (un même format pour l'aller et le retour) */
const ANN_COL_E = ["ID", "Type", "Entité", "Abréviation", "Responsable(s)", "Commentaire"];
const ANN_COL_P = ["ID", "Nom", "E-mail", "Identifiant", "Entités (ID)", "Entités", "Formé·e à Jahia", "Accès à Jahia", "Inscription atelier", "Créneau", "Notes"];
const cst = { tab: "personnes", q: "", type: "", ent: "", resp: "", form: "", acces: "", insc: "", cren: "" };

function annuaire() { if (!S.annuaire) S.annuaire = {}; const A = S.annuaire; if (!Array.isArray(A.entites)) A.entites = []; if (!Array.isArray(A.personnes)) A.personnes = []; if (!Array.isArray(A.creneaux)) A.creneaux = ANN_CRENEAUX.slice(); return A; }
const annEnt = id => annuaire().entites.find(e => e.id === id);
const annLabel = e => e ? `${e.type ? e.type + " · " : ""}${e.nom}${e.abrev ? " (" + e.abrev + ")" : ""}` : "";
const annCourt = e => e ? (e.abrev ? (["Filière", "UER"].includes(e.type) ? e.type + " " : "") + e.abrev : e.nom) : "?";
const annChip = e => e ? `<span class="chip" title="${esc(annLabel(e))}">${esc(annCourt(e))}</span>` : "";
const annResp = () => [...new Set(annuaire().entites.flatMap(e => e.responsables || []))].sort((a, b) => a.localeCompare(b, "fr"));
const annPersDe = id => annuaire().personnes.filter(p => (p.entites || []).includes(id));
const annNextId = (list, pre) => { let m = 0; list.forEach(x => { const r = String(x.id || "").match(/(\d+)$/); if (r) m = Math.max(m, +r[1]); }); return pre + String(m + 1).padStart(3, "0"); };
const annOK = () => !READONLY();
const annMail = s => String(s || "").trim().toLowerCase();
const annValidMail = s => /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(s);

/* ---------- filtres */
function annPersonnes() {
  const A = annuaire(), q = norm(cst.q).split(/\s+/).filter(Boolean);
  return A.personnes.filter(p => {
    const E = (p.entites || []).map(annEnt).filter(Boolean);
    if (cst.type && !E.some(e => e.type === cst.type)) return false;
    if (cst.ent && !(p.entites || []).includes(cst.ent)) return false;
    if (cst.resp && !E.some(e => (e.responsables || []).includes(cst.resp))) return false;
    if (cst.form && p.formation !== cst.form) return false;
    if (cst.acces && p.acces !== cst.acces) return false;
    if (cst.insc && (p.atelier || ANN_INSC[0]) !== cst.insc) return false;
    if (cst.cren && (cst.cren === "-" ? p.creneau : p.creneau !== cst.cren)) return false;
    if (q.length) { const h = norm([p.nom, p.email, p.identifiant, p.notes, p.creneau, E.map(e => annLabel(e) + " " + (e.responsables || []).join(" ")).join(" ")].join(" ")); if (!q.every(w => h.includes(w))) return false; }
    return true;
  }).sort((a, b) => a.nom.localeCompare(b.nom, "fr"));
}
function annEntites() {
  const q = norm(cst.q).split(/\s+/).filter(Boolean);
  return annuaire().entites.filter(e => (!cst.type || e.type === cst.type) && (!cst.ent || e.id === cst.ent) && (!cst.resp || (e.responsables || []).includes(cst.resp))
    && (!q.length || q.every(w => norm([annLabel(e), (e.responsables || []).join(" "), e.commentaire].join(" ")).includes(w))))
    .sort((a, b) => ANN_TYPES.indexOf(a.type) - ANN_TYPES.indexOf(b.type) || a.nom.localeCompare(b.nom, "fr"));
}

/* ---------- vue */
function vContributeurs() {
  const A = annuaire(), ok = annOK(), P = A.personnes;
  if (cst.ent && !annEnt(cst.ent)) cst.ent = "";
  const n = f => P.filter(f).length;
  const opt = (v, l, cur) => `<option value="${esc(v)}" ${cur === v ? "selected" : ""}>${esc(l)}</option>`;
  const wrap = el(`<p class="muted intro">Entités du site, responsables et contributrices et contributeurs qui éditent leurs pages. Ces informations servent à toute la gestion du site (accès, formation, communication) et alimentent le formulaire Jotform des ateliers.</p>
    <div class="bento" style="margin-bottom:var(--gap)">
      <div class="card c3 kpi dark"><div class="v">${P.length}</div><div class="l">contributrices et contributeurs</div></div>
      <div class="card c3 kpi"><div class="v">${A.entites.length}</div><div class="l">entités</div></div>
      <div class="card c3 kpi"><div class="v">${n(p => p.formation === "Oui")} <span class="small muted">/ ${P.length}</span></div><div class="l">déjà formé·es à Jahia · ${n(p => p.acces === "Oui")} avec un accès</div></div>
      <div class="card c3 kpi"><div class="v">${n(p => p.atelier && p.atelier !== ANN_INSC[0])}</div><div class="l">inscrit·es à un atelier (${n(p => p.atelier === "Formé·e en atelier")} formé·es)</div></div>
    </div>
    <div class="card searchcard"><label for="cq" class="sr">Rechercher dans l'annuaire</label>
      <div class="searchbox"><span aria-hidden="true">⌕</span><input id="cq" type="search" placeholder="Rechercher : nom, e-mail, identifiant, entité, responsable…" value="${esc(cst.q)}" autocomplete="off"></div>
      <div class="bar ann-bar" style="margin:10px 0 0">
        <select id="cft" aria-label="Type d'entité"><option value="">Tous les types d'entité</option>${ANN_TYPES.map(t => opt(t, t, cst.type)).join("")}</select>
        <select id="cfe" aria-label="Entité"><option value="">Toutes les entités</option>${A.entites.slice().sort((a, b) => annLabel(a).localeCompare(annLabel(b), "fr")).map(e => opt(e.id, annLabel(e), cst.ent)).join("")}</select>
        <select id="cfr" aria-label="Responsable"><option value="">Tous les responsables</option>${annResp().map(r => opt(r, r, cst.resp)).join("")}</select>
        <select id="cff" aria-label="Formation à Jahia"><option value="">Formation : toutes</option>${opt("Oui", "Déjà formé·e à Jahia", cst.form)}${opt("Non", "Pas encore formé·e", cst.form)}</select>
        <select id="cfa" aria-label="Accès à Jahia"><option value="">Accès : tous</option>${opt("Oui", "Avec accès d'édition", cst.acces)}${opt("Non", "Sans accès", cst.acces)}</select>
        <select id="cfi" aria-label="Inscription à un atelier"><option value="">Atelier : tous</option>${ANN_INSC.map(s => opt(s, s, cst.insc)).join("")}</select>
        <select id="cfc" aria-label="Créneau"><option value="">Tous les créneaux</option>${opt("-", "Sans créneau", cst.cren)}${A.creneaux.map(c => opt(c, c, cst.cren)).join("")}</select>
        <button class="btn ghost sm" id="cfx">Effacer les filtres</button>
        <span class="grow"></span><span id="ccount" class="small muted"></span></div>
      <div class="bar" style="margin:10px 0 0">
        ${ok ? `<button class="btn sm" id="cadd">+ Contributrice ou contributeur</button><button class="btn sec sm" id="ceadd">+ Entité</button><button class="btn sec sm" id="cimp">Importer (Excel, CSV)</button>` : ""}
        <button class="btn sec sm" id="cxls">Exporter tout (Excel)</button><button class="btn sec sm" id="ccsv">Exporter la liste affichée (CSV)</button>
        <button class="btn sec sm" id="cjot">Jotform</button>${ok ? `<button class="btn ghost sm" id="ccren">Créneaux des ateliers</button>` : ""}</div></div>
    ${tabs("ctr", [["personnes", "Contributrices et contributeurs"], ["entites", "Entités"], ["historique", "Historique"]], cst.tab)}<div id="cres"></div>`);
  const fill = () => {
    const box = $("#cres", wrap);
    if (cst.tab === "personnes") {
      const r = annPersonnes(); $("#ccount", wrap).textContent = `${r.length} personne(s) sur ${P.length}`;
      box.innerHTML = r.length ? `<div class="tw"><table><thead><tr><th>Nom</th><th>Entité(s)</th><th>E-mail</th><th>Identifiant</th><th>Formé·e</th><th>Accès</th><th>Atelier</th></tr></thead><tbody>${r.map(p => `<tr data-p="${esc(p.id)}" tabindex="0">
        <td><b>${esc(p.nom)}</b>${p.notes ? `<div class="small muted">${esc(p.notes.slice(0, 90))}</div>` : ""}</td><td>${(p.entites || []).map(id => annChip(annEnt(id))).join(" ")}</td>
        <td class="small"><a href="mailto:${esc(p.email)}">${esc(p.email)}</a></td><td class="small nowrap">${esc(p.identifiant || "—")}</td>
        <td>${p.formation === "Oui" ? tag("Oui", "st-termine") : tag("Non", "st-afaire")}</td><td>${p.acces === "Oui" ? tag("Oui", "st-termine") : tag("Non", "st-bloque")}</td>
        <td class="small">${esc(p.atelier || ANN_INSC[0])}${p.creneau ? `<div class="muted">${esc(p.creneau)}</div>` : ""}</td></tr>`).join("")}</tbody></table></div>` : '<p class="empty">Aucune personne ne correspond. Importez un fichier ou ajoutez une personne.</p>';
    } else if (cst.tab === "entites") {
      const r = annEntites(); $("#ccount", wrap).textContent = `${r.length} entité(s) sur ${A.entites.length}`;
      box.innerHTML = r.length ? `<div class="tw"><table><thead><tr><th>Type</th><th>Entité</th><th>Responsable(s)</th><th>Contributeurs</th><th>Commentaire</th></tr></thead><tbody>${r.map(e => { const pe = annPersDe(e.id);
        return `<tr data-e="${esc(e.id)}" tabindex="0"><td class="small nowrap">${esc(e.type)}</td><td><b>${esc(e.nom)}</b>${e.abrev ? ` <span class="muted">(${esc(e.abrev)})</span>` : ""}</td><td class="small">${(e.responsables || []).map(esc).join("<br>") || "—"}</td>
        <td class="small">${pe.length} · ${pe.map(p => esc(p.nom)).join(", ")}</td><td class="small">${esc(e.commentaire || "")}</td></tr>`; }).join("")}</tbody></table></div>` : '<p class="empty">Aucune entité.</p>';
    } else {
      $("#ccount", wrap).textContent = "";
      const j = S.journal.filter(x => [ANN_J_P, ANN_J_E, ANN_J_A].includes(x.type));
      box.innerHTML = `<div class="tw"><table><thead><tr><th>Date</th><th>Par</th><th>Objet</th><th>Modification</th></tr></thead><tbody>${j.map(x => `<tr class="static"><td class="nowrap small">${fdt(x.ts)}</td><td class="small">${esc(x.user)}</td><td>${esc(x.type)} ${esc(x.id)}<br><span class="small muted">${esc(x.resume || "")}</span></td><td class="small">${esc(x.action)}</td></tr>`).join("") || '<tr><td colspan="4" class="empty">Aucune modification enregistrée pour le moment.</td></tr>'}</tbody></table></div>`;
    }
  };
  fill();
  bindTabs(wrap, "ctr", k => { cst.tab = k; rerender(); });
  $("#cq", wrap).oninput = e => { cst.q = e.target.value; fill(); };
  [["#cft", "type"], ["#cfe", "ent"], ["#cfr", "resp"], ["#cff", "form"], ["#cfa", "acces"], ["#cfi", "insc"], ["#cfc", "cren"]].forEach(([s, k]) => $(s, wrap).onchange = e => { cst[k] = e.target.value; fill(); });
  $("#cfx", wrap).onclick = () => { Object.assign(cst, { q: "", type: "", ent: "", resp: "", form: "", acces: "", insc: "", cren: "" }); rerender(); };
  const openRow = e => { const tr = e.target.closest("tr[data-p],tr[data-e]"); if (!tr) return; if (tr.dataset.p) annEditPersonne(A.personnes.find(p => p.id === tr.dataset.p)); else annEditEntite(annEnt(tr.dataset.e)); };
  $("#cres", wrap).addEventListener("click", e => { if (e.target.closest("a,button")) return; openRow(e); });
  $("#cres", wrap).addEventListener("keydown", e => { if (e.key === "Enter") openRow(e); });
  if (ok) { $("#cadd", wrap).onclick = () => annEditPersonne(null); $("#ceadd", wrap).onclick = () => annEditEntite(null); $("#cimp", wrap).onclick = annImport; $("#ccren", wrap).onclick = annCreneaux; }
  $("#cxls", wrap).onclick = annExportXlsx;
  $("#ccsv", wrap).onclick = () => cst.tab === "entites" ? download(`HEPVD_entites_${todayIso()}.csv`, "﻿" + [ANN_COL_E.join(";")].concat(annEntites().map(e => annRowE(e).map(annCsvCell).join(";"))).join("\n"), "text/csv;charset=utf-8") : annExportCsv(annPersonnes());
  $("#cjot", wrap).onclick = annJotform;
  setTimeout(() => { const i = $("#cq"); if (i && !("ontouchstart" in window)) i.focus(); }, 0);
  return wrap;
}

/* ---------- fiche personne */
function annEntitesPicker(sel) {
  const A = annuaire();
  return `<div class="full"><label for="pEntQ">Entité(s) *</label><p class="small" id="pEntSel" style="margin:2px 0 6px">${sel.length ? "Sélection : " + sel.map(id => esc(annCourt(annEnt(id)))).join(", ") : "Aucune entité sélectionnée."}</p><input id="pEntQ" type="search" placeholder="Filtrer la liste des entités…" autocomplete="off">
    <div id="pEnt" class="ann-pick" role="group" aria-label="Entités">${ANN_TYPES.map(t => { const l = A.entites.filter(e => e.type === t).sort((a, b) => a.nom.localeCompare(b.nom, "fr")); return l.length ? `<div class="small muted ann-pick-t">${esc(t)}</div>${l.map(e => `<label class="chk" data-n="${esc(norm(annLabel(e)))}"><input type="checkbox" value="${esc(e.id)}" ${sel.includes(e.id) ? "checked" : ""}> ${esc(e.nom)}${e.abrev ? ` (${esc(e.abrev)})` : ""}</label>`).join("")}` : ""; }).join("")}</div></div>`;
}
function annEditPersonne(p) {
  const A = annuaire(), isNew = !p, ok = annOK(), o = p ? clone(p) : { id: annNextId(A.personnes, "PER-"), nom: "", email: "", identifiant: "", entites: cst.ent ? [cst.ent] : [], formation: "Non", acces: "Non", atelier: ANN_INSC[0], creneau: "", notes: "" };
  const sel = (id, list, v) => `<select id="${id}">${list.map(x => `<option ${x === v ? "selected" : ""}>${esc(x)}</option>`).join("")}</select>`;
  const cr = A.creneaux.slice(); if (o.creneau && !cr.includes(o.creneau)) cr.unshift(o.creneau);
  openModal((isNew ? "Nouvelle personne" : o.nom) + " · " + o.id, `<div><label for="pNom">Prénom et nom *</label><input id="pNom" value="${esc(o.nom)}" autocomplete="off"></div>
    <div><label for="pMail">Adresse e-mail *</label><input id="pMail" type="email" value="${esc(o.email)}" autocomplete="off"></div>
    <div><label for="pId">Identifiant HEP Vaud</label><input id="pId" value="${esc(o.identifiant)}" placeholder="p12345" autocomplete="off"></div>
    <div><label for="pForm">Déjà formé·e à Jahia</label>${sel("pForm", ANN_OUINON, o.formation)}</div>
    <div><label for="pAcc">Accès d'édition dans Jahia</label>${sel("pAcc", ANN_OUINON, o.acces)}</div>
    <div><label for="pInsc">Atelier Jahia 8</label>${sel("pInsc", ANN_INSC, o.atelier || ANN_INSC[0])}</div>
    <div class="full"><label for="pCren">Créneau</label><select id="pCren"><option value="">—</option>${cr.map(c => `<option ${c === o.creneau ? "selected" : ""}>${esc(c)}</option>`).join("")}</select></div>
    ${annEntitesPicker(o.entites || [])}
    <div class="full"><label for="pNotes">Notes</label><textarea id="pNotes">${esc(o.notes || "")}</textarea></div>
    ${isNew ? "" : `<div class="full small muted">${S.journal.filter(j => j.type === ANN_J_P && j.id === o.id).slice(0, 8).map(j => `${fdt(j.ts)} · ${esc(j.user)} · ${esc(j.action)}`).join("<br>")}</div>`}`,
    `${!isNew && ok ? `<button class="btn danger l" id="pDel">Supprimer</button>` : ""}<button class="btn sec" id="pC">${ok ? "Annuler" : "Fermer"}</button>${ok ? `<button class="btn" id="pS">Enregistrer</button>` : ""}`, () => {
      $("#pC").onclick = closeModal;
      $("#pEnt").onchange = () => { const l = $$("#pEnt input:checked").map(i => annCourt(annEnt(i.value))); $("#pEntSel").textContent = l.length ? "Sélection : " + l.join(", ") : "Aucune entité sélectionnée."; };
      $("#pEntQ").oninput = e => { const q = norm(e.target.value); $$("#pEnt label").forEach(l => l.hidden = q && !l.dataset.n.includes(q)); };
      if (!ok) return;
      if ($("#pDel")) $("#pDel").onclick = () => { if (!confirm(`Supprimer ${o.nom} de l'annuaire ? (la suppression reste tracée dans l'historique)`)) return; A.personnes = A.personnes.filter(x => x.id !== o.id); save({ type: ANN_J_P, id: o.id, action: "Suppression", resume: o.nom }); closeModal(); toast("Supprimé"); rerender(); };
      $("#pS").onclick = () => {
        const out = Object.assign({}, o, { nom: $("#pNom").value.replace(/\s+/g, " ").trim(), email: annMail($("#pMail").value), identifiant: $("#pId").value.trim().toLowerCase(), formation: $("#pForm").value, acces: $("#pAcc").value, atelier: $("#pInsc").value, creneau: $("#pCren").value, notes: $("#pNotes").value.trim(), entites: $$("#pEnt input:checked").map(i => i.value) });
        if (!out.nom) { $("#pNom").focus(); return toast("Le nom est obligatoire"); }
        if (!annValidMail(out.email)) { $("#pMail").focus(); return toast("Adresse e-mail invalide"); }
        if (A.personnes.some(x => x.id !== o.id && x.email === out.email)) return toast("Cette adresse e-mail existe déjà dans l'annuaire");
        if (out.identifiant && A.personnes.some(x => x.id !== o.id && x.identifiant === out.identifiant)) return toast("Cet identifiant existe déjà dans l'annuaire");
        if (!out.entites.length) return toast("Rattachez la personne à au moins une entité");
        const lab = ids => (ids || []).map(id => annCourt(annEnt(id))).join(", ");
        const flds = [F("nom", "Nom"), F("email", "E-mail"), F("identifiant", "Identifiant"), F("formation", "Formé·e"), F("acces", "Accès"), F("atelier", "Atelier"), F("creneau", "Créneau"), F("notes", "Notes")];
        let d = isNew ? "Création" : diffSummary(p, out, flds);
        if (!isNew && lab(p.entites) !== lab(out.entites)) d = [d, `Entités : « ${lab(p.entites)} » → « ${lab(out.entites)} »`].filter(Boolean).join(" ; ");
        if (isNew) A.personnes.push(out); else A.personnes[A.personnes.findIndex(x => x.id === o.id)] = out;
        if (d) save({ type: ANN_J_P, id: out.id, action: d, resume: `${out.nom} · ${lab(out.entites)}` });
        closeModal(); toast("Enregistré"); rerender();
      };
    }, true);
}

/* ---------- fiche entité */
function annEditEntite(e) {
  const A = annuaire(), isNew = !e, ok = annOK(), o = e ? clone(e) : { id: annNextId(A.entites, "ENT-"), type: cst.type || "", nom: "", abrev: "", responsables: [], commentaire: "" };
  const pe = isNew ? [] : annPersDe(o.id);
  openModal((isNew ? "Nouvelle entité" : annLabel(o)) + " · " + o.id, `<div><label for="eType">Type *</label><select id="eType"><option value="">—</option>${ANN_TYPES.map(t => `<option ${t === o.type ? "selected" : ""}>${t}</option>`).join("")}</select></div>
    <div><label for="eAbr">Abréviation</label><input id="eAbr" value="${esc(o.abrev)}"></div>
    <div class="full"><label for="eNom">Nom de l'entité *</label><input id="eNom" value="${esc(o.nom)}"></div>
    <div class="full"><label for="eResp">Responsable(s) — séparer par un point-virgule</label><input id="eResp" value="${esc((o.responsables || []).join(" ; "))}"></div>
    <div class="full"><label for="eCom">Commentaire</label><textarea id="eCom">${esc(o.commentaire || "")}</textarea></div>
    ${isNew ? "" : `<div class="full"><h3>${pe.length} contributrice(s) ou contributeur(s)</h3><p class="small">${pe.map(p => esc(p.nom)).join(", ") || "Aucune personne rattachée."}</p></div>`}`,
    `${!isNew && ok ? `<button class="btn danger l" id="eDel">Supprimer</button>` : ""}<button class="btn sec" id="eC">${ok ? "Annuler" : "Fermer"}</button>${ok ? `<button class="btn" id="eS">Enregistrer</button>` : ""}`, () => {
      $("#eC").onclick = closeModal; if (!ok) return;
      if ($("#eDel")) $("#eDel").onclick = () => {
        if (!confirm(`Supprimer l'entité « ${annLabel(o)} » ?${pe.length ? `\n${pe.length} personne(s) y sont rattachées : le lien sera retiré, les personnes restent dans l'annuaire.` : ""}`)) return;
        A.entites = A.entites.filter(x => x.id !== o.id); A.personnes.forEach(p => { p.entites = (p.entites || []).filter(id => id !== o.id); });
        save({ type: ANN_J_E, id: o.id, action: "Suppression" + (pe.length ? ` (lien retiré pour ${pe.length} personne(s))` : ""), resume: annLabel(o) }); closeModal(); toast("Supprimée"); rerender();
      };
      $("#eS").onclick = () => {
        const out = Object.assign({}, o, { type: $("#eType").value, nom: $("#eNom").value.replace(/\s+/g, " ").trim(), abrev: $("#eAbr").value.trim(), responsables: $("#eResp").value.split(";").map(s => s.replace(/\s+/g, " ").trim()).filter(Boolean), commentaire: $("#eCom").value.trim() });
        if (!out.type) return toast("Le type est obligatoire"); if (!out.nom) { $("#eNom").focus(); return toast("Le nom est obligatoire"); }
        if (A.entites.some(x => x.id !== o.id && norm(annLabel(x)) === norm(annLabel(out)))) return toast("Cette entité existe déjà");
        const d = isNew ? "Création" : diffSummary(Object.assign({}, e, { responsables: (e.responsables || []).join(" ; ") }), Object.assign({}, out, { responsables: out.responsables.join(" ; ") }), [F("type", "Type"), F("nom", "Nom"), F("abrev", "Abréviation"), F("responsables", "Responsable(s)"), F("commentaire", "Commentaire")]);
        if (isNew) A.entites.push(out); else A.entites[A.entites.findIndex(x => x.id === o.id)] = out;
        if (d) save({ type: ANN_J_E, id: out.id, action: d, resume: annLabel(out) });
        closeModal(); toast("Enregistré"); rerender();
      };
    }, true);
}

/* ---------- créneaux */
function annCreneaux() {
  const A = annuaire();
  openModal("Créneaux des ateliers", `<div class="full"><p class="small muted" style="margin-top:0">Un créneau par ligne. Ils alimentent la fiche des personnes, le filtre et l'import des inscriptions Jotform. Un créneau retiré reste affiché sur les fiches qui l'utilisent.</p><label for="crT">Créneaux</label><textarea id="crT" rows="14">${esc(A.creneaux.join("\n"))}</textarea></div>`,
    `<button class="btn sec" id="crC">Annuler</button><button class="btn" id="crS">Enregistrer</button>`, () => {
      $("#crC").onclick = closeModal;
      $("#crS").onclick = () => { const l = [...new Set($("#crT").value.split("\n").map(s => s.trim()).filter(Boolean))]; const av = A.creneaux.length; A.creneaux = l; save({ type: ANN_J_A, id: "", action: `Créneaux des ateliers mis à jour (${av} → ${l.length})` }); closeModal(); toast("Créneaux enregistrés"); rerender(); };
    });
}

/* ---------- export */
/* valeur commençant par = + - @ (formule) : préfixée d'une apostrophe pour qu'Excel l'affiche comme du texte */
const annCsvCell = v => { let t = String(v ?? ""); if (/^[=+\-@\t\r]/.test(t)) t = "'" + t; return `"${t.replace(/"/g, '""')}"`; };
function annRowP(p) { const E = (p.entites || []).map(annEnt).filter(Boolean); return [p.id, p.nom, p.email, p.identifiant, E.map(e => e.id).join(" ; "), E.map(annLabel).join(" ; "), p.formation, p.acces, p.atelier || ANN_INSC[0], p.creneau, p.notes]; }
function annRowE(e) { return [e.id, e.type, e.nom, e.abrev, (e.responsables || []).join(" ; "), e.commentaire]; }
function annExportCsv(list) { const lines = [ANN_COL_P.join(";")].concat(list.map(p => annRowP(p).map(annCsvCell).join(";"))); download(`HEPVD_contributeurs_${todayIso()}.csv`, "﻿" + lines.join("\n"), "text/csv;charset=utf-8"); }
async function annExportXlsx() {
  try {
    await chargerTous(VENDOR.xlsx); const A = annuaire(), wb = new ExcelJS.Workbook(); wb.creator = USER || "Plateforme de pilotage";
    const add = (nom, cols, rows, w) => { const ws = wb.addWorksheet(nom); ws.addRow(cols); rows.forEach(r => ws.addRow(r)); ws.getRow(1).font = { bold: true }; ws.views = [{ state: "frozen", ySplit: 1 }]; ws.columns.forEach((c, i) => c.width = w[i] || 16); ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: cols.length } }; };
    add("Contributeurs", ANN_COL_P, A.personnes.slice().sort((a, b) => a.nom.localeCompare(b.nom, "fr")).map(annRowP), [10, 28, 34, 12, 18, 60, 14, 14, 18, 40, 40]);
    add("Entités", ANN_COL_E, A.entites.slice().sort((a, b) => ANN_TYPES.indexOf(a.type) - ANN_TYPES.indexOf(b.type) || a.nom.localeCompare(b.nom, "fr")).map(annRowE), [10, 20, 60, 12, 34, 50]);
    add("Créneaux", ["Créneau"], A.creneaux.map(c => [c]), [50]);
    const buf = await wb.xlsx.writeBuffer(); download(`HEPVD_contributeurs_${todayIso()}.xlsx`, buf, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  } catch (e) { alert("Export impossible : " + e.message); }
}

/* ---------- lecture de fichiers (xlsx ou csv) → { feuilles: { nom: [ {colonne: valeur} ] } } */
function annParseCsv(txt) {
  txt = txt.replace(/^﻿/, ""); const sepc = (txt.split("\n")[0].match(/;/g) || []).length >= (txt.split("\n")[0].match(/,/g) || []).length ? ";" : ",";
  const rows = []; let row = [], cell = "", q = false;
  for (let i = 0; i < txt.length; i++) { const c = txt[i];
    if (q) { if (c === '"') { if (txt[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += c; }
    else if (c === '"') q = true; else if (c === sepc) { row.push(cell); cell = ""; } else if (c === "\n" || c === "\r") { if (c === "\r" && txt[i + 1] === "\n") i++; row.push(cell); rows.push(row); row = []; cell = ""; } else cell += c; }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows.filter(r => r.some(x => String(x).trim()));
}
const annCellTxt = v => { if (v == null) return ""; if (typeof v === "object") { if (v instanceof Date) return v.toISOString().slice(0, 10); if (v.text != null) return typeof v.text === "object" ? annCellTxt(v.text) : String(v.text); if (v.error) return ""; if (v.richText) return v.richText.map(t => t.text).join(""); if (v.result != null) return String(v.result); if (v.hyperlink) return String(v.text || v.hyperlink).replace(/^mailto:/, ""); if (v instanceof Date) return v.toISOString().slice(0, 10); } return String(v); };
async function annLireFichier(f) {
  const out = {};
  const objets = rows => { const h = (rows[0] || []).map(x => String(x).trim()); return rows.slice(1).map(r => Object.fromEntries(h.map((k, i) => [k, String(r[i] ?? "").trim()]))); };
  if (/\.csv$/i.test(f.name)) { out[f.name] = objets(annParseCsv(await f.text())); return out; }
  await chargerTous(VENDOR.xlsx); const wb = new ExcelJS.Workbook(); await wb.xlsx.load(await f.arrayBuffer());
  wb.eachSheet(ws => { const rows = []; ws.eachRow({ includeEmpty: false }, r => { const v = []; for (let i = 1; i <= ws.columnCount; i++) v.push(annCellTxt(r.getCell(i).value).trim()); rows.push(v); }); out[ws.name] = objets(rows); });
  return out;
}
const annColExact = (o, nom) => { const k = Object.keys(o).find(k => norm(k) === norm(nom)); return k ? String(o[k] || "").trim() : ""; };
const annA = (o, ...noms) => Object.keys(o).some(k => noms.some(n => norm(k) === norm(n)));
const annCol = (o, ...noms) => { const k = Object.keys(o).find(k => noms.some(n => norm(k) === norm(n))) || Object.keys(o).find(k => noms.some(n => norm(k).includes(norm(n)))); return k ? String(o[k] || "").trim() : ""; };

/* ---------- import (format de l'export) */
function annImport() {
  openModal("Importer des contributeurs ou des entités", `<div class="full"><p class="small" style="margin-top:0">Fichier Excel exporté depuis cette page (feuilles « Contributeurs » et « Entités ») ou fichier CSV avec les mêmes colonnes. Les personnes sont reconnues par leur adresse e-mail, les entités par leur ID ou leur nom. Un aperçu s'affiche avant toute modification.</p>
    <label for="imF">Fichier (.xlsx ou .csv)</label><input id="imF" type="file" accept=".xlsx,.csv"></div>
    <div class="full"><label class="chk"><input type="checkbox" id="imR"> Remplacer tout l'annuaire par le contenu du fichier (sinon : mise à jour des personnes et entités existantes, et ajout des nouvelles)</label></div>
    <div class="full" id="imP"></div>`,
    `<button class="btn sec" id="imC">Annuler</button><button class="btn" id="imS" disabled>Appliquer l'import</button>`, () => {
      let plan = null; $("#imC").onclick = closeModal;
      const prepare = async () => { const f = $("#imF").files[0]; if (!f) return; $("#imP").innerHTML = '<p class="small muted">Lecture…</p>';
        try { plan = annPlanImport(await annLireFichier(f), $("#imR").checked); plan.fichier = f.name; $("#imP").innerHTML = plan.html; $("#imS").disabled = !plan.ok; } catch (e) { $("#imP").innerHTML = `<p class="err">Fichier illisible : ${esc(e.message)}</p>`; $("#imS").disabled = true; } };
      $("#imF").onchange = prepare; $("#imR").onchange = prepare;
      $("#imS").onclick = () => { if (!plan || !plan.ok) return; if (plan.remplacer && !confirm("Remplacer tout l'annuaire ? Les personnes et entités absentes du fichier seront supprimées (l'opération reste tracée dans l'historique et un instantané horaire de la base existe).")) return;
        const A = annuaire(); A.entites = plan.entites; A.personnes = plan.personnes;
        save({ type: ANN_J_A, id: "", action: `Import de ${plan.fichier}${plan.remplacer ? " (remplacement complet)" : ""} : ${plan.resume}` }); closeModal(); toast("Import appliqué"); rerender(); };
    }, true);
}
function annPlanImport(feuilles, remplacer) {
  const A = annuaire(), noms = Object.keys(feuilles);
  const cles = n => feuilles[n][0] ? Object.keys(feuilles[n][0]) : [];
  const fP = noms.find(n => cles(n).some(k => /mail/i.test(k))), fE = noms.find(n => n !== fP && cles(n).some(k => norm(k) === "entite") && cles(n).some(k => norm(k) === "type"));
  const E = remplacer ? [] : clone(A.entites), P = remplacer ? [] : clone(A.personnes), err = [], st = { eN: 0, eM: 0, pN: 0, pM: 0, pI: 0 };
  const cleE = e => norm(annLabel(e));
  (fE ? feuilles[fE] : []).forEach((r, i) => {
    const o = { id: annColExact(r, "ID"), type: annCol(r, "Type"), nom: annCol(r, "Entité", "Nom").replace(/\s+/g, " "), abrev: annCol(r, "Abréviation"), responsables: annCol(r, "Responsable(s)", "Responsable").split(";").map(s => s.trim()).filter(Boolean), commentaire: annCol(r, "Commentaire") };
    if (!o.nom) return; if (!o.id || !/^ENT-\d+$/.test(o.id)) o.id = ""; if (o.type && !ANN_TYPES.includes(o.type)) err.push(`Entité ligne ${i + 2} : type « ${o.type} » inconnu (types admis : ${ANN_TYPES.join(", ")}).`);
    const ex = E.find(x => o.id && x.id === o.id) || E.find(x => cleE(x) === cleE(o));
    if (ex) { Object.assign(ex, o, { id: ex.id }); st.eM++; } else { if (!o.id || E.some(x => x.id === o.id)) o.id = annNextId(E, "ENT-"); E.push(o); st.eN++; }
  });
  const trouveEnt = s => { s = s.trim(); if (!s) return null; return E.find(x => x.id === s) || E.find(x => norm(annLabel(x)) === norm(s)) || E.find(x => norm(x.nom) === norm(s)) || E.find(x => x.abrev && norm(x.abrev) === norm(s)); };
  (fP ? feuilles[fP] : []).forEach((r, i) => {
    const email = annMail(annCol(r, "E-mail", "Adresse e-mail", "Email")); if (!email) { if (Object.values(r).some(Boolean)) { st.pI++; err.push(`Contributeurs ligne ${i + 2} : adresse e-mail manquante, ligne ignorée.`); } return; }
    if (!annValidMail(email)) { st.pI++; err.push(`Contributeurs ligne ${i + 2} : adresse « ${email} » invalide, ligne ignorée.`); return; }
    const ids = annCol(r, "Entités (ID)"), noms = annCol(r, "Entités", "Entité"), ents = []; (ids ? ids.split(/[;,]/) : noms.split(";")).forEach(s => { if (!s.trim()) return; const e = trouveEnt(s); if (e) ents.push(e.id); else err.push(`Contributeurs ligne ${i + 2} (${email}) : entité « ${s.trim()} » introuvable.`); });
    const on = v => /^(oui|x|yes|1|vrai)$/i.test(String(v).trim()) ? "Oui" : "Non";
    /* seuls les champs dont la colonne existe dans le fichier sont repris : un import partiel n'efface rien */
    const o = {}, has = (...n) => annA(r, ...n);
    if (has("Nom", "Prénom et nom")) o.nom = annCol(r, "Nom", "Prénom et nom").replace(/\s+/g, " ");
    if (has("Identifiant", "Identifiant HEP Vaud")) o.identifiant = annCol(r, "Identifiant", "Identifiant HEP Vaud").toLowerCase();
    if (has("Formé·e à Jahia", "Formation")) o.formation = on(annCol(r, "Formé·e à Jahia", "Formation"));
    if (has("Accès à Jahia", "Accès")) o.acces = on(annCol(r, "Accès à Jahia", "Accès"));
    if (has("Inscription atelier") && ANN_INSC.includes(annCol(r, "Inscription atelier"))) o.atelier = annCol(r, "Inscription atelier");
    if (has("Créneau")) o.creneau = annCol(r, "Créneau");
    if (has("Notes")) o.notes = annCol(r, "Notes");
    if (ents.length) o.entites = [...new Set(ents)];
    if (o.nom === "") delete o.nom;
    const ex = P.find(x => x.email === email);
    if (ex) { Object.assign(ex, o); st.pM++; }
    else { if (!o.nom) { st.pI++; err.push(`Contributeurs ligne ${i + 2} (${email}) : nom manquant pour une nouvelle personne, ligne ignorée.`); return; }
      const idf = annColExact(r, "ID"); P.push(Object.assign({ id: idf && /^PER-\d+$/.test(idf) && !P.some(x => x.id === idf) ? idf : annNextId(P, "PER-"), email, identifiant: "", entites: [], formation: "Non", acces: "Non", atelier: ANN_INSC[0], creneau: "", notes: "" }, o)); st.pN++; }
  });
  const dbl = {}; P.forEach(p => { if (p.identifiant) (dbl[p.identifiant] = dbl[p.identifiant] || []).push(p.email); }); Object.entries(dbl).filter(([, l]) => l.length > 1).forEach(([k, l]) => err.push(`Identifiant ${k} utilisé par ${l.join(" et ")}.`));
  const sansEnt = P.filter(p => !p.entites.length).length;
  const ok = (st.eN + st.eM + st.pN + st.pM) > 0;
  if (remplacer && (!E.length || !P.length)) err.unshift(`Attention : après remplacement, l'annuaire compterait ${E.length} entité(s) et ${P.length} personne(s).`);
  const resume = `${st.eN} entité(s) ajoutée(s), ${st.eM} mise(s) à jour ; ${st.pN} personne(s) ajoutée(s), ${st.pM} mise(s) à jour${st.pI ? `, ${st.pI} ligne(s) ignorée(s)` : ""}`;
  const html = `<div class="card blue"><b>Aperçu</b> — feuilles lues : ${noms.map(esc).join(", ")}<br>${esc(resume)}.<br>Après import : ${E.length} entité(s), ${P.length} personne(s)${sansEnt ? `, dont ${sansEnt} sans entité` : ""}.${remplacer ? "<br><b>Remplacement complet :</b> l'annuaire actuel sera remplacé." : ""}</div>
    ${err.length ? `<p class="small"><b>${err.length} point(s) à vérifier :</b></p><ul class="small">${err.slice(0, 40).map(x => `<li>${esc(x)}</li>`).join("")}${err.length > 40 ? `<li>… et ${err.length - 40} autre(s)</li>` : ""}</ul>` : ""}${ok ? "" : '<p class="err">Aucune donnée reconnue : vérifiez les noms de colonnes (voir l\'export Excel).</p>'}`;
  return { ok, html, resume, remplacer, entites: E, personnes: P };
}

/* ---------- Jotform : listes pour le formulaire, import des inscriptions */
function annJotform() {
  const A = annuaire(), ok = annOK();
  const liste = A.entites.slice().sort((a, b) => ANN_TYPES.indexOf(a.type) - ANN_TYPES.indexOf(b.type) || a.nom.localeCompare(b.nom, "fr")).map(annLabel).join("\n");
  openModal("Jotform — formulaire d'inscription aux ateliers", `<div class="full"><h3>1. Liste fermée des entités</h3><p class="small muted" style="margin-top:0">À coller dans le champ « Entité » du formulaire (une option par ligne). Le type précède chaque nom : la filière et l'UER Pédagogie spécialisée restent ainsi distinctes. Pour les personnes rattachées à plusieurs entités, utilisez un champ à choix multiples.</p>
      <textarea id="jL" rows="8" readonly>${esc(liste)}</textarea><div class="bar" style="margin-top:6px"><button class="btn sec sm" id="jCp">Copier la liste</button><button class="btn sec sm" id="jTx">Télécharger (.txt)</button></div></div>
    <div class="full"><h3>2. Contrôle des personnes inscrites</h3><p class="small muted" style="margin-top:0">Liste de référence des ${A.personnes.length} personnes (e-mail, identifiant, nom, entités). Lors de l'import des inscriptions (étape 3), chaque réponse est comparée à cette liste : une adresse ou un identifiant inconnu, ou qui ne correspondent pas à la même personne, est signalé.</p>
      <button class="btn sec sm" id="jRef">Télécharger la liste de référence (CSV)</button></div>
    ${ok ? `<div class="full"><h3>3. Importer les inscriptions</h3><p class="small muted" style="margin-top:0">Export des réponses Jotform (Excel ou CSV). Colonnes lues : e-mail, identifiant et créneau. Les personnes reconnues passent à « Inscrit·e » avec leur créneau ; un aperçu s'affiche avant toute modification.</p>
      <label for="jF">Fichier des réponses</label><input id="jF" type="file" accept=".xlsx,.csv"><div id="jP"></div></div>` : ""}`,
    `<button class="btn sec" id="jC">Fermer</button>${ok ? `<button class="btn" id="jS" disabled>Appliquer les inscriptions</button>` : ""}`, () => {
      $("#jC").onclick = closeModal;
      $("#jCp").onclick = async () => { try { await navigator.clipboard.writeText(liste); toast("Liste copiée"); } catch (e) { $("#jL").select(); toast("Sélectionnée : copiez avec Ctrl+C / Cmd+C"); } };
      $("#jTx").onclick = () => download(`HEPVD_entites_jotform_${todayIso()}.txt`, liste);
      $("#jRef").onclick = () => download(`HEPVD_liste_reference_jotform_${todayIso()}.csv`, "﻿" + [["E-mail", "Identifiant", "Nom", "Entités"].join(";")].concat(A.personnes.map(p => [p.email, p.identifiant, p.nom, (p.entites || []).map(id => annLabel(annEnt(id))).join(" ; ")].map(annCsvCell).join(";"))).join("\n"), "text/csv;charset=utf-8");
      if (!ok) return; let plan = null;
      $("#jF").onchange = async () => { const f = $("#jF").files[0]; if (!f) return; $("#jP").innerHTML = '<p class="small muted">Lecture…</p>';
        try { const fe = await annLireFichier(f), rows = Object.values(fe)[0] || []; plan = annPlanJotform(rows); plan.fichier = f.name; $("#jP").innerHTML = plan.html; $("#jS").disabled = !plan.maj.length; } catch (e) { $("#jP").innerHTML = `<p class="err">Fichier illisible : ${esc(e.message)}</p>`; } };
      $("#jS").onclick = () => { if (!plan) return; plan.maj.forEach(m => { const p = A.personnes.find(x => x.id === m.id); if (p) { p.atelier = p.atelier === "Formé·e en atelier" ? p.atelier : "Inscrit·e"; if (m.creneau) p.creneau = m.creneau; } });
        save({ type: ANN_J_A, id: "", action: `Import des inscriptions Jotform (${plan.fichier}) : ${plan.maj.length} inscription(s) appliquée(s)${plan.inconnus ? `, ${plan.inconnus} réponse(s) non reconnue(s)` : ""}` }); closeModal(); toast("Inscriptions appliquées"); rerender(); };
    }, true);
}
function annPlanJotform(rows) {
  const A = annuaire(), maj = [], pb = []; let inconnus = 0;
  const jour = c => norm((c.split("·")[1] || "").trim()).replace(/^(lundi|mardi|mercredi|jeudi|vendredi) /, "").replace(/\b1er /, "1 ");
  const memeJour = (n, j) => j && new RegExp("(^|[^0-9])" + j.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).test(n);
  const trouveCr = v => { if (!v) return ""; const n = norm(v).replace(/\b1er /, "1 "); return A.creneaux.find(c => norm(c) === n) || A.creneaux.find(c => memeJour(n, jour(c))) || v; };
  rows.forEach((r, i) => {
    const mail = annMail(annCol(r, "E-mail HEP Vaud", "E-mail", "Adresse e-mail", "Email")), ide = annCol(r, "Identifiant HEP Vaud", "Identifiant").toLowerCase(), cr = trouveCr(annCol(r, "Créneau souhaité", "Créneau"));
    if (!mail && !ide) return;
    const pm = mail && A.personnes.find(p => p.email === mail), pi = ide && A.personnes.find(p => p.identifiant === ide);
    if (!pm && !pi) { inconnus++; pb.push(`Ligne ${i + 2} : ${mail || ide} ne figure pas dans l'annuaire.`); return; }
    if (pm && pi && pm !== pi) { inconnus++; pb.push(`Ligne ${i + 2} : l'e-mail ${mail} et l'identifiant ${ide} correspondent à deux personnes différentes.`); return; }
    if (pm && ide && pm.identifiant && pm.identifiant !== ide) pb.push(`Ligne ${i + 2} : identifiant saisi ${ide}, annuaire ${pm.identifiant} (${pm.nom}).`);
    const p = pm || pi; if (["Absent·e", "Dispensé·e"].includes(p.atelier)) pb.push(`Ligne ${i + 2} : ${p.nom} était « ${p.atelier} » et repasse à « Inscrit·e ».`);
    if (!cr) pb.push(`Ligne ${i + 2} : aucun créneau pour ${p.nom}${p.creneau ? " : le créneau actuel est conservé" : ""}.`);
    if (cr && !A.creneaux.includes(cr)) pb.push(`Ligne ${i + 2} : créneau « ${cr} » absent de la liste des créneaux.`);
    const prev = maj.findIndex(m => m.id === p.id); if (prev >= 0) maj.splice(prev, 1);
    maj.push({ id: p.id, nom: p.nom, creneau: cr, avant: p.creneau });
  });
  const html = `<div class="card blue" style="margin-top:8px"><b>Aperçu</b> — ${maj.length} inscription(s) reconnue(s)${inconnus ? `, ${inconnus} non reconnue(s)` : ""}.${maj.filter(m => m.avant && m.avant !== m.creneau).length ? ` ${maj.filter(m => m.avant && m.avant !== m.creneau).length} changement(s) de créneau.` : ""}</div>
    ${pb.length ? `<p class="small"><b>À vérifier :</b></p><ul class="small">${pb.slice(0, 40).map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
    ${maj.length ? `<div class="tw flat" style="max-height:220px"><table><thead><tr><th>Personne</th><th>Créneau</th></tr></thead><tbody>${maj.map(m => `<tr class="static"><td>${esc(m.nom)}</td><td class="small">${esc(m.creneau || "—")}</td></tr>`).join("")}</tbody></table></div>` : ""}`;
  return { maj, inconnus, html };
}
