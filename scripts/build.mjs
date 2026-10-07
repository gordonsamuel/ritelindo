import { readFile, writeFile, mkdir, cp, rm } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import {buildProductPages} from './product-pages.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const config = JSON.parse(await readFile(path.join(root, 'site.config.json'), 'utf8'));
const candidateUrl = config.siteUrl || process.env.URL || process.env.DEPLOY_PRIME_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '');
let origin = '';
if (candidateUrl) {
  const parsed = new URL(candidateUrl);
  if (parsed.protocol !== 'https:') throw new Error('siteUrl harus menggunakan HTTPS.');
  origin = parsed.origin;
}
if (config.whatsappNumber && !/^\d{8,15}$/.test(config.whatsappNumber)) throw new Error('Nomor WhatsApp harus 8–15 digit dengan kode negara, tanpa + atau spasi.');
const dist = path.join(root, 'dist');
await rm(dist, { recursive: true, force: true });
await mkdir(path.join(dist, 'assets'), { recursive: true });
await cp(path.join(root, 'public'), dist, { recursive: true });
const cli = path.join(root, 'node_modules', '@tailwindcss', 'cli', 'dist', 'index.mjs');
const css = spawnSync(process.execPath, [cli, '-i', 'src/styles.css', '-o', 'dist/assets/styles.css', '--minify'], { cwd: root, stdio: 'inherit' });
if (css.status !== 0) throw new Error('Build Tailwind gagal. Jalankan npm install terlebih dahulu.');
const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
let html = await readFile(path.join(root, 'src/index.html'), 'utf8');
const canonical = origin ? `<link rel="canonical" href="${escape(origin)}/">\n<meta property="og:url" content="${escape(origin)}/">\n<meta property="og:image" content="${escape(origin)}/assets/store-hero.webp">\n<meta name="twitter:image" content="${escape(origin)}/assets/store-hero.webp">` : '';
html = html.replace('<!-- SITE_METADATA -->', canonical);
html = html.replace('<!-- SITE_CONFIG -->', `<script>window.RITELINDO_CONFIG = ${JSON.stringify(config).replace(/</g, '\\u003c')};</script>`);
await writeFile(path.join(dist, 'index.html'), html);
// Static route entries support direct visits and refresh on ordinary hosting.
for (const route of ['simulasi-3d', 'pilihan-rak', 'layanan', 'cara-pesan', 'konsultasi', 'pertanyaan']) {
  await mkdir(path.join(dist, route), { recursive: true });
  await writeFile(path.join(dist, route, 'index.html'), html.replace('<head>', '<head>\n  <base href="../">'));
}
await cp(path.join(root, 'src/app.js'), path.join(dist, 'assets/app.js'));
await cp(path.join(root, 'src/scroll-motion.js'), path.join(dist, 'assets/scroll-motion.js'));
await cp(path.join(root, 'src/planner.js'), path.join(dist, 'assets/planner.js'));
await cp(path.join(root, 'src/planner-math.mjs'), path.join(dist, 'assets/planner-math.mjs'));
await cp(path.join(root, 'src/rack-catalog.mjs'), path.join(dist, 'assets/rack-catalog.mjs'));
for(const name of ['products.js','products.css','products-data.mjs','auto-layout.mjs']) await cp(path.join(root,'src',name),path.join(dist,'assets',name));
const productPaths=await buildProductPages(dist,html,origin);
await mkdir(path.join(dist, 'assets/vendor'), { recursive: true });
for (const name of ['three.module.js', 'three.core.js']) await cp(path.join(root, 'node_modules/three/build', name), path.join(dist, 'assets/vendor', name));
const orbitSource = await readFile(path.join(root, 'node_modules/three/examples/jsm/controls/OrbitControls.js'), 'utf8');
await writeFile(path.join(dist, 'assets/vendor/OrbitControls.js'), orbitSource.replace("from 'three';", "from './three.module.js';"));
await cp(path.join(root, 'node_modules/three/LICENSE'), path.join(dist, 'assets/vendor/THREE-LICENSE.txt'));
await writeFile(path.join(dist, 'robots.txt'), `User-agent: *\n${origin ? 'Allow: /\nSitemap: ' + origin + '/sitemap.xml\n' : 'Disallow: /\n'}`);
if (origin) await writeFile(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['/','/produk/',...productPaths].map(route=>`<url><loc>${escape(origin+route)}</loc></url>`).join('')}</urlset>\n`);
console.log(`Build selesai: dist/ ${origin || '(preview lokal; isi siteUrl untuk SEO publik)'}`);
if (!config.whatsappNumber) console.warn('Nomor WhatsApp belum diisi. CTA menampilkan dialog pemberitahuan.');
