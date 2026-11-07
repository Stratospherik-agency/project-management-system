/* Registre du cahier des charges — première alimentation (reprise de l'existant au 07.11.2026)
 * Importée une seule fois par la plateforme (cdcImportInitial) si le registre est vide.
 * Sources : plan de projet (DOC-009), programme en quatre étapes (DOC-142), guide du Design System (DOC-024),
 * référentiel des intégrations (DOC-147), plan de communication (DOC-149), décisions D-003 à D-017,
 * questionnements Q-001 à Q-031, risques R-001 à R-036, systèmes S-01 à S-18, README des phases P6 à P12,
 * échange du 07.11.2026 sur la navigation agentique.
 * Tous les points sont au statut « Idée » : priorité et qualification à confirmer en revue par les co-chefs.
 */
(function () {
  "use strict";
  const DEST = { B: "CDC besoins CMS (P6)", D: "CDC développement (P7)", BD: "P6 et P7", DS: "Cahier des charges design (DOC-143)", X: "À déterminer" };
  const T = (id, titre, ordre, parent, sommaire, description) => ({ id, titre, ordre, parent: parent || "", sommaire: sommaire || "", description: description || "" });
  const themes = [
    T("TH-01", "Contexte, objectifs, publics et périmètre", 1, "", "§1", "Raison d'être, objectifs mesurables, publics, univers couverts, stratégie digitale HEP Vaud."),
    T("TH-02", "Organisation du projet et gouvernance côté HEP Vaud", 2, "", "§2", "Copil, co-chefs, product owners, groupe de travail Design, interlocuteurs de l'agence, outils de pilotage."),
    T("TH-03", "CMS, back-office et contribution", 3, "", "§3", "CMS retenu à l'issue de l'étude (G6), expérience des contributeurs, workflows, multi-sites."),
    T("TH-04", "Hébergement, environnements et exploitation", 4, "", "§3", "Hébergement, environnements, intégration continue, exploitation, surveillance."),
    T("TH-05", "Architecture de l'information et navigation", 5, "", "§4 / §5", "Arborescence cible des quatre univers, taxonomie, navigation."),
    T("TH-06", "Contenus et gouvernance éditoriale", 6, "", "§4 / §8", "Modèle de contenu, charte éditoriale, gouvernance et qualité des contenus."),
    T("TH-07", "Design System et dossier de design", 7, "", "§5", "Design System indépendant du CMS, tokens, composants, dossier de design annexé au cahier des charges."),
    T("TH-08", "Fonctionnalités du site public", 8, "", "§4", "Fonctionnalités et services du site public."),
    T("TH-09", "Portails authentifiés (MyEtu, MyCollab, MyParFo)", 9, "", "§4", "Espaces authentifiés et personnalisés intégrés au site."),
    T("TH-10", "Application mobile / PWA", 10, "", "§4", "Application mobile ou PWA selon la décision D-003, notifications."),
    T("TH-11", "Intégrations et API", 11, "", "§7", "Services connectés, flux, spécification par flux, modes dégradés."),
    T("TH-12", "Authentification et SSO", 12, "", "§7", "Active Directory, publics externes, authentification unique."),
    T("TH-13", "Accessibilité", 13, "", "§6", "Standard retenu, preuve de conformité, accessibilité de la contribution."),
    T("TH-14", "Performance, compatibilité navigateurs et appareils", 14, "", "§6", "Performance perçue et mesurée, matrice de compatibilité, mobile."),
    T("TH-15", "SEO, GEO et navigation agentique", 15, "", "§6", "Référencement naturel, moteurs génératifs (GEO), sites utilisables par des agents d'IA."),
    T("TH-16", "Mesure d'audience, marquage et consentement", 16, "", "§6 / §7", "GA4, Google Tag Manager, pixels publicitaires, outil de gestion du consentement (CMP)."),
    T("TH-17", "Protection des données et sécurité", 17, "", "§6", "nLPD, sous-traitants, portails, tests de sécurité."),
    T("TH-18", "Intelligence artificielle", 18, "", "§4 / §7", "Cas d'usage IA retenus (D-016), souveraineté, gouvernance."),
    T("TH-19", "Migration des contenus et redirections", 19, "", "§8", "Répartition agence / HEP Vaud, matrice de migration, redirections."),
    T("TH-20", "Méthode de réalisation et pilotage de l'agence", 20, "", "§9", "Itérations, démonstrations, revues de conformité, gestion des changements."),
    T("TH-21", "Recette et réception", 21, "", "§10", "Critères d'acceptation, anomalies, levée des réserves."),
    T("TH-22", "Lancement, bascule et conduite du changement", 22, "", "§9 / §14", "Bascule, retour arrière, hypercare, communication de lancement."),
    T("TH-23", "Formation, documentation et transfert de compétences", 23, "", "§11", "Formation des contributeurs, documentation technique et utilisateur."),
    T("TH-24", "Maintenance, garantie et niveaux de service", 24, "", "§12", "Maintenance après mise en ligne, garantie, SLA, gouvernance de run."),
    T("TH-25", "Propriété intellectuelle, code source et réversibilité", 25, "", "§13", "Propriété du code et des livrables, licences, réversibilité."),
    T("TH-26", "Planning, livrables, budget et conditions de paiement", 26, "", "§14", "Planning cible, jalons, budget du développement, paiement."),
    T("TH-27", "Procédure d'achat, offre attendue et critères d'adjudication", 27, "", "§15", "Marché public, contenu de l'offre, critères et grille d'évaluation."),
    T("TH-28", "Périmètre : univers, sites satellites, langues", 1, "TH-01"),
    T("TH-29", "Publics et indicateurs de succès", 2, "TH-01"),
    T("TH-30", "Conformité au dossier de design et écarts tolérés", 1, "TH-07"),
    T("TH-31", "Typographies, imagerie et licences", 2, "TH-07"),
    T("TH-32", "Recherche", 1, "TH-08"),
    T("TH-33", "Formulaires et inscriptions", 2, "TH-08"),
    T("TH-34", "Multilingue", 3, "TH-08"),
    T("TH-35", "Données institutionnelles (annuaire, publications, formations, menus)", 1, "TH-11"),
    T("TH-36", "Services tiers (newsletters, vidéo, photothèque, agenda…)", 2, "TH-11"),
    T("TH-37", "Navigation agentique", 1, "TH-15"),
  ];
  /* P(thème, intitulé, idée, phase, destination, source, liens, univers) */
  const P = (theme, titre, idee, phase, dest, source, liens, univers) => ({ theme, titre, idee, phase, destination: DEST[dest] || DEST.X, source, liens: liens || "", univers: univers || "Transversal" });
  const points = [
    /* TH-01 */
    P("TH-01", "Intégrer la stratégie digitale HEP Vaud comme cadre du périmètre", "La stratégie digitale (en cours de rédaction) fixe le périmètre de ce que le site et le CMS devront faire. Le cahier des charges doit s'y référer explicitement ; à défaut, documenter les hypothèses validées par le Copil.", "P6", "BD", "DOC-142 §3 ; README P6 (G6)", "Q-014, R-024, T052"),
    P("TH-01", "Feuille de route fonctionnelle priorisée comme base des exigences", "La feuille de route fonctionnelle (MoSCoW) issue de P2 sert de base aux exigences fonctionnelles du CMS (P6) puis du développement (P7).", "P2", "BD", "Plan de projet, P2 ; README P6 (entrées)", "T053"),
    /* TH-28 périmètre */
    P("TH-28", "Univers couverts : hepl.ch, MyEtu, MyCollab, MyParFo", "≈4500 pages réparties entre le site public et les trois portails. Les portails restent intégrés au site, quel que soit le CMS retenu.", "P1", "BD", "DOC-147 §1 ; plan de projet §1", "Q-005, S-01, S-02, S-03, S-04, R-003"),
    P("TH-28", "Intégration des sites satellites WordPress dans le site principal", "Des sites satellites WordPress liés et hébergés par la HEP Vaud seraient intégrés au site principal (objectif de la stratégie digitale). Inventaire, volume et complexité à établir. Incohérence à lever : le plan de communication indique que les mini-sites sont exclus du budget et de l'étude de design à ce stade.", "P1", "BD", "Réponse à Q-012 ; DC-001 ; DOC-149", "Q-012, DC-001, R-021, S-08"),
    /* TH-29 publics / KPI */
    P("TH-29", "Publics servis et parcours prioritaires", "Futur·es étudiant·es, étudiant·es (usage mobile marqué), collaborateur·trices, praticien·nes formateur·trices (Prafo), publics externes. Personas et parcours issus de P2 à annexer.", "P2", "BD", "DOC-147 §2 ; plan de projet P2", ""),
    P("TH-29", "Indicateurs de succès et baseline", "Réussite des tâches clés ≥ 80 % · SUS ≥ 75 · conformité accessibilité · Core Web Vitals « bons » · volume de pages réduit · clics organiques ≥ baseline à M+3 · tickets « je ne trouve pas » −30 %. À baseliner et à transformer en objectifs contractuels mesurables.", "P0", "D", "Plan de projet §9", "T083"),
    /* TH-02 organisation */
    P("TH-02", "Gouvernance et interlocuteurs côté HEP Vaud", "Décrire le Copil, les co-chefs (U-Com, U-Info), les product owners par univers, le groupe de travail Design et un interlocuteur unique par sujet pour l'agence.", "P7", "D", "DOC-142 §4 (sommaire §2)", "D-008"),
    P("TH-02", "Outils de pilotage et traçabilité partagés avec l'agence", "Préciser les outils de suivi (plateforme de pilotage, registre des décisions, des questions et des changements) et ce que l'agence doit y alimenter.", "P7", "D", "DOC-142 §4 (sommaire §2)", "D-001"),
    P("TH-02", "Disponibilités et suppléance de l'équipe HEP Vaud", "Capacité limitée (U-Com ≈ 40 %) et absences des co-chefs : prévoir les délais de réponse et de validation côté HEP Vaud dans le planning contractuel.", "P7", "D", "R-001, R-035, DOC-148", "Q-017, Q-018, R-001, R-035"),
    /* TH-03 CMS */
    P("TH-03", "CMS choisi par étude comparative ouverte", "Le CMS est choisi en P6 (G6) selon une grille pondérée fixée avant l'évaluation, avec preuves de concept. Jahia est la solution actuelle, évaluée au même titre que les autres (proposition D-015).", "P6", "B", "DOC-142 §3 ; D-013 ; D-015", "D-013, D-015, R-034, T054, T056"),
    P("TH-03", "Gestion multi-sites (quatre univers) et multilingue dans l'édition", "Le CMS doit gérer le site public et les trois portails, ainsi que plusieurs langues, dans l'interface d'édition.", "P6", "BD", "Grille d'évaluation, DOC-142 §3", "D-006, T053", "Back-office (contribution)"),
    P("TH-03", "Expérience des contributeurs : édition, workflows, rôles et droits", "Édition, workflows de validation, rôles et droits par unité contributrice ; évalués en P6 puis spécifiés en P7.", "P6", "BD", "Grille d'évaluation, DOC-142 §3 ; T053", "R-014", "Back-office (contribution)"),
    P("TH-03", "Accessibilité de l'interface d'édition", "Le standard d'accessibilité retenu s'applique au front et à l'interface d'édition.", "P6", "BD", "Grille d'évaluation, DOC-142 §3", "Q-011", "Back-office (contribution)"),
    P("TH-03", "Mise en œuvre du Design System sans contournement", "Preuve de concept avec le Design System pour la liste courte ; chaque composant correspond à un module avec des champs éditables documentés.", "P6", "BD", "DOC-142 §3 ; guide DS (fiche composant)", "R-005, T056"),
    P("TH-03", "Interopérabilité et découplage possible", "API, découplage possible (approche traditionnelle, découplée ou hybride), intégration des services connectés.", "P6", "B", "Grille d'évaluation, DOC-142 §3", "T059"),
    P("TH-03", "Pérennité, licence et risque de dépendance", "Feuille de route de l'éditeur, communauté, licence, risque de verrouillage par un fournisseur.", "P6", "B", "Grille d'évaluation ; DOC-147 §6", "R-034"),
    P("TH-03", "Coût complet sur 5 ans (TCO)", "Licences, hébergement, développement, connecteurs, maintenance, formation, coût et risque de migration.", "P6", "B", "DOC-142 §3 ; T057", "T057, R-023"),
    P("TH-03", "Mode de templating si Jahia 8 est retenu", "Modules Java/JSP ou modules JavaScript (Jahia 8.2+) : à trancher pendant l'étude, uniquement si Jahia est retenu.", "P6", "B", "Q-002", "Q-002"),
    /* TH-04 hébergement */
    P("TH-04", "Hébergement : interne ou externe en Suisse", "Hébergement interne ou externe (en Suisse) à décider en P6 selon sécurité, conformité et environnement interne.", "P6", "BD", "Grille d'évaluation ; DOC-147 §6", "R-017"),
    P("TH-04", "Environnements, gestion de versions et intégration continue", "Environnements de développement, de test (préproduction) et de production ; dépôt Git ; intégration continue avec tests automatisés.", "P7", "D", "Plan de projet (P6 ancienne version) ; README P8 (T097)", "T097"),
    P("TH-04", "Adéquation à l'environnement interne (U-Info)", "Compatibilité avec l'infrastructure, les compétences et l'exploitation internes.", "P6", "B", "Grille d'évaluation, DOC-142 §3", "T055"),
    P("TH-04", "Surveillance des flux et plan de repli", "Surveiller les flux, GA4 et les conversions après la mise en ligne ; plan de repli en cas de panne d'une source.", "P11", "D", "DOC-147 §6 (P11)", "R-029"),
    /* TH-05 AI */
    P("TH-05", "Organisation de l'information par publics et tâches", "Objectif du projet : l'information est organisée par publics et par tâches, et non par structure interne.", "P3", "DS", "Plan de projet §3", ""),
    P("TH-05", "Arborescence cible des quatre univers validée par des tests", "Arborescence issue du tri de cartes et validée par des tests d'arborescence ; annexée au dossier de design.", "P3", "D", "Plan de projet P3 ; DOC-142 §2", "DOC-134"),
    P("TH-05", "Taxonomie commune, notamment pour les formations", "Préparer la taxonomie commune avec IS-Academia (formations).", "P3", "BD", "DOC-147 §6 (P3)", "S-18, Q-023"),
    P("TH-05", "Réduction du volume de pages", "Réduire le volume de pages (≈4500) : « moins mais mieux ».", "P3", "D", "Plan de projet §3 et §4", "R-003"),
    /* TH-06 contenus */
    P("TH-06", "Modèle de contenu et source de vérité de chaque donnée", "Types de contenus ; distinguer les contenus saisis des contenus issus de sources externes ; désigner la source de vérité de chaque donnée.", "P3", "BD", "DOC-147 §6 (P3) ; plan de projet P3", "Q-021"),
    P("TH-06", "Charte éditoriale web et gouvernance éditoriale durable", "Rôles et responsabilités par unité contributrice, circuit de validation, à refléter dans les rôles et workflows du CMS.", "P3", "BD", "Plan de projet P3", "R-014"),
    P("TH-06", "Contrôle qualité continu des contenus", "Détection des contenus obsolètes, liens cassés et doublons pour maintenir ≈4500 pages (outil intégré, IA ou monitoring).", "P3", "BD", "DOC-147 §5.1 et §5.2", ""),
    /* TH-07 DS */
    P("TH-07", "Design System indépendant du CMS", "Tokens et composants HTML/CSS/JS standard, documentés pour une équipe externe ; critère du gate G4.", "P4", "D", "DOC-142 §2 ; D-012", "D-002, D-012"),
    P("TH-07", "Tokens au format W3C DTCG et aucune valeur codée en dur", "Tokens en trois niveaux (primitifs, sémantiques, composants), transformés en variables CSS ; l'agence ne code aucune valeur en dur.", "P4", "D", "DOC-024 §3", ""),
    P("TH-07", "Dossier de design annexé au cahier des charges", "Design System v1.0, avenant digital, arborescence, modèle de contenu, gabarits, maquettes, prototype, tests, spécifications par gabarit et composant, exigences d'accessibilité et de performance.", "P5", "D", "DOC-142 §2", "DOC-134"),
    P("TH-07", "Versionnage et gouvernance du Design System", "Versionnage sémantique, release notes, dépréciation ; l'agence livre et maintient la librairie front selon ces règles.", "P4", "D", "DOC-024 §5", ""),
    P("TH-07", "Avenant digital à la charte graphique", "Les règles digitales ont la même autorité que la charte ; elles s'imposent à l'agence.", "P4", "D", "DOC-024 §2 (A4)", "R-019"),
    P("TH-07", "Règles de couleur et de contraste connues", "Le bleu #009cde (3,08:1 sur blanc) n'est jamais utilisé pour du texte courant ; le bleu sombre #00354c porte texte, liens et actions.", "P4", "D", "DOC-024 §3", "R-010"),
    P("TH-07", "Cohérence des gabarits de newsletters et des signatures", "Les gabarits Mailchimp et les signatures e-mail suivent-ils le Design System ? Périmètre à confirmer.", "P4", "X", "DOC-024 §2 (D2) ; Q-012", "Q-012"),
    P("TH-07", "Favicon, icône d'application et taille minimale du logo à l'écran", "Éléments absents de la charte print, à définir dans le Design System.", "P4", "DS", "DOC-024 §1 et §2 (A3)", ""),
    /* TH-30 conformité */
    P("TH-30", "Règles de conformité au dossier de design et écarts tolérés", "Définir ce qu'est un écart, qui l'autorise et comment il est tracé ; revues de conformité et revue experte C-09.", "P7", "D", "DOC-142 §4 (sommaire §5)", "R-027, T095"),
    P("TH-30", "Définition de « terminé » d'un composant appliquée à l'agence", "Spécification relue, variantes et états, contrastes, clavier et lecteur d'écran testés, tokens uniquement, code aligné, documentation publiée, revue passée.", "P7", "D", "DOC-024 §3", ""),
    /* TH-31 typo / images */
    P("TH-31", "Licences web des polices et auto-hébergement", "Licence web de Chalet, Spectral (SIL OFL) auto-hébergée ; aucun chargement depuis un service tiers ; police de repli si Chalet n'est pas licenciable.", "P4", "D", "DOC-024 §2 (B1–B4)", "Q-004, R-011"),
    P("TH-31", "Photothèque / DAM et droits d'usage web", "Images conformes à la charte et droits d'usage web ; intégration éventuelle d'une photothèque.", "P4", "X", "DOC-147 §5.2 ; DOC-024 (C1)", "D-016"),
    /* TH-08 */
    P("TH-08", "Agenda et inscriptions aux événements", "En lien avec la stratégie événementielle U-Com (piste à valider).", "P2", "X", "DOC-147 §5.2", "D-016", "Site public"),
    P("TH-08", "Offres d'emploi à jour automatiquement", "Page carrières alimentée par le système RH (piste à valider).", "P2", "X", "DOC-147 §5.2", "D-016", "Site public"),
    P("TH-08", "Catalogue de bibliothèque", "Accès aux ressources documentaires (swisscovery / SLSP, si la HEP y participe) — piste à valider.", "P2", "X", "DOC-147 §5.2", "D-016"),
    /* TH-32 recherche */
    P("TH-32", "Recherche sur le site et les portails", "Trouver une formation, une personne, un règlement ; besoins à tester en P2.", "P2", "BD", "DOC-147 §6 (P2) ; T053", "T100"),
    /* TH-33 formulaires */
    P("TH-33", "Outil de formulaires aligné sur le Design System et accessible", "Jotform ou outil de remplacement : personnalisation visuelle, accessibilité, hébergement des données.", "P4", "BD", "DOC-147 §4 et §6 (P4)", "R-032, S-17, Q-025"),
    P("TH-33", "Recensement des formulaires et points d'inscription existants", "Inventaire des formulaires et des points d'inscription aux newsletters en P1.", "P1", "D", "DOC-147 §6 (P1)", "S-17, S-06"),
    P("TH-33", "Inscription aux newsletters avec consentement", "Lien avec les huit newsletters Mailchimp existantes ; consentement et hébergement des données.", "P4", "D", "DOC-147 §4", "S-06, Q-025"),
    /* TH-34 multilingue */
    P("TH-34", "Conçu pour le multilingue, publié en français d'abord", "Architecture, gabarits et Design System conçus pour le multilingue dès le départ ; périmètre et langues des autres versions à définir en P2.", "P2", "BD", "D-006 ; Q-010", "D-006, Q-010"),
    /* TH-09 portails */
    P("TH-09", "Espaces authentifiés et personnalisés intégrés au site", "Le CMS doit gérer des espaces authentifiés et personnalisés en plus du site public.", "P6", "BD", "DOC-147 §1", "Q-005, S-02, S-03, S-04", "MyEtu"),
    P("TH-09", "États connecté / non connecté des composants", "Prévoir les états connecté et non connecté dans le Design System et les gabarits.", "P4", "D", "DOC-147 §6 (P4)", ""),
    P("TH-09", "Dette technique des portails existants", "Identifier ce qui ne doit pas être repris tel quel lors de la reconstruction des portails.", "P1", "D", "R-020", "R-020"),
    P("TH-09", "Services pratiques : réservation de salles, plans du campus", "Pistes à valider pour les portails.", "P2", "X", "DOC-147 §5.2", "D-016"),
    P("TH-09", "Passerelles vers le LMS depuis MyEtu", "Moodle ou autre LMS, si utilisé (piste à valider).", "P2", "X", "DOC-147 §5.2", "D-016", "MyEtu"),
    P("TH-09", "Zones d'information et règles de diffusion sur les portails", "Les portails sont des canaux internes de communication : règles de diffusion à préciser.", "P0", "X", "DOC-149 ; Q-030", "Q-030"),
    /* TH-10 PWA */
    P("TH-10", "Application mobile : PWA ou native", "Décision à instruire en P2 (recherche et coûts), réalisation selon la décision.", "P2", "BD", "D-003 ; README P8 (T101)", "D-003, T101", "Application / PWA"),
    /* TH-11 intégrations */
    P("TH-11", "Toutes les intégrations par API", "Principe retenu pour l'ensemble des intégrations.", "P6", "BD", "DOC-147 §1", ""),
    P("TH-11", "Fiche de spécification par flux", "Endpoint, format, authentification, fréquence, propriétaire, documentation, conditions contractuelles, responsabilités (U-Info, Equinox, prestataire Eldora, agence, U-Com).", "P6", "BD", "DOC-147 §6 (P6, P7)", "Q-020, R-030, T059, R-006"),
    P("TH-11", "Compatibilité avec l'ESB", "Consommation d'API et compatibilité avec le bus de services existant.", "P6", "B", "DOC-147 §6 (P6)", "S-09"),
    P("TH-11", "Modes dégradés, états de chargement et données vides", "Comportement si une source est indisponible ; états de chargement et de données vides.", "P4", "D", "DOC-147 §6 (P4, P7)", "R-029"),
    P("TH-11", "Critères d'acceptation par flux", "Chaque flux est testé en recette avec ses critères d'acceptation.", "P7", "D", "DOC-147 §6 (P7, P10)", ""),
    P("TH-11", "Connecteurs API documentés livrés par l'agence", "Documentation des connecteurs comme livrable contractuel.", "P8", "D", "README P8 (livrables)", ""),
    P("TH-11", "Annexe « données affichées / composants / états » par intégration", "À inclure dans le dossier de design.", "P5", "D", "DOC-147 §6 (dossier de design)", "DOC-134"),
    /* TH-35 */
    P("TH-35", "Annuaire : Allegro et IAM via l'ESB", "Source de vérité de l'annuaire et des identités à clarifier.", "P1", "BD", "DOC-147 §2", "Q-021, S-10, S-11"),
    P("TH-35", "Publications : ORFEE via l'ESB", "Affichage des publications ; redirections des pages publications à vérifier.", "P1", "D", "DOC-147 §2", "S-12"),
    P("TH-35", "Menus du restaurant : Eldora", "Dépendance à un prestataire : contrat, documentation de l'API, pérennité.", "P1", "D", "DOC-147 §2", "Q-022, R-029, S-13"),
    P("TH-35", "Offre de formation : IS-Academia (Equinox)", "Intégration partielle aujourd'hui (formation continue) ; périmètre cible, API et coûts à définir.", "P2", "BD", "DOC-147 §4", "Q-023, S-18, R-029"),
    P("TH-35", "Composants des données intégrées", "Fiche personne, résultats d'annuaire, publication, carte et fiche formation, menu du jour.", "P4", "D", "DOC-147 §6 (P4)", ""),
    /* TH-36 */
    P("TH-36", "Plateforme vidéo", "SWITCHtube ou autre plateforme pour les vidéos institutionnelles et pédagogiques (piste à valider).", "P2", "X", "DOC-147 §5.2", "D-016"),
    P("TH-36", "Revue des contrats tiers et feuille de route des intégrations", "En run : feuille de route des nouvelles intégrations et revue des contrats tiers.", "P12", "D", "DOC-147 §6 (P12)", ""),
    /* TH-12 auth */
    P("TH-12", "Authentification Active Directory (SAML / OIDC)", "Accès des contributeurs et des portails par l'Active Directory.", "P6", "BD", "DOC-147 §2 et §6", "S-14"),
    P("TH-12", "Authentification des publics externes (Prafo)", "Publics sans compte AD : SWITCH edu-ID ou autre.", "P1", "BD", "DOC-147 §5.2 ; Q-027", "Q-027"),
    P("TH-12", "Architecture des portails et SSO", "Annexe technique du cahier des charges.", "P7", "D", "README P7 (T061)", "T061, DOC-136"),
    /* TH-13 a11y */
    P("TH-13", "Standard d'accessibilité retenu", "WCAG 2.1 AA (base de l'eCH-0059) ou WCAG 2.2 AA : à fixer avant P4.", "P1", "BD", "Q-011 ; Q-019 ; DOC-142 §7", "Q-011, Q-019"),
    P("TH-13", "Attestation de conformité et déclaration d'accessibilité", "Audit indépendant ciblé et déclaration d'accessibilité avant la mise en ligne.", "P10", "D", "Q-013 ; README P10 (G8)", "Q-013, T073"),
    P("TH-13", "Tests automatisés d'accessibilité et de régression visuelle en CI", "Exigés pendant la réalisation.", "P8", "D", "README P8 (vérifications)", ""),
    /* TH-14 perf */
    P("TH-14", "Core Web Vitals « bons » et tests de charge", "Critère de recette G8 ; tests de performance et de charge.", "P10", "D", "README P10 (G8, T075)", "T075"),
    P("TH-14", "Navigateurs, appareils et lecteurs d'écran à supporter", "Matrice de compatibilité à décider.", "P6", "BD", "DOC-024 §2 (F4)", ""),
    P("TH-14", "Expérience mobile de premier rang", "Points de rupture et priorités issus des données d'appareils GA4.", "P4", "D", "Plan de projet §3 ; DOC-024 (E3)", ""),
    P("TH-14", "Impact des pixels publicitaires sur la performance", "À mesurer et encadrer.", "P1", "D", "DOC-147 §3", "S-16"),
    /* TH-15 SEO / GEO */
    P("TH-15", "Préserver le référencement lors de la migration", "Redirections, comparaison avant / après des pages à fort trafic, clics organiques ≥ baseline à M+3.", "P9", "D", "R-013 ; plan de projet §9 ; README P9", "R-013"),
    P("TH-15", "Audit SEO de l'existant et revue SEO de l'arborescence", "Audit SEO technique et sémantique en P1 ; revue SEO de l'arborescence en P3.", "P1", "D", "Plan de projet P1 et P3", ""),
    P("TH-15", "Optimisation pour les moteurs génératifs (GEO)", "Contenus factuels explicites et à jour ; données structurées schema.org (formations, personnes, événements, organisation, FAQ) ; contenu rendu côté serveur ; sitemap XML ; URL claires et pérennes.", "P3", "BD", "Échange du 07.11.2026", ""),
    /* TH-37 navigation agentique */
    P("TH-37", "Site optimisé pour la navigation agentique", "HTML sémantique, nom programmatique pour chaque élément interactif, libellés associés aux champs, mise en page stable (CLS), aucun élément fantôme, cibles visibles.", "P4", "BD", "Échange du 07.11.2026 (web.dev, Chrome for Developers)", ""),
    P("TH-37", "Compatibilité WebMCP (exigence évolutive)", "Norme proposée par Google, en développement : à réévaluer en P7 selon sa maturité.", "P7", "D", "Échange du 07.11.2026", ""),
    P("TH-37", "Recette : audit Lighthouse « navigation agentique » et tests de parcours par agent", "Parcours à tester : trouver une formation et ses conditions, s'inscrire à une séance d'information, trouver un contact, consulter le menu.", "P10", "D", "Échange du 07.11.2026", ""),
    P("TH-37", "Bandeau de consentement et formulaires utilisables par les agents", "Le bandeau de consentement ne doit pas bloquer les agents ; éviter les formulaires en iframe difficiles à lire et à remplir.", "P4", "D", "Échange du 07.11.2026", "S-17"),
    /* TH-16 mesure */
    P("TH-16", "Outil de gestion du consentement (CMP)", "Prioritaire : consentement préalable (nLPD, RGPD), aucune balise avant accord, bandeau et centre de préférences comme composants du Design System.", "P4", "D", "DOC-147 §5.2 et §6", "R-031, S-16, Q-024"),
    P("TH-16", "Plan de marquage GA4 / GTM refondu", "Événements et conversions alignés sur la nouvelle arborescence ; validé en recette.", "P3", "D", "DOC-147 §6 (P3, P10)", "S-05, S-15"),
    P("TH-16", "Inventaire, nettoyage et gouvernance du conteneur GTM", "Balises actives, déclencheurs, qui publie ; reprise sur le futur site.", "P1", "D", "DOC-147 §3 et §6", "Q-024, S-15"),
    P("TH-16", "Continuité des statistiques et des conversions à la migration", "GA4 et conversions publicitaires sans rupture ; état des lieux statistique en P1 comme base de comparaison.", "P9", "D", "DOC-147 §6 (P1, P9)", "S-05"),
    /* TH-17 données / sécurité */
    P("TH-17", "Conformité nLPD des outils tiers et contrats de sous-traitance", "Google, Meta, TikTok, Jotform, Mailchimp, fournisseurs d'IA : hébergement des données, contrats, validation juridique.", "P7", "D", "DOC-147 §6 (P7)", "Q-025, R-031, R-018"),
    P("TH-17", "Protection des données dans les portails authentifiés", "Exigences et analyse d'impact.", "P7", "D", "R-017 ; README P7 (T061)", "R-017, T061, DOC-136"),
    P("TH-17", "Tests de sécurité avant mise en ligne", "Vulnérabilités critiques et hautes corrigées avant G8.", "P10", "D", "README P10 (T074, G8)", "T074"),
    P("TH-17", "Aucune ressource chargée depuis un tiers sans nécessité", "Exemple : polices auto-hébergées.", "P4", "D", "DOC-024 §2 (B3)", ""),
    /* TH-18 IA */
    P("TH-18", "Périmètre des cas d'usage IA et politique IA HEP Vaud", "Arbitrage en P2 (D-016) ; conformité à la politique IA, si elle existe.", "P2", "BD", "DOC-147 §5.1 ; D-016", "D-016, Q-026"),
    P("TH-18", "Recherche sémantique en langage naturel", "Sur le site et les portails (piste).", "P2", "X", "DOC-147 §5.1", "D-016, R-033"),
    P("TH-18", "Assistant conversationnel avec sources citées", "Orientation des futur·es étudiant·es, FAQ des portails ; relais humain, mention « généré par IA ».", "P2", "X", "DOC-147 §5.1", "D-016, R-033"),
    P("TH-18", "Aide à la contribution dans le CMS", "Langage clair, charte rédactionnelle, résumé, SEO, avec validation humaine.", "P2", "X", "DOC-147 §5.1", "D-016", "Back-office (contribution)"),
    P("TH-18", "Accessibilité assistée", "Textes alternatifs, transcription et sous-titrage des vidéos, avec relecture humaine obligatoire.", "P2", "X", "DOC-147 §5.1", "D-016"),
    P("TH-18", "Traduction assistée", "EN, voire DE, avec relecture et glossaire institutionnel.", "P2", "X", "DOC-147 §5.1", "D-016, D-006"),
    P("TH-18", "Souveraineté des solutions d'IA", "Solutions hébergées en Suisse ou en Europe, ou modèles ouverts (ex. Apertus, services IA d'Infomaniak), à vérifier.", "P2", "BD", "DOC-147 §5.1", "Q-026, R-031"),
    P("TH-18", "Contrôle des réponses de l'IA et gouvernance", "Exactitude vérifiée en recette ; gouvernance de l'IA en run.", "P10", "D", "DOC-147 §6 (P10, P12)", "R-033"),
    /* TH-19 migration */
    P("TH-19", "Répartition de la migration entre l'agence et la HEP Vaud", "Outillage et import par l'agence ; pilotage, réécriture et contrôle par la HEP Vaud : à préciser.", "P7", "D", "DOC-142 §4 et §5", "R-015, R-023"),
    P("TH-19", "Matrice de migration : migrer, réécrire ou supprimer", "Chaque page reçoit un sort ; migration par lots.", "P3", "D", "Plan de projet P3 ; README P9", "T069"),
    P("TH-19", "Redirections 301 contrôlées à 100 %", "Plan complet, contrôle de 100 % des redirections, testées avant la bascule.", "P9", "D", "README P9 et P11 (G9)", "R-013, T067, T070"),
    P("TH-19", "Données externes reconnectées, non migrées", "Vérifier les redirections des pages annuaire, publications et formations.", "P9", "D", "DOC-147 §6 (P9)", ""),
    /* TH-20 méthode */
    P("TH-20", "Itérations, démonstrations et revues de conformité", "Démo à chaque fin d'itération ; revues de conformité au Design System et au cahier des charges ; revue experte C-09.", "P8", "D", "README P8 ; DOC-142 §4", "T102, T095"),
    P("TH-20", "Gestion des changements avec l'agence", "Demandes de changement tracées ; seuils de décision du Copil (délai > 10 jours ouvrés sur un gate, budget > CHF 500, périmètre).", "P7", "D", "Plateforme, vue Changements", ""),
    P("TH-20", "Plan d'assurance qualité et lancement avec l'agence", "Cadrage technique, plan d'assurance qualité, environnements.", "P7", "D", "README P7 et P8 (T066, T097)", "DOC-140, T097"),
    P("TH-20", "Revue de code", "Revue de code pendant la réalisation.", "P8", "D", "Plan de projet (vérifications)", ""),
    /* TH-21 recette */
    P("TH-21", "Critères de recette du gate G8", "Zéro anomalie bloquante ou majeure ouverte ; accessibilité attestée ; vulnérabilités critiques et hautes corrigées ; Core Web Vitals « bons ».", "P7", "D", "README P10 (G8)", "T071"),
    P("TH-21", "Recette par product owner et recette utilisateurs", "Recette signée par chaque product owner ; recette utilisateurs avec un panel.", "P10", "D", "README P10 (T072, T076)", "T072, T076"),
    P("TH-21", "Réception des livrables et levée des réserves", "Procédure de réception et de levée des réserves.", "P8", "D", "README P8 (T103)", "T103"),
    P("TH-21", "Recette des flux, de l'authentification et des formulaires", "Tester chaque flux, l'authentification, les modes dégradés, les formulaires, le plan de marquage, les pixels et le consentement.", "P10", "D", "DOC-147 §6 (P10)", ""),
    /* TH-22 lancement */
    P("TH-22", "Plan de bascule et retour arrière répété", "Répétition de bascule, checklist go-live signée.", "P11", "D", "README P11 (T079, G9)", "T079"),
    P("TH-22", "Mise en ligne hors période de rentrée", "Mise en ligne visée à l'été 2030, en tenant compte du calendrier académique.", "P7", "D", "DOC-142 §1", "R-016"),
    P("TH-22", "Hypercare et suivi des incidents", "Suivi des incidents J+1 à J+15 ; rôle de l'agence pendant l'hypercare.", "P11", "D", "README P11 et P12", "T080, T081"),
    P("TH-22", "Communication de lancement", "Déclinaison du plan de communication du projet pour le lancement.", "P11", "X", "DOC-149 ; D-017 ; T077", "D-017, T077, R-036"),
    /* TH-23 formation */
    P("TH-23", "Formation des contributeurs et kit de formation", "Qui forme (agence ou HEP Vaud) et sur quoi : à préciser.", "P9", "D", "README P9 (T068)", "T068"),
    P("TH-23", "Guides utilisateurs et documentation technique", "Documentation utilisateur et technique ; transfert de compétences à l'U-Info.", "P7", "D", "DOC-142 §4 (sommaire §11) ; README P11", "T078, DOC-127"),
    P("TH-23", "Remplacement du guide des contributeurs", "Le micro-site « Guide Jahia » destiné aux contributeurs devra être remplacé ou adapté au CMS retenu.", "P9", "X", "Réponse à Q-012", "Q-012"),
    /* TH-24 maintenance */
    P("TH-24", "Maintenance, garantie et niveaux de service", "Contenu du contrat de maintenance et SLA après la mise en ligne.", "P7", "D", "DOC-142 §4 (sommaire §12)", ""),
    P("TH-24", "Monitoring qualité et accessibilité en continu", "Outil de suivi continu (type Siteimprove) après la mise en ligne.", "P12", "X", "DOC-147 §5.2", ""),
    P("TH-24", "Gouvernance de run", "Design System, contenus, technique ; backlog d'amélioration continue.", "P12", "D", "README P12 (G10)", "T082"),
    /* TH-25 PI */
    P("TH-25", "Propriété du code, licences et réversibilité", "Propriété du code source et des livrables, licences, réversibilité pour éviter le verrouillage.", "P7", "D", "DOC-142 §4 (sommaire §13)", "R-034"),
    /* TH-26 planning budget */
    P("TH-26", "Planning cible, livrables et conditions de paiement", "Jalons P8 à P11, paiement lié aux livrables.", "P7", "D", "DOC-142 §4 (sommaire §14)", ""),
    P("TH-26", "Budget et porteur budgétaire du développement", "Estimé par le TCO (été 2028), fixé par les offres ; demande budgétaire 2029 à l'automne 2028.", "P7", "D", "DOC-142 §4 ; Q-016", "Q-016, R-026"),
    /* TH-27 achat */
    P("TH-27", "Procédure d'achat applicable", "Marchés publics selon le montant : procédure, service compétent, délais, documents types, à clarifier dès 2027.", "P7", "D", "DOC-142 §4 ; Q-015", "Q-015, R-025, R-018, T062"),
    P("TH-27", "Contenu attendu de l'offre et critères d'adjudication", "Critères et grille d'évaluation publiés ; auditions.", "P7", "D", "DOC-142 §4 (sommaire §15) ; README P7", "DOC-137, T065"),
    P("TH-27", "Écosystème d'agences qualifiées", "Nombre d'agences qualifiées sur le CMS retenu, en particulier en Suisse romande.", "P6", "B", "Grille d'évaluation, DOC-142 §3", ""),
  ];
  const G = (terme, definition, source) => ({ terme, definition, source: source || "", statut: "Proposé" });
  const glossaire = [
    G("Univers", "L'un des quatre ensembles de l'écosystème : site public hepl.ch, MyEtu, MyCollab, MyParFo.", "Plan de projet"),
    G("Portail", "Espace authentifié et personnalisé intégré au site (MyEtu, MyCollab, MyParFo).", "DOC-147 §1"),
    G("Contributeur·trice", "Personne qui saisit ou modifie des contenus dans le back-office du CMS.", ""),
    G("Gabarit", "Type de page défini dans le dossier de design, assemblant des composants du Design System.", "Plan de projet P5"),
    G("Composant", "Élément d'interface réutilisable du Design System, spécifié avec ses variantes, états et règles d'accessibilité.", "DOC-024"),
    G("Design token", "Valeur de design nommée (couleur, espacement, rayon…) au format W3C DTCG, en trois niveaux : primitif, sémantique, composant.", "DOC-024 §3"),
    G("Dossier de design", "Ensemble des livrables de l'étape 1 annexé au cahier des charges de développement.", "DOC-142 §2"),
    G("Mode dégradé", "Comportement d'un composant ou d'une page lorsqu'une source de données est indisponible.", "DOC-147 §6"),
    G("Source de vérité", "Système de référence d'une donnée ; les autres systèmes l'affichent sans la modifier.", "DOC-147 §6"),
    G("Prafo", "Praticien·ne formateur·trice, public du portail MyParFo.", "DOC-147 §2"),
    G("Doit / Devrait / Peut", "« Doit » : obligatoire. « Devrait » : recommandé, tout écart est justifié par écrit. « Peut » : optionnel.", "Méthode du registre CDC"),
    G("CMP", "Outil de gestion du consentement : recueille et applique le consentement aux cookies et balises.", "DOC-147 §5.2"),
    G("GEO", "Optimisation pour les moteurs génératifs : rendre les contenus lisibles, citables et exacts pour les moteurs fondés sur l'IA.", "Échange du 07.11.2026"),
    G("Navigation agentique", "Navigation d'un agent d'IA sur le site, au nom d'une personne, pour accomplir une tâche.", "Échange du 07.11.2026"),
    G("PWA", "Progressive Web App : application web installable sur un appareil mobile.", "D-003"),
  ];
  const decisions = [{ titre: "Registre du cahier des charges : méthode de capture, de maturation et de rédaction des exigences", statut: "Proposée", decideur: "COP", phase: "P0",
    contexte: "Des idées pour le cahier des charges surgissent dès maintenant, alors que les cahiers des charges ne seront rédigés qu'en P6 (besoins CMS) et P7 (développement). Le cahier des charges doit être assez détaillé pour ne laisser aucune place à l'interprétation par l'agence.",
    options: "A) Noter les idées au fil de l'eau dans les documents existants. B) Registre dédié dans la plateforme : thématiques en arborescence libre, identifiants stables CDC-nnn, cycle de vie Idée → Qualifiée → En instruction → Rédigée → Validée, règles de rédaction normées, glossaire.",
    decision: "Option B, module « Registre CDC » de la plateforme, alimenté initialement par la reprise des documents du projet (07.11.2026). Référence : 00_PILOTAGE/10_Registre-cahier-des-charges.md.",
    reexamen: "Revue à chaque gate (état du registre) ; avant le démarrage de P6 (export vers les exigences du CMS).", dateReexamen: "2027-04-30", questions: "", documents: "", remplace: "" }];
  const documents = [{ titre: "Registre du cahier des charges — méthode", phase: "P0", chemin: "00_PILOTAGE/10_Registre-cahier-des-charges.md", type: "Processus", statut: "En revue", version: "1.0", date: "2026-11-07", responsable: "CDP", tags: "cahier des charges, exigences, registre",
    description: "Méthode de capture, de maturation et de rédaction des exigences du cahier des charges ; module Registre CDC de la plateforme.", livrable: false,
    versions: [{ v: "1.0", date: "2026-11-07", auteur: "Claude", note: "Création : méthode et première alimentation du registre" }] }];
  window.CDC_INITIAL = { version: 1, date: "2026-11-07", auteur: "Reprise de l'existant (Claude)", themes, points, glossaire, decisions, documents };
})();
