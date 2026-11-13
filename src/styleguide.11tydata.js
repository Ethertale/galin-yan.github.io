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
    { name: 'muted',     hex: '#6B6B6B', type: 'text',    role: 'Secondary text' },
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
    { name: 'muted',     hex: '#9A9A9A', type: 'text',    role: 'Secondary text' },
    { name: 'ink',       hex: '#F2F2F2', type: 'text',    role: 'Primary text' },
    { name: 'red',       hex: '#E8312A', type: 'text',    role: 'Path, accents, fills, large red' },
    { name: 'red-text',  hex: '#FF5247', type: 'text',    role: 'Small red text' },
    { name: 'red-hover', hex: '#FF6A60', type: 'text',    role: 'Hover and pressed' },
  ],
};

// Low-poly texture: a jittered point grid split into triangles, each a slightly different grey.
// Seeded, so the build output is the same every time.
function lowPoly(cols = 14, rows = 6, w = 1200, h = 400) {
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
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
        tris.push({ points: t.map((p) => p.join(',')).join(' '), o: (0.015 + rand() * 0.045).toFixed(3) });
      }
    }
  }
  return tris;
}

export default {
  palette,
  lowPoly: lowPoly(),
  chamfers: [0, 8, 12, 16],
};
