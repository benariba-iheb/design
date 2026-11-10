import fs from 'fs';
import zlib from 'zlib';

function createPng(width, height, r, g, b) {
  // Signature
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type: 2 (RGB)
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  function makeChunk(type, data) {
    const len = data.length;
    const buf = Buffer.alloc(12 + len);
    buf.writeUInt32BE(len, 0);
    buf.write(type, 4);
    data.copy(buf, 8);
    // CRC
    let c = 0xffffffff;
    const typeAndData = buf.subarray(4, 8 + len);
    for (let i = 0; i < typeAndData.length; i++) {
      c ^= typeAndData[i];
      for (let k = 0; k < 8; k++) {
        c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
      }
    }
    buf.writeInt32BE(~c, 8 + len);
    return buf;
  }

  const ihdrChunk = makeChunk('IHDR', ihdr);

  // Raw image data: height scanlines, each (1 filter byte + width*3 bytes)
  const lineSize = 1 + width * 3;
  const raw = Buffer.alloc(height * lineSize);
  for (let y = 0; y < height; y++) {
    const offset = y * lineSize;
    raw[offset] = 0; // filter None
    for (let x = 0; x < width; x++) {
      // Draw background #0B1E26 (11, 30, 38)
      // And a centered stylized box with #E4FF3C (228, 255, 60)
      const px = offset + 1 + x * 3;
      const isInside = x > width * 0.2 && x < width * 0.8 && y > height * 0.2 && y < height * 0.8;
      const isCenter = x > width * 0.35 && x < width * 0.65 && y > height * 0.45 && y < height * 0.55;
      if (isCenter) {
        raw[px] = 61; raw[px+1] = 90; raw[px+2] = 254; // Blue
      } else if (isInside) {
        raw[px] = 228; raw[px+1] = 255; raw[px+2] = 60; // Citron
      } else {
        raw[px] = 11; raw[px+1] = 30; raw[px+2] = 38; // Petrole #0B1E26
      }
    }
  }

  const compressed = zlib.deflateSync(raw);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

if (!fs.existsSync('public')) {
  fs.mkdirSync('public');
}

fs.writeFileSync('public/pwa-192x192.png', createPng(192, 192, 11, 30, 38));
fs.writeFileSync('public/pwa-512x512.png', createPng(512, 512, 11, 30, 38));
fs.writeFileSync('public/apple-touch-icon.png', createPng(180, 180, 11, 30, 38));
fs.writeFileSync('public/favicon.ico', createPng(32, 32, 11, 30, 38));
console.log('Icons generated successfully');
