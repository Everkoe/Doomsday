import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { CATALOG } from '../data/catalog';
import { DOOMSDAY } from '../data/sagas';
import { useProgress } from '../hooks/useProgress';
import { formatHours, getMedia } from '../lib/media';
import { Hero } from '../components/Hero';
import { MovieCarousel } from '../components/MovieCarousel';
import { NextUpBanner } from '../components/NextUpBanner';
import { SagaSection } from '../components/SagaSection';
import { Reveal } from '../components/Section';
import { ProgressRing } from '../components/ProgressIndicator';

type Props = { onOpen: (id: string) => void };

const INFINITY_SAGA_END = CATALOG.findIndex((t) => t.id === 'endgame') + 1;

export function HomePage({ onOpen }: Props) {
  const { stats } = useProgress();
  const continueRow = stats.upcoming.slice(0, 10);
  const essentials = CATALOG.filter((t) => t.priority === 'essential');
  const seeAll = (
    <Link to="/maraton" className="inline-flex items-center gap-1 text-[13px] font-semibold text-mist transition-colors hover:text-snow">
      Ver todo <ArrowRight className="size-3.5" />
    </Link>
  );

  return (
    <>
      <Hero onOpen={onOpen} />
      <div className="relative z-10 -mt-6 space-y-12 sm:space-y-14">
        {continueRow.length > 0 && (
          <MovieCarousel
            title={stats.watched > 0 ? 'Continuar viendo' : 'Empieza por aquí'}
            subtitle={stats.watched > 0 ? 'Retoma donde lo dejaste' : 'Los primeros títulos del maratón, en orden'}
            items={continueRow}
            onOpen={onOpen}
            action={seeAll}
          />
        )}

        <Reveal as="section" aria-label="Próxima película pendiente" className="page-x">
          <NextUpBanner onOpen={onOpen} />
        </Reveal>

        <SagaSection />

        <MovieCarousel title="Esenciales para Doomsday" subtitle="Lo mínimo para entender quién llega y por qué" items={essentials} onOpen={onOpen} action={seeAll} />
        <MovieCarousel title="La Saga del Infinito" subtitle="Del primer vengador a Endgame" items={CATALOG.slice(0, INFINITY_SAGA_END)} onOpen={onOpen} />
        <MovieCarousel title="La Saga del Multiverso" subtitle="Después de Endgame, rumbo al colapso" items={CATALOG.slice(INFINITY_SAGA_END)} onOpen={onOpen} />

        <ProgressStrip />
        <FinalGoal />
      </div>
    </>
  );
}

function ProgressStrip() {
  const { stats } = useProgress();
  return (
    <Reveal as="section" aria-label="Mi progreso" className="page-x">
      <Link
        to="/progreso"
        className="group flex flex-col gap-6 rounded-xl bg-gradient-to-r from-panel to-ink-2 p-6 ring-1 ring-white/8 transition-colors hover:ring-white/20 sm:flex-row sm:items-center sm:p-8"
      >
        <div className="relative grid shrink-0 place-items-center">
          <ProgressRing value={stats.percent} size={96} stroke={6} />
          <span className="absolute font-display text-2xl font-semibold tabular-nums">{stats.percent}%</span>
        </div>
        <div className="grid flex-1 grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
          <Metric value={stats.watchedMovies} label="Películas vistas" />
          <Metric value={stats.watchedSeries} label="Series vistas" />
          <Metric value={stats.pending} label="Pendientes" />
          <Metric value={formatHours(stats.remainingMinutes)} label="Tiempo restante" />
        </div>
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-mist transition-colors group-hover:text-snow">
          Mi progreso <ArrowRight className="size-4" />
        </span>
      </Link>
    </Reveal>
  );
}

function Metric({ value, label }: { value: string | number; label: string }) {
  return (
    <div>
      <p className="font-display text-2xl font-semibold tabular-nums text-snow sm:text-3xl">{value}</p>
      <p className="mt-0.5 text-xs text-fog">{label}</p>
    </div>
  );
}

function FinalGoal() {
  const poster = getMedia(DOOMSDAY.id).poster;
  return (
    <Reveal as="section" aria-labelledby="final-goal" className="page-x">
      <div className="relative isolate grid overflow-hidden rounded-xl bg-ink-2 ring-1 ring-white/8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        {poster && <img src={poster} alt="" className="absolute inset-0 -z-10 h-full w-full scale-150 object-cover opacity-30 blur-3xl" />}
        <div className="flex items-center justify-center p-8 md:p-10">
          {poster && (
            <img src={poster} alt="Póster oficial de Avengers: Doomsday" loading="lazy" className="w-44 rounded-lg shadow-2xl ring-1 ring-white/15 sm:w-56" />
          )}
        </div>
        <div className="p-6 pt-0 sm:p-10 md:pl-0">
          <p className="eyebrow !text-marvel">La meta final · {DOOMSDAY.releaseLabel}</p>
          <h2 id="final-goal" className="display mt-3 text-[clamp(2rem,4.5vw,3.5rem)] font-semibold">
            {DOOMSDAY.title}
          </h2>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-snow/85">{DOOMSDAY.premise}</p>
          <p className="mt-2 text-sm text-fog">Dirigida por {DOOMSDAY.directors}.</p>
          <h3 className="eyebrow mt-8">Reparto confirmado (selección)</h3>
          <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2.5 sm:grid-cols-3">
            {DOOMSDAY.confirmedCast.map((c) => (
              <li key={c.actor} className="min-w-0">
                <p className="truncate text-sm font-semibold text-snow">{c.role}</p>
                <p className="truncate text-xs text-fog">{c.actor}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Reveal>
  );
}
