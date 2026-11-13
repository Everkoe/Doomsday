import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Download, RotateCcw, Upload } from 'lucide-react';
import { CATALOG_BY_ID } from '../data/catalog';
import { SAGAS } from '../data/sagas';
import { useProgress } from '../hooks/useProgress';
import { formatHours } from '../lib/media';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { NextUpBanner } from '../components/NextUpBanner';
import { PageHeader } from '../components/PageHeader';
import { Poster } from '../components/Poster';
import { ProgressBar, ProgressRing } from '../components/ProgressIndicator';
import { sagaTitleIds } from '../components/SagaSection';
import { Reveal } from '../components/Section';

export function ProgressPage({ onOpen }: { onOpen: (id: string) => void }) {
  const { stats, state, exportJson, importJson, reset } = useProgress();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const recent = Object.entries(state.watchedAt)
    .sort((a, b) => b[1].localeCompare(a[1]))
    .slice(0, 8)
    .map(([id]) => CATALOG_BY_ID[id])
    .filter(Boolean);

  return (
    <div className="page-x mx-auto max-w-[1400px]">
      <PageHeader eyebrow="Mi progreso" title="Tu camino a Doomsday" description="Todo se guarda en este navegador. Exporta una copia si quieres llevarla a otro equipo." />

      <Reveal className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
        <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-xl bg-panel p-8 text-center ring-1 ring-white/8">
          <div className="relative grid place-items-center">
            <ProgressRing value={stats.percent} size={200} stroke={10} />
            <div className="absolute">
              <p className="font-display text-6xl font-semibold tabular-nums text-snow">{stats.percent}%</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-fog">completado</p>
            </div>
          </div>
          <p className="mt-6 text-sm text-mist">
            {stats.watched} de {stats.total - stats.skipped} títulos del maratón
            {stats.skipped > 0 && <span className="text-fog"> · {stats.skipped === 1 ? '1 saltado no cuenta' : `${stats.skipped} saltados no cuentan`}</span>}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Stat value={`${stats.watchedMovies}`} total={stats.totalMovies} label="Películas vistas" />
          <Stat value={`${stats.watchedSeries}`} total={stats.totalSeries} label="Series vistas" />
          <Stat value={`${stats.pending}`} label="Pendientes" />
          <Stat value={`${stats.skipped}`} label="Saltadas" />
          <Stat value={formatHours(stats.remainingMinutes)} label="Tiempo restante" hint="Duraciones reales; series aproximadas" />
          <Stat value={formatHours(stats.totalMinutes)} label="Maratón completo" />
        </div>
      </Reveal>

      <Reveal as="section" aria-label="Próxima producción" className="mt-12">
        <NextUpBanner onOpen={onOpen} heading="Lo próximo que debes ver" />
      </Reveal>

      <Reveal as="section" aria-labelledby="by-saga" className="mt-14">
        <h2 id="by-saga" className="text-xl font-semibold">Por historia</h2>
        <ul className="mt-5 grid gap-x-10 gap-y-5 sm:grid-cols-2">
          {SAGAS.map((saga) => {
            const ids = sagaTitleIds(saga);
            const done = ids.filter((id) => state.statuses[id] === 'watched').length;
            return (
              <li key={saga.id}>
                <Link to={`/sagas/${saga.id}`} className="group block">
                  <div className="mb-2 flex items-baseline justify-between text-sm">
                    <span className="inline-flex items-center gap-2 font-semibold text-snow group-hover:underline">
                      <span className="size-2 rounded-full" style={{ background: saga.accent }} />
                      {saga.name}
                    </span>
                    <span className="tabular-nums text-fog">
                      {done}/{ids.length}
                    </span>
                  </div>
                  <ProgressBar value={(done / ids.length) * 100} label={`Progreso de ${saga.name}`} />
                </Link>
              </li>
            );
          })}
        </ul>
      </Reveal>

      {recent.length > 0 && (
        <Reveal as="section" aria-labelledby="recent" className="mt-14">
          <h2 id="recent" className="text-xl font-semibold">Vistas recientemente</h2>
          <ul className="mt-5 grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-8">
            {recent.map((t) => (
              <li key={t.id}>
                <button type="button" onClick={() => onOpen(t.id)} className="block w-full overflow-hidden rounded-md ring-1 ring-white/8 transition-transform hover:scale-[1.04]" aria-label={t.title}>
                  <Poster title={t} />
                </button>
              </li>
            ))}
          </ul>
        </Reveal>
      )}

      <Reveal as="section" aria-labelledby="data" className="mt-14 rounded-xl bg-panel p-6 ring-1 ring-white/8 sm:p-8">
        <h2 id="data" className="text-xl font-semibold">Tus datos</h2>
        <p className="mt-1 text-sm text-mist">
          {state.updatedAt ? `Última actualización: ${new Date(state.updatedAt).toLocaleString('es')}` : 'Aún no has registrado ningún título.'}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <ActionButton icon={Download} onClick={exportJson}>Exportar JSON</ActionButton>
          <ActionButton icon={Upload} onClick={() => fileRef.current?.click()}>Importar progreso</ActionButton>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void importJson(file);
              e.target.value = '';
            }}
          />
          <ActionButton icon={RotateCcw} onClick={() => setIsConfirmOpen(true)} isDanger>
            Reiniciar maratón
          </ActionButton>
        </div>
      </Reveal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="¿Reiniciar el maratón?"
        message="Todos los títulos volverán a estar pendientes. Podrás deshacerlo durante unos segundos; para conservar una copia, exporta tu progreso antes."
        confirmLabel="Reiniciar"
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          reset();
          setIsConfirmOpen(false);
        }}
      />
    </div>
  );
}

function Stat({ value, total, label, hint }: { value: string; total?: number; label: string; hint?: string }) {
  return (
    <motion.div layout className="flex flex-col justify-between rounded-xl bg-panel p-5 ring-1 ring-white/8">
      <p className="text-xs font-medium text-fog">{label}</p>
      <p className="mt-6 font-display text-3xl font-semibold tabular-nums text-snow sm:text-4xl">
        {value}
        {total !== undefined && <span className="text-xl text-fog">/{total}</span>}
      </p>
      {hint && <p className="mt-1 text-[11px] text-fog">{hint}</p>}
    </motion.div>
  );
}

function ActionButton({
  icon: Icon,
  onClick,
  children,
  isDanger = false,
}: {
  icon: typeof Download;
  onClick: () => void;
  children: React.ReactNode;
  isDanger?: boolean;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`inline-flex h-11 items-center gap-2 rounded-md px-4 text-sm font-semibold ring-1 transition-colors ${
        isDanger ? 'text-marvel ring-marvel/40 hover:bg-marvel/10' : 'text-snow ring-white/15 hover:bg-snow/8'
      }`}
    >
      <Icon className="size-4" />
      {children}
    </motion.button>
  );
}
