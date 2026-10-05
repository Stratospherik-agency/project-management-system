# Déploiement sur Infomaniak — projectmanagement.stratospherik.ch

Version 0.3 · 05.10.2026

La plateforme est une application Node.js **sans dépendance** (aucun `npm install` nécessaire). Elle écoute sur le port fourni par Infomaniak (variable `PORT`), stocke ses données dans une base SQLite **hors du dépôt Git**, et exige une connexion (comptes administrateur / éditeur / lecteur).

---

## Étape 1 — Mettre le code sur GitHub

Le dépôt contient **uniquement le contenu du dossier** `00_PILOTAGE/Tableau-de-bord/` (pas le reste du dossier projet).

> Dépôt **privé** recommandé : `data/projet-data.js` contient les données initiales du projet (planning, risques, décisions).

Dans le Terminal du Mac :

```bash
cd ~/Documents/HEPVD_Refonte-Web/00_PILOTAGE/Tableau-de-bord
git init -b main
git add .
git status          # vérifier : aucun fichier .sqlite, utilisateurs.json ou sessions.json
git commit -m "Plateforme de pilotage v0.3"
git remote add origin https://github.com/VOTRE-COMPTE/VOTRE-DEPOT.git
git push -u origin main
```

(Avec GitHub Desktop : *Add an Existing Repository* → choisir le dossier `Tableau-de-bord` → *Publish repository* en cochant *Keep this code private*.)

Le fichier `.gitignore` exclut déjà la base de données, les comptes, les sessions et les fichiers téléversés.

## Étape 2 — Accès au dépôt privé depuis Infomaniak

Créer sur GitHub un jeton d'accès en lecture seule : *Settings → Developer settings → Personal access tokens → Fine-grained tokens* → dépôt concerné uniquement → permission *Contents : Read-only*. Infomaniak l'utilise comme mot de passe (authentification HTTP Basic) avec votre identifiant GitHub.

## Étape 3 — Configurer le site Node.js dans le Manager Infomaniak

| Réglage | Valeur |
|---|---|
| Source | Dépôt Git `https://github.com/VOTRE-COMPTE/VOTRE-DEPOT.git`, branche `main` (identifiant GitHub + jeton) |
| Version de Node.js | **22 (LTS)** — 22.13 minimum pour la base SQLite intégrée — ou 24 |
| Utiliser une commande de build | **décoché** (aucune dépendance) |
| Commande d'exécution | `node server.js --port=3000 --host=0.0.0.0 --data=../hepvd-donnees --code-installation=VOTRE-CODE-SECRET` |
| Port d'écoute | **3000** (identique à `--port`) |
| Exécuter l'application après l'installation | activé |
| Certificat SSL | activer et forcer HTTPS |

- `VOTRE-CODE-SECRET` : un code de **8 caractères minimum** que vous choisissez (sans espace). Il sert une seule fois, à créer le premier compte ; il est ignoré dès qu'un compte existe. Après l'installation, vous pouvez le retirer de la commande.
- `--data=../hepvd-donnees` place la base, les comptes et les fichiers téléversés hors du dossier de l'application : un redéploiement Git ne les touche pas. Si le site ne démarre pas, essayez `--data=./data`.
- Sans console dans le Manager, le journal du serveur est écrit dans `serveur.log`, dans ce dossier de données (visible par FTP / SFTP ou le gestionnaire de fichiers de l'hébergement).

## Étape 4 — Premier démarrage

1. Ouvrir https://projectmanagement.stratospherik.ch → la page **Installation** s'affiche.
2. Saisir le code choisi à l'étape 3, votre nom, un identifiant (ex. `alexis`) et un mot de passe d'au moins 12 caractères. Ce compte est **administrateur**.
3. La plateforme crée la base à partir de `data/projet-data.js` et s'ouvre sur la vue d'ensemble.
4. Facultatif : retirer `--code-installation=…` de la commande d'exécution et redémarrer.

Tant qu'aucun compte n'existe, tout le site redirige vers la page d'installation.

## Étape 5 — Créer les comptes

*Données & paramètres → Utilisateurs → + Utilisateur*

| Rôle | Droits | Pour qui |
|---|---|---|
| Administrateur | tout, y compris les comptes | cheffe ou chef de projet |
| Éditeur | modifie le projet | équipe cœur |
| Lecteur | consultation seule | membres du Copil, invités |

Transmettre le mot de passe initial par un canal séparé ; chacun le change dans *Mon compte* (clic sur son nom en haut à droite).

## Étape 6 — Vérifications après mise en ligne

- [ ] En navigation privée, https://projectmanagement.stratospherik.ch redirige vers la page de connexion.
- [ ] `https://projectmanagement.stratospherik.ch/server.js` et `/package.json` répondent « Interdit ».
- [ ] Le cadenas HTTPS est présent.
- [ ] Une modification, puis un redémarrage de l'application : la modification est conservée.
- [ ] Un `git push` de test, puis redéploiement : les données et les comptes sont conservés.
- [ ] Un compte lecteur ne peut rien enregistrer (bandeau « lecture seule »).
- [ ] *Historique → Instantanés* affiche au moins un instantané.

## Mettre à jour la plateforme

1. Remplacer les fichiers du dossier `Tableau-de-bord` par la nouvelle version.
2. `git add . && git commit -m "…" && git push`
3. Dans le Manager : redéployer / redémarrer l'application (ou déploiement automatique si activé).

Les données ne sont jamais écrasées par une mise à jour du code. `data/projet-data.js` ne sert qu'à initialiser une base vide.

## Sauvegardes

- Sauvegardes automatiques de l'hébergement Infomaniak.
- Chaque semaine : *Données & paramètres → Exporter JSON*, à déposer dans `00_PILOTAGE/Tableau-de-bord/data/sauvegardes/` du dossier projet.
- Ponctuellement : télécharger le dossier `hepvd-donnees` (FTP/SFTP).

## Utilisation locale (Mac) — inchangée

`Lancer-la-plateforme.command` démarre la plateforme sans comptes, uniquement sur l'ordinateur (127.0.0.1), avec accès aux fichiers du dossier projet. Les données locales et celles du serveur sont **séparées** : pour passer de l'une à l'autre, utiliser *Exporter JSON* puis *Importer JSON*.

## Sécurité — ce qui est en place

Mots de passe chiffrés (scrypt + sel) · sessions en cookie HttpOnly / SameSite=Strict / Secure en HTTPS, 7 jours · blocage 15 min après 8 échecs de connexion · rôles appliqués côté serveur · en-têtes de sécurité (CSP, X-Frame-Options, HSTS) · fichiers du serveur et base inaccessibles par le web · site non indexé par les moteurs de recherche (`robots.txt`, `X-Robots-Tag`).
