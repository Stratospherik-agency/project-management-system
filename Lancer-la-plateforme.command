#!/bin/bash
# Lance la plateforme de pilotage (mode base de données) sur ce Mac et l'ouvre dans le navigateur.
cd "$(dirname "$0")" || exit 1
[ -s "$HOME/.nvm/nvm.sh" ] && . "$HOME/.nvm/nvm.sh" >/dev/null 2>&1
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
if ! command -v node >/dev/null 2>&1; then
  osascript -e 'display alert "Node.js est requis" message "Installez Node.js 22 (ou plus récent) depuis nodejs.org, puis relancez ce fichier. En attendant, ouvrez index.html (mode local)."'
  exit 1
fi
echo "Node $(node -v) — démarrage de la plateforme… (fermez cette fenêtre pour l'arrêter)"
(sleep 1.5; open "http://localhost:8080/#overview") &
node server.js --sans-authentification --projet=../..
