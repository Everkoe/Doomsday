import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Title } from '../types';
import { MovieCard } from './MovieCard';
import { Reveal, SectionHeader } from './Section';

type Props = {
  title: string;
  subtitle?: string;
  items: Title[];
  onOpen: (id: string) => void;
  action?: ReactNode;
  emptyState?: ReactNode;
  showOrder?: boolean;
};

/** Fila horizontal de pósteres con scroll-snap y flechas en escritorio. */
export function MovieCarousel({ title, subtitle, items, onOpen, action, emptyState, showOrder }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ atStart: true, atEnd: false });

  const updateEdges = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setEdges({ atStart: el.scrollLeft < 8, atEnd: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 });
  }, []);

  useEffect(() => {
    updateEdges();
    const el = trackRef.current;
    if (!el) return;
    const ro = new ResizeObserver(updateEdges);
    ro.observe(el);
    return () => ro.disconnect();
  }, [updateEdges, items.length]);

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' });
  };

  return (
    <Reveal as="section" aria-label={title} className="relative">
      <SectionHeader title={title} subtitle={subtitle} action={action} />
      {items.length === 0 ? (
        <div className="page-x">{emptyState}</div>
      ) : (
        <div className="group/rail relative">
          <div
            ref={trackRef}
            onScroll={updateEdges}
            className="scrollbar-none page-x flex snap-x snap-mandatory scroll-px-[clamp(1rem,4vw,3.5rem)] gap-3 overflow-x-auto overscroll-x-contain py-3 sm:gap-4"
          >
            {items.map((t, i) => (
              <div key={t.id} className="w-[38vw] max-w-[200px] shrink-0 snap-start sm:w-[24vw] md:w-[17vw] lg:w-[13.5vw] xl:max-w-[210px]">
                <MovieCard title={t} onOpen={onOpen} showOrder={showOrder} priorityLoad={i < 6} />
              </div>
            ))}
          </div>
          <RailArrow side="left" isHidden={edges.atStart} onClick={() => scrollBy(-1)} />
          <RailArrow side="right" isHidden={edges.atEnd} onClick={() => scrollBy(1)} />
        </div>
      )}
    </Reveal>
  );
}

function RailArrow({ side, isHidden, onClick }: { side: 'left' | 'right'; isHidden: boolean; onClick: () => void }) {
  const Icon = side === 'left' ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === 'left' ? 'Desplazar a la izquierda' : 'Desplazar a la derecha'}
      tabIndex={isHidden ? -1 : 0}
      className={`absolute top-3 bottom-16 z-20 hidden w-[clamp(1rem,4vw,3.5rem)] items-center justify-center text-snow opacity-0 transition-opacity duration-300 md:flex ${
        side === 'left' ? 'left-0 bg-gradient-to-r' : 'right-0 bg-gradient-to-l'
      } from-ink/95 to-transparent ${isHidden ? 'pointer-events-none !opacity-0' : 'group-hover/rail:opacity-100 focus-visible:opacity-100'}`}
    >
      <Icon className="size-8 drop-shadow-lg" />
    </button>
  );
}
