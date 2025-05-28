import 'webextension-polyfill';

console.log('[Background] Loaded');
// console.log("Edit 'chrome-extension/src/background/index.ts' and save to reload.");

// Main listener
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // console.log('[Background] Received message:', message);

  try {
    // 1. Update extension storage from website
    if (message.type === 'UPDATE_EXTENSION_STORAGE' && message.data) {
      const data = message.data as Record<string, string>;
      // console.log('[Background] bg data', {
      //   data,
      //   typeof: typeof data,
      //   stringify: JSON.stringify(data),
      //   objectKeys: Object.keys(data).length,
      // });
      // Optional: update in-memory localStorage
      try {
        for (const [key, value] of Object.entries(data)) {
          localStorage.setItem(key, value);
        }
        // console.log('[Background] Updated localStorage:', data);
      } catch (error) {
        console.error('[Background] Failed to update localStorage:', error);
      }

      // Save to chrome.storage.local or clear if empty
      if (Object.keys(data).length === 0) {
        chrome.storage.local.clear(() => {
          if (chrome.runtime.lastError) {
            console.error('[Background] Error clearing chrome.storage.local:', chrome.runtime.lastError.message);
          } else {
            // console.log('[Background] Cleared chrome.storage.local');
          }
        });

        chrome.storage.sync.clear(() => {
          if (chrome.runtime.lastError) {
            console.error('[Background] Error clearing chrome.storage.sync:', chrome.runtime.lastError.message);
          } else {
            // console.log('[Background] Cleared chrome.storage.sync');
          }
        });

        sendResponse({ status: 'success', cleared: true });
      } else {
        chrome.storage.local.set(data, () => {
          if (chrome.runtime.lastError) {
            console.error('[Background] Error saving to chrome.storage.local:', chrome.runtime.lastError.message);
            sendResponse({ status: 'error', error: chrome.runtime.lastError.message });
          } else {
            // console.log('[Background] Saved to chrome.storage.local:', data);
            sendResponse({ status: 'success' });
          }
        });
      }
    }

    // 2. Handle WEBSITE_STORAGE_RESPONSE (fallback case)
    else if (message.type === 'WEBSITE_STORAGE_RESPONSE' && message.data) {
      // console.log('[Background] log bg 2', message.data);
      chrome.storage.local.set(message.data, () => {
        if (chrome.runtime.lastError) {
          console.error('[Background] Error saving website data:', chrome.runtime.lastError.message);
          sendResponse({ status: 'error', error: chrome.runtime.lastError.message });
        } else {
          // console.log('[Background] Synced website data to chrome.storage.local:', message.data);
          sendResponse({ status: 'success' });
        }
      });
    }

    // 3. Unknown message
    else {
      console.warn('[Background] Unknown message type or missing data:', message);
      sendResponse({ status: 'error', error: 'Invalid message type or data' });
    }
  } catch (error) {
    console.error('[Background] Internal error:', error);
    sendResponse({ status: 'error', error: error.message });
  }

  return true; // Keep channel open for async `sendResponse`
});
