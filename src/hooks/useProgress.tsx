import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { CATALOG_BY_ID } from '../data/catalog';
import {
  EMPTY_PROGRESS,
  STORAGE_KEY,
  computeStats,
  exportPayload,
  loadProgress,
  parseProgress,
  saveProgress,
  statusOf,
  withStatus,
  type ProgressStats,
} from '../lib/progress';
import type { ProgressState, WatchStatus } from '../types';
import { useToast } from './useToast';

interface ProgressContextValue {
  state: ProgressState;
  stats: ProgressStats;
  getStatus: (id: string) => WatchStatus;
  setStatus: (id: string, status: WatchStatus, options?: { silent?: boolean }) => void;
  exportJson: () => void;
  importJson: (file: File) => Promise<void>;
  reset: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

const STATUS_MESSAGES: Record<WatchStatus, string> = {
  watched: 'Marcada como vista',
  skipped: 'Saltada · puedes recuperarla cuando quieras',
  pending: 'Vuelve a estar pendiente',
};

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(loadProgress);
  const { notify } = useToast();

  useEffect(() => {
    if (!saveProgress(state)) notify({ message: 'No se pudo guardar el progreso en este navegador.', tone: 'error' });
  }, [state, notify]);

  // Sincroniza entre pestañas abiertas.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setState(loadProgress());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const stats = useMemo(() => computeStats(state), [state]);
  const getStatus = useCallback((id: string) => statusOf(state, id), [state]);

  const setStatus = useCallback<ProgressContextValue['setStatus']>(
    (id, status, options) => {
      const previous = statusOf(state, id);
      if (previous === status) return;
      const next = withStatus(state, id, status);
      setState(next);
      if (options?.silent) return;
      const { watched, total, skipped } = computeStats(next);
      notify({
        title: CATALOG_BY_ID[id]?.title,
        message: status === 'watched' ? `${STATUS_MESSAGES.watched} · ${watched}/${total - skipped}` : STATUS_MESSAGES[status],
        tone: status === 'watched' ? 'success' : 'neutral',
        action: { label: 'Deshacer', run: () => setState((s) => withStatus(s, id, previous)) },
      });
    },
    [state, notify],
  );

  const exportJson = useCallback(() => {
    const blob = new Blob([JSON.stringify(exportPayload(state), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `road-to-doomsday-progreso-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    notify({ message: 'Progreso exportado', tone: 'success' });
  }, [state, notify]);

  const importJson = useCallback(
    async (file: File) => {
      try {
        const parsed = parseProgress(JSON.parse(await file.text()));
        setState({ ...parsed, updatedAt: new Date().toISOString() });
        notify({ message: `Progreso importado · ${Object.keys(parsed.statuses).length} títulos actualizados`, tone: 'success' });
      } catch (err) {
        const reason = err instanceof SyntaxError ? 'El archivo no es un JSON válido.' : (err as Error).message;
        notify({ title: 'No se pudo importar', message: reason, tone: 'error' });
      }
    },
    [notify],
  );

  const reset = useCallback(() => {
    const previous = state;
    setState(EMPTY_PROGRESS);
    notify({ message: 'Maratón reiniciado', tone: 'neutral', action: { label: 'Deshacer', run: () => setState(previous) } });
  }, [state, notify]);

  const value = useMemo(
    () => ({ state, stats, getStatus, setStatus, exportJson, importJson, reset }),
    [state, stats, getStatus, setStatus, exportJson, importJson, reset],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress debe usarse dentro de <ProgressProvider>');
  return ctx;
}
