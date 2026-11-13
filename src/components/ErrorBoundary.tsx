import { Component, type ErrorInfo, type ReactNode } from 'react';

type State = { error: Error | null };

/** Captura errores de render y ofrece recuperación sin perder el progreso guardado. */
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[app] Error de render', error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="grid min-h-dvh place-items-center bg-ink px-6 text-center">
        <div className="max-w-md">
          <p className="eyebrow !text-marvel">Algo salió mal</p>
          <h1 className="display mt-3 text-4xl font-semibold text-snow">Se rompió la línea temporal</h1>
          <p className="mt-3 text-sm text-mist">Tu progreso sigue guardado en este navegador. Recarga la página para continuar.</p>
          <button type="button" onClick={() => window.location.reload()} className="mt-6 h-11 rounded-md bg-snow px-5 text-sm font-semibold text-ink">
            Recargar
          </button>
        </div>
      </div>
    );
  }
}
