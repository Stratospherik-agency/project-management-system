# Plateforme de pilotage — Refonte de l'écosystème web HEP Vaud

Application web de gestion du projet de refonte (hepl.ch, MyEtu, MyCollab, MyParFo) : vue d'ensemble, phases et étapes, Gantt avec baseline et prévisions, Kanban, jalons et gates, documents avec moteur de recherche, risques et anticipation des retards, questionnements, décisions, Design System, budget, RACI, parties prenantes, rapports hebdomadaires, historique complet.

- Node.js ≥ 22.13, **aucune dépendance**.
- Données : base SQLite (journal de toutes les modifications, instantanés horaires, fichiers versionnés).
- Accès : comptes administrateur / éditeur / lecteur.

| Fichier | Rôle |
|---|---|
| `server.js` | Serveur (API, comptes, stockage) |
| `index.html`, `app.css`, `js/` | Application |
| `connexion.html`, `connexion.js` | Connexion et première installation |
| `data/projet-data.js` | Données initiales (uniquement pour une base vide) |
| `DEPLOIEMENT-INFOMANIAK.md` | Mise en ligne pas à pas |
| `README-hebergement.md` | Modes d'utilisation et options |

Démarrage : `node server.js --data=../hepvd-donnees` (voir `DEPLOIEMENT-INFOMANIAK.md`).
