/* Plateforme — Registre du cahier des charges (thématiques, points, exigences, glossaire) — v0.6 */
"use strict";
const CDC_STATUTS = ["Idée", "Qualifiée", "En instruction", "Rédigée", "Validée", "Reportée", "Écartée", "Fusionnée"];
const CDC_ACTIFS = ["Idée", "Qualifiée", "En instruction", "Rédigée", "Validée"];
const CDC_TYPES = ["Point", "Exigence", "Précision", "Contrainte", "Hypothèse à valider"];
const CDC_FORCE = ["Doit (obligatoire)", "Devrait (recommandé, écart à justifier)", "Peut (optionnel)"];
const CDC_PRIO = ["Indispensable (Must)", "Important (Should)", "Souhaitable (Could)", "Pas cette fois (Won't)"];
const CDC_DEST = ["CDC besoins CMS (P6)", "CDC développement (P7)", "P6 et P7", "Cahier des charges design (DOC-143)", "À déterminer"];
const CDC_UNIVERS = ["Transversal", "Site public", "MyEtu", "MyCollab", "MyParFo", "Application / PWA", "Back-office (contribution)", "Projet / contrat"];
const CDC_VERIF = ["Test fonctionnel", "Audit automatisé", "Audit expert", "Test utilisateurs", "Démonstration", "Revue documentaire", "Mesure en production"];

/* ---------- arborescence des thématiques (profondeur libre) */
const thSort = (a, b) => (Number(a.ordre) || 0) - (Number(b.ordre) || 0) || String(a.id).localeCompare(String(b.id), "fr", { numeric: true });
const thChildren = id => S.cdcThemes.filter(t => (t.parent || "") === (id || "")).sort(thSort);
const thById = id => S.cdcThemes.find(t => t.id === id);
function thPath(id) { const out = []; let t = thById(id), g = 0; while (t && g++ < 20) { out.unshift(t); t = thById(t.parent); } return out; }
function thNumber(id) { /* numéro de section calculé depuis la position (1, 1.2, 1.2.3…) — l'identifiant TH-nn, lui, ne change jamais */
  return thPath(id).map(t => thChildren(t.parent).findIndex(x => x.id === t.id) + 1).join(".");
}
function thDescendants(id) { const out = [id]; thChildren(id).forEach(c => out.push(...thDescendants(c.id))); return out; }
function thFlat(parent, depth, out) { out = out || []; thChildren(parent).forEach(t => { out.push({ t, depth: depth || 0 }); thFlat(t.id, (depth || 0) + 1, out); }); return out; }
const thOpts = exclude => thFlat("").filter(x => !exclude || !thDescendants(exclude).includes(x.t.id)).map(x => [x.t.id, `${"   ".repeat(x.depth)}${thNumber(x.t.id)}  ${x.t.titre} (${x.t.id})`]);
const thLabel = id => { const t = thById(id); return t ? `${thNumber(id)} ${t.titre}` : (id || "—"); };
const cdcKids = id => S.cdc.filter(x => x.parent === id).sort((a, b) => String(a.id).localeCompare(String(b.id), "fr", { numeric: true }));
const cdcOpts = self => S.cdc.filter(x => x.id !== self).map(x => [x.id, `${x.id} — ${String(x.titre).slice(0, 70)}`]);

SCHEMAS.cdc = { titre: "Point du cahier des charges", prefix: "CDC-", pad: 3, fields: [
  F("id", "ID", "ro", { col: true }), F("theme", "Thématique", "select", { opts: () => thOpts(), req: true }),
  F("titre", "Intitulé", "text", { full: true, col: true, req: true }),
  F("type", "Nature", "select", { opts: () => CDC_TYPES, col: true }), F("statut", "Statut", "select", { opts: () => CDC_STATUTS, col: true }),
  F("parent", "Rattaché à (point parent)", "select", { opts: () => cdcOpts() }), F("univers", "Univers concerné", "select", { opts: () => CDC_UNIVERS }),
  F("idee", "Idée / besoin (formulation libre)", "textarea", { full: true }),
  F("priorite", "Priorité (MoSCoW)", "select", { opts: () => CDC_PRIO, col: true }), F("phase", "Instruit en phase", "select", { opts: phaseOpts, col: true }),
  F("destination", "Destination", "select", { opts: () => CDC_DEST, col: true }), F("pilote", "Pilote du point", "select", { opts: roleOpts }),
  F("force", "Force de l'exigence", "select", { opts: () => CDC_FORCE }), F("methode", "Méthode de vérification", "select", { opts: () => CDC_VERIF }),
  F("exigence", "Exigence rédigée (une seule affirmation vérifiable, valeurs mesurables)", "textarea", { full: true }),
  F("verification", "Critère d'acceptation (comment, par qui, avec quel outil, seuil)", "textarea", { full: true }),
  F("publics", "Publics concernés", "text"), F("liens", "Liens (Q-, R-, D-, DOC-, T, S-, DC-, CDC-…)", "text"),
  F("source", "Source (document, réunion, veille…)", "text", { full: true }), F("auteur", "Proposé par", "text"), F("date", "Date de capture", "date"),
  F("questionsOuvertes", "Questions ouvertes / ce qui manque", "textarea", { full: true }),
  F("motif", "Motif (si reportée, écartée ou fusionnée)", "text", { full: true }), F("remplacePar", "Fusionné dans / remplacé par (CDC-…)", "text"),
  F("notes", "Notes", "textarea", { full: true })] };
SCHEMAS.cdcThemes = { titre: "Thématique du cahier des charges", prefix: "TH-", pad: 2, fields: [
  F("id", "ID", "ro", { col: true }), F("titre", "Thématique", "text", { full: true, col: true, req: true }),
  F("parent", "Thématique parente (vide = niveau 1)", "select", { opts: () => thOpts(), col: true }), F("ordre", "Ordre parmi les thématiques sœurs", "number", { col: true }),
  F("sommaire", "Section du sommaire type du CDC (programme §4)", "text", { col: true }), F("description", "Ce que couvre la thématique", "textarea", { full: true })] };
SCHEMAS.cdcGlossaire = { titre: "Terme du glossaire", prefix: "GL-", pad: 3, fields: [
  F("id", "ID", "ro", { col: true }), F("terme", "Terme", "text", { col: true, req: true }), F("statut", "Statut", "select", { opts: () => ["Proposé", "Validé", "Retiré"], col: true }),
  F("definition", "Définition (une seule lecture possible)", "textarea", { full: true, col: true, req: true }), F("exemple", "Exemple / contre-exemple", "textarea", { full: true }),
  F("source", "Source", "text", { full: true }), F("liens", "Points liés (CDC-…)", "text")] };

/* ---------- formulaire d'un point : historique, sous-éléments, contrôles de rigueur */
HOOKS.cdc = {
  extra: (o, isNew) => {
    if (isNew) return `<div class="full small muted">Astuce : capturez d'abord l'idée (thématique, intitulé, idée, source). Elle mûrira ensuite : qualification, instruction, rédaction de l'exigence et de son critère d'acceptation.</div>`;
    const k = cdcKids(o.id), th = thPath(o.theme).map(t => esc(t.titre)).join(" › ");
    return `<div class="full"><p class="small muted" style="margin:0">Emplacement : ${th || "—"}${o.parent ? ` › ${esc(o.parent)}` : ""} · liens : ${refChips(o.liens) || "—"}</p></div>
      <div class="full"><h3>Sous-éléments (${k.length})</h3>${k.length ? `<ul class="cdc-kids">${k.map(x => `<li><a class="chip" href="#" data-cdc="${esc(x.id)}">${esc(x.id)}</a> ${esc(x.titre)} ${tag(x.statut)}</li>`).join("")}</ul>` : `<p class="small muted">Aucun. Utilisez « + Sous-élément » pour détailler ce point en exigences ou précisions.</p>`}</div>
      <div class="full"><h3>Historique de la fiche</h3>${(o.hist || []).length ? `<ul class="cdc-hist">${o.hist.slice().reverse().map(h => `<li><span class="nowrap">${esc(fdt(h.ts))}</span> · ${esc(h.user || "—")} · ${esc(h.action)}</li>`).join("")}</ul>` : `<p class="small muted">—</p>`}</div>`;
  },
  buttons: o => `<button class="btn sec" id="cdcKid">+ Sous-élément</button>`,
  mount: (o, isNew) => {
    if (!isNew && $("#mDel")) { const b = $("#mDel"); if (cdcKids(o.id).length || o.statut !== "Idée") { b.disabled = true; b.title = "Un point qualifié ou détaillé ne se supprime pas : passez-le en « Écartée » ou « Fusionnée » avec un motif"; } }
    if ($("#cdcKid")) $("#cdcKid").onclick = () => { closeModal(); editItem("cdc", null, null, { theme: o.theme, parent: o.id, type: "Exigence", statut: "Idée", univers: o.univers, phase: o.phase, destination: o.destination, auteur: USER, date: todayIso() }); }; },
  save: (out, isNew) => {
    if (out.parent && out.parent === out.id) { toast("Un point ne peut pas être rattaché à lui-même"); return false; }
    let p = S.cdc.find(x => x.id === out.parent), g = 0; while (p && g++ < 50) { if (p.id === out.id) { toast("Rattachement circulaire impossible"); return false; } p = S.cdc.find(x => x.id === p.parent); }
    if (["Reportée", "Écartée", "Fusionnée"].includes(out.statut) && !String(out.motif || "").trim()) { toast("Indiquez le motif : une idée n'est jamais supprimée sans trace"); return false; }
    if (out.statut === "Fusionnée" && !/^CDC-\d+/.test(out.remplacePar || "")) { toast("Indiquez le point dans lequel celui-ci est fusionné (CDC-…)"); return false; }
    if (["Rédigée", "Validée"].includes(out.statut) && (!String(out.exigence || "").trim() || !String(out.verification || "").trim() || !out.force)) { toast("Statut « " + out.statut + " » : exigence, force et critère d'acceptation sont obligatoires"); return false; }
    if (["Qualifiée", "En instruction"].includes(out.statut) && (!out.priorite || !out.phase)) { toast("Statut « " + out.statut + " » : priorité et phase d'instruction sont obligatoires"); return false; }
    const prev = S.cdc.find(x => x.id === out.id);
    out.hist = Array.isArray(out.hist) ? out.hist.slice() : [];
    const d = isNew ? "Création" : diffSummary(prev, out, SCHEMAS.cdc.fields);
    if (d) out.hist.push({ ts: new Date().toISOString(), user: USER || "anonyme", action: d.slice(0, 600) });
  },
};
HOOKS.cdcThemes = {
  extra: (o, isNew) => isNew ? "" : `<div class="full small muted">Section calculée : <b>${esc(thNumber(o.id))}</b> · ${S.cdc.filter(x => thDescendants(o.id).includes(x.theme)).length} point(s) dans cette branche. L'identifiant ${esc(o.id)} ne change pas si la thématique est déplacée.</div>`,
  save: out => { if (out.parent && thDescendants(out.id).includes(out.parent)) { toast("Une thématique ne peut pas être placée sous l'une de ses sous-thématiques"); return false; } },
  mount: (o, isNew) => { if (isNew || !$("#mDel")) return; const n = S.cdc.filter(x => x.theme === o.id).length + thChildren(o.id).length; if (n) { const b = $("#mDel"); b.disabled = true; b.title = "Déplacez d'abord les points et sous-thématiques de cette thématique"; } },
};
/* liens cliquables CDC- */
document.addEventListener("click", e => { const a = e.target.closest("[data-cdc]"); if (!a) return; e.preventDefault(); const it = S.cdc.find(x => x.id === a.dataset.cdc); if (it) editItem("cdc", it); else toast(a.dataset.cdc + " introuvable"); });

/* ---------- capture rapide */
function cdcCapture(themeId) {
  openModal("Capturer une idée pour le cahier des charges", `
    <div class="full"><label for="qcT">Thématique *</label><select id="qcT"><option value="">—</option>${thOpts().map(o => `<option value="${esc(o[0])}" ${o[0] === themeId ? "selected" : ""}>${esc(o[1])}</option>`).join("")}</select></div>
    <div class="full"><label for="qcI">Intitulé *</label><input id="qcI"></div>
    <div class="full"><label for="qcD">Idée / besoin</label><textarea id="qcD"></textarea></div>
    <div class="full"><label for="qcS">Source (réunion, veille, échange…)</label><input id="qcS"></div>`,
    `<button class="btn sec" id="qcC">Annuler</button><button class="btn" id="qcOk">Enregistrer l'idée</button>`, () => {
      $("#qcC").onclick = closeModal;
      $("#qcOk").onclick = () => {
        const th = $("#qcT").value, ti = $("#qcI").value.trim(); if (!th || !ti) return toast("Thématique et intitulé sont obligatoires");
        const o = { id: nextId("cdc"), theme: th, titre: ti, idee: $("#qcD").value.trim(), source: $("#qcS").value.trim(), type: "Point", statut: "Idée", auteur: USER, date: todayIso(), hist: [{ ts: new Date().toISOString(), user: USER || "anonyme", action: "Création (capture rapide)" }] };
        S.cdc.push(o); save({ type: "Registre CDC", id: o.id, action: "Création (capture rapide)", resume: ti }); closeModal(); toast(o.id + " enregistré"); render();
      };
    });
}

/* ---------- export Markdown (squelette du cahier des charges) */
function cdcMarkdown(onlyActive) {
  const L = [`# Registre du cahier des charges — refonte web HEP Vaud`, ``, `Export du ${fd(todayIso())} · ${S.cdc.length} points · ${S.cdcThemes.length} thématiques${onlyActive ? " · points actifs uniquement (hors reportés, écartés, fusionnés)" : ""}`, ``];
  const pt = (x, lvl) => {
    L.push(`${"#".repeat(Math.min(6, lvl))} ${x.id} — ${x.titre}`, ``, `*${x.type || "Point"} · ${x.statut || "—"} · ${x.priorite || "priorité à qualifier"} · ${x.destination || "destination à déterminer"} · instruit en ${x.phase || "—"}*`, ``);
    if (x.idee) L.push(`**Idée** : ${x.idee}`, ``);
    if (x.exigence) L.push(`**Exigence** (${x.force || "force à préciser"}) : ${x.exigence}`, ``);
    if (x.verification) L.push(`**Critère d'acceptation** (${x.methode || "méthode à préciser"}) : ${x.verification}`, ``);
    if (x.questionsOuvertes) L.push(`**Questions ouvertes** : ${x.questionsOuvertes}`, ``);
    if (x.liens || x.source) L.push(`Liens : ${x.liens || "—"} · Source : ${x.source || "—"}`, ``);
    cdcKids(x.id).filter(k => !onlyActive || CDC_ACTIFS.includes(k.statut)).forEach(k => pt(k, lvl + 1));
  };
  const th = (t, lvl) => {
    L.push(`${"#".repeat(Math.min(6, lvl))} ${thNumber(t.id)} ${t.titre} (${t.id})`, ``); if (t.description) L.push(t.description, ``);
    S.cdc.filter(x => x.theme === t.id && !x.parent && (!onlyActive || CDC_ACTIFS.includes(x.statut))).sort((a, b) => String(a.id).localeCompare(String(b.id), "fr", { numeric: true })).forEach(x => pt(x, lvl + 1));
    thChildren(t.id).forEach(c => th(c, lvl + 1));
  };
  thChildren("").forEach(t => th(t, 2));
  if (S.cdcGlossaire.length) { L.push(`## Glossaire`, ``); S.cdcGlossaire.filter(g => g.statut !== "Retiré").sort((a, b) => a.terme.localeCompare(b.terme, "fr")).forEach(g => L.push(`- **${g.terme}** : ${g.definition}`)); }
  return L.join("\n");
}

/* ---------- recherche et filtres (arborescence et tableau) */
const CDC_F0 = { q: "", theme: "", phase: "", statut: "", prio: "", dest: "", univers: "", type: "", pilote: "", compl: "" };
let cdcF = Object.assign({}, CDC_F0, lsGet("hepvd-cdc-filtres") || {});
const cdcFActive = () => Object.keys(CDC_F0).some(k => cdcF[k]);
const cdcTokens = () => norm(cdcF.q).split(/\s+/).filter(Boolean);
const CDC_COMPL = [["exig", "Exigence non rédigée"], ["verif", "Critère d'acceptation manquant"], ["quest", "Avec questions ouvertes"], ["prio", "Priorité non attribuée"], ["pilote", "Pilote non désigné"], ["source", "Source non renseignée"]];
function cdcMatch(x) {
  const f = cdcF;
  if (f.theme && !thDescendants(f.theme).includes(x.theme)) return false;
  if (f.phase && x.phase !== f.phase) return false;
  if (f.statut === "_actifs" ? !CDC_ACTIFS.includes(x.statut) : f.statut === "_clos" ? CDC_ACTIFS.includes(x.statut) : f.statut && x.statut !== f.statut) return false;
  if (f.prio === "_none" ? !!x.priorite : f.prio && x.priorite !== f.prio) return false;
  if (f.dest && x.destination !== f.dest) return false;
  if (f.univers && x.univers !== f.univers) return false;
  if (f.type && (x.type || "Point") !== f.type) return false;
  if (f.pilote === "_none" ? !!x.pilote : f.pilote && x.pilote !== f.pilote) return false;
  const vide = k => !String(x[k] || "").trim();
  if (f.compl && ({ exig: !vide("exigence"), verif: !vide("verification"), quest: vide("questionsOuvertes"), prio: !vide("priorite"), pilote: !vide("pilote"), source: !vide("source") })[f.compl]) return false;
  const tk = cdcTokens();
  if (tk.length) { const h = norm([x.id, x.titre, x.idee, x.exigence, x.verification, x.source, x.liens, x.notes, x.questionsOuvertes, x.publics, x.motif, x.auteur, thLabel(x.theme), x.theme].join(" ")); if (!tk.every(w => h.includes(w))) return false; }
  return true;
}
function cdcHl(txt) { /* surligne les mots recherchés (insensible à la casse) */
  let h = esc(txt); const q = String(cdcF.q || "").trim().split(/\s+/).filter(w => w.length > 1); if (!q.length) return h;
  const re = new RegExp("(" + q.map(w => esc(w).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|") + ")", "gi");
  return h.replace(/(<[^>]*>)|([^<]+)/g, (m, tg, tx) => tg || tx.replace(re, "<mark>$1</mark>"));
}
function cdcFilterPanel() {
  const sel = (k, label, opts, all) => `<div class="cdc-f"><label for="cf_${k}">${label}</label><select id="cf_${k}" data-f="${k}"><option value="">${all}</option>${opts.map(o => Array.isArray(o) ? o : [o, o]).map(o => `<option value="${esc(o[0])}" ${cdcF[k] === o[0] ? "selected" : ""}>${esc(o[1])}</option>`).join("")}</select></div>`;
  return `<div class="card cdc-filters" role="search" aria-label="Rechercher et filtrer les points du cahier des charges">
    <div class="cdc-q"><label for="cf_q" class="vh">Rechercher</label><input type="search" id="cf_q" data-f="q" value="${esc(cdcF.q)}" placeholder="Rechercher : mots, CDC-012, Q-021, GA4, accessibilité…" autocomplete="off"></div>
    <div class="cdc-fgrid">
      ${sel("theme", "Thématique", thOpts(), "Toutes")}
      ${sel("phase", "Phase d'instruction", phaseOpts(), "Toutes")}
      ${sel("statut", "Statut", [["_actifs", "Actifs (hors clos)"], ["_clos", "Reportés, écartés, fusionnés"], ...CDC_STATUTS], "Tous")}
      ${sel("prio", "Priorité", [["_none", "Non attribuée"], ...CDC_PRIO], "Toutes")}
      ${sel("dest", "Destination", CDC_DEST, "Toutes")}
      ${sel("univers", "Univers", CDC_UNIVERS, "Tous")}
      ${sel("type", "Nature", CDC_TYPES, "Toutes")}
      ${sel("pilote", "Pilote", [["_none", "Non désigné"], ...roleOpts()], "Tous")}
      ${sel("compl", "Complétude", CDC_COMPL, "Toutes les fiches")}
    </div>
    <div class="cdc-fbar"><span id="cdcCount" class="small" role="status" aria-live="polite"></span><span class="grow"></span><button class="btn ghost sm" id="cdcReset" ${cdcFActive() ? "" : "hidden"}>Réinitialiser les filtres</button></div></div>`;
}

/* ---------- vue */
let cdcTab = "arbre", cdcOpen = null;
function vCdc() {
  if (!cdcOpen) cdcOpen = new Set(thChildren("").map(t => t.id));
  const c = s => S.cdc.filter(x => x.statut === s).length;
  const vides = thFlat("").filter(x => !thChildren(x.t.id).length && !S.cdc.some(p => p.theme === x.t.id && CDC_ACTIFS.includes(p.statut)));
  const d = el(`<p class="muted intro">Réservoir de tout ce que le cahier des charges devra traiter. Les idées sont capturées au fil de l'eau puis mûrissent jusqu'à des exigences atomiques et vérifiables, versées au cahier des charges des besoins (étude CMS, P6) et au cahier des charges de développement (P7, DOC-135). Les identifiants <b>CDC-nnn</b> et <b>TH-nn</b> ne changent jamais, même si l'arborescence est réorganisée.</p>
    <div class="bento" style="margin-bottom:var(--gap)">${["Idée", "Qualifiée", "En instruction", "Rédigée", "Validée"].map(s => `<button class="card c2 kpi mini cdc-kpi${cdcF.statut === s ? " on" : ""}" data-kst="${s}" title="Filtrer : ${s}"><div class="v">${c(s)}</div><div class="l">${s}</div></button>`).join("")}<button class="card c2 kpi mini cdc-kpi${cdcF.statut === "_clos" ? " on" : ""}" data-kst="_clos" title="Filtrer : reportées, écartées, fusionnées"><div class="v">${c("Reportée") + c("Écartée") + c("Fusionnée")}</div><div class="l">Reportées, écartées, fusionnées</div></button></div>
    ${tabs("cdc", [["arbre", "Arborescence"], ["tableau", "Tableau"], ["themes", "Thématiques"], ["glossaire", "Glossaire"], ["methode", "Méthode"]], cdcTab)}
    <div id="cdcBody" style="margin-top:var(--gap)"></div>`);
  bindTabs(d, "cdc", k => { cdcTab = k; render(); });
  $$("[data-kst]", d).forEach(x => x.onclick = () => { cdcF.statut = cdcF.statut === x.dataset.kst ? "" : x.dataset.kst; lsSet("hepvd-cdc-filtres", cdcF); if (!["arbre", "tableau"].includes(cdcTab)) cdcTab = "arbre"; render(); });
  const b = $("#cdcBody", d);
  const bar = `<div class="bar"><span class="grow"></span><button class="btn sec sm" id="cdcMd">Exporter en Markdown</button><button class="btn sm" id="cdcCap">+ Capturer une idée</button></div>`;
  if (cdcTab === "arbre" || cdcTab === "tableau") {
    b.innerHTML = bar + cdcFilterPanel() + (cdcTab === "arbre" && vides.length && !cdcFActive() ? `<p class="small" style="margin:0 0 10px">⚠ ${vides.length} thématique(s) sans point actif : ${vides.map(x => `<a href="#" data-addpt="${esc(x.t.id)}">${esc(thNumber(x.t.id))} ${esc(x.t.titre)}</a>`).join(" · ")}</p>` : "") + `<div id="cdcRes"></div>`;
    const res = $("#cdcRes", b);
    const draw = () => {
      const on = cdcFActive(), hits = S.cdc.filter(cdcMatch);
      $("#cdcCount", b).textContent = on ? `${hits.length} point${hits.length > 1 ? "s" : ""} sur ${S.cdc.length}` : `${S.cdc.length} points · aucun filtre`;
      $("#cdcReset", b).hidden = !on;
      if (cdcTab === "tableau") {
        res.innerHTML = "";
        const t = genericTable("cdc", { stateKey: "cdc-tab", filter: cdcMatch, preset: { statut: "Idée", type: "Point", auteur: USER, theme: cdcF.theme || "", phase: cdcF.phase || "" },
          extraCol: { l: "Thématique", f: x => `<span class="small">${esc(thLabel(x.theme))}</span>${x.parent ? `<br><span class="small muted">sous ${esc(x.parent)}</span>` : ""}` } });
        ["input.tq", "select.tp", "select.ts"].forEach(q => { const e = $(q, t); if (e) e.remove(); }); /* la recherche et les filtres du panneau remplacent ceux du tableau */
        tableState["cdc-tab"].q = ""; tableState["cdc-tab"].phase = ""; tableState["cdc-tab"].statut = "";
        res.appendChild(t); return;
      }
      const hitSet = new Set(hits.map(x => x.id));
      const ptRow = (x, depth) => {
        const kids = cdcKids(x.id).filter(k => !on || hitSet.has(k.id)), orphan = on && x.parent && !hitSet.has(x.parent);
        return `<li class="cdc-pt${CDC_ACTIFS.includes(x.statut) ? "" : " off"}" style="--d:${depth}"><a class="chip" href="#" data-cdc="${esc(x.id)}">${esc(x.id)}</a> <a href="#" data-cdc="${esc(x.id)}" class="cdc-t">${cdcHl(x.titre)}${orphan ? ` <span class="small muted">↳ sous ${esc(x.parent)}</span>` : ""}</a> <span class="cdc-m">${x.type && x.type !== "Point" ? tag(x.type, "") : ""}${tag(x.statut)}${x.priorite ? tag(x.priorite.replace(/ \(.*\)/, ""), "") : ""}${x.phase ? " " + phaseChip(x.phase) : ""}</span></li>` + kids.map(k => ptRow(k, depth + 1)).join("");
      };
      const thBlock = (t, depth) => {
        const ids = thDescendants(t.id), all = S.cdc.filter(x => ids.includes(x.theme)), act = all.filter(x => CDC_ACTIFS.includes(x.statut)).length;
        const branchHits = all.filter(x => hitSet.has(x.id)).length;
        if (on && !branchHits) return "";
        const open = on || cdcOpen.has(t.id);
        const own = S.cdc.filter(x => x.theme === t.id && (on ? hitSet.has(x.id) && !(x.parent && hitSet.has(x.parent)) : !x.parent)).sort((a, b2) => String(a.id).localeCompare(String(b2.id), "fr", { numeric: true }));
        const subs = thChildren(t.id).map(c2 => thBlock(c2, depth + 1)).join("");
        return `<div class="cdc-th" style="--d:${depth}"><div class="cdc-th-h"><button class="btn ghost sm cdc-tog" data-th="${esc(t.id)}" aria-expanded="${open}" aria-label="${open ? "Replier" : "Déplier"} ${esc(t.titre)}" ${on ? "disabled" : ""}>${open ? "▾" : "▸"}</button>
          <span class="cdc-num">${esc(thNumber(t.id))}</span><a href="#" class="cdc-th-t" data-thedit="${esc(t.id)}">${cdcHl(t.titre)}</a><span class="small muted">${esc(t.id)}</span><span class="grow"></span>
          <span class="small muted">${on ? `${branchHits} résultat${branchHits > 1 ? "s" : ""}` : `${act} actif${act > 1 ? "s" : ""}${all.length > act ? ` · ${all.length - act} clos` : ""}`}</span><button class="btn ghost sm" data-addpt="${esc(t.id)}" title="Capturer une idée dans cette thématique">+ Idée</button></div>
          ${open ? `${own.length ? `<ul class="cdc-pts">${own.map(x => ptRow(x, 0)).join("")}</ul>` : ""}${subs}${!on && !own.length && !thChildren(t.id).length ? `<p class="small muted cdc-empty">Aucun point pour l'instant — angle mort à surveiller.</p>` : ""}` : ""}</div>`;
      };
      const tree = thChildren("").map(t => thBlock(t, 0)).join("");
      res.innerHTML = `${on ? "" : `<div class="bar"><button class="btn sec sm" id="cdcAllO">Tout déplier</button><button class="btn sec sm" id="cdcAllC">Tout replier</button></div>`}<div class="card cdc-tree">${tree || `<p class="empty">Aucun point ne correspond à ces critères.</p>`}</div>`;
      $$(".cdc-tog", res).forEach(x => x.onclick = () => { const id = x.dataset.th; cdcOpen.has(id) ? cdcOpen.delete(id) : cdcOpen.add(id); draw(); });
      $$("[data-thedit]", res).forEach(x => x.onclick = e => { e.preventDefault(); editItem("cdcThemes", thById(x.dataset.thedit)); });
      $$("[data-addpt]", res).forEach(x => x.onclick = e => { e.preventDefault(); cdcCapture(x.dataset.addpt); });
      if ($("#cdcAllO", res)) { $("#cdcAllO", res).onclick = () => { S.cdcThemes.forEach(t => cdcOpen.add(t.id)); draw(); }; $("#cdcAllC", res).onclick = () => { cdcOpen.clear(); draw(); }; }
    };
    const setF = (k, v) => { cdcF[k] = v; lsSet("hepvd-cdc-filtres", cdcF); draw(); $$("[data-kst]", d).forEach(x => x.classList.toggle("on", cdcF.statut === x.dataset.kst)); };
    $$("select[data-f]", b).forEach(x => x.onchange = () => setF(x.dataset.f, x.value));
    let tq; $("#cf_q", b).oninput = e => { clearTimeout(tq); const v = e.target.value; tq = setTimeout(() => setF("q", v), 180); };
    $("#cdcReset", b).onclick = () => { cdcF = Object.assign({}, CDC_F0); lsSet("hepvd-cdc-filtres", cdcF); render(); };
    draw();
  } else if (cdcTab === "themes") {
    b.innerHTML = `<p class="small muted" style="margin-top:0">Arborescence évolutive, sans limite de profondeur. Pour réorganiser : modifiez la thématique parente ou l'ordre. Le numéro de section (1, 1.2…) est recalculé ; l'identifiant TH-nn reste stable. Une thématique qui contient encore des points ou des sous-thématiques ne peut pas être supprimée.</p>`;
    b.appendChild(genericTable("cdcThemes", { extraCol: { l: "Section · points", f: t => `${esc(thNumber(t.id))} · ${S.cdc.filter(x => x.theme === t.id).length}` } }));
  } else if (cdcTab === "glossaire") {
    b.innerHTML = `<p class="small muted" style="margin-top:0">Chaque terme sensible du cahier des charges y est défini une seule fois, pour qu'aucune lecture divergente ne soit possible. Le glossaire est annexé à l'export.</p>`;
    b.appendChild(genericTable("cdcGlossaire", {}));
  } else {
    b.innerHTML = `<div class="bento">
      <div class="card c6"><h2>Cycle de vie d'un point</h2><table><tbody>
        <tr><td>${tag("Idée")}</td><td>Capturée, non analysée. Toute personne de l'équipe.</td></tr>
        <tr><td>${tag("Qualifiée")}</td><td>Thématique, priorité (MoSCoW) et phase d'instruction attribuées. Revue mensuelle des co-chefs.</td></tr>
        <tr><td>${tag("En instruction")}</td><td>Travaillée dans la phase concernée : atelier, test, avis expert, données.</td></tr>
        <tr><td>${tag("Rédigée")}</td><td>Exigence formulée, avec force et critère d'acceptation. Pilote + relecture.</td></tr>
        <tr><td>${tag("Validée")}</td><td>Retenue pour le cahier des charges. Co-chefs, puis Copil au gate.</td></tr>
        <tr><td>${tag("Reportée")} ${tag("Écartée")} ${tag("Fusionnée")}</td><td>Jamais supprimée : motif obligatoire ; une fiche fusionnée renvoie vers celle qui la remplace.</td></tr></tbody></table></div>
      <div class="card c6"><h2>Règles de rédaction des exigences</h2><ul>
        <li><b>Une exigence = une seule affirmation vérifiable.</b> Scinder dès qu'il y a « et ».</li>
        <li><b>Vocabulaire normé</b> : « doit » (obligatoire), « devrait » (recommandé, écart à justifier), « peut » (optionnel). Proscrits : « si possible », « idéalement », « convivial », « moderne », « rapide ».</li>
        <li><b>Valeurs mesurables</b> : seuils chiffrés, normes citées, navigateurs et appareils listés.</li>
        <li><b>Critère d'acceptation</b> pour chaque exigence : comment, par qui, avec quel outil, quel seuil.</li>
        <li><b>Renvois plutôt que redites</b> : composant du Design System, gabarit, dossier de design, décision.</li>
        <li><b>Exemples et contre-exemples</b> quand une formulation reste ambiguë ; termes sensibles définis au glossaire.</li></ul></div>
      <div class="card c12"><h2>Traitement d'une idée transmise en conversation</h2><ol>
        <li>Reformuler l'idée en une ou deux phrases, sans en changer le sens.</li><li>Vérifier les doublons : compléter la fiche existante plutôt qu'en créer une.</li>
        <li>Classer dans une thématique (ou proposer une nouvelle branche).</li><li>Attribuer un identifiant CDC-nnn, statut « Idée ».</li>
        <li>Relier aux questionnements, risques, décisions, documents et à la phase d'instruction.</li><li>Signaler ce qui manque et proposer une priorité, confirmée par les co-chefs.</li>
        <li>Enregistrer et rendre un récapitulatif court.</li></ol>
        <p class="small muted">Rythme : revue mensuelle des nouvelles idées (30 min, co-chefs) · à chaque gate, point « état du registre » (fiches par statut, thématiques vides). Référence : <code>00_PILOTAGE/10_Registre-cahier-des-charges.md</code>.</p></div></div>`;
  }
  const cap = $("#cdcCap", b); if (cap) cap.onclick = () => cdcCapture(cdcF.theme);
  $$("[data-addpt]", b).forEach(x => x.onclick = e => { e.preventDefault(); cdcCapture(x.dataset.addpt); });
  const md = $("#cdcMd", b); if (md) md.onclick = () => download(`HEPVD_Registre-CDC_${todayIso()}.md`, cdcMarkdown(confirm("Exporter uniquement les points actifs ?\n(OK : actifs seulement · Annuler : tous les points, y compris reportés et écartés)")), "text/markdown;charset=utf-8");
  return d;
}

/* ---------- première alimentation (reprise de l'existant), une seule fois */
function cdcImportInitial() {
  const I = window.CDC_INITIAL;
  if (!I || !S || (S.meta.cdcInit && S.meta.cdcInit >= I.version) || READONLY()) return;
  if (S.cdc.length || S.cdcThemes.length) { S.meta.cdcInit = I.version; return; }
  const ts = new Date().toISOString(), who = USER || "Import initial";
  S.cdcThemes = clone(I.themes);
  I.points.forEach((p, i) => S.cdc.push(Object.assign({ id: "CDC-" + String(i + 1).padStart(3, "0"), type: "Point", statut: "Idée", date: I.date, auteur: I.auteur, hist: [{ ts, user: who, action: "Création — reprise de l'existant (" + (p.source || "documents du projet") + ")" }] }, p)));
  S.cdcGlossaire = clone(I.glossaire || []);
  const docIds = [];
  (I.documents || []).forEach(dd => { const ex = S.documents.find(x => x.chemin === dd.chemin); if (ex) { docIds.push(ex.id); return; } let m = 0; S.documents.forEach(x => { m = Math.max(m, +(String(x.id).match(/\d+/) || [0])[0]); }); const o = Object.assign({ id: "DOC-" + String(m + 1).padStart(3, "0"), taches: [], versions: [] }, dd); S.documents.push(o); docIds.push(o.id); });
  (I.decisions || []).forEach(dd => { if (!S.decisions.some(x => x.titre === dd.titre)) S.decisions.push(Object.assign({ id: nextId("decisions"), date: I.date }, dd, { documents: docIds.join(", ") })); });
  S.meta.cdcInit = I.version;
  save({ type: "Registre CDC", id: "", action: `Première alimentation : ${S.cdcThemes.length} thématiques, ${S.cdc.length} points, ${S.cdcGlossaire.length} termes`, resume: "Reprise des points identifiés dans les documents du projet" });
  toast(`Registre CDC alimenté : ${S.cdc.length} points`);
}
