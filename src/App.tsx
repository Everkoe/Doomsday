import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { useDetail } from './hooks/useDetail';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MovieDetail } from './components/MovieDetail';
import { Toaster } from './components/Toaster';
import { EmptyState } from './components/Section';
import { HomePage } from './pages/HomePage';
import { MarathonPage } from './pages/MarathonPage';
import { TimelinePage } from './pages/TimelinePage';
import { ProgressPage } from './pages/ProgressPage';
import { SagaPage } from './pages/SagaPage';

export function App() {
  const location = useLocation();
  const { current, open, close } = useDetail();

  // Avisa a la intro de index.html de que la app ya está montada (tras el primer pintado).
  useEffect(() => {
    const frame = requestAnimationFrame(() => document.dispatchEvent(new Event('doomsday:lista')));
    return () => cancelAnimationFrame(frame);
  }, []);

  // Al cambiar de página (no al abrir una ficha), vuelve arriba.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [location.pathname]);

  return (
    <MotionConfig reducedMotion="user">
      <Navbar />
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          id="contenido"
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="min-h-[70vh]"
        >
          <Routes location={location}>
            <Route path="/" element={<HomePage onOpen={open} />} />
            <Route path="/maraton" element={<MarathonPage onOpen={open} />} />
            <Route path="/cronologia" element={<TimelinePage onOpen={open} />} />
            <Route path="/progreso" element={<ProgressPage onOpen={open} />} />
            <Route path="/sagas/:sagaId" element={<SagaPage onOpen={open} />} />
            <Route
              path="*"
              element={
                <div className="page-x pt-32">
                  <EmptyState title="Página no encontrada" message="Vuelve al inicio desde la navegación." />
                </div>
              }
            />
          </Routes>
        </motion.main>
      </AnimatePresence>
      <Footer />
      <MovieDetail title={current} onClose={close} onOpen={open} />
      <Toaster />
    </MotionConfig>
  );
}
