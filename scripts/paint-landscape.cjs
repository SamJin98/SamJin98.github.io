// Paints the picture the whole site sits on, in thick, lit brush strokes:
//
//   sky-top   the top of the page: sky with a sun (a moon in the dark theme)
//   sky-tile  more sky, seamless top to bottom, repeated down the page
//   ground    the foot of the page: hills and a meadow (the home page draws
//             its descent path over the right-hand hill)
//
// each in a light and a dark palette. sky-top fades out at its bottom edge
// and ground fades in at its top, so both sit over the tile without a seam.
// Run by hand when the picture should change (needs Playwright's Chromium):
//
//   node scripts/paint-landscape.cjs
//
// It writes public/paint/<name>-<theme>.webp.
const { chromium } = require('playwright')
const sharp = require('sharp')
const path = require('path')
const fs = require('fs')

const W = 1800
const sizes = { 'sky-top': 720, 'sky-tile': 600, ground: 800 }

const themes = {
  light: {
    skyTop: '#e7dfcc',
    sky: '#f1d3ac',
    horizon: '#eeb28a',
    cloud: '#f9eedb',
    sun: '#f1b547',
    sunCore: '#f9d98a',
    hills: ['#b38d7c', '#c8934f', '#9d6a3a'],
    meadow: ['#6f7242', '#535a31'],
    relief: 0.42,
    jitter: 0.08
  },
  dark: {
    skyTop: '#141426',
    sky: '#231d30',
    horizon: '#6a3f38',
    cloud: '#3b2f44',
    sun: '#ecd6a4',
    sunCore: '#fbf0cf',
    hills: ['#2c2433', '#402d27', '#573b25'],
    meadow: ['#2b341e', '#1c2315'],
    relief: 0.6,
    jitter: 0.1
  }
}

const page = (t, kind, H) => `<!doctype html><body style="margin:0;background:transparent"><canvas id="c" width="${W}" height="${H}"></canvas><script>
const t = ${JSON.stringify(t)}, kind = ${JSON.stringify(kind)}, W = ${W}, H = ${H}, wrap = kind === 'sky-tile';
let seed = 42; const rnd = () => { seed = seed + 0x6D2B79F5 | 0; let x = Math.imul(seed ^ seed >>> 15, 1 | seed); x = x + Math.imul(x ^ x >>> 7, 61 | x) ^ x; return ((x ^ x >>> 14) >>> 0) / 4294967296; };
const G = 64, grid = Array.from({ length: G * G }, rnd);
const noise = (x, y) => { const xi = Math.floor(x), yi = Math.floor(y), fx = x - xi, fy = y - yi, s = v => v * v * (3 - 2 * v), a = (i, j) => grid[((j % G + G) % G) * G + ((i % G + G) % G)];
  const u = s(fx), v = s(fy); return (a(xi, yi) * (1 - u) + a(xi + 1, yi) * u) * (1 - v) + (a(xi, yi + 1) * (1 - u) + a(xi + 1, yi + 1) * u) * v; };
// Noise over the picture. On the tile it runs around a circle in y, so the
// top row meets the bottom row.
const field = (x, y, scale, off) => { if (!wrap) return noise(x / scale + off, y / scale * 1.3); const a = y / H * Math.PI * 2, r = H / scale / 4.4; return noise(x / scale + off + Math.cos(a) * r, 20 + off + Math.sin(a) * r); };
const g = (x, m, s) => Math.exp(-((x - m) ** 2) / (2 * s * s));
// Ridge lines of the ground picture, as height from the bottom (0..1)
const hills = [
  x => 0.46 + 0.13 * g(x, 0.86, 0.17) + 0.06 * g(x, 0.12, 0.12),
  x => 0.38 + 0.15 * g(x, 0.5, 0.15) + 0.07 * g(x, 1.0, 0.1),
  x => 0.29 + 0.19 * g(x, 0.82, 0.13) + 0.05 * g(x, 0.2, 0.14)
];
const meadowTop = x => 0.24 + 0.02 * Math.sin(x * 9) + 0.012 * Math.sin(x * 23 + 1);
const SUN = [W * 0.545, H * 0.2, 74];

// 1. Flat picture to sample colours from
const src = document.createElement('canvas'); src.width = W; src.height = H; const s = src.getContext('2d');
const grad = (y0, y1, a, b) => { const q = s.createLinearGradient(0, y0, 0, y1); q.addColorStop(0, a); q.addColorStop(1, b); return q; };
s.fillStyle = kind === 'sky-top' ? grad(0, H * 0.8, t.skyTop, t.sky) : kind === 'ground' ? grad(H * 0.2, H * 0.6, t.sky, t.horizon) : t.sky; s.fillRect(0, 0, W, H);
const clouds = kind === 'sky-top' ? [[0.3, 0.3, 250, 15], [0.52, 0.5, 200, 12], [0.12, 0.62, 170, 10], [0.7, 0.72, 210, 12]] : kind === 'sky-tile' ? [[0.22, 0.3, 210, 12], [0.76, 0.62, 230, 13]] : [];
s.fillStyle = t.cloud; clouds.forEach(([x, y, rx, ry]) => { s.beginPath(); s.ellipse(x * W, y * H, rx, ry, 0, 0, 7); s.fill(); });
if (kind === 'sky-top') { const sun = s.createRadialGradient(SUN[0] - 18, SUN[1] - 18, 6, SUN[0], SUN[1], SUN[2]); sun.addColorStop(0, t.sunCore); sun.addColorStop(1, t.sun); s.fillStyle = sun; s.beginPath(); s.arc(SUN[0], SUN[1], SUN[2], 0, 7); s.fill(); }
if (kind === 'ground') {
  const fill = (f, colour) => { s.fillStyle = colour; s.beginPath(); s.moveTo(0, H); for (let x = 0; x <= W; x += 8) s.lineTo(x, H - f(x / W) * H); s.lineTo(W, H); s.fill(); };
  hills.forEach((f, i) => fill(f, t.hills[i])); fill(meadowTop, grad(H * 0.76, H, t.meadow[0], t.meadow[1]));
}
const px = s.getImageData(0, 0, W, H).data;

const zone = (x, y) => { if (kind === 'ground') { if (y > H - meadowTop(x / W) * H) return 'meadow'; let L = -1; hills.forEach((f, i) => { if (y > H - f(x / W) * H) L = i; }); if (L >= 0) return L; }
  return kind === 'sky-top' && Math.hypot(x - SUN[0], y - SUN[1]) < SUN[2] + 4 ? 'sun' : 'sky'; };
const slope = (f, x) => Math.atan2(-(f((x + 6) / W) - f((x - 6) / W)) * H, 12);

// 2. Brush strokes onto a colour canvas and, in step, a height canvas that
//    records how thick the paint is, so it can be lit afterwards.
const c = document.getElementById('c').getContext('2d'); c.lineCap = 'round';
const hc = document.createElement('canvas'); hc.width = W; hc.height = H; const hx = hc.getContext('2d'); hx.lineCap = 'round'; hx.fillStyle = '#808080'; hx.fillRect(0, 0, W, H);
const line = (q, ax, ay, bx, by, ex, ey) => { for (const o of wrap ? [-H, 0, H] : [0]) { q.beginPath(); q.moveTo(ax, ay + o); q.quadraticCurveTo(bx, by + o, ex, ey + o); q.stroke(); } };
const stroke = (x, y, len, wid) => {
  const xi = Math.min(W - 1, Math.max(0, x | 0)), yi = Math.min(H - 1, Math.max(0, y | 0)), k = (yi * W + xi) * 4, z = zone(x, y);
  let ang, curl = 0;
  if (z === 'meadow') { ang = -Math.PI / 2 + (rnd() - .5) * .35; len *= .55; wid *= .7; }
  else if (z === 'sun') { ang = Math.atan2(y - SUN[1], x - SUN[0]) + 1.57; curl = .5; len *= .6; }
  else if (z === 'sky') { ang = (field(x, y, 210, 0) - .5) * 5.2; curl = (field(x, y, 120, 7) - .5) * 1.6; len *= 1.25; }
  else { ang = slope(hills[z], x) * .9 + (noise(x / 100, y / 100) - .5) * .8; curl = (rnd() - .5) * .5; }
  const j = 1 + (rnd() - .5) * 2 * t.jitter + (field(x, y, 170, 9) - .5) * t.jitter * 2.6;
  const col = [0, 1, 2].map(n => Math.max(0, Math.min(255, px[k + n] * j)));
  const dx = Math.cos(ang), dy = Math.sin(ang), nx = -dy, ny = dx, bristles = Math.max(3, wid / 2.4 | 0);
  for (let b = 0; b < bristles; b++) { const o = (b / (bristles - 1) - .5) * wid, sh = 1 + (rnd() - .5) * .09, l2 = len * (.8 + rnd() * .4), bow = curl * l2 * .35;
    const ax = x + nx * o - dx * l2 / 2, ay = y + ny * o - dy * l2 / 2, bx = x + nx * (o + bow), by = y + ny * (o + bow), ex = x + nx * o + dx * l2 / 2, ey = y + ny * o + dy * l2 / 2, lw = wid / bristles * 1.5;
    c.strokeStyle = 'rgba(' + col.map(v => Math.min(255, v * sh) | 0).join(',') + ',' + (.6 + rnd() * .38) + ')'; c.lineWidth = lw; line(c, ax, ay, bx, by, ex, ey);
    // ridges between bristles: alternate high and low
    const lvl = 128 + (b % 2 ? 1 : -1) * (26 + rnd() * 50) | 0; hx.strokeStyle = 'rgba(' + lvl + ',' + lvl + ',' + lvl + ',.85)'; hx.lineWidth = lw; line(hx, ax, ay, bx, by, ex, ey); }
};
const area = W * H / (1800 * 900), pad = wrap ? 0 : 50;
[[2600, 190, 52], [5200, 120, 30], [11000, 64, 15], [12000, 30, 7]].forEach(([n, len, wid]) => { for (let i = 0; i < n * area; i++) stroke(rnd() * (W + 100) - 50, rnd() * (H + pad * 2) - pad, len, wid); });

// 3. Light the paint from the top left using the height canvas
const blur = document.createElement('canvas'); blur.width = W; blur.height = H; const bq = blur.getContext('2d'); bq.filter = 'blur(1.1px)'; bq.drawImage(hc, 0, 0);
const hd = bq.getImageData(0, 0, W, H).data, m = c.getImageData(0, 0, W, H), d = m.data;
const at = (x, y) => hd[(((y + H) % H) * W + Math.min(W - 1, Math.max(0, x))) * 4];
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const k = (y * W + x) * 4;
  const e = (wrap ? at(x - 1, y - 1) - at(x + 1, y + 1) : (y > 0 && y < H - 1 ? at(x - 1, y - 1) - at(x + 1, y + 1) : 0)) / 255; // + faces the light
  const l = 1 + Math.max(-.5, Math.min(.5, e * 2.2)) * t.relief + (rnd() - .5) * .035;
  d[k] = Math.min(255, d[k] * l); d[k + 1] = Math.min(255, d[k + 1] * l); d[k + 2] = Math.min(255, d[k + 2] * l); }

// 4. Fade the edge that meets the tile, raggedly, like paint thinning out
if (!wrap) for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const from = kind === 'sky-top' ? H - 1 - y : y, n = noise(x / 90, y / 60) * 70;
  const a = Math.max(0, Math.min(1, (from - 10 - n) / 130)); d[(y * W + x) * 4 + 3] = 255 * a * a * (3 - 2 * a); }
c.putImageData(m, 0, 0);
document.title = 'done';
</script></body>`

;(async () => {
  const out = path.join(__dirname, '..', 'public', 'paint')
  fs.mkdirSync(out, { recursive: true })
  const browser = await chromium.launch()
  for (const theme of Object.keys(themes))
    for (const kind of Object.keys(sizes)) {
      const H = sizes[kind]
      const tab = await browser.newPage({ viewport: { width: W, height: H } })
      tab.on('pageerror', e => console.log('ERR', e.message))
      await tab.setContent(page(themes[theme], kind, H))
      await tab.waitForFunction(() => document.title === 'done', null, { timeout: 120000 })
      const png = await tab.screenshot({ omitBackground: true })
      await sharp(png).webp({ quality: 80, alphaQuality: 90 }).toFile(path.join(out, `${kind}-${theme}.webp`))
      if (process.env.PREVIEW) await sharp(png).toFile(path.join(process.env.PREVIEW, `paint-${kind}-${theme}.png`))
      await tab.close()
    }
  await browser.close()
})()
