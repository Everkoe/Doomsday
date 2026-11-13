import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { CATALOG_BY_ID } from '../data/catalog';
import { SAGAS, SAGAS_BY_ID } from '../data/sagas';
import { useProgress } from '../hooks/useProgress';
import { getMedia } from '../lib/media';
import type { Saga, SagaId } from '../types';
import { MovieCard } from '../components/MovieCard';
import { ProgressBar } from '../components/ProgressIndicator';
import { sagaTitleIds } from '../components/SagaSection';
import { EmptyState, Reveal } from '../components/Section';

export function SagaPage({ onOpen }: { onOpen: (id: string) => void }) {
  const { sagaId } = useParams();
  const saga = sagaId ? SAGAS_BY_ID[sagaId as SagaId] : undefined;

  if (!saga) {
    return (
      <div className="page-x pt-32">
        <EmptyState
          title="Esta historia no existe"
          message="Puede que el enlace esté mal escrito."
          action={<Link to="/" className="h-10 rounded-md bg-snow px-4 py-2.5 text-sm font-semibold text-ink">Volver al inicio</Link>}
        />
      </div>
    );
  }
  return <SagaView key={saga.id} saga={saga} onOpen={onOpen} />;
}

function SagaView({ saga, onOpen }: { saga: Saga; onOpen: (id: string) => void }) {
  const { getStatus } = useProgress();
  const ids = sagaTitleIds(saga);
  const done = ids.filter((id) => getStatus(id) === 'watched').length;
  const cover = ids.map((id) => getMedia(id).poster).filter(Boolean) as string[];

  return (
    <>
      <section className="relative isolate overflow-hidden" style={{ ['--accent' as string]: saga.accent }}>
        <div className="absolute inset-0 -z-10 flex opacity-35" aria-hidden>
          {cover.slice(0, 6).map((p) => (
            <img key={p} src={p} alt="" className="h-full min-w-0 flex-1 object-cover" />
          ))}
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/85 to-ink/50" />
        <div className="absolute inset-0 -z-10" style={{ background: `radial-gradient(80% 60% at 20% 100%, ${saga.accent}40, transparent 70%)` }} />
        <div className="page-x mx-auto max-w-[1600px] pb-12 pt-28 lg:pt-36">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-mist hover:text-snow">
            <ArrowLeft className="size-4" /> Inicio
          </Link>
          <p className="eyebrow mt-8 flex items-center gap-2">
            <span className="h-px w-6" style={{ background: saga.accent }} />
            Historia · {ids.length} títulos
          </p>
          <h1 className="display mt-3 text-[clamp(2.4rem,7vw,5rem)] font-semibold text-snow">{saga.name}</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-mist">{saga.description}</p>
          <div className="mt-6 max-w-xs">
            <div className="mb-2 flex justify-between text-xs text-mist">
              <span>{done} vistas</span>
              <span>{Math.round((done / ids.length) * 100)}%</span>
            </div>
            <ProgressBar value={(done / ids.length) * 100} />
          </div>
          <SagaNav current={saga.id} />
        </div>
      </section>

      <div className="page-x mx-auto max-w-[1600px] space-y-12">
        {saga.notes && (
          <Reveal className="rounded-xl p-5 ring-1 sm:p-6" style={{ background: `${saga.accent}14`, borderColor: saga.accent }}>
            <h2 className="eyebrow">Lo que está confirmado</h2>
            <ul className="mt-3 space-y-2">
              {saga.notes.map((n) => (
                <li key={n} className="flex gap-3 text-[15px] leading-relaxed text-snow/90">
                  <span className="mt-2.5 size-1.5 shrink-0 rounded-full" style={{ background: saga.accent }} />
                  {n}
                </li>
              ))}
            </ul>
          </Reveal>
        )}
        <div className="flex flex-wrap gap-x-10 gap-y-12">
          {saga.chapters.map((chapter, i) => (
            <Reveal as="section" key={chapter.label} aria-label={chapter.label} delay={i * 0.06} className="max-sm:w-full">
              <div className="flex items-baseline gap-3 border-b pb-3" style={{ borderColor: `${saga.accent}55` }}>
                <span className="font-display text-2xl font-semibold tabular-nums" style={{ color: saga.accent }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h2 className="text-lg font-semibold text-snow">{chapter.label}</h2>
              </div>
              <ul className="mt-5 grid grid-cols-2 gap-x-3 gap-y-7 sm:flex sm:gap-4">
                {chapter.titleIds.map((id) =>
                  CATALOG_BY_ID[id] ? (
                    <li key={id} className="sm:w-[clamp(150px,13vw,190px)]">
                      <MovieCard title={CATALOG_BY_ID[id]} onOpen={onOpen} />
                    </li>
                  ) : null,
                )}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </>
  );
}

function SagaNav({ current }: { current: SagaId }) {
  return (
    <nav aria-label="Otras historias" className="scrollbar-none -mx-4 mt-10 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
      {SAGAS.map((s) => {
        const isActive = s.id === current;
        return (
          <Link
            key={s.id}
            to={`/sagas/${s.id}`}
            aria-current={isActive ? 'page' : undefined}
            className={`inline-flex h-9 shrink-0 items-center gap-2 rounded-full px-4 text-[13px] font-semibold transition-colors ${
              isActive ? 'bg-snow text-ink' : 'text-mist ring-1 ring-white/12 hover:text-snow hover:ring-white/30'
            }`}
          >
            <span className="size-2 rounded-full" style={{ background: s.accent }} />
            {s.name}
          </Link>
        );
      })}
    </nav>
  );
}
