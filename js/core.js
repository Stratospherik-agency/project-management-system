/* Plateforme de pilotage — Refonte web HEP Vaud — noyau (état, persistance, utilitaires, formulaires, tableaux) */
"use strict";
const CFG = Object.assign({ apiUrl: "auto", storageKey: "hepvd-refonte-web-v2", docsBase: "../../", auteurParDefaut: "" }, window.DASHBOARD_CONFIG || {});
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const clone = o => JSON.parse(JSON.stringify(o));
const norm = s => String(s == null ? "" : s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const DAY = 86400000;
const pd = s => { if (!s) return null; const [y, m, d] = String(s).slice(0, 10).split("-").map(Number); return Date.UTC(y, m - 1, d); };
const iso = t => new Date(t).toISOString().slice(0, 10);
const todayIso = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
const TODAY = () => pd(todayIso());
const fd = s => { if (!s) return "—"; const [y, m, d] = String(s).slice(0, 10).split("-"); return `${d}.${m}.${y}`; };
const fds = s => { if (!s) return "—"; const [y, m, d] = String(s).slice(0, 10).split("-"); return `${d}.${m}.${y.slice(2)}`; };
const fdt = s => s ? new Date(s).toLocaleString("fr-CH", { dateStyle: "short", timeStyle: "short" }) : "—";
const days = (a, b) => Math.round((pd(b) - pd(a)) / DAY);
const addDays = (s, n) => iso(pd(s) + n * DAY);
const MOIS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
const chf = n => (Number(n) || 0).toLocaleString("fr-CH", { maximumFractionDigits: 0 });
function isoWeek(t) { const d = new Date(t); const day = (d.getUTCDay() + 6) % 7; d.setUTCDate(d.getUTCDate() - day + 3); const fy = d.getUTCFullYear(); const f = new Date(Date.UTC(fy, 0, 4)); return { year: fy, week: 1 + Math.round(((d - f) / DAY - 3 + ((f.getUTCDay() + 6) % 7)) / 7) }; }
function mondayOf(t) { const d = new Date(t); return t - ((d.getUTCDay() + 6) % 7) * DAY; }
function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("on"); clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("on"), 2400); }
function download(name, content, type) { const b = new Blob([content], { type: type || "text/plain;charset=utf-8" }); const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500); }
const STATUTS = ["À faire", "En cours", "En revue", "Bloqué", "Terminé"];
const stClass = s => "st-" + norm(s).replace(/[^a-z]/g, "");
const tag = (s, cls) => s ? `<span class="tag ${cls || stClass(s)}">${esc(s)}</span>` : "";
const score = r => (Number(r.proba) || 0) * (Number(r.impact) || 0);
const scoreRes = r => (Number(r.probaRes) || Number(r.proba) || 0) * (Number(r.impactRes) || Number(r.impact) || 0);
const sev = s => s >= 15 ? 4 : s >= 10 ? 3 : s >= 5 ? 2 : 1;
const SEVL = ["", "Faible", "Modéré", "Élevé", "Critique"];
const sevTag = s => `<span class="tag sev-${sev(s)}">${s} · ${SEVL[sev(s)]}</span>`;

/* ===================================================== état & persistance */
let S = null, SERVER = false, serverRev = 0, saveTimer = null, pendingJournal = [], USER = "", AUTH = false, ROLE = "admin", STORAGE = "";
const SEED = window.PROJECT_DATA ? clone(window.PROJECT_DATA) : null;
const COLS = ["roles", "phases", "taches", "jalons", "documents", "risques", "decisions", "questions", "actions", "parties", "systemes", "agents", "budget", "changements", "rapports", "journal", "contrastes", "baselines", "dsVersions", "dsElements", "dsDemandes", "dsBesoins"];
function normalize(d) {
  COLS.forEach(k => { if (!Array.isArray(d[k])) d[k] = []; });
  if (!d.raci) d.raci = { activites: [] };
  if (!d.meta) d.meta = {};
  d.ui = Object.assign({ collapsed: {}, zoom: "mois", ganttPhase: "", showDeps: true, showBaseline: true, baseline: "" }, d.ui || {});
  d.documents.forEach(x => { if (!Array.isArray(x.taches)) x.taches = String(x.taches || "").split(/[,; ]+/).filter(Boolean); if (!Array.isArray(x.versions)) x.versions = []; });
  d.risques.forEach(x => { if (!Array.isArray(x.revues)) x.revues = []; });
  return d;
}
function lsGet(k) { try { const s = localStorage.getItem(k); return s ? JSON.parse(s) : null; } catch (e) { return null; } }
function lsSet(k, d) { try { localStorage.setItem(k, JSON.stringify(d)); return true; } catch (e) { return false; } }
const api = p => (CFG.apiBase || "api/") + p;

async function detectServer() {
  if (CFG.apiUrl === null || location.protocol === "file:") return false;
  try {
    const r = await fetch(api("whoami"), { cache: "no-store" });
    if (r.status === 401) { const j = await r.json().catch(() => ({})); location.href = j.redirect || "connexion"; await new Promise(() => {}); }
    if (!r.ok) return false; const j = await r.json();
    AUTH = !!j.auth; STORAGE = j.storage || ""; CFG.docsBase = j.docsBase || null;
    if (AUTH && j.user) { USER = j.user.nom; ROLE = j.user.role; }
    return true;
  } catch (e) { return false; }
}
async function load() {
  SERVER = await detectServer();
  if (!USER) USER = (lsGet("hepvd-user") || "");
  if (SERVER) {
    try {
      const r = await fetch(api("data"), { cache: "no-store" });
      if (r.ok) { const j = await r.json(); serverRev = j.rev; S = normalize(j.data); setSave("ok", "Base de données — synchronisée"); return; }
      if (r.status === 404) { S = normalize(clone(SEED)); serverRev = 0; pendingJournal.push(jEntry({ type: "Plateforme", id: "", action: "Initialisation de la base de données" })); await pushServer(); return; }
    } catch (e) { }
    SERVER = false; setSave("err", "Serveur injoignable — mode local");
  }
  S = normalize(lsGet(CFG.storageKey) || clone(SEED));
  setSave("ok", "Local — enregistré dans ce navigateur");
}
function apiFetch(p, opts) {
  opts = Object.assign({}, opts || {}); opts.headers = Object.assign({ "X-HEPVD-User": encodeURIComponent(USER || "") }, opts.headers || {});
  return fetch(api(p), opts).then(r => { if (r.status === 401) { location.href = "connexion"; throw new Error("401"); } return r; });
}
const READONLY = () => SERVER && ROLE === "lecteur";
async function pushServer() {
  const jr = pendingJournal; pendingJournal = [];
  try {
    const r = await apiFetch("data", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ rev: serverRev, user: USER, journal: jr, data: S }) });
    if (r.status === 409) { pendingJournal = jr.concat(pendingJournal); setSave("err", "Conflit : rechargez la page"); alert("Les données ont été modifiées par une autre personne depuis votre dernier chargement. Rechargez la page (vos dernières modifications sont conservées localement en secours)."); lsSet(CFG.storageKey + "-secours", S); return; }
    if (!r.ok) throw new Error(r.status);
    serverRev = (await r.json()).rev; setSave("ok", "Base de données — enregistré " + new Date().toLocaleTimeString("fr-CH", { hour: "2-digit", minute: "2-digit" }));
  } catch (e) { pendingJournal = jr.concat(pendingJournal); setSave("err", "Échec d'enregistrement — nouvel essai à la prochaine modification"); }
}
function jEntry(j) { return Object.assign({ ts: new Date().toISOString(), user: USER || "anonyme" }, j); }
function save(journal) {
  if (READONLY()) { toast("Accès en lecture seule : modification non enregistrée"); load().then(render); return; }
  if (journal) { const e = jEntry(journal); S.journal.unshift(e); S.journal = S.journal.slice(0, 5000); pendingJournal.push(e); }
  S.meta.maj = todayIso();
  if (SERVER) { clearTimeout(saveTimer); setSave("", "Enregistrement…"); saveTimer = setTimeout(pushServer, 400); }
  else { const ok = lsSet(CFG.storageKey, S); setSave(ok ? "ok" : "err", ok ? "Local — enregistré " + new Date().toLocaleTimeString("fr-CH", { hour: "2-digit", minute: "2-digit" }) : "Stockage indisponible : exportez vos données"); }
}
function setSave(cls, txt) { const e = $("#saveState"); if (e) { e.className = "pill save " + cls; e.textContent = txt; } }
function askUser(force) {
  if (SERVER && AUTH) return accountMenu();
  if (USER && !force) return;
  openModal("Qui êtes-vous ?", `<div class="full"><p class="small muted" style="margin-top:0">Votre nom est associé à chaque modification (traçabilité). En mode serveur avec authentification, il est fourni automatiquement.</p><label for="uName">Prénom et nom</label><input id="uName" value="${esc(USER)}" autocomplete="name"></div>`,
    `<button class="btn" id="uOk">Valider</button>`, () => { $("#uOk").onclick = () => { const v = $("#uName").value.trim(); if (!v) return; USER = v; lsSet("hepvd-user", v); closeModal(); render(); }; });
}

/* ===================================================== référentiels */
const role = c => { const r = S.roles.find(x => x.code === c); return r ? (r.personne ? `${r.personne} (${r.code})` : r.nom) : (c || "—"); };
const roleShort = c => { const r = S.roles.find(x => x.code === c); return r ? (r.personne || r.code) : (c || "—"); };
const phase = id => S.phases.find(p => p.id === id) || { id, nom: id || "—", couleur: "#6891a8" };
const roleOpts = () => S.roles.map(r => [r.code, `${r.code} — ${r.nom}${r.personne ? " · " + r.personne : ""}`]);
const phaseOpts = () => S.phases.map(p => [p.id, `${p.id} — ${p.nom}`]);
const task = id => S.taches.find(t => t.id === id);
const docsOfTask = id => S.documents.filter(d => d.taches.includes(id));
const docUrl = d => { const v = d.versions && d.versions.length ? d.versions[d.versions.length - 1] : null; if (v && v.fichierId && SERVER) return api("files/" + v.fichierId); return d.chemin && CFG.docsBase ? CFG.docsBase + d.chemin.split("/").map(encodeURIComponent).join("/") : null; };
const phaseChip = id => { const p = phase(id); return `<span class="chip" title="${esc(p.nom)}"><span class="dot" style="background:${p.couleur}"></span>${esc(id || "—")}</span>`; };
const link = (hash, txt, cls) => `<a href="#${hash}" class="${cls || ""}">${txt}</a>`;
const taskChip = id => { const t = task(id); return t ? `<a class="chip" href="#" data-task="${t.id}" title="${esc(t.nom)}">${t.id}</a>` : ""; };
const docChip = d => `<a class="chip doc" href="#" data-doc="${d.id}" title="${esc(d.titre)}">${esc(d.id)}</a>`;
function refChips(str) {
  return String(str || "").split(/[,; ]+/).filter(Boolean).map(id => {
    if (/^T\d+/.test(id)) return taskChip(id);
    if (/^DOC-/.test(id)) { const d = S.documents.find(x => x.id === id); return d ? docChip(d) : esc(id); }
    if (/^D-/.test(id)) return `<a class="chip" href="#" data-dec="${esc(id)}">${esc(id)}</a>`;
    if (/^Q-/.test(id)) return `<a class="chip" href="#" data-q="${esc(id)}">${esc(id)}</a>`;
    if (/^R-/.test(id)) return `<a class="chip" href="#" data-risk="${esc(id)}">${esc(id)}</a>`;
    return `<span class="chip">${esc(id)}</span>`;
  }).join(" ");
}
/* liens globaux : chips cliquables partout */
document.addEventListener("click", e => {
  const a = e.target.closest("[data-task],[data-doc],[data-dec],[data-q],[data-risk]"); if (!a) return;
  e.preventDefault();
  if (a.dataset.task) editItem("taches", task(a.dataset.task));
  else if (a.dataset.doc) openDoc(S.documents.find(d => d.id === a.dataset.doc));
  else if (a.dataset.dec) editItem("decisions", S.decisions.find(d => d.id === a.dataset.dec));
  else if (a.dataset.q) editItem("questions", S.questions.find(d => d.id === a.dataset.q));
  else if (a.dataset.risk) openRisk(S.risques.find(d => d.id === a.dataset.risk));
});

/* ===================================================== schémas */
const F = (k, l, type, o) => Object.assign({ k, l, type: type || "text" }, o || {});
const SCHEMAS = {
  taches: { titre: "Tâche", prefix: "T", pad: 3, fields: [
    F("id", "ID", "ro", { col: true }), F("phase", "Phase", "select", { opts: phaseOpts, col: true }), F("nom", "Intitulé", "text", { full: true, col: true, req: true }),
    F("debut", "Début", "date", { col: true, req: true }), F("fin", "Fin", "date", { col: true, req: true }),
    F("statut", "Statut", "select", { opts: () => STATUTS, col: true }), F("avancement", "Avancement (%)", "number", { min: 0, max: 100, col: true }),
    F("responsable", "Responsable", "select", { opts: roleOpts, col: true }), F("priorite", "Priorité", "select", { opts: () => ["Haute", "Normale", "Basse"] }),
    F("dependances", "Dépendances fin → début (IDs)", "text"), F("termineLe", "Terminé le", "date"), F("notes", "Notes", "textarea", { full: true })] },
  decisions: { titre: "Décision", prefix: "D-", pad: 3, fields: [
    F("id", "ID", "ro", { col: true }), F("date", "Date", "date", { col: true }), F("titre", "Décision", "text", { full: true, col: true, req: true }),
    F("statut", "Statut", "select", { opts: () => ["À instruire", "Proposée", "Validée", "Rejetée", "Remplacée"], col: true }),
    F("decideur", "Décideur", "select", { opts: roleOpts, col: true }), F("phase", "Phase", "select", { opts: phaseOpts, col: true }),
    F("contexte", "Contexte", "textarea", { full: true }), F("options", "Options étudiées", "textarea", { full: true }),
    F("decision", "Décision retenue", "textarea", { full: true }), F("reexamen", "Critères de réexamen", "textarea", { full: true }),
    F("dateReexamen", "Date de réexamen", "date", { col: true }), F("remplace", "Remplace (ID décision)", "text"),
    F("questions", "Questions liées (Q-…)", "text"), F("documents", "Documents liés (DOC-…)", "text")] },
  questions: { titre: "Questionnement", prefix: "Q-", pad: 3, fields: [
    F("id", "ID", "ro", { col: true }), F("date", "Posée le", "date", { col: true }), F("question", "Question", "textarea", { full: true, col: true, req: true }),
    F("categorie", "Catégorie", "select", { opts: () => ["Budget", "Gouvernance", "Périmètre", "Technique", "Design", "Design System", "Contenus", "UX", "Conformité", "Outils", "Planning", "Risques"], col: true }),
    F("phase", "Phase", "select", { opts: phaseOpts, col: true }), F("responsable", "Doit répondre", "select", { opts: roleOpts, col: true }),
    F("origine", "Origine (réunion, revue critique, rapport…)", "text"), F("auteur", "Posée par", "text"),
    F("statut", "Statut", "select", { opts: () => ["Ouverte", "En analyse", "Répondue", "Transformée en décision", "Abandonnée"], col: true }),
    F("contexte", "Contexte / enjeu", "textarea", { full: true }), F("reponse", "Réponse", "textarea", { full: true }),
    F("dateReponse", "Répondue le", "date"), F("decision", "Décision liée (D-…)", "text")] },
  actions: { titre: "Action", prefix: "A-", pad: 3, fields: [
    F("id", "ID", "ro", { col: true }), F("titre", "Action", "text", { full: true, col: true, req: true }), F("responsable", "Responsable", "select", { opts: roleOpts, col: true }),
    F("echeance", "Échéance", "date", { col: true }), F("statut", "Statut", "select", { opts: () => ["Ouvert", "En cours", "Fait", "Annulé"], col: true }),
    F("priorite", "Priorité", "select", { opts: () => ["Haute", "Normale", "Basse"], col: true }), F("origine", "Origine (réunion, risque…)", "text", { col: true })] },
  changements: { titre: "Demande de changement", prefix: "DC-", pad: 3, fields: [
    F("id", "ID", "ro", { col: true }), F("date", "Date", "date", { col: true }), F("titre", "Changement", "text", { full: true, col: true, req: true }),
    F("demandeur", "Demandeur", "text", { col: true }), F("impact", "Impacts (périmètre, délai, budget)", "textarea", { full: true, col: true }),
    F("statut", "Statut", "select", { opts: () => ["Soumise", "En analyse", "Acceptée", "Refusée"], col: true }), F("decision", "Décision liée (D-…)", "text")] },
  parties: { titre: "Partie prenante", prefix: "PP-", pad: 2, fields: [
    F("id", "ID", "ro", { col: true }), F("nom", "Partie prenante", "text", { col: true, req: true }), F("groupe", "Groupe", "text", { col: true }),
    F("influence", "Influence (1–5)", "number", { min: 1, max: 5, col: true }), F("interet", "Intérêt (1–5)", "number", { min: 1, max: 5, col: true }),
    F("contact", "Personne de contact", "text", { col: true }), F("strategie", "Stratégie", "select", { opts: () => ["Gérer étroitement", "Satisfaire", "Impliquer", "Tenir informés", "Tenir informés / tester", "Surveiller"], col: true }),
    F("attentes", "Attentes", "textarea", { full: true })] },
  systemes: { titre: "Système / API", prefix: "S-", pad: 2, fields: [
    F("id", "ID", "ro", { col: true }), F("nom", "Système", "text", { full: true, col: true, req: true }), F("type", "Type", "select", { opts: () => ["Interne", "Externe", "—"], col: true }),
    F("usage", "Usage", "text", { full: true, col: true }), F("univers", "Univers", "text", { col: true }), F("criticite", "Criticité (1–5)", "number", { min: 1, max: 5, col: true }),
    F("protocole", "Protocole / auth", "text"), F("proprietaire", "Propriétaire", "text", { col: true }), F("documentation", "Documentation (lien)", "text", { full: true }),
    F("statut", "Statut", "select", { opts: () => ["À inventorier", "À confirmer", "Confirmé", "Documenté", "À remplacer", "À supprimer"], col: true })] },
  budget: { titre: "Poste budgétaire", prefix: "B-", pad: 2, fields: [
    F("id", "ID", "ro", { col: true }), F("poste", "Poste", "text", { col: true, req: true, full: true }), F("phases", "Phases", "text", { col: true }),
    F("prevu", "Prévu (CHF)", "number", { col: true }), F("engage", "Engagé (CHF)", "number", { col: true }), F("consomme", "Consommé (CHF)", "number", { col: true })] },
  roles: { titre: "Rôle", key: "code", fields: [F("code", "Code", "text", { col: true, req: true }), F("nom", "Rôle", "text", { col: true, full: true, req: true }), F("personne", "Personne(s)", "text", { col: true, full: true })] },
  agents: { titre: "Agent IA", key: "id", fields: [F("id", "ID", "text", { req: true, col: true }), F("nom", "Nom", "text", { req: true, col: true }), F("mission", "Mission", "textarea", { full: true }), F("phases", "Phases", "text", { col: true }), F("skills", "Skills", "text", { col: true }), F("entrees", "Entrées", "textarea", { full: true }), F("sorties", "Livrables", "textarea", { full: true })] },
  phases: { titre: "Phase", prefix: "P", pad: 0, fields: [F("id", "ID", "ro", { col: true }), F("nom", "Nom", "text", { req: true, col: true }), F("debut", "Début", "date", { col: true }), F("fin", "Fin", "date", { col: true }), F("couleur", "Couleur", "color"), F("dossier", "Dossier", "text", { col: true }), F("agents", "Agents", "text"), F("objectif", "Objectif", "textarea", { full: true }), F("entrees", "Entrées", "textarea", { full: true }), F("verifs", "Vérifications", "textarea", { full: true })] },
  dsVersions: { titre: "Version du Design System", key: "id", fields: [
    F("id", "ID (vX.Y)", "text", { req: true }), F("version", "Version", "text", { col: true, req: true }), F("date", "Date", "date", { col: true }),
    F("statut", "Statut", "select", { opts: () => ["Planifiée", "En cours", "En revue", "Publiée", "Retirée"], col: true }), F("type", "Type", "select", { opts: () => ["Charte", "Fondations", "Tokens", "Composants", "Release", "Correctif"], col: true }),
    F("resume", "Contenu", "textarea", { full: true, col: true }), F("notes", "Release notes (ajouts, modifications, dépréciations, suppressions)", "textarea", { full: true }),
    F("decisions", "Décisions liées (D-…)", "text"), F("documents", "Documents liés (DOC-…)", "text")] },
  dsElements: { titre: "Élément du Design System", prefix: "E-", pad: 3, fields: [
    F("id", "ID", "ro", { col: true }), F("nom", "Élément", "text", { full: true, col: true, req: true }),
    F("categorie", "Catégorie", "select", { opts: () => ["Marque", "Couleur", "Typographie", "Bento", "Grille", "Espacement", "Iconographie", "Imagerie", "Mouvement", "Token", "Composant", "Pattern"], col: true }),
    F("statut", "Statut", "select", { opts: () => ["Hérité de la charte", "À adapter au digital", "À concevoir", "En conception", "En revue", "Validé", "Déprécié", "Retiré"], col: true }),
    F("version", "Version cible / introduction", "text", { col: true }), F("responsable", "Responsable", "select", { opts: roleOpts, col: true }),
    F("a11y", "Accessibilité (contrôles faits)", "text"), F("source", "Source", "text", { full: true }), F("notes", "Notes", "textarea", { full: true })] },
  dsDemandes: { titre: "Demande d'évolution DS", prefix: "DS-", pad: 3, fields: [
    F("id", "ID", "ro", { col: true }), F("date", "Date", "date", { col: true }), F("titre", "Demande", "text", { full: true, col: true, req: true }),
    F("type", "Type", "select", { opts: () => ["Nouveau composant", "Évolution", "Correction", "Dette", "Dépréciation"], col: true }),
    F("demandeur", "Demandeur", "text", { col: true }), F("statut", "Statut", "select", { opts: () => ["Soumise", "En analyse", "Acceptée", "Refusée", "Reportée", "Réalisée", "Publiée"], col: true }),
    F("versionCible", "Version cible", "text", { col: true }), F("description", "Besoin observé et proposition", "textarea", { full: true }), F("decision", "Décision liée (D-…)", "text")] },
  dsBesoins: { titre: "Besoin pour le Design System", key: "id", fields: [
    F("id", "ID", "text", { col: true, req: true }), F("categorie", "Catégorie", "text", { col: true }), F("besoin", "Besoin", "textarea", { full: true, col: true, req: true }),
    F("pourquoi", "Pourquoi", "textarea", { full: true }), F("statutSuivi", "Statut", "select", { opts: () => ["À fournir", "Demandé", "Reçu", "À décider", "Décidé", "Sans objet"], col: true }),
    F("qui", "Qui", "text", { col: true }), F("quand", "Quand", "text", { col: true }), F("commentaire", "Commentaire", "textarea", { full: true })] },
};
function nextId(col) { const sc = SCHEMAS[col] || {}; let max = 0; S[col].forEach(x => { const m = String(x.id || "").match(/(\d+)$/); if (m) max = Math.max(max, +m[1]); }); return (sc.prefix || "") + String(max + 1).padStart(sc.pad || 3, "0"); }

/* ===================================================== modale */
let modalReturn = null;
function openModal(title, bodyHtml, footHtml, onMount, wide) {
  modalReturn = document.activeElement;
  $("#modalTitle").textContent = title; $("#modalBody").innerHTML = bodyHtml; $("#modalFoot").innerHTML = footHtml;
  $(".modal").classList.toggle("wide", !!wide);
  $("#modalBg").hidden = false; if (onMount) onMount();
  const f = $("#modalBody input:not([readonly]):not([type=checkbox]), #modalBody select, #modalBody textarea"); (f || $("#modalClose")).focus();
}
function closeModal() { $("#modalBg").hidden = true; if (modalReturn && modalReturn.focus && document.contains(modalReturn)) modalReturn.focus(); }
function fieldHtml(f, v) {
  const id = "f_" + f.k, cls = f.full || f.type === "textarea" ? "full" : "";
  let inp;
  if (f.type === "ro") inp = `<input id="${id}" value="${esc(v)}" readonly>`;
  else if (f.type === "select") { const opts = f.opts().map(o => Array.isArray(o) ? o : [o, o]); if (v && !opts.some(o => o[0] === v)) opts.unshift([v, v]); inp = `<select id="${id}"><option value="">—</option>${opts.map(o => `<option value="${esc(o[0])}" ${o[0] === v ? "selected" : ""}>${esc(o[1])}</option>`).join("")}</select>`; }
  else if (f.type === "textarea") inp = `<textarea id="${id}">${esc(v)}</textarea>`;
  else inp = `<input id="${id}" type="${f.type}" value="${esc(v)}" ${f.min != null ? `min="${f.min}"` : ""} ${f.max != null ? `max="${f.max}"` : ""}>`;
  return `<div class="${cls}"><label for="${id}">${esc(f.l)}${f.req ? " *" : ""}</label>${inp}</div>`;
}
function diffSummary(a, b, fields) {
  const ch = fields.filter(f => String(a[f.k] ?? "") !== String(b[f.k] ?? "")).map(f => `${f.l.replace(/ \(.*\)/, "")} : « ${String(a[f.k] ?? "").slice(0, 60) || "—"} » → « ${String(b[f.k] ?? "").slice(0, 60) || "—"} »`);
  return ch.length ? ch.join(" ; ") : "";
}
const HOOKS = {}; /* HOOKS[col] = { extra(obj) → html, save(obj, isNew), buttons(obj) → html, mount(obj) } */
function editItem(col, item, onDone, preset) {
  if (col === "documents") return openDoc(item);
  if (col === "risques") return openRisk(item);
  const sc = SCHEMAS[col], isNew = !item, kf = sc.key || "id";
  const obj = item ? clone(item) : Object.assign({}, preset || {});
  if (isNew && kf === "id" && sc.fields[0].type === "ro") obj.id = nextId(col);
  if (isNew) sc.fields.forEach(f => { if (f.type === "date" && ["date"].includes(f.k) && !obj[f.k]) obj[f.k] = todayIso(); });
  if (isNew && col === "questions" && !obj.statut) { obj.statut = "Ouverte"; obj.auteur = USER; }
  const H = HOOKS[col] || {};
  const body = sc.fields.map(f => fieldHtml(f, obj[f.k])).join("") + (H.extra ? H.extra(obj, isNew) : "");
  const foot = `${isNew ? "" : `<button class="btn danger l" id="mDel">Supprimer</button>`}${H.buttons && !isNew ? H.buttons(obj) : ""}<button class="btn sec" id="mCancel">Annuler</button><button class="btn" id="mSave">Enregistrer</button>`;
  openModal((isNew ? "Nouveau · " : "") + sc.titre + (obj[kf] ? " " + obj[kf] : ""), body, foot, () => {
    $("#mCancel").onclick = closeModal;
    if (H.mount) H.mount(obj, isNew);
    if ($("#mDel")) $("#mDel").onclick = () => {
      if (!confirm("Supprimer définitivement cet élément ? (la suppression reste tracée dans l'historique)")) return;
      S[col] = S[col].filter(x => x[kf] !== item[kf]); save({ type: sc.titre, id: item[kf], action: "Suppression", resume: item.nom || item.titre || item.question || "" });
      closeModal(); (onDone || render)();
    };
    $("#mSave").onclick = () => {
      const out = Object.assign({}, obj);
      for (const f of sc.fields) { const el = $("#f_" + f.k); let v = el.value; if (f.type === "number") v = v === "" ? "" : Number(v); if (f.req && (v === "" || v == null)) { el.focus(); toast(`« ${f.l} » est obligatoire`); return; } out[f.k] = v; }
      if (out.debut && out.fin && pd(out.fin) < pd(out.debut)) { toast("La fin doit être postérieure au début"); return; }
      if (col === "taches") { if (out.statut === "Terminé") { out.avancement = 100; if (!out.termineLe) out.termineLe = todayIso(); } else out.termineLe = ""; }
      if (col === "questions" && ["Répondue", "Transformée en décision"].includes(out.statut) && !out.dateReponse) out.dateReponse = todayIso();
      if (isNew && S[col].some(x => x[kf] === out[kf])) { toast("Identifiant déjà utilisé"); return; }
      if (H.save && H.save(out, isNew) === false) return;
      if (isNew) S[col].push(out); else { const i = S[col].findIndex(x => x[kf] === item[kf]); S[col][i] = out; }
      const d = isNew ? "Création" : diffSummary(item, out, sc.fields);
      if (d || H.save) save({ type: sc.titre, id: out[kf], action: d || "Liens mis à jour", resume: out.nom || out.titre || out.question || out.poste || out.besoin || "" });
      closeModal(); toast("Enregistré"); (onDone || render)();
    };
  }, sc.fields.length > 9);
}

/* ===================================================== tableau générique */
const tableState = {};
function cellVal(f, x) {
  const v = x[f.k];
  if (f.k === "phase") return phaseChip(v);
  if (f.k === "statut" || f.k === "statutSuivi") return tag(v);
  if (["responsable", "proprietaire", "decideur"].includes(f.k)) return esc(roleShort(v));
  if (f.type === "date") return `<span class="nowrap">${esc(fds(v))}</span>`;
  if (f.k === "avancement") return `<div class="prog" style="width:70px" title="${v}%"><i style="width:${v || 0}%"></i></div>`;
  if (["prevu", "engage", "consomme"].includes(f.k)) return chf(v);
  if (f.type === "textarea") return esc(String(v || "").slice(0, 140)) + (String(v || "").length > 140 ? "…" : "");
  return esc(v);
}
function genericTable(col, opts) {
  opts = opts || {};
  const sc = SCHEMAS[col], key = opts.stateKey || col, st = tableState[key] = tableState[key] || { q: "", sort: null, dir: 1, phase: opts.phase || "", statut: "" };
  const cols = sc.fields.filter(f => f.col);
  const hasPhase = !opts.phase && sc.fields.some(f => f.k === "phase"), sf = sc.fields.find(f => f.k === "statut" || f.k === "statutSuivi");
  const wrap = document.createElement("div");
  wrap.innerHTML = `<div class="bar">
    <input type="search" placeholder="Rechercher…" aria-label="Rechercher" value="${esc(st.q)}" class="tq">
    ${hasPhase ? `<select class="tp" aria-label="Filtrer par phase"><option value="">Toutes les phases</option>${S.phases.map(p => `<option value="${p.id}" ${st.phase === p.id ? "selected" : ""}>${p.id} — ${esc(p.nom)}</option>`).join("")}</select>` : ""}
    ${sf ? `<select class="ts" aria-label="Filtrer par statut"><option value="">Tous les statuts</option>${sf.opts().map(s => `<option ${st.statut === s ? "selected" : ""}>${esc(s)}</option>`).join("")}</select>` : ""}
    <span class="grow"></span>${opts.extraBtns || ""}<button class="btn sec sm tcsv">Export CSV</button>${opts.noAdd ? "" : `<button class="btn sm tadd">+ Ajouter</button>`}</div>
    <div class="tw"><table><thead><tr>${cols.map(f => `<th data-k="${f.k}" scope="col" aria-sort="${st.sort === f.k ? (st.dir > 0 ? "ascending" : "descending") : "none"}">${esc(f.l.replace(/ \(.*\)/, ""))}${st.sort === f.k ? (st.dir > 0 ? " ▲" : " ▼") : ""}</th>`).join("")}${opts.extraCol ? `<th>${opts.extraCol.l}</th>` : ""}</tr></thead><tbody></tbody></table></div>`;
  const kf = sc.key || "id";
  const rows = () => {
    let r = S[col].filter(x => (!st.phase || x.phase === st.phase) && (!st.statut || x[sf.k] === st.statut) && (!opts.filter || opts.filter(x)));
    if (st.q) { const q = norm(st.q).split(/\s+/).filter(Boolean); r = r.filter(x => { const h = norm(JSON.stringify(x)); return q.every(w => h.includes(w)); }); }
    if (st.sort) r.sort((a, b) => { const A = a[st.sort], B = b[st.sort]; return (typeof A === "number" && typeof B === "number" ? A - B : String(A ?? "").localeCompare(String(B ?? ""), "fr", { numeric: true })) * st.dir; });
    return r;
  };
  const fill = () => { const r = rows(); $("tbody", wrap).innerHTML = r.length ? r.map(x => `<tr data-id="${esc(x[kf])}" tabindex="0">${cols.map(f => `<td class="${f.type === "number" ? "num" : ""}">${cellVal(f, x)}</td>`).join("")}${opts.extraCol ? `<td>${opts.extraCol.f(x)}</td>` : ""}</tr>`).join("") : `<tr><td colspan="${cols.length + 1}" class="empty">Aucun élément</td></tr>`; };
  fill();
  $(".tq", wrap).oninput = e => { st.q = e.target.value; fill(); };
  if (hasPhase) $(".tp", wrap).onchange = e => { st.phase = e.target.value; fill(); };
  if (sf) $(".ts", wrap).onchange = e => { st.statut = e.target.value; fill(); };
  $$("th[data-k]", wrap).forEach(th => th.onclick = () => { const k = th.dataset.k; if (st.sort === k) st.dir *= -1; else { st.sort = k; st.dir = 1; } const nw = genericTable(col, opts); wrap.replaceWith(nw); });
  const open = id => editItem(col, S[col].find(x => String(x[kf]) === id));
  $("tbody", wrap).addEventListener("click", e => { if (e.target.closest("a,button")) return; const tr = e.target.closest("tr[data-id]"); if (tr) open(tr.dataset.id); });
  $("tbody", wrap).addEventListener("keydown", e => { if (e.key === "Enter") { const tr = e.target.closest("tr[data-id]"); if (tr) open(tr.dataset.id); } });
  if (!opts.noAdd) $(".tadd", wrap).onclick = () => editItem(col, null, null, opts.preset);
  $(".tcsv", wrap).onclick = () => { const f = sc.fields, lines = [f.map(x => x.l).join(";")].concat(rows().map(x => f.map(c => `"${String(x[c.k] ?? "").replace(/"/g, '""')}"`).join(";"))); download(`HEPVD_${col}_${todayIso()}.csv`, "﻿" + lines.join("\n"), "text/csv;charset=utf-8"); };
  return wrap;
}
function el(html) { const d = document.createElement("div"); d.innerHTML = html; return d; }
function tabs(id, list, cur, onChange) {
  return `<div class="tabs" role="tablist" data-tabs="${id}">${list.map(([k, l]) => `<button role="tab" aria-selected="${k === cur}" data-k="${k}">${l}</button>`).join("")}</div>`;
}
function bindTabs(root, id, fn) { $$(`[data-tabs="${id}"] button`, root).forEach(b => b.onclick = () => fn(b.dataset.k)); }

/* ===================================================== compte (mode serveur avec comptes) */
const ROLE_L = { admin: "Administrateur", editeur: "Éditeur", lecteur: "Lecteur" };
function accountMenu() {
  openModal("Mon compte", `<div class="full"><p style="margin-top:0"><b>${esc(USER)}</b> · ${ROLE_L[ROLE] || ROLE}</p></div>
    <div class="full"><h3>Changer de mot de passe</h3></div>
    <div><label for="pwA">Mot de passe actuel</label><input id="pwA" type="password" autocomplete="current-password"></div>
    <div><label for="pwN">Nouveau mot de passe (12 caractères min.)</label><input id="pwN" type="password" autocomplete="new-password"></div>`,
    `<button class="btn danger l" id="pwOut">Se déconnecter</button><button class="btn sec" id="pwC">Fermer</button><button class="btn" id="pwS">Changer le mot de passe</button>`, () => {
      $("#pwC").onclick = closeModal;
      $("#pwOut").onclick = async () => { await fetch(api("deconnexion"), { method: "POST" }); location.href = "connexion"; };
      $("#pwS").onclick = async () => { const r = await apiFetch("mot-de-passe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ancien: $("#pwA").value, nouveau: $("#pwN").value }) }); const j = await r.json().catch(() => ({})); if (r.ok) { toast("Mot de passe modifié"); closeModal(); } else toast(j.error || "Erreur"); };
    });
}
