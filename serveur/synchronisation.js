/* Synchronisation du dossier projet (Mac → serveur) — plateforme de pilotage Refonte web HEP Vaud (v0.5)
 * Le script « Synchroniser-le-projet.command » (outils/synchroniser.js) envoie les fichiers nouveaux ou modifiés
 * dans un miroir du dossier projet (<données>/projet), consultable dans la vue « Dossier projet ».
 * Authentification par jeton (créé dans la console d'administration, stocké haché). Aucun fichier n'est détruit :
 * un fichier supprimé sur le Mac est déplacé dans <données>/projet-corbeille/<horodatage>/.
 */
"use strict";
const fs = require("fs"), path = require("path"), crypto = require("crypto");

module.exports = function creerSynchronisation({ DATA_DIR, PROJECT_ROOT, MIRROR }) {
  const TOK_F = path.join(DATA_DIR, "jetons-synchronisation.json"), MAN_F = path.join(DATA_DIR, "projet-manifeste.json"), JRN_F = path.join(DATA_DIR, "synchronisation-journal.ndjson");
  const CORB = path.join(DATA_DIR, "projet-corbeille");
  const rJ = (f, d) => { try { return JSON.parse(fs.readFileSync(f, "utf8")); } catch (e) { return d; } };
  const wJ = (f, v) => { fs.writeFileSync(f + ".tmp", JSON.stringify(v), { mode: 0o600 }); fs.renameSync(f + ".tmp", f); };
  let jetons = rJ(TOK_F, []), man = rJ(MAN_F, {});
  const h = s => crypto.createHash("sha256").update(String(s)).digest("hex");
  const now = () => new Date().toISOString();
  const EXCLUS = /(^|\/)(\.|~\$|Thumbs\.db$|desktop\.ini$)|(^|\/)node_modules\/|^00_PILOTAGE\/Tableau-de-bord\//i;
  const MAX = 200e6;
  let session = null; // { id, debut, envoyes, supprimes, octets, jeton }

  function cheminValide(rel) {
    rel = String(rel || "").replace(/\\/g, "/");
    if (!rel || rel.length > 600 || rel.startsWith("/") || rel.split("/").some(seg => !seg || seg === "." || seg === "..") || EXCLUS.test(rel) || /[\u0000-\u001f]/.test(rel)) return null;
    const abs = path.resolve(PROJECT_ROOT, rel);
    return abs.startsWith(PROJECT_ROOT + path.sep) ? { rel, abs } : null;
  }
  function jetonDe(req) {
    const m = String(req.headers.authorization || "").match(/^Bearer\s+([A-Za-z0-9_-]{20,})$/); if (!m) return null;
    const hh = h(m[1]); const j = jetons.find(x => x.hash === hh && !x.revoque);
    return j || null;
  }
  const journal = e => { try { fs.appendFileSync(JRN_F, JSON.stringify(Object.assign({ ts: now() }, e)) + "\n"); } catch (x) { } };
  const echecs = {};

  async function api(req, res, p, u, { send, body, ip }) {
    if (!MIRROR) return send(req, res, 404, { error: "Synchronisation indisponible : la plateforme lit directement un dossier projet local (--projet)." });
    const f = echecs[ip]; if (f && f.n >= 10 && Date.now() - f.t < 15 * 60e3) return send(req, res, 429, { error: "Trop de tentatives." });
    const j = jetonDe(req);
    if (!j) { const e = echecs[ip] || { n: 0, t: Date.now() }; e.n++; e.t = Date.now(); echecs[ip] = e; return send(req, res, 401, { error: "Jeton de synchronisation invalide ou révoqué." }); }
    j.dernierUsage = now(); wJ(TOK_F, jetons);
    if (p === "/api/sync/manifeste" && req.method === "GET") {
      session = { id: crypto.randomUUID(), debut: now(), envoyes: 0, supprimes: 0, octets: 0, jeton: j.nom };
      return send(req, res, 200, { session: session.id, fichiers: man });
    }
    if (p === "/api/sync/fichier" && req.method === "PUT") {
      const c = cheminValide(u.searchParams.get("chemin")); if (!c) return send(req, res, 400, { error: "Chemin refusé." });
      const buf = await body(req, MAX), sha = crypto.createHash("sha256").update(buf).digest("hex");
      const attendu = String(req.headers["x-sha256"] || ""); if (attendu && attendu !== sha) return send(req, res, 422, { error: "Empreinte différente : transfert incomplet, réessayer." });
      fs.mkdirSync(path.dirname(c.abs), { recursive: true });
      fs.writeFileSync(c.abs + ".part", buf); fs.renameSync(c.abs + ".part", c.abs);
      const mt = Date.parse(req.headers["x-mtime"] || ""); if (!isNaN(mt)) { try { fs.utimesSync(c.abs, new Date(), new Date(mt)); } catch (e) { } }
      man[c.rel] = { sha256: sha, taille: buf.length, mtime: isNaN(mt) ? now() : new Date(mt).toISOString() }; wJ(MAN_F, man);
      if (session) { session.envoyes++; session.octets += buf.length; }
      return send(req, res, 200, { ok: true, sha256: sha });
    }
    if (p === "/api/sync/fichier" && req.method === "DELETE") {
      const c = cheminValide(u.searchParams.get("chemin")); if (!c) return send(req, res, 400, { error: "Chemin refusé." });
      if (fs.existsSync(c.abs)) { const dest = path.join(CORB, now().replace(/[:.]/g, "-").slice(0, 19), c.rel); fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.renameSync(c.abs, dest); }
      delete man[c.rel]; wJ(MAN_F, man);
      // dossiers devenus vides
      let d = path.dirname(c.abs); while (d.startsWith(PROJECT_ROOT + path.sep)) { try { fs.rmdirSync(d); } catch (e) { break; } d = path.dirname(d); }
      if (session) session.supprimes++;
      return send(req, res, 200, { ok: true });
    }
    if (p === "/api/sync/fin" && req.method === "POST") {
      if (session) { journal(Object.assign({}, session, { fin: now(), total: Object.keys(man).length })); console.log(`Synchronisation (${session.jeton}) : ${session.envoyes} envoyé(s), ${session.supprimes} retiré(s).`); }
      session = null; return send(req, res, 200, { ok: true, total: Object.keys(man).length });
    }
    return send(req, res, 404, {});
  }

  async function admin(req, res, p, { send, jbody, me }) {
    if (p === "/api/admin/sync" && req.method === "GET") {
      let jr = []; try { jr = fs.readFileSync(JRN_F, "utf8").trim().split("\n").filter(Boolean).slice(-50).reverse().map(x => JSON.parse(x)); } catch (e) { }
      const octets = Object.values(man).reduce((t, x) => t + (x.taille || 0), 0);
      return send(req, res, 200, { miroir: MIRROR, jetons: jetons.map(x => ({ id: x.id, nom: x.nom, cree: x.cree, par: x.par, dernierUsage: x.dernierUsage || null, revoque: !!x.revoque })), journal: jr, fichiers: Object.keys(man).length, octets });
    }
    if (p === "/api/admin/sync/jetons" && req.method === "POST") {
      if (!MIRROR) return send(req, res, 400, { error: "Synchronisation indisponible en mode local." });
      const b = await jbody(req); const nom = String(b.nom || "Mac").slice(0, 60);
      const t = "hepvd_" + crypto.randomBytes(24).toString("base64url");
      const j = { id: crypto.randomUUID(), nom, hash: h(t), cree: now(), par: me.nom }; jetons.push(j); wJ(TOK_F, jetons);
      console.log(`Jeton de synchronisation « ${nom} » créé par ${me.nom}.`);
      return send(req, res, 200, { jeton: t, id: j.id });
    }
    const m = p.match(/^\/api\/admin\/sync\/jetons\/([0-9a-f-]{36})$/);
    if (m && req.method === "DELETE") { const j = jetons.find(x => x.id === m[1]); if (!j) return send(req, res, 404, {}); j.revoque = true; j.revoqueLe = now(); wJ(TOK_F, jetons); console.log(`Jeton « ${j.nom} » révoqué par ${me.nom}.`); return send(req, res, 200, { ok: true }); }
    return send(req, res, 404, {});
  }
  return { api, admin };
};
