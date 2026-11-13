import { useState } from 'react';
import { getMedia } from '../lib/media';
import { SAGAS_BY_ID } from '../data/sagas';
import type { Title } from '../types';

type Props = {
  title: Title;
  className?: string;
  priority?: boolean;
};

/**
 * Póster 2:3 con skeleton de carga.
 * Si no hay póster oficial disponible, muestra el logotipo oficial del título sobre un fondo neutro;
 * si tampoco existe, una tarjeta tipográfica. Nunca se inventa un póster.
 */
export function Poster({ title, className = '', priority = false }: Props) {
  const media = getMedia(title.id);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const accent = SAGAS_BY_ID[title.sagas[0]]?.accent ?? '#E62429';
  const showPoster = media.poster && !hasError;

  return (
    <div className={`relative aspect-[2/3] overflow-hidden bg-panel ${className}`}>
      {showPoster ? (
        <>
          {!isLoaded && <div className="skeleton absolute inset-0" aria-hidden />}
          <img
            src={media.poster}
            alt={`Póster de ${title.title}`}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            className={`h-full w-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        </>
      ) : (
        <PosterFallback title={title} logo={media.logo} accent={accent} />
      )}
    </div>
  );
}

function PosterFallback({ title, logo, accent }: { title: Title; logo?: string; accent: string }) {
  const [hasLogoError, setHasLogoError] = useState(false);
  return (
    <div
      className="@container absolute inset-0 flex flex-col items-center justify-center bg-ink-2 p-2"
      style={{ backgroundImage: `radial-gradient(120% 70% at 50% 40%, ${accent}33, transparent 70%)` }}
      role="img"
      aria-label={`${title.title} (logotipo oficial; póster no disponible)`}
    >
      {logo && !hasLogoError ? (
        <img src={logo} alt="" className="w-full rounded-sm object-contain" onError={() => setHasLogoError(true)} />
      ) : (
        <span className="display text-center text-xl text-snow/90">{title.originalTitle}</span>
      )}
      <span className="absolute bottom-3 hidden text-[10px] @min-[130px]:block font-semibold uppercase tracking-[0.2em] text-mist/70">
        {title.kind === 'series' ? 'Serie' : 'Película'} · {title.year}
      </span>
    </div>
  );
}
