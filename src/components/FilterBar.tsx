import { motion } from 'motion/react';
import type { Title, WatchStatus } from '../types';

export type FilterId = 'all' | 'pending' | 'watched' | 'skipped' | 'movie' | 'series' | 'essential';

export const FILTERS: { id: FilterId; label: string }[] = [
  { id: 'all', label: 'Todas' },
  { id: 'pending', label: 'Pendientes' },
  { id: 'watched', label: 'Vistas' },
  { id: 'skipped', label: 'Saltadas' },
  { id: 'movie', label: 'Películas' },
  { id: 'series', label: 'Series' },
  { id: 'essential', label: 'Esenciales' },
];

export function applyFilter(items: Title[], filter: FilterId, getStatus: (id: string) => WatchStatus, hideCompleted: boolean): Title[] {
  return items.filter((t) => {
    const status = getStatus(t.id);
    if (hideCompleted && status === 'watched') return false;
    switch (filter) {
      case 'pending':
      case 'watched':
      case 'skipped':
        return status === filter;
      case 'movie':
      case 'series':
        return t.kind === filter;
      case 'essential':
        return t.priority === 'essential';
      default:
        return true;
    }
  });
}

type Props = {
  value: FilterId;
  onChange: (f: FilterId) => void;
  counts: Record<FilterId, number>;
  hideCompleted: boolean;
  onHideCompletedChange: (v: boolean) => void;
};

export function FilterBar({ value, onChange, counts, hideCompleted, onHideCompletedChange }: Props) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div role="tablist" aria-label="Filtrar catálogo" className="scrollbar-none -mx-4 flex gap-1.5 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
        {FILTERS.map((f) => {
          const isActive = value === f.id;
          return (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(f.id)}
              className={`relative inline-flex h-9 shrink-0 items-center gap-2 rounded-full px-4 text-[13px] font-semibold transition-colors ${
                isActive ? 'text-ink' : 'text-mist ring-1 ring-white/10 hover:text-snow hover:ring-white/25'
              }`}
            >
              {isActive && (
                <motion.span layoutId="filter-pill" className="absolute inset-0 -z-0 rounded-full bg-snow" transition={{ type: 'spring', stiffness: 450, damping: 36 }} />
              )}
              <span className="relative">{f.label}</span>
              <span className={`relative text-[11px] tabular-nums ${isActive ? 'text-ink/60' : 'text-fog'}`}>{counts[f.id]}</span>
            </button>
          );
        })}
      </div>

      <label className="inline-flex cursor-pointer select-none items-center gap-3 text-[13px] font-medium text-mist">
        <span>Ocultar vistas</span>
        <span className="relative">
          <input
            type="checkbox"
            className="peer sr-only"
            checked={hideCompleted}
            onChange={(e) => onHideCompletedChange(e.target.checked)}
          />
          <span className="block h-6 w-11 rounded-full bg-snow/12 transition-colors peer-checked:bg-marvel peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-snow" />
          <span className="absolute left-0.5 top-0.5 size-5 rounded-full bg-snow shadow transition-transform duration-300 peer-checked:translate-x-5" />
        </span>
      </label>
    </div>
  );
}
