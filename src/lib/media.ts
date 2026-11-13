import rawMedia from '../data/media.generated.json';
import type { MediaEntry, Title } from '../types';

// El JSON lo genera un script propio (scripts/fetch-*.mjs); su forma coincide con MediaEntry.
const MEDIA = rawMedia as unknown as Record<string, MediaEntry>;

export function getMedia(id: string): MediaEntry {
  return MEDIA[id] ?? {};
}

/** Duración preferente: dato real de TMDB si existe; si no, la del catálogo. */
export function getRuntime(title: Title): number | null {
  return MEDIA[title.id]?.runtimeMinutes ?? title.runtimeMinutes;
}

export function hasTmdbData(): boolean {
  return Object.values(MEDIA).some((m) => m.tmdb);
}

export function formatRuntime(minutes: number | null, approx = false): string {
  if (!minutes) return 'Duración por confirmar';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const text = h > 0 ? `${h} h${m ? ` ${m} min` : ''}` : `${m} min`;
  return approx ? `≈ ${text}` : text;
}

export function formatHours(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h === 0) return `${m} min`;
  return m ? `${h} h ${m} min` : `${h} h`;
}
