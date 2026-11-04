// Compare un fichier de contenu anglais au français : même structure, mêmes réponses.
// Usage : node scripts/check-en.mjs gaule [autres-ids…]
import fs from "node:fs";
import vm from "node:vm";
const load = (f) => { const sb = { window: {} }; sb.window.HISTORIA_CONTENT = {}; sb.HISTORIA_CONTENT = sb.window.HISTORIA_CONTENT; vm.runInNewContext(fs.readFileSync(f, "utf8"), sb); return Object.values(sb.window.HISTORIA_CONTENT)[0]; };
let bad = 0;
const err = (m) => { bad++; console.log("  ✗ " + m); };
for (const id of process.argv.slice(2)) {
  console.log(id);
  let fr, en;
  try { fr = load(`www/js/eras/${id}.js`); en = load(`www/js/eras/en/${id}.js`); } catch (e) { err("chargement : " + e.message); continue; }
  if (en.levels.length !== fr.levels.length) { err("nb de niveaux"); continue; }
  if ((en.cast || []).length !== (fr.cast || []).length) err("nb de personnages");
  (fr.cast || []).forEach((c, k) => { const e = (en.cast || [])[k]; if (e) for (const key of ["n", "r", "d", "b"]) if (!e[key]) err(`cast ${k} champ ${key}`); });
  fr.levels.forEach((lv, l) => {
    const el = en.levels[l], at = (i) => `niveau ${l + 1} défi ${i + 1}`;
    if (!el.title) err(`niveau ${l + 1} titre`);
    const a = lv.lesson, b = el.lesson || {};
    for (const key of ["d", "t", "hook", "p"]) if (!b[key]) err(`niveau ${l + 1} fiche.${key}`);
    if ((b.fun || []).length !== (a.fun || []).length) err(`niveau ${l + 1} nb d'anecdotes`);
    const hs = (s) => (s || "").split("\n\n").filter((x) => x.startsWith("## ")).length;
    const ps = (s) => (s || "").split("\n\n").filter((x) => !x.startsWith("## ")).length;
    if (hs(a.p) !== hs(b.p) || ps(a.p) !== ps(b.p)) err(`niveau ${l + 1} intertitres/paragraphes ${hs(a.p)}/${ps(a.p)} vs ${hs(b.p)}/${ps(b.p)}`);
    if (el.items.length !== lv.items.length) { err(`niveau ${l + 1} nb de défis`); return; }
    lv.items.forEach((it, i) => {
      const x = el.items[i];
      if (x.type !== it.type) return err(`${at(i)} type`);
      if (!x.q) err(`${at(i)} q`);
      if (it.e && !x.e) err(`${at(i)} e`);
      if (it.type === "qcm" && (!x.c || x.w.length !== it.w.length)) err(`${at(i)} qcm`);
      if (it.type === "tf" && x.a !== it.a) err(`${at(i)} tf réponse différente`);
      if (it.type === "order" && (x.items.length !== it.items.length || x.items.some((o, k) => !o.t || !o.y))) err(`${at(i)} order`);
      if (it.type === "match" && (x.pairs.length !== it.pairs.length || x.pairs.some((p) => !p[0] || !p[1]))) err(`${at(i)} match`);
      if (it.type === "year") for (const key of ["y", "min", "max", "tol"]) if (x[key] !== it[key]) err(`${at(i)} year.${key}`);
    });
  });
}
console.log(bad ? `${bad} problème(s)` : "OK");
process.exit(bad ? 1 : 0);
