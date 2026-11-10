/* Historia — « La Fuite » : un révolutionnaire échappe à la garde royale à travers Paris, les villages, les forêts et la campagne.
   Course sans fin à 3 voies : 3 voies. Glisser gauche/droite (voie), haut (sauter), bas (se baisser).
   Décor d'Ancien Régime : pavés puis chemins de terre, églises, moulins, forêts, villageois qui regardent. Aucun rail. */
(function () {
  var W = 360, H = 640, HY = 240, F = 7, PD = 4.5, LW = 112, STEP = 1 / 60, FAR = 84, BLEN = 800;
  var BIO = [
    { fr: "Faubourg Saint-Antoine", en: "Faubourg Saint-Antoine", ground: ["#7a6a64", "#5e4c48"], road: ["#8d7f78", "#6f625c"], cob: 1 },
    { fr: "Le village et son église", en: "The village and its church", ground: ["#7c9a4e", "#5f7f3c"], road: ["#b0946a", "#8f7650"], cob: 0 },
    { fr: "La grande forêt", en: "The great forest", ground: ["#486f3e", "#33552f"], road: ["#8e7350", "#6f583c"], cob: 0 },
    { fr: "Les champs et le moulin", en: "The fields and the windmill", ground: ["#b3b45a", "#8fa044"], road: ["#bb9d68", "#9a7e50"], cob: 0 }
  ];
  var SKY = [[0, "#2a2350", "#f6a86b"], [0.2, "#6fa8e0", "#f4e7c4"], [0.5, "#78b6ea", "#f1efd8"], [0.74, "#5a4a8c", "#f39a5c"], [0.9, "#1f1c48", "#8a4e72"], [1, "#2a2350", "#f6a86b"]];
  /* ---------- événements : plus d'une quinzaine de tableaux différents ---------- */
  var PRISONPOOL = { low: ["crate", "barrel"], high: ["beam"], block: ["cart", "stall"] };
  var EV = {
    prison: { fr: "La Bastille : évasion générale !", en: "The Bastille: a mass breakout!", int: 1, g: ["#2e2b34", "#26232c"], r: ["#7c7880", "#66626c"], cob: 1, pool: PRISONPOOL },
    catacomb: { fr: "Les catacombes de Paris", en: "The Paris catacombs", int: 1, bone: 1, g: ["#241b12", "#1c150e"], r: ["#7a6a4c", "#5f5038"], cob: 0, pool: PRISONPOOL },
    bridge: { fr: "Le Pont-Neuf sur la Seine", en: "The Pont-Neuf over the Seine", g: ["#3d6f9c", "#325f88"], r: ["#a39a90", "#847c72"], cob: 1 },
    market: { fr: "Le grand marché", en: "The great market", g: ["#8a7a66", "#74644f"], r: ["#b39e80", "#96826a"], cob: 1 },
    fire: { fr: "Les faubourgs en flammes", en: "The suburbs on fire", g: ["#5a463f", "#46342e"], r: ["#76645c", "#5c4c45"], cob: 1, wx: "fire", tint: ["#3a1a1c", "#e0702c"] },
    storm: { fr: "Orage sur la route", en: "Storm on the road", keep: 1, wx: "storm", tint: ["#1c2230", "#56627a"] },
    snow: { fr: "L'hiver rigoureux", en: "The harsh winter", keep: 1, snow: 1, wx: "snow", g: ["#e6ecf2", "#d2dbe4"], r: ["#c4c8cf", "#aeb3bb"], tint: ["#9fb2c8", "#e8eef4"] },
    fog: { fr: "Brouillard sur la plaine", en: "Fog over the plain", keep: 1, wx: "fog", tint: ["#9aa0a8", "#cfd3d6"] },
    barricade: { fr: "Les barricades du peuple", en: "The people's barricades", g: ["#6e6058", "#584a44"], r: ["#8d7f78", "#6f625c"], cob: 1 },
    guillotine: { fr: "La place de la Révolution", en: "Revolution Square", g: ["#7a6c60", "#625248"], r: ["#9a8c80", "#7c6e62"], cob: 1, tint: ["#5a4a60", "#c88a70"] },
    fireworks: { fr: "Nuit de fête sur la ville", en: "A night of celebration", keep: 1, wx: "fw", tint: ["#0e0c2a", "#3a2a6a"] },
    vine: { fr: "Les vignes de la vendange", en: "The harvest vineyards", g: ["#6f8a3c", "#5d7832"], r: ["#b49a68", "#957d52"] },
    cemetery: { fr: "Le vieux cimetière", en: "The old graveyard", g: ["#5c6650", "#4a543f"], r: ["#8a8478", "#6e695e"], wx: "fog", tint: ["#4a4a58", "#9a96a0"] },
    port: { fr: "Le port et ses navires", en: "The harbour and its ships", g: ["#3b7099", "#2f5f86"], r: ["#9a7a52", "#7e6140"], cob: 1 },
    camp: { fr: "Le camp des soldats du Roi", en: "The King's soldiers' camp", g: ["#7d8a52", "#68743f"], r: ["#a88c5c", "#8a7048"] },
    autumn: { fr: "La forêt d'automne", en: "The autumn forest", keep: 1, au: 1, wx: "leaves", g: ["#a8883c", "#8c7030"], r: ["#a8844c", "#8a6a3a"], tint: ["#6a5a7a", "#f0b060"] }
  };
  var EVIDS = Object.keys(EV);
  var CHAL = ["#9a4a3a", "#4a5f7a", "#b9a05a", "#5f7a54", "#a8764a"];
  EVIDS.forEach(function (k) { EV[k].id = k; });
  function rngOf(seed) { var a = seed >>> 0; return function () { a = (a + 0x6D2B79F5) >>> 0; var t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function speedAt(t) { return 14 + 37 * (1 - Math.exp(-t / 32)) + Math.min(t, 240) * 0.16; }
  function rowTime(t) { return Math.max(0.46 + Math.max(0, 1 - Math.max(0, t - 45) / 90) * 0.1, 1.5 - t * 0.024); }
  function bioAt(d) { return Math.floor(Math.max(0, d) / BLEN) % 4; }
  function bioMix(d) { var p = ((d % BLEN) + BLEN) % BLEN, b = bioAt(d); return p > BLEN - 40 ? { a: b, b: (b + 1) % 4, t: (p - (BLEN - 40)) / 40 } : { a: b, b: b, t: 0 }; }
  function mixx(c, h, t) { var a = c.indexOf("rgb") === 0 ? c.match(/\d+/g).map(Number) : hex(c), b = hex(h); return "rgb(" + a.map(function (v, i) { return Math.round(v + (b[i] - v) * t); }).join(",") + ")"; }
  function hex(c) { return [1, 3, 5].map(function (i) { return parseInt(c.substr(i, 2), 16); }); }
  function mix(c1, c2, t) { var a = hex(c1), b = hex(c2); return "rgb(" + a.map(function (v, i) { return Math.round(v + (b[i] - v) * t); }).join(",") + ")"; }
  // catégories d'obstacles par décor : bas (sauter), haut (se baisser), plein (changer de voie)
  var POOL = [
    { low: ["crate", "barrel", "barricade"], high: ["laundry", "beam"], block: ["stall", "cart", "coach"] },
    { low: ["barrel", "bale", "crate"], high: ["beam", "laundry"], block: ["cart", "stall", "coach"] },
    { low: ["log", "barricade"], high: ["branch"], block: ["boulder", "cart"] },
    { low: ["bale", "barricade", "log"], high: ["beam", "branch"], block: ["cart", "boulder", "coach"] }
  ];

  function create(canvas, opt) {
    var FR = opt.lang !== "en";
    H = Math.max(520, Math.min(820, Math.round(W * (window.innerHeight || 640) / (window.innerWidth || 360))));
    HY = Math.round(H * 0.37);
    canvas.style.aspectRatio = W + " / " + H;
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    function setDpr(d) { dpr = d; canvas.width = Math.round(W * d); canvas.height = Math.round(H * d); ctx.setTransform(d, 0, 0, d, 0, 0); }
    var slow = 0, ema = 16;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var rnd = rngOf(opt.seed != null ? opt.seed : Math.random() * 4294967296);
    var raf = 0, dead = false, last = 0, acc = 0, best = opt.best || 0;
    var st = null;
    var GY1 = H + 20;
    function kOf(z) { return F / (F + z); }
    function yOf(z) { return HY + (GY1 - HY) * kOf(z); }
    function xOf(lane, z) { return W / 2 + lane * LW * kOf(z); }
    function spawnD() { return st.dist + (FAR + 10) * 1.4; }

    function reset() {
      st = { t: 0, dist: 0, coins: 0, lane: 0, px: 0, jump: 0, slide: 0, over: false, ct: 0, done: false, guard: 0, warn: 0, stumble: 0, imm: 0,
        obs: [], coinsL: [], scn: [], ppl: [], parts: [], nextRow: 0, lastFree: 0, banner: null, bio: 0, scroll: 0, step: 0, shake: 0, flash: 0, rowN: 0, warm: 0, bz: 0, pz: 0, ctp: null };
      st.evs = planEvents(); st.fw = []; st.evk = 0; st.wxk = 0; st.intk = 0; st.curEv = null; st.fwT = 0;
      for (var z = 4; z < FAR + 12; z += 5.5) { st.bz = z; spawnChunk(z); }
      st.bz = FAR + 10 + 5.5;
      addRow(30);
    }

    /* ---------- planning des événements ---------- */
    function planEvents() {
      var er = rngOf(Math.floor(rnd() * 4294967295)), bag = [], d = 520, out = [], last = "";
      while (d < 40000) {
        if (!bag.length) { bag = EVIDS.slice(); for (var i = bag.length - 1; i > 0; i--) { var j = Math.floor(er() * (i + 1)), t = bag[i]; bag[i] = bag[j]; bag[j] = t; } if (bag[bag.length - 1] === last) bag.unshift(bag.pop()); }
        var id = bag.pop(); last = id;
        var ln = 700 + Math.floor(er() * 500); if (id === "prison" || id === "catacomb") ln += 150;
        out.push({ id: id, s: d, e: d + ln, ev: EV[id] }); d += ln + 450 + Math.floor(er() * 450);
      }
      return out;
    }
    function evAt(d) { var a = st.evs; for (var i = 0; i < a.length; i++) { if (d < a[i].s) return null; if (d < a[i].e) return a[i].ev; } return null; }
    function pplAdd(zz, side, n, o) { for (var i = 0; i < n; i++) st.ppl.push({ z: zz + 0.2 + i * 0.7, side: side, off: (o.off != null ? o.off : 0.1) + rnd() * 0.22, kind: o.kind != null ? o.kind : Math.floor(rnd() * 4), col: Math.floor(rnd() * 5), cc: o.cc, ph: rnd() * 6.3, act: o.act != null ? o.act : Math.floor(rnd() * 3), s: 0.85 + rnd() * 0.3 }); }
    function evChunk(e, zz, side, r, v, P, si) {
      var id = e.id, i;
      if (e.int) {
        P({ z: zz, side: side, off: -0.05, type: "cell", v: v, bone: e.bone });
        P({ z: zz + 2.8, side: side, off: -0.05, type: "cell", v: rnd(), bone: e.bone });
        if (si === 0) P({ z: zz, side: 0, off: 0, type: "rib", v: v, bone: e.bone });
        P({ z: zz + 1.4, side: side, off: -0.05, type: "torch", v: v });
        if (!e.bone) pplAdd(zz, side, 2 + Math.floor(rnd() * 3), { off: -0.16, kind: rnd() < 0.5 ? 2 : 0, cc: ["#8a8478", "#7a7468", "#9a9080"][Math.floor(rnd() * 3)], act: 0 });
        else if (rnd() < 0.5) P({ z: zz + 1.9, side: side, off: 0.0, type: "skull", v: v });
        return true;
      }
      if (id === "bridge") {
        P({ z: zz, side: side, off: -0.08, type: "wall", v: v, w: 12, h: 34, d: 5.5, c: ["#b3aa9a", "#8a8272"] });
        if (r < 0.5) P({ z: zz + 2, side: side, off: -0.08, type: "lamp", v: v });
        if (r > 0.6) P({ z: zz + 1.5, side: side, off: 0.9 + rnd() * 1.2, type: "ship", v: v, small: 1 });
        if (rnd() < 0.3) pplAdd(zz, side, 1, { off: -0.1, kind: 2, act: 2 });
        return true;
      }
      if (id === "market") {
        P({ z: zz, side: side, off: 0.0, type: "stall", v: v, aw: CHAL[Math.floor(rnd() * 5)] }); P({ z: zz + 2.8, side: side, off: 0.0, type: "stall", v: rnd(), aw: CHAL[Math.floor(rnd() * 5)] });
        P({ z: zz + 1.5, side: side, off: 1.0, type: "house", v: v, h: 109 + rnd() * 70, w: 130, kind: "stone" });
        pplAdd(zz, side, 3 + Math.floor(rnd() * 3), { off: 0.05 }); return true;
      }
      if (id === "fire") {
        P({ z: zz, side: side, off: 0.1, type: "bhouse", v: v, h: 117 + rnd() * 84, w: 140, kind: "stone" }); P({ z: zz + 2.8, side: side, off: 0.1, type: "bhouse", v: rnd(), h: 101 + rnd() * 84, w: 130, kind: "stone" });
        pplAdd(zz, side, 1 + Math.floor(rnd() * 3), { off: 0.1, act: 0 }); return true;
      }
      if (id === "barricade") {
        P({ z: zz, side: side, off: 0.0, type: "barr", v: v }); P({ z: zz + 2.8, side: side, off: 0.1, type: "house", v: v, h: 117 + rnd() * 70, w: 130, kind: "stone" });
        P({ z: zz + 1.4, side: side, off: 0.55, type: "flag", v: v, c: [["#2a4aa0", "#f2f2f2", "#c8283a"]] });
        pplAdd(zz, side, 3, { off: 0.0, act: 0, kind: 1 }); return true;
      }
      if (id === "guillotine") {
        if (r < 0.4 && si === 0) P({ z: zz, side: side, off: 0.15, type: "gui", v: v });
        else P({ z: zz, side: side, off: 0.1, type: "house", v: v, h: 117 + rnd() * 77, w: 130, kind: "stone" });
        P({ z: zz + 2.8, side: side, off: 0.1, type: "house", v: rnd(), h: 109 + rnd() * 70, w: 130, kind: "stone" });
        P({ z: zz + 1.4, side: side, off: 0.1, type: "flag", v: v });
        pplAdd(zz, side, 4, { off: 0.0 }); return true;
      }
      if (id === "cavalry") {
        if (si === 0 || rnd() < 0.5) P({ z: zz + 1, side: side, off: 0.1 + rnd() * 0.3, type: "rider", v: v, vz: 22 + rnd() * 6 });
        return false;
      }
      if (id === "vine") {
        P({ z: zz, side: side, off: 0.1, type: "vine", v: v }); P({ z: zz + 2.8, side: side, off: 0.1, type: "vine", v: v });
        if (r < 0.2) P({ z: zz + 1.5, side: side, off: 1.2, type: "farm", v: v }); else P({ z: zz + 1.5, side: side, off: 1.2, type: "tree", v: v });
        pplAdd(zz, side, 2, { off: 0.3, kind: 2 }); return true;
      }
      if (id === "cemetery") {
        for (i = 0; i < 4; i++) P({ z: zz + i * 1.3, side: side, off: 0.05 + rnd() * 0.5, type: rnd() < 0.7 ? "tomb" : "deadtree", v: rnd() });
        if (r < 0.15) P({ z: zz + 1, side: side, off: 0.9, type: "church", v: v });
        return true;
      }
      if (id === "port") {
        P({ z: zz, side: side, off: 0.0, type: "ship", v: v }); if (r < 0.5) P({ z: zz + 3, side: side, off: 0.0, type: "stack", v: v });
        P({ z: zz + 2.2, side: side, off: -0.06, type: "wall", v: v, w: 8, h: 18, d: 3.2, c: ["#8a6a44", "#6a4e30"] });
        pplAdd(zz, side, 1 + Math.floor(rnd() * 2), { off: 0.0, kind: 2 }); return true;
      }
      if (id === "camp") {
        P({ z: zz, side: side, off: 0.15, type: "tent", v: v }); P({ z: zz + 2.6, side: side, off: 0.05, type: r < 0.5 ? "campfire" : "tent", v: rnd() });
        pplAdd(zz, side, 2, { off: 0.05, kind: 0, act: 1 }); return true;
      }
      return false;
    }
    /* ---------- décor ---------- */
    function spawnChunk(z) {
      var d = st.dist + z * 1.4, b = bioAt(d), side;
      for (var si = 0; si < 2; si++) {
        side = si ? 1 : -1;
        var zz = z + si * 2.2, r = rnd(), v = rnd();
        var ev = evAt(d);
        var P = function (o) { if (ev) { if (ev.snow) o.sn = 1; if (ev.au) o.au = 1; } st.scn.push(o); };
        if (ev && evChunk(ev, zz, side, r, v, P, si)) continue;
        if (b === 0) {
          var big = ((d / 60) | 0);
          if (d > 120 && r < 0.09) P({ z: zz, side: side, off: 0.1, type: "prison", v: v });
          else if (d > 150 && r < 0.17) P({ z: zz, side: side, off: 0.1, type: "church", v: v });
          else {
            var slot = function (z0, pr) { var q = rnd(); if (q < pr) P({ z: z0, side: side, off: 0.1 + rnd() * 0.5, type: "house", v: rnd(), h: 85 + rnd() * 95, w: 105 + rnd() * 40, kind: rnd() < 0.65 ? "timber" : "stone" }); else if (q < pr + 0.28) P({ z: z0, side: side, off: 0.2 + rnd() * 0.6, type: ["tree", "tree", "bush", "fence", "well", "haystack"][Math.floor(rnd() * 6)], v: rnd() }); };
            slot(zz, 0.5); slot(zz + 2.8, 0.3);
            if (r > 0.8) P({ z: zz + 2.6, side: side, off: 0, type: "lamp", v: v });
          }
        } else if (b === 1) {
          if (r < 0.14) P({ z: zz, side: side, off: 0.15, type: "church", v: v });
          else if (r < 0.22) { P({ z: zz, side: side, off: 0.1, type: "well", v: v }); P({ z: zz + 2.8, side: side, off: 0.4, type: "house", v: v, h: 100, w: 120, kind: "timber" }); }
          else if (r < 0.34) { P({ z: zz, side: side, off: 0.15, type: "tree", v: v }); P({ z: zz + 2.5, side: side, off: 0.6, type: "bush", v: v }); }
          else {
            if (rnd() < 0.55) P({ z: zz, side: side, off: 0.1 + rnd() * 0.4, type: "house", v: v, h: 100 + rnd() * 70, w: 110 + rnd() * 30, kind: "timber" }); else P({ z: zz, side: side, off: 0.2 + rnd() * 0.6, type: ["tree", "fence", "bush", "haystack"][Math.floor(rnd() * 4)], v: v });
            if (rnd() < 0.3) P({ z: zz + 2.8, side: side, off: 0.2 + rnd() * 0.5, type: "house", v: rnd(), h: 90 + rnd() * 60, w: 110, kind: "timber" }); else if (rnd() < 0.5) P({ z: zz + 2.8, side: side, off: 0.3 + rnd() * 0.7, type: "tree", v: rnd() });
          }
        } else if (b === 2) {
          for (var q = 0; q < 4; q++) P({ z: zz + q * 1.35, side: side, off: 0.02 + rnd() * 0.5 + q * 0.5, type: rnd() < 0.55 ? "pine" : "tree", v: rnd() });
          if (rnd() < 0.5) P({ z: zz + 0.7, side: side, off: 0.0, type: "bush", v: v });
          if (r < 0.1) P({ z: zz + 2, side: side, off: 0.5, type: "cabin", v: v });
          else if (r < 0.3) P({ z: zz + 2, side: side, off: 0.05, type: "rock", v: v });
        } else {
          if (d > 100 && r < 0.07) P({ z: zz, side: side, off: 0.3, type: "chateau", v: v });
          else if (r < 0.15) P({ z: zz, side: side, off: 0.5, type: "mill", v: v });
          else if (r < 0.28) { P({ z: zz, side: side, off: 0.25, type: "farm", v: v }); P({ z: zz + 3.2, side: side, off: 0.1, type: "haystack", v: v }); }
          else if (r < 0.46) { P({ z: zz, side: side, off: 0.15, type: "haystack", v: v }); P({ z: zz + 2.6, side: side, off: 0.1, type: "fence", v: v }); }
          else if (r < 0.62) { P({ z: zz, side: side, off: 0.2, type: "tree", v: v }); P({ z: zz + 2.7, side: side, off: 0.9, type: "tree", v: rnd() }); P({ z: zz + 1.2, side: side, off: 0.05, type: "fence", v: v }); }
          else { P({ z: zz, side: side, off: 0.05, type: "fence", v: v }); P({ z: zz + 2.7, side: side, off: 0.05, type: "fence", v: v }); if (r > 0.85) P({ z: zz + 1.5, side: side, off: 0.3, type: "bush", v: v }); }
        }
        // spectateurs
        var pc = b === 0 ? 0.9 : b === 1 ? 0.8 : b === 2 ? 0.15 : 0.55;
        if (rnd() < pc) {
          var n = 1 + Math.floor(rnd() * (b === 2 ? 1 : 3));
          for (var i = 0; i < n; i++) st.ppl.push({ z: zz + 0.3 + i * 0.5, side: side, off: 0.1 + rnd() * 0.22, kind: Math.floor(rnd() * 4), col: Math.floor(rnd() * 5), ph: rnd() * 6.3, act: Math.floor(rnd() * 3), s: 0.85 + rnd() * 0.3 });
        }
      }
    }

    /* ---------- rangées d'obstacles ---------- */
    function addRow(z0) {
      var z = z0 || FAR + 4, n = ++st.rowN;
      var diff = Math.min(1, st.t / 40), b = bioAt(st.dist + z * 1.4), pool = (evAt(st.dist + z * 1.4) || {}).pool || POOL[b];
      var pick = function (a) { return a[Math.floor(rnd() * a.length)]; };
      var rtPrev = st.gapT || 1.1, r = rnd();
      var fx = Math.min(1.6, 0.2 + st.t / 25), kind = n < 4 ? "lanes" : r < 0.07 * fx ? "alllow" : r < 0.14 * fx ? "allhigh" : r < 0.34 * fx ? "mixb" : "lanes";
      if (kind !== "lanes" && kind === st.lastKindRow) kind = "lanes";
      var lf0 = st.lastFree || 0, maxd = 1;
      var nextFree = function () {
        var c = []; for (var q0 = -1; q0 <= 1; q0++) if (q0 !== lf0 && Math.abs(q0 - lf0) <= maxd) c.push(q0);
        return rnd() < 0.88 && c.length ? c[Math.floor(rnd() * c.length)] : lf0;
      };
      var rt = Math.max(0.44, rowTime(st.t) * (n > 3 && rnd() < diff * 0.3 ? 0.85 : 1));
      if (kind !== "lanes") rt = Math.max(rt, st.t > 45 ? 0.6 : st.t > 25 ? 0.7 : 0.86);
      st.gapT = rt; st.lastKind = kind;
      if (kind === "alllow") { var tl = pick(pool.low); for (var l = -1; l <= 1; l++) st.obs.push({ type: tl, cat: "low", lane: l, z: z, hit: false }); }
      else if (kind === "mix") { for (var lm = -1; lm <= 1; lm++) { var cm = rnd() < 0.5 ? "low" : "high"; st.obs.push({ type: pick(pool[cm]), cat: cm, lane: lm, z: z, hit: false }); } }
      else if (kind === "mixb") { var sf = nextFree(); st.lastFree = sf; for (var lb = -1; lb <= 1; lb++) { var qb = rnd(), cb = lb === sf ? (qb < 0.5 ? "low" : "high") : qb < 0.34 ? "low" : qb < 0.67 ? "high" : "block"; st.obs.push({ type: pick(pool[cb]), cat: cb, lane: lb, z: z, hit: false }); } }
      else if (kind === "allhigh") { var th = pick(pool.high); for (var l2 = -1; l2 <= 1; l2++) st.obs.push({ type: th, cat: "high", lane: l2, z: z, hit: false }); }
      else {
        var free = nextFree();
        st.lastFree = free;
        for (var ln = -1; ln <= 1; ln++) {
          if (ln === free) { if (rnd() < 0.6) { var cn = 3 + Math.floor(rnd() * 3); for (var ci = 0; ci < cn; ci++) st.coinsL.push({ lane: ln, z: z - 3 + ci * 1.8, got: false }); } continue; }
          if (n < 3 && rnd() < 0.5) continue;
          var q = rnd(), cat = q < 0.3 ? "low" : q < 0.7 ? "block" : "high";
          st.obs.push({ type: pick(pool[cat]), cat: cat, lane: ln, z: z, hit: false });
        }
      }
      st.lastKindRow = kind;
      st.nextRow = Math.max(0.5, z + speedAt(st.t) * rt - (FAR + 4));
    }

    /* ---------- actions ---------- */
    function move(d) {
      if (st.over) return;
      var nl = Math.max(-1, Math.min(1, st.lane + d));
      if (nl !== st.lane) { st.lane = nl; if (opt.sfx) opt.sfx("tap"); }
    }
    function jump() { if (st.over) return; if (st.jump > 0 && st.jump < 0.55) { st.jbuf = 0.22; return; } st.slide = 0; st.jbuf = 0; st.jump = 0.0001; if (opt.sfx) opt.sfx("tap"); }
    function slide() { if (st.over) return; if (st.jump > 0) st.vdrop = true; st.slide = 0.0001; if (opt.sfx) opt.sfx("tap"); }
    function burst(x, y, col, n) { for (var i = 0; i < n; i++) st.parts.push({ x: x, y: y, vx: (rnd() - 0.5) * 220, vy: -rnd() * 220 - 30, life: 1, c: col, s: 2 + rnd() * 3 }); }
    function caught() {
      if (st.over) return;
      st.over = true; st.ct = 0; st.flash = 0.8; st.shake = 0.5;
      st.finalScore = score();
      if (opt.buzz) opt.buzz(60);
      if (opt.sfx) opt.sfx("bad");
    }
    function score() { return Math.floor(st.dist) + st.coins * 5; }

    /* ---------- simulation ---------- */
    function update(dt) {
      if (st.flash > 0) st.flash -= dt * 2;
      if (st.shake > 0) st.shake -= dt;
      st.parts.forEach(function (p) { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 520 * dt; p.life -= dt * 1.6; });
      st.parts = st.parts.filter(function (p) { return p.life > 0; });
      st.t += dt;
      if (st.banner) { st.banner.t += dt; if (st.banner.t > 2.8) st.banner = null; }
      if (st.over) {
        if (!st.sig) { st.sig = 1; if (opt.onOver) opt.onOver({ score: st.finalScore, meters: Math.floor(st.dist) }); }
        st.ct += dt;
        if (st.ct > 5.4 && !st.done) {
          st.done = true;
          if (st.finalScore > best) best = st.finalScore;
          opt.onEnd({ score: st.finalScore, meters: Math.floor(st.dist), coins: st.coins, best: best });
        }
        return;
      }
      st.warm = Math.min(1, st.warm + dt / 1.2);
      var v = speedAt(st.t) * st.warm * (st.stumble > 0 ? 0.6 : 1);
      st.stumble = Math.max(0, st.stumble - dt);
      st.imm = Math.max(0, st.imm - dt);
      st.dist += v * dt * 1.4;
      st.scroll += v * dt;
      st.step += v * dt * 0.9;
      st.px += (st.lane - st.px) * Math.min(1, dt * 13);
      if (st.jump > 0) { st.jump += dt / 0.6; if (st.jump >= 1 || st.vdrop) { st.jump = 0; st.vdrop = false; } }
      if (st.jbuf > 0) { st.jbuf -= dt; if (st.jump === 0) { st.jbuf = 0; jump(); } }
      if (st.slide > 0) { st.slide += dt / 0.62; if (st.slide >= 1) st.slide = 0; }
      st.warn = Math.max(0, st.warn - dt);
      var gt = st.warn > 0 ? 0.85 : 0;
      st.guard += (gt - st.guard) * Math.min(1, dt * (gt > st.guard ? 7 : 1.2));
      var b = bioAt(st.dist);
      if (b !== st.bio || (st.bio === 0 && st.banner === null && st.dist > 5 && st.dist < 6 && false)) { st.bio = b; if (st.dist > 20 && !evAt(st.dist)) { st.banner = { t: 0, s: [BIO[b].fr, BIO[b].en] }; if (opt.sfx) opt.sfx("good"); } }
      var ev0 = evAt(st.dist);
      if (ev0 !== st.curEv) { st.curEv = ev0; if (ev0 && st.dist > 5) { st.banner = { t: 0, s: [ev0.fr, ev0.en] }; if (opt.sfx) opt.sfx("good"); } }
      if (ev0 && ev0.tint) st.tint = ev0.tint;
      if (ev0 && ev0.wx) st.wx = ev0.wx;
      if (ev0 && ev0.id === "storm") st.wx = "storm";
      st.evk += ((ev0 && ev0.tint ? 1 : 0) - st.evk) * Math.min(1, dt * 1.3);
      st.wxk += ((ev0 && ev0.wx ? 1 : 0) - st.wxk) * Math.min(1, dt * 1.6);
      var ei = evAt(st.dist + 40 * 1.4); st.intk += ((ei && ei.int ? 1 : 0) - st.intk) * Math.min(1, dt * 4); if (ei && ei.int) st.intBone = ei.bone ? 1 : 0;
      st.evs.forEach(function (e) { if (!e.ev.int) return; var lim = st.dist + (FAR + 8) * 1.4; if (!e.gS && e.s < lim && e.e > st.dist) { e.gS = 1; st.scn.push({ z: (e.s - st.dist) / 1.4, side: 0, off: 0, type: "gate", v: 0.5, bone: e.ev.bone }); } if (!e.gE && e.e < lim && e.e > st.dist) { e.gE = 1; st.scn.push({ z: (e.e - st.dist) / 1.4, side: 0, off: 0, type: "gate", v: 0.5, bone: e.ev.bone }); } });
      if (st.wx === "fw" && st.wxk > 0.3) { st.fwT -= dt; if (st.fwT <= 0) { st.fwT = 0.35 + Math.random() * 0.5; st.fw.push({ x: 50 + Math.random() * 260, y: 40 + Math.random() * (HY - 100), t: 0, h: Math.floor(Math.random() * 360) }); } }
      st.fw.forEach(function (f) { f.t += dt; }); st.fw = st.fw.filter(function (f) { return f.t < 1.5; });
      [st.obs, st.coinsL, st.scn, st.ppl].forEach(function (a) { a.forEach(function (o) { o.z -= v * dt; }); });
      st.scn.forEach(function (o) { if (o.vz) o.z += o.vz * dt; });
      st.nextRow -= v * dt;
      if (st.nextRow <= 0) addRow();
      st.bz -= v * dt;
      while (st.bz < FAR + 10) { st.bz += 5.5; spawnChunk(FAR + 10 + (st.bz - (FAR + 10 + 5.5)) * 0 + 0); }
      st.scn = st.scn.filter(function (o) { return o.z > -5; }); st.ppl = st.ppl.filter(function (o) { return o.z > -5; });
      st.scn.sort(function (a, b) { return a.z - b.z; });
      st.obs = st.obs.filter(function (o) { return o.z > -3; });
      st.coinsL = st.coinsL.filter(function (c) { return c.z > -3 && !c.got; });
      var jh = st.jump > 0 ? 4 * st.jump * (1 - st.jump) : 0, py = jh * 80;
      st.obs.forEach(function (o) {
        if (o.hit || Math.abs(o.z - PD) > 0.55 + v * dt * 0.5 || Math.abs(o.lane - st.px) > 0.55) return;
        var safe = false;
        if (o.cat === "low") safe = py > 26;
        else if (o.cat === "high") safe = st.slide > 0;
        if (safe) return;
        o.hit = true;
        if (st.imm > 0) return;
        var second = st.warn > 0;
        st.warn = 8;
        st.stumble = 0.9; st.shake = 0.3; st.flash = 0.5; st.imm = 0.5;
        burst(xOf(o.lane, o.z), yOf(o.z) - 30, "#a87a3c", 14);
        if (opt.buzz) opt.buzz(25);
        if (opt.sfx) opt.sfx("bad");
        if (second) caught();
      });
      st.coinsL.forEach(function (c) {
        if (c.got || Math.abs(c.z - PD) > 0.7 || Math.abs(c.lane - st.px) > 0.6 || py > 60) return;
        c.got = true; st.coins++; burst(xOf(c.lane, c.z), yOf(c.z) - 24, "#f0c64b", 5);
        if (opt.sfx && st.coins % 4 === 0) opt.sfx("good");
      });
    }

    /* ---------- primitives ---------- */
    function rect(x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); }
    function poly(pts, c) { ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(pts[0], pts[1]); for (var i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]); ctx.closePath(); ctx.fill(); }
    function circ(x, y, r, c) { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, Math.max(0.3, r), 0, 7); ctx.fill(); }
    function ell(x, y, rx, ry, c) { ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, Math.max(0.3, rx), Math.max(0.3, ry), 0, 0, 7); ctx.fill(); }
    function line(x1, y1, x2, y2, c, w) { ctx.strokeStyle = c; ctx.lineWidth = Math.max(0.8, w); ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }
    function fade(z) { return Math.max(0, Math.min(1, (FAR - z) / 20)); }

    /* ---------- ciel et horizon ---------- */
    function skyCols() {
      var u = (st.dist % (BLEN * 4)) / (BLEN * 4), i = 0;
      while (i < SKY.length - 2 && u > SKY[i + 1][0]) i++;
      var a = SKY[i], b = SKY[i + 1], t = (u - a[0]) / (b[0] - a[0]);
      var top = mix(a[1], b[1], t), bot = mix(a[2], b[2], t);
      if (st.evk > 0.01 && st.tint) { top = mixx(top, st.tint[0], st.evk); bot = mixx(bot, st.tint[1], st.evk); }
      return { top: top, bot: bot, u: u };
    }
    function horizonOf(b, al, haze) {
      ctx.globalAlpha = al;
      var c = haze;
      if (b === 0) {
        rect(58, HY - 56, 18, 56, c); rect(90, HY - 56, 18, 56, c); rect(76, HY - 42, 14, 42, c); poly([74, HY - 42, 83, HY - 80, 92, HY - 42], c);
        for (var i = 0; i < 3; i++) { rect(58 + i * 6, HY - 62, 4, 6, c); rect(90 + i * 6, HY - 62, 4, 6, c); }
        rect(240, HY - 44, 34, 44, c); rect(236, HY - 52, 42, 10, c); for (var j = 0; j < 4; j++) rect(236 + j * 11, HY - 58, 6, 7, c);
        for (var h = 0; h < 14; h++) rect(h * 27 + 4, HY - 14 - ((h * 37) % 18), 24, 40, c);
      } else if (b === 1) {
        ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(0, HY); ctx.quadraticCurveTo(80, HY - 50, 170, HY - 16); ctx.quadraticCurveTo(260, HY - 56, W, HY - 20); ctx.lineTo(W, HY); ctx.fill();
        rect(112, HY - 56, 14, 44, c); poly([110, HY - 56, 119, HY - 90, 128, HY - 56], c); rect(118, HY - 98, 2, 10, c); rect(115, HY - 94, 8, 2, c);
        rect(220, HY - 40, 40, 30, c); poly([216, HY - 40, 240, HY - 62, 264, HY - 40], c);
      } else if (b === 2) {
        for (var t = 0; t < 26; t++) { var tx = t * 14 - 4, th = 34 + ((t * 53) % 28); poly([tx, HY, tx + 8, HY - th, tx + 16, HY], c); }
      } else {
        ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(0, HY); ctx.quadraticCurveTo(70, HY - 36, 150, HY - 14); ctx.quadraticCurveTo(250, HY - 46, W, HY - 18); ctx.lineTo(W, HY); ctx.fill();
        rect(262, HY - 50, 10, 34, c); poly([260, HY - 50, 267, HY - 58, 274, HY - 50], c);
        var a = st.t * 0.8; for (var bl = 0; bl < 4; bl++) { var an = a + bl * 1.5708; line(267, HY - 52, 267 + Math.cos(an) * 22, HY - 52 + Math.sin(an) * 22, c, 2.4); }
      }
      ctx.globalAlpha = 1;
    }
    function drawSky() {
      var sc = skyCols();
      var g = ctx.createLinearGradient(0, 0, 0, HY + 10);
      g.addColorStop(0, sc.top); g.addColorStop(1, sc.bot);
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, HY + 12);
      var u = sc.u, night = u > 0.84 && u < 0.97;
      var sunY = HY + 10 - Math.max(0, Math.sin(Math.PI * Math.min(1, u / 0.8))) * 130;
      if (u < 0.82) { ell(250, sunY, 24, 24, "rgba(255,238,180,0.9)"); }
      if (night) { for (var i = 0; i < 18; i++) rect((i * 97) % W, 10 + (i * 53) % 120, 2, 2, "rgba(255,255,230,0.8)"); circ(70, 70, 14, "#f3efd8"); }
      // nuages
      var o = (st.scroll * 0.4) % (W + 160);
      for (var c = 0; c < 3; c++) { var cx = ((c * 170 - o) % (W + 160) + W + 160) % (W + 160) - 80, cy = 50 + c * 34; ell(cx, cy, 44, 11, "rgba(255,255,255,0.35)"); ell(cx + 22, cy - 7, 26, 10, "rgba(255,255,255,0.35)"); }
      var dF = st.dist + FAR * 1.4 * 0.8, m = bioMix(dF);
      var haze = night ? "#2a2446" : mix("#8c85a6", "#9aa7a0", 0.3);
      horizonOf(m.a, 1 - m.t, haze);
      if (m.t > 0) horizonOf(m.b, m.t, haze);
      rect(0, HY - 3, W, 6, haze);
      if (st.intk > 0.01) { ctx.globalAlpha = Math.min(1, st.intk); var ig = ctx.createLinearGradient(0, 0, 0, HY + 12); ig.addColorStop(0, st.intBone ? "#17110a" : "#120e16"); ig.addColorStop(1, st.intBone ? "#3a2c1e" : "#2b2530"); ctx.fillStyle = ig; ctx.fillRect(0, 0, W, HY + 12); var gl = ctx.createRadialGradient(W / 2, HY, 2, W / 2, HY, 70); gl.addColorStop(0, st.intBone ? "rgba(255,200,120,0.3)" : "rgba(255,240,200,0.55)"); gl.addColorStop(1, "rgba(255,240,200,0)"); ctx.fillStyle = gl; ctx.fillRect(W / 2 - 70, HY - 70, 140, 80); ctx.globalAlpha = 1; }
    }

    /* ---------- sol, chaussée ---------- */
    function drawGround() {
      var m0 = bioMix(st.dist + FAR * 1.4), e0 = evAt(st.dist + FAR * 1.4); ctx.fillStyle = e0 && e0.g ? e0.g[0] : mix(BIO[m0.a].ground[0], BIO[m0.b].ground[0], m0.t); ctx.fillRect(0, HY, W, H - HY);
      var z0 = FAR + 6, band = 1.5, off = st.scroll % (band * 2);
      var n = 0;
      for (var z = z0 + off; z > -1.5; z -= band) {
        var zA = z, zB = Math.max(z - band, -1.2);
        if (zA > FAR + 12) continue;
        var ya = yOf(zA), yb = yOf(zB) + 1;
        if (yb <= ya) continue;
        var m = bioMix(st.dist + z * 1.4), A = BIO[m.a], B = BIO[m.b], t = m.t;
        var alt = ((Math.round((st.scroll - z) / band)) & 1);
        var gcol = mix(mix(A.ground[0], A.ground[1], alt * 0.28), mix(B.ground[0], B.ground[1], alt * 0.28), t);
        var ev = evAt(st.dist + z * 1.4); if (ev && ev.g) gcol = mix(ev.g[0], ev.g[1], alt * 0.28);
        ctx.fillStyle = gcol; ctx.fillRect(0, ya, W, yb - ya);
        var rcol = mix(mix(A.road[0], A.road[1], alt * 0.25), mix(B.road[0], B.road[1], alt * 0.25), t); if (ev && ev.g) rcol = mix(ev.r[0], ev.r[1], alt * 0.25);
        var xa = W / 2 - 1.5 * LW * kOf(zA), xb = W / 2 - 1.5 * LW * kOf(zB);
        ctx.fillStyle = rcol; ctx.beginPath(); ctx.moveTo(xa, ya); ctx.lineTo(W - xa, ya); ctx.lineTo(W - xb, yb); ctx.lineTo(xb, yb); ctx.closePath(); ctx.fill();
        var cob = A.cob * (1 - t) + B.cob * t; if (ev && ev.g) cob = ev.cob ? 1 : 0;
        if (cob > 0.5) { ctx.fillStyle = "rgba(0,0,0,0.16)"; ctx.fillRect(xb, yb - 1.5, W - 2 * xb, 1.5); }
        else {
          // ornières
          var rx1 = W / 2 - 0.55 * LW * kOf(zA), rx1b = W / 2 - 0.55 * LW * kOf(zB), rw = 0.12 * LW;
          ctx.fillStyle = "rgba(60,40,20,0.22)";
          [-1, 1].forEach(function (sg) { var ca = W / 2 + sg * 0.5 * LW * kOf(zA), cb = W / 2 + sg * 0.5 * LW * kOf(zB); ctx.beginPath(); ctx.moveTo(ca - rw * kOf(zA), ya); ctx.lineTo(ca + rw * kOf(zA), ya); ctx.lineTo(cb + rw * kOf(zB), yb); ctx.lineTo(cb - rw * kOf(zB), yb); ctx.fill(); });
        }
        n++;
      }
      var hg = ctx.createLinearGradient(0, HY, 0, HY + 70); hg.addColorStop(0, "rgba(210,200,215,0.55)"); hg.addColorStop(1, "rgba(210,200,215,0)"); ctx.fillStyle = hg; ctx.fillRect(0, HY, W, 70);
      // bordures de route
      ctx.strokeStyle = "rgba(40,28,20,0.5)"; ctx.lineWidth = 3;
      [-1.5, 1.5].forEach(function (l) { ctx.beginPath(); ctx.moveTo(xOf(l, FAR + 6), yOf(FAR + 6)); ctx.lineTo(xOf(l, -1.2), yOf(-1.2)); ctx.stroke(); });
    }

    /* ---------- bâtiments en 3D (volumes en perspective) ---------- */
    var WALLS = [["#cdb98f", "#9a8460"], ["#b8a07a", "#85704f"], ["#c9a882", "#917453"], ["#bfb39a", "#8a7f68"], ["#d2bf94", "#a08a5e"]];
    var ROOFS = [["#8c4a38", "#612f23"], ["#7a5a3a", "#563e27"], ["#9a6a3e", "#6e4a2a"], ["#6e5444", "#4a382d"], ["#a07a46", "#745628"]];
    function PT(it, dd, zz, hh) { var k = kOf(zz); return [W / 2 + it.side * dd * k, yOf(zz) - hh * k]; }
    function face(it, c, a) { var pts = []; a.forEach(function (p) { var q = PT(it, p[0], p[1], p[2]); pts.push(q[0], q[1]); }); poly(pts, c); }
    function bld(it, o) {
      if (it.sn && o.roof === "gable") o.rc = "#eef2f6";
      var zn = it.z + (o.dz || 0), d = o.d, zf = zn + d, xi = 1.5 * LW + 8 + (o.off != null ? o.off : it.off) * LW, xo = xi + o.w, xc = (xi + xo) / 2, h = o.h, kn = kOf(zn);
      face(it, o.ws, [[xi, zn, 0], [xi, zn, h], [xi, zf, h], [xi, zf, 0]]);
      if (o.win) for (var j = 0; j < o.win[0]; j++) for (var r = 0; r < o.win[1]; r++) {
        var za = zn + d * (0.1 + j * 0.86 / o.win[0]), zb = za + d * 0.42 / o.win[0], ha = 16 + r * (o.wh || 46), lit = (r + j + Math.floor(it.v * 9)) % 7 === 0;
        face(it, o.bars ? "#15121a" : o.dim ? "#241d17" : lit ? "#dca95c" : "#2e2620", [[xi, za, ha], [xi, zb, ha], [xi, zb, ha + (o.wk || 18)], [xi, za, ha + (o.wk || 18)]]);
        if (o.bars) { var zm = (za + zb) / 2; face(it, "#8a8a92", [[xi, zm - 0.01, ha], [xi, zm + 0.01, ha], [xi, zm + 0.01, ha + (o.wk || 18)], [xi, zm - 0.01, ha + (o.wk || 18)]]); }
      }
      if (o.roof === "gable") face(it, o.rc, [[xi - 7, zn, h], [xc, zn, h + o.rh], [xc, zf, h + o.rh], [xi - 7, zf, h]]);
      else if (o.roof === "flat" && yOf(zn) - h * kn > HY) face(it, o.top || o.wf, [[xi, zn, h], [xo, zn, h], [xo, zf, h], [xi, zf, h]]);
      face(it, o.wf, [[xi, zn, 0], [xo, zn, 0], [xo, zn, h], [xi, zn, h]]);
      if (o.timber) { var tc = "#4e3820"; face(it, tc, [[xi, zn, h * 0.5], [xo, zn, h * 0.5], [xo, zn, h * 0.5 + 4], [xi, zn, h * 0.5 + 4]]); face(it, tc, [[xc - 2, zn, 0], [xc + 2, zn, 0], [xc + 2, zn, h], [xc - 2, zn, h]]); for (var tj = 0; tj < 4; tj++) { var zt = zn + d * (0.1 + tj * 0.26); face(it, tc, [[xi, zt, 0], [xi, zt + 0.04, 0], [xi, zt + 0.04, h], [xi, zt, h]]); } face(it, tc, [[xi, zn, h * 0.5], [xi, zf, h * 0.5], [xi, zf, h * 0.5 + 4], [xi, zn, h * 0.5 + 4]]); }
      if (o.fw) for (var fc = 0; fc < o.fw[0]; fc++) for (var fr = 0; fr < o.fw[1]; fr++) {
        var fx = xi + 10 + fc * ((o.w - 40) / Math.max(1, o.fw[0] - 1 || 1)), fh = (o.fh0 || 52) + fr * (o.wh || 46), flit = (fr + fc + Math.floor(it.v * 7)) % 7 === 0;
        face(it, o.bars ? "#15121a" : o.dim ? "#241d17" : flit ? "#dca95c" : "#2e2620", [[fx, zn, fh], [fx + 12, zn, fh], [fx + 12, zn, fh + 19], [fx, zn, fh + 19]]);
        if (!o.bars) { face(it, "#6a4a2c", [[fx - 5, zn, fh], [fx, zn, fh], [fx, zn, fh + 19], [fx - 5, zn, fh + 19]]); face(it, "#6a4a2c", [[fx + 12, zn, fh], [fx + 17, zn, fh], [fx + 17, zn, fh + 19], [fx + 12, zn, fh + 19]]); }
      }
      if (o.door) { var dc = o.dcol || "#4a3320"; face(it, dc, [[xc - 10, zn, 0], [xc + 10, zn, 0], [xc + 10, zn, 36], [xc, zn, 44], [xc - 10, zn, 36]]); if (o.gate) { for (var gi = -2; gi <= 2; gi++) face(it, "#9a9aa4", [[xc + gi * 4 - 0.8, zn, 0], [xc + gi * 4 + 0.8, zn, 0], [xc + gi * 4 + 0.8, zn, 40], [xc + gi * 4 - 0.8, zn, 40]]); } }
      if (o.roof === "gable") { face(it, o.wf, [[xi, zn, h], [xo, zn, h], [xc, zn, h + o.rh]]); face(it, o.rc, [[xi - 7, zn, h - 2], [xi, zn, h - 2], [xc, zn, h + o.rh], [xc, zn, h + o.rh - 5]]); }
      if (o.roof === "pyr") { var zc = zn + d / 2; face(it, o.rs, [[xi - 4, zn, h], [xi - 4, zf, h], [xc, zc, h + o.rh]]); face(it, o.rc, [[xi - 4, zn, h], [xo + 4, zn, h], [xc, zc, h + o.rh]]); if (o.flag) { var fp = PT(it, xc, zc, h + o.rh), kk = kOf(zc); line(fp[0], fp[1], fp[0], fp[1] - 26 * kk, "#2a2a2a", 1.6 * kk); poly([fp[0], fp[1] - 26 * kk, fp[0] + it.side * -16 * kk, fp[1] - 22 * kk + Math.sin(st.t * 5) * 2 * kk, fp[0], fp[1] - 17 * kk], o.flag); } }
      if (o.crown) { var nn = 7; for (var m = 0; m < nn; m++) { var za2 = zn + d * m / nn, zb2 = za2 + d * 0.5 / nn; face(it, o.ws, [[xi, za2, h], [xi, zb2, h], [xi, zb2, h + 11], [xi, za2, h + 11]]); } for (var m2 = 0; m2 < 5; m2++) { var xa = xi + (o.w) * m2 / 5; face(it, o.wf, [[xa, zn, h], [xa + o.w * 0.1, zn, h], [xa + o.w * 0.1, zn, h + 11], [xa, zn, h + 11]]); } }
    }
    function drawHouse(it, x, y, k) {
      var wi = Math.floor(it.v * 5), tim = it.kind === "timber", c = WALLS[wi], rf = ROOFS[(wi + 2) % 5];
      var h = it.h * 0.78;
      bld(it, { w: it.w * 0.8, h: h, d: tim ? 2.4 : 2.9, wf: tim ? "#e0d2ae" : c[0], ws: tim ? "#b4a37e" : c[1], roof: "gable", rc: tim ? "#c19a48" : rf[0], rh: (tim ? 38 : 44) + Math.floor(it.v * 26), win: [2, Math.max(1, Math.floor(h / 52))], fw: [2, Math.max(1, Math.floor(h / 52))], door: true, timber: tim });
      if (!tim && it.h > 190) { var cp = PT(it, 1.5 * LW + 8 + it.off * LW + it.w * 0.55, it.z + 1.4, h + 40), kc = kOf(it.z + 1.4); rect(cp[0] - 5 * kc, cp[1] - 22 * kc, 10 * kc, 30 * kc, "#6e5e58"); }
    }
    function drawChurch(it) {
      var nave = { side: it.side, off: it.off, z: it.z + 1.9, v: it.v }, tw = { side: it.side, off: it.off, z: it.z, v: it.v };
      bld(nave, { w: 120, h: 105, d: 3.4, wf: "#d6cdb6", ws: "#aaa08a", roof: "gable", rc: "#6a5a58", rh: 46, win: [3, 1], wh: 0, wk: 42, bars: false, door: false });
      bld(tw, { off: it.off, w: 66, h: 235, d: 1.6, wf: "#e0d8c3", ws: "#b0a88f", roof: "pyr", rc: "#58648a", rs: "#414b6c", rh: 105, door: true, dcol: "#3a2a1c", flag: null });
      var xi = 1.5 * LW + 8 + it.off * LW, c = PT(tw, xi + 33, it.z, 190), kk = kOf(it.z);
      circ(c[0], c[1], 12 * kk, "#f4efdc"); line(c[0], c[1], c[0], c[1] - 8 * kk, "#2a2a2a", 1.6 * kk); line(c[0], c[1], c[0] + 5 * kk, c[1], "#2a2a2a", 1.6 * kk);
      face(tw, "#2a2430", [[xi + 22, it.z, 140], [xi + 44, it.z, 140], [xi + 44, it.z, 176], [xi + 33, it.z, 186], [xi + 22, it.z, 176]]);
      var tp = PT(tw, xi + 33, it.z + 0.8, 235 + 105), kt = kOf(it.z + 0.8); line(tp[0], tp[1], tp[0], tp[1] - 24 * kt, "#d9b24a", 2.4 * kt); line(tp[0] - 7 * kt, tp[1] - 15 * kt, tp[0] + 7 * kt, tp[1] - 15 * kt, "#d9b24a", 2.4 * kt);
    }
    function drawPrison(it) {
      var a = { side: it.side, off: it.off, z: it.z + 1.1, v: it.v }, t1 = { side: it.side, off: it.off, z: it.z, v: it.v }, t2 = { side: it.side, off: it.off, z: it.z + 3.6, v: it.v };
      bld(t2, { w: 54, h: 215, d: 1.5, wf: "#8d8a88", ws: "#66625f", roof: "pyr", rc: "#2f2c36", rs: "#201e26", rh: 70, win: [1, 3], wh: 52, wk: 24, bars: true, crown: false });
      bld(a, { w: 160, h: 170, d: 3.1, wf: "#9a9692", ws: "#6f6b68", roof: "flat", top: "#7a7672", win: [4, 3], wh: 44, wk: 22, bars: true, crown: true, door: true, gate: true, dcol: "#1b1620" });
      bld(t1, { w: 62, h: 235, d: 1.7, wf: "#a39f9b", ws: "#76726f", roof: "pyr", rc: "#2f2c36", rs: "#201e26", rh: 78, win: [1, 3], wh: 52, wk: 24, bars: true, fw: [2, 3], fh0: 60, flag: "#b02a37" });
    }
    function drawChateau(it) {
      var a = { side: it.side, off: it.off, z: it.z + 1.2, v: it.v }, t1 = { side: it.side, off: it.off, z: it.z, v: it.v }, t2 = { side: it.side, off: it.off, z: it.z + 3.8, v: it.v };
      bld(t2, { w: 50, h: 170, d: 1.4, wf: "#e8dcc0", ws: "#bcae90", roof: "pyr", rc: "#4a5f8a", rs: "#364768", rh: 70, win: [1, 2], wh: 52 });
      bld(a, { w: 150, h: 120, d: 3.3, wf: "#eadfc4", ws: "#bfb294", roof: "gable", rc: "#4a5f8a", rh: 52, win: [4, 2], fw: [3, 2], door: true, wh: 46, dcol: "#4a3320" });
      bld(t1, { w: 56, h: 190, d: 1.6, wf: "#f0e6cc", ws: "#c4b698", roof: "pyr", rc: "#4a5f8a", rs: "#364768", rh: 82, win: [1, 3], wh: 50, fw: [2, 3], fh0: 50, flag: "#d9b13a" });
    }
    function drawCabin(it) { bld(it, { w: 74, h: 54, d: 2, wf: "#8a6a44", ws: "#664a2e", roof: "gable", rc: "#b49a52", rh: 34, win: [1, 1], fw: [1, 1], fh0: 20, door: true }); }
    function drawChurchOld() {}
    function drawBush(it, x, y, k) { var xo = (1.5 * LW + 10 + it.off * LW) * k, tx = it.side < 0 ? W / 2 - xo : W / 2 + xo; ell(tx, y, 22 * k, 5 * k, "rgba(0,0,0,0.18)"); circ(tx, y - 12 * k, 16 * k, "#33642f"); circ(tx - 12 * k, y - 8 * k, 12 * k, "#2b5a2c"); circ(tx + 12 * k, y - 9 * k, 13 * k, "#3f7a36"); }
    function drawRock(it, x, y, k) { var xo = (1.5 * LW + 10 + it.off * LW) * k, tx = it.side < 0 ? W / 2 - xo : W / 2 + xo; poly([tx - 24 * k, y, tx - 16 * k, y - 26 * k, tx + 4 * k, y - 34 * k, tx + 24 * k, y - 14 * k, tx + 28 * k, y], "#8a8a86"); poly([tx + 4 * k, y - 34 * k, tx + 24 * k, y - 14 * k, tx + 28 * k, y, tx + 6 * k, y], "#6c6c6a"); }
    function drawTree(it, x, y, k, pine) {
      var xo = (1.5 * LW + 12 + it.off * LW) * k, tx = it.side < 0 ? W / 2 - xo : W / 2 + xo, s = (0.85 + it.v * 0.5) * k;
      var gr = ["#3d7a3a", "#2f6a34", "#4d8a3c", "#356a3a"][Math.floor(it.v * 4)]; if (it.sn) gr = "#e4ecf1"; else if (it.au) gr = ["#c8782a", "#b8541f", "#d9a032", "#a8641f"][Math.floor(it.v * 4)];
      ell(tx, y, 26 * s, 6 * s, "rgba(0,0,0,0.18)");
      if (pine) { rect(tx - 4 * s, y - 28 * s, 8 * s, 28 * s, "#5a3e24"); for (var i = 0; i < 4; i++) poly([tx - (30 - i * 5) * s, y - (22 + i * 28) * s, tx, y - (60 + i * 28) * s, tx + (30 - i * 5) * s, y - (22 + i * 28) * s], i % 2 ? "#2c5a30" : "#26502c"); }
      else { rect(tx - 6 * s, y - 56 * s, 12 * s, 56 * s, "#5e4226"); circ(tx, y - 82 * s, 36 * s, gr); circ(tx - 24 * s, y - 62 * s, 24 * s, "#2f6a34"); circ(tx + 24 * s, y - 66 * s, 25 * s, gr); circ(tx + 4 * s, y - 100 * s, 24 * s, "#4d8a3c"); }
    }
    function drawMill(it, x, y, k) {
      var xo = (1.5 * LW + 40 + it.off * LW) * k, tx = it.side < 0 ? W / 2 - xo : W / 2 + xo;
      poly([tx - 30 * k, y, tx - 20 * k, y - 120 * k, tx + 20 * k, y - 120 * k, tx + 30 * k, y], "#e6dccb");
      poly([tx - 24 * k, y - 120 * k, tx, y - 148 * k, tx + 24 * k, y - 120 * k], "#6a4a3a");
      rect(tx - 7 * k, y - 28 * k, 14 * k, 28 * k, "#4a3320");
      var a = st.t * 0.9 + it.v * 6; for (var i = 0; i < 4; i++) { var an = a + i * 1.5708, ex = tx + Math.cos(an) * 72 * k, ey = y - 112 * k + Math.sin(an) * 72 * k; line(tx, y - 112 * k, ex, ey, "#5e4226", 3 * k); var nx = -Math.sin(an) * 12 * k, ny = Math.cos(an) * 12 * k; poly([tx + Math.cos(an) * 20 * k, y - 112 * k + Math.sin(an) * 20 * k, ex, ey, ex + nx, ey + ny, tx + Math.cos(an) * 20 * k + nx, y - 112 * k + Math.sin(an) * 20 * k + ny], "rgba(240,232,210,0.9)"); }
      circ(tx, y - 112 * k, 5 * k, "#3a2a1c");
    }
    function drawFarm(it) { bld(it, { w: 130, h: 64, d: 3, wf: "#dccfaa", ws: "#b3a47e", roof: "gable", rc: "#b08a3a", rh: 46, win: [2, 1], fw: [1, 1], fh0: 30, door: true }); }
    function drawHay(it, x, y, k) {
      var xo = (1.5 * LW + 20 + it.off * LW) * k, tx = it.side < 0 ? W / 2 - xo : W / 2 + xo;
      poly([tx - 34 * k, y, tx - 22 * k, y - 52 * k, tx, y - 74 * k, tx + 22 * k, y - 52 * k, tx + 34 * k, y], "#d4b250"); poly([tx - 10 * k, y, tx, y - 74 * k, tx + 22 * k, y - 52 * k, tx + 34 * k, y], "rgba(0,0,0,0.1)");
    }
    function drawFence(it, x, y, k) {
      var xo = (1.5 * LW + 6) * k, tx = it.side < 0 ? W / 2 - xo : W / 2 + xo, len = 60 * k;
      var x1 = it.side < 0 ? tx - len : tx;
      rect(x1, y - 30 * k, len, 4 * k, "#7a5a34"); rect(x1, y - 18 * k, len, 4 * k, "#7a5a34");
      for (var i = 0; i < 3; i++) rect(x1 + i * (len - 6 * k) / 2, y - 38 * k, 6 * k, 38 * k, "#5e4226");
    }
    function drawWell(it, x, y, k) {
      var xo = (1.5 * LW + 24) * k, tx = it.side < 0 ? W / 2 - xo : W / 2 + xo;
      rect(tx - 20 * k, y - 28 * k, 40 * k, 28 * k, "#a8a090"); ell(tx, y - 28 * k, 20 * k, 6 * k, "#2f3f52");
      rect(tx - 22 * k, y - 66 * k, 4 * k, 40 * k, "#5e4226"); rect(tx + 18 * k, y - 66 * k, 4 * k, 40 * k, "#5e4226"); poly([tx - 28 * k, y - 66 * k, tx, y - 84 * k, tx + 28 * k, y - 66 * k], "#7a4a3a");
    }
    function drawLamp(it, x, y, k) {
      var xo = (1.5 * LW + 5) * k, tx = it.side < 0 ? W / 2 - xo : W / 2 + xo;
      rect(tx - 2 * k, y - 100 * k, 4 * k, 100 * k, "#2f2a30"); line(tx, y - 98 * k, tx + (it.side < 0 ? 14 : -14) * k, y - 104 * k, "#2f2a30", 3 * k);
      rect(tx + (it.side < 0 ? 8 : -20) * k, y - 104 * k, 12 * k, 14 * k, "#f6d98a");
    }
    /* ---------- décors des événements ---------- */
    function flame(x, y, s, t) { var f = Math.sin(t * 13 + x * 0.3) * 0.18 + 1; poly([x - 9 * s, y, x - 5 * s, y - 20 * s * f, x - 1 * s, y - 12 * s, x + 2 * s, y - 34 * s * f, x + 7 * s, y - 14 * s, x + 11 * s, y - 22 * s * f, x + 9 * s, y], "#e8541c"); poly([x - 5 * s, y, x - 1 * s, y - 16 * s * f, x + 3 * s, y - 24 * s * f, x + 6 * s, y], "#f7b52c"); poly([x - 2 * s, y, x + 1 * s, y - 12 * s * f, x + 4 * s, y], "#fff0a0"); }
    function sideX(it, off, k) { var xo = (1.5 * LW + 10 + off * LW) * k; return it.side < 0 ? W / 2 - xo : W / 2 + xo; }
    var GEN = {
      cell: function (it) { var b = it.bone; if (b) { bld(it, { w: 70, h: 190, d: 2.9, wf: "#7a6a50", ws: "#5c4e3a", roof: "flat", top: "#4a3e30" }); var xi = 1.5 * LW + 8; for (var r = 0; r < 3; r++) for (var j = 0; j < 9; j++) { var zz = it.z + 0.15 + j * 0.31 + (r % 2) * 0.15, p = PT(it, xi, zz, 22 + r * 46), kk = kOf(zz); ell(p[0], p[1], 7.5 * kk, 8.5 * kk, "#e6dcc0"); ell(p[0], p[1] + 8 * kk, 5 * kk, 3.6 * kk, "#d6caa8"); circ(p[0] - 2.6 * kk, p[1] - 1 * kk, 1.7 * kk, "#2a2218"); circ(p[0] + 2.6 * kk, p[1] - 1 * kk, 1.7 * kk, "#2a2218"); } return; } bld(it, { w: 70, h: 230, d: 2.9, wf: b ? "#cdbd98" : "#5a5660", ws: b ? "#a8987a" : "#3f3b47", roof: "flat", top: "#2a2630", win: [3, 2], wh: 90, wk: 46, bars: !b, dim: b }); },
      torch: function (it, x, y, k) { var tx = W / 2 + it.side * (1.5 * LW + 3) * k, ty = y - 110 * k; if (it.bone) { ctx.globalAlpha = 0.28 * fade(it.z); ell(tx, ty, 60 * k, 60 * k, "rgba(255,200,110,0.5)"); ctx.globalAlpha = fade(it.z); rect(tx - 1 * k, ty - 18 * k, 2 * k, 12 * k, "#2a2218"); rect(tx - 5 * k, ty - 6 * k, 10 * k, 14 * k, "#3a2e22"); rect(tx - 3 * k, ty - 4 * k, 6 * k, 10 * k, "#ffd27a"); return; } ctx.globalAlpha = 0.3 * fade(it.z); ell(tx, ty - 14 * k, 70 * k, 70 * k, "rgba(255,160,60,0.5)"); ctx.globalAlpha = fade(it.z); rect(tx - 2 * k, ty, 4 * k, 20 * k, "#3a2a1c"); flame(tx, ty, 0.9 * k, st.t); },
      skull: function (it, x, y, k) { var tx = sideX(it, it.off, k); for (var i = 0; i < 4; i++) { circ(tx + (i - 1.5) * 9 * k, y - 6 * k - (i % 2) * 7 * k, 6 * k, "#ece4cc"); rect(tx + (i - 1.5) * 9 * k - 2.5 * k, y - 8 * k - (i % 2) * 7 * k, 2 * k, 2 * k, "#2a2218"); rect(tx + (i - 1.5) * 9 * k + 1 * k, y - 8 * k - (i % 2) * 7 * k, 2 * k, 2 * k, "#2a2218"); } },
      rib: function (it, x, y, k) { if (it.z < PD + 1.5) return; var xw = (1.5 * LW + 8) * k, y0 = y - (it.bone ? 180 : 215) * k; ctx.strokeStyle = it.bone ? "#5c4e3a" : "#4e4a58"; ctx.lineWidth = Math.max(2, 16 * k); ctx.lineCap = "butt"; ctx.beginPath(); ctx.moveTo(W / 2 - xw, y0); ctx.quadraticCurveTo(W / 2, y0 - 180 * k, W / 2 + xw, y0); ctx.stroke(); },
      gate: function (it, x, y, k) { var xw = (1.5 * LW + 8) * k, pw = 80 * k; if (it.bone) { rect(W / 2 - xw - pw, y - 240 * k, pw, 240 * k, "#6a5a44"); rect(W / 2 + xw, y - 240 * k, pw, 240 * k, "#6a5a44"); rect(W / 2 - xw - pw, y - 240 * k, 2 * (xw + pw), 50 * k, "#5a4c38"); rect(W / 2 - 52 * k, y - 232 * k, 104 * k, 30 * k, "#a89a7a"); for (var q = 0; q < 4; q++) rect(W / 2 - 44 * k, y - 226 * k + q * 6 * k, 88 * k, 2 * k, "#4a3e30"); return; } rect(W / 2 - xw - pw, y - 270 * k, pw, 270 * k, "#7a7680"); rect(W / 2 + xw, y - 270 * k, pw, 270 * k, "#7a7680"); rect(W / 2 - xw - pw, y - 270 * k, 2 * (xw + pw), 54 * k, "#6a6670"); rect(W / 2 - xw - pw, y - 276 * k, 2 * (xw + pw), 8 * k, "#8a8690"); for (var i = 0; i < 9; i++) poly([W / 2 - xw + i * (2 * xw / 8) - 6 * k, y - 216 * k, W / 2 - xw + i * (2 * xw / 8) + 6 * k, y - 216 * k, W / 2 - xw + i * (2 * xw / 8), y - 190 * k], "#9a9aa4"); },
      wall: function (it) { bld(it, { w: it.w, h: it.h, d: it.d, wf: it.c[0], ws: it.c[1], roof: "flat", top: it.c[0] }); },
      stall: function (it) { bld(it, { w: 60, h: 46, d: 2.2, wf: "#8a5a2c", ws: "#6a431e", roof: "gable", rc: it.aw, rh: 28 }); },
      bhouse: function (it, x, y, k) { drawHouse(it, x, y, k); var xi = 1.5 * LW + 8 + it.off * LW, h = it.h * 0.78; for (var j = 0; j < 3; j++) { var p = PT(it, xi + it.w * 0.4 * (j + 0.5) / 1.5, it.z + 0.5 + j * 0.9, h + 18), kk = kOf(it.z + 0.5 + j * 0.9); flame(p[0], p[1], 1.5 * kk, st.t + j); } },
      barr: function (it) { bld(it, { w: 36, h: 48, d: 2.8, wf: "#7a5a34", ws: "#5a4024", roof: "flat", top: "#8a6a40" }); },
      flag: function (it, x, y, k) { var tx = sideX(it, it.off, k), top = y - 150 * k; line(tx, y, tx, top, "#3a2a1c", 3 * k); var cols = ["#2a4aa0", "#f4f4f4", "#c8283a"], sg = it.side < 0 ? 1 : -1; for (var i = 0; i < 3; i++) { var w = Math.sin(st.t * 5 + i) * 3 * k; poly([tx + sg * i * 14 * k, top + w, tx + sg * (i + 1) * 14 * k, top + w * 0.6, tx + sg * (i + 1) * 14 * k, top + 30 * k + w * 0.6, tx + sg * i * 14 * k, top + 30 * k + w], cols[i]); } },
      gui: function (it, x, y, k) { bld(it, { w: 110, h: 36, d: 3, wf: "#6a5a4a", ws: "#4a3e32", roof: "flat", top: "#7a6a58" }); var xi = 1.5 * LW + 8 + it.off * LW, zc = it.z + 1.5, p = PT(it, xi + 55, zc, 36), kk = kOf(zc); rect(p[0] - 22 * kk, p[1] - 130 * kk, 5 * kk, 130 * kk, "#4a3320"); rect(p[0] + 17 * kk, p[1] - 130 * kk, 5 * kk, 130 * kk, "#4a3320"); rect(p[0] - 26 * kk, p[1] - 136 * kk, 52 * kk, 7 * kk, "#4a3320"); poly([p[0] - 16 * kk, p[1] - 118 * kk, p[0] + 16 * kk, p[1] - 118 * kk, p[0] - 16 * kk, p[1] - 96 * kk], "#c9ccd2"); rect(p[0] - 12 * kk, p[1] - 22 * kk, 24 * kk, 12 * kk, "#5a3a22"); },
      rider: function (it, x, y, k) { var tx = sideX(it, it.off, k), b = Math.sin(st.t * 12 + it.v * 9) * 3 * k, s = k * 1.05, f = it.side < 0 ? 1 : -1; ell(tx, y, 38 * s, 7 * s, "rgba(0,0,0,0.2)"); for (var i = 0; i < 4; i++) { var sw = Math.sin(st.t * 12 + i * 1.6 + it.v * 9) * 12 * s; line(tx + (i < 2 ? -22 : 20) * s, y - 24 * s + b, tx + (i < 2 ? -22 : 20) * s + sw, y - 2 * s, "#4a2c18", 5 * s); } ell(tx, y - 38 * s + b, 34 * s, 15 * s, "#6a3e20"); poly([tx + f * 26 * s, y - 46 * s + b, tx + f * 42 * s, y - 62 * s + b, tx + f * 46 * s, y - 52 * s + b, tx + f * 32 * s, y - 36 * s + b], "#6a3e20"); rect(tx - 6 * s, y - 66 * s + b, 12 * s, 28 * s, "#b02a37"); circ(tx, y - 74 * s + b, 6 * s, "#e0b48a"); poly([tx - 9 * s, y - 76 * s + b, tx, y - 88 * s + b, tx + 9 * s, y - 76 * s + b], "#2a2430"); line(tx + f * 6 * s, y - 60 * s + b, tx + f * 26 * s, y - 94 * s + b, "#c9ccd2", 2 * s); },
      vine: function (it) { bld(it, { w: 74, h: 18, d: 5, wf: "#3f6a2e", ws: "#2f5224", roof: "flat", top: "#527f3a" }); },
      tomb: function (it, x, y, k) { var tx = sideX(it, it.off, k); if (it.v > 0.5) { rect(tx - 2.5 * k, y - 44 * k, 5 * k, 44 * k, "#b0aea6"); rect(tx - 12 * k, y - 34 * k, 24 * k, 5 * k, "#b0aea6"); } else { rect(tx - 10 * k, y - 32 * k, 20 * k, 32 * k, "#a8a8a2"); ell(tx, y - 32 * k, 10 * k, 7 * k, "#a8a8a2"); } },
      deadtree: function (it, x, y, k) { var tx = sideX(it, it.off, k), s = k * (0.9 + it.v * 0.5); line(tx, y, tx, y - 70 * s, "#3a2e26", 6 * s); line(tx, y - 40 * s, tx - 26 * s, y - 80 * s, "#3a2e26", 4 * s); line(tx, y - 54 * s, tx + 24 * s, y - 92 * s, "#3a2e26", 4 * s); line(tx, y - 68 * s, tx - 8 * s, y - 100 * s, "#3a2e26", 3 * s); },
      ship: function (it, x, y, k) { var sm = it.small, w = sm ? 34 : 64, h = sm ? 26 : 44, d = sm ? 3 : 4.8; bld(it, { w: w, h: h, d: d, wf: "#5a3e26", ws: "#3e2a18", roof: "flat", top: "#7a5a38" }); var xi = 1.5 * LW + 8 + it.off * LW, zc = it.z + d / 2, p = PT(it, xi + w / 2, zc, h), kk = kOf(zc); line(p[0], p[1], p[0], p[1] - (sm ? 90 : 170) * kk, "#3a2a1c", 3 * kk); poly([p[0] + 2 * kk, p[1] - (sm ? 80 : 160) * kk, p[0] + 2 * kk, p[1] - 20 * kk, p[0] + (it.side < 0 ? -1 : 1) * 40 * kk, p[1] - 30 * kk + Math.sin(st.t * 2 + it.v * 5) * 3 * kk], "#e8e0cc"); },
      stack: function (it) { bld(it, { w: 40, h: 50, d: 2, wf: "#9a6a35", ws: "#6a4720", roof: "flat", top: "#b98a4c" }); },
      tent: function (it) { bld(it, { w: 70, h: 28, d: 2.6, wf: "#d8ceb0", ws: "#b3a98c", roof: "gable", rc: it.v > 0.5 ? "#c8bd9c" : "#b0a888", rh: 46, door: true, dcol: "#3a2e22" }); },
      campfire: function (it, x, y, k) { var tx = sideX(it, it.off, k); ell(tx, y, 24 * k, 6 * k, "rgba(0,0,0,0.25)"); line(tx - 14 * k, y - 2 * k, tx + 14 * k, y - 8 * k, "#4a3020", 5 * k); line(tx + 14 * k, y - 2 * k, tx - 14 * k, y - 8 * k, "#4a3020", 5 * k); ctx.globalAlpha *= 0.35; ell(tx, y - 20 * k, 50 * k, 50 * k, "rgba(255,160,60,0.4)"); ctx.globalAlpha = fade(it.z); flame(tx, y - 4 * k, 1.5 * k, st.t); }
    };
    function drawWx() {
      var wk = st.wxk || 0, i; if (wk <= 0.02) return;
      ctx.save(); ctx.globalAlpha = wk;
      if (st.wx === "rain" || st.wx === "storm") {
        ctx.strokeStyle = "rgba(200,215,235,0.45)"; ctx.lineWidth = 1.2; ctx.beginPath();
        for (i = 0; i < 130; i++) { var px = (i * 97.3 + st.t * 60) % (W + 40), py = (i * 61.7 + st.t * 1000) % H; ctx.moveTo(px, py); ctx.lineTo(px - 5, py + 18); } ctx.stroke();
        var fl = Math.max(0, Math.sin(st.t * 1.9) * Math.sin(st.t * 0.47 + 1)); if (st.wx === "storm" && fl > 0.9) { ctx.globalAlpha = (fl - 0.9) * 6 * wk; rect(0, 0, W, H, "#fff"); }
      } else if (st.wx === "snow") { ctx.fillStyle = "rgba(255,255,255,0.9)"; for (i = 0; i < 90; i++) { var sx = (i * 71 + Math.sin(st.t * 0.9 + i) * 22 + W) % W, sy = (i * 47 + st.t * (50 + (i % 5) * 18)) % H; ctx.beginPath(); ctx.arc(sx, sy, 1.2 + (i % 3) * 0.7, 0, 7); ctx.fill(); } }
      else if (st.wx === "fog") { var fg = ctx.createLinearGradient(0, HY - 60, 0, HY + 260); fg.addColorStop(0, "rgba(225,228,232,0.15)"); fg.addColorStop(0.35, "rgba(225,228,232,0.62)"); fg.addColorStop(1, "rgba(225,228,232,0.1)"); ctx.fillStyle = fg; ctx.fillRect(0, HY - 60, W, 330); }
      else if (st.wx === "fire") { var gg = ctx.createLinearGradient(0, 0, 0, H); gg.addColorStop(0, "rgba(120,30,20,0.3)"); gg.addColorStop(1, "rgba(255,120,30,0.22)"); ctx.fillStyle = gg; ctx.fillRect(0, 0, W, H); for (i = 0; i < 40; i++) { var ex = (i * 83 + Math.sin(st.t * 2 + i) * 10) % W, ey = H - ((i * 37 + st.t * (70 + i % 4 * 25)) % H); circ(ex, ey, 1.4 + i % 2, i % 3 ? "#ffb347" : "#ff7a2a"); } }
      else if (st.wx === "leaves") { for (i = 0; i < 26; i++) { var lx = (i * 67 + Math.sin(st.t * 1.4 + i) * 30 + W) % W, ly = (i * 53 + st.t * (40 + i % 4 * 14)) % H; ell(lx, ly, 4, 2.4, ["#d9822a", "#b8481f", "#e0a53a"][i % 3]); } }
      else if (st.wx === "fw") { st.fw.forEach(function (f) { var a = Math.max(0, 1 - f.t / 1.5); for (var j = 0; j < 22; j++) { var an = j * 0.2856, r = f.t * 78; circ(f.x + Math.cos(an) * r, f.y + Math.sin(an) * r + f.t * f.t * 26, 2.2, "hsla(" + f.h + ",95%,65%," + a + ")"); } }); }
      ctx.restore();
    }
    function drawScn(it) {
      var k = kOf(it.z), y = yOf(it.z);
      ctx.globalAlpha = fade(it.z);
      switch (it.type) {
        case "house": drawHouse(it, 0, y, k); break; case "church": drawChurch(it); break; case "prison": drawPrison(it); break; case "chateau": drawChateau(it); break; case "cabin": drawCabin(it); break; case "bush": drawBush(it, 0, y, k); break; case "rock": drawRock(it, 0, y, k); break;
        case "tree": drawTree(it, 0, y, k, false); break; case "pine": drawTree(it, 0, y, k, true); break;
        case "mill": drawMill(it, 0, y, k); break; case "farm": drawFarm(it); break;
        case "haystack": drawHay(it, 0, y, k); break; case "fence": drawFence(it, 0, y, k); break;
        default: if (GEN[it.type]) GEN[it.type](it, 0, y, k); break;
        case "well": drawWell(it, 0, y, k); break; case "lamp": drawLamp(it, 0, y, k); break;
      }
      ctx.globalAlpha = 1;
    }

    /* ---------- villageois qui regardent ---------- */
    var CLOTH = ["#8a3a3a", "#3a5a8a", "#5a7a3a", "#8a6a3a", "#6a4a7a"];
    function drawPerson(p, px, y, k, tt) {
      var s = k * p.s, c = p.cc || CLOTH[p.col], sk = "#e0b48a", wv = Math.sin(tt * 5 + p.ph);
      var face = p.side < 0 ? 1 : -1;
      ell(px, y, 12 * s, 3.5 * s, "rgba(0,0,0,0.2)");
      if (p.kind === 1) { poly([px - 11 * s, y, px - 7 * s, y - 34 * s, px + 7 * s, y - 34 * s, px + 11 * s, y], c); } // robe
      else { line(px - 4 * s, y, px - 4 * s, y - 24 * s, "#3a3340", 5 * s); line(px + 4 * s, y, px + 4 * s, y - 24 * s, "#3a3340", 5 * s); rect(px - 8 * s, y - 42 * s, 16 * s, 22 * s, c); }
      if (p.kind === 3) { s *= 0.6; }
      var by = y - 42 * s;
      // bras
      if (p.act === 0) { line(px + 8 * s * face, by + 4 * s, px + 14 * s * face, by - 12 * s - wv * 8 * s, c, 4 * s); circ(px + 14 * s * face, by - 14 * s - wv * 8 * s, 2.6 * s, sk); line(px - 8 * s * face, by + 4 * s, px - 10 * s * face, by + 16 * s, c, 4 * s); }
      else if (p.act === 1) { line(px + 8 * s * face, by + 4 * s, px + 16 * s * face, by - 4 * s + wv * 3 * s, c, 4 * s); circ(px + 16 * s * face, by - 6 * s + wv * 3 * s, 3 * s, sk); line(px - 8 * s * face, by + 4 * s, px - 10 * s * face, by + 16 * s, c, 4 * s); }
      else { line(px - 8 * s, by + 4 * s, px - 9 * s, by + 18 * s, c, 4 * s); line(px + 8 * s, by + 4 * s, px + 9 * s, by + 18 * s, c, 4 * s); }
      circ(px, by - 8 * s, 7.5 * s, sk);
      if (p.kind === 0) poly([px - 11 * s, by - 10 * s, px, by - 22 * s, px + 11 * s, by - 10 * s], "#2a2430"); // tricorne
      else if (p.kind === 1) { circ(px, by - 10 * s, 7.8 * s, "#efe9da"); rect(px - 8 * s, by - 10 * s, 16 * s, 4 * s, "#efe9da"); } // bonnet
      else if (p.kind === 2) { rect(px - 8 * s, by - 17 * s, 16 * s, 6 * s, "#7a4a2a"); }
      else { circ(px, by - 12 * s, 7 * s, "#6a4a2a"); }
    }

    /* ---------- obstacles ---------- */
    var OBS = {
      crate: function (x, y, k) { var w = 70 * k, h = 50 * k; rect(x - w / 2, y - h, w, h, "#9a6a35"); rect(x - w / 2, y - h, w, 6 * k, "#b98a4c"); ctx.strokeStyle = "#5e3f1d"; ctx.lineWidth = Math.max(1, 3 * k); ctx.strokeRect(x - w / 2, y - h, w, h); ctx.beginPath(); ctx.moveTo(x - w / 2, y - h); ctx.lineTo(x + w / 2, y); ctx.moveTo(x + w / 2, y - h); ctx.lineTo(x - w / 2, y); ctx.stroke(); },
      barrel: function (x, y, k) { var w = 50 * k, h = 58 * k; ctx.fillStyle = "#8a5a2c"; ctx.beginPath(); ctx.moveTo(x - w * 0.42, y); ctx.quadraticCurveTo(x - w * 0.62, y - h / 2, x - w * 0.42, y - h); ctx.lineTo(x + w * 0.42, y - h); ctx.quadraticCurveTo(x + w * 0.62, y - h / 2, x + w * 0.42, y); ctx.closePath(); ctx.fill(); [0.18, 0.5, 0.82].forEach(function (f) { rect(x - w * 0.55, y - h * f - 2 * k, w * 1.1, 5 * k, "#3a3a40"); }); ell(x, y - h, w * 0.42, 5 * k, "#b58a50"); },
      barricade: function (x, y, k) { var w = 92 * k; for (var i = 0; i < 3; i++) rect(x - w / 2, y - (14 + i * 11) * k, w, 8 * k, i % 2 ? "#8a6034" : "#a27040"); [-0.4, 0.4].forEach(function (f) { poly([x + f * w - 5 * k, y, x + f * w - 3 * k, y - 46 * k, x + f * w + 3 * k, y - 46 * k, x + f * w + 5 * k, y], "#5e4226"); }); line(x - w / 2, y - 6 * k, x + w / 2, y - 38 * k, "#4a3320", 4 * k); },
      bale: function (x, y, k) { var w = 76 * k, h = 46 * k; rect(x - w / 2, y - h, w, h, "#d6b64e"); rect(x - w / 2, y - h, w, 6 * k, "#e6ca70"); rect(x - w * 0.22, y - h, 4 * k, h, "#7a5a28"); rect(x + w * 0.18, y - h, 4 * k, h, "#7a5a28"); for (var i = 0; i < 6; i++) line(x - w / 2 + i * 13 * k, y - h + 8 * k, x - w / 2 + 8 * k + i * 13 * k, y - h + 22 * k, "#b8962e", 1.5 * k); },
      log: function (x, y, k) { var w = 94 * k, h = 38 * k; ctx.fillStyle = "#6e4a28"; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x - w / 2, y - h, w, h, 14 * k) : ctx.rect(x - w / 2, y - h, w, h); ctx.fill(); rect(x - w / 2 + 6 * k, y - h * 0.7, w - 12 * k, 3 * k, "#563a1e"); rect(x - w / 2 + 10 * k, y - h * 0.35, w - 30 * k, 3 * k, "#563a1e"); ell(x + w / 2 - 4 * k, y - h / 2, 9 * k, h / 2, "#c8a068"); ell(x + w / 2 - 4 * k, y - h / 2, 5 * k, h / 4, "#a47a44"); },
      laundry: function (x, y, k) { var w = 100 * k; rect(x - w / 2 - 4 * k, y - 112 * k, 7 * k, 112 * k, "#4a3320"); rect(x + w / 2 - 3 * k, y - 112 * k, 7 * k, 112 * k, "#4a3320"); ctx.strokeStyle = "#cbbf9f"; ctx.lineWidth = Math.max(1, 2 * k); ctx.beginPath(); ctx.moveTo(x - w / 2, y - 104 * k); ctx.quadraticCurveTo(x, y - 94 * k, x + w / 2, y - 104 * k); ctx.stroke(); var cl = ["#f2efe6", "#c8323c", "#3a5fc4", "#f2efe6"]; for (var i = 0; i < 4; i++) { var cx = x - w * 0.36 + i * w * 0.24; poly([cx - 9 * k, y - 100 * k, cx + 9 * k, y - 100 * k, cx + 11 * k, y - 66 * k, cx - 11 * k, y - 66 * k], cl[i]); } },
      beam: function (x, y, k) { var w = 100 * k; rect(x - w / 2, y - 100 * k, 9 * k, 100 * k, "#4a3320"); rect(x + w / 2 - 9 * k, y - 100 * k, 9 * k, 100 * k, "#4a3320"); for (var i = 0; i < 6; i++) rect(x - w / 2 - 4 * k + i * (w + 8 * k) / 6, y - 86 * k, (w + 8 * k) / 6, 20 * k, i % 2 ? "#e9e1cf" : "#b32632"); ctx.strokeStyle = "#2c1e10"; ctx.lineWidth = Math.max(1, 2 * k); ctx.strokeRect(x - w / 2 - 4 * k, y - 86 * k, w + 8 * k, 20 * k); },
      branch: function (x, y, k) { var w = 104 * k; rect(x - w / 2 - 6 * k, y - 120 * k, 12 * k, 120 * k, "#5a3e24"); rect(x + w / 2 - 6 * k, y - 120 * k, 12 * k, 120 * k, "#5a3e24"); line(x - w / 2, y - 80 * k, x + w / 2, y - 74 * k, "#6e4a28", 14 * k); for (var i = 0; i < 6; i++) { circ(x - w / 2 + 6 * k + i * w / 5.5, y - 66 * k + (i % 2) * 6 * k, 14 * k, i % 2 ? "#3d7a3a" : "#2f6a34"); } },
      cart: function (x, y, k) { var w = 96 * k, h = 96 * k; rect(x - w / 2, y - h * 0.55, w, h * 0.4, "#6a4423"); ctx.fillStyle = "#d9b95a"; ctx.beginPath(); ctx.ellipse(x, y - h * 0.62, w * 0.5, h * 0.42, 0, Math.PI, 0); ctx.fill(); rect(x - w / 2, y - h * 0.64, w, h * 0.1, "#c9a548"); circ(x - w * 0.34, y - h * 0.14, h * 0.16, "#3a2a18"); circ(x + w * 0.34, y - h * 0.14, h * 0.16, "#3a2a18"); circ(x - w * 0.34, y - h * 0.14, h * 0.07, "#8a6a38"); circ(x + w * 0.34, y - h * 0.14, h * 0.07, "#8a6a38"); },
      stall: function (x, y, k) { var w = 96 * k; rect(x - w / 2, y - 44 * k, w, 44 * k, "#8a5a2c"); rect(x - w / 2 + 6 * k, y - 38 * k, w - 12 * k, 8 * k, "#b98a4c"); circ(x - 22 * k, y - 50 * k, 7 * k, "#c8323c"); circ(x - 6 * k, y - 50 * k, 7 * k, "#e7b53b"); circ(x + 12 * k, y - 50 * k, 7 * k, "#5a9a3a"); circ(x + 28 * k, y - 50 * k, 7 * k, "#c8323c"); rect(x - w / 2, y - 98 * k, 5 * k, 56 * k, "#4a3320"); rect(x + w / 2 - 5 * k, y - 98 * k, 5 * k, 56 * k, "#4a3320"); for (var i = 0; i < 6; i++) poly([x - w / 2 - 4 * k + i * (w + 8 * k) / 6, y - 98 * k, x - w / 2 - 4 * k + (i + 1) * (w + 8 * k) / 6, y - 98 * k, x - w / 2 - 4 * k + (i + 1) * (w + 8 * k) / 6, y - 78 * k, x - w / 2 - 4 * k + i * (w + 8 * k) / 6, y - 78 * k], i % 2 ? "#efe9da" : "#3a5fc4"); },
      boulder: function (x, y, k) { var w = 90 * k, h = 70 * k; poly([x - w / 2, y, x - w * 0.46, y - h * 0.6, x - w * 0.2, y - h, x + w * 0.2, y - h * 0.96, x + w * 0.48, y - h * 0.5, x + w / 2, y], "#8d8f94"); poly([x - w * 0.2, y - h, x + w * 0.2, y - h * 0.96, x + w * 0.48, y - h * 0.5, x + w * 0.1, y - h * 0.55], "#a9abb0"); line(x - w * 0.2, y - h * 0.5, x + w * 0.1, y - h * 0.2, "#6a6c72", 2 * k); circ(x - w * 0.28, y - h * 0.16, 5 * k, "#4d7a3a"); },
      coach: function (x, y, k) { var w = 100 * k, h = 104 * k; rect(x - w / 2, y - h * 0.62, w, h * 0.44, "#22304f"); rect(x - w * 0.42, y - h * 0.96, w * 0.84, h * 0.36, "#2c3c60"); rect(x - w * 0.32, y - h * 0.86, w * 0.24, h * 0.2, "#d6e0ee"); rect(x + w * 0.08, y - h * 0.86, w * 0.24, h * 0.2, "#d6e0ee"); rect(x - w / 2, y - h * 0.62, w, 4 * k, "#d9b24a"); rect(x - w * 0.42, y - h * 0.98, w * 0.84, 4 * k, "#d9b24a"); circ(x - w * 0.36, y - h * 0.14, h * 0.17, "#2a1c10"); circ(x + w * 0.36, y - h * 0.14, h * 0.17, "#2a1c10"); circ(x - w * 0.36, y - h * 0.14, h * 0.08, "#d9b24a"); circ(x + w * 0.36, y - h * 0.14, h * 0.08, "#d9b24a"); }
    };
    function drawCoin(c) {
      var k = kOf(c.z), x = xOf(c.lane, c.z), y = yOf(c.z) - 26 * k;
      ctx.globalAlpha = fade(c.z);
      var sw = Math.abs(Math.cos(st.t * 4 + c.z)) * 0.7 + 0.3;
      ell(x, y, 11 * k * sw, 11 * k, "#e7b53b"); ell(x, y, 6 * k * sw, 6 * k, "#2f4fa8"); ell(x, y, 3 * k * sw, 3 * k, "#fff"); ell(x, y, 1.2 * k * sw, 1.2 * k, "#c8323c");
      ctx.globalAlpha = 1;
    }

    /* ---------- personnages ---------- */
    /* ---------- personnages volumétriques (dégradés, membres articulés, ombres douces) ---------- */
    function ball(x, y, r, c1, c2) { var g = ctx.createRadialGradient(x - r * 0.38, y - r * 0.42, r * 0.08, x, y, r * 1.05); g.addColorStop(0, c1); g.addColorStop(1, c2); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, Math.max(0.3, r), 0, 7); ctx.fill(); }
    function tube(x1, y1, x2, y2, w, c1, c2) {
      w = Math.max(1.2, w); ctx.lineCap = "round"; ctx.strokeStyle = c2; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.strokeStyle = c1; ctx.lineWidth = w * 0.52; ctx.beginPath(); ctx.moveTo(x1 - w * 0.17, y1); ctx.lineTo(x2 - w * 0.17, y2); ctx.stroke();
    }
    function shaded(pts, x0, x1, c1, c2) { var g = ctx.createLinearGradient(x0, 0, x1, 0); g.addColorStop(0, c1); g.addColorStop(1, c2); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(pts[0], pts[1]); for (var i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]); ctx.closePath(); ctx.fill(); }
    function softShadow(x, y, rx, ry) { var g = ctx.createRadialGradient(x, y, 1, x, y, rx); g.addColorStop(0, "rgba(0,0,0,0.42)"); g.addColorStop(1, "rgba(0,0,0,0)"); ctx.save(); ctx.translate(x, y); ctx.scale(1, ry / rx); ctx.translate(-x, -y); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, rx, 0, 7); ctx.fill(); ctx.restore(); }
    // jambes à deux segments (cuisse, mollet), bottes
    function legs(x, y, k, ph, c1, c2, s, c1l, c2l) {
      var cl = c1l || "#6a72b8", bl = c2l || "#4a3a2c";
      for (var i = 0; i < 2; i++) {
        var sg = i ? 1 : -1, a = Math.sin(ph + (i ? Math.PI : 0)) * s, hx = x + sg * 7 * k, lift = Math.max(0, -Math.cos(ph + (i ? Math.PI : 0))) * s;
        var kx = hx + a * 6 * k, ky = y - 19 * k - lift * 6 * k, fx = hx + a * 11 * k, fy = y - 3 * k - lift * 11 * k;
        tube(hx, y - 35 * k, kx, ky, 10 * k, cl, c1); tube(kx, ky, fx, fy, 8.5 * k, cl, c1);
        tube(fx, fy - 4 * k, fx + a * 1.5 * k, fy + 0.5 * k, 10.5 * k, "#5a4638", c2);
        ell(fx + a * 1.5 * k, fy + 3 * k, 7 * k, 3 * k, c2);
      }
    }
    function drawRunner(x, y, k, pose, e) {
      var jh = pose === "run" && st.jump > 0 ? 4 * st.jump * (1 - st.jump) * 80 * k : 0;
      var sl = pose === "run" && st.slide > 0 ? Math.sin(Math.min(1, st.slide) * Math.PI) : 0;
      var ph = st.step * 2.2, run = pose === "run";
      softShadow(x, y, (26 - jh * 0.08) * k, 7 * k);
      y -= jh;
      ctx.save();
      var sy = 1 - sl * 0.42 - (!run ? 0.38 * (e || 1) : 0);
      ctx.translate(x, y); ctx.scale(1, sy); ctx.translate(-x, -y);
      var lean = sl * 6 * k + (pose === "kneel" ? -3 * k : 0), sw = Math.sin(ph) * 11 * k;
      if (run) legs(x, y, k, ph, "#262c66", "#1c1410", st.jump > 0 ? 0.35 : 1, "#4a54a0");
      else { tube(x - 7 * k, y - 34 * k, x - 9 * k, y - 3 * k, 10 * k, "#4a54a0", "#262c66"); tube(x + 7 * k, y - 34 * k, x + 9 * k, y - 3 * k, 10 * k, "#4a54a0", "#262c66"); ell(x - 9 * k, y - 1 * k, 7 * k, 3 * k, "#1c1410"); ell(x + 9 * k, y - 1 * k, 7 * k, 3 * k, "#1c1410"); }
      // pans de la redingote (volent derrière)
      var fl = run ? Math.sin(ph * 1.2) * 4 * k : 0;
      shaded([x - 18 * k + lean, y - 40 * k, x + 18 * k + lean, y - 40 * k, x + 22 * k + fl, y - 18 * k, x + 4 * k + fl * 0.5, y - 12 * k, x - 4 * k - fl * 0.5, y - 14 * k, x - 22 * k - fl, y - 19 * k], x - 22 * k, x + 22 * k, "#3a58c0", "#1a2870");
      // torse
      shaded([x - 15 * k + lean, y - 72 * k, x + 15 * k + lean, y - 72 * k, x + 19 * k, y - 38 * k, x - 19 * k, y - 38 * k], x - 19 * k, x + 19 * k, "#5478e0", "#1f3484");
      ell(x + lean, y - 71 * k, 16 * k, 4.5 * k, "#6a8ae8");          // épaules (dessus)
      rect(x - 19 * k, y - 42 * k, 38 * k, 6 * k, "#b02a37");         // ceinture rouge
      line(x - 13 * k + lean, y - 69 * k, x + 15 * k, y - 38 * k, "#f4f0e4", 4.5 * k);
      line(x - 12 * k + lean, y - 69 * k, x + 15 * k, y - 38 * k, "rgba(0,0,0,0.12)", 1.2 * k);
      // bras
      if (run) {
        tube(x - 16 * k + lean, y - 68 * k, x - 21 * k, y - 54 * k + sw * 0.5, 8 * k, "#4a6ad0", "#1f3484"); tube(x - 21 * k, y - 54 * k + sw * 0.5, x - 19 * k, y - 42 * k + sw, 7 * k, "#4a6ad0", "#1f3484"); ball(x - 19 * k, y - 40 * k + sw, 4.2 * k, "#f0c8a0", "#c08a60");
        tube(x + 16 * k + lean, y - 68 * k, x + 21 * k, y - 54 * k - sw * 0.5, 8 * k, "#4a6ad0", "#1f3484"); tube(x + 21 * k, y - 54 * k - sw * 0.5, x + 19 * k, y - 42 * k - sw, 7 * k, "#4a6ad0", "#1f3484"); ball(x + 19 * k, y - 40 * k - sw, 4.2 * k, "#f0c8a0", "#c08a60");
      } else {
        tube(x - 16 * k, y - 68 * k, x - 24 * k, y - 84 * k, 8 * k, "#4a6ad0", "#1f3484"); tube(x - 24 * k, y - 84 * k, x - 26 * k, y - 100 * k, 7 * k, "#4a6ad0", "#1f3484"); ball(x - 26 * k, y - 102 * k, 4.6 * k, "#f0c8a0", "#c08a60");
        tube(x + 16 * k, y - 68 * k, x + 24 * k, y - 84 * k, 8 * k, "#4a6ad0", "#1f3484"); tube(x + 24 * k, y - 84 * k, x + 26 * k, y - 100 * k, 7 * k, "#4a6ad0", "#1f3484"); ball(x + 26 * k, y - 102 * k, 4.6 * k, "#f0c8a0", "#c08a60");
      }
      // cou, tête (vue de dos : cheveux), bonnet phrygien
      tube(x + lean, y - 74 * k, x + lean, y - 78 * k, 8 * k, "#f0c8a0", "#c08a60");
      ball(x + lean, y - 83 * k, 11 * k, "#6a4a30", "#2a1a10");
      ell(x - 10.5 * k + lean, y - 82 * k, 2.2 * k, 3.4 * k, "#d8a880"); ell(x + 10.5 * k + lean, y - 82 * k, 2.2 * k, 3.4 * k, "#b88a60");
      if (run) {
        var tw = Math.sin(ph) * 3 * k;
        shaded([x - 11.5 * k + lean, y - 88 * k, x + 11.5 * k + lean, y - 88 * k, x + 9 * k + lean, y - 100 * k, x + 18 * k + lean, y - 106 * k + tw, x + 24 * k + lean, y - 99 * k + tw, x + 14 * k + lean, y - 110 * k + tw * 0.5, x - 6 * k + lean, y - 108 * k], x - 12 * k, x + 24 * k, "#e04a56", "#962030");
        shaded([x - 12.5 * k + lean, y - 91 * k, x + 12.5 * k + lean, y - 91 * k, x + 12 * k + lean, y - 86 * k, x - 12 * k + lean, y - 86 * k], x - 12 * k, x + 12 * k, "#c42c3a", "#7a1824");
      }
      ctx.restore();
    }
    function drawGuardBack(x, y, k, ph, aim) {
      softShadow(x, y, 27 * k, 7 * k);
      legs(x, y, k, ph, "#a8a294", "#16141a", aim ? 0.2 : 1, "#efe9da");
      var br = Math.sin(ph * 2) * 1.2 * k;
      // sac et buffleteries (volume du dos)
      shaded([x - 18 * k, y - 72 * k, x + 18 * k, y - 72 * k, x + 22 * k, y - 36 * k, x - 22 * k, y - 36 * k], x - 22 * k, x + 22 * k, "#e04450", "#7a1220");
      shaded([x - 22 * k, y - 36 * k, x + 22 * k, y - 36 * k, x + 25 * k, y - 22 * k + br, x - 25 * k, y - 22 * k + br], x - 25 * k, x + 25 * k, "#d03a46", "#6a1020");
      shaded([x - 10 * k, y - 64 * k, x + 10 * k, y - 64 * k, x + 9 * k, y - 42 * k, x - 9 * k, y - 42 * k], x - 10 * k, x + 9 * k, "#7a5a3a", "#3a281a");
      line(x - 16 * k, y - 70 * k, x + 17 * k, y - 38 * k, "#f4f0e4", 4 * k); line(x + 16 * k, y - 70 * k, x - 17 * k, y - 38 * k, "#e0dccf", 3.4 * k);
      ell(x, y - 71 * k, 18 * k, 4.8 * k, "#ec5662");
      rect(x - 22 * k, y - 38 * k, 44 * k, 4 * k, "#2a2420");
      tube(x - 17 * k, y - 68 * k, x - 24 * k, y - 50 * k, 8.5 * k, "#d8404c", "#7a1220");
      ball(x - 24 * k, y - 47 * k, 4 * k, "#f0c8a0", "#c08a60");
      tube(x, y - 73 * k, x, y - 77 * k, 8 * k, "#f0c8a0", "#c08a60");
      ball(x, y - 83 * k, 10.5 * k, "#f0c8a0", "#c08a60");
      ball(x, y - 81 * k, 10.5 * k, "#d8d0c0", "#8a8478");  // perruque poudrée vue de dos
      ell(x, y - 74 * k, 4 * k, 6 * k, "#2a2430");           // catogan
      // bicorne
      shaded([x - 20 * k, y - 90 * k, x - 3 * k, y - 102 * k, x + 3 * k, y - 102 * k, x + 20 * k, y - 90 * k, x + 13 * k, y - 85 * k, x - 13 * k, y - 85 * k], x - 20 * k, x + 20 * k, "#3a3646", "#14121c");
      poly([x - 20 * k, y - 90 * k, x - 3 * k, y - 102 * k, x - 3 * k, y - 100 * k, x - 18 * k, y - 89 * k], "#e8e0c8"); poly([x + 20 * k, y - 90 * k, x + 3 * k, y - 102 * k, x + 3 * k, y - 100 * k, x + 18 * k, y - 89 * k], "#e8e0c8");
      circ(x, y - 96 * k, 2.6 * k, "#f4f0e4");
      // mousquet
      if (aim) { tube(x + 20 * k, y - 56 * k, x + 8 * k * aim, y - 98 * k, 5 * k, "#8a6440", "#4a3320"); tube(x + 8 * k * aim, y - 98 * k, x + 5 * k * aim, y - 118 * k, 3 * k, "#e4eaf0", "#8a95a0"); }
      else { tube(x + 24 * k, y - 42 * k, x + 26 * k, y - 108 * k, 5 * k, "#8a6440", "#4a3320"); tube(x + 26 * k, y - 108 * k, x + 26 * k, y - 128 * k, 3 * k, "#e4eaf0", "#8a95a0"); tube(x + 24 * k, y - 66 * k, x + 21 * k, y - 62 * k, 8 * k, "#d8404c", "#7a1220"); }
    }
    function drawOfficer(x, y, k, tt) { // vu de face
      softShadow(x, y, 28 * k, 7 * k);
      tube(x - 7 * k, y - 34 * k, x - 8 * k, y - 4 * k, 11 * k, "#fffaf0", "#b8b2a2"); tube(x + 7 * k, y - 34 * k, x + 8 * k, y - 4 * k, 11 * k, "#fffaf0", "#b8b2a2");
      tube(x - 8 * k, y - 11 * k, x - 8 * k, y - 3 * k, 12 * k, "#4a4650", "#16141a"); tube(x + 8 * k, y - 11 * k, x + 8 * k, y - 3 * k, 12 * k, "#4a4650", "#16141a");
      shaded([x - 18 * k, y - 72 * k, x + 18 * k, y - 72 * k, x + 23 * k, y - 28 * k, x - 23 * k, y - 28 * k], x - 23 * k, x + 23 * k, "#d8404c", "#6a1020");
      shaded([x - 6 * k, y - 72 * k, x + 6 * k, y - 72 * k, x + 4 * k, y - 34 * k, x - 4 * k, y - 34 * k], x - 6 * k, x + 6 * k, "#fffaf0", "#cfc9b8");
      ell(x, y - 71 * k, 19 * k, 4.8 * k, "#ec5662"); rect(x - 23 * k, y - 38 * k, 46 * k, 5 * k, "#d9b24a");
      for (var i = 0; i < 4; i++) ball(x, y - 66 * k + i * 8 * k, 2 * k, "#ffe38a", "#b8902a");
      ell(x - 20 * k, y - 71 * k, 6 * k, 3 * k, "#e8c456"); ell(x + 20 * k, y - 71 * k, 6 * k, 3 * k, "#e8c456");
      tube(x - 19 * k, y - 68 * k, x - 27 * k, y - 46 * k, 8.5 * k, "#d8404c", "#6a1020"); ball(x - 27 * k, y - 43 * k, 4 * k, "#f0c8a0", "#c08a60");
      var up = Math.min(1, tt * 1.5);
      tube(x + 19 * k, y - 68 * k, x + 28 * k, y - (60 + 34 * up) * k, 8.5 * k, "#d8404c", "#6a1020"); ball(x + 28 * k, y - (62 + 34 * up) * k, 4 * k, "#f0c8a0", "#c08a60");
      tube(x + 28 * k, y - (60 + 34 * up) * k, x + 28 * k, y - (100 + 20 * up) * k, 3 * k, "#f2f6fa", "#8a95a0");
      tube(x, y - 74 * k, x, y - 78 * k, 8 * k, "#f0c8a0", "#c08a60");
      ball(x, y - 84 * k, 11.5 * k, "#f6d2ac", "#c08a60");
      circ(x - 4 * k, y - 85 * k, 1.5 * k, "#2a2a2a"); circ(x + 4 * k, y - 85 * k, 1.5 * k, "#2a2a2a"); line(x - 4.5 * k, y - 88.5 * k, x - 1.5 * k, y - 88 * k, "#3a2a20", 1.2 * k); line(x + 4.5 * k, y - 88.5 * k, x + 1.5 * k, y - 88 * k, "#3a2a20", 1.2 * k); line(x - 4 * k, y - 77.5 * k, x + 4 * k, y - 77.5 * k, "#8a3a2a", 1.5 * k);
      shaded([x - 22 * k, y - 91 * k, x, y - 106 * k, x + 22 * k, y - 91 * k, x + 15 * k, y - 87 * k, x - 15 * k, y - 87 * k], x - 22 * k, x + 22 * k, "#3a3646", "#14121c");
      poly([x - 22 * k, y - 91 * k, x, y - 106 * k, x, y - 103 * k, x - 19 * k, y - 90 * k], "#d9b24a"); poly([x + 22 * k, y - 91 * k, x, y - 106 * k, x, y - 103 * k, x + 19 * k, y - 90 * k], "#d9b24a");
      tube(x - 12 * k, y - 99 * k, x - 21 * k, y - 116 * k, 3.4 * k, "#ffffff", "#c8c8d0");
    }

    /* ---------- HUD ---------- */
    function hud() {
      ctx.textAlign = "center";
      ctx.lineJoin = "round"; var sc = String(st.over ? st.finalScore : score());
      ctx.font = "900 58px Georgia, serif"; ctx.lineWidth = 9; ctx.strokeStyle = "#1c0f14"; ctx.strokeText(sc, W / 2, 62); ctx.fillStyle = "#fffaf0"; ctx.fillText(sc, W / 2, 62);
      ctx.font = "700 12px Georgia, serif"; ctx.lineWidth = 4; var sub = Math.floor(st.dist) + " m  ·  " + st.coins + " ●"; ctx.strokeText(sub, W / 2, 82); ctx.fillStyle = "#f4e6c0"; ctx.fillText(sub, W / 2, 82);
      var gx = W - 24, gh = 120, gy0 = 24;
      ctx.fillStyle = "rgba(20,10,14,0.55)"; ctx.fillRect(gx - 8, gy0 - 6, 16, gh + 12);
      var g = st.warn > 0 ? st.warn / 8 : 0;
      ctx.fillStyle = g > 0.55 ? "#e24a4a" : "#d9a548"; ctx.fillRect(gx - 5, gy0 + gh - gh * g, 10, gh * g);
      ctx.strokeStyle = "#e7d7b0"; ctx.lineWidth = 1; ctx.strokeRect(gx - 5, gy0, 10, gh);
      ctx.fillStyle = "#e7d7b0"; ctx.font = "9px Georgia, serif"; ctx.fillText(FR ? "GARDE" : "GUARD", gx, gy0 + gh + 18);
      if (st.banner) {
        var b = st.banner, a = Math.min(1, b.t * 3, (2.8 - b.t) * 3);
        ctx.globalAlpha = Math.max(0, a);
        ctx.fillStyle = "rgba(30,12,16,0.7)"; ctx.fillRect(0, 96, W, 52);
        ctx.fillStyle = "#ffd98a"; ctx.font = "700 22px Georgia, serif"; ctx.fillText(FR ? b.s[0] : b.s[1], W / 2, 128);
        ctx.font = "italic 12px Georgia, serif"; ctx.fillStyle = "#f1e6cf"; ctx.fillText(Math.floor(st.dist) + " m", W / 2, 143);
        ctx.globalAlpha = 1;
      }
      if (st.warm < 1 && !st.over && st.t < 3) {
        ctx.fillStyle = "rgba(20,10,14,0.55)"; ctx.fillRect(0, H * 0.6, W, 74);
        ctx.fillStyle = "#ffe9a8"; ctx.font = "700 18px Georgia, serif"; ctx.fillText(FR ? "Fuis, citoyen !" : "Run, citizen!", W / 2, H * 0.6 + 28);
        ctx.font = "13px Georgia, serif"; ctx.fillStyle = "#f1e6cf";
        ctx.fillText(FR ? "← → voies · ↑ sauter · ↓ se baisser" : "← → lanes · ↑ jump · ↓ slide", W / 2, H * 0.6 + 52);
      }
      ctx.textAlign = "left";
    }

    /* ---------- dessin ---------- */
    function cineGuardPos(i, ct) { // positions (lane, z) des gardes pendant l'arrestation
      var starts = [[-1, 1.5], [0, 1.5], [1, 1.5]];
      var ends = [[st.px - 0.62, PD - 0.35], [st.px + 0.62, PD - 0.35], [st.px, PD - 1.2]];
      var e = Math.max(0, Math.min(1, (ct - 0.2 - i * 0.12) / 1.0)); e = e * e * (3 - 2 * e);
      return [starts[i][0] + (ends[i][0] - starts[i][0]) * e, starts[i][1] + (ends[i][1] - starts[i][1]) * e, e];
    }
    function draw() {
      ctx.save();
      if (st.shake > 0) ctx.translate((Math.random() - 0.5) * 8 * st.shake, (Math.random() - 0.5) * 8 * st.shake);
      drawSky(); drawGround();
      var items = [], ct = st.ct, tt = st.t;
      st.scn.forEach(function (o) { items.push({ z: o.z, f: function () { drawScn(o); } }); });
      st.ppl.forEach(function (p) { items.push({ z: p.z, f: function () { var k = kOf(p.z), xo = (1.5 * LW + 16 + p.off * LW * 2) * k, px = p.side < 0 ? W / 2 - xo : W / 2 + xo; ctx.globalAlpha = fade(p.z); drawPerson(p, px, yOf(p.z), k, tt); ctx.globalAlpha = 1; } }); });
      st.obs.forEach(function (o) { if (o.hit) return; items.push({ z: o.z, f: function () { ctx.globalAlpha = fade(o.z); OBS[o.type](xOf(o.lane, o.z), yOf(o.z), kOf(o.z)); ctx.globalAlpha = 1; } }); });
      st.coinsL.forEach(function (c) { items.push({ z: c.z, f: function () { drawCoin(c); } }); });
      if (!st.over) {
        var gz = 0.5 + 1.3 * (1 - Math.min(1, st.guard));
        [-1, 0, 1].forEach(function (l, i) { items.push({ z: gz + i * 0.01, f: function () { drawGuardBack(xOf(l, gz), yOf(gz), kOf(gz) * 0.98, st.step * 2.2 + i * 1.4, 0); } }); });
        items.push({ z: PD, f: function () { drawRunner(xOf(st.px, PD), yOf(PD), kOf(PD), "run"); } });
      } else {
        var fall = Math.min(1, ct / 0.5);
        items.push({ z: PD, f: function () { drawRunner(xOf(st.px, PD), yOf(PD) + fall * 6, kOf(PD), ct < 1.9 ? "kneel" : "captive", ct < 0.5 ? fall : 1); if (ct > 0.25) { var cx = xOf(st.px, PD) + 24 * kOf(PD), cy = yOf(PD) - 4 * kOf(PD); circ(cx, cy, 5, "#fff"); circ(cx, cy, 3, "#2f4fa8"); circ(cx, cy, 1.4, "#c8323c"); } } });
        for (var gi = 0; gi < 3; gi++) (function (i) { var p = cineGuardPos(i, ct); items.push({ z: p[1], f: function () { drawGuardBack(xOf(p[0], p[1]), yOf(p[1]), kOf(p[1]) * 0.98, ct * 8 + i, p[2] > 0.9 ? (i === 0 ? 1 : -1) : 0); } }); })(gi);
        var oz = PD + 1.5, oe = Math.max(0, Math.min(1, (ct - 0.6) / 0.8));
        items.push({ z: oz, f: function () { ctx.globalAlpha = oe; drawOfficer(xOf(st.px * 0.5, oz), yOf(oz) + (1 - oe) * 8, kOf(oz), Math.max(0, ct - 1.2)); ctx.globalAlpha = 1; } });
      }
      items.sort(function (a, b) { return b.z - a.z; });
      items.forEach(function (it) { it.f(); });
      st.parts.forEach(function (p) { ctx.globalAlpha = Math.max(0, p.life); ctx.fillStyle = p.c; ctx.fillRect(p.x, p.y, p.s, p.s); });
      ctx.globalAlpha = 1;
      ctx.restore();
      if (!st.over && st.guard > 0.4) { var a = (st.guard - 0.4) * 0.9 + Math.sin(st.t * 10) * 0.05; var g = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.75); g.addColorStop(0, "rgba(200,30,40,0)"); g.addColorStop(1, "rgba(200,30,40," + Math.max(0, a) + ")"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
      drawWx();
      hud();
      if (st.over) {
        // cinématique : bandes noires et légendes
        var bar = Math.min(1, ct / 0.6) * 54;
        ctx.fillStyle = "#0d0810"; ctx.fillRect(0, 0, W, bar * 0.4); ctx.fillRect(0, H - bar, W, bar);
        ctx.textAlign = "center";
        if (ct > 0.8 && ct < 2.3) { ctx.font = "700 20px Georgia, serif"; ctx.fillStyle = "#ffd98a"; ctx.globalAlpha = Math.min(1, (ct - 0.8) * 4); ctx.fillText(FR ? "« Halte-là, scélérat ! »" : "“Halt, villain!”", W / 2, H - 22); ctx.globalAlpha = 1; }
        else if (ct >= 2.3) { ctx.font = "700 17px Georgia, serif"; ctx.fillStyle = "#ffd98a"; ctx.globalAlpha = Math.min(1, (ct - 2.3) * 3); ctx.fillText(FR ? "« Au nom du Roi, vous êtes arrêté ! »" : "“In the King's name, you are under arrest!”", W / 2, H - 22); ctx.globalAlpha = 1; }
        ctx.textAlign = "left";
        if (ct > 4.4) { ctx.fillStyle = "rgba(13,8,16," + Math.min(1, (ct - 4.4) / 0.9) + ")"; ctx.fillRect(0, 0, W, H); }
      }
      if (st.flash > 0) { ctx.fillStyle = "rgba(255,255,255," + Math.max(0, st.flash * 0.45) + ")"; ctx.fillRect(0, 0, W, H); }
    }

    function loop(ts) {
      if (dead) return;
      var raw = (ts - (last || ts)), dt = Math.min(0.05, raw / 1000); last = ts;
      if (raw > 0 && raw < 250) { ema += (raw - ema) * 0.05; if (ema > 30 && dpr > 1) { slow++; if (slow > 90) { slow = 0; ema = 16; setDpr(dpr > 1.5 ? 1.5 : 1); } } else slow = 0; }
      acc += dt; while (acc >= STEP) { update(STEP); acc -= STEP; }
      draw();
      raf = requestAnimationFrame(loop);
    }

    /* ---------- commandes ---------- */
    var sx = 0, sy = 0, sid = null, done = false;
    function onDown(e) { e.preventDefault(); sx = e.clientX; sy = e.clientY; sid = e.pointerId; done = false; }
    function onMove(e) {
      if (sid !== e.pointerId || done) return;
      var dx = e.clientX - sx, dy = e.clientY - sy;
      if (Math.abs(dx) < 22 && Math.abs(dy) < 22) return;
      done = true;
      if (Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? 1 : -1); else if (dy < 0) jump(); else slide();
    }
    function onUp(e) { if (sid === e.pointerId && !done) { var dx = e.clientX - sx, dy = e.clientY - sy; if (Math.abs(dx) < 10 && Math.abs(dy) < 10) { var r = canvas.getBoundingClientRect(); move(e.clientX < r.left + r.width / 2 ? -1 : 1); } } sid = null; }
    function onKey(e) {
      var c = e.code;
      if (c === "ArrowLeft" || c === "KeyA") { e.preventDefault(); move(-1); }
      else if (c === "ArrowRight" || c === "KeyD") { e.preventDefault(); move(1); }
      else if (c === "ArrowUp" || c === "KeyW" || c === "Space") { e.preventDefault(); jump(); }
      else if (c === "ArrowDown" || c === "KeyS") { e.preventDefault(); slide(); }
    }
    canvas.style.touchAction = "none";
    canvas.addEventListener("pointerdown", onDown); canvas.addEventListener("pointermove", onMove); canvas.addEventListener("pointerup", onUp); canvas.addEventListener("pointercancel", onUp);
    window.addEventListener("keydown", onKey);
    reset(); draw();
    return {
      start: function () { reset(); last = 0; acc = 0; cancelAnimationFrame(raf); raf = requestAnimationFrame(loop); },
      destroy: function () { dead = true; cancelAnimationFrame(raf); canvas.removeEventListener("pointerdown", onDown); canvas.removeEventListener("pointermove", onMove); canvas.removeEventListener("pointerup", onUp); canvas.removeEventListener("pointercancel", onUp); window.removeEventListener("keydown", onKey); },
      _state: function () { return st; }, _step: function (n) { for (var i = 0; i < n; i++) update(STEP); },
      _move: move, _jump: jump, _slide: slide, _draw: draw
    };
  }
  window.HistoriaRun = { create: create, _speed: speedAt, _EV: EV };
})();
