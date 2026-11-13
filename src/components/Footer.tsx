import { hasTmdbData } from '../lib/media';
import { Brand } from './Navbar';

export function Footer() {
  return (
    <footer className="page-x mt-24 border-t border-white/6 pb-28 pt-10 md:pb-12">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <Brand />
        <div className="max-w-2xl space-y-2 text-xs leading-relaxed text-fog">
          <p>
            Proyecto personal sin ánimo de lucro, no afiliado a Marvel Studios ni a Disney. Personajes, títulos y pósteres © Marvel
            Studios / Disney.
          </p>
          <p>
            Pósteres oficiales obtenidos de Wikipedia (uso legítimo, baja resolución).
            {hasTmdbData() && ' Datos e imágenes adicionales de TMDB. This product uses the TMDB API but is not endorsed or certified by TMDB.'}
            {' '}El progreso se guarda solo en este navegador.
          </p>
        </div>
      </div>
    </footer>
  );
}
