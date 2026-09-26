// Downloads Solar System Scope textures (CC BY 4.0, https://www.solarsystemscope.com/textures/)
// and converts them to optimized WebP in public/textures. Run: node scripts/fetch-textures.mjs
import { mkdir, writeFile, access } from 'node:fs/promises';
import sharp from 'sharp';

const BASE = 'https://www.solarsystemscope.com/textures/download/';
const CACHE = '.cache/tex/';
const OUT = 'public/textures/';

// [source file, output name, width, extra options]
const JOBS = [
  ['8k_earth_daymap.jpg', 'earth_day', 4096],
  ['8k_earth_daymap.jpg', 'earth_day_2k', 2048],
  ['8k_earth_nightmap.jpg', 'earth_night', 4096],
  ['8k_earth_nightmap.jpg', 'earth_night_2k', 2048],
  ['8k_earth_clouds.jpg', 'earth_clouds', 4096, { grayscale: true }],
  ['8k_earth_clouds.jpg', 'earth_clouds_2k', 2048, { grayscale: true }],
  ['2k_earth_specular_map.tif', 'earth_specular', 2048, { grayscale: true }],
  ['8k_moon.jpg', 'moon', 2048],
  ['2k_sun.jpg', 'sun', 2048],
  ['2k_mercury.jpg', 'mercury', 2048],
  ['2k_venus_atmosphere.jpg', 'venus', 2048],
  ['2k_mars.jpg', 'mars', 2048],
  ['2k_jupiter.jpg', 'jupiter', 2048],
  ['2k_saturn.jpg', 'saturn', 2048],
  ['2k_saturn_ring_alpha.png', 'saturn_ring', 2048, { alpha: true }],
  ['2k_uranus.jpg', 'uranus', 1024],
  ['2k_neptune.jpg', 'neptune', 1024],
  ['8k_stars_milky_way.jpg', 'milky_way_sky', 4096],
];

async function exists(p) { try { await access(p); return true; } catch { return false; } }

await mkdir(CACHE, { recursive: true });
await mkdir(OUT, { recursive: true });
for (const src of [...new Set(JOBS.map(j => j[0]))]) {
  if (await exists(CACHE + src)) continue;
  const res = await fetch(BASE + src, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!res.ok || !String(res.headers.get('content-type')).startsWith('image')) throw new Error(`Failed ${src}: ${res.status} ${res.headers.get('content-type')}`);
  await writeFile(CACHE + src, Buffer.from(await res.arrayBuffer()));
  console.log('downloaded', src);
}
for (const [src, name, width, opts = {}] of JOBS) {
  let img = sharp(CACHE + src, { limitInputPixels: false }).resize({ width, withoutEnlargement: true });
  if (opts.grayscale) img = img.grayscale();
  const info = await img.webp({ quality: opts.alpha ? 90 : 82, alphaQuality: 90, effort: 6 }).toFile(OUT + name + '.webp');
  console.log('wrote', name + '.webp', info.width + 'x' + info.height, Math.round(info.size / 1024) + ' KB');
}
