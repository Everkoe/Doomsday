import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { SAGAS } from '../data/sagas';
import { useProgress } from '../hooks/useProgress';
import { getMedia } from '../lib/media';
import type { Saga } from '../types';
import { Reveal, SectionHeader } from './Section';

export function sagaTitleIds(saga: Saga): string[] {
  return [...new Set(saga.chapters.flatMap((c) => c.titleIds))];
}

/** Fila de "marcas" estilo plataforma: cada saga con su identidad visual. */
export function SagaSection() {
  return (
    <Reveal as="section" aria-label="Explorar por sagas">
      <SectionHeader title="Explorar por historias" subtitle="Una misma producción puede pertenecer a varias sagas." />
      <div className="page-x mt-3 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {SAGAS.map((saga, i) => (
          <SagaTile key={saga.id} saga={saga} index={i} />
        ))}
      </div>
    </Reveal>
  );
}

function SagaTile({ saga, index }: { saga: Saga; index: number }) {
  const { getStatus } = useProgress();
  const ids = sagaTitleIds(saga);
  const watched = ids.filter((id) => getStatus(id) === 'watched').length;
  const posters = ids.map((id) => getMedia(id).poster).filter(Boolean).slice(0, 3) as string[];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Link
        to={`/sagas/${saga.id}`}
        className="group relative block aspect-[4/3] sm:aspect-[16/8] overflow-hidden rounded-lg bg-panel ring-1 ring-white/8 transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-1 hover:scale-[1.03] hover:shadow-[0_24px_40px_-16px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.3)]"
      >
        <div className="absolute inset-0 flex justify-end gap-1.5 opacity-70 transition-opacity duration-500 group-hover:opacity-95" aria-hidden>
          {posters.map((p, i) => (
            <img
              key={p}
              src={p}
              alt=""
              loading="lazy"
              className="h-full w-[22%] object-cover max-sm:w-1/3"
              style={{ transform: `translateY(${i % 2 ? 8 : -8}%) scale(1.1)` }}
            />
          ))}
        </div>
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(100deg, #0E1118 28%, #0E1118d9 48%, #0E111840 80%), linear-gradient(0deg, #0E1118cc, transparent 60%)` }}
        />
        <span className="absolute inset-x-0 top-0 h-0.5" style={{ background: saga.accent }} />
        <div className="relative flex h-full flex-col justify-between p-4 sm:p-6">
          <span className="text-[11px] font-semibold tabular-nums text-mist">
            {watched}/{ids.length}
          </span>
          <div>
            <h3 className="display text-[clamp(1.05rem,2.2vw,1.9rem)] font-semibold text-snow">{saga.name}</h3>
            <p className="mt-1.5 max-w-[60%] text-xs leading-snug text-mist max-sm:hidden">{saga.tagline}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

