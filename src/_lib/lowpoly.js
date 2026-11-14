// Low-poly texture (approved in the style tile, decision 2): a jittered point grid split into
// triangles, each a slightly different grey. Seeded, so every build produces the same file.
// Used by the page-frame texture (src/texture.njk) and the style tile (src/styleguide.11tydata.js).

// Park-Miller random numbers from a fixed seed.
export const seeded = (seed) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

// light > 0 adds a left-to-right lighting ramp, so the facets read as one lit surface, not noise.
export function lowPoly(cols = 14, rows = 6, w = 1200, h = 400, light = 0) {
  const rand = seeded(7);
  const pts = [];
  for (let r = 0; r <= rows; r++) {
    pts.push([]);
    for (let c = 0; c <= cols; c++) {
      const edge = r === 0 || c === 0 || r === rows || c === cols;
      const jx = edge ? 0 : (rand() - 0.5) * (w / cols) * 0.7;
      const jy = edge ? 0 : (rand() - 0.5) * (h / rows) * 0.7;
      pts[r].push([Math.round((c * w) / cols + jx), Math.round((r * h) / rows + jy)]);
    }
  }
  const tris = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const [a, b, d, e] = [pts[r][c], pts[r][c + 1], pts[r + 1][c], pts[r + 1][c + 1]];
      for (const t of rand() > 0.5 ? [[a, b, e], [a, e, d]] : [[a, b, d], [b, e, d]]) {
        const cx = (t[0][0] + t[1][0] + t[2][0]) / 3;
        tris.push({ points: t.map((p) => p.join(',')).join(' '), o: (0.015 + rand() * 0.045 + light * (cx / w)).toFixed(3) });
      }
    }
  }
  return tris;
}
