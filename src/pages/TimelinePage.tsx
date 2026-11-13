import { motion } from 'motion/react';
import { Clock, Flag, Globe2, Hourglass } from 'lucide-react';
import { CATALOG } from '../data/catalog';
import { DOOMSDAY } from '../data/sagas';
import { useProgress } from '../hooks/useProgress';
import { formatRuntime, getMedia, getRuntime } from '../lib/media';
import type { ChronologyKind, Title } from '../types';
import { PageHeader } from '../components/PageHeader';
import { Poster } from '../components/Poster';
import { PriorityMark, StatusDot } from '../components/StatusBadge';
import { WatchStatusButton } from '../components/WatchStatusButton';

const KIND_META: Record<ChronologyKind, { icon: typeof Clock; label: string; node: string }> = {
  dated: { icon: Clock, label: 'Línea temporal principal', node: 'bg-snow' },
  approximate: { icon: Clock, label: 'Ubicación aproximada', node: 'bg-snow/60' },
  'outside-time': { icon: Hourglass, label: 'Fuera del tiempo', node: 'bg-[#E0A73B]' },
  alternate: { icon: Globe2, label: 'Universo alternativo', node: 'bg-[#3FA7D6]' },
};

const ERAS: { from: string; label: string }[] = [
  { from: 'captain-america-first-avenger', label: 'Los orígenes' },
  { from: 'the-avengers', label: 'La Saga del Infinito' },
  { from: 'loki', label: 'Después de Endgame' },
  { from: 'deadpool-wolverine', label: 'El multiverso se agrieta' },
  { from: 'brave-new-world', label: 'Rumbo a Doomsday' },
];

export function TimelinePage({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <div className="page-x mx-auto max-w-5xl">
      <PageHeader
        eyebrow="Cronología"
        title="La línea temporal"
        description="El orden de visionado sigue los acontecimientos del MCU. Cuando una ubicación es ambigua, se indica: no se fuerzan fechas que no existen."
      />
      <Legend />

      <ol className="relative mt-10">
        <span className="absolute bottom-0 left-[15px] top-2 w-px bg-gradient-to-b from-line via-line to-marvel sm:left-[119px]" aria-hidden />
        {CATALOG.map((t, i) => {
          const era = ERAS.find((e) => e.from === t.id);
          return (
            <li key={t.id}>
              {era && <EraLabel label={era.label} />}
              <TimelineItem title={t} index={i} onOpen={onOpen} />
            </li>
          );
        })}
        <li>
          <FinalNode />
        </li>
      </ol>
    </div>
  );
}

function Legend() {
  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-mist">
      {Object.entries(KIND_META).map(([kind, meta]) => (
        <li key={kind} className="inline-flex items-center gap-2">
          <span className={`size-2.5 rounded-full ${meta.node}`} />
          {meta.label}
        </li>
      ))}
    </ul>
  );
}

function EraLabel({ label }: { label: string }) {
  return (
    <div className="relative pb-4 pl-12 pt-8 sm:pl-[152px]">
      <p className="display text-xl font-semibold text-snow/90 sm:text-2xl">{label}</p>
    </div>
  );
}

function TimelineItem({ title, index, onOpen }: { title: Title; index: number; onOpen: (id: string) => void }) {
  const { getStatus } = useProgress();
  const status = getStatus(title.id);
  const meta = KIND_META[title.chronology.kind];
  const Icon = meta.icon;
  const isOffAxis = title.chronology.kind === 'outside-time' || title.chronology.kind === 'alternate';

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '0px 0px -40px 0px' }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="relative grid grid-cols-[32px_minmax(0,1fr)] items-start gap-4 pb-5 sm:grid-cols-[104px_32px_minmax(0,1fr)]"
    >
      <p className="hidden pt-5 text-right text-xs font-semibold leading-tight text-mist sm:block">{title.chronology.label}</p>
      <div className="relative flex justify-center pt-6">
        <span
          className={`relative z-10 size-3.5 rounded-full ring-4 ring-ink ${status === 'watched' ? 'bg-watched' : meta.node}`}
        />
      </div>
      <div
        className={`group flex gap-4 rounded-lg border p-3 transition-colors sm:p-4 ${
          isOffAxis ? 'border-dashed border-white/15 bg-ink-2' : 'border-white/6 bg-panel/70'
        } hover:border-white/25 ${status === 'skipped' ? 'opacity-60' : ''} ${isOffAxis ? 'sm:ml-6' : ''}`}
      >
        <button type="button" onClick={() => onOpen(title.id)} className="relative w-16 shrink-0 overflow-hidden rounded sm:w-20" aria-label={`Abrir ficha de ${title.title}`}>
          <Poster title={title} className={status === 'skipped' ? 'grayscale' : ''} />
          <span className="absolute right-1 top-1">
            <StatusDot status={status} />
          </span>
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-fog">
            {String(index + 1).padStart(2, '0')} · {title.kind === 'series' ? 'Serie' : 'Película'}
            <span className="sm:hidden"> · {title.chronology.label}</span>
          </p>
          <button type="button" onClick={() => onOpen(title.id)} className="mt-1 block text-left text-[15px] font-semibold leading-snug text-snow hover:underline sm:text-base">
            {title.title}
          </button>
          <p className="mt-1 text-xs text-fog">
            {title.year} · {title.seasonsLabel ?? formatRuntime(getRuntime(title), title.runtimeApprox && !getMedia(title.id).runtimeMinutes)}
          </p>
          {title.chronology.note && (
            <p className="mt-2 flex items-start gap-1.5 text-xs leading-relaxed text-mist">
              <Icon className="mt-0.5 size-3.5 shrink-0" />
              {title.chronology.note}
            </p>
          )}
          <div className="mt-3 flex items-center justify-between gap-3">
            <PriorityMark priority={title.priority} />
            <WatchStatusButton id={title.id} variant="icon" className="size-8" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function FinalNode() {
  const poster = getMedia(DOOMSDAY.id).poster;
  return (
    <div className="relative grid grid-cols-[32px_minmax(0,1fr)] items-center gap-4 pt-6 sm:grid-cols-[104px_32px_minmax(0,1fr)]">
      <p className="hidden text-right text-xs font-semibold text-marvel sm:block">{DOOMSDAY.releaseLabel}</p>
      <div className="flex justify-center">
        <span className="relative z-10 grid size-8 place-items-center rounded-full bg-marvel text-white ring-4 ring-ink">
          <Flag className="size-4" />
        </span>
      </div>
      <div className="flex items-center gap-4 rounded-lg bg-gradient-to-r from-marvel/20 to-transparent p-4 ring-1 ring-marvel/40">
        {poster && <img src={poster} alt="Póster oficial de Avengers: Doomsday" className="w-20 rounded shadow-xl" loading="lazy" />}
        <div>
          <p className="eyebrow !text-marvel">Meta final</p>
          <p className="display mt-1 text-2xl font-semibold text-snow">{DOOMSDAY.title}</p>
          <p className="mt-1 text-sm text-mist">14 meses después de Thunderbolts*, en pleno colapso del multiverso.</p>
        </div>
      </div>
    </div>
  );
}
