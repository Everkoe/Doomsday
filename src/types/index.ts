export type TitleKind = 'movie' | 'series';
export type Priority = 'essential' | 'recommended' | 'optional';
export type WatchStatus = 'pending' | 'watched' | 'skipped';

/**
 * Cómo se ubica una producción en la línea temporal del MCU.
 * - dated: año interno conocido
 * - approximate: ubicación relativa o aproximada
 * - outside-time: ocurre fuera del tiempo convencional (TVA)
 * - alternate: otro universo de la multiversalidad
 */
export type ChronologyKind = 'dated' | 'approximate' | 'outside-time' | 'alternate';

export interface Chronology {
  kind: ChronologyKind;
  label: string;
  note?: string;
}

export interface Connection {
  id: string;
  reason: string;
}

export type SagaId = 'avengers' | 'guardians' | 'wanda-vision' | 'multiverse' | 'new-avengers' | 'road-to-doom';

export interface Title {
  id: string;
  title: string;
  originalTitle: string;
  kind: TitleKind;
  year: number;
  /** Duración total en minutos (series: suma aproximada de episodios). */
  runtimeMinutes: number | null;
  runtimeApprox?: boolean;
  seasonsLabel?: string;
  genres: string[];
  phase: string;
  chronology: Chronology;
  priority: Priority;
  synopsis: string;
  doomsdayRelevance: string;
  /** Contexto con spoilers, oculto por defecto. */
  spoilers?: string;
  characters: string[];
  connections: Connection[];
  sagas: SagaId[];
}

export interface SagaChapter {
  label: string;
  titleIds: string[];
}

export interface Saga {
  id: SagaId;
  name: string;
  tagline: string;
  description: string;
  accent: string;
  chapters: SagaChapter[];
  /** Notas confirmadas que acompañan la saga (sin rumores). */
  notes?: string[];
}

export interface FinalGoal {
  id: string;
  title: string;
  releaseDate: string;
  releaseLabel: string;
  directors: string;
  premise: string;
  confirmedCast: { actor: string; role: string }[];
}

export interface MediaEntry {
  poster?: string;
  posterSize?: [number, number];
  backdrop?: string;
  logo?: string;
  runtimeMinutes?: number;
  source?: { name: string; url: string | null };
  tmdb?: { type: string; id: number; url: string };
}

export interface ProgressState {
  version: 1;
  statuses: Record<string, WatchStatus>;
  watchedAt: Record<string, string>;
  lastTouched: string | null;
  updatedAt: string | null;
}
