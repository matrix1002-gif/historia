// Vérifie le format d'un fichier de contenu : node scripts/validate-content.mjs www/js/eras/gaule.js
import fs from "node:fs";
import vm from "node:vm";

const errors = [];
const err = (m) => errors.push(m);
const isStr = (s, min = 1, max = 100000) => typeof s === "string" && s.trim().length >= min && s.length <= max;

for (const file of process.argv.slice(2)) {
  const sandbox = { window: {} };
  sandbox.window.HISTORIA_CONTENT = {};
  sandbox.HISTORIA_CONTENT = sandbox.window.HISTORIA_CONTENT;
  try { vm.runInNewContext(fs.readFileSync(file, "utf8"), sandbox); } catch (e) { err(`${file}: ne se charge pas (${e.message})`); continue; }
  const ids = Object.keys(sandbox.window.HISTORIA_CONTENT);
  if (ids.length !== 1) { err(`${file}: doit définir exactement une époque`); continue; }
  const id = ids[0], era = sandbox.window.HISTORIA_CONTENT[id];
  const at = (l, i) => `${id} niveau ${l + 1} défi ${i + 1}`;
  if (!isStr(era.intro, 40, 400)) err(`${id}: intro de 40 à 400 caractères`);
  if (!Array.isArray(era.levels) || era.levels.length !== 10) { err(`${id}: il faut 10 niveaux`); continue; }
  const seenQ = new Set();
  era.levels.forEach((lv, l) => {
    if (!isStr(lv.title, 3, 42)) err(`${id} niveau ${l + 1}: titre de 3 à 42 caractères`);
    const le = lv.lesson || {};
    if (!isStr(le.d, 2, 40) || !isStr(le.t, 3, 60)) err(`${id} niveau ${l + 1}: fiche (d, t) manquante ou trop longue`);
    if (!isStr(le.p, 2800, 5200)) err(`${id} niveau ${l + 1}: texte de la fiche entre 2800 et 5200 caractères (actuel ${(le.p || "").length})`);
    else {
      const blocks = le.p.split("\n\n");
      const body = blocks.filter((b) => !b.startsWith("## "));
      if (body.length < 5 || body.length > 9) err(`${id} niveau ${l + 1}: il faut 5 à 9 paragraphes de texte (actuel ${body.length})`);
      if (blocks.filter((b) => b.startsWith("## ")).length < 2) err(`${id} niveau ${l + 1}: au moins 2 intertitres "## Titre" (sur leur propre bloc)`);
      blocks.filter((b) => b.startsWith("## ")).forEach((b) => { if (b.length > 60 || b.includes("\n")) err(`${id} niveau ${l + 1}: intertitre trop long ou multiligne`); });
      if (body.some((b) => b.length > 900)) err(`${id} niveau ${l + 1}: un paragraphe dépasse 900 caractères`);
    }
    if (!isStr(le.hook, 40, 280)) err(`${id} niveau ${l + 1}: hook (accroche) de 40 à 280 caractères`);
    if (!Array.isArray(le.fun) || le.fun.length < 2 || le.fun.length > 3 || le.fun.some((f) => !isStr(f, 50, 320))) err(`${id} niveau ${l + 1}: fun = 2 ou 3 anecdotes de 50 à 320 caractères`);
    if (!Array.isArray(lv.items) || lv.items.length !== 10) { err(`${id} niveau ${l + 1}: il faut 10 défis`); return; }
    const count = { qcm: 0, tf: 0, order: 0, match: 0, year: 0 };
    lv.items.forEach((it, i) => {
      const w = at(l, i);
      if (!(it.type in count)) { err(`${w}: type inconnu`); return; }
      count[it.type]++;
      if (!isStr(it.q, 10, 220)) err(`${w}: énoncé de 10 à 220 caractères`);
      if (seenQ.has(it.q)) err(`${w}: énoncé en double dans l'époque`);
      seenQ.add(it.q);
      if (it.type !== "order" && it.type !== "match" || it.e) { if (!isStr(it.e, 30, 380)) err(`${w}: explication de 30 à 380 caractères`); }
      if (it.type === "qcm") {
        if (!isStr(it.c, 1, 70)) err(`${w}: bonne réponse c (1 à 70 car.)`);
        if (!Array.isArray(it.w) || it.w.length !== 3 || !it.w.every((x) => isStr(x, 1, 70))) err(`${w}: w doit contenir 3 mauvaises réponses (1 à 70 car.)`);
        else if (new Set([it.c, ...it.w].map((x) => x.trim().toLowerCase())).size !== 4) err(`${w}: les 4 réponses doivent être différentes`);
      } else if (it.type === "tf") {
        if (typeof it.a !== "boolean") err(`${w}: a doit être true ou false`);
      } else if (it.type === "order") {
        if (!Array.isArray(it.items) || it.items.length < 4 || it.items.length > 5 || !it.items.every((o) => isStr(o.t, 2, 46) && isStr(o.y, 1, 30))) err(`${w}: order demande 4 ou 5 éléments {t (≤46 car.), y}`);
      } else if (it.type === "match") {
        if (!Array.isArray(it.pairs) || it.pairs.length !== 4 || !it.pairs.every((p) => Array.isArray(p) && p.length === 2 && isStr(p[0], 1, 42) && isStr(p[1], 1, 42))) err(`${w}: match demande 4 paires [gauche, droite] (≤42 car.)`);
        else if (new Set(it.pairs.map((p) => p[0])).size !== 4 || new Set(it.pairs.map((p) => p[1])).size !== 4) err(`${w}: éléments en double dans match`);
      } else if (it.type === "year") {
        const ok = [it.y, it.min, it.max, it.tol].every(Number.isInteger);
        if (!ok) err(`${w}: y, min, max, tol doivent être des entiers`);
        else if (!(it.min < it.y && it.y < it.max) || it.max - it.min < 20 || it.tol < 1) err(`${w}: il faut min < y < max, max-min ≥ 20, tol ≥ 1`);
      }
    });
    const want = { qcm: 5, tf: 2, order: 1, match: 1, year: 1 };
    for (const t in want) if (count[t] !== want[t]) err(`${id} niveau ${l + 1}: ${count[t]} défis "${t}" au lieu de ${want[t]}`);
  });
  if (!Array.isArray(era.cast) || era.cast.length !== 5) err(`${id}: cast = 5 personnages`);
  else era.cast.forEach((c, i) => {
    if (!isStr(c.n, 3, 34) || !isStr(c.r, 5, 44) || !isStr(c.d, 3, 26) || !isStr(c.b, 90, 300)) err(`${id} personnage ${i + 1}: n ≤34, r 5–44, d ≤26, b 90–300 caractères`);
  });
  if (!errors.length) console.log(`${id} : OK (${era.levels.length} niveaux, ${seenQ.size} défis)`);
}
if (errors.length) { console.log(errors.join("\n")); process.exit(1); }
