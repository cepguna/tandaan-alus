import type { BaseStorage } from '../base/index.js';
import { createStorage, StorageEnum } from '../base/index.js';

type Theme = 'light' | 'dark';

type ThemeStorage = BaseStorage<Theme> & {
  toggle: () => Promise<void>;
};

const storage = createStorage<Theme>('theme-storage-key', 'light', {
  storageEnum: StorageEnum.Local,
  liveUpdate: true,
});

// You can extend it with your own methods
export const exampleThemeStorage: ThemeStorage = {
  ...storage,
  toggle: async () => {
    await storage.set(currentTheme => {
      return currentTheme === 'light' ? 'dark' : 'light';
    });
  },
};

const token = createStorage<string>('__convexAuthJWT_httpskeenpika344convexcloud', '', {
  storageEnum: StorageEnum.Local,
  liveUpdate: true,
});

// You can extend it with your own methods
export const tokenStorage: BaseStorage<string> = {
  ...token,
};

const refreshToken = createStorage<string>('__convexAuthRefreshToken_httpskeenpika344convexcloud', '', {
  storageEnum: StorageEnum.Local,
  liveUpdate: true,
});

// You can extend it with your own methods
export const refreshTokenStorage: BaseStorage<string> = {
  ...refreshToken,
};

const fontFamily = createStorage<string>('vite-ui-theme:fontFamily', '', {
  storageEnum: StorageEnum.Local,
  liveUpdate: true,
});

// You can extend it with your own methods
export const fontFamilyStorage: BaseStorage<string> = {
  ...fontFamily,
};
