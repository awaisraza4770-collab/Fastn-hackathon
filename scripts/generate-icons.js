import fs from 'fs';
import zlib from 'zlib';
import path from 'path';

// Minimal standard PNG generator in pure Node.js
function crc32(buf) {
  let table = crc32.table;
  if (!table) {
    table = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let k = 0; k < 8; k++) {
        c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      }
      table[i] = c;
    }
    crc32.table = table;
  }
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ -1) >>> 0;
}

function makeChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const typeAndData = chunk.subarray(4, 8 + len);
  chunk.writeUInt32BE(crc32(typeAndData), 8 + len);
  return chunk;
}

function createPng(width, height, pixelFn) {
  const header = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // 8 bits per channel
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  const ihdrChunk = makeChunk('IHDR', ihdr);

  const scanlineLength = 1 + width * 4;
  const rawData = Buffer.alloc(height * scanlineLength);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * scanlineLength;
    rawData[rowOffset] = 0; // filter type 0: None
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const [r, g, b, a] = pixelFn(x, y, width, height);
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData, { level: 9 });
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([header, ihdrChunk, idatChunk, iendChunk]);
}

// Draw emerald rounded app icon with receipt motif
function iconRenderer(isMaskable) {
  return (x, y, w, h) => {
    const u = x / w;
    const v = y / h;
    const cx = 0.5, cy = 0.5;

    // Corner radius
    const radius = isMaskable ? 0 : 0.22;
    const dx = Math.max(Math.abs(u - cx) - (0.5 - radius), 0);
    const dy = Math.max(Math.abs(v - cy) - (0.5 - radius), 0);
    const distSq = dx * dx + dy * dy;

    if (!isMaskable && distSq > radius * radius) {
      return [0, 0, 0, 0]; // transparent outside rounded corner
    }

    // Gradient background: #059669 (emerald 600) to #064e3b (emerald 900)
    let bgR = Math.round(5 + (6 - 5) * v);
    let bgG = Math.round(150 - 72 * v);
    let bgB = Math.round(105 - 46 * v);

    // Safe zone padding for maskable
    const scale = isMaskable ? 0.75 : 0.82;
    const nu = (u - 0.5) / scale + 0.5;
    const nv = (v - 0.5) / scale + 0.5;

    // Receipt card bounds inside safe area
    const cardL = 0.28, cardR = 0.72, cardT = 0.22, cardB = 0.78;
    if (nu >= cardL && nu <= cardR && nv >= cardT && nv <= cardB) {
      // Bottom zig-zag pattern
      if (nv > 0.73) {
        const freq = 12;
        const wave = Math.abs(((nu - cardL) / (cardR - cardL) * freq) % 1 - 0.5) * 0.05;
        if (nv > 0.73 + wave) {
          return [bgR, bgG, bgB, 255];
        }
      }

      // Receipt card body: white / slight off-white
      let r = 255, g = 255, b = 255;

      // Header emerald tag
      if (nv >= 0.27 && nv <= 0.31 && nu >= 0.33 && nu <= 0.52) {
        return [5, 150, 105, 255];
      }
      if (nv >= 0.27 && nv <= 0.31 && nu >= 0.56 && nu <= 0.67) {
        return [203, 213, 225, 255];
      }

      // Horizontal receipt divider dashed
      if (nv >= 0.36 && nv <= 0.37) {
        return [148, 163, 184, 255];
      }

      // Line items
      if (nv >= 0.42 && nv <= 0.45 && ((nu >= 0.33 && nu <= 0.55) || (nu >= 0.61 && nu <= 0.67))) {
        return [100, 116, 139, 255];
      }
      if (nv >= 0.48 && nv <= 0.51 && ((nu >= 0.33 && nu <= 0.50) || (nu >= 0.60 && nu <= 0.67))) {
        return [100, 116, 139, 255];
      }
      if (nv >= 0.54 && nv <= 0.57 && ((nu >= 0.33 && nu <= 0.53) || (nu >= 0.59 && nu <= 0.67))) {
        return [100, 116, 139, 255];
      }

      // Total badge container
      if (nv >= 0.62 && nv <= 0.69 && nu >= 0.33 && nu <= 0.67) {
        return [236, 253, 245, 255]; // light emerald box
      }

      return [r, g, b, 255];
    }

    // Sparkle badge at top right: (nu: 0.72, nv: 0.22)
    const sDist = Math.sqrt((nu - 0.72) ** 2 + (nv - 0.22) ** 2);
    if (sDist <= 0.09) {
      if (sDist <= 0.08) {
        return [16, 185, 129, 255]; // emerald 500
      }
      return [255, 255, 255, 255]; // border
    }

    return [bgR, bgG, bgB, 255];
  };
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. pwa-192x192.png
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createPng(192, 192, iconRenderer(false)));
console.log('Created pwa-192x192.png');

// 2. pwa-512x512.png
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createPng(512, 512, iconRenderer(false)));
console.log('Created pwa-512x512.png');

// 3. pwa-maskable-512x512.png
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createPng(512, 512, iconRenderer(true)));
console.log('Created pwa-maskable-512x512.png');

// 4. apple-touch-icon.png (180x180)
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createPng(180, 180, iconRenderer(false)));
console.log('Created apple-touch-icon.png');
