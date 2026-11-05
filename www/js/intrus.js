/* Historia — « Trouve les intrus » : quatre scènes médiévales dessinées en SVG, trois objets modernes cachés dans chacune.
   Chaque intrus : position (x, y) et rayon de détection (r) dans un repère de 400 × 300. */
(function (root) {
  "use strict";

  const OUT = "#3a2914";
  const SKIN = "#f1cfa5";
  const head = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r || 10}" fill="${SKIN}" stroke="${OUT}" stroke-width="1"/><circle cx="${x - 3.5}" cy="${y - 1}" r="1.1" fill="${OUT}"/><circle cx="${x + 3.5}" cy="${y - 1}" r="1.1" fill="${OUT}"/><path d="M${x - 3} ${y + 4}q3 2.500 6 0" stroke="${OUT}" fill="none" stroke-width="1"/>`;
  const torso = (x, y, w, h, c) => `<path d="M${x - w / 2} ${y + h}L${x - w / 2 + 3} ${y + 6}Q${x} ${y} ${x + w / 2 - 3} ${y + 6}L${x + w / 2} ${y + h}z" fill="${c}" stroke="${OUT}" stroke-width="1"/>`;
  const person = (x, y, c, extra) => torso(x, y + 12, 32, 44, c) + head(x, y, 10) + (extra || "");
  const crown = (x, y) => `<path d="M${x - 9} ${y - 8}l2-9 4 5 3-8 3 8 4-5 2 9z" fill="#e0b24f" stroke="#7a5818" stroke-width="1"/>`;
  const hood = (x, y, c) => `<path d="M${x - 13} ${y + 14}Q${x - 14} ${y - 14} ${x} ${y - 14}Q${x + 14} ${y - 14} ${x + 13} ${y + 14}z" fill="${c}" stroke="${OUT}" stroke-width="1"/>` + head(x, y + 1, 8.500);
  const cap = (x, y, c) => `<path d="M${x - 11} ${y - 3}Q${x} ${y - 18} ${x + 11} ${y - 3}z" fill="${c}" stroke="${OUT}" stroke-width="1"/>`;
  const flame = (x, y) => `<path d="M${x} ${y}c-6-8 0-12 0-18 6 6 6 12 0 18z" fill="#f5a623"/><path d="M${x} ${y}c-3-4 0-6 0-9 3 3 3 6 0 9z" fill="#ffe082"/>`;
  const stoneWall = (id, a, b) => `<pattern id="${id}" width="40" height="24" patternUnits="userSpaceOnUse"><rect width="40" height="24" fill="${a}"/><path d="M0 12h40M20 0v12M0 12v12" stroke="${b}" stroke-width="1.200" fill="none"/></pattern>`;

  /* ----- 1. Le banquet du château ----- */
  function banquet() {
    const win = (x) => `<path d="M${x} 120V62a22 22 0 0 1 44 0v58z" fill="#aac4dd" stroke="${OUT}" stroke-width="3"/><path d="M${x + 22} 40v80M${x} 85h44" stroke="${OUT}" stroke-width="2"/>`;
    return `<defs>${stoneWall("st1", "#7a6650", "#5d4c3a")}</defs>
    <rect width="400" height="300" fill="url(#st1)"/>
    <rect y="205" width="400" height="95" fill="#8a6335"/><path d="M0 228h400M0 252h400M0 276h400" stroke="#6e4d27" stroke-width="1.500"/>
    ${win(26)}${win(330)}
    <path d="M120 18h34v72l-17-14-17 14z" fill="#8a1f2b" stroke="${OUT}"/><circle cx="137" cy="42" r="7" fill="#e0b24f"/>
    <path d="M246 18h34v72l-17-14-17 14z" fill="#1f3a8a" stroke="${OUT}"/><circle cx="263" cy="42" r="7" fill="#e0b24f"/>
    <rect x="184" y="52" width="4" height="26" fill="#3a2914"/>${flame(186, 52)}
    ${person(90, 112, "#2e7d4f")}${person(150, 112, "#8a5a2b", hood(150, 112, "#8a5a2b"))}
    ${person(205, 108, "#8a1f2b", crown(205, 108))}${person(262, 112, "#6b3fa0")}${person(322, 112, "#b3772a", cap(322, 112, "#2b4a8a"))}
    <rect x="28" y="148" width="344" height="12" fill="#f4ecd8" stroke="${OUT}"/><rect x="28" y="160" width="344" height="46" fill="#a0713a" stroke="${OUT}"/>
    <path d="M28 160l14 18 14-18 14 18 14-18 14 18 14-18 14 18 14-18 14 18 14-18 14 18 14-18 14 18 14-18 14 18 14-18 14 18 14-18 14 18 14-18" fill="none" stroke="#d9b36a" stroke-width="1.200"/>
    <ellipse cx="205" cy="146" rx="26" ry="7" fill="#c9a96a" stroke="${OUT}"/><ellipse cx="205" cy="140" rx="17" ry="9" fill="#a8531f" stroke="${OUT}"/><circle cx="195" cy="134" r="2.500" fill="#f1cfa5"/><circle cx="215" cy="134" r="2.500" fill="#f1cfa5"/>
    <ellipse cx="108" cy="145" rx="10" ry="5" fill="#d79a42" stroke="${OUT}"/><ellipse cx="124" cy="146" rx="8" ry="4" fill="#c98b3c" stroke="${OUT}"/>
    <circle cx="72" cy="143" r="5" fill="#c0392b"/><circle cx="82" cy="145" r="5" fill="#c0392b"/>
    <path d="M165 138h8l-1 9h-6z" fill="#e0b24f" stroke="${OUT}"/><path d="M236 138h8l-1 9h-6z" fill="#e0b24f" stroke="${OUT}"/><path d="M296 138h8l-1 9h-6z" fill="#e0b24f" stroke="${OUT}"/>
    <ellipse cx="338" cy="146" rx="12" ry="5" fill="#d79a42" stroke="${OUT}"/>
    <rect x="40" y="206" width="8" height="30" fill="#6e4d27"/><rect x="352" y="206" width="8" height="30" fill="#6e4d27"/>
    <g transform="translate(70 238)"><ellipse cx="0" cy="12" rx="14" ry="22" fill="#b3772a" stroke="${OUT}"/><circle cx="0" cy="-14" r="9" fill="${SKIN}" stroke="${OUT}"/><path d="M-9 -16Q0 -28 9 -16z" fill="#c0392b" stroke="${OUT}"/><ellipse cx="14" cy="10" rx="10" ry="7" fill="#d9a05b" stroke="${OUT}"/><path d="M22 6l18-14" stroke="${OUT}" stroke-width="2"/></g>
    <g transform="translate(320 250)"><ellipse cx="0" cy="0" rx="18" ry="8" fill="#8b6a45" stroke="${OUT}"/><circle cx="-16" cy="-4" r="7" fill="#8b6a45" stroke="${OUT}"/><path d="M-20-10l-3-6M-14-10l2-6" stroke="${OUT}" stroke-width="2"/></g>
    <g class="intr">
      <g transform="translate(250 160) rotate(-18)"><rect x="-7" y="-12" width="14" height="24" rx="2.500" fill="#1b1b1f" stroke="#555"/><rect x="-5.500" y="-9.500" width="11" height="17" rx="1" fill="#6fc3ff"/><circle cx="0" cy="9.500" r="1" fill="#777"/></g>
      <g transform="translate(150 158)"><rect x="-6" y="-14" width="12" height="16" rx="2" fill="#d62828" stroke="#7a1010"/><rect x="-6" y="-9" width="12" height="4" fill="#f4f4f4"/><ellipse cx="0" cy="-14" rx="6" ry="2" fill="#bbb"/><path d="M2-15l5-7" stroke="#f4f4f4" stroke-width="1.500"/></g>
      <g transform="translate(322 110)"><ellipse cx="-5.500" cy="0" rx="5.500" ry="3.800" fill="#111"/><ellipse cx="5.500" cy="0" rx="5.500" ry="3.800" fill="#111"/><path d="M-1 -1h2M-11 -1l-3-2M11 -1l3-2" stroke="#111" stroke-width="1.200"/></g>
    </g>`;
  }

  /* ----- 2. Le marché du village ----- */
  function marche() {
    const house = (x, w, c, roof) => `<rect x="${x}" y="100" width="${w}" height="90" fill="${c}" stroke="${OUT}" stroke-width="1.500"/><path d="M${x - 6} 102L${x + w / 2} 62l${w / 2 + 6} 40z" fill="${roof}" stroke="${OUT}" stroke-width="1.500"/><path d="M${x} 130h${w}M${x} 160h${w}M${x + w / 3} 100v90M${x + 2 * w / 3} 100v90" stroke="#5a3d1e" stroke-width="2"/><rect x="${x + w / 2 - 8}" y="118" width="16" height="20" fill="#e8d28a" stroke="${OUT}"/>`;
    const stall = (x, c, goods) => `<rect x="${x}" y="198" width="70" height="26" fill="#a0713a" stroke="${OUT}"/><path d="M${x - 4} 170h78l-6 18h-66z" fill="${c}" stroke="${OUT}"/><path d="M${x - 4} 170l13 18M${x + 22} 170l-1 18M${x + 48} 170l1 18M${x + 74} 170l-13 18" stroke="#fff" stroke-width="3" opacity=".7"/><rect x="${x}" y="170" width="3" height="54" fill="#5a3d1e"/><rect x="${x + 67}" y="170" width="3" height="54" fill="#5a3d1e"/>${goods}`;
    return `<defs><linearGradient id="sk2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fc3e8"/><stop offset="1" stop-color="#d7ecf7"/></linearGradient></defs>
    <rect width="400" height="300" fill="url(#sk2)"/><circle cx="350" cy="40" r="20" fill="#fff4b3"/>
    <path d="M0 150Q80 110 160 140T330 130 400 150v10H0z" fill="#8bbf6b"/>
    <rect y="205" width="400" height="95" fill="#c8a76b"/><path d="M0 240h400M0 270h400" stroke="#b08f55" stroke-width="2" stroke-dasharray="14 10"/>
    ${house(10, 90, "#e9d9b0", "#a8531f")}${house(300, 90, "#d8c18a", "#7a3f1f")}
    <rect x="150" y="50" width="54" height="130" fill="#b9b2a5" stroke="${OUT}" stroke-width="1.500"/><path d="M146 52L177 14l31 38z" fill="#7a3f1f" stroke="${OUT}"/><path d="M165 80v-14a12 12 0 0 1 24 0v14z" fill="#3a2914"/><circle cx="177" cy="36" r="5" fill="#e0b24f"/><path d="M164 180v-34a13 13 0 0 1 26 0v34z" fill="#5a3d1e"/>
    ${stall(30, "#c0392b", '<circle cx="48" cy="196" r="6" fill="#d62828"/><circle cx="62" cy="197" r="6" fill="#e67e22"/><circle cx="76" cy="196" r="6" fill="#6aa84f"/>')}
    ${stall(250, "#2e6fa8", '<ellipse cx="270" cy="196" rx="12" ry="6" fill="#d79a42" stroke="#3a2914"/><ellipse cx="294" cy="197" rx="10" ry="5" fill="#c98b3c" stroke="#3a2914"/>')}
    <g transform="translate(135 245)"><ellipse cx="0" cy="0" rx="26" ry="8" fill="#8b8b8b" stroke="${OUT}"/><rect x="-22" y="-26" width="44" height="26" fill="#9e9e9e" stroke="${OUT}"/><ellipse cx="0" cy="-26" rx="22" ry="7" fill="#2b2b2b"/><path d="M-22-26l22-14 22 14" fill="none" stroke="#5a3d1e" stroke-width="3"/></g>
    ${person(225, 232, "#2e7d4f", cap(225, 232, "#8a5a2b"))}${person(95, 242, "#b3772a")}${person(338, 238, "#6b3fa0", hood(338, 238, "#6b3fa0"))}
    <g transform="translate(180 262)"><ellipse cx="0" cy="0" rx="9" ry="6" fill="#f4f4f4" stroke="${OUT}"/><circle cx="-8" cy="-3" r="4" fill="#f4f4f4" stroke="${OUT}"/><path d="M-11-6l-2-4M-9-7l1-4" stroke="#e67e22" stroke-width="2"/></g>
    <g class="intr">
      <g transform="translate(60 33)"><path d="M-14 -9l9-5h10l9 5v10l-9 5h-10l-9-5z" fill="#c62828" stroke="#fff" stroke-width="1.500"/><text x="0" y="3" font-family="Arial,sans-serif" font-size="6.500" font-weight="700" text-anchor="middle" fill="#fff">STOP</text><rect x="-1.500" y="13" width="3" height="40" fill="#777"/></g>
      <g transform="translate(375 114)"><path d="M-10 6Q0 -4 10 6z" fill="#9aa0a6" stroke="#5f6368"/><path d="M-1 6l8 12" stroke="#5f6368" stroke-width="2"/><circle cx="0" cy="2" r="1.500" fill="#d93025"/></g>
      <g transform="translate(310 190)"><rect x="-4" y="-20" width="8" height="5" rx="1" fill="#fff" stroke="#8ab4f8"/><path d="M-6 -15h12l1 28q-7 3-14 0z" fill="#d6ecff" stroke="#4a90c8" stroke-width="1.200"/><path d="M-5 -5h10" stroke="#4a90c8"/></g>
    </g>`;
  }

  /* ----- 3. Le scriptorium de l'abbaye ----- */
  function scriptorium() {
    const arch = (x) => `<path d="M${x} 150V80a30 30 0 0 1 60 0v70z" fill="#cfe3f5" stroke="${OUT}" stroke-width="3"/><path d="M${x + 30} 50v100M${x} 100h60" stroke="${OUT}" stroke-width="2"/>`;
    const desk = (x, y) => `<path d="M${x - 40} ${y + 8}L${x - 26} ${y - 6}H${x + 26}L${x + 40} ${y + 8}z" fill="#a0713a" stroke="${OUT}"/><rect x="${x - 36}" y="${y + 8}" width="72" height="42" fill="#8a5a2b" stroke="${OUT}"/><rect x="${x - 18}" y="${y - 8}" width="36" height="8" fill="#f4ecd8" stroke="${OUT}"/><path d="M${x - 12} ${y - 5}h24" stroke="#7a5818"/>`;
    return `<defs>${stoneWall("st3", "#9c8d74", "#7b6d55")}</defs>
    <rect width="400" height="300" fill="url(#st3)"/><rect y="205" width="400" height="95" fill="#6e5a3d"/><path d="M0 235h400M0 268h400" stroke="#574730" stroke-width="2"/>
    ${arch(20)}${arch(320)}
    <rect x="130" y="40" width="140" height="110" fill="#5a3d1e" stroke="${OUT}" stroke-width="2"/><path d="M130 76h140M130 112h140" stroke="${OUT}" stroke-width="3"/>
    <rect x="138" y="48" width="12" height="26" fill="#8a1f2b"/><rect x="152" y="50" width="10" height="24" fill="#2e7d4f"/><rect x="164" y="47" width="14" height="27" fill="#b3772a"/><rect x="200" y="50" width="12" height="24" fill="#1f3a8a"/><rect x="214" y="48" width="14" height="26" fill="#8a1f2b"/>
    <rect x="140" y="84" width="14" height="26" fill="#b3772a"/><rect x="156" y="86" width="12" height="24" fill="#2e7d4f"/><rect x="228" y="85" width="14" height="25" fill="#1f3a8a"/><rect x="146" y="120" width="12" height="26" fill="#8a1f2b"/><rect x="236" y="121" width="14" height="25" fill="#b3772a"/>
    ${person(90, 182, "#6b4a2a", hood(90, 182, "#6b4a2a"))}${desk(90, 214)}
    ${person(200, 190, "#6b4a2a", hood(200, 190, "#6b4a2a"))}${desk(200, 222)}
    ${person(310, 182, "#4a3320", hood(310, 182, "#4a3320"))}${desk(310, 214)}
    <rect x="54" y="226" width="6" height="22" fill="#3a2914"/>${flame(57, 226)}
    <path d="M112 206q10-18 20-4" fill="none" stroke="${OUT}" stroke-width="2"/><path d="M286 208l12-16" stroke="#f4ecd8" stroke-width="3"/>
    <ellipse cx="258" cy="212" rx="7" ry="3.500" fill="#2b2b2b"/><rect x="255" y="203" width="6" height="9" fill="#2b2b2b"/>
    <g class="intr">
      <g transform="translate(195 232)"><path d="M-17 0l5-18h24l5 18z" fill="#c9cdd1" stroke="#5f6368"/><rect x="-13" y="-16" width="26" height="14" fill="#3b4a5a"/><rect x="-18" y="0" width="36" height="5" rx="1" fill="#9aa0a6" stroke="#5f6368"/><circle cx="0" cy="-9" r="2.500" fill="#e8eaed"/></g>
      <g transform="translate(250 20)"><path d="M0 -20v14" stroke="#555" stroke-width="2"/><rect x="-4" y="-8" width="8" height="6" fill="#999"/><path d="M-9 -2a9 11 0 1 0 18 0q-2-3-9-3t-9 3z" fill="#fff59d" stroke="#e0b24f"/><path d="M-3 4l3-5 3 5" fill="none" stroke="#e08a1e"/></g>
      <g transform="translate(90 168)"><path d="M-13 6a13 15 0 0 1 26 0" fill="none" stroke="#222" stroke-width="2.500"/><rect x="-16" y="3" width="6" height="10" rx="2.500" fill="#d62828"/><rect x="10" y="3" width="6" height="10" rx="2.500" fill="#d62828"/></g>
    </g>`;
  }

  /* ----- 4. Le camp devant le château ----- */
  function camp() {
    const tent = (x, y, c) => `<path d="M${x - 30} ${y}L${x} ${y - 38}L${x + 30} ${y}z" fill="${c}" stroke="${OUT}" stroke-width="1.500"/><path d="M${x - 8} ${y}L${x} ${y - 18}L${x + 8} ${y}z" fill="#3a2914"/><path d="M${x} ${y - 38}v-12" stroke="${OUT}" stroke-width="2"/><path d="M${x} ${y - 50}l14 4-14 4z" fill="#e0b24f"/>`;
    const knight = (x, y, c) => `<g transform="translate(${x} ${y})"><path d="M-12 36l3-26q9-6 18 0l3 26z" fill="${c}" stroke="${OUT}"/><path d="M-9 -2a9 11 0 0 1 18 0v8h-18z" fill="#b8bfc6" stroke="${OUT}"/><path d="M-9 2h18" stroke="${OUT}"/><path d="M-1 -12v6" stroke="${OUT}"/><path d="M16 36V0" stroke="#6e4d27" stroke-width="2.500"/><path d="M16 -6l-5 8h10z" fill="#9aa0a6" stroke="${OUT}"/></g>`;
    return `<defs><linearGradient id="sk4" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fb0d8"/><stop offset="1" stop-color="#e3f1f9"/></linearGradient></defs>
    <rect width="400" height="300" fill="url(#sk4)"/>
    <path d="M0 150Q120 110 240 135T400 125V300H0z" fill="#7da35a"/><path d="M0 235Q150 215 400 240V300H0z" fill="#6b8f49"/>
    <g><rect x="215" y="62" width="150" height="78" fill="#a9a398" stroke="${OUT}" stroke-width="2"/><rect x="205" y="38" width="34" height="102" fill="#9b958a" stroke="${OUT}" stroke-width="2"/><rect x="340" y="38" width="34" height="102" fill="#9b958a" stroke="${OUT}" stroke-width="2"/>
    <path d="M205 38h6v-8h6v8h6v-8h6v8h6v-8h4v8M340 38h6v-8h6v8h6v-8h6v8h6v-8h4v8M215 62h6v-8h6v8h6v-8h6v8h6v-8h6v8h6v-8h6v8h6v-8h6v8h6v-8h6v8h6v-8h6v8h6v-8h6v8h6v-8h6v8h6v-8h6v8" fill="none" stroke="${OUT}" stroke-width="1.500"/>
    <path d="M268 140v-32a22 22 0 0 1 44 0v32z" fill="#3a2914"/><path d="M290 140v-52" stroke="#6e4d27" stroke-width="2"/><path d="M222 38v-14l14 4-14 4z" fill="#c0392b"/><path d="M357 38v-14l14 4-14 4z" fill="#c0392b"/><rect x="228" y="60" width="4" height="14" fill="#3a2914"/><rect x="348" y="60" width="4" height="14" fill="#3a2914"/></g>
    <g transform="translate(95 200)"><path d="M-30 0h60" stroke="#5a3d1e" stroke-width="4"/><path d="M-22 0l22-60 6 4-22 56zM22 0L0 -60" stroke="#5a3d1e" stroke-width="4" fill="none"/><path d="M-6 -56l36-14" stroke="#6e4d27" stroke-width="3"/><circle cx="34" cy="-72" r="7" fill="#777" stroke="${OUT}"/><circle cx="-26" cy="4" r="9" fill="#6e4d27" stroke="${OUT}"/><circle cx="26" cy="4" r="9" fill="#6e4d27" stroke="${OUT}"/></g>
    ${tent(50, 262, "#c0392b")}${tent(160, 270, "#1f3a8a")}${tent(250, 264, "#e0b24f")}
    ${knight(318, 218, "#8a1f2b")}${knight(345, 226, "#1f3a8a")}
    <rect x="198" y="222" width="5" height="26" fill="#3a2914"/>${flame(200.5, 222)}
    <g class="intr">
      <g transform="translate(78 44)"><path d="M-30 4h46l7-4-7-4h-30z" fill="#f4f4f4" stroke="#9aa0a6"/><path d="M-6 3l-12 22h8l14-22zM-6 2l-12-18h8l14 18z" fill="#dfe3e8" stroke="#9aa0a6"/><path d="M-30 2l-5-9" stroke="#9aa0a6" stroke-width="3"/><path d="M-40 2H-100" stroke="#fff" stroke-width="3" opacity=".7"/></g>
      <g transform="translate(205 258)"><path d="M-9 14l3-26h6l3 26z" fill="#ff7a00" stroke="#a04a00"/><rect x="-11" y="14" width="22" height="3" fill="#ff7a00" stroke="#a04a00"/><path d="M-6.500 -2h11M-7 5h12" stroke="#fff" stroke-width="2.500"/></g>
      <g transform="translate(318 246) rotate(-6)"><rect x="-10" y="-7" width="20" height="13" rx="2" fill="#1b1b1f" stroke="#555"/><rect x="-5" y="-11" width="10" height="5" rx="1" fill="#2b2b2b"/><circle cx="0" cy="0" r="5" fill="#6fc3ff" stroke="#999"/><circle cx="0" cy="0" r="2" fill="#0b2a44"/></g>
    </g>`;
  }

  const SCENES = [
    {
      id: "banquet",
      title: { fr: "Le banquet du château", en: "The castle banquet" },
      draw: banquet,
      intruders: [
        { x: 250, y: 160, r: 20, name: { fr: "Un smartphone", en: "A smartphone" }, text: { fr: "Un téléphone portable au Moyen Âge ? Le seul « réseau » de l'époque, c'était le bouche-à-oreille ! Une nouvelle voyageait à la vitesse d'un cheval, et parfois d'un âne.", en: "A mobile phone in the Middle Ages? The only “network” back then was word of mouth! News travelled at the speed of a horse, and sometimes a donkey." } },
        { x: 150, y: 150, r: 18, name: { fr: "Une canette de soda", en: "A soda can" }, text: { fr: "Les premières canettes de bière datent de 1935. Au banquet, on buvait plutôt du vin coupé d'eau, de la bière ou de l'hydromel, dans des gobelets, des cornes ou des coupes.", en: "The first beer cans date from 1935. At a banquet people drank wine mixed with water, beer or mead, from goblets, horns or cups." } },
        { x: 322, y: 110, r: 20, name: { fr: "Des lunettes de soleil", en: "Sunglasses" }, text: { fr: "Les lunettes à verres apparaissent en Italie vers 1286, mais les lunettes de soleil à la mode datent du XXe siècle. Dans la grande salle, avec les torches, elles n'auraient servi à rien !", en: "Glasses with lenses appear in Italy around 1286, but fashionable sunglasses are from the 20th century. In the great hall, lit by torches, they would have been no use at all!" } }
      ]
    },
    {
      id: "marche",
      title: { fr: "Le marché du village", en: "The village market" },
      draw: marche,
      intruders: [
        { x: 60, y: 40, r: 22, name: { fr: "Un panneau STOP", en: "A STOP sign" }, text: { fr: "Les panneaux de signalisation routière n'existaient pas : il n'y avait presque pas de routes pavées, et très peu de voitures… à cheval ! Le premier « stop » moderne date de 1915.", en: "Road signs did not exist: there were hardly any paved roads, and no cars at all! The first modern stop sign appeared around 1915." } },
        { x: 375, y: 118, r: 20, name: { fr: "Une antenne parabolique", en: "A satellite dish" }, text: { fr: "Une parabole sur un toit de chaume ! Le premier satellite de télévision date de 1962. Au village, la seule « chaîne » à suivre, c'était le sermon du dimanche.", en: "A satellite dish on a thatched roof! The first television satellite dates from 1962. In the village, the only “channel” to follow was Sunday's sermon." } },
        { x: 310, y: 185, r: 18, name: { fr: "Une bouteille en plastique", en: "A plastic bottle" }, text: { fr: "Le plastique moderne ne se généralise qu'au XXe siècle. Au Moyen Âge, on transportait l'eau et le vin dans des outres en peau, des cruches en terre ou des tonneaux.", en: "Modern plastic only became widespread in the 20th century. In the Middle Ages water and wine were carried in leather bags, clay jugs or barrels." } }
      ]
    },
    {
      id: "scriptorium",
      title: { fr: "Le scriptorium de l'abbaye", en: "The abbey scriptorium" },
      draw: scriptorium,
      intruders: [
        { x: 195, y: 222, r: 24, name: { fr: "Un ordinateur portable", en: "A laptop" }, text: { fr: "Pour copier un livre, un moine mettait des mois. Un ordinateur aurait fait « Ctrl+C, Ctrl+V » en une seconde ! Mais il aurait fallu l'électricité… et un bon wifi.", en: "A monk took months to copy one book. A laptop would have done “Ctrl+C, Ctrl+V” in a second! But it would have needed electricity… and good wifi." } },
        { x: 250, y: 20, r: 20, name: { fr: "Une ampoule électrique", en: "A light bulb" }, text: { fr: "L'ampoule à incandescence est mise au point vers 1879. Les moines travaillaient à la lueur du jour, des chandelles ou des lampes à huile, et s'arrêtaient à la nuit tombée.", en: "The incandescent bulb was perfected around 1879. Monks worked by daylight, candles or oil lamps, and stopped when night fell." } },
        { x: 90, y: 170, r: 22, name: { fr: "Un casque audio", en: "Headphones" }, text: { fr: "Un moine avec un casque ! Les moines vivaient dans le silence, mais ils chantaient pour prier plusieurs fois par jour : le chant grégorien, c'était leur playlist.", en: "A monk with headphones! Monks lived in silence, but sang to pray several times a day: Gregorian chant was their playlist." } }
      ]
    },
    {
      id: "camp",
      title: { fr: "Le camp devant le château", en: "The camp before the castle" },
      draw: camp,
      intruders: [
        { x: 60, y: 48, r: 26, name: { fr: "Un avion de ligne", en: "An airliner" }, text: { fr: "Les seuls « avions » du Moyen Âge étaient les oiseaux ! Les frères Wright ne volent qu'en 1903. Les assiégeants regardaient le ciel pour la météo, pas pour les vols.", en: "The only “planes” of the Middle Ages were birds! The Wright brothers only flew in 1903. The besiegers watched the sky for the weather, not for flights." } },
        { x: 205, y: 258, r: 20, name: { fr: "Un cône de chantier", en: "A traffic cone" }, text: { fr: "Le cône orange est inventé en 1943 aux États-Unis. Pour baliser un terrain, les soldats plantaient des piquets et tendaient des cordes, ou plantaient des bannières.", en: "The orange traffic cone was invented in 1943 in the United States. To mark off ground, soldiers drove in stakes and stretched ropes, or planted banners." } },
        { x: 318, y: 246, r: 20, name: { fr: "Un appareil photo", en: "A camera" }, text: { fr: "Pas de photo de classe pour les chevaliers ! La photographie naît vers 1826. Pour garder une image, il fallait un peintre, des tapisseries, ou un bon chroniqueur.", en: "No team photos for knights! Photography was born around 1826. To keep an image you needed a painter, a tapestry, or a good chronicler." } }
      ]
    }
  ];

  root.HistoriaIntrus = { scenes: SCENES, W: 400, H: 300 };
})(typeof window !== "undefined" ? window : globalThis);

/* Scènes en vraies images (peintures) : ajoutées par js/intrus-images.js, voir tools/README-intrus.md. */
