import type { ReactNode } from 'react';
import { motion } from 'motion/react';

type Props = { eyebrow: string; title: string; description?: string; children?: ReactNode; accent?: string };

export function PageHeader({ eyebrow, title, description, children, accent = 'var(--color-marvel)' }: Props) {
  return (
    <header className="flex flex-col gap-6 pb-6 pt-28 md:flex-row md:items-end md:justify-between lg:pt-32">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="max-w-2xl">
        <p className="eyebrow flex items-center gap-2">
          <span className="h-px w-6" style={{ background: accent }} />
          {eyebrow}
        </p>
        <h1 className="display mt-3 text-[clamp(2.2rem,5vw,3.75rem)] font-semibold text-snow">{title}</h1>
        {description && <p className="mt-3 text-[15px] leading-relaxed text-mist">{description}</p>}
      </motion.div>
      {children}
    </header>
  );
}
