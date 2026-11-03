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
    revolution: ["#3f8f8a", "#162450"], empire: ["#8f9ab8", "#1a2350"]
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
      <g fill="#f3ead2" fill-opacity=".55"><circle cx="30" cy="22" r="1.2"/><circle cx="90" cy="14" r="1"/><circle cx="150" cy="30" r="1.2"/><circle cx="318" cy="18" r="1.2"/><circle cx="340" cy="52" r="1"/><circle cx="214" cy="14" r="1"/></g>
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

  window.HistoriaArt = { scene, ICONS_EXTRA, play, confetti };
})();
