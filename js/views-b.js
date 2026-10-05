/* Plateforme — documents, risques, anticipation, questionnements, décisions, Design System */
"use strict";
/* ---------- Documents : moteur de recherche */
const dst = { q: "", phase: "", type: "", statut: "", livrable: "", task: "" };
function docIndexText(d) { return norm([d.id, d.titre, d.description, d.tags, d.chemin, d.type, d.statut, d.phase, phase(d.phase).nom, d.taches.join(" "), d.taches.map(t => (task(t) || {}).nom).join(" "), (d.versions || []).map(v => v.note).join(" ")].join(" ")); }
function hl(text, terms) { let h = esc(text); terms.forEach(t => { if (t.length < 2) return; const re = new RegExp("(" + t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "gi"); h = h.replace(re, "<mark>$1</mark>"); }); return h; }
function searchDocs() {
  const terms = norm(dst.q).split(/\s+/).filter(Boolean);
  return S.documents.filter(d => (!dst.phase || d.phase === dst.phase) && (!dst.type || d.type === dst.type) && (!dst.statut || d.statut === dst.statut) && (!dst.task || d.taches.includes(dst.task)) && (dst.livrable === "" || (dst.livrable === "1" ? d.livrable : !d.livrable)))
    .map(d => { const txt = docIndexText(d); if (!terms.every(t => txt.includes(t))) return null; let sc = 0; terms.forEach(t => { if (norm(d.titre).includes(t)) sc += 5; if (norm(d.tags).includes(t)) sc += 3; if (norm(d.id).includes(t)) sc += 8; sc += 1; }); return { d, sc }; })
    .filter(Boolean).sort((a, b) => b.sc - a.sc || a.d.id.localeCompare(b.d.id)).map(x => x.d);
}
function vDocuments() {
  const types = [...new Set(S.documents.map(d => d.type))].sort(), stats = ["Prévu", "En cours", "En revue", "Validé", "Référence", "Archivé"];
  const wrap = el(`<div class="card searchcard"><label for="dq" class="sr">Rechercher dans les documents</label>
    <div class="searchbox"><span aria-hidden="true">⌕</span><input id="dq" type="search" placeholder="Rechercher un document : titre, mot-clé, chemin, étape, ID… (ex. « tokens », « P4 », « T042 »)" value="${esc(dst.q)}" autocomplete="off"></div>
    <div class="bar" style="margin:10px 0 0">
      <select id="dph" aria-label="Phase"><option value="">Toutes les phases</option>${S.phases.map(p => `<option value="${p.id}" ${dst.phase === p.id ? "selected" : ""}>${p.id} — ${esc(p.nom)}</option>`).join("")}</select>
      <select id="dty" aria-label="Type"><option value="">Tous les types</option>${types.map(t => `<option ${dst.type === t ? "selected" : ""}>${esc(t)}</option>`).join("")}</select>
      <select id="dst" aria-label="Statut"><option value="">Tous les statuts</option>${stats.map(t => `<option ${dst.statut === t ? "selected" : ""}>${t}</option>`).join("")}</select>
      <select id="dlv" aria-label="Nature"><option value="">Tous</option><option value="1" ${dst.livrable === "1" ? "selected" : ""}>Livrables attendus</option><option value="0" ${dst.livrable === "0" ? "selected" : ""}>Autres documents</option></select>
      ${dst.task ? `<span class="chip">Étape ${esc(dst.task)} <button class="btn ghost sm" id="dtx" aria-label="Retirer le filtre">✕</button></span>` : ""}
      <span class="grow"></span><span id="dcount" class="small muted"></span>${SERVER && CFG.docsBase ? '<button class="btn sec sm" id="dscan">Fichiers non référencés</button>' : ""}<button class="btn sm" id="dadd">+ Document</button></div></div>
    <div id="dres"></div>`);
  const fill = () => {
    const r = searchDocs(), terms = norm(dst.q).split(/\s+/).filter(Boolean);
    $("#dcount", wrap).textContent = `${r.length} document(s) sur ${S.documents.length}`;
    $("#dres", wrap).innerHTML = r.length ? `<div class="tw"><table class="docs"><thead><tr><th>ID</th><th>Document</th><th>Phase</th><th>Étapes</th><th>Type</th><th>Version</th><th>Statut</th><th></th></tr></thead><tbody>${r.slice(0, 300).map(d => { const u = docUrl(d);
      return `<tr data-id="${d.id}" tabindex="0"><td class="nowrap">${d.id}${d.livrable ? ' <span class="tag" title="Livrable attendu">L</span>' : ""}</td><td><b>${hl(d.titre, terms)}</b><div class="small muted path">${hl(d.chemin || "", terms)}</div>${d.description ? `<div class="small">${hl(d.description, terms)}</div>` : ""}</td><td>${phaseChip(d.phase)}</td><td>${d.taches.map(taskChip).join(" ")}</td><td class="small">${esc(d.type)}</td><td class="small">${esc(d.version || "—")}${d.versions.length > 1 ? ` <span class="muted">(${d.versions.length})</span>` : ""}</td><td>${tag(d.statut)}</td><td>${u && d.statut !== "Prévu" ? `<a class="btn sec sm" href="${esc(u)}" target="_blank" rel="noopener">Ouvrir</a>` : ""}</td></tr>`; }).join("")}</tbody></table></div>` : '<p class="empty">Aucun document ne correspond.</p>';
  };
  fill();
  $("#dq", wrap).oninput = e => { dst.q = e.target.value; fill(); };
  [["#dph", "phase"], ["#dty", "type"], ["#dst", "statut"], ["#dlv", "livrable"]].forEach(([s, k]) => $(s, wrap).onchange = e => { dst[k] = e.target.value; fill(); });
  if ($("#dtx", wrap)) $("#dtx", wrap).onclick = () => { dst.task = ""; render(); };
  $("#dres", wrap).addEventListener("click", e => { if (e.target.closest("a,button")) return; const tr = e.target.closest("tr[data-id]"); if (tr) openDoc(S.documents.find(d => d.id === tr.dataset.id)); });
  $("#dres", wrap).addEventListener("keydown", e => { if (e.key === "Enter") { const tr = e.target.closest("tr[data-id]"); if (tr) openDoc(S.documents.find(d => d.id === tr.dataset.id)); } });
  $("#dadd", wrap).onclick = () => openDoc(null);
  if ($("#dscan", wrap)) $("#dscan", wrap).onclick = scanFiles;
  setTimeout(() => { const i = $("#dq"); if (i && !("ontouchstart" in window)) i.focus(); }, 0);
  return wrap;
}
const DOCF = [F("titre", "Titre", "text", { full: true, req: true }), F("chemin", "Chemin dans le dossier projet", "text", { full: true }), F("phase", "Phase", "select", { opts: phaseOpts }),
  F("type", "Type", "select", { opts: () => ["Document", "Tableau", "Présentation", "Maquette", "Code", "Outil", "Guide", "Plan", "Processus", "Gouvernance", "Suivi", "Rapport", "PV", "Modèle", "Référence", "Skill", "Dossier", "Autre"] }),
  F("statut", "Statut", "select", { opts: () => ["Prévu", "En cours", "En revue", "Validé", "Référence", "Archivé"] }), F("responsable", "Responsable", "select", { opts: roleOpts }),
  F("version", "Version actuelle", "text"), F("date", "Date", "date"), F("tags", "Mots-clés (séparés par des virgules)", "text", { full: true }), F("description", "Description", "textarea", { full: true })];
function openDoc(d, preset) {
  const isNew = !d, o = d ? clone(d) : Object.assign({ id: nextId("documents").replace(/^/, "").replace(/^(\d)/, "DOC-$1"), titre: "", chemin: "", phase: "", taches: [], statut: "En cours", version: "0.1", date: todayIso(), tags: "", description: "", livrable: false, versions: [] }, preset || {});
  if (isNew) { let m = 0; S.documents.forEach(x => { const k = +(String(x.id).match(/\d+/) || [0])[0]; m = Math.max(m, k); }); o.id = "DOC-" + String(m + 1).padStart(3, "0"); }
  const tasksOpts = S.phases.map(p => `<optgroup label="${p.id} — ${esc(p.nom)}">${S.taches.filter(t => t.phase === p.id).map(t => `<option value="${t.id}" ${o.taches.includes(t.id) ? "selected" : ""}>${t.id} — ${esc(t.nom)}</option>`).join("")}</optgroup>`).join("");
  const refs = [...S.decisions.filter(x => String(x.documents || "").includes(o.id)).map(x => x.id), ...S.dsVersions.filter(x => String(x.documents || "").includes(o.id)).map(x => x.id)];
  const u = docUrl(o);
  const body = DOCF.map(f => fieldHtml(f, o[f.k])).join("") + `
    <div class="full"><label class="chk"><input type="checkbox" id="f_livrable" ${o.livrable ? "checked" : ""}> Livrable attendu d'une phase</label></div>
    <div class="full"><label for="f_taches">Étapes liées (Ctrl/Cmd + clic pour plusieurs)</label><select id="f_taches" multiple size="6">${tasksOpts}</select></div>
    ${isNew ? "" : `<div class="full"><h3>Historique des versions</h3><div class="tw flat"><table><thead><tr><th>Version</th><th>Date</th><th>Auteur</th><th>Note</th><th>Fichier</th></tr></thead><tbody>${o.versions.slice().reverse().map(v => `<tr class="static"><td>${esc(v.v)}</td><td>${fds(v.date)}</td><td class="small">${esc(v.auteur)}</td><td class="small">${esc(v.note)}</td><td class="small">${v.fichierId && SERVER ? `<a href="${api("files/" + v.fichierId)}" target="_blank">téléversé</a>` : esc(v.chemin || "")}</td></tr>`).join("") || '<tr><td colspan="5" class="empty">Aucune version enregistrée</td></tr>'}</tbody></table></div>
      <div class="newv"><b>Nouvelle version</b><div class="row"><input id="nvV" placeholder="Version (ex. 1.0)" style="width:120px"><input id="nvN" placeholder="Note (ce qui a changé)" style="flex:1">${SERVER ? '<input type="file" id="nvF">' : ""}<button type="button" class="btn sm" id="nvAdd">Ajouter</button></div><p class="small muted">${SERVER ? "Le fichier téléversé est conservé dans la base (versionnage)." : "Mode local : enregistrez le fichier dans le dossier projet et indiquez son chemin ci-dessus."}</p></div>
      ${refs.length ? `<p class="small">Référencé par : ${refChips(refs.join(","))}</p>` : ""}</div>`}`;
  openModal((isNew ? "Nouveau document" : o.id + " · " + o.titre), body, `${isNew ? "" : '<button class="btn danger l" id="mDel">Supprimer</button>'}${u && !isNew ? `<a class="btn sec" href="${esc(u)}" target="_blank" rel="noopener">Ouvrir le fichier</a>` : ""}<button class="btn sec" id="mC">Annuler</button><button class="btn" id="mS">Enregistrer</button>`, () => {
    $("#mC").onclick = closeModal;
    const collect = () => { const out = clone(o); DOCF.forEach(f => out[f.k] = $("#f_" + f.k).value); out.livrable = $("#f_livrable").checked; out.taches = $$("#f_taches option").filter(x => x.selected).map(x => x.value); return out; };
    if ($("#mDel")) $("#mDel").onclick = () => { if (confirm("Supprimer la fiche de ce document ? (le fichier lui-même n'est pas supprimé)")) { S.documents = S.documents.filter(x => x.id !== o.id); save({ type: "Document", id: o.id, action: "Suppression de la fiche", resume: o.titre }); closeModal(); rerender(); } };
    if ($("#nvAdd")) $("#nvAdd").onclick = async () => {
      const v = $("#nvV").value.trim(), n = $("#nvN").value.trim(); if (!v) { toast("Indiquez le numéro de version"); return; }
      const out = collect(); const ver = { v, date: todayIso(), auteur: USER, note: n || "Nouvelle version", chemin: out.chemin };
      const f = $("#nvF") && $("#nvF").files[0];
      if (f) { try { const r = await apiFetch(`files?doc=${encodeURIComponent(o.id)}&v=${encodeURIComponent(v)}&name=${encodeURIComponent(f.name)}`, { method: "POST", body: f }); if (!r.ok) throw 0; const j = await r.json(); ver.fichierId = j.id; ver.fichier = f.name; ver.taille = f.size; } catch (e) { toast("Échec du téléversement"); return; } }
      out.versions.push(ver); out.version = v; if (out.statut === "Prévu") out.statut = "En cours";
      const i = S.documents.findIndex(x => x.id === o.id); S.documents[i] = out; save({ type: "Document", id: o.id, action: `Nouvelle version ${v} : ${ver.note}${f ? " (fichier " + f.name + ")" : ""}`, resume: out.titre });
      closeModal(); toast("Version " + v + " enregistrée"); openDoc(out);
    };
    $("#mS").onclick = () => {
      const out = collect(); if (!out.titre) { toast("Titre obligatoire"); return; }
      if (isNew) { if (out.statut !== "Prévu") out.versions = [{ v: out.version || "0.1", date: todayIso(), auteur: USER, note: "Création", chemin: out.chemin }]; S.documents.push(out); save({ type: "Document", id: out.id, action: "Création", resume: out.titre }); }
      else { const i = S.documents.findIndex(x => x.id === o.id), before = S.documents[i]; S.documents[i] = out; const ch = diffSummary(before, out, DOCF); const tl = before.taches.join(",") !== out.taches.join(",") ? `Étapes : ${before.taches.join(", ") || "—"} → ${out.taches.join(", ") || "—"}` : ""; if (ch || tl || before.livrable !== out.livrable) save({ type: "Document", id: out.id, action: [ch, tl].filter(Boolean).join(" ; ") || "Nature livrable modifiée", resume: out.titre }); }
      closeModal(); toast("Enregistré"); rerender();
    };
  }, true);
}
async function scanFiles() {
  try {
    const r = await apiFetch("scan"); const j = await r.json(); const known = new Set(S.documents.map(d => d.chemin));
    const un = j.files.filter(f => !known.has(f.path) && !/\/\.|^\.|Tableau-de-bord\/(js|data|assets)|\.gitkeep$|\.zip$/.test(f.path));
    openModal(`Fichiers non référencés (${un.length})`, `<div class="full"><p class="small muted">Fichiers présents dans le dossier projet mais sans fiche dans la plateforme.</p><div class="tw flat" style="max-height:50vh"><table><tbody>${un.map((f, i) => `<tr class="static"><td><label class="chk"><input type="checkbox" data-i="${i}"> ${esc(f.path)}</label></td><td class="small nowrap">${fdt(f.mtime)}</td></tr>`).join("") || '<tr><td class="empty">Tout est référencé.</td></tr>'}</tbody></table></div></div>`,
      `<button class="btn sec" id="mC">Fermer</button><button class="btn" id="mR">Référencer la sélection</button>`, () => {
        $("#mC").onclick = closeModal;
        $("#mR").onclick = () => { const sel = $$("input[data-i]:checked").map(c => un[+c.dataset.i]); let m = 0; S.documents.forEach(x => m = Math.max(m, +(String(x.id).match(/\d+/) || [0])[0]));
          sel.forEach(f => { const ph = (S.phases.find(p => f.path.startsWith(p.dossier)) || {}).id || ""; const id = "DOC-" + String(++m).padStart(3, "0"); const name = f.path.split("/").pop();
            S.documents.push({ id, titre: name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " "), chemin: f.path, phase: ph, taches: [], statut: "En cours", version: (name.match(/_v(\d+\.\d+)/) || [])[1] || "", date: iso(f.mtime), tags: "", description: "", livrable: false, versions: [{ v: (name.match(/_v(\d+\.\d+)/) || [])[1] || "—", date: iso(f.mtime), auteur: USER, note: "Référencé depuis le dossier", chemin: f.path }] }); });
          save({ type: "Document", id: "", action: `${sel.length} fichier(s) référencé(s) depuis le dossier projet` }); closeModal(); rerender(); };
      }, true);
  } catch (e) { toast("Analyse du dossier indisponible"); }
}

/* ---------- Risques */
const RISKF = [F("titre", "Risque", "text", { full: true, req: true }), F("categorie", "Catégorie", "select", { opts: () => ["Ressources", "Planning", "Budget", "Périmètre", "Gouvernance", "Technique", "Design", "Accessibilité", "Conformité", "SEO", "Organisation"] }),
  F("phase", "Phase la plus exposée", "select", { opts: phaseOpts }), F("cause", "Cause", "textarea", { full: true }), F("consequence", "Conséquence", "textarea", { full: true }),
  F("declencheur", "Signal d'alerte (indicateur observable)", "textarea", { full: true }), F("proba", "Probabilité (1–5)", "number", { min: 1, max: 5 }), F("impact", "Impact (1–5)", "number", { min: 1, max: 5 }),
  F("probaRes", "Probabilité résiduelle", "number", { min: 1, max: 5 }), F("impactRes", "Impact résiduel", "number", { min: 1, max: 5 }), F("impactJours", "Impact délai estimé (jours)", "number", { min: 0 }),
  F("proximite", "Proximité (peut survenir à partir du)", "date"), F("strategie", "Stratégie", "select", { opts: () => ["Éviter", "Réduire", "Transférer", "Accepter"] }),
  F("proprietaire", "Propriétaire", "select", { opts: roleOpts }), F("statut", "Statut", "select", { opts: () => ["Ouvert", "En traitement", "Survenu", "Clos"] }), F("prochaineRevue", "Prochaine revue", "date"),
  F("mitigation", "Actions de mitigation", "textarea", { full: true }), F("contingence", "Plan de contingence (si le risque survient)", "textarea", { full: true })];
function spark(rv) { if (!rv || rv.length < 2) return ""; const pts = rv.map((r, i) => `${i * (100 / (rv.length - 1))},${30 - (r.proba * r.impact) / 25 * 28}`).join(" "); return `<svg width="100" height="32" aria-label="Évolution du score"><polyline points="${pts}" fill="none" stroke="#00354c" stroke-width="2"/></svg>`; }
function openRisk(r) {
  const isNew = !r; const o = r ? clone(r) : { id: nextId("risques").replace(/^(\d)/, "R-$1"), titre: "", proba: 3, impact: 3, probaRes: 2, impactRes: 3, statut: "Ouvert", date: todayIso(), revues: [], prochaineRevue: addDays(todayIso(), 30) };
  if (isNew) { let m = 0; S.risques.forEach(x => m = Math.max(m, +(String(x.id).match(/\d+/) || [0])[0])); o.id = "R-" + String(m + 1).padStart(3, "0"); }
  const body = RISKF.map(f => fieldHtml(f, o[f.k])).join("") + (isNew ? "" : `<div class="full"><h3>Revues (${o.revues.length}) ${spark(o.revues)}</h3><div class="tw flat"><table><thead><tr><th>Date</th><th>P×I</th><th>Score</th><th>Commentaire</th><th>Par</th></tr></thead><tbody>${o.revues.slice().reverse().map(v => `<tr class="static"><td>${fds(v.date)}</td><td>${v.proba}×${v.impact}</td><td>${sevTag(v.proba * v.impact)}</td><td class="small">${esc(v.note)}</td><td class="small">${esc(v.auteur)}</td></tr>`).join("")}</tbody></table></div>
    <div class="newv"><b>Enregistrer une revue</b><div class="row"><input id="rvP" type="number" min="1" max="5" value="${o.proba}" aria-label="Probabilité" style="width:70px"><input id="rvI" type="number" min="1" max="5" value="${o.impact}" aria-label="Impact" style="width:70px"><input id="rvN" placeholder="Constat, évolution, actions" style="flex:1"><button type="button" class="btn sm" id="rvAdd">Enregistrer la revue</button></div></div></div>`);
  openModal((isNew ? "Nouveau risque " : "Risque ") + o.id, body, `${isNew ? "" : '<button class="btn danger l" id="mDel">Supprimer</button><button class="btn sec" id="mAct">+ Action de mitigation</button>'}<button class="btn sec" id="mC">Annuler</button><button class="btn" id="mS">Enregistrer</button>`, () => {
    $("#mC").onclick = closeModal;
    const collect = () => { const out = clone(o); RISKF.forEach(f => { let v = $("#f_" + f.k).value; if (f.type === "number") v = v === "" ? "" : Number(v); out[f.k] = v; }); return out; };
    if ($("#mDel")) $("#mDel").onclick = () => { if (confirm("Supprimer ce risque ? Préférez le statut « Clos » pour garder l'historique.")) { S.risques = S.risques.filter(x => x.id !== o.id); save({ type: "Risque", id: o.id, action: "Suppression", resume: o.titre }); closeModal(); rerender(); } };
    if ($("#mAct")) $("#mAct").onclick = () => { closeModal(); editItem("actions", null, null, { origine: o.id, responsable: o.proprietaire, statut: "Ouvert", priorite: score(o) >= 15 ? "Haute" : "Normale" }); };
    if ($("#rvAdd")) $("#rvAdd").onclick = () => { const out = collect(); const p = +$("#rvP").value, i = +$("#rvI").value; out.revues.push({ date: todayIso(), proba: p, impact: i, note: $("#rvN").value || "Revue", auteur: USER }); const old = score(out); out.proba = p; out.impact = i; out.prochaineRevue = addDays(todayIso(), 30);
      const k = S.risques.findIndex(x => x.id === o.id); S.risques[k] = out; save({ type: "Risque", id: o.id, action: `Revue : score ${old} → ${p * i}. ${$("#rvN").value}`, resume: out.titre }); closeModal(); toast("Revue enregistrée"); openRisk(out); };
    $("#mS").onclick = () => { const out = collect(); if (!out.titre) { toast("Intitulé obligatoire"); return; }
      if (isNew) { out.revues = [{ date: todayIso(), proba: out.proba, impact: out.impact, note: "Identification", auteur: USER }]; S.risques.push(out); save({ type: "Risque", id: out.id, action: "Création (score " + score(out) + ")", resume: out.titre }); }
      else { const k = S.risques.findIndex(x => x.id === o.id), before = S.risques[k]; S.risques[k] = out; const ch = diffSummary(before, out, RISKF); if (ch) save({ type: "Risque", id: out.id, action: ch, resume: out.titre }); }
      closeModal(); toast("Enregistré"); rerender(); };
  }, true);
}
const rst = { mode: "inh", cat: "", q: "" };
function vRisques() {
  const open = S.risques.filter(r => r.statut !== "Clos" && (!rst.cat || r.categorie === rst.cat));
  const sc = r => rst.mode === "inh" ? [+r.proba, +r.impact] : [+(r.probaRes || r.proba), +(r.impactRes || r.impact)];
  const bg = (p, i) => ["", "#e7f5ee", "#f5f0a4", "#ef9286", "#b3261e"][sev(p * i)];
  let m = `<div class="matrix">`; for (let p = 5; p >= 1; p--) { m += `<div class="ax">${p}</div>`; for (let i = 1; i <= 5; i++) { const rs = open.filter(r => sc(r)[0] === p && sc(r)[1] === i); m += `<div class="cell" style="background:${bg(p, i)}" title="Probabilité ${p} × impact ${i} = ${p * i}">${rs.map(r => `<a href="#" data-risk="${r.id}" title="${esc(r.titre)}">${esc(r.id)}</a>`).join("")}</div>`; } }
  m += `<div></div>${[1, 2, 3, 4, 5].map(i => `<div class="ax">${i}</div>`).join("")}</div><div class="small muted axes"><span>↑ Probabilité</span><span>Impact →</span></div>`;
  const cats = {}; open.forEach(r => cats[r.categorie] = (cats[r.categorie] || 0) + 1);
  const exp = open.reduce((s, r) => s + (+r.impactJours || 0) * (+r.proba || 0) / 5, 0);
  const wrap = el(`<p class="muted intro">Registre complet. Chaque risque a un signal d'alerte, une stratégie, un plan de contingence et un historique de revues. Processus : <code>00_PILOTAGE/07_Plan-management-risques.md</code>.</p>
  <div class="bento" style="margin-bottom:var(--gap)"><div class="card c7"><div class="hrow"><h2>Matrice</h2><div class="seg"><button data-m="inh" aria-pressed="${rst.mode === "inh"}">Inhérent</button><button data-m="res" aria-pressed="${rst.mode === "res"}">Résiduel</button></div></div>${m}</div>
  <div class="card c5"><h2>Synthèse</h2>${[4, 3, 2, 1].map(s => `<div class="li"><span class="tag sev-${s}">${SEVL[s]}</span><span>${open.filter(r => sev(sc(r)[0] * sc(r)[1]) === s).length} risque(s)</span></div>`).join("")}
    <div class="li"><b>${Math.round(exp)} j</b><span class="small">exposition calendaire pondérée (Σ impact délai × probabilité)</span></div>
    <h3 style="margin-top:12px">Par catégorie</h3><div class="chips">${Object.entries(cats).sort((a, b) => b[1] - a[1]).map(([c, n]) => `<button class="chip ${rst.cat === c ? "on" : ""}" data-c="${esc(c)}">${esc(c)} · ${n}</button>`).join("")}${rst.cat ? '<button class="chip" data-c="">✕ tout</button>' : ""}</div>
    <p style="margin-top:12px"><button class="btn sm" id="radd">+ Risque</button> <a class="btn sec sm" href="#anticipation">Anticipation des délais</a></p></div></div>
  <div class="tw"><table><thead><tr><th>ID</th><th>Risque</th><th>Catégorie</th><th>Signal d'alerte</th><th>Inhérent</th><th>Résiduel</th><th>Tendance</th><th>Propriétaire</th><th>Prochaine revue</th><th>Statut</th></tr></thead><tbody>
  ${S.risques.filter(r => !rst.cat || r.categorie === rst.cat).sort((a, b) => (a.statut === "Clos") - (b.statut === "Clos") || score(b) - score(a)).map(r => { const rv = r.revues || [], tr = rv.length > 1 ? Math.sign(rv[rv.length - 1].proba * rv[rv.length - 1].impact - rv[rv.length - 2].proba * rv[rv.length - 2].impact) : 0;
    return `<tr data-id="${r.id}" tabindex="0" class="${r.statut === "Clos" ? "closed" : ""}"><td>${r.id}</td><td><b>${esc(r.titre)}</b></td><td class="small">${esc(r.categorie)}</td><td class="small">${esc(r.declencheur || "")}</td><td>${sevTag(score(r))}</td><td>${sevTag(scoreRes(r))}</td><td>${["↘", "→", "↗"][tr + 1]}</td><td>${esc(roleShort(r.proprietaire))}</td><td class="small nowrap ${r.prochaineRevue && pd(r.prochaineRevue) < TODAY() ? "red" : ""}">${fds(r.prochaineRevue)}</td><td>${tag(r.statut)}</td></tr>`; }).join("")}</tbody></table></div>`);
  $$("[data-m]", wrap).forEach(b => b.onclick = () => { rst.mode = b.dataset.m; rerender(); });
  $$("[data-c]", wrap).forEach(b => b.onclick = () => { rst.cat = b.dataset.c; rerender(); });
  $("#radd", wrap).onclick = () => openRisk(null);
  $$("tr[data-id]", wrap).forEach(tr => { tr.onclick = () => openRisk(S.risques.find(r => r.id === tr.dataset.id)); tr.onkeydown = e => { if (e.key === "Enter") tr.onclick(); }; });
  return wrap;
}

/* ---------- Anticipation */
function vAnticipation() {
  const F = forecast(), G = gateForecasts(F), A = alerts(), FL = floats(), L = loadMatrix(6), bl = currentBaseline();
  const crit = S.taches.filter(t => !isDone(t) && FL[t.id] <= 5).sort((a, b) => pd(a.debut) - pd(b.debut));
  const slip = S.taches.filter(t => F[t.id] && F[t.id].slip > 0).sort((a, b) => F[b.id].slip - F[a.id].slip);
  const drift = bl ? S.taches.filter(t => bl.taches[t.id] && bl.taches[t.id][1] !== t.fin).map(t => ({ t, d: days(bl.taches[t.id][1], t.fin) })).sort((a, b) => b.d - a.d) : [];
  const wrap = el(`<p class="muted intro">Anticipation automatique des retards : prévision par dépendances, consommation des marges avant chaque gate, écarts à la baseline, charge par rôle et alertes. Les règles sont décrites dans le plan de management des risques.</p>
  <div class="bento">
   <div class="card c12"><div class="hrow"><h2>Alertes (${A.length})</h2><div class="small muted">${A.filter(a => a.niv === 3).length} alerte(s) · ${A.filter(a => a.niv === 2).length} vigilance(s) · ${A.filter(a => a.niv === 1).length} info(s)</div></div>
     ${A.map(a => `<div class="li">${nivTag(a.niv)}<span class="small cat">${esc(a.cat)}</span><span class="small">${esc(a.txt)}</span><span class="ml">${refLink(a.ref)}</span></div>`).join("") || '<p class="empty">Aucune alerte : le planning est conforme.</p>'}</div>
   <div class="card c12"><div class="hrow"><h2>Jalons : marges et prévisions</h2>
     <div class="row"><label for="blSel" class="small" style="margin:0">Baseline de référence</label><select id="blSel">${S.baselines.map(b => `<option value="${b.id}" ${bl && bl.id === b.id ? "selected" : ""}>${b.id} — ${esc(b.nom)} (${fds(b.date)})</option>`).join("")}</select><button class="btn sm" id="blNew">Figer une nouvelle baseline</button></div></div>
     <div class="tw flat"><table><thead><tr><th>Jalon</th><th>Baseline</th><th>Planifié</th><th>Prévision</th><th>Dérive vs baseline</th><th>Marge de phase</th><th>Consommation</th></tr></thead><tbody>${G.map(x => `<tr class="static"><td><b>${esc(x.j.id)}</b> ${esc(x.j.nom)}</td><td>${fds(x.bl || "")}</td><td>${fds(x.j.date)}</td><td><b>${fds(x.fc)}</b></td><td class="${x.derive > 0 ? "red" : ""}">${x.derive > 0 ? "+" + x.derive + " j" : x.derive < 0 ? x.derive + " j" : "—"}</td><td>${x.j.type === "Gate" ? x.marge + " j" : "—"}</td><td>${x.j.type === "Gate" ? `<div class="row"><div class="prog" style="width:90px"><i style="width:${Math.min(100, x.pct)}%;background:${x.pct >= 100 ? "var(--alerte)" : x.pct >= 50 ? "#c77700" : "var(--ok)"}"></i></div><span class="small">${x.pct} %</span></div>` : ""}</td></tr>`).join("")}</tbody></table></div>
     <p class="small muted">Marge de phase = écart entre la fin de la dernière étape et le gate. Une étape en retard décale ses successeurs ; quand la marge est consommée, le gate glisse.</p></div>
   <div class="card c6"><h2>Étapes dont la prévision glisse (${slip.length})</h2>${slip.slice(0, 15).map(t => `<div class="li">${taskChip(t.id)}<span class="small">${esc(t.nom)}</span><span class="ml red small">+${F[t.id].slip} j → ${fds(iso(F[t.id].ff))}</span></div>`).join("") || '<p class="empty">Aucune</p>'}</div>
   <div class="card c6"><h2>Écarts à la baseline ${bl ? esc(bl.id) : ""} (${drift.length})</h2>${drift.slice(0, 15).map(x => `<div class="li">${taskChip(x.t.id)}<span class="small">${esc(x.t.nom)}</span><span class="ml small ${x.d > 0 ? "red" : ""}">${x.d > 0 ? "+" : ""}${x.d} j</span></div>`).join("") || '<p class="empty">Aucun écart : le planning correspond à la baseline.</p>'}</div>
   <div class="card c6"><h2>Chemin critique (marge ≤ 5 j)</h2>${crit.slice(0, 15).map(t => `<div class="li">${taskChip(t.id)}<span class="small">${esc(t.nom)}</span><span class="ml small">${FL[t.id]} j · ${fds(t.fin)}</span></div>`).join("") || '<p class="empty">—</p>'}</div>
   <div class="card c6"><h2>Charge par rôle (tâches simultanées)</h2><div class="tw flat"><table class="heat"><thead><tr><th>Rôle</th>${L.months.map(([a]) => `<th>${MOIS[new Date(a).getUTCMonth()]} ${String(new Date(a).getUTCFullYear()).slice(2)}</th>`).join("")}</tr></thead><tbody>${Object.entries(L.M).filter(([, a]) => a.some(Boolean)).map(([r, a]) => `<tr class="static"><td>${esc(roleShort(r))}</td>${a.map(n => `<td class="h${Math.min(4, n)}">${n || ""}</td>`).join("")}</tr>`).join("")}</tbody></table></div><p class="small muted">Au-delà de 3 tâches simultanées : risque de retard (alerte).</p></div>
   <div class="card c12"><h2>Baselines enregistrées</h2>${S.baselines.map(b => `<div class="li"><b>${esc(b.id)}</b><span>${esc(b.nom)}<br><span class="small muted">${fd(b.date)} · ${esc(b.auteur)} · ${Object.keys(b.taches).length} étapes, ${Object.keys(b.jalons).length} jalons</span></span></div>`).join("")}</div>
  </div>`);
  $("#blSel", wrap).onchange = e => { S.ui.baseline = e.target.value; save(); rerender(); };
  $("#blNew", wrap).onclick = () => { const n = prompt("Nom de la baseline (ex. « Baseline 1 — validée au Copil du 11.12.2026 ») :"); if (n) { createBaseline(n); toast("Baseline figée"); rerender(); } };
  return wrap;
}

/* ---------- Questionnements */
function vQuestions() {
  const c = s => S.questions.filter(q => q.statut === s).length;
  const d = el(`<p class="muted intro">Historique de toutes les questions et remises en question du projet : qui l'a posée, quand, pourquoi, la réponse et la décision qui en découle.</p>
    <div class="bento" style="margin-bottom:var(--gap)">${["Ouverte", "En analyse", "Répondue", "Transformée en décision", "Abandonnée"].map(s => `<div class="card c3 kpi mini"><div class="v">${c(s)}</div><div class="l">${s}</div></div>`).join("")}</div>`);
  d.appendChild(genericTable("questions", { extraCol: { l: "Décision", f: q => refChips(q.decision) } }));
  return d;
}
HOOKS.questions = {
  buttons: o => ["Ouverte", "En analyse"].includes(o.statut) ? `<button class="btn sec" id="qToD">Transformer en décision</button>` : "",
  mount: o => { if ($("#qToD")) $("#qToD").onclick = () => { const id = nextId("decisions"); const dd = { id, date: todayIso(), titre: o.question.slice(0, 120), contexte: (o.contexte ? o.contexte + "\n" : "") + `(Issue du questionnement ${o.id})`, decision: "", statut: "À instruire", decideur: o.responsable, phase: o.phase, options: "", reexamen: "", dateReexamen: "", questions: o.id, documents: "", remplace: "" };
    S.decisions.push(dd); const q = S.questions.find(x => x.id === o.id); q.statut = "Transformée en décision"; q.decision = id; q.dateReponse = todayIso(); save({ type: "Questionnement", id: o.id, action: "Transformé en décision " + id, resume: o.question }); closeModal(); editItem("decisions", dd); }; },
};
/* ---------- Décisions */
function vDecisions() {
  const d = el(`<p class="muted intro">Registre des décisions (ADR). Chaque décision indique ses options, ses critères et sa date de réexamen ; les décisions remplacées restent visibles. Fiches détaillées dans <code>91_DECISIONS/</code>.</p>`);
  d.appendChild(genericTable("decisions", { extraCol: { l: "Liens", f: x => refChips([x.questions, x.documents, x.remplace].filter(Boolean).join(",")) } }));
  return d;
}

/* ---------- Design System */
let dsTab = "synthese";
function vDS() {
  const pub = S.dsVersions.filter(v => v.statut === "Publiée").sort((a, b) => pd(b.date) - pd(a.date))[0];
  const E = S.dsElements, byS = {}; E.forEach(e => byS[e.statut] = (byS[e.statut] || 0) + 1);
  const B = S.dsBesoins, bRec = B.filter(b => ["Reçu", "Décidé", "Sans objet"].includes(b.statutSuivi)).length;
  const gdoc = S.documents.find(x => x.chemin === "05_DESIGN-SYSTEM/00_Guide-Design-System.md");
  const wrap = el(`${tabs("ds", [["synthese", "Synthèse"], ["versions", "Versions & release notes"], ["inventaire", "Inventaire"], ["demandes", "Demandes d'évolution"], ["besoins", "Besoins"], ["historique", "Historique DS"]], dsTab)}<div id="dsb"></div>`);
  bindTabs(wrap, "ds", k => { dsTab = k; rerender(); });
  const b = $("#dsb", wrap);
  if (dsTab === "synthese") b.innerHTML = `<div class="bento">
    <div class="card dark c4 kpi"><div class="v">v${esc(pub ? pub.version : "—")}</div><div class="l">version publiée ${pub ? "le " + fd(pub.date) : ""}<br>${esc(pub ? pub.resume : "")}</div></div>
    <div class="card c4 kpi"><div class="v">${(byS["Validé"] || 0)}<small> / ${E.length}</small></div><div class="l">éléments validés · ${(byS["En conception"] || 0) + (byS["En revue"] || 0)} en cours</div></div>
    <div class="card c4 kpi"><div class="v">${bRec}<small> / ${B.length}</small></div><div class="l">besoins satisfaits · <a href="#" id="goB">voir les besoins</a></div></div>
    <div class="card c7"><h2>Feuille de route des versions</h2>${S.dsVersions.slice().sort((a, b) => pd(a.date) - pd(b.date)).map(v => `<div class="li"><b class="nowrap">v${esc(v.version)}</b><span>${esc(v.resume)}<br><span class="small muted">${fd(v.date)} · ${esc(v.type)}</span></span><span class="ml">${tag(v.statut)}</span></div>`).join("")}</div>
    <div class="card c5"><h2>Inventaire par statut</h2>${Object.entries(byS).map(([k, n]) => `<div class="li small"><span>${tag(k)}</span><b class="ml">${n}</b></div>`).join("")}
      <h3 style="margin-top:14px">Méthode</h3><p class="small">Le guide décrit comment construire, remettre en question et faire évoluer le DS.</p>${gdoc ? `<p>${docChip(gdoc)} <a href="${esc(docUrl(gdoc))}" target="_blank" rel="noopener">Ouvrir le guide</a></p>` : ""}</div></div>`;
  if (dsTab === "versions") { b.appendChild(el(`<p class="muted intro">Versionnage sémantique. Une version publiée est figée : toute évolution passe par une nouvelle version avec release notes.</p>`)); b.appendChild(genericTable("dsVersions")); }
  if (dsTab === "inventaire") { b.appendChild(el(`<p class="muted intro">État de chaque fondation, token, composant et pattern. Un élément « Validé » a passé la définition de terminé (voir le guide, section 3).</p>`)); b.appendChild(genericTable("dsElements")); }
  if (dsTab === "demandes") { b.appendChild(el(`<p class="muted intro">Toute évolution du DS (nouveau composant, modification, correction, dette, dépréciation) commence par une demande. Modèle : <code>_MODELES/Demande-evolution-DS.md</code>.</p>`)); b.appendChild(genericTable("dsDemandes")); }
  if (dsTab === "besoins") { b.appendChild(el(`<p class="muted intro">Ce dont nous avons besoin pour construire le Design System (guide, section 2). Mettez à jour le statut à chaque réception.</p>`)); b.appendChild(genericTable("dsBesoins")); }
  if (dsTab === "historique") { const j = S.journal.filter(x => /Design System|Élément du Design|Demande d'évolution|Besoin pour le Design/.test(x.type)); b.innerHTML = `<div class="tw"><table><thead><tr><th>Date</th><th>Par</th><th>Objet</th><th>Modification</th></tr></thead><tbody>${j.map(x => `<tr class="static"><td class="nowrap small">${fdt(x.ts)}</td><td class="small">${esc(x.user)}</td><td>${esc(x.type)} ${esc(x.id)}<br><span class="small muted">${esc(x.resume || "")}</span></td><td class="small">${esc(x.action)}</td></tr>`).join("") || '<tr><td colspan="4" class="empty">Aucune modification du Design System enregistrée pour le moment.</td></tr>'}</tbody></table></div>`; }
  if ($("#goB", wrap)) $("#goB", wrap).onclick = e => { e.preventDefault(); dsTab = "besoins"; rerender(); };
  return wrap;
}
HOOKS.dsVersions = { buttons: o => o.statut !== "Publiée" ? `<button class="btn sec" id="dvPub">Publier cette version</button>` : "", mount: o => { if ($("#dvPub")) $("#dvPub").onclick = () => { if (!confirm(`Publier la version ${o.version} ? Elle sera figée.`)) return; const v = S.dsVersions.find(x => x.id === o.id); v.statut = "Publiée"; v.date = todayIso(); save({ type: "Version du Design System", id: v.id, action: "Publication de la version " + v.version, resume: v.resume }); closeModal(); rerender(); }; } };
