import { AnimatePresence, motion } from 'motion/react';
import { Check, Plus, RotateCcw, SkipForward } from 'lucide-react';
import { useProgress } from '../hooks/useProgress';
import type { WatchStatus } from '../types';
import { STATUS_LABEL } from './StatusBadge';

type Props = {
  id: string;
  variant?: 'primary' | 'segmented' | 'icon';
  className?: string;
};

const NEXT_STATUS: Record<WatchStatus, WatchStatus> = { pending: 'watched', watched: 'pending', skipped: 'pending' };

/**
 * - primary: botón principal "Marcar como vista" / "Vista" (un clic alterna).
 * - segmented: selector de los tres estados.
 * - icon: botón circular compacto para tarjetas.
 */
export function WatchStatusButton({ id, variant = 'primary', className = '' }: Props) {
  const { getStatus, setStatus } = useProgress();
  const status = getStatus(id);

  if (variant === 'segmented') return <Segmented id={id} status={status} onChange={(s) => setStatus(id, s)} className={className} />;

  if (variant === 'icon') {
    const isWatched = status === 'watched';
    const label = isWatched ? 'Quitar de vistas' : status === 'skipped' ? 'Recuperar (volver a pendiente)' : 'Marcar como vista';
    return (
      <motion.button
        type="button"
        whileTap={{ scale: 0.88 }}
        onClick={(e) => {
          e.stopPropagation();
          setStatus(id, NEXT_STATUS[status]);
        }}
        aria-label={label}
        title={label}
        className={`grid size-9 place-items-center rounded-full border transition-colors ${
          isWatched
            ? 'border-watched bg-watched text-ink'
            : 'border-snow/40 bg-ink/60 text-snow backdrop-blur hover:border-snow hover:bg-snow hover:text-ink'
        } ${className}`}
      >
        {status === 'skipped' ? <RotateCcw className="size-4" /> : isWatched ? <Check className="size-4" strokeWidth={3} /> : <Plus className="size-4" />}
      </motion.button>
    );
  }

  const isWatched = status === 'watched';
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.96 }}
      onClick={() => setStatus(id, NEXT_STATUS[status])}
      className={`relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-md px-6 text-sm font-semibold uppercase tracking-[0.12em] transition-colors ${
        isWatched ? 'bg-watched text-ink hover:bg-watched/90' : 'bg-snow text-ink hover:bg-white'
      } ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={status}
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -14, opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="inline-flex items-center gap-2"
        >
          {isWatched ? <Check className="size-4" strokeWidth={3} /> : status === 'skipped' ? <RotateCcw className="size-4" /> : <Check className="size-4" />}
          {isWatched ? 'Vista' : status === 'skipped' ? 'Recuperar' : 'Marcar como vista'}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}

function Segmented({
  id,
  status,
  onChange,
  className,
}: {
  id: string;
  status: WatchStatus;
  onChange: (s: WatchStatus) => void;
  className: string;
}) {
  const options: { value: WatchStatus; icon: typeof Check }[] = [
    { value: 'pending', icon: Plus },
    { value: 'watched', icon: Check },
    { value: 'skipped', icon: SkipForward },
  ];
  return (
    <div role="radiogroup" aria-label="Estado de visualización" className={`relative inline-flex rounded-md bg-snow/8 p-1 ${className}`}>
      {options.map(({ value, icon: Icon }) => {
        const isActive = status === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(value)}
            className={`relative z-10 inline-flex h-9 items-center gap-1.5 rounded px-3 text-xs font-semibold transition-colors ${
              isActive ? 'text-ink' : 'text-mist hover:text-snow'
            }`}
          >
            {isActive && (
              <motion.span
                layoutId={`seg-${id}`}
                className={`absolute inset-0 -z-10 rounded ${value === 'watched' ? 'bg-watched' : value === 'skipped' ? 'bg-skipped' : 'bg-snow'}`}
                transition={{ type: 'spring', stiffness: 500, damping: 38 }}
              />
            )}
            <Icon className="size-3.5" />
            {STATUS_LABEL[value]}
          </button>
        );
      })}
    </div>
  );
}
