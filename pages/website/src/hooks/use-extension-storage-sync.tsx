// useExtensionStorageSync.ts
import { useEffect } from 'react';

interface SyncMessage {
  type: 'SYNC_LOCALSTORAGE' | 'WEBSITE_STORAGE_RESPONSE' | 'REQUEST_WEBSITE_STORAGE';
  payload?: Record<string, string>;
  data?: Record<string, string>;
}

export const useExtensionStorageSync = () => {
  const targetOrigin = '*'; // Use specific origin in production

  const syncToExtension = () => {
    try {
      const localStorageData: Record<string, string> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key !== null) {
          localStorageData[key] = localStorage.getItem(key) || '';
        }
      }

      window.postMessage({ type: 'SYNC_LOCALSTORAGE', payload: localStorageData } as SyncMessage, targetOrigin);
      // console.log('[Client] Sent localStorage to extension:', localStorageData);
    } catch (error) {
      console.error('[Client] Failed to send localStorage to extension:', error);
    }
  };

  const handleExtensionMessage = (event: MessageEvent<SyncMessage>) => {
    try {
      if (event.source !== window) return;

      if (event.data.type === 'WEBSITE_STORAGE_RESPONSE' && event.data.data) {
        Object.entries(event.data.data).forEach(([key, value]) => {
          localStorage.setItem(key, value);
        });
        // console.log('[Client] Updated localStorage from extension:', event.data.data);
      }

      if (event.data.type === 'REQUEST_WEBSITE_STORAGE') {
        // console.log('[Client] Received request to send localStorage');
        syncToExtension(); // Respond to handshake
      }
    } catch (error) {
      console.error('[Client] Error handling extension message:', error);
    }
  };

  useEffect(() => {
    const initialSyncTimeout = setTimeout(syncToExtension, 2000); // Retry logic

    window.addEventListener('storage', syncToExtension);
    window.addEventListener('message', handleExtensionMessage);

    return () => {
      clearTimeout(initialSyncTimeout);
      window.removeEventListener('storage', syncToExtension);
      window.removeEventListener('message', handleExtensionMessage);
    };
  }, []);

  return null;
};
