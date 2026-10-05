/* Plateforme — calculs : avancement, prévisions (dépendances), baselines, marges, charge, alertes */
"use strict";
const depsOf = t => String(t.dependances || "").split(/[,; ]+/).filter(Boolean);
const isDone = t => t.statut === "Terminé";
const isLate = t => !isDone(t) && pd(t.fin) < TODAY();
const shouldStart = t => t.statut === "À faire" && pd(t.debut) < TODAY();
const dur = t => Math.max(1, days(t.debut, t.fin));
function phaseProgress(pid) { const ts = S.taches.filter(t => t.phase === pid); if (!ts.length) return 0; let w = 0, s = 0; ts.forEach(t => { w += dur(t); s += dur(t) * (isDone(t) ? 100 : Number(t.avancement) || 0); }); return Math.round(s / w); }
function plannedPct(ts, at) { at = at || TODAY(); let w = 0, s = 0; ts.forEach(t => { const a = pd(t.debut), b = pd(t.fin); w += dur(t); s += dur(t) * Math.max(0, Math.min(1, (at - a) / ((b - a) || DAY))) * 100; }); return w ? Math.round(s / w) : 0; }
function realPct(ts) { let w = 0, s = 0; ts.forEach(t => { w += dur(t); s += dur(t) * (isDone(t) ? 100 : Number(t.avancement) || 0); }); return w ? Math.round(s / w) : 0; }
const globalProgress = () => realPct(S.taches);
const plannedProgress = () => plannedPct(S.taches);

/* Prévision : propagation des retards par les dépendances (fin → début) */
function forecast() {
  const now = TODAY(), F = {};
  const order = S.taches.slice();
  for (let pass = 0; pass < 6; pass++) {
    let changed = false;
    order.forEach(t => {
      let fs, ff;
      if (isDone(t)) { fs = pd(t.debut); ff = pd(t.termineLe || t.fin); }
      else {
        fs = pd(t.debut);
        depsOf(t).forEach(d => { if (F[d]) fs = Math.max(fs, F[d].ff + DAY); });
        if (t.statut === "À faire" && fs < now) fs = now;
        const D = (pd(t.fin) - pd(t.debut));
        if (t.statut === "À faire") ff = fs + D;
        else { const rem = D * (1 - (Number(t.avancement) || 0) / 100); ff = Math.max(pd(t.fin), now + rem, fs + D * 0); ff = Math.max(ff, now); if (t.statut === "Bloqué") ff = Math.max(ff, now + 7 * DAY); }
      }
      const prev = F[t.id];
      if (!prev || prev.ff !== ff || prev.fs !== fs) { F[t.id] = { fs, ff, slip: Math.round((ff - pd(t.fin)) / DAY) }; changed = true; }
    });
    if (!changed) break;
  }
  return F;
}
/* Marges par phase et prévision des jalons */
function gateForecasts(F) {
  F = F || forecast();
  const bl = currentBaseline();
  return S.jalons.slice().sort((a, b) => pd(a.date) - pd(b.date)).map(j => {
    const ts = S.taches.filter(t => t.phase === j.phase && (j.type !== "Gate" || pd(t.fin) <= pd(j.date)));
    const lastPlan = ts.length ? Math.max(...ts.map(t => pd(t.fin))) : pd(j.date);
    const lastFc = ts.length ? Math.max(...ts.map(t => F[t.id] ? F[t.id].ff : pd(t.fin))) : pd(j.date);
    const marge = Math.max(0, Math.round((pd(j.date) - lastPlan) / DAY));
    const conso = Math.max(0, Math.round((lastFc - lastPlan) / DAY));
    const pct = j.type === "Gate" ? (marge ? Math.round(conso / marge * 100) : (conso ? 999 : 0)) : 0;
    const fcDate = j.type === "Gate" ? Math.max(pd(j.date), lastFc + DAY) : pd(j.date);
    const blDate = bl && bl.jalons ? bl.jalons[j.id] : null;
    const derive = Math.round((fcDate - pd(blDate || j.date)) / DAY);
    return { j, marge, conso, pct, fc: iso(fcDate), bl: blDate, derive, replan: blDate ? days(blDate, j.date) : 0 };
  });
}
function currentBaseline() { if (!S.baselines.length) return null; return S.baselines.find(b => b.id === S.ui.baseline) || S.baselines[S.baselines.length - 1]; }
function createBaseline(nom) {
  const n = S.baselines.reduce((m, b) => Math.max(m, +(String(b.id).match(/\d+/) || [0])[0]), -1) + 1;
  const b = { id: "BL-" + String(n).padStart(2, "0"), date: todayIso(), nom, auteur: USER, taches: {}, jalons: {} };
  S.taches.forEach(t => b.taches[t.id] = [t.debut, t.fin]); S.jalons.forEach(j => b.jalons[j.id] = j.date);
  S.baselines.push(b); S.ui.baseline = b.id; save({ type: "Baseline", id: b.id, action: "Baseline figée : " + nom }); return b;
}
/* Chemin critique (marge totale par rapport au gate de la phase) */
function floats() {
  const succ = {}; S.taches.forEach(t => depsOf(t).forEach(d => (succ[d] = succ[d] || []).push(t.id)));
  const LF = {}, res = {};
  const gateOf = pid => { const g = S.jalons.find(j => j.phase === pid && j.type === "Gate"); return pd(g ? g.date : phase(pid).fin); };
  const calc = (id, seen) => {
    if (LF[id] != null) return LF[id]; const t = task(id); if (!t || seen.has(id)) return gateOf(t ? t.phase : ""); seen.add(id);
    const g0 = gateOf(t.phase); let lf = pd(t.fin) <= g0 ? g0 : Math.max(g0, pd(phase(t.phase).fin));
    (succ[id] || []).forEach(s => { const st = task(s); if (st) lf = Math.min(lf, calc(s, seen) - (pd(st.fin) - pd(st.debut)) - DAY); });
    return (LF[id] = lf);
  };
  S.taches.forEach(t => { res[t.id] = Math.round((calc(t.id, new Set()) - pd(t.fin)) / DAY); });
  return res;
}
/* Charge par rôle et par mois (tâches actives simultanées) */
function loadMatrix(monthsAhead) {
  const now = new Date(TODAY()); const months = [];
  for (let i = 0; i < monthsAhead; i++) { const y = now.getUTCFullYear(), m = now.getUTCMonth() + i; months.push([Date.UTC(y, m, 1), Date.UTC(y, m + 1, 1) - DAY]); }
  const roles = S.roles.map(r => r.code);
  const M = {}; roles.forEach(r => M[r] = months.map(([a, b]) => S.taches.filter(t => t.responsable === r && !isDone(t) && pd(t.debut) <= b && pd(t.fin) >= a).length));
  return { months, M };
}
/* Alertes automatiques */
function alerts() {
  const now = TODAY(), A = [], F = forecast(), G = gateForecasts(F);
  const add = (niv, cat, txt, ref) => A.push({ niv, cat, txt, ref });
  S.taches.filter(isLate).forEach(t => add(3, "Retard", `${t.id} « ${t.nom} » devait se terminer le ${fd(t.fin)} (${t.avancement || 0} %)`, t.id));
  S.taches.filter(shouldStart).forEach(t => add(2, "Démarrage", `${t.id} « ${t.nom} » aurait dû démarrer le ${fd(t.debut)}`, t.id));
  S.taches.filter(t => t.statut === "Bloqué").forEach(t => add(3, "Blocage", `${t.id} « ${t.nom} » est bloquée`, t.id));
  S.taches.forEach(t => depsOf(t).forEach(d => { const p = task(d); if (p && !isDone(t) && pd(t.debut) <= pd(p.fin)) add(2, "Planning", `${t.id} commence avant la fin de ${d} (dépendance non respectée)`, t.id); }));
  G.forEach(g => {
    if (g.j.type === "Gate" && g.j.statut !== "Validé") {
      if (g.pct >= 100) add(3, "Marge", `${g.j.id} : marge de la phase épuisée (${g.conso} j de retard prévisionnel pour ${g.marge} j de marge) — date prévisionnelle ${fd(g.fc)}`, g.j.id);
      else if (g.pct >= 50) add(2, "Marge", `${g.j.id} : ${g.pct} % de la marge consommée (${g.conso}/${g.marge} j)`, g.j.id);
      if (g.derive > 10) add(3, "Baseline", `${g.j.id} dérive de ${g.derive} j par rapport à la baseline`, g.j.id);
      const dl = Math.round((pd(g.j.date) - now) / DAY), done = g.j.criteres.filter(c => c.ok).length;
      if (dl >= 0 && dl <= 21 && g.j.criteres.length && done / g.j.criteres.length < 0.5) add(3, "Gate", `${g.j.id} dans ${dl} j avec ${done}/${g.j.criteres.length} critères remplis`, g.j.id);
    }
  });
  S.decisions.filter(d => ["À instruire", "Proposée"].includes(d.statut) && d.date && now - pd(d.date) > 30 * DAY).forEach(d => add(2, "Décision", `${d.id} en attente depuis ${Math.round((now - pd(d.date)) / DAY)} j : ${d.titre}`, d.id));
  S.decisions.filter(d => d.statut === "Validée" && d.dateReexamen && pd(d.dateReexamen) <= now).forEach(d => add(1, "Réexamen", `${d.id} à réexaminer (prévu le ${fd(d.dateReexamen)})`, d.id));
  S.questions.filter(q => ["Ouverte", "En analyse"].includes(q.statut) && q.date && now - pd(q.date) > 30 * DAY).forEach(q => add(2, "Question", `${q.id} sans réponse depuis ${Math.round((now - pd(q.date)) / DAY)} j`, q.id));
  S.risques.filter(r => !["Clos"].includes(r.statut) && r.prochaineRevue && pd(r.prochaineRevue) < now).forEach(r => add(1, "Risque", `${r.id} : revue en retard (prévue le ${fd(r.prochaineRevue)})`, r.id));
  S.risques.filter(r => r.statut !== "Clos" && score(r) >= 15 && !r.mitigation).forEach(r => add(3, "Risque", `${r.id} critique sans plan de mitigation`, r.id));
  S.risques.filter(r => r.statut !== "Clos" && score(r) >= 15 && r.proximite && pd(r.proximite) - now < 30 * DAY && pd(r.proximite) >= now - 365 * DAY).forEach(r => add(2, "Risque", `${r.id} critique, proche (${fd(r.proximite)}) : ${r.titre}`, r.id));
  const L = loadMatrix(3); Object.entries(L.M).forEach(([r, arr]) => { const mx = Math.max(...arr); if (mx > 3) add(2, "Charge", `${r} : jusqu'à ${mx} tâches simultanées dans les 3 prochains mois`, r); });
  const P = S.budget.reduce((s, b) => s + (+b.prevu || 0), 0), E = S.budget.reduce((s, b) => s + (+b.engage || 0), 0);
  const g4 = S.jalons.find(j => j.id === "G4");
  if (P && E / P > 0.8) add(3, "Budget", `Budget engagé à ${Math.round(E / P * 100)} %`, "budget");
  else if (P && g4 && g4.statut !== "Validé" && E / P > 0.6) add(2, "Budget", `Budget engagé à ${Math.round(E / P * 100)} % avant le Design System v1.0`, "budget");
  S.actions.filter(a => ["Ouvert", "En cours"].includes(a.statut) && a.echeance && pd(a.echeance) < now).forEach(a => add(2, "Action", `${a.id} en retard (échéance ${fd(a.echeance)}) : ${a.titre}`, a.id));
  S.documents.filter(d => d.livrable && d.statut === "Prévu").forEach(d => { const t = d.taches.map(task).filter(Boolean)[0]; if (t && pd(t.fin) - now <= 14 * DAY && pd(t.fin) >= now) add(1, "Livrable", `${d.id} « ${d.titre} » attendu d'ici le ${fd(t.fin)} (statut : Prévu)`, d.id); });
  return A.sort((a, b) => b.niv - a.niv);
}
const NIV = ["", "Info", "Vigilance", "Alerte"];
const nivTag = n => `<span class="tag ${["", "sev-1", "sev-2", "sev-3"][n]}">${NIV[n]}</span>`;
function refLink(ref) {
  if (!ref) return "";
  if (/^T\d/.test(ref)) return taskChip(ref);
  if (/^DOC-/.test(ref)) return refChips(ref);
  if (/^[DQR]-/.test(ref)) return refChips(ref);
  if (/^(G\d|M-)/.test(ref)) return `<a class="chip" href="#jalons">${esc(ref)}</a>`;
  if (/^A-/.test(ref)) return `<a class="chip" href="#actions">${esc(ref)}</a>`;
  if (ref === "budget") return `<a class="chip" href="#budget">Budget</a>`;
  return `<a class="chip" href="#anticipation">${esc(ref)}</a>`;
}
