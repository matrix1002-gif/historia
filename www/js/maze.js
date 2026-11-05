/* Historia — générateur du Labyrinthe du Temps.
   Produit une carte de (2W+1) × (2H+1) cases : mur ou sol, avec la clé, la sortie, des portes et des gardes.
   La carte est toujours résoluble : tous les obstacles s'ouvrent en répondant à une question. */
(function (root) {
  "use strict";

  function generate(rnd, W, H, nObs) {
    W = W || 5; H = H || 5; nObs = nObs || 8;
    const w = 2 * W + 1, h = 2 * H + 1;
    const g = [];
    for (let y = 0; y < h; y++) { g.push([]); for (let x = 0; x < w; x++) g[y].push({ t: 0, o: null }); }
    // Labyrinthe parfait par parcours en profondeur.
    const seen = Array.from({ length: H }, () => new Array(W).fill(false));
    const stack = [[0, 0]];
    seen[0][0] = true;
    g[1][1].t = 1;
    while (stack.length) {
      const [cx, cy] = stack[stack.length - 1];
      const nb = [[1, 0], [-1, 0], [0, 1], [0, -1]]
        .map(([dx, dy]) => [cx + dx, cy + dy, dx, dy])
        .filter(([nx, ny]) => nx >= 0 && ny >= 0 && nx < W && ny < H && !seen[ny][nx]);
      if (!nb.length) { stack.pop(); continue; }
      const [nx, ny, dx, dy] = nb[Math.floor(rnd() * nb.length)];
      seen[ny][nx] = true;
      g[2 * cy + 1 + dy][2 * cx + 1 + dx].t = 1;
      g[2 * ny + 1][2 * nx + 1].t = 1;
      stack.push([nx, ny]);
    }
    const open = (x, y) => x >= 0 && y >= 0 && x < w && y < h && g[y][x].t === 1;
    const neigh = (x, y) => [[1, 0], [-1, 0], [0, 1], [0, -1]].filter(([dx, dy]) => open(x + dx, y + dy)).map(([dx, dy]) => [x + dx, y + dy]);
    const bfs = (sx, sy) => {
      const d = Array.from({ length: h }, () => new Array(w).fill(-1));
      const prev = Array.from({ length: h }, () => new Array(w).fill(null));
      d[sy][sx] = 0;
      const q = [[sx, sy]];
      for (let i = 0; i < q.length; i++) {
        const [x, y] = q[i];
        neigh(x, y).forEach(([nx, ny]) => { if (d[ny][nx] < 0) { d[ny][nx] = d[y][x] + 1; prev[ny][nx] = [x, y]; q.push([nx, ny]); } });
      }
      return { d, prev, order: q };
    };
    const start = { x: 1, y: 1 };
    const fromStart = bfs(1, 1);
    // Sortie : la case la plus éloignée du départ.
    const exit = fromStart.order[fromStart.order.length - 1];
    g[exit[1]][exit[0]].o = "exit";
    // Clé : une impasse éloignée du départ et de la sortie, loin de ces deux points.
    const fromExit = bfs(exit[0], exit[1]);
    let best = null, bestScore = -1;
    fromStart.order.forEach(([x, y]) => {
      if ((x === 1 && y === 1) || (x === exit[0] && y === exit[1])) return;
      const dead = neigh(x, y).length === 1 ? 1 : 0;
      const score = Math.min(fromStart.d[y][x], fromExit.d[y][x]) + dead * 3 + rnd();
      if (score > bestScore) { bestScore = score; best = [x, y]; }
    });
    g[best[1]][best[0]].o = "key";
    // Chemins utiles : départ → clé, clé → sortie.
    const pathTo = (bf, tx, ty) => { const p = []; let c = [tx, ty]; while (c) { p.push(c); c = bf.prev[c[1]][c[0]]; } return p.reverse(); };
    const fromKey = bfs(best[0], best[1]);
    const mainPath = pathTo(fromStart, best[0], best[1]).concat(pathTo(fromKey, exit[0], exit[1]).slice(1));
    const free = (x, y) => !g[y][x].o && !(x === 1 && y === 1);
    const straight = (x, y) => (open(x - 1, y) && open(x + 1, y) && !open(x, y - 1) && !open(x, y + 1)) || (open(x, y - 1) && open(x, y + 1) && !open(x - 1, y) && !open(x + 1, y));
    const place = (x, y) => { g[y][x].o = straight(x, y) && rnd() < 0.6 ? "door" : "guard"; };
    // Au moins cinq obstacles sur le chemin principal, le reste ailleurs.
    const onPath = mainPath.filter(([x, y]) => free(x, y) && d1(x, y) > 1);
    function d1(x, y) { return Math.abs(x - 1) + Math.abs(y - 1); }
    const picks = [];
    const spread = Math.min(5, Math.floor(onPath.length / 3));
    for (let i = 0; i < spread; i++) {
      const lo = Math.floor((onPath.length * i) / spread), hi = Math.floor((onPath.length * (i + 1)) / spread);
      const c = onPath[lo + Math.floor(rnd() * Math.max(1, hi - lo))];
      if (c && free(c[0], c[1])) { picks.push(c); place(c[0], c[1]); }
    }
    const others = fromStart.order.filter(([x, y]) => free(x, y) && d1(x, y) > 2);
    while (picks.length < nObs && others.length) {
      const i = Math.floor(rnd() * others.length);
      const [x, y] = others.splice(i, 1)[0];
      if (!free(x, y)) continue;
      place(x, y);
      picks.push([x, y]);
    }
    return { w, h, grid: g, start, exit: { x: exit[0], y: exit[1] }, key: { x: best[0], y: best[1] }, obstacles: picks.length };
  }

  const api = { generate };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.HistoriaMaze = api;
})(typeof window !== "undefined" ? window : globalThis);
