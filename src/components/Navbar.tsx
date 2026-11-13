import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion } from 'motion/react';
import { BarChart3, Clapperboard, Home, ListVideo, type LucideIcon } from 'lucide-react';
import { useProgress } from '../hooks/useProgress';
import { ProgressRing } from './ProgressIndicator';

const LINKS: { to: string; label: string; icon: LucideIcon }[] = [
  { to: '/', label: 'Inicio', icon: Home },
  { to: '/maraton', label: 'Mi maratón', icon: Clapperboard },
  { to: '/cronologia', label: 'Cronología', icon: ListVideo },
  { to: '/progreso', label: 'Mi progreso', icon: BarChart3 },
];

export function Brand() {
  return (
    <Link to="/" className="flex shrink-0 items-center" aria-label="Marvel, inicio">
      <span className="flex h-8 items-center rounded-[3px] bg-marvel px-2 font-display text-[22px] font-bold leading-none tracking-[-0.02em] text-white">
        MARVEL
      </span>
    </Link>
  );
}

export function Navbar() {
  const { stats } = useProgress();
  const [isScrolled, setIsScrolled] = useState(false);
  const goal = stats.total - stats.skipped;

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <a href="#contenido" className="sr-only z-[100] rounded bg-snow px-3 py-2 text-ink focus:not-sr-only focus:fixed focus:left-3 focus:top-3">
        Saltar al contenido
      </a>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
          isScrolled ? 'bg-ink/92 shadow-[0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl' : 'bg-gradient-to-b from-ink/90 via-ink/40 to-transparent'
        }`}
      >
        <nav className="page-x flex h-16 items-center justify-between gap-6 lg:h-[72px]" aria-label="Principal">
          <Brand />
          <ul className="hidden items-center gap-1 md:flex">
            {LINKS.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `relative flex items-center gap-2 rounded-md px-3 py-2 text-[13px] font-semibold tracking-wide transition-colors lg:px-4 ${
                      isActive ? 'text-snow' : 'text-mist hover:text-snow'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className="size-4" />
                      <span>{label}</span>
                      {isActive && (
                        <motion.span layoutId="nav-underline" className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-snow lg:inset-x-4" />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
          <Link
            to="/progreso"
            className="flex items-center gap-2.5 rounded-full bg-snow/6 py-1 pl-1 pr-3.5 text-snow ring-1 ring-white/8 transition-colors hover:bg-snow/12"
            aria-label={`Progreso: ${stats.watched} de ${goal} títulos vistos`}
          >
            <span className="relative grid place-items-center">
              <ProgressRing value={stats.percent} size={32} stroke={3} />
              <span className="absolute text-[9px] font-bold tabular-nums">{stats.percent}%</span>
            </span>
            <span className="text-[13px] font-semibold tabular-nums">
              {stats.watched}
              <span className="text-fog">/{goal}</span>
              <span className="ml-1 hidden font-medium text-mist lg:inline">vistas</span>
            </span>
          </Link>
        </nav>
      </header>

      <nav
        aria-label="Principal móvil"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-white/6 bg-ink/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
      >
        <ul className="grid grid-cols-4">
          {LINKS.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-semibold ${isActive ? 'text-snow' : 'text-fog'}`
                }
              >
                <Icon className="size-5" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
