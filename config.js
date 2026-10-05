/* Configuration de la plateforme.
 * apiUrl : "auto" → détecte automatiquement le serveur (server.js) quand la page est servie en http(s) ;
 *          null   → force le mode local (données dans le navigateur).
 * docsBase : chemin relatif vers la racine du dossier projet, pour ouvrir les documents en mode local.
 */
window.DASHBOARD_CONFIG = {
  apiUrl: "auto",
  storageKey: "hepvd-refonte-web-v2",
  docsBase: "../../",
  auteurParDefaut: "Unité Communication"
};
