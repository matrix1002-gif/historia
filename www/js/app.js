(() => {
  "use strict";

  /* ===== Réglages ===== */
  const CONFIG = {
    ads: false,          // passer à true quand une régie publicitaire est branchée
    questionsPerDaily: 5,
    sessionSize: 10,     // nombre de défis par partie d'époque
    xpPerNewAnswer: 10,
    xpDailyBonus: 20
  };
  const KEY = "historia.v1";

  /* ===== Fusion des chroniques et jeux supplémentaires ===== */
  if (typeof EXTRAS !== "undefined") ERAS.forEach((e) => Object.assign(e, EXTRAS[e.id] || {}));

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
  const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

  const shield = (idx) => `
    <svg class="shield" viewBox="0 0 64 72" aria-hidden="true">
      <defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#213a82"/><stop offset="1" stop-color="#0b1430"/></linearGradient></defs>
      <path d="M32 3l26 9v24c0 16-12 27-26 33C18 63 6 52 6 36V12z" fill="url(#sg)" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M32 9l20 7v20c0 12-9 21-20 26-11-5-20-14-20-26V16z" fill="none" stroke="currentColor" stroke-opacity=".35" stroke-width="1.2"/>
      <text x="32" y="43" text-anchor="middle" font-family="Cinzel, Georgia, serif" font-weight="700" font-size="${ROMAN[idx].length > 2 ? 17 : 22}" fill="currentColor">${ROMAN[idx]}</text>
    </svg>`;

  /* ===== Sauvegarde locale ===== */
  const defaults = () => ({ xp: 0, mastered: {}, best: {}, stars: {}, read: {}, streak: { count: 0, last: "" }, daily: "" });
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
  const eraById = (id) => ERAS.find((e) => e.id === id);
  const plural = (n, one, many) => (n > 1 ? many : one);
  const fmtYear = (y) => (y < 0 ? `${-y} av. J.-C.` : String(y));
  const buzz = (p) => { try { if (navigator.vibrate) navigator.vibrate(p); } catch (e) { /* ignoré */ } };

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

  /* ===== Banque de défis ===== */
  const TYPE_LABEL = { qcm: "Question", tf: "Vrai ou faux ?", order: "Chronologie", match: "Association", year: "Devine l'année" };
  const poolCache = {};
  // Chaque défi de l'époque : { key, type, era, d }. Les clés des QCM restent « époque:n° » pour garder la progression existante.
  function poolOf(era) {
    if (poolCache[era.id]) return poolCache[era.id];
    const out = [];
    const add = (type, list, keyOf) => (list || []).forEach((d, i) => out.push({ key: keyOf(i), type, era: era.title, d }));
    add("qcm", era.questions, (i) => `${era.id}:${i}`);
    add("tf", era.tf, (i) => `${era.id}:tf${i}`);
    add("order", era.order, (i) => `${era.id}:or${i}`);
    add("match", era.match, (i) => `${era.id}:ma${i}`);
    add("year", era.year, (i) => `${era.id}:yr${i}`);
    return (poolCache[era.id] = out);
  }

  // Transforme un défi en objet jouable (ordre des choix mélangé).
  function prep(s) {
    const d = s.d;
    const base = { key: s.key, type: s.type, era: s.era, q: d.q, e: d.e || "" };
    switch (s.type) {
      case "qcm":
        return Object.assign(base, { opts: shuffle([{ t: d.c, ok: true }, ...d.w.map((t) => ({ t, ok: false }))]), ans: d.c });
      case "tf":
        return Object.assign(base, { a: d.a, ans: d.a ? "Vrai" : "Faux" });
      case "order": {
        const sorted = d.items.map((o, rank) => Object.assign({ rank }, o));
        return Object.assign(base, { items: shuffle(sorted), sorted, ans: sorted.map((o) => o.t).join(" → ") });
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

  const SESSION_MIX = { qcm: 5, tf: 2, year: 1, order: 1, match: 1 };
  function pickSession(era) {
    const pool = poolOf(era);
    const chosen = [];
    Object.entries(SESSION_MIX).forEach(([type, n]) => {
      const group = pool.filter((s) => s.type === type);
      const fresh = shuffle(group.filter((s) => !S.mastered[s.key]));
      const known = shuffle(group.filter((s) => S.mastered[s.key]));
      chosen.push(...fresh.concat(known).slice(0, n));
    });
    if (chosen.length < CONFIG.sessionSize) {
      chosen.push(...shuffle(pool.filter((s) => !chosen.includes(s))).slice(0, CONFIG.sessionSize - chosen.length));
    }
    return shuffle(chosen).map(prep);
  }

  const displayStreak = () => (S.streak.last === today() || S.streak.last === yesterday() ? S.streak.count : 0);
  const masteredIn = (era) => poolOf(era).filter((s) => S.mastered[s.key]).length;
  const starsRow = (n, total = 3) => `<span class="stars" role="img" aria-label="${n} étoile${n > 1 ? "s" : ""} sur ${total}">${Array.from({ length: total }, (_, i) => UI.star(i < n)).join("")}</span>`;
  const adSlot = () => (CONFIG.ads ? '<div class="ad-slot" id="ad-slot" aria-label="Publicité">Publicité</div>' : "");

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
    if (view.name === "era") return ($app.innerHTML = eraScreen(eraById(view.id)));
    if (view.name === "lesson") return ($app.innerHTML = lessonScreen(eraById(view.id)));
    if (view.name === "quiz" && Q) return ($app.innerHTML = quizScreen());
    if (view.name === "result" && R) return ($app.innerHTML = resultScreen());
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

    const eraCards = ERAS.map((e) => {
      const total = poolOf(e).length;
      const m = masteredIn(e);
      return `
      <li>
        <button class="era" style="--accent:${e.accent}" data-act="era" data-id="${e.id}" aria-label="${esc(e.title)}, ${m} défis maîtrisés sur ${total}, ${S.stars[e.id] || 0} étoiles sur 3">
          <span class="medal">${ICONS[e.icon]}</span>
          <span>
            <span class="era-title">${esc(e.title)}</span>
            <span class="era-period" style="display:block">${esc(e.period)}</span>
            <span class="era-prog"><span class="bar"><i data-w="${Math.round((m / total) * 100)}"></i></span>${m}/${total}</span>
          </span>
          <span class="era-side"><span class="numeral">${e.num}</span>${starsRow(S.stars[e.id] || 0)}</span>
        </button>
      </li>`;
    }).join("");

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

      <button class="daily" data-act="daily" ${doneToday ? 'aria-disabled="true"' : ""}>
        <span>
          <h2>Défi du jour</h2>
          <p>${doneToday ? "Relevé. Revenez demain pour un nouveau défi." : `${CONFIG.questionsPerDaily} défis de toutes les époques, +${CONFIG.xpDailyBonus} XP`}</p>
        </span>
        <span class="go">${doneToday ? UI.star(true) : UI.go}</span>
      </button>

      <h2 class="section">Les chroniques</h2>
      <ul class="eras">${eraCards}</ul>

      ${adSlot()}
      <p class="foot"><button class="linkbtn" data-act="privacy">Confidentialité</button></p>
    </div>`;
  }

  function eraScreen(e) {
    const total = poolOf(e).length;
    const m = masteredIn(e);
    const best = S.best[e.id];
    const read = !!S.read[e.id];
    const hasLesson = e.lesson && e.lesson.length;
    const lessonBtn = hasLesson
      ? `<button class="btn ${read ? "btn-line" : "btn-gold"} with-icon" data-act="lesson" data-id="${e.id}"><span class="bi">${ICONS.scroll}</span>${read ? "Relire la chronique" : "Lire la chronique"}</button>`
      : "";
    const quizBtn = `<button class="btn ${read || !hasLesson ? "btn-gold" : "btn-line"}" data-act="start" data-id="${e.id}">${best === undefined ? "Relever le défi" : "Rejouer le défi"}</button>`;
    return `
    <div class="screen" style="--accent:${e.accent}">
      <div class="top"><button class="icon-btn" data-act="back" aria-label="Retour">${UI.back}</button></div>
      <div class="hero">
        <div class="medal">${ICONS[e.icon]}</div>
        <p class="numeral-big">Chronique ${e.num}</p>
        <h1>${esc(e.title)}</h1>
        <p class="era-period">${esc(e.period)}</p>
        <p class="intro">${esc(e.intro)}</p>
      </div>
      <div class="facts">
        <div class="fact"><b>${m}/${total}</b><span>maîtrisés</span></div>
        <div class="fact"><b>${best === undefined ? "–" : `${best}/${CONFIG.sessionSize}`}</b><span>meilleur score</span></div>
        <div class="fact">${starsRow(S.stars[e.id] || 0)}<span>étoiles</span></div>
      </div>
      <div class="stack">
        ${read || !hasLesson ? quizBtn + lessonBtn : lessonBtn + quizBtn}
      </div>
      <p class="mix-note">Chaque défi mêle questions, vrai ou faux, chronologie, association et dates.</p>
      ${adSlot()}
    </div>`;
  }

  /* ===== Chronique (leçon) ===== */
  function lessonScreen(e) {
    const L = e.lesson || [];
    const i = Math.min(Math.max(view.idx || 0, 0), L.length - 1);
    const c = L[i];
    const last = i === L.length - 1;
    if (last && !S.read[e.id]) { S.read[e.id] = 1; save(); }
    const segs = L.map((_, k) => `<i class="${k < i ? "done" : k === i ? "now" : ""}"></i>`).join("");
    return `
    <div class="screen lesson" style="--accent:${e.accent}">
      <div class="top">
        <button class="icon-btn" data-act="back" aria-label="Fermer la chronique">${UI.close}</button>
        <div class="progress" aria-hidden="true">${segs}</div>
        <span class="count" aria-label="Parchemin ${i + 1} sur ${L.length}">${i + 1}/${L.length}</span>
      </div>
      <article class="scroll-card" key="${i}">
        <div class="sc-head">
          <span class="sc-medal">${ICONS[e.icon]}</span>
          <span class="sc-meta"><span class="sc-era">${esc(e.title)}</span><span class="sc-date">${esc(c.d)}</span></span>
        </div>
        <h1 class="sc-title">${esc(c.t)}</h1>
        <div class="sc-rule">${UI.lisSmall}</div>
        <p class="sc-text">${esc(c.p)}</p>
      </article>
      <div class="lesson-nav">
        <button class="btn btn-line" data-act="lprev" ${i === 0 ? "disabled" : ""}>Précédent</button>
        ${last
          ? `<button class="btn btn-gold" data-act="start" data-id="${e.id}">Relever le défi</button>`
          : `<button class="btn btn-gold" data-act="lnext">Suivant</button>`}
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
    const segs = Q.items.map((_, k) => `<i class="${k < Q.i ? "done" : k === Q.i ? "now" : ""}"></i>`).join("");
    return `
    <div class="screen">
      <div class="top">
        <button class="icon-btn" data-act="quit" aria-label="Quitter la partie">${UI.close}</button>
        <div class="progress" aria-hidden="true">${segs}</div>
        <span class="count" aria-label="Défi ${Q.i + 1} sur ${Q.items.length}">${Q.i + 1}/${Q.items.length}</span>
      </div>
      <section class="q-card">
        <p class="q-era">${esc(it.era)} <span class="q-type">${TYPE_LABEL[it.type]}</span></p>
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

  // Enregistre le résultat d'un défi, puis affiche la correction.
  function settle(good) {
    const it = Q.items[Q.i];
    const st = Q.st;
    st.done = true;
    st.good = good;
    if (good) {
      Q.right++;
      if (!S.mastered[it.key]) { S.mastered[it.key] = 1; S.xp += CONFIG.xpPerNewAnswer; Q.xp += CONFIG.xpPerNewAnswer; }
      buzz(14);
    } else {
      Q.missed.push(it);
      buzz([30, 50, 30]);
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
    const ratio = Q.right / n;
    const stars = ratio >= 0.9 ? 3 : ratio >= 0.7 ? 2 : ratio >= 0.5 ? 1 : 0;

    if (Q.mode === "era") {
      S.best[Q.eraId] = Math.max(S.best[Q.eraId] || 0, Q.right);
      S.stars[Q.eraId] = Math.max(S.stars[Q.eraId] || 0, stars);
    }
    let dailyBonus = 0;
    if (Q.mode === "daily" && S.daily !== today()) {
      S.daily = today();
      dailyBonus = CONFIG.xpDailyBonus;
      S.xp += dailyBonus;
      Q.xp += dailyBonus;
    }
    if (S.streak.last !== today()) {
      S.streak = { count: S.streak.last === yesterday() ? S.streak.count + 1 : 1, last: today() };
    }
    save();

    R = {
      mode: Q.mode, eraId: Q.eraId, n, right: Q.right, stars, xp: Q.xp, missed: Q.missed,
      rankUp: rankIndex(S.xp) > Q.rankStart ? RANKS[rankIndex(S.xp)].name : null
    };
    Q = null;
    go("result", {}, "replace");
    if (window.HistoriaAds) window.HistoriaAds.quizFinished();
  }

  function resultScreen() {
    const verdicts = ["Courage, relisez les chroniques.", "C'est un début, continuez !", "Bien joué, chevalier !", "Magnifique, digne d'un chroniqueur !"];
    const review = R.missed.length
      ? `<section class="review"><h2>À retenir</h2><ul>${R.missed.map((it) => `<li><span>${esc(it.q)}</span><b>${esc(it.ans)}</b></li>`).join("")}</ul></section>`
      : "";
    return `
    <div class="screen result">
      <div class="big-stars" role="img" aria-label="${R.stars} étoile${R.stars > 1 ? "s" : ""} sur 3">${[0, 1, 2].map((i) => UI.star(i < R.stars)).join("")}</div>
      <p class="score">${R.right}<small>/${R.n}</small></p>
      <p class="verdict">${verdicts[R.stars]}</p>
      <div class="gains">
        ${R.xp ? `<span class="chip">+${R.xp} XP</span>` : ""}
        ${R.mode === "daily" ? '<span class="chip">Défi du jour</span>' : ""}
        ${displayStreak() > 0 ? `<span class="chip">${displayStreak()} ${plural(displayStreak(), "jour", "jours")} de suite</span>` : ""}
      </div>
      ${R.rankUp ? `<div class="rankup">Nouveau rang<b>${R.rankUp}</b></div>` : ""}
      ${review}
      <div class="stack">
        ${R.mode === "era" ? '<button class="btn btn-gold" data-act="replay">Rejouer cette époque</button>' : ""}
        <button class="btn ${R.mode === "era" ? "btn-line" : "btn-gold"}" data-act="home">Retour aux chroniques</button>
      </div>
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
    const o = document.createElement("div");
    o.id = "overlay";
    o.className = "overlay";
    o.innerHTML = `
      <div class="sheet" role="dialog" aria-modal="true" aria-label="Les rangs">
        <h2>Les rangs</h2>
        <ul class="ranks">
          ${RANKS.map((r, i) => `<li class="${i <= idx ? "reached" : ""} ${i === idx ? "current" : ""}"><b>${r.name}</b><span>${r.xp} XP</span></li>`).join("")}
        </ul>
        <p class="note">Chaque bonne réponse à un défi nouveau rapporte ${CONFIG.xpPerNewAnswer} XP. Le défi du jour ajoute ${CONFIG.xpDailyBonus} XP.</p>
        <div class="stack"><button class="btn btn-line" data-act="close-sheet">Fermer</button></div>
        <div class="links"><button class="linkbtn" data-act="reset">Réinitialiser ma progression</button></div>
      </div>`;
    document.body.appendChild(o);
    o.addEventListener("click", (ev) => { if (ev.target === o) closeSheet(); });
    o.querySelector("[data-act='close-sheet']").focus();
  }

  /* ===== Événements ===== */
  const gotoLesson = (d) => {
    view.idx = Math.max(0, (view.idx || 0) + d);
    history.replaceState(Object.assign({}, view), "");
    render();
  };

  document.addEventListener("click", (ev) => {
    const el = ev.target.closest("[data-act]");
    if (!el || el.disabled) return;
    const act = el.dataset.act;
    switch (act) {
      case "era": go("era", { id: el.dataset.id }); break;
      case "back": back(); break;
      case "home": go("home", {}, "replace"); break;
      case "lesson": go("lesson", { id: el.dataset.id, idx: 0 }); break;
      case "lnext": gotoLesson(1); break;
      case "lprev": gotoLesson(-1); break;
      case "start": {
        const era = eraById(el.dataset.id);
        startQuiz(pickSession(era), { mode: "era", eraId: era.id, replace: view.name === "lesson" });
        break;
      }
      case "replay": {
        const era = eraById(R.eraId);
        startQuiz(pickSession(era), { mode: "era", eraId: era.id, replace: true });
        break;
      }
      case "daily": {
        if (S.daily === today()) break;
        const pool = ERAS.flatMap((e) => poolOf(e));
        const picks = shuffle(pool, seeded("historia-" + today())).slice(0, CONFIG.questionsPerDaily);
        startQuiz(picks.map(prep), { mode: "daily" });
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
        refreshPlay();
        break;
      }
      case "mt": onMatchTap(el.dataset.side, Number(el.dataset.i)); break;
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
      case "reset":
        if (confirm("Effacer toute votre progression (XP, rangs, étoiles, série) ?")) {
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

  // Glisser pour tourner les pages d'une chronique.
  let tx = null;
  $app.addEventListener("touchstart", (ev) => { tx = view.name === "lesson" ? ev.touches[0].clientX : null; }, { passive: true });
  $app.addEventListener("touchend", (ev) => {
    if (tx === null || view.name !== "lesson") return;
    const dx = ev.changedTouches[0].clientX - tx;
    tx = null;
    const e = eraById(view.id);
    const i = view.idx || 0;
    if (dx < -60 && i < e.lesson.length - 1) gotoLesson(1);
    else if (dx > 60 && i > 0) gotoLesson(-1);
  }, { passive: true });

  /* ===== Démarrage ===== */
  history.replaceState({ name: "home" }, "");
  render();

  const isNative = !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
  if (!isNative && "serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
    window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
  }
})();
