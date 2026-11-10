/* Plateforme — Dossier projet : explorateur des fichiers synchronisés et visionneuses en ligne */
"use strict";
let FICH = null, fichDossier = "", fichQ = "", fichOuverts = {};
const VENDOR = { md: ["assets/vendor/marked.min.js", "assets/vendor/purify.min.js"], docx: ["assets/vendor/mammoth.browser.min.js", "assets/vendor/purify.min.js"], xlsx: ["assets/vendor/exceljs.min.js"] };
const _scripts = {};
function chargerScript(src) { return _scripts[src] = _scripts[src] || new Promise((ok, ko) => { const s = document.createElement("script"); s.src = src; s.onload = ok; s.onerror = () => ko(new Error("Chargement impossible : " + src)); document.head.appendChild(s); }); }
const chargerTous = l => l.reduce((p, s) => p.then(() => chargerScript(s)), Promise.resolve());
const extOf = p => (String(p).match(/\.([a-z0-9]+)$/i) || [, ""])[1].toLowerCase();
const TYPES_F = { md: "Markdown", pdf: "PDF", docx: "Word", doc: "Word", xlsx: "Excel", xls: "Excel", csv: "CSV", pptx: "PowerPoint", ppt: "PowerPoint", png: "Image", jpg: "Image", jpeg: "Image", gif: "Image", webp: "Image", svg: "Image", txt: "Texte", json: "JSON", html: "HTML", fig: "Figma", zip: "Archive", mp4: "Vidéo", mov: "Vidéo", mp3: "Audio", m4a: "Audio" };
const typeF = p => TYPES_F[extOf(p)] || extOf(p).toUpperCase() || "Fichier";
const urlF = (p, dl) => "projet/" + p.split("/").map(encodeURIComponent).join("/") + (dl ? "?dl=1" : "");
const lienF = p => "#fichier/" + p.split("/").map(encodeURIComponent).join("/");
const tailleF = n => n >= 1e6 ? (n / 1e6).toLocaleString("fr-CH", { maximumFractionDigits: 1 }) + " Mo" : n >= 1e3 ? Math.round(n / 1e3) + " ko" : n + " o";
/* ---------- formats associés : un même document en plusieurs formats (Word + PDF…), reconnu par le nom de fichier sans extension */
const baseF = p => String(p || "").replace(/\.[a-z0-9]+$/i, "");
const ORDRE_F = ["docx", "doc", "pdf", "xlsx", "xls", "pptx", "ppt", "md", "csv"];
let FMAP = null;
function indexFormats(F) {
  const m = {}; F.files.forEach(f => (m[baseF(f.path)] = m[baseF(f.path)] || []).push(f.path));
  const rang = x => { const i = ORDRE_F.indexOf(extOf(x)); return i < 0 ? 99 : i; };
  Object.values(m).forEach(l => l.sort((a, b) => rang(a) - rang(b)));
  return m;
}
const formatsDe = p => { if (!p || !FICH) return []; if (!FMAP) FMAP = indexFormats(FICH); return FMAP[baseF(p)] || []; };
/* Boutons « Word ↓ PDF ↓ » : ouvrir dans la visionneuse ou télécharger chaque format présent dans le dossier synchronisé */
function boutonsFormats(p) {
  const l = formatsDe(p); if (!l.length) return "";
  return `<span class="fmts">${l.map(f => { const t = typeF(f), nom = f.split("/").pop(); return `<span class="fmt"><a class="btn sec sm" href="${lienF(f)}" target="_blank" rel="noopener" title="Ouvrir ${esc(nom)}">${esc(t)}</a><a class="btn ghost sm" href="${urlF(f, true)}" download title="Télécharger ${esc(nom)}" aria-label="Télécharger la version ${esc(t)}">↓</a></span>`; }).join("")}</span>`;
}
/* Remplit les emplacements [data-fmts] une fois la liste des fichiers chargée ; sinon le contenu initial (lien simple) reste affiché */
function remplirFormats(scope) { $$("[data-fmts]", scope).forEach(s => { const h = boutonsFormats(s.dataset.fmts); s.innerHTML = h || `<span class="small muted" title="Fichier absent du dossier synchronisé">${esc(s.dataset.alt || "Fichier non synchronisé")}</span>`; }); }
function avecFormats(scope) { if (!SERVER || !CFG.docsBase) return; if (FICH) return remplirFormats(scope); chargerFichiers().then(() => remplirFormats(scope)).catch(() => { }); }
const docDe = p => { const b = baseF(p); return S.documents.find(d => d.chemin === p || (d.versions || []).some(v => v.chemin === p)) || S.documents.find(d => (d.chemin && baseF(d.chemin) === b) || (d.versions || []).some(v => v.chemin && baseF(v.chemin) === b)); };

async function chargerFichiers(force) {
  if (FICH && !force) return FICH;
  const r = await apiFetch("scan"); if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || "Dossier projet indisponible");
  const j = await r.json();
  FMAP = null;
  FICH = { files: j.files.filter(f => !/^00_PILOTAGE\/Tableau-de-bord\//.test(f.path)).sort((a, b) => a.path.localeCompare(b.path, "fr", { numeric: true })), t: Date.now() };
  return FICH;
}
function arbre(files) {
  const root = { nom: "", chemin: "", dossiers: {}, fichiers: [] };
  files.forEach(f => { const parts = f.path.split("/"); let n = root; parts.slice(0, -1).forEach((seg, i) => { n = n.dossiers[seg] = n.dossiers[seg] || { nom: seg, chemin: parts.slice(0, i + 1).join("/"), dossiers: {}, fichiers: [] }; }); n.fichiers.push(f); });
  return root;
}
function noeud(root, chemin) { let n = root; if (!chemin) return n; for (const seg of chemin.split("/")) { n = n.dossiers[seg]; if (!n) return null; } return n; }
const compte = n => n.fichiers.length + Object.values(n.dossiers).reduce((t, d) => t + compte(d), 0);
const phaseDe = nom => S.phases.find(p => p.dossier === nom);

function vFichiers() {
  if (!SERVER || !CFG.docsBase) return el(`<p class="muted intro">Le dossier projet n'est consultable qu'en mode serveur.</p>`);
  const wrap = el(`<p class="muted intro">Fichiers du dossier <b>HEPVD_Refonte-Web</b>, consultables en ligne (lecture seule). La version de référence reste sur le Mac : elle est envoyée ici par le script <code>Synchroniser-le-projet.command</code>.</p><div id="fxRoot"><p class="muted">Chargement…</p></div>`);
  chargerFichiers().then(F => rendreExplorateur($("#fxRoot", wrap), F)).catch(e => { $("#fxRoot", wrap).innerHTML = `<p class="red">${esc(e.message)}</p>`; });
  return wrap;
}
function rendreExplorateur(box, F) {
  const root = arbre(F.files);
  if (!F.files.length) { box.innerHTML = `<div class="card"><h2>Aucun fichier synchronisé</h2><p>Pour publier le dossier projet : <b>Console d'administration → Synchronisation</b> pour créer un jeton, puis double-cliquer <code>00_PILOTAGE/Tableau-de-bord/Synchroniser-le-projet.command</code> sur le Mac.</p></div>`; return; }
  if (fichDossier && !noeud(root, fichDossier)) fichDossier = "";
  const ouvrirChemin = c => { const parts = c ? c.split("/") : []; parts.forEach((_, i) => fichOuverts[parts.slice(0, i + 1).join("/")] = true); };
  ouvrirChemin(fichDossier);
  const tree = n => Object.values(n.dossiers).sort((a, b) => a.nom.localeCompare(b.nom, "fr", { numeric: true })).map(d => { const ph = phaseDe(d.nom), has = Object.keys(d.dossiers).length, op = fichOuverts[d.chemin];
    return `<li><div class="fx-t ${d.chemin === fichDossier ? "on" : ""}">${has ? `<button type="button" class="fx-tog" data-tog="${esc(d.chemin)}" aria-expanded="${!!op}" aria-label="${op ? "Replier" : "Déplier"} ${esc(d.nom)}">${op ? "▾" : "▸"}</button>` : '<span class="fx-tog"></span>'}<a href="#" data-dir="${esc(d.chemin)}">${ph ? `<span class="dot" style="background:${ph.couleur}"></span>` : ""}${esc(d.nom)}</a><span class="fx-n">${compte(d)}</span></div>${has && op ? `<ul>${tree(d)}</ul>` : ""}</li>`; }).join("");
  const n = noeud(root, fichDossier), q = norm(fichQ.trim());
  const liste = q ? F.files.filter(f => q.split(/\s+/).every(w => norm(f.path).includes(w))).slice(0, 400) : null;
  const ligneF = f => { const d = docDe(f.path), nom = f.path.split("/").pop();
    return `<tr><td><a href="${lienF(f.path)}" class="fx-f"><span class="fx-ext fx-${extOf(f.path)}">${esc(typeF(f.path))}</span><span>${esc(nom)}${liste ? `<span class="small muted fx-p">${esc(f.path.split("/").slice(0, -1).join(" / "))}</span>` : ""}</span></a></td><td>${d ? docChip(d) : ""}</td><td class="num small">${tailleF(f.size)}</td><td class="small nowrap">${fdt(f.mtime)}</td><td class="nowrap"><a class="btn ghost sm" href="${urlF(f.path, true)}" download title="Télécharger ${esc(nom)}" aria-label="Télécharger ${esc(nom)}">↓</a></td></tr>`; };
  const crumbs = ["<a href='#' data-dir=''>HEPVD_Refonte-Web</a>"].concat(fichDossier ? fichDossier.split("/").map((seg, i, a) => `<a href="#" data-dir="${esc(a.slice(0, i + 1).join("/"))}">${esc(seg)}</a>`) : []).join(" / ");
  const sous = n ? Object.values(n.dossiers).sort((a, b) => a.nom.localeCompare(b.nom, "fr", { numeric: true })) : [];
  box.innerHTML = `<div class="bar"><div class="searchbox" style="flex:1;max-width:560px"><span aria-hidden="true">⌕</span><input id="fxQ" type="search" placeholder="Rechercher un fichier (nom, dossier, phase…)" value="${esc(fichQ)}" aria-label="Rechercher un fichier"></div><span class="grow"></span><span class="small muted">${F.files.length} fichiers · mis à jour ${fdt(new Date(F.t).toISOString())}</span><button class="btn sec sm" id="fxR">Actualiser</button></div>
    <div class="fx">
      <nav class="card fx-tree" aria-label="Arborescence du dossier projet"><ul><li><div class="fx-t ${!fichDossier ? "on" : ""}"><span class="fx-tog"></span><a href="#" data-dir="">HEPVD_Refonte-Web</a><span class="fx-n">${F.files.length}</span></div><ul>${tree(root)}</ul></li></ul></nav>
      <section class="card fx-main">${liste ? `<h2>${liste.length} résultat(s)</h2>` : `<div class="small fx-crumb">${crumbs}</div>`}
        <div class="tw flat"><table><thead><tr><th>Nom</th><th>Fiche</th><th>Taille</th><th>Modifié le</th><th></th></tr></thead><tbody>
        ${liste ? (liste.map(ligneF).join("") || '<tr><td colspan="5" class="empty">Aucun fichier</td></tr>') : sous.map(d => `<tr><td><a href="#" data-dir="${esc(d.chemin)}" class="fx-f"><span class="fx-ext fx-dir">Dossier</span><span>${esc(d.nom)}</span></a></td><td></td><td class="num small">${compte(d)} fichier(s)</td><td></td><td></td></tr>`).join("") + n.fichiers.map(ligneF).join("") || '<tr><td colspan="5" class="empty">Dossier vide</td></tr>'}
        </tbody></table></div></section></div>`;
  $$("[data-dir]", box).forEach(a => a.onclick = e => { e.preventDefault(); fichDossier = a.dataset.dir; fichQ = ""; rendreExplorateur(box, F); });
  $$("[data-tog]", box).forEach(b => b.onclick = () => { fichOuverts[b.dataset.tog] = !fichOuverts[b.dataset.tog]; rendreExplorateur(box, F); });
  const qi = $("#fxQ", box); qi.oninput = () => { fichQ = qi.value; const pos = qi.selectionStart; rendreExplorateur(box, F); const n2 = $("#fxQ", box); n2.focus(); n2.setSelectionRange(pos, pos); };
  $("#fxR", box).onclick = async () => { await chargerFichiers(true); rendreExplorateur(box, FICH); toast("Liste actualisée"); };
}

/* ---------- visionneuse */
function vFichier(p) {
  const nom = p.split("/").pop(), d = docDe(p), dossier = p.split("/").slice(0, -1).join("/");
  const wrap = el(`<div class="bar"><a class="btn sec sm" href="#fichiers" id="fvBack">← ${esc(dossier ? dossier.split("/").pop() : "Dossier projet")}</a><span class="small muted fx-crumb">${esc(p.split("/").join(" / "))}</span><span class="grow"></span><span id="fvAlt"></span>${d ? `<a class="btn sec sm" href="#" id="fvDoc">Fiche ${esc(d.id)}</a>` : ""}<a class="btn sec sm" href="${urlF(p)}" target="_blank" rel="noopener">Ouvrir dans un onglet</a><a class="btn sm" href="${urlF(p, true)}" download>Télécharger</a></div>
    <div class="card fv"><div id="fvBody"><p class="muted">Chargement de l'aperçu…</p></div></div>`);
  $("#fvBack", wrap).onclick = () => { fichDossier = dossier; };
  if (d) $("#fvDoc", wrap).onclick = e => { e.preventDefault(); openDoc(d); };
  chargerFichiers().then(() => { const autres = formatsDe(p).filter(f => f !== p); $("#fvAlt", wrap).innerHTML = autres.map(f => `<a class="btn sec sm" href="${lienF(f)}" title="${esc(f.split("/").pop())}">Voir en ${esc(typeF(f))}</a>`).join(" "); }).catch(() => { });
  apercu(p, $("#fvBody", wrap)).catch(e => { $("#fvBody", wrap).innerHTML = `<p class="red">Aperçu impossible : ${esc(e.message)}</p><p><a class="btn sm" href="${urlF(p, true)}" download>Télécharger le fichier</a></p>`; });
  return wrap;
}
async function lire(p, mode) { const r = await fetch(urlF(p), { credentials: "same-origin" }); if (!r.ok) throw new Error(r.status === 404 ? "fichier introuvable (synchronisation à refaire ?)" : "erreur " + r.status); return mode === "buf" ? r.arrayBuffer() : r.text(); }
function resoudre(base, href) { if (!href || /^(https?:|mailto:|#|data:)/i.test(href)) return null; const parts = base.split("/").slice(0, -1); decodeURIComponent(href.split("#")[0]).split("/").forEach(s => { if (s === "..") parts.pop(); else if (s && s !== ".") parts.push(s); }); return parts.join("/"); }
async function apercu(p, box) {
  const e = extOf(p);
  if (e === "md" || e === "markdown") {
    await chargerTous(VENDOR.md); const txt = await lire(p);
    box.innerHTML = `<article class="md md-doc">${DOMPurify.sanitize(marked.parse(txt, { gfm: true }))}</article>`;
    $$("img", box).forEach(i => { const r = resoudre(p, i.getAttribute("src")); if (r) i.src = urlF(r); });
    $$("a[href]", box).forEach(a => { const r = resoudre(p, a.getAttribute("href")); if (r) a.href = lienF(r); else if (/^https?:/i.test(a.href)) { a.target = "_blank"; a.rel = "noopener"; } });
    return;
  }
  if (e === "pdf") { box.innerHTML = `<iframe class="fv-frame" src="${urlF(p)}" title="${esc(p.split("/").pop())}"></iframe>`; return; }
  if (["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(e)) { box.innerHTML = `<div class="fv-img"><img src="${urlF(p)}" alt="${esc(p.split("/").pop())}"></div>`; return; }
  if (["mp4", "mov", "webm"].includes(e)) { box.innerHTML = `<video controls class="fv-media" src="${urlF(p)}"></video>`; return; }
  if (["mp3", "m4a", "wav"].includes(e)) { box.innerHTML = `<audio controls src="${urlF(p)}"></audio>`; return; }
  if (e === "docx") {
    await chargerTous(VENDOR.docx); const buf = await lire(p, "buf");
    const res = await mammoth.convertToHtml({ arrayBuffer: buf });
    box.innerHTML = `<article class="md md-doc docx">${DOMPurify.sanitize(res.value)}</article>${res.messages.length ? `<p class="small muted">Aperçu simplifié : la mise en page exacte est visible dans Word (bouton Télécharger).</p>` : ""}`; return;
  }
  if (e === "xlsx" || e === "csv") {
    let feuilles = [];
    if (e === "csv") { const t = await lire(p); const sep = (t.split("\n")[0].match(/;/g) || []).length > (t.split("\n")[0].match(/,/g) || []).length ? ";" : ","; feuilles = [{ nom: p.split("/").pop(), lignes: t.replace(/^﻿/, "").split(/\r?\n/).filter(Boolean).slice(0, 1000).map(l => { const out = []; let cur = "", q = false; for (const ch of l) { if (ch === '"') q = !q; else if (ch === sep && !q) { out.push(cur); cur = ""; } else cur += ch; } out.push(cur); return out; }) }]; }
    else {
      await chargerTous(VENDOR.xlsx); const wb = new ExcelJS.Workbook(); await wb.xlsx.load(await lire(p, "buf"));
      const val = v => { if (v == null) return ""; if (v instanceof Date) return fd(v.toISOString()); if (typeof v === "object") { if ("result" in v) return val(v.result); if (v.richText) return v.richText.map(x => x.text).join(""); if (v.text) return v.text; if (v.error) return v.error; return ""; } if (typeof v === "number") return Number.isInteger(v) ? v.toLocaleString("fr-CH") : v.toLocaleString("fr-CH", { maximumFractionDigits: 2 }); return String(v); };
      wb.eachSheet(ws => { const lignes = []; let nc = 0; ws.eachRow({ includeEmpty: true }, row => { nc = Math.max(nc, row.cellCount || 0); }); nc = Math.min(Math.max(nc, ws.columnCount || 0), 40); ws.eachRow({ includeEmpty: true }, (row, i) => { if (i > 1000) return; while (lignes.length < i - 1) lignes.push([]); const l = []; for (let c = 1; c <= nc; c++) l.push(val(row.getCell(c).value)); lignes.push(l); }); feuilles.push({ nom: ws.name, lignes }); });
    }
    let k = 0;
    const rendre = () => { const f = feuilles[k]; const max = Math.max(0, ...f.lignes.map(l => { let i = l.length; while (i && l[i - 1] === "") i--; return i; }));
      box.innerHTML = `${feuilles.length > 1 ? tabs("fvs", feuilles.map((x, i) => [String(i), x.nom]), String(k)) : ""}<div class="tw flat fv-sheet"><table><tbody>${f.lignes.map(l => `<tr class="static">${l.slice(0, max).map(c => `<td${/^-?[\d\s\u202f\u2019',.]+%?$/.test(c) && c ? ' class="n"' : ''}${c.length > 40 ? ` title="${esc(c)}"` : ''}>${esc(c)}</td>`).join("")}</tr>`).join("") || '<tr><td class="empty">Feuille vide</td></tr>'}</tbody></table></div><p class="small muted">Aperçu des valeurs (formules calculées à la dernière sauvegarde, mise en forme non reproduite). Pour modifier : télécharger le fichier.</p>`;
      bindTabs(box, "fvs", i => { k = +i; rendre(); }); };
    rendre(); return;
  }
  if (["txt", "json", "log", "xml", "html", "htm", "css", "js", "command", "yml", "yaml"].includes(e)) { const t = await lire(p); box.innerHTML = `<pre class="fv-txt">${esc(t.slice(0, 500000))}</pre>`; return; }
  box.innerHTML = `<div class="fv-none"><p><b>${esc(typeF(p))}</b> — aperçu non disponible dans le navigateur pour ce format.</p><p><a class="btn sm" href="${urlF(p, true)}" download>Télécharger le fichier</a></p>${e === "pptx" ? '<p class="small muted">Astuce : exporter aussi la présentation en PDF dans le même dossier pour la consulter en ligne.</p>' : ""}${e === "fig" ? '<p class="small muted">Les fichiers Figma se consultent dans Figma : ajoutez le lien Figma dans la fiche du document.</p>' : ""}</div>`;
}
