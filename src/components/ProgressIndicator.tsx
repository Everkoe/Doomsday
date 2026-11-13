import { motion } from 'motion/react';

type RingProps = { value: number; size?: number; stroke?: number; label?: string; className?: string };

/** Anillo de progreso animado (0–100). */
export function ProgressRing({ value, size = 36, stroke = 3, label, className = '' }: RingProps) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={`-rotate-90 ${className}`} role="img" aria-label={label ?? `${clamped}% completado`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeOpacity={0.14} strokeWidth={stroke} />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--color-marvel)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        initial={false}
        animate={{ strokeDashoffset: c - (clamped / 100) * c }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
}

type BarProps = { value: number; className?: string; label?: string };

export function ProgressBar({ value, className = '', label }: BarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      className={`h-1 w-full overflow-hidden rounded-full bg-snow/10 ${className}`}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? 'Progreso del maratón'}
    >
      <motion.div
        className="h-full rounded-full bg-marvel"
        initial={{ width: 0 }}
        animate={{ width: `${clamped}%` }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}
