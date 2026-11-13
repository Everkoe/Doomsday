// Descarga los pósteres oficiales publicados en Wikipedia (uso no comercial, con atribución)
// y genera src/data/media.generated.json.
//   npm run media:wiki
// No requiere API key. Los archivos se guardan en public/media/.
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { MEDIA_SOURCES } from './media-sources.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..');
const OUT_DIR = path.join(ROOT, 'public', 'media');
const MANIFEST = path.join(ROOT, 'src', 'data', 'media.generated.json');
const UA = 'RoadToDoomsday-LocalApp/1.0 (personal, non-commercial)';
const API = 'https://en.wikipedia.org/w/api.php';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJson(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status} → ${url}`);
  return res.json();
}

async function download(url, dest, attempt = 1) {
  if (existsSync(dest)) return;
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (res.status === 429 && attempt <= 5) {
    const wait = 4000 * attempt;
    console.log(`  … límite de peticiones, reintento en ${wait / 1000}s`);
    await sleep(wait);
    return download(url, dest, attempt + 1);
  }
  if (!res.ok) throw new Error(`HTTP ${res.status} → ${url}`);
  await writeFile(dest, Buffer.from(await res.arrayBuffer()));
}

const isPortrait = (w, h) => h > w * 1.2;

async function imageInfo(fileTitle) {
  const q = new URLSearchParams({ action: 'query', titles: fileTitle, prop: 'imageinfo', iiprop: 'url|size', format: 'json', origin: '*' });
  const j = await getJson(`${API}?${q}`);
  const page = Object.values(j.query?.pages ?? {})[0];
  const info = page?.imageinfo?.[0];
  return info ? { url: info.url, width: info.width, height: info.height, descriptionUrl: info.descriptionurl } : null;
}

// Busca en las imágenes de la página un archivo cuyo nombre contenga "poster".
async function findPosterInPage(pageTitle) {
  const q = new URLSearchParams({ action: 'query', titles: pageTitle.replace(/_/g, ' '), prop: 'images', imlimit: '100', format: 'json', origin: '*', redirects: '1' });
  const j = await getJson(`${API}?${q}`);
  const page = Object.values(j.query?.pages ?? {})[0];
  const files = (page?.images ?? []).map((i) => i.title).filter((t) => /poster/i.test(t));
  for (const f of files) {
    const info = await imageInfo(f);
    if (info && isPortrait(info.width, info.height)) return info;
  }
  return null;
}

async function resolve(id, pages) {
  let poster = null;
  let logo = null;
  let pageUrl = null;
  for (const title of pages) {
    try {
      const s = await getJson(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
      pageUrl ??= s.content_urls?.desktop?.page ?? null;
      const img = s.originalimage;
      if (img && isPortrait(img.width, img.height)) {
        poster = { url: img.source.split('?')[0], width: img.width, height: img.height };
        pageUrl = s.content_urls?.desktop?.page ?? pageUrl;
        break;
      }
      if (img && !logo) logo = { url: img.source.split('?')[0], width: img.width, height: img.height };
      const found = await findPosterInPage(title);
      if (found) {
        poster = found;
        pageUrl = s.content_urls?.desktop?.page ?? pageUrl;
        break;
      }
    } catch (err) {
      console.warn(`  ! ${id}: ${title} → ${err.message}`);
    }
    await sleep(150);
  }
  return { poster, logo, pageUrl };
}

async function main() {
  await mkdir(path.join(OUT_DIR, 'posters'), { recursive: true });
  await mkdir(path.join(OUT_DIR, 'logos'), { recursive: true });
  const previous = existsSync(MANIFEST) ? JSON.parse(await readFile(MANIFEST, 'utf8')) : {};
  const manifest = { ...previous };

  for (const [id, src] of Object.entries(MEDIA_SOURCES)) {
    const { poster, logo, pageUrl } = await resolve(id, src.wiki);
    const entry = { ...(previous[id] ?? {}), source: { name: 'Wikipedia', url: pageUrl } };
    if (poster) {
      const ext = path.extname(new URL(poster.url).pathname).toLowerCase() || '.jpg';
      const file = `posters/${id}${ext}`;
      await download(poster.url, path.join(OUT_DIR, file));
      entry.poster = `/media/${file}`;
      entry.posterSize = [poster.width, poster.height];
      console.log(`✓ ${id} póster ${poster.width}x${poster.height}`);
    } else {
      console.log(`· ${id} sin póster vertical disponible`);
    }
    if (logo) {
      const ext = path.extname(new URL(logo.url).pathname).toLowerCase() || '.jpg';
      const file = `logos/${id}${ext}`;
      await download(logo.url, path.join(OUT_DIR, file));
      entry.logo = `/media/${file}`;
    }
    manifest[id] = entry;
    await sleep(1500);
  }

  await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
  console.log(`\nManifiesto escrito en ${path.relative(ROOT, MANIFEST)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
