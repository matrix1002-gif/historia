/* Historia — « La Fuite » : un révolutionnaire échappe à la garde royale dans les rues de Paris.
   Course sans fin façon Temple Run : 3 voies, glisser gauche/droite (changer de voie), haut (sauter), bas (se baisser). */
(function () {
  var W = 360, H = 640, HY = 240, F = 7, PD = 4.5, LW = 112, STEP = 1 / 60, FAR = 62;
  var PLACES = [
    ["Rue Saint-Antoine", "Rue Saint-Antoine"], ["Place de Grève", "Place de Grève"], ["Pont-Neuf", "Pont-Neuf"],
    ["Les Halles", "Les Halles"], ["Palais-Royal", "Palais-Royal"], ["Faubourg Saint-Marceau", "Faubourg Saint-Marceau"],
    ["Quai de la Mégisserie", "Quai de la Mégisserie"], ["Les Tuileries", "The Tuileries"]
  ];
  function rngOf(seed) { var a = seed >>> 0; return function () { a = (a + 0x6D2B79F5) >>> 0; var t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function speedAt(t) { return 9 + 9 * (1 - Math.exp(-t / 60)) + Math.min(t, 400) * 0.03; }
  function rowTime(t) { return Math.max(0.62, 1.55 - t * 0.0042); }

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
    var GY1 = H + 20; // sol au plan de la caméra

    function kOf(z) { return F / (F + z); }
    function yOf(z) { return HY + (GY1 - HY) * kOf(z); }
    function xOf(lane, z) { return W / 2 + lane * LW * kOf(z); }

    function reset() {
      st = { t: 0, dist: 0, coins: 0, lane: 0, px: 0, jump: 0, slide: 0, over: false, endT: 0, done: false, guard: 0.0, stumble: 0, hit: 0,
        obs: [], coinsL: [], bld: [], parts: [], nextRow: 26, lastFree: 0, banner: null, place: -1, scroll: 0, step: 0, shake: 0, flash: 0, rowN: 0, started: false, warm: 0 };
      for (var z = 6; z < FAR + 10; z += 5.5) st.bld.push({ z: z, side: -1, h: 120 + rnd() * 120, c: Math.floor(rnd() * 4), w: 110 + rnd() * 30 }, { z: z + 2.2, side: 1, h: 120 + rnd() * 120, c: Math.floor(rnd() * 4), w: 110 + rnd() * 30 });
      st.bz = FAR + 10;
      addRow(30);
    }

    /* ---------- génération des rangées ---------- */
    function addRow(z0) {
      var z = z0 || FAR + 4, n = ++st.rowN;
      var diff = Math.min(1, st.t / 150);
      var r = rnd(), kind;
      if (n > 3 && r < 0.12 + diff * 0.06) kind = "alljump";
      else if (n > 6 && r < 0.2 + diff * 0.08) kind = "allbeam";
      else kind = "lanes";
      if (kind === "alljump") { for (var l = -1; l <= 1; l++) st.obs.push({ type: "crate", lane: l, z: z, hit: false }); }
      else if (kind === "allbeam") { for (var l2 = -1; l2 <= 1; l2++) st.obs.push({ type: "beam", lane: l2, z: z, hit: false }); }
      else {
        // une voie libre, proche de la précédente
        var free = st.lastFree + (rnd() < 0.5 ? 0 : (rnd() < 0.5 ? -1 : 1));
        free = Math.max(-1, Math.min(1, free));
        if (rnd() < 0.15 + diff * 0.2) free = Math.max(-1, Math.min(1, st.lastFree + (st.lastFree === 0 ? (rnd() < 0.5 ? -1 : 1) : -st.lastFree)));
        st.lastFree = free;
        for (var ln = -1; ln <= 1; ln++) {
          if (ln === free) { if (rnd() < 0.55) st.coinsL.push({ lane: ln, z: z, got: false }, { lane: ln, z: z + 1.6, got: false }, { lane: ln, z: z + 3.2, got: false }); continue; }
          var q = rnd(), type;
          if (diff < 0.25) type = q < 0.5 ? "crate" : q < 0.8 ? "cart" : "beam";
          else type = q < 0.35 ? "crate" : q < 0.65 ? "cart" : "beam";
          // à bas niveau, une voie sur trois seulement est bloquée de temps en temps
          if (n < 5 && rnd() < 0.45) continue;
          st.obs.push({ type: type, lane: ln, z: z, hit: false });
        }
      }
      var v = speedAt(st.t);
      st.nextRow = Math.max(0.5, z + v * rowTime(st.t) - (FAR + 4));
    }

    /* ---------- actions ---------- */
    function move(d) {
      if (st.over) return;
      var nl = Math.max(-1, Math.min(1, st.lane + d));
      if (nl !== st.lane) { st.lane = nl; if (opt.sfx) opt.sfx("tap"); }
    }
    function jump() { if (st.over || st.jump > 0) return; st.slide = 0; st.jump = 0.0001; if (opt.sfx) opt.sfx("tap"); }
    function slide() { if (st.over) return; if (st.jump > 0) { st.vdrop = true; } st.slide = 0.0001; if (opt.sfx) opt.sfx("tap"); }

    function burst(x, y, col, n) { for (var i = 0; i < n; i++) st.parts.push({ x: x, y: y, vx: (rnd() - 0.5) * 220, vy: -rnd() * 220 - 30, life: 1, c: col, s: 2 + rnd() * 3 }); }
    function caught() {
      if (st.over) return;
      st.over = true; st.endT = 0; st.flash = 1; st.shake = 0.5;
      if (opt.buzz) opt.buzz(40);
      if (opt.sfx) opt.sfx("bad");
    }
    function score() { return Math.floor(st.dist) + st.coins * 5; }

    /* ---------- simulation ---------- */
    function update(dt) {
      if (st.flash > 0) st.flash -= dt * 2.2;
      if (st.shake > 0) st.shake -= dt;
      st.parts.forEach(function (p) { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 520 * dt; p.life -= dt * 1.6; });
      st.parts = st.parts.filter(function (p) { return p.life > 0; });
      if (st.banner) { st.banner.t += dt; if (st.banner.t > 2.6) st.banner = null; }
      if (st.over) {
        st.endT += dt;
        if (st.endT > 1.3 && !st.done) {
          st.done = true;
          var sc = score();
          if (sc > best) best = sc;
          opt.onEnd({ score: sc, meters: Math.floor(st.dist), coins: st.coins, best: best });
        }
        return;
      }
      st.t += dt;
      st.warm = Math.min(1, st.warm + dt / 1.2);
      var v = speedAt(st.t) * st.warm * (st.stumble > 0 ? 0.62 : 1);
      st.stumble = Math.max(0, st.stumble - dt);
      st.dist += v * dt * 1.4;
      st.scroll += v * dt;
      st.step += v * dt * 0.9;
      st.px += (st.lane - st.px) * Math.min(1, dt * 13);
      if (st.jump > 0) { st.jump += dt / 0.68; if (st.jump >= 1 || st.vdrop) { st.jump = 0; st.vdrop = false; } }
      if (st.slide > 0) { st.slide += dt / 0.62; if (st.slide >= 1) st.slide = 0; }
      st.guard = Math.max(0, st.guard - dt * 0.085);
      // palier : nom de lieu tous les 250 m
      var pl = Math.floor(st.dist / 250);
      if (pl > st.place) { st.place = pl; if (pl > 0) { st.banner = { t: 0, s: PLACES[(pl - 1) % PLACES.length] }; if (opt.sfx) opt.sfx("good"); } }
      // déplacement du monde
      st.obs.forEach(function (o) { o.z -= v * dt; });
      st.coinsL.forEach(function (c) { c.z -= v * dt; });
      st.bld.forEach(function (b) { b.z -= v * dt; });
      st.nextRow -= v * dt;
      if (st.nextRow <= 0) addRow();
      while (st.bld.length && st.bld[0].z < -4) st.bld.shift();
      st.bz -= v * dt;
      while (st.bz < FAR + 10) { st.bz += 5.5; var s1 = Math.floor(rnd() * 4); st.bld.push({ z: FAR + 10, side: -1, h: 120 + rnd() * 130, c: s1, w: 110 + rnd() * 30 }, { z: FAR + 12.2, side: 1, h: 120 + rnd() * 130, c: Math.floor(rnd() * 4), w: 110 + rnd() * 30 }); }
      st.bld.sort(function (a, b) { return a.z - b.z; });
      st.obs = st.obs.filter(function (o) { return o.z > -3; });
      st.coinsL = st.coinsL.filter(function (c) { return c.z > -3 && !c.got; });
      // collisions
      var jh = st.jump > 0 ? 4 * st.jump * (1 - st.jump) : 0; // 0..1
      var py = jh * 80;
      st.obs.forEach(function (o) {
        if (o.hit || Math.abs(o.z - PD) > 0.55 || Math.abs(o.lane - st.px) > 0.55) return;
        var safe = false;
        if (o.type === "crate") safe = py > 34;
        else if (o.type === "beam") safe = st.slide > 0;
        if (safe) return;
        o.hit = true;
        var heavy = o.type === "cart";
        st.guard += heavy ? 0.62 : 0.5;
        st.stumble = 0.9; st.shake = 0.3; st.flash = 0.5;
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

    /* ---------- dessin ---------- */
    function rect(x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); }
    function poly(pts, c) { ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(pts[0], pts[1]); for (var i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]); ctx.closePath(); ctx.fill(); }
    var WALLS = [["#c9b48c", "#a58f68"], ["#b9a58a", "#8f7d64"], ["#c7a98a", "#977a5c"], ["#b6b0a0", "#8a8576"]];
    var ROOFS = ["#5b4a52", "#4a4458", "#6a4a3e", "#4f5560"];

    function drawSky() {
      var g = ctx.createLinearGradient(0, 0, 0, HY + 10);
      g.addColorStop(0, "#2a2350"); g.addColorStop(0.55, "#b45a58"); g.addColorStop(1, "#f6b36b");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, HY + 12);
      // soleil bas
      ctx.fillStyle = "rgba(255,226,150,0.85)"; ctx.beginPath(); ctx.arc(250, HY - 6, 26, 0, 7); ctx.fill();
      // silhouette de Notre-Dame et de la Bastille
      ctx.fillStyle = "#3a2c48";
      rect(60, HY - 54, 18, 54, "#3a2c48"); rect(92, HY - 54, 18, 54, "#3a2c48"); rect(78, HY - 40, 14, 40, "#3a2c48");
      for (var i = 0; i < 3; i++) { rect(60 + i * 6, HY - 60, 4, 6, "#3a2c48"); rect(92 + i * 6, HY - 60, 4, 6, "#3a2c48"); }
      poly([76, HY - 40, 85, HY - 78, 94, HY - 40], "#3a2c48");
      rect(150, HY - 44, 30, 44, "#3a2c48"); rect(146, HY - 52, 38, 10, "#3a2c48");
      for (var j = 0; j < 4; j++) rect(146 + j * 10, HY - 58, 6, 7, "#3a2c48");
      rect(270, HY - 30, 70, 30, "#44345a");
      rect(0, HY - 14, W, 14, "#44345a");
    }
    function drawRoad() {
      // trottoirs / sol latéral
      var g = ctx.createLinearGradient(0, HY, 0, H);
      g.addColorStop(0, "#6e5a58"); g.addColorStop(1, "#5a4642");
      ctx.fillStyle = g; ctx.fillRect(0, HY, W, H - HY);
      // chaussée (trapèze)
      var xf = W / 2 - 1.5 * LW * kOf(FAR + 6), xn = W / 2 - 1.5 * LW * kOf(-1.2);
      var yf = yOf(FAR + 6), yn = yOf(-1.2);
      var gr = ctx.createLinearGradient(0, yf, 0, yn);
      gr.addColorStop(0, "#8d7f78"); gr.addColorStop(1, "#6f625c");
      ctx.fillStyle = gr; ctx.beginPath(); ctx.moveTo(xf, yf); ctx.lineTo(W - xf, yf); ctx.lineTo(W - xn, yn); ctx.lineTo(xn, yn); ctx.closePath(); ctx.fill();
      // pavés : bandes qui défilent
      var off = st.scroll % 3;
      for (var z = FAR + 4 + off; z > -1.5; z -= 3) {
        var z2 = z - 1.5;
        var ya = yOf(z), yb = yOf(Math.max(z2, -1.2));
        if (yb < ya) continue;
        ctx.fillStyle = "rgba(0,0,0,0.07)";
        var xa = W / 2 - 1.5 * LW * kOf(z), xb = W / 2 - 1.5 * LW * kOf(Math.max(z2, -1.2));
        ctx.beginPath(); ctx.moveTo(xa, ya); ctx.lineTo(W - xa, ya); ctx.lineTo(W - xb, yb); ctx.lineTo(xb, yb); ctx.closePath(); ctx.fill();
      }
      // séparateurs de voies
      ctx.strokeStyle = "rgba(255,240,210,0.28)"; ctx.lineWidth = 2;
      [-0.5, 0.5].forEach(function (l) { ctx.beginPath(); ctx.moveTo(xOf(l, FAR + 6), yOf(FAR + 6)); ctx.lineTo(xOf(l, -1.2), yOf(-1.2)); ctx.stroke(); });
      // bordures
      ctx.strokeStyle = "#3b2f33"; ctx.lineWidth = 3;
      [-1.5, 1.5].forEach(function (l) { ctx.beginPath(); ctx.moveTo(xOf(l, FAR + 6), yOf(FAR + 6)); ctx.lineTo(xOf(l, -1.2), yOf(-1.2)); ctx.stroke(); });
    }
    function fade(z) { return Math.max(0, Math.min(1, (FAR - z) / 20)); }

    function drawBuilding(b) {
      var k = kOf(b.z), y = yOf(b.z), w = b.w * k, h = b.h * k;
      var xo = (1.5 * LW + 14) * k;
      var x = b.side < 0 ? W / 2 - xo - w : W / 2 + xo;
      var col = WALLS[b.c];
      ctx.globalAlpha = fade(b.z);
      rect(x, y - h, w, h, col[0]);
      rect(b.side < 0 ? x + w - 6 * k : x, y - h, 6 * k, h, col[1]);
      poly([x - 4 * k, y - h, x + w / 2, y - h - 34 * k, x + w + 4 * k, y - h], ROOFS[b.c]);
      var rows = Math.max(2, Math.floor(b.h / 48));
      for (var r = 0; r < rows; r++) for (var c = 0; c < 2; c++) {
        rect(x + (14 + c * (w / k - 44)) * k, y - h + (16 + r * 44) * k, 18 * k, 26 * k, (r + c + b.c) % 3 === 0 ? "#f3d98a" : "#3d3350");
      }
      ctx.globalAlpha = 1;
    }
    function drawCrate(o) {
      var k = kOf(o.z), x = xOf(o.lane, o.z), y = yOf(o.z), w = 74 * k, h = 52 * k;
      rect(x - w / 2, y - h, w, h, "#9a6a35"); rect(x - w / 2, y - h, w, 6 * k, "#b98a4c");
      ctx.strokeStyle = "#5e3f1d"; ctx.lineWidth = Math.max(1, 3 * k);
      ctx.strokeRect(x - w / 2, y - h, w, h);
      ctx.beginPath(); ctx.moveTo(x - w / 2, y - h); ctx.lineTo(x + w / 2, y); ctx.moveTo(x + w / 2, y - h); ctx.lineTo(x - w / 2, y); ctx.stroke();
    }
    function drawCart(o) {
      var k = kOf(o.z), x = xOf(o.lane, o.z), y = yOf(o.z), w = 96 * k, h = 96 * k;
      // charrette chargée de foin
      rect(x - w / 2, y - h * 0.55, w, h * 0.4, "#6a4423");
      ctx.fillStyle = "#d9b95a"; ctx.beginPath(); ctx.ellipse(x, y - h * 0.62, w * 0.5, h * 0.42, 0, Math.PI, 0); ctx.fill();
      rect(x - w / 2, y - h * 0.64, w, h * 0.1, "#c9a548");
      ctx.fillStyle = "#3a2a18"; ctx.beginPath(); ctx.arc(x - w * 0.34, y - h * 0.14, h * 0.16, 0, 7); ctx.arc(x + w * 0.34, y - h * 0.14, h * 0.16, 0, 7); ctx.fill();
      ctx.strokeStyle = "#8a6a38"; ctx.lineWidth = Math.max(1, 2 * k); ctx.beginPath(); ctx.arc(x - w * 0.34, y - h * 0.14, h * 0.1, 0, 7); ctx.arc(x + w * 0.34, y - h * 0.14, h * 0.1, 0, 7); ctx.stroke();
    }
    function drawBeam(o) {
      var k = kOf(o.z), x = xOf(o.lane, o.z), y = yOf(o.z), w = 100 * k;
      rect(x - w / 2, y - 100 * k, 9 * k, 100 * k, "#4a3320"); rect(x + w / 2 - 9 * k, y - 100 * k, 9 * k, 100 * k, "#4a3320");
      rect(x - w / 2 - 4 * k, y - 84 * k, w + 8 * k, 24 * k, "#7a5530");
      ctx.fillStyle = "#c23a3a";
      for (var i = 0; i < 5; i++) rect(x - w / 2 - 4 * k + i * (w + 8 * k) / 5, y - 84 * k, (w + 8 * k) / 10, 24 * k, "#e9e1cf");
      ctx.strokeStyle = "#2c1e10"; ctx.lineWidth = Math.max(1, 2 * k); ctx.strokeRect(x - w / 2 - 4 * k, y - 84 * k, w + 8 * k, 24 * k);
    }
    function drawCoin(c) {
      var k = kOf(c.z), x = xOf(c.lane, c.z), y = yOf(c.z) - 26 * k;
      ctx.globalAlpha = fade(c.z);
      var sw = Math.abs(Math.cos(st.t * 4 + c.z)) * 0.7 + 0.3;
      ctx.fillStyle = "#e7b53b"; ctx.beginPath(); ctx.ellipse(x, y, 11 * k * sw, 11 * k, 0, 0, 7); ctx.fill();
      ctx.fillStyle = "#2f4fa8"; ctx.beginPath(); ctx.ellipse(x, y, 6 * k * sw, 6 * k, 0, 0, 7); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.ellipse(x, y, 3 * k * sw, 3 * k, 0, 0, 7); ctx.fill();
      ctx.fillStyle = "#c8323c"; ctx.beginPath(); ctx.ellipse(x, y, 1.2 * k * sw, 1.2 * k, 0, 0, 7); ctx.fill();
      ctx.globalAlpha = 1;
    }
    function legs(x, y, k, ph, c1, c2, s) {
      var a = Math.sin(ph) * 14 * s, b = -a;
      ctx.lineCap = "round"; ctx.lineWidth = 9 * k; ctx.strokeStyle = c1;
      ctx.beginPath(); ctx.moveTo(x - 7 * k, y - 34 * k); ctx.lineTo(x - 7 * k + a * k * 0.6, y - 4 * k - Math.max(0, -a) * 0.4 * k); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x + 7 * k, y - 34 * k); ctx.lineTo(x + 7 * k + b * k * 0.6, y - 4 * k - Math.max(0, -b) * 0.4 * k); ctx.stroke();
      ctx.strokeStyle = c2; ctx.lineWidth = 10 * k;
      ctx.beginPath(); ctx.moveTo(x - 7 * k + a * k * 0.6, y - 4 * k - Math.max(0, -a) * 0.4 * k); ctx.lineTo(x - 7 * k + a * k * 0.75, y - 2 * k - Math.max(0, -a) * 0.4 * k); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x + 7 * k + b * k * 0.6, y - 4 * k - Math.max(0, -b) * 0.4 * k); ctx.lineTo(x + 7 * k + b * k * 0.75, y - 2 * k - Math.max(0, -b) * 0.4 * k); ctx.stroke();
    }
    function drawRunner(x, y, k) {
      var jh = st.jump > 0 ? 4 * st.jump * (1 - st.jump) * 80 * k : 0;
      var sl = st.slide > 0 ? Math.sin(Math.min(1, st.slide) * Math.PI) : 0;
      var ph = st.step * 2.2;
      // ombre
      ctx.fillStyle = "rgba(0,0,0,0.3)"; ctx.beginPath(); ctx.ellipse(x, y, (22 - jh * 0.1) * k, 6 * k, 0, 0, 7); ctx.fill();
      y -= jh;
      ctx.save();
      ctx.translate(x, y); ctx.scale(1, 1 - sl * 0.42); ctx.translate(-x, -y);
      var lean = sl * 6 * k;
      legs(x, y, k, ph, "#3a3f78", "#2a1d12", st.jump > 0 ? 0.3 : 1);
      // manteau (dos)
      poly([x - 17 * k + lean, y - 70 * k, x + 17 * k + lean, y - 70 * k, x + 20 * k, y - 28 * k, x - 20 * k, y - 28 * k], "#2f4fa8");
      poly([x - 17 * k + lean, y - 70 * k, x + 17 * k + lean, y - 70 * k, x + 19 * k, y - 60 * k, x - 19 * k, y - 60 * k], "#3a5fc4");
      // bandoulière blanche croisée
      ctx.strokeStyle = "#f2efe6"; ctx.lineWidth = 4 * k; ctx.beginPath(); ctx.moveTo(x - 15 * k + lean, y - 68 * k); ctx.lineTo(x + 17 * k, y - 32 * k); ctx.stroke();
      // bras
      var sw = Math.sin(ph) * 10 * k;
      ctx.strokeStyle = "#2f4fa8"; ctx.lineWidth = 8 * k;
      ctx.beginPath(); ctx.moveTo(x - 17 * k + lean, y - 66 * k); ctx.lineTo(x - 22 * k, y - 46 * k + sw); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x + 17 * k + lean, y - 66 * k); ctx.lineTo(x + 22 * k, y - 46 * k - sw); ctx.stroke();
      ctx.fillStyle = "#e8b890"; ctx.beginPath(); ctx.arc(x - 22 * k, y - 45 * k + sw, 4 * k, 0, 7); ctx.arc(x + 22 * k, y - 45 * k - sw, 4 * k, 0, 7); ctx.fill();
      // tête + cheveux + bonnet phrygien rouge
      ctx.fillStyle = "#e8b890"; ctx.beginPath(); ctx.arc(x + lean, y - 82 * k, 11 * k, 0, 7); ctx.fill();
      ctx.fillStyle = "#4a3320"; ctx.beginPath(); ctx.arc(x + lean, y - 80 * k, 11 * k, 0.1, Math.PI - 0.1); ctx.fill();
      poly([x - 12 * k + lean, y - 86 * k, x + 12 * k + lean, y - 86 * k, x + 10 * k + lean, y - 100 * k, x + 20 * k + lean, y - 100 * k + Math.sin(ph) * 3 * k, x + 22 * k + lean, y - 92 * k, x - 6 * k + lean, y - 104 * k], "#c8323c");
      rect(x - 12 * k + lean, y - 90 * k, 24 * k, 5 * k, "#a82430");
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(x + 9 * k + lean, y - 88 * k, 3.4 * k, 0, 7); ctx.fill();
      ctx.fillStyle = "#2f4fa8"; ctx.beginPath(); ctx.arc(x + 9 * k + lean, y - 88 * k, 1.8 * k, 0, 7); ctx.fill();
      ctx.restore();
    }
    function drawGuard(x, y, k, ph) {
      ctx.fillStyle = "rgba(0,0,0,0.3)"; ctx.beginPath(); ctx.ellipse(x, y, 22 * k, 6 * k, 0, 0, 7); ctx.fill();
      legs(x, y, k, ph, "#efe9da", "#1c1a1a", 1);
      poly([x - 18 * k, y - 70 * k, x + 18 * k, y - 70 * k, x + 21 * k, y - 28 * k, x - 21 * k, y - 28 * k], "#b32632");
      rect(x - 21 * k, y - 36 * k, 42 * k, 8 * k, "#efe9da");
      ctx.strokeStyle = "#efe9da"; ctx.lineWidth = 4 * k; ctx.beginPath(); ctx.moveTo(x - 15 * k, y - 68 * k); ctx.lineTo(x + 17 * k, y - 34 * k); ctx.stroke();
      ctx.fillStyle = "#e8b890"; ctx.beginPath(); ctx.arc(x, y - 82 * k, 10.5 * k, 0, 7); ctx.fill();
      // bicorne
      poly([x - 17 * k, y - 88 * k, x, y - 100 * k, x + 17 * k, y - 88 * k, x + 12 * k, y - 84 * k, x - 12 * k, y - 84 * k], "#1c1a24");
      rect(x - 2 * k, y - 94 * k, 4 * k, 4 * k, "#efe9da");
      // fusil à baïonnette
      ctx.strokeStyle = "#4a3320"; ctx.lineWidth = 4 * k; ctx.beginPath(); ctx.moveTo(x + 24 * k, y - 42 * k); ctx.lineTo(x + 26 * k, y - 108 * k); ctx.stroke();
      ctx.strokeStyle = "#cfd6dd"; ctx.lineWidth = 2.5 * k; ctx.beginPath(); ctx.moveTo(x + 26 * k, y - 108 * k); ctx.lineTo(x + 26 * k, y - 124 * k); ctx.stroke();
    }

    function hud() {
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(20,10,14,0.55)"; ctx.fillRect(W / 2 - 62, 12, 124, 40);
      ctx.fillStyle = "#ffe9a8"; ctx.font = "700 26px Georgia, serif"; ctx.fillText(String(score()), W / 2, 42);
      ctx.font = "700 11px Georgia, serif"; ctx.fillStyle = "#e7d7b0";
      ctx.fillText(Math.floor(st.dist) + " m  ·  " + st.coins + " ●", W / 2, 66);
      // barre de proximité de la garde
      var gx = W - 24, gh = 120, gy0 = 24;
      ctx.fillStyle = "rgba(20,10,14,0.55)"; ctx.fillRect(gx - 8, gy0 - 6, 16, gh + 12);
      var g = Math.min(1, st.guard);
      ctx.fillStyle = g > 0.55 ? "#e24a4a" : "#d9a548"; ctx.fillRect(gx - 5, gy0 + gh - gh * g, 10, gh * g);
      ctx.strokeStyle = "#e7d7b0"; ctx.lineWidth = 1; ctx.strokeRect(gx - 5, gy0, 10, gh);
      if (st.banner) {
        var b = st.banner, a = Math.min(1, b.t * 3, (2.6 - b.t) * 3);
        ctx.globalAlpha = Math.max(0, a);
        ctx.fillStyle = "rgba(30,12,16,0.7)"; ctx.fillRect(0, 96, W, 52);
        ctx.fillStyle = "#ffd98a"; ctx.font = "700 22px Georgia, serif";
        ctx.fillText((FR ? b.s[0] : b.s[1]), W / 2, 128);
        ctx.font = "italic 12px Georgia, serif"; ctx.fillStyle = "#f1e6cf"; ctx.fillText(Math.floor(st.dist) + " m", W / 2, 143);
        ctx.globalAlpha = 1;
      }
      if (st.warm < 1 && !st.over) {
        ctx.fillStyle = "rgba(20,10,14,0.55)"; ctx.fillRect(0, H * 0.62, W, 70);
        ctx.fillStyle = "#ffe9a8"; ctx.font = "700 18px Georgia, serif";
        ctx.fillText(FR ? "Fuis, citoyen !" : "Run, citizen!", W / 2, H * 0.62 + 30);
        ctx.font = "13px Georgia, serif"; ctx.fillStyle = "#f1e6cf";
        ctx.fillText(FR ? "Glisse ← → pour changer de voie · ↑ sauter · ↓ se baisser" : "Swipe ← → to change lane · ↑ jump · ↓ slide", W / 2, H * 0.62 + 52);
      }
      ctx.textAlign = "left";
    }

    function draw() {
      ctx.save();
      if (st.shake > 0) ctx.translate((Math.random() - 0.5) * 8 * st.shake, (Math.random() - 0.5) * 8 * st.shake);
      drawSky(); drawRoad();
      // objets triés du plus loin au plus proche
      var items = [];
      st.bld.forEach(function (b) { items.push({ z: b.z, f: function () { drawBuilding(b); } }); });
      st.obs.forEach(function (o) { if (o.hit) return; items.push({ z: o.z, f: function () { ctx.globalAlpha = fade(o.z); (o.type === "crate" ? drawCrate : o.type === "cart" ? drawCart : drawBeam)(o); ctx.globalAlpha = 1; } }); });
      st.coinsL.forEach(function (c) { items.push({ z: c.z, f: function () { drawCoin(c); } }); });
      var gz = 0.5 + 1.3 * (1 - Math.min(1, st.guard));
      var showG = true;
      var dz = PD - (st.over && st.guard < 1 ? 0.8 : 0);
      if (showG) [-0.9, 0, 0.9].forEach(function (l, i) { items.push({ z: gz + i * 0.01, f: function () { drawGuard(xOf(l * 0.9 + st.px * 0.4, gz), yOf(gz), kOf(gz) * 0.98, st.step * 2.2 + i * 1.4); } }); });
      items.push({ z: PD, f: function () { drawRunner(xOf(st.px, PD), yOf(PD), kOf(PD)); } });
      items.sort(function (a, b) { return b.z - a.z; });
      items.forEach(function (it) { it.f(); });
      st.parts.forEach(function (p) { ctx.globalAlpha = Math.max(0, p.life); ctx.fillStyle = p.c; ctx.fillRect(p.x, p.y, p.s, p.s); });
      ctx.globalAlpha = 1;
      ctx.restore();
      // vignette de danger
      if (st.guard > 0.5) { var a = (st.guard - 0.5) * 0.7 + Math.sin(st.t * 10) * 0.05; var g = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.75); g.addColorStop(0, "rgba(200,30,40,0)"); g.addColorStop(1, "rgba(200,30,40," + Math.max(0, a) + ")"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
      hud();
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
      _move: move, _jump: jump, _slide: slide
    };
  }
  window.HistoriaRun = { create: create, _speed: speedAt };
})();
