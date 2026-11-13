/**
 * Sonido corto de interfaz (estilo "notificación"), sintetizado con Web Audio: sin archivos.
 * Se reproduce siempre desde un clic del usuario, así que los navegadores lo permiten
 * en cualquier dispositivo (incluido iPhone).
 */

type Nota = { frecuencia: number; retraso: number; duracion: number; volumen: number };

/** Dos notas graves en quinta (Re → La): breve, serio, con un toque místico. */
const ACORDE_DOOM: readonly Nota[] = [
  { frecuencia: 293.66, retraso: 0, duracion: 0.26, volumen: 0.07 },
  { frecuencia: 440, retraso: 0.11, duracion: 0.34, volumen: 0.055 },
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

function tocarNota(ctx: AudioContext, inicio: number, { frecuencia, retraso, duracion, volumen }: Nota) {
  const comienzo = inicio + retraso;
  const fin = comienzo + duracion;
  // Senoidal + un triángulo una octava abajo para darle cuerpo sin volverlo agudo.
  [
    { tipo: 'sine' as OscillatorType, multiplo: 1, peso: 1 },
    { tipo: 'triangle' as OscillatorType, multiplo: 0.5, peso: 0.45 },
  ].forEach(({ tipo, multiplo, peso }) => {
    const osc = ctx.createOscillator();
    const nivel = ctx.createGain();
    osc.type = tipo;
    osc.frequency.value = frecuencia * multiplo;
    nivel.gain.setValueAtTime(0, comienzo);
    nivel.gain.linearRampToValueAtTime(volumen * peso, comienzo + 0.02);
    nivel.gain.exponentialRampToValueAtTime(0.0001, fin);
    osc.connect(nivel).connect(ctx.destination);
    osc.start(comienzo);
    osc.stop(fin + 0.02);
  });
}

/** Sonido de confirmación. Llamar solo dentro de un manejador de clic o tecla. */
export function playConfirmSound(): void {
  const ctx = obtenerContexto();
  if (!ctx) return;
  const reproducir = () => {
    try {
      const inicio = ctx.currentTime + 0.02;
      ACORDE_DOOM.forEach((nota) => tocarNota(ctx, inicio, nota));
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
