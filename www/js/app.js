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
    return Object.assign({}, m, c ? { intro: c.intro, levels: c.levels } : { intro: "Cette époque arrive bientôt.", levels: [] });
  });
  const eraById = (id) => ERAS.find((e) => e.id === id);
  const playable = ERAS.filter((e) => e.levels.length);

  /* ===== Sauvegarde locale ===== */
  const defaults = () => ({ xp: 0, lv: {}, ok: {}, seals: {}, streak: { count: 0, last: "" }, daily: "", last: null, sound: true, vib: true });
  const load = () => {
    try {
      const s = JSON.parse(localStorage.getItem(KEY));
      if (s && typeof s === "object") return Object.assign(defaults(), s);
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
  const fmtYear = (y) => (y < 0 ? `${-y} av. J.-C.` : String(y));
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
  const levelItems = (e, i) => {
    const lv = e.levels[i];
    return shuffle(lv.items.map((d, k) => prep(d.type, d, `${e.id}:${i}:${k}`, e.title, lv.title)));
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
    if (st.name === "quiz" || st.name === "result") {
      view = { name: "home" };
      history.replaceState({ name: "home" }, "");
    } else {
      view = st;
    }
    render();
  });

  /* ===== Écrans ===== */
  const render = () => {
    window.scrollTo(0, 0);
    if (window.HistoriaAds) window.HistoriaAds.screen(view.name);
    if (view.name === "era" && eraById(view.id)) { $app.innerHTML = eraScreen(eraById(view.id)); return animateBars(); }
    if (view.name === "lesson" && eraById(view.id)) return ($app.innerHTML = lessonScreen(eraById(view.id), view.lv || 0));
    if (view.name === "quiz" && Q) return ($app.innerHTML = quizScreen());
    if (view.name === "result" && R) { $app.innerHTML = resultScreen(); return celebrate(); }
    view = { name: "home" };
    $app.innerHTML = homeScreen();
    animateBars();
  };

  const animateBars = () => {
    requestAnimationFrame(() => document.querySelectorAll(".bar > i[data-w]").forEach((el) => (el.style.width = el.dataset.w + "%")));
  };

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
          <span class="era-art">${Art.scene(e.scene, e.accent)}</span>
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

      ${resume}

      <button class="daily" data-act="daily" ${doneToday ? 'aria-disabled="true"' : ""}>
        <span>
          <h2>Défi du jour</h2>
          <p>${doneToday ? "Relevé. Revenez demain pour un nouveau défi." : `${CONFIG.questionsPerDaily} défis de toutes les époques, +${CONFIG.xpDailyBonus} XP`}</p>
        </span>
        <span class="go">${doneToday ? UI.star(true) : UI.go}</span>
      </button>

      <h2 class="section">Les époques</h2>
      <ul class="eras">${eraCards}</ul>

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
      const act = open ? `data-act="start" data-id="${e.id}" data-lv="${i}"` : "disabled";
      return `
      <li class="lv ${cls}">
        <button class="lv-main" ${act} aria-label="Niveau ${i + 1}, ${esc(lv.title)}${open ? "" : ", verrouillé"}">
          <span class="lv-num">${open ? i + 1 : UI.lock}</span>
          <span class="lv-text"><b>${esc(lv.title)}</b><small>${esc(lv.lesson.d)}</small></span>
          ${open ? starsRow(s) : ""}
        </button>
        <button class="lv-read" data-act="lesson" data-id="${e.id}" data-lv="${i}" aria-label="Lire la fiche du niveau ${i + 1}" title="Lire la fiche">${UI.book}</button>
      </li>`;
    }).join("");

    return `
    <div class="screen" style="--accent:${e.accent}">
      <div class="art-hero">
        ${Art.scene(e.scene, e.accent)}
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
      <p class="mix-note">Touche un niveau pour jouer tout de suite. La fiche (<span class="inline-ico">${UI.book}</span>) est facultative.</p>
      <ol class="levels">${rows}</ol>
      ${adSlot()}
    </div>`;
  }

  /* ===== Fiche (facultative) ===== */
  function lessonScreen(e, i) {
    const lv = e.levels[i];
    const L = lv.lesson;
    return `
    <div class="screen lesson" style="--accent:${e.accent}">
      <div class="top">
        <button class="icon-btn" data-act="back" aria-label="Fermer la fiche">${UI.close}</button>
        <p class="lesson-crumb">Niveau ${i + 1} · ${esc(lv.title)}</p>
      </div>
      <article class="scroll-card">
        <div class="sc-head">
          <span class="sc-medal">${ICONS[e.icon]}</span>
          <span class="sc-meta"><span class="sc-era">${esc(e.title)}</span><span class="sc-date">${esc(L.d)}</span></span>
        </div>
        <h1 class="sc-title">${esc(L.t)}</h1>
        <div class="sc-rule">${UI.lisSmall}</div>
        ${paras(L.p)}
      </article>
      <div class="stack">
        <button class="btn btn-gold" data-act="start" data-id="${e.id}" data-lv="${i}" data-from="lesson">${unlocked(e, i) ? "Jouer ce niveau" : "Niveau verrouillé"}</button>
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
      bonus += CONFIG.xpDailyBonus;
    }
    S.xp += bonus;
    Q.xp += bonus;
    if (S.streak.last !== today()) {
      S.streak = { count: S.streak.last === yesterday() ? S.streak.count + 1 : 1, last: today() };
    }
    save();

    const e = Q.eraId ? eraById(Q.eraId) : null;
    const nextOpen = Q.mode === "level" && Q.lvl + 1 < e.levels.length && unlocked(e, Q.lvl + 1);
    R = {
      mode: Q.mode, eraId: Q.eraId, lvl: Q.lvl, n, right: Q.right, stars, xp: Q.xp, missed: Q.missed, firstClear, newStars, seal,
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
    if (R.seal || R.rankUp) { sfx("fanfare"); buzz([60, 40, 60, 40, 120]); Art.confetti(); }
    else if (R.stars === 3) { sfx("fanfare"); buzz([40, 30, 80]); Art.confetti(); }
    else if (R.pass) { sfx("star"); buzz(30); if (R.stars === 2) Art.confetti(["#e9cf8e", "#d8b565", "#f3ead2"]); }
    else sfx("lose");
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
        buttons = (R.nextOpen ? `<button class="btn btn-gold" data-act="next-level">Niveau suivant</button>` : "")
          + `<button class="btn ${R.nextOpen ? "btn-line" : "btn-gold"}" data-act="replay">${R.stars < 3 ? "Viser 3 étoiles" : "Rejouer le niveau"}</button>`;
      }
      buttons += `<button class="btn btn-line" data-act="era" data-id="${e.id}">Carte de l'époque</button>`;
    } else {
      buttons = '<button class="btn btn-gold" data-act="home">Retour aux époques</button>';
    }
    return `
    <div class="screen result" ${e ? `style="--accent:${e.accent}"` : ""}>
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
      ${review}
      <div class="stack">${buttons}</div>
      ${adSlot()}
    </div>`;
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
          <button class="toggle ${S.sound ? "on" : ""}" data-act="tsound" aria-pressed="${S.sound}">${UI.sound(S.sound)}<span>Sons</span></button>
          <button class="toggle ${S.vib ? "on" : ""}" data-act="tvib" aria-pressed="${S.vib}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8" y="3" width="8" height="18" rx="2"/><path d="M4 8v8M20 8v8"/></svg><span>Vibrations</span></button>
        </div>
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
      case "next-level": launch(eraById(R.eraId), R.lvl + 1, true); break;
      case "daily": {
        if (S.daily === today()) break;
        const pool = [];
        playable.forEach((e) => e.levels.forEach((lv, i) => lv.items.forEach((d, k) => pool.push(prep(d.type, d, `${e.id}:${i}:${k}`, e.title, lv.title)))));
        const picks = shuffle(pool, seeded("historia-" + today())).slice(0, CONFIG.questionsPerDaily);
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
      case "tsound": S.sound = !S.sound; save(); closeSheet(); openRanks(); sfx("tap"); break;
      case "tvib": S.vib = !S.vib; save(); closeSheet(); openRanks(); buzz(30); break;
      case "reset":
        if (confirm("Effacer toute votre progression (XP, rangs, niveaux, sceaux, série) ?")) {
          S = defaults(); save(); closeSheet(); render();
        }
        break;
      case "privacy": window.open("privacy.html", "_blank", "noopener"); break;
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

  document.addEventListener("keydown", (ev) => { if (ev.key === "Escape") closeSheet(); });

  /* ===== Démarrage ===== */
  history.replaceState({ name: "home" }, "");
  render();

  const isNative = !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
  if (!isNative && "serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
    window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
  }
})();
