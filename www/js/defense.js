/* Historia — « Conquête » : un chevalier bondit de porte en porte.
   Chaque porte franchie = un territoire conquis, sans limite : la course continue vers la Perse et l'Extrême-Orient. Le paysage et le chevalier changent avec la conquête. */
(function () {
  var W = 360, H = 560, GY = 490, KX = 100, TOTAL = 200;
  /* physique (px et secondes) : bond franc, chute plus violente que la montée */
  var TS = 1.28; // le temps s'écoule plus vite : même géométrie, jeu plus nerveux
  var FLAP = 227 * TS, GU = 558 * TS * TS, GD = 558 * TS * TS, VMAX = 335 * TS, STEP = 1 / 120;
  function rngOf(seed) { var a = seed >>> 0; return function () { a = (a + 0x6D2B79F5) >>> 0; var t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function ramp(n) { return 1 - Math.exp(-n / 22); }
  function speedOf(n) { return (120 + 60 * ramp(n) + Math.min(n, 150) * 0.38 + Math.min(Math.max(0, n - 150), 300) * 0.12) * TS; }
  function gapOf(n) { return Math.max(124, 184 - 46 * ramp(n) - Math.min(Math.max(0, n - 150), 200) * 0.08); }
  function spaceOf(n) { return Math.max(180, 224 - 42 * ramp(n) - Math.min(Math.max(0, n - 150), 200) * 0.03); }
  var STAGES = [
    { at: 0, fr: "Campagne de Terre sainte", en: "Holy Land countryside", sky: ["#f6c978", "#fbe6b4"], far: "#d9a867", mid: "#c58f4f", ground: ["#d8b06a", "#b88e4a"], pil: ["#d7b57a", "#b48c52", "#8e6a38"], line: ["Tu quittes la Terre sainte, l'épée au côté.", "You leave the Holy Land, sword at your side."] },
    { at: 20, fr: "Hameau", en: "Hamlet", sky: ["#9fd0ea", "#e8f3df"], far: "#8fb36f", mid: "#6f9a52", ground: ["#7fae52", "#5b8a3a"], pil: ["#b08a5a", "#8a6638", "#5e4220"], line: ["Quelques chaumières : le premier hameau est à toi !", "A few thatched huts: your first hamlet is yours!"] },
    { at: 45, fr: "Village", en: "Village", sky: ["#8ec6ee", "#eaf5e2"], far: "#7fa66a", mid: "#628f4d", ground: ["#78a64c", "#557f34"], pil: ["#c9a06a", "#9a7442", "#6a4a24"], line: ["Une église, un moulin : le village prospère.", "A church, a windmill: the village prospers."] },
    { at: 75, fr: "Bourg marchand", en: "Market town", sky: ["#86bfe8", "#f0f4e4"], far: "#8aa0b8", mid: "#6d86a0", ground: ["#7da04e", "#587a35"], pil: ["#b9b4a6", "#8f8a7c", "#615d52"], line: ["Remparts de bois et marché : un vrai bourg !", "Timber walls and a market: a proper town!"] },
    { at: 105, fr: "Ville fortifiée", en: "Fortified city", sky: ["#7cb4e2", "#f1efe0"], far: "#8c97ad", mid: "#6c7890", ground: ["#7a9c52", "#566f38"], pil: ["#c4c0b6", "#98948a", "#6c685e"], line: ["Des murailles de pierre et des tours !", "Stone walls and towers!"] },
    { at: 140, fr: "Domaine du château", en: "Castle domain", sky: ["#6aa6dc", "#f4ecd6"], far: "#8d8aa8", mid: "#6c6a8c", ground: ["#6f9a4c", "#4d6f34"], pil: ["#cfcabc", "#a29d8e", "#74705f"], line: ["Un château dresse ses donjons sur tes terres.", "A castle raises its keeps on your lands."] },
    { at: 170, fr: "Cité royale", en: "Royal city", sky: ["#f2b27a", "#fde7c0"], far: "#a8849a", mid: "#86668a", ground: ["#7a9a4a", "#556f30"], pil: ["#e8d9a8", "#c2ae72", "#8e7a3c"], line: ["Une cathédrale, des bannières : une cité royale !", "A cathedral, banners: a royal city!"] },
    { at: 200, fr: "Empire", en: "Empire", sky: ["#f0a860", "#fff0b8"], far: "#b07a8c", mid: "#8a5c7c", ground: ["#86a048", "#5a7430"], pil: ["#f2e3a0", "#d0b65c", "#9a8030"], line: ["Tu règnes sur un empire !", "You rule an empire!"] },
    { at: 240, fr: "Perse", en: "Persia", sky: ["#e8b86a", "#fbe3b0"], far: "#c9926a", mid: "#a8704c", ground: ["#d6b274", "#b48a4c"], pil: ["#e5cfa0", "#c2a468", "#8a7240"], line: ["Persépolis : colonnes de pierre et coupoles turquoise.", "Persepolis: stone columns and turquoise domes."] },
    { at: 285, fr: "Route de la soie", en: "Silk Road", sky: ["#f0c49a", "#fff0d0"], far: "#d4a070", mid: "#b88458", ground: ["#e0bc80", "#c09858"], pil: ["#d9b27a", "#b98a52", "#86602e"], line: ["La route de la soie : caravanes, dunes et yourtes.", "The Silk Road: caravans, dunes and yurts."] },
    { at: 335, fr: "Chine impériale", en: "Imperial China", sky: ["#a8cfe0", "#f0ebd8"], far: "#7fa39c", mid: "#6a8f88", ground: ["#86a85a", "#5f8038"], pil: ["#c0392b", "#9a2a20", "#6a1a14"], line: ["La Chine impériale : pagodes, lanternes et Grande Muraille.", "Imperial China: pagodas, lanterns and the Great Wall."] },
    { at: 400, fr: "Japon des shoguns", en: "Shogun Japan", sky: ["#f4c8d0", "#fff0ea"], far: "#9fa8c4", mid: "#7a86a8", ground: ["#8ab060", "#628a3e"], pil: ["#4a4a54", "#30303a", "#1a1a20"], line: ["Le Japon des shoguns : torii, cerisiers et mont Fuji.", "Shogun Japan: torii gates, cherry trees and Mount Fuji."] }
  ];
  function stageOf(n) { var s = 0; for (var i = 0; i < STAGES.length; i++) if (n >= STAGES[i].at) s = i; return s; }

  function create(canvas, opt) {
    var FR = opt.lang !== "en";
    H = Math.max(480, Math.min(800, Math.round(W * (window.innerHeight || 560) / (window.innerWidth || 360)))); GY = H - 70;
    canvas.style.aspectRatio = W + " / " + H;
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var raf = 0, dead = false, last = 0, t = 0, acc = 0;
    var st = null;
    var best = 0;
    var rnd = rngOf(opt.seed != null ? opt.seed : (Math.random() * 4294967296));

    function reset() {
      st = { y: Math.round(GY * 0.5), vy: 0, score: 0, over: false, started: false, scroll: 0, pipes: [], next: 330, parts: [], banner: null, shake: 0, flash: 0, endT: 0, rot: 0, flap: 0 };
      st.lastC = Math.round(GY * 0.5);
      addPipe(W + 120);
    }
    function addPipe(x) {
      var s = stageOf(st.score);
      var gap = gapOf(st.score);
      var speed = speedOf(st.score);
      var space = spaceOf(st.score);
      var T = space / speed; // secondes entre deux portes
      var fq = (1.3 + 0.95 * ramp(st.score) + Math.min(st.score, 150) * 0.004) * TS;
      var amp = st.score < 7 ? 0 : Math.min(34 * (1 - Math.exp(-(st.score - 6) / 12)), 56 / fq);
      var lo = 66 + gap / 2 + amp, hi = GY - 66 - gap / 2 - amp;
      var c = lo + rnd() * Math.max(0, hi - lo);
      if (st.lastC != null) {
        // la porte suivante doit rester atteignable : on borne le décalage vertical selon le temps disponible
        var slack = (st.lastAmp || 0) + amp; // les portes mobiles peuvent s'écarter dans le pire sens
        var up = Math.max(10, 58 * TS * T - slack * 0.6), down = Math.max(20, 150 * TS * T - slack * 0.6);
        c = Math.max(st.lastC - up, Math.min(st.lastC + down, c));
        c = Math.max(lo, Math.min(hi, c));
      }
      st.lastC = c; st.lastAmp = amp;
      var top = c - gap / 2;
      st.pipes.push({ x: x, base: top, top: top, gap: gap, passed: false, st: s, amp: amp, ph: rnd() * 6.28, fq: fq });
    }
    function flap() {
      if (dead) return;
      if (st.over) return;
      if (!st.started) st.started = true;
      st.vy = -FLAP; st.flap = 1;
      if (opt.sfx) opt.sfx("tap");
    }
    function burst(x, y, col, n) {
      for (var i = 0; i < n; i++) st.parts.push({ x: x, y: y, vx: (Math.random() - 0.5) * 4, vy: -Math.random() * 3 - 0.5, life: 1, c: col, s: 2 + Math.random() * 3 });
    }
    function die() {
      if (st.over) return;
      st.over = true; st.shake = 10; st.flash = 1; st.endT = 0;
      burst(KX, st.y, "#c9a24a", 18);
      if (opt.buzz) opt.buzz(30);
    }
    function point() {
      st.score++;
      if (opt.sfx && st.score % 5 === 0) opt.sfx("good");
      burst(KX + 30, st.y, "#f0c64b", 6);
      var a = stageOf(st.score - 1), b = stageOf(st.score);
      if (b !== a && st.score !== TOTAL) {
        st.banner = { t: 0, s: b };
        if (opt.sfx) opt.sfx("good");
        if (opt.buzz) opt.buzz(20);
      }
      if (st.score === TOTAL) { st.banner = { t: 0, s: 7, hunger: true }; burst(W / 2, 200, "#f0c64b", 50); if (opt.sfx) opt.sfx("good"); }
    }
    function finish(win) {
      st.over = true; st.win = win; st.endT = 0;
      if (win) { burst(W / 2, 200, "#f0c64b", 60); }
    }

    function update(dt) {
      t += dt;
      if (st.banner) { st.banner.t += dt; if (st.banner.t > 3.2) st.banner = null; }
      if (st.flash > 0) st.flash -= dt * 2;
      if (st.shake > 0) st.shake -= dt * 25;
      st.flap = Math.max(0, st.flap - dt * 4);
      st.parts.forEach(function (p) { p.x += p.vx * dt * 60; p.y += p.vy * dt * 60; p.vy += 0.12 * dt * 60; p.life -= dt * 1.3; });
      st.parts = st.parts.filter(function (p) { return p.life > 0; });
      if (st.over) {
        if (!st.sig) { st.sig = 1; if (opt.onOver) opt.onOver({ score: st.score, win: st.score >= TOTAL }); }
        st.endT += dt;
        if (!st.win) { st.vy += 0.5 * dt * 60 * 60; st.y = Math.min(GY - 14, st.y + st.vy * dt); st.rot += dt * 6; }
        if (st.endT > (st.win ? 2.6 : 1.1) && !st.done) {
          st.done = true;
          if (st.score > best) best = st.score;
          opt.onEnd({ score: st.score, win: st.score >= TOTAL, stage: stageOf(st.score), best: best });
        }
        return;
      }
      var speed = speedOf(st.score);
      if (!st.started) { st.y = Math.round(GY * 0.5) + Math.sin(t * 4) * 8; st.scroll += speed * 0.4 * dt; return; }
      st.vy += (st.vy < 0 ? GU : GD) * dt; if (st.vy > VMAX) st.vy = VMAX;
      st.y += st.vy * dt;
      st.rot = Math.max(-0.45, Math.min(0.6, st.vy / (480 * TS)));
      st.scroll += speed * dt;
      st.pipes.forEach(function (p) { p.x -= speed * dt; if (p.amp) { var lo = 66, hi = GY - 66 - p.gap; p.top = Math.max(lo, Math.min(hi, p.base + Math.sin(t * p.fq + p.ph) * p.amp)); } });
      var lastp = st.pipes[st.pipes.length - 1];
      if (lastp.x < W - spaceOf(st.score)) addPipe(W + 40);
      st.pipes = st.pipes.filter(function (p) { return p.x > -80; });
      st.pipes.forEach(function (p) {
        if (!p.passed && p.x + 54 < KX - 12) { p.passed = true; point(); }
        if (KX + 14 > p.x && KX - 14 < p.x + 54) {
          if (st.y - 12 < p.top || st.y + 14 > p.top + p.gap) die();
        }
      });
      if (st.y + 14 >= GY) { st.y = GY - 14; die(); }
      if (st.y - 14 < 0) { st.y = 14; st.vy = 0; }
    }

    /* ---------- dessin ---------- */
    function lerpCol(a, b, k) {
      var pa = [1, 3, 5].map(function (i) { return parseInt(a.substr(i, 2), 16); });
      var pb = [1, 3, 5].map(function (i) { return parseInt(b.substr(i, 2), 16); });
      return "rgb(" + pa.map(function (v, i) { return Math.round(v + (pb[i] - v) * k); }).join(",") + ")";
    }
    function rect(x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); }
    function poly(pts, c) { ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(pts[0], pts[1]); for (var i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]); ctx.closePath(); ctx.fill(); }

    function house(x, y, w, h, wall, roof, kind) {
      rect(x, y - h, w, h, wall);
      if (kind === "timber") { ctx.strokeStyle = "#5e4220"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y - h); ctx.lineTo(x + w, y); ctx.moveTo(x + w, y - h); ctx.lineTo(x, y); ctx.moveTo(x + w / 2, y - h); ctx.lineTo(x + w / 2, y); ctx.stroke(); }
      poly([x - 4, y - h, x + w / 2, y - h - h * 0.7, x + w + 4, y - h], roof);
      rect(x + w / 2 - 4, y - 16, 8, 16, "#4a3320");
      if (kind === "timber" || kind === "stone") rect(x + 5, y - h + 8, 7, 8, "#f3d98a");
    }
    function tree(x, y, s, c) { rect(x - 2, y - 14 * s, 4, 14 * s, "#6b4a28"); ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y - 20 * s, 11 * s, 0, 7); ctx.fill(); }
    function palm(x, y, s) {
      ctx.strokeStyle = "#7a5a30"; ctx.lineWidth = 4 * s; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 6 * s, y - 30 * s, x + 2 * s, y - 52 * s); ctx.stroke();
      ctx.strokeStyle = "#4f8a3a"; ctx.lineWidth = 3 * s;
      for (var i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(x + 2 * s, y - 52 * s); ctx.quadraticCurveTo(x + 2 * s + i * 12 * s, y - 66 * s, x + 2 * s + i * 20 * s, y - 46 * s + Math.abs(i) * 4 * s); ctx.stroke(); }
    }
    function tower(x, y, w, h, c, flag) {
      rect(x, y - h, w, h, c);
      for (var i = 0; i < 3; i++) rect(x + i * (w / 3) + 1, y - h - 7, w / 3 - 3, 8, c);
      rect(x + w / 2 - 3, y - h + 12, 6, 12, "#2b2a36");
      if (flag) { rect(x + w / 2, y - h - 28, 2, 22, "#443"); poly([x + w / 2 + 2, y - h - 28, x + w / 2 + 16, y - h - 22, x + w / 2 + 2, y - h - 16], "#b02a37"); }
    }
    function pagoda(x, y, w, n, wall, roof) {
      var cy = y;
      for (var i = 0; i < n; i++) {
        var ww = w * (1 - i * 0.14), xx = x + (w - ww) / 2, hh = 14;
        rect(xx + 3, cy - hh, ww - 6, hh, wall);
        var ry = cy - hh;
        poly([xx - 10, ry + 3, xx - 2, ry - 1, xx + ww / 2, ry - 9, xx + ww + 2, ry - 1, xx + ww + 10, ry + 3, xx + ww + 2, ry + 5, xx - 2, ry + 5], roof);
        cy = ry - 2;
      }
      rect(x + w / 2 - 1, cy - 14, 2, 14, "#d9b13a");
    }
    function camel(x, y, k) {
      ctx.fillStyle = "#9a6a3a"; ctx.strokeStyle = "#9a6a3a"; ctx.lineCap = "round";
      ctx.beginPath(); ctx.ellipse(x, y - 26 * k, 16 * k, 8 * k, 0, 0, 7); ctx.fill();
      ctx.beginPath(); ctx.arc(x - 4 * k, y - 33 * k, 6 * k, Math.PI, 0); ctx.arc(x + 7 * k, y - 33 * k, 5 * k, Math.PI, 0); ctx.fill();
      ctx.lineWidth = 5 * k; ctx.beginPath(); ctx.moveTo(x + 13 * k, y - 28 * k); ctx.quadraticCurveTo(x + 22 * k, y - 34 * k, x + 22 * k, y - 46 * k); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(x + 26 * k, y - 46 * k, 6 * k, 3 * k, 0.2, 0, 7); ctx.fill();
      ctx.lineWidth = 3 * k;
      for (var i = 0; i < 4; i++) { var lx = x - 10 * k + i * 7 * k, sw = Math.sin(t * 5 + i * 1.7) * 2 * k; ctx.beginPath(); ctx.moveTo(lx, y - 22 * k); ctx.lineTo(lx + sw, y); ctx.stroke(); }
      rect(x - 8 * k, y - 38 * k, 14 * k, 5 * k, "#b02a37");
    }
    function nearEast(s) {
      var i;
      if (s === 8) { // Perse
        palm(34, GY, 1);
        rect(80, GY - 40, 70, 40, "#e6d6b0"); ctx.fillStyle = "#2aa7b0"; ctx.beginPath(); ctx.arc(115, GY - 40, 26, Math.PI, 0); ctx.fill();
        rect(114, GY - 78, 2, 12, "#d9b13a"); ctx.fillStyle = "#2b3a58"; ctx.beginPath(); ctx.moveTo(105, GY); ctx.lineTo(105, GY - 18); ctx.arc(115, GY - 18, 10, Math.PI, 0); ctx.lineTo(125, GY); ctx.fill();
        rect(160, GY - 84, 8, 84, "#e6d6b0"); ctx.fillStyle = "#2aa7b0"; ctx.beginPath(); ctx.arc(164, GY - 84, 7, Math.PI, 0); ctx.fill();
        for (i = 0; i < 3; i++) { rect(207 + i * 34, GY - 60, 12, 60, "#d9c79a"); rect(204 + i * 34, GY - 66, 18, 6, "#c4ae7a"); }
        rect(200, GY - 74, 94, 8, "#c4ae7a"); rect(204, GY - 80, 86, 6, "#b89c64");
        ctx.fillStyle = "#2f5a3a"; ctx.beginPath(); ctx.ellipse(328, GY - 30, 7, 30, 0, 0, 7); ctx.fill();
      } else if (s === 9) { // route de la soie
        ctx.fillStyle = "#e0bc80"; ctx.beginPath(); ctx.moveTo(0, GY); ctx.quadraticCurveTo(60, GY - 34, 130, GY - 12); ctx.quadraticCurveTo(220, GY - 48, 300, GY - 10); ctx.quadraticCurveTo(330, GY - 4, 360, GY); ctx.fill();
        camel(70, GY, 1); camel(124, GY, 0.92); camel(172, GY, 0.96);
        ctx.strokeStyle = "#7a4a2a"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(92, GY - 36); ctx.lineTo(112, GY - 36); ctx.moveTo(144, GY - 35); ctx.lineTo(160, GY - 35); ctx.stroke();
        rect(246, GY - 20, 46, 20, "#efe6d0"); poly([242, GY - 20, 269, GY - 46, 296, GY - 20], "#e4d9bc"); rect(246, GY - 12, 46, 4, "#b02a37"); rect(264, GY - 14, 10, 14, "#7a4a2a");
        rect(322, GY - 30, 3, 30, "#6a4a2a"); poly([325, GY - 30, 345, GY - 25, 325, GY - 20], "#b02a37");
      } else if (s === 10) { // Chine
        rect(0, GY - 30, 360, 30, "#b9a98a"); for (i = 0; i < 18; i++) rect(i * 20 + 3, GY - 38, 12, 9, "#b9a98a");
        rect(30, GY - 64, 42, 64, "#a8987a"); poly([20, GY - 64, 30, GY - 70, 51, GY - 84, 72, GY - 70, 82, GY - 64, 72, GY - 60, 30, GY - 60], "#9a2a20"); rect(46, GY - 50, 10, 16, "#3a2a22");
        pagoda(130, GY, 40, 3, "#e9d9b0", "#9a2a20");
        for (i = 0; i < 2; i++) { var lx = 220 + i * 34; ctx.strokeStyle = "#5a3a22"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(lx, GY - 70); ctx.lineTo(lx, GY - 54); ctx.stroke(); ctx.fillStyle = "#d9322b"; ctx.beginPath(); ctx.ellipse(lx, GY - 46, 8, 10, 0, 0, 7); ctx.fill(); rect(lx - 5, GY - 58, 10, 3, "#d9b13a"); }
        for (i = 0; i < 4; i++) { var bh = 70 + (i % 2) * 16; rect(288 + i * 10, GY - bh, 4, bh, "#4f8a3a"); for (var kn = GY - bh + 14; kn < GY; kn += 20) rect(287 + i * 10, kn, 6, 2, "#2f5a22"); }
      } else { // Japon
        rect(34, GY - 60, 7, 60, "#c0392b"); rect(70, GY - 60, 7, 60, "#c0392b"); rect(30, GY - 50, 51, 4, "#c0392b");
        poly([24, GY - 62, 87, GY - 62, 82, GY - 72, 29, GY - 72], "#26262c");
        pagoda(130, GY, 34, 5, "#efe3c8", "#3a3a44");
        rect(206, GY - 16, 6, 16, "#9a9a9a"); rect(202, GY - 24, 14, 8, "#9a9a9a"); poly([199, GY - 24, 209, GY - 34, 219, GY - 24], "#7a7a7a");
        rect(252, GY - 32, 6, 32, "#5a3a2a"); ctx.fillStyle = "#f4a8bc";
        [[255, GY - 44, 17], [241, GY - 36, 13], [269, GY - 36, 13], [255, GY - 56, 11]].forEach(function (c) { ctx.beginPath(); ctx.arc(c[0], c[1], c[2], 0, 7); ctx.fill(); });
        rect(318, GY - 22, 4, 22, "#5a3a2a"); ctx.fillStyle = "#f7b9ca"; ctx.beginPath(); ctx.arc(320, GY - 30, 11, 0, 7); ctx.arc(311, GY - 24, 8, 0, 7); ctx.arc(329, GY - 24, 8, 0, 7); ctx.fill();
      }
    }
    function nearScene(s, ox) {
      // éléments répétés sur 360 px, défilant à vitesse moyenne
      var o = -(ox % W);
      for (var k = 0; k < 2; k++) {
        var x0 = o + k * W;
        ctx.save(); ctx.translate(x0, 0);
        var wall = STAGES[s].pil[0], dark = STAGES[s].pil[2];
        if (s === 0) { palm(40, GY, 1); palm(78, GY, 0.8); poly([160, GY, 200, GY - 24, 240, GY], "#b98d4a"); house(250, GY, 30, 22, "#e7d6a8", "#d1b079", "plain"); palm(320, GY, 1.1); }
        else if (s === 1) { house(30, GY, 34, 22, "#c9a77a", "#a6803f", "plain"); house(100, GY, 28, 18, "#c9a77a", "#a6803f", "plain"); tree(170, GY, 1, "#4f8a3a"); house(220, GY, 36, 24, "#c9a77a", "#a6803f", "plain"); tree(300, GY, 0.9, "#5a9a40"); }
        else if (s === 2) { house(20, GY, 40, 28, "#e6d3a8", "#9a3b2e", "timber"); rect(82, GY - 48, 26, 48, "#d9cdb4"); poly([80, GY - 48, 95, GY - 78, 110, GY - 48], "#6a4a3a"); house(130, GY, 38, 26, "#e6d3a8", "#9a3b2e", "timber"); rect(214, GY - 40, 8, 40, "#8a6a40"); ctx.strokeStyle = "#5a3d20"; ctx.lineWidth = 3; ctx.beginPath(); var a = t * 1.5; ctx.moveTo(218 - Math.cos(a) * 24, GY - 40 - Math.sin(a) * 24); ctx.lineTo(218 + Math.cos(a) * 24, GY - 40 + Math.sin(a) * 24); ctx.moveTo(218 - Math.sin(a) * 24, GY - 40 + Math.cos(a) * 24); ctx.lineTo(218 + Math.sin(a) * 24, GY - 40 - Math.cos(a) * 24); ctx.stroke(); house(270, GY, 40, 28, "#e6d3a8", "#9a3b2e", "timber"); }
        else if (s === 3) { house(10, GY, 40, 34, "#e0d2ac", "#8e3a2c", "timber"); house(62, GY, 36, 40, "#d8caa4", "#7a3328", "timber"); rect(120, GY - 56, 30, 56, "#bdb8aa"); poly([116, GY - 56, 135, GY - 90, 154, GY - 56], "#555a66"); house(176, GY, 44, 34, "#e0d2ac", "#8e3a2c", "timber"); rect(240, GY - 18, 70, 18, "#8a6638"); rect(244, GY - 34, 62, 16, "#c9503c"); rect(300, GY - 60, 8, 60, "#6a4a28"); }
        else if (s === 4) { rect(0, GY - 54, 360, 54, "#a9a59a"); for (var i = 0; i < 18; i++) rect(i * 20 + 2, GY - 62, 12, 10, "#a9a59a"); tower(40, GY, 42, 100, "#b4b0a4", true); tower(250, GY, 44, 112, "#b4b0a4", true); house(130, GY - 54, 40, 30, "#d8caa4", "#8e3a2c", "stone"); house(190, GY - 54, 36, 24, "#d8caa4", "#7a3328", "stone"); }
        else if (s === 5) { rect(30, GY - 90, 290, 90, "#b9b4a8"); for (var j = 0; j < 14; j++) rect(30 + j * 21 + 2, GY - 100, 13, 11, "#b9b4a8"); tower(14, GY, 46, 140, "#a8a396", true); tower(300, GY, 46, 140, "#a8a396", true); rect(150, GY - 160, 60, 160, "#aeab9e"); for (var m = 0; m < 4; m++) rect(150 + m * 16, GY - 168, 11, 10, "#aeab9e"); poly([145, GY - 160, 180, GY - 214, 215, GY - 160], "#7a2a34"); rect(172, GY - 60, 16, 60, "#3a2e22"); rect(177, GY - 215, 2, 24, "#443"); poly([179, GY - 215, 196, GY - 208, 179, GY - 201], "#d9b13a"); }
        else if (s >= 8) { nearEast(s); }
        else { rect(0, GY - 40, 360, 40, "#d8c690"); for (var q = 0; q < 6; q++) { rect(q * 62 + 12, GY - 70, 34, 70, "#eadba8"); poly([q * 62 + 8, GY - 70, q * 62 + 29, GY - 104, q * 62 + 50, GY - 70], q % 2 ? "#9a2f3c" : "#2f5a9a"); rect(q * 62 + 28, GY - 128, 2, 24, "#443"); poly([q * 62 + 30, GY - 128, q * 62 + 44, GY - 122, q * 62 + 30, GY - 116], q % 2 ? "#d9b13a" : "#b02a37"); } rect(150, GY - 190, 62, 190, "#efe2b4"); poly([142, GY - 190, 181, GY - 262, 220, GY - 190], "#c9a24a"); rect(176, GY - 70, 12, 70, "#6a4a22"); ctx.fillStyle = "#6aa2e0"; ctx.beginPath(); ctx.arc(181, GY - 138, 12, 0, 7); ctx.fill(); }
        ctx.restore();
      }
    }
    function farScene(s, ox) {
      var o = -(ox % W);
      ctx.fillStyle = STAGES[s].far;
      for (var k = 0; k < 2; k++) {
        ctx.beginPath(); ctx.moveTo(o + k * W, GY);
        for (var x = 0; x <= W; x += 20) ctx.lineTo(o + k * W + x, GY - 70 - Math.sin(x * 0.03 + 1) * 24 - Math.sin(x * 0.08) * 10 - (s >= 4 ? 20 : 0));
        ctx.lineTo(o + k * W + W, GY); ctx.fill();
      }
      if (s === 11 || s === 10) {
        for (var k3 = 0; k3 < 2; k3++) {
          var b0 = o + k3 * W;
          if (s === 11) { poly([b0 + 110, GY - 66, b0 + 190, GY - 156, b0 + 270, GY - 66], "#b3bcd6"); poly([b0 + 168, GY - 133, b0 + 190, GY - 156, b0 + 212, GY - 133, b0 + 200, GY - 128, b0 + 190, GY - 136, b0 + 178, GY - 128], "#f4f6fb"); }
          else { ctx.fillStyle = "#7a9d96"; [60, 190, 300].forEach(function (x0, q) { ctx.beginPath(); ctx.moveTo(b0 + x0 - 24, GY - 56); ctx.quadraticCurveTo(b0 + x0 - 14, GY - 120 - q * 10, b0 + x0, GY - 132 - q * 8); ctx.quadraticCurveTo(b0 + x0 + 14, GY - 120, b0 + x0 + 24, GY - 56); ctx.fill(); }); }
        }
      }
      ctx.fillStyle = STAGES[s].mid;
      for (var k2 = 0; k2 < 2; k2++) {
        ctx.beginPath(); ctx.moveTo(o * 1.6 + k2 * W, GY);
        var oo = (-(ox * 1.6) % W) + k2 * W;
        ctx.moveTo(oo, GY);
        for (var x2 = 0; x2 <= W; x2 += 20) ctx.lineTo(oo + x2, GY - 36 - Math.sin(x2 * 0.05 + 2) * 14);
        ctx.lineTo(oo + W, GY); ctx.fill();
      }
    }
    function drawBg() {
      var s = stageOf(st.score), s2 = Math.min(s + 1, STAGES.length - 1);
      var prog = s2 === s ? 0 : Math.max(0, (st.score - STAGES[s].at) / (STAGES[s2].at - STAGES[s].at));
      var k = Math.max(0, (prog - 0.8) * 5); // fondu progressif vers le ciel suivant
      var g = ctx.createLinearGradient(0, 0, 0, GY);
      g.addColorStop(0, lerpCol(STAGES[s].sky[0], STAGES[s2].sky[0], k));
      g.addColorStop(1, lerpCol(STAGES[s].sky[1], STAGES[s2].sky[1], k));
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      // soleil
      ctx.fillStyle = "rgba(255,248,214,0.9)"; ctx.beginPath(); ctx.arc(280, 90, s === 6 ? 44 : 30, 0, 7); ctx.fill();
      // nuages
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      for (var i = 0; i < 4; i++) { var cx = ((i * 140 - st.scroll * 0.15) % (W + 120) + W + 120) % (W + 120) - 60, cy = 70 + (i * 47) % 120; ctx.beginPath(); ctx.arc(cx, cy, 14, 0, 7); ctx.arc(cx + 16, cy + 3, 11, 0, 7); ctx.arc(cx - 15, cy + 4, 10, 0, 7); ctx.fill(); }
      farScene(s, st.scroll * 0.2);
      nearScene(s, st.scroll * 0.5);
      // sol
      var gg = ctx.createLinearGradient(0, GY, 0, H);
      gg.addColorStop(0, STAGES[s].ground[0]); gg.addColorStop(1, STAGES[s].ground[1]);
      ctx.fillStyle = gg; ctx.fillRect(0, GY, W, H - GY);
      ctx.fillStyle = "rgba(0,0,0,0.12)";
      for (var j = 0; j < 12; j++) { var gx = ((j * 40 - st.scroll) % W + W) % W; ctx.fillRect(gx, GY + 14 + (j % 3) * 18, 20, 3); }
      if (s >= 2) { ctx.fillStyle = "rgba(0,0,0,0.18)"; ctx.fillRect(0, GY, W, 3); }
    }
    function drawPipe(p) {
      var c = STAGES[p.st].pil, s = p.st;
      function shade(x, y, w, h) {
        var g = ctx.createLinearGradient(x, 0, x + w, 0);
        g.addColorStop(0, c[1]); g.addColorStop(0.28, c[0]); g.addColorStop(0.62, c[0]); g.addColorStop(1, c[2]);
        ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
      }
      function orn(x, y, w, h) {
        ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
        ctx.strokeStyle = "rgba(0,0,0,0.18)"; ctx.fillStyle = "rgba(0,0,0,0.18)"; ctx.lineWidth = 1.5;
        var k;
        if (s === 0) { // grès sculpté : bandes à motifs et fissures
          for (k = y + 14; k < y + h; k += 34) { ctx.fillRect(x, k, w, 5); for (var m = 0; m < 4; m++) { ctx.beginPath(); ctx.moveTo(x + 8 + m * 12, k + 9); ctx.lineTo(x + 14 + m * 12, k + 17); ctx.lineTo(x + 20 + m * 12, k + 9); ctx.stroke(); } }
        } else if (s === 1) { // troncs liés de cordes
          for (k = x + 13; k < x + w; k += 13) { ctx.beginPath(); ctx.moveTo(k, y); ctx.lineTo(k, y + h); ctx.stroke(); }
          for (k = y + 20; k < y + h; k += 42) { ctx.strokeStyle = "#e6d4a0"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, k); ctx.lineTo(x + w, k + 4); ctx.stroke(); ctx.strokeStyle = "rgba(0,0,0,0.25)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, k + 3); ctx.lineTo(x + w, k + 7); ctx.stroke(); }
        } else if (s === 2) { // colombages
          for (k = y + 10; k < y + h; k += 44) { ctx.strokeStyle = "#4a3320"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, k); ctx.lineTo(x + w, k); ctx.moveTo(x, k); ctx.lineTo(x + w, k + 44); ctx.stroke(); }
          ctx.fillStyle = "#6b6e76"; for (k = y + 24; k < y + h; k += 44) { ctx.beginPath(); ctx.arc(x + 8, k, 2, 0, 7); ctx.arc(x + w - 8, k, 2, 0, 7); ctx.fill(); }
        } else if (s === 3 || s === 4) { // pierre taillée + meurtrières
          for (k = y + 12; k < y + h; k += 18) { ctx.beginPath(); ctx.moveTo(x, k); ctx.lineTo(x + w, k); ctx.stroke(); var off = ((k - y) / 18) % 2 ? 12 : 26; ctx.beginPath(); ctx.moveTo(x + off, k); ctx.lineTo(x + off, k + 18); ctx.stroke(); }
          ctx.fillStyle = "#23212c"; for (k = y + 40; k < y + h; k += 90) { ctx.fillRect(x + w / 2 - 3, k, 6, 20); ctx.fillRect(x + w / 2 - 8, k + 7, 16, 5); }
        } else if (s === 5) { // tour de garde avec blason
          for (k = y + 12; k < y + h; k += 16) { ctx.beginPath(); ctx.moveTo(x, k); ctx.lineTo(x + w, k); ctx.stroke(); }
          for (k = y + 52; k < y + h; k += 120) { ctx.fillStyle = "#7a2a34"; ctx.beginPath(); ctx.moveTo(x + 12, k); ctx.lineTo(x + w - 12, k); ctx.lineTo(x + w - 12, k + 16); ctx.lineTo(x + w / 2, k + 30); ctx.lineTo(x + 12, k + 16); ctx.fill(); ctx.fillStyle = "#f0c64b"; ctx.beginPath(); ctx.arc(x + w / 2, k + 12, 5, 0, 7); ctx.fill(); }
        } else if (s === 8) { // faïences turquoise
          for (k = y + 10; k < y + h; k += 24) { ctx.fillStyle = "rgba(42,167,176,0.75)"; ctx.fillRect(x + 4, k, w - 8, 14); ctx.fillStyle = "rgba(255,255,255,0.7)"; ctx.beginPath(); ctx.moveTo(x + w / 2, k + 1); ctx.lineTo(x + w - 8, k + 7); ctx.lineTo(x + w / 2, k + 13); ctx.lineTo(x + 8, k + 7); ctx.closePath(); ctx.fill(); }
        } else if (s === 9) { // tentures de caravane
          for (k = y + 8; k < y + h; k += 30) { ctx.fillStyle = (((k - y) / 30) | 0) % 2 ? "rgba(176,42,55,0.8)" : "rgba(40,70,140,0.75)"; ctx.fillRect(x, k, w, 12); ctx.fillStyle = "rgba(240,198,75,0.9)"; ctx.fillRect(x, k + 12, w, 2); }
        } else if (s === 10) { // laque rouge, bandes d'or
          for (k = y + 14; k < y + h; k += 52) { ctx.fillStyle = "#e6b93a"; ctx.fillRect(x, k, w, 5); ctx.beginPath(); ctx.arc(x + w / 2, k + 24, 8, 0, 7); ctx.strokeStyle = "rgba(240,198,75,0.9)"; ctx.lineWidth = 2; ctx.stroke(); }
        } else if (s === 11) { // bois sombre, treillis blanc
          ctx.strokeStyle = "rgba(245,240,230,0.7)"; ctx.lineWidth = 2;
          for (k = y + 10; k < y + h; k += 28) { ctx.strokeRect(x + 6, k, w - 12, 20); ctx.beginPath(); ctx.moveTo(x + w / 2, k); ctx.lineTo(x + w / 2, k + 20); ctx.moveTo(x + 6, k + 10); ctx.lineTo(x + w - 6, k + 10); ctx.stroke(); }
        } else { // colonnes cannelées dorées et gemmes
          ctx.strokeStyle = "rgba(255,255,255,0.35)"; ctx.lineWidth = 2;
          for (k = x + 10; k < x + w - 4; k += 10) { ctx.beginPath(); ctx.moveTo(k, y); ctx.lineTo(k, y + h); ctx.stroke(); }
          for (k = y + 40; k < y + h; k += 110) { ctx.fillStyle = s === 7 ? "#8a3ad9" : "#c9322b"; ctx.beginPath(); ctx.moveTo(x + w / 2, k - 8); ctx.lineTo(x + w / 2 + 7, k); ctx.lineTo(x + w / 2, k + 8); ctx.lineTo(x + w / 2 - 7, k); ctx.fill(); ctx.strokeStyle = "#fff6c8"; ctx.lineWidth = 1.5; ctx.stroke(); }
        }
        ctx.restore();
      }
      function col(x, y, w, h, capTop) {
        shade(x, y, w, h); orn(x, y, w, h);
        // base / chapiteau massif avec relief
        var cy2 = capTop ? y + h - 20 : y;
        shade(x - 7, cy2, w + 14, 20);
        rect(x - 7, cy2, w + 14, 4, "rgba(255,255,255,0.35)"); rect(x - 7, cy2 + 16, w + 14, 4, "rgba(0,0,0,0.3)");
        if (s >= 5) { rect(x - 7, cy2 + 8, w + 14, 3, "#f0c64b"); }
        if (s === 8) { rect(x - 7, cy2 + 6, w + 14, 8, "#2aa7b0"); }
        if (s === 9) { for (var tq = 0; tq < 5; tq++) rect(x - 7 + tq * 13, cy2 + 5, 7, 10, tq % 2 ? "#b02a37" : "#e6b93a"); }
        if (s === 10 || s === 11) { // toit aux bords relevés, tourné vers l'ouverture
          var dn = capTop ? 1 : -1, y0 = capTop ? cy2 + 20 : cy2, rc = s === 10 ? "#9a2a20" : "#2a2a32";
          poly([x - 20, y0 - dn * 3, x - 12, y0 - dn * 8, x - 7, y0 - dn * 12, x + w + 7, y0 - dn * 12, x + w + 12, y0 - dn * 8, x + w + 20, y0 - dn * 3, x + w + 8, y0 + dn * 1, x - 8, y0 + dn * 1], rc);
          rect(x - 7, y0 - dn * 12 - (dn > 0 ? 0 : 0), w + 14, 2, "#e6b93a");
        }
        if (s >= 3 && s < 8) { var cr = capTop ? cy2 + 20 : cy2 - 10; for (var q = 0; q < 4; q++) { shade(x - 7 + q * 17, cr, 11, 10); } }
        // ombre portée sous le chapiteau
        var sg = ctx.createLinearGradient(0, capTop ? cy2 + 20 : cy2 - 14, 0, capTop ? cy2 + 34 : cy2);
        sg.addColorStop(capTop ? 0 : 1, "rgba(0,0,0,0.28)"); sg.addColorStop(capTop ? 1 : 0, "rgba(0,0,0,0)");
        ctx.fillStyle = sg; ctx.fillRect(x, capTop ? cy2 + 20 : cy2 - 14, w, 14);
      }
      col(p.x, -4, 54, p.top + 4, true);
      col(p.x, p.top + p.gap, 54, GY - p.top - p.gap, false);
    }
    function drawKnight(x, y, rot, tier, flapK) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(0.92, 0.92);
      var gold = tier >= 5;
      var bodyC = tier >= 5 ? "#e6c14a" : tier >= 2 ? "#aab4c2" : "#8a5a3a";
      var horseC = tier >= 6 ? "#f4f0e6" : tier >= 4 ? "#241a1a" : tier >= 2 ? "#3a2a22" : "#6a4a32";
      var leg = Math.sin(t * 14) * 5 * (st.started ? 1 : 0.4) + flapK * 4;
      // cheval de guerre : puissant, crinière en flammes, œil rouge
      var bob = Math.sin(t * 14) * 1.2;
      var dark = tier >= 6 ? "#d8d2c4" : "#2c1c14";
      // jambes (galop)
      ctx.lineCap = "round"; ctx.lineJoin = "round";
      function legp(x0, k, col) { ctx.strokeStyle = col; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x0, 14); ctx.lineTo(x0 + 8 + leg * k, 22); ctx.lineTo(x0 + 2 + leg * k * 1.6, 31); ctx.stroke(); ctx.lineWidth = 7; ctx.strokeStyle = "#1a1210"; ctx.beginPath(); ctx.moveTo(x0 + 2 + leg * k * 1.6, 31); ctx.lineTo(x0 + 3 + leg * k * 1.6, 32); ctx.stroke(); }
      legp(-14, 1, dark); legp(14, -1, dark);
      // queue
      ctx.strokeStyle = "#b02a37"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-22, 2); ctx.quadraticCurveTo(-38, -2 + Math.sin(t * 12) * 4, -42, 10 + Math.sin(t * 12 + 1) * 5); ctx.stroke();
      ctx.strokeStyle = "#f0902a"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-22, 3); ctx.quadraticCurveTo(-34, 2 + Math.sin(t * 12) * 4, -37, 12 + Math.sin(t * 12 + 1) * 5); ctx.stroke();
      // corps musclé
      ctx.fillStyle = horseC;
      ctx.beginPath(); ctx.moveTo(-24, 4); ctx.quadraticCurveTo(-26, -8 + bob, -8, -6 + bob); ctx.quadraticCurveTo(8, -9 + bob, 20, -6); ctx.quadraticCurveTo(28, 0, 24, 12); ctx.quadraticCurveTo(0, 22, -22, 14); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.12)"; ctx.beginPath(); ctx.ellipse(-4, -1, 14, 4, 0, 0, 7); ctx.fill();
      legp(-4, -1, horseC); legp(22, 1, horseC);
      // encolure + tête
      ctx.fillStyle = horseC; ctx.beginPath(); ctx.moveTo(14, -6); ctx.quadraticCurveTo(26, -22, 30, -24); ctx.lineTo(36, -16); ctx.quadraticCurveTo(28, -6, 26, 6); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(28, -26); ctx.quadraticCurveTo(40, -30, 48, -16); ctx.lineTo(44, -11); ctx.quadraticCurveTo(38, -16, 33, -14); ctx.closePath(); ctx.fill();
      // chanfrein d'acier
      ctx.fillStyle = tier >= 5 ? "#e6c14a" : "#9aa4b2"; ctx.beginPath(); ctx.moveTo(34, -28); ctx.lineTo(48, -17); ctx.lineTo(45, -13); ctx.lineTo(32, -22); ctx.closePath(); ctx.fill();
      poly([33, -29, 36, -36, 38, -29], tier >= 5 ? "#f0d060" : "#b8c0cc");
      // œil rouge + naseau
      ctx.fillStyle = "#ff3b2a"; ctx.beginPath(); ctx.arc(37, -21, 2.2, 0, 7); ctx.fill();
      ctx.fillStyle = "#1a1210"; ctx.beginPath(); ctx.arc(45, -14, 1.3, 0, 7); ctx.fill();
      // crinière de flammes
      for (var mi = 0; mi < 5; mi++) { var fx = 14 + mi * 4, fy = -8 - mi * 3.4; ctx.fillStyle = mi % 2 ? "#f0902a" : "#d9322b"; ctx.beginPath(); ctx.moveTo(fx, fy); ctx.quadraticCurveTo(fx - 12, fy - 4 + Math.sin(t * 14 + mi) * 4, fx - 18, fy + 5 + Math.sin(t * 14 + mi * 2) * 5); ctx.lineTo(fx - 3, fy + 5); ctx.closePath(); ctx.fill(); }
      // sabots en feu / poussière
      if (st.started && !st.over) { ctx.fillStyle = "rgba(240,144,42," + (0.35 + 0.25 * Math.sin(t * 20)) + ")"; ctx.beginPath(); ctx.ellipse(-34, 14 + Math.sin(t * 18) * 2, 9, 4, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(-46, 10 + Math.sin(t * 16) * 2, 6, 3, 0, 0, 7); ctx.fill(); }
      // housse du cheval
      if (tier >= 3) { poly([-14, 2, 14, 2, 17, 18, -16, 18], tier >= 5 ? "#b02a37" : "#2f5a9a"); rect(-14, 2, 28, 3, "#f0c64b"); }
      // cape
      if (tier >= 4) { ctx.fillStyle = "#b02a37"; ctx.beginPath(); ctx.moveTo(-6, -14); ctx.quadraticCurveTo(-30, -6 + Math.sin(t * 10) * 3, -34, 4 + Math.sin(t * 10 + 1) * 4); ctx.lineTo(-8, -2); ctx.fill(); }
      // chevalier
      rect(-8, -16, 14, 18, bodyC);
      if (tier >= 2) { ctx.strokeStyle = "rgba(0,0,0,0.25)"; ctx.lineWidth = 1; for (var i = -12; i < 0; i += 4) { ctx.beginPath(); ctx.moveTo(-8, i); ctx.lineTo(6, i); ctx.stroke(); } }
      if (tier >= 1) { poly([-12, -14, -4, -14, -4, -2, -8, 2, -12, -2], tier >= 5 ? "#b02a37" : "#c9503c"); ctx.strokeStyle = "#f0c64b"; ctx.lineWidth = 1.5; ctx.stroke(); }
      // tête / casque
      ctx.fillStyle = tier >= 1 ? (gold ? "#f0d060" : "#c9d0da") : "#e8c19a";
      ctx.beginPath(); ctx.arc(0, -24, 8, 0, 7); ctx.fill();
      if (tier >= 1) { rect(-1, -26, 9, 3, "#2b2a36"); }
      else { rect(-8, -30, 16, 5, "#8a3a2a"); }
      if (tier >= 3) { ctx.fillStyle = tier >= 5 ? "#b02a37" : "#2f5a9a"; ctx.beginPath(); ctx.moveTo(-3, -32); ctx.quadraticCurveTo(-14, -42 + Math.sin(t * 9) * 2, -22, -30 + Math.sin(t * 9) * 3); ctx.lineTo(-4, -28); ctx.fill(); }
      if (tier >= 6) { poly([-6, -31, -6, -39, -2, -35, 0, -41, 2, -35, 6, -39, 6, -31], "#f0c64b"); }
      // bouclier
      if (tier >= 2) { ctx.fillStyle = tier >= 5 ? "#b02a37" : "#2f5a9a"; ctx.beginPath(); ctx.moveTo(-14, -12); ctx.lineTo(-4, -12); ctx.lineTo(-4, 0); ctx.lineTo(-9, 6); ctx.lineTo(-14, 0); ctx.fill(); ctx.strokeStyle = "#f0c64b"; ctx.lineWidth = 1.5; ctx.stroke(); }
      // lance + bannière
      ctx.strokeStyle = "#6a4a22"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(4, -6); ctx.lineTo(34, -26); ctx.stroke();
      poly([34, -26, 52, -22 + Math.sin(t * 8) * 2, 34, -16], tier >= 5 ? "#d9b13a" : "#b02a37");
      ctx.restore();
    }
    function hud() {
      var s = stageOf(st.score);
      ctx.fillStyle = "rgba(30,18,6,0.55)"; ctx.fillRect(0, 0, W, 44);
      ctx.fillStyle = "#f4e6c0"; ctx.font = "700 16px Georgia, serif"; ctx.textAlign = "left";
      ctx.fillText((FR ? "Territoires " : "Territories ") + st.score + (st.score >= TOTAL ? " ★" : ""), 12, 20);
      ctx.fillStyle = "#e6c36a"; ctx.font = "13px Georgia, serif";
      ctx.fillText(FR ? STAGES[s].fr : STAGES[s].en, 12, 37);
      ctx.fillStyle = "rgba(255,255,255,0.2)"; ctx.fillRect(W - 112, 14, 100, 10);
      ctx.fillStyle = "#f0c64b"; var s1 = STAGES[s + 1], prg = s1 ? (st.score - STAGES[s].at) / (s1.at - STAGES[s].at) : ((st.score - STAGES[s].at) % 100) / 100;
      ctx.fillRect(W - 112, 14, 100 * Math.max(0, Math.min(1, prg)), 10);
      ctx.strokeStyle = "#f4e6c0"; ctx.lineWidth = 1; ctx.strokeRect(W - 112.5, 13.5, 101, 11);
      ctx.textAlign = "center"; ctx.lineJoin = "round";
      var big = String(st.score), by = 112;
      ctx.font = "900 64px Georgia, serif"; ctx.lineWidth = 9; ctx.strokeStyle = "#2a1a08"; ctx.strokeText(big, W / 2, by);
      ctx.fillStyle = st.score >= TOTAL ? "#ffd84a" : "#fffaf0"; ctx.fillText(big, W / 2, by);
      if (!st.over) { ctx.font = "700 12px Georgia, serif"; ctx.lineWidth = 4; ctx.strokeStyle = "#2a1a08"; var sub = FR ? "territoires" : "territories"; ctx.strokeText(sub, W / 2, by + 18); ctx.fillStyle = "#f4e6c0"; ctx.fillText(sub, W / 2, by + 18); }
      if (!st.started && !st.over) {
        ctx.fillStyle = "rgba(30,18,6,0.6)"; ctx.fillRect(40, 330, W - 80, 54);
        ctx.fillStyle = "#fff3d6"; ctx.font = "700 18px Georgia, serif";
        ctx.fillText(FR ? "Touche pour bondir !" : "Tap to leap!", W / 2, 354);
        ctx.font = "13px Georgia, serif"; ctx.fillStyle = "#e6c36a";
        ctx.fillText(FR ? "Passe entre les obstacles : 1 porte = 1 territoire" : "Pass between obstacles: 1 gate = 1 territory", W / 2, 373);
      }
      if (st.banner) {
        var b = st.banner, a = Math.min(1, b.t * 3, (3.2 - b.t) * 3);
        ctx.globalAlpha = Math.max(0, a);
        ctx.fillStyle = "rgba(90,20,30,0.88)"; ctx.fillRect(14, 96, W - 28, 74);
        ctx.strokeStyle = "#f0c64b"; ctx.lineWidth = 2; ctx.strokeRect(14, 96, W - 28, 74);
        ctx.fillStyle = "#ffd98a"; ctx.font = "700 20px Georgia, serif";
        ctx.fillText(b.hunger ? (FR ? "Victoire ! 200 territoires" : "Victory! 200 territories") : (FR ? STAGES[b.s].fr : STAGES[b.s].en), W / 2, 126);
        ctx.fillStyle = "#fff3d6"; ctx.font = "14px Georgia, serif";
        wrap(b.hunger ? (FR ? "Un guerrier a toujours plus faim… la chevauchée continue !" : "A warrior is always hungrier… the ride goes on!") : (FR ? STAGES[b.s].line[0] : STAGES[b.s].line[1]), W / 2, 148, W - 56, 17);
        ctx.globalAlpha = 1;
      }
      ctx.textAlign = "left";
    }
    function wrap(text, x, y, mw, lh) {
      var words = text.split(" "), line = "";
      for (var i = 0; i < words.length; i++) {
        var test = line ? line + " " + words[i] : words[i];
        if (ctx.measureText(test).width > mw && line) { ctx.fillText(line, x, y); line = words[i]; y += lh; } else line = test;
      }
      ctx.fillText(line, x, y);
    }
    function draw() {
      ctx.save();
      if (st.shake > 0) ctx.translate((Math.random() - 0.5) * st.shake, (Math.random() - 0.5) * st.shake);
      drawBg();
      st.pipes.forEach(drawPipe);
      drawKnight(KX, st.y, st.rot, stageOf(st.score), st.flap);
      st.parts.forEach(function (p) { ctx.globalAlpha = Math.max(0, p.life); ctx.fillStyle = p.c; ctx.fillRect(p.x, p.y, p.s, p.s); });
      ctx.globalAlpha = 1;
      ctx.restore();
      hud();
      if (st.flash > 0) { ctx.fillStyle = "rgba(255,255,255," + Math.max(0, st.flash * 0.6) + ")"; ctx.fillRect(0, 0, W, H); }
      if (false) { ctx.fillStyle = "#ffd98a"; ctx.font = "700 26px Georgia, serif"; ctx.textAlign = "center"; ctx.fillText(FR ? "200 territoires !" : "200 territories!", W / 2, 250); ctx.textAlign = "left"; }
    }

    function loop(ts) {
      if (dead) return;
      var dt = Math.min(0.033, (ts - (last || ts)) / 1000); last = ts;
      acc += dt; while (acc >= STEP) { update(STEP); acc -= STEP; } draw();
      raf = requestAnimationFrame(loop);
    }
    function onDown(e) { e.preventDefault(); flap(); }
    function onKey(e) { if (e.code === "Space" || e.code === "ArrowUp") { e.preventDefault(); flap(); } }
    canvas.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    reset();
    draw();
    return {
      start: function () { reset(); last = 0; cancelAnimationFrame(raf); raf = requestAnimationFrame(loop); },
      destroy: function () { dead = true; cancelAnimationFrame(raf); canvas.removeEventListener("pointerdown", onDown); window.removeEventListener("keydown", onKey); },
      _state: function () { return st; },
      _step: function (n) { for (var i = 0; i < n; i++) update(STEP); },
      _flap: flap, _t: function () { return t; }
    };
  }
  window.HistoriaDefense = { create: create, STAGES: STAGES, _phys: { FLAP: FLAP, GU: GU, GD: GD, VMAX: VMAX, STEP: STEP, speedOf: speedOf, KX: KX } };
})();
