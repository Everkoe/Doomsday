import { CATALOG, CATALOG_BY_ID } from '../data/catalog';
import type { ProgressState, Title, WatchStatus } from '../types';
import { getRuntime } from './media';

export const STORAGE_KEY = 'road-to-doomsday:progress:v1';
const STATUSES: WatchStatus[] = ['pending', 'watched', 'skipped'];

export const EMPTY_PROGRESS: ProgressState = {
  version: 1,
  statuses: {},
  watchedAt: {},
  lastTouched: null,
  updatedAt: null,
};

export function statusOf(state: ProgressState, id: string): WatchStatus {
  return state.statuses[id] ?? 'pending';
}

/** Devuelve un NUEVO estado con el cambio aplicado (inmutable). */
export function withStatus(state: ProgressState, id: string, status: WatchStatus): ProgressState {
  const now = new Date().toISOString();
  const { [id]: _removedStatus, ...restStatuses } = state.statuses;
  const { [id]: _removedDate, ...restDates } = state.watchedAt;
  return {
    ...state,
    statuses: status === 'pending' ? restStatuses : { ...restStatuses, [id]: status },
    watchedAt: status === 'watched' ? { ...restDates, [id]: now } : restDates,
    lastTouched: id,
    updatedAt: now,
  };
}

export class ProgressImportError extends Error {}

/** Valida datos externos (localStorage o archivo importado). Lanza si el formato no es válido. */
export function parseProgress(input: unknown): ProgressState {
  if (!input || typeof input !== 'object') throw new ProgressImportError('El archivo no contiene un objeto JSON.');
  const obj = input as Record<string, unknown>;
  const source = (obj.progress && typeof obj.progress === 'object' ? obj.progress : obj) as Record<string, unknown>;
  if (!source.statuses || typeof source.statuses !== 'object') {
    throw new ProgressImportError('No se encontró el campo "statuses". ¿Es un progreso exportado desde esta app?');
  }
  const statuses: Record<string, WatchStatus> = {};
  for (const [id, value] of Object.entries(source.statuses as Record<string, unknown>)) {
    if (CATALOG_BY_ID[id] && STATUSES.includes(value as WatchStatus) && value !== 'pending') {
      statuses[id] = value as WatchStatus;
    }
  }
  const watchedAt: Record<string, string> = {};
  if (source.watchedAt && typeof source.watchedAt === 'object') {
    for (const [id, value] of Object.entries(source.watchedAt as Record<string, unknown>)) {
      if (statuses[id] === 'watched' && typeof value === 'string' && !Number.isNaN(Date.parse(value))) watchedAt[id] = value;
    }
  }
  const lastTouched = typeof source.lastTouched === 'string' && CATALOG_BY_ID[source.lastTouched] ? source.lastTouched : null;
  const updatedAt = typeof source.updatedAt === 'string' ? source.updatedAt : null;
  return { version: 1, statuses, watchedAt, lastTouched, updatedAt };
}

export function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? parseProgress(JSON.parse(raw)) : EMPTY_PROGRESS;
  } catch (err) {
    console.warn('[progreso] No se pudo leer el progreso guardado; se inicia vacío.', err);
    return EMPTY_PROGRESS;
  }
}

export function saveProgress(state: ProgressState): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch (err) {
    console.warn('[progreso] No se pudo guardar en localStorage.', err);
    return false;
  }
}

export function exportPayload(state: ProgressState) {
  return {
    app: 'marvel-road-to-doomsday',
    exportedAt: new Date().toISOString(),
    progress: state,
  };
}

export interface ProgressStats {
  total: number;
  watched: number;
  skipped: number;
  pending: number;
  watchedMovies: number;
  watchedSeries: number;
  totalMovies: number;
  totalSeries: number;
  percent: number;
  remainingMinutes: number;
  totalMinutes: number;
  nextUp: Title | null;
  upcoming: Title[];
}

export function computeStats(state: ProgressState): ProgressStats {
  const by = (s: WatchStatus) => CATALOG.filter((t) => statusOf(state, t.id) === s);
  const watched = by('watched');
  const pending = by('pending');
  const minutes = (list: Title[]) => list.reduce((acc, t) => acc + (getRuntime(t) ?? 0), 0);
  // El progreso cuenta sobre lo que el usuario decidió ver: las saltadas salen del total.
  const skipped = by('skipped').length;
  const effectiveTotal = CATALOG.length - skipped;
  return {
    total: CATALOG.length,
    watched: watched.length,
    skipped,
    pending: pending.length,
    watchedMovies: watched.filter((t) => t.kind === 'movie').length,
    watchedSeries: watched.filter((t) => t.kind === 'series').length,
    totalMovies: CATALOG.filter((t) => t.kind === 'movie').length,
    totalSeries: CATALOG.filter((t) => t.kind === 'series').length,
    percent: effectiveTotal === 0 ? 100 : Math.round((watched.length / effectiveTotal) * 100),
    remainingMinutes: minutes(pending),
    totalMinutes: minutes(CATALOG),
    nextUp: pending[0] ?? null,
    upcoming: pending,
  };
}

/** Siguiente título pendiente después de `id` en el orden del maratón. */
export function nextPendingAfter(state: ProgressState, id: string): Title | null {
  const index = CATALOG.findIndex((t) => t.id === id);
  const after = CATALOG.slice(index + 1).find((t) => statusOf(state, t.id) === 'pending');
  return after ?? CATALOG.find((t) => t.id !== id && statusOf(state, t.id) === 'pending') ?? null;
}

export function orderOf(id: string): number {
  return CATALOG.findIndex((t) => t.id === id) + 1;
}
