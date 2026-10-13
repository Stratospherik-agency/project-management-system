#!/usr/bin/env node
/* Synchronisation du dossier projet HEPVD_Refonte-Web vers la plateforme en ligne (v0.5)
 * Envoie uniquement les fichiers nouveaux ou modifiés ; les fichiers supprimés sur le Mac sont retirés du site
 * (le serveur les conserve dans une corbeille). Le dossier Tableau-de-bord (code) n'est jamais envoyé.
 *
 * Utilisation :  node outils/synchroniser.js                 synchroniser maintenant
 *                node outils/synchroniser.js --simulation    afficher ce qui serait fait, sans rien envoyer
 *                node outils/synchroniser.js --sans-suppression
 *                node outils/synchroniser.js --configurer    changer l'adresse ou le jeton
 *                node outils/synchroniser.js --planifier[=18:30]  synchronisation automatique chaque jour (macOS)
 *                node outils/synchroniser.js --deplanifier
 * Configuration : ~/.hepvd-synchronisation.json (adresse du site + jeton, droits 600). Jamais dans le dépôt Git.
 */
"use strict";
const fs = require("fs"), path = require("path"), os = require("os"), crypto = require("crypto"), readline = require("readline"), { execFileSync } = require("child_process");
const ARGS = new Set(process.argv.slice(2).map(a => a.split("=")[0])), ARGV = Object.fromEntries(process.argv.slice(2).map(a => a.split("=")).map(([k, v]) => [k, v]));
const RACINE = path.resolve(__dirname, "..", "..", "..");
const CONF_F = path.join(os.homedir(), ".hepvd-synchronisation.json"), CACHE_F = path.join(os.homedir(), ".hepvd-synchronisation-cache.json");
const EXCLUS = /(^|\/)(\.|~\$|Thumbs\.db$|desktop\.ini$)|(^|\/)node_modules\/|^00_PILOTAGE\/Tableau-de-bord\//i;
const LABEL = "ch.hepl.refonte-web.synchronisation", PLIST = path.join(os.homedir(), "Library", "LaunchAgents", LABEL + ".plist");
const rJ = (f, d) => { try { return JSON.parse(fs.readFileSync(f, "utf8")); } catch (e) { return d; } };
const wJ = (f, v) => fs.writeFileSync(f, JSON.stringify(v, null, 1), { mode: 0o600 });
const ask = q => new Promise(ok => { const rl = readline.createInterface({ input: process.stdin, output: process.stdout }); rl.question(q, a => { rl.close(); ok(a.trim()); }); });
const mo = n => n > 1e6 ? (n / 1e6).toFixed(1) + " Mo" : Math.round(n / 1e3) + " ko";

async function configurer(force) {
  let c = rJ(CONF_F, null);
  if (c && c.url && c.jeton && !force) return c;
  if (!process.stdin.isTTY) throw new Error("Configuration absente : lancez une première fois Synchroniser-le-projet.command à la main.");
  console.log("\nConfiguration de la synchronisation (une seule fois).");
  const url = (await ask("Adresse du site [https://projectmanagement.stratospherik.ch] : ")) || "https://projectmanagement.stratospherik.ch";
  const jeton = await ask("Jeton de synchronisation (console d'administration → Synchronisation) : ");
  if (!/^hepvd_[A-Za-z0-9_-]{20,}$/.test(jeton)) throw new Error("Jeton invalide.");
  c = { url: url.replace(/\/+$/, ""), jeton }; wJ(CONF_F, c); console.log("Configuration enregistrée dans " + CONF_F + "\n"); return c;
}
function lister() {
  const out = [];
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, e.name), rel = path.relative(RACINE, full).split(path.sep).join("/");
      if (EXCLUS.test(rel) || EXCLUS.test(rel + "/")) continue;
      if (e.isDirectory()) walk(full); else if (e.isFile()) out.push(rel);
    }
  })(RACINE);
  return out;
}
function empreinte(abs) { return crypto.createHash("sha256").update(fs.readFileSync(abs)).digest("hex"); }
async function appel(c, methode, chemin, corps, entetes) {
  const r = await fetch(c.url + chemin, { method: methode, headers: Object.assign({ Authorization: "Bearer " + c.jeton }, entetes || {}), body: corps });
  const t = await r.text(); let j = {}; try { j = JSON.parse(t); } catch (e) { }
  if (!r.ok) throw new Error(`${methode} ${chemin.split("?")[0]} → ${r.status} ${j.error || t.slice(0, 120)}`);
  return j;
}
function planifier() {
  const [hh, mm] = String(ARGV["--planifier"] || "18:30").split(":").map(Number);
  const log = path.join(os.homedir(), "Library", "Logs", "hepvd-synchronisation.log");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n<plist version="1.0"><dict>\n<key>Label</key><string>${LABEL}</string>\n<key>ProgramArguments</key><array><string>${process.execPath}</string><string>${__filename}</string></array>\n<key>StartCalendarInterval</key><dict><key>Hour</key><integer>${hh}</integer><key>Minute</key><integer>${mm || 0}</integer></dict>\n<key>StandardOutPath</key><string>${log}</string><key>StandardErrorPath</key><string>${log}</string>\n</dict></plist>\n`;
  fs.mkdirSync(path.dirname(PLIST), { recursive: true }); fs.writeFileSync(PLIST, xml);
  try { execFileSync("launchctl", ["unload", PLIST], { stdio: "ignore" }); } catch (e) { }
  execFileSync("launchctl", ["load", PLIST]);
  console.log(`Synchronisation automatique planifiée chaque jour à ${String(hh).padStart(2, "0")}:${String(mm || 0).padStart(2, "0")} (si le Mac est allumé). Journal : ${log}`);
}
function deplanifier() { try { execFileSync("launchctl", ["unload", PLIST], { stdio: "ignore" }); } catch (e) { } try { fs.unlinkSync(PLIST); } catch (e) { } console.log("Synchronisation automatique désactivée."); }

(async () => {
  try {
    if (ARGS.has("--deplanifier")) return deplanifier();
    const c = await configurer(ARGS.has("--configurer"));
    if (ARGS.has("--planifier")) return planifier();
    const sim = ARGS.has("--simulation"), sansSup = ARGS.has("--sans-suppression");
    console.log(`[${new Date().toLocaleString("fr-CH")}] Dossier : ${RACINE}\nSite : ${c.url}`);
    if (!fs.existsSync(path.join(RACINE, "00_PILOTAGE"))) throw new Error("Dossier projet introuvable (00_PILOTAGE absent).");
    const cache = rJ(CACHE_F, {}), locaux = lister(), loc = {};
    for (const rel of locaux) {
      const abs = path.join(RACINE, rel), st = fs.statSync(abs), k = cache[rel];
      loc[rel] = { abs, taille: st.size, mtime: st.mtime, sha256: k && k.mtimeMs === st.mtimeMs && k.taille === st.size ? k.sha256 : empreinte(abs) };
      cache[rel] = { mtimeMs: st.mtimeMs, taille: st.size, sha256: loc[rel].sha256 };
    }
    Object.keys(cache).forEach(k => { if (!loc[k]) delete cache[k]; }); wJ(CACHE_F, cache);
    const { fichiers: dist } = await appel(c, "GET", "/api/sync/manifeste");
    const aEnvoyer = locaux.filter(r => !dist[r] || dist[r].sha256 !== loc[r].sha256);
    const aRetirer = sansSup ? [] : Object.keys(dist).filter(r => !loc[r]);
    const vol = aEnvoyer.reduce((t, r) => t + loc[r].taille, 0);
    console.log(`${locaux.length} fichiers locaux · ${aEnvoyer.length} à envoyer (${mo(vol)}) · ${aRetirer.length} à retirer du site`);
    if (sim) { aEnvoyer.forEach(r => console.log("  + " + r)); aRetirer.forEach(r => console.log("  − " + r)); console.log("Simulation : rien n'a été envoyé."); return; }
    let n = 0, err = 0;
    const file = aEnvoyer.slice();
    await Promise.all([1, 2, 3, 4].map(async () => { while (file.length) { const r = file.shift(); try { await appel(c, "PUT", "/api/sync/fichier?chemin=" + encodeURIComponent(r), fs.readFileSync(loc[r].abs), { "Content-Type": "application/octet-stream", "X-Sha256": loc[r].sha256, "X-Mtime": loc[r].mtime.toISOString() }); n++; if (n % 20 === 0 || n === aEnvoyer.length) console.log(`  ${n}/${aEnvoyer.length} envoyés`); } catch (e) { err++; console.error("  ✗ " + r + " — " + e.message); } } }));
    for (const r of aRetirer) { try { await appel(c, "DELETE", "/api/sync/fichier?chemin=" + encodeURIComponent(r)); console.log("  − " + r); } catch (e) { err++; console.error("  ✗ " + r + " — " + e.message); } }
    const fin = await appel(c, "POST", "/api/sync/fin");
    console.log(`Terminé : ${n} envoyé(s), ${aRetirer.length} retiré(s), ${err} erreur(s). ${fin.total} fichiers en ligne.`);
    if (err) process.exitCode = 1;
  } catch (e) { console.error("Erreur : " + e.message); process.exitCode = 1; }
})();
