import { createRoot } from 'react-dom/client';
import { ConvexReactClient } from 'convex/react';
import { ConvexAuthProvider } from '@convex-dev/auth/react';
import '@src/index.css';
import { CONVEX_URL } from '@extension/env';
import App from '@src/App';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from './components/base';
import { ModalAlertProvider } from './contexts/ModalAlertContext';

const convex = new ConvexReactClient(CONVEX_URL as string);

function init() {
  const appContainer = document.querySelector('#app-container');
  if (!appContainer) {
    throw new Error('Can not find #app-container');
  }
  const root = createRoot(appContainer);

  root.render(
    <ConvexAuthProvider client={convex}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Router>
          <ModalAlertProvider>
            <App />
          </ModalAlertProvider>
        </Router>
        <Toaster duration={6000} />
      </ThemeProvider>
    </ConvexAuthProvider>,
  );
}

init();
