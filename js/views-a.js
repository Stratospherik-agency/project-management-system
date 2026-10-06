/* Plateforme — navigation, vue d'ensemble, phases, Gantt, Kanban, jalons */
"use strict";
const VIEWS = [
  { grp: "Pilotage" },
  { id: "overview", t: "Vue d'ensemble", ic: "◎", f: () => vOverview() },
  { id: "phases", t: "Phases & étapes", ic: "▸", f: () => vPhases() },
  { id: "gantt", t: "Planning Gantt", ic: "▤", f: () => vGantt() },
  { id: "kanban", t: "Kanban", ic: "▥", f: () => vKanban() },
  { id: "taches", t: "Tâches (WBS)", ic: "☰", f: () => vTaches(), n: () => S.taches.filter(isLate).length },
  { id: "jalons", t: "Jalons & gates", ic: "◆", f: () => vGates() },
  { grp: "Documents" },
  { id: "documents", t: "Documents", ic: "▣", f: () => vDocuments() },
  { grp: "Risques & anticipation" },
  { id: "anticipation", t: "Anticipation & alertes", ic: "⏱", f: () => vAnticipation(), n: () => alerts().filter(a => a.niv === 3).length },
  { id: "risques", t: "Registre des risques", ic: "⚠", f: () => vRisques(), n: () => S.risques.filter(r => r.statut !== "Clos" && score(r) >= 15).length },
  { id: "actions", t: "Actions", ic: "✓", f: () => vTable("actions", "Actions issues des réunions, risques, revues et questionnements."), n: () => S.actions.filter(a => ["Ouvert", "En cours"].includes(a.statut)).length },
  { grp: "Traçabilité" },
  { id: "questions", t: "Questionnements", ic: "?", f: () => vQuestions(), n: () => S.questions.filter(q => ["Ouverte", "En analyse"].includes(q.statut)).length },
  { id: "decisions", t: "Décisions", ic: "⚖", f: () => vDecisions(), n: () => S.decisions.filter(d => ["À instruire", "Proposée"].includes(d.statut)).length },
  { id: "changements", t: "Changements", ic: "↻", f: () => vTable("changements", "Demandes de changement : délai > 10 jours ouvrés sur un gate, budget > CHF 500, ou périmètre. Décision du Copil.") },
  { id: "historique", t: "Historique", ic: "⌚", f: () => vHistorique() },
  { grp: "Design System" },
  { id: "ds", t: "Design System", ic: "◧", f: () => vDS() },
  { grp: "Organisation" },
  { id: "budget", t: "Budget", ic: "₣", f: () => vBudget() },
  { id: "raci", t: "RACI", ic: "▦", f: () => vRaci() },
  { id: "parties", t: "Parties prenantes", ic: "◉", f: () => vParties() },
  { id: "roles", t: "Équipe & rôles", ic: "☺", f: () => vTable("roles", "Associez les personnes aux rôles : leurs noms apparaissent dans toute la plateforme.") },
  { id: "systemes", t: "Systèmes & API", ic: "⇄", f: () => vTable("systemes", "Inventaire des systèmes connectés. Inventaire complet prévu en P6 (étape ultérieure).") },
  { id: "agents", t: "Agents IA", ic: "✦", f: () => vAgents() },
  { grp: "Rendre compte" },
  { id: "rapports", t: "Rapports", ic: "✎", f: () => vRapports() },
  { id: "donnees", t: "Données & paramètres", ic: "⚙", f: () => vDonnees() },
];
function route() { const h = (location.hash || "#overview").slice(1).split("/"); return { v: h[0], p: decodeURIComponent(h[1] || "") }; }
function nav() {
  const cur = route().v === "phase" ? "phases" : route().v;
  $("#nav").innerHTML = VIEWS.map(v => v.grp ? `<div class="grp">${v.grp}</div>` : `<a href="#${v.id}" ${v.id === cur ? 'aria-current="page"' : ""}><span class="ic" aria-hidden="true">${v.ic}</span>${v.t}${v.n && v.n() ? `<span class="n">${v.n()}</span>` : ""}</a>`).join("");
}
function render() {
  const r = route();
  const v = r.v === "phase" ? { t: "Phase " + r.p, f: () => vPhase(r.p) } : (VIEWS.find(x => x.id === r.v) || VIEWS[1]);
  $("#viewTitle").textContent = v.t === "Phase " + r.p ? `${r.p} — ${phase(r.p).nom}` : v.t;
  $("#projSub").textContent = `${S.meta.nom || ""} · ${S.meta.copil || ""} · ${S.meta.statut || ""}`;
  $("#todayPill").textContent = "Aujourd'hui " + fd(todayIso()) + " · S" + isoWeek(TODAY()).week;
  $("#userPill").textContent = USER ? "👤 " + USER + (SERVER && AUTH ? " · " + (ROLE_L[ROLE] || ROLE) : "") : "👤 Identifiez-vous";
  let rb = $("#roBanner"); if (READONLY() && !rb) { rb = document.createElement("div"); rb.id = "roBanner"; rb.className = "readonly-banner"; rb.textContent = "Accès en lecture seule : vos modifications ne sont pas enregistrées."; $(".top").after(rb); }
  nav();
  const m = $("#main"); const y = window.scrollY; m.innerHTML = ""; const out = v.f(); if (out) { if (typeof out === "string") m.innerHTML = out; else m.appendChild(out); }
  $("#side").classList.remove("open");
  if (render._keep) { window.scrollTo(0, y); render._keep = false; }
}
function rerender() { render._keep = true; render(); }
function vTable(col, intro, opts) { const d = el(intro ? `<p class="muted intro">${esc(intro)}</p>` : ""); d.appendChild(genericTable(col, opts)); return d; }

/* ---------- Vue d'ensemble */
function vOverview() {
  const now = TODAY(), g = globalProgress(), pl = plannedProgress(), F = forecast(), G = gateForecasts(F), A = alerts();
  const curPh = S.phases.filter(p => pd(p.debut) <= now && pd(p.fin) >= now);
  const nextG = G.filter(x => x.j.type === "Gate" && x.j.statut !== "Validé" && pd(x.j.date) >= now)[0];
  const openR = S.risques.filter(r => r.statut !== "Clos"), crit = openR.filter(r => score(r) >= 15);
  const openQ = S.questions.filter(q => ["Ouverte", "En analyse"].includes(q.statut));
  const pendD = S.decisions.filter(d => ["À instruire", "Proposée"].includes(d.statut));
  const dsPub = S.dsVersions.filter(v => v.statut === "Publiée").sort((a, b) => pd(b.date) - pd(a.date))[0], dsNext = S.dsVersions.filter(v => v.statut !== "Publiée" && v.statut !== "Retirée").sort((a, b) => pd(a.date) - pd(b.date))[0];
  const docsEx = S.documents.filter(d => d.statut !== "Prévu").length, livr = S.documents.filter(d => d.livrable), livrV = livr.filter(d => d.statut === "Validé").length;
  const soon = S.taches.filter(t => !isDone(t) && ((pd(t.debut) >= now && pd(t.debut) <= now + 14 * DAY) || (pd(t.fin) >= now && pd(t.fin) <= now + 14 * DAY))).sort((a, b) => pd(a.fin) - pd(b.fin));
  const BC = budgetCalc(S.meta.budgetAnnee || 2027), P = BC.total, E = BC.eng;
  const span = pd(S.meta.fin) - pd(S.meta.debut), elapsed = Math.max(0, Math.min(100, Math.round((now - pd(S.meta.debut)) / span * 100)));
  return `<div class="bento">
  <div class="card dark c3 kpi"><div class="v">${g} %</div><div class="l">Avancement réel (pondéré)<br>Prévu à date : ${pl} %</div></div>
  <div class="card c3 kpi"><div class="v">${nextG ? Math.round((pd(nextG.j.date) - now) / DAY) : "—"}<small> j</small></div><div class="l">${nextG ? `avant <b>${esc(nextG.j.id)}</b> ${esc(nextG.j.nom)} · prévision ${fds(nextG.fc)} · marge ${nextG.marge - nextG.conso} j` : "Aucun gate à venir"}</div></div>
  <div class="card c3 kpi"><div class="v ${A.filter(a => a.niv === 3).length ? "red" : ""}">${A.filter(a => a.niv === 3).length}<small> / ${A.length}</small></div><div class="l">alertes / signaux · <a href="#anticipation">anticipation</a></div></div>
  <div class="card c3 kpi"><div class="v ${crit.length ? "red" : ""}">${crit.length}<small> / ${openR.length}</small></div><div class="l">risques critiques / ouverts · <a href="#risques">registre</a></div></div>

  <div class="card c7"><h2>Phases</h2><div class="small muted" style="margin-bottom:6px">Temps écoulé : ${elapsed} % · ${fd(S.meta.debut)} → ${fd(S.meta.fin)} · cliquez une phase pour son tableau de bord</div>
    ${S.phases.map(p => { const pr = phaseProgress(p.id), gf = G.find(x => x.j.phase === p.id && x.j.type === "Gate"); const st = gf ? (gf.pct >= 100 ? "red" : gf.pct >= 50 ? "orange" : "green") : "";
      return `<a class="phase-row" href="#phase/${p.id}"><b>${p.id}</b><span>${curPh.includes(p) ? "▸ " : ""}${esc(p.nom)}<br><span class="small muted">${fds(p.debut)} → ${fds(p.fin)}${gf ? ` · ${gf.j.id} prévu ${fds(gf.fc)}` : ""}</span></span><div class="prog"><i style="width:${pr}%;background:${p.couleur}"></i></div><span class="small">${pr} %</span><span class="light ${st}" title="${gf ? "Marge consommée : " + gf.pct + " %" : ""}"></span></a>`; }).join("")}
  </div>
  <div class="c5 stack">
    <div class="card blue"><h2>En ce moment</h2>${curPh.map(p => `<p style="margin:0 0 8px"><a href="#phase/${p.id}"><b>${p.id} — ${esc(p.nom)}</b></a><br><span class="small">${esc(p.objectif || "")}</span></p>`).join("") || '<p class="empty">Aucune phase active</p>'}</div>
    <div class="card"><h2>Alertes prioritaires</h2>${A.slice(0, 6).map(a => `<div class="li">${nivTag(a.niv)}<span class="small">${esc(a.txt)}</span><span class="ml">${refLink(a.ref)}</span></div>`).join("") || '<p class="empty">Aucune alerte</p>'}<p style="margin:8px 0 0"><a class="btn sm sec" href="#anticipation">Toutes les alertes</a></p></div>
  </div>

  <div class="card c6"><h2>À échéance dans 14 jours</h2>${soon.slice(0, 8).map(t => `<div class="li"><span class="d">${fds(t.fin)}</span><span>${esc(t.nom)}<br><span class="small muted">${taskChip(t.id)} ${t.phase} · ${esc(roleShort(t.responsable))} ${docsOfTask(t.id).map(docChip).join(" ")}</span></span><span class="ml">${tag(t.statut)}</span></div>`).join("") || '<p class="empty">Rien sur 14 jours</p>'}</div>
  <div class="card c6"><h2>Jalons : baseline → prévision</h2><div class="tw flat"><table><thead><tr><th>Jalon</th><th>Baseline</th><th>Prévision</th><th>Écart</th></tr></thead><tbody>${G.filter(x => pd(x.j.date) >= now).slice(0, 6).map(x => `<tr class="static"><td><b>${esc(x.j.id)}</b> ${esc(x.j.nom)}</td><td>${fds(x.bl || x.j.date)}</td><td>${fds(x.fc)}</td><td>${x.derive > 0 ? `<span class="red">+${x.derive} j</span>` : "✓"}</td></tr>`).join("")}</tbody></table></div></div>

  <div class="card c3 kpi"><h3>Questionnements</h3><div class="v">${openQ.length}</div><div class="l">ouverts · <a href="#questions">registre</a></div></div>
  <div class="card c3 kpi"><h3>Décisions</h3><div class="v">${pendD.length}</div><div class="l">à instruire ou proposées · <a href="#decisions">registre</a></div></div>
  <div class="card c3 kpi"><h3>Design System</h3><div class="v">v${esc(dsPub ? dsPub.version : "—")}</div><div class="l">publiée · prochaine v${esc(dsNext ? dsNext.version : "—")} le ${dsNext ? fds(dsNext.date) : "—"} · <a href="#ds">suivre</a></div></div>
  <div class="card c3 kpi"><h3>Documents</h3><div class="v">${docsEx}</div><div class="l">existants · livrables validés ${livrV}/${livr.length} · <a href="#documents">rechercher</a></div></div>
  <div class="card c6"><h2>Risques principaux</h2>${openR.sort((a, b) => score(b) - score(a)).slice(0, 5).map(r => `<div class="li">${sevTag(score(r))}<span><a href="#" data-risk="${r.id}">${esc(r.titre)}</a><br><span class="small muted">${r.id} · ${esc(roleShort(r.proprietaire))} · signal : ${esc(r.declencheur || "—")}</span></span></div>`).join("")}</div>
  <div class="card c6"><h2>Budget ${BC.annee} (CHF ${chf(P)})</h2><p class="small">Scénario ${S.meta.budgetScenario ? "retenu : <b>" + esc(S.meta.budgetScenario) + "</b>" : "de référence : <b>" + esc(BC.ref) + "</b> (à arbitrer)"}${BC.env ? ` · enveloppe CHF ${chf(BC.env)}${P > BC.env ? ` · <span class="red">dépassement CHF ${chf(P - BC.env)}</span>` : ""}` : ""}</p><div class="prog big"><i style="width:${P ? Math.min(100, E / P * 100) : 0}%"></i></div><p class="small">Engagé : CHF ${chf(E)} (${P ? Math.round(E / P * 100) : 0} %)</p>${BC.cats.map(c => `<div class="li small"><span>${esc(c)}</span><span class="ml">${chf(BC.sc[BC.ref].by[c])}</span></div>`).join("")}<p style="margin-top:12px"><a class="btn sec sm" href="#budget">Détail et scénarios</a></p></div>
  </div>`;
}

/* ---------- Phases */
function vPhases() {
  const F = forecast(), G = gateForecasts(F);
  return `<p class="muted intro">Chaque phase a son tableau de bord : étapes, documents liés à chaque étape, livrables, critères du gate, risques, décisions et questions.</p><div class="bento">${S.phases.map(p => {
    const pr = phaseProgress(p.id), ts = S.taches.filter(t => t.phase === p.id), dc = S.documents.filter(d => d.phase === p.id), gf = G.find(x => x.j.phase === p.id && x.j.type === "Gate");
    return `<a class="card c4 phasecard" href="#phase/${p.id}" style="border-top:6px solid ${p.couleur}"><div class="small muted">${p.id} · ${fds(p.debut)} → ${fds(p.fin)}</div><h3 style="margin:4px 0 8px">${esc(p.nom)}</h3><div class="prog"><i style="width:${pr}%;background:${p.couleur}"></i></div>
      <div class="small" style="margin-top:8px">${pr} % · ${ts.length} étapes · ${dc.length} documents${gf ? ` · ${gf.j.id} prévu ${fds(gf.fc)}` : ""}</div></a>`; }).join("")}</div>`;
}
function vPhase(pid) {
  const p = S.phases.find(x => x.id === pid); if (!p) return "<p>Phase inconnue.</p>";
  const F = forecast(), FL = floats(), G = gateForecasts(F), gf = G.find(x => x.j.phase === pid && x.j.type === "Gate"), ts = S.taches.filter(t => t.phase === pid).sort((a, b) => pd(a.debut) - pd(b.debut));
  const docs = S.documents.filter(d => d.phase === pid), livr = docs.filter(d => d.livrable);
  const rk = S.risques.filter(r => r.phase === pid || ts.some(t => String(r.titre + r.mitigation).includes(t.id)));
  const dec = S.decisions.filter(d => d.phase === pid), qs = S.questions.filter(q => q.phase === pid);
  const i = S.phases.indexOf(p), prev = S.phases[i - 1], next = S.phases[i + 1];
  const wrap = el(`<div class="bar">${prev ? `<a class="btn sec sm" href="#phase/${prev.id}">← ${prev.id}</a>` : ""}<a class="btn sec sm" href="#phases">Toutes les phases</a>${next ? `<a class="btn sec sm" href="#phase/${next.id}">${next.id} →</a>` : ""}<span class="grow"></span><button class="btn sec sm" id="pEdit">Modifier la phase</button><button class="btn sm" id="pAdd">+ Étape</button></div>
  <div class="bento">
    <div class="card c8" style="border-top:6px solid ${p.couleur}"><div class="small muted">${fd(p.debut)} → ${fd(p.fin)} · dossier <code>${esc(p.dossier)}</code></div><h2 style="margin:6px 0">${esc(p.nom)}</h2><p>${esc(p.objectif)}</p>
      <p class="small"><b>Entrées :</b> ${esc(p.entrees || "—")}</p><p class="small"><b>Vérifications :</b> ${esc(p.verifs || "—")}</p><p class="small"><b>Agents :</b> ${esc(p.agents || "—")}</p></div>
    <div class="card c4 ${gf && gf.pct >= 100 ? "alertcard" : ""}"><div class="kpi"><div class="v">${phaseProgress(pid)} %</div><div class="l">réel · prévu à date ${plannedPct(ts)} %</div></div>
      ${gf ? `<p class="small" style="margin-top:12px"><b>${gf.j.id}</b> ${esc(gf.j.nom)} — ${fd(gf.j.date)}<br>Baseline : ${fd(gf.bl || gf.j.date)} · prévision : <b>${fd(gf.fc)}</b><br>Marge de phase : ${gf.marge} j · consommée : ${gf.conso} j (${gf.pct} %)</p><div class="prog"><i style="width:${Math.min(100, gf.pct)}%;background:${gf.pct >= 100 ? "var(--alerte)" : gf.pct >= 50 ? "#c77700" : "var(--ok)"}"></i></div>` : '<p class="small muted">Pas de gate formel.</p>'}</div>
    <div class="card c12"><h2>Étapes et documents liés</h2><div class="tw flat"><table><thead><tr><th>ID</th><th>Étape</th><th>Dates</th><th>Prévision</th><th>Marge</th><th>Resp.</th><th>Statut</th><th>Documents</th></tr></thead><tbody>
      ${ts.map(t => { const f = F[t.id], fl = FL[t.id]; return `<tr data-t="${t.id}" tabindex="0"><td>${t.id}</td><td>${isLate(t) ? "⚠ " : ""}${esc(t.nom)}<div class="prog" style="width:120px;margin-top:4px"><i style="width:${isDone(t) ? 100 : t.avancement || 0}%"></i></div></td><td class="nowrap small">${fds(t.debut)} → ${fds(t.fin)}</td><td class="nowrap small ${f && f.slip > 0 ? "red" : ""}">${f ? fds(iso(f.ff)) + (f.slip > 0 ? ` (+${f.slip} j)` : "") : "—"}</td><td class="small ${fl <= 5 ? "red" : ""}">${fl} j${fl <= 5 ? " ●" : ""}</td><td>${esc(roleShort(t.responsable))}</td><td>${tag(t.statut)}</td><td>${docsOfTask(t.id).map(docChip).join(" ") || '<span class="muted small">—</span>'} <button class="btn ghost sm addDoc" data-t="${t.id}" title="Lier ou créer un document">＋</button></td></tr>`; }).join("")}
    </tbody></table></div><p class="small muted">● marge ≤ 5 j avant le gate (chemin critique de la phase). La prévision propage les retards par les dépendances.</p></div>
    <div class="card c6"><h2>Livrables (${livr.filter(d => d.statut === "Validé").length}/${livr.length} validés)</h2>${livr.map(d => `<div class="li">${docChip(d)}<span>${esc(d.titre)}<br><span class="small muted">${esc(d.chemin)}</span></span><span class="ml">${tag(d.statut)}</span></div>`).join("") || '<p class="empty">—</p>'}
      <h3 style="margin-top:14px">Autres documents de la phase</h3>${docs.filter(d => !d.livrable).map(d => `<div class="li">${docChip(d)}<span>${esc(d.titre)}</span><span class="ml">${tag(d.statut)}</span></div>`).join("") || '<p class="empty">—</p>'}</div>
    <div class="c6 stack">
      ${gf ? `<div class="card"><h2>Critères du gate ${gf.j.id}</h2>${gf.j.criteres.map((c, k) => `<label class="chk"><input type="checkbox" data-j="${gf.j.id}" data-i="${k}" ${c.ok ? "checked" : ""}> ${esc(c.t)}</label>`).join("")}</div>` : ""}
      <div class="card"><h2>Risques liés</h2>${rk.map(r => `<div class="li">${sevTag(score(r))}<a href="#" data-risk="${r.id}">${esc(r.titre)}</a></div>`).join("") || '<p class="empty small">Aucun risque rattaché à cette phase (champ « Phase » du risque).</p>'}</div>
      <div class="card"><h2>Décisions & questionnements</h2>${dec.map(d => `<div class="li">${refChips(d.id)}<span>${esc(d.titre)}</span><span class="ml">${tag(d.statut)}</span></div>`).join("")}${qs.map(q => `<div class="li">${refChips(q.id)}<span class="small">${esc(q.question)}</span><span class="ml">${tag(q.statut)}</span></div>`).join("")}${!dec.length && !qs.length ? '<p class="empty">—</p>' : ""}
        <p style="margin:8px 0 0"><button class="btn sec sm" id="pQ">+ Question</button> <button class="btn sec sm" id="pD">+ Décision</button></p></div>
    </div></div>`);
  $$("tr[data-t]", wrap).forEach(tr => { tr.onclick = e => { if (e.target.closest("a,button")) return; editItem("taches", task(tr.dataset.t)); }; tr.onkeydown = e => { if (e.key === "Enter") editItem("taches", task(tr.dataset.t)); }; });
  $$(".addDoc", wrap).forEach(b => b.onclick = () => linkDocToTask(b.dataset.t));
  $$("input[data-j]", wrap).forEach(cb => cb.onchange = () => { const j = S.jalons.find(x => x.id === cb.dataset.j); j.criteres[+cb.dataset.i].ok = cb.checked; save({ type: "Jalon", id: j.id, action: (cb.checked ? "Critère rempli : " : "Critère décoché : ") + j.criteres[+cb.dataset.i].t }); rerender(); });
  $("#pEdit", wrap).onclick = () => editItem("phases", p);
  $("#pAdd", wrap).onclick = () => editItem("taches", null, null, { phase: pid, statut: "À faire", avancement: 0, debut: p.debut, fin: p.fin });
  $("#pQ", wrap).onclick = () => editItem("questions", null, null, { phase: pid });
  $("#pD", wrap).onclick = () => editItem("decisions", null, null, { phase: pid, statut: "À instruire" });
  return wrap;
}
function linkDocToTask(tid) {
  const t = task(tid), opts = S.documents.filter(d => !d.taches.includes(tid)).sort((a, b) => a.id.localeCompare(b.id));
  openModal(`Documents de ${tid}`, `<div class="full"><p class="small muted" style="margin-top:0">${esc(t.nom)}</p><label for="ldSel">Lier un document existant</label><select id="ldSel"><option value="">—</option>${opts.map(d => `<option value="${d.id}">${d.id} — ${esc(d.titre)} (${d.phase})</option>`).join("")}</select></div>
    <div class="full"><p class="small">Liés : ${docsOfTask(tid).map(docChip).join(" ") || "aucun"}</p></div>`,
    `<button class="btn sec l" id="ldNew">Nouveau document pour cette étape</button><button class="btn sec" id="ldC">Fermer</button><button class="btn" id="ldOk">Lier</button>`, () => {
      $("#ldC").onclick = closeModal;
      $("#ldOk").onclick = () => { const d = S.documents.find(x => x.id === $("#ldSel").value); if (!d) return; d.taches.push(tid); save({ type: "Document", id: d.id, action: "Lié à l'étape " + tid, resume: d.titre }); closeModal(); rerender(); };
      $("#ldNew").onclick = () => { closeModal(); openDoc(null, { phase: t.phase, taches: [tid] }); };
    });
}

/* ---------- Gantt */
function vGantt() {
  const ui = S.ui, Z = { semaine: 16, mois: 4, trimestre: 1.4 }, px = Z[ui.zoom] || 4;
  const F = forecast(), FL = floats(), bl = currentBaseline();
  const wrap = document.createElement("div");
  const phs = S.phases.filter(p => !ui.ganttPhase || p.id === ui.ganttPhase);
  const allDates = [S.meta.debut, S.meta.fin].concat(S.taches.flatMap(t => [t.debut, t.fin]), S.jalons.map(j => j.date)).filter(Boolean).map(pd);
  const start = mondayOf(Math.min(...allDates)) - 7 * DAY, end = Math.max(...allDates, ...Object.values(F).map(f => f.ff)) + 21 * DAY;
  const W = Math.round((end - start) / DAY * px), RH = 30, HH = 48, X = t => Math.round((t - start) / DAY * px);
  const rows = [];
  phs.forEach(p => { rows.push({ k: "ph", p }); if (!ui.collapsed[p.id]) { S.taches.filter(t => t.phase === p.id).sort((a, b) => pd(a.debut) - pd(b.debut)).forEach(t => rows.push({ k: "t", t, p })); S.jalons.filter(j => j.phase === p.id).forEach(j => rows.push({ k: "m", j, p })); } });
  const H = HH + rows.length * RH;
  let svg = `<svg width="${W}" height="${H}" role="img" aria-label="Diagramme de Gantt" xmlns="http://www.w3.org/2000/svg" font-family="Arial, sans-serif" font-size="11"><rect x="0" y="0" width="${W}" height="${HH}" fill="#f6fafd"/>`;
  const d0 = new Date(start);
  for (let y = d0.getUTCFullYear(), m = d0.getUTCMonth(); ; m++) {
    if (m > 11) { m = 0; y++; } const t = Date.UTC(y, m, 1); if (t > end) break;
    const x = X(Math.max(t, start)), x2 = X(Math.min(Date.UTC(y, m + 1, 1), end));
    svg += `<line x1="${X(t)}" y1="0" x2="${X(t)}" y2="${H}" stroke="#dbe6ee"/>`;
    if (ui.zoom === "trimestre") { if (m % 3 === 0 && X(Date.UTC(y, m + 3, 1)) - x > 50) svg += `<text x="${x + 4}" y="18" fill="#3d5563" font-weight="bold">T${m / 3 + 1} ${y}</text>`; if (x2 - x > 14) svg += `<text x="${x + 3}" y="38" fill="#3d5563">${MOIS[m].slice(0, 1).toUpperCase()}</text>`; }
    else if (x2 - x > 60) svg += `<text x="${x + 4}" y="18" fill="#3d5563" font-weight="bold">${MOIS[m]} ${y}</text>`;
  }
  if (ui.zoom !== "trimestre") for (let t = mondayOf(start); t < end; t += 7 * DAY) {
    if (ui.zoom === "semaine") { svg += `<rect x="${X(t + 5 * DAY)}" y="${HH}" width="${2 * px}" height="${H - HH}" fill="#f3f6f8"/><line x1="${X(t)}" y1="${HH - 18}" x2="${X(t)}" y2="${H}" stroke="#eaf0f4"/>`; }
    if (ui.zoom === "semaine" || isoWeek(t).week % 2 === 1) svg += `<text x="${X(t) + 2}" y="38" fill="#6b8291" font-size="10">S${isoWeek(t).week}</text>`;
  }
  svg += `<line x1="0" y1="${HH}" x2="${W}" y2="${HH}" stroke="#d5e3ee"/>`;
  const pos = {};
  rows.forEach((r, i) => {
    const y = HH + i * RH;
    if (r.k === "ph") svg += `<rect x="0" y="${y}" width="${W}" height="${RH}" fill="#f6fafd"/>`;
    svg += `<line x1="0" y1="${y + RH}" x2="${W}" y2="${y + RH}" stroke="#eef3f7"/>`;
    if (r.k === "ph") { const a = X(pd(r.p.debut)), b = X(pd(r.p.fin) + DAY), pr = phaseProgress(r.p.id); svg += `<rect x="${a}" y="${y + 10}" width="${b - a}" height="10" rx="5" fill="${r.p.couleur}" opacity=".35"/><rect x="${a}" y="${y + 10}" width="${(b - a) * pr / 100}" height="10" rx="5" fill="${r.p.couleur}"/><text x="${b + 6}" y="${y + 19}" fill="#0b1f2a" font-weight="bold">${r.p.id} · ${pr} %</text>`; }
    else if (r.k === "t") {
      const t = r.t, a = X(pd(t.debut)), b = X(pd(t.fin) + DAY), w = Math.max(4, b - a), pc = isDone(t) ? 100 : (t.avancement || 0), late = isLate(t), fill = t.statut === "Bloqué" ? "#ef9286" : r.p.couleur, f = F[t.id], crit = ui.showCrit && FL[t.id] <= 5 && !isDone(t);
      pos[t.id] = { a, b: a + w, y: y + RH / 2 };
      if (ui.showBaseline && bl && bl.taches[t.id]) { const [ba, bb] = bl.taches[t.id]; svg += `<rect x="${X(pd(ba))}" y="${y + RH - 7}" width="${Math.max(3, X(pd(bb) + DAY) - X(pd(ba)))}" height="4" rx="2" fill="#6b8291" opacity=".55"><title>Baseline ${esc(bl.id)} : ${fd(ba)} → ${fd(bb)}</title></rect>`; }
      if (ui.showForecast && f && f.slip > 0) svg += `<rect x="${X(f.fs)}" y="${y + 6}" width="${Math.max(3, X(f.ff + DAY) - X(f.fs))}" height="${RH - 14}" rx="6" fill="none" stroke="#b3261e" stroke-dasharray="3 2"><title>Prévision : ${fd(iso(f.fs))} → ${fd(iso(f.ff))} (+${f.slip} j)</title></rect>`;
      svg += `<g class="g-bar" data-id="${t.id}"><title>${esc(t.id + " · " + t.nom + " · " + fd(t.debut) + " → " + fd(t.fin) + " · " + t.statut + " " + pc + " % · marge " + FL[t.id] + " j")}</title>
        <rect x="${a}" y="${y + 6}" width="${w}" height="${RH - 14}" rx="6" fill="${fill}" opacity=".35" ${late ? 'stroke="#b3261e" stroke-width="2"' : crit ? 'stroke="#00354c" stroke-width="2"' : ""}/>
        <rect x="${a}" y="${y + 6}" width="${w * pc / 100}" height="${RH - 14}" rx="6" fill="${fill}"/><rect class="rz" x="${a + w - 6}" y="${y + 6}" width="6" height="${RH - 14}" fill="transparent" style="cursor:ew-resize"/></g>`;
      svg += `<text x="${Math.max(a + w, f && ui.showForecast ? X(f.ff + DAY) : 0) + 6}" y="${y + 18}" fill="#3d5563" pointer-events="none">${esc(roleShort(t.responsable))}${pc ? " · " + pc + " %" : ""}${docsOfTask(t.id).length ? " · 📄" + docsOfTask(t.id).length : ""}</text>`;
    } else { const x = X(pd(r.j.date) + DAY / 2), ok = r.j.statut === "Validé"; svg += `<g class="g-ms" style="cursor:pointer"><title>${esc(r.j.id + " · " + r.j.nom + " · " + fd(r.j.date))}</title><path d="M${x} ${y + 5} L${x + 10} ${y + 15} L${x} ${y + 25} L${x - 10} ${y + 15} Z" fill="${ok ? "#1d6b4f" : "#00354c"}"/></g><text x="${x + 14}" y="${y + 19}" fill="#00354c" font-weight="bold">${esc(r.j.id)} · ${fds(r.j.date)}</text>`;
      if (ui.showBaseline && bl && bl.jalons[r.j.id] && bl.jalons[r.j.id] !== r.j.date) { const bx = X(pd(bl.jalons[r.j.id]) + DAY / 2); svg += `<path d="M${bx} ${y + 9} L${bx + 6} ${y + 15} L${bx} ${y + 21} L${bx - 6} ${y + 15} Z" fill="none" stroke="#6b8291"><title>Baseline : ${fd(bl.jalons[r.j.id])}</title></path>`; } }
  });
  if (ui.showDeps) rows.filter(r => r.k === "t").forEach(r => depsOf(r.t).forEach(dep => { const A = pos[dep], B = pos[r.t.id]; if (!A || !B) return; const mx = Math.max(A.b + 6, B.a - 8), bad = B.a < A.b; svg += `<path d="M${A.b} ${A.y} H${mx} V${B.y} H${B.a - 2}" fill="none" stroke="${bad ? "#b3261e" : "#6891a8"}" stroke-width="${bad ? 1.8 : 1.2}" ${bad ? 'stroke-dasharray="4 3"' : ""} marker-end="url(#${bad ? "arrb" : "arr"})"><title>${bad ? "Conflit : " + r.t.id + " commence avant la fin de " + dep : dep + " → " + r.t.id}</title></path>`; }));
  svg += `<defs><marker id="arr" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="#6891a8"/></marker><marker id="arrb" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="#b3261e"/></marker></defs>`;
  const tx = X(TODAY() + DAY / 2); svg += `<line x1="${tx}" y1="${HH}" x2="${tx}" y2="${H}" stroke="#b3261e" stroke-width="2"/><path d="M${tx - 6} ${HH - 8} L${tx + 6} ${HH - 8} L${tx} ${HH} Z" fill="#b3261e"/></svg>`;
  wrap.innerHTML = `<div class="bar">
    <div class="seg" role="group" aria-label="Échelle">${["semaine", "mois", "trimestre"].map(z => `<button data-z="${z}" aria-pressed="${ui.zoom === z}">${z[0].toUpperCase() + z.slice(1)}</button>`).join("")}</div>
    <select id="gph" aria-label="Phase"><option value="">Toutes les phases</option>${S.phases.map(p => `<option value="${p.id}" ${ui.ganttPhase === p.id ? "selected" : ""}>${p.id} — ${esc(p.nom)}</option>`).join("")}</select>
    <label class="chk"><input type="checkbox" data-o="showDeps" ${ui.showDeps ? "checked" : ""}> Dépendances</label>
    <label class="chk"><input type="checkbox" data-o="showBaseline" ${ui.showBaseline ? "checked" : ""}> Baseline ${bl ? esc(bl.id) : ""}</label>
    <label class="chk"><input type="checkbox" data-o="showForecast" ${ui.showForecast ? "checked" : ""}> Prévision</label>
    <label class="chk"><input type="checkbox" data-o="showCrit" ${ui.showCrit ? "checked" : ""}> Chemin critique</label>
    <span class="grow"></span><button class="btn sec sm" id="gexp">Déplier</button><button class="btn sec sm" id="gcol">Replier</button><button class="btn sec sm" id="gtoday">Aujourd'hui</button><button class="btn sm" id="gadd">+ Tâche</button></div>
    <div class="gantt"><div class="g-left"><div class="g-h">Phase / étape</div>${rows.map(r => r.k === "ph" ? `<div class="g-row ph" data-ph="${r.p.id}" role="button" tabindex="0" aria-expanded="${!ui.collapsed[r.p.id]}"><span aria-hidden="true">${ui.collapsed[r.p.id] ? "▸" : "▾"}</span><span class="dot" style="background:${r.p.couleur}"></span><span class="lbl">${r.p.id} — ${esc(r.p.nom)}</span></div>`
      : r.k === "t" ? `<div class="g-row task" data-id="${r.t.id}" role="button" tabindex="0" title="${esc(r.t.nom)}"><span class="lbl">${isLate(r.t) ? "⚠ " : ""}${esc(r.t.nom)}</span></div>` : `<div class="g-row ms">◆ <span class="lbl">${esc(r.j.id)} — ${esc(r.j.nom)}</span></div>`).join("")}</div>
    <div class="g-right" id="gr">${svg}</div></div>
    <div class="g-legend"><span>Glisser une barre pour la déplacer · tirer son bord droit pour la fin · cliquer pour modifier</span><span><i class="lg" style="background:#6b8291;height:4px"></i>baseline</span><span><i class="lg" style="border:1px dashed #b3261e"></i>prévision en retard</span><span><i class="lg" style="border:2px solid #00354c"></i>critique (marge ≤ 5 j)</span><span style="color:#b3261e">┃ aujourd'hui · ⇢ dépendance non respectée</span></div>`;
  $$(".seg button", wrap).forEach(b => b.onclick = () => { ui.zoom = b.dataset.z; save(); render(); scrollToday(); });
  $("#gph", wrap).onchange = e => { ui.ganttPhase = e.target.value; save(); render(); };
  $$("input[data-o]", wrap).forEach(c => c.onchange = () => { ui[c.dataset.o] = c.checked; save(); const sl = $("#gr").scrollLeft; rerender(); $("#gr").scrollLeft = sl; });
  $("#gexp", wrap).onclick = () => { ui.collapsed = {}; save(); render(); };
  $("#gcol", wrap).onclick = () => { S.phases.forEach(p => ui.collapsed[p.id] = true); save(); render(); };
  $("#gtoday", wrap).onclick = scrollToday; $("#gadd", wrap).onclick = () => editItem("taches", null);
  $$(".g-row.ph", wrap).forEach(r => { const tg = () => { ui.collapsed[r.dataset.ph] = !ui.collapsed[r.dataset.ph]; save(); const sl = $("#gr").scrollLeft; rerender(); $("#gr").scrollLeft = sl; }; r.onclick = tg; r.onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); tg(); } }; });
  $$(".g-row.task", wrap).forEach(r => { const o = () => editItem("taches", task(r.dataset.id)); r.onclick = o; r.onkeydown = e => { if (e.key === "Enter") o(); }; });
  $$(".g-ms", wrap).forEach(g => g.onclick = () => { location.hash = "#jalons"; });
  $$(".g-bar", wrap).forEach(g => g.addEventListener("pointerdown", e => {
    const t = task(g.dataset.id), mode = e.target.classList.contains("rz") ? "rz" : "mv", x0 = e.clientX, d0 = t.debut, f0 = t.fin; let moved = 0; g.setPointerCapture(e.pointerId);
    const mv = ev => { const dd = Math.round((ev.clientX - x0) / px); if (Math.abs(ev.clientX - x0) > 3) moved = 1; if (mode === "mv") g.setAttribute("transform", `translate(${dd * px},0)`); else { const r = g.querySelectorAll("rect"); r[0].setAttribute("width", Math.max(px, (days(d0, f0) + 1) * px + dd * px)); } };
    const up = ev => { g.removeEventListener("pointermove", mv); g.removeEventListener("pointerup", up); const dd = Math.round((ev.clientX - x0) / px);
      if (!moved) { editItem("taches", t); return; }
      if (dd) { if (mode === "mv") { t.debut = addDays(d0, dd); t.fin = addDays(f0, dd); } else { const nf = addDays(f0, dd); if (pd(nf) >= pd(t.debut)) t.fin = nf; } save({ type: "Tâche", id: t.id, action: `Dates : ${fd(d0)} – ${fd(f0)} → ${fd(t.debut)} – ${fd(t.fin)}`, resume: t.nom }); toast(`${t.id} : ${fd(t.debut)} → ${fd(t.fin)}`); }
      const sl = $("#gr").scrollLeft; rerender(); $("#gr").scrollLeft = sl; };
    g.addEventListener("pointermove", mv); g.addEventListener("pointerup", up);
  }));
  function scrollToday() { const gr = $("#gr"); if (gr) gr.scrollLeft = Math.max(0, tx - 160); }
  setTimeout(() => { if (!vGantt._s) { scrollToday(); vGantt._s = 1; } }, 0);
  return wrap;
}

/* ---------- Kanban */
const kst = { phase: "", resp: "" };
function vKanban() {
  const ts = S.taches.filter(t => (!kst.phase || t.phase === kst.phase) && (!kst.resp || t.responsable === kst.resp));
  const wrap = el(`<div class="bar"><select id="kp" aria-label="Phase"><option value="">Toutes les phases</option>${S.phases.map(p => `<option value="${p.id}" ${kst.phase === p.id ? "selected" : ""}>${p.id} — ${esc(p.nom)}</option>`).join("")}</select>
    <select id="kr" aria-label="Responsable"><option value="">Tous les responsables</option>${S.roles.map(r => `<option value="${r.code}" ${kst.resp === r.code ? "selected" : ""}>${esc(r.code)} — ${esc(r.personne || r.nom)}</option>`).join("")}</select>
    <span class="grow"></span><span class="small muted">Glisser-déposer une carte pour changer son statut</span><button class="btn sm" id="kadd">+ Tâche</button></div>
    <div class="kanban">${STATUTS.map(s => { const c = ts.filter(t => t.statut === s).sort((a, b) => pd(a.fin) - pd(b.fin)); return `<section class="kcol" data-s="${s}" aria-label="${s}"><h3>${tag(s)}<span class="muted">${c.length}</span></h3>${c.slice(0, s === "À faire" ? 40 : 200).map(t => { const p = phase(t.phase); return `<article class="kcard ${isLate(t) ? "late" : ""}" draggable="true" data-id="${t.id}" tabindex="0" style="border-left:5px solid ${p.couleur}"><div class="ph">${t.id} · ${p.id} ${esc(p.nom)}</div><div class="t">${esc(t.nom)}</div><div class="prog" style="margin-bottom:6px"><i style="width:${isDone(t) ? 100 : t.avancement || 0}%"></i></div><div class="m"><span>${esc(roleShort(t.responsable))}${docsOfTask(t.id).length ? " · 📄" + docsOfTask(t.id).length : ""}</span><span class="due">${isLate(t) ? "⚠ " : ""}${fds(t.fin)}</span></div></article>`; }).join("")}${s === "À faire" && c.length > 40 ? `<p class="small muted">+ ${c.length - 40} autres (filtrez par phase)</p>` : ""}</section>`; }).join("")}</div>`);
  $("#kp", wrap).onchange = e => { kst.phase = e.target.value; render(); };
  $("#kr", wrap).onchange = e => { kst.resp = e.target.value; render(); };
  $("#kadd", wrap).onclick = () => editItem("taches", null);
  $$(".kcard", wrap).forEach(c => { c.ondragstart = e => e.dataTransfer.setData("text/plain", c.dataset.id); c.onclick = () => editItem("taches", task(c.dataset.id)); c.onkeydown = e => { if (e.key === "Enter") c.onclick(); }; });
  $$(".kcol", wrap).forEach(col => { col.ondragover = e => { e.preventDefault(); col.classList.add("over"); }; col.ondragleave = () => col.classList.remove("over");
    col.ondrop = e => { e.preventDefault(); const t = task(e.dataTransfer.getData("text/plain")); if (!t) return; const old = t.statut; t.statut = col.dataset.s; if (isDone(t)) { t.avancement = 100; t.termineLe = todayIso(); } else { t.termineLe = ""; if (t.statut === "En cours" && !t.avancement) t.avancement = 5; } save({ type: "Tâche", id: t.id, action: `Statut : ${old} → ${t.statut}`, resume: t.nom }); rerender(); }; });
  return wrap;
}

/* ---------- Tâches */
function vTaches() {
  return vTable("taches", "Toutes les étapes du projet. Cliquez une ligne pour la modifier et gérer ses documents liés.", { extraCol: { l: "Documents", f: t => docsOfTask(t.id).map(docChip).join(" ") } });
}
HOOKS.taches = {
  extra: (o, isNew) => isNew ? "" : `<div class="full linked"><label>Documents liés à cette étape</label><div>${docsOfTask(o.id).map(d => `${docChip(d)} <span class="small">${esc(d.titre)}</span> ${tag(d.statut)}`).join("<br>") || '<span class="muted small">Aucun</span>'}</div><button type="button" class="btn sec sm" id="tLink" style="margin-top:6px">Lier / créer un document</button></div>`,
  mount: (o, isNew) => { if (!isNew && $("#tLink")) $("#tLink").onclick = () => { closeModal(); linkDocToTask(o.id); }; },
};

/* ---------- Jalons & gates */
function vGates() {
  const G = gateForecasts();
  const wrap = el(`<p class="muted intro">Un gate se franchit quand tous ses critères sont remplis, ou par décision documentée du Copil. Preuves dans <code>04_Validation/</code> de la phase.</p>
    <div class="bar"><span class="grow"></span><button class="btn sm" id="jadd">+ Jalon</button></div>
    <div class="bento">${G.map(x => { const j = x.j, done = j.criteres.filter(c => c.ok).length, p = phase(j.phase), dl = Math.round((pd(j.date) - TODAY()) / DAY);
      return `<div class="card c4 gate" style="border-top:6px solid ${p.couleur}"><div class="hd"><div><div class="id">${esc(j.id)}</div><b>${esc(j.nom)}</b><div class="small muted">${p.id} · ${fd(j.date)} · ${dl >= 0 ? "J-" + dl : "passé de " + -dl + " j"}</div>
        ${j.type === "Gate" ? `<div class="small">Baseline ${fds(x.bl || j.date)} · prévision <b class="${x.derive > 0 ? "red" : ""}">${fds(x.fc)}</b> · marge ${x.marge} j (${x.pct} % consommée)</div>` : ""}</div>
        <select data-j="${j.id}" class="jst" aria-label="Statut ${esc(j.id)}">${["À venir", "En préparation", "Validé", "Validé sous conditions", "Reporté"].map(s => `<option ${j.statut === s ? "selected" : ""}>${s}</option>`).join("")}</select></div>
        ${j.criteres.length ? `<div class="prog"><i style="width:${Math.round(done / j.criteres.length * 100)}%"></i></div><div class="small muted">${done}/${j.criteres.length} critères</div>` : ""}
        ${j.criteres.map((c, i) => `<label class="chk"><input type="checkbox" data-j="${j.id}" data-i="${i}" ${c.ok ? "checked" : ""}> ${esc(c.t)}</label>`).join("")}
        <div class="row"><button class="btn sec sm jcr" data-j="${j.id}">+ Critère</button><button class="btn ghost sm jed" data-j="${j.id}">Modifier</button><a class="btn ghost sm" href="#phase/${j.phase}">Phase →</a></div></div>`; }).join("")}</div>`);
  $$("input[type=checkbox][data-j]", wrap).forEach(cb => cb.onchange = () => { const j = S.jalons.find(x => x.id === cb.dataset.j); j.criteres[+cb.dataset.i].ok = cb.checked; save({ type: "Jalon", id: j.id, action: (cb.checked ? "Critère rempli : " : "Critère décoché : ") + j.criteres[+cb.dataset.i].t, resume: j.nom }); rerender(); });
  $$(".jst", wrap).forEach(s => s.onchange = () => { const j = S.jalons.find(x => x.id === s.dataset.j); const o = j.statut; j.statut = s.value; save({ type: "Jalon", id: j.id, action: `Statut : ${o} → ${j.statut}`, resume: j.nom }); rerender(); });
  $$(".jcr", wrap).forEach(b => b.onclick = () => { const t = prompt("Nouveau critère de sortie :"); if (t) { const j = S.jalons.find(x => x.id === b.dataset.j); j.criteres.push({ t, ok: false }); save({ type: "Jalon", id: j.id, action: "Critère ajouté : " + t }); rerender(); } });
  const jEdit = j => { const isNew = !j, o = j ? clone(j) : { id: "", nom: "", date: todayIso(), phase: S.phases[0].id, type: "Jalon", statut: "À venir", criteres: [] };
    const fl = [F("id", "ID", "text", { req: true }), F("nom", "Nom", "text", { req: true, full: true }), F("date", "Date", "date"), F("phase", "Phase", "select", { opts: phaseOpts }), F("type", "Type", "select", { opts: () => ["Gate", "Jalon"] })];
    openModal(isNew ? "Nouveau jalon" : "Jalon " + o.id, fl.map(f => fieldHtml(f, o[f.k])).join(""), `${isNew ? "" : '<button class="btn danger l" id="mDel">Supprimer</button>'}<button class="btn sec" id="mC">Annuler</button><button class="btn" id="mS">Enregistrer</button>`, () => {
      $("#mC").onclick = closeModal;
      if ($("#mDel")) $("#mDel").onclick = () => { if (confirm("Supprimer ce jalon ?")) { S.jalons = S.jalons.filter(x => x !== j); save({ type: "Jalon", id: j.id, action: "Suppression" }); closeModal(); render(); } };
      $("#mS").onclick = () => { const before = clone(o); fl.forEach(f => o[f.k] = $("#f_" + f.k).value); if (!o.id || !o.nom) { toast("ID et nom obligatoires"); return; } if (isNew) S.jalons.push(o); else Object.assign(j, o); save({ type: "Jalon", id: o.id, action: isNew ? "Création" : diffSummary(before, o, fl) || "Modification", resume: o.nom }); closeModal(); render(); };
    }); };
  $$(".jed", wrap).forEach(b => b.onclick = () => jEdit(S.jalons.find(x => x.id === b.dataset.j)));
  $("#jadd", wrap).onclick = () => jEdit(null);
  return wrap;
}
