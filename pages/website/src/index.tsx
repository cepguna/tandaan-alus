import { createRoot } from 'react-dom/client';
import { ConvexReactClient, ConvexProvider } from 'convex/react';
import { ConvexAuthProvider } from '@convex-dev/auth/react';
import '@src/index.css';
import { CONVEX_URL } from '@extension/env';
import Popup from '@src/Popup';

const convex = new ConvexReactClient(CONVEX_URL as string);

function init() {
  const appContainer = document.querySelector('#app-container');
  if (!appContainer) {
    throw new Error('Can not find #app-container');
  }
  const root = createRoot(appContainer);

  root.render(
    <ConvexAuthProvider client={convex}>
      <Popup />
    </ConvexAuthProvider>,
  );
}

init();
