// Enriquecimiento OPCIONAL con TMDB (pósteres HD, backdrops horizontales, duración real).
//   1. Copia .env.example a .env y pon tu TMDB_API_KEY (v3) o TMDB_READ_TOKEN (v4).
//   2. npm run media:tmdb
// La clave solo se usa aquí, en Node. Nunca llega al frontend: el script descarga
// las imágenes a public/media/tmdb/ y escribe los datos en src/data/media.generated.json.
// "This product uses the TMDB API but is not endorsed or certified by TMDB."
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { MEDIA_SOURCES } from './media-sources.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..');
const OUT_DIR = path.join(ROOT, 'public', 'media', 'tmdb');
const MANIFEST = path.join(ROOT, 'src', 'data', 'media.generated.json');
const API = 'https://api.themoviedb.org/3';
const IMG = 'https://image.tmdb.org/t/p';
const LANG = process.env.TMDB_LANGUAGE || 'es-MX';

if (existsSync(path.join(ROOT, '.env'))) process.loadEnvFile(path.join(ROOT, '.env'));
const KEY = process.env.TMDB_API_KEY;
const TOKEN = process.env.TMDB_READ_TOKEN;
if (!KEY && !TOKEN) {
  console.error('Falta TMDB_API_KEY o TMDB_READ_TOKEN en .env (ver .env.example).');
  process.exit(1);
}

async function tmdb(endpoint, params = {}) {
  const q = new URLSearchParams(params);
  if (KEY) q.set('api_key', KEY);
  const res = await fetch(`${API}${endpoint}?${q}`, {
    headers: TOKEN ? { Authorization: `Bearer ${TOKEN}`, accept: 'application/json' } : { accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`TMDB ${res.status} en ${endpoint}`);
  return res.json();
}

async function download(size, filePath, dest) {
  const res = await fetch(`${IMG}/${size}${filePath}`);
  if (!res.ok) throw new Error(`Imagen ${res.status}: ${filePath}`);
  await writeFile(dest, Buffer.from(await res.arrayBuffer()));
}

// Prefiere imágenes en español; si no hay, inglés; si no, sin idioma (backdrops limpios).
function pick(images, langs) {
  for (const l of langs) {
    const hit = images.filter((i) => i.iso_639_1 === l).sort((a, b) => b.vote_average - a.vote_average)[0];
    if (hit) return hit.file_path;
  }
  return images[0]?.file_path ?? null;
}

// Suma la duración real de cada episodio (temporadas regulares; se omiten los especiales, temporada 0).
async function sumEpisodeRuntimes(tvId, seasons) {
  let total = 0;
  for (const s of seasons.filter((s) => s.season_number > 0)) {
    const season = await tmdb(`/tv/${tvId}/season/${s.season_number}`);
    total += (season.episodes ?? []).reduce((acc, ep) => acc + (ep.runtime ?? 0), 0);
  }
  return total || null;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const manifest = existsSync(MANIFEST) ? JSON.parse(await readFile(MANIFEST, 'utf8')) : {};

  for (const [id, src] of Object.entries(MEDIA_SOURCES)) {
    if (!src.tmdb) {
      console.log(`· ${id}: sin ID de TMDB configurado`);
      continue;
    }
    try {
      const { type, id: tmdbId } = src.tmdb;
      const details = await tmdb(`/${type}/${tmdbId}`, { language: LANG });
      const images = await tmdb(`/${type}/${tmdbId}/images`, { include_image_language: 'es,en,null' });
      const posterPath = pick(images.posters ?? [], ['es', 'en', null]) ?? details.poster_path;
      const backdropPath = pick(images.backdrops ?? [], [null, 'en', 'es']) ?? details.backdrop_path;
      const entry = { ...(manifest[id] ?? {}) };

      if (posterPath) {
        await download('w780', posterPath, path.join(OUT_DIR, `${id}-poster.jpg`));
        entry.poster = `/media/tmdb/${id}-poster.jpg`;
        entry.posterSize = [780, 1170];
      }
      if (backdropPath) {
        await download('w1280', backdropPath, path.join(OUT_DIR, `${id}-backdrop.jpg`));
        entry.backdrop = `/media/tmdb/${id}-backdrop.jpg`;
      }
      if (type === 'movie' && details.runtime) entry.runtimeMinutes = details.runtime;
      if (type === 'tv') {
        const minutes = await sumEpisodeRuntimes(tmdbId, details.seasons ?? []);
        if (minutes) entry.runtimeMinutes = minutes;
      }
      entry.tmdb = { type, id: tmdbId, url: `https://www.themoviedb.org/${type}/${tmdbId}` };
      manifest[id] = entry;
      console.log(`✓ ${id}`);
    } catch (err) {
      console.warn(`! ${id}: ${err.message}`);
    }
  }

  await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
  console.log('\nListo. Reinicia `npm run dev` para ver los cambios.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
