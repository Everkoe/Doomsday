/**
 * Sonido corto de interfaz (estilo "notificación"), sintetizado con Web Audio: sin archivos.
 * Se reproduce siempre desde un clic del usuario, así que los navegadores lo permiten
 * en cualquier dispositivo (incluido iPhone).
 */

type Parcial = { multiplo: number; peso: number; duracion: number };

/** "Runa grave": campana profunda en La2 con armónicos inarmónicos que se apagan antes. */
const FRECUENCIA_RUNA = 110;
const VOLUMEN_RUNA = 0.09;
const PARCIALES_RUNA: readonly Parcial[] = [
  { multiplo: 1, peso: 1, duracion: 0.8 },
  { multiplo: 2, peso: 0.3, duracion: 0.4 },
  { multiplo: 2.76, peso: 0.3, duracion: 0.4 },
  { multiplo: 5.4, peso: 0.12, duracion: 0.27 },
];

let contexto: AudioContext | null = null;

function obtenerContexto(): AudioContext | null {
  if (contexto && contexto.state !== 'closed') return contexto;
  const Contexto = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Contexto) return null;
  try {
    contexto = new Contexto();
    return contexto;
  } catch {
    return null;
  }
}

function tocarParcial(ctx: AudioContext, comienzo: number, { multiplo, peso, duracion }: Parcial) {
  const fin = comienzo + duracion;
  const osc = ctx.createOscillator();
  const nivel = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = FRECUENCIA_RUNA * multiplo;
  nivel.gain.setValueAtTime(0, comienzo);
  nivel.gain.linearRampToValueAtTime(VOLUMEN_RUNA * peso, comienzo + 0.015);
  nivel.gain.exponentialRampToValueAtTime(0.0001, fin);
  osc.connect(nivel).connect(ctx.destination);
  osc.start(comienzo);
  osc.stop(fin + 0.02);
}

/** Sonido de confirmación. Llamar solo dentro de un manejador de clic o tecla. */
export function playConfirmSound(): void {
  const ctx = obtenerContexto();
  if (!ctx) return;
  const reproducir = () => {
    try {
      const comienzo = ctx.currentTime + 0.02;
      PARCIALES_RUNA.forEach((parcial) => tocarParcial(ctx, comienzo, parcial));
    } catch {
      // El sonido es decorativo: si falla, la acción sigue funcionando.
    }
  };
  if (ctx.state === 'running') {
    reproducir();
    return;
  }
  ctx.resume().then(reproducir).catch(() => {});
}
