import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { useToast } from '../hooks/useToast';

const ICONS = { success: CheckCircle2, neutral: Info, error: AlertCircle };
const TONES = { success: 'text-watched', neutral: 'text-mist', error: 'text-marvel' };

export function Toaster() {
  const { toasts, dismiss } = useToast();
  return createPortal(
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-20 z-[90] flex flex-col items-center gap-2 px-4 md:bottom-6 md:items-end md:px-6"
    >
      <AnimatePresence initial={false}>
        {toasts.map((t) => {
          const Icon = ICONS[t.tone ?? 'neutral'];
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.96 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              role={t.tone === 'error' ? 'alert' : 'status'}
              className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-lg bg-panel-2/95 p-3 pl-3.5 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.8)] ring-1 ring-white/10 backdrop-blur-xl"
            >
              <Icon className={`size-5 shrink-0 ${TONES[t.tone ?? 'neutral']}`} />
              <div className="min-w-0 flex-1">
                {t.title && <p className="truncate text-[13px] font-semibold text-snow">{t.title}</p>}
                <p className="text-[13px] text-mist">{t.message}</p>
              </div>
              {t.action && (
                <button
                  type="button"
                  onClick={() => {
                    t.action?.run();
                    dismiss(t.id);
                  }}
                  className="shrink-0 rounded px-2 py-1 text-[13px] font-semibold text-snow hover:bg-snow/10"
                >
                  {t.action.label}
                </button>
              )}
              <button type="button" onClick={() => dismiss(t.id)} aria-label="Cerrar aviso" className="shrink-0 rounded p-1 text-fog hover:text-snow">
                <X className="size-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>,
    document.body,
  );
}
