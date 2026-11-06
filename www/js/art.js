/* Historia — illustrations d'époque (SVG), icônes et sons. */
(() => {
  "use strict";
  let uid = 0;

  /* Chaque scène dessine, sur un ciel dégradé, des silhouettes caractéristiques de l'époque. */
  const MOTIFS = {
    gaule: (a) => `
      <g fill="#0b1430" fill-opacity=".85">
        <path d="M30 128l26-34 26 34z"/><rect x="36" y="128" width="40" height="14"/>
        <path d="M96 132l20-26 20 26z"/><rect x="100" y="132" width="32" height="10"/>
        <path d="M222 142v-52h8v52zM248 142V90h8v52zM274 142V90h8v52zM300 142V90h8v52z"/>
        <path d="M216 90h98v-8H216zM216 82h98l-6-8h-86z"/>
      </g>
      <g fill="none" stroke="#0b1430" stroke-opacity=".7" stroke-width="3"><path d="M190 142v-30M178 142v-24M202 142v-26"/></g>
      <g fill="${a}" fill-opacity=".85"><path d="M150 120l18-22 18 22z"/></g>`,
    evangelisation: (a) => `
      <g fill="#0b1430" fill-opacity=".9">
        <path d="M60 142V98h10V74h8v24h10v8H78v36z" transform="translate(0 0)"/>
        <path d="M60 110h28v8H60z"/>
        <rect x="200" y="106" width="54" height="36"/><path d="M194 106l33-26 33 26z"/>
        <rect x="224" y="60" width="6" height="26"/><rect x="217" y="68" width="20" height="5"/>
      </g>
      <g stroke="${a}" stroke-opacity=".6" stroke-width="2"><path d="M180 30v-14M160 36l-8-10M200 36l8-10M142 50l-12-4M218 50l12-4"/></g>
      <circle cx="180" cy="48" r="14" fill="${a}" fill-opacity=".8"/>`,
    carolingiens: (a) => `
      <g fill="#0b1430" fill-opacity=".9">
        <rect x="104" y="88" width="152" height="54"/><rect x="98" y="70" width="30" height="72"/><rect x="232" y="70" width="30" height="72"/>
        <path d="M94 70h38l-6-12h-26zM228 70h38l-6-12h-26z"/>
        <path d="M168 142v-22a12 12 0 0 1 24 0v22z" fill="${a}" fill-opacity=".55"/>
      </g>
      <g fill="${a}" fill-opacity=".9"><path d="M126 58l-6-18 8 6 6-10 6 10 8-6-6 18z"/></g>
      <g stroke="#0b1430" stroke-opacity=".8" stroke-width="2"><path d="M60 142V60M60 60l24 8-24 8"/></g>`,
    moines: (a) => `
      <g fill="#0b1430" fill-opacity=".9">
        <rect x="70" y="60" width="34" height="82"/><path d="M66 60l21-28 21 28z"/>
        <rect x="104" y="106" width="150" height="36"/>
        <path d="M104 106h150" stroke="#0b1430" stroke-width="2"/>
      </g>
      <g fill="${a}" fill-opacity=".6"><path d="M118 142v-18a8 8 0 0 1 16 0v18zM146 142v-18a8 8 0 0 1 16 0v18zM174 142v-18a8 8 0 0 1 16 0v18zM202 142v-18a8 8 0 0 1 16 0v18zM230 142v-18a8 8 0 0 1 16 0v18z"/></g>
      <g fill="#0b1430" fill-opacity=".85"><circle cx="300" cy="104" r="20"/><rect x="297" y="120" width="6" height="22"/></g>`,
    chevaliers: (a) => `
      <g fill="#0b1430" fill-opacity=".92">
        <rect x="120" y="82" width="120" height="60"/><rect x="108" y="56" width="34" height="86"/><rect x="218" y="56" width="34" height="86"/>
        <path d="M108 56h6v-8h6v8h6v-8h6v8h6v-8h6v8h2v-8h-36zM218 56h6v-8h6v8h6v-8h6v8h6v-8h6v8h2v-8h-36z" fill="none"/>
        <path d="M108 56v-9h8v5h6v-5h8v5h6v-5h6v9zM218 56v-9h8v5h6v-5h8v5h6v-5h6v9z"/>
        <path d="M120 82v-8h10v4h10v-4h10v4h10v-4h10v4h10v-4h10v4h10v-4h10v8z"/>
        <path d="M168 142v-26a12 12 0 0 1 24 0v26z" fill="${a}" fill-opacity=".5"/>
      </g>
      <g stroke="#0b1430" stroke-width="2"><path d="M125 47V28M125 28l18 5-18 5M235 47V24M235 24l18 5-18 5"/></g>`,
    croisades: (a) => `
      <circle cx="270" cy="46" r="26" fill="${a}" fill-opacity=".7"/>
      <g fill="#0b1430" fill-opacity=".9">
        <path d="M0 142c40-28 80-30 120-8s70 14 110-6 90-8 130 6v18H0z" fill-opacity=".55"/>
        <rect x="112" y="98" width="110" height="44"/><path d="M122 98a18 18 0 0 1 36 0zM168 98a24 24 0 0 1 48 0z"/>
        <rect x="138" y="74" width="4" height="14"/><rect x="190" y="62" width="4" height="12"/>
        <path d="M60 142V66" stroke="#0b1430" stroke-width="3"/><path d="M60 66h26v26H60z"/>
      </g>
      <path d="M72 70v18M63 79h18" stroke="${a}" stroke-width="3"/>`,
    capetiens: (a) => `
      <g fill="#0b1430" fill-opacity=".92">
        <rect x="124" y="70" width="112" height="72"/><rect x="112" y="50" width="30" height="92"/><rect x="218" y="50" width="30" height="92"/>
        <path d="M112 50l15-34 15 34zM218 50l15-34 15 34z"/><path d="M168 70l12-44 12 44z"/>
        <path d="M168 142v-30a12 12 0 0 1 24 0v30z" fill="${a}" fill-opacity=".55"/>
        <circle cx="180" cy="90" r="9" fill="${a}" fill-opacity=".5"/>
      </g>
      <g fill="${a}" fill-opacity=".85"><path d="M60 40c-4 5-5 10-3 16 1 3 2 4 3 5 1-1 2-2 3-5 2-6 1-11-3-16zM48 66h24v4H48z"/></g>`,
    renaissance: (a) => `
      <g fill="#0b1430" fill-opacity=".92">
        <rect x="118" y="86" width="124" height="56"/>
        <rect x="104" y="70" width="28" height="72"/><rect x="228" y="70" width="28" height="72"/>
        <path d="M100 70l18-34 18 34zM224 70l18-34 18 34z"/>
        <rect x="160" y="62" width="40" height="30"/><path d="M156 62l24-32 24 32z"/>
      </g>
      <g fill="${a}" fill-opacity=".6"><rect x="128" y="98" width="8" height="14"/><rect x="148" y="98" width="8" height="14"/><rect x="204" y="98" width="8" height="14"/><rect x="224" y="98" width="8" height="14"/><rect x="176" y="74" width="8" height="12"/></g>
      <g fill="#0b1430" fill-opacity=".85"><path d="M300 142v-40M300 102c-12-4-18-14-16-24 10 2 16 12 16 24zM300 108c12-4 18-14 16-24-10 2-16 12-16 24z"/></g>`,
    "grand-siecle": (a) => `
      <circle cx="180" cy="62" r="30" fill="${a}" fill-opacity=".85"/>
      <g stroke="${a}" stroke-opacity=".6" stroke-width="3"><path d="M180 16v8M180 100v8M134 62h8M218 62h8M147 29l6 6M213 95l6 6M213 29l-6 6M147 95l-6 6"/></g>
      <g fill="#0b1430" fill-opacity=".92">
        <rect x="30" y="100" width="300" height="42"/><rect x="150" y="84" width="60" height="58"/><path d="M146 84l34-18 34 18z"/>
        <path d="M30 100h300" stroke="#0b1430" stroke-width="3"/>
      </g>
      <g fill="${a}" fill-opacity=".55"><path d="M48 118h10v18H48zM70 118h10v18H70zM92 118h10v18H92zM114 118h10v18h-10zM236 118h10v18h-10zM258 118h10v18h-10zM280 118h10v18h-10zM302 118h10v18h-10z"/></g>`,
    revolution: (a) => `
      <g fill="#0b1430" fill-opacity=".92">
        <rect x="40" y="70" width="44" height="72"/><rect x="92" y="70" width="44" height="72"/>
        <path d="M40 70v-8h8v4h8v-4h8v4h8v-4h8v8zM92 70v-8h8v4h8v-4h8v4h8v-4h8v8z"/>
        <path d="M0 142h360v-10c-20-8-34-8-50 0s-34 8-50 0-34-8-50 0-34 8-50 0-34-8-50 0-34 8-50 0z" fill-opacity=".75"/>
      </g>
      <g stroke="#0b1430" stroke-width="3"><path d="M250 142V40"/></g>
      <path d="M250 40c0-14 12-22 22-20 8 2 14 8 12 16-2 6-8 8-12 6-6-3-10-2-12 4z" fill="${a}"/>
      <g><rect x="256" y="62" width="8" height="30" fill="#4a79d8"/><rect x="264" y="62" width="8" height="30" fill="#f3ead2"/><rect x="272" y="62" width="8" height="30" fill="#d7455a"/></g>`,
    modernes: (a) => `
      <g fill="#0b1430" fill-opacity=".92">
        <path d="M180 22l-5 40-12 40-10 40h54l-10-40-12-40z"/><rect x="164" y="64" width="32" height="5"/><rect x="156" y="104" width="48" height="5"/>
        <rect x="40" y="86" width="22" height="56"/><rect x="66" y="74" width="26" height="68"/><rect x="96" y="96" width="24" height="46"/>
        <rect x="244" y="80" width="24" height="62"/><rect x="272" y="92" width="22" height="50"/><rect x="298" y="70" width="26" height="72"/>
      </g>
      <g fill="${a}" fill-opacity=".75"><rect x="46" y="94" width="4" height="4"/><rect x="54" y="106" width="4" height="4"/><rect x="72" y="84" width="4" height="4"/><rect x="82" y="100" width="4" height="4"/><rect x="250" y="90" width="4" height="4"/><rect x="258" y="108" width="4" height="4"/><rect x="304" y="82" width="4" height="4"/><rect x="314" y="102" width="4" height="4"/></g>
      <path d="M232 36c0-6 4-10 10-10s10 4 10 10" stroke="${a}" stroke-opacity=".6" stroke-width="2" fill="none"/>`,
    empire: (a) => `
      <g fill="#0b1430" fill-opacity=".92">
        <rect x="116" y="52" width="128" height="90"/><rect x="108" y="44" width="144" height="12"/>
        <path d="M156 142V96a24 24 0 0 1 48 0v46z" fill="${a}" fill-opacity=".35"/>
        <rect x="40" y="62" width="18" height="80"/><rect x="34" y="56" width="30" height="8"/><path d="M38 56l11-18 11 18z"/>
        <path d="M300 142V74M300 74l26 8-26 8" stroke="#0b1430" stroke-width="3" fill="#0b1430"/>
      </g>
      <g fill="${a}" fill-opacity=".8"><path d="M180 30l20 8-8 4 8 6-14-2-6 8-6-8-14 2 8-6-8-4z"/></g>`
  };

  const SKY = {
    gaule: ["#2f6b5a", "#143040"], evangelisation: ["#5f4a98", "#1a1a4a"], carolingiens: ["#9a7a2a", "#1c2150"],
    moines: ["#a35a3c", "#1a1d48"], chevaliers: ["#4f6aa8", "#13204f"], croisades: ["#b04a4a", "#2a1a44"],
    capetiens: ["#3f84ad", "#14234f"], renaissance: ["#b35f84", "#26194a"], "grand-siecle": ["#c9a23d", "#241d4c"],
    revolution: ["#3f8f8a", "#162450"], empire: ["#8f9ab8", "#1a2350"], modernes: ["#4a8fc4", "#141f4a"]
  };

  function scene(id, accent) {
    const n = ++uid;
    const [top, bot] = SKY[id] || ["#3a4f9a", "#13204f"];
    const motif = (MOTIFS[id] || (() => ""))(accent);
    return `<svg class="scene" viewBox="0 0 360 160" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="sk${n}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${bot}"/><stop offset=".55" stop-color="${top}"/><stop offset="1" stop-color="${top}"/></linearGradient>
        <linearGradient id="gr${n}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d1838"/><stop offset="1" stop-color="#070d22"/></linearGradient>
      </defs>
      <rect width="360" height="160" fill="url(#sk${n})"/>
      <g class="cloud c1" fill="#f3ead2" fill-opacity=".13"><ellipse cx="70" cy="40" rx="30" ry="6"/><ellipse cx="92" cy="35" rx="20" ry="5"/></g>
      <g class="cloud c2" fill="#f3ead2" fill-opacity=".1"><ellipse cx="250" cy="28" rx="34" ry="6"/><ellipse cx="228" cy="33" rx="18" ry="4"/></g>
      <g class="twinkle" fill="#f3ead2" fill-opacity=".55"><circle cx="30" cy="22" r="1.2"/><circle cx="90" cy="14" r="1"/><circle cx="150" cy="30" r="1.2"/><circle cx="318" cy="18" r="1.2"/><circle cx="340" cy="52" r="1"/><circle cx="214" cy="14" r="1"/></g>
      <path d="M0 118c40-22 80-26 120-10s80 16 120-4 80-12 120 4v52H0z" fill="#0b1430" fill-opacity=".35"/>
      ${motif}
      <path d="M0 140c60-8 120-8 180 0s120 6 180-2v22H0z" fill="url(#gr${n})"/>
    </svg>`;
  }

  /* ===== Icônes supplémentaires ===== */
  const SVG = (inner) => `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
  const ICONS_EXTRA = {
    turret: SVG('<path d="M14 42V22h20v20"/><path d="M11 22L24 5l13 17z"/><path d="M20 42v-9a4 4 0 0 1 8 0v9"/><path d="M24 5v-3"/>'),
    sun: SVG('<circle cx="24" cy="24" r="8"/><path d="M24 4v6M24 38v6M4 24h6M38 24h6M10 10l4 4M34 34l4 4M38 10l-4 4M14 34l-4 4"/>'),
    phrygian: SVG('<path d="M8 36c0-12 8-22 20-22 6 0 10 4 10 8 0 3-2 4-4 4 3 3 4 6 3 10z"/><path d="M6 36h36"/><circle cx="36" cy="14" r="2"/>'),
    tower: SVG('<path d="M24 3v6M20 41l3-30h2l3 30"/><path d="M16 44l4-16M32 44l-4-16"/><path d="M18 30h12M20 22h8"/><path d="M12 44h24"/>'),
    arch: SVG('<rect x="7" y="8" width="34" height="32" rx="1"/><path d="M16 40V24a8 8 0 0 1 16 0v16"/><path d="M7 15h34"/>'),
    seal: SVG('<circle cx="24" cy="20" r="12"/><path d="M17 30l-4 14 11-6 11 6-4-14"/><path d="M24 14l2 4 4 .6-3 3 .8 4.400L24 24l-3.800 2 .8-4.400-3-3 4-.6z"/>')
  };

  /* ===== Sons (synthèse WebAudio, aucun fichier) ===== */
  let ctx = null;
  const AC = window.AudioContext || window.webkitAudioContext;
  function tone(freq, t0, dur, type = "sine", vol = 0.18) {
    if (!ctx) return;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, ctx.currentTime + t0);
    g.gain.exponentialRampToValueAtTime(vol, ctx.currentTime + t0 + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + t0 + dur);
    o.connect(g).connect(ctx.destination);
    o.start(ctx.currentTime + t0);
    o.stop(ctx.currentTime + t0 + dur + 0.05);
  }
  const SOUNDS = {
    tap: () => tone(520, 0, 0.06, "triangle", 0.08),
    good: () => { tone(659, 0, 0.18, "sine", 0.2); tone(988, 0.09, 0.32, "sine", 0.16); tone(1318, 0.09, 0.4, "triangle", 0.05); },
    bad: () => { tone(220, 0, 0.22, "sawtooth", 0.08); tone(165, 0.12, 0.34, "sawtooth", 0.08); },
    star: () => { tone(880, 0, 0.2, "triangle", 0.12); tone(1320, 0.06, 0.34, "sine", 0.1); },
    fanfare: () => { [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.13, 0.32, "triangle", 0.16)); tone(1319, 0.56, 0.7, "sine", 0.14); tone(784, 0.56, 0.7, "triangle", 0.1); },
    lose: () => { tone(330, 0, 0.3, "triangle", 0.1); tone(262, 0.2, 0.5, "triangle", 0.1); }
  };
  function play(name, enabled) {
    if (!enabled || !AC) return;
    try {
      if (!ctx) ctx = new AC();
      if (ctx.state === "suspended") ctx.resume();
      (SOUNDS[name] || (() => {}))();
    } catch (e) { /* son indisponible */ }
  }

  /* ===== Confettis ===== */
  function confetti(colors) {
    const old = document.getElementById("confetti");
    if (old) old.remove();
    const box = document.createElement("div");
    box.id = "confetti";
    box.setAttribute("aria-hidden", "true");
    const cols = colors || ["#e9cf8e", "#d8b565", "#6fb1e0", "#e06a6a", "#f3ead2", "#6cc79a"];
    let html = "";
    for (let i = 0; i < 46; i++) {
      const left = Math.random() * 100;
      const delay = Math.random() * 0.5;
      const dur = 1.8 + Math.random() * 1.4;
      const size = 6 + Math.random() * 7;
      const rot = Math.floor(Math.random() * 360);
      html += `<i style="left:${left}%;width:${size}px;height:${size * 1.6}px;background:${cols[i % cols.length]};animation-delay:${delay}s;animation-duration:${dur}s;transform:rotate(${rot}deg)"></i>`;
    }
    box.innerHTML = html;
    document.body.appendChild(box);
    setTimeout(() => box.remove(), 3600);
  }


  /* ===== Musique d'ambiance : une ambiance par thème (synthèse WebAudio, aucun fichier) ===== */
  const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
  const Z = Array(16).fill(0);
  const pat = (obj) => { const a = Z.slice(); Object.keys(obj).forEach((k) => (a[k] = obj[k])); return a; };
  const NB = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 };
  const note = (n) => { const m = /^([a-g])(#|b)?(\d)$/.exec(n); return 12 * (+m[3] + 1) + NB[m[1]] + (m[2] === "#" ? 1 : m[2] === "b" ? -1 : 0); };
  // Une phrase = 8 mesures de 16 croches : "d5" note, "." silence, "-" prolonge la note précédente
  const BARS = (...bars) => bars.map((b) => { const a = new Array(16).fill(null); let last = -1; b.split(/\s+/).forEach((tk, i) => { if (tk === "-") { if (last >= 0) a[last].len++; } else if (tk === ".") last = -1; else { a[i] = { m: note(tk), len: 1 }; last = i; } }); return a; });
  const THEMES = {
    // Moines : la mélodie d'origine
    moines: { beat: 0.9, chords: [[50, 53, 57], [46, 50, 53], [48, 52, 55], [45, 48, 52], [50, 53, 57], [43, 46, 50], [48, 52, 55], [50, 53, 57]], mel: [60, 62, 64, 65, 67, 69, 72, 74], pad: ["triangle", 900, 0.05], drone: [[38, 0.07], [45, 0.04]], k: pat({ 0: 0.2, 4: 0.09, 8: 0.09, 12: 0.09 }), t: Z, pl: { type: "triangle", decay: 1.4, vol: 0.07, p: [0.5, 0.18], chord: 0.65 } },
    // Gaulois : flûte et bodhrán, mode mixolydien
    gaule: { beat: 0.6, chords: [[50, 54, 57], [48, 52, 55], [43, 47, 50], [50, 54, 57], [45, 49, 52], [48, 52, 55], [43, 47, 50], [50, 54, 57]], mel: [62, 64, 66, 69, 71, 74, 76, 78], pad: ["sine", 700, 0.045], drone: [[38, 0.08], [45, 0.05]], k: pat({ 0: 0.16, 3: 0.1, 6: 0.12, 8: 0.14, 11: 0.1, 14: 0.08 }), t: Z, pl: { type: "triangle", decay: 0.9, vol: 0.065, p: [0.62, 0.3], chord: 0.4, vib: 1 } },
    // Évangélisation : chant, quintes ouvertes, grande réverbération
    evangelisation: { beat: 1.15, chords: [[50, 57, 62], [48, 55, 60], [46, 53, 58], [45, 52, 57], [50, 57, 62], [43, 50, 55], [45, 52, 57], [50, 57, 62]], mel: [62, 64, 65, 67, 69, 72, 74], pad: ["sine", 1100, 0.06], drone: [[38, 0.06]], k: Z, t: Z, pl: { type: "sine", decay: 3, vol: 0.06, p: [0.3, 0.05], chord: 0.5, voice: 1 }, fb: 0.5 },
    // Carolingiens : cuivres lents, marche solennelle
    carolingiens: { beat: 1.0, chords: [[48, 52, 55], [43, 47, 50], [45, 48, 52], [41, 45, 48], [48, 52, 55], [43, 47, 50], [41, 45, 48], [48, 52, 55]], mel: [60, 62, 64, 67, 69, 72, 74, 76], pad: ["sawtooth", 650, 0.03], drone: [[36, 0.07], [43, 0.04]], k: pat({ 0: 0.22, 8: 0.16 }), t: Z, pl: { type: "triangle", decay: 1.6, vol: 0.06, p: [0.4, 0.1], chord: 0.8 } },
    // Chevaliers : luth héroïque, arpèges
    chevaliers: { beat: 0.65, chords: [[43, 47, 50], [41, 45, 48], [48, 52, 55], [50, 54, 57], [43, 47, 50], [40, 43, 47], [48, 52, 55], [50, 54, 57]], mel: [67, 69, 71, 72, 74, 76, 79], pad: ["sine", 800, 0.03], drone: [[31, 0.06]], k: pat({ 0: 0.12, 8: 0.1 }), t: pat({ 4: 0.04, 12: 0.04 }), pl: { type: "triangle", decay: 0.75, vol: 0.05, p: [0.8, 0.35], chord: 1, arp: 1 }, lead: { type: "triangle", cut: 3200, att: 0.015, decay: 0.9, vol: 0.11, vib: 0.4, send: 0.35, bars: BARS(
      "g4 . . a4 b4 . d5 . g5 - - - d5 - b4 -",
      "a4 . c5 . f5 - - e5 d5 - c5 - a4 - - .",
      "g4 . c5 . e5 - - . g5 - e5 - d5 c5 d5 e5",
      "f#5 - - e5 d5 - a4 - d5 - - - . . a4 b4",
      "g4 . . a4 b4 . d5 . g5 - - - a5 - g5 -",
      "e5 - - d5 b4 - g4 - b4 - e5 - d5 - b4 -",
      "c5 . e5 . g5 - - e5 c5 - e5 - d5 - c5 -",
      "a4 - - - d5 - f#5 - a5 - - - g5 f#5 e5 d5") } },
    // Croisades : gamme orientale (hijaz), luth oriental et darbouka
    croisades: { beat: 0.55, chords: [[50, 54, 57], [51, 55, 58], [50, 54, 57], [48, 51, 55], [50, 54, 57], [51, 55, 58], [48, 51, 55], [50, 54, 57]], mel: [62, 63, 66, 67, 69, 70, 72, 74, 75, 78], pad: ["sawtooth", 520, 0.022], drone: [[38, 0.09], [45, 0.05]], k: pat({ 0: 0.18, 6: 0.14, 8: 0.18, 14: 0.12 }), t: pat({ 2: 0.1, 4: 0.1, 10: 0.1, 12: 0.1, 15: 0.07 }), pl: { type: "sawtooth", cut: 1800, decay: 0.6, vol: 0.035, p: [0.5, 0.25], chord: 0.2, slide: 1 }, lead: { type: "sawtooth", cut: 1700, att: 0.05, decay: 0.8, vol: 0.075, vib: 1, bend: 1, send: 0.45, bars: BARS(
      "d5 - eb5 - f#5 - - eb5 d5 - eb5 - d5 - - .",
      "g5 - - f#5 eb5 - d5 eb5 f#5 - - eb5 d5 - - .",
      "a5 - - g5 f#5 - eb5 - d5 - eb5 f#5 g5 - f#5 -",
      "g5 - f#5 - eb5 - d5 - c5 - - d5 eb5 - d5 -",
      "d5 - - eb5 d5 - c5 - bb4 - a4 - g4 - - .",
      "bb4 - c5 d5 eb5 - - d5 eb5 - f#5 - g5 - - .",
      "g5 - - f#5 eb5 f#5 g5 - bb5 - a5 - g5 - f#5 -",
      "eb5 - d5 - c5 - bb4 - a4 - - - d5 - - -") } },
    // Capétiens : orgue gothique et harpe
    capetiens: { beat: 1.0, chords: [[45, 48, 52], [41, 45, 48], [43, 47, 50], [40, 43, 47], [45, 48, 52], [38, 41, 45], [40, 44, 47], [45, 48, 52]], mel: [64, 67, 69, 71, 72, 74, 76, 79], pad: ["sawtooth", 480, 0.03], drone: [[33, 0.08], [40, 0.05]], k: pat({ 0: 0.15 }), t: Z, pl: { type: "sine", decay: 1.8, vol: 0.075, p: [0.45, 0.12], chord: 0.4 }, fb: 0.45 },
    // Renaissance : luth et danse (pavane)
    renaissance: { beat: 0.75, chords: [[41, 45, 48], [46, 50, 53], [48, 52, 55], [41, 45, 48], [38, 41, 45], [46, 50, 53], [48, 52, 55], [41, 45, 48]], mel: [65, 67, 69, 70, 72, 74, 77], pad: ["sine", 900, 0.03], drone: [[29, 0.05]], k: pat({ 0: 0.07, 8: 0.05 }), t: pat({ 4: 0.035, 12: 0.035 }), pl: { type: "triangle", cut: 1800, decay: 0.6, vol: 0.05, p: [0.7, 0.4], chord: 1, arp: 1 }, lead: { type: "sine", cut: 2600, att: 0.09, decay: 0.8, vol: 0.12, vib: 0.7, send: 0.3, bars: BARS(
      "f5 - a5 - c6 - a5 - f5 - g5 - a5 - - -",
      "bb5 - a5 - g5 - f5 - d5 - f5 - bb5 - - -",
      "c6 - bb5 - a5 - g5 - e5 - g5 - c6 - - -",
      "a5 - g5 - f5 - a5 - c6 - a5 - f5 - - -",
      "d6 - c6 - a5 - f5 - d5 - f5 - a5 - - -",
      "bb5 - d6 - c6 - bb5 - a5 - f5 - g5 - - -",
      "g5 - a5 - bb5 - g5 - e5 - f5 - g5 - - -",
      "a5 - g5 - f5 - e5 - f5 - - - - - - -") } },
    // Grand Siècle : clavecin baroque et cordes
    "grand-siecle": { beat: 0.6, chords: [[50, 54, 57], [45, 49, 52], [47, 50, 54], [43, 47, 50], [50, 54, 57], [40, 43, 47], [45, 49, 52], [50, 54, 57]], mel: [66, 69, 71, 73, 74, 76, 78, 81], pad: ["sawtooth", 1100, 0.018], drone: [], k: Z, t: Z, pl: { type: "sawtooth", cut: 2600, decay: 0.45, vol: 0.07, p: [0.9, 0.7], chord: 1, arp: 1 } },
    // Révolution : tambours de marche, tension
    revolution: { beat: 0.5, chords: [[45, 48, 52], [40, 44, 47], [45, 48, 52], [41, 45, 48], [40, 44, 47], [45, 48, 52], [38, 41, 45], [40, 44, 47]], mel: [69, 71, 72, 74, 76, 77, 80], pad: ["sawtooth", 500, 0.022], drone: [[33, 0.09]], k: pat({ 0: 0.2, 8: 0.2 }), t: pat({ 0: 0.12, 2: 0.07, 3: 0.07, 4: 0.12, 6: 0.07, 8: 0.12, 10: 0.07, 11: 0.07, 12: 0.12, 14: 0.07, 15: 0.09 }), pl: { type: "sawtooth", cut: 1500, decay: 0.5, vol: 0.04, p: [0.3, 0.1], chord: 0.5 } },
    // Empire : épopée, timbales et cuivres
    empire: { beat: 0.7, chords: [[50, 53, 57], [46, 50, 53], [53, 57, 60], [48, 52, 55], [50, 53, 57], [46, 50, 53], [45, 49, 52], [50, 53, 57]], mel: [62, 65, 69, 72, 74, 77, 81], pad: ["sawtooth", 800, 0.035], drone: [[26, 0.08], [38, 0.05]], k: pat({ 0: 0.24, 4: 0.12, 8: 0.18, 12: 0.12 }), t: pat({ 4: 0.07, 12: 0.07 }), pl: { type: "triangle", decay: 1.1, vol: 0.06, p: [0.35, 0.12], chord: 0.9 } },
    // Trésor (tous thèmes) : pulsation de suspense
    tresor: { beat: 0.8, chords: [[50, 53, 57], [46, 50, 53], [48, 52, 55], [45, 49, 52], [50, 53, 57], [43, 46, 50], [48, 52, 55], [45, 49, 52]], mel: [62, 65, 69, 72, 74, 77], pad: ["triangle", 700, 0.04], drone: [[38, 0.08]], k: pat({ 0: 0.2, 3: 0.12, 8: 0.14, 11: 0.1 }), t: pat({ 4: 0.03, 12: 0.03 }), pl: { type: "triangle", decay: 1.2, vol: 0.065, p: [0.35, 0.15], chord: 0.8 }, bass: 1 }
  };
  // La Fuite : poursuite effrénée, tambours rapides, arpèges tendus
  // La Fuite : marche grave en ré mineur, caisse sourde, cuivres sombres (Paris, 1789)
  THEMES.fuite = { beat: 0.62, chords: [[50, 53, 57], [46, 50, 53], [43, 46, 50], [45, 49, 52], [50, 53, 57], [46, 50, 53], [45, 49, 52], [50, 53, 57]], mel: [62, 65, 69], pad: ["sawtooth", 380, 0.035], drone: [[26, 0.08], [38, 0.05]], k: pat({ 0: 0.36, 6: 0.14, 8: 0.3, 14: 0.12 }), t: pat({ 3: 0.07, 7: 0.1, 11: 0.07, 15: 0.1 }), bass: 1, pl: { type: "triangle", decay: 0.2, vol: 0.02, p: [0, 0], chord: 1 }, fb: 0.34,
    lead: { type: "sawtooth", cut: 1300, att: 0.05, decay: 0.9, vol: 0.05, vib: 0.5, send: 0.35, bars: BARS(
      "d4 - - - f4 - - - a4 - - - g4 - f4 -",
      "d5 - - - c5 - bb4 - a4 - - - g4 - - .",
      "g4 - - - bb4 - - - d5 - - - c5 - bb4 -",
      "a4 - - - c#5 - - - e5 - - - d5 - c#5 -",
      "d5 - - - f5 - - - e5 - d5 - c5 - - .",
      "bb4 - - - d5 - - - f5 - - - e5 - d5 -",
      "c#5 - e5 - a5 - - - g5 - f5 - e5 - c#5 -",
      "d5 - - - - - - - a4 - - - d4 - - -") } };
  THEMES.modernes = Object.assign({}, THEMES.empire, { beat: 0.8, chords: [[52, 55, 59], [48, 52, 55], [50, 54, 57], [47, 50, 54], [52, 55, 59], [48, 52, 55], [45, 49, 52], [47, 51, 54]], mel: [64, 66, 69, 71, 73, 76, 78] });

  const Music = (() => {
    let on = false, theme = "", cfg = null, master = null, drone = [], echo = null, timer = null, nextT = 0, step = 0, chord = 0, noiseBuf = null;

    function ensure() { if (!AC) return null; if (!ctx) ctx = new AC(); return ctx; }
    const osc = (type, f, t0, t1, gain, dest, detune = 0) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type; o.frequency.value = f; o.detune.value = detune;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.linearRampToValueAtTime(gain, t0 + 2.4);
      g.gain.setValueAtTime(gain, t1 - 2.6);
      g.gain.linearRampToValueAtTime(0.0001, t1);
      o.connect(g).connect(dest);
      o.start(t0); o.stop(t1 + 0.1);
    };
    function pluck(f, t) {
      const p = cfg.pl, o = ctx.createOscillator(), g = ctx.createGain();
      o.type = p.type; o.frequency.value = f;
      if (p.slide) { o.frequency.setValueAtTime(f * 0.94, t); o.frequency.exponentialRampToValueAtTime(f, t + 0.07); }
      if (p.vib) { const l = ctx.createOscillator(), lg = ctx.createGain(); l.frequency.value = 5.2; lg.gain.value = f * 0.006; l.connect(lg).connect(o.frequency); l.start(t); l.stop(t + p.decay + 0.2); }
      const att = p.voice ? 0.5 : 0.02;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(p.vol, t + att);
      g.gain.exponentialRampToValueAtTime(0.0001, t + p.decay + att);
      let out = g;
      if (p.cut) { const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = p.cut; g.connect(lp); out = lp; }
      o.connect(g); out.connect(master); out.connect(echo);
      o.start(t); o.stop(t + p.decay + att + 0.1);
    }
    function leadNote(L, m, t, len) {
      const f = mtof(m), d = len * cfg.beat / 2, o = ctx.createOscillator(), g = ctx.createGain();
      o.type = L.type; o.frequency.setValueAtTime(L.bend ? f * 0.955 : f, t);
      if (L.bend) o.frequency.exponentialRampToValueAtTime(f, t + 0.09);
      if (L.vib && d > 0.5) { const l = ctx.createOscillator(), lg = ctx.createGain(); l.frequency.value = 5.4; lg.gain.setValueAtTime(0, t); lg.gain.linearRampToValueAtTime(f * 0.007 * L.vib, t + 0.35); l.connect(lg).connect(o.frequency); l.start(t); l.stop(t + d + L.decay); }
      const end = t + d * 0.92 + 0.12;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(L.vol, t + L.att);
      g.gain.exponentialRampToValueAtTime(L.vol * (len > 2 ? 0.55 : 0.8), t + Math.min(d * 0.8, L.decay));
      g.gain.exponentialRampToValueAtTime(0.0001, end + 0.25);
      const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = L.cut;
      o.connect(g); g.connect(lp); lp.connect(master);
      const sg = ctx.createGain(); sg.gain.value = L.send; lp.connect(sg); sg.connect(echo);
      o.start(t); o.stop(end + 0.3);
    }
    function drum(t, vol) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = "sine"; o.frequency.setValueAtTime(110, t); o.frequency.exponentialRampToValueAtTime(48, t + 0.28);
      g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
      o.connect(g).connect(master); o.start(t); o.stop(t + 0.55);
    }
    function tek(t, vol) {
      if (!noiseBuf) { noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate); const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }
      const src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
      src.buffer = noiseBuf; f.type = "bandpass"; f.frequency.value = 3200; f.Q.value = 0.8;
      g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
      src.connect(f).connect(g).connect(master); src.start(t); src.stop(t + 0.15);
    }
    function schedule() {
      if (!on || !ctx || !cfg) return;
      const B = cfg.beat;
      while (nextT < ctx.currentTime + 0.8) {
        const t = nextT, k = step % 16;
        if (k === 0) {
          const c = cfg.chords[chord % cfg.chords.length];
          const len = B * 8;
          const pad = ctx.createBiquadFilter(); pad.type = "lowpass"; pad.frequency.value = cfg.pad[1]; pad.connect(master);
          c.forEach((m, i) => { osc(cfg.pad[0], mtof(m), t, t + len + 1.5, cfg.pad[2], pad, -6 + i * 6); osc("sine", mtof(m) * 2, t, t + len + 1.5, cfg.pad[2] * 0.25, pad); });
          chord++;
        }
        if (cfg.k[k]) drum(t, cfg.k[k]);
        if (cfg.t[k]) tek(t, cfg.t[k]);
        if (cfg.bass && k % 2 === 0) { const o = ctx.createOscillator(), g = ctx.createGain(); o.type = "sine"; o.frequency.value = mtof(cfg.chords[(chord - 1 + 8) % 8][0] - 12); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.1, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + B * 0.9); o.connect(g).connect(master); o.start(t); o.stop(t + B); }
        const pl = cfg.pl, strong = k % 2 === 0;
        if (Math.random() < (strong ? pl.p[0] : pl.p[1])) {
          const tones = cfg.chords[(chord - 1 + 8) % 8].map((m) => mtof(m + 12));
          let f;
          if (pl.arp) f = tones[(k / 2 | 0) % 3] * (k % 8 >= 4 ? 2 : 1);
          else f = Math.random() < pl.chord ? tones[Math.floor(Math.random() * 3)] : mtof(cfg.mel[Math.floor(Math.random() * cfg.mel.length)]);
          pluck(f, t);
        }
        if (cfg.lead) { const n = cfg.lead.bars[(chord - 1 + 8) % 8][k]; if (n) leadNote(cfg.lead, n.m, t, n.len); }
        step++; nextT += B / 2;
      }
    }
    function start(id) {
      if (on || !ensure()) return;
      cfg = THEMES[id] || THEMES.moines; theme = id;
      try {
        if (ctx.state === "suspended") ctx.resume();
        on = true;
        master = ctx.createGain(); master.gain.setValueAtTime(0.0001, ctx.currentTime);
        master.gain.linearRampToValueAtTime(0.55, ctx.currentTime + 3);
        master.connect(ctx.destination);
        echo = ctx.createDelay(1); echo.delayTime.value = cfg.beat * 0.75;
        const fb = ctx.createGain(); fb.gain.value = cfg.fb || 0.38;
        const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 1400;
        echo.connect(lp); lp.connect(fb); fb.connect(echo); lp.connect(master);
        const dl = ctx.createBiquadFilter(); dl.type = "lowpass"; dl.frequency.value = 420; dl.connect(master);
        drone = cfg.drone.map(([m, v]) => { const o = ctx.createOscillator(), g = ctx.createGain(); o.type = "sine"; o.frequency.value = mtof(m); g.gain.value = v; o.connect(g).connect(dl); o.start(); return o; });
        step = 0; chord = 0; nextT = ctx.currentTime + 0.2;
        timer = setInterval(schedule, 200); schedule();
      } catch (e) { on = false; }
    }
    function stop() {
      if (!on) return;
      on = false; clearInterval(timer); theme = "";
      const m = master, d = drone;
      try {
        m.gain.cancelScheduledValues(ctx.currentTime);
        m.gain.setValueAtTime(m.gain.value, ctx.currentTime);
        m.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
        setTimeout(() => { d.forEach((o) => { try { o.stop(); } catch (e) {} }); try { m.disconnect(); } catch (e) {} }, 1500);
      } catch (e) { /* rien */ }
      master = null; drone = [];
    }
    document.addEventListener("visibilitychange", () => {
      if (!ctx) return;
      if (document.hidden) { try { ctx.suspend(); } catch (e) {} } else if (on) { try { ctx.resume(); } catch (e) {} }
    });
    return { sync: (wanted, id) => { if (!wanted) return stop(); if (on && theme !== id) stop(); start(id); }, themes: () => Object.keys(THEMES) };
  })();

  window.HistoriaArt = Object.assign(window.HistoriaArt || {}, { scene, ICONS_EXTRA, play, confetti, music: Music });
})();
