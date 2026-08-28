import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';

window.addEventListener('error', (event) => {
  console.error('Aqutewave Global Script Exception:', event.error || event.message);
});

window.addEventListener('unhandledrejection', (event) => {
  console.warn('Aqutewave Unhandled Promise Rejection:', event.reason);
});

const rootElement = document.getElementById('root');
if (rootElement) {
  try {
    const root = createRoot(rootElement);
    root.render(
      <StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </StrictMode>,
    );
  } catch (err) {
    console.error('Aqutewave React Root Mount Error:', err);
  }
}

