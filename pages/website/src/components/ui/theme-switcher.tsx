import { Button } from '@extension/ui';
import { useTheme } from '@src/contexts/theme-context';
import { Moon, Sun } from 'lucide-react';
import { useEffect } from 'react';

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  const handleToggle = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  /* Update theme-color meta tag
   * when theme is updated */
  useEffect(() => {
    const themeColor = theme === 'dark' ? '#020817' : '#fff';
    const metaThemeColor = document.querySelector("meta[name='theme-color']");
    if (metaThemeColor) metaThemeColor.setAttribute('content', themeColor);
  }, [theme]);
  return (
    <Button
      onClick={handleToggle}
      size={'icon'}
      className="rounded-full"
      variant={'outline'}
      aria-label="theme switcher">
      {theme === 'light' ? <Sun /> : <Moon />}
    </Button>
  );
};
