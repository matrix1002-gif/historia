(() => {
  "use strict";

  /* ===== Réglages ===== */
  const CONFIG = {
    ads: false,          // le bandeau réel est géré par ads.js (AdMob)
    questionsPerDaily: 5,
    xpPerNewAnswer: 10,
    xpLevelFirst: 15,    // première réussite d'un niveau
    xpSeal: 100,         // sceau d'époque (tous les niveaux réussis)
    xpDailyBonus: 20,
    passMin: 5           // bonnes réponses (sur 10) pour réussir un niveau
  };
  const KEY = "historia.v2";
  const Art = window.HistoriaArt;

  /* ===== Icônes ===== */
  const SVG = (inner, extra = "") =>
    `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${inner}</svg>`;

  const LIS_PETAL = "M21.5 27C21 22 17 17.5 11 17.5c-4 0-6 3-5 6 1 3 4.5 3.8 7 2.6-2 2.4-.5 5.4 2.6 5.4 2.6 0 4.6-1.6 5.9-3.2z";
  const ICONS = {
    helmet: SVG('<path d="M12 31a12 12 0 0 1 24 0z"/><path d="M10 35h28"/><path d="M13 22C8 21 5 17 4 10c5 1 9 4 11 8"/><path d="M35 22c5-1 8-5 9-12-5 1-9 4-11 8"/><path d="M24 19v12"/>'),
    celtic: SVG('<circle cx="24" cy="20" r="9"/><path d="M24 5v38M10 20h28"/><path d="M18 43h12"/>'),
    crown: SVG('<path d="M8 34L6 16l11 9 7-13 7 13 11-9-2 18z"/><path d="M9 40h30"/>'),
    book: SVG('<path d="M24 12c-5-3-12-3-17-1v26c5-2 12-2 17 1 5-3 12-3 17-1V11c-5-2-12-2-17 1z"/><path d="M24 12v26"/>'),
    sword: SVG('<path d="M24 4l3.5 7v19h-7V11z"/><path d="M14 30h20"/><path d="M24 30v10"/><circle cx="24" cy="43" r="2"/>'),
    jerusalem: SVG('<path d="M24 5v38M5 24h38"/><path d="M17 5h14M17 43h14M5 17v14M43 17v14"/><path d="M14 11v6M11 14h6M34 11v6M31 14h6M14 31v6M11 34h6M34 31v6M31 34h6"/>'),
    lis: SVG(`<path fill="currentColor" stroke="none" d="M24 3c-4.5 5.5-5.6 11.5-3.4 18.2 1 2.8 2.2 4.6 3.4 5.8 1.2-1.2 2.4-3 3.4-5.8C29.600 14.500 28.500 8.500 24 3z"/><path fill="currentColor" stroke="none" d="${LIS_PETAL}"/><path fill="currentColor" stroke="none" transform="translate(48 0) scale(-1 1)" d="${LIS_PETAL}"/><path fill="currentColor" stroke="none" d="M13 33h22v3.4H13z"/><path fill="currentColor" stroke="none" d="M24 37.600c-2 2.200-3.200 4.600-3.800 7.400 2-.4 3.200-1.400 3.800-2.600.6 1.200 1.800 2.200 3.800 2.600-.6-2.800-1.800-5.200-3.800-7.400z"/>`),
    scroll: SVG('<path d="M15 7h22a3 3 0 0 1 3 3v26a5 5 0 0 1-5 5H13a5 5 0 0 0 5-5V10a3 3 0 0 0-3-3z"/><path d="M15 7a3 3 0 0 0-3 3v3h6"/><path d="M24 16h10M24 22h10M24 28h6"/>')
  };
  const UI = {
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    go: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>',
    check: '<svg class="mark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.500l4.500 4.500L19 7.500"/></svg>',
    cross: '<svg class="mark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    flame: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2c1 4 5 6 5 11a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-4-1-6 1-10z"/></svg>',
    star: (on, cls = "") => `<svg class="${on ? "star-on" : "star-off"} ${cls}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.500l2.900 6.100 6.600.8-4.900 4.600 1.300 6.600L12 17.300l-5.900 3.300 1.300-6.600L2.500 9.400l6.600-.8z"/></svg>`,
    lisSmall: '<svg viewBox="0 0 48 48" fill="currentColor" aria-hidden="true"><path d="M24 3c-4.500 5.500-5.600 11.500-3.400 18.200 1 2.800 2.200 4.600 3.400 5.800 1.200-1.200 2.400-3 3.400-5.800C29.600 14.500 28.500 8.500 24 3z"/><path d="M13 33h22v3.400H13z"/></svg>'
  };
  Object.assign(ICONS, Art.ICONS_EXTRA);
  UI.lock = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';
  UI.book = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 6c-2.500-1.500-6-1.500-8.500-.5v13c2.500-1 6-1 8.500.5 2.500-1.500 6-1.500 8.500-.5v-13C18 4.500 14.500 4.500 12 6z"/><path d="M12 6v13"/></svg>';
  UI.seal = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="10" r="7"/><path d="M8 15l-2 7 6-3 6 3-2-7z"/></svg>';
  UI.sound = (on) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z"/>${on ? '<path d="M16.500 8.500a5 5 0 0 1 0 7M19 6a8.500 8.500 0 0 1 0 12"/>' : '<path d="M17 9l5 6M22 9l-5 6"/>'}</svg>`;

  const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

  const shield = (idx) => `
    <svg class="shield" viewBox="0 0 64 72" aria-hidden="true">
      <defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#213a82"/><stop offset="1" stop-color="#0b1430"/></linearGradient></defs>
      <path d="M32 3l26 9v24c0 16-12 27-26 33C18 63 6 52 6 36V12z" fill="url(#sg)" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M32 9l20 7v20c0 12-9 21-20 26-11-5-20-14-20-26V16z" fill="none" stroke="currentColor" stroke-opacity=".35" stroke-width="1.2"/>
      <text x="32" y="43" text-anchor="middle" font-family="Cinzel, Georgia, serif" font-weight="700" font-size="${ROMAN[idx].length > 2 ? 17 : 22}" fill="currentColor">${ROMAN[idx]}</text>
    </svg>`;

  /* ===== Époques : métadonnées + contenu chargé ===== */
  const ERAS = ERA_META.map((m) => {
    const c = (window.HISTORIA_CONTENT || {})[m.id];
    return Object.assign({}, m, c ? { intro: c.intro, levels: c.levels, cast: c.cast || [] } : { intro: "Cette époque arrive bientôt.", levels: [] });
  });
  const eraById = (id) => ERAS.find((e) => e.id === id);
  const playable = ERAS.filter((e) => e.levels.length);

  /* ===== Sauvegarde locale ===== */
  const defaults = () => ({ xp: 0, lv: {}, ok: {}, seals: {}, streak: { count: 0, last: "" }, daily: "", last: null, sound: true, music: true, vib: true, medals: {}, stats: {}, rec: {} });
  const load = () => {
    try {
      const s = JSON.parse(localStorage.getItem(KEY));
      if (s && typeof s === "object") { const d = Object.assign(defaults(), s); ["medals", "stats", "rec"].forEach((k) => { if (!d[k] || typeof d[k] !== "object") d[k] = {}; }); return d; }
    } catch (e) { /* stockage indisponible */ }
    return defaults();
  };
  let S = load();
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignoré */ } };

  /* ===== Outils ===== */
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const $app = document.getElementById("app");
  const pad = (n) => String(n).padStart(2, "0");
  const dayStr = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const today = () => dayStr(new Date());
  const yesterday = () => { const d = new Date(); d.setDate(d.getDate() - 1); return dayStr(d); };
  const rankIndex = (xp) => RANKS.reduce((acc, r, i) => (xp >= r.xp ? i : acc), 0);
  const plural = (n, one, many) => (n > 1 ? many : one);
  const EN = window.HI && window.HI.lang === "en";
  const HT = (fr) => (window.HI ? window.HI.t(fr) : fr);
  const fmtYear = (y) => (y < 0 ? `${-y} ${EN ? "BC" : "av. J.-C."}` : String(y));
  const buzz = (p) => { try { if (S.vib && navigator.vibrate) navigator.vibrate(p); } catch (e) { /* ignoré */ } };
  const sfx = (n) => Art.play(n, S.sound);
  const paras = (t) => String(t).split("\n\n").map((p) => `<p class="sc-text">${esc(p)}</p>`).join("");

  const shuffle = (arr, rnd = Math.random) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const seeded = (str) => {
    let h = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++) { h = Math.imul(h ^ str.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); }
    let a = h >>> 0;
    return () => {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  /* ===== Progression par niveaux ===== */
  const TYPE_LABEL = { qcm: "Question", tf: "Vrai ou faux ?", order: "Chronologie", match: "Association", year: "Devine l'année" };
  const starsOf = (id, i) => ((S.lv[id] || [])[i]) || 0;
  const unlocked = (e, i) => i === 0 || starsOf(e.id, i - 1) >= 1;
  const passedCount = (e) => e.levels.filter((_, i) => starsOf(e.id, i) >= 1).length;
  const starsTotal = (e) => e.levels.reduce((n, _, i) => n + starsOf(e.id, i), 0);
  const sealed = (e) => !!S.seals[e.id];
  const scoreStars = (right) => (right >= 9 ? 3 : right >= 7 ? 2 : right >= CONFIG.passMin ? 1 : 0);
  const bankSize = () => playable.reduce((n, e) => n + e.levels.length * 10, 0);
  const masteredTotal = () => Object.keys(S.ok).length;

  // Transforme un défi en objet jouable (ordre des choix mélangé).
  function prep(type, d, key, eraTitle, levelTitle) {
    const base = { key, type, era: eraTitle, lvl: levelTitle, q: d.q, e: d.e || "" };
    switch (type) {
      case "qcm":
        return Object.assign(base, { opts: shuffle([{ t: d.c, ok: true }, ...d.w.map((t) => ({ t, ok: false }))]), ans: d.c });
      case "tf":
        return Object.assign(base, { a: d.a, ans: d.a ? "Vrai" : "Faux" });
      case "order": {
        const sorted = d.items.map((o, rank) => Object.assign({ rank }, o));
        let items = shuffle(sorted);
        if (items.every((o, i) => o.rank === i)) items = sorted.slice().reverse();
        return Object.assign(base, { items, sorted, ans: sorted.map((o) => o.t).join(" → ") });
      }
      case "match": {
        const L = d.pairs.map((p, id) => ({ id, t: p[0] }));
        const R = d.pairs.map((p, id) => ({ id, t: p[1] }));
        return Object.assign(base, { L: shuffle(L), R: shuffle(R), pairs: d.pairs, ans: d.pairs.map((p) => `${p[0]} — ${p[1]}`).join("\n") });
      }
      case "year": {
        let v = Math.round(d.min + (d.max - d.min) * 0.37);
        if (Math.abs(v - d.y) <= Math.max(d.tol * 3, (d.max - d.min) * 0.1)) v = Math.round(d.min + (d.max - d.min) * 0.78);
        return Object.assign(base, { y: d.y, min: d.min, max: d.max, tol: d.tol, start: v, ans: fmtYear(d.y) });
      }
    }
  }
  /* La réponse d'une question facile (et un mot de la question) doivent figurer dans la fiche du chapitre. */
  const LESSON_NORM = new WeakMap();
  const normTxt = (t) => String(t).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[’']/g, " ").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
  const STOPW = new Set("le la les l un une des du de d au aux et en a the of ou an in on to is was".split(" "));
  const keyWords = (t) => normTxt(t).split(" ").filter((w) => w && !STOPW.has(w));
  const inLesson = (x, lv) => {
    let txt = LESSON_NORM.get(lv);
    if (!txt) { txt = " " + normTxt(JSON.stringify(lv.lesson) + " " + JSON.stringify(lv.items)) + " "; LESSON_NORM.set(lv, txt); }
    const a = keyWords(x.d.c);
    if (!a.length || !a.every((w) => txt.includes(w))) return false;
    return keyWords(x.d.q).some((w) => w.length >= 5 && txt.includes(w));
  };
  const levelItems = (e, i) => {
    const lv = e.levels[i];
    const items = shuffle(lv.items.map((d, k) => prep(d.type, d, `${e.id}:${i}:${k}`, e.title, lv.title)));
    // Pour varier d'une partie à l'autre : jusqu'à 6 questions de la fiche sont remplacées par des questions simples de la même époque.
    try {
      // Seules les questions dont la réponse se trouve dans la fiche (le cours) de ce chapitre peuvent être ajoutées.
      const hand = easyList().filter((x) => x.era === e.id && !isGen(x) && inLesson(x, lv));
      const near = shuffle(hand.filter((x) => x.lv === i)).concat(shuffle(hand.filter((x) => x.lv !== i)));
      const swap = near.slice(0, 6);
      const slots = shuffle(items.map((it, k) => (it.type === "qcm" ? k : -1)).filter((k) => k >= 0)).slice(0, swap.length);
      slots.forEach((k, n) => { items[k] = prep("qcm", swap[n].d, swap[n].key, e.title, lv.title); });
    } catch (err) { /* les questions de la fiche suffisent */ }
    return items;
  };

  const displayStreak = () => (S.streak.last === today() || S.streak.last === yesterday() ? S.streak.count : 0);
  const starsRow = (n, total = 3) => `<span class="stars" role="img" aria-label="${n} étoile${n > 1 ? "s" : ""} sur ${total}">${Array.from({ length: total }, (_, i) => UI.star(i < n)).join("")}</span>`;
  const adSlot = () => (CONFIG.ads ? '<div class="ad-slot" id="ad-slot" aria-label="Publicité">Publicité</div>' : "");

  // Prochain niveau à jouer (reprise).
  function nextTarget() {
    const firstOpen = (e) => e.levels.findIndex((_, i) => starsOf(e.id, i) < 1);
    const tryEra = (e) => { if (!e) return null; const i = firstOpen(e); return i >= 0 ? { e, i } : null; };
    return (S.last && tryEra(eraById(S.last.era))) || playable.map(tryEra).find(Boolean) || null;
  }

  /* ===== Personnages à collectionner ===== */
  // Le personnage k (0 à 4) d'une époque se débloque en réussissant le niveau 2k+2.
  const castOf = (e) => e.cast || [];
  const charUnlocked = (e, k) => starsOf(e.id, 2 * k + 1) >= 1;
  const charsTotal = () => ERAS.reduce((n, e) => n + castOf(e).length, 0);
  const charsOwned = () => ERAS.reduce((n, e) => n + castOf(e).filter((_, k) => charUnlocked(e, k)).length, 0);
  const ownedKeys = () => new Set(ERAS.flatMap((e) => castOf(e).map((_, k) => (charUnlocked(e, k) ? `${e.id}:${k}` : null)).filter(Boolean)));
  const initials = (n) => n.split(/[\s-]+/).filter((w) => /^[A-ZÀ-ÖÉ]/.test(w)).slice(0, 2).map((w) => w[0]).join("") || n[0];
  function cameo(e, k, locked) {
    const c = castOf(e)[k];
    const legend = k === 4;
    const ring = legend ? "#f2d16b" : "#d8b565";
    return `<svg class="cameo ${locked ? "locked" : ""} ${legend ? "legend" : ""}" viewBox="0 0 80 96" aria-hidden="true">
      <defs><radialGradient id="cg${e.id}${k}" cx=".5" cy=".35" r=".8"><stop offset="0" stop-color="${locked ? "#2a3566" : e.accent}" stop-opacity="${locked ? 1 : 0.9}"/><stop offset="1" stop-color="#0b1430"/></radialGradient></defs>
      <path d="M40 3l33 11v30c0 22-15 36-33 45C22 80 7 66 7 44V14z" fill="url(#cg${e.id}${k})" stroke="${locked ? "#4a5686" : ring}" stroke-width="${legend ? 4 : 3}" stroke-linejoin="round"/>
      ${locked
        ? '<g transform="translate(26 30)" fill="none" stroke="#7d88b8" stroke-width="3" stroke-linecap="round"><rect x="3" y="14" width="22" height="17" rx="3"/><path d="M8 14v-5a6 6 0 0 1 12 0v5"/></g>'
        : `<g transform="translate(16 16) scale(1.1)" color="#f3ead2" opacity=".22">${ICONS[e.icon]}</g>
           <text x="40" y="58" text-anchor="middle" font-family="Cinzel, Georgia, serif" font-weight="700" font-size="${initials(c.n).length > 1 ? 26 : 30}" fill="#f3ead2" stroke="#0b1430" stroke-width=".6">${esc(initials(c.n))}</text>`}
      ${legend && !locked ? '<path d="M24 12l5 6 6-8 5 8 6-6 5 6" fill="none" stroke="#f2d16b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' : ""}
    </svg>`;
  }

  /* ===== Série de connexion ===== */
  function touchStreak() {
    if (S.streak.last !== today()) {
      S.streak = { count: S.streak.last === yesterday() ? S.streak.count + 1 : 1, last: today() };
    }
    S.stats.bestStreak = Math.max(S.stats.bestStreak || 0, S.streak.count);
  }

  /* ===== Médailles ===== */
  const levelsPassed = () => ERAS.reduce((n, e) => n + passedCount(e), 0);
  const threeStars = () => ERAS.reduce((n, e) => n + e.levels.filter((_, i) => starsOf(e.id, i) >= 3).length, 0);
  const sealsCount = () => ERAS.filter(sealed).length;
  const MEDALS = [
    { id: "p1", name: "Premiers pas", desc: "Réussis ton premier niveau.", icon: "sword", tier: 1, cur: levelsPassed, max: 1 },
    { id: "p10", name: "Apprenti", desc: "Réussis 10 niveaux.", icon: "book", tier: 1, cur: levelsPassed, max: 10 },
    { id: "p30", name: "Compagnon", desc: "Réussis 30 niveaux.", icon: "book", tier: 2, cur: levelsPassed, max: 30 },
    { id: "p60", name: "Maître", desc: "Réussis 60 niveaux.", icon: "crown", tier: 2, cur: levelsPassed, max: 60 },
    { id: "p110", name: "Grand Maître", desc: "Réussis les 120 niveaux.", icon: "crown", tier: 3, cur: levelsPassed, max: 120 },
    { id: "s1", name: "Étoile d'or", desc: "Obtiens 3 étoiles à un niveau.", icon: "star", tier: 1, cur: threeStars, max: 1 },
    { id: "s10", name: "Constellation", desc: "Obtiens 3 étoiles à 10 niveaux.", icon: "star", tier: 2, cur: threeStars, max: 10 },
    { id: "s40", name: "Voûte céleste", desc: "Obtiens 3 étoiles à 40 niveaux.", icon: "star", tier: 3, cur: threeStars, max: 40 },
    { id: "k1", name: "Premier sceau", desc: "Termine une époque entière.", icon: "seal", tier: 1, cur: sealsCount, max: 1 },
    { id: "k5", name: "Chancelier", desc: "Obtiens 5 sceaux d'époque.", icon: "seal", tier: 2, cur: sealsCount, max: 5 },
    { id: "k11", name: "Sceau du royaume", desc: "Obtiens les 12 sceaux.", icon: "seal", tier: 3, cur: sealsCount, max: 12 },
    { id: "c5", name: "Collectionneur", desc: "Débloque 5 personnages.", icon: "helmet", tier: 1, cur: charsOwned, max: 5 },
    { id: "c25", name: "Galerie royale", desc: "Débloque 25 personnages.", icon: "helmet", tier: 2, cur: charsOwned, max: 25 },
    { id: "cAll", name: "Panthéon", desc: "Débloque tous les personnages.", icon: "helmet", tier: 3, cur: charsOwned, max: () => Math.max(charsTotal(), 1) },
    { id: "f3", name: "Veilleur", desc: "Joue 3 jours de suite.", icon: "flame", tier: 1, cur: () => S.stats.bestStreak || 0, max: 3 },
    { id: "f7", name: "Gardien", desc: "Joue 7 jours de suite.", icon: "flame", tier: 1, cur: () => S.stats.bestStreak || 0, max: 7 },
    { id: "f14", name: "Sentinelle", desc: "Joue 14 jours de suite.", icon: "flame", tier: 2, cur: () => S.stats.bestStreak || 0, max: 14 },
    { id: "f30", name: "Mois de feu", desc: "Joue 30 jours de suite.", icon: "flame", tier: 2, cur: () => S.stats.bestStreak || 0, max: 30 },
    { id: "f100", name: "Flamme éternelle", desc: "Joue 100 jours de suite.", icon: "flame", tier: 3, cur: () => S.stats.bestStreak || 0, max: 100 },
    { id: "t1", name: "Entrée à la cour", desc: "Joue au Trésor du Royaume.", icon: "lis", tier: 1, cur: () => S.stats.tGames || 0, max: 1 },
    { id: "t5", name: "Coffre de bronze", desc: "Atteins le palier 1 000 écus.", icon: "lis", tier: 1, cur: () => S.stats.tBest || 0, max: 5 },
    { id: "t10", name: "Coffre d'argent", desc: "Atteins le palier 32 000 écus.", icon: "lis", tier: 2, cur: () => S.stats.tBest || 0, max: 10 },
    { id: "t15", name: "Roi du Trésor", desc: "Gagne 1 000 000 d'écus.", icon: "crown", tier: 3, cur: () => S.stats.tBest || 0, max: 15 },
    { id: "l1", name: "Au-delà du Trésor", desc: "Réponds à une question de la Légende.", icon: "lis", tier: 2, cur: () => S.stats.tBest || 0, max: 16 },
    { id: "l10", name: "Légende", desc: "Réponds à 10 questions de la Légende.", icon: "crown", tier: 3, cur: () => S.stats.tBest || 0, max: 25 },
    { id: "l30", name: "Immortel", desc: "Réponds à 30 questions de la Légende.", icon: "crown", tier: 3, cur: () => S.stats.tBest || 0, max: 45 },
    { id: "tn", name: "Sans filet", desc: "Gagne le Trésor sans aucun joker.", icon: "jerusalem", tier: 3, cur: () => S.stats.tClean || 0, max: 1 },
    { id: "ta", name: "Esprit universel", desc: "Atteins 32 000 écus en « Tous les thèmes ».", icon: "jerusalem", tier: 2, cur: () => S.stats.tAll10 || 0, max: 1 },
    { id: "r2", name: "Chevalier", desc: "Atteins le rang de Chevalier.", icon: "sword", tier: 1, cur: () => rankIndex(S.xp), max: 2 },
    { id: "r5", name: "Comte", desc: "Atteins le rang de Comte.", icon: "turret", tier: 2, cur: () => rankIndex(S.xp), max: 5 },
    { id: "r8", name: "Connétable", desc: "Atteins le rang de Connétable.", icon: "turret", tier: 3, cur: () => rankIndex(S.xp), max: 8 },
    { id: "m200", name: "Bonne mémoire", desc: "Découvre 200 bonnes réponses.", icon: "scroll", tier: 1, cur: masteredTotal, max: 200 },
    { id: "m800", name: "Mémoire d'éléphant", desc: "Découvre 800 bonnes réponses.", icon: "scroll", tier: 3, cur: masteredTotal, max: 800 }
  ];
  const medalMax = (m) => (typeof m.max === "function" ? m.max() : m.max);
  const medalIcon = (m) => (ICONS[m.icon] || (m.icon === "flame" ? UI.flame : m.icon === "star" ? UI.star(true) : m.icon === "seal" ? UI.seal : ""));
  // Débloque les médailles méritées ; renvoie les nouvelles.
  function checkMedals() {
    const fresh = [];
    MEDALS.forEach((m) => {
      if (!S.medals[m.id] && m.cur() >= medalMax(m)) { S.medals[m.id] = today(); fresh.push(m); }
    });
    if (fresh.length) save();
    return fresh;
  }

  /* ===== Le Trésor du Royaume (quiz à paliers) ===== */
  const LADDER = [100, 200, 300, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 125000, 250000, 500000, 1000000];
  const SAFE = [4, 9]; // paliers garantis : après la question 5 et la question 10
  const LEAGUES = [[0, "Manant"], [100, "Artisan"], [1000, "Bourgeois"], [8000, "Chevalier"], [32000, "Baron"], [125000, "Comte"], [500000, "Duc"], [1000000, "Roi"], [3000000, "Empereur"], [10000000, "Légende vivante"]];
  // Au-delà de la 15e question : la Légende. Chaque question vaut 500 000 écus de plus, avec un palier tous les 5 pas.
  const prize = (i) => (i < 15 ? LADDER[i] : LADDER[14] + (i - 14) * 500000);
  const fmtEcus = (n) => `${n.toLocaleString("fr-FR").replace(/ /g, " ")} écu${n > 1 ? "s" : ""}`;
  const leagueOf = (earn) => LEAGUES.reduce((a, l) => (earn >= l[0] ? l : a), LEAGUES[0]);
  const safeEarn = (reached) => {
    if (reached >= 15) { const g = Math.floor((reached - 15) / 5) * 5; return g > 0 ? prize(14 + g) : LADDER[SAFE[1]]; }
    return reached > SAFE[1] ? LADDER[SAFE[1]] : reached > SAFE[0] ? LADDER[SAFE[0]] : 0; // reached = nb de bonnes réponses
  };
  const legendN = (i) => i - 14; // numéro de la question de Légende (1, 2, 3…)

  // Question supplémentaire pour la Légende : parmi les plus difficiles, sans répéter.
  function nextLegendQ(t) {
    const eras = t.scope === "all" ? playable : playable.filter((e) => e.id === t.scope);
    const build = (minLevel) => {
      const pool = [];
      eras.forEach((e) => e.levels.forEach((lv, i) => {
        if (i < minLevel) return;
        lv.items.forEach((d, k) => { if (d.type === "qcm" && !t.seen.has(d.q)) pool.push(prep("qcm", d, `${e.id}:${i}:${k}`, e.title, lv.title)); });
      }));
      return pool;
    };
    let pool = build(5);
    if (!pool.length) pool = build(0);
    if (!pool.length) { t.seen.clear(); pool = build(5); }
    const it = shuffle(pool)[0];
    t.seen.add(it.q);
    return it;
  }
  const TIERS = [[0, 2], [3, 6], [7, 9]]; // niveaux utilisés pour les questions 1-5, 6-10, 11-15

  // Questions de culture générale, faciles : on peut y répondre sans avoir lu les fiches.
  let EASY_LIST = null;
  const easyEra = (y) => (y <= 475 ? "gaule" : y <= 750 ? "evangelisation" : y <= 986 ? "carolingiens" : y <= 1095 ? "moines" : y <= 1291 ? "croisades" : y <= 1328 ? "capetiens" : y <= 1453 ? "chevaliers" : y <= 1588 ? "renaissance" : y <= 1714 ? "grand-siecle" : y <= 1799 ? "revolution" : y <= 1870 ? "empire" : "modernes");
  const centTxt = (c, bc) => (EN ? `${c}${c % 10 === 1 && c !== 11 ? "st" : c % 10 === 2 && c !== 12 ? "nd" : c % 10 === 3 && c !== 13 ? "rd" : "th"} century${bc ? " BC" : ""}` : `${toRoman(c)}${c === 1 ? "er" : "e"} siècle${bc ? " av. J.-C." : ""}`);
  const periodOf = (y) => (y < 477 ? 0 : y < 1492 ? 1 : y < 1789 ? 2 : 3);
  const PERIODS = () => [L2("Antiquité", "Antiquity"), L2("Moyen Âge", "Middle Ages"), L2("Temps modernes", "Early modern era"), L2("Époque contemporaine", "Modern era")];
  /* Questions fabriquées à partir des personnages et événements du jour : plus de 1 800 questions supplémentaires. */
  function genEasy() {
    const maps = dailyMaps();
    const F = Object.keys(maps.f).sort().map((k) => ({ k, t: maps.f[k][0], name: maps.f[k][1], y: Number(maps.f[k][2]), text: maps.f[k][3] || "", more: maps.m[k] || "" })).filter((f) => f.name && !isNaN(f.y));
    const S2 = Object.keys(maps.s).sort().map((k) => ({ k, name: maps.s[k][0] })).filter((x) => x.name);
    let seed = 7;
    const rnd = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
    const pick = (arr, n, bad) => { const pool = arr.filter((x) => !bad(x)); const out = []; const used = new Set(); let g = 0; while (out.length < n && g++ < 400) { const x = pool[Math.floor(rnd() * pool.length)]; const id = typeof x === "string" ? x : x.name; if (!used.has(id)) { used.add(id); out.push(x); } } return out; };
    const leaks = (f, txt) => { const low = txt.toLowerCase(); return f.name.toLowerCase().split(/[\s'’«»,.()-]+/).some((w) => w.length >= 5 && low.includes(w)); };
    const out = [];
    const add = (f, q, c, w, e, tag) => { if (w.length === 3 && new Set([c, ...w]).size === 4) out.push({ era: easyEra(f.y), d: { q, c, w, e }, key: `easy:${tag}:${f.k}` }); };
    const when = (f) => { const y = fmtYear(f.y); return f.t === "n" ? L2(`né en ${y}`, `born in ${y}`) : f.t === "m" ? L2(`mort en ${y}`, `died in ${y}`) : L2(`en ${y}`, `in ${y}`); };
    const info = (f) => `${f.name} (${when(f)}). ${f.text}`;
    const same = (f) => (g) => g.k === f.k || g.name === f.name || (f.t === "e") !== (g.t === "e");
    F.forEach((f) => {
      const isEv = f.t === "e";
      const who = isEv ? L2("De quel événement s'agit-il ?", "Which event is this?") : L2("De quel personnage s'agit-il ?", "Which historical figure is this?");
      // A et D : retrouver le nom à partir d'un indice
      [["a", f.text], ["d", f.more]].forEach(([tag, txt]) => {
        if (!txt || leaks(f, txt)) return;
        add(f, `${who} « ${txt} »`, f.name, pick(F, 3, same(f)).map((x) => x.name), info(f), tag);
      });
      // C : la période
      const yy = Math.abs(f.y - 476) <= 6 || Math.abs(f.y - 1492) <= 3 || Math.abs(f.y - 1789) <= 3;
      if (!yy) {
        const P = PERIODS(), pi = periodOf(f.y);
        const qq = f.t === "n" ? L2(`À quelle période appartient la naissance de ${f.name} ?`, `Which period does the birth of ${f.name} belong to?`) : f.t === "m" ? L2(`À quelle période meurt ${f.name} ?`, `In which period did ${f.name} die?`) : L2(`À quelle période appartient « ${f.name} » ?`, `Which period does “${f.name}” belong to?`);
        add(f, qq, P[pi], P.filter((_, i) => i !== pi), info(f), "c");
      }
    });
    return out;
  }
  const easyList = () => {
    if (EASY_LIST) return EASY_LIST;
    EASY_LIST = String(window.HISTORIA_EASY || "").split("\n").map((l) => l.split("|")).filter((p) => p.length === 7 && eraById(p[0]))
      .map((p, i) => ({ era: p[0], d: { q: p[1], c: p[2], w: [p[3], p[4], p[5]], e: p[6] }, key: `easy:${p[0]}:${i}` }));
    const n0 = EASY_LIST.length;
    const lvq = String(window.HISTORIA_LV || "").split("\n").map((l) => l.split("|")).filter((p) => p.length === 8 && eraById(p[0]))
      .map((p, i) => ({ era: p[0], lv: (+p[1]) - 1, d: { q: p[2], c: p[3], w: [p[4], p[5], p[6]], e: p[7] }, key: `easy:${p[0]}:lv${n0 + i}` }));
    EASY_LIST = EASY_LIST.concat(lvq);
    try { EASY_LIST = EASY_LIST.concat(genEasy().filter((x) => eraById(x.era))); } catch (err) { /* les questions faites à la main suffisent */ }
    return EASY_LIST;
  };
  const isGen = (x) => /^easy:[a-g]:/.test(x.key);
  /* Questions faites à la main : toutes ; questions fabriquées : en nombre égal, tirées au hasard. */
  const easyRaw = (scope) => {
    const base = easyList().filter((x) => !scope || scope === "all" || x.era === scope);
    const hand = base.filter((x) => !isGen(x));
    return hand.concat(shuffle(base.filter(isGen)).slice(0, hand.length));
  };
  const easyPool = (scope) => easyRaw(scope).map((x) => prep("qcm", x.d, x.key, eraById(x.era).title, L2("Culture générale", "General knowledge")));

  function tresorQuestions(scope) {
    const eras = scope === "all" ? playable : playable.filter((e) => e.id === scope);
    const used = new Set();
    const out = [];
    const levelPool = (a, b) => {
      const pool = [];
      eras.forEach((e) => e.levels.forEach((lv, i) => {
        if (i < a || i > b) return;
        lv.items.forEach((d, k) => { if (d.type === "qcm") pool.push(prep("qcm", d, `${e.id}:${i}:${k}`, e.title, lv.title)); });
      }));
      return pool;
    };
    const take = (pool, n) => {
      const got = [];
      shuffle(pool).forEach((it) => { if (got.length < n && !used.has(it.q)) { used.add(it.q); got.push(it); } });
      return got;
    };
    const easy = easyPool(scope);
    const hasEasy = easy.length >= 7;
    // Questions 1-5 : culture générale. 6-10 : un peu de tout. 11-15 : niveau fiches.
    const t1 = hasEasy ? take(easy, 5) : take(levelPool(0, 2), 5);
    const t2 = shuffle((hasEasy ? take(easy, 2) : []).concat(take(levelPool(0, 4), hasEasy ? 3 : 5)));
    const t3 = take(levelPool(3, 9), 5);
    t1.concat(t2, t3).forEach((it) => out.push(it));
    return out.length === 15 ? out : null;
  }

  let T = null; // partie du Trésor en cours
  let TR = null; // résultat

  function startTresor(scope) {
    const qs = tresorQuestions(scope);
    if (!qs) return;
    T = { scope, qs, i: 0, sel: null, rev: false, help: null, removed: [], used: {}, seen: new Set(qs.map((q) => q.q)) };
    sfx("tap");
    go("tgame", {}, "push");
  }

  const crowdFor = (it, removed, rung) => {
    const okIdx = it.opts.findIndex((o) => o.ok);
    const live = it.opts.map((_, k) => k).filter((k) => !removed.includes(k));
    const acc = rung < 5 ? 0.8 : rung < 10 ? 0.58 : 0.42;
    let lead = Math.random() < (rung < 5 ? 0.97 : rung < 10 ? 0.88 : 0.72) ? okIdx : live.filter((k) => k !== okIdx)[Math.floor(Math.random() * (live.length - 1))];
    const pct = {};
    let left = 100;
    const mainPct = Math.round((acc + (Math.random() - 0.5) * 0.2) * 100);
    live.forEach((k) => (pct[k] = 0));
    pct[lead] = Math.min(Math.max(mainPct, 30), 92);
    left -= pct[lead];
    const others = live.filter((k) => k !== lead);
    others.forEach((k, n) => { const share = n === others.length - 1 ? left : Math.round(Math.random() * left * 0.6); pct[k] = share; left -= share; });
    return pct;
  };
  const expertSays = (it, rung) => {
    const okIdx = it.opts.findIndex((o) => o.ok);
    const sure = rung < 5 ? 0.92 : rung < 10 ? 0.8 : 0.66;
    const right = Math.random() < sure;
    const live = it.opts.map((_, k) => k).filter((k) => k !== okIdx);
    const pick = right ? okIdx : live[Math.floor(Math.random() * live.length)];
    const L = "ABCD"[pick];
    const txt = rung < 5
      ? [`Voilà un point que je connais bien : c'est la réponse ${L}.`, `Sans hésiter, la ${L}.`]
      : rung < 10
        ? [`Il me semble bien que c'est la ${L}, mais je ne le jurerais pas.`, `Mes manuscrits penchent pour la ${L}.`]
        : [`Honnêtement, je ne suis pas certain… je dirais la ${L}.`, `Question redoutable. Mon instinct d'historien me souffle la ${L}.`];
    return txt[Math.floor(Math.random() * txt.length)];
  };

  function useLifeline(kind) {
    if (!T || T.rev || T.used[kind]) return;
    const it = T.qs[T.i];
    T.used[kind] = true;
    sfx("tap");
    if (kind === "fifty") {
      const wrong = it.opts.map((o, k) => (o.ok ? -1 : k)).filter((k) => k >= 0);
      T.removed = shuffle(wrong).slice(0, 2);
      if (T.sel !== null && T.removed.includes(T.sel)) T.sel = null;
      T.help = { kind: "fifty" };
    } else if (kind === "pub") {
      T.help = { kind: "pub", pct: crowdFor(it, T.removed, T.i) };
    } else {
      T.help = { kind: "expert", say: expertSays(it, T.i) };
    }
    refreshT();
  }

  function endTresor(kind) {
    // kind : "wrong" | "stop" | "win"
    const reached = T.i + (T.rev && T.good ? 1 : 0); // bonnes réponses données
    const earn = kind === "win" ? LADDER[14] : kind === "stop" ? (reached > 0 ? prize(reached - 1) : 0) : safeEarn(reached);
    const scope = T.scope;
    const rec = (S.rec[scope] = S.rec[scope] || { rung: 0, earn: 0 });
    const newRecord = earn > rec.earn;
    rec.rung = Math.max(rec.rung, reached);
    rec.earn = Math.max(rec.earn, earn);
    const noHelp = !T.used.fifty && !T.used.pub && !T.used.expert;
    S.stats.tGames = (S.stats.tGames || 0) + 1;
    S.stats.tBest = Math.max(S.stats.tBest || 0, reached);
    if (reached > 15) rec.legend = Math.max(rec.legend || 0, reached - 15);
    if (kind === "win" && noHelp) S.stats.tClean = 1;
    if (scope === "all" && reached >= 10) S.stats.tAll10 = 1;
    const xp = Math.min(reached, 15) * 5 + (reached >= 15 ? 100 : 0) + Math.max(0, reached - 15) * 10;
    const rankBefore = rankIndex(S.xp);
    S.xp += xp;
    touchStreak();
    const medals = checkMedals();
    save();
    TR = { kind, reached, earn, newRecord, scope, xp, medals, league: leagueOf(rec.earn), rankUp: rankIndex(S.xp) > rankBefore ? RANKS[rankIndex(S.xp)].name : null, lastQ: T.qs[Math.min(T.i, 14)], celebrated: false };
    T = null;
    go("tresult", {}, "replace");
    if (window.HistoriaAds) window.HistoriaAds.quizFinished();
  }

  /* ===== Navigation ===== */
  let view = { name: "home" };
  let Q = null;   // partie en cours
  let R = null;   // dernier résultat

  const go = (name, params = {}, mode = "push") => {
    view = Object.assign({ name }, params);
    const st = Object.assign({ name }, params);
    if (mode === "push") history.pushState(st, "");
    else if (mode === "replace") history.replaceState(st, "");
    render();
  };
  const back = () => (history.length > 1 && history.state && history.state.name !== "home" ? history.back() : go("home", {}, "replace"));

  window.addEventListener("popstate", (e) => {
    const st = e.state || { name: "home" };
    closeSheet();
    if (st.name === "quiz" || st.name === "result" || st.name === "tgame" || st.name === "tresult" || st.name === "defense") {
      T = null;
      view = { name: "home" };
      history.replaceState({ name: "home" }, "");
    } else {
      view = st;
    }
    render();
  });

  /* ===== Écrans ===== */
  const TABS = [
    { v: "home", label: "Apprendre", ico: () => ICONS.book },
    { v: "tresor", label: "Quiz", ico: () => ICONS.scroll },
    { v: "gallery", label: "Personnages", ico: () => ICONS.helmet },
    { v: "medals", label: "Médailles", ico: () => ICONS.crown }
  ];
  const tabBar = (active) => `<nav class="tabbar" aria-label="Navigation">${TABS.map((t) => `<button class="tab ${t.v === active ? "on" : ""}" data-act="tab" data-v="${t.v}" ${t.v === active ? 'aria-current="page"' : ""}><span class="tab-ico">${t.ico()}</span><span>${t.label}</span></button>`).join("")}</nav>`;
  const withTabs = (html, active) => { document.body.classList.add("has-tabs"); return html + tabBar(active); };

  // Illustration de la situation : retrouve l'époque et le niveau d'une question.
  const sitOfItem = (it) => {
    const e = it && ERAS.find((x) => x.title === it.era);
    if (!e) return "";
    const i = e.levels.findIndex((l) => l.title === it.lvl);
    return Art.situation(e.id, i < 0 ? null : i);
  };
  const picOfItem = (it, cap) => { const h = sitOfItem(it); return h ? `<figure class="pic sm" aria-hidden="true">${h}${cap ? `<figcaption>${esc(cap)}</figcaption>` : ""}</figure>` : ""; };

  // Ambiance : la couleur de l'époque teinte tout l'écran.
  const setTint = () => {
    const eid = view.name === "era" || view.name === "lesson" ? view.id : view.name === "quiz" && Q && Q.eraId ? Q.eraId : view.name === "result" && R && R.eraId ? R.eraId : view.name === "tgame" && T && T.scope !== "all" ? T.scope : null;
    const e = eid ? eraById(eid) : null;
    document.documentElement.style.setProperty("--tint", e ? e.accent : "#3456b2");
    document.documentElement.dataset.era = e ? e.scene : view.name === "tgame" || view.name === "tresor" || view.name === "tresult" ? "tresor" : "";
  };

  const render = () => {
    if (view.name !== "defense" && DF) { if (DF.game) DF.game.destroy(); DF = null; }
    window.scrollTo(0, 0);
    document.body.classList.remove("has-tabs");
    setTint();
    if (Art.music) Art.music.sync(S.music !== false && (view.name === "quiz" || view.name === "tgame" || view.name === "defense"), view.name === "defense" ? "croisades" : view.name === "quiz" ? (Q && Q.eraId) || "tresor" : T && T.scope !== "all" ? T.scope : "tresor");
    if (window.HistoriaAds) window.HistoriaAds.screen(view.name);
    if (view.name === "era" && eraById(view.id)) { $app.innerHTML = eraScreen(eraById(view.id)); return animateBars(); }
    if (view.name === "lesson" && eraById(view.id)) return ($app.innerHTML = lessonScreen(eraById(view.id), view.lv || 0));
    if (view.name === "quiz" && Q) return ($app.innerHTML = quizScreen());
    if (view.name === "tresor") { $app.innerHTML = withTabs(tresorMenu(), "tresor"); return animateBars(); }
    if (view.name === "tgame" && T) return ($app.innerHTML = tgameScreen());
    if (view.name === "defense" && DF) { $app.innerHTML = defenseScreen(); return dfAttach(); }
    if (view.name === "tresult" && TR) { $app.innerHTML = tresultScreen(); return celebrateT(); }
    if (view.name === "gallery") return ($app.innerHTML = withTabs(galleryScreen(), "gallery"));
    if (view.name === "medals") return ($app.innerHTML = withTabs(medalsScreen(), "medals"));
    if (view.name === "result" && R) { $app.innerHTML = resultScreen(); return celebrate(); }
    view = { name: "home" };
    setTint();
    $app.innerHTML = withTabs(homeScreen(), "home");
    animateBars();
  };

  const animateBars = () => {
    requestAnimationFrame(() => document.querySelectorAll(".bar > i[data-w]").forEach((el) => (el.style.width = el.dataset.w + "%")));
  };

  /* ===== Sans publicité (achat unique) ===== */
  const IAP = () => window.HistoriaIAP;
  const canSell = () => IAP() && IAP().available;
  function noAdsCard() {
    if (!canSell()) return "";
    if (IAP().adFree()) return '<p class="noads-done">Sans publicité ✓</p>';
    const pr = IAP().price();
    return `<section class="noads"><div><b>Sans publicité</b><span>${EN ? "Remove ads for life with a single purchase." : "Supprime les publicités à vie, en un seul achat."}</span></div>
      <button class="btn btn-gold" data-act="noads">${EN ? "Remove ads" : "Supprimer les pubs"}${pr ? ` · ${esc(pr)}` : ""}</button>
      <button class="linkbtn" data-act="restore">Rétablir mon achat</button></section>`;
  }
  function buyNoAds(btn) {
    if (!canSell()) return;
    btn.disabled = true;
    IAP().buy().then(() => { sfx("fanfare"); refreshAfterPurchase(); }).catch(() => { btn.disabled = false; });
  }
  function restoreNoAds(btn) {
    if (!canSell()) return;
    btn.disabled = true;
    IAP().restore().then(() => { btn.disabled = false; refreshAfterPurchase(); });
  }
  function refreshAfterPurchase() {
    const open = !!document.getElementById("overlay");
    if (open) { closeSheet(); openRanks(); }
    if (view.name === "home") render();
  }
  window.addEventListener("historia:adfree", refreshAfterPurchase);
  window.addEventListener("historia:iap", () => { if (view.name === "home" && !document.getElementById("overlay")) render(); });

  /* ===== Pour aller plus loin (livres, liens affiliés) ===== */
  function booksSection(e) {
    const A = window.HistoriaAff;
    const list = A && A.enabled() ? A.books(e.id) : [];
    if (!list.length) return "";
    return `<section class="books"><h2 class="section">Pour aller plus loin</h2>
      <ul>${list.map((b) => `<li><button class="book" data-act="book" data-href="${esc(b.url)}"><span class="bk-ico">${UI.book}</span><span class="bk-text"><b>${esc(b.title)}</b><small>${esc(b.author)}</small></span><span class="go">${UI.go}</span></button></li>`).join("")}</ul>
      <p class="aff-note">${esc(A.disclosure())}</p></section>`;
  }

  /* ===== Personnage et saint du jour ===== */
  const MONTHS = EN
    ? ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    : ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
  const L2 = (fr, en) => (EN ? en : fr);
  let DAILY_MAP = null;
  const dailyMaps = () => {
    if (DAILY_MAP) return DAILY_MAP;
    const D = window.HISTORIA_DAILY || {};
    const parse = (s) => { const o = {}; String(s || "").split("\n").forEach((l) => { const p = l.split("|"); if (p.length > 1) o[p[0]] = p.slice(1); }); return o; };
    const more = {};
    String(window.HISTORIA_MORE || "").split("\n").forEach((l) => { const i = l.indexOf("|"); if (i > 0) more[l.slice(0, i)] = l.slice(i + 1); });
    DAILY_MAP = { f: parse(D.figures), s: parse(D.saints), m: more };
    return DAILY_MAP;
  };
  const CROSS_ICO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M12 3v18M6 9h12"/></svg>';
  const toRoman = (n) => { const t = [[10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]]; let r = ""; t.forEach(([v, c]) => { while (n >= v) { r += c; n -= v; } }); return r; };
  const yearContext = (y, now) => {
    const ago = now.getFullYear() - y;
    const c = Math.ceil(Math.abs(y) / 100);
    const cent = EN ? `${c}${c % 10 === 1 && c !== 11 ? "st" : c % 10 === 2 && c !== 12 ? "nd" : c % 10 === 3 && c !== 13 ? "rd" : "th"} century${y < 0 ? " BC" : ""}` : `${toRoman(c)}${c === 1 ? "er" : "e"} siècle${y < 0 ? " av. J.-C." : ""}`;
    const per = y < 477 ? L2("Antiquité", "Antiquity") : y < 1492 ? L2("Moyen Âge", "Middle Ages") : y < 1789 ? L2("Temps modernes", "Early modern era") : L2("Époque contemporaine", "Modern era");
    const n = ago.toLocaleString(EN ? "en-US" : "fr-FR");
    return `${L2(`Il y a ${n} ans`, `${n} years ago`)} · ${cent} · ${per}`;
  };
  function todayCard() {
    const now = new Date();
    const key = String(now.getMonth() + 1).padStart(2, "0") + "-" + String(now.getDate()).padStart(2, "0");
    const maps = dailyMaps();
    const f = maps.f[key];
    const sn = maps.s[key];
    if (!f && !sn) return "";
    const day = now.getDate();
    const dateTxt = EN ? `${MONTHS[now.getMonth()]} ${day}` : `${day === 1 ? "1er" : day} ${MONTHS[now.getMonth()]}`;
    let fig = "";
    if (f) {
      const y = fmtYear(Number(f[2]));
      const when = f[0] === "n" ? L2(`Né en ${y}`, `Born in ${y}`) : f[0] === "m" ? L2(`Mort en ${y}`, `Died in ${y}`) : L2(`En ${y}`, `In ${y}`);
      fig = `<h2 class="today-name">${esc(f[1])}</h2><p class="today-sub">${esc(when)}</p><p class="today-text">${esc(f[3])}</p>${maps.m[key] ? `<p class="today-text today-more">${esc(maps.m[key])}</p>` : ""}<p class="today-ctx">${esc(yearContext(Number(f[2]), now))}</p>`;
    }
    const saint = sn ? `<p class="today-saint">${CROSS_ICO}<span>${L2("Saint du jour", "Saint of the day")} : <b>${esc(sn[0])}</b></span></p>` : "";
    return `<section class="today" aria-label="${L2("Aujourd'hui", "Today")}"><p class="today-date">${L2("Aujourd'hui", "Today")}, ${esc(dateTxt)}</p>${fig}${saint}</section>`;
  }

  /* ===== Conquête (jeu du chevalier) ===== */
  const DF_XP = 30;
  let DF = null;
  const dfStats = () => (S.stats.defense = Object.assign({ plays: 0, wins: 0, best: 0 }, S.stats.defense));
  function startDefense() {
    if (!window.HistoriaDefense) return;
    sfx("tap");
    DF = { game: null, phase: "intro", res: null };
    go("defense", {}, view.name === "defense" ? "replace" : "push");
  }
  function dfIntro() {
    const st = dfStats();
    return `<div class="df-card"><h2>${L2("Conquête !", "Conquest!")}</h2>
      <p>${L2("Chevalier d'Orient, ouvre-toi un royaume : franchis les obstacles, chaque porte te donne un territoire. Vise les 200 !", "Knight of the East, carve out a kingdom: clear the obstacles, every gate wins you a territory. Aim for 200!")}</p>
      <ul class="df-how"><li><b>${L2("Touche l'écran", "Tap the screen")}</b> ${L2("pour faire bondir ton cheval.", "to make your horse leap.")}</li><li>${L2("Ça s'accélère, puis les obstacles se mettent à bouger. Après 200, la course continue…", "It speeds up, then the obstacles start to move. After 200, the ride goes on…")}</li><li>${L2("Le paysage change : campagne, hameau, village, ville, château, empire.", "The scenery changes: countryside, hamlet, village, city, castle, empire.")}</li><li>${L2("Ton chevalier gagne en prestance à chaque palier.", "Your knight grows more splendid at every stage.")}</li></ul>
      <button class="btn btn-gold" data-act="dfgo">${L2("En selle !", "Ride!")}</button>
      ${st.plays ? `<small class="df-rec">${L2(`Record : ${st.best} territoires`, `Best: ${st.best} territories`)}</small>` : ""}</div>`;
  }
  function dfEnd(r) {
    const st = dfStats();
    st.plays++;
    const rec = r.score > st.best;
    if (rec) st.best = r.score;
    if (r.win) st.wins++;
    const xp = Math.min(40, Math.floor(r.score / 5)) + (r.score > 200 ? Math.min(20, Math.floor((r.score - 200) / 5)) : 0);
    S.xp += xp;
    save();
    if (window.HistoriaAds) window.HistoriaAds.quizFinished();
    if (r.win) Art.confetti();
    const SG = window.HistoriaDefense.STAGES[r.stage];
    const over = document.getElementById("df-over");
    if (!over) return;
    over.innerHTML = `<div class="df-card df-end ${r.win ? "win" : "lose"}"><h2>${r.win ? L2("Un empire est né, et la faim demeure !", "An empire is born, and the hunger remains!") : L2("Ton cheval s'effondre…", "Your horse has fallen…")}</h2>
      <p class="df-big">${r.score} <small>${L2("territoires", "territories")}</small>${rec ? ` <em>${L2("Nouveau record !", "New record!")}</em>` : ""}</p>
      <p>${L2("Tu t'es arrêté en :", "You stopped in:")} <b>${EN ? SG.en : SG.fr}</b>${xp ? ` · <b>+${xp} XP</b>` : ""}</p>
      <p class="df-fact">${L2("Les seigneurs du Moyen Âge s'agrandissaient par la guerre, mais aussi par le mariage et l'héritage.", "Medieval lords grew their lands by war, but also by marriage and inheritance.")}</p>
      <div class="stack"><button class="btn btn-gold" data-act="dfgo">${L2("Rejouer", "Play again")}</button><button class="btn btn-line" data-act="dfquit">${L2("Retour au menu Quiz", "Back to the Quiz menu")}</button></div></div>`;
    over.hidden = false;
  }
  function dfAttach() {
    const canvas = document.getElementById("df-canvas");
    if (!canvas || !DF) return;
    DF.game = window.HistoriaDefense.create(canvas, { lang: EN ? "en" : "fr", sfx, buzz, onEnd: (r) => { if (DF) { DF.phase = "end"; dfEnd(r); } } });
    const over = document.getElementById("df-over");
    if (over) { over.innerHTML = dfIntro(); over.hidden = false; }
  }
  function dfGo() {
    if (!DF || !DF.game) return;
    const over = document.getElementById("df-over");
    if (over) over.hidden = true;
    DF.phase = "play";
    DF.game.destroy();
    const canvas = document.getElementById("df-canvas");
    DF.game = window.HistoriaDefense.create(canvas, { lang: EN ? "en" : "fr", sfx, buzz, onEnd: (r) => { if (DF) { DF.phase = "end"; dfEnd(r); } } });
    DF.game.start();
  }
  const defenseScreen = () => `<div class="screen dfscreen" id="defense"><button class="icon-btn df-close" data-act="dfquit" aria-label="${L2("Quitter le jeu", "Leave the game")}">${UI.close}</button>
    <div class="df-wrap"><canvas id="df-canvas" aria-label="${L2("Jeu : conquête de territoires", "Game: conquer territories")}"></canvas><div class="df-over" id="df-over"></div></div></div>`;
  function defenseCard() {
    const st = (S.stats && S.stats.defense) || { plays: 0, wins: 0, best: 0 };
    const rec = st.plays ? `<small class="mz-rec">${L2(`Record : ${st.best} territoires`, `Best: ${st.best} territories`)}</small>` : "";
    return `<section class="df-menu"><div class="df-menu-art" aria-hidden="true"><svg viewBox="0 0 64 64"><path d="M14 52 L46 14" stroke="#e8edf5" stroke-width="5" stroke-linecap="round"/><path d="M10 44 L22 56" stroke="#b8892b" stroke-width="5" stroke-linecap="round"/><path d="M50 52 L18 14" stroke="#e8edf5" stroke-width="5" stroke-linecap="round"/><path d="M54 44 L42 56" stroke="#b8892b" stroke-width="5" stroke-linecap="round"/><path d="M22 10 l6 8 4-10 4 10 6-8 -2 14 h-16z" fill="#f0c64b" stroke="#7a5818" stroke-width="2"/></svg></div>
      <div><h2>${L2("Conquête !", "Conquest!")}</h2>
      <p>${L2("Un chevalier, un cheval qui bondit, 200 territoires à conquérir. Le paysage et ton armure changent à chaque étape. Touche pour sauter !", "A knight, a leaping horse, 200 territories to conquer. The scenery and your armour change at every stage. Tap to jump!")}</p>
      <button class="btn btn-gold" data-act="dfstart">${L2("Jouer", "Play")}</button>${rec}</div></section>`;
  }

  function homeScreen() {
    const idx = rankIndex(S.xp);
    const next = RANKS[idx + 1];
    const base = RANKS[idx].xp;
    const pct = next ? Math.round(((S.xp - base) / (next.xp - base)) * 100) : 100;
    const streak = displayStreak();
    const doneToday = S.daily === today();
    const tgt = nextTarget();

    const eraCards = ERAS.map((e) => {
      const n = e.levels.length;
      const p = passedCount(e);
      const soon = !n;
      return `
      <li>
        <button class="era ${soon ? "soon" : ""}" style="--accent:${e.accent}" data-act="era" data-id="${e.id}" ${soon ? "disabled" : ""} aria-label="${esc(e.title)}, ${p} niveaux réussis sur ${n}">
          <span class="era-art">${Art.situation(e.id)}</span>
          <span class="era-body">
            <span class="medal">${ICONS[e.icon]}</span>
            <span class="era-text">
              <span class="numeral">Époque ${e.num}${sealed(e) ? ` <span class="sealed" title="Sceau obtenu">${UI.seal}</span>` : ""}</span>
              <span class="era-title">${esc(e.title)}</span>
              <span class="era-period">${esc(e.period)}</span>
              <span class="era-prog"><span class="bar"><i data-w="${n ? Math.round((p / n) * 100) : 0}"></i></span>${soon ? "Bientôt" : `${p}/${n}`}</span>
            </span>
            <span class="era-go">${UI.go}</span>
          </span>
        </button>
      </li>`;
    }).join("");

    const resume = tgt
      ? `<button class="resume" data-act="start" data-id="${tgt.e.id}" data-lv="${tgt.i}" style="--accent:${tgt.e.accent}">
          <span class="resume-medal">${ICONS[tgt.e.icon]}</span>
          <span class="resume-text"><b>${S.last ? "Reprendre" : "Commencer"}</b><span>${esc(tgt.e.title)} · Niveau ${tgt.i + 1} — ${esc(tgt.e.levels[tgt.i].title)}</span></span>
          <span class="go">${UI.go}</span>
        </button>`
      : "";

    return `
    <div class="screen">
      <header class="brand">
        <button class="lang-pill" data-act="lang" aria-label="Langue / Language">${EN ? "FR" : "EN"}</button>
        <h1 class="wordmark">HISTORIA</h1>
        <p class="tagline">L'histoire de France et de la chrétienté</p>
        <div class="rule">${UI.lisSmall}</div>
      </header>

      <button class="rank" data-act="ranks" aria-label="Voir les rangs. Rang actuel : ${RANKS[idx].name}">
        ${shield(idx)}
        <span>
          <span class="rank-name" style="display:block">${RANKS[idx].name}</span>
          <span class="bar"><i data-w="${pct}"></i></span>
          <span class="rank-meta">
            <span>${next ? `${S.xp} / ${next.xp} XP` : `${S.xp} XP`}</span>
            <span class="streak">${UI.flame}${streak > 0 ? `${streak} ${plural(streak, "jour", "jours")} de suite` : "Lancez votre série"}</span>
          </span>
        </span>
      </button>

      ${todayCard()}
      <header class="learn-head">
        <p class="learn-orn" aria-hidden="true"><span></span>✦<span></span></p>
        <h2 class="learn-title">Voyage à travers les siècles</h2>
        <p class="learn-sub">Choisis ton époque, découvre ses grandes histoires, puis relève le défi du quiz : chaque étoile gagnée te fait grimper de rang !</p>
        <ol class="learn-steps"><li><b>1</b> Lis la fiche</li><li><b>2</b> Joue au quiz</li><li><b>3</b> Gagne des étoiles</li></ol>
      </header>
      <ul class="eras">${eraCards}</ul>

      ${noAdsCard()}
      ${adSlot()}
      <p class="foot"><button class="linkbtn" data-act="privacy">Confidentialité</button></p>
    </div>`;
  }

  function eraScreen(e) {
    const p = passedCount(e);
    const st = starsTotal(e);
    const rows = e.levels.map((lv, i) => {
      const open = unlocked(e, i);
      const s = starsOf(e.id, i);
      const cls = !open ? "locked" : s >= 1 ? "done" : "now";
      const qz = open ? `data-act="start" data-id="${e.id}" data-lv="${i}"` : "disabled";
      return `
      <li class="lv ${cls}">
        <button class="lv-main" data-act="lesson" data-id="${e.id}" data-lv="${i}" aria-label="Apprendre : niveau ${i + 1}, ${esc(lv.title)}">
          <span class="lv-pic"><span class="lv-thumb">${Art.situation(e.id, i)}</span><span class="lv-num">${i + 1}</span></span>
          <span class="lv-text"><b>${esc(lv.title)}</b><small>${esc(lv.lesson.d)}</small></span>
          ${open ? starsRow(s) : ""}
        </button>
        <button class="lv-read lv-quiz" ${qz} aria-label="${open ? `Quiz du niveau ${i + 1}` : `Quiz du niveau ${i + 1}, verrouillé : réussis le quiz précédent`}"><span class="qi">${open ? UI.go : UI.lock}</span><span class="qt">Quiz</span></button>
      </li>`;
    }).join("");

    return `
    <div class="screen" style="--accent:${e.accent}">
      <div class="art-hero">
        ${Art.situation(e.id)}
        <button class="icon-btn back-float" data-act="back" aria-label="Retour">${UI.back}</button>
        <div class="art-title">
          <span class="medal">${ICONS[e.icon]}</span>
          <div>
            <p class="numeral-big">Époque ${e.num}</p>
            <h1>${esc(e.title)}</h1>
            <p class="era-period">${esc(e.period)}</p>
          </div>
        </div>
      </div>
      <p class="intro-line">${esc(e.intro)}</p>
      <div class="facts">
        <div class="fact"><b>${p}/${e.levels.length}</b><span>niveaux réussis</span></div>
        <div class="fact"><b>${st}/${e.levels.length * 3}</b><span>étoiles</span></div>
        <div class="fact"><b class="${sealed(e) ? "gold" : ""}">${sealed(e) ? "Obtenu" : "—"}</b><span>sceau</span></div>
      </div>
      <p class="mix-note">Touche un niveau pour lire sa fiche, puis passe au quiz (<span class="inline-ico">${UI.go}</span>). Réussir un quiz débloque le niveau suivant.</p>
      <ol class="levels">${rows}</ol>
      ${booksSection(e)}
      ${adSlot()}
    </div>`;
  }

  /* ===== Fiche (facultative) ===== */
  function lessonScreen(e, i) {
    const lv = e.levels[i];
    const L = lv.lesson;
    const body = String(L.p).split("\n\n").map((b) => (b.startsWith("## ") ? `<h2 class="sc-h">${esc(b.slice(3))}</h2>` : `<p class="sc-text">${esc(b)}</p>`)).join("");
    const fun = (L.fun || []).length
      ? `<aside class="fun"><h3>Le saviez-vous ?</h3>${L.fun.map((f) => `<p>${esc(f)}</p>`).join("")}</aside>`
      : "";
    return `
    <div class="screen lesson" style="--accent:${e.accent}">
      <div class="top">
        <button class="icon-btn" data-act="back" aria-label="Fermer la fiche">${UI.close}</button>
        <p class="lesson-crumb">Niveau ${i + 1} · ${esc(lv.title)}</p>
      </div>
      <figure class="illum" aria-hidden="true">${Art.situation(e.id, i)}<figcaption>${esc(Art.situationName(e.id, i) || lv.title)} · ${esc(L.d)}</figcaption></figure>
      <article class="scroll-card">
        <div class="sc-head">
          <span class="sc-medal">${ICONS[e.icon]}</span>
          <span class="sc-meta"><span class="sc-era">${esc(e.title)}</span><span class="sc-date">${esc(L.d)}</span></span>
        </div>
        <h1 class="sc-title">${esc(L.t)}</h1>
        ${L.hook ? `<p class="sc-hook">${esc(L.hook)}</p>` : ""}
        <div class="sc-rule">${UI.lisSmall}</div>
        <div class="sc-body">${body}</div>
        ${fun}
      </article>
      <div class="stack">
        <button class="btn btn-gold" data-act="start" data-id="${e.id}" data-lv="${i}" ${unlocked(e, i) ? "" : "disabled"}>${unlocked(e, i) ? "Passer au quiz du niveau" : "Réussis le quiz précédent pour débloquer le quiz"}</button>
      </div>
    </div>`;
  }

  /* ===== Parties ===== */
  const freshState = (it) => ({ done: false, good: null, pick: null, picked: [], sel: null, pairs: {}, col: {}, v: it.type === "year" ? it.start : 0 });

  function startQuiz(items, meta) {
    Q = Object.assign({ items, i: 0, right: 0, xp: 0, missed: [], rankStart: rankIndex(S.xp), st: freshState(items[0]) }, meta);
    go("quiz", {}, meta.replace ? "replace" : "push");
  }

  function quizScreen() {
    const it = Q.items[Q.i];
    const e = Q.eraId ? eraById(Q.eraId) : null;
    const segs = Q.items.map((_, k) => `<i class="${k < Q.i ? "done" : k === Q.i ? "now" : ""}"></i>`).join("");
    return `
    <div class="screen" ${e ? `style="--accent:${e.accent}"` : ""}>
      <div class="top">
        <button class="icon-btn" data-act="quit" aria-label="Quitter la partie">${UI.close}</button>
        <div class="progress" aria-hidden="true">${segs}</div>
        <span class="count" aria-label="Défi ${Q.i + 1} sur ${Q.items.length}">${Q.i + 1}/${Q.items.length}</span>
      </div>
      ${picOfItem(it, Q.mode === "level" ? (Art.situationName(Q.eraId, Q.lvl) || it.lvl) : "")}
      <section class="q-card">
        <p class="q-era">${esc(Q.mode === "level" ? `Niveau ${Q.lvl + 1} · ${it.lvl}` : it.era)} <span class="q-type">${TYPE_LABEL[it.type]}</span></p>
        <h1 class="q-text" style="font-weight:400">${esc(it.q)}</h1>
      </section>
      <div id="play">${playHTML(it)}</div>
    </div>`;
  }

  const refreshPlay = () => {
    const el = document.getElementById("play");
    if (el) el.innerHTML = playHTML(Q.items[Q.i]);
  };

  function playHTML(it) {
    const st = Q.st;
    const fb = st.done ? feedbackHTML(it) : "";
    switch (it.type) {
      case "qcm": {
        const L = ["A", "B", "C", "D"];
        return `<ul class="options">${it.opts.map((o, k) => {
          let cls = "", mark = UI.check;
          if (st.done) {
            if (o.ok) cls = "correct";
            else if (k === st.pick) { cls = "wrong"; mark = UI.cross; }
            else cls = "dim";
          }
          return `<li><button class="opt ${cls}" data-act="answer" data-i="${k}" ${st.done ? "disabled" : ""}><span class="letter">${L[k]}</span><span>${esc(o.t)}</span>${mark}</button></li>`;
        }).join("")}</ul>${fb}`;
      }
      case "tf": {
        const cls = (v) => {
          if (!st.done) return "";
          if (it.a === v) return "correct";
          return st.pick === v ? "wrong" : "dim";
        };
        return `<div class="tf">
          <button class="tf-btn ${cls(true)}" data-act="tf" data-v="1" ${st.done ? "disabled" : ""}>Vrai</button>
          <button class="tf-btn ${cls(false)}" data-act="tf" data-v="0" ${st.done ? "disabled" : ""}>Faux</button>
        </div>${fb}`;
      }
      case "order": {
        const n = it.items.length;
        const rows = it.items.map((o, k) => {
          const pos = st.picked.indexOf(k);
          let cls = pos >= 0 ? "on" : "";
          if (st.done) cls = o.rank === pos ? "ok" : "ko";
          return `<li><button class="ord ${cls}" data-act="ord" data-i="${k}" ${st.done ? "disabled" : ""}>
            <span class="ord-n">${pos >= 0 ? pos + 1 : ""}</span>
            <span class="ord-t">${esc(o.t)}${st.done ? `<small>${esc(o.y)}</small>` : ""}</span>
          </button></li>`;
        }).join("");
        return `<ul class="ord-list">${rows}</ul>
          ${st.done ? "" : `<p class="hint">Touche les cartes dans l'ordre, de la plus ancienne à la plus récente.</p>
          <button class="btn btn-gold" data-act="validate" ${st.picked.length < n ? "disabled" : ""}>Valider</button>`}${fb}`;
      }
      case "match": {
        const colorOfLeft = (l) => st.col[l];
        const leftOf = (r) => Object.keys(st.pairs).find((l) => st.pairs[l] === r);
        const left = it.L.map((o, k) => {
          const c = colorOfLeft(k);
          let cls = c ? `p p${c}` : "";
          if (st.sel && st.sel.side === "L" && st.sel.i === k) cls += " sel";
          if (st.done) cls = it.R[st.pairs[k]].id === o.id ? "ok" : "ko";
          return `<li><button class="mt ${cls}" data-act="mt" data-side="L" data-i="${k}" ${st.done ? "disabled" : ""}>${c && !st.done ? `<span class="pn">${c}</span>` : ""}<span>${esc(o.t)}</span></button></li>`;
        }).join("");
        const right = it.R.map((o, k) => {
          const l = leftOf(k);
          let cls = l !== undefined ? `p p${st.col[l]}` : "";
          if (st.sel && st.sel.side === "R" && st.sel.i === k) cls += " sel";
          if (st.done) cls = l !== undefined && it.L[l].id === o.id ? "ok" : "ko";
          return `<li><button class="mt ${cls}" data-act="mt" data-side="R" data-i="${k}" ${st.done ? "disabled" : ""}>${l !== undefined && !st.done ? `<span class="pn">${st.col[l]}</span>` : ""}<span>${esc(o.t)}</span></button></li>`;
        }).join("");
        const all = Object.keys(st.pairs).length === it.L.length;
        return `<div class="match"><ul>${left}</ul><ul>${right}</ul></div>
          ${st.done ? "" : `<p class="hint">Touche un élément, puis celui qui lui correspond. Touche à nouveau pour défaire.</p>
          <button class="btn btn-gold" data-act="validate" ${all ? "" : "disabled"}>Valider</button>`}${fb}`;
      }
      case "year": {
        return `<div class="year">
          <output class="yr-out" id="yr-out" aria-live="polite">${fmtYear(st.v)}</output>
          <input type="range" class="slider" id="yr-range" min="${it.min}" max="${it.max}" step="1" value="${st.v}" aria-label="Année" ${st.done ? "disabled" : ""}>
          <div class="yr-scale"><span>${fmtYear(it.min)}</span><span>${fmtYear(it.max)}</span></div>
          ${st.done ? "" : `<div class="yr-steps">
            <button data-act="ystep" data-d="-10">−10</button><button data-act="ystep" data-d="-1">−1</button>
            <button data-act="ystep" data-d="1">+1</button><button data-act="ystep" data-d="10">+10</button></div>
          <button class="btn btn-gold" data-act="validate">Valider</button>`}
        </div>${fb}`;
      }
    }
    return "";
  }

  function feedbackHTML(it) {
    const st = Q.st;
    const last = Q.i === Q.items.length - 1;
    let title = st.good ? "Exact !" : "Pas tout à fait";
    let extra = "";
    if (it.type === "year") {
      const d = Math.abs(st.v - it.y);
      title = d === 0 ? "Pile dans le mille !" : st.good ? "Très proche !" : "Un peu à côté";
      extra = `<p class="detail">Ta réponse : <b>${fmtYear(st.v)}</b> · Réponse : <b>${esc(it.ans)}</b>${d ? ` · écart de ${d} ${plural(d, "an", "ans")}` : ""}</p>`;
    } else if (it.type === "order") {
      extra = `<ol class="good-order">${it.sorted.map((o) => `<li><span>${esc(o.t)}</span><small>${esc(o.y)}</small></li>`).join("")}</ol>`;
    } else if (it.type === "match") {
      extra = `<ul class="good-pairs">${it.pairs.map((p) => `<li><b>${esc(p[0])}</b> <span>${esc(p[1])}</span></li>`).join("")}</ul>`;
    }
    return `
      <div class="feedback ${st.good ? "good" : "bad"}" id="fb">
        <h3>${title}</h3>
        ${extra}
        ${it.e ? `<p>${esc(it.e)}</p>` : ""}
        <button class="btn btn-gold" data-act="next">${last ? "Voir mon résultat" : "Suite"}</button>
      </div>`;
  }

  function onValidate() {
    const it = Q.items[Q.i];
    const st = Q.st;
    if (st.done) return;
    if (it.type === "order") {
      if (st.picked.length < it.items.length) return;
      settle(st.picked.every((k, pos) => it.items[k].rank === pos));
    } else if (it.type === "match") {
      if (Object.keys(st.pairs).length < it.L.length) return;
      settle(it.L.every((o, k) => it.R[st.pairs[k]].id === o.id));
    } else if (it.type === "year") {
      settle(Math.abs(st.v - it.y) <= it.tol);
    }
  }

  function onMatchTap(side, i) {
    const st = Q.st;
    if (st.done) return;
    const it = Q.items[Q.i];
    const owner = (r) => Object.keys(st.pairs).find((l) => st.pairs[l] === r);
    const unlink = (l) => { delete st.pairs[l]; delete st.col[l]; };

    // Un élément déjà associé : on défait l'association.
    if (side === "L" && st.pairs[i] !== undefined) { unlink(i); st.sel = null; return refreshPlay(); }
    if (side === "R" && owner(i) !== undefined) { unlink(owner(i)); st.sel = null; return refreshPlay(); }

    if (!st.sel || st.sel.side === side) {
      st.sel = st.sel && st.sel.side === side && st.sel.i === i ? null : { side, i };
      return refreshPlay();
    }
    const l = side === "L" ? i : st.sel.i;
    const r = side === "R" ? i : st.sel.i;
    const used = Object.values(st.col);
    let c = 1;
    while (used.includes(c)) c++;
    st.pairs[l] = r;
    st.col[l] = c;
    st.sel = null;
    refreshPlay();
  }

  // Enregistre le résultat d'un défi, puis affiche la correction.
  function settle(good) {
    const it = Q.items[Q.i];
    const st = Q.st;
    st.done = true;
    st.good = good;
    if (good) {
      Q.right++;
      if (!S.ok[it.key]) { S.ok[it.key] = 1; S.xp += CONFIG.xpPerNewAnswer; Q.xp += CONFIG.xpPerNewAnswer; }
      buzz(14);
      sfx("good");
    } else {
      Q.missed.push(it);
      buzz([30, 50, 30]);
      sfx("bad");
    }
    save();
    refreshPlay();
    const fb = document.getElementById("fb");
    if (fb) {
      const btn = fb.querySelector('[data-act="next"]');
      btn.focus({ preventScroll: true });
      btn.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  function onNext() {
    if (Q.i < Q.items.length - 1) {
      Q.i++;
      Q.st = freshState(Q.items[Q.i]);
      render();
    } else {
      finishQuiz();
    }
  }

  function finishQuiz() {
    const n = Q.items.length;
    const stars = Q.mode === "level" ? scoreStars(Q.right) : (Q.right / n >= 0.9 ? 3 : Q.right / n >= 0.7 ? 2 : Q.right / n >= 0.5 ? 1 : 0);
    let bonus = 0, seal = null, firstClear = false, newStars = 0;
    const ownedBefore = ownedKeys();

    if (Q.mode === "level") {
      const e = eraById(Q.eraId);
      const arr = (S.lv[e.id] = (S.lv[e.id] || []).slice());
      for (let k = 0; k < e.levels.length; k++) arr[k] = arr[k] || 0;
      const before = arr[Q.lvl];
      if (stars > before) { arr[Q.lvl] = stars; newStars = stars - before; }
      if (before < 1 && stars >= 1) { firstClear = true; bonus += CONFIG.xpLevelFirst; }
      if (!S.seals[e.id] && e.levels.every((_, k) => arr[k] >= 1)) {
        S.seals[e.id] = 1;
        bonus += CONFIG.xpSeal;
        seal = e;
      }
      S.last = { era: e.id, lvl: Q.lvl };
    }
    if (Q.mode === "daily" && S.daily !== today()) {
      S.daily = today();
      S.stats.daily = (S.stats.daily || 0) + 1;
      bonus += CONFIG.xpDailyBonus;
    }
    S.xp += bonus;
    Q.xp += bonus;
    touchStreak();
    const newChars = [...ownedKeys()].filter((k) => !ownedBefore.has(k)).map((k) => { const [id, i] = k.split(":"); return { e: eraById(id), k: Number(i) }; });
    const newMedals = checkMedals();
    save();

    const e = Q.eraId ? eraById(Q.eraId) : null;
    const nextOpen = Q.mode === "level" && Q.lvl + 1 < e.levels.length && unlocked(e, Q.lvl + 1);
    R = {
      mode: Q.mode, eraId: Q.eraId, lvl: Q.lvl, n, right: Q.right, stars, xp: Q.xp, missed: Q.missed, firstClear, newStars, seal, newChars, newMedals,
      pass: Q.mode === "level" ? stars >= 1 : true, nextOpen,
      lastLevel: Q.mode === "level" && Q.lvl + 1 >= e.levels.length,
      rankUp: rankIndex(S.xp) > Q.rankStart ? RANKS[rankIndex(S.xp)].name : null
    };
    Q = null;
    go("result", {}, "replace");
    if (window.HistoriaAds) window.HistoriaAds.quizFinished();
  }

  // Sons, vibrations et confettis à l'arrivée sur l'écran de résultat.
  function celebrate() {
    if (!R || R.celebrated) return;
    R.celebrated = true;
    if (R.seal || R.rankUp || (R.newChars && R.newChars.length)) { sfx("fanfare"); buzz([60, 40, 60, 40, 120]); Art.confetti(); }
    else if (R.stars === 3) { sfx("fanfare"); buzz([40, 30, 80]); Art.confetti(); }
    else if (R.pass) { sfx("star"); buzz(30); if (R.stars === 2) Art.confetti(["#e9cf8e", "#d8b565", "#f3ead2"]); }
    else sfx("lose");
  }

  function celebrateT() {
    if (!TR || TR.celebrated) return;
    TR.celebrated = true;
    if (TR.kind === "win") { sfx("fanfare"); buzz([60, 40, 60, 40, 120]); Art.confetti(); }
    else if (TR.medals.length || TR.rankUp || TR.newRecord) { sfx("star"); buzz(40); Art.confetti(["#e9cf8e", "#d8b565", "#f3ead2"]); }
    else sfx(TR.kind === "stop" ? "star" : "lose");
  }

  function resultScreen() {
    const e = R.eraId ? eraById(R.eraId) : null;
    const verdicts = ["Courage, la fiche t'aidera à réussir.", "C'est réussi, continue !", "Bien joué, chevalier !", "Magnifique, digne d'un chroniqueur !"];
    const failed = R.mode === "level" && !R.pass;
    const review = R.missed.length
      ? `<section class="review"><h2>À retenir</h2><ul>${R.missed.map((it) => `<li><span>${esc(it.q)}</span><b>${esc(it.ans)}</b></li>`).join("")}</ul></section>`
      : "";
    let buttons = "";
    if (R.mode === "level") {
      if (failed) {
        buttons = `<button class="btn btn-gold" data-act="replay">Réessayer le niveau</button>
          <button class="btn btn-line with-icon" data-act="lesson" data-id="${e.id}" data-lv="${R.lvl}"><span class="bi">${UI.book}</span>Lire la fiche</button>`;
      } else {
        buttons = (R.nextOpen ? `<button class="btn btn-gold" data-act="next-level">Niveau suivant : la fiche</button>` : "")
          + `<button class="btn ${R.nextOpen ? "btn-line" : "btn-gold"}" data-act="replay">${R.stars < 3 ? "Viser 3 étoiles" : "Rejouer le niveau"}</button>`;
      }
      buttons += `<button class="btn btn-line" data-act="era" data-id="${e.id}">Carte de l'époque</button>`;
    } else {
      buttons = '<button class="btn btn-gold" data-act="home">Retour aux époques</button>';
    }
    return `
    <div class="screen result" ${e ? `style="--accent:${e.accent}"` : ""}>
      ${e && R.mode === "level" ? `<figure class="pic sm" aria-hidden="true">${Art.situation(e.id, R.lvl)}</figure>` : ""}
      ${e ? `<p class="res-era">${esc(e.title)}${R.mode === "level" ? ` · Niveau ${R.lvl + 1}` : ""}</p>` : ""}
      <div class="big-stars" role="img" aria-label="${R.stars} étoile${R.stars > 1 ? "s" : ""} sur 3">${[0, 1, 2].map((i) => UI.star(i < R.stars)).join("")}</div>
      <p class="score">${R.right}<small>/${R.n}</small></p>
      <p class="verdict">${failed ? verdicts[0] : verdicts[Math.max(1, R.stars)]}</p>
      ${failed ? `<p class="need">Il faut ${CONFIG.passMin} bonnes réponses pour ouvrir le niveau suivant.</p>` : ""}
      <div class="gains">
        ${R.xp ? `<span class="chip">+${R.xp} XP</span>` : ""}
        ${R.firstClear ? '<span class="chip">Niveau réussi</span>' : ""}
        ${R.mode === "daily" ? '<span class="chip">Défi du jour</span>' : ""}
        ${displayStreak() > 0 ? `<span class="chip">${displayStreak()} ${plural(displayStreak(), "jour", "jours")} de suite</span>` : ""}
      </div>
      ${R.seal ? `<div class="seal-card"><span class="seal-ico">${UI.seal}</span><div><small>Sceau obtenu</small><b>${esc(R.seal.title)}</b><span>Tous les niveaux sont réussis · +${CONFIG.xpSeal} XP</span></div></div>` : ""}
      ${R.rankUp ? `<div class="rankup">Nouveau rang<b>${R.rankUp}</b></div>` : ""}
      ${(R.newChars || []).map((n) => `<button class="char-card" data-act="gallery"><span class="cc-art">${cameo(n.e, n.k, false)}</span><span><small>Nouveau personnage${n.k === 4 ? " légendaire" : ""}</small><b>${esc(castOf(n.e)[n.k].n)}</b><span>${esc(castOf(n.e)[n.k].r)}</span></span></button>`).join("")}
      ${(R.newMedals || []).length ? `<section class="newmedals"><h2>Médaille${R.newMedals.length > 1 ? "s" : ""} obtenue${R.newMedals.length > 1 ? "s" : ""}</h2>${R.newMedals.map((m) => `<div class="mrow t${m.tier}"><span class="mico">${medalIcon(m)}</span><span><b>${esc(m.name)}</b><small>${esc(m.desc)}</small></span></div>`).join("")}</section>` : ""}
      ${review}
      <div class="stack">${buttons}</div>
      ${adSlot()}
    </div>`;
  }

  /* ===== Écrans : Trésor, personnages, médailles ===== */
  const topBar = (title) => `<div class="top"><h1 class="page-title">${esc(title)}</h1></div>`;

  function tresorMenu() {
    const all = S.rec.all || { rung: 0, earn: 0 };
    const lg = leagueOf(all.earn);
    const nextLg = LEAGUES[LEAGUES.findIndex((l) => l[1] === lg[1]) + 1];
    const pct = nextLg ? Math.round(((all.earn - lg[0]) / (nextLg[0] - lg[0])) * 100) : 100;
    const rows = playable.map((e) => {
      const r = S.rec[e.id] || { rung: 0, earn: 0 };
      return `<li><button class="tt" style="--accent:${e.accent}" data-act="tstart" data-scope="${e.id}">
        <span class="medal">${ICONS[e.icon]}</span>
        <span class="tt-text"><b>${esc(e.title)}</b><small>${r.earn ? `Record : ${fmtEcus(r.earn)} · ${leagueOf(r.earn)[1]}${r.legend ? ` · Légende n°${r.legend}` : ""}` : "Pas encore joué"}</small></span>
        <span class="go">${UI.go}</span></button></li>`;
    }).join("");
    const ladder = LADDER.map((v, i) => `<li class="${SAFE.includes(i) ? "safe" : ""} ${i === 14 ? "top" : ""}"><span>${i + 1}</span><b>${fmtEcus(v)}</b>${SAFE.includes(i) ? "<em>palier</em>" : ""}</li>`).reverse().join("");
    return `
    <div class="screen">
      ${topBar("Quiz")}
      <p class="intro-line quiz-intro">Teste-toi sur toutes les époques ou sur un seul thème. Pour apprendre d'abord, va dans « Apprendre ».</p>
      ${defenseCard()}
      <section class="tresor-hero">
        <div class="coin">${UI.seal}</div>
        <h1>Le Trésor du Royaume</h1>
        <p>15 questions, de plus en plus ardues. Gagne jusqu'à <b>1 000 000 d'écus</b>. Deux paliers te protègent : 1 000 et 32 000 écus. Trois jokers : le 50/50, l'appel au public et l'appel à un historien. Après le million, la <b>Légende</b> continue sans limite.</p>
      </section>
      <section class="league">
        <div class="league-head"><span class="league-badge">${esc(lg[1])}</span><span>Record : <b>${fmtEcus(all.earn)}</b>${all.legend ? ` · Légende n°${all.legend}` : ""}</span></div>
        <div class="bar"><i data-w="${pct}"></i></div>
        <p class="league-next">${nextLg ? `Prochain titre : <b>${nextLg[1]}</b> à ${fmtEcus(nextLg[0])}` : "Tu es au sommet du royaume."}</p>
      </section>
      <button class="btn btn-gold" data-act="tstart" data-scope="all">Tous les thèmes</button>
      <h2 class="section">Ou un seul thème</h2>
      <ul class="tlist">${rows}</ul>
      <h2 class="section">Les paliers</h2>
      <ol class="ladder">${ladder}</ol>
      <p class="mix-note">Un classement en ligne entre joueurs viendra plus tard. Pour l'instant, bats tes propres records et monte dans les titres.</p>
    </div>`;
  }

  const refreshT = () => { const el = document.getElementById("tgame-body"); if (el) el.innerHTML = tgameInner(); };

  function tgameScreen() { return `<div class="screen tscreen" id="tgame"><div id="tgame-body">${tgameInner()}</div></div>`; }

  function tgameInner() {
    const t = T;
    const it = t.qs[t.i];
    const e = t.scope === "all" ? null : eraById(t.scope);
    const safe = safeEarn(t.i);
    const inLegend = t.i >= 15;
    const life = (k, label, ico) => `<button class="life ${t.used[k] ? "used" : ""}" data-act="life" data-k="${k}" ${t.used[k] || t.rev ? "disabled" : ""} aria-label="${label}${t.used[k] ? " (utilisé)" : ""}">${ico}<span>${label}</span></button>`;
    const L = "ABCD";
    const opts = it.opts.map((o, k) => {
      const gone = t.removed.includes(k);
      let cls = "";
      if (t.rev) cls = o.ok ? "correct" : k === t.sel ? "wrong" : "dim";
      else if (k === t.sel) cls = "chosen";
      return `<li><button class="opt ${cls} ${gone ? "gone" : ""}" data-act="tpick" data-i="${k}" ${t.rev || gone ? "disabled" : ""}><span class="letter">${L[k]}</span><span>${gone ? "" : esc(o.t)}</span>${t.rev ? (o.ok ? UI.check : k === t.sel ? UI.cross : UI.check) : UI.check}</button></li>`;
    }).join("");
    let help = "";
    if (t.help && t.help.kind === "pub") {
      help = `<div class="help"><b>Le peuple de la cité a voté</b><div class="crowd">${it.opts.map((o, k) => (t.removed.includes(k) ? "" : `<div class="cb"><i style="height:${t.help.pct[k] || 0}%"></i><span>${t.help.pct[k] || 0}%</span><em>${L[k]}</em></div>`)).join("")}</div></div>`;
    } else if (t.help && t.help.kind === "expert") {
      help = `<div class="help"><b>Frère Aubry, chroniqueur</b><p>« ${esc(t.help.say)} »</p></div>`;
    } else if (t.help && t.help.kind === "fifty") {
      help = `<div class="help"><b>Deux mauvaises réponses ont disparu.</b></div>`;
    }
    let foot = "";
    if (t.rev) {
      const last = t.i === 14;
      const buttons = !t.good
        ? '<button class="btn btn-gold" data-act="tnext">Voir mon bilan</button>'
        : last
          ? `<button class="btn btn-gold" data-act="tnext">Récupérer 1 000 000 d'écus</button><button class="btn btn-line" data-act="tlegend">Continuer vers la Légende · risque de tout perdre sauf ${fmtEcus(LADDER[SAFE[1]])}</button>`
          : '<button class="btn btn-gold" data-act="tnext">Question suivante</button>';
      foot = `<div class="feedback ${t.good ? "good" : "bad"}" id="fb"><h3>${t.good ? (last ? "Le Trésor est à toi !" : "Bonne réponse !") : "Mauvaise réponse"}</h3>${t.good ? "" : `<p>La bonne réponse : <b>${esc(it.ans)}</b></p>`}${it.e ? `<p>${esc(it.e)}</p>` : ""}${buttons}</div>`;
    } else {
      foot = `<button class="btn btn-gold" data-act="tvalid" ${t.sel === null ? "disabled" : ""}>Valider ma réponse</button>
        ${t.i > 0 ? `<button class="btn btn-line" data-act="tstop">Je m'arrête · garder ${fmtEcus(prize(t.i - 1))}</button>` : ""}`;
    }
    return `
      <div class="top">
        <button class="icon-btn" data-act="tquit" aria-label="Abandonner">${UI.close}</button>
        <div class="prize"><small>${inLegend ? `Légende n°${legendN(t.i)}` : `Question ${t.i + 1} sur 15`}</small><b>${fmtEcus(prize(t.i))}</b></div>
        <span class="safe-chip" title="Palier garanti">${UI.lock}${safe ? fmtEcus(safe) : "Aucun palier"}</span>
      </div>
      ${picOfItem(it)}
      <div class="lives">${life("fifty", "50/50", '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M5 6h6M5 18h6M14 6h5M14 18h5"/><path d="M12 3v18" stroke-dasharray="2 3"/></svg>')}
        ${life("pub", "Public", '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M5 20v-6M10 20V8M15 20v-9M20 20V4"/></svg>')}
        ${life("expert", "Historien", '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.500 3.500-7 8-7s8 2.500 8 7"/></svg>')}</div>
      <section class="q-card" ${e ? `style="--accent:${e.accent}"` : ""}>
        <p class="q-era">${inLegend ? "La Légende · " : ""}${e ? esc(e.title) : "Tous les thèmes"}</p>
        <h1 class="q-text" style="font-weight:400">${esc(it.q)}</h1>
      </section>
      ${help}
      <ul class="options">${opts}</ul>
      <div class="tfoot">${foot}</div>`;
  }

  function tresultScreen() {
    const r = TR;
    const e = r.scope === "all" ? null : eraById(r.scope);
    const head = r.reached > 15 ? (r.kind === "stop" ? `Légende n°${r.reached - 15} : tu repars couvert de gloire !` : `Tombé à la Légende n°${r.reached - 14}… mais ton palier te protège.`) : r.kind === "win" ? "Le Trésor du Royaume est à toi !" : r.kind === "stop" ? "Sage décision, tu repars avec ton or." : "Raté… mais ton palier te protège.";
    const medals = r.medals.length ? `<section class="newmedals"><h2>Nouvelle${r.medals.length > 1 ? "s" : ""} médaille${r.medals.length > 1 ? "s" : ""}</h2>${r.medals.map((m) => `<div class="mrow t${m.tier}"><span class="mico">${medalIcon(m)}</span><span><b>${esc(m.name)}</b><small>${esc(m.desc)}</small></span></div>`).join("")}</section>` : "";
    return `
    <div class="screen result">
      <p class="res-era">${e ? esc(e.title) : "Tous les thèmes"}</p>
      <div class="coin big">${UI.seal}</div>
      <p class="score tscore">${fmtEcus(r.earn)}</p>
      <p class="verdict">${head}</p>
      <div class="gains">
        <span class="chip">${r.reached > 15 ? `Légende n°${r.reached - 15}` : `${r.reached}/15 bonnes réponses`}</span>
        <span class="chip">${esc(r.league[1])}</span>
        ${r.xp ? `<span class="chip">+${r.xp} XP</span>` : ""}
        ${r.newRecord ? '<span class="chip gold">Nouveau record !</span>' : ""}
      </div>
      ${r.rankUp ? `<div class="rankup">Nouveau rang<b>${r.rankUp}</b></div>` : ""}
      ${medals}
      <div class="stack">
        <button class="btn btn-gold" data-act="tstart" data-scope="${r.scope}">Rejouer</button>
        <button class="btn btn-line" data-act="tresor">Menu du Trésor</button>
        <button class="btn btn-line" data-act="home">Retour aux époques</button>
      </div>
      ${adSlot()}
    </div>`;
  }

  function galleryScreen() {
    const sections = playable.map((e) => {
      const cast = castOf(e);
      if (!cast.length) return "";
      const n = cast.filter((_, k) => charUnlocked(e, k)).length;
      return `<section class="gal-era" style="--accent:${e.accent}">
        <h2><span>${esc(e.title)}</span><small>${n}/${cast.length}</small></h2>
        <ul class="gal">${cast.map((c, k) => {
          const open = charUnlocked(e, k);
          return `<li><button class="gal-card ${open ? "" : "locked"}" data-act="char" data-id="${e.id}" data-k="${k}" aria-label="${open ? esc(c.n) : "Personnage verrouillé"}">${cameo(e, k, !open)}<b>${open ? esc(c.n) : "???"}</b></button></li>`;
        }).join("")}</ul></section>`;
    }).join("");
    return `<div class="screen">${topBar("Personnages")}
      <p class="gal-intro">${charsOwned()} sur ${charsTotal()} personnages. Réussis les niveaux pairs (2, 4, 6, 8 et 10) de chaque époque pour les rencontrer.</p>
      ${sections || '<p class="mix-note">Les personnages arrivent bientôt.</p>'}</div>`;
  }

  function openChar(id, k) {
    const e = eraById(id);
    const c = castOf(e)[k];
    if (!c) return;
    const open = charUnlocked(e, k);
    const o = document.createElement("div");
    o.id = "overlay";
    o.className = "overlay";
    o.innerHTML = `<div class="sheet charsheet" style="--accent:${e.accent}" role="dialog" aria-modal="true" aria-label="${open ? esc(c.n) : "Personnage verrouillé"}">
      <div class="cs-head">${cameo(e, k, !open)}
        <div><small>${esc(e.title)}${k === 4 ? " · légendaire" : ""}</small><h2>${open ? esc(c.n) : "Personnage mystère"}</h2><p>${open ? `${esc(c.r)} · ${esc(c.d)}` : `Réussis le niveau ${2 * k + 2} de l'époque « ${esc(e.title)} » pour le rencontrer.`}</p></div></div>
      ${open ? `<p class="cs-bio">${esc(c.b)}</p>` : ""}
      <div class="stack"><button class="btn btn-line" data-act="close-sheet">Fermer</button></div></div>`;
    document.body.appendChild(o);
    o.addEventListener("click", (ev) => { if (ev.target === o) closeSheet(); });
  }

  function medalsScreen() {
    const got = MEDALS.filter((m) => S.medals[m.id]).length;
    const rows = MEDALS.map((m) => {
      const has = !!S.medals[m.id];
      const mx = medalMax(m);
      const cur = Math.min(m.cur(), mx);
      return `<li class="mrow t${m.tier} ${has ? "" : "off"}"><span class="mico">${has ? medalIcon(m) : UI.lock}</span>
        <span class="mtext"><b>${esc(m.name)}</b><small>${esc(m.desc)}</small>${has ? "" : `<span class="bar"><i style="width:${Math.round((cur / mx) * 100)}%"></i></span>`}</span>
        <span class="mprog">${has ? "✓" : `${cur}/${mx}`}</span></li>`;
    }).join("");
    return `<div class="screen">${topBar("Médailles")}
      <p class="gal-intro">${got} médailles sur ${MEDALS.length}. Joue chaque jour, termine des époques, tente le Trésor du Royaume.</p>
      <ul class="medals">${rows}</ul></div>`;
  }

  /* ===== Fenêtres ===== */
  function closeSheet() {
    const o = document.getElementById("overlay");
    if (o) o.remove();
  }
  function openRanks() {
    const idx = rankIndex(S.xp);
    const m = masteredTotal();
    const o = document.createElement("div");
    o.id = "overlay";
    o.className = "overlay";
    o.innerHTML = `
      <div class="sheet" role="dialog" aria-modal="true" aria-label="Rangs et réglages">
        <h2>Les rangs</h2>
        <ul class="ranks">
          ${RANKS.map((r, i) => `<li class="${i <= idx ? "reached" : ""} ${i === idx ? "current" : ""}"><b>${r.name}</b><span>${r.xp} XP</span></li>`).join("")}
        </ul>
        <p class="note">${m} bonne${m > 1 ? "s" : ""} réponse${m > 1 ? "s" : ""} découverte${m > 1 ? "s" : ""} sur ${bankSize()}. Chaque réponse nouvelle rapporte ${CONFIG.xpPerNewAnswer} XP, un niveau réussi ${CONFIG.xpLevelFirst} XP, un sceau d'époque ${CONFIG.xpSeal} XP.</p>
        <div class="toggles">
          <button class="toggle ${S.music !== false ? "on" : ""}" data-act="tmusic" aria-pressed="${S.music !== false}">${UI.sound(S.music !== false)}<span>Musique</span></button>
          <button class="toggle ${S.sound ? "on" : ""}" data-act="tsound" aria-pressed="${S.sound}">${UI.sound(S.sound)}<span>Sons</span></button>
          <button class="toggle ${S.vib ? "on" : ""}" data-act="tvib" aria-pressed="${S.vib}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8" y="3" width="8" height="18" rx="2"/><path d="M4 8v8M20 8v8"/></svg><span>Vibrations</span></button>
        </div>
        <div class="langrow" role="group" aria-label="Langue / Language">
          <button class="seg ${EN ? "" : "on"}" data-act="setlang" data-l="fr">Français</button>
          <button class="seg ${EN ? "on" : ""}" data-act="setlang" data-l="en">English</button>
        </div>
        ${canSell() ? noAdsCard() : ""}
        <div class="stack"><button class="btn btn-line" data-act="close-sheet">Fermer</button></div>
        <div class="links"><button class="linkbtn" data-act="reset">Réinitialiser ma progression</button></div>
      </div>`;
    document.body.appendChild(o);
    o.addEventListener("click", (ev) => { if (ev.target === o) closeSheet(); });
    o.querySelector("[data-act='close-sheet']").focus();
  }

  /* ===== Événements ===== */
  const launch = (e, i, replace) => {
    if (!e || !e.levels[i] || !unlocked(e, i)) return;
    sfx("tap");
    startQuiz(levelItems(e, i), { mode: "level", eraId: e.id, lvl: i, replace });
  };

  document.addEventListener("click", (ev) => {
    const el = ev.target.closest("[data-act]");
    if (!el || el.disabled) return;
    const act = el.dataset.act;
    switch (act) {
      case "era": go("era", { id: el.dataset.id }, view.name === "result" ? "replace" : "push"); sfx("tap"); break;
      case "back": back(); break;
      case "home": go("home", {}, "replace"); break;
      case "lesson": go("lesson", { id: el.dataset.id, lv: Number(el.dataset.lv) }, view.name === "result" ? "replace" : "push"); break;
      case "start": launch(eraById(el.dataset.id), Number(el.dataset.lv), view.name === "lesson"); break;
      case "replay": launch(eraById(R.eraId), R.lvl, true); break;
      case "next-level": go("lesson", { id: R.eraId, lv: R.lvl + 1 }, "replace"); sfx("tap"); break;
      case "tab": { const v = el.dataset.v; if (v !== view.name) go(v, {}, "replace"); sfx("tap"); break; }
      case "tresor": go("tresor", {}, view.name === "tresult" ? "replace" : "push"); break;
      case "dfstart": startDefense(); break;
      case "dfgo": dfGo(); break;
      case "dfquit": if (!DF || DF.phase !== "play" || confirm(L2("Quitter la partie ?", "Leave the game?"))) { if (DF && DF.game) DF.game.destroy(); DF = null; back(); } break;
      case "tstart": startTresor(el.dataset.scope); break;
      case "gallery": go("gallery", {}, view.name === "result" ? "replace" : "push"); break;
      case "medals": go("medals"); break;
      case "char": openChar(el.dataset.id, Number(el.dataset.k)); break;
      case "life": useLifeline(el.dataset.k); break;
      case "tpick": if (T && !T.rev) { T.sel = Number(el.dataset.i); sfx("tap"); refreshT(); } break;
      case "tvalid": {
        if (!T || T.rev || T.sel === null) break;
        T.rev = true;
        T.good = T.qs[T.i].opts[T.sel].ok;
        sfx(T.good ? "good" : "bad");
        buzz(T.good ? 14 : [30, 50, 30]);
        refreshT();
        const fb = document.getElementById("fb");
        if (fb) fb.scrollIntoView({ behavior: "smooth", block: "nearest" });
        break;
      }
      case "tnext": {
        if (!T || !T.rev) break;
        if (!T.good) return endTresor("wrong");
        if (T.i === 14) return endTresor("win");
        T.i++; T.sel = null; T.rev = false; T.help = null; T.removed = [];
        if (T.i >= T.qs.length) T.qs.push(nextLegendQ(T));
        refreshT();
        window.scrollTo(0, 0);
        break;
      }
      case "tlegend": {
        if (!T || !T.rev || !T.good || T.i !== 14) break;
        T.i++; T.sel = null; T.rev = false; T.help = null; T.removed = []; T.used = {};
        T.qs.push(nextLegendQ(T));
        sfx("fanfare"); buzz([40, 30, 80]); Art.confetti();
        refreshT();
        window.scrollTo(0, 0);
        break;
      }
      case "tstop": if (T && !T.rev && T.i > 0 && confirm(HT(`Partir avec ${fmtEcus(prize(T.i - 1))} ?`))) endTresor("stop"); break;
      case "tquit": if (confirm(HT("Abandonner la partie ? Tu garderas ton dernier palier."))) { if (T && T.i > 0) endTresor("wrong"); else { T = null; back(); } } break;
      case "daily": {
        if (S.daily === today()) break;
        const pool = [];
        playable.forEach((e) => e.levels.forEach((lv, i) => lv.items.forEach((d, k) => pool.push(prep(d.type, d, `${e.id}:${i}:${k}`, e.title, lv.title)))));
        const rnd = seeded("historia-" + today());
        const picks = shuffle(shuffle(easyPool("all"), rnd).slice(0, 3).concat(shuffle(pool, rnd).slice(0, CONFIG.questionsPerDaily - 3)), rnd);
        startQuiz(picks, { mode: "daily" });
        break;
      }
      case "answer": {
        if (!Q || Q.st.done) break;
        const k = Number(el.dataset.i);
        Q.st.pick = k;
        settle(Q.items[Q.i].opts[k].ok);
        break;
      }
      case "tf": {
        if (!Q || Q.st.done) break;
        const v = el.dataset.v === "1";
        Q.st.pick = v;
        settle(Q.items[Q.i].a === v);
        break;
      }
      case "ord": {
        if (!Q || Q.st.done) break;
        const k = Number(el.dataset.i);
        const at = Q.st.picked.indexOf(k);
        if (at >= 0) Q.st.picked.splice(at, 1);
        else Q.st.picked.push(k);
        sfx("tap");
        refreshPlay();
        break;
      }
      case "mt": sfx("tap"); onMatchTap(el.dataset.side, Number(el.dataset.i)); break;
      case "ystep": {
        if (!Q || Q.st.done) break;
        const it = Q.items[Q.i];
        Q.st.v = Math.min(it.max, Math.max(it.min, Q.st.v + Number(el.dataset.d)));
        refreshPlay();
        break;
      }
      case "validate": if (Q) onValidate(); break;
      case "next": if (Q) onNext(); break;
      case "quit": Q = null; back(); break;
      case "ranks": openRanks(); break;
      case "close-sheet": closeSheet(); break;
      case "tmusic": S.music = S.music === false; save(); closeSheet(); openRanks(); sfx("tap"); break;
      case "tsound": S.sound = !S.sound; save(); closeSheet(); openRanks(); sfx("tap"); break;
      case "tvib": S.vib = !S.vib; save(); closeSheet(); openRanks(); buzz(30); break;
      case "reset":
        if (confirm(HT("Effacer toute votre progression (XP, rangs, niveaux, sceaux, série) ?"))) {
          S = defaults(); save(); closeSheet(); render();
        }
        break;
      case "privacy": window.open(EN ? "privacy.html?lang=en" : "privacy.html", "_blank", "noopener"); break;
      case "lang": window.HI.set(EN ? "fr" : "en"); break;
      case "setlang": if (el.dataset.l !== (EN ? "en" : "fr")) window.HI.set(el.dataset.l); break;
      case "noads": buyNoAds(el); break;
      case "restore": restoreNoAds(el); break;
      case "book": ev.preventDefault && ev.preventDefault(); if (window.HistoriaAff) window.HistoriaAff.open(el.dataset.href); break;
    }
  });

  // Curseur de l'année.
  document.addEventListener("input", (ev) => {
    const el = ev.target;
    if (el.id !== "yr-range" || !Q || Q.st.done) return;
    Q.st.v = Number(el.value);
    const out = document.getElementById("yr-out");
    if (out) out.textContent = fmtYear(Q.st.v);
  });

  document.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape") closeSheet();
  });

  /* ===== Démarrage ===== */
  history.replaceState({ name: "home" }, "");
  render();

  const isNative = !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
  if (!isNative && "serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
    window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
  }
})();
