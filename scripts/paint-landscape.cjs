// Paints the home page's hero picture: a thick, brushy loss landscape with a
// gradient-descent path, in a light and a dark palette. Run by hand when the
// picture should change (needs Playwright with Chromium):
//
//   node scripts/paint-landscape.cjs
//
// It writes public/landscape-light.webp and public/landscape-dark.webp.
const { chromium } = require('playwright')
const sharp = require('sharp')
const path = require('path')

const W = 1800
const H = 900

const themes = {
  light: {
    sky: ['#e6dcc6', '#f1cfa6', '#eeb28a'],
    cloud: '#f8ecd8',
    sun: '#f1b547',
    sunCore: '#f9d98a',
    hills: ['#b38d7c', '#c8934f', '#9d6a3a'],
    meadow: ['#6f7242', '#535a31'],
    dot: '#2d2a26',
    relief: 0.42,
    jitter: 0.08
  },
  dark: {
    sky: ['#17172a', '#2e2436', '#6a3f38'],
    cloud: '#3b2f44',
    sun: '#ecd6a4',
    sunCore: '#fbf0cf',
    hills: ['#2c2433', '#402d27', '#573b25'],
    meadow: ['#2b341e', '#1c2315'],
    dot: '#f4efe6',
    relief: 0.6,
    jitter: 0.1
  }
}

const page = t => `<!doctype html><body style="margin:0;background:transparent"><canvas id="c" width="${W}" height="${H}"></canvas><script>
const t = ${JSON.stringify(t)}, W = ${W}, H = ${H};
let seed = 42; const rnd = () => { seed = seed + 0x6D2B79F5 | 0; let x = Math.imul(seed ^ seed >>> 15, 1 | seed); x = x + Math.imul(x ^ x >>> 7, 61 | x) ^ x; return ((x ^ x >>> 14) >>> 0) / 4294967296; };
const G = 64, grid = Array.from({ length: G * G }, rnd);
const noise = (x, y) => { const xi = Math.floor(x), yi = Math.floor(y), fx = x - xi, fy = y - yi, s = v => v * v * (3 - 2 * v), a = (i, j) => grid[((j % G + G) % G) * G + ((i % G + G) % G)];
  const u = s(fx), v = s(fy); return (a(xi, yi) * (1 - u) + a(xi + 1, yi) * u) * (1 - v) + (a(xi, yi + 1) * (1 - u) + a(xi + 1, yi + 1) * u) * v; };
const g = (x, m, s) => Math.exp(-((x - m) ** 2) / (2 * s * s));
// Ridge lines, as height from the bottom (0..1) over x (0..1)
const hills = [
  x => 0.50 + 0.15 * g(x, 0.86, 0.17) + 0.07 * g(x, 0.12, 0.12),
  x => 0.42 + 0.17 * g(x, 0.52, 0.15) + 0.08 * g(x, 1.0, 0.1),
  x => 0.33 + 0.19 * g(x, 0.84, 0.13) + 0.05 * g(x, 0.2, 0.14)
];
const meadowTop = x => 0.3 + 0.025 * Math.sin(x * 9) + 0.015 * Math.sin(x * 23 + 1);
const SUN = [W * 0.66, H * 0.3, 70];

// 1. Flat picture to sample colours from
const src = document.createElement('canvas'); src.width = W; src.height = H; const s = src.getContext('2d');
const sky = s.createLinearGradient(0, 0, 0, H * 0.62); t.sky.forEach((c, i) => sky.addColorStop(i / (t.sky.length - 1), c)); s.fillStyle = sky; s.fillRect(0, 0, W, H);
s.fillStyle = t.cloud; [[0.36, 0.2, 260, 16], [0.5, 0.26, 190, 12], [0.84, 0.13, 220, 14], [0.2, 0.36, 180, 10]].forEach(([x, y, rx, ry]) => { s.beginPath(); s.ellipse(x * W, y * H, rx, ry, 0, 0, 7); s.fill(); });
const sun = s.createRadialGradient(SUN[0] - 16, SUN[1] - 16, 6, SUN[0], SUN[1], SUN[2]); sun.addColorStop(0, t.sunCore); sun.addColorStop(1, t.sun); s.fillStyle = sun; s.beginPath(); s.arc(SUN[0], SUN[1], SUN[2], 0, 7); s.fill();
const fill = (f, colour) => { s.fillStyle = colour; s.beginPath(); s.moveTo(0, H); for (let x = 0; x <= W; x += 8) s.lineTo(x, H - f(x / W) * H); s.lineTo(W, H); s.fill(); };
hills.forEach((f, i) => fill(f, t.hills[i]));
const mg = s.createLinearGradient(0, H * 0.7, 0, H); mg.addColorStop(0, t.meadow[0]); mg.addColorStop(1, t.meadow[1]); fill(meadowTop, mg);
const px = s.getImageData(0, 0, W, H).data;

const zone = (x, y) => { if (y > H - meadowTop(x / W) * H) return 'meadow'; let L = -1; hills.forEach((f, i) => { if (y > H - f(x / W) * H) L = i; }); if (L >= 0) return L; return Math.hypot(x - SUN[0], y - SUN[1]) < SUN[2] + 4 ? 'sun' : 'sky'; };
const slope = (f, x) => Math.atan2(-(f((x + 6) / W) - f((x - 6) / W)) * H, 12);

// 2. Brush strokes onto a colour canvas and, in step, a height canvas that
//    records how thick the paint is, so it can be lit afterwards.
const c = document.getElementById('c').getContext('2d'); c.lineCap = 'round';
const hc = document.createElement('canvas'); hc.width = W; hc.height = H; const hx = hc.getContext('2d'); hx.lineCap = 'round'; hx.fillStyle = '#808080'; hx.fillRect(0, 0, W, H);
const stroke = (x, y, len, wid) => {
  const xi = Math.min(W - 1, Math.max(0, x | 0)), yi = Math.min(H - 1, Math.max(0, y | 0)), k = (yi * W + xi) * 4, z = zone(x, y);
  let ang, curl = 0;
  if (z === 'meadow') { ang = -Math.PI / 2 + (rnd() - .5) * .35; len *= .55; wid *= .7; }
  else if (z === 'sun') { ang = Math.atan2(y - SUN[1], x - SUN[0]) + 1.57; curl = .5; len *= .6; }
  else if (z === 'sky') { ang = (noise(x / 210, y / 150) - .5) * 5.2; curl = (noise(x / 120 + 7, y / 120) - .5) * 1.6; len *= 1.25; }
  else { ang = slope(hills[z], x) * .9 + (noise(x / 100, y / 100) - .5) * .8; curl = (rnd() - .5) * .5; }
  const j = 1 + (rnd() - .5) * 2 * t.jitter + (noise(x / 170 + 9, y / 170) - .5) * t.jitter * 2.6;
  const col = [0, 1, 2].map(n => Math.max(0, Math.min(255, px[k + n] * j)));
  const dx = Math.cos(ang), dy = Math.sin(ang), nx = -dy, ny = dx, bristles = Math.max(3, wid / 2.4 | 0);
  for (let b = 0; b < bristles; b++) { const o = (b / (bristles - 1) - .5) * wid, sh = 1 + (rnd() - .5) * .09, l2 = len * (.8 + rnd() * .4), bow = curl * l2 * .35;
    const ax = x + nx * o - dx * l2 / 2, ay = y + ny * o - dy * l2 / 2, bx = x + nx * (o + bow) , by = y + ny * (o + bow), ex = x + nx * o + dx * l2 / 2, ey = y + ny * o + dy * l2 / 2, lw = wid / bristles * 1.5;
    c.strokeStyle = 'rgba(' + col.map(v => Math.min(255, v * sh) | 0).join(',') + ',' + (.6 + rnd() * .38) + ')'; c.lineWidth = lw;
    c.beginPath(); c.moveTo(ax, ay); c.quadraticCurveTo(bx, by, ex, ey); c.stroke();
    // ridges between bristles: alternate high and low
    const lvl = 128 + (b % 2 ? 1 : -1) * (26 + rnd() * 50) | 0; hx.strokeStyle = 'rgba(' + lvl + ',' + lvl + ',' + lvl + ',.85)'; hx.lineWidth = lw;
    hx.beginPath(); hx.moveTo(ax, ay); hx.quadraticCurveTo(bx, by, ex, ey); hx.stroke(); }
};
[[2600, 190, 52], [5200, 120, 30], [11000, 64, 15], [12000, 30, 7]].forEach(([n, len, wid]) => { for (let i = 0; i < n; i++) stroke(rnd() * (W + 100) - 50, rnd() * (H + 100) - 50, len, wid); });

// 3. Gradient descent, dabbed on top: down the right hill into the valley
c.fillStyle = t.dot; hx.fillStyle = '#f0f0f0';
const f3 = hills[2];
for (let i = 0; i <= 9; i++) { const x = 0.84 - 0.017 * i * (1 + i * 0.1), last = i === 9, r = last ? 10 : 4.6, cx = x * W, cy = H - f3(x) * H - 14;
  [c, hx].forEach(q => { q.beginPath(); q.arc(cx, cy, r, 0, 7); q.fill(); }); }

// 4. Light the paint from the top left using the height canvas
const blur = document.createElement('canvas'); blur.width = W; blur.height = H; const bq = blur.getContext('2d'); bq.filter = 'blur(1.1px)'; bq.drawImage(hc, 0, 0);
const hd = bq.getImageData(0, 0, W, H).data, m = c.getImageData(0, 0, W, H), d = m.data;
for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) { const k = (y * W + x) * 4;
  const e = (hd[k - (W + 1) * 4] - hd[k + (W + 1) * 4]) / 255; // + faces the light
  const l = 1 + Math.max(-.5, Math.min(.5, e * 2.2)) * t.relief + (rnd() - .5) * .035;
  d[k] = Math.min(255, d[k] * l); d[k + 1] = Math.min(255, d[k + 1] * l); d[k + 2] = Math.min(255, d[k + 2] * l); }

// 5. A ragged edge, as if the paint stops short of the frame
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const edge = Math.min(x, y, W - 1 - x, H - 1 - y), n = noise(x / 34, y / 34) * 16 + noise(x / 9, y / 9) * 6;
  const a = Math.max(0, Math.min(1, (edge - 3 - n) / 2.5)); d[(y * W + x) * 4 + 3] = 255 * a; }
c.putImageData(m, 0, 0);
document.title = 'done';
</script></body>`

;(async () => {
  const browser = await chromium.launch()
  for (const name of Object.keys(themes)) {
    const tab = await browser.newPage({ viewport: { width: W, height: H } })
    tab.on('pageerror', e => console.log('ERR', e.message))
    await tab.setContent(page(themes[name]))
    await tab.waitForFunction(() => document.title === 'done', null, { timeout: 120000 })
    const png = await tab.screenshot({ omitBackground: true })
    await sharp(png).webp({ quality: 84, alphaQuality: 90 }).toFile(path.join(__dirname, '..', 'public', `landscape-${name}.webp`))
    if (process.env.PREVIEW) await sharp(png).toFile(path.join(process.env.PREVIEW, `paint-${name}.png`))
    await tab.close()
  }
  await browser.close()
})()
