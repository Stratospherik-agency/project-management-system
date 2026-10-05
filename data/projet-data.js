/* Données initiales du projet (schéma 2) — générées le 05.10.2026. */
window.PROJECT_DATA = {
 "meta": {
  "nom": "Refonte de l'écosystème web HEP Vaud",
  "code": "HEPVD-WEB",
  "mandant": "HEP Vaud (Haute école pédagogique du canton de Vaud)",
  "copil": "Copil - Site internet HEP VAUD",
  "debut": "2026-10-05",
  "fin": "2029-12-14",
  "version": "0.2",
  "maj": "2026-10-05",
  "statut": "Phase 0 — Initialisation & cadrage",
  "budget": 10000,
  "perimetre": "hepl.ch (site public) · MyEtu · MyCollab · MyParFo · applications mobiles · intégrations API",
  "contexte": "CMS Jahia 7, migration vers Jahia 8 prévue fin octobre 2026 ; hébergement sur les serveurs internes de la HEP Vaud ; développement interne.",
  "hypothese": "Toutes les dates sont des hypothèses de travail à valider par le Copil - Site internet HEP VAUD (G0). Aucune date de mise en ligne n'est imposée : horizon 2 à 3 ans.",
  "schema": 2
 },
 "roles": [
  {
   "code": "SPO",
   "nom": "Mandant / sponsor (Direction HEP Vaud)",
   "personne": ""
  },
  {
   "code": "COP",
   "nom": "Copil - Site internet HEP VAUD",
   "personne": ""
  },
  {
   "code": "CDP",
   "nom": "Cheffe ou chef de projet (U-Com)",
   "personne": ""
  },
  {
   "code": "PMO",
   "nom": "PMO / assistance au pilotage",
   "personne": ""
  },
  {
   "code": "UCOM",
   "nom": "Unité Communication (gardienne de la marque)",
   "personne": ""
  },
  {
   "code": "PO",
   "nom": "Product owners (site, MyEtu, MyCollab, MyParFo)",
   "personne": ""
  },
  {
   "code": "UX",
   "nom": "UX research & design",
   "personne": ""
  },
  {
   "code": "UI",
   "nom": "UI / responsable Design System",
   "personne": ""
  },
  {
   "code": "CONT",
   "nom": "Stratégie de contenus & rédaction",
   "personne": ""
  },
  {
   "code": "DSI",
   "nom": "Service informatique HEP Vaud",
   "personne": ""
  },
  {
   "code": "DEV",
   "nom": "Développement web interne (Jahia / front)",
   "personne": ""
  },
  {
   "code": "ARCH",
   "nom": "Architecture technique & intégrations",
   "personne": ""
  },
  {
   "code": "PDO",
   "nom": "Protection des données & sécurité (référent·e à identifier)",
   "personne": ""
  },
  {
   "code": "A11Y",
   "nom": "Référent·e accessibilité",
   "personne": ""
  },
  {
   "code": "USR",
   "nom": "Représentant·es des publics (panel)",
   "personne": ""
  }
 ],
 "phases": [
  {
   "id": "P0",
   "nom": "Initialisation & cadrage",
   "debut": "2026-10-05",
   "fin": "2026-12-18",
   "couleur": "#00354c",
   "dossier": "01_CADRAGE",
   "objectif": "Poser le cadre : mandat, objectifs, périmètre, budget, gouvernance, outil de pilotage et règles de traçabilité.",
   "agents": "AG-PMO, AG-RISK, AG-CRIT",
   "entrees": "Charte graphique 10.09.2026 · Logos SVG officiels · Mandat HEP Vaud · Informations sur Jahia 7 → 8",
   "verifs": "Relecture de la note de cadrage par le mandant · Revue critique des hypothèses (AG-CRIT) · PV du Copil enregistré dans la plateforme"
  },
  {
   "id": "P1",
   "nom": "Audit & découverte de l'existant",
   "debut": "2027-01-11",
   "fin": "2027-04-30",
   "couleur": "#006a99",
   "dossier": "02_AUDIT-EXISTANT",
   "objectif": "Objectiver l'état des 4 univers (≈4500 pages) sur Jahia 8 : contenus, audience, SEO, accessibilité, interface, technique.",
   "agents": "AG-AUDIT, AG-ANALYTICS, AG-SEO, AG-A11Y, AG-DS, AG-BENCH, AG-CRIT",
   "entrees": "Accès Jahia 8 (post-migration) · Accès GA4 / Search Console · Exports des portails · Charte graphique",
   "verifs": "Contrôle d'échantillon (10 %) de l'audit de contenu · Validation de l'état technique par la DSI · Revue critique de la synthèse"
  },
  {
   "id": "P2",
   "nom": "Recherche utilisateurs & stratégie",
   "debut": "2027-03-01",
   "fin": "2027-06-25",
   "couleur": "#009cde",
   "dossier": "03_RECHERCHE-STRATEGIE",
   "objectif": "Comprendre chaque public et définir la vision produit de l'écosystème (site, portails, app, notifications).",
   "agents": "AG-UXR, AG-ANALYTICS, AG-STRAT, AG-CRIT",
   "entrees": "Synthèse diagnostic P1 · Données d'audience · Retours helpdesk · Plan stratégique HEP Vaud",
   "verifs": "Triangulation qualitatif / quantitatif / analytics · Restitution aux participants · Revue critique de la vision"
  },
  {
   "id": "P3",
   "nom": "Architecture de l'information & contenus",
   "debut": "2027-05-17",
   "fin": "2027-10-29",
   "couleur": "#4f8fa8",
   "dossier": "04_ARCHITECTURE-INFO-CONTENUS",
   "objectif": "Définir l'arborescence cible des 4 univers, la taxonomie, le modèle de contenu et la gouvernance éditoriale.",
   "agents": "AG-IA, AG-CONT, AG-SEO, AG-CRIT",
   "entrees": "Personas et parcours P2 · Audit de contenu P1 · Recherche interne du site",
   "verifs": "Tests d'arborescence avec utilisateurs réels · Revue SEO de l'arborescence · Validation des unités contributrices"
  },
  {
   "id": "P4",
   "nom": "Design System & style guide",
   "debut": "2027-02-01",
   "fin": "2027-12-17",
   "couleur": "#94cef2",
   "dossier": "05_DESIGN-SYSTEM",
   "objectif": "Transformer la charte print en système de design digital complet, accessible, documenté, versionné et intégrable dans Jahia 8.",
   "agents": "AG-DS, AG-UI, AG-A11Y, AG-DEV, AG-CRIT",
   "entrees": "Charte graphique 10.09.2026 · Logos SVG · Inventaire d'interface P1 · Audit accessibilité P1 · Modèle de contenu P3 · Contraintes Jahia 8 (P6)",
   "verifs": "Contrôle automatique des contrastes · Revue de marque (U-Com) · Tests clavier et lecteur d'écran des composants · Revue critique à chaque version mineure"
  },
  {
   "id": "P5",
   "nom": "Gabarits, maquettes & prototypes",
   "debut": "2027-09-06",
   "fin": "2028-04-28",
   "couleur": "#6891a8",
   "dossier": "06_TEMPLATES-PROTOTYPES",
   "objectif": "Concevoir les gabarits de pages de chaque univers avec le Design System, les prototyper et les tester.",
   "agents": "AG-UI, AG-UXR, AG-COPY, AG-A11Y, AG-CRIT",
   "entrees": "Arborescence et modèle de contenu P3 · Design System v0.8+ P4 · Parcours prioritaires P2",
   "verifs": "Critique design structurée à chaque itération · Tests utilisateurs modérés · Revue accessibilité des maquettes"
  },
  {
   "id": "P6",
   "nom": "Architecture technique Jahia 8 & intégrations",
   "debut": "2027-01-11",
   "fin": "2027-12-17",
   "couleur": "#2b5d75",
   "dossier": "07_TECHNIQUE-INTEGRATIONS",
   "objectif": "Définir comment le Design System et les gabarits seront réalisés en interne sur Jahia 8, et préparer les intégrations.",
   "agents": "AG-ARCH, AG-DEV, AG-SECU, AG-CRIT",
   "entrees": "Jahia 8 migré (fin octobre 2026) · État technique P1 · Feuille de route P2",
   "verifs": "Revue d'architecture par la DSI · Preuve de concept démontrée au Copil · Revue critique des choix techniques"
  },
  {
   "id": "P7",
   "nom": "Développement interne",
   "debut": "2028-01-10",
   "fin": "2028-12-15",
   "couleur": "#00354c",
   "dossier": "08_DEVELOPPEMENT",
   "objectif": "Réaliser en interne la librairie front du DS, les gabarits Jahia 8, les portails et les intégrations.",
   "agents": "AG-DEV, AG-ARCH, AG-A11Y, AG-QA",
   "entrees": "DS v1.0 · Spécifications P5 · Architecture P6",
   "verifs": "Démo à chaque fin d'itération · Tests automatisés (a11y, régression visuelle) en CI · Revue de code"
  },
  {
   "id": "P8",
   "nom": "Migration de contenus",
   "debut": "2028-06-05",
   "fin": "2029-04-27",
   "couleur": "#6891a8",
   "dossier": "09_MIGRATION-CONTENUS",
   "objectif": "Migrer, réécrire ou supprimer chaque page selon la matrice, sans perte de référencement.",
   "agents": "AG-MIG, AG-CONT, AG-SEO, AG-QA",
   "entrees": "Matrice de migration P3 · Charte éditoriale P3 · Gabarits Jahia P7",
   "verifs": "Contrôle de 100 % des redirections · Échantillon qualité par lot · Comparaison avant / après des pages à fort trafic"
  },
  {
   "id": "P9",
   "nom": "Qualité & recette",
   "debut": "2028-11-06",
   "fin": "2029-06-15",
   "couleur": "#2b5d75",
   "dossier": "10_QUALITE-RECETTE",
   "objectif": "Garantir conformité fonctionnelle, accessibilité, sécurité et performance avant mise en ligne.",
   "agents": "AG-QA, AG-A11Y, AG-SECU, AG-CRIT",
   "entrees": "Spécifications P5 · Exigences non fonctionnelles P6 · Préproduction",
   "verifs": "Audit indépendant ciblé (accessibilité) · Recette signée par chaque product owner · Revue critique des anomalies résiduelles"
  },
  {
   "id": "P10",
   "nom": "Lancement & conduite du changement",
   "debut": "2029-03-05",
   "fin": "2029-07-13",
   "couleur": "#009cde",
   "dossier": "11_LANCEMENT-CHANGEMENT",
   "objectif": "Préparer les publics, communiquer, mettre en ligne et stabiliser.",
   "agents": "AG-CHG, AG-COPY, AG-PMO, AG-CRIT",
   "entrees": "PV de recette P9 · Plan de redirections P8",
   "verifs": "Répétition de bascule · Checklist go-live signée · Suivi des incidents J+1 à J+15"
  },
  {
   "id": "P11",
   "nom": "Run & amélioration continue",
   "debut": "2029-07-16",
   "fin": "2029-12-14",
   "couleur": "#4f8fa8",
   "dossier": "12_RUN-AMELIORATION",
   "objectif": "Stabiliser, mesurer, améliorer en continu et faire vivre le Design System.",
   "agents": "AG-ANALYTICS, AG-PMO, AG-CRIT",
   "entrees": "KPI baseline P0 · Retours utilisateurs",
   "verifs": "Comparaison KPI baseline / cible · REX avec toutes les parties prenantes"
  }
 ],
 "taches": [
  {
   "id": "T001",
   "phase": "P0",
   "nom": "Constituer le dossier projet et la plateforme de pilotage",
   "debut": "2026-10-05",
   "fin": "2026-10-30",
   "statut": "En cours",
   "avancement": 60,
   "responsable": "CDP",
   "priorite": "Normale",
   "dependances": "",
   "termineLe": "",
   "notes": "Dossier créé le 05.10.2026 ; plateforme v0.2 (base de données SQLite en mode serveur)."
  },
  {
   "id": "T002",
   "phase": "P0",
   "nom": "Collecter les informations de cadrage",
   "debut": "2026-10-05",
   "fin": "2026-10-30",
   "statut": "En cours",
   "avancement": 40,
   "responsable": "CDP",
   "priorite": "Normale",
   "dependances": "",
   "termineLe": "",
   "notes": "Reçu le 05.10.2026 : mandat, Copil, budget, horizon, CMS Jahia, logos SVG. En attente : services connectés (étape ultérieure)."
  },
  {
   "id": "T003",
   "phase": "P0",
   "nom": "Formaliser l'organisation : Copil, équipe cœur, RACI",
   "debut": "2026-10-19",
   "fin": "2026-10-30",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "SPO",
   "priorite": "Haute",
   "dependances": "",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T004",
   "phase": "P0",
   "nom": "Rédiger la note de cadrage",
   "debut": "2026-11-02",
   "fin": "2026-11-20",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "CDP",
   "priorite": "Normale",
   "dependances": "T003",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T005",
   "phase": "P0",
   "nom": "Cartographier les parties prenantes",
   "debut": "2026-10-26",
   "fin": "2026-11-13",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "CDP",
   "priorite": "Normale",
   "dependances": "",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T006",
   "phase": "P0",
   "nom": "Établir le plan de management des risques",
   "debut": "2026-11-02",
   "fin": "2026-11-20",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "CDP",
   "priorite": "Normale",
   "dependances": "",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T007",
   "phase": "P0",
   "nom": "Répartir l'enveloppe budgétaire de CHF 10'000",
   "debut": "2026-11-02",
   "fin": "2026-11-20",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "CDP",
   "priorite": "Normale",
   "dependances": "",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T008",
   "phase": "P0",
   "nom": "Définir les KPI de succès et mesurer la baseline",
   "debut": "2026-11-09",
   "fin": "2026-11-27",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "PMO",
   "priorite": "Normale",
   "dependances": "",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T009",
   "phase": "P0",
   "nom": "Figer le planning de référence (baseline 1)",
   "debut": "2026-11-23",
   "fin": "2026-12-04",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "PMO",
   "priorite": "Normale",
   "dependances": "T004, T007",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T010",
   "phase": "P0",
   "nom": "Copil de lancement",
   "debut": "2026-12-07",
   "fin": "2026-12-11",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "CDP",
   "priorite": "Normale",
   "dependances": "T009, T008",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T011",
   "phase": "P1",
   "nom": "Inventaire automatisé des ≈4500 pages",
   "debut": "2027-01-11",
   "fin": "2027-02-05",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "CONT",
   "priorite": "Normale",
   "dependances": "",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T012",
   "phase": "P1",
   "nom": "Analyse d'audience GA4 (24 mois)",
   "debut": "2027-01-18",
   "fin": "2027-02-19",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "UCOM",
   "priorite": "Normale",
   "dependances": "",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T013",
   "phase": "P1",
   "nom": "Audit de contenu quantitatif et qualitatif (ROT)",
   "debut": "2027-02-01",
   "fin": "2027-03-26",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "CONT",
   "priorite": "Normale",
   "dependances": "",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T014",
   "phase": "P1",
   "nom": "Inventaire d'interface de l'existant (composants, styles)",
   "debut": "2027-02-01",
   "fin": "2027-03-05",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "UI",
   "priorite": "Normale",
   "dependances": "",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T015",
   "phase": "P1",
   "nom": "Audit SEO technique et sémantique",
   "debut": "2027-02-15",
   "fin": "2027-03-12",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "UCOM",
   "priorite": "Normale",
   "dependances": "",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T016",
   "phase": "P1",
   "nom": "Audit accessibilité (échantillon représentatif)",
   "debut": "2027-02-22",
   "fin": "2027-03-26",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "A11Y",
   "priorite": "Normale",
   "dependances": "",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T017",
   "phase": "P1",
   "nom": "État des lieux technique Jahia 8 et portails",
   "debut": "2027-01-18",
   "fin": "2027-03-19",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "DSI",
   "priorite": "Normale",
   "dependances": "",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T018",
   "phase": "P1",
   "nom": "Benchmark hautes écoles suisses et internationales",
   "debut": "2027-02-15",
   "fin": "2027-03-26",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "UX",
   "priorite": "Normale",
   "dependances": "",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T019",
   "phase": "P1",
   "nom": "Synthèse diagnostic et revue critique",
   "debut": "2027-03-29",
   "fin": "2027-04-16",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "CDP",
   "priorite": "Normale",
   "dependances": "T013, T014, T016, T017, T018",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T020",
   "phase": "P2",
   "nom": "Plan de recherche et recrutement des participants",
   "debut": "2027-03-01",
   "fin": "2027-03-19",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "UX",
   "priorite": "Normale",
   "dependances": "",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T021",
   "phase": "P2",
   "nom": "Entretiens et ateliers par public cible",
   "debut": "2027-03-22",
   "fin": "2027-04-30",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "UX",
   "priorite": "Normale",
   "dependances": "T020",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T022",
   "phase": "P2",
   "nom": "Enquête en ligne quantitative",
   "debut": "2027-03-29",
   "fin": "2027-04-30",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "UX",
   "priorite": "Normale",
   "dependances": "",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T023",
   "phase": "P2",
   "nom": "Synthèse : personas, jobs-to-be-done, parcours",
   "debut": "2027-05-03",
   "fin": "2027-05-21",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "UX",
   "priorite": "Normale",
   "dependances": "T021, T022",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T024",
   "phase": "P2",
   "nom": "Vision produit et écosystème",
   "debut": "2027-05-24",
   "fin": "2027-06-11",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "CDP",
   "priorite": "Normale",
   "dependances": "T023",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T025",
   "phase": "P2",
   "nom": "Instruire la décision site / portails / app (PWA ou native)",
   "debut": "2027-05-24",
   "fin": "2027-06-11",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "CDP",
   "priorite": "Normale",
   "dependances": "",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T026",
   "phase": "P2",
   "nom": "Feuille de route fonctionnelle et priorisation",
   "debut": "2027-05-31",
   "fin": "2027-06-11",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "PO",
   "priorite": "Normale",
   "dependances": "",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T027",
   "phase": "P3",
   "nom": "Tri de cartes (ouvert puis fermé)",
   "debut": "2027-05-17",
   "fin": "2027-06-18",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "UX",
   "priorite": "Normale",
   "dependances": "",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T028",
   "phase": "P3",
   "nom": "Arborescence cible des 4 univers",
   "debut": "2027-06-21",
   "fin": "2027-08-27",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "CONT",
   "priorite": "Normale",
   "dependances": "T027",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T029",
   "phase": "P3",
   "nom": "Tests d'arborescence (tree testing)",
   "debut": "2027-08-30",
   "fin": "2027-09-24",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "UX",
   "priorite": "Normale",
   "dependances": "T028",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T030",
   "phase": "P3",
   "nom": "Modèle de contenu et taxonomie",
   "debut": "2027-07-05",
   "fin": "2027-09-24",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "CONT",
   "priorite": "Normale",
   "dependances": "",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T031",
   "phase": "P3",
   "nom": "Charte éditoriale web",
   "debut": "2027-08-16",
   "fin": "2027-10-01",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "CONT",
   "priorite": "Normale",
   "dependances": "",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T032",
   "phase": "P3",
   "nom": "Gouvernance éditoriale",
   "debut": "2027-09-06",
   "fin": "2027-10-08",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "UCOM",
   "priorite": "Normale",
   "dependances": "",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T033",
   "phase": "P3",
   "nom": "Matrice de migration",
   "debut": "2027-09-13",
   "fin": "2027-10-15",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "CONT",
   "priorite": "Normale",
   "dependances": "T028",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T034",
   "phase": "P4",
   "nom": "Gouvernance du DS : rôles, contribution, versionnage",
   "debut": "2027-02-01",
   "fin": "2027-03-05",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "UI",
   "priorite": "Normale",
   "dependances": "",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T035",
   "phase": "P4",
   "nom": "Licences typographiques web (Chalet, Spectral)",
   "debut": "2027-02-01",
   "fin": "2027-03-12",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "UCOM",
   "priorite": "Normale",
   "dependances": "",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T036",
   "phase": "P4",
   "nom": "Fondations : couleurs, rôles sémantiques et contrastes",
   "debut": "2027-03-08",
   "fin": "2027-04-16",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "UI",
   "priorite": "Normale",
   "dependances": "T034",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T037",
   "phase": "P4",
   "nom": "Fondations : typographie et échelle responsive",
   "debut": "2027-04-05",
   "fin": "2027-05-14",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "UI",
   "priorite": "Normale",
   "dependances": "",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T038",
   "phase": "P4",
   "nom": "Fondations : grilles, espacements, système Bento digital",
   "debut": "2027-04-19",
   "fin": "2027-05-28",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "UI",
   "priorite": "Normale",
   "dependances": "",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T039",
   "phase": "P4",
   "nom": "Iconographie et direction photographique",
   "debut": "2027-05-03",
   "fin": "2027-06-25",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "UI",
   "priorite": "Normale",
   "dependances": "",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T040",
   "phase": "P4",
   "nom": "Design tokens (primitifs → sémantiques → composants) et pipeline",
   "debut": "2027-05-31",
   "fin": "2027-07-02",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "DEV",
   "priorite": "Normale",
   "dependances": "T038",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T041",
   "phase": "P4",
   "nom": "Composants de base (DS v0.5)",
   "debut": "2027-07-05",
   "fin": "2027-09-10",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "UI",
   "priorite": "Normale",
   "dependances": "T040",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T042",
   "phase": "P4",
   "nom": "Composants complexes et patterns (DS v0.8)",
   "debut": "2027-09-13",
   "fin": "2027-11-05",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "UI",
   "priorite": "Normale",
   "dependances": "T041",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T043",
   "phase": "P4",
   "nom": "Style guide en ligne et documentation",
   "debut": "2027-09-20",
   "fin": "2027-11-19",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "UI",
   "priorite": "Normale",
   "dependances": "",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T044",
   "phase": "P4",
   "nom": "Revues accessibilité et marque",
   "debut": "2027-10-25",
   "fin": "2027-11-19",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "A11Y",
   "priorite": "Normale",
   "dependances": "",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T045",
   "phase": "P4",
   "nom": "Revue critique, avenant de charte et release DS v1.0",
   "debut": "2027-11-22",
   "fin": "2027-12-10",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "UCOM",
   "priorite": "Normale",
   "dependances": "T044",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T046",
   "phase": "P5",
   "nom": "Inventaire des types de pages (gabarits)",
   "debut": "2027-09-06",
   "fin": "2027-10-01",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "UX",
   "priorite": "Normale",
   "dependances": "",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T047",
   "phase": "P5",
   "nom": "Wireframes basse fidélité",
   "debut": "2027-10-04",
   "fin": "2027-11-26",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "UX",
   "priorite": "Normale",
   "dependances": "T046",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T048",
   "phase": "P5",
   "nom": "Maquettes haute fidélité desktop et mobile",
   "debut": "2027-11-29",
   "fin": "2028-02-25",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "UI",
   "priorite": "Normale",
   "dependances": "T047",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T049",
   "phase": "P5",
   "nom": "Prototype interactif des parcours clés",
   "debut": "2028-01-31",
   "fin": "2028-03-03",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "UX",
   "priorite": "Normale",
   "dependances": "",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T050",
   "phase": "P5",
   "nom": "Tests utilisateurs (2 itérations)",
   "debut": "2028-03-06",
   "fin": "2028-04-07",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "UX",
   "priorite": "Normale",
   "dependances": "T049",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T051",
   "phase": "P5",
   "nom": "Spécifications et handoff développement",
   "debut": "2028-03-27",
   "fin": "2028-04-14",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "PO",
   "priorite": "Normale",
   "dependances": "",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T052",
   "phase": "P6",
   "nom": "Bilan de la migration Jahia 7 → 8",
   "debut": "2027-01-11",
   "fin": "2027-02-05",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "DSI",
   "priorite": "Normale",
   "dependances": "",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T053",
   "phase": "P6",
   "nom": "Étude de templating Jahia 8 et preuve de concept",
   "debut": "2027-02-08",
   "fin": "2027-04-16",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "ARCH",
   "priorite": "Normale",
   "dependances": "T052",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T054",
   "phase": "P6",
   "nom": "Stratégie d'intégration du Design System dans Jahia",
   "debut": "2027-04-19",
   "fin": "2027-06-25",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "ARCH",
   "priorite": "Normale",
   "dependances": "T053",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T055",
   "phase": "P6",
   "nom": "Exigences non fonctionnelles (performance, sécurité, hébergement)",
   "debut": "2027-03-01",
   "fin": "2027-05-07",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "ARCH",
   "priorite": "Normale",
   "dependances": "",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T056",
   "phase": "P6",
   "nom": "Inventaire des services connectés et API (étape ultérieure)",
   "debut": "2027-06-07",
   "fin": "2027-09-24",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "ARCH",
   "priorite": "Normale",
   "dependances": "",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T057",
   "phase": "P6",
   "nom": "Architecture des portails et authentification (SSO)",
   "debut": "2027-08-30",
   "fin": "2027-11-05",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "ARCH",
   "priorite": "Normale",
   "dependances": "",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T058",
   "phase": "P6",
   "nom": "Protection des données et sécurité",
   "debut": "2027-09-06",
   "fin": "2027-11-19",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "PDO",
   "priorite": "Normale",
   "dependances": "",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T059",
   "phase": "P6",
   "nom": "Environnements, Git et intégration continue",
   "debut": "2027-10-04",
   "fin": "2027-12-03",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "DEV",
   "priorite": "Normale",
   "dependances": "",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T060",
   "phase": "P7",
   "nom": "Librairie front du Design System (CSS/JS, tokens)",
   "debut": "2028-01-10",
   "fin": "2028-03-31",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "DEV",
   "priorite": "Normale",
   "dependances": "T045, T059",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T061",
   "phase": "P7",
   "nom": "Modules et gabarits Jahia 8",
   "debut": "2028-04-17",
   "fin": "2028-08-25",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "DEV",
   "priorite": "Normale",
   "dependances": "T051",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T062",
   "phase": "P7",
   "nom": "Portails MyEtu, MyCollab, MyParFo",
   "debut": "2028-05-01",
   "fin": "2028-10-27",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "DEV",
   "priorite": "Normale",
   "dependances": "",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T063",
   "phase": "P7",
   "nom": "Intégrations des services connectés",
   "debut": "2028-04-03",
   "fin": "2028-10-13",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "ARCH",
   "priorite": "Normale",
   "dependances": "",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T064",
   "phase": "P7",
   "nom": "Recherche, formulaires, multilingue",
   "debut": "2028-06-05",
   "fin": "2028-10-06",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "DEV",
   "priorite": "Normale",
   "dependances": "",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T065",
   "phase": "P7",
   "nom": "Application mobile / PWA (selon décision)",
   "debut": "2028-08-28",
   "fin": "2028-11-24",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "DEV",
   "priorite": "Normale",
   "dependances": "",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T066",
   "phase": "P7",
   "nom": "Démos d'itération et revues",
   "debut": "2028-01-10",
   "fin": "2028-11-24",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "PO",
   "priorite": "Normale",
   "dependances": "",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T067",
   "phase": "P8",
   "nom": "Plan de migration et redirections 301",
   "debut": "2028-06-05",
   "fin": "2028-07-07",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "CONT",
   "priorite": "Normale",
   "dependances": "",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T068",
   "phase": "P8",
   "nom": "Formation des contributeurs",
   "debut": "2028-09-04",
   "fin": "2028-10-27",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "UCOM",
   "priorite": "Normale",
   "dependances": "T067",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T069",
   "phase": "P8",
   "nom": "Réécriture et migration par lots",
   "debut": "2028-10-30",
   "fin": "2029-03-23",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "CONT",
   "priorite": "Normale",
   "dependances": "T068",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T070",
   "phase": "P8",
   "nom": "Contrôle qualité des contenus et redirections",
   "debut": "2029-02-26",
   "fin": "2029-04-13",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "CONT",
   "priorite": "Normale",
   "dependances": "",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T071",
   "phase": "P9",
   "nom": "Stratégie de tests et plan de recette",
   "debut": "2028-11-06",
   "fin": "2028-12-08",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "PMO",
   "priorite": "Normale",
   "dependances": "",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T072",
   "phase": "P9",
   "nom": "Tests fonctionnels et d'intégration",
   "debut": "2029-01-08",
   "fin": "2029-04-27",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "PO",
   "priorite": "Normale",
   "dependances": "",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T073",
   "phase": "P9",
   "nom": "Audit d'accessibilité de conformité",
   "debut": "2029-03-26",
   "fin": "2029-05-04",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "A11Y",
   "priorite": "Normale",
   "dependances": "",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T074",
   "phase": "P9",
   "nom": "Tests de sécurité",
   "debut": "2029-04-02",
   "fin": "2029-05-11",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "PDO",
   "priorite": "Normale",
   "dependances": "",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T075",
   "phase": "P9",
   "nom": "Tests de performance et de charge",
   "debut": "2029-04-16",
   "fin": "2029-05-18",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "ARCH",
   "priorite": "Normale",
   "dependances": "",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T076",
   "phase": "P9",
   "nom": "Recette utilisateurs",
   "debut": "2029-05-07",
   "fin": "2029-06-01",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "USR",
   "priorite": "Normale",
   "dependances": "T073",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T077",
   "phase": "P10",
   "nom": "Plan de communication interne et externe",
   "debut": "2029-03-05",
   "fin": "2029-04-13",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "UCOM",
   "priorite": "Normale",
   "dependances": "",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T078",
   "phase": "P10",
   "nom": "Formation et documentation des utilisateurs",
   "debut": "2029-04-16",
   "fin": "2029-06-15",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "UCOM",
   "priorite": "Normale",
   "dependances": "",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T079",
   "phase": "P10",
   "nom": "Plan de bascule et de retour arrière",
   "debut": "2029-05-07",
   "fin": "2029-06-15",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "DSI",
   "priorite": "Normale",
   "dependances": "",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T080",
   "phase": "P10",
   "nom": "Mise en production et hypercare",
   "debut": "2029-06-25",
   "fin": "2029-07-13",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "DSI",
   "priorite": "Normale",
   "dependances": "T076, T079",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T081",
   "phase": "P11",
   "nom": "Hypercare et correctifs",
   "debut": "2029-07-16",
   "fin": "2029-08-31",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "DEV",
   "priorite": "Normale",
   "dependances": "",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T082",
   "phase": "P11",
   "nom": "Backlog d'amélioration continue et gouvernance DS en run",
   "debut": "2029-09-03",
   "fin": "2029-12-14",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "PO",
   "priorite": "Normale",
   "dependances": "",
   "termineLe": "",
   "notes": ""
  },
  {
   "id": "T083",
   "phase": "P11",
   "nom": "Bilan post-lancement et KPI",
   "debut": "2029-09-24",
   "fin": "2029-10-19",
   "statut": "À faire",
   "avancement": 0,
   "responsable": "CDP",
   "priorite": "Normale",
   "dependances": "",
   "termineLe": "",
   "notes": ""
  }
 ],
 "jalons": [
  {
   "id": "G0",
   "nom": "Lancement validé",
   "date": "2026-12-18",
   "phase": "P0",
   "type": "Gate",
   "statut": "À venir",
   "criteres": [
    {
     "t": "Mandat, objectifs et périmètre (in / out) validés par le Copil",
     "ok": false
    },
    {
     "t": "Mode de réalisation interne confirmé (décision D-004)",
     "ok": false
    },
    {
     "t": "Répartition du budget de CHF 10'000 validée",
     "ok": false
    },
    {
     "t": "Planning de référence (baseline 1) enregistré dans la plateforme",
     "ok": false
    },
    {
     "t": "Plan de management des risques et registre initial revus",
     "ok": false
    }
   ]
  },
  {
   "id": "G1",
   "nom": "Diagnostic validé",
   "date": "2027-04-30",
   "phase": "P1",
   "type": "Gate",
   "statut": "À venir",
   "criteres": [
    {
     "t": "100 % des pages inventoriées et qualifiées en 1re passe",
     "ok": false
    },
    {
     "t": "Inventaire d'interface complet (base du Design System)",
     "ok": false
    },
    {
     "t": "Constats SEO, accessibilité et techniques chiffrés",
     "ok": false
    },
    {
     "t": "Synthèse présentée et acceptée par le Copil",
     "ok": false
    }
   ]
  },
  {
   "id": "G2",
   "nom": "Vision & stratégie validées",
   "date": "2027-06-25",
   "phase": "P2",
   "type": "Gate",
   "statut": "À venir",
   "criteres": [
    {
     "t": "Personas validés par les représentant·es de chaque public",
     "ok": false
    },
    {
     "t": "Parcours prioritaires identifiés pour chaque univers",
     "ok": false
    },
    {
     "t": "Décision site / portails / app documentée",
     "ok": false
    },
    {
     "t": "Feuille de route fonctionnelle acceptée",
     "ok": false
    }
   ]
  },
  {
   "id": "G3",
   "nom": "Architecture & contenus validés",
   "date": "2027-10-29",
   "phase": "P3",
   "type": "Gate",
   "statut": "À venir",
   "criteres": [
    {
     "t": "Taux de réussite des tests d'arborescence ≥ 75 % sur les tâches clés",
     "ok": false
    },
    {
     "t": "Modèle de contenu couvrant tous les types de pages inventoriés",
     "ok": false
    },
    {
     "t": "Gouvernance éditoriale acceptée par les unités contributrices",
     "ok": false
    },
    {
     "t": "Matrice de migration complète (100 % des pages)",
     "ok": false
    }
   ]
  },
  {
   "id": "G4",
   "nom": "Design System v1.0 validé",
   "date": "2027-12-17",
   "phase": "P4",
   "type": "Gate",
   "statut": "À venir",
   "criteres": [
    {
     "t": "100 % des paires texte / fond conformes WCAG 2.1 AA (4.5:1 ; 3:1 ≥ 24 px)",
     "ok": false
    },
    {
     "t": "Tokens versionnés, source unique design ↔ code",
     "ok": false
    },
    {
     "t": "Chaque composant documenté : usage, anatomie, états, variantes, accessibilité, contenu",
     "ok": false
    },
    {
     "t": "Style guide en ligne publié en interne",
     "ok": false
    },
    {
     "t": "Avenant digital à la charte validé par l'Unité Communication",
     "ok": false
    },
    {
     "t": "Journal des versions et des décisions DS à jour dans la plateforme",
     "ok": false
    }
   ]
  },
  {
   "id": "G5",
   "nom": "Gabarits & maquettes validés",
   "date": "2028-04-28",
   "phase": "P5",
   "type": "Gate",
   "statut": "À venir",
   "criteres": [
    {
     "t": "Chaque type de page inventorié dispose d'un gabarit",
     "ok": false
    },
    {
     "t": "Taux de réussite des tâches en test ≥ 80 %, SUS ≥ 75",
     "ok": false
    },
    {
     "t": "Maquettes conformes au Design System (écarts documentés)",
     "ok": false
    },
    {
     "t": "Spécifications acceptées par l'équipe de développement",
     "ok": false
    }
   ]
  },
  {
   "id": "G6",
   "nom": "Architecture & socle technique validés",
   "date": "2027-12-17",
   "phase": "P6",
   "type": "Gate",
   "statut": "À venir",
   "criteres": [
    {
     "t": "Approche de templating Jahia 8 validée par preuve de concept",
     "ok": false
    },
    {
     "t": "Chaîne tokens → CSS → modules Jahia démontrée",
     "ok": false
    },
    {
     "t": "Services connectés inventoriés avec propriétaires",
     "ok": false
    },
    {
     "t": "Exigences de sécurité et de protection des données validées",
     "ok": false
    }
   ]
  },
  {
   "id": "G7",
   "nom": "Recette prononcée",
   "date": "2029-06-15",
   "phase": "P9",
   "type": "Gate",
   "statut": "À venir",
   "criteres": [
    {
     "t": "Zéro anomalie bloquante ou majeure ouverte",
     "ok": false
    },
    {
     "t": "Conformité WCAG 2.1 AA (eCH-0059) attestée",
     "ok": false
    },
    {
     "t": "Vulnérabilités critiques et hautes corrigées",
     "ok": false
    },
    {
     "t": "Core Web Vitals « bons »",
     "ok": false
    }
   ]
  },
  {
   "id": "G8",
   "nom": "Go / No-go mise en ligne",
   "date": "2029-06-22",
   "phase": "P10",
   "type": "Gate",
   "statut": "À venir",
   "criteres": [
    {
     "t": "Recette prononcée (G7)",
     "ok": false
    },
    {
     "t": "Redirections testées, retour arrière répété",
     "ok": false
    },
    {
     "t": "Contributeurs et support formés",
     "ok": false
    },
    {
     "t": "Communication de lancement prête",
     "ok": false
    }
   ]
  },
  {
   "id": "G9",
   "nom": "Bilan post-lancement",
   "date": "2029-10-26",
   "phase": "P11",
   "type": "Gate",
   "statut": "À venir",
   "criteres": [
    {
     "t": "KPI comparés à la baseline P0",
     "ok": false
    },
    {
     "t": "Retour d'expérience partagé",
     "ok": false
    },
    {
     "t": "Gouvernance de run en place (DS, contenus, technique)",
     "ok": false
    }
   ]
  },
  {
   "id": "M-J8",
   "nom": "Migration Jahia 7 → 8 (projet DSI, hors périmètre)",
   "date": "2026-10-30",
   "phase": "P0",
   "type": "Jalon",
   "statut": "À venir",
   "criteres": []
  },
  {
   "id": "M-DS05",
   "nom": "Design System v0.5 (composants de base)",
   "date": "2027-09-17",
   "phase": "P4",
   "type": "Jalon",
   "statut": "À venir",
   "criteres": []
  },
  {
   "id": "M-DS08",
   "nom": "Design System v0.8 (composants complexes)",
   "date": "2027-11-05",
   "phase": "P4",
   "type": "Jalon",
   "statut": "À venir",
   "criteres": []
  },
  {
   "id": "M-LIVE",
   "nom": "Mise en ligne de l'écosystème (fenêtre à arbitrer)",
   "date": "2029-06-29",
   "phase": "P10",
   "type": "Jalon",
   "statut": "À venir",
   "criteres": []
  }
 ],
 "documents": [
  {
   "id": "DOC-001",
   "titre": "Charte graphique HEP Vaud (10.09.2026)",
   "chemin": "_SOURCES/Charte/HEP-VD_Charte_Graphique_10.09.26.pdf",
   "type": "Référence",
   "phase": "P0",
   "taches": [],
   "statut": "Référence",
   "version": "10.09.2026",
   "responsable": "UCOM",
   "date": "2026-09-10",
   "tags": "charte, identité, logo, couleurs, typographie, bento",
   "description": "Charte print officielle, point de départ du Design System (v0.0).",
   "livrable": false,
   "versions": [
    {
     "v": "10.09.2026",
     "date": "2026-09-10",
     "auteur": "Claude (Cowork) pour U-Com",
     "note": "Création",
     "chemin": "_SOURCES/Charte/HEP-VD_Charte_Graphique_10.09.26.pdf"
    }
   ]
  },
  {
   "id": "DOC-002",
   "titre": "Logo — HEP Logo NOIR CMJN PROD",
   "chemin": "_SOURCES/Logos/HEP_Logo_NOIR_CMJN_PROD_Plan de travail 1.svg",
   "type": "Référence",
   "phase": "P4",
   "taches": [],
   "statut": "Référence",
   "version": "officiel",
   "responsable": "UCOM",
   "date": "2025-01-07",
   "tags": "logo, svg, marque",
   "description": "Fichier logo officiel (lecture seule).",
   "livrable": false,
   "versions": [
    {
     "v": "officiel",
     "date": "2025-01-07",
     "auteur": "Claude (Cowork) pour U-Com",
     "note": "Création",
     "chemin": "_SOURCES/Logos/HEP_Logo_NOIR_CMJN_PROD_Plan de travail 1.svg"
    }
   ]
  },
  {
   "id": "DOC-003",
   "titre": "Logo — HEP Logo BLANC CMJN PROD",
   "chemin": "_SOURCES/Logos/HEP_Logo_BLANC_CMJN_PROD_Plan de travail 1.svg",
   "type": "Référence",
   "phase": "P4",
   "taches": [],
   "statut": "Référence",
   "version": "officiel",
   "responsable": "UCOM",
   "date": "2025-01-07",
   "tags": "logo, svg, marque",
   "description": "Fichier logo officiel (lecture seule).",
   "livrable": false,
   "versions": [
    {
     "v": "officiel",
     "date": "2025-01-07",
     "auteur": "Claude (Cowork) pour U-Com",
     "note": "Création",
     "chemin": "_SOURCES/Logos/HEP_Logo_BLANC_CMJN_PROD_Plan de travail 1.svg"
    }
   ]
  },
  {
   "id": "DOC-004",
   "titre": "Logo — HEP Logo Descripteur NOIR CMJN PROD",
   "chemin": "_SOURCES/Logos/HEP_Logo_Descripteur_NOIR_CMJN_PROD_Plan de travail 1.svg",
   "type": "Référence",
   "phase": "P4",
   "taches": [],
   "statut": "Référence",
   "version": "officiel",
   "responsable": "UCOM",
   "date": "2025-01-07",
   "tags": "logo, svg, marque",
   "description": "Fichier logo officiel (lecture seule).",
   "livrable": false,
   "versions": [
    {
     "v": "officiel",
     "date": "2025-01-07",
     "auteur": "Claude (Cowork) pour U-Com",
     "note": "Création",
     "chemin": "_SOURCES/Logos/HEP_Logo_Descripteur_NOIR_CMJN_PROD_Plan de travail 1.svg"
    }
   ]
  },
  {
   "id": "DOC-005",
   "titre": "Logo — HEP Logo Descripteur BLANC CMJN PROD",
   "chemin": "_SOURCES/Logos/HEP_Logo_Descripteur_BLANC_CMJN_PROD_Plan de travail 1.svg",
   "type": "Référence",
   "phase": "P4",
   "taches": [],
   "statut": "Référence",
   "version": "officiel",
   "responsable": "UCOM",
   "date": "2025-01-07",
   "tags": "logo, svg, marque",
   "description": "Fichier logo officiel (lecture seule).",
   "livrable": false,
   "versions": [
    {
     "v": "officiel",
     "date": "2025-01-07",
     "auteur": "Claude (Cowork) pour U-Com",
     "note": "Création",
     "chemin": "_SOURCES/Logos/HEP_Logo_Descripteur_BLANC_CMJN_PROD_Plan de travail 1.svg"
    }
   ]
  },
  {
   "id": "DOC-006",
   "titre": "Logo — HEP Logo NOIR RVB WEB",
   "chemin": "_SOURCES/Logos/HEP_Logo_NOIR_RVB_WEB.png",
   "type": "Référence",
   "phase": "P4",
   "taches": [],
   "statut": "Référence",
   "version": "officiel",
   "responsable": "UCOM",
   "date": "2026-10-05",
   "tags": "logo, svg, marque",
   "description": "Fichier logo officiel (lecture seule).",
   "livrable": false,
   "versions": [
    {
     "v": "officiel",
     "date": "2026-10-05",
     "auteur": "Claude (Cowork) pour U-Com",
     "note": "Création",
     "chemin": "_SOURCES/Logos/HEP_Logo_NOIR_RVB_WEB.png"
    }
   ]
  },
  {
   "id": "DOC-007",
   "titre": "Logo — HEP Logo Descripteur NOIR RVB WEB",
   "chemin": "_SOURCES/Logos/HEP_Logo_Descripteur_NOIR_RVB_WEB.png",
   "type": "Référence",
   "phase": "P4",
   "taches": [],
   "statut": "Référence",
   "version": "officiel",
   "responsable": "UCOM",
   "date": "2026-10-05",
   "tags": "logo, svg, marque",
   "description": "Fichier logo officiel (lecture seule).",
   "livrable": false,
   "versions": [
    {
     "v": "officiel",
     "date": "2026-10-05",
     "auteur": "Claude (Cowork) pour U-Com",
     "note": "Création",
     "chemin": "_SOURCES/Logos/HEP_Logo_Descripteur_NOIR_RVB_WEB.png"
    }
   ]
  },
  {
   "id": "DOC-008",
   "titre": "Mode d'emploi du dossier projet",
   "chemin": "README.md",
   "type": "Guide",
   "phase": "P0",
   "taches": [
    "T001"
   ],
   "statut": "En cours",
   "version": "0.2",
   "responsable": "CDP",
   "date": "2026-10-05",
   "tags": "dossier, organisation",
   "description": "Document de pilotage.",
   "livrable": false,
   "versions": [
    {
     "v": "0.2",
     "date": "2026-10-05",
     "auteur": "Claude (Cowork) pour U-Com",
     "note": "Création",
     "chemin": "README.md"
    }
   ]
  },
  {
   "id": "DOC-009",
   "titre": "Plan de projet",
   "chemin": "00_PILOTAGE/01_Plan-de-projet.md",
   "type": "Plan",
   "phase": "P0",
   "taches": [
    "T001"
   ],
   "statut": "En cours",
   "version": "0.2",
   "responsable": "CDP",
   "date": "2026-10-05",
   "tags": "plan, phases, budget, objectifs",
   "description": "Document de pilotage.",
   "livrable": false,
   "versions": [
    {
     "v": "0.2",
     "date": "2026-10-05",
     "auteur": "Claude (Cowork) pour U-Com",
     "note": "Création",
     "chemin": "00_PILOTAGE/01_Plan-de-projet.md"
    }
   ]
  },
  {
   "id": "DOC-010",
   "titre": "Gouvernance & RACI",
   "chemin": "00_PILOTAGE/02_Gouvernance-RACI.md",
   "type": "Gouvernance",
   "phase": "P0",
   "taches": [
    "T003"
   ],
   "statut": "En cours",
   "version": "0.2",
   "responsable": "CDP",
   "date": "2026-10-05",
   "tags": "copil, raci, rôles, instances",
   "description": "Document de pilotage.",
   "livrable": false,
   "versions": [
    {
     "v": "0.2",
     "date": "2026-10-05",
     "auteur": "Claude (Cowork) pour U-Com",
     "note": "Création",
     "chemin": "00_PILOTAGE/02_Gouvernance-RACI.md"
    }
   ]
  },
  {
   "id": "DOC-011",
   "titre": "Conventions du projet",
   "chemin": "00_PILOTAGE/03_Conventions.md",
   "type": "Guide",
   "phase": "P0",
   "taches": [
    "T001"
   ],
   "statut": "En cours",
   "version": "0.2",
   "responsable": "CDP",
   "date": "2026-10-05",
   "tags": "nommage, versions, identifiants",
   "description": "Document de pilotage.",
   "livrable": false,
   "versions": [
    {
     "v": "0.2",
     "date": "2026-10-05",
     "auteur": "Claude (Cowork) pour U-Com",
     "note": "Création",
     "chemin": "00_PILOTAGE/03_Conventions.md"
    }
   ]
  },
  {
   "id": "DOC-012",
   "titre": "Informations requises",
   "chemin": "00_PILOTAGE/04_Informations-requises.md",
   "type": "Suivi",
   "phase": "P0",
   "taches": [
    "T002"
   ],
   "statut": "En cours",
   "version": "0.2",
   "responsable": "CDP",
   "date": "2026-10-05",
   "tags": "cadrage, informations, besoins",
   "description": "Document de pilotage.",
   "livrable": false,
   "versions": [
    {
     "v": "0.2",
     "date": "2026-10-05",
     "auteur": "Claude (Cowork) pour U-Com",
     "note": "Création",
     "chemin": "00_PILOTAGE/04_Informations-requises.md"
    }
   ]
  },
  {
   "id": "DOC-013",
   "titre": "Compétences & agents IA",
   "chemin": "00_PILOTAGE/05_Competences-et-agents.md",
   "type": "Guide",
   "phase": "P0",
   "taches": [
    "T001"
   ],
   "statut": "En cours",
   "version": "0.2",
   "responsable": "CDP",
   "date": "2026-10-05",
   "tags": "skills, agents, compétences",
   "description": "Document de pilotage.",
   "livrable": false,
   "versions": [
    {
     "v": "0.2",
     "date": "2026-10-05",
     "auteur": "Claude (Cowork) pour U-Com",
     "note": "Création",
     "chemin": "00_PILOTAGE/05_Competences-et-agents.md"
    }
   ]
  },
  {
   "id": "DOC-014",
   "titre": "Processus de pilotage",
   "chemin": "00_PILOTAGE/06_Processus-de-pilotage.md",
   "type": "Processus",
   "phase": "P0",
   "taches": [
    "T001"
   ],
   "statut": "En cours",
   "version": "0.2",
   "responsable": "CDP",
   "date": "2026-10-05",
   "tags": "rituels, rapport, gate, escalade",
   "description": "Document de pilotage.",
   "livrable": false,
   "versions": [
    {
     "v": "0.2",
     "date": "2026-10-05",
     "auteur": "Claude (Cowork) pour U-Com",
     "note": "Création",
     "chemin": "00_PILOTAGE/06_Processus-de-pilotage.md"
    }
   ]
  },
  {
   "id": "DOC-015",
   "titre": "Plan de management des risques (projet v0.1)",
   "chemin": "00_PILOTAGE/07_Plan-management-risques.md",
   "type": "Processus",
   "phase": "P0",
   "taches": [
    "T006"
   ],
   "statut": "En cours",
   "version": "0.1",
   "responsable": "CDP",
   "date": "2026-10-05",
   "tags": "risques, retards, marges, baseline, alertes",
   "description": "Document de pilotage.",
   "livrable": false,
   "versions": [
    {
     "v": "0.1",
     "date": "2026-10-05",
     "auteur": "Claude (Cowork) pour U-Com",
     "note": "Création",
     "chemin": "00_PILOTAGE/07_Plan-management-risques.md"
    }
   ]
  },
  {
   "id": "DOC-016",
   "titre": "Traçabilité & versionnage",
   "chemin": "00_PILOTAGE/08_Tracabilite-versionnage.md",
   "type": "Processus",
   "phase": "P0",
   "taches": [
    "T001"
   ],
   "statut": "En cours",
   "version": "0.2",
   "responsable": "CDP",
   "date": "2026-10-05",
   "tags": "historique, versions, décisions, traçabilité",
   "description": "Document de pilotage.",
   "livrable": false,
   "versions": [
    {
     "v": "0.2",
     "date": "2026-10-05",
     "auteur": "Claude (Cowork) pour U-Com",
     "note": "Création",
     "chemin": "00_PILOTAGE/08_Tracabilite-versionnage.md"
    }
   ]
  },
  {
   "id": "DOC-017",
   "titre": "Plateforme — modes d'utilisation & options",
   "chemin": "00_PILOTAGE/Tableau-de-bord/README-hebergement.md",
   "type": "Guide",
   "phase": "P0",
   "taches": [
    "T001"
   ],
   "statut": "En cours",
   "version": "0.2",
   "responsable": "CDP",
   "date": "2026-10-05",
   "tags": "plateforme, serveur, sqlite, hébergement",
   "description": "Document de pilotage.",
   "livrable": false,
   "versions": [
    {
     "v": "0.2",
     "date": "2026-10-05",
     "auteur": "Claude (Cowork) pour U-Com",
     "note": "Création",
     "chemin": "00_PILOTAGE/Tableau-de-bord/README-hebergement.md"
    }
   ]
  },
  {
   "id": "DOC-018",
   "titre": "Plateforme — déploiement Infomaniak",
   "chemin": "00_PILOTAGE/Tableau-de-bord/DEPLOIEMENT-INFOMANIAK.md",
   "type": "Guide",
   "phase": "P0",
   "taches": [
    "T001"
   ],
   "statut": "En cours",
   "version": "0.2",
   "responsable": "CDP",
   "date": "2026-10-05",
   "tags": "plateforme, infomaniak, github, déploiement, comptes, sécurité",
   "description": "Document de pilotage.",
   "livrable": false,
   "versions": [
    {
     "v": "0.2",
     "date": "2026-10-05",
     "auteur": "Claude (Cowork) pour U-Com",
     "note": "Création",
     "chemin": "00_PILOTAGE/Tableau-de-bord/DEPLOIEMENT-INFOMANIAK.md"
    }
   ]
  },
  {
   "id": "DOC-019",
   "titre": "Skill hepvd-charte",
   "chemin": "00_PILOTAGE/Skills/hepvd-charte/SKILL.md",
   "type": "Skill",
   "phase": "P0",
   "taches": [
    "T001"
   ],
   "statut": "En cours",
   "version": "1.0",
   "responsable": "CDP",
   "date": "2026-10-05",
   "tags": "skill, claude, hepvd-charte",
   "description": "Copie de référence du skill Claude.",
   "livrable": false,
   "versions": [
    {
     "v": "1.0",
     "date": "2026-10-05",
     "auteur": "Claude (Cowork) pour U-Com",
     "note": "Création",
     "chemin": "00_PILOTAGE/Skills/hepvd-charte/SKILL.md"
    }
   ]
  },
  {
   "id": "DOC-020",
   "titre": "Skill hepvd-contexte-refonte",
   "chemin": "00_PILOTAGE/Skills/hepvd-contexte-refonte/SKILL.md",
   "type": "Skill",
   "phase": "P0",
   "taches": [
    "T001"
   ],
   "statut": "En cours",
   "version": "1.0",
   "responsable": "CDP",
   "date": "2026-10-05",
   "tags": "skill, claude, hepvd-contexte-refonte",
   "description": "Copie de référence du skill Claude.",
   "livrable": false,
   "versions": [
    {
     "v": "1.0",
     "date": "2026-10-05",
     "auteur": "Claude (Cowork) pour U-Com",
     "note": "Création",
     "chemin": "00_PILOTAGE/Skills/hepvd-contexte-refonte/SKILL.md"
    }
   ]
  },
  {
   "id": "DOC-021",
   "titre": "Skill hepvd-rapport-hebdo",
   "chemin": "00_PILOTAGE/Skills/hepvd-rapport-hebdo/SKILL.md",
   "type": "Skill",
   "phase": "P0",
   "taches": [
    "T001"
   ],
   "statut": "En cours",
   "version": "1.0",
   "responsable": "CDP",
   "date": "2026-10-05",
   "tags": "skill, claude, hepvd-rapport-hebdo",
   "description": "Copie de référence du skill Claude.",
   "livrable": false,
   "versions": [
    {
     "v": "1.0",
     "date": "2026-10-05",
     "auteur": "Claude (Cowork) pour U-Com",
     "note": "Création",
     "chemin": "00_PILOTAGE/Skills/hepvd-rapport-hebdo/SKILL.md"
    }
   ]
  },
  {
   "id": "DOC-022",
   "titre": "Skill hepvd-redaction-web",
   "chemin": "00_PILOTAGE/Skills/hepvd-redaction-web/SKILL.md",
   "type": "Skill",
   "phase": "P0",
   "taches": [
    "T001"
   ],
   "statut": "En cours",
   "version": "1.0",
   "responsable": "CDP",
   "date": "2026-10-05",
   "tags": "skill, claude, hepvd-redaction-web",
   "description": "Copie de référence du skill Claude.",
   "livrable": false,
   "versions": [
    {
     "v": "1.0",
     "date": "2026-10-05",
     "auteur": "Claude (Cowork) pour U-Com",
     "note": "Création",
     "chemin": "00_PILOTAGE/Skills/hepvd-redaction-web/SKILL.md"
    }
   ]
  },
  {
   "id": "DOC-023",
   "titre": "Skill hepvd-revue-gate",
   "chemin": "00_PILOTAGE/Skills/hepvd-revue-gate/SKILL.md",
   "type": "Skill",
   "phase": "P0",
   "taches": [
    "T001"
   ],
   "statut": "En cours",
   "version": "1.0",
   "responsable": "CDP",
   "date": "2026-10-05",
   "tags": "skill, claude, hepvd-revue-gate",
   "description": "Copie de référence du skill Claude.",
   "livrable": false,
   "versions": [
    {
     "v": "1.0",
     "date": "2026-10-05",
     "auteur": "Claude (Cowork) pour U-Com",
     "note": "Création",
     "chemin": "00_PILOTAGE/Skills/hepvd-revue-gate/SKILL.md"
    }
   ]
  },
  {
   "id": "DOC-024",
   "titre": "Guide de création du Design System",
   "chemin": "05_DESIGN-SYSTEM/00_Guide-Design-System.md",
   "type": "Guide",
   "phase": "P4",
   "taches": [
    "T034"
   ],
   "statut": "En cours",
   "version": "0.1",
   "responsable": "UI",
   "date": "2026-10-05",
   "tags": "design system, tokens, composants, gouvernance, besoins",
   "description": "Comment construire, remettre en question et faire évoluer le DS ; liste précise des besoins.",
   "livrable": true,
   "versions": [
    {
     "v": "0.1",
     "date": "2026-10-05",
     "auteur": "Claude (Cowork) pour U-Com",
     "note": "Création",
     "chemin": "05_DESIGN-SYSTEM/00_Guide-Design-System.md"
    }
   ]
  },
  {
   "id": "DOC-025",
   "titre": "README phase P0 — Initialisation & cadrage",
   "chemin": "01_CADRAGE/README.md",
   "type": "Guide",
   "phase": "P0",
   "taches": [],
   "statut": "Référence",
   "version": "0.2",
   "responsable": "CDP",
   "date": "2026-10-05",
   "tags": "phase, étapes, livrables, gate",
   "description": "Organisation et contenu attendu de la phase.",
   "livrable": false,
   "versions": [
    {
     "v": "0.2",
     "date": "2026-10-05",
     "auteur": "Claude (Cowork) pour U-Com",
     "note": "Création",
     "chemin": "01_CADRAGE/README.md"
    }
   ]
  },
  {
   "id": "DOC-026",
   "titre": "README phase P1 — Audit & découverte de l'existant",
   "chemin": "02_AUDIT-EXISTANT/README.md",
   "type": "Guide",
   "phase": "P1",
   "taches": [],
   "statut": "Référence",
   "version": "0.2",
   "responsable": "CDP",
   "date": "2026-10-05",
   "tags": "phase, étapes, livrables, gate",
   "description": "Organisation et contenu attendu de la phase.",
   "livrable": false,
   "versions": [
    {
     "v": "0.2",
     "date": "2026-10-05",
     "auteur": "Claude (Cowork) pour U-Com",
     "note": "Création",
     "chemin": "02_AUDIT-EXISTANT/README.md"
    }
   ]
  },
  {
   "id": "DOC-027",
   "titre": "README phase P2 — Recherche utilisateurs & stratégie",
   "chemin": "03_RECHERCHE-STRATEGIE/README.md",
   "type": "Guide",
   "phase": "P2",
   "taches": [],
   "statut": "Référence",
   "version": "0.2",
   "responsable": "CDP",
   "date": "2026-10-05",
   "tags": "phase, étapes, livrables, gate",
   "description": "Organisation et contenu attendu de la phase.",
   "livrable": false,
   "versions": [
    {
     "v": "0.2",
     "date": "2026-10-05",
     "auteur": "Claude (Cowork) pour U-Com",
     "note": "Création",
     "chemin": "03_RECHERCHE-STRATEGIE/README.md"
    }
   ]
  },
  {
   "id": "DOC-028",
   "titre": "README phase P3 — Architecture de l'information & contenus",
   "chemin": "04_ARCHITECTURE-INFO-CONTENUS/README.md",
   "type": "Guide",
   "phase": "P3",
   "taches": [],
   "statut": "Référence",
   "version": "0.2",
   "responsable": "CDP",
   "date": "2026-10-05",
   "tags": "phase, étapes, livrables, gate",
   "description": "Organisation et contenu attendu de la phase.",
   "livrable": false,
   "versions": [
    {
     "v": "0.2",
     "date": "2026-10-05",
     "auteur": "Claude (Cowork) pour U-Com",
     "note": "Création",
     "chemin": "04_ARCHITECTURE-INFO-CONTENUS/README.md"
    }
   ]
  },
  {
   "id": "DOC-029",
   "titre": "README phase P4 — Design System & style guide",
   "chemin": "05_DESIGN-SYSTEM/README.md",
   "type": "Guide",
   "phase": "P4",
   "taches": [],
   "statut": "Référence",
   "version": "0.2",
   "responsable": "CDP",
   "date": "2026-10-05",
   "tags": "phase, étapes, livrables, gate",
   "description": "Organisation et contenu attendu de la phase.",
   "livrable": false,
   "versions": [
    {
     "v": "0.2",
     "date": "2026-10-05",
     "auteur": "Claude (Cowork) pour U-Com",
     "note": "Création",
     "chemin": "05_DESIGN-SYSTEM/README.md"
    }
   ]
  },
  {
   "id": "DOC-030",
   "titre": "README phase P5 — Gabarits, maquettes & prototypes",
   "chemin": "06_TEMPLATES-PROTOTYPES/README.md",
   "type": "Guide",
   "phase": "P5",
   "taches": [],
   "statut": "Référence",
   "version": "0.2",
   "responsable": "CDP",
   "date": "2026-10-05",
   "tags": "phase, étapes, livrables, gate",
   "description": "Organisation et contenu attendu de la phase.",
   "livrable": false,
   "versions": [
    {
     "v": "0.2",
     "date": "2026-10-05",
     "auteur": "Claude (Cowork) pour U-Com",
     "note": "Création",
     "chemin": "06_TEMPLATES-PROTOTYPES/README.md"
    }
   ]
  },
  {
   "id": "DOC-031",
   "titre": "README phase P6 — Architecture technique Jahia 8 & intégrations",
   "chemin": "07_TECHNIQUE-INTEGRATIONS/README.md",
   "type": "Guide",
   "phase": "P6",
   "taches": [],
   "statut": "Référence",
   "version": "0.2",
   "responsable": "CDP",
   "date": "2026-10-05",
   "tags": "phase, étapes, livrables, gate",
   "description": "Organisation et contenu attendu de la phase.",
   "livrable": false,
   "versions": [
    {
     "v": "0.2",
     "date": "2026-10-05",
     "auteur": "Claude (Cowork) pour U-Com",
     "note": "Création",
     "chemin": "07_TECHNIQUE-INTEGRATIONS/README.md"
    }
   ]
  },
  {
   "id": "DOC-032",
   "titre": "README phase P7 — Développement interne",
   "chemin": "08_DEVELOPPEMENT/README.md",
   "type": "Guide",
   "phase": "P7",
   "taches": [],
   "statut": "Référence",
   "version": "0.2",
   "responsable": "CDP",
   "date": "2026-10-05",
   "tags": "phase, étapes, livrables, gate",
   "description": "Organisation et contenu attendu de la phase.",
   "livrable": false,
   "versions": [
    {
     "v": "0.2",
     "date": "2026-10-05",
     "auteur": "Claude (Cowork) pour U-Com",
     "note": "Création",
     "chemin": "08_DEVELOPPEMENT/README.md"
    }
   ]
  },
  {
   "id": "DOC-033",
   "titre": "README phase P8 — Migration de contenus",
   "chemin": "09_MIGRATION-CONTENUS/README.md",
   "type": "Guide",
   "phase": "P8",
   "taches": [],
   "statut": "Référence",
   "version": "0.2",
   "responsable": "CDP",
   "date": "2026-10-05",
   "tags": "phase, étapes, livrables, gate",
   "description": "Organisation et contenu attendu de la phase.",
   "livrable": false,
   "versions": [
    {
     "v": "0.2",
     "date": "2026-10-05",
     "auteur": "Claude (Cowork) pour U-Com",
     "note": "Création",
     "chemin": "09_MIGRATION-CONTENUS/README.md"
    }
   ]
  },
  {
   "id": "DOC-034",
   "titre": "README phase P9 — Qualité & recette",
   "chemin": "10_QUALITE-RECETTE/README.md",
   "type": "Guide",
   "phase": "P9",
   "taches": [],
   "statut": "Référence",
   "version": "0.2",
   "responsable": "CDP",
   "date": "2026-10-05",
   "tags": "phase, étapes, livrables, gate",
   "description": "Organisation et contenu attendu de la phase.",
   "livrable": false,
   "versions": [
    {
     "v": "0.2",
     "date": "2026-10-05",
     "auteur": "Claude (Cowork) pour U-Com",
     "note": "Création",
     "chemin": "10_QUALITE-RECETTE/README.md"
    }
   ]
  },
  {
   "id": "DOC-035",
   "titre": "README phase P10 — Lancement & conduite du changement",
   "chemin": "11_LANCEMENT-CHANGEMENT/README.md",
   "type": "Guide",
   "phase": "P10",
   "taches": [],
   "statut": "Référence",
   "version": "0.2",
   "responsable": "CDP",
   "date": "2026-10-05",
   "tags": "phase, étapes, livrables, gate",
   "description": "Organisation et contenu attendu de la phase.",
   "livrable": false,
   "versions": [
    {
     "v": "0.2",
     "date": "2026-10-05",
     "auteur": "Claude (Cowork) pour U-Com",
     "note": "Création",
     "chemin": "11_LANCEMENT-CHANGEMENT/README.md"
    }
   ]
  },
  {
   "id": "DOC-036",
   "titre": "README phase P11 — Run & amélioration continue",
   "chemin": "12_RUN-AMELIORATION/README.md",
   "type": "Guide",
   "phase": "P11",
   "taches": [],
   "statut": "Référence",
   "version": "0.2",
   "responsable": "CDP",
   "date": "2026-10-05",
   "tags": "phase, étapes, livrables, gate",
   "description": "Organisation et contenu attendu de la phase.",
   "livrable": false,
   "versions": [
    {
     "v": "0.2",
     "date": "2026-10-05",
     "auteur": "Claude (Cowork) pour U-Com",
     "note": "Création",
     "chemin": "12_RUN-AMELIORATION/README.md"
    }
   ]
  },
  {
   "id": "DOC-037",
   "titre": "Modèle — Rapport hebdomadaire",
   "chemin": "_MODELES/Rapport-hebdomadaire.md",
   "type": "Modèle",
   "phase": "P0",
   "taches": [],
   "statut": "Référence",
   "version": "1.0",
   "responsable": "PMO",
   "date": "2026-10-05",
   "tags": "modèle, gabarit",
   "description": "Gabarit de document projet.",
   "livrable": false,
   "versions": [
    {
     "v": "1.0",
     "date": "2026-10-05",
     "auteur": "Claude (Cowork) pour U-Com",
     "note": "Création",
     "chemin": "_MODELES/Rapport-hebdomadaire.md"
    }
   ]
  },
  {
   "id": "DOC-038",
   "titre": "Modèle — PV reunion",
   "chemin": "_MODELES/PV-reunion.md",
   "type": "Modèle",
   "phase": "P0",
   "taches": [],
   "statut": "Référence",
   "version": "1.0",
   "responsable": "PMO",
   "date": "2026-10-05",
   "tags": "modèle, gabarit",
   "description": "Gabarit de document projet.",
   "livrable": false,
   "versions": [
    {
     "v": "1.0",
     "date": "2026-10-05",
     "auteur": "Claude (Cowork) pour U-Com",
     "note": "Création",
     "chemin": "_MODELES/PV-reunion.md"
    }
   ]
  },
  {
   "id": "DOC-039",
   "titre": "Modèle — ADR decision",
   "chemin": "_MODELES/ADR-decision.md",
   "type": "Modèle",
   "phase": "P0",
   "taches": [],
   "statut": "Référence",
   "version": "1.0",
   "responsable": "PMO",
   "date": "2026-10-05",
   "tags": "modèle, gabarit",
   "description": "Gabarit de document projet.",
   "livrable": false,
   "versions": [
    {
     "v": "1.0",
     "date": "2026-10-05",
     "auteur": "Claude (Cowork) pour U-Com",
     "note": "Création",
     "chemin": "_MODELES/ADR-decision.md"
    }
   ]
  },
  {
   "id": "DOC-040",
   "titre": "Modèle — Fiche questionnement",
   "chemin": "_MODELES/Fiche-questionnement.md",
   "type": "Modèle",
   "phase": "P0",
   "taches": [],
   "statut": "Référence",
   "version": "1.0",
   "responsable": "PMO",
   "date": "2026-10-05",
   "tags": "modèle, gabarit",
   "description": "Gabarit de document projet.",
   "livrable": false,
   "versions": [
    {
     "v": "1.0",
     "date": "2026-10-05",
     "auteur": "Claude (Cowork) pour U-Com",
     "note": "Création",
     "chemin": "_MODELES/Fiche-questionnement.md"
    }
   ]
  },
  {
   "id": "DOC-041",
   "titre": "Modèle — Revue de gate",
   "chemin": "_MODELES/Revue-de-gate.md",
   "type": "Modèle",
   "phase": "P0",
   "taches": [],
   "statut": "Référence",
   "version": "1.0",
   "responsable": "PMO",
   "date": "2026-10-05",
   "tags": "modèle, gabarit",
   "description": "Gabarit de document projet.",
   "livrable": false,
   "versions": [
    {
     "v": "1.0",
     "date": "2026-10-05",
     "auteur": "Claude (Cowork) pour U-Com",
     "note": "Création",
     "chemin": "_MODELES/Revue-de-gate.md"
    }
   ]
  },
  {
   "id": "DOC-042",
   "titre": "Modèle — Revue critique",
   "chemin": "_MODELES/Revue-critique.md",
   "type": "Modèle",
   "phase": "P0",
   "taches": [],
   "statut": "Référence",
   "version": "1.0",
   "responsable": "PMO",
   "date": "2026-10-05",
   "tags": "modèle, gabarit",
   "description": "Gabarit de document projet.",
   "livrable": false,
   "versions": [
    {
     "v": "1.0",
     "date": "2026-10-05",
     "auteur": "Claude (Cowork) pour U-Com",
     "note": "Création",
     "chemin": "_MODELES/Revue-critique.md"
    }
   ]
  },
  {
   "id": "DOC-043",
   "titre": "Modèle — Revue de risques",
   "chemin": "_MODELES/Revue-de-risques.md",
   "type": "Modèle",
   "phase": "P0",
   "taches": [],
   "statut": "Référence",
   "version": "1.0",
   "responsable": "PMO",
   "date": "2026-10-05",
   "tags": "modèle, gabarit",
   "description": "Gabarit de document projet.",
   "livrable": false,
   "versions": [
    {
     "v": "1.0",
     "date": "2026-10-05",
     "auteur": "Claude (Cowork) pour U-Com",
     "note": "Création",
     "chemin": "_MODELES/Revue-de-risques.md"
    }
   ]
  },
  {
   "id": "DOC-044",
   "titre": "Modèle — Demande de changement",
   "chemin": "_MODELES/Demande-de-changement.md",
   "type": "Modèle",
   "phase": "P0",
   "taches": [],
   "statut": "Référence",
   "version": "1.0",
   "responsable": "PMO",
   "date": "2026-10-05",
   "tags": "modèle, gabarit",
   "description": "Gabarit de document projet.",
   "livrable": false,
   "versions": [
    {
     "v": "1.0",
     "date": "2026-10-05",
     "auteur": "Claude (Cowork) pour U-Com",
     "note": "Création",
     "chemin": "_MODELES/Demande-de-changement.md"
    }
   ]
  },
  {
   "id": "DOC-045",
   "titre": "Modèle — Demande evolution DS",
   "chemin": "_MODELES/Demande-evolution-DS.md",
   "type": "Modèle",
   "phase": "P0",
   "taches": [],
   "statut": "Référence",
   "version": "1.0",
   "responsable": "PMO",
   "date": "2026-10-05",
   "tags": "modèle, gabarit",
   "description": "Gabarit de document projet.",
   "livrable": false,
   "versions": [
    {
     "v": "1.0",
     "date": "2026-10-05",
     "auteur": "Claude (Cowork) pour U-Com",
     "note": "Création",
     "chemin": "_MODELES/Demande-evolution-DS.md"
    }
   ]
  },
  {
   "id": "DOC-046",
   "titre": "Modèle — Fiche composant DS",
   "chemin": "_MODELES/Fiche-composant-DS.md",
   "type": "Modèle",
   "phase": "P0",
   "taches": [],
   "statut": "Référence",
   "version": "1.0",
   "responsable": "PMO",
   "date": "2026-10-05",
   "tags": "modèle, gabarit",
   "description": "Gabarit de document projet.",
   "livrable": false,
   "versions": [
    {
     "v": "1.0",
     "date": "2026-10-05",
     "auteur": "Claude (Cowork) pour U-Com",
     "note": "Création",
     "chemin": "_MODELES/Fiche-composant-DS.md"
    }
   ]
  },
  {
   "id": "DOC-047",
   "titre": "Modèle — Release notes DS",
   "chemin": "_MODELES/Release-notes-DS.md",
   "type": "Modèle",
   "phase": "P0",
   "taches": [],
   "statut": "Référence",
   "version": "1.0",
   "responsable": "PMO",
   "date": "2026-10-05",
   "tags": "modèle, gabarit",
   "description": "Gabarit de document projet.",
   "livrable": false,
   "versions": [
    {
     "v": "1.0",
     "date": "2026-10-05",
     "auteur": "Claude (Cowork) pour U-Com",
     "note": "Création",
     "chemin": "_MODELES/Release-notes-DS.md"
    }
   ]
  },
  {
   "id": "DOC-048",
   "titre": "Modèle — Fiche persona",
   "chemin": "_MODELES/Fiche-persona.md",
   "type": "Modèle",
   "phase": "P0",
   "taches": [],
   "statut": "Référence",
   "version": "1.0",
   "responsable": "PMO",
   "date": "2026-10-05",
   "tags": "modèle, gabarit",
   "description": "Gabarit de document projet.",
   "livrable": false,
   "versions": [
    {
     "v": "1.0",
     "date": "2026-10-05",
     "auteur": "Claude (Cowork) pour U-Com",
     "note": "Création",
     "chemin": "_MODELES/Fiche-persona.md"
    }
   ]
  },
  {
   "id": "DOC-049",
   "titre": "Modèle — Fiche gabarit",
   "chemin": "_MODELES/Fiche-gabarit.md",
   "type": "Modèle",
   "phase": "P0",
   "taches": [],
   "statut": "Référence",
   "version": "1.0",
   "responsable": "PMO",
   "date": "2026-10-05",
   "tags": "modèle, gabarit",
   "description": "Gabarit de document projet.",
   "livrable": false,
   "versions": [
    {
     "v": "1.0",
     "date": "2026-10-05",
     "auteur": "Claude (Cowork) pour U-Com",
     "note": "Création",
     "chemin": "_MODELES/Fiche-gabarit.md"
    }
   ]
  },
  {
   "id": "DOC-050",
   "titre": "Modèle — Fiche integration API",
   "chemin": "_MODELES/Fiche-integration-API.md",
   "type": "Modèle",
   "phase": "P0",
   "taches": [],
   "statut": "Référence",
   "version": "1.0",
   "responsable": "PMO",
   "date": "2026-10-05",
   "tags": "modèle, gabarit",
   "description": "Gabarit de document projet.",
   "livrable": false,
   "versions": [
    {
     "v": "1.0",
     "date": "2026-10-05",
     "auteur": "Claude (Cowork) pour U-Com",
     "note": "Création",
     "chemin": "_MODELES/Fiche-integration-API.md"
    }
   ]
  },
  {
   "id": "DOC-051",
   "titre": "Modèle — Brief agent IA",
   "chemin": "_MODELES/Brief-agent-IA.md",
   "type": "Modèle",
   "phase": "P0",
   "taches": [],
   "statut": "Référence",
   "version": "1.0",
   "responsable": "PMO",
   "date": "2026-10-05",
   "tags": "modèle, gabarit",
   "description": "Gabarit de document projet.",
   "livrable": false,
   "versions": [
    {
     "v": "1.0",
     "date": "2026-10-05",
     "auteur": "Claude (Cowork) pour U-Com",
     "note": "Création",
     "chemin": "_MODELES/Brief-agent-IA.md"
    }
   ]
  },
  {
   "id": "DOC-052",
   "titre": "Modèle — Bilan de phase",
   "chemin": "_MODELES/Bilan-de-phase.md",
   "type": "Modèle",
   "phase": "P0",
   "taches": [],
   "statut": "Référence",
   "version": "1.0",
   "responsable": "PMO",
   "date": "2026-10-05",
   "tags": "modèle, gabarit",
   "description": "Gabarit de document projet.",
   "livrable": false,
   "versions": [
    {
     "v": "1.0",
     "date": "2026-10-05",
     "auteur": "Claude (Cowork) pour U-Com",
     "note": "Création",
     "chemin": "_MODELES/Bilan-de-phase.md"
    }
   ]
  },
  {
   "id": "DOC-053",
   "titre": "Dossier projet & plateforme de pilotage",
   "chemin": "00_PILOTAGE/Tableau-de-bord/index.html",
   "type": "Outil",
   "phase": "P0",
   "taches": [
    "T001"
   ],
   "statut": "En cours",
   "version": "0.3",
   "responsable": "CDP",
   "date": "2026-10-05",
   "tags": "livrable, initialisation & cadrage",
   "description": "Livrable attendu de la phase P0.",
   "livrable": true,
   "versions": [
    {
     "v": "0.1",
     "date": "2026-10-05",
     "auteur": "Claude (Cowork) pour U-Com",
     "note": "Première version (stockage navigateur)",
     "chemin": "00_PILOTAGE/Tableau-de-bord/index.html"
    },
    {
     "v": "0.2",
     "date": "2026-10-05",
     "auteur": "Claude (Cowork) pour U-Com",
     "note": "Base SQLite, documents, traçabilité, anticipation des risques, Design System",
     "chemin": "00_PILOTAGE/Tableau-de-bord/index.html"
    },
    {
     "v": "0.3",
     "date": "2026-10-05",
     "auteur": "Claude (Cowork) pour U-Com",
     "note": "Comptes et rôles, installation sécurisée, déploiement Infomaniak via GitHub",
     "chemin": "00_PILOTAGE/Tableau-de-bord/index.html"
    }
   ]
  },
  {
   "id": "DOC-054",
   "titre": "Note de cadrage (objectifs, périmètre, budget, contraintes)",
   "chemin": "01_CADRAGE/03_Livrables/P0_Note-de-cadrage_v1.0.docx",
   "type": "Document",
   "phase": "P0",
   "taches": [
    "T004"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "CDP",
   "date": "2026-10-05",
   "tags": "livrable, initialisation & cadrage",
   "description": "Livrable attendu de la phase P0.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-055",
   "titre": "Organisation projet & RACI",
   "chemin": "01_CADRAGE/03_Livrables/P0_Gouvernance-RACI_v1.0.xlsx",
   "type": "Tableau",
   "phase": "P0",
   "taches": [
    "T003"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "CDP",
   "date": "2026-10-05",
   "tags": "livrable, initialisation & cadrage",
   "description": "Livrable attendu de la phase P0.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-056",
   "titre": "Cartographie des parties prenantes",
   "chemin": "01_CADRAGE/03_Livrables/P0_Parties-prenantes_v1.0.xlsx",
   "type": "Tableau",
   "phase": "P0",
   "taches": [
    "T005"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "CDP",
   "date": "2026-10-05",
   "tags": "livrable, initialisation & cadrage",
   "description": "Livrable attendu de la phase P0.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-057",
   "titre": "Plan de management des risques",
   "chemin": "01_CADRAGE/03_Livrables/P0_Plan-management-risques_v1.0.docx",
   "type": "Document",
   "phase": "P0",
   "taches": [
    "T006"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "CDP",
   "date": "2026-10-05",
   "tags": "livrable, initialisation & cadrage",
   "description": "Livrable attendu de la phase P0.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-058",
   "titre": "Répartition budgétaire CHF 10'000",
   "chemin": "01_CADRAGE/03_Livrables/P0_Budget_v1.0.xlsx",
   "type": "Tableau",
   "phase": "P0",
   "taches": [
    "T007"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "CDP",
   "date": "2026-10-05",
   "tags": "livrable, initialisation & cadrage",
   "description": "Livrable attendu de la phase P0.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-059",
   "titre": "KPI de succès & baseline",
   "chemin": "01_CADRAGE/03_Livrables/P0_KPI-baseline_v1.0.xlsx",
   "type": "Tableau",
   "phase": "P0",
   "taches": [
    "T008"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "PMO",
   "date": "2026-10-05",
   "tags": "livrable, initialisation & cadrage",
   "description": "Livrable attendu de la phase P0.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-060",
   "titre": "Planning de référence (baseline 1)",
   "chemin": "01_CADRAGE/03_Livrables/P0_Baseline-planning_v1.0.pdf",
   "type": "Document",
   "phase": "P0",
   "taches": [
    "T009"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "PMO",
   "date": "2026-10-05",
   "tags": "livrable, initialisation & cadrage",
   "description": "Livrable attendu de la phase P0.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-061",
   "titre": "Support & PV du Copil de lancement",
   "chemin": "01_CADRAGE/04_Validation/P0_Copil-lancement.pptx",
   "type": "Présentation",
   "phase": "P0",
   "taches": [
    "T010"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "CDP",
   "date": "2026-10-05",
   "tags": "livrable, initialisation & cadrage",
   "description": "Livrable attendu de la phase P0.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-062",
   "titre": "Inventaire exhaustif des pages",
   "chemin": "02_AUDIT-EXISTANT/03_Livrables/P1_Inventaire-pages_v1.0.xlsx",
   "type": "Tableau",
   "phase": "P1",
   "taches": [
    "T011"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "CONT",
   "date": "2026-10-05",
   "tags": "livrable, audit & découverte de l'existant",
   "description": "Livrable attendu de la phase P1.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-063",
   "titre": "Analyse d'audience (24 mois)",
   "chemin": "02_AUDIT-EXISTANT/03_Livrables/P1_Analyse-audience_v1.0.docx",
   "type": "Document",
   "phase": "P1",
   "taches": [
    "T012"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "UCOM",
   "date": "2026-10-05",
   "tags": "livrable, audit & découverte de l'existant",
   "description": "Livrable attendu de la phase P1.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-064",
   "titre": "Audit de contenu (ROT)",
   "chemin": "02_AUDIT-EXISTANT/03_Livrables/P1_Audit-contenu_v1.0.xlsx",
   "type": "Tableau",
   "phase": "P1",
   "taches": [
    "T013"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "CONT",
   "date": "2026-10-05",
   "tags": "livrable, audit & découverte de l'existant",
   "description": "Livrable attendu de la phase P1.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-065",
   "titre": "Inventaire d'interface (UI inventory) de l'existant",
   "chemin": "02_AUDIT-EXISTANT/03_Livrables/P1_Inventaire-interface_v1.0.pdf",
   "type": "Document",
   "phase": "P1",
   "taches": [
    "T014"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "UI",
   "date": "2026-10-05",
   "tags": "livrable, audit & découverte de l'existant",
   "description": "Livrable attendu de la phase P1.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-066",
   "titre": "Audit SEO",
   "chemin": "02_AUDIT-EXISTANT/03_Livrables/P1_Audit-SEO_v1.0.docx",
   "type": "Document",
   "phase": "P1",
   "taches": [
    "T015"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "UCOM",
   "date": "2026-10-05",
   "tags": "livrable, audit & découverte de l'existant",
   "description": "Livrable attendu de la phase P1.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-067",
   "titre": "Audit accessibilité (échantillon)",
   "chemin": "02_AUDIT-EXISTANT/03_Livrables/P1_Audit-accessibilite_v1.0.docx",
   "type": "Document",
   "phase": "P1",
   "taches": [
    "T016"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "A11Y",
   "date": "2026-10-05",
   "tags": "livrable, audit & découverte de l'existant",
   "description": "Livrable attendu de la phase P1.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-068",
   "titre": "État des lieux technique Jahia 8 & portails",
   "chemin": "02_AUDIT-EXISTANT/03_Livrables/P1_Etat-technique_v1.0.docx",
   "type": "Document",
   "phase": "P1",
   "taches": [
    "T017"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "DSI",
   "date": "2026-10-05",
   "tags": "livrable, audit & découverte de l'existant",
   "description": "Livrable attendu de la phase P1.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-069",
   "titre": "Benchmark hautes écoles",
   "chemin": "02_AUDIT-EXISTANT/03_Livrables/P1_Benchmark_v1.0.pptx",
   "type": "Présentation",
   "phase": "P1",
   "taches": [
    "T018"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "UX",
   "date": "2026-10-05",
   "tags": "livrable, audit & découverte de l'existant",
   "description": "Livrable attendu de la phase P1.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-070",
   "titre": "Synthèse diagnostic",
   "chemin": "02_AUDIT-EXISTANT/03_Livrables/P1_Synthese-diagnostic_v1.0.pptx",
   "type": "Présentation",
   "phase": "P1",
   "taches": [
    "T019"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "CDP",
   "date": "2026-10-05",
   "tags": "livrable, audit & découverte de l'existant",
   "description": "Livrable attendu de la phase P1.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-071",
   "titre": "Plan de recherche & guides d'entretien",
   "chemin": "03_RECHERCHE-STRATEGIE/03_Livrables/P2_Plan-recherche_v1.0.docx",
   "type": "Document",
   "phase": "P2",
   "taches": [
    "T020"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "UX",
   "date": "2026-10-05",
   "tags": "livrable, recherche utilisateurs & stratégie",
   "description": "Livrable attendu de la phase P2.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-072",
   "titre": "Comptes rendus d'entretiens et d'ateliers",
   "chemin": "03_RECHERCHE-STRATEGIE/02_Travail/P2_Entretiens/",
   "type": "Dossier",
   "phase": "P2",
   "taches": [
    "T021"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "UX",
   "date": "2026-10-05",
   "tags": "livrable, recherche utilisateurs & stratégie",
   "description": "Livrable attendu de la phase P2.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-073",
   "titre": "Résultats d'enquête",
   "chemin": "03_RECHERCHE-STRATEGIE/03_Livrables/P2_Enquete-resultats_v1.0.xlsx",
   "type": "Tableau",
   "phase": "P2",
   "taches": [
    "T022"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "UX",
   "date": "2026-10-05",
   "tags": "livrable, recherche utilisateurs & stratégie",
   "description": "Livrable attendu de la phase P2.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-074",
   "titre": "Personas & parcours",
   "chemin": "03_RECHERCHE-STRATEGIE/03_Livrables/P2_Personas-parcours_v1.0.pdf",
   "type": "Document",
   "phase": "P2",
   "taches": [
    "T023"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "UX",
   "date": "2026-10-05",
   "tags": "livrable, recherche utilisateurs & stratégie",
   "description": "Livrable attendu de la phase P2.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-075",
   "titre": "Vision produit & écosystème",
   "chemin": "03_RECHERCHE-STRATEGIE/03_Livrables/P2_Vision-produit_v1.0.pptx",
   "type": "Présentation",
   "phase": "P2",
   "taches": [
    "T024"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "CDP",
   "date": "2026-10-05",
   "tags": "livrable, recherche utilisateurs & stratégie",
   "description": "Livrable attendu de la phase P2.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-076",
   "titre": "Feuille de route fonctionnelle (MoSCoW)",
   "chemin": "03_RECHERCHE-STRATEGIE/03_Livrables/P2_Roadmap-fonctionnelle_v1.0.xlsx",
   "type": "Tableau",
   "phase": "P2",
   "taches": [
    "T026"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "PO",
   "date": "2026-10-05",
   "tags": "livrable, recherche utilisateurs & stratégie",
   "description": "Livrable attendu de la phase P2.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-077",
   "titre": "Résultats du tri de cartes",
   "chemin": "04_ARCHITECTURE-INFO-CONTENUS/03_Livrables/P3_Tri-de-cartes_v1.0.xlsx",
   "type": "Tableau",
   "phase": "P3",
   "taches": [
    "T027"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "UX",
   "date": "2026-10-05",
   "tags": "livrable, architecture de l'information & contenus",
   "description": "Livrable attendu de la phase P3.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-078",
   "titre": "Arborescence cible des 4 univers",
   "chemin": "04_ARCHITECTURE-INFO-CONTENUS/03_Livrables/P3_Arborescence_v1.0.xlsx",
   "type": "Tableau",
   "phase": "P3",
   "taches": [
    "T028"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "CONT",
   "date": "2026-10-05",
   "tags": "livrable, architecture de l'information & contenus",
   "description": "Livrable attendu de la phase P3.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-079",
   "titre": "Résultats des tests d'arborescence",
   "chemin": "04_ARCHITECTURE-INFO-CONTENUS/03_Livrables/P3_Tree-testing_v1.0.docx",
   "type": "Document",
   "phase": "P3",
   "taches": [
    "T029"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "UX",
   "date": "2026-10-05",
   "tags": "livrable, architecture de l'information & contenus",
   "description": "Livrable attendu de la phase P3.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-080",
   "titre": "Modèle de contenu & taxonomie",
   "chemin": "04_ARCHITECTURE-INFO-CONTENUS/03_Livrables/P3_Modele-de-contenu_v1.0.xlsx",
   "type": "Tableau",
   "phase": "P3",
   "taches": [
    "T030"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "CONT",
   "date": "2026-10-05",
   "tags": "livrable, architecture de l'information & contenus",
   "description": "Livrable attendu de la phase P3.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-081",
   "titre": "Charte éditoriale web",
   "chemin": "04_ARCHITECTURE-INFO-CONTENUS/03_Livrables/P3_Charte-editoriale-web_v1.0.docx",
   "type": "Document",
   "phase": "P3",
   "taches": [
    "T031"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "CONT",
   "date": "2026-10-05",
   "tags": "livrable, architecture de l'information & contenus",
   "description": "Livrable attendu de la phase P3.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-082",
   "titre": "Gouvernance éditoriale",
   "chemin": "04_ARCHITECTURE-INFO-CONTENUS/03_Livrables/P3_Gouvernance-editoriale_v1.0.docx",
   "type": "Document",
   "phase": "P3",
   "taches": [
    "T032"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "UCOM",
   "date": "2026-10-05",
   "tags": "livrable, architecture de l'information & contenus",
   "description": "Livrable attendu de la phase P3.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-083",
   "titre": "Matrice de migration",
   "chemin": "04_ARCHITECTURE-INFO-CONTENUS/03_Livrables/P3_Matrice-migration_v1.0.xlsx",
   "type": "Tableau",
   "phase": "P3",
   "taches": [
    "T033"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "CONT",
   "date": "2026-10-05",
   "tags": "livrable, architecture de l'information & contenus",
   "description": "Livrable attendu de la phase P3.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-084",
   "titre": "Gouvernance & modèle de contribution du DS",
   "chemin": "05_DESIGN-SYSTEM/03_Livrables/P4_Gouvernance-DS_v1.0.docx",
   "type": "Document",
   "phase": "P4",
   "taches": [
    "T034"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "UI",
   "date": "2026-10-05",
   "tags": "livrable, design system & style guide",
   "description": "Livrable attendu de la phase P4.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-085",
   "titre": "Rapport licences typographiques web",
   "chemin": "05_DESIGN-SYSTEM/03_Livrables/P4_Licences-polices_v1.0.docx",
   "type": "Document",
   "phase": "P4",
   "taches": [
    "T035"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "UCOM",
   "date": "2026-10-05",
   "tags": "livrable, design system & style guide",
   "description": "Livrable attendu de la phase P4.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-086",
   "titre": "Fondations : couleurs & rôles sémantiques",
   "chemin": "05_DESIGN-SYSTEM/03_Livrables/P4_Fondations-couleurs_v1.0.pdf",
   "type": "Document",
   "phase": "P4",
   "taches": [
    "T036"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "UI",
   "date": "2026-10-05",
   "tags": "livrable, design system & style guide",
   "description": "Livrable attendu de la phase P4.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-087",
   "titre": "Rapport de contrastes",
   "chemin": "05_DESIGN-SYSTEM/03_Livrables/P4_Contrastes_v1.0.xlsx",
   "type": "Tableau",
   "phase": "P4",
   "taches": [
    "T036"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "A11Y",
   "date": "2026-10-05",
   "tags": "livrable, design system & style guide",
   "description": "Livrable attendu de la phase P4.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-088",
   "titre": "Fondations : typographie",
   "chemin": "05_DESIGN-SYSTEM/03_Livrables/P4_Fondations-typographie_v1.0.pdf",
   "type": "Document",
   "phase": "P4",
   "taches": [
    "T037"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "UI",
   "date": "2026-10-05",
   "tags": "livrable, design system & style guide",
   "description": "Livrable attendu de la phase P4.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-089",
   "titre": "Fondations : grilles, espacements, Bento digital",
   "chemin": "05_DESIGN-SYSTEM/03_Livrables/P4_Fondations-grille-bento_v1.0.pdf",
   "type": "Document",
   "phase": "P4",
   "taches": [
    "T038"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "UI",
   "date": "2026-10-05",
   "tags": "livrable, design system & style guide",
   "description": "Livrable attendu de la phase P4.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-090",
   "titre": "Iconographie & imagerie",
   "chemin": "05_DESIGN-SYSTEM/03_Livrables/P4_Iconographie-imagerie_v1.0.pdf",
   "type": "Document",
   "phase": "P4",
   "taches": [
    "T039"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "UI",
   "date": "2026-10-05",
   "tags": "livrable, design system & style guide",
   "description": "Livrable attendu de la phase P4.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-091",
   "titre": "Design tokens (DTCG JSON) & pipeline",
   "chemin": "05_DESIGN-SYSTEM/03_Livrables/tokens/",
   "type": "Code",
   "phase": "P4",
   "taches": [
    "T040"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "DEV",
   "date": "2026-10-05",
   "tags": "livrable, design system & style guide",
   "description": "Livrable attendu de la phase P4.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-092",
   "titre": "Bibliothèque de composants v0.5 (base)",
   "chemin": "05_DESIGN-SYSTEM/03_Livrables/P4_Composants-v0.5.fig",
   "type": "Maquette",
   "phase": "P4",
   "taches": [
    "T041"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "UI",
   "date": "2026-10-05",
   "tags": "livrable, design system & style guide",
   "description": "Livrable attendu de la phase P4.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-093",
   "titre": "Bibliothèque de composants v0.8 (complexes)",
   "chemin": "05_DESIGN-SYSTEM/03_Livrables/P4_Composants-v0.8.fig",
   "type": "Maquette",
   "phase": "P4",
   "taches": [
    "T042"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "UI",
   "date": "2026-10-05",
   "tags": "livrable, design system & style guide",
   "description": "Livrable attendu de la phase P4.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-094",
   "titre": "Style guide en ligne (documentation)",
   "chemin": "05_DESIGN-SYSTEM/03_Livrables/style-guide/",
   "type": "Code",
   "phase": "P4",
   "taches": [
    "T043"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "UI",
   "date": "2026-10-05",
   "tags": "livrable, design system & style guide",
   "description": "Livrable attendu de la phase P4.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-095",
   "titre": "Rapports de revue accessibilité & marque",
   "chemin": "05_DESIGN-SYSTEM/04_Validation/P4_Revues_v1.0.docx",
   "type": "Document",
   "phase": "P4",
   "taches": [
    "T044"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "A11Y",
   "date": "2026-10-05",
   "tags": "livrable, design system & style guide",
   "description": "Livrable attendu de la phase P4.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-096",
   "titre": "Avenant digital à la charte graphique",
   "chemin": "05_DESIGN-SYSTEM/03_Livrables/P4_Avenant-charte-digitale_v1.0.pdf",
   "type": "Document",
   "phase": "P4",
   "taches": [
    "T045"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "UCOM",
   "date": "2026-10-05",
   "tags": "livrable, design system & style guide",
   "description": "Livrable attendu de la phase P4.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-097",
   "titre": "Design System v1.0 (release)",
   "chemin": "05_DESIGN-SYSTEM/03_Livrables/P4_Release-notes-v1.0.md",
   "type": "Document",
   "phase": "P4",
   "taches": [
    "T045"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "UI",
   "date": "2026-10-05",
   "tags": "livrable, design system & style guide",
   "description": "Livrable attendu de la phase P4.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-098",
   "titre": "Inventaire des gabarits",
   "chemin": "06_TEMPLATES-PROTOTYPES/03_Livrables/P5_Inventaire-gabarits_v1.0.xlsx",
   "type": "Tableau",
   "phase": "P5",
   "taches": [
    "T046"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "UX",
   "date": "2026-10-05",
   "tags": "livrable, gabarits, maquettes & prototypes",
   "description": "Livrable attendu de la phase P5.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-099",
   "titre": "Wireframes",
   "chemin": "06_TEMPLATES-PROTOTYPES/03_Livrables/P5_Wireframes_v1.0.fig",
   "type": "Maquette",
   "phase": "P5",
   "taches": [
    "T047"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "UX",
   "date": "2026-10-05",
   "tags": "livrable, gabarits, maquettes & prototypes",
   "description": "Livrable attendu de la phase P5.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-100",
   "titre": "Maquettes haute fidélité desktop / mobile",
   "chemin": "06_TEMPLATES-PROTOTYPES/03_Livrables/P5_Maquettes_v1.0.fig",
   "type": "Maquette",
   "phase": "P5",
   "taches": [
    "T048"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "UI",
   "date": "2026-10-05",
   "tags": "livrable, gabarits, maquettes & prototypes",
   "description": "Livrable attendu de la phase P5.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-101",
   "titre": "Prototype interactif",
   "chemin": "06_TEMPLATES-PROTOTYPES/03_Livrables/P5_Prototype_v1.0.fig",
   "type": "Maquette",
   "phase": "P5",
   "taches": [
    "T049"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "UX",
   "date": "2026-10-05",
   "tags": "livrable, gabarits, maquettes & prototypes",
   "description": "Livrable attendu de la phase P5.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-102",
   "titre": "Rapports de tests utilisateurs",
   "chemin": "06_TEMPLATES-PROTOTYPES/03_Livrables/P5_Tests-utilisateurs_v1.0.docx",
   "type": "Document",
   "phase": "P5",
   "taches": [
    "T050"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "UX",
   "date": "2026-10-05",
   "tags": "livrable, gabarits, maquettes & prototypes",
   "description": "Livrable attendu de la phase P5.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-103",
   "titre": "Spécifications fonctionnelles & handoff",
   "chemin": "06_TEMPLATES-PROTOTYPES/03_Livrables/P5_Specifications_v1.0.docx",
   "type": "Document",
   "phase": "P5",
   "taches": [
    "T051"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "PO",
   "date": "2026-10-05",
   "tags": "livrable, gabarits, maquettes & prototypes",
   "description": "Livrable attendu de la phase P5.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-104",
   "titre": "Bilan de la migration Jahia 8",
   "chemin": "07_TECHNIQUE-INTEGRATIONS/03_Livrables/P6_Bilan-migration-Jahia8_v1.0.docx",
   "type": "Document",
   "phase": "P6",
   "taches": [
    "T052"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "DSI",
   "date": "2026-10-05",
   "tags": "livrable, architecture technique jahia 8 & intégrations",
   "description": "Livrable attendu de la phase P6.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-105",
   "titre": "Étude de templating Jahia 8 (modules Java/JSP ou JavaScript)",
   "chemin": "07_TECHNIQUE-INTEGRATIONS/03_Livrables/P6_Etude-templating_v1.0.docx",
   "type": "Document",
   "phase": "P6",
   "taches": [
    "T053"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "ARCH",
   "date": "2026-10-05",
   "tags": "livrable, architecture technique jahia 8 & intégrations",
   "description": "Livrable attendu de la phase P6.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-106",
   "titre": "Stratégie d'intégration du DS dans Jahia",
   "chemin": "07_TECHNIQUE-INTEGRATIONS/03_Livrables/P6_Integration-DS-Jahia_v1.0.docx",
   "type": "Document",
   "phase": "P6",
   "taches": [
    "T054"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "ARCH",
   "date": "2026-10-05",
   "tags": "livrable, architecture technique jahia 8 & intégrations",
   "description": "Livrable attendu de la phase P6.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-107",
   "titre": "Exigences non fonctionnelles",
   "chemin": "07_TECHNIQUE-INTEGRATIONS/03_Livrables/P6_Exigences-non-fonctionnelles_v1.0.xlsx",
   "type": "Tableau",
   "phase": "P6",
   "taches": [
    "T055"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "ARCH",
   "date": "2026-10-05",
   "tags": "livrable, architecture technique jahia 8 & intégrations",
   "description": "Livrable attendu de la phase P6.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-108",
   "titre": "Inventaire des services connectés & API",
   "chemin": "07_TECHNIQUE-INTEGRATIONS/03_Livrables/P6_Inventaire-services_v1.0.xlsx",
   "type": "Tableau",
   "phase": "P6",
   "taches": [
    "T056"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "ARCH",
   "date": "2026-10-05",
   "tags": "livrable, architecture technique jahia 8 & intégrations",
   "description": "Livrable attendu de la phase P6.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-109",
   "titre": "Architecture portails & SSO",
   "chemin": "07_TECHNIQUE-INTEGRATIONS/03_Livrables/P6_Architecture-portails_v1.0.pdf",
   "type": "Document",
   "phase": "P6",
   "taches": [
    "T057"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "ARCH",
   "date": "2026-10-05",
   "tags": "livrable, architecture technique jahia 8 & intégrations",
   "description": "Livrable attendu de la phase P6.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-110",
   "titre": "Analyse protection des données & sécurité",
   "chemin": "07_TECHNIQUE-INTEGRATIONS/03_Livrables/P6_Protection-donnees_v1.0.docx",
   "type": "Document",
   "phase": "P6",
   "taches": [
    "T058"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "PDO",
   "date": "2026-10-05",
   "tags": "livrable, architecture technique jahia 8 & intégrations",
   "description": "Livrable attendu de la phase P6.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-111",
   "titre": "Environnements, Git & intégration continue",
   "chemin": "07_TECHNIQUE-INTEGRATIONS/03_Livrables/P6_Environnements_v1.0.md",
   "type": "Document",
   "phase": "P6",
   "taches": [
    "T059"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "DEV",
   "date": "2026-10-05",
   "tags": "livrable, architecture technique jahia 8 & intégrations",
   "description": "Livrable attendu de la phase P6.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-112",
   "titre": "Librairie front du Design System",
   "chemin": "08_DEVELOPPEMENT/03_Livrables/DS-front/",
   "type": "Code",
   "phase": "P7",
   "taches": [
    "T060"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "DEV",
   "date": "2026-10-05",
   "tags": "livrable, développement interne",
   "description": "Livrable attendu de la phase P7.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-113",
   "titre": "Modules et gabarits Jahia 8",
   "chemin": "08_DEVELOPPEMENT/03_Livrables/Jahia-modules/",
   "type": "Code",
   "phase": "P7",
   "taches": [
    "T061"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "DEV",
   "date": "2026-10-05",
   "tags": "livrable, développement interne",
   "description": "Livrable attendu de la phase P7.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-114",
   "titre": "Connecteurs API documentés",
   "chemin": "08_DEVELOPPEMENT/03_Livrables/P7_API-docs_v1.0.md",
   "type": "Document",
   "phase": "P7",
   "taches": [
    "T063"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "ARCH",
   "date": "2026-10-05",
   "tags": "livrable, développement interne",
   "description": "Livrable attendu de la phase P7.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-115",
   "titre": "Comptes rendus d'itérations & démos",
   "chemin": "08_DEVELOPPEMENT/02_Travail/P7_Iterations.md",
   "type": "Document",
   "phase": "P7",
   "taches": [
    "T066"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "PO",
   "date": "2026-10-05",
   "tags": "livrable, développement interne",
   "description": "Livrable attendu de la phase P7.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-116",
   "titre": "Plan de migration & redirections 301",
   "chemin": "09_MIGRATION-CONTENUS/03_Livrables/P8_Plan-migration_v1.0.xlsx",
   "type": "Tableau",
   "phase": "P8",
   "taches": [
    "T067"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "CONT",
   "date": "2026-10-05",
   "tags": "livrable, migration de contenus",
   "description": "Livrable attendu de la phase P8.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-117",
   "titre": "Kit de formation des contributeurs",
   "chemin": "09_MIGRATION-CONTENUS/03_Livrables/P8_Formation-contributeurs_v1.0.pdf",
   "type": "Document",
   "phase": "P8",
   "taches": [
    "T068"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "UCOM",
   "date": "2026-10-05",
   "tags": "livrable, migration de contenus",
   "description": "Livrable attendu de la phase P8.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-118",
   "titre": "Suivi de migration par lot",
   "chemin": "09_MIGRATION-CONTENUS/02_Travail/P8_Suivi-migration.xlsx",
   "type": "Tableau",
   "phase": "P8",
   "taches": [
    "T069"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "CONT",
   "date": "2026-10-05",
   "tags": "livrable, migration de contenus",
   "description": "Livrable attendu de la phase P8.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-119",
   "titre": "Rapport de contrôle qualité",
   "chemin": "09_MIGRATION-CONTENUS/03_Livrables/P8_Controle-qualite_v1.0.docx",
   "type": "Document",
   "phase": "P8",
   "taches": [
    "T070"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "CONT",
   "date": "2026-10-05",
   "tags": "livrable, migration de contenus",
   "description": "Livrable attendu de la phase P8.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-120",
   "titre": "Plan de recette",
   "chemin": "10_QUALITE-RECETTE/03_Livrables/P9_Plan-recette_v1.0.docx",
   "type": "Document",
   "phase": "P9",
   "taches": [
    "T071"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "PMO",
   "date": "2026-10-05",
   "tags": "livrable, qualité & recette",
   "description": "Livrable attendu de la phase P9.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-121",
   "titre": "Cahier de tests & PV de recette",
   "chemin": "10_QUALITE-RECETTE/03_Livrables/P9_PV-recette_v1.0.xlsx",
   "type": "Tableau",
   "phase": "P9",
   "taches": [
    "T072"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "PO",
   "date": "2026-10-05",
   "tags": "livrable, qualité & recette",
   "description": "Livrable attendu de la phase P9.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-122",
   "titre": "Audit d'accessibilité de conformité",
   "chemin": "10_QUALITE-RECETTE/03_Livrables/P9_Audit-a11y_v1.0.pdf",
   "type": "Document",
   "phase": "P9",
   "taches": [
    "T073"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "A11Y",
   "date": "2026-10-05",
   "tags": "livrable, qualité & recette",
   "description": "Livrable attendu de la phase P9.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-123",
   "titre": "Rapport de sécurité",
   "chemin": "10_QUALITE-RECETTE/03_Livrables/P9_Securite_v1.0.pdf",
   "type": "Document",
   "phase": "P9",
   "taches": [
    "T074"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "PDO",
   "date": "2026-10-05",
   "tags": "livrable, qualité & recette",
   "description": "Livrable attendu de la phase P9.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-124",
   "titre": "Rapport de performance",
   "chemin": "10_QUALITE-RECETTE/03_Livrables/P9_Performance_v1.0.pdf",
   "type": "Document",
   "phase": "P9",
   "taches": [
    "T075"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "ARCH",
   "date": "2026-10-05",
   "tags": "livrable, qualité & recette",
   "description": "Livrable attendu de la phase P9.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-125",
   "titre": "Déclaration d'accessibilité",
   "chemin": "10_QUALITE-RECETTE/03_Livrables/P9_Declaration-accessibilite_v1.0.md",
   "type": "Document",
   "phase": "P9",
   "taches": [
    "T073"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "A11Y",
   "date": "2026-10-05",
   "tags": "livrable, qualité & recette",
   "description": "Livrable attendu de la phase P9.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-126",
   "titre": "Plan de communication",
   "chemin": "11_LANCEMENT-CHANGEMENT/03_Livrables/P10_Plan-communication_v1.0.docx",
   "type": "Document",
   "phase": "P10",
   "taches": [
    "T077"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "UCOM",
   "date": "2026-10-05",
   "tags": "livrable, lancement & conduite du changement",
   "description": "Livrable attendu de la phase P10.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-127",
   "titre": "Guides utilisateurs",
   "chemin": "11_LANCEMENT-CHANGEMENT/03_Livrables/P10_Guides-utilisateurs_v1.0.pdf",
   "type": "Document",
   "phase": "P10",
   "taches": [
    "T078"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "UCOM",
   "date": "2026-10-05",
   "tags": "livrable, lancement & conduite du changement",
   "description": "Livrable attendu de la phase P10.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-128",
   "titre": "Plan de bascule & retour arrière",
   "chemin": "11_LANCEMENT-CHANGEMENT/03_Livrables/P10_Plan-bascule_v1.0.docx",
   "type": "Document",
   "phase": "P10",
   "taches": [
    "T079"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "DSI",
   "date": "2026-10-05",
   "tags": "livrable, lancement & conduite du changement",
   "description": "Livrable attendu de la phase P10.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-129",
   "titre": "Décision Go / No-go",
   "chemin": "11_LANCEMENT-CHANGEMENT/04_Validation/P10_Go-NoGo.docx",
   "type": "Document",
   "phase": "P10",
   "taches": [
    "T079"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "COP",
   "date": "2026-10-05",
   "tags": "livrable, lancement & conduite du changement",
   "description": "Livrable attendu de la phase P10.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-130",
   "titre": "Bilan post-lancement & KPI",
   "chemin": "12_RUN-AMELIORATION/03_Livrables/P11_Bilan-post-lancement_v1.0.pptx",
   "type": "Présentation",
   "phase": "P11",
   "taches": [
    "T083"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "CDP",
   "date": "2026-10-05",
   "tags": "livrable, run & amélioration continue",
   "description": "Livrable attendu de la phase P11.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-131",
   "titre": "Backlog d'amélioration continue",
   "chemin": "12_RUN-AMELIORATION/03_Livrables/P11_Backlog_v1.0.xlsx",
   "type": "Tableau",
   "phase": "P11",
   "taches": [
    "T082"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "PO",
   "date": "2026-10-05",
   "tags": "livrable, run & amélioration continue",
   "description": "Livrable attendu de la phase P11.",
   "livrable": true,
   "versions": []
  },
  {
   "id": "DOC-132",
   "titre": "Retour d'expérience projet",
   "chemin": "12_RUN-AMELIORATION/03_Livrables/P11_REX_v1.0.docx",
   "type": "Document",
   "phase": "P11",
   "taches": [
    "T083"
   ],
   "statut": "Prévu",
   "version": "",
   "responsable": "PMO",
   "date": "2026-10-05",
   "tags": "livrable, run & amélioration continue",
   "description": "Livrable attendu de la phase P11.",
   "livrable": true,
   "versions": []
  }
 ],
 "risques": [
  {
   "id": "R-001",
   "titre": "Ressources internes insuffisantes (U-Com, DSI) face aux opérations courantes",
   "categorie": "Ressources",
   "cause": "Projet mené en parallèle des missions courantes, sans décharge formalisée",
   "consequence": "Retards en cascade sur toutes les phases",
   "declencheur": "Plus de 2 tâches d'un même rôle en retard, ou charge > 3 tâches simultanées",
   "proba": 4,
   "impact": 5,
   "probaRes": 3,
   "impactRes": 5,
   "proprietaire": "SPO",
   "strategie": "Réduire",
   "mitigation": "Décharges formalisées au Copil ; plan de charge par rôle ; priorisation explicite des opérations",
   "contingence": "Étaler les phases non critiques ; geler des demandes opérationnelles",
   "proximite": "2027-01-11",
   "impactJours": 60,
   "statut": "Ouvert",
   "date": "2026-10-05",
   "prochaineRevue": "2026-11-02",
   "phase": "",
   "revues": [
    {
     "date": "2026-10-05",
     "proba": 4,
     "impact": 5,
     "note": "Identification initiale",
     "auteur": "Claude (Cowork) pour U-Com"
    }
   ]
  },
  {
   "id": "R-002",
   "titre": "Enveloppe de CHF 10'000 insuffisante pour un Design System et des livrables professionnels",
   "categorie": "Budget",
   "cause": "Budget limité pour licences, tests, audits et outils",
   "consequence": "Livrables incomplets, qualité réduite, dépendance au temps interne",
   "declencheur": "Engagements > 60 % avant G4 ; besoin non budgété identifié",
   "proba": 4,
   "impact": 4,
   "probaRes": 3,
   "impactRes": 4,
   "proprietaire": "CDP",
   "strategie": "Réduire",
   "mitigation": "Répartition validée en G0 ; privilégier outils libres/auto-hébergés ; arbitrages tracés",
   "contingence": "Demande de complément au Copil avec chiffrage ; réduction de périmètre DS v1.0",
   "proximite": "2027-02-01",
   "impactJours": 0,
   "statut": "Ouvert",
   "date": "2026-10-05",
   "prochaineRevue": "2026-11-02",
   "phase": "P4",
   "revues": [
    {
     "date": "2026-10-05",
     "proba": 4,
     "impact": 4,
     "note": "Identification initiale",
     "auteur": "Claude (Cowork) pour U-Com"
    }
   ]
  },
  {
   "id": "R-003",
   "titre": "Dérive du périmètre (≈4500 pages, 4 univers, app)",
   "categorie": "Périmètre",
   "cause": "Attentes multiples des unités et publics",
   "consequence": "Allongement des délais, dispersion",
   "declencheur": "Plus de 3 demandes de changement par trimestre",
   "proba": 4,
   "impact": 4,
   "probaRes": 3,
   "impactRes": 4,
   "proprietaire": "CDP",
   "strategie": "Éviter",
   "mitigation": "Périmètre in/out signé en G0 ; demandes de changement obligatoires ; MVP par univers",
   "contingence": "Reporter en run (P11) les éléments non essentiels",
   "proximite": "2026-12-18",
   "impactJours": 45,
   "statut": "Ouvert",
   "date": "2026-10-05",
   "prochaineRevue": "2026-11-02",
   "phase": "P0",
   "revues": [
    {
     "date": "2026-10-05",
     "proba": 4,
     "impact": 4,
     "note": "Identification initiale",
     "auteur": "Claude (Cowork) pour U-Com"
    }
   ]
  },
  {
   "id": "R-004",
   "titre": "Retard ou instabilité de la migration Jahia 8 (fin octobre 2026)",
   "categorie": "Technique",
   "cause": "Migration DSI en cours, hors périmètre",
   "consequence": "Audit et étude technique retardés",
   "declencheur": "Migration non terminée au 30.11.2026",
   "proba": 3,
   "impact": 3,
   "probaRes": 2,
   "impactRes": 3,
   "proprietaire": "DSI",
   "strategie": "Réduire",
   "mitigation": "Suivi du jalon M-J8 ; audit des contenus lancé indépendamment de la plateforme",
   "contingence": "Démarrer P1 par l'audit de contenu et d'audience",
   "proximite": "2026-10-30",
   "impactJours": 30,
   "statut": "Ouvert",
   "date": "2026-10-05",
   "prochaineRevue": "2026-11-02",
   "phase": "P1",
   "revues": [
    {
     "date": "2026-10-05",
     "proba": 3,
     "impact": 3,
     "note": "Identification initiale",
     "auteur": "Claude (Cowork) pour U-Com"
    }
   ]
  },
  {
   "id": "R-005",
   "titre": "Contraintes techniques Jahia 8 limitant la mise en œuvre du DS",
   "categorie": "Technique",
   "cause": "Mode de templating encore à déterminer",
   "consequence": "Écarts entre maquettes et réalisation, refonte des composants",
   "declencheur": "Preuve de concept P6 non concluante",
   "proba": 3,
   "impact": 4,
   "probaRes": 2,
   "impactRes": 4,
   "proprietaire": "ARCH",
   "strategie": "Réduire",
   "mitigation": "Preuve de concept Jahia dès P6 avant composants complexes ; DS conçu en CSS/tokens indépendants du CMS",
   "contingence": "Adapter les composants ; simplifier les patterns complexes",
   "proximite": "2027-04-16",
   "impactJours": 40,
   "statut": "Ouvert",
   "date": "2026-10-05",
   "prochaineRevue": "2026-11-02",
   "phase": "P6",
   "revues": [
    {
     "date": "2026-10-05",
     "proba": 3,
     "impact": 4,
     "note": "Identification initiale",
     "auteur": "Claude (Cowork) pour U-Com"
    }
   ]
  },
  {
   "id": "R-006",
   "titre": "Services connectés inconnus à ce stade (inventaire différé)",
   "categorie": "Technique",
   "cause": "Information non disponible au démarrage",
   "consequence": "Découvertes tardives, gabarits à reprendre",
   "declencheur": "Nouveau service découvert après G5",
   "proba": 4,
   "impact": 3,
   "probaRes": 3,
   "impactRes": 3,
   "proprietaire": "ARCH",
   "strategie": "Réduire",
   "mitigation": "Inventaire planifié en P6 ; gabarits prévus avec zones d'intégration génériques",
   "contingence": "Itération dédiée en P7",
   "proximite": "2027-06-07",
   "impactJours": 30,
   "statut": "Ouvert",
   "date": "2026-10-05",
   "prochaineRevue": "2026-11-02",
   "phase": "P6",
   "revues": [
    {
     "date": "2026-10-05",
     "proba": 4,
     "impact": 3,
     "note": "Identification initiale",
     "auteur": "Claude (Cowork) pour U-Com"
    }
   ]
  },
  {
   "id": "R-007",
   "titre": "Décisions tardives du Copil",
   "categorie": "Gouvernance",
   "cause": "Disponibilité des membres du Copil",
   "consequence": "Blocage des gates, retards",
   "declencheur": "Décision en attente > 30 jours",
   "proba": 3,
   "impact": 4,
   "probaRes": 2,
   "impactRes": 4,
   "proprietaire": "CDP",
   "strategie": "Réduire",
   "mitigation": "Calendrier des Copil sur 12 mois ; décisions préparées (fiches) ; délégation de seuils au CDP",
   "contingence": "Décision par voie écrite",
   "proximite": "2026-12-18",
   "impactJours": 30,
   "statut": "Ouvert",
   "date": "2026-10-05",
   "prochaineRevue": "2026-11-02",
   "phase": "P0",
   "revues": [
    {
     "date": "2026-10-05",
     "proba": 3,
     "impact": 4,
     "note": "Identification initiale",
     "auteur": "Claude (Cowork) pour U-Com"
    }
   ]
  },
  {
   "id": "R-008",
   "titre": "Durée longue (2–3 ans) : perte de dynamique et obsolescence des choix",
   "categorie": "Organisation",
   "cause": "Horizon long, rotation des priorités",
   "consequence": "Démotivation, choix techniques ou design dépassés",
   "declencheur": "Baisse de participation aux revues ; question de réexamen ouverte",
   "proba": 3,
   "impact": 3,
   "probaRes": 2,
   "impactRes": 3,
   "proprietaire": "CDP",
   "strategie": "Réduire",
   "mitigation": "Livraisons visibles intermédiaires (DS v0.5, v0.8) ; revue trimestrielle des hypothèses",
   "contingence": "Revoir le plan (nouvelle baseline)",
   "proximite": "2027-06-01",
   "impactJours": 0,
   "statut": "Ouvert",
   "date": "2026-10-05",
   "prochaineRevue": "2026-11-02",
   "phase": "",
   "revues": [
    {
     "date": "2026-10-05",
     "proba": 3,
     "impact": 3,
     "note": "Identification initiale",
     "auteur": "Claude (Cowork) pour U-Com"
    }
   ]
  },
  {
   "id": "R-009",
   "titre": "Départ d'une personne clé (perte de connaissance)",
   "categorie": "Ressources",
   "cause": "Équipe réduite",
   "consequence": "Perte d'historique, retard",
   "declencheur": "Annonce d'absence longue ou de départ",
   "proba": 2,
   "impact": 4,
   "probaRes": 1,
   "impactRes": 4,
   "proprietaire": "CDP",
   "strategie": "Réduire",
   "mitigation": "Traçabilité complète dans la plateforme ; binômes par domaine ; documentation continue",
   "contingence": "Plan de passation",
   "proximite": "2027-01-01",
   "impactJours": 30,
   "statut": "Ouvert",
   "date": "2026-10-05",
   "prochaineRevue": "2026-11-02",
   "phase": "",
   "revues": [
    {
     "date": "2026-10-05",
     "proba": 2,
     "impact": 4,
     "note": "Identification initiale",
     "auteur": "Claude (Cowork) pour U-Com"
    }
   ]
  },
  {
   "id": "R-010",
   "titre": "Contraste insuffisant du bleu #009cde sur blanc (3.08:1) pour du texte",
   "categorie": "Accessibilité",
   "cause": "Couleur de charte conçue pour le print",
   "consequence": "Non-conformité WCAG",
   "declencheur": "Utilisation du bleu en texte dans une maquette",
   "proba": 5,
   "impact": 3,
   "probaRes": 4,
   "impactRes": 3,
   "proprietaire": "UI",
   "strategie": "Éviter",
   "mitigation": "Bleu réservé aux aplats ; texte et liens en bleu sombre #00354c ; avenant digital",
   "contingence": "Ajustement de teinte validé U-Com",
   "proximite": "2027-03-08",
   "impactJours": 0,
   "statut": "Ouvert",
   "date": "2026-10-05",
   "prochaineRevue": "2026-11-02",
   "phase": "P4",
   "revues": [
    {
     "date": "2026-10-05",
     "proba": 5,
     "impact": 3,
     "note": "Identification initiale",
     "auteur": "Claude (Cowork) pour U-Com"
    }
   ]
  },
  {
   "id": "R-011",
   "titre": "Licences web des polices Chalet / Spectral non disponibles ou coûteuses",
   "categorie": "Design",
   "cause": "Licence acquise pour le print uniquement",
   "consequence": "Typographie digitale différente de la charte ou coût non budgété",
   "declencheur": "Réponse négative ou devis > budget prévu",
   "proba": 3,
   "impact": 3,
   "probaRes": 2,
   "impactRes": 3,
   "proprietaire": "UCOM",
   "strategie": "Réduire",
   "mitigation": "Vérification dès P4 ; Spectral est publiée sous licence libre (à confirmer) ; alternative pour le texte",
   "contingence": "Police alternative validée U-Com",
   "proximite": "2027-02-01",
   "impactJours": 20,
   "statut": "Ouvert",
   "date": "2026-10-05",
   "prochaineRevue": "2026-11-02",
   "phase": "P4",
   "revues": [
    {
     "date": "2026-10-05",
     "proba": 3,
     "impact": 3,
     "note": "Identification initiale",
     "auteur": "Claude (Cowork) pour U-Com"
    }
   ]
  },
  {
   "id": "R-012",
   "titre": "Outil de design (cloud) non conforme à la politique de données",
   "categorie": "Conformité",
   "cause": "Outils hébergés hors Suisse",
   "consequence": "Changement d'outil en cours de projet",
   "declencheur": "Refus DSI / protection des données",
   "proba": 3,
   "impact": 3,
   "probaRes": 2,
   "impactRes": 3,
   "proprietaire": "DSI",
   "strategie": "Éviter",
   "mitigation": "Décision outil en P0 (question Q-007) ; option auto-hébergée (ex. Penpot)",
   "contingence": "Export et migration des fichiers",
   "proximite": "2026-12-18",
   "impactJours": 20,
   "statut": "Ouvert",
   "date": "2026-10-05",
   "prochaineRevue": "2026-11-02",
   "phase": "P0",
   "revues": [
    {
     "date": "2026-10-05",
     "proba": 3,
     "impact": 3,
     "note": "Identification initiale",
     "auteur": "Claude (Cowork) pour U-Com"
    }
   ]
  },
  {
   "id": "R-013",
   "titre": "Perte de référencement à la migration",
   "categorie": "SEO",
   "cause": "Changement d'URL massif",
   "consequence": "Baisse de trafic",
   "declencheur": "Chute > 20 % des clics organiques post-lancement",
   "proba": 3,
   "impact": 4,
   "probaRes": 2,
   "impactRes": 4,
   "proprietaire": "CONT",
   "strategie": "Réduire",
   "mitigation": "Plan 301 exhaustif ; suivi Search Console",
   "contingence": "Corrections de redirections en hypercare",
   "proximite": "2029-06-29",
   "impactJours": 0,
   "statut": "Ouvert",
   "date": "2026-10-05",
   "prochaineRevue": "2026-11-02",
   "phase": "P8",
   "revues": [
    {
     "date": "2026-10-05",
     "proba": 3,
     "impact": 4,
     "note": "Identification initiale",
     "auteur": "Claude (Cowork) pour U-Com"
    }
   ]
  },
  {
   "id": "R-014",
   "titre": "Adhésion des unités à la gouvernance éditoriale",
   "categorie": "Organisation",
   "cause": "Habitudes de publication décentralisées",
   "consequence": "Contenus non conformes, retard de migration",
   "declencheur": "Participation < 50 % aux ateliers",
   "proba": 3,
   "impact": 4,
   "probaRes": 2,
   "impactRes": 4,
   "proprietaire": "CDP",
   "strategie": "Réduire",
   "mitigation": "Co-construction en P3 ; ambassadeurs ; formation",
   "contingence": "Accompagnement renforcé U-Com",
   "proximite": "2027-09-06",
   "impactJours": 30,
   "statut": "Ouvert",
   "date": "2026-10-05",
   "prochaineRevue": "2026-11-02",
   "phase": "P3",
   "revues": [
    {
     "date": "2026-10-05",
     "proba": 3,
     "impact": 4,
     "note": "Identification initiale",
     "auteur": "Claude (Cowork) pour U-Com"
    }
   ]
  },
  {
   "id": "R-015",
   "titre": "Sous-estimation de la migration des contenus",
   "categorie": "Planning",
   "cause": "Volume ≈4500 pages et réécriture",
   "consequence": "Retard de mise en ligne",
   "declencheur": "Rythme de migration < 80 % du prévu sur 2 lots",
   "proba": 4,
   "impact": 4,
   "probaRes": 3,
   "impactRes": 4,
   "proprietaire": "CONT",
   "strategie": "Réduire",
   "mitigation": "Réduction ROT ; lots planifiés ; indicateurs de rythme",
   "contingence": "Mise en ligne par univers",
   "proximite": "2028-10-30",
   "impactJours": 60,
   "statut": "Ouvert",
   "date": "2026-10-05",
   "prochaineRevue": "2026-11-02",
   "phase": "P8",
   "revues": [
    {
     "date": "2026-10-05",
     "proba": 4,
     "impact": 4,
     "note": "Identification initiale",
     "auteur": "Claude (Cowork) pour U-Com"
    }
   ]
  },
  {
   "id": "R-016",
   "titre": "Calendrier académique limitant tests et lancement",
   "categorie": "Planning",
   "cause": "Rentrée, examens, vacances",
   "consequence": "Tests ou lancement décalés",
   "declencheur": "Fenêtre de test chevauchant une session d'examens",
   "proba": 4,
   "impact": 3,
   "probaRes": 3,
   "impactRes": 3,
   "proprietaire": "PMO",
   "strategie": "Réduire",
   "mitigation": "Tests en mars-mai ; lancement hors rentrée",
   "contingence": "Décaler à la fenêtre suivante",
   "proximite": "2028-03-06",
   "impactJours": 30,
   "statut": "Ouvert",
   "date": "2026-10-05",
   "prochaineRevue": "2026-11-02",
   "phase": "P9",
   "revues": [
    {
     "date": "2026-10-05",
     "proba": 4,
     "impact": 3,
     "note": "Identification initiale",
     "auteur": "Claude (Cowork) pour U-Com"
    }
   ]
  },
  {
   "id": "R-017",
   "titre": "Protection des données dans les portails authentifiés",
   "categorie": "Conformité",
   "cause": "Données personnelles étudiant·es et collaborateurs",
   "consequence": "Non-conformité, blocage du lancement",
   "declencheur": "Référent·e protection des données non identifié·e au 31.03.2027",
   "proba": 3,
   "impact": 5,
   "probaRes": 2,
   "impactRes": 5,
   "proprietaire": "PDO",
   "strategie": "Réduire",
   "mitigation": "Identifier un·e référent·e ; analyse en P6 ; privacy by design",
   "contingence": "Report des fonctionnalités sensibles",
   "proximite": "2027-09-06",
   "impactJours": 30,
   "statut": "Ouvert",
   "date": "2026-10-05",
   "prochaineRevue": "2026-11-02",
   "phase": "P6",
   "revues": [
    {
     "date": "2026-10-05",
     "proba": 3,
     "impact": 5,
     "note": "Identification initiale",
     "auteur": "Claude (Cowork) pour U-Com"
    }
   ]
  },
  {
   "id": "R-018",
   "titre": "Absence de référent juridique / conformité",
   "categorie": "Conformité",
   "cause": "Pas de juriste impliqué à ce stade",
   "consequence": "Exigences légales (accessibilité, données) identifiées tardivement",
   "declencheur": "Question juridique sans réponse > 30 jours",
   "proba": 3,
   "impact": 3,
   "probaRes": 2,
   "impactRes": 3,
   "proprietaire": "SPO",
   "strategie": "Réduire",
   "mitigation": "Identifier un contact juridique cantonal / interne avant P6",
   "contingence": "Consultation ponctuelle",
   "proximite": "2027-03-01",
   "impactJours": 20,
   "statut": "Ouvert",
   "date": "2026-10-05",
   "prochaineRevue": "2026-11-02",
   "phase": "P6",
   "revues": [
    {
     "date": "2026-10-05",
     "proba": 3,
     "impact": 3,
     "note": "Identification initiale",
     "auteur": "Claude (Cowork) pour U-Com"
    }
   ]
  },
  {
   "id": "R-019",
   "titre": "Charte print uniquement : écarts d'interprétation digitale",
   "categorie": "Design",
   "cause": "Charte sans règles digitales",
   "consequence": "Incohérences entre univers",
   "declencheur": "Désaccord U-Com / design sur un composant",
   "proba": 3,
   "impact": 3,
   "probaRes": 2,
   "impactRes": 3,
   "proprietaire": "UCOM",
   "strategie": "Réduire",
   "mitigation": "Avenant digital co-validé ; journal des décisions DS",
   "contingence": "Arbitrage Copil",
   "proximite": "2027-03-08",
   "impactJours": 10,
   "statut": "Ouvert",
   "date": "2026-10-05",
   "prochaineRevue": "2026-11-02",
   "phase": "P4",
   "revues": [
    {
     "date": "2026-10-05",
     "proba": 3,
     "impact": 3,
     "note": "Identification initiale",
     "auteur": "Claude (Cowork) pour U-Com"
    }
   ]
  },
  {
   "id": "R-020",
   "titre": "Dette technique des portails existants",
   "categorie": "Technique",
   "cause": "Technologies des portails inconnues",
   "consequence": "Effort sous-estimé",
   "declencheur": "État technique P1 révélant une technologie non supportée",
   "proba": 3,
   "impact": 3,
   "probaRes": 2,
   "impactRes": 3,
   "proprietaire": "DSI",
   "strategie": "Réduire",
   "mitigation": "État des lieux P1 ; stratégie par portail",
   "contingence": "Refonte progressive par portail",
   "proximite": "2027-03-19",
   "impactJours": 40,
   "statut": "Ouvert",
   "date": "2026-10-05",
   "prochaineRevue": "2026-11-02",
   "phase": "P1",
   "revues": [
    {
     "date": "2026-10-05",
     "proba": 3,
     "impact": 3,
     "note": "Identification initiale",
     "auteur": "Claude (Cowork) pour U-Com"
    }
   ]
  }
 ],
 "decisions": [
  {
   "id": "D-001",
   "date": "2026-10-05",
   "titre": "Structure du dossier projet et plateforme de pilotage",
   "contexte": "Pilotage complet et traçable sur 2–3 ans.",
   "decision": "Dossier numéroté par phase + plateforme web de pilotage auto-hébergée (base SQLite).",
   "statut": "Proposée",
   "decideur": "CDP",
   "phase": "P0",
   "options": "",
   "reexamen": "",
   "dateReexamen": "",
   "questions": "",
   "documents": "",
   "remplace": ""
  },
  {
   "id": "D-002",
   "date": "2026-10-05",
   "titre": "Approche « Design System d'abord »",
   "contexte": "Charte print uniquement ; 4 univers à harmoniser.",
   "decision": "Fondations, tokens et composants (P4) avant les gabarits (P5).",
   "statut": "Proposée",
   "decideur": "COP",
   "phase": "P0",
   "options": "",
   "reexamen": "",
   "dateReexamen": "",
   "questions": "",
   "documents": "",
   "remplace": ""
  },
  {
   "id": "D-003",
   "date": "2026-10-05",
   "titre": "Application mobile : PWA ou native",
   "contexte": "Besoins mobiles à confirmer.",
   "decision": "À instruire en P2 (recherche + coûts).",
   "statut": "À instruire",
   "decideur": "COP",
   "phase": "P0",
   "options": "",
   "reexamen": "",
   "dateReexamen": "",
   "questions": "",
   "documents": "",
   "remplace": ""
  },
  {
   "id": "D-004",
   "date": "2026-10-05",
   "titre": "Réalisation interne, sans appel d'offres",
   "contexte": "Indication de l'Unité Communication : développement interne des maquettes, du style guide et du site.",
   "decision": "Pas de marché public ; réalisation par U-Com et DSI. À confirmer par le Copil.",
   "statut": "Proposée",
   "decideur": "COP",
   "phase": "P0",
   "options": "",
   "reexamen": "",
   "dateReexamen": "",
   "questions": "",
   "documents": "",
   "remplace": ""
  },
  {
   "id": "D-005",
   "date": "2026-10-05",
   "titre": "Socle CMS : Jahia 8",
   "contexte": "Site actuel sur Jahia 7, migration Jahia 8 fin octobre 2026, hébergement interne.",
   "decision": "Construire la refonte sur Jahia 8 ; mode de templating à instruire en P6.",
   "statut": "Proposée",
   "decideur": "COP",
   "phase": "P0",
   "options": "",
   "reexamen": "",
   "dateReexamen": "",
   "questions": "",
   "documents": "",
   "remplace": ""
  },
  {
   "id": "D-006",
   "date": "2026-10-05",
   "titre": "Langues du site",
   "contexte": "Public international, formation continue, mobilité.",
   "decision": "À instruire en P0 / P2.",
   "statut": "À instruire",
   "decideur": "SPO",
   "phase": "P0",
   "options": "",
   "reexamen": "",
   "dateReexamen": "",
   "questions": "",
   "documents": "",
   "remplace": ""
  },
  {
   "id": "D-007",
   "date": "2026-10-05",
   "titre": "Outil de conception (maquettes, DS)",
   "contexte": "Contraintes de protection des données et budget.",
   "decision": "À instruire en P0 (question Q-007).",
   "statut": "À instruire",
   "decideur": "DSI",
   "phase": "P0",
   "options": "",
   "reexamen": "",
   "dateReexamen": "",
   "questions": "",
   "documents": "",
   "remplace": ""
  }
 ],
 "questions": [
  {
   "id": "Q-001",
   "date": "2026-10-05",
   "question": "Le temps de travail interne (U-Com, DSI) est-il hors de l'enveloppe de CHF 10'000 ?",
   "categorie": "Budget",
   "phase": "P0",
   "responsable": "CDP",
   "origine": "Cadrage (05.10.2026)",
   "contexte": "",
   "statut": "Ouverte",
   "reponse": "",
   "dateReponse": "",
   "decision": "",
   "auteur": "Claude (Cowork) pour U-Com"
  },
  {
   "id": "Q-002",
   "date": "2026-10-05",
   "question": "Quel mode de templating Jahia 8 sera utilisé (modules Java/JSP ou modules JavaScript, disponibles depuis Jahia 8.2) ?",
   "categorie": "Technique",
   "phase": "P6",
   "responsable": "ARCH",
   "origine": "Cadrage (05.10.2026)",
   "contexte": "",
   "statut": "Ouverte",
   "reponse": "",
   "dateReponse": "",
   "decision": "",
   "auteur": "Claude (Cowork) pour U-Com"
  },
  {
   "id": "Q-003",
   "date": "2026-10-05",
   "question": "Qui valide le Design System : l'Unité Communication seule, ou le Copil ?",
   "categorie": "Gouvernance",
   "phase": "P4",
   "responsable": "UCOM",
   "origine": "Cadrage (05.10.2026)",
   "contexte": "",
   "statut": "Ouverte",
   "reponse": "",
   "dateReponse": "",
   "decision": "",
   "auteur": "Claude (Cowork) pour U-Com"
  },
  {
   "id": "Q-004",
   "date": "2026-10-05",
   "question": "Les polices Chalet et Spectral disposent-elles d'une licence d'usage web ?",
   "categorie": "Design",
   "phase": "P4",
   "responsable": "UCOM",
   "origine": "Cadrage (05.10.2026)",
   "contexte": "",
   "statut": "Ouverte",
   "reponse": "",
   "dateReponse": "",
   "decision": "",
   "auteur": "Claude (Cowork) pour U-Com"
  },
  {
   "id": "Q-005",
   "date": "2026-10-05",
   "question": "Les portails MyEtu, MyCollab, MyParFo sont-ils dans Jahia ou dans d'autres technologies ?",
   "categorie": "Technique",
   "phase": "P1",
   "responsable": "DSI",
   "origine": "Cadrage (05.10.2026)",
   "contexte": "",
   "statut": "Ouverte",
   "reponse": "",
   "dateReponse": "",
   "decision": "",
   "auteur": "Claude (Cowork) pour U-Com"
  },
  {
   "id": "Q-006",
   "date": "2026-10-05",
   "question": "La migration Jahia 8 modifie-t-elle les gabarits existants ou gèle-t-elle des évolutions ?",
   "categorie": "Technique",
   "phase": "P0",
   "responsable": "DSI",
   "origine": "Cadrage (05.10.2026)",
   "contexte": "",
   "statut": "Ouverte",
   "reponse": "",
   "dateReponse": "",
   "decision": "",
   "auteur": "Claude (Cowork) pour U-Com"
  },
  {
   "id": "Q-007",
   "date": "2026-10-05",
   "question": "Quel outil de conception (Figma, Penpot auto-hébergé…) est compatible avec la politique de données ?",
   "categorie": "Outils",
   "phase": "P0",
   "responsable": "DSI",
   "origine": "Cadrage (05.10.2026)",
   "contexte": "",
   "statut": "Ouverte",
   "reponse": "",
   "dateReponse": "",
   "decision": "",
   "auteur": "Claude (Cowork) pour U-Com"
  },
  {
   "id": "Q-008",
   "date": "2026-10-05",
   "question": "Sur quel serveur interne héberger la plateforme de pilotage, avec quelle authentification ?",
   "categorie": "Outils",
   "phase": "P0",
   "responsable": "DSI",
   "origine": "Cadrage (05.10.2026)",
   "contexte": "",
   "statut": "Ouverte",
   "reponse": "",
   "dateReponse": "",
   "decision": "",
   "auteur": "Claude (Cowork) pour U-Com"
  },
  {
   "id": "Q-009",
   "date": "2026-10-05",
   "question": "Le Copil confirme-t-il la réalisation interne (sans appel d'offres) ?",
   "categorie": "Gouvernance",
   "phase": "P0",
   "responsable": "CDP",
   "origine": "Cadrage (05.10.2026)",
   "contexte": "",
   "statut": "Ouverte",
   "reponse": "",
   "dateReponse": "",
   "decision": "",
   "auteur": "Claude (Cowork) pour U-Com"
  },
  {
   "id": "Q-010",
   "date": "2026-10-05",
   "question": "Quelles langues doivent être publiées ?",
   "categorie": "Périmètre",
   "phase": "P0",
   "responsable": "SPO",
   "origine": "Cadrage (05.10.2026)",
   "contexte": "",
   "statut": "Ouverte",
   "reponse": "",
   "dateReponse": "",
   "decision": "",
   "auteur": "Claude (Cowork) pour U-Com"
  },
  {
   "id": "Q-011",
   "date": "2026-10-05",
   "question": "Quel standard d'accessibilité s'applique formellement (WCAG 2.1 AA / eCH-0059) et qui l'atteste ?",
   "categorie": "Conformité",
   "phase": "P0",
   "responsable": "A11Y",
   "origine": "Cadrage (05.10.2026)",
   "contexte": "",
   "statut": "Ouverte",
   "reponse": "",
   "dateReponse": "",
   "decision": "",
   "auteur": "Claude (Cowork) pour U-Com"
  },
  {
   "id": "Q-012",
   "date": "2026-10-05",
   "question": "Le périmètre inclut-il les sites satellites, microsites et gabarits de newsletters ?",
   "categorie": "Périmètre",
   "phase": "P0",
   "responsable": "CDP",
   "origine": "Cadrage (05.10.2026)",
   "contexte": "",
   "statut": "Ouverte",
   "reponse": "",
   "dateReponse": "",
   "decision": "",
   "auteur": "Claude (Cowork) pour U-Com"
  }
 ],
 "actions": [
  {
   "id": "A-001",
   "titre": "Répondre aux questionnements ouverts du cadrage (Q-001 à Q-012)",
   "responsable": "CDP",
   "echeance": "2026-11-13",
   "statut": "Ouvert",
   "priorite": "Haute",
   "origine": "Cadrage"
  },
  {
   "id": "A-002",
   "titre": "Obtenir les logos partenaires en SVG",
   "responsable": "UCOM",
   "echeance": "2027-02-26",
   "statut": "Ouvert",
   "priorite": "Normale",
   "origine": "Guide DS A2"
  },
  {
   "id": "A-003",
   "titre": "Vérifier la licence web des polices Chalet et Spectral",
   "responsable": "UCOM",
   "echeance": "2026-12-18",
   "statut": "Ouvert",
   "priorite": "Normale",
   "origine": "R-011"
  },
  {
   "id": "A-004",
   "titre": "Identifier un serveur interne et une authentification pour la plateforme",
   "responsable": "DSI",
   "echeance": "2026-11-27",
   "statut": "Ouvert",
   "priorite": "Haute",
   "origine": "Q-008"
  },
  {
   "id": "A-005",
   "titre": "Fixer le calendrier des Copil sur 12 mois",
   "responsable": "CDP",
   "echeance": "2026-11-06",
   "statut": "Ouvert",
   "priorite": "Haute",
   "origine": "R-007"
  },
  {
   "id": "A-006",
   "titre": "Formaliser les décharges de temps U-Com / DSI pour le projet",
   "responsable": "SPO",
   "echeance": "2026-12-18",
   "statut": "Ouvert",
   "priorite": "Haute",
   "origine": "R-001"
  }
 ],
 "parties": [
  {
   "id": "PP-01",
   "nom": "HEP Vaud — Direction (mandant)",
   "groupe": "Gouvernance",
   "influence": 5,
   "interet": 4,
   "attentes": "Vision, image institutionnelle",
   "strategie": "Gérer étroitement",
   "contact": ""
  },
  {
   "id": "PP-02",
   "nom": "Copil - Site internet HEP VAUD",
   "groupe": "Gouvernance",
   "influence": 5,
   "interet": 5,
   "attentes": "Arbitrages, respect délais/budget",
   "strategie": "Gérer étroitement",
   "contact": ""
  },
  {
   "id": "PP-03",
   "nom": "Unité Communication",
   "groupe": "Projet",
   "influence": 4,
   "interet": 5,
   "attentes": "Cohérence de marque, gouvernance éditoriale",
   "strategie": "Gérer étroitement",
   "contact": ""
  },
  {
   "id": "PP-04",
   "nom": "Service informatique HEP Vaud",
   "groupe": "Projet",
   "influence": 5,
   "interet": 4,
   "attentes": "Jahia 8, sécurité, maintenabilité, intégrations",
   "strategie": "Gérer étroitement",
   "contact": ""
  },
  {
   "id": "PP-05",
   "nom": "Unités, filières et UER",
   "groupe": "Contributeurs",
   "influence": 3,
   "interet": 4,
   "attentes": "Visibilité, simplicité de contribution",
   "strategie": "Impliquer",
   "contact": ""
  },
  {
   "id": "PP-06",
   "nom": "Futur·es étudiant·es",
   "groupe": "Publics",
   "influence": 2,
   "interet": 5,
   "attentes": "Trouver la bonne formation, admission",
   "strategie": "Tenir informés / tester",
   "contact": ""
  },
  {
   "id": "PP-07",
   "nom": "Étudiant·es (MyEtu)",
   "groupe": "Publics",
   "influence": 3,
   "interet": 5,
   "attentes": "Accès rapide aux infos de cursus, mobile",
   "strategie": "Impliquer",
   "contact": ""
  },
  {
   "id": "PP-08",
   "nom": "Praticien·nes formateurs·trices (MyParFo)",
   "groupe": "Publics",
   "influence": 3,
   "interet": 4,
   "attentes": "Infos de stages, documents",
   "strategie": "Impliquer",
   "contact": ""
  },
  {
   "id": "PP-09",
   "nom": "Collaborateurs·trices (MyCollab)",
   "groupe": "Publics",
   "influence": 3,
   "interet": 4,
   "attentes": "Intranet efficace",
   "strategie": "Impliquer",
   "contact": ""
  },
  {
   "id": "PP-10",
   "nom": "Participant·es formation continue",
   "groupe": "Publics",
   "influence": 2,
   "interet": 4,
   "attentes": "Catalogue, inscription",
   "strategie": "Tenir informés / tester",
   "contact": ""
  },
  {
   "id": "PP-11",
   "nom": "Établissements scolaires partenaires",
   "groupe": "Partenaires",
   "influence": 2,
   "interet": 3,
   "attentes": "Informations stages",
   "strategie": "Tenir informés",
   "contact": ""
  },
  {
   "id": "PP-12",
   "nom": "Canton de Vaud (tutelle)",
   "groupe": "Tutelle",
   "influence": 4,
   "interet": 3,
   "attentes": "Conformité, image publique",
   "strategie": "Satisfaire",
   "contact": ""
  },
  {
   "id": "PP-13",
   "nom": "Médias & grand public",
   "groupe": "Publics",
   "influence": 2,
   "interet": 2,
   "attentes": "Actualités, contacts presse",
   "strategie": "Surveiller",
   "contact": ""
  }
 ],
 "systemes": [
  {
   "id": "S-01",
   "nom": "CMS Jahia 8 (site public)",
   "type": "Interne",
   "usage": "Gestion de contenu de hepl.ch",
   "univers": "Site",
   "criticite": 5,
   "protocole": "",
   "proprietaire": "",
   "documentation": "",
   "statut": "Confirmé"
  },
  {
   "id": "S-02",
   "nom": "Portail MyEtu",
   "type": "Interne",
   "usage": "Portail étudiant·es",
   "univers": "MyEtu",
   "criticite": 5,
   "protocole": "",
   "proprietaire": "",
   "documentation": "",
   "statut": "À confirmer"
  },
  {
   "id": "S-03",
   "nom": "Portail MyCollab",
   "type": "Interne",
   "usage": "Portail collaborateurs·trices",
   "univers": "MyCollab",
   "criticite": 5,
   "protocole": "",
   "proprietaire": "",
   "documentation": "",
   "statut": "À confirmer"
  },
  {
   "id": "S-04",
   "nom": "Portail MyParFo",
   "type": "Interne",
   "usage": "Portail praticien·nes formateurs·trices",
   "univers": "MyParFo",
   "criticite": 5,
   "protocole": "",
   "proprietaire": "",
   "documentation": "",
   "statut": "À confirmer"
  },
  {
   "id": "S-05",
   "nom": "Google Analytics 4 / Search Console",
   "type": "Externe",
   "usage": "Mesure d'audience, SEO",
   "univers": "Tous",
   "criticite": 3,
   "protocole": "",
   "proprietaire": "",
   "documentation": "",
   "statut": "Confirmé"
  },
  {
   "id": "S-06",
   "nom": "Mailchimp (newsletters)",
   "type": "Externe",
   "usage": "Abonnements, envois",
   "univers": "Site",
   "criticite": 3,
   "protocole": "",
   "proprietaire": "",
   "documentation": "",
   "statut": "Confirmé"
  },
  {
   "id": "S-07",
   "nom": "Autres services connectés",
   "type": "—",
   "usage": "Inventaire prévu en P6 (étape ultérieure)",
   "univers": "—",
   "criticite": 3,
   "protocole": "",
   "proprietaire": "",
   "documentation": "",
   "statut": "À inventorier"
  }
 ],
 "agents": [
  {
   "id": "AG-PMO",
   "nom": "Agent PMO & reporting",
   "mission": "Tient la plateforme à jour, compile le rapport hebdomadaire, prépare les Copil, suit jalons, dépendances et baseline.",
   "phases": "Toutes",
   "entrees": "Données de la plateforme, PV",
   "sorties": "Rapport hebdo, supports Copil, alertes",
   "skills": "hepvd-contexte-refonte, hepvd-rapport-hebdo, xlsx, pptx"
  },
  {
   "id": "AG-RISK",
   "nom": "Agent risques & anticipation",
   "mission": "Analyse les dérives de planning, l'épuisement des marges, la charge des rôles ; propose risques nouveaux et réponses.",
   "phases": "Toutes",
   "entrees": "Plateforme (prévisions, alertes, risques)",
   "sorties": "Revue des risques, alertes, scénarios",
   "skills": "hepvd-contexte-refonte, data:analyze"
  },
  {
   "id": "AG-CRIT",
   "nom": "Agent contradicteur (revue critique)",
   "mission": "Remet en question chaque livrable clé : hypothèses, angles morts, biais, incohérences, risques non traités.",
   "phases": "Toutes (avant chaque gate et chaque version DS)",
   "entrees": "Livrable + critères",
   "sorties": "Revue critique, questionnements à enregistrer",
   "skills": "hepvd-revue-gate, data:validate-data, design:design-critique"
  },
  {
   "id": "AG-AUDIT",
   "nom": "Agent audit de contenu",
   "mission": "Qualifie les ≈4500 pages (ROT, doublons, fraîcheur, propriétaire).",
   "phases": "P1, P3",
   "entrees": "Crawl, exports Jahia, GA4",
   "sorties": "Inventaire qualifié",
   "skills": "xlsx, data:explore-data"
  },
  {
   "id": "AG-ANALYTICS",
   "nom": "Agent analytics",
   "mission": "Analyse l'audience GA4, la recherche interne et mesure les KPI.",
   "phases": "P0, P1, P2, P11",
   "entrees": "GA4 / Supermetrics, Search Console",
   "sorties": "Analyses, baseline KPI",
   "skills": "data:analyze, dataviz"
  },
  {
   "id": "AG-SEO",
   "nom": "Agent SEO",
   "mission": "Audit SEO, arborescence et plan de redirections.",
   "phases": "P1, P3, P8",
   "entrees": "Crawl, Search Console",
   "sorties": "Audit, plan 301",
   "skills": "marketing:seo-audit"
  },
  {
   "id": "AG-A11Y",
   "nom": "Agent accessibilité",
   "mission": "Contrôle WCAG 2.1 AA / eCH-0059 à chaque étape.",
   "phases": "P1, P4, P5, P7, P9",
   "entrees": "Pages, maquettes, tokens",
   "sorties": "Rapports, corrections",
   "skills": "design:accessibility-review"
  },
  {
   "id": "AG-BENCH",
   "nom": "Agent benchmark & veille",
   "mission": "Analyse les sites de hautes écoles et les design systems publics de référence.",
   "phases": "P1, P2, P4",
   "entrees": "Liste de références",
   "sorties": "Benchmark",
   "skills": "deep-research, marketing:competitive-brief"
  },
  {
   "id": "AG-UXR",
   "nom": "Agent recherche utilisateurs",
   "mission": "Guides d'entretien, enquêtes, synthèses, personas, parcours.",
   "phases": "P2, P3, P5",
   "entrees": "Transcriptions, réponses",
   "sorties": "Personas, parcours, insights",
   "skills": "design:user-research, design:research-synthesis"
  },
  {
   "id": "AG-STRAT",
   "nom": "Agent stratégie produit",
   "mission": "Vision, écosystème, priorisation, décisions de plateformes.",
   "phases": "P2",
   "entrees": "Insights P1–P2",
   "sorties": "Vision, roadmap, fiches de décision",
   "skills": "docs, pptx"
  },
  {
   "id": "AG-IA",
   "nom": "Agent architecture de l'information",
   "mission": "Arborescences, taxonomie, navigation, modèle de contenu.",
   "phases": "P3",
   "entrees": "Tri de cartes, inventaire",
   "sorties": "Arborescence, modèle de contenu",
   "skills": "xlsx"
  },
  {
   "id": "AG-CONT",
   "nom": "Agent contenus & rédaction",
   "mission": "Charte éditoriale web, réécriture, règles de nommage HEP Vaud.",
   "phases": "P3, P8",
   "entrees": "Charte, contenus",
   "sorties": "Charte éditoriale, contenus réécrits",
   "skills": "hepvd-redaction-web, marketing:brand-review"
  },
  {
   "id": "AG-COPY",
   "nom": "Agent UX writing",
   "mission": "Microcopie, libellés, messages d'erreur, états vides.",
   "phases": "P4, P5, P10",
   "entrees": "Maquettes",
   "sorties": "Microcopie",
   "skills": "design:ux-copy, hepvd-redaction-web"
  },
  {
   "id": "AG-DS",
   "nom": "Agent Design System",
   "mission": "Traduit la charte en fondations, tokens et composants documentés ; tient le journal des versions DS.",
   "phases": "P1, P4, P5, P11",
   "entrees": "Charte, logos, inventaire d'interface",
   "sorties": "Fondations, tokens, composants, release notes",
   "skills": "hepvd-charte, design:design-system"
  },
  {
   "id": "AG-UI",
   "nom": "Agent UI / gabarits",
   "mission": "Conçoit et critique wireframes et maquettes.",
   "phases": "P4, P5",
   "entrees": "Modèle de contenu, DS",
   "sorties": "Maquettes, specs",
   "skills": "design:design-critique, design:design-handoff"
  },
  {
   "id": "AG-ARCH",
   "nom": "Agent architecture technique",
   "mission": "Templating Jahia 8, intégration du DS, services connectés, portails.",
   "phases": "P1, P6, P7",
   "entrees": "Documentation technique",
   "sorties": "Études, dossiers d'architecture",
   "skills": "docs"
  },
  {
   "id": "AG-SECU",
   "nom": "Agent sécurité & protection des données",
   "mission": "Exigences, analyse d'impact, suivi des vulnérabilités (sous contrôle humain).",
   "phases": "P6, P9",
   "entrees": "Flux de données",
   "sorties": "Analyses, exigences",
   "skills": "docs"
  },
  {
   "id": "AG-DEV",
   "nom": "Agent développement front",
   "mission": "Pipeline de tokens, composants de référence, revue de l'intégration Jahia.",
   "phases": "P4, P6, P7",
   "entrees": "Tokens, specs",
   "sorties": "Code de référence, revues",
   "skills": "design:design-handoff"
  },
  {
   "id": "AG-QA",
   "nom": "Agent qualité & recette",
   "mission": "Cahiers de tests, suivi des anomalies, non-régression.",
   "phases": "P7, P8, P9",
   "entrees": "Specs, exigences",
   "sorties": "Cahier de tests, PV",
   "skills": "xlsx"
  },
  {
   "id": "AG-MIG",
   "nom": "Agent migration",
   "mission": "Pilote la migration par lots, contrôle redirections et qualité.",
   "phases": "P8",
   "entrees": "Matrice de migration",
   "sorties": "Suivi, contrôles",
   "skills": "xlsx, data:validate-data"
  },
  {
   "id": "AG-CHG",
   "nom": "Agent conduite du changement",
   "mission": "Plan de communication, formation, adoption.",
   "phases": "P10, P11",
   "entrees": "Personas, calendrier académique",
   "sorties": "Plan de communication, guides",
   "skills": "marketing:campaign-plan"
  }
 ],
 "raci": {
  "activites": [
   {
    "activite": "Note de cadrage",
    "valeurs": {
     "SPO": "A",
     "COP": "C",
     "CDP": "R",
     "PMO": "C",
     "UCOM": "C",
     "DSI": "C"
    }
   },
   {
    "activite": "Plateforme de pilotage & reporting",
    "valeurs": {
     "CDP": "A",
     "PMO": "R",
     "COP": "I",
     "DSI": "C"
    }
   },
   {
    "activite": "Gestion des risques",
    "valeurs": {
     "CDP": "A",
     "PMO": "R",
     "COP": "C",
     "SPO": "I"
    }
   },
   {
    "activite": "Audit & diagnostic",
    "valeurs": {
     "CDP": "A",
     "UCOM": "R",
     "CONT": "R",
     "DSI": "R",
     "UI": "R",
     "A11Y": "R",
     "COP": "I"
    }
   },
   {
    "activite": "Recherche utilisateurs",
    "valeurs": {
     "CDP": "A",
     "UX": "R",
     "PO": "C",
     "USR": "C",
     "UCOM": "C"
    }
   },
   {
    "activite": "Arborescence & modèle de contenu",
    "valeurs": {
     "CDP": "A",
     "CONT": "R",
     "UX": "R",
     "PO": "C",
     "USR": "C"
    }
   },
   {
    "activite": "Design System",
    "valeurs": {
     "UCOM": "A",
     "UI": "R",
     "DEV": "R",
     "A11Y": "C",
     "CDP": "C",
     "COP": "I"
    }
   },
   {
    "activite": "Gabarits & maquettes",
    "valeurs": {
     "CDP": "A",
     "UX": "R",
     "UI": "R",
     "PO": "C",
     "USR": "C",
     "A11Y": "C"
    }
   },
   {
    "activite": "Architecture Jahia 8",
    "valeurs": {
     "DSI": "A",
     "ARCH": "R",
     "DEV": "R",
     "PDO": "C",
     "CDP": "C"
    }
   },
   {
    "activite": "Développement",
    "valeurs": {
     "DSI": "A",
     "DEV": "R",
     "PO": "C",
     "UI": "C",
     "CDP": "I"
    }
   },
   {
    "activite": "Migration de contenus",
    "valeurs": {
     "UCOM": "A",
     "CONT": "R",
     "PO": "C",
     "CDP": "I"
    }
   },
   {
    "activite": "Recette",
    "valeurs": {
     "CDP": "A",
     "PO": "R",
     "USR": "R",
     "A11Y": "R",
     "PDO": "C"
    }
   },
   {
    "activite": "Go / No-go",
    "valeurs": {
     "SPO": "A",
     "COP": "R",
     "CDP": "R",
     "DSI": "C",
     "UCOM": "C"
    }
   }
  ]
 },
 "budget": [
  {
   "id": "B-01",
   "poste": "Outils de conception et prototypage",
   "phases": "P4, P5",
   "prevu": 1500,
   "engage": 0,
   "consomme": 0
  },
  {
   "id": "B-02",
   "poste": "Licences typographiques web",
   "phases": "P4",
   "prevu": 1500,
   "engage": 0,
   "consomme": 0
  },
  {
   "id": "B-03",
   "poste": "Recherche & tests utilisateurs (recrutement, remerciements)",
   "phases": "P2, P5",
   "prevu": 2000,
   "engage": 0,
   "consomme": 0
  },
  {
   "id": "B-04",
   "poste": "Audit d'accessibilité indépendant ciblé",
   "phases": "P4, P9",
   "prevu": 2000,
   "engage": 0,
   "consomme": 0
  },
  {
   "id": "B-05",
   "poste": "Images, photographie, iconographie",
   "phases": "P4",
   "prevu": 1000,
   "engage": 0,
   "consomme": 0
  },
  {
   "id": "B-06",
   "poste": "Formation / montée en compétence",
   "phases": "P4, P6",
   "prevu": 500,
   "engage": 0,
   "consomme": 0
  },
  {
   "id": "B-07",
   "poste": "Réserve pour imprévus (15 %)",
   "phases": "—",
   "prevu": 1500,
   "engage": 0,
   "consomme": 0
  }
 ],
 "changements": [],
 "rapports": [],
 "baselines": [
  {
   "id": "BL-00",
   "date": "2026-10-05",
   "nom": "Plan initial v0.2 (proposition, avant validation G0)",
   "auteur": "Claude (Cowork) pour U-Com",
   "taches": {
    "T001": [
     "2026-10-05",
     "2026-10-30"
    ],
    "T002": [
     "2026-10-05",
     "2026-10-30"
    ],
    "T003": [
     "2026-10-19",
     "2026-10-30"
    ],
    "T004": [
     "2026-11-02",
     "2026-11-20"
    ],
    "T005": [
     "2026-10-26",
     "2026-11-13"
    ],
    "T006": [
     "2026-11-02",
     "2026-11-20"
    ],
    "T007": [
     "2026-11-02",
     "2026-11-20"
    ],
    "T008": [
     "2026-11-09",
     "2026-11-27"
    ],
    "T009": [
     "2026-11-23",
     "2026-12-04"
    ],
    "T010": [
     "2026-12-07",
     "2026-12-11"
    ],
    "T011": [
     "2027-01-11",
     "2027-02-05"
    ],
    "T012": [
     "2027-01-18",
     "2027-02-19"
    ],
    "T013": [
     "2027-02-01",
     "2027-03-26"
    ],
    "T014": [
     "2027-02-01",
     "2027-03-05"
    ],
    "T015": [
     "2027-02-15",
     "2027-03-12"
    ],
    "T016": [
     "2027-02-22",
     "2027-03-26"
    ],
    "T017": [
     "2027-01-18",
     "2027-03-19"
    ],
    "T018": [
     "2027-02-15",
     "2027-03-26"
    ],
    "T019": [
     "2027-03-29",
     "2027-04-16"
    ],
    "T020": [
     "2027-03-01",
     "2027-03-19"
    ],
    "T021": [
     "2027-03-22",
     "2027-04-30"
    ],
    "T022": [
     "2027-03-29",
     "2027-04-30"
    ],
    "T023": [
     "2027-05-03",
     "2027-05-21"
    ],
    "T024": [
     "2027-05-24",
     "2027-06-11"
    ],
    "T025": [
     "2027-05-24",
     "2027-06-11"
    ],
    "T026": [
     "2027-05-31",
     "2027-06-11"
    ],
    "T027": [
     "2027-05-17",
     "2027-06-18"
    ],
    "T028": [
     "2027-06-21",
     "2027-08-27"
    ],
    "T029": [
     "2027-08-30",
     "2027-09-24"
    ],
    "T030": [
     "2027-07-05",
     "2027-09-24"
    ],
    "T031": [
     "2027-08-16",
     "2027-10-01"
    ],
    "T032": [
     "2027-09-06",
     "2027-10-08"
    ],
    "T033": [
     "2027-09-13",
     "2027-10-15"
    ],
    "T034": [
     "2027-02-01",
     "2027-03-05"
    ],
    "T035": [
     "2027-02-01",
     "2027-03-12"
    ],
    "T036": [
     "2027-03-08",
     "2027-04-16"
    ],
    "T037": [
     "2027-04-05",
     "2027-05-14"
    ],
    "T038": [
     "2027-04-19",
     "2027-05-28"
    ],
    "T039": [
     "2027-05-03",
     "2027-06-25"
    ],
    "T040": [
     "2027-05-31",
     "2027-07-02"
    ],
    "T041": [
     "2027-07-05",
     "2027-09-10"
    ],
    "T042": [
     "2027-09-13",
     "2027-11-05"
    ],
    "T043": [
     "2027-09-20",
     "2027-11-19"
    ],
    "T044": [
     "2027-10-25",
     "2027-11-19"
    ],
    "T045": [
     "2027-11-22",
     "2027-12-10"
    ],
    "T046": [
     "2027-09-06",
     "2027-10-01"
    ],
    "T047": [
     "2027-10-04",
     "2027-11-26"
    ],
    "T048": [
     "2027-11-29",
     "2028-02-25"
    ],
    "T049": [
     "2028-01-31",
     "2028-03-03"
    ],
    "T050": [
     "2028-03-06",
     "2028-04-07"
    ],
    "T051": [
     "2028-03-27",
     "2028-04-14"
    ],
    "T052": [
     "2027-01-11",
     "2027-02-05"
    ],
    "T053": [
     "2027-02-08",
     "2027-04-16"
    ],
    "T054": [
     "2027-04-19",
     "2027-06-25"
    ],
    "T055": [
     "2027-03-01",
     "2027-05-07"
    ],
    "T056": [
     "2027-06-07",
     "2027-09-24"
    ],
    "T057": [
     "2027-08-30",
     "2027-11-05"
    ],
    "T058": [
     "2027-09-06",
     "2027-11-19"
    ],
    "T059": [
     "2027-10-04",
     "2027-12-03"
    ],
    "T060": [
     "2028-01-10",
     "2028-03-31"
    ],
    "T061": [
     "2028-04-17",
     "2028-08-25"
    ],
    "T062": [
     "2028-05-01",
     "2028-10-27"
    ],
    "T063": [
     "2028-04-03",
     "2028-10-13"
    ],
    "T064": [
     "2028-06-05",
     "2028-10-06"
    ],
    "T065": [
     "2028-08-28",
     "2028-11-24"
    ],
    "T066": [
     "2028-01-10",
     "2028-11-24"
    ],
    "T067": [
     "2028-06-05",
     "2028-07-07"
    ],
    "T068": [
     "2028-09-04",
     "2028-10-27"
    ],
    "T069": [
     "2028-10-30",
     "2029-03-23"
    ],
    "T070": [
     "2029-02-26",
     "2029-04-13"
    ],
    "T071": [
     "2028-11-06",
     "2028-12-08"
    ],
    "T072": [
     "2029-01-08",
     "2029-04-27"
    ],
    "T073": [
     "2029-03-26",
     "2029-05-04"
    ],
    "T074": [
     "2029-04-02",
     "2029-05-11"
    ],
    "T075": [
     "2029-04-16",
     "2029-05-18"
    ],
    "T076": [
     "2029-05-07",
     "2029-06-01"
    ],
    "T077": [
     "2029-03-05",
     "2029-04-13"
    ],
    "T078": [
     "2029-04-16",
     "2029-06-15"
    ],
    "T079": [
     "2029-05-07",
     "2029-06-15"
    ],
    "T080": [
     "2029-06-25",
     "2029-07-13"
    ],
    "T081": [
     "2029-07-16",
     "2029-08-31"
    ],
    "T082": [
     "2029-09-03",
     "2029-12-14"
    ],
    "T083": [
     "2029-09-24",
     "2029-10-19"
    ]
   },
   "jalons": {
    "G0": "2026-12-18",
    "G1": "2027-04-30",
    "G2": "2027-06-25",
    "G3": "2027-10-29",
    "G4": "2027-12-17",
    "G5": "2028-04-28",
    "G6": "2027-12-17",
    "G7": "2029-06-15",
    "G8": "2029-06-22",
    "G9": "2029-10-26",
    "M-J8": "2026-10-30",
    "M-DS05": "2027-09-17",
    "M-DS08": "2027-11-05",
    "M-LIVE": "2029-06-29"
   }
  }
 ],
 "dsVersions": [
  {
   "id": "v0.0",
   "version": "0.0",
   "date": "2026-09-10",
   "statut": "Publiée",
   "resume": "Point de départ : charte graphique print (version 10.09.2026). Logo, Bento, couleurs, typographies.",
   "type": "Charte",
   "notes": "",
   "decisions": "",
   "documents": ""
  },
  {
   "id": "v0.1",
   "version": "0.1",
   "date": "2027-04-16",
   "statut": "Planifiée",
   "resume": "Fondations couleurs et rôles sémantiques, contrastes validés.",
   "type": "Fondations",
   "notes": "",
   "decisions": "",
   "documents": ""
  },
  {
   "id": "v0.2",
   "version": "0.2",
   "date": "2027-05-28",
   "statut": "Planifiée",
   "resume": "Typographie, grilles, espacements, système Bento digital.",
   "type": "Fondations",
   "notes": "",
   "decisions": "",
   "documents": ""
  },
  {
   "id": "v0.3",
   "version": "0.3",
   "date": "2027-07-09",
   "statut": "Planifiée",
   "resume": "Design tokens (DTCG) et pipeline vers CSS ; iconographie.",
   "type": "Tokens",
   "notes": "",
   "decisions": "",
   "documents": ""
  },
  {
   "id": "v0.5",
   "version": "0.5",
   "date": "2027-09-17",
   "statut": "Planifiée",
   "resume": "Composants de base.",
   "type": "Composants",
   "notes": "",
   "decisions": "",
   "documents": ""
  },
  {
   "id": "v0.8",
   "version": "0.8",
   "date": "2027-11-05",
   "statut": "Planifiée",
   "resume": "Composants complexes et patterns ; style guide en ligne.",
   "type": "Composants",
   "notes": "",
   "decisions": "",
   "documents": ""
  },
  {
   "id": "v1.0",
   "version": "1.0",
   "date": "2027-12-10",
   "statut": "Planifiée",
   "resume": "Release validée : revues accessibilité et marque, avenant digital à la charte.",
   "type": "Release",
   "notes": "",
   "decisions": "",
   "documents": ""
  }
 ],
 "dsElements": [
  {
   "id": "E-001",
   "nom": "Logo simple (NOIR / BLANC)",
   "categorie": "Marque",
   "statut": "Hérité de la charte",
   "version": "0.1",
   "source": "Charte p. 5–6 ; SVG dans _SOURCES/Logos",
   "notes": "Taille min. print 15 mm : équivalent écran à définir",
   "a11y": "",
   "responsable": "UI"
  },
  {
   "id": "E-002",
   "nom": "Logo + descripteur (NOIR / BLANC)",
   "categorie": "Marque",
   "statut": "Hérité de la charte",
   "version": "0.1",
   "source": "Charte p. 5–7",
   "notes": "Taille min. print 25 mm : équivalent écran à définir",
   "a11y": "",
   "responsable": "UI"
  },
  {
   "id": "E-003",
   "nom": "Espace de respiration du logo (unité x)",
   "categorie": "Marque",
   "statut": "Hérité de la charte",
   "version": "0.1",
   "source": "Charte p. 10–11",
   "notes": "",
   "a11y": "",
   "responsable": "UI"
  },
  {
   "id": "E-004",
   "nom": "Noir #000000 / Blanc #ffffff",
   "categorie": "Couleur",
   "statut": "Hérité de la charte",
   "version": "0.1",
   "source": "Charte p. 18",
   "notes": "",
   "a11y": "",
   "responsable": "UI"
  },
  {
   "id": "E-005",
   "nom": "Bleu #009cde (+50 % #94cef2, 25 % #cee7fa)",
   "categorie": "Couleur",
   "statut": "À adapter au digital",
   "version": "0.1",
   "source": "Charte p. 18",
   "notes": "3.08:1 sur blanc : non utilisable pour du texte courant",
   "a11y": "",
   "responsable": "UI"
  },
  {
   "id": "E-006",
   "nom": "Bleu sombre #00354c (+50 % #6891a8, 25 % #b1c6d5)",
   "categorie": "Couleur",
   "statut": "Hérité de la charte",
   "version": "0.1",
   "source": "Charte p. 18",
   "notes": "13:1 sur blanc : texte, liens, boutons",
   "a11y": "",
   "responsable": "UI"
  },
  {
   "id": "E-007",
   "nom": "Secondaires : vert, mauve, abricot, jaune, corail",
   "categorie": "Couleur",
   "statut": "À adapter au digital",
   "version": "0.1",
   "source": "Charte p. 19",
   "notes": "Jamais isolées ; usage de différenciation",
   "a11y": "",
   "responsable": "UI"
  },
  {
   "id": "E-008",
   "nom": "Couleurs fonctionnelles (succès, erreur, alerte, info)",
   "categorie": "Couleur",
   "statut": "À concevoir",
   "version": "0.1",
   "source": "—",
   "notes": "Absentes de la charte",
   "a11y": "",
   "responsable": "UI"
  },
  {
   "id": "E-009",
   "nom": "Spectral (titres)",
   "categorie": "Typographie",
   "statut": "À adapter au digital",
   "version": "0.2",
   "source": "Charte p. 20",
   "notes": "Licence web à confirmer",
   "a11y": "",
   "responsable": "UI"
  },
  {
   "id": "E-010",
   "nom": "Chalet Book (texte)",
   "categorie": "Typographie",
   "statut": "À adapter au digital",
   "version": "0.2",
   "source": "Charte p. 20",
   "notes": "Licence web à confirmer",
   "a11y": "",
   "responsable": "UI"
  },
  {
   "id": "E-011",
   "nom": "Échelle typographique responsive",
   "categorie": "Typographie",
   "statut": "À concevoir",
   "version": "0.2",
   "source": "—",
   "notes": "",
   "a11y": "",
   "responsable": "UI"
  },
  {
   "id": "E-012",
   "nom": "Blocs Bento (angles, marges)",
   "categorie": "Bento",
   "statut": "Hérité de la charte",
   "version": "0.2",
   "source": "Charte p. 13–16",
   "notes": "Digital : 1280×720 → marge 39 px, angle 40 px ; 1080×1920 → marge 42 px, angle 40 px",
   "a11y": "",
   "responsable": "UI"
  },
  {
   "id": "E-013",
   "nom": "Fusion Bento (un seul angle fusionné)",
   "categorie": "Bento",
   "statut": "Hérité de la charte",
   "version": "0.2",
   "source": "Charte p. 15",
   "notes": "",
   "a11y": "",
   "responsable": "UI"
  },
  {
   "id": "E-014",
   "nom": "Grille responsive et points de rupture",
   "categorie": "Grille",
   "statut": "À concevoir",
   "version": "0.2",
   "source": "—",
   "notes": "",
   "a11y": "",
   "responsable": "UI"
  },
  {
   "id": "E-015",
   "nom": "Échelle d'espacements",
   "categorie": "Espacement",
   "statut": "À concevoir",
   "version": "0.2",
   "source": "—",
   "notes": "",
   "a11y": "",
   "responsable": "UI"
  },
  {
   "id": "E-016",
   "nom": "Iconographie",
   "categorie": "Iconographie",
   "statut": "À concevoir",
   "version": "0.3",
   "source": "—",
   "notes": "Absente de la charte",
   "a11y": "",
   "responsable": "UI"
  },
  {
   "id": "E-017",
   "nom": "Direction photographique",
   "categorie": "Imagerie",
   "statut": "À concevoir",
   "version": "0.3",
   "source": "Exemples p. 12–14",
   "notes": "",
   "a11y": "",
   "responsable": "UI"
  },
  {
   "id": "E-018",
   "nom": "Bouton",
   "categorie": "Composant",
   "statut": "À concevoir",
   "version": "0.5",
   "source": "",
   "notes": "",
   "a11y": "",
   "responsable": "UI"
  },
  {
   "id": "E-019",
   "nom": "Lien",
   "categorie": "Composant",
   "statut": "À concevoir",
   "version": "0.5",
   "source": "",
   "notes": "",
   "a11y": "",
   "responsable": "UI"
  },
  {
   "id": "E-020",
   "nom": "Champs de formulaire",
   "categorie": "Composant",
   "statut": "À concevoir",
   "version": "0.5",
   "source": "",
   "notes": "",
   "a11y": "",
   "responsable": "UI"
  },
  {
   "id": "E-021",
   "nom": "Navigation principale",
   "categorie": "Composant",
   "statut": "À concevoir",
   "version": "0.5",
   "source": "",
   "notes": "",
   "a11y": "",
   "responsable": "UI"
  },
  {
   "id": "E-022",
   "nom": "Fil d'Ariane",
   "categorie": "Composant",
   "statut": "À concevoir",
   "version": "0.5",
   "source": "",
   "notes": "",
   "a11y": "",
   "responsable": "UI"
  },
  {
   "id": "E-023",
   "nom": "En-tête & pied de page",
   "categorie": "Composant",
   "statut": "À concevoir",
   "version": "0.5",
   "source": "",
   "notes": "",
   "a11y": "",
   "responsable": "UI"
  },
  {
   "id": "E-024",
   "nom": "Carte Bento",
   "categorie": "Composant",
   "statut": "À concevoir",
   "version": "0.5",
   "source": "",
   "notes": "",
   "a11y": "",
   "responsable": "UI"
  },
  {
   "id": "E-025",
   "nom": "Étiquette / badge",
   "categorie": "Composant",
   "statut": "À concevoir",
   "version": "0.5",
   "source": "",
   "notes": "",
   "a11y": "",
   "responsable": "UI"
  },
  {
   "id": "E-026",
   "nom": "Alerte / message",
   "categorie": "Composant",
   "statut": "À concevoir",
   "version": "0.5",
   "source": "",
   "notes": "",
   "a11y": "",
   "responsable": "UI"
  },
  {
   "id": "E-027",
   "nom": "Accordéon",
   "categorie": "Composant",
   "statut": "À concevoir",
   "version": "0.5",
   "source": "",
   "notes": "",
   "a11y": "",
   "responsable": "UI"
  },
  {
   "id": "E-028",
   "nom": "Onglets",
   "categorie": "Composant",
   "statut": "À concevoir",
   "version": "0.8",
   "source": "",
   "notes": "",
   "a11y": "",
   "responsable": "UI"
  },
  {
   "id": "E-029",
   "nom": "Recherche",
   "categorie": "Composant",
   "statut": "À concevoir",
   "version": "0.8",
   "source": "",
   "notes": "",
   "a11y": "",
   "responsable": "UI"
  },
  {
   "id": "E-030",
   "nom": "Liste d'actualités",
   "categorie": "Composant",
   "statut": "À concevoir",
   "version": "0.8",
   "source": "",
   "notes": "",
   "a11y": "",
   "responsable": "UI"
  },
  {
   "id": "E-031",
   "nom": "Agenda / événement",
   "categorie": "Composant",
   "statut": "À concevoir",
   "version": "0.8",
   "source": "",
   "notes": "",
   "a11y": "",
   "responsable": "UI"
  },
  {
   "id": "E-032",
   "nom": "Fiche formation",
   "categorie": "Composant",
   "statut": "À concevoir",
   "version": "0.8",
   "source": "",
   "notes": "",
   "a11y": "",
   "responsable": "UI"
  },
  {
   "id": "E-033",
   "nom": "Profil de personne",
   "categorie": "Composant",
   "statut": "À concevoir",
   "version": "0.8",
   "source": "",
   "notes": "",
   "a11y": "",
   "responsable": "UI"
  },
  {
   "id": "E-034",
   "nom": "Chiffres clés",
   "categorie": "Composant",
   "statut": "À concevoir",
   "version": "0.8",
   "source": "",
   "notes": "",
   "a11y": "",
   "responsable": "UI"
  },
  {
   "id": "E-035",
   "nom": "Tableau de données",
   "categorie": "Composant",
   "statut": "À concevoir",
   "version": "0.8",
   "source": "",
   "notes": "",
   "a11y": "",
   "responsable": "UI"
  },
  {
   "id": "E-036",
   "nom": "Pagination",
   "categorie": "Composant",
   "statut": "À concevoir",
   "version": "0.8",
   "source": "",
   "notes": "",
   "a11y": "",
   "responsable": "UI"
  },
  {
   "id": "E-037",
   "nom": "Modale",
   "categorie": "Composant",
   "statut": "À concevoir",
   "version": "0.8",
   "source": "",
   "notes": "",
   "a11y": "",
   "responsable": "UI"
  },
  {
   "id": "E-038",
   "nom": "Média / vidéo",
   "categorie": "Composant",
   "statut": "À concevoir",
   "version": "0.8",
   "source": "",
   "notes": "",
   "a11y": "",
   "responsable": "UI"
  },
  {
   "id": "E-039",
   "nom": "Tableau de bord de portail (widgets)",
   "categorie": "Pattern",
   "statut": "À concevoir",
   "version": "0.8",
   "source": "",
   "notes": "MyEtu, MyCollab, MyParFo",
   "a11y": "",
   "responsable": "UI"
  }
 ],
 "dsDemandes": [],
 "dsBesoins": [
  {
   "id": "A1",
   "categorie": "Marque",
   "besoin": "Logos SVG : simple et descripteur, NOIR et BLANC",
   "pourquoi": "Base de toute interface",
   "statut": "Reçu : 4 SVG dans `_SOURCES/Logos` (simple NOIR, simple BLANC, descripteur NOIR, descripteur BLANC). Fichiers nommés « CMJN » : vérifier qu'ils conviennent à l'écran (couleurs RVB, nettoyage des métadonnées Illustrator)",
   "qui": "UCOM",
   "quand": "Fait",
   "statutSuivi": "Reçu",
   "commentaire": "Reçu : 4 SVG dans `_SOURCES/Logos` (simple NOIR, simple BLANC, descripteur NOIR, descripteur BLANC). Fichiers nommés « CMJN » : vérifier qu'ils conviennent à l'écran (couleurs RVB, nettoyage des métadonnées Illustrator)"
  },
  {
   "id": "A2",
   "categorie": "Marque",
   "besoin": "Logos partenaires en SVG (Canton de Vaud, swissuniversities, accréditation)",
   "pourquoi": "Pied de page, pages institutionnelles",
   "statut": "À fournir",
   "qui": "UCOM",
   "quand": "P4 – mars 2027",
   "statutSuivi": "À fournir",
   "commentaire": "À fournir"
  },
  {
   "id": "A3",
   "categorie": "Marque",
   "besoin": "Règles d'usage du logo à l'écran (taille minimale en px, position dans l'en-tête)",
   "pourquoi": "La charte ne donne que des mm",
   "statut": "À définir ensemble",
   "qui": "UCOM + UI",
   "quand": "v0.1",
   "statutSuivi": "À fournir",
   "commentaire": "À définir ensemble"
  },
  {
   "id": "A4",
   "categorie": "Marque",
   "besoin": "Validation du principe d'un « avenant digital » à la charte",
   "pourquoi": "Les règles digitales doivent avoir la même autorité que la charte",
   "statut": "Décision à prendre",
   "qui": "UCOM",
   "quand": "G0",
   "statutSuivi": "À fournir",
   "commentaire": "Décision à prendre"
  },
  {
   "id": "B1",
   "categorie": "Typographie",
   "besoin": "Licence **web** de Chalet (contrat ou facture) et fichiers WOFF2",
   "pourquoi": "La charte rappelle qu'on ne peut pas céder les polices ; l'usage web exige une licence spécifique",
   "statut": "À vérifier (Q-004)",
   "qui": "UCOM",
   "quand": "Mars 2027",
   "statutSuivi": "À fournir",
   "commentaire": "À vérifier (Q-004)"
  },
  {
   "id": "B2",
   "categorie": "Typographie",
   "besoin": "Graisses disponibles (Book, Medium, Bold…)",
   "pourquoi": "Hiérarchie typographique",
   "statut": "À fournir",
   "qui": "UCOM",
   "quand": "Mars 2027",
   "statutSuivi": "À fournir",
   "commentaire": "À fournir"
  },
  {
   "id": "B3",
   "categorie": "Typographie",
   "besoin": "Confirmation de l'usage de Spectral (licence SIL Open Font License) en auto-hébergement",
   "pourquoi": "Pas de chargement depuis un service tiers (protection des données)",
   "statut": "À confirmer",
   "qui": "UCOM + DSI",
   "quand": "Mars 2027",
   "statutSuivi": "À fournir",
   "commentaire": "À confirmer"
  },
  {
   "id": "B4",
   "categorie": "Typographie",
   "besoin": "Police de repli validée si Chalet n'est pas licenciable pour le web",
   "pourquoi": "Éviter un blocage",
   "statut": "À décider si B1 négatif",
   "qui": "UCOM",
   "quand": "Avril 2027",
   "statutSuivi": "À fournir",
   "commentaire": "À décider si B1 négatif"
  },
  {
   "id": "C1",
   "categorie": "Imagerie",
   "besoin": "Banque d'images existante et droits d'usage web",
   "pourquoi": "Direction photographique, cartes Bento",
   "statut": "À fournir",
   "qui": "UCOM",
   "quand": "Mai 2027",
   "statutSuivi": "À fournir",
   "commentaire": "À fournir"
  },
  {
   "id": "C2",
   "categorie": "Imagerie",
   "besoin": "20 à 30 images de référence « validées marque »",
   "pourquoi": "Définir le style photographique",
   "statut": "À fournir",
   "qui": "UCOM",
   "quand": "Mai 2027",
   "statutSuivi": "À fournir",
   "commentaire": "À fournir"
  },
  {
   "id": "C3",
   "categorie": "Imagerie",
   "besoin": "Illustrations existantes (ex. visuels d'affiches) et leurs sources",
   "pourquoi": "Cohérence print / digital",
   "statut": "À fournir",
   "qui": "UCOM",
   "quand": "Mai 2027",
   "statutSuivi": "À fournir",
   "commentaire": "À fournir"
  },
  {
   "id": "D1",
   "categorie": "Supports digitaux existants",
   "besoin": "Fichiers sources des modèles réseaux sociaux 1080×1920 et présentations 1280×720",
   "pourquoi": "Seules règles digitales existantes (Bento)",
   "statut": "À fournir",
   "qui": "UCOM",
   "quand": "Février 2027",
   "statutSuivi": "À fournir",
   "commentaire": "À fournir"
  },
  {
   "id": "D2",
   "categorie": "Supports digitaux existants",
   "besoin": "Gabarits de newsletters Mailchimp et signatures e-mail",
   "pourquoi": "Cohérence de l'écosystème (hors périmètre ou non : Q-012)",
   "statut": "À fournir",
   "qui": "UCOM",
   "quand": "Février 2027",
   "statutSuivi": "À fournir",
   "commentaire": "À fournir"
  },
  {
   "id": "D3",
   "categorie": "Supports digitaux existants",
   "besoin": "Captures du site actuel et des portails (inventaire d'interface P1)",
   "pourquoi": "Recenser les composants à remplacer",
   "statut": "À produire en P1",
   "qui": "UI",
   "quand": "Mars 2027",
   "statutSuivi": "À fournir",
   "commentaire": "À produire en P1"
  },
  {
   "id": "E1",
   "categorie": "Contenus & usages",
   "besoin": "Inventaire des types de pages et de contenus (P1)",
   "pourquoi": "Décider quels composants créer",
   "statut": "À produire",
   "qui": "CONT",
   "quand": "Mars 2027",
   "statutSuivi": "À fournir",
   "commentaire": "À produire"
  },
  {
   "id": "E2",
   "categorie": "Contenus & usages",
   "besoin": "Modèle de contenu (P3)",
   "pourquoi": "Dimensionner les composants sur des contenus réels",
   "statut": "À produire",
   "qui": "CONT",
   "quand": "Sept. 2027",
   "statutSuivi": "À fournir",
   "commentaire": "À produire"
  },
  {
   "id": "E3",
   "categorie": "Contenus & usages",
   "besoin": "Données d'appareils et de navigateurs (GA4)",
   "pourquoi": "Points de rupture, priorités mobile",
   "statut": "À extraire",
   "qui": "UCOM",
   "quand": "Février 2027",
   "statutSuivi": "À fournir",
   "commentaire": "À extraire"
  },
  {
   "id": "E4",
   "categorie": "Contenus & usages",
   "besoin": "Exemples de contenus réels extrêmes (titres longs, tableaux, noms composés)",
   "pourquoi": "Tester la robustesse des composants",
   "statut": "À collecter",
   "qui": "CONT",
   "quand": "Juin 2027",
   "statutSuivi": "À fournir",
   "commentaire": "À collecter"
  },
  {
   "id": "F1",
   "categorie": "Technique (Jahia 8)",
   "besoin": "Mode de templating retenu : modules Java/JSP ou modules JavaScript (JSX, rendu serveur, disponibles depuis Jahia 8.2)",
   "pourquoi": "Détermine la forme du code des composants",
   "statut": "À instruire (Q-002)",
   "qui": "ARCH",
   "quand": "Avril 2027",
   "statutSuivi": "À fournir",
   "commentaire": "À instruire (Q-002)"
  },
  {
   "id": "F2",
   "categorie": "Technique (Jahia 8)",
   "besoin": "Version exacte de Jahia 8 après migration",
   "pourquoi": "Fonctionnalités disponibles",
   "statut": "À fournir après fin octobre 2026",
   "qui": "DSI",
   "quand": "Nov. 2026",
   "statutSuivi": "À fournir",
   "commentaire": "À fournir après fin octobre 2026"
  },
  {
   "id": "F3",
   "categorie": "Technique (Jahia 8)",
   "besoin": "Frameworks CSS / JS existants dans les gabarits actuels",
   "pourquoi": "Coexistence pendant la transition",
   "statut": "À fournir",
   "qui": "DSI",
   "quand": "P1",
   "statutSuivi": "À fournir",
   "commentaire": "À fournir"
  },
  {
   "id": "F4",
   "categorie": "Technique (Jahia 8)",
   "besoin": "Navigateurs et lecteurs d'écran à supporter",
   "pourquoi": "Périmètre de tests",
   "statut": "À décider",
   "qui": "DSI + A11Y",
   "quand": "P6",
   "statutSuivi": "À fournir",
   "commentaire": "À décider"
  },
  {
   "id": "F5",
   "categorie": "Technique (Jahia 8)",
   "besoin": "Dépôt Git interne et chaîne de build",
   "pourquoi": "Versionner tokens et composants",
   "statut": "À fournir",
   "qui": "DSI",
   "quand": "Juin 2027",
   "statutSuivi": "À fournir",
   "commentaire": "À fournir"
  },
  {
   "id": "G1",
   "categorie": "Outils & gouvernance",
   "besoin": "Outil de conception autorisé (Figma, Penpot auto-hébergé…)",
   "pourquoi": "Bibliothèque de composants partagée",
   "statut": "À décider (Q-007)",
   "qui": "DSI",
   "quand": "G0",
   "statutSuivi": "À fournir",
   "commentaire": "À décider (Q-007)"
  },
  {
   "id": "G2",
   "categorie": "Outils & gouvernance",
   "besoin": "Qui valide le DS (U-Com seule ou Copil)",
   "pourquoi": "Circuit de validation des versions",
   "statut": "À décider (Q-003)",
   "qui": "Copil",
   "quand": "G0",
   "statutSuivi": "À fournir",
   "commentaire": "À décider (Q-003)"
  },
  {
   "id": "G3",
   "categorie": "Outils & gouvernance",
   "besoin": "Standard d'accessibilité visé et qui l'atteste",
   "pourquoi": "Critère de sortie G4",
   "statut": "À décider (Q-011)",
   "qui": "A11Y",
   "quand": "G0",
   "statutSuivi": "À fournir",
   "commentaire": "À décider (Q-011)"
  },
  {
   "id": "G4",
   "categorie": "Outils & gouvernance",
   "besoin": "Panel d'utilisateurs disponible pour tester",
   "pourquoi": "Tests des composants complexes",
   "statut": "À organiser",
   "qui": "UX",
   "quand": "Été 2027",
   "statutSuivi": "À fournir",
   "commentaire": "À organiser"
  }
 ],
 "journal": [
  {
   "ts": "2026-10-05T15:00:00",
   "user": "Claude (Cowork) pour U-Com",
   "type": "Projet",
   "id": "",
   "action": "Plateforme v0.2 initialisée : réalisation interne, budget CHF 10'000, Jahia 8, horizon 2–3 ans",
   "resume": ""
  }
 ],
 "contrastes": [
  {
   "nom": "Bleu",
   "hex": "#009cde",
   "surBlanc": 3.08,
   "surNoir": 6.81
  },
  {
   "nom": "Bleu 50 %",
   "hex": "#94cef2",
   "surBlanc": 1.7,
   "surNoir": 12.37
  },
  {
   "nom": "Bleu 25 %",
   "hex": "#cee7fa",
   "surBlanc": 1.28,
   "surNoir": 16.44
  },
  {
   "nom": "Bleu sombre",
   "hex": "#00354c",
   "surBlanc": 13.01,
   "surNoir": 1.61
  },
  {
   "nom": "Bleu sombre 50 %",
   "hex": "#6891a8",
   "surBlanc": 3.38,
   "surNoir": 6.2
  },
  {
   "nom": "Bleu sombre 25 %",
   "hex": "#b1c6d5",
   "surBlanc": 1.76,
   "surNoir": 11.91
  },
  {
   "nom": "Vert",
   "hex": "#82c8ac",
   "surBlanc": 1.94,
   "surNoir": 10.81
  },
  {
   "nom": "Mauve",
   "hex": "#dad2fa",
   "surBlanc": 1.44,
   "surNoir": 14.58
  },
  {
   "nom": "Abricot",
   "hex": "#f9eacf",
   "surBlanc": 1.19,
   "surNoir": 17.7
  },
  {
   "nom": "Jaune",
   "hex": "#f5f0a4",
   "surBlanc": 1.17,
   "surNoir": 17.88
  },
  {
   "nom": "Corail",
   "hex": "#ef9286",
   "surBlanc": 2.3,
   "surNoir": 9.13
  }
 ]
};
