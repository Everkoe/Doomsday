import { memo } from 'react';
import { motion } from 'motion/react';
import { useProgress } from '../hooks/useProgress';
import { orderOf } from '../lib/progress';
import type { Title } from '../types';
import { Poster } from './Poster';
import { PriorityMark, STATUS_LABEL, StatusDot } from './StatusBadge';
import { WatchStatusButton } from './WatchStatusButton';

type Props = {
  title: Title;
  onOpen: (id: string) => void;
  showOrder?: boolean;
  priorityLoad?: boolean;
};

function MovieCardBase({ title, onOpen, showOrder = true, priorityLoad = false }: Props) {
  const { getStatus } = useProgress();
  const status = getStatus(title.id);
  const isSkipped = status === 'skipped';
  const kindLabel = title.kind === 'series' ? 'Serie' : 'Película';

  return (
    <motion.article
      className="group/card relative w-full"
      whileHover="hover"
      initial="rest"
      animate="rest"
    >
      <motion.div
        variants={{ rest: { scale: 1, y: 0 }, hover: { scale: 1.04, y: -4 } }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-lg bg-panel shadow-[0_8px_24px_-12px_rgba(0,0,0,0.8)] ring-1 ring-white/6 transition-shadow duration-300 group-hover/card:shadow-[0_24px_48px_-16px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.18)]"
      >
        <button
          type="button"
          onClick={() => onOpen(title.id)}
          className="block w-full text-left focus-visible:outline-none"
          aria-label={`${title.title}, ${kindLabel}, ${title.year}. Estado: ${STATUS_LABEL[status]}. Abrir ficha`}
        >
          <Poster
            title={title}
            priority={priorityLoad}
            className={`transition-[filter,opacity] duration-300 ${isSkipped ? 'opacity-45 grayscale' : ''}`}
          />
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent opacity-0 transition-opacity duration-300 group-hover/card:opacity-100 group-focus-within/card:opacity-100" />
        </button>

        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-2">
          {showOrder ? (
            <span className="rounded bg-ink/75 px-1.5 py-0.5 font-display text-xs tabular-nums text-snow/90 backdrop-blur">
              {String(orderOf(title.id)).padStart(2, '0')}
            </span>
          ) : (
            <span />
          )}
          <StatusDot status={status} />
        </div>

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-2.5 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100 group-focus-within/card:opacity-100 max-md:hidden">
          <PriorityMark priority={title.priority} />
          <WatchStatusButton id={title.id} variant="icon" />
        </div>

        {title.priority === 'essential' && (
          <span className="absolute inset-x-0 bottom-0 h-0.5 bg-marvel transition-opacity group-hover/card:opacity-0" aria-hidden />
        )}
      </motion.div>

      <div className="mt-2.5 flex items-start justify-between gap-2 px-0.5">
        <button type="button" onClick={() => onOpen(title.id)} className="min-w-0 text-left" tabIndex={-1}>
          <h3 className={`line-clamp-2 text-[13px] font-semibold leading-snug ${isSkipped ? 'text-fog line-through decoration-fog/60' : 'text-snow'}`}>
            {title.title}
          </h3>
          <p className="mt-0.5 text-xs text-fog">
            {title.year} · {kindLabel}
            {status !== 'pending' && <span className={status === 'watched' ? 'text-watched' : ''}> · {STATUS_LABEL[status]}</span>}
          </p>
        </button>
        <WatchStatusButton id={title.id} variant="icon" className="mt-0.5 size-8 shrink-0 md:hidden" />
      </div>
    </motion.article>
  );
}

export const MovieCard = memo(MovieCardBase);
