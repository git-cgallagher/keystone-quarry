// Run with Electron (npm run build:icon). Draws the app icon, a crystal-ore block with a key cap on it, and writes:
//   build/icon.iconset/*.png (for iconutil → build/icon.icns) and build/icon.ico (PNG-in-ICO for Windows).
const { app, nativeImage } = require('electron');
const fs = require('fs');
const path = require('path');

// Same xorshift as the game so the block looks like the in-game one.
function rng(seed) { let s = (seed * 2654435761) >>> 0 || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }
const hex = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];

// 16x16 pixel art: amethyst rock + crystal veins + bevel, then a cream key cap with a "k" in the middle.
function art() {
  const r = rng(9), px = [];
  const base = ['#5b4a7a', '#6a5690', '#4e3f6a', '#735f9a'], gem = ['#62e6d4', '#a6fff2', '#3cc2b4'];
  for (let y = 0; y < 16; y++) { px.push([]); for (let x = 0; x < 16; x++) px[y].push(hex(base[Math.floor(r() * base.length)])); }
  for (const [cx, cy] of [[1, 1], [11, 2], [2, 11], [12, 11]]) for (const [dx, dy] of [[0, 0], [1, 0], [0, 1], [1, 1], [2, 1], [1, 2]]) px[cy + dy][cx + dx] = hex(gem[Math.floor(r() * gem.length)]);
  for (let i = 0; i < 16; i++) { px[0][i] = px[0][i].map(v => Math.min(255, v + 30)); px[i][0] = px[i][0].map(v => Math.min(255, v + 30)); px[15][i] = px[15][i].map(v => v * .7); px[i][15] = px[i][15].map(v => v * .7); }
  const cap = hex('#f4efe2'), shade = hex('#1d1a26'), ink = hex('#2a1d05');
  for (let y = 4; y < 13; y++) for (let x = 4; x < 13; x++) px[y][x] = shade;            // drop shadow
  for (let y = 3; y < 12; y++) for (let x = 3; x < 12; x++) px[y][x] = cap;              // key cap
  const K = ['x....', 'x..x.', 'x.x..', 'xx...', 'x.x..', 'x..x.'];                         // lowercase k
  K.forEach((row, j) => [...row].forEach((c, i) => { if (c === 'x') px[4 + j][5 + i] = ink; }));
  return px;
}

function render(px, size) {
  const buf = Buffer.alloc(size * size * 4);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const [R, G, B] = px[Math.floor(y * 16 / size)][Math.floor(x * 16 / size)], o = (y * size + x) * 4;
    buf[o] = B; buf[o + 1] = G; buf[o + 2] = R; buf[o + 3] = 255;                     // BGRA
  }
  return nativeImage.createFromBitmap(buf, { width: size, height: size }).toPNG();
}

app.whenReady().then(() => {
  const px = art(), dir = path.join(__dirname, '..', 'build'), set = path.join(dir, 'icon.iconset');
  fs.rmSync(set, { recursive: true, force: true });
  fs.mkdirSync(set, { recursive: true });
  for (const s of [16, 32, 128, 256, 512]) {
    fs.writeFileSync(path.join(set, `icon_${s}x${s}.png`), render(px, s));
    fs.writeFileSync(path.join(set, `icon_${s}x${s}@2x.png`), render(px, s * 2));
  }
  fs.writeFileSync(path.join(dir, 'icon.png'), render(px, 1024));
  // ICO with PNG payloads (Windows Vista+): 6-byte header, 16-byte entry per image, then the PNGs.
  const sizes = [16, 32, 48, 256], pngs = sizes.map(s => render(px, s));
  const head = Buffer.alloc(6 + 16 * sizes.length);
  head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(sizes.length, 4);
  let offset = head.length;
  sizes.forEach((s, i) => {
    const e = 6 + i * 16;
    head.writeUInt8(s === 256 ? 0 : s, e); head.writeUInt8(s === 256 ? 0 : s, e + 1);
    head.writeUInt16LE(1, e + 4); head.writeUInt16LE(32, e + 6);
    head.writeUInt32LE(pngs[i].length, e + 8); head.writeUInt32LE(offset, e + 12);
    offset += pngs[i].length;
  });
  fs.writeFileSync(path.join(dir, 'icon.ico'), Buffer.concat([head, ...pngs]));
  console.log('Wrote build/icon.iconset, build/icon.png and build/icon.ico');
  app.quit();
});
