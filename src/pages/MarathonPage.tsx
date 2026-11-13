import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CATALOG } from '../data/catalog';
import { useProgress } from '../hooks/useProgress';
import { formatHours } from '../lib/media';
import { FILTERS, FilterBar, applyFilter, type FilterId } from '../components/FilterBar';
import { MovieCard } from '../components/MovieCard';
import { EmptyState } from '../components/Section';
import { ProgressBar } from '../components/ProgressIndicator';
import { PageHeader } from '../components/PageHeader';

const PREFS_KEY = 'road-to-doomsday:marathon-view';

function loadPrefs(): { filter: FilterId; hideCompleted: boolean } {
  try {
    const raw = JSON.parse(localStorage.getItem(PREFS_KEY) ?? '{}');
    const filter = FILTERS.some((f) => f.id === raw.filter) ? (raw.filter as FilterId) : 'all';
    return { filter, hideCompleted: raw.hideCompleted === true };
  } catch {
    return { filter: 'all', hideCompleted: false };
  }
}

export function MarathonPage({ onOpen }: { onOpen: (id: string) => void }) {
  const { getStatus, stats } = useProgress();
  const [prefs, setPrefs] = useState(loadPrefs);

  const updatePrefs = (next: Partial<typeof prefs>) => {
    const merged = { ...prefs, ...next };
    setPrefs(merged);
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(merged));
    } catch {
      /* preferencia no crítica */
    }
  };

  const items = useMemo(() => applyFilter(CATALOG, prefs.filter, getStatus, prefs.hideCompleted), [prefs, getStatus]);
  const counts = useMemo(
    () => Object.fromEntries(FILTERS.map((f) => [f.id, applyFilter(CATALOG, f.id, getStatus, prefs.hideCompleted).length])) as Record<FilterId, number>,
    [getStatus, prefs.hideCompleted],
  );

  return (
    <div className="page-x mx-auto max-w-[1600px]">
      <PageHeader
        eyebrow="Mi maratón"
        title="Catálogo completo"
        description="Las 26 producciones en el orden de visionado recomendado. Un clic cambia el estado; las saltadas se pueden recuperar cuando quieras."
      >
        <div className="w-full max-w-xs">
          <div className="mb-2 flex justify-between text-xs text-mist">
            <span>
              {stats.watched}/{stats.total - stats.skipped} vistas
            </span>
            <span>Quedan {formatHours(stats.remainingMinutes)}</span>
          </div>
          <ProgressBar value={stats.percent} />
        </div>
      </PageHeader>

      <div className="sticky top-16 z-30 -mx-[clamp(1rem,4vw,3.5rem)] bg-ink/92 px-[clamp(1rem,4vw,3.5rem)] py-4 backdrop-blur-xl lg:top-[72px]">
        <FilterBar
          value={prefs.filter}
          onChange={(filter) => updatePrefs({ filter })}
          counts={counts}
          hideCompleted={prefs.hideCompleted}
          onHideCompletedChange={(hideCompleted) => updatePrefs({ hideCompleted })}
        />
      </div>

      {items.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="No hay títulos con este filtro"
            message={prefs.hideCompleted ? 'Las vistas están ocultas. Desactiva “Ocultar vistas” para verlas.' : 'Prueba con otro filtro.'}
            action={
              <button
                type="button"
                onClick={() => updatePrefs({ filter: 'all', hideCompleted: false })}
                className="h-10 rounded-md bg-snow px-4 text-sm font-semibold text-ink"
              >
                Mostrar todo
              </button>
            }
          />
        </div>
      ) : (
        <ul className="mt-6 grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 sm:gap-x-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          <AnimatePresence mode="popLayout" initial={false}>
            {items.map((t, i) => (
              <motion.li
                key={t.id}
                layout
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <MovieCard title={t} onOpen={onOpen} priorityLoad={i < 12} />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}
