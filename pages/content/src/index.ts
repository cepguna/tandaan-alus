// content.js
import { sampleFunction } from '@src/sampleFunction';
import { WEB_URL } from '@extension/env';

console.log('[Extension] Content script loaded on:', window.location.href);

const validOrigins = [WEB_URL ?? 'http://localhost:3000']; // or hardcoded: ['http://localhost:3000']

// Handshake to client
window.postMessage({ type: 'REQUEST_WEBSITE_STORAGE' }, '*');

window.addEventListener('message', event => {
  try {
    if (event.source !== window) return;
    if (!validOrigins.includes(event.origin)) {
      console.warn('[Extension] Invalid origin:', event.origin);
      return;
    }

    if (event.data.type === 'SYNC_LOCALSTORAGE') {
      console.log('[Extension] Received SYNC_LOCALSTORAGE', event.data.payload);
      chrome.runtime.sendMessage(
        {
          type: 'UPDATE_EXTENSION_STORAGE',
          data: event.data.payload,
        },
        response => {
          try {
            console.log('[Extension] Background response:', response);
            if (chrome.runtime.lastError) {
              console.error('[Extension] Runtime error:', chrome.runtime.lastError.message);
            }
          } catch (error) {
            console.error('[Extension] Error handling background response:', error);
          }
        },
      );
    }
  } catch (error) {
    console.error('[Extension] Error in message handler:', error);
    if (error.message.includes('Receiving end does not exist')) {
      console.warn('[Extension] Background script not available.');
    }
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  try {
    console.log('[Extension] Received runtime message:', message);
    if (message.type === 'REQUEST_WEBSITE_STORAGE') {
      const data: Record<string, string> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key !== null) {
          data[key] = localStorage.getItem(key) ?? '';
        }
      }

      window.postMessage({ type: 'WEBSITE_STORAGE_RESPONSE', data }, window.location.origin);

      sendResponse({ status: 'success' });
    }
  } catch (error) {
    console.error('[Extension] Error in runtime message handler:', error);
    sendResponse({ status: 'error', error: error.message });
  }
  return true;
});

sampleFunction();
