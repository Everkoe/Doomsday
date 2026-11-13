/**
 * Reduce el peso de las imágenes de TMDB para que la web cargue rápido (sobre todo en móvil).
 * - Pósteres: 500 px de ancho (nítidos en pantallas retina a tamaño de tarjeta).
 * - Backdrops: 1280 px de ancho.
 * Reescribe los JPG en su sitio con mozjpeg. Es idempotente: salta los que ya están optimizados.
 *
 * Uso: npm run media:optimize
 */
import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const DIR = path.resolve('public/media/tmdb');
const PERFILES = [
  { sufijo: '-poster.jpg', ancho: 500, calidad: 78, yaOptimizadoKB: 110 },
  { sufijo: '-backdrop.jpg', ancho: 1280, calidad: 72, yaOptimizadoKB: 200 },
];

async function optimizar(archivo, perfil) {
  const ruta = path.join(DIR, archivo);
  const antes = (await stat(ruta)).size;
  const { width = 0 } = await sharp(ruta).metadata();
  if (width <= perfil.ancho && antes / 1024 <= perfil.yaOptimizadoKB) return { archivo, antes, despues: antes, saltado: true };

  const entrada = await readFile(ruta);
  const salida = await sharp(entrada)
    .resize({ width: perfil.ancho, withoutEnlargement: true })
    .jpeg({ quality: perfil.calidad, mozjpeg: true, progressive: true })
    .toBuffer();
  if (salida.length >= antes) return { archivo, antes, despues: antes, saltado: true };
  await writeFile(ruta, salida);
  return { archivo, antes, despues: salida.length, saltado: false };
}

async function main() {
  const archivos = await readdir(DIR);
  const tareas = archivos.flatMap((archivo) => {
    const perfil = PERFILES.find((p) => archivo.endsWith(p.sufijo));
    return perfil ? [optimizar(archivo, perfil)] : [];
  });
  const resultados = await Promise.all(tareas);
  const kb = (bytes) => Math.round(bytes / 1024);
  let totalAntes = 0;
  let totalDespues = 0;
  for (const r of resultados) {
    totalAntes += r.antes;
    totalDespues += r.despues;
    console.log(`${r.saltado ? '·' : '✓'} ${r.archivo}: ${kb(r.antes)} KB → ${kb(r.despues)} KB`);
  }
  console.log(`\nTotal: ${(totalAntes / 1048576).toFixed(1)} MB → ${(totalDespues / 1048576).toFixed(1)} MB`);
}

main().catch((error) => {
  console.error('No se pudieron optimizar las imágenes:', error);
  process.exit(1);
});
