import type { GrayColor, ThemeColor } from '@src/lib/constants/theme';
import { grayColors, themes } from '@src/lib/constants/theme';
import { useTheme } from '@src/contexts/theme-context';

const borderRadiusArray = ['0', '0.3', '0.5', '0.75', '1'] as const;

export type BorderRadius = (typeof borderRadiusArray)[number];

export const useThemeGenerator = () => {
  const {
    accentColor,
    grayColor,
    fontFamily,
    style,
    setAccentColor,
    setGrayColor,
    setFontFamily,
    setBorderRadius,
    setStyle,
    borderRadius,
    reset,
  } = useTheme();
  const currentAccentColor = accentColor;
  const currentGrayColor = grayColor;
  const currentFontFamily = fontFamily;
  const currentBorderRadius = borderRadius;
  const currentStyle = style;

  const updateAccentColor = setAccentColor;
  const updateGrayColor = setGrayColor;
  const updateFontFamily = setFontFamily;
  const updateBorderRadius = setBorderRadius;
  const updateStyle = setStyle;

  return {
    themes,
    fontFamilies,
    grayColors,
    currentAccentColor,
    currentBorderRadius,
    borderRadius: borderRadiusArray,
    currentFontFamily,
    currentGrayColor,
    updateAccentColor,
    updateGrayColor,
    updateFontFamily,
    updateBorderRadius,
    updateStyle,
    currentStyle,
    reset,
  };
};

export type ThemeConfig = {
  code: string;
  config: string;
};

export const syncGrayColor = (color: GrayColor, resolvedTheme: string | undefined) => {
  const root = document.querySelector<HTMLHtmlElement>(':root');
  const iframes = document.querySelectorAll<HTMLIFrameElement>('iframe.chunk-mode');
  if (!root) return;

  const grayColor = grayColors.find(c => c.name === color);

  const vars = (resolvedTheme === 'light' ? { ...grayColor?.cssVars.light! } : { ...grayColor?.cssVars.dark! }) as {
    [key: string]: string;
  };

  Object.keys(vars)?.forEach(variable => {
    root.style.setProperty(`--${variable}`, `${vars[variable]}`);
  });

  iframes.forEach(iframe => {
    !!iframe.contentWindow?.document.documentElement.style &&
      iframe.contentWindow?.document.documentElement.style?.setProperty(
        '--background',
        resolvedTheme === 'light' ? `${grayColor?.cssVars.light.background}` : `${grayColor?.cssVars.dark.background}`,
      );
  });
  root.style.setProperty(
    '--background',
    resolvedTheme === 'light' ? `${grayColor?.cssVars.light.background}` : `${grayColor?.cssVars.dark.background}`,
  );
};

export const syncThemeColor = (color: ThemeColor, resolvedTheme: string | undefined) => {
  const root = document.querySelector<HTMLHtmlElement>(':root');
  const iframes = document.querySelectorAll<HTMLIFrameElement>('iframe.chunk-mode');
  if (!root) return;

  const grayColor = themes.find(c => c.name === color);

  const vars = (resolvedTheme === 'light' ? { ...grayColor?.cssVars.light! } : { ...grayColor?.cssVars.dark! }) as {
    [key: string]: string;
  };

  Object.keys(vars)?.forEach(variable => {
    root.style.setProperty(`--${variable}`, `${vars[variable]}`);
    iframes.forEach(iframe => {
      !!iframe.contentWindow?.document.documentElement.style &&
        iframe.contentWindow?.document.documentElement.style?.setProperty(`--${variable}`, `${vars[variable]}`);
    });
  });
};

export const syncBorderRadius = (borderRadius: BorderRadius) => {
  const root = document.querySelector<HTMLHtmlElement>(':root');
  const iframes = document.querySelectorAll<HTMLIFrameElement>('iframe.chunk-mode');
  if (!root) return;
  root.style.setProperty('--radius', `${borderRadius}rem`);
  iframes.forEach(iframe => {
    !!iframe.contentWindow?.document.documentElement.style &&
      iframe.contentWindow?.document.documentElement.style?.setProperty('--radius', `${borderRadius}rem`);
  });
};

export const syncFontFamily = (fontFamily: FontFamily) => {
  const root = document.querySelector<HTMLHtmlElement>(':root');
  const iframes = document.querySelectorAll<HTMLIFrameElement>('iframe.chunk-mode');
  if (root) {
    root.style.setProperty('--font-sans', `var(${fontFamily.value})`);
  }
  iframes.forEach(iframe => {
    !!iframe.contentWindow?.document.documentElement.style &&
      iframe.contentWindow?.document.documentElement.style?.setProperty('--font-sans', `var(${fontFamily.value})`);
  });
};

export const syncIframeGrayColor = (id: string, color: GrayColor, resolvedTheme: string | undefined) => {
  const iframe = document.getElementById(id) as HTMLIFrameElement;
  if (!iframe) return;

  const grayColor = grayColors.find(c => c.name === color);

  const vars = (resolvedTheme === 'light' ? { ...grayColor?.cssVars.light! } : { ...grayColor?.cssVars.dark! }) as {
    [key: string]: string;
  };

  Object.keys(vars)?.forEach(variable => {
    iframe.contentWindow?.document.documentElement?.style.setProperty(`--${variable}`, `${vars[variable]}`);
  });

  iframe.contentWindow?.document.documentElement?.style.setProperty(
    '--background',
    resolvedTheme === 'light' ? `${grayColor?.cssVars.light.background}` : `${grayColor?.cssVars.dark.background}`,
  );
};

export const syncIframeThemeColor = (id: string, color: ThemeColor, resolvedTheme: string | undefined) => {
  const iframe = document.getElementById(id) as HTMLIFrameElement;
  if (!iframe) return;

  const grayColor = themes.find(c => c.name === color);

  const vars = (resolvedTheme === 'light' ? { ...grayColor?.cssVars.light! } : { ...grayColor?.cssVars.dark! }) as {
    [key: string]: string;
  };

  Object.keys(vars)?.forEach(variable => {
    iframe.contentWindow?.document.documentElement?.style.setProperty(`--${variable}`, `${vars[variable]}`);
  });
};

export const syncIframeBorderRadius = (id: string, borderRadius: BorderRadius) => {
  const iframe = document.getElementById(id) as HTMLIFrameElement;
  if (!iframe) return;

  iframe.contentWindow?.document.documentElement?.style.setProperty('--radius', `${borderRadius}rem`);
};

export const syncIframeFontFamily = (id: string, fontFamily: FontFamily) => {
  const iframe = document.getElementById(id) as HTMLIFrameElement;
  if (!iframe) return;

  iframe.contentWindow?.document.documentElement?.style.setProperty('--font-sans', `var(${fontFamily.value})`);
};

export type FontFamily = (typeof fontFamilies)[number];
export const fontFamilies = [
  {
    label: 'Jakarta',
    value: '--font-jakarta',
  },
  {
    label: 'Inter',
    value: '--font-inter',
  },
  {
    label: 'Outfit',
    value: '--font-outfit',
  },
  {
    label: 'Raleway',
    value: '--font-raleway',
  },
  {
    label: 'Josefin',
    value: '--font-josefin',
  },
] as const;
