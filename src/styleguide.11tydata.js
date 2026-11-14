// Data for the style tile (src/styleguide.njk), roadmap 1.3.0.
// The palette here is the DRAFT design system: the tile renders its swatches, CSS variables and
// contrast ratios from it. Once approved, step 1.3.1 promotes these values to css/main.css.

// type: 'surface' (backgrounds), 'line' (hairlines, never text), 'text' (checked for AA contrast)
const palette = {
  light: [
    { name: 'white',     hex: '#FAFAFA', type: 'surface', role: 'Daylight base' },
    { name: 'panel',     hex: '#FFFFFF', type: 'surface', role: 'Plinths and cards (brighter = "lit")' },
    { name: 'off',       hex: '#F2F1EF', type: 'surface', role: 'Alternate section' },
    { name: 'line',      hex: '#D8D8D5', type: 'line',    role: 'Hairlines only, never text' },
    { name: 'muted',     hex: '#6B6B6B', type: 'text',    role: 'Meta text: stamps, arrows, placeholders' },
    { name: 'mid',       hex: '#4A4A4A', type: 'text',    role: 'Secondary text' },
    { name: 'ink',       hex: '#141414', type: 'text',    role: 'Primary text' },
    { name: 'red',       hex: '#E8312A', type: 'text',    role: 'Path, accents, fills, large red' },
    { name: 'red-text',  hex: '#C62A23', type: 'text',    role: 'Small red text' },
    { name: 'red-hover', hex: '#B8221C', type: 'text',    role: 'Hover and pressed' },
  ],
  // "Black DORFic": same red, inverted neutrals. Small red text needs a lighter red on black.
  dark: [
    { name: 'white',     hex: '#0E0E0E', type: 'surface', role: 'Base' },
    { name: 'panel',     hex: '#161616', type: 'surface', role: 'Plinths and cards' },
    { name: 'off',       hex: '#121212', type: 'surface', role: 'Alternate section' },
    { name: 'line',      hex: '#2C2C2A', type: 'line',    role: 'Hairlines only, never text' },
    { name: 'muted',     hex: '#9A9A9A', type: 'text',    role: 'Meta text: stamps, arrows, placeholders' },
    { name: 'mid',       hex: '#C4C4C4', type: 'text',    role: 'Secondary text' },
    { name: 'ink',       hex: '#F2F2F2', type: 'text',    role: 'Primary text' },
    { name: 'red',       hex: '#E8312A', type: 'text',    role: 'Path, accents, fills, large red' },
    { name: 'red-text',  hex: '#FF5247', type: 'text',    role: 'Small red text' },
    { name: 'red-hover', hex: '#FF6A60', type: 'text',    role: 'Hover and pressed' },
  ],
};

// Seeded random (Park-Miller), so the build output is the same every time.
const seeded = (seed) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

// Low-poly texture: a jittered point grid split into triangles, each a slightly different grey.
// light > 0 adds a left-to-right lighting ramp, so facets read as one lit surface, not noise.
function lowPoly(cols = 14, rows = 6, w = 1200, h = 400, light = 0) {
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

// Hex texture: pointy-top honeycomb cells of radius r, filled like the low-poly facets.
function hexGrid(r = 30, w = 1200, h = 480, light = 0) {
  const rand = seeded(11);
  const hw = Math.sqrt(3) * r;  // cell width
  const cells = [];
  for (let row = -1; row * 1.5 * r < h + r * 2; row++) {
    const y = row * 1.5 * r;
    for (let x = (row % 2 ? hw / 2 : 0) - hw; x < w + hw; x += hw) {
      const pts = [0, 1, 2, 3, 4, 5].map((i) => {
        const a = (Math.PI / 3) * i - Math.PI / 2;
        return [(x + r * Math.cos(a)).toFixed(1), (y + r * Math.sin(a)).toFixed(1)].join(',');
      });
      cells.push({ points: pts.join(' '), o: (0.01 + rand() * 0.045 + light * (x / w)).toFixed(3) });
    }
  }
  return cells;
}

export default {
  palette,
  lowPoly: lowPoly(),
  // Hero-sized samples for decision 2 (same size, same lighting, so they compare fairly).
  heroPoly: lowPoly(16, 7, 1200, 480, 0.04),
  heroHex: hexGrid(30, 1200, 480, 0.04),
  chamfers: [0, 8, 12, 16],
  // Approved 2026-11-14: 1 = 12px, 3 = triple line (D), 4 = yes, 5 = Unbounded BG-only, 6 = Sofia Sans.
  chosenChamfer: 12,
};
