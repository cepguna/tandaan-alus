import type { BaseStorage, StorageConfig, ValueOrUpdate } from './types.js';
import { SessionAccessLevelEnum, StorageEnum } from './enums.js';

/**
 * Safely access the chrome object, with fallback if unavailable.
 */
const chrome = globalThis.chrome && globalThis.chrome.storage ? globalThis.chrome : null;

/**
 * Sets or updates an arbitrary cache with a new value or the result of an update function.
 */
const updateCache = async <D>(valueOrUpdate: ValueOrUpdate<D>, cache: D | null): Promise<D> => {
  const isFunction = <D>(value: ValueOrUpdate<D>): value is (prev: D) => D | Promise<D> => {
    return typeof value === 'function';
  };

  const returnsPromise = <D>(func: (prev: D) => D | Promise<D>): func is (prev: D) => Promise<D> => {
    return (func as (prev: D) => Promise<D>) instanceof Promise;
  };

  if (isFunction(valueOrUpdate)) {
    if (returnsPromise(valueOrUpdate)) {
      return valueOrUpdate(cache as D);
    } else {
      return valueOrUpdate(cache as D);
    }
  } else {
    return valueOrUpdate;
  }
};

/**
 * If one session storage needs access from content scripts, we need to enable it globally.
 * @default false
 */
let globalSessionAccessLevelFlag: StorageConfig['sessionAccessForContentScripts'] = false;

/**
 * Checks if the storage permission is granted in the manifest.json.
 */
function checkStoragePermission(storageEnum: StorageEnum): boolean {
  if (!chrome || !chrome.storage) {
    console.warn('Chrome storage API is not available in this context.');
    return false;
  }

  if (!chrome.storage[storageEnum]) {
    throw new Error(`Check your storage permission in manifest.json: ${storageEnum} is not defined`);
  }
  return true;
}

/**
 * Creates a storage area for persisting and exchanging data.
 */
export function createStorage<D = string>(key: string, fallback: D, config?: StorageConfig<D>): BaseStorage<D> {
  let cache: D | null = null;
  let initedCache = false;
  let listeners: Array<() => void> = [];

  const storageEnum = config?.storageEnum ?? StorageEnum.Local;
  const liveUpdate = config?.liveUpdate ?? false;

  const serialize = config?.serialization?.serialize ?? ((v: D) => v);
  const deserialize = config?.serialization?.deserialize ?? (v => v as D);

  // Set global session storage access level for StorageEnum.Session, only when not already done but needed.
  if (
    globalSessionAccessLevelFlag === false &&
    storageEnum === StorageEnum.Session &&
    config?.sessionAccessForContentScripts === true
  ) {
    if (checkStoragePermission(storageEnum)) {
      chrome?.storage[storageEnum]
        .setAccessLevel({
          accessLevel: SessionAccessLevelEnum.ExtensionPagesAndContentScripts,
        })
        .catch(error => {
          console.warn(error);
          console.warn('Please call setAccessLevel in a different context, like a background script.');
        });
      globalSessionAccessLevelFlag = true;
    }
  }

  // Register life cycle methods
  const get = async (): Promise<D> => {
    if (!checkStoragePermission(storageEnum)) {
      return fallback;
    }
    const value = await chrome!.storage[storageEnum].get([key]);

    if (!value || value[key] === undefined) {
      return fallback;
    }

    return deserialize(value[key]) ?? fallback;
  };

  const _emitChange = () => {
    listeners.forEach(listener => listener());
  };

  const set = async (valueOrUpdate: ValueOrUpdate<D>) => {
    if (!checkStoragePermission(storageEnum)) {
      cache = await updateCache(valueOrUpdate, cache);
      _emitChange();
      return;
    }

    if (!initedCache) {
      cache = await get();
    }
    cache = await updateCache(valueOrUpdate, cache);

    await chrome!.storage[storageEnum].set({ [key]: serialize(cache) });
    _emitChange();
  };

  const subscribe = (listener: () => void) => {
    listeners = [...listeners, listener];
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  };

  const getSnapshot = () => {
    return cache;
  };

  // Initialize cache
  get().then(data => {
    cache = data;
    initedCache = true;
    _emitChange();
  });

  // Listener for live updates from the browser
  async function _updateFromStorageOnChanged(changes: { [key: string]: chrome.storage.StorageChange }) {
    if (changes[key] === undefined) return;

    const valueOrUpdate: ValueOrUpdate<D> = deserialize(changes[key].newValue);

    if (cache === valueOrUpdate) return;

    cache = await updateCache(valueOrUpdate, cache);
    _emitChange();
  }

  // Register listener for live updates for our storage area
  if (liveUpdate && checkStoragePermission(storageEnum)) {
    chrome!.storage[storageEnum].onChanged.addListener(_updateFromStorageOnChanged);
  }

  return {
    get,
    set,
    getSnapshot,
    subscribe,
  };
}
