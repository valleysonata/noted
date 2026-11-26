const fs = require('node:fs');

function loadBitmap(filename) {
  const buffer = fs.readFileSync(filename);
  if (buffer.length < 54 || buffer.toString('ascii', 0, 2) !== 'BM') {
    throw Error('Expected an uncompressed 24-bit or 32-bit BMP');
  }
  const width = buffer.readInt32LE(18);
  const signedHeight = buffer.readInt32LE(22);
  const height = Math.abs(signedHeight);
  const bytes = buffer.readUInt16LE(28) / 8;
  const start = buffer.readUInt32LE(10);
  const stride = Math.ceil(width * bytes / 4) * 4;
  if (buffer.readUInt32LE(14) < 40 || buffer.readUInt16LE(26) !== 1 ||
      buffer.readUInt32LE(30) !== 0 || ![3,4].includes(bytes) ||
      width < 4 || height < 4 || start < 54 || start + height * stride > buffer.length ||
      width * height > 24000000) throw Error('Invalid or unsupported BMP dimensions or encoding');
  const ink = new Float32Array(width * height);
  const sampleWidth = Math.min(120, Math.max(2, Math.floor(width / 4)));
  for (let y = 0; y < height; y++) {
    const row = start + (signedHeight > 0 ? height - 1 - y : y) * stride;
    let background = 0;
    for (let x = width - sampleWidth; x < width; x++) background += buffer[row + x * bytes];
    background /= sampleWidth;
    for (let x = 0; x < width; x++) ink[y * width + x] = Math.max(0, background - buffer[row + x * bytes]);
  }
  return {width, height, ink};
}

module.exports = {loadBitmap};
