/* Historia — « Conquête » : un chevalier bondit de porte en porte, façon Flappy Bird.
   Chaque porte franchie = un territoire conquis (jusqu'à 200). Le paysage et le chevalier changent avec la conquête. */
(function () {
  var W = 360, H = 560, GY = 490, KX = 100, TOTAL = 200;
  var STAGES = [
    { at: 0, fr: "Campagne de Terre sainte", en: "Holy Land countryside", sky: ["#f6c978", "#fbe6b4"], far: "#d9a867", mid: "#c58f4f", ground: ["#d8b06a", "#b88e4a"], pil: ["#d7b57a", "#b48c52", "#8e6a38"], line: ["Tu quittes la Terre sainte, l'épée au côté.", "You leave the Holy Land, sword at your side."] },
    { at: 20, fr: "Hameau", en: "Hamlet", sky: ["#9fd0ea", "#e8f3df"], far: "#8fb36f", mid: "#6f9a52", ground: ["#7fae52", "#5b8a3a"], pil: ["#b08a5a", "#8a6638", "#5e4220"], line: ["Quelques chaumières : le premier hameau est à toi !", "A few thatched huts: your first hamlet is yours!"] },
    { at: 45, fr: "Village", en: "Village", sky: ["#8ec6ee", "#eaf5e2"], far: "#7fa66a", mid: "#628f4d", ground: ["#78a64c", "#557f34"], pil: ["#c9a06a", "#9a7442", "#6a4a24"], line: ["Une église, un moulin : le village prospère.", "A church, a windmill: the village prospers."] },
    { at: 75, fr: "Bourg marchand", en: "Market town", sky: ["#86bfe8", "#f0f4e4"], far: "#8aa0b8", mid: "#6d86a0", ground: ["#7da04e", "#587a35"], pil: ["#b9b4a6", "#8f8a7c", "#615d52"], line: ["Remparts de bois et marché : un vrai bourg !", "Timber walls and a market: a proper town!"] },
    { at: 105, fr: "Ville fortifiée", en: "Fortified city", sky: ["#7cb4e2", "#f1efe0"], far: "#8c97ad", mid: "#6c7890", ground: ["#7a9c52", "#566f38"], pil: ["#c4c0b6", "#98948a", "#6c685e"], line: ["Des murailles de pierre et des tours !", "Stone walls and towers!"] },
    { at: 140, fr: "Domaine du château", en: "Castle domain", sky: ["#6aa6dc", "#f4ecd6"], far: "#8d8aa8", mid: "#6c6a8c", ground: ["#6f9a4c", "#4d6f34"], pil: ["#cfcabc", "#a29d8e", "#74705f"], line: ["Un château dresse ses donjons sur tes terres.", "A castle raises its keeps on your lands."] },
    { at: 170, fr: "Cité royale", en: "Royal city", sky: ["#f2b27a", "#fde7c0"], far: "#a8849a", mid: "#86668a", ground: ["#7a9a4a", "#556f30"], pil: ["#e8d9a8", "#c2ae72", "#8e7a3c"], line: ["Une cathédrale, des bannières : une cité royale !", "A cathedral, banners: a royal city!"] },
    { at: 200, fr: "Empire", en: "Empire", sky: ["#f0a860", "#fff0b8"], far: "#b07a8c", mid: "#8a5c7c", ground: ["#86a048", "#5a7430"], pil: ["#f2e3a0", "#d0b65c", "#9a8030"], line: ["Tu règnes sur un empire !", "You rule an empire!"] }
  ];
  function stageOf(n) { var s = 0; for (var i = 0; i < STAGES.length; i++) if (n >= STAGES[i].at) s = i; return s; }

  function create(canvas, opt) {
    var FR = opt.lang !== "en";
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var raf = 0, dead = false, last = 0, t = 0;
    var st = null;
    var best = 0;

    function reset() {
      st = { y: 250, vy: 0, score: 0, over: false, started: false, scroll: 0, pipes: [], next: 330, parts: [], banner: null, shake: 0, flash: 0, endT: 0, rot: 0, flap: 0 };
      addPipe(W + 120);
    }
    function addPipe(x) {
      var s = stageOf(st.score);
      var gap = Math.max(108, 172 - st.score * 0.55);
      var top = 70 + Math.random() * (GY - 70 - gap - 70);
      var amp = st.score < 25 ? 0 : Math.min(70, 14 + (st.score - 25) * 0.6);
      st.pipes.push({ x: x, base: top, top: top, gap: gap, passed: false, st: s, flag: Math.random() < 0.5, amp: amp, ph: Math.random() * 6.28, fq: 1.2 + Math.min(st.score, 200) * 0.012 });
    }
    function flap() {
      if (dead) return;
      if (st.over) return;
      if (!st.started) st.started = true;
      st.vy = -6.1; st.flap = 1;
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
      if (opt.sfx && st.score % 5 === 0) opt.sfx("ok");
      burst(KX + 30, st.y, "#f0c64b", 6);
      var a = stageOf(st.score - 1), b = stageOf(st.score);
      if (b !== a && st.score !== TOTAL) {
        st.banner = { t: 0, s: b };
        if (opt.sfx) opt.sfx("ok");
        if (opt.buzz) opt.buzz(20);
      }
      if (st.score === TOTAL) { st.banner = { t: 0, s: 7, hunger: true }; burst(W / 2, 200, "#f0c64b", 50); if (opt.sfx) opt.sfx("ok"); }
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
      st.parts.forEach(function (p) { p.x += p.vx; p.y += p.vy; p.vy += 0.12; p.life -= dt * 1.3; });
      st.parts = st.parts.filter(function (p) { return p.life > 0; });
      if (st.over) {
        st.endT += dt;
        if (!st.win) { st.vy += 0.5; st.y = Math.min(GY - 14, st.y + st.vy); st.rot += dt * 6; }
        if (st.endT > (st.win ? 2.6 : 1.1) && !st.done) {
          st.done = true;
          if (st.score > best) best = st.score;
          opt.onEnd({ score: st.score, win: st.score >= TOTAL, stage: stageOf(st.score), best: best });
        }
        return;
      }
      var speed = 118 + Math.min(st.score, 260) * 0.95;
      if (!st.started) { st.y = 250 + Math.sin(t * 4) * 8; st.scroll += speed * 0.4 * dt; return; }
      st.vy += 15 * dt * 1.0; if (st.vy > 9) st.vy = 9;
      st.y += st.vy * 60 * dt * 0.62;
      st.rot = Math.max(-0.45, Math.min(0.7, st.vy * 0.07));
      st.scroll += speed * dt;
      st.pipes.forEach(function (p) { p.x -= speed * dt; if (p.amp) { var lo = 66, hi = GY - 66 - p.gap; p.top = Math.max(lo, Math.min(hi, p.base + Math.sin(t * p.fq + p.ph) * p.amp)); } });
      var lastp = st.pipes[st.pipes.length - 1];
      if (lastp.x < W - Math.max(165, 205 - st.score * 0.2)) addPipe(W + 40);
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
      function col(x, y, w, h, capTop) {
        rect(x, y, w, h, c[0]);
        rect(x, y, 8, h, c[1]); rect(x + w - 9, y, 9, h, c[2]);
        ctx.strokeStyle = "rgba(0,0,0,0.12)"; ctx.lineWidth = 1;
        if (s <= 1) { for (var yy = y + 10; yy < y + h; yy += 18) { ctx.beginPath(); ctx.moveTo(x, yy); ctx.lineTo(x + w, yy); ctx.stroke(); } }
        else if (s <= 2) { for (var xx = x + 14; xx < x + w; xx += 14) { ctx.beginPath(); ctx.moveTo(xx, y); ctx.lineTo(xx, y + h); ctx.stroke(); } }
        else { for (var yy2 = y + 12; yy2 < y + h; yy2 += 16) { ctx.beginPath(); ctx.moveTo(x, yy2); ctx.lineTo(x + w, yy2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x + ((yy2 / 16) % 2 ? 14 : 28), yy2); ctx.lineTo(x + ((yy2 / 16) % 2 ? 14 : 28), yy2 + 16); ctx.stroke(); } }
        // chapiteau
        var cy2 = capTop ? y + h - 16 : y;
        rect(x - 5, cy2, w + 10, 16, c[0]); rect(x - 5, cy2, w + 10, 4, "rgba(255,255,255,0.28)"); rect(x - 5, cy2 + 12, w + 10, 4, "rgba(0,0,0,0.2)");
        if (s >= 4) { var ey = capTop ? cy2 + 16 : cy2 - 8; for (var q = 0; q < 4; q++) rect(x - 5 + q * 17, capTop ? cy2 - 0 : cy2 - 8, 11, 8, c[0]); }
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
      ctx.fillText((FR ? "Territoires " : "Territories ") + st.score + (st.score < TOTAL ? " / " + TOTAL : " ★"), 12, 20);
      ctx.fillStyle = "#e6c36a"; ctx.font = "13px Georgia, serif";
      ctx.fillText(FR ? STAGES[s].fr : STAGES[s].en, 12, 37);
      ctx.fillStyle = "rgba(255,255,255,0.2)"; ctx.fillRect(W - 112, 14, 100, 10);
      ctx.fillStyle = "#f0c64b"; ctx.fillRect(W - 112, 14, 100 * Math.min(1, st.score / TOTAL), 10);
      ctx.strokeStyle = "#f4e6c0"; ctx.lineWidth = 1; ctx.strokeRect(W - 112.5, 13.5, 101, 11);
      ctx.textAlign = "center";
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
      update(dt); draw();
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
      _state: function () { return st; }
    };
  }
  window.HistoriaDefense = { create: create, STAGES: STAGES };
})();
