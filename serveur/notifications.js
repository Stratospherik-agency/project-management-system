/* Notifications par e-mail — plateforme de pilotage Refonte web HEP Vaud (v0.4)
 * Aucun module externe : client SMTP intégré (SSL/TLS port 465 ou STARTTLS port 587), planificateur interne.
 *
 * Fichiers dans le dossier de données (jamais servis par le web) :
 *   notifications.json            configuration (serveur d'envoi, destinataires, règles) — mot de passe SMTP inclus, droits 600
 *   notifications-etat.json       état (derniers envois, déclencheurs déjà signalés, alertes reportées)
 *   notifications-journal.ndjson  journal des envois
 * Le mot de passe SMTP peut aussi être fourni par la variable d'environnement SMTP_PASSWORD (prioritaire).
 *
 * Les règles réutilisent les calculs de la plateforme (js/core.js et js/analytics.js) exécutés dans un bac à sable.
 */
"use strict";
if (!process.env.TZ) process.env.TZ = "Europe/Zurich"; // dates du projet calculées à l'heure suisse
const fs = require("fs"), path = require("path"), net = require("net"), tls = require("tls"), vm = require("vm"), crypto = require("crypto");

/* ================================================================ catalogue des notifications */
const P = (l, v, type, aide) => ({ l, v, type: type || "text", aide: aide || "" });
const CATALOGUE = [
  /* Résumés */
  { id: "resume_quotidien", cat: "Résumés", titre: "Résumé du matin", mode: "planifié", dest: [], pourquoi: "Un seul e-mail par jour ouvré regroupant tout ce qui arrive à échéance, ce qui est en retard et ce qui attend une réponse. Envoyé uniquement s'il y a quelque chose. Désactivé : les rappels quotidiens ne partent plus.", params: {} },
  { id: "plan_hebdo", cat: "Résumés", titre: "Planification de la semaine (lundi)", mode: "planifié", dest: ["pilotage", "responsable"], pourquoi: "Vue des 14 prochains jours : échéances, jalons, revues du consultant, décisions à préparer. Remplace le résumé du matin le jour de l'envoi. Les responsables reçoivent leurs propres échéances.", params: { horizon: P("Horizon (jours)", 14, "number") } },
  /* Tâches */
  { id: "tache_echeance", cat: "Tâches", titre: "Tâche à échéance", mode: "quotidien", dest: ["responsable"], pourquoi: "Prévenir avant l'échéance laisse le temps de terminer ou de signaler un retard.", params: { rappels: P("Rappels (jours avant l'échéance)", "3,0", "text", "0 = le jour même") } },
  { id: "tache_retard", cat: "Tâches", titre: "Tâche en retard", mode: "quotidien", dest: ["responsable"], pourquoi: "Un retard non traité se propage aux tâches dépendantes et aux gates.", params: { frequence: P("Relance tous les (jours)", 2, "number"), escalade: P("Prévenir le pilotage après (jours de retard)", 5, "number") } },
  { id: "tache_assignee", cat: "Tâches", titre: "Tâche assignée ou responsable changé", mode: "immédiat", dest: ["responsable"], pourquoi: "La personne sait immédiatement qu'une tâche lui revient.", params: {} },
  { id: "tache_bloquee", cat: "Tâches", titre: "Tâche bloquée", mode: "immédiat", dest: ["pilotage"], pourquoi: "Un blocage demande un arbitrage rapide de la cheffe ou du chef de projet.", params: {} },
  { id: "tache_non_demarree", cat: "Tâches", titre: "Tâche non démarrée", mode: "quotidien", dest: ["responsable"], pourquoi: "Une tâche toujours « À faire » après sa date de début signale un oubli ou une surcharge.", params: { jours: P("Après (jours suivant la date de début)", 3, "number") } },
  { id: "tache_debloquee", cat: "Tâches", titre: "Tâche prête à démarrer (prédécesseurs terminés)", mode: "immédiat", dest: ["responsable"], pourquoi: "Gagner les jours d'attente entre deux tâches dépendantes.", params: {} },
  /* Jalons */
  { id: "gate_approche", cat: "Jalons & gates", titre: "Gate à venir", mode: "quotidien", dest: ["pilotage"], pourquoi: "Préparer à temps le dossier de validation : critères non remplis et livrables non validés sont listés.", params: { rappels: P("Rappels (jours avant le gate)", "30,14,7", "text") } },
  { id: "jalon_derive", cat: "Jalons & gates", titre: "Dérive de la prévision d'un gate", mode: "immédiat", dest: ["pilotage"], pourquoi: "Détecter tôt qu'un gate glisse (prévision après la baseline ou marge de phase entamée).", params: { seuilMarge: P("Seuil de marge consommée (%)", 50, "number"), seuilDerive: P("Dérive par rapport à la baseline (jours)", 1, "number") } },
  { id: "gate_non_valide", cat: "Jalons & gates", titre: "Gate dépassé non validé", mode: "quotidien", dest: ["pilotage"], pourquoi: "Un gate passé sans décision bloque la phase suivante et fausse les prévisions.", params: { frequence: P("Relance tous les (jours)", 1, "number") } },
  /* Décisions & questions */
  { id: "decision_attente", cat: "Décisions & questions", titre: "Décision en attente", mode: "quotidien", dest: ["pilotage"], pourquoi: "Une décision proposée et non tranchée retarde les travaux qui en dépendent.", params: { jours: P("Après (jours d'attente)", 15, "number"), frequence: P("Puis relance tous les (jours)", 15, "number") } },
  { id: "decision_reexamen", cat: "Décisions & questions", titre: "Date de réexamen d'une décision", mode: "quotidien", dest: ["pilotage"], pourquoi: "Les décisions prises sous hypothèse doivent être revues à la date prévue.", params: { rappels: P("Rappels (jours avant)", "7,0", "text") } },
  { id: "question_sans_reponse", cat: "Décisions & questions", titre: "Question sans réponse", mode: "quotidien", dest: ["responsable"], pourquoi: "Les questions ouvertes sont souvent des prérequis aux décisions (ex. licence Chalet).", params: { jours: P("Après (jours)", 10, "number"), frequence: P("Puis relance tous les (jours)", 7, "number") } },
  { id: "question_repondue", cat: "Décisions & questions", titre: "Question répondue", mode: "immédiat", dest: ["auteur", "pilotage"], pourquoi: "La personne qui a posé la question peut reprendre son travail.", params: {} },
  /* Risques */
  { id: "risque_revue", cat: "Risques", titre: "Revue de risque à faire", mode: "quotidien", dest: ["responsable"], pourquoi: "Le plan de management des risques prévoit une revue périodique de chaque risque ouvert.", params: { frequence: P("Relance si en retard tous les (jours)", 7, "number") } },
  { id: "risque_critique", cat: "Risques", titre: "Risque devenu critique", mode: "immédiat", dest: ["pilotage", "responsable"], pourquoi: "Un score élevé exige une mitigation et souvent une information du Copil.", params: { seuil: P("Score minimal (probabilité × impact)", 15, "number") } },
  { id: "risque_proximite", cat: "Risques", titre: "Risque proche de sa fenêtre d'occurrence", mode: "quotidien", dest: ["responsable"], pourquoi: "Vérifier le signal d'alerte et la contingence avant que le risque ne survienne.", params: { jours: P("Jours avant la date de proximité", 30, "number") } },
  /* Actions */
  { id: "action_echeance", cat: "Actions", titre: "Action à échéance ou en retard", mode: "quotidien", dest: ["responsable"], pourquoi: "Les actions issues des réunions et revues sont les plus vite oubliées.", params: { rappels: P("Rappels (jours avant)", "3,0", "text"), frequence: P("Relance si en retard tous les (jours)", 2, "number") } },
  /* Budget */
  { id: "budget_seuil", cat: "Budget", titre: "Seuil d'engagement du budget", mode: "immédiat", dest: ["pilotage"], pourquoi: "Éviter de consommer le budget avant les phases qui en ont le plus besoin.", params: { seuils: P("Seuils (% engagés du scénario de référence)", "60,80", "text") } },
  { id: "budget_poste_depasse", cat: "Budget", titre: "Poste budgétaire dépassé", mode: "immédiat", dest: ["pilotage"], pourquoi: "Un engagement supérieur au prévu doit être compensé ou faire l'objet d'une demande de changement.", params: {} },
  { id: "budget_echeance", cat: "Budget", titre: "Échéance budgétaire", mode: "quotidien", dest: ["pilotage"], pourquoi: "Ne pas manquer les dates de remise budgétaire de l'institution.", params: { echeances: P("Échéances (une par ligne : AAAA-MM-JJ | libellé)", "2026-11-06 | Remise de la demande budgétaire 2027 (U-Com)", "textarea"), rappels: P("Rappels (jours avant)", "14,3,0", "text") } },
  { id: "budget_achat", cat: "Budget", titre: "Achat à préparer", mode: "quotidien", dest: ["pilotage"], pourquoi: "Lancer les commandes (licences, consultant, outils) assez tôt pour qu'elles soient disponibles au début de la période prévue.", params: { jours: P("Jours avant le début de la période de dépense", 30, "number") } },
  /* Consultant */
  { id: "consultant_revue", cat: "Consultant UX/UI", titre: "Revue experte à préparer", mode: "quotidien", dest: ["pilotage"], pourquoi: "Envoyer au consultant les livrables à revoir suffisamment tôt avant la revue.", params: { jours: P("Jours avant le début de la revue", 21, "number"), role: P("Code du rôle consultant", "CONS", "text") } },
  { id: "consultant_reco", cat: "Consultant UX/UI", titre: "Recommandations de revue non traitées avant un gate", mode: "quotidien", dest: ["pilotage"], pourquoi: "Le critère de gate « revue experte externe réalisée et recommandations bloquantes traitées » doit être rempli.", params: { jours: P("Jours avant le gate", 7, "number") } },
  /* Design System */
  { id: "ds_demande", cat: "Design System", titre: "Nouvelle demande d'évolution ou nouveau besoin DS", mode: "immédiat", dest: ["responsable"], pourquoi: "Les demandes doivent être analysées pour la prochaine version du Design System.", params: { role: P("Code du rôle qui reçoit les demandes", "UI", "text") } },
  { id: "ds_version", cat: "Design System", titre: "Version du Design System à venir", mode: "quotidien", dest: ["pilotage"], pourquoi: "Préparer les release notes, la revue et la communication de la version.", params: { jours: P("Jours avant la date de version", 14, "number") } },
  /* Documents */
  { id: "livrable_prevu", cat: "Documents", titre: "Livrable non commencé avant la fin de sa phase", mode: "quotidien", dest: ["responsable"], pourquoi: "Un livrable encore « Prévu » à l'approche de la fin de phase compromet le gate.", params: { jours: P("Jours avant la fin de la phase", 14, "number") } },
  { id: "document_revue", cat: "Documents", titre: "Document en revue depuis longtemps", mode: "quotidien", dest: ["responsable"], pourquoi: "Une relecture qui traîne retarde la validation.", params: { jours: P("Après (jours en revue)", 7, "number") } },
  /* Rapports & pilotage */
  { id: "rapport_rappel", cat: "Rapports & pilotage", titre: "Rappel du rapport hebdomadaire", mode: "planifié", dest: ["pilotage"], pourquoi: "Le rapport hebdomadaire est l'outil principal de suivi du Copil. Le brouillon est déjà compilé par la plateforme.", params: {} },
  { id: "rapport_manquant", cat: "Rapports & pilotage", titre: "Rapport de la semaine précédente non enregistré", mode: "quotidien", dest: ["pilotage"], pourquoi: "Garantit la continuité de l'historique des rapports (traçabilité).", params: {} },
  { id: "sauvegarde_mensuelle", cat: "Rapports & pilotage", titre: "Sauvegarde mensuelle (export JSON)", mode: "quotidien", dest: ["admins"], pourquoi: "Une copie hors serveur protège contre une perte de l'hébergement.", params: { jour: P("Jour du mois", 1, "number") } },
  /* Sécurité */
  { id: "securite_blocage", cat: "Sécurité de la plateforme", titre: "Connexion bloquée après échecs répétés", mode: "immédiat", dest: ["admins"], pourquoi: "Peut signaler une tentative d'intrusion ou un utilisateur en difficulté.", params: {} },
  { id: "securite_compte", cat: "Sécurité de la plateforme", titre: "Compte créé, modifié ou désactivé", mode: "immédiat", dest: ["admins"], pourquoi: "Traçabilité des droits d'accès aux données du projet.", params: {} },
];
const DEST_LABELS = { responsable: "Responsable de l'élément", pilotage: "Pilotage (cheffe/chef de projet)", admins: "Administrateurs", copie: "Copie", auteur: "Auteur·e de la question" };
const NIV = { 3: "Urgent", 2: "À traiter", 1: "Information" };

const DEFAULT_CFG = () => ({
  actif: false,
  smtp: { hote: "mail.infomaniak.com", port: 465, securite: "ssl", utilisateur: "", motDePasse: "", expediteur: "", nomExpediteur: "Pilotage — Refonte web HEP Vaud", repondreA: "" },
  urlPlateforme: "",
  prefixeSujet: "[Refonte web]",
  calendrier: { heureResume: "07:30", joursOuvres: true, jourPlan: 1, heurePlan: "07:30", jourRapport: 5, heureRapport: "14:00", joursSansEnvoi: "", pauseDu: "", pauseAu: "", delaiImmediat: 2 },
  destinataires: { roles: {}, pilotage: ["CDP"], admins: [], copie: [] },
  preferences: {},
  regles: {},
});

module.exports = function creerNotifications(ctx) {
  const { DATA_DIR, APP, store } = ctx;
  const CFG_F = path.join(DATA_DIR, "notifications.json"), ETAT_F = path.join(DATA_DIR, "notifications-etat.json"), JRN_F = path.join(DATA_DIR, "notifications-journal.ndjson");
  const rJ = (f, d) => { try { return JSON.parse(fs.readFileSync(f, "utf8")); } catch (e) { return d; } };
  const wJ = (f, v) => { fs.writeFileSync(f + ".tmp", JSON.stringify(v, null, 1), { mode: 0o600 }); fs.renameSync(f + ".tmp", f); };
  const merge = (a, b) => { const o = Array.isArray(a) ? a.slice() : Object.assign({}, a); Object.keys(b || {}).forEach(k => { o[k] = b[k] && typeof b[k] === "object" && !Array.isArray(b[k]) && a && typeof a[k] === "object" && !Array.isArray(a[k]) ? merge(a[k], b[k]) : b[k]; }); return o; };
  let cfg = merge(DEFAULT_CFG(), rJ(CFG_F, {}));
  let etat = rJ(ETAT_F, { init: false, dernier: {}, fronts: {}, resp: {}, existants: {}, reportes: {} });
  const saveCfg = () => wJ(CFG_F, cfg), saveEtat = () => wJ(ETAT_F, etat);
  const motDePasse = () => process.env.SMTP_PASSWORD || cfg.smtp.motDePasse || "";
  const regle = id => { const def = CATALOGUE.find(r => r.id === id), r = cfg.regles[id] || {}; const params = {}; Object.keys(def.params).forEach(k => params[k] = r.params && r.params[k] !== undefined && r.params[k] !== "" ? r.params[k] : def.params[k].v); return { def, actif: r.actif !== false, dest: Array.isArray(r.dest) ? r.dest : def.dest, params }; };
  const nums = s => String(s == null ? "" : s).split(/[,; ]+/).map(Number).filter(n => !isNaN(n));
  const journal = e => { try { fs.appendFileSync(JRN_F, JSON.stringify(Object.assign({ ts: new Date().toISOString() }, e)) + "\n"); } catch (x) { } };

  /* ---------------------------------------------------------------- calculs de la plateforme (bac à sable) */
  let sbx = null;
  function moteur(data) {
    if (!sbx) {
      const noop = () => { }, el = { addEventListener: noop, classList: { add: noop, remove: noop, toggle: noop }, style: {} };
      sbx = vm.createContext({ window: {}, document: { addEventListener: noop, createElement: () => el, querySelector: () => el, querySelectorAll: () => [], activeElement: null, body: el }, localStorage: undefined, console, setTimeout, clearTimeout, Intl, Date, Math, JSON });
      for (const f of ["core.js", "analytics.js"]) vm.runInContext(fs.readFileSync(path.join(APP, "js", f), "utf8"), sbx, { filename: f });
    }
    sbx.__d = data; vm.runInContext("S = normalize(JSON.parse(__d)); __d = null;", sbx);
    return expr => vm.runInContext(expr, sbx);
  }

  /* ---------------------------------------------------------------- dates (fuseau Europe/Zurich) */
  const TZ = "Europe/Zurich";
  function maintenant() {
    const p = Object.fromEntries(new Intl.DateTimeFormat("fr-CH", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false, weekday: "short" }).formatToParts(new Date()).map(x => [x.type, x.value]));
    const date = `${p.year}-${p.month}-${p.day}`, wd = new Date(Date.UTC(+p.year, +p.month - 1, +p.day)).getUTCDay();
    return { date, heure: `${p.hour === "24" ? "00" : p.hour}:${p.minute}`, jour: wd };
  }
  const pdU = s => { if (!s) return null; const m = String(s).match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? Date.UTC(+m[1], +m[2] - 1, +m[3]) : null; };
  const ecart = (a, b) => Math.round((pdU(b) - pdU(a)) / 864e5);
  const fdx = s => { const m = String(s || "").match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? `${m[3]}.${m[2]}.${m[1]}` : "—"; };
  const JOURS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
  const MOIS = { janv: 1, jan: 1, janvier: 1, fevr: 2, fev: 2, fevrier: 2, mars: 3, mar: 3, avr: 4, avril: 4, mai: 5, juin: 6, juil: 7, juillet: 7, aout: 8, sept: 9, sep: 9, septembre: 9, oct: 10, octobre: 10, nov: 11, novembre: 11, dec: 12, decembre: 12 };
  function debutPeriode(b) {
    const s = String(b.periode || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""), y = (s.match(/20\d\d/) || [String(b.annee || "")])[0];
    if (!/^20\d\d$/.test(y)) return null;
    const m = s.match(/[a-z]+/); const mo = m && MOIS[m[0]] ? MOIS[m[0]] : 1;
    return `${y}-${String(mo).padStart(2, "0")}-01`;
  }
  function horsEnvoi(n) {
    const c = cfg.calendrier;
    if (c.pauseDu && c.pauseAu && n.date >= c.pauseDu && n.date <= c.pauseAu) return true;
    return String(c.joursSansEnvoi || "").split(/[\s,;]+/).filter(Boolean).includes(n.date);
  }

  /* ---------------------------------------------------------------- destinataires */
  const normMails = v => (Array.isArray(v) ? v : String(v || "").split(/[\s,;]+/)).map(x => String(x).trim().toLowerCase()).filter(x => /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/.test(x));
  const mailsRole = code => normMails((cfg.destinataires.roles || {})[code]);
  const mailsPilotage = () => [...new Set((cfg.destinataires.pilotage || []).flatMap(mailsRole))];
  const mailsAdmins = () => normMails(cfg.destinataires.admins);
  const mailsCopie = () => normMails(cfg.destinataires.copie);
  function cibles(rg, respRole, extra) {
    const out = new Set();
    rg.dest.forEach(d => {
      if (d === "responsable" && respRole) mailsRole(respRole).forEach(m => out.add(m));
      if (d === "pilotage") mailsPilotage().forEach(m => out.add(m));
      if (d === "admins") mailsAdmins().forEach(m => out.add(m));
      if (d === "copie") mailsCopie().forEach(m => out.add(m));
      if (d === "auteur" && extra && extra.auteur) extra.auteur.forEach(m => out.add(m));
    });
    return out;
  }
  const rythme = m => (cfg.preferences[m] && cfg.preferences[m].rythme) || "complet";

  /* ---------------------------------------------------------------- règles quotidiennes */
  function evaluerQuotidien(A, today, opts) {
    opts = opts || {};
    const S = A("S"), items = [], fd = fdx, rs = c => A(`roleShort(${JSON.stringify(c || "")})`);
    const add = (id, respRole, it, extra) => { const rg = regle(id); if (!rg.actif) return; it.regle = id; it.cat = rg.def.cat; it.dest = cibles(rg, respRole, extra); if (it.escalade) mailsPilotage().forEach(m => it.dest.add(m)); items.push(it); };
    const dd = d => ecart(today, d);
    const rel = (n, j0, f) => n >= j0 && (n - j0) % Math.max(1, f) === 0;
    const quand = n => n === 0 ? "aujourd'hui" : n === 1 ? "demain" : `dans ${n} j`;
    const done = t => t.statut === "Terminé";
    // Tâches
    let r = regle("tache_echeance"); const rp = nums(r.params.rappels);
    S.taches.filter(t => !done(t) && t.fin && rp.includes(dd(t.fin))).forEach(t => add("tache_echeance", t.responsable, { niv: dd(t.fin) === 0 ? 3 : 2, ref: t.id, lien: "taches/" + t.id, titre: t.nom, detail: `Échéance ${quand(dd(t.fin))} (${fd(t.fin)}) · avancement ${t.avancement || 0} % · ${rs(t.responsable)}` }));
    r = regle("tache_retard");
    S.taches.filter(t => !done(t) && t.fin && dd(t.fin) < 0).forEach(t => { const L = -dd(t.fin); if (L === 1 || L % Math.max(1, +r.params.frequence) === 0) add("tache_retard", t.responsable, { niv: 3, ref: t.id, lien: "taches/" + t.id, titre: t.nom, detail: `En retard de ${L} j (échéance ${fd(t.fin)}) · avancement ${t.avancement || 0} % · ${rs(t.responsable)}`, escalade: L >= +r.params.escalade }); });
    r = regle("tache_non_demarree");
    S.taches.filter(t => t.statut === "À faire" && !(+t.avancement) && t.debut && dd(t.debut) < 0).forEach(t => { const L = -dd(t.debut); if (rel(L, +r.params.jours, 7)) add("tache_non_demarree", t.responsable, { niv: 2, ref: t.id, lien: "taches/" + t.id, titre: t.nom, detail: `Devait démarrer le ${fd(t.debut)} (il y a ${L} j), toujours « À faire » · ${rs(t.responsable)}` }); });
    // Jalons
    r = regle("gate_approche"); const rg = nums(r.params.rappels);
    S.jalons.filter(j => j.type === "Gate" && j.statut !== "Validé" && rg.includes(dd(j.date))).forEach(j => {
      const crit = (j.criteres || []).filter(c => !c.ok), livr = S.documents.filter(d => d.livrable && d.phase === j.phase && d.statut !== "Validé");
      add("gate_approche", null, { niv: dd(j.date) <= 7 ? 3 : 2, ref: j.id, lien: "jalons", titre: `${j.nom} — ${fd(j.date)} (${quand(dd(j.date))})`, detail: `${(j.criteres || []).length - crit.length}/${(j.criteres || []).length} critères remplis · ${livr.length} livrable(s) non validé(s)`, liste: crit.map(c => "Critère : " + c.t).concat(livr.slice(0, 8).map(d => `Livrable ${d.id} : ${d.titre} (${d.statut})`)) });
    });
    r = regle("gate_non_valide");
    S.jalons.filter(j => j.type === "Gate" && j.statut !== "Validé" && dd(j.date) < 0).forEach(j => { const L = -dd(j.date); if (rel(L, 1, +r.params.frequence)) add("gate_non_valide", null, { niv: 3, ref: j.id, lien: "jalons", titre: j.nom, detail: `Date du gate dépassée de ${L} j (${fd(j.date)}), statut « ${j.statut || "—"} »` }); });
    // Décisions & questions
    r = regle("decision_attente");
    S.decisions.filter(d => ["À instruire", "Proposée"].includes(d.statut) && d.date).forEach(d => { const L = -dd(d.date); if (rel(L, +r.params.jours, +r.params.frequence)) add("decision_attente", d.decideur, { niv: 2, ref: d.id, lien: "decisions/" + d.id, titre: d.titre, detail: `« ${d.statut} » depuis ${L} j · décideur : ${rs(d.decideur)}` }); });
    r = regle("decision_reexamen"); const rr = nums(r.params.rappels);
    S.decisions.filter(d => d.statut === "Validée" && d.dateReexamen && rr.includes(dd(d.dateReexamen))).forEach(d => add("decision_reexamen", d.decideur, { niv: 2, ref: d.id, lien: "decisions/" + d.id, titre: d.titre, detail: `Réexamen prévu ${quand(dd(d.dateReexamen))} (${fd(d.dateReexamen)}) · critères : ${String(d.reexamen || "—").slice(0, 160)}` }));
    r = regle("question_sans_reponse");
    S.questions.filter(q => ["Ouverte", "En analyse"].includes(q.statut) && q.date).forEach(q => { const L = -dd(q.date); if (rel(L, +r.params.jours, +r.params.frequence)) add("question_sans_reponse", q.responsable, { niv: 2, ref: q.id, lien: "questions/" + q.id, titre: String(q.question).slice(0, 140), detail: `Posée le ${fd(q.date)}, sans réponse depuis ${L} j · doit répondre : ${rs(q.responsable)}` }); });
    // Risques
    r = regle("risque_revue");
    S.risques.filter(x => x.statut !== "Clos" && x.prochaineRevue).forEach(x => { const n = dd(x.prochaineRevue); if (n === 0 || (n < 0 && -n % Math.max(1, +r.params.frequence) === 0)) add("risque_revue", x.proprietaire, { niv: n < 0 ? 2 : 1, ref: x.id, lien: "risques/" + x.id, titre: x.titre, detail: n === 0 ? "Revue prévue aujourd'hui" : `Revue en retard de ${-n} j (prévue le ${fd(x.prochaineRevue)})` }); });
    r = regle("risque_proximite");
    S.risques.filter(x => x.statut !== "Clos" && x.proximite && dd(x.proximite) === +r.params.jours).forEach(x => add("risque_proximite", x.proprietaire, { niv: 2, ref: x.id, lien: "risques/" + x.id, titre: x.titre, detail: `Fenêtre d'occurrence le ${fd(x.proximite)} · signal d'alerte : ${String(x.declencheur || "—").slice(0, 160)}` }));
    // Actions
    r = regle("action_echeance"); const ra = nums(r.params.rappels);
    S.actions.filter(a => ["Ouvert", "En cours"].includes(a.statut) && a.echeance).forEach(a => { const n = dd(a.echeance); if (ra.includes(n)) add("action_echeance", a.responsable, { niv: n === 0 ? 3 : 2, ref: a.id, lien: "actions/" + a.id, titre: a.titre, detail: `Échéance ${quand(n)} (${fd(a.echeance)})` }); else if (n < 0 && (-n === 1 || -n % Math.max(1, +r.params.frequence) === 0)) add("action_echeance", a.responsable, { niv: 3, ref: a.id, lien: "actions/" + a.id, titre: a.titre, detail: `En retard de ${-n} j (échéance ${fd(a.echeance)})` }); });
    // Budget
    r = regle("budget_echeance"); const rb = nums(r.params.rappels);
    String(r.params.echeances || "").split("\n").map(l => l.split("|")).filter(x => /^\d{4}-\d{2}-\d{2}$/.test((x[0] || "").trim())).forEach(([d, lib]) => { d = d.trim(); if (rb.includes(dd(d))) add("budget_echeance", null, { niv: dd(d) <= 3 ? 3 : 2, ref: "Budget", lien: "budget", titre: (lib || "Échéance budgétaire").trim(), detail: `Échéance ${quand(dd(d))} (${fd(d)})` }); });
    r = regle("budget_achat"); const ref = A("refScenario()");
    S.budget.filter(b => !["Engagé", "Consommé", "Abandonné"].includes(b.statut) && String(b.scenarios || "").split(/,\s*/).includes(ref)).forEach(b => { const d0 = debutPeriode(b); if (d0 && dd(d0) === +r.params.jours) add("budget_achat", null, { niv: 2, ref: b.id, lien: "budget", titre: b.poste, detail: `Dépense prévue à partir du ${fd(d0)} (${b.periode || b.annee}) · CHF ${Math.round(+b.prevu || 0).toLocaleString("fr-CH")} · statut « ${b.statut || "—"} »` }); });
    // Consultant
    r = regle("consultant_revue");
    S.taches.filter(t => t.responsable === r.params.role && !done(t) && t.debut && dd(t.debut) === +r.params.jours).forEach(t => add("consultant_revue", t.responsable, { niv: 2, ref: t.id, lien: "taches/" + t.id, titre: t.nom, detail: `Revue du ${fd(t.debut)} au ${fd(t.fin)} : transmettre les livrables à revoir et planifier la séance.` }));
    r = regle("consultant_reco");
    S.jalons.filter(j => j.statut !== "Validé" && dd(j.date) === +r.params.jours && (j.criteres || []).some(c => !c.ok && /revue experte externe/i.test(c.t))).forEach(j => add("consultant_reco", null, { niv: 3, ref: j.id, lien: "jalons", titre: `${j.id} ${j.nom} — ${fd(j.date)}`, detail: "Critère « Revue experte externe réalisée et recommandations bloquantes traitées » non rempli." }));
    // Design System
    r = regle("ds_version");
    S.dsVersions.filter(v => ["Planifiée", "En cours", "En revue"].includes(v.statut) && v.date && dd(v.date) === +r.params.jours).forEach(v => add("ds_version", null, { niv: 2, ref: v.version || v.id, lien: "ds", titre: `Design System ${v.version || v.id}`, detail: `Prévue le ${fd(v.date)} · statut « ${v.statut} » · ${String(v.resume || "").slice(0, 120)}` }));
    // Documents
    r = regle("livrable_prevu");
    S.documents.filter(d => d.livrable && d.statut === "Prévu").forEach(d => { const ph = S.phases.find(p => p.id === d.phase); if (ph && ph.fin && dd(ph.fin) === +r.params.jours) add("livrable_prevu", d.responsable, { niv: 2, ref: d.id, lien: "documents/" + d.id, titre: d.titre, detail: `Phase ${ph.id} se termine le ${fd(ph.fin)} ; livrable toujours « Prévu »` }); });
    r = regle("document_revue");
    S.documents.filter(d => d.statut === "En revue" && d.date).forEach(d => { const L = -dd(d.date); if (rel(L, +r.params.jours, 7)) add("document_revue", d.responsable, { niv: 2, ref: d.id, lien: "documents/" + d.id, titre: d.titre, detail: `En revue depuis ${L} j (${fd(d.date)})` }); });
    // Rapports & pilotage
    const n = opts.n || maintenant();
    if (n.jour === 1) { const prev = A(`(() => { const w = isoWeek(pd(${JSON.stringify(today)}) - 7 * DAY); return w.year + "-S" + String(w.week).padStart(2, "0"); })()`); if (!S.rapports.some(x => x.id === prev)) add("rapport_manquant", null, { niv: 2, ref: prev, lien: "rapports", titre: `Rapport hebdomadaire ${prev}`, detail: "Aucun rapport enregistré pour la semaine précédente." }); }
    r = regle("sauvegarde_mensuelle");
    if (+today.slice(8, 10) === +r.params.jour) add("sauvegarde_mensuelle", null, { niv: 1, ref: "Sauvegarde", lien: "donnees", titre: "Export JSON mensuel", detail: "Données & paramètres → Exporter JSON, puis déposer le fichier dans 00_PILOTAGE/Tableau-de-bord/data/sauvegardes/." });
    return items;
  }

  /* Plan des N prochains jours (lundi) */
  function evaluerPlan(A, today) {
    const S = A("S"), rg = regle("plan_hebdo"), H = +rg.params.horizon || 14, items = [], fd = fdx, rs = c => A(`roleShort(${JSON.stringify(c || "")})`);
    const inH = d => d && ecart(today, d) >= 0 && ecart(today, d) <= H;
    const add = (respRole, it) => { it.regle = "plan_hebdo"; it.dest = cibles(rg, respRole); items.push(it); };
    S.taches.filter(t => t.statut !== "Terminé" && inH(t.fin)).sort((a, b) => a.fin < b.fin ? -1 : 1).forEach(t => add(t.responsable, { cat: "Échéances des tâches", niv: 2, ref: t.id, lien: "taches/" + t.id, titre: t.nom, detail: `Fin ${fd(t.fin)} · ${t.avancement || 0} % · ${rs(t.responsable)}` }));
    S.taches.filter(t => t.statut === "À faire" && inH(t.debut)).forEach(t => add(t.responsable, { cat: "Tâches qui démarrent", niv: 1, ref: t.id, lien: "taches/" + t.id, titre: t.nom, detail: `Début ${fd(t.debut)} · ${rs(t.responsable)}` }));
    S.taches.filter(t => t.statut !== "Terminé" && t.fin && ecart(today, t.fin) < 0).forEach(t => add(t.responsable, { cat: "En retard", niv: 3, ref: t.id, lien: "taches/" + t.id, titre: t.nom, detail: `Échéance ${fd(t.fin)} · ${t.avancement || 0} % · ${rs(t.responsable)}` }));
    S.jalons.filter(j => j.statut !== "Validé" && j.date && ecart(today, j.date) >= 0 && ecart(today, j.date) <= Math.max(30, H)).forEach(j => add(null, { cat: "Jalons", niv: 2, ref: j.id, lien: "jalons", titre: j.nom, detail: `${fd(j.date)}${(j.criteres || []).length ? ` · ${(j.criteres || []).filter(c => c.ok).length}/${j.criteres.length} critères remplis` : ""}` }));
    S.actions.filter(a => ["Ouvert", "En cours"].includes(a.statut) && a.echeance && ecart(today, a.echeance) <= H).forEach(a => add(a.responsable, { cat: "Actions", niv: ecart(today, a.echeance) < 0 ? 3 : 2, ref: a.id, lien: "actions/" + a.id, titre: a.titre, detail: `Échéance ${fd(a.echeance)} · ${rs(a.responsable)}` }));
    S.decisions.filter(d => ["À instruire", "Proposée"].includes(d.statut)).forEach(d => add(null, { cat: "Décisions à obtenir", niv: 2, ref: d.id, lien: "decisions/" + d.id, titre: d.titre, detail: `« ${d.statut} » depuis le ${fd(d.date)}` }));
    S.questions.filter(q => ["Ouverte", "En analyse"].includes(q.statut)).forEach(q => add(q.responsable, { cat: "Questions ouvertes", niv: 1, ref: q.id, lien: "questions/" + q.id, titre: String(q.question).slice(0, 140), detail: `Doit répondre : ${rs(q.responsable)}` }));
    return items;
  }

  /* ---------------------------------------------------------------- règles immédiates (déclenchées sur fronts) */
  function evaluerFronts(A, silencieux) {
    const S = A("S"), items = [], fd = fdx, rs = c => A(`roleShort(${JSON.stringify(c || "")})`);
    const vus = {}, front = (cle, cond) => { vus[cle] = true; const avant = !!etat.fronts[cle]; if (cond) etat.fronts[cle] = true; else delete etat.fronts[cle]; return cond && !avant; };
    const add = (id, respRole, it, extra) => { const rg = regle(id); if (!rg.actif || silencieux) return; it.regle = id; it.cat = rg.def.cat; it.dest = cibles(rg, respRole, extra); items.push(it); };
    // responsables des tâches
    const resp = {}; S.taches.forEach(t => { resp[t.id] = t.responsable || ""; if (etat.init && etat.resp[t.id] !== undefined && t.responsable && etat.resp[t.id] !== t.responsable && t.statut !== "Terminé") add("tache_assignee", t.responsable, { niv: 2, ref: t.id, lien: "taches/" + t.id, titre: t.nom, detail: `Vous êtes désormais responsable (${rs(t.responsable)}${etat.resp[t.id] ? ", auparavant " + rs(etat.resp[t.id]) : ""}) · ${fd(t.debut)} → ${fd(t.fin)}` }); else if (etat.init && etat.resp[t.id] === undefined && t.responsable) add("tache_assignee", t.responsable, { niv: 2, ref: t.id, lien: "taches/" + t.id, titre: t.nom, detail: `Nouvelle tâche qui vous est confiée · ${fd(t.debut)} → ${fd(t.fin)}` }); });
    etat.resp = resp;
    S.taches.forEach(t => { if (front("bloq:" + t.id, t.statut === "Bloqué")) add("tache_bloquee", t.responsable, { niv: 3, ref: t.id, lien: "taches/" + t.id, titre: t.nom, detail: `Statut « Bloqué » · ${rs(t.responsable)}${t.notes ? " · " + String(t.notes).slice(0, 160) : ""}` }); });
    const byId = {}; S.taches.forEach(t => byId[t.id] = t);
    S.taches.forEach(t => { const deps = String(t.dependances || "").split(/[,; ]+/).filter(Boolean); const ok = deps.length && t.statut === "À faire" && deps.every(d => byId[d] && byId[d].statut === "Terminé"); if (front("pret:" + t.id, !!ok)) add("tache_debloquee", t.responsable, { niv: 2, ref: t.id, lien: "taches/" + t.id, titre: t.nom, detail: `Les tâches préalables (${deps.join(", ")}) sont terminées : la tâche peut démarrer (début prévu ${fd(t.debut)}).` }); });
    // dérive des gates
    let rg = regle("jalon_derive");
    try { const G = A("gateForecasts()"); G.filter(g => g.j.type === "Gate" && g.j.statut !== "Validé").forEach(g => { const c = g.derive >= +rg.params.seuilDerive || g.pct >= +rg.params.seuilMarge; if (front("derive:" + g.j.id, c)) add("jalon_derive", null, { niv: 3, ref: g.j.id, lien: "jalons", titre: g.j.nom, detail: `Prévision ${fd(g.fc)} (gate ${fd(g.j.date)}) · marge consommée ${g.pct} % (${g.conso}/${g.marge} j)${g.derive > 0 ? ` · dérive ${g.derive} j vs baseline` : ""}` }); }); } catch (e) { console.error("notifications : prévisions", e.message); }
    // questions répondues
    S.questions.forEach(q => { if (front("rep:" + q.id, ["Répondue", "Transformée en décision"].includes(q.statut))) { const au = String(q.auteur || "").trim(), extra = { auteur: normMails(au).length ? normMails(au) : S.roles.filter(r => r.code === au || (r.personne && au && r.personne.includes(au))).flatMap(r => mailsRole(r.code)) }; add("question_repondue", q.responsable, { niv: 1, ref: q.id, lien: "questions/" + q.id, titre: String(q.question).slice(0, 140), detail: `Réponse : ${String(q.reponse || q.decision || "—").slice(0, 300)}` }, extra); } });
    // risques critiques
    rg = regle("risque_critique");
    S.risques.forEach(x => { const sc = (+x.proba || 0) * (+x.impact || 0); if (front("crit:" + x.id, x.statut !== "Clos" && sc >= +rg.params.seuil)) add("risque_critique", x.proprietaire, { niv: 3, ref: x.id, lien: "risques/" + x.id, titre: x.titre, detail: `Score ${sc} (probabilité ${x.proba} × impact ${x.impact}) · mitigation : ${String(x.mitigation || "à définir").slice(0, 160)}` }); });
    // budget
    rg = regle("budget_seuil");
    try { const B = A("budgetCalc(S.meta.budgetAnnee || 2027)"); const pct = B.total ? B.eng / B.total * 100 : 0; nums(rg.params.seuils).forEach(s => { if (front(`bud:${B.annee}:${s}`, pct >= s)) add("budget_seuil", null, { niv: s >= 80 ? 3 : 2, ref: "Budget " + B.annee, lien: "budget", titre: `${Math.round(pct)} % du budget ${B.annee} engagé`, detail: `CHF ${Math.round(B.eng).toLocaleString("fr-CH")} engagés sur CHF ${Math.round(B.total).toLocaleString("fr-CH")} (scénario ${B.ref}) · seuil ${s} % franchi` }); }); } catch (e) { }
    S.budget.forEach(b => { if (front("post:" + b.id, (+b.prevu || 0) > 0 && (+b.engage || 0) > (+b.prevu || 0))) add("budget_poste_depasse", null, { niv: 3, ref: b.id, lien: "budget", titre: b.poste, detail: `Engagé CHF ${Math.round(+b.engage).toLocaleString("fr-CH")} pour CHF ${Math.round(+b.prevu).toLocaleString("fr-CH")} prévus` }); });
    // Design System : nouveautés
    rg = regle("ds_demande");
    S.dsDemandes.concat(S.dsBesoins).forEach(x => { const k = "ds:" + x.id; if (!etat.existants[k]) { etat.existants[k] = 1; if (etat.init) add("ds_demande", rg.params.role, { niv: 2, ref: x.id, lien: "ds", titre: x.titre || String(x.besoin || "").slice(0, 140), detail: x.type ? `${x.type} · demandeur : ${x.demandeur || "—"}` : `Besoin ${x.categorie || ""} · ${x.statutSuivi || ""}` }); } });
    Object.keys(etat.fronts).forEach(k => { if (!vus[k]) delete etat.fronts[k]; });
    etat.init = true;
    return items;
  }

  /* ---------------------------------------------------------------- mise en forme des e-mails */
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const base = () => String(cfg.urlPlateforme || "").replace(/\/+$/, "");
  const lienAbs = l => base() ? `${base()}/#${l.includes("/") ? "ouvrir/" + l : l}` : "";
  const ORDRE_CAT = ["En retard", "Échéances des tâches", "Tâches qui démarrent", "Jalons", "Actions", "Décisions à obtenir", "Questions ouvertes"].concat(CATALOGUE.map(c => c.cat));
  function composer(type, items, dateIso) {
    const nb3 = items.filter(i => i.niv === 3).length;
    const groupes = {}; items.forEach(i => (groupes[i.cat] = groupes[i.cat] || []).push(i));
    const cats = Object.keys(groupes).sort((a, b) => ORDRE_CAT.indexOf(a) - ORDRE_CAT.indexOf(b));
    const jour = JOURS[new Date(pdU(dateIso)).getUTCDay()];
    const titres = { quotidien: `Résumé du ${jour} ${fdx(dateIso)}`, hebdo: `Planification de la semaine — ${jour} ${fdx(dateIso)}`, immediat: items.length === 1 ? `${items[0].ref} — ${CATALOGUE.find(c => c.id === items[0].regle).titre}` : `${items.length} alertes : ${[...new Set(items.map(i => i.ref))].slice(0, 4).join(", ")}${items.length > 4 ? "…" : ""}`, rapport: "Rapport hebdomadaire à rédiger", test: "E-mail de test", securite: "Sécurité de la plateforme" };
    const resumeNb = type === "quotidien" || type === "hebdo" ? ` — ${items.length} point${items.length > 1 ? "s" : ""}${nb3 ? `, dont ${nb3} urgent${nb3 > 1 ? "s" : ""}` : ""}` : "";
    const sujet = `${cfg.prefixeSujet ? cfg.prefixeSujet + " " : ""}${type === "immediat" && nb3 ? "⚠ " : ""}${titres[type] || type}${resumeNb}`;
    const coul = { 3: "#b3261e", 2: "#00354c", 1: "#5b7383" };
    let html = `<!doctype html><html lang="fr"><body style="margin:0;background:#e7f3fd;font-family:Arial,Helvetica,sans-serif;color:#0b1f2a"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#e7f3fd;padding:24px 12px"><tr><td align="center"><table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden">
<tr><td style="background:#00354c;color:#ffffff;padding:20px 28px"><div style="font-size:13px;opacity:.8">Refonte de l'écosystème web HEP Vaud · Plateforme de pilotage</div><div style="font-family:Georgia,serif;font-size:24px;margin-top:6px">${esc(titres[type] || type)}</div></td></tr><tr><td style="padding:20px 28px">`;
    let text = `${titres[type] || type}\nRefonte de l'écosystème web HEP Vaud — plateforme de pilotage\n\n`;
    if (type === "quotidien" || type === "hebdo") { html += `<p style="font-size:15px;margin:0 0 16px">${items.length} point${items.length > 1 ? "s" : ""} à suivre${nb3 ? ` · <b style="color:#b3261e">${nb3} urgent${nb3 > 1 ? "s" : ""}</b>` : ""}.</p>`; }
    cats.forEach(c => {
      html += `<h2 style="font-family:Georgia,serif;font-weight:400;font-size:19px;margin:22px 0 8px;color:#000">${esc(c)}</h2>`; text += `\n== ${c} ==\n`;
      groupes[c].sort((a, b) => b.niv - a.niv).forEach(i => {
        const l = lienAbs(i.lien || "");
        html += `<div style="border-left:4px solid ${coul[i.niv] || coul[2]};padding:8px 12px;margin:0 0 10px;background:#f6fafd;border-radius:0 8px 8px 0"><div style="font-size:15px"><b>${esc(i.ref)}</b> · ${esc(i.titre)}${i.niv === 3 ? ` <span style="color:#b3261e;font-size:12px;font-weight:bold">${NIV[3].toUpperCase()}</span>` : ""}</div><div style="font-size:13.5px;color:#3d5563;margin-top:3px">${esc(i.detail || "")}</div>${i.liste && i.liste.length ? `<ul style="font-size:13px;color:#3d5563;margin:6px 0 0;padding-left:18px">${i.liste.map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}${l ? `<div style="margin-top:6px"><a href="${esc(l)}" style="color:#00354c;font-size:13px">Ouvrir dans la plateforme →</a></div>` : ""}</div>`;
        text += `- ${i.niv === 3 ? "[URGENT] " : ""}${i.ref} · ${i.titre}\n  ${i.detail || ""}\n${(i.liste || []).map(x => "  · " + x + "\n").join("")}${l ? "  " + l + "\n" : ""}`;
      });
    });
    const ouvrir = base() ? `<p style="margin:24px 0 0"><a href="${esc(base())}/" style="display:inline-block;background:#00354c;color:#fff;text-decoration:none;padding:10px 18px;border-radius:30px;font-size:14px">Ouvrir la plateforme</a></p>` : "";
    html += `${ouvrir}</td></tr><tr><td style="padding:16px 28px;background:#f6fafd;font-size:12px;color:#5b7383">Message automatique de la plateforme de pilotage (${esc(fdx(dateIso))}). Ne pas répondre${cfg.smtp.repondreA ? ` — contact : ${esc(cfg.smtp.repondreA)}` : ""}. Réglages des notifications : Console d'administration de la plateforme.</td></tr></table></td></tr></table></body></html>`;
    text += `\n${base() ? "Plateforme : " + base() + "/\n" : ""}Message automatique de la plateforme de pilotage. Réglages : Console d'administration.\n`;
    return { sujet, html, text };
  }
  function parDestinataire(items) { const m = {}; items.forEach(i => (i.dest || new Set()).forEach(e => (m[e] = m[e] || []).push(i))); return m; }

  /* ---------------------------------------------------------------- client SMTP */
  function encodeMot(s) {
    s = String(s || ""); if (/^[\x20-\x7e]*$/.test(s)) return s;
    const morceaux = []; let cur = "";
    for (const ch of s) { if (Buffer.byteLength(cur + ch) > 45) { morceaux.push(cur); cur = ""; } cur += ch; }
    if (cur) morceaux.push(cur);
    return morceaux.map(m => "=?UTF-8?B?" + Buffer.from(m).toString("base64") + "?=").join("\r\n ");
  }
  const b64l = s => Buffer.from(s, "utf8").toString("base64").replace(/.{1,76}/g, "$&\r\n");
  function message({ to, sujet, html, text }) {
    const s = cfg.smtp, dom = (s.expediteur.split("@")[1] || "localhost"), bd = "b_" + crypto.randomBytes(12).toString("hex");
    const h = [`From: ${encodeMot(s.nomExpediteur || "Plateforme de pilotage")} <${s.expediteur}>`, `To: <${to}>`, s.repondreA ? `Reply-To: <${s.repondreA}>` : null, `Subject: ${encodeMot(sujet)}`, `Date: ${new Date().toUTCString().replace("GMT", "+0000")}`, `Message-ID: <${crypto.randomUUID()}@${dom}>`, "MIME-Version: 1.0", "Auto-Submitted: auto-generated", "X-Auto-Response-Suppress: All", `Content-Type: multipart/alternative; boundary="${bd}"`].filter(Boolean);
    return h.join("\r\n") + "\r\n\r\n" + `--${bd}\r\nContent-Type: text/plain; charset=utf-8\r\nContent-Transfer-Encoding: base64\r\n\r\n${b64l(text)}--${bd}\r\nContent-Type: text/html; charset=utf-8\r\nContent-Transfer-Encoding: base64\r\n\r\n${b64l(html)}--${bd}--\r\n`;
  }
  function lecteur(sock) {
    let buf = "", q = [], err = null;
    const feed = () => { while (q.length) { const m = buf.match(/(?:^|\r\n)(\d{3}) [^\r\n]*\r\n/); if (!m) return; const end = m.index + m[0].length, txt = buf.slice(0, end); buf = buf.slice(end); q.shift().ok({ code: +m[1], txt: txt.trim() }); } };
    const onData = d => { buf += d.toString("utf8"); feed(); }, onErr = e => { err = e; q.splice(0).forEach(w => w.ko(e)); };
    const onClose = () => onErr(err || new Error("Connexion fermée par le serveur SMTP"));
    sock.on("data", onData); sock.on("error", onErr); sock.on("close", onClose);
    return { lire: () => new Promise((ok, ko) => { if (err) return ko(err); q.push({ ok, ko }); feed(); }), detacher: () => { sock.removeListener("data", onData); sock.removeListener("error", onErr); sock.removeListener("close", onClose); } };
  }
  async function smtpEnvoyer(dests) { // dests : [{ to, sujet, html, text }] — une seule connexion
    const s = cfg.smtp, host = String(s.hote || "").trim(), port = +s.port || 465, pw = motDePasse();
    if (!host || !s.expediteur) throw new Error("Serveur SMTP ou adresse d'expédition non configuré.");
    let sock = s.securite === "ssl" ? tls.connect({ host, port, servername: host }) : net.connect({ host, port });
    sock.setTimeout(30000, () => sock.destroy(new Error("Délai de connexion SMTP dépassé")));
    let L = lecteur(sock);
    const attendre = async (codes) => { const r = await L.lire(); if (!codes.includes(r.code)) throw new Error(`SMTP ${r.code} : ${r.txt.split("\r\n").pop()}`); return r; };
    const cmd = (c, codes) => { sock.write(c + "\r\n"); return attendre(codes); };
    const resultats = [];
    try {
      await attendre([220]);
      const nom = (s.expediteur.split("@")[1] || "localhost");
      let eh = await cmd("EHLO " + nom, [250]);
      if (s.securite === "starttls") {
        await cmd("STARTTLS", [220]); L.detacher();
        sock = await new Promise((ok, ko) => { const t = tls.connect({ socket: sock, servername: host }, () => ok(t)); t.on("error", ko); });
        sock.setTimeout(30000, () => sock.destroy(new Error("Délai SMTP dépassé"))); L = lecteur(sock);
        eh = await cmd("EHLO " + nom, [250]);
      }
      if (s.utilisateur) {
        if (s.securite === "aucune" && !/^(127\.|localhost)/.test(host)) throw new Error("Authentification refusée sans chiffrement (choisir SSL/TLS ou STARTTLS).");
        if (/AUTH[ =][^\r\n]*PLAIN/i.test(eh.txt)) await cmd("AUTH PLAIN " + Buffer.from(`\0${s.utilisateur}\0${pw}`).toString("base64"), [235]);
        else { await cmd("AUTH LOGIN", [334]); await cmd(Buffer.from(s.utilisateur).toString("base64"), [334]); await cmd(Buffer.from(pw).toString("base64"), [235]); }
      }
      for (const d of dests) {
        try {
          await cmd(`MAIL FROM:<${s.expediteur}>`, [250]);
          await cmd(`RCPT TO:<${d.to}>`, [250, 251]);
          await cmd("DATA", [354]);
          sock.write(message(d) + "\r\n.\r\n"); await attendre([250]);
          resultats.push({ to: d.to, ok: true });
        } catch (e) { resultats.push({ to: d.to, ok: false, erreur: e.message }); try { await cmd("RSET", [250]); } catch (x) { throw e; } }
      }
      try { await cmd("QUIT", [221]); } catch (e) { }
    } finally { try { sock.end(); } catch (e) { } }
    return resultats;
  }

  /* ---------------------------------------------------------------- envois */
  let enCours = Promise.resolve();
  const enFile = f => (enCours = enCours.then(f, f));
  async function expedier(type, parDest, meta) {
    const msgs = Object.entries(parDest).filter(([, its]) => its.length || type === "test" || type === "rapport").map(([to, its]) => Object.assign({ to, n: its.length, regles: [...new Set(its.map(i => i.regle))] }, composer(type, its, meta.date)));
    if (!msgs.length) return [];
    let res;
    try { res = await smtpEnvoyer(msgs); } catch (e) { res = msgs.map(m => ({ to: m.to, ok: false, erreur: e.message })); }
    res.forEach((r, k) => journal({ type, to: r.to, sujet: msgs[k].sujet, n: msgs[k].n, regles: msgs[k].regles, ok: r.ok, erreur: r.erreur || "" }));
    const ko = res.filter(r => !r.ok); if (ko.length) console.error(`Notifications ${type} : ${ko.length} échec(s) — ${ko[0].erreur}`);
    return res;
  }
  function etatDonnees() { const s = store.get(); return s ? s.data : null; }

  function calculerQuotidien(n, forcer) {
    const data = etatDonnees(); if (!data) return { type: "quotidien", parDest: {} };
    const A = moteur(data), plan = regle("plan_hebdo").actif && n.jour === +cfg.calendrier.jourPlan;
    let items = regle("resume_quotidien").actif || forcer === "quotidien" ? evaluerQuotidien(A, n.date, { n }) : [];
    let type = "quotidien";
    if ((plan && forcer !== "quotidien") || forcer === "hebdo") { type = "hebdo"; items = items.map(i => Object.assign(i, { cat: "À traiter aujourd'hui · " + i.cat })).concat(evaluerPlan(A, n.date)); }
    const pd = parDestinataire(items), out = {};
    Object.entries(pd).forEach(([m, its]) => { const r = rythme(m); if (r === "aucun" || r === "immediat") return; if (r === "hebdo" && type !== "hebdo") return; const rep = (etat.reportes[m] || []).map(i => Object.assign({}, i, { cat: "Alertes depuis le dernier résumé · " + i.cat })); out[m] = rep.concat(its); });
    Object.entries(etat.reportes || {}).forEach(([m, rep]) => { if (!out[m] && rep.length && ["sans-immediat"].includes(rythme(m))) out[m] = rep; });
    // dédoublonnage par élément (une même référence peut venir de deux règles)
    Object.keys(out).forEach(m => { const seen = new Set(); out[m] = out[m].filter(i => { const k = i.cat + "|" + i.ref + "|" + i.regle; if (seen.has(k)) return false; seen.add(k); return true; }); });
    return { type, parDest: out };
  }
  async function envoyerQuotidien(n, forcer) {
    const { type, parDest } = calculerQuotidien(n, forcer);
    const res = await expedier(type, parDest, { date: n.date });
    res.filter(r => r.ok).forEach(r => { delete etat.reportes[r.to]; });
    etat.dernier.resume = n.date; saveEtat();
    return res;
  }
  let minuteurFronts = null, frontsSilencieux = false;
  function evaluerEtEnvoyerFronts() {
    return enFile(async () => {
      const data = etatDonnees(); if (!data) return [];
      const n = maintenant(), A = moteur(data);
      const silence = !cfg.actif || frontsSilencieux || !etat.init;
      const items = evaluerFronts(A, silence); saveEtat();
      if (!items.length || horsEnvoi(n)) return [];
      const pd = parDestinataire(items), direct = {};
      Object.entries(pd).forEach(([m, its]) => { const r = rythme(m); if (r === "complet") direct[m] = its; else if (r === "sans-immediat") { etat.reportes[m] = (etat.reportes[m] || []).concat(its.map(i => Object.assign({}, i, { dest: undefined }))).slice(-50); } });
      saveEtat();
      return expedier("immediat", direct, { date: n.date });
    });
  }
  function changement() {
    clearTimeout(minuteurFronts);
    minuteurFronts = setTimeout(() => evaluerEtEnvoyerFronts().catch(e => console.error("notifications", e)), Math.max(0, +cfg.calendrier.delaiImmediat || 0) * 60e3);
  }
  function securite(evt, info) {
    const id = evt === "blocage" ? "securite_blocage" : "securite_compte", rg = regle(id);
    if (!cfg.actif || !rg.actif) return;
    const it = { regle: id, cat: rg.def.cat, niv: evt === "blocage" ? 3 : 2, ref: evt === "blocage" ? "Connexion" : "Compte", lien: "donnees", titre: info.titre, detail: info.detail, dest: cibles(rg, null) };
    const pd = parDestinataire([it]);
    enFile(() => expedier("immediat", pd, { date: maintenant().date })).catch(e => console.error("notifications", e));
  }

  /* ---------------------------------------------------------------- planificateur (chaque minute) */
  function tic() {
    if (!cfg.actif) return;
    const n = maintenant(), c = cfg.calendrier, hors = horsEnvoi(n), ouvre = n.jour >= 1 && n.jour <= 5;
    const fenetre = (h) => n.heure >= h && n.heure < String(Math.min(23, +h.slice(0, 2) + 4)).padStart(2, "0") + h.slice(2);
    const hResume = (+c.jourPlan === n.jour && regle("plan_hebdo").actif) ? c.heurePlan : c.heureResume;
    if (!hors && etat.dernier.resume !== n.date && (!c.joursOuvres || ouvre) && fenetre(hResume || "07:30")) { etat.dernier.resume = n.date; saveEtat(); enFile(() => envoyerQuotidien(n)).catch(e => console.error("notifications", e)); }
    if (!hors && regle("rapport_rappel").actif && n.jour === +c.jourRapport && etat.dernier.rapport !== n.date && fenetre(c.heureRapport || "14:00")) {
      etat.dernier.rapport = n.date; saveEtat();
      enFile(async () => { const data = etatDonnees(); if (!data) return; const A = moteur(data), S = A("S"), wk = A(`(() => { const w = isoWeek(pd(${JSON.stringify(n.date)})); return w.year + "-S" + String(w.week).padStart(2, "0"); })()`); if (S.rapports.some(r => r.id === wk)) return; const rg = regle("rapport_rappel"); const it = { regle: "rapport_rappel", cat: "Rapports & pilotage", niv: 2, ref: wk, lien: "rapports", titre: `Rapport hebdomadaire ${wk}`, detail: "Le brouillon est compilé automatiquement : compléter la météo, les faits marquants, les demandes au Copil et les remises en question, puis enregistrer.", dest: cibles(rg, null) }; return expedier("rapport", parDestinataire([it]), { date: n.date }); }).catch(e => console.error("notifications", e));
    }
  }
  setInterval(() => { try { tic(); } catch (e) { console.error("notifications", e); } }, 60e3).unref();
  setTimeout(() => { frontsSilencieux = !etat.init; evaluerEtEnvoyerFronts().then(() => { frontsSilencieux = false; }).catch(e => console.error("notifications", e)); }, 5000).unref();

  /* ---------------------------------------------------------------- API d'administration */
  function cfgPublique() {
    const c = JSON.parse(JSON.stringify(cfg)); c.smtp.motDePasseDefini = !!motDePasse(); c.smtp.motDePasseEnv = !!process.env.SMTP_PASSWORD; delete c.smtp.motDePasse; return c;
  }
  function apercu(type) {
    const data = etatDonnees(); if (!data) return [];
    const n = maintenant(); let parDest, t = type;
    if (type === "immediat") {
      const sauvegarde = JSON.stringify(etat); const A = moteur(data); const items = evaluerFronts(A, false); etat = JSON.parse(sauvegarde); // simulation, rien n'est enregistré
      parDest = parDestinataire(items);
    } else { const r = calculerQuotidien(n, type); parDest = r.parDest; t = r.type; }
    return Object.entries(parDest).map(([to, its]) => Object.assign({ to, n: its.length, rythme: rythme(to) }, composer(t, its, n.date)));
  }
  function sansDestinataire() { // rôles utilisés comme responsables sans adresse
    const data = etatDonnees(); if (!data) return [];
    const S = JSON.parse(data), used = new Set();
    S.taches.forEach(t => t.statut !== "Terminé" && t.responsable && used.add(t.responsable));
    S.actions.forEach(a => a.responsable && used.add(a.responsable)); S.risques.forEach(r => r.proprietaire && used.add(r.proprietaire)); S.questions.forEach(q => q.responsable && used.add(q.responsable));
    return [...used].filter(c => !mailsRole(c).length).sort();
  }
  async function api(req, res, p, outils) {
    const { send, jbody, me } = outils;
    if (p === "/api/admin/notifications" && req.method === "GET") return send(req, res, 200, { config: cfgPublique(), catalogue: CATALOGUE, destLabels: DEST_LABELS, etat: { dernier: etat.dernier, init: etat.init, reportes: Object.fromEntries(Object.entries(etat.reportes || {}).map(([k, v]) => [k, v.length])) }, sansDestinataire: sansDestinataire(), maintenant: maintenant() });
    if (p === "/api/admin/notifications" && req.method === "PUT") {
      const b = await jbody(req), c = b.config || {}, avant = cfg.actif;
      const pw = c.smtp && typeof c.smtp.motDePasse === "string" && c.smtp.motDePasse !== "" ? c.smtp.motDePasse : (b.effacerMotDePasse ? "" : cfg.smtp.motDePasse);
      const neu = merge(DEFAULT_CFG(), c); neu.smtp.motDePasse = pw; delete neu.smtp.motDePasseDefini; delete neu.smtp.motDePasseEnv;
      neu.destinataires.roles = Object.fromEntries(Object.entries(neu.destinataires.roles || {}).map(([k, v]) => [k, normMails(v)]).filter(([, v]) => v.length));
      ["admins", "copie"].forEach(k => neu.destinataires[k] = normMails(neu.destinataires[k]));
      neu.regles = Object.fromEntries(Object.entries(neu.regles || {}).filter(([k]) => CATALOGUE.some(r => r.id === k)));
      cfg = neu; saveCfg();
      console.log(`Notifications : configuration modifiée par ${me.nom} (envoi ${cfg.actif ? "activé" : "désactivé"}).`);
      if (cfg.actif && !avant) { frontsSilencieux = true; evaluerEtEnvoyerFronts().then(() => { frontsSilencieux = false; }); }
      return send(req, res, 200, { ok: true, config: cfgPublique() });
    }
    if (p === "/api/admin/notifications/test" && req.method === "POST") {
      const b = await jbody(req), to = normMails(b.to)[0]; if (!to) return send(req, res, 400, { error: "Adresse de test invalide." });
      const n = maintenant();
      const it = { regle: "resume_quotidien", cat: "Test", niv: 1, ref: "Test", lien: "", titre: "La messagerie de la plateforme fonctionne", detail: `Envoyé par ${me.nom} le ${fdx(n.date)} à ${n.heure} via ${cfg.smtp.hote}:${cfg.smtp.port} (${cfg.smtp.securite}).` };
      const r = await enFile(() => expedier("test", { [to]: [it] }, { date: n.date }));
      return r[0] && r[0].ok ? send(req, res, 200, { ok: true }) : send(req, res, 502, { error: (r[0] && r[0].erreur) || "Échec de l'envoi" });
    }
    if (p === "/api/admin/notifications/apercu" && req.method === "POST") { const b = await jbody(req); return send(req, res, 200, { messages: apercu(b.type || "quotidien") }); }
    if (p === "/api/admin/notifications/envoyer" && req.method === "POST") {
      const b = await jbody(req), n = maintenant();
      if (!cfg.smtp.expediteur) return send(req, res, 400, { error: "Configurer d'abord le serveur d'envoi." });
      const r = b.type === "immediat" ? await evaluerEtEnvoyerFronts() : await enFile(() => envoyerQuotidien(n, b.type === "hebdo" ? "hebdo" : "quotidien"));
      return send(req, res, 200, { envoyes: r.filter(x => x.ok).length, echecs: r.filter(x => !x.ok) });
    }
    if (p === "/api/admin/notifications/journal") { let l = []; try { l = fs.readFileSync(JRN_F, "utf8").trim().split("\n").filter(Boolean).slice(-300).reverse().map(x => JSON.parse(x)); } catch (e) { } return send(req, res, 200, { journal: l }); }
    return send(req, res, 404, {});
  }
  return { api, changement, securite, _test: { smtpEnvoyer, composer, evaluerQuotidien, evaluerFronts, evaluerPlan, moteur, calculerQuotidien, maintenant, setCfg: c => { cfg = merge(DEFAULT_CFG(), c); }, getEtat: () => etat } };
};
