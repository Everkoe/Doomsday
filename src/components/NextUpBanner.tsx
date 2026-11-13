import { motion } from 'motion/react';
import { ArrowRight, Info, Trophy } from 'lucide-react';
import { useProgress } from '../hooks/useProgress';
import { formatRuntime, getMedia, getRuntime } from '../lib/media';
import { orderOf } from '../lib/progress';
import { DOOMSDAY } from '../data/sagas';
import { Poster } from './Poster';
import { PriorityMark } from './StatusBadge';
import { WatchStatusButton } from './WatchStatusButton';

/** Bloque destacado con la próxima producción pendiente del maratón. */
export function NextUpBanner({ onOpen, heading = 'Próxima en tu maratón' }: { onOpen: (id: string) => void; heading?: string }) {
  const { stats } = useProgress();
  const next = stats.nextUp;

  if (!next) return <CompletedBanner />;

  const media = getMedia(next.id);
  const backdrop = media.backdrop ?? media.poster ?? media.logo;

  return (
    <div className="relative isolate overflow-hidden rounded-xl bg-panel ring-1 ring-white/8">
      {backdrop && (
        <img
          key={`bg-${next.id}`}
          src={backdrop}
          alt=""
          className={`absolute inset-0 -z-10 h-full w-full object-cover ${media.backdrop ? 'opacity-50' : 'scale-125 opacity-45 blur-3xl'}`}
        />
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-panel via-panel/85 to-panel/30" />

      <motion.div
        key={next.id}
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-6 p-5 sm:flex-row sm:items-center sm:gap-8 sm:p-8"
      >
        <button
          type="button"
          onClick={() => onOpen(next.id)}
          className="w-32 shrink-0 overflow-hidden rounded-lg shadow-2xl ring-1 ring-white/15 transition-transform duration-300 hover:scale-[1.03] sm:w-44"
          aria-label={`Abrir ficha de ${next.title}`}
        >
          <Poster title={next} priority />
        </button>
        <div className="min-w-0 flex-1">
          <p className="eyebrow flex items-center gap-2 !text-marvel">
            <span className="h-px w-5 bg-marvel" />
            {heading} · {String(orderOf(next.id)).padStart(2, '0')} de {stats.total}
          </p>
          <h3 className="display mt-3 text-[clamp(1.6rem,3.4vw,2.6rem)] font-semibold text-snow">{next.title}</h3>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-mist">
            <span>{next.year}</span>
            <span>·</span>
            <span>{next.seasonsLabel ?? formatRuntime(getRuntime(next), next.runtimeApprox && !getMedia(next.id).runtimeMinutes)}</span>
            <PriorityMark priority={next.priority} className="ml-1" />
          </div>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-snow/85">{next.doomsdayRelevance}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <WatchStatusButton id={next.id} />
            <button
              type="button"
              onClick={() => onOpen(next.id)}
              className="inline-flex h-12 items-center gap-2 rounded-md bg-snow/10 px-5 text-sm font-semibold text-snow ring-1 ring-white/15 transition-colors hover:bg-snow/18"
            >
              <Info className="size-4" />
              Ver ficha
            </button>
          </div>
        </div>
        {stats.upcoming[1] && (
          <button
            type="button"
            onClick={() => onOpen(stats.upcoming[1].id)}
            className="group hidden shrink-0 items-center gap-3 self-end rounded-lg p-2 text-left transition-colors hover:bg-snow/6 xl:flex"
          >
            <span className="text-right">
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-fog">Después</span>
              <span className="block max-w-[10rem] truncate text-sm font-semibold text-snow">{stats.upcoming[1].title}</span>
            </span>
            <Poster title={stats.upcoming[1]} className="w-14 rounded" />
            <ArrowRight className="size-4 text-fog transition-transform group-hover:translate-x-0.5" />
          </button>
        )}
      </motion.div>
    </div>
  );
}

function CompletedBanner() {
  const { stats } = useProgress();
  const doomsday = getMedia(DOOMSDAY.id);
  return (
    <div className="relative isolate flex flex-col items-start gap-6 overflow-hidden rounded-xl bg-panel p-6 ring-1 ring-white/8 sm:flex-row sm:items-center sm:p-8">
      {doomsday.poster && <img src={doomsday.poster} alt="" className="absolute inset-0 -z-10 h-full w-full scale-125 object-cover opacity-35 blur-3xl" />}
      <span className="grid size-14 place-items-center rounded-full bg-marvel text-white">
        <Trophy className="size-6" />
      </span>
      <div>
        <p className="eyebrow !text-marvel">Maratón completado</p>
        <h3 className="display mt-2 text-3xl font-semibold text-snow">Estás listo para Doomsday</h3>
        <p className="mt-2 text-sm text-mist">
          {stats.watched} títulos vistos{stats.skipped ? ` · ${stats.skipped} saltados (puedes recuperarlos en Mi maratón)` : ''}. Estreno:{' '}
          {DOOMSDAY.releaseLabel}.
        </p>
      </div>
    </div>
  );
}
