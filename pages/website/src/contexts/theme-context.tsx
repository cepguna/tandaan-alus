import type { GrayColor, ThemeColor } from '@src/lib/constants/theme';
import {
  syncBorderRadius,
  syncFontFamily,
  syncGrayColor,
  syncThemeColor,
  type BorderRadius,
  type FontFamily,
} from '@src/lib/utils/theme';
import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type Actions = {
  setAccentColor: (color: ThemeColor) => void;
  setGrayColor: (color: GrayColor) => void;
  setFontFamily: (font: FontFamily) => void;
  setBorderRadius: (radius: BorderRadius) => void;
  setStyle: (style: 'default' | 'new-york') => void;
  setPackageManager: (pm: 'npm' | 'pnpm' | 'bun' | 'yarn') => void;
  reset: () => void;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  accentColor: ThemeColor;
  borderRadius: BorderRadius;
  fontFamily: FontFamily;
  grayColor: GrayColor;
  style: 'default' | 'new-york';
  packageManager: 'npm' | 'pnpm' | 'bun' | 'yarn';
} & Actions;

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
  accentColor: 'zinc',
  style: 'default',
  borderRadius: '0.5',
  fontFamily: {
    label: 'Outfit',
    value: '--font-outfit',
  },
  grayColor: 'zinc',
  packageManager: 'npm',
  setAccentColor: () => null,
  setGrayColor: () => null,
  setFontFamily: () => null,
  setBorderRadius: () => null,
  setStyle: () => null,
  setPackageManager: () => null,
  reset: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'vite-ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(`${storageKey}:theme`) as Theme) || defaultTheme,
  );
  const [accentColor, setAccentColor] = useState<ThemeColor>(
    () => (localStorage.getItem(`${storageKey}:accentColor`) as ThemeColor) || 'zinc',
  );
  const [grayColor, setGrayColor] = useState<GrayColor>(
    () => (localStorage.getItem(`${storageKey}:grayColor`) as GrayColor) || 'zinc',
  );
  const [fontFamily, setFontFamily] = useState<FontFamily>(() => {
    const stored = localStorage.getItem(`${storageKey}:fontFamily`);
    return stored ? JSON.parse(stored) : { label: 'Outfit', value: '--font-outfit' };
  });
  const [borderRadius, setBorderRadius] = useState<BorderRadius>(
    () => localStorage.getItem(`${storageKey}:borderRadius`) || '0.5',
  );
  const [style, setStyle] = useState<'default' | 'new-york'>(
    () => (localStorage.getItem(`${storageKey}:style`) as 'default' | 'new-york') || 'default',
  );
  const [packageManager, setPackageManager] = useState<'npm' | 'pnpm' | 'bun' | 'yarn'>(
    () => (localStorage.getItem(`${storageKey}:packageManager`) as 'npm' | 'pnpm' | 'bun' | 'yarn') || 'npm',
  );

  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = (theme: Theme) => {
      root.classList.remove('light', 'dark');
      const systemTheme = mediaQuery.matches ? 'dark' : 'light';
      const effectiveTheme = theme === 'system' ? systemTheme : theme;
      root.classList.add(effectiveTheme);

      // Apply other theme settings
      root.style.setProperty('--accent-color', accentColor);
      root.style.setProperty('--gray-color', grayColor);
      // root.style.setProperty('--font-family', fontFamily.value);
      root.style.setProperty('--border-radius', `${borderRadius}rem`);
      root.setAttribute('data-style', style);
      root.setAttribute('data-package-manager', packageManager);
    };

    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };

    applyTheme(theme);

    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, accentColor, grayColor, fontFamily, borderRadius, style, packageManager]);

  const handleSetTheme = (newTheme: Theme) => {
    localStorage.setItem(`${storageKey}:theme`, newTheme);
    setTheme(newTheme);
  };

  const handleSetAccentColor = (color: ThemeColor) => {
    localStorage.setItem(`${storageKey}:accentColor`, color);
    setAccentColor(color);
  };

  const handleSetGrayColor = (color: GrayColor) => {
    localStorage.setItem(`${storageKey}:grayColor`, color);
    setGrayColor(color);
  };

  const handleSetFontFamily = (font: FontFamily) => {
    localStorage.setItem(`${storageKey}:fontFamily`, JSON.stringify(font));
    setFontFamily(font);
  };

  const handleSetBorderRadius = (radius: BorderRadius) => {
    localStorage.setItem(`${storageKey}:borderRadius`, radius);
    setBorderRadius(radius);
  };

  const handleSetStyle = (newStyle: 'default' | 'new-york') => {
    localStorage.setItem(`${storageKey}:style`, newStyle);
    setStyle(newStyle);
  };

  const handleSetPackageManager = (pm: 'npm' | 'pnpm' | 'bun' | 'yarn') => {
    localStorage.setItem(`${storageKey}:packageManager`, pm);
    setPackageManager(pm);
  };

  const reset = () => {
    localStorage.removeItem(`${storageKey}:theme`);
    localStorage.removeItem(`${storageKey}:accentColor`);
    localStorage.removeItem(`${storageKey}:grayColor`);
    localStorage.removeItem(`${storageKey}:fontFamily`);
    localStorage.removeItem(`${storageKey}:borderRadius`);
    localStorage.removeItem(`${storageKey}:style`);
    localStorage.removeItem(`${storageKey}:packageManager`);

    setTheme(defaultTheme);
    setAccentColor('zinc');
    setGrayColor('zinc');
    setFontFamily({ label: 'Outfit', value: '--font-outfit' });
    setBorderRadius('0.5');
    setStyle('default');
    setPackageManager('npm');
  };

  const value = {
    theme,
    setTheme: handleSetTheme,
    accentColor,
    setAccentColor: handleSetAccentColor,
    grayColor,
    setGrayColor: handleSetGrayColor,
    fontFamily,
    setFontFamily: handleSetFontFamily,
    borderRadius,
    setBorderRadius: handleSetBorderRadius,
    style,
    setStyle: handleSetStyle,
    packageManager,
    setPackageManager: handleSetPackageManager,
    reset,
  };

  useEffect(() => {
    syncGrayColor(value.grayColor, theme);
  }, [value.grayColor, theme]);

  useEffect(() => {
    syncThemeColor(value.accentColor, theme);
  }, [value.accentColor, theme]);

  useEffect(() => {
    syncFontFamily(value.fontFamily);
  }, [value.fontFamily]);

  useEffect(() => {
    syncBorderRadius(value.borderRadius);
  }, [value.borderRadius]);

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};
