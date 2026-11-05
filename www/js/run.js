/* Historia — « La Fuite » : un révolutionnaire échappe à la garde royale à travers Paris, les villages, les forêts et la campagne.
   Course sans fin façon Temple Run : 3 voies. Glisser gauche/droite (voie), haut (sauter), bas (se baisser).
   Décor d'Ancien Régime : pavés puis chemins de terre, églises, moulins, forêts, villageois qui regardent. Aucun rail. */
(function () {
  var W = 360, H = 640, HY = 240, F = 7, PD = 4.5, LW = 112, STEP = 1 / 60, FAR = 62, BLEN = 400;
  var BIO = [
    { fr: "Faubourg Saint-Antoine", en: "Faubourg Saint-Antoine", ground: ["#7a6a64", "#5e4c48"], road: ["#8d7f78", "#6f625c"], cob: 1 },
    { fr: "Le village et son église", en: "The village and its church", ground: ["#7c9a4e", "#5f7f3c"], road: ["#b0946a", "#8f7650"], cob: 0 },
    { fr: "La grande forêt", en: "The great forest", ground: ["#486f3e", "#33552f"], road: ["#8e7350", "#6f583c"], cob: 0 },
    { fr: "Les champs et le moulin", en: "The fields and the windmill", ground: ["#b3b45a", "#8fa044"], road: ["#bb9d68", "#9a7e50"], cob: 0 }
  ];
  var SKY = [[0, "#2a2350", "#f6a86b"], [0.2, "#6fa8e0", "#f4e7c4"], [0.5, "#78b6ea", "#f1efd8"], [0.74, "#5a4a8c", "#f39a5c"], [0.9, "#1f1c48", "#8a4e72"], [1, "#2a2350", "#f6a86b"]];
  function rngOf(seed) { var a = seed >>> 0; return function () { a = (a + 0x6D2B79F5) >>> 0; var t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function speedAt(t) { return 10 + 10 * (1 - Math.exp(-t / 45)) + Math.min(t, 300) * 0.035; }
  function rowTime(t) { return Math.max(0.6, 1.35 - t * 0.0085); }
  function bioAt(d) { return Math.floor(Math.max(0, d) / BLEN) % 4; }
  function bioMix(d) { var p = ((d % BLEN) + BLEN) % BLEN, b = bioAt(d); return p > BLEN - 40 ? { a: b, b: (b + 1) % 4, t: (p - (BLEN - 40)) / 40 } : { a: b, b: b, t: 0 }; }
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
      st = { t: 0, dist: 0, coins: 0, lane: 0, px: 0, jump: 0, slide: 0, over: false, ct: 0, done: false, guard: 0, stumble: 0, imm: 0,
        obs: [], coinsL: [], scn: [], ppl: [], parts: [], nextRow: 0, lastFree: 0, banner: null, bio: 0, scroll: 0, step: 0, shake: 0, flash: 0, rowN: 0, warm: 0, bz: 0, pz: 0, ctp: null };
      for (var z = 4; z < FAR + 12; z += 5.5) { st.bz = z; spawnChunk(z); }
      st.bz = FAR + 10 + 5.5;
      addRow(30);
    }

    /* ---------- décor ---------- */
    function spawnChunk(z) {
      var d = st.dist + z * 1.4, b = bioAt(d), side;
      for (var si = 0; si < 2; si++) {
        side = si ? 1 : -1;
        var zz = z + si * 2.2, r = rnd(), v = rnd();
        if (b === 0) {
          if (rnd() < 0.1 && d > 150) st.scn.push({ z: zz, side: side, off: 0.1, type: "church", v: v });
          else if (r < 0.2) st.scn.push({ z: zz, side: side, off: 0.05, type: "lamp", v: v }, { z: zz + 2.5, side: side, off: 0.1, type: "house", v: v, h: 120 + rnd() * 120, w: 120 + rnd() * 30, kind: "stone" });
          else st.scn.push({ z: zz, side: side, off: 0.1, type: "house", v: v, h: 130 + rnd() * 130, w: 120 + rnd() * 30, kind: "stone" });
        } else if (b === 1) {
          if (r < 0.14) st.scn.push({ z: zz, side: side, off: 0.15, type: "church", v: v });
          else if (r < 0.22) st.scn.push({ z: zz, side: side, off: 0.1, type: "well", v: v });
          else if (r < 0.34) st.scn.push({ z: zz, side: side, off: 0.15, type: "tree", v: v }, { z: zz + 2.5, side: side, off: 0.6, type: "house", v: v, h: 90 + rnd() * 50, w: 120, kind: "timber" });
          else st.scn.push({ z: zz, side: side, off: 0.1, type: "house", v: v, h: 90 + rnd() * 70, w: 115 + rnd() * 30, kind: "timber" });
        } else if (b === 2) {
          st.scn.push({ z: zz, side: side, off: 0.05 + rnd() * 0.25, type: rnd() < 0.55 ? "pine" : "tree", v: v }, { z: zz + 1.4, side: side, off: 0.9 + rnd() * 0.6, type: rnd() < 0.5 ? "pine" : "tree", v: rnd() });
        } else {
          if (r < 0.1 && ((d / BLEN) % 4 | 0) !== 99) st.scn.push({ z: zz, side: side, off: 0.5, type: "mill", v: v });
          else if (r < 0.22) st.scn.push({ z: zz, side: side, off: 0.2, type: "farm", v: v });
          else if (r < 0.4) st.scn.push({ z: zz, side: side, off: 0.15, type: "haystack", v: v }, { z: zz + 2.6, side: side, off: 0.1, type: "fence", v: v });
          else if (r < 0.5) st.scn.push({ z: zz, side: side, off: 0.2, type: "tree", v: v });
          else st.scn.push({ z: zz, side: side, off: 0.05, type: "fence", v: v }, { z: zz + 2.7, side: side, off: 0.05, type: "fence", v: v });
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
      var diff = Math.min(1, st.t / 90), b = bioAt(st.dist + z * 1.4), pool = POOL[b];
      var pick = function (a) { return a[Math.floor(rnd() * a.length)]; };
      var rt = rowTime(st.t), r = rnd();
      var kind = n > 2 && r < 0.12 + diff * 0.08 ? "alllow" : n > 4 && r < 0.22 + diff * 0.1 ? "allhigh" : "lanes";
      if (kind === "alllow") { var tl = pick(pool.low); for (var l = -1; l <= 1; l++) st.obs.push({ type: tl, cat: "low", lane: l, z: z, hit: false }); }
      else if (kind === "allhigh") { var th = pick(pool.high); for (var l2 = -1; l2 <= 1; l2++) st.obs.push({ type: th, cat: "high", lane: l2, z: z, hit: false }); }
      else {
        var shift = rnd() < 0.5 ? 0 : (rnd() < 0.5 ? -1 : 1);
        if (rt >= 0.8 && rnd() < 0.3 + diff * 0.2) shift = st.lastFree === 0 ? (rnd() < 0.5 ? -2 : 2) : -2 * st.lastFree;
        var free = Math.max(-1, Math.min(1, st.lastFree + shift));
        st.lastFree = free;
        for (var ln = -1; ln <= 1; ln++) {
          if (ln === free) { if (rnd() < 0.6) { var cn = 3 + Math.floor(rnd() * 3); for (var ci = 0; ci < cn; ci++) st.coinsL.push({ lane: ln, z: z - 3 + ci * 1.8, got: false }); } continue; }
          if (n < 4 && rnd() < 0.5) continue;
          var q = rnd(), cat = q < 0.38 ? "low" : q < 0.68 ? "block" : "high";
          st.obs.push({ type: pick(pool[cat]), cat: cat, lane: ln, z: z, hit: false });
        }
      }
      st.nextRow = Math.max(0.5, z + speedAt(st.t) * rt - (FAR + 4));
    }

    /* ---------- actions ---------- */
    function move(d) {
      if (st.over) return;
      var nl = Math.max(-1, Math.min(1, st.lane + d));
      if (nl !== st.lane) { st.lane = nl; if (opt.sfx) opt.sfx("tap"); }
    }
    function jump() { if (st.over || st.jump > 0) return; st.slide = 0; st.jump = 0.0001; if (opt.sfx) opt.sfx("tap"); }
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
      if (st.jump > 0) { st.jump += dt / 0.72; if (st.jump >= 1 || st.vdrop) { st.jump = 0; st.vdrop = false; } }
      if (st.slide > 0) { st.slide += dt / 0.62; if (st.slide >= 1) st.slide = 0; }
      st.guard = Math.max(0, st.guard - dt * 0.05);
      var b = bioAt(st.dist);
      if (b !== st.bio || (st.bio === 0 && st.banner === null && st.dist > 5 && st.dist < 6 && false)) { st.bio = b; if (st.dist > 20) { st.banner = { t: 0, s: [BIO[b].fr, BIO[b].en] }; if (opt.sfx) opt.sfx("good"); } }
      [st.obs, st.coinsL, st.scn, st.ppl].forEach(function (a) { a.forEach(function (o) { o.z -= v * dt; }); });
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
        if (o.hit || Math.abs(o.z - PD) > 0.55 || Math.abs(o.lane - st.px) > 0.55) return;
        var safe = false;
        if (o.cat === "low") safe = py > 36;
        else if (o.cat === "high") safe = st.slide > 0;
        if (safe) return;
        o.hit = true;
        if (st.imm > 0 && o.cat !== "block") return;
        st.guard += o.cat === "block" ? 0.7 : 0.6;
        st.stumble = 0.9; st.shake = 0.3; st.flash = 0.5; st.imm = 0.5;
        burst(xOf(o.lane, o.z), yOf(o.z) - 30, "#a87a3c", 14);
        if (opt.buzz) opt.buzz(25);
        if (opt.sfx) opt.sfx("bad");
        if (st.guard >= 1) caught();
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
      return { top: mix(a[1], b[1], t), bot: mix(a[2], b[2], t), u: u };
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
    }

    /* ---------- sol, chaussée ---------- */
    function drawGround() {
      var m0 = bioMix(st.dist + FAR * 1.4); ctx.fillStyle = mix(BIO[m0.a].ground[0], BIO[m0.b].ground[0], m0.t); ctx.fillRect(0, HY, W, H - HY);
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
        ctx.fillStyle = gcol; ctx.fillRect(0, ya, W, yb - ya);
        var rcol = mix(mix(A.road[0], A.road[1], alt * 0.25), mix(B.road[0], B.road[1], alt * 0.25), t);
        var xa = W / 2 - 1.5 * LW * kOf(zA), xb = W / 2 - 1.5 * LW * kOf(zB);
        ctx.fillStyle = rcol; ctx.beginPath(); ctx.moveTo(xa, ya); ctx.lineTo(W - xa, ya); ctx.lineTo(W - xb, yb); ctx.lineTo(xb, yb); ctx.closePath(); ctx.fill();
        var cob = A.cob * (1 - t) + B.cob * t;
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

    /* ---------- bâtiments et décor ---------- */
    var WALLS = [["#cdb890", "#a79068"], ["#bfae92", "#94836a"], ["#d1b394", "#9d7e60"], ["#bdb6a4", "#8d8878"], ["#c9bfa0", "#a09676"]];
    var ROOFS = ["#5b4a52", "#4a4458", "#7a4a3a", "#4f5560", "#6a4a3e"];
    function drawHouse(it, x, y, k) {
      var w = it.w * k, h = it.h * k, xo = (1.5 * LW + 10 + it.off * LW) * k;
      var bx = it.side < 0 ? W / 2 - xo - w : W / 2 + xo;
      var col = WALLS[Math.floor(it.v * 5)], timber = it.kind === "timber";
      rect(bx, y - h, w, h, col[0]);
      rect(it.side < 0 ? bx + w - 7 * k : bx, y - h, 7 * k, h, col[1]);
      if (timber) { ctx.strokeStyle = "#4e3820"; ctx.lineWidth = Math.max(1, 3 * k); ctx.strokeRect(bx, y - h, w, h); line(bx, y - h * 0.55, bx + w, y - h * 0.55, "#4e3820", 3 * k); line(bx + w * 0.5, y - h, bx + w * 0.5, y, "#4e3820", 3 * k); line(bx, y - h, bx + w * 0.5, y - h * 0.55, "#4e3820", 2.5 * k); line(bx + w, y - h, bx + w * 0.5, y - h * 0.55, "#4e3820", 2.5 * k); }
      var rc = timber ? "#a8873a" : ROOFS[Math.floor(it.v * 5)];
      poly([bx - 5 * k, y - h, bx + w / 2, y - h - 38 * k, bx + w + 5 * k, y - h], rc);
      rect(bx + w * 0.7, y - h - 34 * k, 10 * k, 24 * k, "#7a6a60");
      var rows = Math.max(1, Math.floor(it.h / 52));
      for (var r = 0; r < rows; r++) for (var c = 0; c < 2; c++) {
        var wx = bx + (14 + c * (w / k - 44)) * k, wy = y - h + (14 + r * 46) * k;
        rect(wx, wy, 20 * k, 28 * k, ((r + c + Math.floor(it.v * 9)) % 3 === 0) ? "#f3d98a" : "#40364f");
        rect(wx - 5 * k, wy, 5 * k, 28 * k, "#4e6a58"); rect(wx + 20 * k, wy, 5 * k, 28 * k, "#4e6a58");
      }
      rect(bx + w / 2 - 9 * k, y - 38 * k, 18 * k, 38 * k, "#4a3320");
    }
    function drawChurch(it, x, y, k) {
      var xo = (1.5 * LW + 8 + it.off * LW) * k, nw = 150 * k, nh = 108 * k, tw = 58 * k, th = 230 * k;
      var bx = it.side < 0 ? W / 2 - xo - nw - tw * 0.4 : W / 2 + xo;
      var tx = it.side < 0 ? bx + nw - tw * 0.2 : bx - tw * 0.8 + 0.0;
      if (it.side > 0) tx = bx;
      var nx = it.side < 0 ? bx : bx + tw;
      rect(nx, y - nh, nw, nh, "#cfc7b2"); poly([nx - 4 * k, y - nh, nx + nw / 2, y - nh - 40 * k, nx + nw + 4 * k, y - nh], "#6a5a58");
      for (var i = 0; i < 3; i++) { rect(nx + (16 + i * 44) * k, y - nh + 30 * k, 14 * k, 36 * k, "#3a4a7a"); poly([nx + (16 + i * 44) * k, y - nh + 30 * k, nx + (23 + i * 44) * k, y - nh + 20 * k, nx + (30 + i * 44) * k, y - nh + 30 * k], "#3a4a7a"); }
      rect(tx, y - th, tw, th, "#d8d0bb"); rect(tx + tw - 7 * k, y - th, 7 * k, th, "#b3aa94");
      rect(tx + 14 * k, y - th + 40 * k, 30 * k, 46 * k, "#4a3f3a"); for (var s = 0; s < 4; s++) rect(tx + 14 * k, y - th + (46 + s * 10) * k, 30 * k, 3 * k, "#7a6a60");
      circ(tx + tw / 2, y - th + 110 * k, 11 * k, "#f4efdc"); line(tx + tw / 2, y - th + 110 * k, tx + tw / 2, y - th + 103 * k, "#2a2a2a", 1.6 * k); line(tx + tw / 2, y - th + 110 * k, tx + tw / 2 + 5 * k, y - th + 110 * k, "#2a2a2a", 1.6 * k);
      poly([tx - 4 * k, y - th, tx + tw / 2, y - th - 86 * k, tx + tw + 4 * k, y - th], "#4f5a78");
      line(tx + tw / 2, y - th - 86 * k, tx + tw / 2, y - th - 112 * k, "#d9b24a", 2.4 * k); line(tx + tw / 2 - 7 * k, y - th - 102 * k, tx + tw / 2 + 7 * k, y - th - 102 * k, "#d9b24a", 2.4 * k);
      poly([tx + tw / 2 - 14 * k, y, tx + tw / 2 - 14 * k, y - 38 * k, tx + tw / 2, y - 52 * k, tx + tw / 2 + 14 * k, y - 38 * k, tx + tw / 2 + 14 * k, y], "#3a2a1c");
    }
    function drawTree(it, x, y, k, pine) {
      var xo = (1.5 * LW + 12 + it.off * LW) * k, tx = it.side < 0 ? W / 2 - xo : W / 2 + xo, s = (0.85 + it.v * 0.5) * k;
      var gr = ["#3d7a3a", "#2f6a34", "#4d8a3c", "#356a3a"][Math.floor(it.v * 4)];
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
    function drawFarm(it, x, y, k) {
      var xo = (1.5 * LW + 16 + it.off * LW) * k, w = 150 * k, h = 62 * k, bx = it.side < 0 ? W / 2 - xo - w : W / 2 + xo;
      rect(bx, y - h, w, h, "#d8c9a4"); rect(bx, y - h, w, 5 * k, "#bda878");
      poly([bx - 8 * k, y - h, bx + w * 0.5, y - h - 50 * k, bx + w + 8 * k, y - h], "#b08a3a"); poly([bx - 8 * k, y - h, bx + w * 0.5, y - h - 50 * k, bx + w * 0.5, y - h], "rgba(0,0,0,0.1)");
      rect(bx + 14 * k, y - 42 * k, 26 * k, 42 * k, "#5a3e24"); rect(bx + w - 40 * k, y - 46 * k, 18 * k, 20 * k, "#40364f"); rect(bx + w * 0.55, y - h - 44 * k, 9 * k, 26 * k, "#8a7a68");
    }
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
    function drawScn(it) {
      var k = kOf(it.z), y = yOf(it.z);
      ctx.globalAlpha = fade(it.z);
      switch (it.type) {
        case "house": drawHouse(it, 0, y, k); break; case "church": drawChurch(it, 0, y, k); break;
        case "tree": drawTree(it, 0, y, k, false); break; case "pine": drawTree(it, 0, y, k, true); break;
        case "mill": drawMill(it, 0, y, k); break; case "farm": drawFarm(it, 0, y, k); break;
        case "haystack": drawHay(it, 0, y, k); break; case "fence": drawFence(it, 0, y, k); break;
        case "well": drawWell(it, 0, y, k); break; case "lamp": drawLamp(it, 0, y, k); break;
      }
      ctx.globalAlpha = 1;
    }

    /* ---------- villageois qui regardent ---------- */
    var CLOTH = ["#8a3a3a", "#3a5a8a", "#5a7a3a", "#8a6a3a", "#6a4a7a"];
    function drawPerson(p, px, y, k, tt) {
      var s = k * p.s, c = CLOTH[p.col], sk = "#e0b48a", wv = Math.sin(tt * 5 + p.ph);
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
    function legs(x, y, k, ph, c1, c2, s) {
      var a = Math.sin(ph) * 14 * s, b = -a;
      ctx.lineCap = "round"; ctx.lineWidth = 9 * k; ctx.strokeStyle = c1;
      ctx.beginPath(); ctx.moveTo(x - 7 * k, y - 34 * k); ctx.lineTo(x - 7 * k + a * k * 0.6, y - 4 * k - Math.max(0, -a) * 0.4 * k); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x + 7 * k, y - 34 * k); ctx.lineTo(x + 7 * k + b * k * 0.6, y - 4 * k - Math.max(0, -b) * 0.4 * k); ctx.stroke();
      ctx.strokeStyle = c2; ctx.lineWidth = 10 * k;
      ctx.beginPath(); ctx.moveTo(x - 7 * k + a * k * 0.6, y - 4 * k - Math.max(0, -a) * 0.4 * k); ctx.lineTo(x - 7 * k + a * k * 0.75, y - 2 * k - Math.max(0, -a) * 0.4 * k); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x + 7 * k + b * k * 0.6, y - 4 * k - Math.max(0, -b) * 0.4 * k); ctx.lineTo(x + 7 * k + b * k * 0.75, y - 2 * k - Math.max(0, -b) * 0.4 * k); ctx.stroke();
    }
    // pose : "run" | "kneel" | "captive"
    function drawRunner(x, y, k, pose, e) {
      var jh = pose === "run" && st.jump > 0 ? 4 * st.jump * (1 - st.jump) * 80 * k : 0;
      var sl = pose === "run" && st.slide > 0 ? Math.sin(Math.min(1, st.slide) * Math.PI) : 0;
      var ph = st.step * 2.2;
      ell(x, y, (22 - jh * 0.1) * k, 6 * k, "rgba(0,0,0,0.3)");
      y -= jh;
      ctx.save();
      var sy = 1 - sl * 0.42 - (pose !== "run" ? 0.38 * (e || 1) : 0);
      ctx.translate(x, y); ctx.scale(1, sy); ctx.translate(-x, -y);
      var lean = sl * 6 * k + (pose === "kneel" ? -3 * k : 0);
      if (pose === "run") legs(x, y, k, ph, "#3a3f78", "#2a1d12", st.jump > 0 ? 0.3 : 1); else { rect(x - 14 * k, y - 18 * k, 12 * k, 18 * k, "#3a3f78"); rect(x + 2 * k, y - 18 * k, 12 * k, 18 * k, "#3a3f78"); }
      poly([x - 17 * k + lean, y - 70 * k, x + 17 * k + lean, y - 70 * k, x + 20 * k, y - 28 * k, x - 20 * k, y - 28 * k], "#2f4fa8");
      poly([x - 17 * k + lean, y - 70 * k, x + 17 * k + lean, y - 70 * k, x + 19 * k, y - 60 * k, x - 19 * k, y - 60 * k], "#3a5fc4");
      line(x - 15 * k + lean, y - 68 * k, x + 17 * k, y - 32 * k, "#f2efe6", 4 * k);
      var sw = Math.sin(ph) * 10 * k;
      if (pose === "run") {
        line(x - 17 * k + lean, y - 66 * k, x - 22 * k, y - 46 * k + sw, "#2f4fa8", 8 * k); line(x + 17 * k + lean, y - 66 * k, x + 22 * k, y - 46 * k - sw, "#2f4fa8", 8 * k);
        circ(x - 22 * k, y - 45 * k + sw, 4 * k, "#e8b890"); circ(x + 22 * k, y - 45 * k - sw, 4 * k, "#e8b890");
      } else { // mains levées
        line(x - 17 * k, y - 66 * k, x - 26 * k, y - 98 * k, "#2f4fa8", 8 * k); line(x + 17 * k, y - 66 * k, x + 26 * k, y - 98 * k, "#2f4fa8", 8 * k);
        circ(x - 26 * k, y - 100 * k, 4.5 * k, "#e8b890"); circ(x + 26 * k, y - 100 * k, 4.5 * k, "#e8b890");
      }
      circ(x + lean, y - 82 * k, 11 * k, "#e8b890");
      ctx.fillStyle = "#4a3320"; ctx.beginPath(); ctx.arc(x + lean, y - 80 * k, 11 * k, 0.1, Math.PI - 0.1); ctx.fill();
      if (pose === "run") {
        poly([x - 12 * k + lean, y - 86 * k, x + 12 * k + lean, y - 86 * k, x + 10 * k + lean, y - 100 * k, x + 20 * k + lean, y - 100 * k + Math.sin(ph) * 3 * k, x + 22 * k + lean, y - 92 * k, x - 6 * k + lean, y - 104 * k], "#c8323c");
        rect(x - 12 * k + lean, y - 90 * k, 24 * k, 5 * k, "#a82430"); circ(x + 9 * k + lean, y - 88 * k, 3.4 * k, "#fff"); circ(x + 9 * k + lean, y - 88 * k, 1.8 * k, "#2f4fa8");
      } // en cinématique, le bonnet est tombé
      ctx.restore();
    }
    function drawGuardBack(x, y, k, ph, aim) {
      ell(x, y, 22 * k, 6 * k, "rgba(0,0,0,0.3)");
      legs(x, y, k, ph, "#efe9da", "#1c1a1a", aim ? 0.2 : 1);
      poly([x - 18 * k, y - 70 * k, x + 18 * k, y - 70 * k, x + 21 * k, y - 28 * k, x - 21 * k, y - 28 * k], "#b32632");
      rect(x - 21 * k, y - 36 * k, 42 * k, 8 * k, "#efe9da");
      line(x - 15 * k, y - 68 * k, x + 17 * k, y - 34 * k, "#efe9da", 4 * k);
      circ(x, y - 82 * k, 10.5 * k, "#e8b890");
      poly([x - 17 * k, y - 88 * k, x, y - 100 * k, x + 17 * k, y - 88 * k, x + 12 * k, y - 84 * k, x - 12 * k, y - 84 * k], "#1c1a24");
      rect(x - 2 * k, y - 94 * k, 4 * k, 4 * k, "#efe9da");
      if (aim) { line(x + 20 * k, y - 56 * k, x + 8 * k * aim, y - 98 * k, "#4a3320", 4 * k); line(x + 8 * k * aim, y - 98 * k, x + 5 * k * aim, y - 116 * k, "#cfd6dd", 2.5 * k); }
      else { line(x + 24 * k, y - 42 * k, x + 26 * k, y - 108 * k, "#4a3320", 4 * k); line(x + 26 * k, y - 108 * k, x + 26 * k, y - 124 * k, "#cfd6dd", 2.5 * k); }
    }
    function drawOfficer(x, y, k, tt) { // vu de face
      ell(x, y, 24 * k, 6 * k, "rgba(0,0,0,0.3)");
      rect(x - 13 * k, y - 34 * k, 11 * k, 34 * k, "#efe9da"); rect(x + 2 * k, y - 34 * k, 11 * k, 34 * k, "#efe9da"); rect(x - 14 * k, y - 10 * k, 13 * k, 10 * k, "#1c1a1a"); rect(x + 1 * k, y - 10 * k, 13 * k, 10 * k, "#1c1a1a");
      poly([x - 19 * k, y - 72 * k, x + 19 * k, y - 72 * k, x + 22 * k, y - 28 * k, x - 22 * k, y - 28 * k], "#a52a36");
      poly([x - 6 * k, y - 72 * k, x + 6 * k, y - 72 * k, x + 4 * k, y - 36 * k, x - 4 * k, y - 36 * k], "#efe9da");
      for (var i = 0; i < 4; i++) circ(x, y - 66 * k + i * 9 * k, 1.8 * k, "#d9b24a");
      line(x - 19 * k, y - 66 * k, x - 28 * k, y - 44 * k, "#a52a36", 8 * k);
      var up = Math.min(1, tt * 1.5); line(x + 19 * k, y - 66 * k, x + 28 * k, y - (60 + 34 * up) * k, "#a52a36", 8 * k);
      line(x + 28 * k, y - (60 + 34 * up) * k, x + 28 * k, y - (96 + 20 * up) * k, "#cfd6dd", 3 * k);
      circ(x, y - 83 * k, 11 * k, "#e8b890"); circ(x - 4 * k, y - 85 * k, 1.4 * k, "#2a2a2a"); circ(x + 4 * k, y - 85 * k, 1.4 * k, "#2a2a2a"); line(x - 4 * k, y - 78 * k, x + 4 * k, y - 78 * k, "#6a3a2a", 1.4 * k);
      poly([x - 20 * k, y - 90 * k, x, y - 104 * k, x + 20 * k, y - 90 * k, x + 14 * k, y - 86 * k, x - 14 * k, y - 86 * k], "#1c1a24");
      line(x - 12 * k, y - 99 * k, x - 20 * k, y - 114 * k, "#efe9da", 3 * k);
    }

    /* ---------- HUD ---------- */
    function hud() {
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(20,10,14,0.55)"; ctx.fillRect(W / 2 - 62, 12, 124, 40);
      ctx.fillStyle = "#ffe9a8"; ctx.font = "700 26px Georgia, serif"; ctx.fillText(String(st.over ? st.finalScore : score()), W / 2, 42);
      ctx.font = "700 11px Georgia, serif"; ctx.fillStyle = "#e7d7b0";
      ctx.fillText(Math.floor(st.dist) + " m  ·  " + st.coins + " ●", W / 2, 66);
      var gx = W - 24, gh = 120, gy0 = 24;
      ctx.fillStyle = "rgba(20,10,14,0.55)"; ctx.fillRect(gx - 8, gy0 - 6, 16, gh + 12);
      var g = Math.min(1, st.guard);
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
      var starts = [[-0.9, 1.8], [0, 1.8], [0.9, 1.8], [0.45, 1.8]];
      var ends = [[st.px - 0.62, PD - 0.35], [st.px + 0.62, PD - 0.35], [st.px - 0.4, PD - 1.3], [st.px + 0.4, PD - 1.3]];
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
        [-0.9, 0, 0.9].forEach(function (l, i) { items.push({ z: gz + i * 0.01, f: function () { drawGuardBack(xOf(l * 0.9 + st.px * 0.4, gz), yOf(gz), kOf(gz) * 0.98, st.step * 2.2 + i * 1.4, 0); } }); });
        items.push({ z: PD, f: function () { drawRunner(xOf(st.px, PD), yOf(PD), kOf(PD), "run"); } });
      } else {
        var fall = Math.min(1, ct / 0.5);
        items.push({ z: PD, f: function () { drawRunner(xOf(st.px, PD), yOf(PD) + fall * 6, kOf(PD), ct < 1.9 ? "kneel" : "captive", ct < 0.5 ? fall : 1); if (ct > 0.25) { var cx = xOf(st.px, PD) + 24 * kOf(PD), cy = yOf(PD) - 4 * kOf(PD); circ(cx, cy, 5, "#fff"); circ(cx, cy, 3, "#2f4fa8"); circ(cx, cy, 1.4, "#c8323c"); } } });
        for (var gi = 0; gi < 4; gi++) (function (i) { var p = cineGuardPos(i, ct); items.push({ z: p[1], f: function () { drawGuardBack(xOf(p[0], p[1]), yOf(p[1]), kOf(p[1]) * 0.98, ct * 8 + i, p[2] > 0.9 ? (i % 2 ? -1 : 1) : 0); } }); })(gi);
        var oz = PD + 1.5, oe = Math.max(0, Math.min(1, (ct - 0.6) / 0.8));
        items.push({ z: oz, f: function () { ctx.globalAlpha = oe; drawOfficer(xOf(st.px * 0.5, oz), yOf(oz) + (1 - oe) * 8, kOf(oz), Math.max(0, ct - 1.2)); ctx.globalAlpha = 1; } });
      }
      items.sort(function (a, b) { return b.z - a.z; });
      items.forEach(function (it) { it.f(); });
      st.parts.forEach(function (p) { ctx.globalAlpha = Math.max(0, p.life); ctx.fillStyle = p.c; ctx.fillRect(p.x, p.y, p.s, p.s); });
      ctx.globalAlpha = 1;
      ctx.restore();
      if (!st.over && st.guard > 0.5) { var a = (st.guard - 0.5) * 0.7 + Math.sin(st.t * 10) * 0.05; var g = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.75); g.addColorStop(0, "rgba(200,30,40,0)"); g.addColorStop(1, "rgba(200,30,40," + Math.max(0, a) + ")"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
      hud();
      if (st.over) {
        // cinématique : bandes noires et légendes
        var bar = Math.min(1, ct / 0.6) * 54;
        ctx.fillStyle = "#0d0810"; ctx.fillRect(0, 0, W, bar * 0.4); ctx.fillRect(0, H - bar, W, bar);
        ctx.textAlign = "center";
        if (ct > 0.8 && ct < 2.3) { ctx.font = "700 20px Georgia, serif"; ctx.fillStyle = "#ffd98a"; ctx.globalAlpha = Math.min(1, (ct - 0.8) * 4); ctx.fillText(FR ? "« Halte-là, citoyen ! »" : "“Halt, citizen!”", W / 2, H - 22); ctx.globalAlpha = 1; }
        else if (ct >= 2.3) { ctx.font = "700 17px Georgia, serif"; ctx.fillStyle = "#ffd98a"; ctx.globalAlpha = Math.min(1, (ct - 2.3) * 3); ctx.fillText(FR ? "« Au nom du Roi, vous êtes arrêté ! »" : "“In the King's name, you are under arrest!”", W / 2, H - 22); ctx.globalAlpha = 1; }
        ctx.textAlign = "left";
        if (ct > 4.4) { ctx.fillStyle = "rgba(13,8,16," + Math.min(1, (ct - 4.4) / 0.9) + ")"; ctx.fillRect(0, 0, W, H); }
      }
      if (st.flash > 0) { ctx.fillStyle = "rgba(255,255,255," + Math.max(0, st.flash * 0.45) + ")"; ctx.fillRect(0, 0, W, H); }
    }

    function loop(ts) {
      if (dead) return;
      var dt = Math.min(0.05, (ts - (last || ts)) / 1000); last = ts;
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
  window.HistoriaRun = { create: create, _speed: speedAt };
})();
