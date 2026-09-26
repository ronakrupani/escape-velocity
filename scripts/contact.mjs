// Compose screenshots into one labelled contact sheet.
// Usage: node scripts/contact.mjs out.png cols file1.png file2.png ...
import sharp from 'sharp';
const [out, colsArg, ...files] = process.argv.slice(2);
const cols = +colsArg || 4;
const W = 480, H = 300, PAD = 6;
const rows = Math.ceil(files.length / cols);
const tiles = await Promise.all(files.map(async (f, i) => {
  const label = f.split('/').pop().replace('.png', '');
  const img = await sharp(f).resize(W, H).composite([{ input: Buffer.from(`<svg width="${W}" height="${H}"><rect x="0" y="0" width="${label.length * 9 + 12}" height="22" fill="black" fill-opacity="0.7"/><text x="6" y="16" font-family="Menlo" font-size="14" fill="#FF6B2C">${label}</text></svg>`), top: 0, left: 0 }]).png().toBuffer();
  return { input: img, left: PAD + (i % cols) * (W + PAD), top: PAD + Math.floor(i / cols) * (H + PAD) };
}));
await sharp({ create: { width: PAD + cols * (W + PAD), height: PAD + rows * (H + PAD), channels: 3, background: '#111' } }).composite(tiles).png().toFile(out);
console.log('wrote', out);
