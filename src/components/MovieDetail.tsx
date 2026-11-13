import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Clock, ExternalLink, Eye, EyeOff, Globe2, Hourglass, Play, X } from 'lucide-react';
import { CATALOG_BY_ID } from '../data/catalog';
import { disneyPlusUrl } from '../data/streaming';
import { SAGAS_BY_ID } from '../data/sagas';
import { useProgress } from '../hooks/useProgress';
import { formatRuntime, getMedia, getRuntime } from '../lib/media';
import { nextPendingAfter, orderOf } from '../lib/progress';
import type { ChronologyKind, Title } from '../types';
import { Modal } from './Modal';
import { Poster } from './Poster';
import { PriorityMark } from './StatusBadge';
import { WatchStatusButton } from './WatchStatusButton';

type Props = { title: Title | null; onClose: () => void; onOpen: (id: string) => void };

export function MovieDetail({ title, onClose, onOpen }: Props) {
  return (
    <Modal isOpen={Boolean(title)} onClose={onClose} labelledBy="detail-title" contentKey={title?.id} panelClassName="sm:max-w-5xl">
      {title && <DetailContent key={title.id} title={title} onClose={onClose} onOpen={onOpen} />}
    </Modal>
  );
}

const CHRONO_ICON: Record<ChronologyKind, typeof Clock> = {
  dated: Clock,
  approximate: Clock,
  'outside-time': Hourglass,
  alternate: Globe2,
};

function DetailContent({ title, onClose, onOpen }: { title: Title; onClose: () => void; onOpen: (id: string) => void }) {
  const { state } = useProgress();
  const [showSpoilers, setShowSpoilers] = useState(false);
  const media = getMedia(title.id);
  const next = nextPendingAfter(state, title.id);
  const disneyPlus = disneyPlusUrl(title.id);
  const ChronoIcon = CHRONO_ICON[title.chronology.kind];
  const runtime = formatRuntime(getRuntime(title), title.runtimeApprox && !media.runtimeMinutes);
  const backdrop = media.backdrop ?? media.poster ?? media.logo;
  const isCrispBackdrop = Boolean(media.backdrop);

  return (
    <article>
      {/* Cabecera cinematográfica */}
      <div className="relative h-[42vh] min-h-[260px] overflow-hidden sm:h-[380px]">
        {backdrop && (
          <img
            src={backdrop}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover ${isCrispBackdrop ? '' : 'scale-125 opacity-60 blur-2xl'}`}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-panel via-panel/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-panel/80 via-transparent to-transparent" />
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 grid size-10 place-items-center rounded-full bg-ink/70 text-snow ring-1 ring-white/15 backdrop-blur transition-colors hover:bg-snow hover:text-ink"
          aria-label="Cerrar ficha"
        >
          <X className="size-5" />
        </button>
        <div className="absolute bottom-0 left-0 right-0 flex items-end gap-5 px-5 pb-5 sm:gap-7 sm:px-8 sm:pb-7">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-[104px] shrink-0 overflow-hidden rounded-md shadow-2xl ring-1 ring-white/15 sm:w-[168px]"
          >
            <Poster title={title} priority />
          </motion.div>
          <div className="min-w-0 pb-1">
            <p className="eyebrow">
              {String(orderOf(title.id)).padStart(2, '0')} · {title.kind === 'series' ? 'Serie' : 'Película'} · {title.phase}
            </p>
            <h2 id="detail-title" className="display mt-2 text-[clamp(1.6rem,4.2vw,2.9rem)] font-semibold text-snow">
              {title.title}
            </h2>
            {title.originalTitle !== title.title && <p className="mt-1.5 text-sm text-fog">{title.originalTitle}</p>}
          </div>
        </div>
      </div>

      <div className="px-5 pb-8 sm:px-8">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-mist">
          <span className="font-semibold text-snow">{title.year}</span>
          <Dot />
          <span>{title.seasonsLabel ?? runtime}</span>
          {title.seasonsLabel && (
            <>
              <Dot />
              <span>{runtime}</span>
            </>
          )}
          <Dot />
          <span>{title.genres.join(', ')}</span>
          <PriorityMark priority={title.priority} className="ml-1" />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {disneyPlus && (
            <a
              href={disneyPlus}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2.5 rounded-md bg-[#0063e5] px-5 text-sm font-semibold uppercase tracking-[0.1em] text-white shadow-[0_8px_24px_-8px_rgba(0,99,229,0.7)] transition-colors hover:bg-[#0483ee]"
            >
              <Play className="size-4 fill-current" />
              Ver en Disney+
              <ExternalLink className="size-3.5 opacity-70" aria-hidden />
              <span className="sr-only">(se abre en una pestaña nueva)</span>
            </a>
          )}
          <WatchStatusButton id={title.id} />
          <WatchStatusButton id={title.id} variant="segmented" />
          {next && (
            <button
              type="button"
              onClick={() => onOpen(next.id)}
              className="group inline-flex h-12 items-center gap-2 rounded-md px-4 text-sm font-semibold text-snow ring-1 ring-white/15 transition-colors hover:bg-snow/8 sm:ml-auto"
            >
              <span className="max-w-[16rem] truncate">
                <span className="text-fog">Siguiente:</span> {next.title}
              </span>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          )}
        </div>

        <div className="mt-9 grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="space-y-8">
            <Block label="Sinopsis">
              <p className="text-[15px] leading-relaxed text-snow/90">{title.synopsis}</p>
            </Block>
            <Block label="Por qué importa para Doomsday" accent>
              <p className="text-[15px] leading-relaxed text-snow/90">{title.doomsdayRelevance}</p>
            </Block>
            {title.spoilers && (
              <div className="rounded-lg bg-ink/60 p-4 ring-1 ring-white/6">
                <button
                  type="button"
                  onClick={() => setShowSpoilers((v) => !v)}
                  aria-expanded={showSpoilers}
                  className="flex w-full items-center justify-between gap-3 text-left text-sm font-semibold text-snow"
                >
                  <span className="inline-flex items-center gap-2">
                    {showSpoilers ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    {showSpoilers ? 'Ocultar spoilers' : 'Mostrar contexto con spoilers'}
                  </span>
                  <span className="text-xs font-medium text-fog">Solo si ya la viste</span>
                </button>
                <AnimatePresence initial={false}>
                  {showSpoilers && (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden text-sm leading-relaxed text-mist"
                    >
                      <span className="block pt-3">{title.spoilers}</span>
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          <div className="space-y-8">
            <Block label="Ubicación en la línea temporal">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-snow">
                <ChronoIcon className="size-4 text-marvel" />
                {title.chronology.label}
              </p>
              {title.chronology.note && <p className="mt-1.5 text-sm leading-relaxed text-mist">{title.chronology.note}</p>}
            </Block>
            <Block label="Personajes relevantes">
              <ul className="flex flex-wrap gap-2">
                {title.characters.map((c) => (
                  <li key={c} className="rounded-full bg-snow/6 px-3 py-1 text-xs font-medium text-snow/90 ring-1 ring-white/8">
                    {c}
                  </li>
                ))}
              </ul>
            </Block>
            <Block label="Historias">
              <div className="flex flex-wrap gap-2">
                {title.sagas.map((id) => (
                  <Link
                    key={id}
                    to={`/sagas/${id}`}
                    onClick={onClose}
                    className="inline-flex items-center gap-2 rounded-md bg-snow/6 px-3 py-1.5 text-xs font-semibold text-snow ring-1 ring-white/8 transition-colors hover:bg-snow/12"
                  >
                    <span className="size-2 rounded-full" style={{ background: SAGAS_BY_ID[id].accent }} />
                    {SAGAS_BY_ID[id].name}
                  </Link>
                ))}
              </div>
            </Block>
          </div>
        </div>

        {title.connections.length > 0 && (
          <Block label="Conexiones" className="mt-10">
            <ul className="grid gap-3 sm:grid-cols-2">
              {title.connections.map((c) => {
                const target = CATALOG_BY_ID[c.id];
                if (!target) return null;
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => onOpen(target.id)}
                      className="flex w-full items-center gap-4 rounded-lg bg-ink/50 p-2.5 text-left ring-1 ring-white/6 transition-colors hover:bg-ink hover:ring-white/15"
                    >
                      <Poster title={target} className="w-12 shrink-0 rounded" />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-snow">{target.title}</span>
                        <span className="mt-0.5 block text-xs leading-snug text-mist">{c.reason}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </Block>
        )}

        {media.source?.url && (
          <p className="mt-10 border-t border-white/6 pt-4 text-[11px] text-fog">
            Imagen: póster oficial vía{' '}
            <a href={media.tmdb?.url ?? media.source.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-mist">
              {media.tmdb ? 'TMDB' : media.source.name}
            </a>
            . © Marvel Studios / Disney. Uso personal, no comercial.
          </p>
        )}
      </div>
    </article>
  );
}

function Dot() {
  return <span className="size-1 rounded-full bg-fog/60" aria-hidden />;
}

function Block({ label, children, accent = false, className = '' }: { label: string; children: React.ReactNode; accent?: boolean; className?: string }) {
  return (
    <section className={className}>
      <h3 className={`eyebrow mb-3 flex items-center gap-2 ${accent ? '!text-marvel' : ''}`}>
        {accent && <span className="h-px w-4 bg-marvel" />}
        {label}
      </h3>
      {children}
    </section>
  );
}
