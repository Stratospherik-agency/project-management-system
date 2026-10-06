/* Plateforme — historique, rapports, données, budget, RACI, parties prenantes, agents */
"use strict";
/* ---------- Historique */
let hTab = "journal"; const hst = { q: "", type: "", user: "" };
function vHistorique() {
  const wrap = el(`<p class="muted intro">Traçabilité complète : chaque modification est horodatée et attribuée. ${SERVER ? "En mode base de données, des instantanés complets sont conservés et restaurables." : "En mode local, exportez régulièrement les données (Données & paramètres)."}</p>
    ${tabs("hist", [["journal", "Journal des modifications"], ["decisions", "Décisions"], ["questions", "Questionnements"], ["versions", "Versions de documents"], ["ds", "Design System"], ["baselines", "Baselines"], ["rapports", "Rapports"]].concat(SERVER ? [["snap", "Instantanés"]] : []), hTab)}<div id="hb"></div>`);
  bindTabs(wrap, "hist", k => { hTab = k; rerender(); });
  const b = $("#hb", wrap);
  const tl = items => `<div class="timeline">${items.map(x => `<div class="tl"><div class="tl-d">${x.d}</div><div class="tl-b">${x.h}</div></div>`).join("") || '<p class="empty">Rien pour le moment.</p>'}</div>`;
  if (hTab === "journal") {
    const types = [...new Set(S.journal.map(j => j.type))].sort(), users = [...new Set(S.journal.map(j => j.user))].sort();
    b.innerHTML = `<div class="bar"><input type="search" id="hq" placeholder="Rechercher dans l'historique…" value="${esc(hst.q)}"><select id="ht"><option value="">Tous les objets</option>${types.map(t => `<option ${hst.type === t ? "selected" : ""}>${esc(t)}</option>`).join("")}</select><select id="hu"><option value="">Toutes les personnes</option>${users.map(t => `<option ${hst.user === t ? "selected" : ""}>${esc(t)}</option>`).join("")}</select><span class="grow"></span><button class="btn sec sm" id="hcsv">Export CSV</button></div><div id="hl"></div>`;
    const rows = () => { const q = norm(hst.q).split(/\s+/).filter(Boolean); return S.journal.filter(j => (!hst.type || j.type === hst.type) && (!hst.user || j.user === hst.user) && q.every(w => norm(JSON.stringify(j)).includes(w))); };
    const fill = () => { const r = rows(); $("#hl", b).innerHTML = `<div class="tw"><table><thead><tr><th>Date</th><th>Par</th><th>Objet</th><th>Modification</th></tr></thead><tbody>${r.slice(0, 500).map(j => `<tr class="static"><td class="nowrap small">${fdt(j.ts)}</td><td class="small">${esc(j.user || "—")}</td><td>${esc(j.type)} ${refChips(j.id) || ""}<div class="small muted">${esc(j.resume || "")}</div></td><td class="small">${esc(j.action)}</td></tr>`).join("") || '<tr><td colspan="4" class="empty">Aucune entrée</td></tr>'}</tbody></table></div>${r.length > 500 ? `<p class="small muted">500 premières entrées sur ${r.length}.</p>` : ""}`; };
    fill(); $("#hq", b).oninput = e => { hst.q = e.target.value; fill(); }; $("#ht", b).onchange = e => { hst.type = e.target.value; fill(); }; $("#hu", b).onchange = e => { hst.user = e.target.value; fill(); };
    $("#hcsv", b).onclick = () => download(`HEPVD_historique_${todayIso()}.csv`, "﻿Date;Personne;Objet;ID;Libellé;Modification\n" + rows().map(j => [j.ts, j.user, j.type, j.id, j.resume, j.action].map(v => `"${String(v || "").replace(/"/g, '""')}"`).join(";")).join("\n"), "text/csv");
  }
  if (hTab === "decisions") b.innerHTML = tl(S.decisions.slice().sort((a, b) => String(b.date).localeCompare(a.date)).map(d => ({ d: fds(d.date), h: `${refChips(d.id)} <b>${esc(d.titre)}</b> ${tag(d.statut)}<div class="small">${esc(d.decision || "")}</div>${d.remplace ? `<div class="small">Remplace ${refChips(d.remplace)}</div>` : ""}${d.questions ? `<div class="small">Questions : ${refChips(d.questions)}</div>` : ""}<div class="small muted">${S.journal.filter(j => j.id === d.id).map(j => `${fdt(j.ts)} · ${esc(j.user)} · ${esc(j.action)}`).join("<br>")}</div>` })));
  if (hTab === "questions") b.innerHTML = tl(S.questions.slice().sort((a, b) => String(b.date).localeCompare(a.date)).map(q => ({ d: fds(q.date), h: `${refChips(q.id)} ${tag(q.statut)} <b>${esc(q.question)}</b><div class="small muted">Posée par ${esc(q.auteur || "—")} · origine : ${esc(q.origine || "—")}</div>${q.reponse ? `<div class="small"><b>Réponse (${fds(q.dateReponse)}) :</b> ${esc(q.reponse)}</div>` : ""}${q.decision ? `<div class="small">→ ${refChips(q.decision)}</div>` : ""}` })));
  if (hTab === "versions") { const v = []; S.documents.forEach(d => (d.versions || []).forEach(x => v.push({ d, x }))); v.sort((a, b) => String(b.x.date).localeCompare(a.x.date)); b.innerHTML = `<div class="tw"><table><thead><tr><th>Date</th><th>Document</th><th>Version</th><th>Note</th><th>Par</th></tr></thead><tbody>${v.map(({ d, x }) => `<tr class="static"><td class="small nowrap">${fds(x.date)}</td><td>${docChip(d)} ${esc(d.titre)}</td><td>${esc(x.v)}</td><td class="small">${esc(x.note)}</td><td class="small">${esc(x.auteur)}</td></tr>`).join("")}</tbody></table></div>`; }
  if (hTab === "ds") b.innerHTML = tl(S.dsVersions.slice().sort((a, b) => String(b.date).localeCompare(a.date)).map(v => ({ d: fds(v.date), h: `<b>v${esc(v.version)}</b> ${tag(v.statut)} ${esc(v.resume)}${v.notes ? `<div class="small pre">${esc(v.notes)}</div>` : ""}` })));
  if (hTab === "baselines") b.innerHTML = tl(S.baselines.slice().reverse().map(x => ({ d: fds(x.date), h: `<b>${esc(x.id)}</b> ${esc(x.nom)} <span class="small muted">· ${esc(x.auteur)}</span>` })));
  if (hTab === "rapports") b.innerHTML = tl(S.rapports.map(r => ({ d: fds(r.date), h: `<b>${esc(r.id)}</b> · ${esc(r.auteur || "")} <a href="#" data-rp="${esc(r.id)}">ouvrir</a>` })));
  if (hTab === "snap") { b.innerHTML = '<p class="muted">Chargement…</p>'; fetch(api("snapshots")).then(r => r.json()).then(j => { b.innerHTML = `<div class="tw"><table><thead><tr><th>Date</th><th>Révision</th><th>Par</th><th></th></tr></thead><tbody>${j.snapshots.map(s => `<tr class="static"><td>${fdt(s.ts)}</td><td>${s.rev}</td><td>${esc(s.user || "")}</td><td><a class="btn sec sm" href="${api("snapshots/" + s.id)}" download>Télécharger</a> <button class="btn ghost sm" data-snap="${s.id}">Restaurer</button></td></tr>`).join("")}</tbody></table></div>`;
    $$("[data-snap]", b).forEach(x => x.onclick = async () => { if (!confirm("Restaurer cet instantané ? L'état actuel reste lui-même conservé dans un instantané.")) return; const d = await (await fetch(api("snapshots/" + x.dataset.snap))).json(); S = normalize(d); save({ type: "Données", id: "", action: "Restauration de l'instantané " + x.dataset.snap }); toast("Instantané restauré"); render(); }); }).catch(() => b.innerHTML = '<p class="empty">Indisponible</p>'); }
  $$("[data-rp]", b).forEach(a => a.onclick = e => { e.preventDefault(); const x = S.rapports.find(r => r.id === a.dataset.rp); rpDraft = clone(x); rpDraft.ref = x.mon; rpDraft.historique = true; location.hash = "#rapports"; });
  return wrap;
}

/* ---------- Rapports hebdomadaires */
let rpDraft = null;
function compileReport(dateIso) {
  const ref = pd(dateIso), mon = mondayOf(ref), sun = mon + 6 * DAY, nextEnd = sun + 14 * DAY, wk = isoWeek(ref), F = forecast(), G = gateForecasts(F), A = alerts();
  const id = `${wk.year}-S${String(wk.week).padStart(2, "0")}`, inW = s => s && pd(s) >= mon && pd(s) <= sun, jw = S.journal.filter(j => { const t = Date.parse(j.ts); return t >= mon && t < sun + DAY; });
  const L = a => a.length ? a.join("\n") : "- (aucun)";
  const done = S.taches.filter(t => isDone(t) && inW(t.termineLe)), prog = S.taches.filter(t => ["En cours", "En revue"].includes(t.statut));
  const late = S.taches.filter(t => !isDone(t) && pd(t.fin) < ref), blocked = S.taches.filter(t => t.statut === "Bloqué");
  const next = S.taches.filter(t => !isDone(t) && ((pd(t.debut) > sun && pd(t.debut) <= nextEnd) || (pd(t.fin) > sun && pd(t.fin) <= nextEnd)));
  return { id, mon: iso(mon), sun: iso(sun), parts: {
    avancement: `Avancement global réel : **${globalProgress()} %** (prévu à date : ${plannedProgress()} %)\n\n| Phase | Période | Avancement |\n|---|---|---|\n` + S.phases.map(p => `| ${p.id} ${p.nom} | ${fds(p.debut)} → ${fds(p.fin)} | ${phaseProgress(p.id)} % |`).join("\n"),
    realise: L(done.map(t => `- ✅ ${t.id} ${t.nom} (${roleShort(t.responsable)})`).concat(prog.map(t => `- ⏳ ${t.id} ${t.nom} — ${t.avancement || 0} % (${t.statut})`))),
    avenir: L(next.map(t => `- ${t.id} ${t.nom} — ${fds(t.debut)} → ${fds(t.fin)} (${roleShort(t.responsable)})`)),
    retards: L(late.map(t => `- ⚠ ${t.id} ${t.nom} — échéance ${fds(t.fin)}, ${t.avancement || 0} %`).concat(blocked.map(t => `- ⛔ Bloqué : ${t.id} ${t.nom}`))),
    anticipation: "| Jalon | Baseline | Prévision | Dérive | Marge consommée |\n|---|---|---|---|---|\n" + G.filter(x => x.j.type === "Gate" && pd(x.j.date) >= ref).slice(0, 4).map(x => `| ${x.j.id} ${x.j.nom} | ${fds(x.bl || x.j.date)} | ${fds(x.fc)} | ${x.derive > 0 ? "+" + x.derive + " j" : "—"} | ${x.pct} % |`).join("\n") + "\n\nAlertes : " + A.filter(a => a.niv === 3).length + " alerte(s), " + A.filter(a => a.niv === 2).length + " vigilance(s).\n" + A.filter(a => a.niv >= 2).slice(0, 8).map(a => `- ${NIV[a.niv]} — ${a.txt}`).join("\n"),
    risques: "| ID | Risque | Score | Signal d'alerte | Propriétaire |\n|---|---|---|---|---|\n" + S.risques.filter(r => r.statut !== "Clos").sort((a, b) => score(b) - score(a)).slice(0, 5).map(r => `| ${r.id} | ${r.titre} | ${score(r)} | ${String(r.declencheur || "").replace(/\|/g, "/")} | ${roleShort(r.proprietaire)} |`).join("\n") + "\n\nRevues de risques cette semaine : " + jw.filter(j => j.type === "Risque").length,
    questions: L(S.questions.filter(q => inW(q.date)).map(q => `- Nouvelle : ${q.id} ${q.question}`).concat(S.questions.filter(q => inW(q.dateReponse)).map(q => `- Répondue : ${q.id} ${q.question} → ${q.reponse || q.decision || ""}`)).concat([`- Ouvertes au total : ${S.questions.filter(q => ["Ouverte", "En analyse"].includes(q.statut)).length}`])),
    decisions: L(jw.filter(j => j.type === "Décision").map(j => `- ${j.id} : ${j.action}`).concat(S.decisions.filter(d => ["À instruire", "Proposée"].includes(d.statut)).map(d => `- En attente : ${d.id} ${d.titre} (${d.statut})`))),
    ds: L(jw.filter(j => /Design System|Élément du Design|Demande d'évolution|Besoin pour le Design/.test(j.type)).map(j => `- ${j.type} ${j.id} : ${j.action}`)),
    documents: L(S.documents.flatMap(d => (d.versions || []).filter(v => inW(v.date)).map(v => `- ${d.id} ${d.titre} — v${v.v} : ${v.note}`))),
    budget: budgetMd(S.meta.budgetAnnee || 2027, { titre: false }) + "\n" + L(jw.filter(j => ["Budget", "Poste budgétaire"].includes(j.type)).map(j => `- ${j.id ? j.id + " : " : ""}${j.resume ? j.resume + " — " : ""}${j.action}`)),
    budgetDetail: budgetMd(S.meta.budgetAnnee || 2027, { detail: true, titre: false }).split("### Détail")[1] ? "### Détail" + budgetMd(S.meta.budgetAnnee || 2027, { detail: true, titre: false }).split("### Détail")[1] + "\n" + budgetPluriMd() : "",
    journal: `${jw.length} modification(s) enregistrée(s) dans la plateforme cette semaine.`,
  } };
}
const AXES = ["Délais", "Budget", "Périmètre", "Qualité", "Ressources"], METEO = { "🟢": "Conforme", "🟠": "Vigilance", "🔴": "Alerte" };
function reportMd(r) { const p = r.parts, exc = r.type === "Exceptionnel"; return `# ${exc ? "Rapport exceptionnel" + (r.objet ? " — " + r.objet : "") : "Rapport hebdomadaire — " + r.id}
${S.meta.nom} · ${S.meta.copil} · ${exc ? "État au " + fd(r.ref) : `Semaine du ${fd(r.mon)} au ${fd(r.sun)}`} · Rédigé par : ${r.auteur || "—"} · ${fd(r.date)}

## Météo
| Axe | Tendance | Commentaire |
|---|---|---|
${AXES.map(a => `| ${a} | ${(r.meteo[a] || {}).v || "🟢"} ${METEO[(r.meteo[a] || {}).v || "🟢"]} | ${(r.meteo[a] || {}).c || ""} |`).join("\n")}

## Faits marquants
${r.faits || "- (à compléter)"}

## Avancement
${p.avancement}

## Réalisé / en cours
${p.realise}

## Prévu dans les 2 prochaines semaines
${p.avenir}

## Retards et blocages
${p.retards}

## Anticipation (prévisions, marges, alertes)
${p.anticipation}

## Risques principaux
${p.risques}

## Budget
${p.budget || "- (recompiler le rapport)"}
${r.inclBudget && p.budgetDetail ? "\n" + p.budgetDetail : ""}
## Questionnements
${p.questions}

## Décisions
${p.decisions}

## Design System
${p.ds}

## Documents (nouvelles versions)
${p.documents}

## Demandes au Copil
${r.demandes || "- (aucune)"}

## Ce que nous remettons en question cette semaine
${r.questionsRQ || "- (à compléter : hypothèse, choix ou livrable à réexaminer, et pourquoi)"}

## Journal
${p.journal}
`; }
function mdToHtml(md) {
  const lines = md.split("\n"); let h = "", inL = false, tbl = [];
  const inline = s => esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/`(.+?)`/g, "<code>$1</code>");
  const flushT = () => { if (!tbl.length) return; const rows = tbl.filter(l => !/^\|\s*-/.test(l)).map(l => l.replace(/^\||\|$/g, "").split("|").map(c => c.trim())); h += `<table><thead><tr>${rows[0].map(c => `<th>${inline(c)}</th>`).join("")}</tr></thead><tbody>${rows.slice(1).map(r => `<tr class="static">${r.map(c => `<td>${inline(c)}</td>`).join("")}</tr>`).join("")}</tbody></table>`; tbl = []; };
  lines.forEach(l => { if (/^\|/.test(l)) { if (inL) { h += "</ul>"; inL = false; } tbl.push(l); return; } flushT();
    if (/^- /.test(l)) { if (!inL) { h += "<ul>"; inL = true; } h += `<li>${inline(l.slice(2))}</li>`; return; } if (inL) { h += "</ul>"; inL = false; }
    const m = l.match(/^(#{1,3}) (.*)/); if (m) { h += `<h${m[1].length}>${inline(m[2])}</h${m[1].length}>`; return; } if (l.trim()) h += `<p>${inline(l)}</p>`; });
  flushT(); if (inL) h += "</ul>"; return h;
}
function vRapports() {
  const newDraft = d => { const c = compileReport(d), ex = S.rapports.find(r => r.id === c.id); rpDraft = ex ? Object.assign(clone(ex), { parts: c.parts, mon: c.mon, sun: c.sun }) : Object.assign(c, { date: todayIso(), auteur: USER || CFG.auteurParDefaut, meteo: {}, faits: "", demandes: "", questionsRQ: "" }); rpDraft.ref = d; };
  if (!rpDraft) newDraft(todayIso()); else if (!rpDraft.historique) rpDraft.parts = compileReport(rpDraft.ref).parts;
  const r = rpDraft;
  const wrap = el(`<div class="bar no-print"><label for="rd" style="margin:0">Semaine contenant le</label><input type="date" id="rd" value="${r.ref}"><button class="btn sec sm" id="rregen">Recompiler</button>${r.historique ? '<span class="tag">Rapport archivé — données figées</span>' : ""}<span class="grow"></span>
    <button class="btn sec sm" id="rmd">Exporter .md</button><button class="btn sec sm" id="rprint">Imprimer / PDF</button><button class="btn sm" id="rsave">Enregistrer le rapport</button></div>
    <div class="report"><div class="card no-print"><h2>${esc(r.id)} — saisie</h2>
      <div style="margin-bottom:12px"><label for="rauth">Rédigé par</label><input id="rauth" value="${esc(r.auteur)}" style="width:100%"></div>
      <div style="margin-bottom:12px;display:grid;grid-template-columns:180px 1fr;gap:10px"><div><label for="rtype">Type de rapport</label><select id="rtype">${["Hebdomadaire", "Exceptionnel"].map(t => `<option ${(r.type || "Hebdomadaire") === t ? "selected" : ""}>${t}</option>`).join("")}</select></div><div><label for="robj">Objet (rapport exceptionnel)</label><input id="robj" value="${esc(r.objet || "")}" placeholder="ex. Demande budgétaire 2027" style="width:100%"></div></div>
      <label class="chk" style="margin-bottom:12px"><input type="checkbox" id="rbud" ${r.inclBudget ? "checked" : ""}> Inclure le détail budgétaire ligne par ligne et la vision pluriannuelle</label>
      <h3>Météo</h3><div class="meteo">${AXES.map(a => `<label for="mv_${a}" style="margin:0">${a}</label><div class="row"><select id="mv_${a}" data-a="${a}" class="mv">${Object.keys(METEO).map(k => `<option value="${k}" ${((r.meteo[a] || {}).v || "🟢") === k ? "selected" : ""}>${k} ${METEO[k]}</option>`).join("")}</select><input data-a="${a}" class="mc" placeholder="Commentaire" value="${esc((r.meteo[a] || {}).c || "")}" style="flex:1" aria-label="Commentaire ${a}"></div>`).join("")}</div>
      <label for="rfaits" class="h3">Faits marquants</label><textarea id="rfaits" placeholder="- …">${esc(r.faits)}</textarea>
      <label for="rdem" class="h3">Demandes au Copil</label><textarea id="rdem" placeholder="- …">${esc(r.demandes)}</textarea>
      <label for="rq" class="h3">Ce que nous remettons en question</label><textarea id="rq" placeholder="- Hypothèse / choix / livrable à réexaminer, et pourquoi">${esc(r.questionsRQ)}</textarea>
      <p class="small"><button class="btn sec sm" id="rqReg">Enregistrer ces remises en question dans Questionnements</button></p>
      <p class="small muted">Les autres sections sont compilées automatiquement depuis la plateforme (skill hepvd-rapport-hebdo).</p></div>
      <div class="card md" id="rprev"></div></div>`);
  const upd = () => { r.auteur = $("#rauth", wrap).value; r.type = $("#rtype", wrap).value; r.objet = $("#robj", wrap).value; r.inclBudget = $("#rbud", wrap).checked;
    if (!r.wid) r.wid = /^EXC-/.test(r.id) ? compileReport(r.ref).id : r.id; r.id = r.type === "Exceptionnel" ? "EXC-" + r.ref : r.wid; r.faits = $("#rfaits", wrap).value; r.demandes = $("#rdem", wrap).value; r.questionsRQ = $("#rq", wrap).value;
    $$(".mv", wrap).forEach(s => { r.meteo[s.dataset.a] = r.meteo[s.dataset.a] || {}; r.meteo[s.dataset.a].v = s.value; }); $$(".mc", wrap).forEach(s => { r.meteo[s.dataset.a] = r.meteo[s.dataset.a] || {}; r.meteo[s.dataset.a].c = s.value; });
    r.md = reportMd(r); $("#rprev", wrap).innerHTML = mdToHtml(r.md); };
  setTimeout(upd, 0);
  wrap.addEventListener("input", e => { if (e.target.id !== "rd") upd(); }); wrap.addEventListener("change", e => { if (e.target.classList.contains("mv") || ["rtype", "rbud"].includes(e.target.id)) upd(); });
  $("#rd", wrap).onchange = e => { if (e.target.value) { newDraft(e.target.value); render(); } };
  $("#rregen", wrap).onclick = () => { r.parts = compileReport(r.ref).parts; r.historique = false; upd(); toast("Données recompilées"); };
  $("#rmd", wrap).onclick = () => { upd(); download(`${r.id}_${r.type === "Exceptionnel" ? "Rapport-exceptionnel" : "Rapport-hebdo"}.md`, r.md, "text/markdown;charset=utf-8"); };
  $("#rprint", wrap).onclick = () => { upd(); window.print(); };
  $("#rqReg", wrap).onclick = () => { upd(); const lines = r.questionsRQ.split("\n").map(s => s.replace(/^[-•]\s*/, "").trim()).filter(s => s && !/^\(à compléter/.test(s)); lines.forEach(q => S.questions.push({ id: nextId("questions"), date: todayIso(), question: q, categorie: "Planning", phase: (S.phases.find(p => pd(p.debut) <= TODAY() && pd(p.fin) >= TODAY()) || {}).id || "", responsable: "CDP", origine: "Rapport " + r.id, auteur: USER, statut: "Ouverte", contexte: "", reponse: "", dateReponse: "", decision: "" })); if (lines.length) { save({ type: "Questionnement", id: "", action: `${lines.length} remise(s) en question enregistrée(s) depuis le rapport ${r.id}` }); toast(lines.length + " questionnement(s) enregistré(s)"); } };
  $("#rsave", wrap).onclick = () => { upd(); r.date = todayIso(); const o = clone(r); delete o.historique; delete o.ref; const i = S.rapports.findIndex(x => x.id === o.id); if (i >= 0) S.rapports[i] = o; else S.rapports.unshift(o); S.rapports.sort((a, b) => b.id.localeCompare(a.id)); save({ type: "Rapport", id: o.id, action: i >= 0 ? "Mise à jour" : "Création" }); toast("Rapport " + o.id + " enregistré"); };
  return wrap;
}

/* ---------- Budget */
let budgetYear = null;
function copyText(txt, name) {
  const done = () => toast("Extrait copié — collez-le dans votre rapport");
  if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(txt).then(done, () => download(name, txt, "text/markdown;charset=utf-8"));
  else download(name, txt, "text/markdown;charset=utf-8");
}
function vBudget() {
  const Y = budgetYears(); if (!budgetYear || !Y.includes(budgetYear)) budgetYear = Y.includes(+S.meta.budgetAnnee) ? +S.meta.budgetAnnee : (Y[0] || new Date().getFullYear());
  const B = budgetCalc(budgetYear), d = budgetDecision(), ro = READONLY();
  const wrap = el(`<p class="muted intro">Budget d'achats du projet, par année et par scénario (Recommandé / Allégé / Minimal), avec la justification de chaque ligne. Le temps de travail interne n'y est pas imputé (Q-001). Réserve pour imprévus de ${Math.round(B.r * 100)} % calculée automatiquement. Source détaillée : <code>01_CADRAGE/03_Livrables/P0_Budget-2027_v0.1.xlsx</code>.</p>
    <div class="bar no-print"><label for="by" style="margin:0">Année</label><select id="by">${Y.map(y => `<option ${y === budgetYear ? "selected" : ""}>${y}</option>`).join("")}</select>
      <label for="bsc" style="margin:0 0 0 12px">Scénario retenu</label><select id="bsc" ${ro ? "disabled" : ""}><option value="">À arbitrer${d ? " (" + esc(d.id) + ")" : ""}</option>${SCENARIOS.map(s => `<option ${S.meta.budgetScenario === s ? "selected" : ""}>${s}</option>`).join("")}</select>
      <span class="grow"></span><button class="btn sec sm" id="bcopy">Copier la synthèse</button><button class="btn sec sm" id="bcopyd">Copier synthèse + détail</button><button class="btn sec sm" id="bnote">Exporter la note (.md)</button><button class="btn sec sm" id="bprint">Imprimer / PDF</button></div>
    <div class="bento" style="margin-bottom:var(--gap)">
      <div class="card dark c3 kpi"><div class="v">${chf(B.total)}</div><div class="l">CHF ${B.annee} · scénario ${esc(B.ref)}${S.meta.budgetScenario ? "" : " (référence)"}</div></div>
      <div class="card c3 kpi"><div class="v ${B.env && B.total > B.env ? "red" : ""}">${B.env ? (B.total > B.env ? "+" : "−") + chf(Math.abs(B.total - B.env)) : "—"}</div><div class="l">${B.env ? `CHF d'écart / enveloppe ${chf(B.env)}` : "Pas d'enveloppe définie pour cette année"}</div></div>
      <div class="card c3 kpi"><div class="v">${chf(B.eng)}</div><div class="l">CHF engagés (${B.total ? Math.round(B.eng / B.total * 100) : 0} %)</div></div>
      <div class="card c3 kpi"><div class="v">${chf(B.con)}</div><div class="l">CHF consommés (${B.total ? Math.round(B.con / B.total * 100) : 0} %)</div></div>
      <div class="card c7 md"><div id="bsyn"></div></div><div class="card c5 md"><div id="bplu"></div></div></div>`);
  $("#bsyn", wrap).innerHTML = mdToHtml(budgetMd(budgetYear));
  $("#bplu", wrap).innerHTML = mdToHtml(budgetPluriMd() || "### Vision pluriannuelle\n\nUne seule année saisie.");
  wrap.appendChild(genericTable("budget", { stateKey: "budget-" + budgetYear, filter: b => +b.annee === +budgetYear, preset: { annee: budgetYear, statut: "Proposé", scenarios: "Recommandé, Allégé, Minimal" },
    extraCol: { l: "Engagé / prévu", f: b => b.prevu ? `<div class="prog" style="width:90px"><i style="width:${Math.min(100, Math.round(b.engage / b.prevu * 100))}%"></i></div>` : "—" } }));
  $("#by", wrap).onchange = e => { budgetYear = +e.target.value; render(); };
  $("#bsc", wrap).onchange = e => { const v = e.target.value, old = S.meta.budgetScenario || "à arbitrer"; S.meta.budgetScenario = v; save({ type: "Budget", id: d ? d.id : "", resume: "Scénario budgétaire retenu", action: `Scénario : « ${old} » → « ${v || "à arbitrer"} »` }); render(); };
  $("#bcopy", wrap).onclick = () => copyText(budgetMd(budgetYear), `Budget-${budgetYear}_synthese.md`);
  $("#bcopyd", wrap).onclick = () => copyText(budgetMd(budgetYear, { detail: true }) + "\n" + budgetPluriMd(), `Budget-${budgetYear}_detail.md`);
  $("#bnote", wrap).onclick = () => download(`HEPVD_Note-budgetaire_${todayIso()}.md`, budgetNoteMd(), "text/markdown;charset=utf-8");
  $("#bprint", wrap).onclick = () => window.print();
  return wrap;
}
/* ---------- RACI */
function vRaci() {
  const R = S.roles, A = S.raci.activites, cyc = ["", "R", "A", "C", "I"];
  const wrap = el(`<p class="muted intro">Cliquez une cellule pour faire défiler R → A → C → I → vide. Une seule personne « A » par activité.</p><div class="bar"><span class="grow"></span><button class="btn sm" id="radd">+ Activité</button></div>
    <div class="tw"><table class="raci"><thead><tr><th>Activité</th>${R.map(r => `<th class="rot" scope="col" title="${esc(r.nom)}">${esc(r.code)}${r.personne ? " · " + esc(r.personne) : ""}</th>`).join("")}<th>Contrôle</th></tr></thead><tbody>${A.map((a, i) => { const nA = Object.values(a.valeurs).filter(v => v === "A").length, nR = Object.values(a.valeurs).filter(v => v === "R").length;
      return `<tr class="static"><td><b>${esc(a.activite)}</b> <button class="btn ghost sm rdel" data-i="${i}" aria-label="Supprimer l'activité">✕</button></td>${R.map(r => { const v = a.valeurs[r.code] || ""; return `<td class="c ${v}" data-i="${i}" data-r="${r.code}" tabindex="0" aria-label="${esc(a.activite)} / ${esc(r.nom)} : ${v || "aucun"}">${v}</td>`; }).join("")}<td class="small">${nA === 1 && nR >= 1 ? "✓" : `<span class="red">${nA !== 1 ? nA + " A " : ""}${nR < 1 ? "0 R" : ""}</span>`}</td></tr>`; }).join("")}</tbody></table></div>`);
  $$("td.c", wrap).forEach(td => { const f = () => { const a = A[+td.dataset.i], cur = a.valeurs[td.dataset.r] || "", n = cyc[(cyc.indexOf(cur) + 1) % cyc.length]; if (n) a.valeurs[td.dataset.r] = n; else delete a.valeurs[td.dataset.r]; save({ type: "RACI", id: "", action: `${a.activite} / ${td.dataset.r} : ${cur || "—"} → ${n || "—"}` }); rerender(); }; td.onclick = f; td.onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); f(); } }; });
  $("#radd", wrap).onclick = () => { const t = prompt("Nom de l'activité :"); if (t) { A.push({ activite: t, valeurs: {} }); save({ type: "RACI", id: "", action: "Activité ajoutée : " + t }); rerender(); } };
  $$(".rdel", wrap).forEach(b => b.onclick = () => { if (confirm("Supprimer cette activité ?")) { const a = A.splice(+b.dataset.i, 1)[0]; save({ type: "RACI", id: "", action: "Activité supprimée : " + a.activite }); rerender(); } });
  return wrap;
}
/* ---------- Parties prenantes */
function vParties() {
  const pts = S.parties.map((p, i) => { const jx = ((i * 37) % 9 - 4), jy = ((i * 53) % 9 - 4) * 2; return `<span class="pt" data-p="${p.id}" style="left:calc(${(p.interet - 0.5) / 5 * 100}% + ${jx}px);bottom:calc(${(p.influence - 0.5) / 5 * 100}% + ${jy}px)" title="${esc(p.nom)} — ${esc(p.strategie)}">${esc(p.nom.length > 24 ? p.nom.slice(0, 23) + "…" : p.nom)}</span>`; }).join("");
  const wrap = el(`<div class="card" style="margin-bottom:var(--gap)"><h2>Cartographie influence × intérêt</h2><div class="map"><span class="q" style="left:0;top:0">Satisfaire</span><span class="q" style="right:0;top:0">Gérer étroitement</span><span class="q" style="left:0;bottom:0">Surveiller</span><span class="q" style="right:0;bottom:0">Tenir informés</span>${pts}</div><div class="small muted axes"><span>↑ Influence</span><span>Intérêt →</span></div></div>`);
  wrap.appendChild(genericTable("parties"));
  $$("[data-p]", wrap).forEach(s => s.onclick = () => editItem("parties", S.parties.find(p => p.id === s.dataset.p)));
  return wrap;
}
/* ---------- Agents */
function vAgents() {
  const wrap = el(`<p class="muted intro">Agents IA par phase. Brief obligatoire (<code>_MODELES/Brief-agent-IA.md</code>), relecture humaine et revue critique avant validation. Skills sur mesure : hepvd-contexte-refonte, hepvd-charte, hepvd-rapport-hebdo, hepvd-revue-gate, hepvd-redaction-web.</p>
    <div class="bar"><select id="aph" aria-label="Phase"><option value="">Toutes les phases</option>${S.phases.map(p => `<option value="${p.id}">${p.id} — ${esc(p.nom)}</option>`).join("")}</select><span class="grow"></span><button class="btn sm" id="aadd">+ Agent</button></div><div class="bento" id="ag"></div>`);
  const fill = ph => { $("#ag", wrap).innerHTML = S.agents.filter(a => !ph || (phase(ph).agents || "").split(/,\s*/).includes(a.id)).map(a => `<div class="card c4 agent" data-a="${esc(a.id)}" role="button" tabindex="0"><div class="small muted">${esc(a.id)} · ${esc(a.phases)}</div><h3 style="margin:4px 0">${esc(a.nom)}</h3><p class="small">${esc(a.mission)}</p><p class="small"><b>Livrables :</b> ${esc(a.sorties)}</p><p class="small muted"><b>Skills :</b> ${esc(a.skills)}</p></div>`).join("");
    $$("[data-a]", wrap).forEach(c => { const o = () => editItem("agents", S.agents.find(a => a.id === c.dataset.a)); c.onclick = o; c.onkeydown = e => { if (e.key === "Enter") o(); }; }); };
  fill(""); $("#aph", wrap).onchange = e => fill(e.target.value); $("#aadd", wrap).onclick = () => editItem("agents", null);
  return wrap;
}
/* ---------- Données & paramètres */
function vDonnees() {
  const size = new Blob([JSON.stringify(S)]).size, old = lsGet("hepvd-refonte-web-v1");
  const d = el(`<div class="bento">
   <div class="card c6"><h2>Mode de fonctionnement</h2><p><b>${SERVER ? "Base de données (serveur) — partagée, journalisée, instantanés horaires" : "Local — données dans ce navigateur uniquement"}</b> · ${Math.round(size / 1024)} ko</p>
     ${SERVER ? "" : `<p class="small">Pour une base de données partagée et un historique complet côté serveur : lancez <code>Lancer-la-plateforme.command</code> (Mac) ou <code>node server.js</code>. Voir <code>README-hebergement.md</code>.</p>`}
     <p>Utilisateur : <b>${esc(USER || "—")}</b>${SERVER && AUTH ? " · " + (ROLE_L[ROLE] || ROLE) : ""} <button class="btn sec sm" id="uch">${SERVER && AUTH ? "Mon compte" : "Changer"}</button></p>${SERVER ? `<p class="small muted">Stockage serveur : ${esc(STORAGE)}</p>` : ""}
     <div class="row"><button class="btn" id="dxj">Exporter JSON</button><button class="btn sec" id="dxs">Exporter projet-data.js</button><label class="btn sec">Importer JSON<input type="file" id="dim" accept=".json,application/json" hidden></label></div>
     ${old ? `<p class="small alertcard" style="padding:10px;border-radius:10px;margin-top:12px">Des données de la version 0.1 existent dans ce navigateur. <button class="btn sec sm" id="oldx">Les exporter</button></p>` : ""}</div>
   <div class="card c6"><h2>Paramètres du projet</h2><div class="grid2">
     <div class="full"><label for="mnom">Nom</label><input id="mnom" value="${esc(S.meta.nom)}"></div><div class="full"><label for="mcop">Comité de pilotage</label><input id="mcop" value="${esc(S.meta.copil || "")}"></div>
     <div class="full"><label for="mst">Statut affiché</label><input id="mst" value="${esc(S.meta.statut)}"></div><div><label for="mdb">Début</label><input type="date" id="mdb" value="${esc(S.meta.debut)}"></div><div><label for="mfn">Fin</label><input type="date" id="mfn" value="${esc(S.meta.fin)}"></div>
     <div><label for="mbu">Enveloppe (CHF)</label><input type="number" id="mbu" value="${esc(S.meta.budget || 10000)}"></div></div><p><button class="btn sm" id="msv">Enregistrer</button> <button class="btn danger sm" id="drs">Réinitialiser aux données initiales</button></p></div>
   ${SERVER && AUTH && ROLE === "admin" ? `<div class="card c12" id="usersCard"><div class="hrow"><h2>Utilisateurs</h2><button class="btn sm" id="uAdd">+ Utilisateur</button></div><p class="small muted">Administrateur : tout, y compris les comptes · Éditeur : modifie le projet · Lecteur : consultation seule (ex. membres du Copil).</p><div id="uList" class="small muted">Chargement…</div></div>` : ""}
   <div class="card c12"><h2>Palette de la charte — contrastes WCAG</h2><div class="tw flat"><table><thead><tr><th>Couleur</th><th>HTML</th><th>Texte blanc</th><th>Texte noir</th><th>Usage texte conseillé</th></tr></thead><tbody>${S.contrastes.map(c => `<tr class="static"><td><span class="dot" style="background:${c.hex};border:1px solid #ccc"></span>${esc(c.nom)}</td><td>${esc(c.hex)}</td><td>${c.surBlanc}:1</td><td>${c.surNoir}:1</td><td>${c.surBlanc >= 4.5 ? "Texte blanc" : c.surNoir >= 4.5 ? "Texte noir" : "—"}</td></tr>`).join("")}</tbody></table></div></div></div>`);
  $("#uch", d).onclick = () => askUser(true);
  if ($("#usersCard", d)) {
    const ROLESEL = v => `<select id="uRole">${Object.entries(ROLE_L).map(([k, l]) => `<option value="${k}" ${v === k ? "selected" : ""}>${l}</option>`).join("")}</select>`;
    const loadUsers = async () => { const j = await (await apiFetch("utilisateurs")).json(); $("#uList", d).innerHTML = `<div class="tw flat"><table><thead><tr><th>Identifiant</th><th>Nom</th><th>Rôle</th><th>Statut</th><th>Dernière connexion</th></tr></thead><tbody>${j.utilisateurs.map(u => `<tr data-l="${esc(u.login)}" tabindex="0"><td>${esc(u.login)}</td><td>${esc(u.nom)}</td><td>${ROLE_L[u.role] || u.role}</td><td>${u.actif ? tag("Actif", "st-termine") : tag("Désactivé", "st-bloque")}</td><td class="small">${fdt(u.derniereConnexion)}</td></tr>`).join("")}</tbody></table></div>`;
      $$("tr[data-l]", d).forEach(tr => tr.onclick = () => editUser(j.utilisateurs.find(u => u.login === tr.dataset.l))); };
    const editUser = u => { const isNew = !u; u = u || { login: "", nom: "", role: "editeur", actif: true };
      openModal(isNew ? "Nouvel utilisateur" : "Utilisateur " + u.login, `<div><label for="uLogin">Identifiant (adresse e-mail, ou a-z, 0-9, . _ -)</label><input id="uLogin" value="${esc(u.login)}" ${isNew ? "" : "readonly"} autocapitalize="none"></div><div><label for="uNom">Prénom et nom</label><input id="uNom" value="${esc(u.nom)}"></div><div><label for="uRole">Rôle</label>${ROLESEL(u.role)}</div><div><label for="uPw">${isNew ? "Mot de passe initial" : "Nouveau mot de passe (laisser vide pour ne pas changer)"} — 12 caractères min.</label><input id="uPw" type="password" autocomplete="new-password"></div>${isNew ? "" : `<div class="full"><label class="chk"><input type="checkbox" id="uAct" ${u.actif ? "checked" : ""}> Compte actif</label></div>`}<div class="full"><p class="small muted">Transmettez le mot de passe initial par un canal séparé ; la personne le change ensuite dans « Mon compte ».</p></div>`,
        `<button class="btn sec" id="uC">Annuler</button><button class="btn" id="uS">Enregistrer</button>`, () => {
          $("#uC").onclick = closeModal;
          $("#uS").onclick = async () => { const b = { nom: $("#uNom").value.trim(), role: $("#uRole").value }; if ($("#uPw").value) b.password = $("#uPw").value; if (isNew) b.login = $("#uLogin").value.trim().toLowerCase(); else b.actif = $("#uAct").checked;
            const r = await apiFetch(isNew ? "utilisateurs" : "utilisateurs/" + encodeURIComponent(u.login), { method: isNew ? "POST" : "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(b) }); const j = await r.json().catch(() => ({}));
            if (!r.ok) { toast(j.error || "Erreur"); return; } save({ type: "Utilisateur", id: isNew ? b.login : u.login, action: isNew ? `Compte créé (${ROLE_L[b.role]})` : `Compte modifié (${ROLE_L[b.role]}${b.actif === false ? ", désactivé" : ""}${b.password ? ", mot de passe réinitialisé" : ""})` }); closeModal(); toast("Enregistré"); loadUsers(); };
        }); };
    $("#uAdd", d).onclick = () => editUser(null); loadUsers();
  }
  $("#dxj", d).onclick = () => download(`HEPVD_pilotage_${todayIso()}.json`, JSON.stringify(S, null, 1), "application/json");
  $("#dxs", d).onclick = () => download("projet-data.js", `/* Export du ${fd(todayIso())} */\nwindow.PROJECT_DATA = ${JSON.stringify(S, null, 1)};\n`, "text/javascript");
  if ($("#oldx", d)) $("#oldx", d).onclick = () => download("HEPVD_pilotage_v0.1.json", JSON.stringify(old, null, 1), "application/json");
  $("#dim", d).onchange = e => { const f = e.target.files[0]; if (!f) return; const rd = new FileReader(); rd.onload = () => { try { const j = JSON.parse(rd.result); if (!j.taches || !j.phases) throw 0; if (!confirm("Remplacer toutes les données actuelles par ce fichier ?")) return; S = normalize(j); save({ type: "Données", id: "", action: "Import de " + f.name }); toast("Import réussi"); render(); } catch (x) { alert("Fichier invalide."); } }; rd.readAsText(f); };
  $("#drs", d).onclick = () => { if (confirm("Réinitialiser toutes les données ? Exportez d'abord si nécessaire.")) { const j = S.journal; S = normalize(clone(SEED)); S.journal = j; save({ type: "Données", id: "", action: "Réinitialisation aux données initiales" }); render(); } };
  $("#msv", d).onclick = () => { const b = clone(S.meta); S.meta.nom = $("#mnom", d).value; S.meta.copil = $("#mcop", d).value; S.meta.statut = $("#mst", d).value; S.meta.debut = $("#mdb", d).value; S.meta.fin = $("#mfn", d).value; S.meta.budget = +$("#mbu", d).value; save({ type: "Projet", id: "", action: diffSummary(b, S.meta, [F("nom", "Nom"), F("copil", "Copil"), F("statut", "Statut"), F("debut", "Début"), F("fin", "Fin"), F("budget", "Enveloppe")]) || "Paramètres" }); toast("Paramètres enregistrés"); render(); };
  return d;
}
