/* Plateforme — recherche globale (vue d'ensemble), v0.7
 * Cherche dans toutes les collections de données du projet, avec des filtres facultatifs :
 * type d'élément, phase, statut, responsable, période. Raccourcis : « / » ou Ctrl/Cmd + K. */
"use strict";
const RG_SRC = [
  ["taches", "Tâches", "taches"], ["jalons", "Jalons & gates", "jalons"], ["phases", "Phases", "phases"],
  ["documents", "Documents", "documents"], ["decisions", "Décisions", "decisions"], ["questions", "Questionnements", "questions"],
  ["actions", "Actions", "actions"], ["risques", "Risques", "risques"], ["changements", "Changements", "changements"],
  ["cdc", "Registre CDC", "cdc"], ["cdcThemes", "Thématiques CDC", "cdc"], ["cdcGlossaire", "Glossaire CDC", "cdc"],
  ["budget", "Budget", "budget"], ["parties", "Parties prenantes", "parties"], ["roles", "Équipe & rôles", "roles"],
  ["absences", "Absences", "absences"], ["systemes", "Systèmes & API", "systemes"], ["agents", "Agents IA", "agents"],
  ["dsVersions", "DS · versions", "ds"], ["dsElements", "DS · inventaire", "ds"], ["dsDemandes", "DS · demandes", "ds"],
  ["dsBesoins", "DS · besoins", "ds"], ["contrastes", "DS · contrastes", "ds"], ["rapports", "Rapports", "rapports"],
  ["baselines", "Baselines", "gantt"], ["journal", "Historique", "historique"], ["_meta", "Fiche projet", "donnees"],
];
const RG_F0 = { types: [], phase: "", statut: "", resp: "", du: "", au: "", clos: true };
let rgQ = "", rgF = Object.assign({}, RG_F0, lsGet("hepvd-recherche-filtres") || {}), rgOpen = false, rgMore = {};
const RG_RESP = ["responsable", "proprietaire", "pilote", "porteur", "decideur", "demandeur", "roles"];
const RG_CLOS = /^(termin|valid|clos|close|r[ée]solu|r[ée]pondue|abandonn|archiv|remplac|rejet|annul|retir|[ée]cart|fusionn|publi)/i;

const rgTitre = (col, x) => col === "journal" ? `${x.type || ""} ${x.id || ""} — ${x.action || ""}` : String(x.titre || x.nom || x.question || x.terme || x.intitule || x.personne || x.poste || x.libelle || x.action || x.code || x.id || "");
const rgId = (col, x) => col === "journal" ? fdt(x.ts) : String(x.id || x.code || x.version || "");
const rgDate = x => x.fin || x.echeance || x.date || x.debut || (x.ts ? String(x.ts).slice(0, 10) : "");
const rgPhases = x => String(x.phase || x.phases || "").split(/[,;\s·]+/).filter(p => /^P[\dX]+$/.test(p));
const rgResp = x => RG_RESP.map(k => x[k]).filter(Boolean).join(", ").split(/[,;]\s*/).map(s => s.trim()).filter(Boolean);
function rgFlat(v, d) { /* toutes les valeurs texte d'un élément, y compris imbriquées */
  if (v == null || d > 4) return "";
  if (typeof v === "object") return (Array.isArray(v) ? v : Object.values(v)).map(z => rgFlat(z, d + 1)).join(" ");
  return String(v);
}
function rgIndex() {
  if (rgIndex.rev === S.meta.maj + ":" + S.journal.length && rgIndex.cache) return rgIndex.cache;
  const out = [], roleName = c => { const r = (S.roles || []).find(x => x.code === c); return r ? (r.personne || "") + " " + (r.nom || "") : ""; };
  RG_SRC.forEach(([col, lab, view]) => {
    const arr = col === "_meta" ? [Object.assign({ id: "Projet" }, S.meta)] : (S[col] || []);
    arr.forEach(x => {
      if (!x || typeof x !== "object") return;
      const extra = rgResp(x).map(roleName).join(" ") + " " + rgPhases(x).map(p => (S.phases.find(y => y.id === p) || {}).nom || "").join(" ");
      out.push({ col, lab, view, x, id: rgId(col, x), titre: rgTitre(col, x), statut: String(x.statut || x.statutSuivi || ""), date: rgDate(x), phases: rgPhases(x), resp: rgResp(x), txt: norm(rgFlat(x, 0) + " " + extra) });
    });
  });
  rgIndex.rev = S.meta.maj + ":" + S.journal.length; rgIndex.cache = out; return out;
}
const rgTokens = () => norm(rgQ).split(/\s+/).filter(Boolean);
const rgFActive = () => rgF.types.length || rgF.phase || rgF.statut || rgF.resp || rgF.du || rgF.au || !rgF.clos;
function rgMatchF(e, skipTypes) {
  const f = rgF;
  if (!skipTypes && f.types.length && !f.types.includes(e.col)) return false;
  if (f.phase && !e.phases.includes(f.phase)) return false;
  if (f.statut && e.statut !== f.statut) return false;
  if (f.resp && !e.resp.includes(f.resp)) return false;
  if ((f.du || f.au) && !e.date) return false;
  if (f.du && e.date < f.du) return false;
  if (f.au && e.date > f.au) return false;
  if (!f.clos && RG_CLOS.test(e.statut)) return false;
  return true;
}
function rgSearch() {
  const tk = rgTokens(), idx = rgIndex();
  if (!tk.length && !rgFActive()) return null;
  const base = idx.filter(e => tk.every(w => e.txt.includes(w)));
  const hits = base.filter(e => rgMatchF(e)).map(e => {
    const id = norm(e.id), ti = norm(e.titre);
    let s = 0; if (tk.length === 1 && id === tk[0]) s += 100; if (tk.every(w => ti.includes(w))) s += 20; tk.forEach(w => { if (ti.includes(w)) s += 3; if (id.includes(w)) s += 5; });
    return Object.assign({ s }, e);
  }).sort((a, b) => b.s - a.s);
  const parType = {}; base.filter(e => rgMatchF(e, true)).forEach(e => parType[e.col] = (parType[e.col] || 0) + 1);
  return { hits, parType, base };
}
function rgHl(txt) {
  let h = esc(txt); const q = String(rgQ || "").trim().split(/\s+/).filter(w => w.length > 1); if (!q.length) return h;
  const re = new RegExp("(" + q.map(w => esc(w).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|") + ")", "gi");
  return h.replace(/(<[^>]*>)|([^<]+)/g, (m, tg, tx) => tg || tx.replace(re, "<mark>$1</mark>"));
}
function rgExtrait(e) { /* passage où le premier mot cherché apparaît, hors titre */
  const tk = rgTokens(); if (!tk.length) return "";
  const ti = norm(e.titre); if (tk.every(w => ti.includes(w))) return "";
  for (const [k, v] of Object.entries(e.x)) {
    if (v == null || typeof v === "object" || /^(id|titre|nom)$/.test(k)) continue;
    const s = String(v), n = norm(s), i = n.indexOf(tk.find(w => !ti.includes(w)) || tk[0]);
    if (i < 0) continue;
    const a = Math.max(0, i - 60), b = Math.min(s.length, i + 110);
    return `<span class="rg-k">${esc(k)}</span> ${a ? "…" : ""}${rgHl(s.slice(a, b))}${b < s.length ? "…" : ""}`;
  }
  return "";
}
function rgOpenItem(e) {
  if (e.col === "documents") return openDoc(e.x);
  if (e.col === "risques") return openRisk(e.x);
  if (SCHEMAS[e.col] && (S[e.col] || []).includes(e.x)) return editItem(e.col, e.x);
  location.hash = "#" + e.view;
}
function rgPanel() {
  const sel = (k, label, opts, all) => `<div class="cdc-f"><label for="rg_${k}">${label}</label><select id="rg_${k}" data-rf="${k}"><option value="">${all}</option>${opts.map(o => Array.isArray(o) ? o : [o, o]).map(o => `<option value="${esc(o[0])}" ${rgF[k] === o[0] ? "selected" : ""}>${esc(o[1])}</option>`).join("")}</select></div>`;
  const statuts = [...new Set(rgIndex().map(e => e.statut).filter(Boolean))].sort((a, b) => a.localeCompare(b, "fr"));
  const roles = (S.roles || []).map(r => [r.code, r.code + (r.personne ? " — " + r.personne : " — " + r.nom)]);
  return `<div class="card rg" role="search" aria-label="Rechercher dans toutes les données du projet">
    <div class="rg-row"><label for="rg_q" class="vh">Rechercher dans tout le projet</label>
      <input type="search" id="rg_q" value="${esc(rgQ)}" placeholder="Rechercher dans tout le projet : T086, consultant, Jahia, D-014, Bertrand…" autocomplete="off" aria-describedby="rg_help">
      <button class="btn sec" id="rg_tog" aria-expanded="${rgOpen}" aria-controls="rg_filtres">Filtres${rgFActive() ? ` <span class="n">${[rgF.types.length ? 1 : 0, rgF.phase, rgF.statut, rgF.resp, rgF.du || rgF.au, !rgF.clos].filter(Boolean).length}</span>` : ""}</button></div>
    <p id="rg_help" class="small muted rg-help">Tâches, documents, décisions, questions, actions, risques, jalons, budget, registre CDC, Design System, parties prenantes, historique… Plusieurs mots : tous doivent figurer. Raccourci : <kbd>/</kbd> ou <kbd>Ctrl</kbd>+<kbd>K</kbd>.</p>
    <div id="rg_filtres" class="rg-filtres" ${rgOpen ? "" : "hidden"}>
      <div class="rg-types chips" aria-label="Types d'éléments"></div>
      <div class="cdc-fgrid">
        ${sel("phase", "Phase", S.phases.map(p => [p.id, p.id + " — " + p.nom]), "Toutes")}
        ${sel("statut", "Statut", statuts, "Tous")}
        ${sel("resp", "Responsable", roles, "Tous")}
        <div class="cdc-f"><label for="rg_du">Échéance ou date, du</label><input type="date" id="rg_du" data-rf="du" value="${esc(rgF.du)}"></div>
        <div class="cdc-f"><label for="rg_au">au</label><input type="date" id="rg_au" data-rf="au" value="${esc(rgF.au)}"></div>
        <div class="cdc-f rg-chk"><label><input type="checkbox" id="rg_clos" ${rgF.clos ? "checked" : ""}> Inclure les éléments terminés, validés ou clos</label></div>
      </div>
    </div>
    <div class="cdc-fbar"><span id="rg_count" class="small" role="status" aria-live="polite"></span><span class="grow"></span><button class="btn ghost sm" id="rg_reset" ${rgQ || rgFActive() ? "" : "hidden"}>Effacer la recherche</button></div>
    <div id="rg_res"></div></div>`;
}
function rgDraw(w) {
  const R = rgSearch(), res = $("#rg_res", w), cnt = $("#rg_count", w), types = $(".rg-types", w);
  $("#rg_reset", w).hidden = !(rgQ || rgFActive());
  const pt = R ? R.parType : {};
  types.innerHTML = RG_SRC.filter(([c]) => !R || pt[c] || rgF.types.includes(c)).map(([c, l]) => `<button class="chip ${rgF.types.includes(c) ? "on" : ""}" data-rt="${c}" aria-pressed="${rgF.types.includes(c)}">${esc(l)}${R ? ` · ${pt[c] || 0}` : ""}</button>`).join("");
  $$("[data-rt]", types).forEach(b => b.onclick = () => { const c = b.dataset.rt; rgF.types = rgF.types.includes(c) ? rgF.types.filter(x => x !== c) : rgF.types.concat(c); rgSave(); rgDraw(w); });
  if (!R) { res.innerHTML = ""; cnt.textContent = ""; return; }
  cnt.textContent = R.hits.length ? `${R.hits.length} résultat${R.hits.length > 1 ? "s" : ""}` : "Aucun résultat";
  const grp = RG_SRC.map(([c, l]) => [c, l, R.hits.filter(h => h.col === c)]).filter(g => g[2].length);
  res.innerHTML = grp.map(([c, l, hs]) => {
    const lim = rgMore[c] ? hs.length : 5;
    return `<section class="rg-g"><h3>${esc(l)} <span class="small muted">${hs.length}</span></h3><ul>${hs.slice(0, lim).map((h, i) => `<li><button class="rg-it" data-ri="${c}:${i}">
      <span class="rg-id">${rgHl(h.id)}</span><span class="rg-t">${rgHl(h.titre)}${rgExtrait(h) ? `<br><span class="small muted">${rgExtrait(h)}</span>` : ""}</span>
      <span class="rg-m small">${h.phases.slice(0, 2).join(" ")} ${h.statut ? tag(h.statut) : ""} ${h.date && h.col !== "journal" ? fds(h.date) : ""}</span></button></li>`).join("")}</ul>
      ${hs.length > 5 ? `<button class="btn ghost sm" data-rm="${c}">${rgMore[c] ? "Réduire" : `Voir les ${hs.length} résultats`}</button>` : ""}</section>`;
  }).join("") || `<p class="empty">Aucun élément ne correspond. Essayez moins de mots ou retirez des filtres.</p>`;
  $$("[data-ri]", res).forEach(b => b.onclick = () => { const [c, i] = b.dataset.ri.split(":"); rgOpenItem(R.hits.filter(h => h.col === c)[+i]); });
  $$("[data-rm]", res).forEach(b => b.onclick = () => { rgMore[b.dataset.rm] = !rgMore[b.dataset.rm]; rgDraw(w); });
}
function rgSave() { lsSet("hepvd-recherche-filtres", rgF); }
function vOverviewAvecRecherche() {
  const w = el(rgPanel()), ov = el(vOverview());
  while (ov.firstChild) w.appendChild(ov.firstChild);
  const q = $("#rg_q", w); let t;
  q.oninput = () => { clearTimeout(t); t = setTimeout(() => { rgQ = q.value; rgMore = {}; rgDraw(w); }, 120); };
  q.onkeydown = e => { if (e.key === "Escape") { q.value = rgQ = ""; rgDraw(w); } if (e.key === "Enter") { const b = $(".rg-it", w); if (b) b.click(); } };
  $("#rg_tog", w).onclick = () => { rgOpen = !rgOpen; $("#rg_filtres", w).hidden = !rgOpen; $("#rg_tog", w).setAttribute("aria-expanded", rgOpen); };
  $$("[data-rf]", w).forEach(s => s.onchange = () => { rgF[s.dataset.rf] = s.value; rgSave(); rgDraw(w); });
  $("#rg_clos", w).onchange = e => { rgF.clos = e.target.checked; rgSave(); rgDraw(w); };
  $("#rg_reset", w).onclick = () => { rgQ = ""; rgF = Object.assign({}, RG_F0, { types: [] }); rgMore = {}; rgSave(); render(); };
  rgDraw(w);
  return w;
}
/* la vue d'ensemble affiche la recherche ; raccourcis clavier globaux */
(function () {
  const v = VIEWS.find(x => x.id === "overview"); if (v) v.f = () => vOverviewAvecRecherche();
  document.addEventListener("keydown", e => {
    const inField = /^(INPUT|TEXTAREA|SELECT)$/.test((e.target || {}).tagName) || (e.target || {}).isContentEditable;
    if ((e.key === "/" && !inField) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k")) {
      if (!$("#modalBg").hidden) return;
      e.preventDefault();
      if (route().v !== "overview") { location.hash = "#overview"; setTimeout(() => { const q = $("#rg_q"); if (q) q.focus(); }, 60); }
      else { const q = $("#rg_q"); if (q) { q.focus(); q.select(); } }
    }
  });
})();
