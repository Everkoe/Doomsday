import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ProgressProvider } from './hooks/useProgress';
import { ToastProvider } from './hooks/useToast';
import './styles/index.css';

const root = document.getElementById('root');
if (!root) throw new Error('No se encontró #root en index.html');

createRoot(root).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ToastProvider>
          <ProgressProvider>
            <App />
          </ProgressProvider>
        </ToastProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
);
