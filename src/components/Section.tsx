import type { ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'motion/react';

type RevealProps = HTMLMotionProps<'div'> & { as?: 'div' | 'section'; delay?: number };

/** Aparición progresiva al entrar en pantalla (una sola vez). */
export function Reveal({ as = 'div', delay = 0, children, ...rest }: RevealProps) {
  const Component = as === 'section' ? motion.section : motion.div;
  return (
    <Component
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      {...(rest as object)}
    >
      {children}
    </Component>
  );
}

export function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="page-x mb-1 flex items-end justify-between gap-4">
      <div className="min-w-0">
        <h2 className="text-lg font-semibold tracking-tight text-snow sm:text-xl">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-fog">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function EmptyState({ title, message, action }: { title: string; message?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-line px-6 py-14 text-center">
      <p className="font-semibold text-snow">{title}</p>
      {message && <p className="mt-1 max-w-md text-sm text-fog">{message}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
