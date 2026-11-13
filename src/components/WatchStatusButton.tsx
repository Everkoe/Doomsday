import { AnimatePresence, motion } from 'motion/react';
import { Check, Plus, RotateCcw, SkipForward } from 'lucide-react';
import { useProgress } from '../hooks/useProgress';
import type { WatchStatus } from '../types';

type Props = {
  id: string;
  variant?: 'primary' | 'toggles' | 'icon';
  className?: string;
};

const NEXT_STATUS: Record<WatchStatus, WatchStatus> = { pending: 'watched', watched: 'pending', skipped: 'pending' };

/**
 * - primary: botón principal "Marcar como vista" / "Vista" (un clic alterna).
 * - toggles: botones redondos de vista / saltada (fichas).
 * - icon: botón circular compacto para tarjetas.
 */
export function WatchStatusButton({ id, variant = 'primary', className = '' }: Props) {
  const { getStatus, setStatus } = useProgress();
  const status = getStatus(id);

  if (variant === 'toggles') return <StatusToggles status={status} onChange={(s) => setStatus(id, s)} />;

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

type ToggleProps = {
  label: string;
  isActive: boolean;
  activeClass: string;
  onClick: () => void;
  children: React.ReactNode;
};

/** Botón circular estilo Disney+ con etiqueta flotante al pasar el ratón o enfocar. */
function RoundToggle({ label, isActive, activeClass, onClick, children }: ToggleProps) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      aria-pressed={isActive}
      aria-label={label}
      className={`group relative grid size-12 place-items-center rounded-full border-2 transition-colors ${
        isActive ? activeClass : 'border-snow/50 bg-ink/40 text-snow hover:border-snow hover:bg-snow/10'
      }`}
    >
      {children}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-snow px-2 py-1 text-[11px] font-semibold text-ink opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        {label}
      </span>
    </motion.button>
  );
}

/** Dos botones redondos: vista / saltada. Volver a pulsar devuelve el título a pendiente. */
function StatusToggles({ status, onChange }: { status: WatchStatus; onChange: (s: WatchStatus) => void }) {
  const isWatched = status === 'watched';
  const isSkipped = status === 'skipped';
  return (
    <div role="group" aria-label="Estado de visualización" className="flex items-center gap-3">
      <RoundToggle
        label={isWatched ? 'Quitar de vistas' : 'Marcar como vista'}
        isActive={isWatched}
        activeClass="border-watched bg-watched text-ink"
        onClick={() => onChange(isWatched ? 'pending' : 'watched')}
      >
        <Check className="size-5" strokeWidth={isWatched ? 3 : 2} />
      </RoundToggle>
      <RoundToggle
        label={isSkipped ? 'Recuperar (volver a pendiente)' : 'Saltar este título'}
        isActive={isSkipped}
        activeClass="border-skipped bg-skipped text-ink"
        onClick={() => onChange(isSkipped ? 'pending' : 'skipped')}
      >
        {isSkipped ? <RotateCcw className="size-5" /> : <SkipForward className="size-5" />}
      </RoundToggle>
    </div>
  );
}
