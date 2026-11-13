import { Check, SkipForward } from 'lucide-react';
import type { Priority, WatchStatus } from '../types';

export const STATUS_LABEL: Record<WatchStatus, string> = {
  pending: 'Pendiente',
  watched: 'Vista',
  skipped: 'Saltada',
};

export const PRIORITY_LABEL: Record<Priority, string> = {
  essential: 'Esencial',
  recommended: 'Recomendada',
  optional: 'Opcional',
};

/** Indicador circular discreto sobre el póster. */
export function StatusDot({ status }: { status: WatchStatus }) {
  if (status === 'pending') return null;
  const isWatched = status === 'watched';
  return (
    <span
      className={`grid size-7 place-items-center rounded-full shadow-lg ring-1 ring-black/30 ${
        isWatched ? 'bg-watched text-ink' : 'bg-ink/80 text-mist backdrop-blur'
      }`}
      aria-label={STATUS_LABEL[status]}
      title={STATUS_LABEL[status]}
    >
      {isWatched ? <Check className="size-4" strokeWidth={3} /> : <SkipForward className="size-3.5" />}
    </span>
  );
}

/** Marca de prioridad: solo se destaca lo esencial para no saturar. */
export function PriorityMark({ priority, className = '' }: { priority: Priority; className?: string }) {
  const tone =
    priority === 'essential' ? 'bg-marvel text-white' : priority === 'recommended' ? 'bg-snow/12 text-snow' : 'bg-snow/6 text-mist';
  return (
    <span className={`inline-flex items-center rounded-[4px] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${tone} ${className}`}>
      {PRIORITY_LABEL[priority]}
    </span>
  );
}
