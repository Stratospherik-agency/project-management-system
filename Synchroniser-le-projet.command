#!/bin/bash
# Synchronise le dossier HEPVD_Refonte-Web avec la plateforme en ligne (vue « Dossier projet »).
# Options : --simulation, --sans-suppression, --configurer, --planifier[=18:30], --deplanifier
cd "$(dirname "$0")"
node outils/synchroniser.js "$@"
echo; read -n 1 -s -r -p "Appuyez sur une touche pour fermer cette fenêtre."
