/* Serveur de la plateforme de pilotage — Refonte web HEP Vaud (v0.3)
 * Node.js ≥ 18, aucune dépendance. Base SQLite intégrée (node:sqlite, Node ≥ 22.13), sinon stockage JSON.
 *
 * Fonctions : données du projet, journal complet, instantanés horaires, fichiers versionnés (SHA-256),
 *             comptes utilisateurs (admin / éditeur / lecteur) avec sessions, première installation sécurisée.
 *
 * Options (ligne de commande ou variables d'environnement) :
 *   --port=8080            PORT          (Infomaniak fournit PORT automatiquement)
 *   --host=0.0.0.0         HOST          (défaut : 0.0.0.0 si PORT est fourni par l'hébergeur, sinon 127.0.0.1)
 *   --data=../donnees      DATA_DIR      (dossier persistant hors du dépôt Git : base, fichiers, comptes)
 *   --projet=../..         PROJECT_ROOT  (facultatif : dossier projet servi en lecture sous /projet/)
 *   --sans-authentification               (usage local uniquement, refusé si l'hôte n'est pas 127.0.0.1)
 *   --auth-proxy                          (identité fournie par un reverse proxy : en-tête X-Remote-User)
 *   --code-installation=CODE  SETUP_CODE  (code choisi pour créer le premier compte quand aucune console n'est accessible ;
 *                                          ignoré dès qu'un compte existe)
 * Journal du serveur : <données>/serveur.log (consultable par FTP / gestionnaire de fichiers).
 */
"use strict";
const http = require("http"), fs = require("fs"), path = require("path"), crypto = require("crypto");
const ARGS = Object.fromEntries(process.argv.slice(2).map(a => { const m = a.match(/^--([^=]+)(?:=(.*))?$/); return m ? [m[1], m[2] === undefined ? true : m[2]] : [a, true]; }));
const APP = __dirname;
const PORT = +(ARGS.port || process.env.PORT || 8080);
const HOST = ARGS.host || process.env.HOST || (process.env.PORT ? "0.0.0.0" : "127.0.0.1");
const DATA_DIR = path.resolve(APP, ARGS.data || process.env.DATA_DIR || "data");
const PROJ = ARGS.projet || process.env.PROJECT_ROOT; const PROJECT_ROOT = PROJ ? path.resolve(APP, PROJ) : null;
const OPEN = !!ARGS["sans-authentification"], PROXY = !!ARGS["auth-proxy"];
if (OPEN && HOST !== "127.0.0.1" && HOST !== "localhost") { console.error("Refus : --sans-authentification n'est autorisé qu'en local (127.0.0.1)."); process.exit(1); }
const FILES_DIR = path.join(DATA_DIR, "fichiers");
fs.mkdirSync(FILES_DIR, { recursive: true });
/* journal du serveur dans un fichier (hébergements sans console) */
const LOG_F = path.join(DATA_DIR, "serveur.log");
try { if (fs.existsSync(LOG_F) && fs.statSync(LOG_F).size > 2e6) fs.renameSync(LOG_F, LOG_F + ".1"); } catch (e) { }
for (const k of ["log", "error"]) { const orig = console[k].bind(console); console[k] = (...a) => { orig(...a); try { fs.appendFileSync(LOG_F, `[${new Date().toISOString()}] ${k === "error" ? "ERREUR " : ""}${a.map(x => x instanceof Error ? x.stack : typeof x === "string" ? x : JSON.stringify(x)).join(" ")}\n`); } catch (e) { } }; }
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".svg": "image/svg+xml", ".json": "application/json", ".md": "text/plain; charset=utf-8", ".txt": "text/plain; charset=utf-8", ".pdf": "application/pdf", ".csv": "text/csv; charset=utf-8", ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document", ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation", ".woff2": "font/woff2", ".ico": "image/x-icon" };
const now = () => new Date().toISOString();

/* ================================================================ stockage des données */
let store;
try {
  process.removeAllListeners("warning");
  const { DatabaseSync } = require("node:sqlite");
  const db = new DatabaseSync(path.join(DATA_DIR, "plateforme.sqlite"));
  db.exec(`PRAGMA journal_mode=WAL;
    CREATE TABLE IF NOT EXISTS state(id INTEGER PRIMARY KEY CHECK(id=1), rev INTEGER NOT NULL, data TEXT NOT NULL, updated_at TEXT, updated_by TEXT);
    CREATE TABLE IF NOT EXISTS journal(id INTEGER PRIMARY KEY AUTOINCREMENT, ts TEXT, user TEXT, type TEXT, eid TEXT, action TEXT, resume TEXT, rev INTEGER);
    CREATE TABLE IF NOT EXISTS snapshots(id INTEGER PRIMARY KEY AUTOINCREMENT, ts TEXT, rev INTEGER, user TEXT, data TEXT);
    CREATE TABLE IF NOT EXISTS files(id TEXT PRIMARY KEY, doc TEXT, version TEXT, name TEXT, size INTEGER, sha256 TEXT, path TEXT, ts TEXT, user TEXT);`);
  store = {
    kind: "sqlite",
    get() { const r = db.prepare("SELECT rev, data FROM state WHERE id=1").get(); return r ? { rev: r.rev, data: r.data } : null; },
    put(rev, data, user, journal) {
      db.exec("BEGIN");
      try {
        db.prepare("INSERT INTO state(id,rev,data,updated_at,updated_by) VALUES(1,?,?,?,?) ON CONFLICT(id) DO UPDATE SET rev=excluded.rev,data=excluded.data,updated_at=excluded.updated_at,updated_by=excluded.updated_by").run(rev, data, now(), user);
        const ins = db.prepare("INSERT INTO journal(ts,user,type,eid,action,resume,rev) VALUES(?,?,?,?,?,?,?)");
        (journal || []).forEach(j => ins.run(j.ts || now(), user, j.type || "", j.id || "", j.action || "", j.resume || "", rev));
        const last = db.prepare("SELECT ts FROM snapshots ORDER BY id DESC LIMIT 1").get();
        if (!last || Date.now() - Date.parse(last.ts) > 3600e3) db.prepare("INSERT INTO snapshots(ts,rev,user,data) VALUES(?,?,?,?)").run(now(), rev, user, data);
        db.exec("COMMIT");
      } catch (e) { db.exec("ROLLBACK"); throw e; }
    },
    snapshots() { return db.prepare("SELECT id, ts, rev, user FROM snapshots ORDER BY id DESC LIMIT 500").all(); },
    snapshot(id) { const r = db.prepare("SELECT data FROM snapshots WHERE id=?").get(+id); return r ? r.data : null; },
    addFile(f) { db.prepare("INSERT INTO files(id,doc,version,name,size,sha256,path,ts,user) VALUES(?,?,?,?,?,?,?,?,?)").run(f.id, f.doc, f.version, f.name, f.size, f.sha256, f.path, f.ts, f.user); },
    file(id) { return db.prepare("SELECT * FROM files WHERE id=?").get(id); },
    journal(limit) { return db.prepare("SELECT * FROM journal ORDER BY id DESC LIMIT ?").all(limit); },
  };
} catch (e) {
  const SD = path.join(DATA_DIR, "stockage-json"); fs.mkdirSync(path.join(SD, "instantanes"), { recursive: true });
  const P = n => path.join(SD, n), rj = (n, d) => { try { return JSON.parse(fs.readFileSync(P(n), "utf8")); } catch (x) { return d; } }, wj = (n, v) => { fs.writeFileSync(P(n) + ".tmp", JSON.stringify(v)); fs.renameSync(P(n) + ".tmp", P(n)); };
  store = {
    kind: "json",
    get() { const s = rj("etat.json", null); return s ? { rev: s.rev, data: JSON.stringify(s.data) } : null; },
    put(rev, data, user, journal) {
      wj("etat.json", { rev, data: JSON.parse(data), updated_at: now(), updated_by: user });
      fs.appendFileSync(P("journal.ndjson"), (journal || []).map(j => JSON.stringify(Object.assign({}, j, { rev, user })) + "\n").join(""));
      const snaps = fs.readdirSync(P("instantanes")).sort(); const last = snaps[snaps.length - 1];
      if (!last || Date.now() - fs.statSync(path.join(P("instantanes"), last)).mtimeMs > 3600e3) fs.writeFileSync(path.join(P("instantanes"), `${Date.now()}_${rev}.json`), data);
    },
    snapshots() { return fs.readdirSync(P("instantanes")).sort().reverse().slice(0, 500).map(f => { const [t, rev] = f.replace(".json", "").split("_"); return { id: f.replace(".json", ""), ts: new Date(+t).toISOString(), rev: +rev, user: "" }; }); },
    snapshot(id) { const f = path.join(P("instantanes"), path.basename(String(id)) + ".json"); return fs.existsSync(f) ? fs.readFileSync(f, "utf8") : null; },
    addFile(f) { const all = rj("fichiers.json", {}); all[f.id] = f; wj("fichiers.json", all); },
    file(id) { return rj("fichiers.json", {})[id]; },
    journal(limit) { try { return fs.readFileSync(P("journal.ndjson"), "utf8").trim().split("\n").filter(Boolean).slice(-limit).reverse().map(l => JSON.parse(l)); } catch (x) { return []; } },
  };
}

/* ================================================================ comptes & sessions */
const USERS_F = path.join(DATA_DIR, "utilisateurs.json"), SESS_F = path.join(DATA_DIR, "sessions.json");
const rJ = (f, d) => { try { return JSON.parse(fs.readFileSync(f, "utf8")); } catch (e) { return d; } };
const wJ = (f, v) => { fs.writeFileSync(f + ".tmp", JSON.stringify(v, null, 1), { mode: 0o600 }); fs.renameSync(f + ".tmp", f); };
let USERS = rJ(USERS_F, { users: [] }).users, SESS = rJ(SESS_F, {});
const SESSION_DAYS = 7;
const hashPw = (pw, salt) => crypto.scryptSync(String(pw), salt, 64).toString("hex");
const checkPw = (u, pw) => { const h = Buffer.from(hashPw(pw, u.salt), "hex"), ref = Buffer.from(u.hash, "hex"); return h.length === ref.length && crypto.timingSafeEqual(h, ref); };
const pubUser = u => ({ login: u.login, nom: u.nom, role: u.role, actif: u.actif !== false, cree: u.cree, derniereConnexion: u.derniereConnexion || null });
const saveUsers = () => wJ(USERS_F, { users: USERS });
const saveSess = () => { const t = Date.now(); Object.keys(SESS).forEach(k => { if (SESS[k].exp < t) delete SESS[k]; }); wJ(SESS_F, SESS); };
const ROLES = ["admin", "editeur", "lecteur"];
const validPw = pw => typeof pw === "string" && pw.length >= 12;
const validLogin = l => typeof l === "string" && /^[a-z0-9._-]{2,40}$/.test(l);
let SETUP_CODE = null;
const CODE_F = path.join(DATA_DIR, "CODE-INSTALLATION.txt");
if (!OPEN && !PROXY && !USERS.length) {
  const fixed = String(ARGS["code-installation"] || process.env.SETUP_CODE || "").trim();
  SETUP_CODE = fixed.length >= 8 ? fixed.toUpperCase() : crypto.randomBytes(5).toString("hex").toUpperCase();
  if (fixed && fixed.length < 8) console.error("--code-installation ignoré : 8 caractères minimum. Un code aléatoire a été généré.");
  try { fs.writeFileSync(CODE_F, `Code d'installation : ${fixed.length >= 8 ? "(celui indiqué dans la commande d'exécution)" : SETUP_CODE}\nGénéré le ${new Date().toISOString()}. Ce fichier est supprimé après la création du premier compte.\n`, { mode: 0o600 }); } catch (e) { }
} else { try { fs.unlinkSync(CODE_F); } catch (e) { } }
const fails = {}; // limitation des tentatives
const tooMany = ip => { const f = fails[ip]; return f && f.n >= 8 && Date.now() - f.t < 15 * 60e3; };
const fail = ip => { const f = fails[ip] || { n: 0, t: Date.now() }; if (Date.now() - f.t > 15 * 60e3) { f.n = 0; f.t = Date.now(); } f.n++; fails[ip] = f; };
function cookies(req) { const o = {}; (req.headers.cookie || "").split(";").forEach(c => { const i = c.indexOf("="); if (i > 0) o[c.slice(0, i).trim()] = decodeURIComponent(c.slice(i + 1).trim()); }); return o; }
const isHttps = req => req.headers["x-forwarded-proto"] === "https" || !!req.socket.encrypted;
function setSession(req, res, login) {
  const tok = crypto.randomBytes(32).toString("hex"); SESS[tok] = { login, exp: Date.now() + SESSION_DAYS * 864e5 }; saveSess();
  res.setHeader("Set-Cookie", `hepvd_s=${tok}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${SESSION_DAYS * 86400}${isHttps(req) ? "; Secure" : ""}`);
}
function currentUser(req) {
  if (OPEN) return { login: "local", nom: decodeURIComponent(req.headers["x-hepvd-user"] || "") || "Utilisateur local", role: "admin" };
  if (PROXY) { const n = req.headers["x-remote-user"] || req.headers["x-forwarded-user"] || req.headers["remote-user"]; if (!n) return null; const u = USERS.find(x => x.login === n); return u ? pubUser(u) : { login: n, nom: n, role: "editeur" }; }
  const s = SESS[cookies(req).hepvd_s]; if (!s || s.exp < Date.now()) return null;
  const u = USERS.find(x => x.login === s.login && x.actif !== false); return u ? pubUser(u) : null;
}

/* ================================================================ utilitaires HTTP */
const SEC = { "X-Content-Type-Options": "nosniff", "X-Robots-Tag": "noindex, nofollow", "X-Frame-Options": "DENY", "Referrer-Policy": "same-origin",
  "Content-Security-Policy": "default-src 'self'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'" };
function send(req, res, code, obj, type) {
  const h = Object.assign({ "Content-Type": type || "application/json; charset=utf-8", "Cache-Control": "no-store" }, SEC);
  if (isHttps(req)) h["Strict-Transport-Security"] = "max-age=31536000";
  res.writeHead(code, h); res.end(typeof obj === "string" || Buffer.isBuffer(obj) ? obj : JSON.stringify(obj));
}
const body = (req, max) => new Promise((ok, ko) => { const ch = []; let n = 0; req.on("data", c => { n += c.length; if (n > max) { ko(new Error("trop volumineux")); req.destroy(); } else ch.push(c); }); req.on("end", () => ok(Buffer.concat(ch))); req.on("error", ko); });
const jbody = async req => { if (!/application\/json/.test(req.headers["content-type"] || "")) throw new Error("JSON attendu"); return JSON.parse((await body(req, 60e6)).toString("utf8")); };
function serveFile(req, res, f, inlineName) {
  fs.stat(f, (err, st) => {
    if (err || !st.isFile()) return send(req, res, 404, "Introuvable", "text/plain; charset=utf-8");
    const h = Object.assign({ "Content-Type": TYPES[path.extname(f).toLowerCase()] || "application/octet-stream", "Content-Length": st.size, "Cache-Control": "no-cache" }, SEC);
    if (inlineName) h["Content-Disposition"] = `inline; filename*=UTF-8''${encodeURIComponent(inlineName)}`;
    res.writeHead(200, h); fs.createReadStream(f).pipe(res);
  });
}
const inside = (root, p) => { const r = path.resolve(root, "." + path.sep + p); return r === root || r.startsWith(root + path.sep) ? r : null; };
function walk(dir, base, out, depth) {
  if (depth > 8 || out.length > 20000) return;
  let list; try { list = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { return; }
  for (const e of list) {
    if (e.name.startsWith(".") || e.name === "node_modules") continue;
    const full = path.join(dir, e.name), rel = path.relative(base, full).split(path.sep).join("/");
    if (full === DATA_DIR || full.startsWith(DATA_DIR + path.sep)) continue;
    if (e.isDirectory()) walk(full, base, out, depth + 1);
    else if (e.isFile()) { const st = fs.statSync(full); out.push({ path: rel, size: st.size, mtime: st.mtime.toISOString() }); }
  }
}
const ipOf = req => (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || req.socket.remoteAddress;
const PUBLIC = new Set(["/connexion", "/installation", "/connexion.js", "/app.css", "/assets/logo-hep.svg", "/api/connexion", "/api/installation", "/api/etat-installation", "/favicon.ico", "/robots.txt"]);

/* ================================================================ routes */
http.createServer(async (req, res) => {
  try {
    const u = new URL(req.url, "http://x"), p = decodeURIComponent(u.pathname), ip = ipOf(req);
    if (p === "/favicon.ico") return serveFile(req, res, path.join(APP, "assets", "logo-hep.svg"));
    /* ---------- installation initiale */
    if (SETUP_CODE && !PUBLIC.has(p)) { if (p.startsWith("/api/")) return send(req, res, 401, { error: "installation", redirect: "installation" }); res.writeHead(302, { Location: "/installation" }); return res.end(); }
    if (p === "/api/etat-installation") return send(req, res, 200, { installation: !!SETUP_CODE });
    if (p === "/installation") { if (!SETUP_CODE) { res.writeHead(302, { Location: "/" }); return res.end(); } return serveFile(req, res, path.join(APP, "connexion.html")); }
    if (p === "/api/installation" && req.method === "POST") {
      if (!SETUP_CODE) return send(req, res, 409, { error: "Déjà installé" });
      if (tooMany(ip)) return send(req, res, 429, { error: "Trop de tentatives, réessayez dans 15 minutes." });
      const b = await jbody(req);
      if (String(b.code || "").trim().toUpperCase() !== SETUP_CODE) { fail(ip); return send(req, res, 403, { error: "Code d'installation incorrect (voir la console du serveur)." }); }
      if (!validLogin(b.login)) return send(req, res, 400, { error: "Identifiant : 2 à 40 caractères parmi a-z, 0-9, point, tiret." });
      if (!validPw(b.password)) return send(req, res, 400, { error: "Mot de passe : 12 caractères minimum." });
      const salt = crypto.randomBytes(16).toString("hex");
      USERS.push({ login: b.login, nom: String(b.nom || b.login).slice(0, 80), role: "admin", salt, hash: hashPw(b.password, salt), cree: now(), actif: true });
      saveUsers(); SETUP_CODE = null; try { fs.unlinkSync(CODE_F); } catch (e) { } setSession(req, res, b.login); console.log(`Installation terminée : compte administrateur « ${b.login} » créé.`);
      return send(req, res, 200, { ok: true });
    }
    /* ---------- connexion */
    if (p === "/connexion") return serveFile(req, res, path.join(APP, "connexion.html"));
    if (p === "/api/connexion" && req.method === "POST") {
      if (tooMany(ip)) return send(req, res, 429, { error: "Trop de tentatives, réessayez dans 15 minutes." });
      const b = await jbody(req); const usr = USERS.find(x => x.login === String(b.login || "").trim().toLowerCase() && x.actif !== false);
      if (!usr || !checkPw(usr, b.password || "")) { fail(ip); return send(req, res, 401, { error: "Identifiant ou mot de passe incorrect." }); }
      usr.derniereConnexion = now(); saveUsers(); setSession(req, res, usr.login); return send(req, res, 200, { ok: true });
    }
    if (p === "/api/deconnexion" && req.method === "POST") { const t = cookies(req).hepvd_s; if (t) { delete SESS[t]; saveSess(); } res.setHeader("Set-Cookie", "hepvd_s=; Path=/; Max-Age=0"); return send(req, res, 200, { ok: true }); }
    /* ---------- contrôle d'accès */
    const me = currentUser(req);
    if (!me && !PUBLIC.has(p)) { if (p.startsWith("/api/")) return send(req, res, 401, { error: "non connecté", redirect: "connexion" }); res.writeHead(302, { Location: "/connexion" }); return res.end(); }
    const canEdit = me && me.role !== "lecteur", isAdmin = me && me.role === "admin";
    /* ---------- API */
    if (p === "/api/whoami") return send(req, res, 200, { user: me, auth: !OPEN, docsBase: PROJECT_ROOT ? "projet/" : null, storage: store.kind });
    if (p === "/api/data" && req.method === "GET") { const s = store.get(); if (!s) return send(req, res, 404, { error: "vide" }); return send(req, res, 200, `{"rev":${s.rev},"data":${s.data}}`); }
    if (p === "/api/data" && req.method === "PUT") {
      if (!canEdit) return send(req, res, 403, { error: "Accès en lecture seule" });
      const b = await jbody(req), cur = store.get(), rev = cur ? cur.rev : 0;
      if ((b.rev || 0) !== rev) return send(req, res, 409, { rev });
      if (!b.data || !Array.isArray(b.data.taches) || !Array.isArray(b.data.phases)) return send(req, res, 400, { error: "données invalides" });
      store.put(rev + 1, JSON.stringify(b.data), me.nom, b.journal || []);
      return send(req, res, 200, { rev: rev + 1 });
    }
    if (p === "/api/snapshots") return send(req, res, 200, { snapshots: store.snapshots() });
    if (p.startsWith("/api/snapshots/")) { const d = store.snapshot(p.split("/").pop()); return d ? send(req, res, 200, d) : send(req, res, 404, {}); }
    if (p === "/api/journal") return send(req, res, 200, { journal: store.journal(Math.min(20000, +(u.searchParams.get("limit") || 1000))) });
    if (p === "/api/files" && req.method === "POST") {
      if (!canEdit) return send(req, res, 403, { error: "Accès en lecture seule" });
      const buf = await body(req, 200e6), sha = crypto.createHash("sha256").update(buf).digest("hex"), name = path.basename(u.searchParams.get("name") || "fichier").replace(/[^\w.\- ()À-ÿ]/g, "_");
      const id = crypto.randomUUID(), stored = `${sha.slice(0, 12)}_${name}`; fs.writeFileSync(path.join(FILES_DIR, stored), buf);
      store.addFile({ id, doc: u.searchParams.get("doc") || "", version: u.searchParams.get("v") || "", name, size: buf.length, sha256: sha, path: stored, ts: now(), user: me.nom });
      return send(req, res, 200, { id, sha256: sha });
    }
    if (p.startsWith("/api/files/")) { const f = store.file(p.split("/").pop()); if (!f) return send(req, res, 404, {}); return serveFile(req, res, path.join(FILES_DIR, path.basename(f.path)), f.name); }
    if (p === "/api/scan") { if (!PROJECT_ROOT) return send(req, res, 404, { error: "dossier projet non configuré" }); const out = []; walk(PROJECT_ROOT, PROJECT_ROOT, out, 0); return send(req, res, 200, { root: path.basename(PROJECT_ROOT), files: out }); }
    if (p === "/api/mot-de-passe" && req.method === "POST") {
      if (OPEN || PROXY) return send(req, res, 400, { error: "Non applicable" });
      const b = await jbody(req), usr = USERS.find(x => x.login === me.login);
      if (!checkPw(usr, b.ancien || "")) { fail(ip); return send(req, res, 403, { error: "Mot de passe actuel incorrect." }); }
      if (!validPw(b.nouveau)) return send(req, res, 400, { error: "Nouveau mot de passe : 12 caractères minimum." });
      usr.salt = crypto.randomBytes(16).toString("hex"); usr.hash = hashPw(b.nouveau, usr.salt); saveUsers(); return send(req, res, 200, { ok: true });
    }
    if (p === "/api/utilisateurs" || p.startsWith("/api/utilisateurs/")) {
      if (!isAdmin || OPEN) return send(req, res, 403, { error: "Réservé aux administrateurs" });
      const login = p.split("/")[3];
      if (req.method === "GET") return send(req, res, 200, { utilisateurs: USERS.map(pubUser) });
      if (req.method === "POST") {
        const b = await jbody(req); b.login = String(b.login || "").trim().toLowerCase();
        if (!validLogin(b.login) || USERS.some(x => x.login === b.login)) return send(req, res, 400, { error: "Identifiant invalide ou déjà utilisé." });
        if (!ROLES.includes(b.role)) return send(req, res, 400, { error: "Rôle invalide" });
        if (!validPw(b.password)) return send(req, res, 400, { error: "Mot de passe : 12 caractères minimum." });
        const salt = crypto.randomBytes(16).toString("hex"); USERS.push({ login: b.login, nom: String(b.nom || b.login).slice(0, 80), role: b.role, salt, hash: hashPw(b.password, salt), cree: now(), actif: true }); saveUsers();
        return send(req, res, 200, { ok: true });
      }
      const usr = USERS.find(x => x.login === login); if (!usr) return send(req, res, 404, { error: "Inconnu" });
      if (req.method === "PUT") {
        const b = await jbody(req);
        if (b.nom) usr.nom = String(b.nom).slice(0, 80);
        if (b.role) { if (!ROLES.includes(b.role)) return send(req, res, 400, { error: "Rôle invalide" }); if (usr.login === me.login && b.role !== "admin") return send(req, res, 400, { error: "Vous ne pouvez pas retirer vos propres droits d'administration." }); usr.role = b.role; }
        if (typeof b.actif === "boolean") { if (usr.login === me.login && !b.actif) return send(req, res, 400, { error: "Vous ne pouvez pas désactiver votre propre compte." }); usr.actif = b.actif; if (!b.actif) Object.keys(SESS).forEach(k => { if (SESS[k].login === usr.login) delete SESS[k]; }); saveSess(); }
        if (b.password) { if (!validPw(b.password)) return send(req, res, 400, { error: "Mot de passe : 12 caractères minimum." }); usr.salt = crypto.randomBytes(16).toString("hex"); usr.hash = hashPw(b.password, usr.salt); }
        saveUsers(); return send(req, res, 200, { ok: true });
      }
      return send(req, res, 405, {});
    }
    if (p.startsWith("/api/")) return send(req, res, 404, {});
    /* ---------- fichiers */
    if (p.startsWith("/projet/")) { if (!PROJECT_ROOT) return send(req, res, 404, "Dossier projet non configuré", "text/plain; charset=utf-8"); const f = inside(PROJECT_ROOT, p.slice(8)); if (!f || f.startsWith(DATA_DIR)) return send(req, res, 403, "Interdit", "text/plain"); return serveFile(req, res, f); }
    const f = inside(APP, p === "/" ? "index.html" : p.slice(1));
    const rel = f ? path.relative(APP, f).split(path.sep).join("/") : "";
    if (!f || f.startsWith(DATA_DIR + path.sep) && !/^data\/projet-data\.js$/.test(rel) || /^(data\/(?!projet-data\.js)|\.git|node_modules)|(^|\/)\.|\.(sqlite|ndjson|command)$|^server\.js$|^package(-lock)?\.json$/.test(rel)) return send(req, res, 403, "Interdit", "text/plain; charset=utf-8");
    return serveFile(req, res, f);
  } catch (e) { console.error(e); send(req, res, 500, { error: "Erreur serveur" }); }
}).listen(PORT, HOST, () => {
  console.log(`Plateforme HEPVD v0.3.0 — écoute sur ${HOST}:${PORT} · stockage : ${store.kind} · données : ${DATA_DIR}${PROJECT_ROOT ? " · dossier projet : " + PROJECT_ROOT : ""} · authentification : ${OPEN ? "désactivée (local)" : PROXY ? "proxy" : "comptes"}`);
  if (SETUP_CODE) console.log(`\n=== PREMIÈRE INSTALLATION ===\nOuvrez le site et saisissez le code d'installation${ARGS["code-installation"] || process.env.SETUP_CODE ? " indiqué dans la commande d'exécution" : " : " + SETUP_CODE + " (aussi dans " + CODE_F + ")"}\n`);
});
