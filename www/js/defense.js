/* Historia — « Défends le roi » : jeu d'action en 2D. Une conjuration attaque la salle du trône.
   Un seul geste : touche à gauche ou à droite pour foncer et frapper de l'épée. */
(function (root) {
  "use strict";
  const W = 360, H = 560, FLOOR = 450, KX = 180;
  const TAU = Math.PI * 2;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const rnd = (a, b) => a + Math.random() * (b - a);

  const WAVES = [
    { n: 6, gap: 1.9, mix: [1, 0] },
    { n: 9, gap: 1.6, mix: [0.75, 0.25] },
    { n: 12, gap: 1.35, mix: [0.6, 0.4] },
    { n: 15, gap: 1.15, mix: [0.5, 0.5] },
    { n: 14, gap: 1.05, mix: [0.45, 0.55], boss: true }
  ];

  /* Décor fixe, dessiné une seule fois. */
  function makeBackground() {
    const c = document.createElement("canvas");
    c.width = W; c.height = H;
    const g = c.getContext("2d");
    const wall = g.createLinearGradient(0, 0, 0, FLOOR);
    wall.addColorStop(0, "#2a2438"); wall.addColorStop(1, "#4a3d4f");
    g.fillStyle = wall; g.fillRect(0, 0, W, FLOOR);
    g.strokeStyle = "rgba(0,0,0,.25)"; g.lineWidth = 1;
    for (let y = 20; y < FLOOR; y += 34) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); for (let x = ((y / 34) % 2) * 28; x < W; x += 56) { g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 34); g.stroke(); } }
    // fenêtres et rayons de lune
    [[62, 70], [298, 70]].forEach(([x, y]) => {
      const beam = g.createLinearGradient(x, y, x, FLOOR);
      beam.addColorStop(0, "rgba(170,200,255,.28)"); beam.addColorStop(1, "rgba(170,200,255,0)");
      g.fillStyle = beam; g.beginPath(); g.moveTo(x - 20, y + 40); g.lineTo(x + 20, y + 40); g.lineTo(x + 70, FLOOR); g.lineTo(x - 70, FLOOR); g.closePath(); g.fill();
      g.fillStyle = "#0f1530"; g.beginPath(); g.moveTo(x - 24, y + 60); g.lineTo(x - 24, y - 8); g.arc(x, y - 8, 24, Math.PI, 0); g.lineTo(x + 24, y + 60); g.closePath(); g.fill();
      g.strokeStyle = "#b9b4a3"; g.lineWidth = 4; g.stroke();
      g.strokeStyle = "#b9b4a3"; g.lineWidth = 2; g.beginPath(); g.moveTo(x, y - 30); g.lineTo(x, y + 60); g.moveTo(x - 24, y + 20); g.lineTo(x + 24, y + 20); g.stroke();
    });
    // bannières
    [[130, "#8a1f2b"], [230, "#1f3a8a"]].forEach(([x, col]) => {
      g.fillStyle = col; g.beginPath(); g.moveTo(x - 17, 18); g.lineTo(x + 17, 18); g.lineTo(x + 17, 120); g.lineTo(x, 104); g.lineTo(x - 17, 120); g.closePath(); g.fill();
      g.strokeStyle = "#e0b24f"; g.lineWidth = 2; g.stroke();
      g.fillStyle = "#e0b24f"; g.beginPath(); g.arc(x, 58, 8, 0, TAU); g.fill();
    });
    // sol
    const fl = g.createLinearGradient(0, FLOOR, 0, H);
    fl.addColorStop(0, "#5b4a3a"); fl.addColorStop(1, "#2d241c");
    g.fillStyle = fl; g.fillRect(0, FLOOR, W, H - FLOOR);
    g.strokeStyle = "rgba(0,0,0,.3)"; g.lineWidth = 1;
    for (let y = FLOOR + 22; y < H; y += 30) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
    // tapis
    g.fillStyle = "#8a1f2b"; g.beginPath(); g.moveTo(KX - 34, FLOOR); g.lineTo(KX + 34, FLOOR); g.lineTo(KX + 120, H); g.lineTo(KX - 120, H); g.closePath(); g.fill();
    g.strokeStyle = "#e0b24f"; g.lineWidth = 3; g.stroke();
    // estrade et trône
    g.fillStyle = "#6e6657"; g.fillRect(KX - 58, FLOOR - 16, 116, 16);
    g.fillStyle = "#7e7667"; g.fillRect(KX - 48, FLOOR - 30, 96, 14);
    g.fillStyle = "#b8892b"; g.beginPath(); g.moveTo(KX - 30, FLOOR - 30); g.lineTo(KX - 30, FLOOR - 130); g.quadraticCurveTo(KX, FLOOR - 160, KX + 30, FLOOR - 130); g.lineTo(KX + 30, FLOOR - 30); g.closePath(); g.fill();
    g.strokeStyle = "#5e4210"; g.lineWidth = 3; g.stroke();
    g.fillStyle = "#8a1f2b"; g.fillRect(KX - 22, FLOOR - 118, 44, 80);
    return c;
  }

  function create(canvas, opts) {
    const o = opts || {};
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const bg = makeBackground();
    const sfx = o.sfx || (() => {});
    const buzz = o.buzz || (() => {});
    const L = o.lang === "en";

    let t = 0, raf = 0, last = 0, running = false, paused = false;
    let p, king, enemies, parts, texts, wave, spawned, spawnT, banner, score, kills, combo, comboT, shake, freeze, over, best;

    function reset() {
      p = { x: KX - 90, face: 1, dashFrom: 0, dashTo: 0, dashT: 0, cd: 0, atk: 0, hit: new Set(), bob: 0 };
      king = { hp: 4, hurt: 0 };
      enemies = []; parts = []; texts = [];
      wave = 0; spawned = 0; spawnT = 1.2; banner = { t: 2.4, text: waveTitle(0) };
      score = 0; kills = 0; combo = 0; comboT = 0; shake = 0; freeze = 0; over = false; best = 0;
    }
    function waveTitle(i) {
      const fr = ["Vague 1 : les premiers conjurés", "Vague 2 : les lames dans l'ombre", "Vague 3 : les traîtres en armure", "Vague 4 : l'assaut général", "Dernière vague : le duc félon"];
      const en = ["Wave 1: the first plotters", "Wave 2: blades in the dark", "Wave 3: armoured traitors", "Wave 4: the full assault", "Final wave: the treacherous duke"];
      return (L ? en : fr)[i];
    }

    function spawn() {
      const w = WAVES[wave];
      const last = w.boss && spawned === w.n - 1;
      const kind = last ? "boss" : Math.random() < w.mix[0] ? "dag" : "arm";
      const side = Math.random() < 0.5 ? -1 : 1;
      const drop = !last && Math.random() < 0.22;
      const sp = (1 + wave * 0.07);
      const e = { kind, x: drop ? rnd(50, 310) : side < 0 ? -26 : W + 26, y: drop ? -30 : FLOOR, vy: 0, falling: drop, hp: kind === "boss" ? 6 : kind === "arm" ? 2 : 1, max: kind === "boss" ? 6 : kind === "arm" ? 2 : 1,
        speed: (kind === "dag" ? 72 : kind === "arm" ? 50 : 40) * sp, atkT: 0.6, flash: 0, kb: 0, dir: 0, dying: 0, bob: Math.random() * 6 };
      enemies.push(e);
      spawned++;
    }

    function puff(x, y, n, col) {
      for (let i = 0; i < n; i++) parts.push({ x, y, vx: rnd(-120, 120), vy: rnd(-170, -20), life: rnd(0.35, 0.7), max: 0.7, col: col || "#e9dcc0", s: rnd(2, 5) });
    }
    function say(x, y, str, col) { texts.push({ x, y, str, col: col || "#ffe9a6", life: 0.9 }); }

    function slash(tx) {
      if (over || p.cd > 0) return;
      const target = clamp(tx, 22, W - 22);
      p.face = target >= p.x ? 1 : -1;
      const dist = Math.min(Math.abs(target - p.x), 120);
      p.dashFrom = p.x; p.dashTo = clamp(p.x + p.face * Math.max(dist, 40), 22, W - 22);
      p.dashT = 0.14; p.atk = 0.24; p.cd = 0.34; p.hit = new Set();
      sfx("tap");
    }

    function hurtKing(e) {
      king.hp--; king.hurt = 0.5; shake = 0.35; combo = 0;
      sfx("bad"); buzz(40);
      puff(KX, FLOOR - 60, 10, "#ff6b6b");
      say(KX, FLOOR - 150, L ? "Ouch!" : "Aïe !", "#ff9b9b");
      e.flash = 0.2;
      if (king.hp <= 0) finish(false);
    }

    function kill(e) {
      e.dying = 0.35; kills++;
      combo = comboT > 0 ? combo + 1 : 1; comboT = 1.6;
      const gain = (e.kind === "boss" ? 200 : e.kind === "arm" ? 25 : 15) * Math.min(combo, 6);
      score += gain; best = Math.max(best, combo);
      puff(e.x, e.y - 30, 14, e.kind === "boss" ? "#c49bff" : "#d8d0bd");
      say(e.x, e.y - 70, combo > 1 ? `+${gain}  x${combo}` : `+${gain}`, combo > 2 ? "#ffd166" : "#fff3c4");
      sfx("good"); buzz(15);
      freeze = e.kind === "boss" ? 0.12 : 0.045; shake = Math.max(shake, e.kind === "boss" ? 0.3 : 0.12);
    }

    function finish(win) {
      if (over) return;
      over = true;
      if (win) { sfx("fanfare"); } else { sfx("lose"); }
      setTimeout(() => { if (o.onEnd) o.onEnd({ win, score, kills, wave: wave + 1, best, hp: king.hp }); }, win ? 900 : 1100);
    }

    function update(dt) {
      if (freeze > 0) { freeze -= dt; return; }
      t += dt;
      p.cd = Math.max(0, p.cd - dt); p.bob += dt * 8;
      if (p.dashT > 0) { p.dashT -= dt; const k = 1 - Math.max(0, p.dashT) / 0.14; p.x = p.dashFrom + (p.dashTo - p.dashFrom) * Math.min(1, k); }
      if (p.atk > 0) {
        p.atk -= dt;
        const reach = 66;
        const x0 = p.face > 0 ? p.x - 14 : p.x - reach, x1 = p.face > 0 ? p.x + reach : p.x + 14;
        enemies.forEach((e) => {
          if (e.dying || e.falling || p.hit.has(e) || e.x < x0 || e.x > x1) return;
          p.hit.add(e);
          e.hp--; e.flash = 0.14; e.kb = 26 * p.face;
          puff(e.x, e.y - 34, 6, "#fff3c4");
          if (e.hp <= 0) kill(e); else { sfx("tap"); say(e.x, e.y - 70, "!", "#fff"); }
        });
      }
      comboT = Math.max(0, comboT - dt); if (comboT === 0) combo = 0;
      king.hurt = Math.max(0, king.hurt - dt);
      shake = Math.max(0, shake - dt);
      if (banner.t > 0) banner.t -= dt;

      // vagues
      if (!over && banner.t <= 0) {
        const w = WAVES[wave];
        if (spawned < w.n) { spawnT -= dt; if (spawnT <= 0) { spawn(); spawnT = w.gap * rnd(0.8, 1.2); } }
        else if (!enemies.some((e) => !e.dying)) {
          if (wave >= WAVES.length - 1) finish(true);
          else { wave++; spawned = 0; spawnT = 1.4; banner = { t: 2.6, text: waveTitle(wave) }; sfx("star"); }
        }
      }
      // ennemis
      enemies.forEach((e) => {
        e.flash = Math.max(0, e.flash - dt); e.bob += dt * 7;
        if (e.dying > 0) { e.dying -= dt; return; }
        if (e.kb) { const k = e.kb * Math.min(1, dt * 14); e.x += k; e.kb -= k; if (Math.abs(e.kb) < 0.5) e.kb = 0; }
        if (e.falling) { e.vy += 900 * dt; e.y += e.vy * dt; if (e.y >= FLOOR) { e.y = FLOOR; e.falling = false; puff(e.x, FLOOR, 6, "#bfb6a1"); } return; }
        const d = KX - e.x;
        e.dir = Math.sign(d);
        if (Math.abs(d) > 30) e.x += e.dir * e.speed * dt;
        else { e.atkT -= dt; if (e.atkT <= 0 && !over) { e.atkT = e.kind === "boss" ? 1.3 : 1.1; hurtKing(e); } }
      });
      enemies = enemies.filter((e) => e.dying > 0 || (!e.dying && e.hp > 0));
      enemies = enemies.filter((e) => !(e.dying !== 0 && e.dying <= 0 && e.hp <= 0));
      parts.forEach((q) => { q.life -= dt; q.vy += 520 * dt; q.x += q.vx * dt; q.y += q.vy * dt; });
      parts = parts.filter((q) => q.life > 0);
      texts.forEach((q) => { q.life -= dt; q.y -= 36 * dt; });
      texts = texts.filter((q) => q.life > 0);
    }

    /* ---------- dessin ---------- */
    function drawKing() {
      const x = KX, y = FLOOR - 36;
      ctx.save();
      if (king.hurt > 0) ctx.translate(Math.sin(t * 90) * 3, 0);
      ctx.fillStyle = king.hurt > 0 ? "#ffd0d0" : "#a3232f"; ctx.beginPath(); ctx.moveTo(x - 20, y); ctx.lineTo(x - 13, y - 42); ctx.lineTo(x + 13, y - 42); ctx.lineTo(x + 20, y); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "#3a0e13"; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = "#f0e3d0"; ctx.fillRect(x - 12, y - 40, 24, 6); // fourrure
      ctx.fillStyle = "#f1cfa5"; ctx.beginPath(); ctx.arc(x, y - 54, 11, 0, TAU); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#3a2914"; ctx.fillRect(x - 5, y - 57, 2.5, 3); ctx.fillRect(x + 3, y - 57, 2.5, 3);
      if (king.hp <= 1) { ctx.beginPath(); ctx.arc(x, y - 48, 3, 0, Math.PI); ctx.stroke(); } else { ctx.beginPath(); ctx.moveTo(x - 4, y - 49); ctx.lineTo(x + 4, y - 49); ctx.stroke(); }
      ctx.fillStyle = "#f0c64b"; ctx.beginPath(); ctx.moveTo(x - 11, y - 62); ctx.lineTo(x - 11, y - 74); ctx.lineTo(x - 5, y - 67); ctx.lineTo(x, y - 76); ctx.lineTo(x + 5, y - 67); ctx.lineTo(x + 11, y - 74); ctx.lineTo(x + 11, y - 62); ctx.closePath(); ctx.fill(); ctx.strokeStyle = "#7a5818"; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.restore();
    }

    function drawKnight() {
      const x = p.x, y = FLOOR, f = p.face, bob = Math.sin(p.bob) * 1.2 * (p.dashT > 0 ? 0 : 1);
      ctx.save(); ctx.translate(x, y + bob); ctx.scale(f, 1);
      const lunge = p.atk > 0 ? 6 : 0;
      ctx.lineWidth = 2; ctx.strokeStyle = "#1b2238";
      // jambes
      ctx.fillStyle = "#8d98ac"; ctx.fillRect(-9, -22, 7, 22); ctx.fillRect(2, -22, 7, 22); ctx.strokeRect(-9, -22, 7, 22); ctx.strokeRect(2, -22, 7, 22);
      // cotte
      ctx.fillStyle = "#2a4aa8"; ctx.beginPath(); ctx.moveTo(-14, -20); ctx.lineTo(-11, -52); ctx.lineTo(11, -52); ctx.lineTo(14, -20); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#e9c46a"; ctx.fillRect(-2, -48, 4, 24); ctx.fillRect(-8, -40, 16, 4);
      // casque
      ctx.fillStyle = "#c3cad8"; ctx.beginPath(); ctx.arc(0, -62, 12, Math.PI, 0); ctx.lineTo(12, -56); ctx.lineTo(-12, -56); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#14192b"; ctx.fillRect(1, -64, 11, 3);
      ctx.fillStyle = "#c0392b"; ctx.beginPath(); ctx.moveTo(-3, -73); ctx.quadraticCurveTo(-18, -80 - Math.sin(t * 9) * 2, -16, -62); ctx.quadraticCurveTo(-8, -70, -3, -73); ctx.fill();
      // épée
      ctx.save(); ctx.translate(10 + lunge, -42);
      const ang = p.atk > 0 ? -1.5 + (1 - p.atk / 0.24) * 2.6 : -0.5;
      ctx.rotate(ang);
      ctx.fillStyle = "#e8edf5"; ctx.fillRect(0, -2.5, 38, 5); ctx.strokeRect(0, -2.5, 38, 5);
      ctx.fillStyle = "#b8892b"; ctx.fillRect(-5, -7, 5, 14);
      ctx.restore();
      ctx.restore();
      // arc de coup
      if (p.atk > 0) {
        const k = 1 - p.atk / 0.24;
        ctx.save(); ctx.translate(x, FLOOR - 42); ctx.scale(f, 1);
        ctx.globalAlpha = 0.8 * (1 - k);
        ctx.strokeStyle = "#fff6d0"; ctx.lineWidth = 7; ctx.lineCap = "round";
        ctx.beginPath(); ctx.arc(8, 0, 52, -1.1, 1.1); ctx.stroke();
        ctx.globalAlpha = 0.5 * (1 - k); ctx.strokeStyle = "#ffd166"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(8, 0, 60, -1.0, 1.0); ctx.stroke();
        ctx.restore();
      }
    }

    function drawEnemy(e) {
      const x = e.x, y = e.y, f = e.dir || (x < KX ? 1 : -1);
      const dy = e.dying > 0 ? (1 - e.dying / 0.35) * 18 : 0;
      ctx.save(); ctx.translate(x, y + dy); ctx.scale(f, 1);
      if (e.dying > 0) ctx.globalAlpha = Math.max(0, e.dying / 0.35);
      const step = Math.sin(e.bob) * 3;
      const s = e.kind === "boss" ? 1.35 : 1;
      ctx.scale(s, s);
      ctx.lineWidth = 2; ctx.strokeStyle = "#120d17";
      if (e.falling) { ctx.strokeStyle = "#cbb68a"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, -60); ctx.lineTo(0, -H); ctx.stroke(); ctx.strokeStyle = "#120d17"; }
      const flash = e.flash > 0;
      const body = flash ? "#ffffff" : e.kind === "dag" ? "#241a33" : e.kind === "arm" ? "#7b8494" : "#4b1f6b";
      ctx.fillStyle = flash ? "#fff" : "#17101f"; ctx.fillRect(-8 + step, -20, 6, 20); ctx.fillRect(2 - step, -20, 6, 20);
      ctx.fillStyle = body; ctx.beginPath(); ctx.moveTo(-14, -16); ctx.lineTo(-11, -50); ctx.lineTo(11, -50); ctx.lineTo(14, -16); ctx.closePath(); ctx.fill(); ctx.stroke();
      if (e.kind === "dag") {
        ctx.fillStyle = flash ? "#fff" : "#241a33"; ctx.beginPath(); ctx.arc(0, -58, 11, 0, TAU); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#ff3b3b"; ctx.fillRect(3, -61, 4, 3);
      } else if (e.kind === "arm") {
        ctx.fillStyle = flash ? "#fff" : "#a4acba"; ctx.beginPath(); ctx.arc(0, -58, 11, Math.PI, 0); ctx.lineTo(11, -52); ctx.lineTo(-11, -52); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#14192b"; ctx.fillRect(2, -60, 9, 3);
        ctx.fillStyle = flash ? "#fff" : "#5a2230"; ctx.beginPath(); ctx.moveTo(10, -46); ctx.lineTo(22, -46); ctx.lineTo(22, -30); ctx.lineTo(16, -22); ctx.lineTo(10, -30); ctx.closePath(); ctx.fill(); ctx.stroke();
      } else {
        ctx.fillStyle = flash ? "#fff" : "#f1cfa5"; ctx.beginPath(); ctx.arc(0, -58, 10, 0, TAU); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#ff3b3b"; ctx.fillRect(3, -61, 3, 3);
        ctx.fillStyle = flash ? "#fff" : "#caa0ff"; ctx.beginPath(); ctx.moveTo(-10, -66); ctx.lineTo(-10, -78); ctx.lineTo(-4, -71); ctx.lineTo(0, -80); ctx.lineTo(4, -71); ctx.lineTo(10, -78); ctx.lineTo(10, -66); ctx.closePath(); ctx.fill(); ctx.stroke();
      }
      // dague
      ctx.fillStyle = "#d9dee8"; ctx.save(); ctx.translate(12, -36); ctx.rotate(-0.6 + Math.sin(e.bob * 1.4) * 0.15); ctx.fillRect(0, -2, 16, 4); ctx.restore();
      ctx.restore();
      // barre de vie du chef et des armures
      if (!e.dying && e.max > 1) {
        const bw = e.kind === "boss" ? 52 : 28;
        ctx.fillStyle = "rgba(0,0,0,.55)"; ctx.fillRect(x - bw / 2, y - (e.kind === "boss" ? 104 : 84), bw, 5);
        ctx.fillStyle = "#ff5a5a"; ctx.fillRect(x - bw / 2, y - (e.kind === "boss" ? 104 : 84), bw * (e.hp / e.max), 5);
      }
    }

    function drawHUD() {
      for (let i = 0; i < 4; i++) {
        const x = 18 + i * 26, y = 22, on = i < king.hp;
        ctx.save(); ctx.translate(x, y); ctx.scale(on && king.hurt > 0 ? 1.25 : 1, on && king.hurt > 0 ? 1.25 : 1);
        ctx.fillStyle = on ? "#e63946" : "rgba(255,255,255,.18)"; ctx.strokeStyle = "rgba(0,0,0,.55)"; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(0, 6); ctx.bezierCurveTo(-14, -4, -6, -14, 0, -6); ctx.bezierCurveTo(6, -14, 14, -4, 0, 6); ctx.fill(); ctx.stroke(); ctx.restore();
      }
      ctx.fillStyle = "#fff"; ctx.font = "700 20px 'Cinzel', Georgia, serif"; ctx.textAlign = "right"; ctx.shadowColor = "rgba(0,0,0,.7)"; ctx.shadowBlur = 4;
      ctx.fillText(String(score), W - 14, 28);
      if (combo > 1 && comboT > 0) { ctx.textAlign = "right"; ctx.fillStyle = "#ffd166"; ctx.font = "700 16px Georgia, serif"; ctx.fillText(`Combo x${combo}`, W - 14, 50); }
      ctx.shadowBlur = 0;
      // progression de la vague
      const w = WAVES[wave], alive = enemies.filter((e) => !e.dying).length, left = Math.max(0, w.n - spawned) + alive;
      const label = `${L ? "Wave" : "Vague"} ${wave + 1}/${WAVES.length} · ${left} ${L ? "left" : "restants"}`;
      ctx.font = "600 13px Georgia, serif"; ctx.textAlign = "center";
      const lw = ctx.measureText(label).width + 22;
      ctx.fillStyle = "rgba(10,6,16,.62)"; ctx.fillRect(W / 2 - lw / 2, H - 30, lw, 22);
      ctx.fillStyle = "#fff3d6"; ctx.fillText(label, W / 2, H - 15);
    }

    function draw() {
      ctx.save();
      if (shake > 0) ctx.translate(rnd(-1, 1) * shake * 14, rnd(-1, 1) * shake * 14);
      ctx.drawImage(bg, 0, 0, W, H);
      // flammes des torches
      [[18, 230], [342, 230]].forEach(([x, y], i) => {
        const fl = 1 + Math.sin(t * 11 + i * 2) * 0.12;
        ctx.fillStyle = "#4b3820"; ctx.fillRect(x - 3, y, 6, 26);
        const gl = ctx.createRadialGradient(x, y - 4, 2, x, y - 4, 70 * fl);
        gl.addColorStop(0, "rgba(255,190,90,.38)"); gl.addColorStop(1, "rgba(255,190,90,0)");
        ctx.fillStyle = gl; ctx.fillRect(x - 80, y - 80, 160, 160);
        ctx.fillStyle = "#ff9a1f"; ctx.beginPath(); ctx.ellipse(x, y - 6, 7 * fl, 12 * fl, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = "#ffe08a"; ctx.beginPath(); ctx.ellipse(x, y - 3, 3.5, 6.5 * fl, 0, 0, TAU); ctx.fill();
      });
      drawKing();
      enemies.slice().sort((a, b) => a.y - b.y).forEach(drawEnemy);
      drawKnight();
      parts.forEach((q) => { ctx.globalAlpha = Math.max(0, q.life / q.max); ctx.fillStyle = q.col; ctx.beginPath(); ctx.arc(q.x, q.y, q.s, 0, TAU); ctx.fill(); });
      ctx.globalAlpha = 1;
      ctx.textAlign = "center"; ctx.font = "700 17px Georgia, serif";
      texts.forEach((q) => { ctx.globalAlpha = Math.min(1, q.life * 2); ctx.fillStyle = "#000"; ctx.fillText(q.str, q.x + 1, q.y + 1); ctx.fillStyle = q.col; ctx.fillText(q.str, q.x, q.y); });
      ctx.globalAlpha = 1;
      ctx.restore();
      drawHUD();
      // bandeau de vague
      if (banner.t > 0 && !over) {
        const a = Math.min(1, banner.t * 2, (2.6 - Math.min(2.6, banner.t)) * 3 + 0.2);
        ctx.globalAlpha = Math.max(0, Math.min(1, a));
        ctx.fillStyle = "rgba(20,12,24,.78)"; ctx.fillRect(0, 190, W, 70);
        ctx.fillStyle = "#e0b24f"; ctx.fillRect(0, 190, W, 2); ctx.fillRect(0, 258, W, 2);
        ctx.fillStyle = "#fff3d6"; ctx.textAlign = "center"; ctx.font = "700 19px 'Cinzel', Georgia, serif";
        ctx.fillText(banner.text, W / 2, 232);
        ctx.globalAlpha = 1;
      }
      if (over && king.hp <= 0) { ctx.fillStyle = "rgba(60,0,10,.45)"; ctx.fillRect(0, 0, W, H); }
    }

    function loop(now) {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (now - last) / 1000 || 0); last = now;
      if (!running || paused) return;
      update(dt); draw();
    }

    /* ---------- entrées ---------- */
    function pos(ev) { const r = canvas.getBoundingClientRect(); return ((ev.clientX - r.left) / r.width) * W; }
    const onDown = (ev) => { if (!running) return; ev.preventDefault(); slash(pos(ev)); };
    const onKey = (ev) => {
      if (!running) return;
      const k = ev.key.toLowerCase();
      if (["arrowleft", "a", "q"].includes(k)) { ev.preventDefault(); slash(0); }
      else if (["arrowright", "d"].includes(k)) { ev.preventDefault(); slash(W); }
    };
    const onVis = () => { paused = document.hidden; last = performance.now(); };
    canvas.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    document.addEventListener("visibilitychange", onVis);

    reset(); draw();
    return {
      start() { reset(); running = true; last = performance.now(); cancelAnimationFrame(raf); raf = requestAnimationFrame(loop); },
      destroy() { running = false; cancelAnimationFrame(raf); canvas.removeEventListener("pointerdown", onDown); window.removeEventListener("keydown", onKey); document.removeEventListener("visibilitychange", onVis); }
    };
  }

  root.HistoriaDefense = { create };
})(typeof window !== "undefined" ? window : globalThis);
