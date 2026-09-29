import { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import '../src/css/globals.css';
import App from './App.tsx';
import Spinner from './views/spinner/Spinner.tsx';
import { ThemeProvider } from './context/shadcntheme/ThemeContext.tsx';

async function startMocksWhenExplicitlyEnabled() {
  if (!import.meta.env.DEV || import.meta.env.VITE_ENABLE_MSW !== 'true') return;
  const { worker } = await import('./api/mocks/browser.ts');
  await worker.start({ onUnhandledRequest: 'bypass' });
}

startMocksWhenExplicitlyEnabled().then(() => {
  createRoot(document.getElementById('root')!).render(
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Suspense fallback={<Spinner />}><App /></Suspense>
    </ThemeProvider>,
  );
});
