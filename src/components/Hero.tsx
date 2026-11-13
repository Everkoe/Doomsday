import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, LayoutGrid, Play } from 'lucide-react';
import { CATALOG } from '../data/catalog';
import { DOOMSDAY } from '../data/sagas';
import { useProgress } from '../hooks/useProgress';
import { getMedia } from '../lib/media';
import { ProgressBar } from './ProgressIndicator';

const WALL_COLUMNS = 5;
const ease = [0.22, 1, 0.36, 1] as const;

function daysUntil(isoDate: string): number {
  const diff = new Date(`${isoDate}T00:00:00`).getTime() - Date.now();
  return Math.ceil(diff / 86_400_000);
}

/** Muro de pósteres reales en movimiento lento: imagen cinematográfica sin inventar arte. */
function PosterWall() {
  const columns = useMemo(() => {
    const withPoster = CATALOG.filter((t) => getMedia(t.id).poster);
    return Array.from({ length: WALL_COLUMNS }, (_, c) => withPoster.filter((_, i) => i % WALL_COLUMNS === c));
  }, []);

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <div className="absolute -top-[20%] right-[-12%] flex h-[150%] w-[95%] rotate-[-8deg] gap-3 opacity-55 sm:w-[80%] lg:w-[68%] lg:gap-4">
        {columns.map((col, c) => (
          <div key={c} className="relative flex-1 overflow-hidden">
            <div
              className="flex flex-col gap-3 lg:gap-4"
              style={{ animation: `wall-${c % 2 ? 'down' : 'up'} ${90 + c * 14}s linear infinite` }}
            >
              {[...col, ...col].map((t, i) => (
                <img key={`${t.id}-${i}`} src={getMedia(t.id).poster} alt="" className="aspect-[2/3] w-full rounded-md object-cover" loading="lazy" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Hero({ onOpen }: { onOpen: (id: string) => void }) {
  const { stats } = useProgress();
  const doomsday = getMedia(DOOMSDAY.id);
  const days = daysUntil(DOOMSDAY.releaseDate);
  const hasStarted = stats.watched > 0;
  const countdown = days > 1 ? `Faltan ${days} días` : days === 1 ? 'Mañana en cines' : 'Ya en cines';

  return (
    <section className="grain relative isolate overflow-hidden bg-ink" aria-labelledby="hero-title">
      
      <div className="absolute inset-0 -z-10">
        {/* Atmósfera de color (arte de Doomsday desenfocado) + muro de pósteres en movimiento */}
        {(doomsday.backdrop ?? doomsday.poster) && (
          <img
            src={doomsday.backdrop ?? doomsday.poster}
            alt=""
            className="absolute inset-0 h-full w-full scale-125 object-cover opacity-40 blur-3xl"
          />
        )}
        <PosterWall />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#080A0F_0%,#080A0Fee_28%,#080A0F99_52%,#080A0F33_75%,#080A0F55_100%)] max-lg:bg-[linear-gradient(180deg,#080A0F55_0%,#080A0Faa_45%,#080A0F_78%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />
      </div>

      <div className="page-x relative mx-auto grid min-h-[min(92svh,880px)] max-w-[1600px] items-end gap-10 pb-14 pt-[38svh] sm:pt-[42svh] lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:pb-20 lg:pt-28">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="eyebrow flex items-center gap-2"
          >
            <span className="h-px w-6 bg-marvel" />
            Tu maratón personal · {stats.total} títulos
          </motion.p>

          <motion.h1
            id="hero-title"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08, ease }}
            className="mt-5"
          >
            <span className="inline-flex items-center rounded-[4px] bg-marvel px-3 py-1 font-display text-[clamp(2.4rem,7vw,4.75rem)] font-bold leading-none tracking-[-0.03em] text-white">
              MARVEL
            </span>
            <span className="display mt-3 block text-[clamp(2.1rem,6.4vw,5.25rem)] font-semibold text-snow">
              El camino <span className="text-mist/70">a</span> Doomsday
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18, ease }}
            className="mt-5 max-w-xl text-[15px] leading-relaxed text-mist sm:text-base"
          >
            Veintiséis historias seleccionadas, en el orden que mejor prepara para{' '}
            <span className="text-snow">Avengers: Doomsday</span>. Marca lo que ves, salta lo que no te interesa y llega listo al colapso del multiverso.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.26, ease }}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
          >
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => stats.nextUp && onOpen(stats.nextUp.id)}
              disabled={!stats.nextUp}
              className="inline-flex h-12 items-center justify-center gap-2.5 rounded-md bg-snow px-6 text-sm font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-white disabled:opacity-50"
            >
              <Play className="size-4 fill-current" />
              {hasStarted ? 'Continuar maratón' : 'Comenzar maratón'}
            </motion.button>
            <Link
              to="/maraton"
              className="inline-flex h-12 items-center justify-center gap-2.5 rounded-md bg-snow/10 px-6 text-sm font-semibold uppercase tracking-[0.12em] text-snow ring-1 ring-white/15 backdrop-blur transition-colors hover:bg-snow/18"
            >
              <LayoutGrid className="size-4" />
              Explorar películas
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-9 max-w-sm"
          >
            <div className="mb-2 flex items-baseline justify-between text-xs">
              <span className="font-medium text-mist">
                {stats.watched} de {stats.total - stats.skipped} vistas
              </span>
              <span className="font-semibold tabular-nums text-snow">{stats.percent}%</span>
            </div>
            <ProgressBar value={stats.percent} />
          </motion.div>
        </div>

        <FinalGoalCard countdown={countdown} poster={doomsday.poster} />
      </div>
    </section>
  );
}

function FinalGoalCard({ countdown, poster }: { countdown: string; poster?: string }) {
  if (!poster) return null;
  return (
    <motion.aside
      initial={{ opacity: 0, scale: 0.94, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.2, ease }}
      className="hidden lg:block"
      aria-label="Meta final: Avengers Doomsday"
    >
      <div className="relative w-[clamp(220px,19vw,290px)]">
        {/* Aura de magia verde de Doom: late despacio detrás del póster */}
        <div className="doom-aura absolute -inset-12 -z-10 rounded-full" aria-hidden />
        <div className="doom-marco relative rounded-lg">
          <img
            src={poster}
            alt="Póster oficial de Avengers: Doomsday"
            className="relative aspect-[2/3] w-full rounded-lg object-cover"
          />
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <div>
            <p className="eyebrow !text-doom">Meta final</p>
            <p className="mt-1 text-sm font-semibold text-snow">{DOOMSDAY.title}</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-snow/8 px-2.5 py-1 text-[11px] font-semibold text-mist ring-1 ring-white/10">
            <Calendar className="size-3" />
            {countdown}
          </span>
        </div>
      </div>
    </motion.aside>
  );
}
