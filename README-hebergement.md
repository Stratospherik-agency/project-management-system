# Plateforme de pilotage — modes d'utilisation & options (v0.3)

| Mode | Comment | Données | Accès |
|---|---|---|---|
| **Local, fichier** | Double-cliquer `index.html` | Navigateur (export / import JSON) | Ce poste |
| **Local, base de données** | Double-cliquer `Lancer-la-plateforme.command` (Mac) | SQLite dans `data/` | Ce poste uniquement (127.0.0.1), sans comptes, accès aux fichiers du dossier projet |
| **Serveur (Infomaniak ou interne)** | `node server.js --data=../hepvd-donnees` | SQLite hors du dépôt | Comptes admin / éditeur / lecteur — voir `DEPLOIEMENT-INFOMANIAK.md` |

## Options de `server.js`
| Option | Variable | Défaut | Rôle |
|---|---|---|---|
| `--port=` | `PORT` | 8080 | Port (fourni automatiquement par Infomaniak) |
| `--host=` | `HOST` | 0.0.0.0 si `PORT` est fourni, sinon 127.0.0.1 | Interface d'écoute |
| `--data=` | `DATA_DIR` | `./data` | Base SQLite, comptes, sessions, fichiers téléversés |
| `--projet=` | `PROJECT_ROOT` | désactivé | Dossier projet servi en lecture sous `/projet/` (usage local) |
| `--sans-authentification` | — | — | Sans comptes ; refusé hors 127.0.0.1 |
| `--auth-proxy` | — | — | Identité fournie par un reverse proxy SSO (`X-Remote-User`) |

Node.js ≥ 22.13 : base SQLite intégrée. Version plus ancienne (≥ 18) : bascule automatique sur un stockage en fichiers JSON.

## Ce que le serveur conserve
Journal de toutes les modifications (auteur = compte connecté) · instantanés complets au plus toutes les heures, restaurables (*Historique → Instantanés*) · fichiers téléversés avec empreinte SHA-256 · comptes (mots de passe chiffrés scrypt).

## Sauvegarde
Sauvegarder le dossier de données (`--data`). L'export JSON (*Données & paramètres*) reste disponible à tout moment.
