// Capture screenshots of the film at given scroll progress values.
// Usage: node scripts/shots.mjs [--url http://127.0.0.1:5173] [--out shots] [--w 1440 --h 900] [--wait 2500] [--tag name] 0 0.1 0.25 ...
// Also prints console errors/warnings from the page.
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf('--' + name);
  if (i === -1) return def;
  const v = args[i + 1];
  args.splice(i, 2);
  return v;
};
const url = opt('url', 'http://127.0.0.1:5173');
const out = opt('out', 'shots');
const w = +opt('w', 1440);
const h = +opt('h', 900);
const wait = +opt('wait', 2500);
const tag = opt('tag', '');
const query = opt('query', '');
const points = args.length ? args.map(Number) : [0, 0.1, 0.25, 0.45, 0.65, 0.85, 1];

await mkdir(out, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-unsafe-webgpu'],
});
const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
const logs = [];
page.on('console', (m) => {
  if (m.type() === 'error' || m.type() === 'warning') logs.push(`[${m.type()}] ${m.text()}`);
});
page.on('pageerror', (e) => logs.push(`[pageerror] ${e.message}`));
await page.goto(`${url}/?p=0&skipintro${query ? '&' + query : ''}`, { waitUntil: 'networkidle' });
await page.waitForFunction(() => !!window.__ev, null, { timeout: 30000 });
await page.waitForTimeout(wait);
for (const p of points) {
  await page.evaluate((p) => window.__ev.goto(p), p);
  await page.waitForTimeout(wait);
  const file = `${out}/${tag ? tag + '-' : ''}p${p.toFixed(3)}.png`;
  await page.screenshot({ path: file });
  console.log('shot', file);
}
const gl = await page.evaluate(() => {
  const c = document.querySelector('canvas');
  const g = c && (c.getContext('webgl2') || c.getContext('webgl'));
  if (!g) return 'no-gl';
  const ext = g.getExtension('WEBGL_debug_renderer_info');
  return ext ? g.getParameter(ext.UNMASKED_RENDERER_WEBGL) : 'unknown';
});
console.log('renderer:', gl);
if (logs.length) console.log('--- console ---\n' + [...new Set(logs)].slice(0, 40).join('\n'));
await browser.close();
