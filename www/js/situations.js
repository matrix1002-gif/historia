/* Historia — illustrations de situation : une scène par niveau (conversion, bataille, siège, tournoi…). */
(() => {
  "use strict";
  const Art = window.HistoriaArt || (window.HistoriaArt = {});
  const C = { ink: "#2e2114", skin: "#e8c39b", red: "#a8322d", blue: "#2f4f93", green: "#4f7040", gold: "#d9aa3c", stone: "#c9b996", dstone: "#8f7f62", white: "#f8f1dc", brown: "#6e4a2a", sand: "#e6cd94", night: "#1d2750", purple: "#6b3f7a", steel: "#9aa0a8", dark: "#3b2c1c", leaf: "#5d8a4a", water: "#4f86a8", roof: "#a4553a", cream: "#efe2bd" };
  let uid = 0;

  /* ----- éléments de base ----- */
  const bg = (n, top, bot) => `<defs><linearGradient id="sit${n}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bot}"/></linearGradient></defs><rect width="360" height="180" fill="url(#sit${n})"/>`;
  const cloud = (x, y, w = 1, c = "c1") => `<g class="cloud ${c}" fill="#fff" opacity=".72"><ellipse cx="${x}" cy="${y}" rx="${28 * w}" ry="${6 * w}"/><ellipse cx="${x + 18 * w}" cy="${y - 5 * w}" rx="${17 * w}" ry="${6 * w}"/><ellipse cx="${x - 16 * w}" cy="${y - 3 * w}" rx="${13 * w}" ry="${5 * w}"/></g>`;
  const sun = (x, y, r, col = "#fff0b0") => `<circle cx="${x}" cy="${y}" r="${r * 2}" fill="${col}" opacity=".3"/><circle cx="${x}" cy="${y}" r="${r * 1.4}" fill="${col}" opacity=".45"/><circle cx="${x}" cy="${y}" r="${r}" fill="${col}"/>`;
  const hills = (y, col, a = 16, ph = 0) => `<path d="M0 ${y}Q${70 + ph} ${y - a} ${150 + ph} ${y - a / 3}T300 ${y - a / 2}T360 ${y - a / 4}V180H0z" fill="${col}"/>`;
  const ground = (y, col) => `<rect y="${y}" width="360" height="${180 - y}" fill="${col}"/>`;
  const rect = (x, y, w, h, f, extra = "") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}" ${extra}/>`;
  const poly = (d, f, extra = "") => `<path d="${d}" fill="${f}" ${extra}/>`;
  const tree = (x, y, s = 1, c = C.leaf) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-2" y="-14" width="4" height="14" fill="${C.brown}"/><circle cx="0" cy="-24" r="11" fill="${c}"/><circle cx="-8" cy="-18" r="8" fill="${c}"/><circle cx="8" cy="-18" r="8" fill="${c}"/></g>`;
  const cypress = (x, y, s = 1, c = "#3f6a45") => `<path transform="translate(${x} ${y}) scale(${s})" d="M0-40C7-28 7-10 3 0h-6C-7-10-7-28 0-40z" fill="${c}"/>`;
  const pine = (x, y, s = 1, c = "#35603f") => `<g transform="translate(${x} ${y}) scale(${s})" fill="${c}"><path d="M0-34L9-16H-9z"/><path d="M0-26L12-6H-12z"/><path d="M0-16L15 2H-15z"/><rect x="-1.6" y="2" width="3.2" height="5" fill="${C.brown}"/></g>`;
  const palm = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0C2-14 2-24 0-34" stroke="${C.brown}" stroke-width="3" fill="none"/><g fill="#4f8a4a"><path d="M0-34C-10-40-20-38-26-30c10-2 18 0 26 4z"/><path d="M0-34C10-40 20-38 26-30c-10-2-18 0-26 4z"/><path d="M0-34C-4-46-12-50-18-48c8 2 14 8 18 14z"/><path d="M0-34C4-46 12-50 18-48c-8 2-14 8-18 14z"/></g></g>`;
  const lis = (x, y, s = 1, f = C.gold) => `<g transform="translate(${x} ${y}) scale(${s})" fill="${f}"><ellipse cx="0" cy="-4" rx="2.4" ry="6"/><ellipse cx="-4.5" cy="-1" rx="2" ry="4.5" transform="rotate(-35 -4.5 -1)"/><ellipse cx="4.5" cy="-1" rx="2" ry="4.5" transform="rotate(35 4.5 -1)"/><rect x="-5" y="2" width="10" height="2"/><path d="M-2 4h4l1 4h-6z"/></g>`;
  const cross = (x, y, s = 1, f = C.red) => `<g transform="translate(${x} ${y}) scale(${s})" fill="${f}"><rect x="-2" y="-9" width="4" height="18"/><rect x="-7" y="-4" width="14" height="4"/></g>`;
  const dove = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})" fill="#fff"><ellipse cx="0" cy="0" rx="8" ry="4"/><path d="M-2-1C-8-12-16-10-20-6c6 0 10 2 14 8z"/><path d="M2-1C8-12 16-10 20-6c-6 0-10 2-14 8z"/><circle cx="8" cy="-2" r="3"/><path d="M-8 0l-8 4 8-1z"/></g>`;
  const bird = (x, y, s = 1) => `<path transform="translate(${x} ${y}) scale(${s})" d="M-6 0Q-3-4 0 0Q3-4 6 0" stroke="${C.ink}" stroke-width="1.2" fill="none"/>`;
  const banner = (x, y, h, col, s = 1, sym = "") => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-0.8" y="${-h}" width="1.6" height="${h}" fill="${C.ink}"/><path d="M0 ${-h}h20l-5 7 5 7H0z" fill="${col}"/>${sym ? `<g transform="translate(8 ${-h + 7})">${sym}</g>` : ""}</g>`;
  const flag = (x, y, h, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-0.9" y="${-h}" width="1.8" height="${h}" fill="${C.ink}"/><path d="M0 ${-h}q9-4 18 0v12q-9-4-18 0z" fill="#fff"/><path d="M0 ${-h}q4.5-2 9-.6v12q-4.5-1.400-9 .6z" fill="#2f4f93"/><path d="M18 ${-h}v12q-4.5-1.800-9-.6v-12q4.500-1.400 9 .6z" fill="#c8323a"/></g>`;
  const sparks = (x, y, n, col = "#ffd36a") => { let h = ""; for (let i = 0; i < n; i++) { const a = (i * 137) % 360, r = 4 + ((i * 53) % 22); h += `<circle cx="${(x + Math.cos(a) * r).toFixed(1)}" cy="${(y + Math.sin(a) * r * 0.8).toFixed(1)}" r="${1 + (i % 2) * 0.6}" fill="${col}"/>`; } return h; };
  const arches = (x, y, w, h, n, f, gap = 3) => { let s = ""; const aw = (w - gap * (n + 1)) / n; for (let i = 0; i < n; i++) { const ax = x + gap + i * (aw + gap); s += `<path d="M${ax} ${y + h}V${y + aw / 2}a${aw / 2} ${aw / 2} 0 0 1 ${aw} 0V${y + h}z" fill="${f}"/>`; } return s; };
  const crenel = (x, y, w, f, n = 0) => { const k = n || Math.round(w / 9); const cw = w / (k * 2 - 1); let s = ""; for (let i = 0; i < k; i++) s += `<rect x="${(x + i * cw * 2).toFixed(1)}" y="${y - 6}" width="${cw.toFixed(1)}" height="7" fill="${f}"/>`; return s; };
  const shield = (x, y, s, f, charge = "") => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-12-14h24v14c0 9-8 14-12 17-4-3-12-8-12-17z" fill="${f}" stroke="${C.ink}" stroke-width="1.6"/>${charge}</g>`;
  const rng = (i) => { const v = Math.sin(i * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };

  /* ----- personnages ----- */
  // man(x, y, s, robe, options) : (x,y) = pieds ; s = nombre ou [sx, sy]
  const man = (x, y, s = 1, robe = C.blue, o = {}) => {
    const [sx, sy] = Array.isArray(s) ? s : [s, s];
    const sk = o.skin || C.skin, sl = o.sleeve || robe;
    let h = `<g transform="translate(${x} ${y}) scale(${sx} ${sy})">`;
    if (o.halo) h += `<circle cx="0" cy="-26" r="9.5" fill="${C.gold}" opacity=".9"/>`;
    if (o.cape) h += `<path d="M-6-20L-12 0H12L6-20z" fill="${o.cape}"/>`;
    h += `<path d="M-7.500 0L-5.500-19Q0-22 5.500-19L7.500 0z" fill="${robe}"/>`;
    if (o.belt) h += `<rect x="-6.200" y="-11" width="12.400" height="2.200" fill="${o.belt}"/>`;
    if (o.trim) h += `<path d="M-6-19Q0-16 6-19l-1 3Q0-13-5-16z" fill="${o.trim}"/>`;
    const arm = o.arm || "down";
    const line = (d) => `<path d="${d}" stroke="${sl}" stroke-width="3.400" stroke-linecap="round" fill="none"/>`;
    const hand = (hx, hy) => `<circle cx="${hx}" cy="${hy}" r="1.900" fill="${sk}"/>`;
    if (arm === "up") h += line("M-5-18L-11-31M5-18L11-31") + hand(-11, -32) + hand(11, -32);
    else if (arm === "one") h += line("M-5-18L-7-8M5-18L12-31") + hand(12, -32);
    else if (arm === "out") h += line("M-5-18L-13-14M5-18L13-14") + hand(-14, -14) + hand(14, -14);
    else if (arm === "front") h += line("M-5-18L-1-10M5-18L1-10") + hand(0, -10);
    else if (arm === "hip") h += line("M-5-18L-9-11L-5-8M5-18L9-11L5-8");
    else h += line("M-5-18L-7-8M5-18L7-8") + hand(-7, -7) + hand(7, -7);
    h += `<circle cx="0" cy="-25" r="5" fill="${sk}"/>`;
    if (o.hair) h += `<path d="M-5.200-25a5.200 5.200 0 0 1 10.400 0c-2-3-8-3-10.400 0z" fill="${o.hair}"/>`;
    if (o.beard) h += `<path d="M-4-24Q0-16 4-24z" fill="${o.beard}"/>`;
    if (o.hood) h += `<path d="M-6.500-24a6.500 7.500 0 0 1 13 0l1.500 5Q0-15-8-19z" fill="${o.hood}"/><circle cx="0" cy="-24" r="3.800" fill="${sk}"/>`;
    if (o.crown) h += `<path d="M-5-29l2.500 3 2.500-5 2.500 5 2.500-3v5h-10z" fill="${C.gold}"/>`;
    if (o.helm) h += `<path d="M-5.800-25a5.800 6.200 0 0 1 11.600 0z" fill="${C.steel}"/><rect x="-0.900" y="-25" width="1.800" height="5" fill="${C.steel}"/>${o.plume ? `<path d="M0-31q8-6 11 3-6-3-11-1z" fill="${o.plume}"/>` : ""}`;
    if (o.mitre) h += `<path d="M-5.200-28L0-39l5.200 11z" fill="${o.mitre}"/><path d="M0-39v11" stroke="${C.gold}" stroke-width="1.200"/>`;
    if (o.hat) h += `<path d="M-8-27q8-8 16 0l-3 3q-5-3-10 0z" fill="${o.hat}"/>`;
    if (o.bicorne) h += `<path d="M-10-27Q0-35 10-27Q0-30-10-27z" fill="${C.ink}"/><path d="M-9-27Q0-31 9-27l-2 3Q0-27-7-24z" fill="${C.ink}"/>`;
    if (o.wig) h += `<path d="M-6-25a6 6.500 0 0 1 12 0l1 8h-14z" fill="#f4f1ea"/><circle cx="0" cy="-24" r="3.800" fill="${sk}"/>`;
    if (o.cap) h += `<path d="M-5.500-27q5.500-7 11 0z" fill="${o.cap}"/><path d="M4-28q7-5 9 1-5-2-9-1z" fill="${o.plume || C.red}"/>`;
    if (o.straw) h += `<ellipse cx="0" cy="-28" rx="9" ry="2.400" fill="#d9b966"/><path d="M-4.500-28a4.500 4 0 0 1 9 0z" fill="#d9b966"/>`;
    if (o.hennin) h += `<path d="M-4-27L2-46l4 19z" fill="${o.hennin}"/><path d="M2-46q8 2 10 10" stroke="#fff" opacity=".6" fill="none"/>`;
    if (o.veil) h += `<path d="M-6.500-25a6.500 7 0 0 1 13 0l1.500 14H-8z" fill="${o.veil}"/><circle cx="0" cy="-24" r="3.800" fill="${sk}"/>`;
    const it = o.item;
    if (it === "cross") h += `<path d="M13-38V2M8-30h10" stroke="${C.gold}" stroke-width="2.200" fill="none"/>`;
    else if (it === "staff") h += `<path d="M12-36V2" stroke="${C.brown}" stroke-width="2" fill="none"/>`;
    else if (it === "crozier") h += `<path d="M12 2V-34q0-8 7-6" stroke="${C.gold}" stroke-width="2.200" fill="none"/>`;
    else if (it === "spear") h += `<path d="M12-52V4" stroke="${C.brown}" stroke-width="1.800"/><path d="M12-52l-2.500 8h5z" fill="${C.steel}"/>`;
    else if (it === "sword") h += `<path d="M12-34V-8" stroke="${C.steel}" stroke-width="2.200"/><path d="M8.500-14h7" stroke="${C.gold}" stroke-width="2"/>`;
    else if (it === "book") h += `<rect x="-5" y="-14" width="10" height="7" fill="${C.red}"/><rect x="-4" y="-13" width="8" height="1.500" fill="${C.gold}"/>`;
    else if (it === "axe") h += `<path d="M12-40V0" stroke="${C.brown}" stroke-width="2.200"/><path d="M12-40q9-2 9 6-5 0-9-1z" fill="${C.steel}"/>`;
    else if (it === "scythe") h += `<path d="M12-44V2" stroke="${C.brown}" stroke-width="2"/><path d="M12-44q14-4 18 8-8-6-18-4z" fill="${C.steel}"/>`;
    else if (it === "torch") h += `<path d="M12-30V-6" stroke="${C.brown}" stroke-width="2.200"/><path d="M12-30q-5-6 0-12 5 6 0 12z" fill="#f08a2a"/>`;
    else if (it === "lute") h += `<ellipse cx="9" cy="-10" rx="6" ry="4.500" fill="#b9793a" transform="rotate(-30 9 -10)"/><path d="M12-14L22-24" stroke="${C.brown}" stroke-width="2"/>`;
    h += "</g>";
    return h;
  };
  const crowd = (x0, x1, y, n, pal, scale = 1, seed = 1, o = {}) => { let h = ""; for (let i = 0; i < n; i++) { const t = n === 1 ? 0.5 : i / (n - 1); const jx = (rng(i + seed) - 0.5) * 10; const jy = (rng(i + seed * 3) - 0.5) * 8; h += man(x0 + (x1 - x0) * t + jx, y + jy, scale * (0.92 + rng(i + seed * 7) * 0.2), pal[(i + seed) % pal.length], Object.assign({}, o, { arm: o.arm === "mix" ? ["down", "up", "one"][i % 3] : o.arm })); } return h; };

  // cheval vu de profil (dir 1 = vers la droite) ; (x,y) = sabots ; pose g = 1 : galop
  const horse = (x, y, s = 1, col = C.brown, dir = 1, g = 0, drape = "") => {
    const dk = "rgba(0,0,0,.28)";
    const legs = g
      ? `<path d="M10-14l16-3 2 3-16 7z M12-14l9 6-3 4-10-5z M-9-14l-17 2-1 4 17 0z M-10-14l-10 8 3 3 11-6z" fill="${col}"/><path d="M10-14l16-3 2 3-16 7z M-9-14l-17 2-1 4 17 0z" fill="${dk}"/>`
      : `<path d="M9-15h5l-1 15h-4z M4-15h5l-1 15h-4z M-9-15h5l-1 15h-4z M-14-15h5l-1 15h-4z" fill="${col}"/><path d="M9-15h5l-1 15h-4z M-9-15h5l-1 15h-4z" fill="${dk}"/>`;
    return `<g transform="translate(${x} ${y}) scale(${dir * s} ${s})">${legs}<ellipse cx="0" cy="-21" rx="17" ry="8.500" fill="${col}"/><path d="M9-25L20-45l7 3-9 24z" fill="${col}"/><path d="M19-46l13 3-1 6-9 2z" fill="${col}"/><path d="M21-46l-1-5 4 3z" fill="${col}"/><path d="M12-30L20-46l-3-2-9 14z" fill="#2c1d10"/><path d="M-16-26c-9 3-12 13-9 22 5-7 8-11 12-15z" fill="#2c1d10"/>${drape}</g>`;
  };
  const caparison = (col, trim = C.gold) => `<path d="M-16-26h27l2 18h-6l-2 4-3-4-3 4-3-4-3 4-3-4-3 4-3-4h-4z" fill="${col}"/><path d="M-16-26h27" stroke="${trim}" stroke-width="2"/>`;
  // chevalier à cheval (dir 1 = vers la droite)
  const knight = (x, y, s, col, robe, dir = 1, g = 0, o = {}) => {
    const lance = o.lance === false ? "" : `<path d="M${dir * -4} -34L${dir * (g ? 66 : 50)} ${g ? -44 : -52}" stroke="${C.brown}" stroke-width="2" fill="none"/><path d="M${dir * (g ? 66 : 50)} ${g ? -44 : -52}l${dir * 8} -1.5 ${-dir * 8} -2z" fill="${C.steel}"/>`;
    const sh = o.shield === false ? "" : `<g transform="translate(${dir * 6} -26)"><path d="M-6-8h12v8c0 5-4 8-6 9-2-1-6-4-6-9z" fill="${o.shieldCol || robe}" stroke="${C.ink}" stroke-width="1"/><rect x="-1" y="-6" width="2" height="12" fill="${C.white}" opacity=".85"/></g>`;
    const ban = o.banner ? `<g transform="translate(${dir * 2} -34)"><path d="M0 0V-34" stroke="${C.ink}" stroke-width="1.600"/><path d="M0-34h${dir * 20}l${dir * -5} 6 ${dir * 5} 6H0z" fill="${o.banner}"/></g>` : "";
    return `<g transform="translate(${x} ${y}) scale(${s})">${horse(0, 0, 1, col, dir, g, caparison(robe))}<g transform="translate(${dir * -1} -3) scale(${dir} 1)">${man(0, -18, 0.95, robe, { helm: 1, plume: o.plume || C.red, arm: "one" })}</g>${lance}${sh}${ban}</g>`;
  };
  const wave = (y, col, op = 0.5, amp = 3) => `<path d="M0 ${y}q15 ${-amp} 30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0V180H0z" fill="${col}" opacity="${op}"/>`;
  const window_ = (x, y, w, h, fill = "#ffe7a3") => `<path d="M${x} ${y + h}V${y + w / 2}a${w / 2} ${w / 2} 0 0 1 ${w} 0V${y + h}z" fill="${fill}" stroke="${C.dstone}" stroke-width="2"/>`;
  const tower = (x, y, w, h, col, roof = "") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${col}"/>${crenel(x - 2, y, w + 4, col, Math.max(3, Math.round(w / 8)))}${roof ? `<path d="M${x - 3} ${y}l${w / 2 + 3} -${w * 0.9}l${w / 2 + 3} ${w * 0.9}z" fill="${roof}"/>` : ""}`;
  const wallTop = (x, y, w, h, col) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${col}"/>${crenel(x, y, w, col)}`;
  const brick = (x, y, w, h, col) => { let s = `<g stroke="rgba(60,40,15,.22)" stroke-width=".8">`; for (let r = y + 7; r < y + h; r += 7) s += `<path d="M${x} ${r}h${w}"/>`; s += `</g>`; return rect(x, y, w, h, col) + s; };
  const smoke = (x, y, n = 4, col = "#8d8579", sp = 1) => { let h = ""; for (let i = 0; i < n; i++) h += `<circle cx="${x + i * 7 * sp + rng(i) * 4}" cy="${y - i * 9}" r="${6 + i * 3}" fill="${col}" opacity="${0.55 - i * 0.08}"/>`; return h; };
  const flame = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0q-8-6-4-16 3 5 4 2 0-8 6-12 0 8 4 14 4 8-10 12z" fill="#f08a2a"/><path d="M0 0q-4-3-2-8 2 2 2-1 0-4 4-6 0 4 2 7 2 5-6 8z" fill="#ffd36a"/></g>`;

  const S = {};

  /* ===================== SCÈNES ===================== */
  S.baptism = (n) => bg(n, "#8fc6e4", "#f4e6b8") + cloud(70, 34) + cloud(290, 48, 0.8, "c2")
    + `<path d="M168 0h24l40 140H128z" fill="#fff8d0" opacity=".5"/>` + dove(180, 28, 1.3)
    + hills(122, "#9bbd7a", 14) + tree(300, 128, 1.1) + tree(335, 126, 0.9, "#4f7e45")
    + rect(14, 62, 104, 64, C.stone) + arches(14, 82, 104, 44, 4, "#6d5d44") + poly("M8 62L66 30l58 32z", C.roof) + rect(64, 14, 4, 18, C.dark) + rect(58, 20, 16, 4, C.dark)
    + crowd(236, 332, 138, 5, [C.green, C.red, C.brown, C.blue, "#7a5a8a"], 1, 3, { arm: "mix", halo: false })
    + man(150, 152, 1.7, C.white, { mitre: C.gold, arm: "one", belt: C.gold, trim: C.gold })
    + man(205, 156, [1.5, 1.2], C.blue, { crown: 1, arm: "front" })
    + wave(146, C.water, 0.55, 3) + wave(158, "#6fa3c0", 0.55, 3) + `<path d="M120 152q10-3 20 0M196 158q10-3 20 0" stroke="#fff" stroke-width="1.400" opacity=".6" fill="none"/>`;

  S.preaching = (n, v) => {
    const green = v === "patrick";
    return bg(n, green ? "#9ccfd8" : "#8dc3e6", green ? "#e5efc2" : "#f6e7bd") + cloud(250, 30) + cloud(80, 44, 0.7, "c2")
      + hills(118, green ? "#8bb86a" : "#b7c27d", 14) + hills(132, green ? "#6fa356" : "#9fae62", 10, 40)
      + (green ? `<path d="M300 130V70h14v60z" fill="${C.dstone}"/><path d="M297 70l10-22 10 22z" fill="${C.roof}"/><rect x="303" y="86" width="5" height="9" fill="#3b2c1c"/>` : rect(14, 52, 120, 6, C.stone) + [24, 62, 100, 126].map((x) => rect(x, 58, 9, 72, "#d6c8a6")).join("") + rect(10, 46, 128, 8, C.dstone))
      + ground(132, green ? "#6c9a52" : "#c8b27c")
      + poly("M62 150Q80 112 112 112Q146 112 158 150z", C.dstone) + poly("M78 150Q92 122 114 120Q138 120 148 150z", "#a89877")
      + crowd(172, 336, 152, 8, [C.red, C.brown, C.green, "#7a5a8a", C.blue, "#c28a3a"], 1.05, 5, { arm: "mix" })
      + man(112, 124, 1.9, green ? C.green : C.red, Object.assign({ arm: "one", beard: "#5a4a3a", belt: C.gold }, green ? { mitre: C.green, item: "crozier" } : { item: "book" }));
  };

  S.martyrs = (n) => bg(n, "#f3d9a2", "#fbeccb") + sun(300, 36, 14)
    + rect(0, 40, 360, 74, "#d8c39a") + arches(0, 48, 360, 30, 12, "#8f7a56", 2) + arches(0, 80, 360, 32, 12, "#7e6a49", 2)
    + `<g fill="#6a4a30" opacity=".65">${Array.from({ length: 36 }, (_, i) => `<circle cx="${8 + i * 10}" cy="${44 + (i % 3)}" r="2.600"/>`).join("")}</g>`
    + ground(112, "#e9d29a") + `<ellipse cx="180" cy="150" rx="150" ry="22" fill="#dcc07e" opacity=".55"/>`
    + `<path d="M150 0h60l30 150H120z" fill="#fff8d6" opacity=".55"/>`
    + `<path d="M180 42l3 8 9 .5-7 5.500 2.500 9-7.500-5-7.500 5 2.500-9-7-5.500 9-.5z" fill="${C.gold}"/>`
    + `<g stroke="#4f8a4a" stroke-width="3" fill="none"><path d="M205 150q10-24 26-30M205 150q16-14 30-12M205 150q4-20 12-34"/></g>`
    + man(180, 156, [2.1, 1.7], C.white, { arm: "up", halo: 1, hair: "#5a3b22" });

  S.charity = (n) => bg(n, "#cfdde8", "#f1f3f2") + cloud(80, 30, 1.1) + cloud(280, 40, 0.9, "c2")
    + rect(250, 62, 110, 70, C.stone) + wallTop(250, 62, 110, 4, C.stone) + `<path d="M280 132V96a14 14 0 0 1 28 0v36z" fill="#5a4a38"/>` + tower(240, 48, 26, 84, C.dstone)
    + ground(130, "#f7f9fa") + `<ellipse cx="170" cy="150" rx="190" ry="24" fill="#e6ecef"/>`
    + `<g fill="#fff" opacity=".9">${Array.from({ length: 40 }, (_, i) => `<circle cx="${rng(i) * 360}" cy="${rng(i + 9) * 150}" r="1.300"/>`).join("")}</g>`
    + horse(120, 152, 1.6, "#f2efe6", 1) + `<g transform="translate(118 142) scale(1.6)">${man(0, -18, 1, C.red, { helm: 1, plume: C.red, arm: "one", cape: C.red, item: "sword" })}</g>`
    + man(232, 154, [1.3, 1.1], "#7c6a58", { arm: "front", hood: "#5e4e3e" }) + `<path d="M178 114q28-6 48 8l-4 22q-20-6-44-4z" fill="${C.red}"/>`;

  S.pilgrim = (n) => bg(n, "#f7c98a", "#fbeed0") + sun(268, 80, 18, "#fff4c4") + `<path d="M240 100l14-16 14 16z" fill="#d49a4a" opacity=".4"/>`
    + hills(104, "#b9b6c9", 22) + hills(120, "#9cae85", 18, 30) + hills(140, "#7f9d62", 12, 60)
    + rect(292, 108, 22, 14, C.cream) + poly("M288 108l15-12 15 12z", C.roof) + cross(303, 90, 0.5, C.dark)
    + pine(330, 128, 0.8) + pine(36, 140, 1.1) + cypress(60, 138, 0.9) + ground(142, "#6f954f")
    + `<path d="M80 180Q120 156 170 148Q230 140 280 126" stroke="#d9be86" stroke-width="16" fill="none" stroke-linecap="round"/>`
    + bird(150, 40) + bird(176, 28, 0.8) + bird(210, 50, 0.7)
    + man(112, 168, 2.4, "#6e4a2a", { hood: "#6e4a2a", item: "staff", arm: "one", belt: "#c9b67a" }) + `<rect x="102" y="136" width="9" height="12" rx="2" fill="#b98a4a"/>`;

  S.oak = (n) => bg(n, "#bcd6e4", "#eef0d6") + cloud(70, 34) + hills(120, "#9ebf86", 12) + ground(130, "#6c9a52")
    + `<path d="M170 150C176 120 172 90 166 56h36c-4 34 0 64 8 94z" fill="#6b4a2a"/><path d="M178 112l16 6-16 6z" fill="#e8c585"/>`
    + `<circle cx="184" cy="42" r="34" fill="#3f6f3c"/><circle cx="150" cy="56" r="24" fill="#4c7e46"/><circle cx="218" cy="56" r="26" fill="#4c7e46"/><circle cx="184" cy="26" r="22" fill="#55884d"/>`
    + `<path d="M178 8l2 6 6 .4-5 4 1.600 6-4.600-3.600-4.600 3.600 1.600-6-5-4 6-.4z" fill="${C.gold}" transform="translate(6 -6)"/>`
    + `<g transform="translate(300 148)"><path d="M0 0V-30L-12 0z" fill="#2f6a48"/><path d="M0-30L12 0z" fill="#3a7a54"/></g>`
    + man(120, 152, 2.1, "#5b4636", { hood: "#5b4636", arm: "one", item: "axe", belt: "#caa" })
    + crowd(236, 330, 154, 4, ["#7a6244", "#5d4a30", "#8b7355"], 1.3, 2, { arm: "up", hair: "#4a3520", beard: "#8a6a40" });

  S.schism = (n) => bg(n, "#7b86a0", "#e9d9b0")
    + `<path d="M0 0h180v180H0z" fill="#f6dba0" opacity=".35"/><path d="M180 0h180v180H180z" fill="#8a96b8" opacity=".35"/>`
    + ground(136, "#8f8a78")
    + rect(30, 70, 100, 68, C.stone) + arches(30, 90, 100, 48, 3, "#6d5d44") + poly("M24 70L80 36l56 34z", C.roof) + rect(78, 6, 5, 32, C.dark) + rect(70, 14, 21, 5, C.dark)
    + rect(230, 80, 100, 58, "#d9c8a0") + arches(230, 100, 100, 38, 4, "#7d6a4a") + `<path d="M240 80a40 34 0 0 1 80 0z" fill="${C.gold}" stroke="#9a7a22" stroke-width="2"/><path d="M280 46V32M274 38h12" stroke="${C.dark}" stroke-width="3"/>`
    + `<path d="M178 0l8 30-12 20 14 24-10 26 12 24-6 28 6 28h-6l-8-30 6-24-14-26 10-24-12-22z" fill="#2a2118"/>`
    + man(100, 160, 1.5, C.white, { mitre: C.gold, arm: "out", trim: C.gold }) + man(260, 160, 1.5, "#3d3d6b", { hat: "#222", arm: "out", beard: "#ddd", trim: C.gold });

  S.coronation = (n, v) => {
    const empire = v === "empire";
    return bg(n, "#7a2b2a", "#c4883a")
      + [34, 118, 202, 286].map((x, i) => `<path d="M${x} 80V34a20 20 0 0 1 40 0v46z" fill="${["#5f86c4", "#c25757", "#e0b848", "#5aa07a"][i]}" stroke="#4a3320" stroke-width="3"/>`).join("")
      + [54, 138, 222, 306].map((x) => `<path d="M${x} 0L${x - 40} 150H${x + 40}z" fill="#ffe9a8" opacity=".14"/>`).join("")
      + rect(0, 120, 360, 60, "#8a5a34") + `<path d="M140 180L158 112H202L220 180z" fill="${C.red}"/><path d="M158 112H202" stroke="${C.gold}" stroke-width="3"/>`
      + rect(150, 70, 60, 42, "#d9c8a0") + rect(146, 66, 68, 6, C.gold) + cross(180, 52, 1.1, C.gold) + `<g fill="#ffd36a">${[158, 202].map((x) => `<rect x="${x}" y="92" width="3" height="14" fill="#f4e8c4"/><path d="M${x + 1.500} 92q-3-5 0-9 3 4 0 9z"/>`).join("")}</g>`
      + crowd(30, 120, 152, 4, [C.blue, "#7a5a8a", C.green, C.brown], 1.15, 2, { cap: C.red }) + crowd(240, 330, 152, 4, [C.red, C.brown, C.blue, C.green], 1.15, 6, { cap: C.blue })
      + man(180, 168, [1.9, 1.5], empire ? C.purple : C.blue, { crown: !empire, arm: "front", trim: "#f6f0e0", hair: "#4a3520" })
      + (empire ? `<path d="M168 126q12-6 24 0" stroke="#5ca05a" stroke-width="3" fill="none"/>` : "")
      + man(180, 140, 1.7, C.white, { mitre: C.gold, arm: "up", trim: C.gold })
      + `<path d="M171 108h18l-3-5-3 3-3-6-3 6-3-3z" fill="${C.gold}"/>`;
  };

  S.throne = (n, v) => {
    const sunK = v === "sun";
    return bg(n, "#5a2a34", "#b46a3a")
      + (sunK ? sun(180, 70, 30, "#ffe27a") + [...Array(16).keys()].map((i) => `<path d="M180 70L${180 + Math.cos(i * 0.3927) * 90} ${70 + Math.sin(i * 0.3927) * 90}" stroke="#ffe27a" stroke-width="3" opacity=".6"/>`).join("") : "")
      + [30, 110, 250, 330].map((x) => `<path d="M${x - 16} 0h32v70l-16-12-16 12z" fill="${C.blue}" stroke="${C.gold}" stroke-width="2"/>${lis(x, 34, 1.3)}`).join("")
      + rect(0, 128, 360, 52, "#c9a46a") + [...Array(10).keys()].map((i) => rect(i * 40, 128, 20, 52, "#a4803f", 'opacity=".5"')).join("")
      + `<path d="M130 20q50-26 100 0v6H130z" fill="${C.red}" stroke="${C.gold}" stroke-width="2"/><path d="M134 26v60M226 26v60" stroke="${C.red}" stroke-width="10"/>`
      + rect(150, 92, 60, 40, "#7b3a24") + rect(144, 130, 72, 8, C.gold)
      + man(180, 130, 1.9, C.blue, { crown: 1, arm: "front", trim: "#f6f0e0", hair: "#5a3b22", beard: "#5a3b22", sleeve: C.blue })
      + `<path d="M192 100v34" stroke="${C.gold}" stroke-width="2.600"/><circle cx="192" cy="98" r="3.500" fill="${C.gold}"/>`
      + crowd(36, 120, 162, 3, [C.green, "#7a5a8a", C.brown], 1.3, 1, { cap: C.red }) + crowd(250, 330, 162, 3, [C.red, C.blue, C.dark], 1.3, 4, { hat: "#c25757" });
  };

  S.knighting = (n) => bg(n, "#8a6a4a", "#d9b87a")
    + rect(0, 0, 360, 180, "#a78a62", 'opacity=".5"') + arches(10, 20, 340, 100, 4, "#d5bf8b", 12)
    + `<path d="M40 20v100M122 20v100M204 20v100M286 20v100" stroke="#6b563a" stroke-width="2" opacity=".5"/>`
    + banner(44, 120, 90, C.red, 1, lis(0, 0, 0.6, C.gold)) + banner(316, 120, 90, C.blue, 1, lis(0, 0, 0.6, C.gold))
    + rect(0, 128, 360, 52, "#b9976a") + [...Array(9).keys()].map((i) => rect(i * 42, 128, 21, 52, "#9a7a4c", 'opacity=".45"')).join("")
    + `<path d="M150 0L130 128H230L210 0z" fill="#fff4c4" opacity=".25"/>`
    + man(238, 156, 1.7, C.green, { hennin: "#d6b0c4", arm: "front", belt: C.gold }) + man(70, 160, 1.5, C.dark, { arm: "front", hood: C.dark })
    + man(210, 160, [1.6, 1.15], C.blue, { arm: "front", hair: "#6b4a2a" })
    + man(155, 160, 1.9, C.steel, { arm: "one", item: "sword", helm: 1, plume: C.red, cape: C.red }) + `<path d="M166 124L196 130" stroke="${C.steel}" stroke-width="3"/>`;

  S.tournament = (n) => bg(n, "#8fc4e6", "#f2ebc8") + cloud(60, 28) + cloud(300, 36, 0.8, "c2") + hills(96, "#9ebf86", 12)
    + [[40, "#c25757"], [110, "#4f6ab0"], [250, "#d9aa3c"], [320, "#5a9a6a"]].map(([x, c]) => `<path d="M${x - 24} 100l24-26 24 26z" fill="${c}"/><rect x="${x - 22}" y="100" width="44" height="22" fill="${c}" opacity=".85"/>${banner(x, 74, 14, c, 0.7)}`).join("")
    + `<g fill="#6a4a30" opacity=".7">${Array.from({ length: 50 }, (_, i) => `<circle cx="${8 + i * 7}" cy="${122 + (i % 4) * 2}" r="2.400"/>`).join("")}</g>`
    + ground(124, "#7fb05e") + rect(0, 140, 360, 4, "#8a6a3a") + [...Array(18).keys()].map((i) => rect(i * 21, 134, 3, 14, "#6a4a2a")).join("")
    + knight(56, 172, 1.25, "#7a5a3a", "#c25757", 1, 1, { plume: "#c25757", banner: null }) + knight(304, 172, 1.25, "#f2efe6", "#2f4f93", -1, 1, { plume: "#2f4f93" })
    + `<g fill="${C.brown}"><path d="M176 112l-9-5 2-2z"/><path d="M186 114l8 4-1 3z"/></g><g fill="#fff" opacity=".8">${sparks(180, 112, 8, "#fff")}</g>`;

  S.crusade = (n) => bg(n, "#f1b872", "#fbe9c0") + sun(70, 52, 22, "#fff3c0")
    + `<path d="M0 118Q80 96 150 112T300 104T360 114V180H0z" fill="#e4c07c"/>`
    + rect(214, 78, 118, 44, "#e8d3a2") + wallTop(206, 94, 134, 28, "#dcc590") + `<path d="M232 78a18 18 0 0 1 36 0z" fill="${C.gold}"/><path d="M280 78a22 22 0 0 1 44 0z" fill="#e9c15a"/><path d="M250 60V50M302 56V44" stroke="${C.dark}" stroke-width="2"/>` + tower(206, 74, 14, 48, "#d4bb86") + palm(350, 126, 0.9) + palm(196, 130, 0.7)
    + ground(128, "#e0bd7a") + `<path d="M0 150Q120 128 360 152V180H0z" fill="#d6b06a"/>`
    + banner(66, 148, 70, C.white, 1.1, cross(0, 0, 0.8)) + banner(148, 152, 60, C.white, 1, cross(0, 0, 0.7))
    + crowd(20, 190, 164, 6, ["#e8e0cc", "#e8e0cc", C.steel, "#e8e0cc"], 1.15, 3, { helm: 1, arm: "mix", plume: null, item: "spear" })
    + `<g transform="translate(150 150)">${knight(0, 0, 0.9, "#ece4d0", "#e8e0cc", 1, 0, { lance: false, shield: false })}</g>`;

  S.council = (n) => bg(n, "#8fbfe3", "#f1ecc6") + cloud(70, 30) + cloud(280, 44, 0.8, "c2")
    + `<path d="M0 108Q50 70 90 98T170 94T240 70T310 100T360 90V180H0z" fill="#8ea87a"/><path d="M60 96l26-34 26 34z" fill="#7c8f6a"/><path d="M262 96l22-28 22 28z" fill="#7c8f6a"/>`
    + ground(120, "#7faa5c") + `<g fill="${C.dark}" opacity=".55">${Array.from({ length: 70 }, (_, i) => `<circle cx="${rng(i) * 360}" cy="${132 + rng(i + 5) * 44}" r="2.800"/>`).join("")}</g>`
    + crowd(18, 342, 162, 12, ["#8b6a3a", C.red, C.green, C.blue, "#7a5a8a"], 1.1, 8, { arm: "mix" })
    + banner(36, 148, 76, C.white, 1.1, cross(0, 0, 0.8)) + banner(318, 148, 76, C.white, 1.1, cross(0, 0, 0.8))
    + rect(120, 112, 120, 8, "#8a6a3a") + rect(128, 120, 104, 20, "#a48250") + rect(112, 138, 136, 6, "#6b4a2a")
    + man(180, 114, 2, C.red, { arm: "up", mitre: C.gold, cape: "#f6f0e0", trim: C.gold }) + man(142, 114, 1.4, C.white, { mitre: C.white, arm: "out" }) + man(220, 114, 1.4, C.white, { mitre: C.white, arm: "out" });

  S.siege = (n, v) => {
    const sea = v === "sea";
    return bg(n, "#c97a4a", "#f1cf93") + sun(60, 50, 16, "#ffe2a0")
      + (sea ? wave(124, C.water, 0.8, 4) : hills(118, "#9a8a5a", 10))
      + tower(240, 48, 38, 90, C.stone) + wallTop(190, 92, 52, 46, "#bba982") + wallTop(278, 92, 66, 46, "#bba982") + tower(330, 56, 28, 82, C.dstone)
      + `<path d="M246 138V108a13 13 0 0 1 26 0v30z" fill="#4a3a28"/>` + flame(250, 48, 1.4) + smoke(252, 36, 4, "#6d655a")
      + ground(134, "#b19a62") + `<path d="M0 150Q120 136 360 152V180H0z" fill="#9c8650"/>`
      + `<g stroke="${C.brown}" stroke-width="3">${[200, 262, 322].map((x) => `<path d="M${x - 20} 146L${x} 90M${x - 12} 146L${x + 8} 90"/>`).join("")}</g><g stroke="${C.brown}" stroke-width="1.800">${[200, 262, 322].map((x) => [100, 116, 130].map((y) => `<path d="M${x - 14 + (y - 90) * -0.1} ${y}h10"/>`).join("")).join("")}</g>`
      + `<g transform="translate(60 150)"><path d="M0 0L28-52" stroke="${C.brown}" stroke-width="6"/><path d="M28-52l22-10" stroke="${C.brown}" stroke-width="4"/><circle cx="52" cy="-62" r="6" fill="${C.dstone}"/><rect x="-14" y="-6" width="40" height="8" fill="${C.brown}"/><circle cx="-6" cy="4" r="8" fill="#5a3b22"/><circle cx="20" cy="4" r="8" fill="#5a3b22"/></g>`
      + `<path d="M110 70Q160 20 210 74" stroke="${C.ink}" stroke-width="1.200" stroke-dasharray="3 3" fill="none"/><circle cx="172" cy="38" r="5" fill="${C.dstone}"/>`
      + crowd(110, 200, 166, 5, [C.red, C.blue, C.green], 1.05, 4, { helm: 1, arm: "mix", item: "spear" })
      + `<g stroke="${C.ink}" stroke-width="1" opacity=".7">${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M${100 + i * 18} ${50 + (i % 3) * 14}l16 6"/>`).join("")}</g>`;
  };

  S.castle = (n) => bg(n, "#7fc0e8", "#f4ecc6") + cloud(70, 30, 1.1) + cloud(290, 40, 0.8, "c2") + hills(110, "#a8c486", 14)
    + `<path d="M0 120Q110 96 220 106T360 112V180H0z" fill="#86b365"/>`
    + rect(150, 54, 60, 66, C.stone) + wallTop(146, 54, 68, 6, C.stone) + tower(110, 70, 34, 50, "#bfae8a", C.roof) + tower(216, 70, 34, 50, "#bfae8a", C.roof) + rect(160, 40, 40, 14, "#bfae8a") + poly("M156 40l24-22 24 22z", C.roof)
    + banner(180, 20, 18, C.red, 1, lis(0, 0, 0.5, C.gold)) + `<path d="M168 120V92a12 12 0 0 1 24 0v28z" fill="#43321f"/>` + [126, 232].map((x) => rect(x + 12, 88, 6, 12, "#43321f")).join("")
    + rect(60, 100, 56, 20, C.stone) + wallTop(60, 100, 56, 20, C.stone) + rect(244, 100, 56, 20, C.stone) + wallTop(244, 100, 56, 20, C.stone)
    + rect(0, 126, 360, 22, C.water) + `<path d="M0 134q30-4 60 0t60 0t60 0t60 0t60 0t60 0" stroke="#fff" opacity=".4" fill="none"/>`
    + rect(168, 120, 24, 30, "#8a6a3a") + ground(148, "#79a85a")
    + [28, 328].map((x) => `<rect x="${x - 14}" y="132" width="28" height="16" fill="${C.cream}"/><path d="M${x - 17} 132l17-14 17 14z" fill="${C.roof}"/>`).join("")
    + knight(120, 166, 1, "#6e4a2a", C.blue, 1, 0, { banner: C.blue }) + man(250, 168, 1.3, C.green, { arm: "up", hat: "#caa" }) + tree(312, 164, 1.2) + tree(40, 168, 1.3, "#4f7e45");

  S.monastery = (n, v) => bg(n, "#f6b56e", "#fbe8c0") + sun(84, 76, 20, "#fff0bd")
    + hills(110, "#a5a98e", 18) + hills(126, "#85a86a", 12, 50)
    + (v === "field" ? "" : [...Array(7).keys()].map((i) => `<path d="M${10 + i * 20} 180Q${40 + i * 14} 146 ${130 + i * 12} 134" stroke="#5a8a4a" stroke-width="3" opacity=".75" fill="none"/>`).join(""))
    + rect(168, 64, 120, 62, "#d9c8a0") + arches(168, 94, 120, 32, 6, "#7d6a4a", 2) + poly("M162 64L228 30l66 34z", C.roof) + rect(298, 46, 26, 80, "#cdbd96") + arches(298, 60, 26, 20, 2, "#6d5d44", 2) + poly("M294 46l17-26 17 26z", C.roof) + cross(311, 14, 0.8, C.dark)
    + rect(120, 100, 52, 26, "#cdbd96") + poly("M114 100l32-18 32 18z", C.roof) + cypress(100, 134, 1.1) + cypress(344, 138, 1) + ground(134, "#73a055")
    + `<path d="M0 156Q140 138 360 150V180H0z" fill="#64924a"/>`
    + man(52, 168, 1.6, "#4a3a2c", { hood: "#4a3a2c", item: "cross", arm: "one" }) + crowd(90, 190, 164, 4, ["#6e5a40", "#4a3a2c", "#7a6446"], 1.35, 2, { hood: "#5a4632", arm: "front" })
    + bird(120, 40) + bird(150, 28, 0.8);

  S.scriptorium = (n, v) => {
    const nun = v === "nun";
    return bg(n, "#5a3a24", "#b98a52")
      + `<path d="M60 150V56a54 54 0 0 1 108 0v94z" fill="${nun ? "#2c3a78" : "#ffe9a8"}" stroke="#4a3320" stroke-width="4"/>`
      + (nun ? `<g fill="#ffe08a">${Array.from({ length: 14 }, (_, i) => `<circle cx="${70 + rng(i) * 88}" cy="${24 + rng(i + 4) * 90}" r="${1 + rng(i + 8) * 1.800}"/>`).join("")}</g><path d="M114 20l4 12 12 1-10 8 4 12-10-8-10 8 4-12-10-8 12-1z" fill="#ffd36a" opacity=".9"/>` : `<path d="M114 8V148M60 70H168" stroke="#4a3320" stroke-width="3"/><path d="M114 8l-40 142M114 8l40 142" stroke="#fff6cf" opacity=".4"/>`)
      + [0, 1, 2, 3].map((r) => [...Array(7).keys()].map((i) => rect(204 + i * 20, 22 + r * 24, 15 + (i % 3) * 2, 20, ["#a8322d", "#2f4f93", "#4f7040", "#d9aa3c", "#6b3f7a", "#8a5a34"][(i + r * 2) % 6], 'stroke="#2e2114" stroke-width="1"')).join("")).join("") + rect(196, 18, 160, 5, "#4a3320")
      + rect(0, 150, 360, 30, "#7b5a34")
      + `<path d="M190 118h140l10 32H180z" fill="#8a6038"/><path d="M200 110l130-6 8 14H190z" fill="#a47848"/>`
      + `<rect x="228" y="100" width="64" height="12" fill="#f6ecd0" transform="rotate(-6 260 106)"/><rect x="232" y="102" width="12" height="9" fill="#a8322d" transform="rotate(-6 260 106)"/><g stroke="#4a3a2c" stroke-width="1.500" opacity=".7" transform="rotate(-6 260 106)"><path d="M248 104h38M248 108h38"/></g>`
      + `<rect x="300" y="96" width="8" height="12" fill="${C.dark}"/><path d="M304 96q-4-6 0-10 4 4 0 10z" fill="#ffb347"/>`
      + man(212, 152, 2.3, nun ? "#2b2b33" : "#6e4a2a", Object.assign({ arm: "front" }, nun ? { veil: "#2b2b33" } : { hood: "#6e4a2a" }))
      + `<path d="M226 118l22-6" stroke="#f3e9c8" stroke-width="2.400"/>`;
  };

  S.monkwork = (n, v) => bg(n, "#9fd0ea", "#f6efc8") + cloud(250, 30) + hills(104, "#a9bf8a", 16) + sun(300, 36, 12)
    + `<path d="M0 118Q120 100 360 124V180H0z" fill="#8bb06a"/>`
    + [...Array(8).keys()].map((r) => `<path d="M${-20 + r * 18} ${180 - r * 6}Q${100 + r * 8} ${150 - r * 4} ${340 + r * 4} ${130 + r * 2}" stroke="#4f7a40" stroke-width="7" fill="none" opacity=".9"/>`).join("")
    + [...Array(18).keys()].map((i) => `<circle cx="${30 + i * 18}" cy="${150 - (i % 5) * 4 - ((i * 7) % 11)}" r="2.600" fill="#6b3f7a"/>`).join("")
    + rect(268, 100, 70, 36, "#d9c8a0") + poly("M262 100l41-22 41 22z", C.roof)
    + `<g transform="translate(300 168)"><ellipse cx="0" cy="-10" rx="16" ry="12" fill="#a4733d"/><path d="M-16-10h32M-14-17h28M-14-3h28" stroke="#6b4a2a" stroke-width="2"/></g><g transform="translate(332 170)"><ellipse cx="0" cy="-6" rx="14" ry="6" fill="#f0cf6a"/><rect x="-14" y="-6" width="28" height="8" fill="#e2b84a"/></g>`
    + man(90, 160, 2, "#6e4a2a", { hood: "#6e4a2a", arm: "up" }) + `<path d="M104 118q12-4 14 6l-6 10z" fill="#6b3f7a"/>` + man(180, 166, 1.9, "#d7c9a8", { hood: "#d7c9a8", arm: "one", item: "staff" }) + man(240, 170, 1.6, "#6e4a2a", { hood: "#6e4a2a", arm: "front" });

  S.cathedral = (n, v) => {
    const night = v === "night";
    const st = night ? "#8a7c92" : C.stone, dk = night ? "#5a4e66" : C.dstone;
    return bg(n, night ? "#1d2750" : "#7fc0e8", night ? "#6a3a4a" : "#f4ecc6") + (night ? sun(300, 34, 12, "#f6f0d0") : cloud(60, 30) + cloud(300, 38, 0.8, "c2"))
      + hills(124, night ? "#2c3652" : "#9ebf86", 8)
      + rect(110, 76, 140, 76, st) + rect(86, 56, 50, 96, st) + rect(224, 56, 50, 96, st)
      + poly("M82 56l29-52 29 52z", dk) + poly("M220 56l29-52 29 52z", dk) + poly("M146 76l34-40 34 40z", dk)
      + `<circle cx="180" cy="102" r="20" fill="${night ? "#d1604a" : "#6f93c8"}" stroke="${dk}" stroke-width="4"/><g stroke="${dk}" stroke-width="2"><path d="M180 82v40M160 102h40M166 88l28 28M194 88l-28 28"/></g>`
      + [[111, 70], [249, 70]].map(([x, y]) => `<path d="M${x - 10} 124V${y + 14}l10-18 10 18v50z" fill="${night ? "#d1604a" : "#4f6aa0"}" stroke="${dk}" stroke-width="2"/>`).join("")
      + `<path d="M162 152V128a18 18 0 0 1 36 0v24z" fill="#4a3a2c"/><path d="M80 152l20-60M280 152l-20-60" stroke="${dk}" stroke-width="5"/>`
      + `<g stroke="${C.brown}" stroke-width="2.600" opacity=".95">${[[254, 150, 254, 60], [292, 150, 292, 60], [254, 60, 292, 60], [254, 110, 292, 110], [254, 150, 292, 110], [254, 110, 292, 60]].map(([a, b, c, d]) => `<path d="M${a} ${b}L${c} ${d}"/>`).join("")}</g>`
      + `<g transform="translate(312 56)"><circle r="12" fill="none" stroke="${C.brown}" stroke-width="3"/><path d="M0-12V12M-12 0h24" stroke="${C.brown}" stroke-width="2"/></g><path d="M300 56L262 30" stroke="${C.brown}" stroke-width="2"/><rect x="258" y="28" width="9" height="9" fill="${st}" stroke="${dk}"/>`
      + ground(150, night ? "#3a3a44" : "#a9946a") + rect(30, 150, 36, 14, st) + rect(38, 140, 28, 10, dk)
      + man(110, 170, 1.3, C.brown, { arm: "up", cap: "#c25757" }) + man(150, 172, 1.2, C.blue, { arm: "front", cap: "#caa" }) + man(300, 172, 1.2, C.green, { arm: "one", cap: "#caa" })
      + (night ? man(60, 174, 1.3, C.dark, { arm: "one", item: "torch" }) + man(330, 174, 1.3, C.dark, { arm: "one", item: "torch" }) : "");
  };

  S.forge = (n) => bg(n, "#2c1f18", "#6b3a22")
    + rect(0, 0, 360, 180, "#4a2e1e", 'opacity=".5"') + `<g stroke="#2a1a10" stroke-width="2" opacity=".6">${[40, 80, 120, 160].map((y) => `<path d="M0 ${y}h360"/>`).join("")}</g>`
    + [30, 62, 94].map((x, i) => `<path d="M${x} 24V${70 + i * 6}" stroke="${C.steel}" stroke-width="5"/><path d="M${x - 7} 36h14" stroke="${C.gold}" stroke-width="3"/>`).join("")
    + `<circle cx="150" cy="40" r="14" fill="none" stroke="${C.gold}" stroke-width="4"/><circle cx="190" cy="40" r="11" fill="none" stroke="${C.gold}" stroke-width="4"/><circle cx="318" cy="46" r="22" fill="#8a6a3a" stroke="${C.gold}" stroke-width="3"/><circle cx="318" cy="46" r="6" fill="${C.gold}"/>`
    + `<path d="M0 70h120v84H0z" fill="#3b2418"/><path d="M14 154V96a46 46 0 0 1 92 0v58z" fill="#ff8a2a"/><path d="M34 154V104a26 26 0 0 1 52 0v50z" fill="#ffd36a"/>`
    + rect(0, 150, 360, 30, "#5a3b28") + `<path d="M150 150h80l6-12H144z" fill="#3a3a44"/><rect x="170" y="150" width="40" height="22" fill="#2e2e36"/><path d="M144 138h60l22-6v-8h-86z" fill="#4a4a54"/>`
    + `<path d="M170 130L200 134" stroke="#ff8a2a" stroke-width="4"/>` + sparks(196, 124, 16)
    + man(260, 168, 2.2, "#8a5a34", { arm: "up", hair: "#b5651d", beard: "#b5651d", belt: "#3a2a1a", sleeve: C.skin }) + `<path d="M270 106l20-10" stroke="${C.steel}" stroke-width="5"/><rect x="282" y="88" width="16" height="10" fill="${C.steel}" transform="rotate(-30 290 93)"/>`;

  S.druids = (n) => bg(n, "#27355e", "#8a6a8a") + sun(280, 40, 22, "#f6f0d6")
    + `<g fill="#1a2240" opacity=".5">${Array.from({ length: 30 }, (_, i) => `<circle cx="${rng(i) * 360}" cy="${rng(i + 3) * 70}" r="1"/>`).join("")}</g>`
    + hills(120, "#3d4a5e", 14) + ground(132, "#2f4a46") + `<ellipse cx="180" cy="140" rx="200" ry="18" fill="#6c8a8a" opacity=".35"/>`
    + `<path d="M80 150C86 120 84 90 80 60h26c-3 28-1 58 4 90z" fill="#3d2c1e"/><circle cx="92" cy="34" r="36" fill="#2c4a38"/><circle cx="58" cy="50" r="24" fill="#365a42"/><circle cx="126" cy="52" r="26" fill="#365a42"/><circle cx="92" cy="60" r="8" fill="#9ccf6a" opacity=".9"/>`
    + `<g fill="#6f6f7a">${[[190, 150, 12, 50], [240, 150, 12, 50], [300, 150, 12, 44]].map(([x, y, w, h]) => `<rect x="${x}" y="${y - h}" width="${w}" height="${h}" rx="3"/>`).join("")}<rect x="184" y="92" width="76" height="12" rx="3"/></g>`
    + crowd(120, 330, 168, 4, ["#f4f1ea"], 1.5, 3, { hood: "#f4f1ea", arm: "front" }) + man(122, 170, 1.9, "#f6f1e2", { hood: "#f6f1e2", arm: "one", belt: C.gold }) + `<path d="M134 128q8-14 20-14" stroke="${C.gold}" stroke-width="3.500" fill="none"/>`;

  S.legion = (n) => bg(n, "#7fb8e0", "#f4ead0") + cloud(70, 32) + cloud(270, 44, 0.9, "c2") + hills(96, "#a8b88a", 14)
    + [40, 100, 300].map((x) => `<path d="M${x - 18} 108l18-20 18 20z" fill="#e8dcc0"/><rect x="${x - 16}" y="108" width="32" height="12" fill="#e8dcc0"/>`).join("")
    + ground(118, "#b9a67a") + `<path d="M0 180L120 118H240L360 180z" fill="#a89870"/><g stroke="#8a7a56" stroke-width="2" opacity=".7">${[130, 142, 156, 172].map((y) => `<path d="M${180 - (y - 118) * 1.8} ${y}H${180 + (y - 118) * 1.8}"/>`).join("")}</g>`
    + crowd(20, 330, 150, 7, [C.red], 1.1, 3, { helm: 1, plume: C.red, arm: "front", item: "spear" })
    + [20, 60, 100, 140, 180, 220, 260, 300].map((x, i) => `<g transform="translate(${x + 16} ${150 + (i % 2) * 6})"><rect x="-8" y="-24" width="14" height="20" rx="3" fill="${C.red}" stroke="${C.gold}" stroke-width="1.600"/><circle cx="-1" cy="-14" r="3" fill="${C.gold}"/></g>`).join("")
    + `<g transform="translate(190 160)"><path d="M0 0V-70" stroke="${C.brown}" stroke-width="3"/><path d="M0-70l-16 6 6-10-12-4 14-4-4-10 12 6 6-8 6 8 12-6-4 10 14 4-12 4 6 10z" fill="${C.gold}"/></g>`
    + man(150, 176, 1.8, C.red, { helm: 1, plume: C.red, cape: "#8a1f24", arm: "one", item: "sword" });

  S.surrender = (n) => bg(n, "#9ec6de", "#efe3c0") + cloud(80, 34) + hills(100, "#9aad7c", 12)
    + [250, 290, 330].map((x) => `<path d="M${x} 130V76" stroke="${C.brown}" stroke-width="2.400"/><rect x="${x - 10}" y="70" width="20" height="14" fill="${C.red}"/><circle cx="${x}" cy="66" r="3.500" fill="${C.gold}"/>`).join("")
    + ground(120, "#b6a273") + `<ellipse cx="180" cy="160" rx="200" ry="24" fill="#a9976a"/>`
    + rect(236, 120, 110, 12, "#8a6a3a") + rect(246, 90, 18, 30, "#6b4a2a") + rect(258, 86, 34, 8, C.red)
    + crowd(240, 336, 166, 5, [C.red], 1.2, 2, { helm: 1, plume: C.red, arm: "front", item: "spear" })
    + man(272, 120, 2, "#f4f0e4", { cape: C.red, arm: "one", hair: "#6b4a2a", cap: null }) + `<path d="M262-40" fill="none"/><path d="M258 80q14-10 28 0" stroke="#5ca05a" stroke-width="3" fill="none"/>`
    + knight(110, 168, 1.5, "#d9d4c4", "#4a6fa0", 1, 0, { lance: false, shield: false }) + `<g transform="translate(110 168) scale(1.5)">${man(8, -33, 1.1, "#4a6fa0", { arm: "out", hair: "#d98a2a", beard: "#d98a2a", helm: 1 })}</g>`
    + `<g stroke="${C.steel}" stroke-width="3" fill="none"><path d="M172 166l26-6M178 152l22 12"/></g><circle cx="204" cy="164" r="10" fill="#6b4a2a" stroke="${C.gold}" stroke-width="2"/><path d="M230 170l-24-4" stroke="${C.brown}" stroke-width="3"/>`;

  S.aqueduct = (n) => bg(n, "#7fc0e8", "#f6ecc8") + cloud(80, 30) + cloud(280, 40, 0.8, "c2") + hills(104, "#a8bd84", 14) + cypress(30, 130, 1.3) + cypress(330, 130, 1.2)
    + `<path d="M0 124Q90 112 180 124T360 118V180H0z" fill="#8fb36a"/>`
    + rect(0, 52, 360, 10, "#cdb988") + arches(0, 62, 360, 36, 10, "#8bb7d4", 2) + `<path d="M0 62h360v44H0z" fill="none"/>` + rect(0, 62, 360, 36, "#cdb988") + arches(0, 62, 360, 36, 10, "#8dc0e0", 4)
    + rect(30, 98, 300, 30, "#c0aa78") + arches(30, 98, 300, 30, 6, "#7fa8c0", 5) + `<path d="M30 126H330v6H30z" fill="${C.water}" opacity=".7"/>`
    + `<path d="M0 150q90-10 180-4t180 4V180H0z" fill="${C.water}"/><path d="M0 162q40-4 80 0t80 0t80 0t80 0" stroke="#fff" opacity=".4" fill="none"/>`
    + `<path d="M0 150H360" stroke="#c9b27a" stroke-width="10" opacity=".0"/>`
    + `<g transform="translate(90 148)"><rect x="-20" y="-16" width="38" height="12" fill="${C.brown}"/><circle cx="-10" cy="-2" r="7" fill="#4a321c"/><circle cx="10" cy="-2" r="7" fill="#4a321c"/></g>` + man(130, 150, 1.2, C.red, { arm: "one", item: "staff" }) + man(60, 150, 1.2, C.green, { arm: "front" });

  S.market = (n) => bg(n, "#8ac3e6", "#f6ecc8") + cloud(180, 28, 1.1)
    + [[0, 56, 90], [270, 40, 100]].map(([x, y, w]) => `${rect(x, y + 20, w, 112, C.cream)}${poly(`M${x - 6} ${y + 20}L${x + w / 2} ${y - 14}L${x + w + 6} ${y + 20}z`, C.roof)}<g stroke="${C.brown}" stroke-width="3"><path d="M${x} ${y + 60}h${w}M${x} ${y + 100}h${w}M${x + w / 3} ${y + 20}v112M${x + (2 * w) / 3} ${y + 20}v112"/></g>${rect(x + 12, y + 70, 14, 20, "#6b8aa0")}${rect(x + w - 26, y + 70, 14, 20, "#6b8aa0")}`).join("")
    + ground(132, "#c9b48a") + `<g stroke="#a99870" stroke-width="1.200" opacity=".6">${Array.from({ length: 12 }, (_, i) => `<path d="M${i * 32} 132l${-10 + i} 48"/>`).join("")}</g>`
    + [[100, C.red], [160, C.blue], [220, C.green]].map(([x, c]) => `<path d="M${x - 24} 100h48l6 14h-60z" fill="${c}"/><g fill="#fff" opacity=".6">${[0, 1, 2, 3].map((i) => `<rect x="${x - 22 + i * 12}" y="100" width="6" height="14"/>`).join("")}</g>${rect(x - 22, 114, 44, 24, "#a47b4a")}<circle cx="${x - 10}" cy="112" r="5" fill="#d9532a"/><circle cx="${x}" cy="112" r="5" fill="#e6b52a"/><circle cx="${x + 10}" cy="112" r="5" fill="#6aa23a"/>`).join("")
    + `<path d="M0 36q90 14 180 0t180 0" stroke="${C.ink}" stroke-width="1.200" fill="none"/>${[30, 70, 110, 150, 200, 240, 280, 320].map((x, i) => `<path d="M${x} ${40 + (i % 2) * 3}l6 12 6-12z" fill="${[C.red, C.blue, C.gold, C.green][i % 4]}"/>`).join("")}`
    + crowd(20, 340, 162, 8, [C.red, C.green, C.brown, C.blue, "#7a5a8a", "#c28a3a"], 1.2, 7, { arm: "mix", cap: "#caa" });

  S.blason = (n) => bg(n, "#7a2b2a", "#5a1d22")
    + `<g opacity=".25" fill="${C.gold}">${Array.from({ length: 36 }, (_, i) => lis(14 + (i % 9) * 40 + (Math.floor(i / 9) % 2) * 20, 18 + Math.floor(i / 9) * 44, 1.2, C.gold)).join("")}</g>`
    + `<path d="M20 30Q180 6 340 30V44Q180 22 20 44z" fill="${C.gold}" opacity=".85"/>`
    + shield(80, 130, 2.800, "#d9aa3c", `<path d="M-6-10q8-6 12 0-2 6 2 10-6 4-8 0-4 4-8-2 4-4 2-8z" fill="${C.red}"/>`) + shield(280, 130, 2.800, C.white, `<rect x="-3" y="-12" width="6" height="30" fill="${C.red}"/><rect x="-11" y="-3" width="22" height="6" fill="${C.red}"/>`)
    + shield(180, 118, 3.600, C.blue, lis(0, -2, 1.600) + lis(-6, 8, 0.9) + lis(6, 8, 0.9))
    + `<path d="M166 40l14-14 14 14v14h-28z" fill="${C.steel}"/><path d="M180 26q10-14 22-8-6 2-8 10z" fill="${C.red}"/>`
    + `<g stroke="${C.steel}" stroke-width="5"><path d="M20 168L120 100M340 168L240 100"/></g>`;

  S.books = (n) => bg(n, "#8a5a38", "#d8a868")
    + window_(40, 20, 70, 90, "#bfe0f0") + `<path d="M75 20v90M40 60h70" stroke="#4a3320" stroke-width="3"/><path d="M52 90l22-24 22 24z" fill="#9ab67a"/>`
    + rect(0, 150, 360, 30, "#6b4a2a") + rect(130, 110, 150, 12, "#8a5a34") + rect(144, 122, 10, 30, "#6b4a2a") + rect(256, 122, 10, 30, "#6b4a2a")
    + `<path d="M170 110l30-8 30 8-30 6z" fill="#f6ecd0"/><path d="M200 102v14" stroke="#c9b27a"/><g stroke="#4a3a2c" opacity=".7"><path d="M178 108l16-4M206 104l16 4"/></g>`
    + `<g transform="translate(250 110)"><circle cx="0" cy="-18" r="16" fill="#4f86a8"/><path d="M-16-18a16 6 0 0 0 32 0M0-34v32" stroke="#2c4a62" fill="none" stroke-width="1.400"/><path d="M-8-10q8-8 12 0" fill="#7ab36a"/><rect x="-6" y="-2" width="12" height="4" fill="${C.gold}"/></g>`
    + `<g>${[0, 1, 2, 3].map((i) => rect(300, 130 - i * 9, 44 - (i % 2) * 6, 8, ["#a8322d", "#2f4f93", "#4f7040", "#d9aa3c"][i], 'stroke="#2e2114" stroke-width="1"')).join("")}</g>`
    + `<rect x="150" y="96" width="4" height="14" fill="#f4e8c4"/><path d="M152 96q-4-6 0-10 4 4 0 10z" fill="#ffb347"/>`
    + man(116, 160, 2.2, "#3d3d6b", { hat: "#222", arm: "front", beard: "#7a5a3a" });

  S.palace = (n, v) => bg(n, "#f2b56a", "#fbe9bc") + sun(180, 64, 24, "#fff1b4")
    + [...Array(14).keys()].map((i) => `<path d="M180 64L${180 + Math.cos(i * 0.2244 + 0.3) * 200} ${64 - Math.sin(i * 0.2244 + 0.3) * 120}" stroke="#fff1b4" stroke-width="2" opacity=".35"/>`).join("")
    + rect(20, 70, 320, 50, "#ece0be") + [...Array(20).keys()].map((i) => i > 6 && i < 13 ? "" : rect(28 + i * 15.5, 82, 7, 16, "#6b8aa0")).join("") + rect(20, 104, 320, 4, C.dstone)
    + rect(150, 50, 60, 70, "#f2e8c8") + poly("M144 50l36-24 36 24z", "#d9c8a0") + [158, 172, 186, 200].map((x) => rect(x, 60, 6, 48, "#fff6e0")).join("") + `<path d="M170 52h20" stroke="${C.gold}" stroke-width="3"/>`
    + [20, 280].map((x) => `${rect(x, 60, 60, 60, "#ece0be")}${poly(`M${x - 4} 60l34-18 34 18z`, "#7d8aa0")}`).join("")
    + rect(0, 120, 360, 60, "#8bb06a") + `<path d="M180 120L120 180H240z" fill="#e9d9ae"/>`
    + [[60, 150], [300, 150]].map(([x, y]) => `<path d="M${x - 30} ${y}h60" stroke="#5a8a4a" stroke-width="8"/><path d="M${x - 24} ${y + 12}h48" stroke="#4f7a40" stroke-width="6"/>`).join("")
    + `<ellipse cx="180" cy="160" rx="26" ry="8" fill="${C.water}"/><path d="M180 160V138" stroke="#cfe8f2" stroke-width="3"/><path d="M180 138q-10 4-14 18M180 138q10 4 14 18" stroke="#cfe8f2" stroke-width="2" fill="none"/>`
    + crowd(60, 300, 172, 5, [C.red, C.blue, "#7a5a8a", C.green], 0.9, 4, { hat: "#222", arm: "front" })
    + [90, 270].map((x) => cypress(x, 150, 0.9));

  S.theatre = (n) => bg(n, "#3a1a1a", "#7a3228")
    + `<path d="M40 150V30h280v120z" fill="#e8d8a8"/><path d="M60 140V50h240v90z" fill="#bfd6c8"/><g fill="#e8d8a8">${[80, 140, 220, 280].map((x) => `<rect x="${x - 4}" y="50" width="8" height="90"/>`).join("")}</g><path d="M60 50h240" stroke="${C.gold}" stroke-width="4"/>`
    + `<path d="M0 0h74q-10 60-14 160H0z" fill="#9a1f2a"/><path d="M360 0h-74q10 60 14 160h60z" fill="#9a1f2a"/><path d="M0 0h360v22q-90 -16-180 0T0 22z" fill="#7a1420"/><g stroke="${C.gold}" stroke-width="2" opacity=".6"><path d="M18 20q10 80 4 140M40 20q8 70 0 140M342 20q-10 80-4 140M320 20q-8 70 0 140"/></g>`
    + rect(0, 150, 360, 30, "#6b4a2a") + [30, 70, 110, 150, 190, 230, 270, 310].map((x) => `<rect x="${x}" y="150" width="3" height="8" fill="#f4e8c4"/><path d="M${x + 1.500} 150q-3-5 0-8 3 3 0 8z" fill="#ffb347"/>`).join("")
    + man(150, 148, 2.3, C.blue, { arm: "out", hat: C.red, cape: "#7a5a8a", beard: "#5a3b22" }) + man(228, 148, 2.1, C.gold, { arm: "up", wig: 1, trim: C.red })
    + `<g fill="#1a0f0c">${Array.from({ length: 20 }, (_, i) => `<circle cx="${12 + i * 18}" cy="${176 + (i % 2) * 2}" r="9"/>`).join("")}</g>`;

  S.revolution = (n, v) => bg(n, "#7a8aa6", "#f0b070") + cloud(70, 34, 1.2) + cloud(300, 28, 1, "c2")
    + `${v === "notredame" ? rect(60, 50, 80, 76, "#aa9f8a") + rect(40, 30, 40, 96, "#9c917c") + rect(120, 30, 40, 96, "#9c917c") + `<circle cx="100" cy="76" r="14" fill="#6a7690"/>` : [50, 98, 146].map((x) => `${rect(x, 56, 40, 70, "#8d8470")}${crenel(x - 2, 56, 44, "#8d8470", 5)}${rect(x + 16, 82, 6, 14, "#2e2114")}`).join("")}`
    + (v === "notredame" ? "" : smoke(120, 52, 5, "#6a6358") + flame(70, 54, 1.1))
    + ground(126, "#6b5a46")
    + `<path d="M0 126Q60 100 130 118T250 112T360 124V180H0z" fill="#5a4a3a"/>`
    + [[210, 150, 30], [240, 154, 26], [272, 150, 30]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r / 2}" ry="${r / 1.8}" fill="#8a5a34" stroke="#3a2a1a" stroke-width="2"/><path d="M${x - r / 2} ${y - 6}h${r}M${x - r / 2} ${y + 6}h${r}" stroke="#3a2a1a"/>`).join("")
    + `<g transform="translate(300 170) rotate(-10)"><circle r="20" fill="none" stroke="#3a2a1a" stroke-width="5"/><path d="M-20 0H20M0-20V20" stroke="#3a2a1a" stroke-width="3"/></g>`
    + flag(176, 130, 100, 1.8) + crowd(30, 340, 176, 9, [C.blue, "#c8323a", "#e8e0cc", C.brown, C.green], 1.2, 5, { arm: "mix", cap: "#c8323a" });

  S.valmy = (n) => bg(n, "#b5c4d2", "#f1ead6") + cloud(70, 30, 1.2) + cloud(280, 44, 1, "c2")
    + `<path d="M0 100Q80 80 160 96T360 92V180H0z" fill="#a0b48a"/><path d="M0 130Q120 108 360 132V180H0z" fill="#86a56c"/>`
    + `<g transform="translate(290 120)"><path d="M-10 0L-6-44H6L10 0z" fill="#f2ecdc"/><path d="M-8-44l8-12 8 12z" fill="#7a5a3a"/><g stroke="#f2ecdc" stroke-width="4"><path d="M0-34L-34-56M0-34L34-12M0-34L36-60M0-34L-30-10"/></g><rect x="-3" y="-20" width="6" height="12" fill="#6a4a2a"/></g>`
    + smoke(40, 130, 5, "#cfcbbf", 1.4) + smoke(120, 140, 4, "#cfcbbf", 1.2)
    + `<g>${[0, 1, 2, 3, 4, 5, 6].map((i) => { const x = 28 + i * 44, y = 168 - (i % 3) * 10; return man(x, y, 1.35, "#2f4f93", { arm: "one", belt: "#f2ecdc", trim: "#f2ecdc", item: "sword" }) + `<path d="M${x + 12} ${y - 36}q6-8 14 0l-3 4q-5-3-8 0z" fill="${C.ink}"/>`; }).join("")}</g>`
    + flag(190, 150, 60, 1.4) + knight(168, 148, 1, "#6e4a2a", "#2f4f93", 1, 0, { lance: false, shield: false });

  S.assembly = (n) => bg(n, "#6a7898", "#d6c8a8")
    + arches(10, 14, 340, 100, 5, "#e8dcc0", 12) + `<g stroke="#8f8466" stroke-width="3">${[84, 150, 216, 282].map((x) => `<path d="M${x} 14v100"/>`).join("")}</g>`
    + `<path d="M0 0h360v14H0z" fill="#8a2a30"/>${[30, 90, 150, 210, 270, 330].map((x) => lis(x, 10, 0.8)).join("")}`
    + rect(0, 120, 360, 60, "#a48a62") + [...Array(8).keys()].map((i) => rect(i * 46, 120, 23, 60, "#8a7048", 'opacity=".4"')).join("")
    + crowd(16, 112, 150, 4, ["#2d2438", "#4a3a5e", "#2d2438"], 1.4, 2, { arm: "mix", cap: "#222" })
    + crowd(250, 346, 150, 4, [C.red, C.blue, "#c28a3a", C.green], 1.4, 5, { hat: "#a8322d", plume: "#caa", arm: "mix" })
    + `<rect x="150" y="148" width="60" height="8" fill="#7a5a34"/>` + man(180, 148, 2.2, "#6e5538", { arm: "one", item: null }) + `<path d="M196 94l8 0" stroke="#fff"/>`
    + crowd(120, 240, 172, 5, ["#6e5538", "#8a7048", "#5d4a30", "#8b7355"], 1.5, 9, { arm: "up" })
    + flag(180, 120, 70, 1.3);

  S.napoleon = (n) => bg(n, "#f08a50", "#fbe4b0") + sun(250, 92, 30, "#ffe9a0")
    + [...Array(12).keys()].map((i) => `<path d="M250 92L${250 + Math.cos(i * 0.2618 + 3.3) * 220} ${92 + Math.sin(i * 0.2618 + 3.3) * 120}" stroke="#fff3c0" stroke-width="3" opacity=".3"/>`).join("")
    + `<path d="M0 110Q70 90 130 104T260 100T360 112V180H0z" fill="#9a8a6a" opacity=".8"/><path d="M0 138Q100 120 200 134T360 130V180H0z" fill="#7a8a5a"/>`
    + `<path d="M0 108q120 -10 360 4v10H0z" fill="#f7e9d0" opacity=".5"/>`
    + `<g>${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => man(150 + i * 26, 168 - (i % 2) * 8, 1.15, "#2f4f93", { arm: "one", belt: "#f2ecdc", trim: "#f2ecdc", item: "spear", bicorne: 1 })).join("")}</g>`
    + `<g transform="translate(300 160)"><rect x="-16" y="-14" width="36" height="8" fill="${C.dark}" transform="rotate(-10)"/><circle cx="-8" cy="0" r="9" fill="#5a3b22"/><circle cx="14" cy="0" r="9" fill="#5a3b22"/></g>` + smoke(320, 130, 3, "#d6d0c4", 1)
    + `<path d="M70 168Q96 120 150 122L180 168z" fill="#7d8f5c"/>`
    + horse(86, 152, 1.9, "#f4f1ea", 1) + `<g transform="translate(86 152) scale(1.9)">${man(0, -22, 1, "#8a8f98", { bicorne: 1, arm: "one", cape: "#8a8f98", skin: C.skin })}</g>` + flag(40, 160, 74, 1.4);

  S.snow = (n) => bg(n, "#b8c4d2", "#eef1f2") + `<ellipse cx="280" cy="108" rx="80" ry="30" fill="#f08a50" opacity=".35"/>` + flame(300, 110, 1.2) + smoke(300, 90, 4, "#6d6a68", 1)
    + `<path d="M0 118Q100 104 200 118T360 112V180H0z" fill="#e8ecee"/><path d="M0 138Q120 124 360 140V180H0z" fill="#f6f8f8"/>`
    + [30, 90, 130].map((x) => `<path d="M${x} 130V100M${x} 112l-10-10M${x} 106l10-8" stroke="#4a4038" stroke-width="2.500"/>`).join("")
    + `<g>${[0, 1, 2, 3, 4, 5, 6].map((i) => man(40 + i * 44, 170 - (i % 3) * 8, [1.3, 1.2], i % 2 ? "#4a4650" : "#3a4a6a", { arm: "front", bicorne: i % 3 === 0, hood: i % 3 ? "#5a5a66" : null })).join("")}</g>`
    + `<g transform="translate(220 150)"><rect x="-22" y="-14" width="44" height="10" fill="${C.brown}"/><circle cx="-12" cy="0" r="8" fill="#4a321c"/><circle cx="12" cy="0" r="8" fill="#4a321c"/></g>`
    + `<g fill="#fff">${Array.from({ length: 70 }, (_, i) => `<circle cx="${rng(i) * 360}" cy="${rng(i + 2) * 180}" r="${1 + rng(i + 7) * 1.400}" opacity=".85"/>`).join("")}</g>` + bird(250, 60, 1.2) + bird(280, 48, 1);

  S.exile = (n) => bg(n, "#55657e", "#aab4bc") + cloud(60, 30, 1.3) + cloud(290, 40, 1.1, "c2") + wave(112, "#4a6a86", 1, 3) + wave(128, "#3f5f7c", 1, 4) + wave(150, "#355470", 1, 5)
    + `<path d="M120 150L140 100 164 96 176 76 200 80 214 104 250 120 270 150z" fill="#5a5448"/><path d="M148 100l28-26 24 6-20 26z" fill="#6c6658"/><path d="M200 82l14 22 36 16" fill="none" stroke="#7a7466" stroke-width="3"/>`
    + `<path d="M120 150Q190 140 270 150V160H120z" fill="#fff" opacity=".45"/>` + palm(236, 120, 0.7)
    + man(176, 78, 1, "#7a7f88", { bicorne: 1, cape: "#7a7f88", arm: "hip" }) + `<path d="M40 128l30 0 6-14-14-8z" fill="${C.dark}" opacity=".9"/><path d="M52 106v22M62 108v20" stroke="${C.dark}" stroke-width="2"/><path d="M52 106l-10 18h10zM62 108l-8 16h8z" fill="#e8dcc0"/>` + bird(110, 60, 1.2) + bird(310, 90);

  S.factory = (n) => bg(n, "#a8a6a2", "#efd2a6") + smoke(70, 84, 6, "#6c6a68", 1.2) + smoke(150, 70, 6, "#7a7876", 1.4) + smoke(230, 90, 5, "#6c6a68", 1.2)
    + brick(30, 90, 250, 60, "#a4553a") + [60, 140, 220].map((x) => rect(x, 36, 16, 60, "#8a4a32") + rect(x - 2, 34, 20, 4, "#6a3a28")).join("")
    + [0, 1, 2, 3, 4, 5, 6].map((i) => rect(44 + i * 34, 106, 14, 20, "#f6d98a")).join("") + poly("M30 90l30-14 30 14 30-14 30 14 30-14 30 14 30-14 30 14z", "#8a4a32")
    + `<g stroke="#4a4038" stroke-width="3">${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M${i * 60} 160v-20q30-24 60 0v20"/>`).join("")}</g>` + rect(0, 140, 360, 6, "#4a4038")
    + `<g transform="translate(250 140)"><rect x="-4" y="-34" width="70" height="26" rx="3" fill="#2c2c34"/><rect x="42" y="-48" width="22" height="40" fill="#2c2c34"/><rect x="-6" y="-14" width="76" height="6" fill="#a8322d"/><circle cx="6" cy="-4" r="10" fill="#5a5a66"/><circle cx="36" cy="-4" r="10" fill="#5a5a66"/><circle cx="58" cy="-4" r="7" fill="#5a5a66"/><rect x="2" y="-46" width="12" height="14" fill="#2c2c34"/></g>` + smoke(252, 92, 4, "#f2f0ec", 1)
    + ground(146, "#6a5f50") + crowd(30, 160, 172, 4, ["#4a4650", "#6a5a46", "#3a4a6a"], 1.3, 4, { cap: "#222", arm: "mix" });

  S.salon = (n) => bg(n, "#7a5a3a", "#d8b278")
    + [60, 180, 300].map((x) => `<path d="M${x - 24} 30V12a24 24 0 0 1 48 0v18z" fill="none"/>` + window_(x - 24, 16, 48, 80, "#bfd8ee") + `<path d="M${x} 16V96M${x - 24} 56H${x + 24}" stroke="#4a3320" stroke-width="3"/>`).join("")
    + `<g transform="translate(180 6)"><path d="M0 0v20" stroke="${C.gold}" stroke-width="2"/><path d="M-30 20h60l-10 12h-40z" fill="${C.gold}"/>${[-26, -12, 0, 12, 26].map((x) => `<rect x="${x - 1.500}" y="12" width="3" height="8" fill="#f4e8c4"/><path d="M${x} 12q-3-5 0-8 3 3 0 8z" fill="#ffb347"/>`).join("")}</g>`
    + rect(0, 128, 360, 52, "#9a7a4c") + `<ellipse cx="180" cy="140" rx="120" ry="18" fill="#7a2a30"/><rect x="60" y="134" width="240" height="8" fill="#6b4a2a"/><rect x="70" y="142" width="10" height="30" fill="#5a3a22"/><rect x="280" y="142" width="10" height="30" fill="#5a3a22"/>`
    + `<g>${[0, 1, 2, 3, 4].map((i) => rect(120 + i * 30, 132 - (i % 2) * 4, 22, 6, ["#a8322d", "#2f4f93", "#4f7040", "#d9aa3c", "#6b3f7a"][i], 'stroke="#2e2114" stroke-width=".8"')).join("")}</g>`
    + [[90, C.blue], [140, C.red], [220, C.green], [270, "#7a5a8a"]].map(([x, c], i) => man(x, 142, [1.6, 1.4], c, { wig: 1, arm: i % 2 ? "front" : "one", trim: "#f6f0e0" })).join("")
    + `<g transform="translate(335 110)"><rect x="-10" y="20" width="20" height="40" fill="#cfc4aa"/><circle cx="0" cy="8" r="11" fill="#eee6d4"/><path d="M-8 4q8-6 16 0" stroke="#aaa" fill="none"/></g>`;

  S.cardinal = (n) => bg(n, "#4a2a2a", "#a86a3a")
    + `<rect x="30" y="20" width="110" height="80" fill="#e8d8a8" stroke="#4a3320" stroke-width="4"/><path d="M42 80q20-10 40 0t40-10V90H42z" fill="${C.water}"/><path d="M60 60l14-12 14 12v20H60z" fill="${C.dstone}"/><path d="M96 66l10-8 10 8v14H96z" fill="${C.dstone}"/><g fill="${C.red}"><circle cx="118" cy="40" r="3"/><circle cx="52" cy="40" r="3"/></g>`
    + window_(260, 20, 56, 90, "#7a8ab0") + `<path d="M288 20v90M260 60h56" stroke="#4a3320" stroke-width="3"/>`
    + rect(0, 140, 360, 40, "#6b4a2a") + rect(90, 118, 190, 12, "#8a5a34") + rect(100, 130, 10, 24, "#5a3a22") + rect(260, 130, 10, 24, "#5a3a22")
    + `<path d="M150 118l36-6 34 6z" fill="#f6ecd0"/><path d="M200 116l40-34" stroke="#f3e9c8" stroke-width="3"/><circle cx="244" cy="76" r="0"/>`
    + `<rect x="232" y="104" width="4" height="14" fill="#f4e8c4"/><path d="M234 104q-4-6 0-10 4 4 0 10z" fill="#ffb347"/>`
    + `<g transform="translate(262 116)"><ellipse cx="0" cy="-6" rx="11" ry="7" fill="#d9a15a"/><circle cx="12" cy="-12" r="6" fill="#d9a15a"/><path d="M9-17l1-6 4 4zM15-17l4-5 0 7z" fill="#d9a15a"/><path d="M-10-6q-10-6-4-14" stroke="#d9a15a" stroke-width="3" fill="none"/></g>`
    + man(160, 150, 2.4, C.red, { cape: "#8a1f24", arm: "front", beard: "#3a2a1a", cap: "#7a1218", skin: C.skin });

  S.joan = (n) => bg(n, "#f6c47a", "#fbeed0") + sun(180, 50, 18, "#fff3c0")
    + [...Array(14).keys()].map((i) => `<path d="M180 50L${180 + Math.cos(i * 0.4488 + 0.1) * 260} ${50 - Math.sin(i * 0.4488 + 0.1) * 140}" stroke="#fff3c0" stroke-width="3" opacity=".4"/>`).join("")
    + hills(116, "#a9b787", 10) + rect(250, 70, 110, 50, C.stone) + wallTop(250, 70, 110, 4, C.stone) + tower(262, 52, 22, 30, C.dstone, C.roof) + tower(320, 50, 24, 34, C.dstone, C.roof)
    + ground(122, "#7fa85c") + `<path d="M0 138Q100 126 360 142V180H0z" fill="#6f9a50"/>` + `<path d="M0 126q40-6 80 0t80 0t80 0t80 0V138H0z" fill="${C.water}" opacity=".0"/>`
    + crowd(210, 340, 170, 5, [C.steel, C.blue, C.red], 1.2, 3, { helm: 1, arm: "mix", item: "spear", plume: null })
    + `<g transform="translate(120 160)">${horse(0, 0, 2, "#f6f2ea", 1, 0, caparison(C.white))}${man(0, -34, 1.9, C.steel, { arm: "one", hair: "#3a2a1a", cap: null })}<path d="M12-92V-40" stroke="${C.brown}" stroke-width="2"/><path d="M12-92q22-6 36 4l-6 6 6 8q-22-8-36-2z" fill="${C.white}" stroke="${C.gold}"/>${lis(32, -80, 0.7, C.gold)}</g>`;

  S.archers = (n) => bg(n, "#8a96a6", "#d9d6c4") + cloud(70, 30, 1.2) + cloud(290, 36, 1.1, "c2")
    + hills(110, "#8fa070", 8) + ground(124, "#7b8f56") + `<path d="M0 144Q120 130 360 146V180H0z" fill="#6a7a48"/>`
    + `<g stroke="${C.ink}" stroke-width="1.400" fill="none" opacity=".75">${[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => `<path d="M${40 + i * 6} ${112 - (i % 3) * 4}Q${150 + i * 14} ${-10 + (i % 4) * 8} ${232 + i * 10} ${120 + (i % 3) * 8}"/>`).join("")}</g>`
    + crowd(14, 100, 164, 5, ["#3f6a3a", "#4f7a45"], 1.3, 3, { cap: "#caa", arm: "one" })
    + `<g stroke="${C.brown}" stroke-width="2.200" fill="none">${[24, 42, 60, 78].map((x, i) => `<path d="M${x + 12} ${126 + (i % 2) * 4}q8 12 0 24"/>`).join("")}</g>`
    + knight(250, 168, 1.15, "#6e4a2a", C.blue, -1, 1, { banner: C.blue, lance: true, plume: C.gold }) + knight(318, 160, 1, "#c9b896", "#f6f0e0", -1, 1, { banner: C.blue })
    + `<g transform="translate(205 160) rotate(-70)">${horse(0, 0, 1, "#8a6a4a", 1, 1, caparison(C.red))}</g>` + smoke(160, 140, 3, "#9a9488", 1);

  S.varennes = (n) => bg(n, "#101a3c", "#2f4678") + sun(70, 40, 16, "#f6f0d6")
    + `<g fill="#fff" opacity=".7">${Array.from({ length: 30 }, (_, i) => `<circle cx="${rng(i) * 360}" cy="${rng(i + 6) * 80}" r="1"/>`).join("")}</g>`
    + hills(110, "#1d2a4a", 14) + ground(132, "#24334e") + [24, 330, 300].map((x, i) => pine(x, 134, 1.3 - i * 0.1, "#162238")).join("")
    + `<path d="M0 160Q180 138 360 150V180H0z" fill="#3a4a66"/><path d="M0 164Q180 146 360 158" stroke="#5a6a88" stroke-width="2" fill="none"/>`
    + horse(88, 160, 1.5, "#2a1d14", 1, 1) + horse(142, 160, 1.5, "#3a2a1c", 1, 1)
    + `<g transform="translate(220 156)"><rect x="-6" y="-40" width="76" height="34" rx="6" fill="#3a2a1a"/><rect x="2" y="-34" width="22" height="18" fill="#ffd36a" opacity=".9"/><rect x="34" y="-34" width="22" height="18" fill="#ffd36a" opacity=".6"/><circle cx="6" cy="0" r="14" fill="#241a10" stroke="#6a5a46" stroke-width="3"/><circle cx="58" cy="0" r="14" fill="#241a10" stroke="#6a5a46" stroke-width="3"/><path d="M-6-40h76" stroke="${C.gold}" stroke-width="3"/></g>`
    + `<path d="M280 150l30 0" stroke="#ffd36a" stroke-width="3" opacity=".5"/>`;

  S.law = (n) => bg(n, "#7a5a3a", "#d8b278")
    + window_(30, 16, 60, 100, "#bfd8ee") + `<path d="M60 16V116M30 60H90" stroke="#4a3320" stroke-width="3"/>`
    + `<path d="M250 0h50v110l-25 -10 -25 10z" fill="#2f4f93"/><path d="M300 0h50v110l-25 -10 -25 10z" fill="#c8323a"/><path d="M200 0h50v110l-25 -10 -25 10z" fill="#f2ecdc"/>`
    + rect(0, 150, 360, 30, "#6b4a2a") + rect(70, 120, 220, 14, "#8a5a34") + rect(84, 134, 10, 30, "#5a3a22") + rect(266, 134, 10, 30, "#5a3a22")
    + `<path d="M120 120l60-20 60 20z" fill="#7a2a30"/><path d="M130 118l50-16 50 16-50 8z" fill="#f6ecd0"/><path d="M180 102v22" stroke="#b9a070"/><text x="180" y="116" text-anchor="middle" font-family="serif" font-size="9" fill="#5a1d12">CODE</text>`
    + `<g transform="translate(110 118)" stroke="${C.gold}" stroke-width="2.200" fill="none"><path d="M0 0v-42M-18-34h36M-18-34l-9 18h18zM18-34l-9 18h18z" stroke-linejoin="round"/></g>`
    + `<path d="M246 112l22-26" stroke="#f3e9c8" stroke-width="3"/><circle cx="244" cy="116" r="7" fill="#a8322d" stroke="${C.gold}"/>`
    + man(200, 154, 2.1, "#2f4f93", { arm: "front", bicorne: 1, trim: C.gold });

  S.boulevard = (n) => bg(n, "#9fc4dc", "#f6ecd8") + cloud(70, 30) + cloud(280, 36, 0.9, "c2")
    + `<path d="M0 180L150 88H210L360 180z" fill="#c9b99a"/>`
    + `<path d="M0 0V180L150 92V20z" fill="#efe2c4"/><path d="M360 0V180L210 92V20z" fill="#efe2c4"/>`
    + [0, 1, 2, 3].map((i) => `<path d="M${6 + i * 36} ${24 + i * 12}l22 6v24l-22-6z" fill="#7e9ab6" opacity=".9"/><path d="M${354 - i * 36} ${24 + i * 12}l-22 6v24l22-6z" fill="#7e9ab6" opacity=".9"/>`).join("")
    + `<path d="M0 20L150 20L160 8H0z" fill="#6a7690"/><path d="M360 20H210L200 8H360z" fill="#6a7690"/>`
    + `<g fill="#3a5a3a">${[[60, 150, 1.6], [110, 118, 1.1], [300, 150, 1.6], [250, 118, 1.1]].map(([x, y, s]) => `<rect x="${x - 1.500 * s}" y="${y - 22 * s}" width="${3 * s}" height="${22 * s}" fill="#4a3a28"/><circle cx="${x}" cy="${y - 30 * s}" r="${12 * s}"/>`).join("")}</g>`
    + `<g fill="${C.ink}">${[[80, 168], [275, 168]].map(([x, y]) => `<rect x="${x}" y="${y - 60}" width="3" height="60"/><circle cx="${x + 1.500}" cy="${y - 64}" r="5" fill="#ffe08a"/>`).join("")}</g>`
    + man(185, 176, 1.5, "#222", { arm: "front", hat: "#222" }) + man(150, 160, 1.1, C.red, { arm: "front", hat: "#caa" }) + man(222, 150, 0.9, "#6a5a8a", { arm: "front" })
    + `<g transform="translate(176 118)"><rect x="-10" y="-8" width="22" height="10" fill="#3a2a1a"/><circle cx="-5" cy="3" r="4" fill="#241a10"/><circle cx="7" cy="3" r="4" fill="#241a10"/></g>`;

  S.orders = (n) => bg(n, "#8ac3e6", "#f4ecc6") + cloud(80, 30) + cloud(280, 42, 0.8, "c2") + hills(108, "#a9bf88", 12)
    + rect(20, 78, 60, 40, "#d9c8a0") + poly("M14 78l36-24 36 24z", C.roof) + cross(50, 44, 0.8, C.dark)
    + rect(282, 70, 60, 48, C.stone) + wallTop(282, 70, 60, 4, C.stone) + tower(272, 56, 18, 62, C.dstone, C.roof)
    + ground(118, "#85b265") + `<g stroke="#e0c46a" stroke-width="3" opacity=".8">${Array.from({ length: 12 }, (_, i) => `<path d="M${130 + i * 12} 130v-14"/>`).join("")}</g>`
    + `<path d="M0 142Q120 128 360 144V180H0z" fill="#6f9a50"/>`
    + man(80, 176, 3, "#5a4636", { hood: "#5a4636", arm: "front", item: "book", belt: "#caa" })
    + man(180, 178, 3, C.steel, { arm: "one", item: "sword", helm: 1, plume: C.red, cape: C.red }) + shield(160, 148, 1.100, C.blue, lis(0, -3, 0.8))
    + man(284, 176, 3, C.green, { arm: "one", item: "scythe", straw: 1, belt: "#6b4a2a" });

  S.troubadour = (n) => bg(n, "#9fd0ea", "#f6efc8") + cloud(260, 30) + hills(106, "#a9bf88", 14)
    + rect(240, 56, 90, 66, C.stone) + wallTop(236, 56, 98, 4, C.stone) + tower(226, 40, 22, 82, C.dstone, C.roof) + tower(322, 44, 22, 78, C.dstone, C.roof) + banner(285, 40, 20, C.red, 1)
    + ground(122, "#7fb05e") + [...Array(10).keys()].map((i) => `<circle cx="${14 + i * 34}" cy="${134 + (i % 3) * 8}" r="4" fill="#e4577a"/>`).join("")
    + `<path d="M0 144Q120 134 360 148V180H0z" fill="#6f9a50"/>`
    + `<path d="M130 180q10-26 26-26 18 0 24 26z" fill="#9a9a9a"/><rect x="152" y="130" width="3.500" height="30" fill="${C.steel}"/><rect x="144" y="134" width="20" height="3.500" fill="${C.gold}"/><circle cx="153" cy="124" r="14" fill="#fff6c0" opacity=".45"/>`
    + man(60, 170, 2.1, "#c28a3a", { arm: "one", item: "lute", cap: C.red, plume: C.red, trim: C.red })
    + man(236, 172, 2.2, C.green, { hennin: "#e4577a", arm: "front", belt: C.gold }) ;

  S.hermit = (n) => bg(n, "#f4b66c", "#fbe5b4") + sun(260, 62, 28, "#fff1b0")
    + `<path d="M0 120Q90 94 170 112T360 100V180H0z" fill="#e6c27c"/><path d="M0 144Q120 124 360 140V180H0z" fill="#d6aa5c"/>`
    + `<path d="M20 150C20 90 60 60 110 70c40 8 56 40 56 80z" fill="#a88a5a"/><path d="M52 150C52 112 72 96 100 100c24 4 34 24 34 50z" fill="#3a2a1a"/>`
    + palm(300, 146, 1.2) + palm(330, 150, 0.9)
    + `<path d="M0 0" fill="none"/>` + man(100, 152, 2, "#6e5a40", { hood: "#6e5a40", arm: "up", beard: "#eee", belt: "#caa" }) + cross(60, 120, 0.9, C.dark)
    + `<g transform="translate(150 70)" fill="${C.ink}"><ellipse cx="0" cy="0" rx="9" ry="4"/><path d="M-3-1q-10-12-20-8 8 2 14 10zM3-1q10-12 20-8-8 2-14 10z"/><circle cx="9" cy="-2" r="3"/><path d="M12-2l6 2-6 1z" fill="${C.ink}"/><ellipse cx="-2" cy="8" rx="5" ry="3" fill="#d9a15a"/></g>`;

  S.mountain = (n) => bg(n, "#a8c4dc", "#eef2f4") + cloud(280, 34)
    + `<path d="M0 120L60 50 100 92 150 30 210 100 260 56 320 110 360 80V180H0z" fill="#c8d4e0"/><path d="M150 30l-24 28 14-4 10 12 8-12 14 6z" fill="#fff"/><path d="M60 50l-16 22 12-4 6 8 8-8z" fill="#fff"/><path d="M260 56l-18 22 12-4 8 8 8-10z" fill="#fff"/>`
    + `<path d="M0 134Q90 112 180 130T360 124V180H0z" fill="#f8fafb"/>` + [20, 50, 300, 336, 280].map((x, i) => pine(x, 142 + (i % 2) * 8, 1.3, "#2f5a44")).join("")
    + rect(120, 112, 80, 28, "#cbbd9a") + poly("M114 112l46-22 46 22z", "#8a6a50") + rect(206, 100, 30, 40, "#bfae8a") + poly("M202 100l19-20 19 20z", "#8a6a50") + rect(150, 122, 10, 18, "#4a3a2c") + rect(172, 122, 10, 18, "#4a3a2c") + rect(214, 114, 8, 12, "#ffd36a")
    + `<path d="M100 180Q160 150 190 142" stroke="#dfe6ea" stroke-width="14" fill="none"/>`
    + crowd(60, 200, 172, 4, ["#f6f4ec"], 1.4, 4, { hood: "#f6f4ec", arm: "front" })
    + `<g fill="#fff" opacity=".85">${Array.from({ length: 40 }, (_, i) => `<circle cx="${rng(i) * 360}" cy="${rng(i + 4) * 170}" r="1.300"/>`).join("")}</g>`;

  S.longship = (n) => bg(n, "#8f9ca8", "#e0d9c2") + cloud(80, 30, 1.2) + cloud(290, 40, 1, "c2")
    + hills(98, "#7f8f70", 8) + rect(240, 54, 120, 54, C.stone) + wallTop(240, 54, 120, 4, C.stone) + tower(248, 38, 22, 20, C.dstone, C.roof) + tower(322, 36, 22, 22, C.dstone, C.roof) + `<path d="M232 108H360" stroke="${C.brown}" stroke-width="6"/>`
    + `<g transform="translate(300 54)">${[0, 1, 2, 3].map((i) => man(-20 + i * 14, 6, 0.7, C.steel, { helm: 1, arm: "up", plume: null })).join("")}</g>` + flame(268, 54, 0.9) + smoke(268, 44, 3, "#6d655a", 1)
    + wave(112, C.water, 0.95, 3) + wave(128, "#3f6f90", 0.95, 4) + wave(150, "#35607e", 1, 4)
    + `<g transform="translate(110 130)"><path d="M-80 0Q-70 24 0 26T84 0L70-4Q0 14-70-4z" fill="${C.brown}"/><path d="M-80 0q-6-20 4-30l8 6q-8 10-4 22z" fill="${C.brown}"/><path d="M-78-24q-10-14 0-22 6 2 4 8-6 4 0 10z" fill="${C.brown}"/><circle cx="-76" cy="-40" r="2" fill="#fff"/><path d="M84 0q8-16 2-26l-6 4q4 10 0 20z" fill="${C.brown}"/><rect x="-1.500" y="-70" width="3" height="70" fill="#4a321c"/><path d="M-36-70h72v50H-36z" fill="${C.red}"/><g fill="#f6f0e0">${[-24, -12, 0, 12, 24].map((x) => `<rect x="${x - 3}" y="-70" width="6" height="50"/>`).join("")}</g>${[-60, -44, -28, -12, 4, 20, 36, 52].map((x, i) => `<circle cx="${x + 8}" cy="2" r="6" fill="${[C.gold, C.red, C.blue, C.white][i % 4]}" stroke="${C.ink}" stroke-width="1.200"/>`).join("")}${[-50, -30, -10, 10, 30, 50].map((x) => `<path d="M${x} 6l-8 18" stroke="${C.brown}" stroke-width="2"/>`).join("")}</g>`;

  S.ship = (n) => bg(n, "#7ec0e8", "#f6ecc8") + sun(280, 46, 16, "#fff2b0") + cloud(70, 34) + cloud(200, 54, 0.8, "c2")
    + `<path d="M0 100Q60 92 120 100T240 98T360 100V180H0z" fill="#7ab4d2"/>` + wave(112, "#5c9cc0", 0.9, 3) + wave(132, "#4a8aae", 0.95, 4) + wave(156, "#3b7597", 1, 5)
    + `<g transform="translate(150 134)"><path d="M-70 0Q-60 22 0 24T70 0L58-8Q0 6-58-8z" fill="${C.brown}"/><path d="M-70 0l-6-18 14 6zM70 0l8-24-16 10z" fill="${C.brown}"/><rect x="-1.500" y="-90" width="3" height="90" fill="#4a321c"/><path d="M-40-84Q0-96 40-84V-26Q0-14-40-26z" fill="#f6f0e0" stroke="#c9b898" stroke-width="1.500"/>${cross(0, -56, 1.600, C.red)}<path d="M2-96l22 6-22 6z" fill="${C.red}"/><path d="M-60-8q60 8 120 0" stroke="${C.gold}" stroke-width="2"/></g>`
    + bird(300, 80, 1.2) + bird(318, 66, 1) + bird(60, 70, 1.1) + `<path d="M0 100H360" stroke="#fff" opacity=".25"/><path d="M300 100l8-10 10 10z" fill="#8aa07a" opacity=".6"/>`;

  S.charge = (n) => bg(n, "#e89a5a", "#fbe3ad") + sun(280, 70, 22, "#fff0b8") + hills(112, "#8a8a6a", 10)
    + tower(300, 78, 26, 36, "#8a7f66") + banner(40, 112, 40, C.red, 1) + ground(122, "#a8a46a") + `<path d="M0 142Q120 128 360 144V180H0z" fill="#8f8f52"/>`
    + smoke(60, 160, 4, "#d9c9a0", 1.3) + smoke(150, 176, 3, "#d9c9a0", 1.6)
    + knight(70, 168, 1.25, "#6e4a2a", C.blue, 1, 1, { banner: C.blue, plume: C.blue }) + knight(170, 164, 1.2, "#f2efe6", C.red, 1, 1, { plume: C.red }) + knight(262, 172, 1.35, "#3a2a1c", C.green, 1, 1, { plume: C.gold, banner: C.green });

  S.battle = (n, v) => {
    const desert = v === "desert", gun = v === "gun";
    return bg(n, desert ? "#f0b872" : gun ? "#b5b0a4" : "#d98a5a", desert ? "#f6e2b4" : gun ? "#e6e0d0" : "#f4d9a4") + sun(70, 60, 18, "#ffe9a8")
      + hills(110, desert ? "#d6b070" : "#8d8a68", 10) + ground(122, desert ? "#e0bd7a" : "#9a9a5e") + `<path d="M0 142Q120 128 360 146V180H0z" fill="${desert ? "#d3aa62" : "#85854a"}"/>`
      + banner(66, 128, 60, desert ? C.white : C.blue, 1.2, desert ? cross(0, 0, 0.6) : lis(0, 0, 0.6)) + banner(300, 128, 60, desert ? C.green : C.red, 1.2, desert ? `<circle r="4" fill="${C.white}"/>` : "")
      + crowd(20, 150, 164, 5, [desert ? "#ece4d0" : C.blue], 1.35, 2, { helm: 1, plume: null, arm: "mix", item: gun ? "spear" : "sword" })
      + crowd(210, 340, 164, 5, [desert ? C.green : C.red], 1.35, 6, { helm: 1, plume: null, arm: "mix", item: gun ? "spear" : "sword" })
      + `<g stroke="${C.steel}" stroke-width="3">${[[158, 150, 196, 128], [160, 128, 198, 152], [170, 140, 190, 140]].map(([a, b, c, d]) => `<path d="M${a} ${b}L${c} ${d}"/>`).join("")}</g>` + sparks(178, 140, 10, "#fff")
      + (gun ? smoke(60, 150, 4, "#e8e2d4", 1.5) + smoke(300, 150, 4, "#e8e2d4", 1.5) + `<g transform="translate(120 170)"><rect x="-18" y="-14" width="36" height="8" fill="${C.dark}" transform="rotate(-8)"/><circle cx="-8" cy="0" r="8" fill="#5a3b22"/><circle cx="12" cy="0" r="8" fill="#5a3b22"/></g>` : `<g stroke="${C.ink}" stroke-width="1.200" opacity=".7">${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M${100 + i * 30} ${70 + (i % 3) * 8}l10 20"/>`).join("")}</g>`)
      + smoke(180, 168, 4, "#e0cfa0", 1.2);
  };

  /* ===================== PLAN : quelle scène pour quel niveau ===================== */
  // "scène" ou ["scène", variante]
  const MAP = {
    gaule: ["forge", "ship", "druids", "legion", "surrender", "aqueduct", "market", "books", "martyrs", "battle"],
    evangelisation: ["preaching", "martyrs", "charity", ["preaching", "patrick"], "pilgrim", "baptism", "oak", "scriptorium", "coronation", "schism"],
    carolingiens: ["baptism", "throne", "charge", "coronation", "battle", ["coronation", "pope"], "scriptorium", ["monkwork", "field"], "council", "longship"],
    moines: ["monastery", "hermit", ["monastery", "field"], "scriptorium", "monkwork", "cathedral", ["monkwork", "field"], "cathedral", ["scriptorium", "nun"], "mountain"],
    chevaliers: ["orders", "knighting", "castle", "charge", "tournament", "council", "troubadour", "crusade", "blason", ["archers"]],
    croisades: ["council", "crusade", "siege", "castle", "orders", "preaching", ["battle", "desert"], "crusade", "ship", ["siege", "sea"]],
    capetiens: ["coronation", "longship", "charge", ["throne"], "cathedral", "market", "council", "archers", ["battle"], "joan"],
    renaissance: ["charge", ["battle", "gun"], "palace", "books", "preaching", "ship", "salon", "throne", ["cathedral", "night"], "law"],
    "grand-siecle": ["throne", "palace", "cardinal", ["battle", "gun"], ["revolution"], ["throne", "sun"], "palace", "theatre", "siege", "monastery"],
    revolution: ["palace", "salon", "orders", "throne", "assembly", "revolution", "varennes", "valmy", ["revolution"], "napoleon"],
    empire: ["napoleon", "law", "books", ["coronation", "empire"], "snow", "exile", ["revolution", "notredame"], "factory", "assembly", "boulevard"],
    modernes: [["revolution", "notredame"], "books", "law", "boulevard", ["battle", "gun"], "market", ["battle", "gun"], "factory", "assembly", "boulevard"]
  };
  const EMBLEM = { modernes: ["boulevard"], gaule: ["surrender"], evangelisation: ["baptism"], carolingiens: ["coronation"], moines: ["scriptorium"], chevaliers: ["tournament"], croisades: ["crusade"], capetiens: ["cathedral"], renaissance: ["palace"], "grand-siecle": ["throne", "sun"], revolution: ["revolution"], empire: ["napoleon"] };
  const CAPTION = { baptism: "Le baptême", preaching: "La prédication", martyrs: "Les martyrs", charity: "Le manteau partagé", pilgrim: "Sur les routes", oak: "Le chêne abattu", schism: "La séparation", coronation: "Le sacre", throne: "À la cour", knighting: "L'adoubement", tournament: "Le tournoi", crusade: "La marche vers Jérusalem", council: "L'assemblée", siege: "Le siège", castle: "Le château fort", monastery: "L'abbaye", scriptorium: "Le scriptorium", monkwork: "Au travail des moines", cathedral: "Le chantier de la cathédrale", forge: "La forge gauloise", druids: "Le bois sacré", legion: "Les légions", surrender: "La reddition", aqueduct: "L'aqueduc romain", market: "Le marché", blason: "Les armoiries", books: "Les livres et le savoir", palace: "Le palais", theatre: "Le théâtre", revolution: "Le peuple se lève", valmy: "La victoire de Valmy", assembly: "L'assemblée", napoleon: "Le soleil d'Austerlitz", snow: "La retraite dans la neige", exile: "L'exil", factory: "L'âge industriel", salon: "Le salon des Lumières", cardinal: "Le cardinal", joan: "Jeanne et son étendard", archers: "La pluie de flèches", varennes: "La fuite de nuit", law: "Les lois", boulevard: "Le Paris moderne", orders: "Ceux qui prient, combattent, travaillent", troubadour: "Troubadours et légendes", hermit: "Au désert", mountain: "Le silence des montagnes", longship: "Les drakkars", ship: "La traversée", charge: "La charge", battle: "La bataille" };

  const pick = (spec) => (Array.isArray(spec) ? spec : [spec]);
  function keyFor(eraId, i) { const spec = pick((MAP[eraId] || [])[i] || EMBLEM[eraId] || ["battle"]); return spec[0]; }
  // Peintures réalistes (images IA) : numéro d'image (1 à 5) pour chacun des 10 niveaux d'une époque.
  const PHOTOS = {}; // images IA retirées : on garde les illustrations dessinées
  const photo = (eraId, n) => `<img class="photo" src="img/${eraId}-${n}.jpg" alt="" decoding="async">`;
  function situation(eraId, i, cls = "") {
    if (PHOTOS[eraId]) return photo(eraId, i == null ? 1 : PHOTOS[eraId][i] || 1);
    const spec = pick(i == null ? (EMBLEM[eraId] || ["battle"]) : (MAP[eraId] || [])[i] || EMBLEM[eraId] || ["battle"]);
    const fn = S[spec[0]] || S.battle;
    const n = ++uid;
    return `<svg class="scene ${cls}" viewBox="0 0 360 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${fn(n, spec[1])}</svg>`;
  }
  Art.situation = situation;
  Art.situationName = (eraId, i) => (PHOTOS[eraId] ? "" : CAPTION[keyFor(eraId, i)] || "");
  Art.situationKeys = () => Object.keys(S);
  Art._S = S;
})();
