import { exampleThemeStorage } from '@extension/storage';
import { useStorage } from '@extension/shared';
import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils';
import { Moon, Sun } from 'lucide-react';

type ToggleButtonProps = ComponentPropsWithoutRef<'button'>;

export const ToggleButton = ({ className, ...props }: ToggleButtonProps) => {
  const theme = useStorage(exampleThemeStorage);

  return (
    <button
      className={cn(
        className,
        'py-2 px-4 rounded shadow hover:scale-105',
        theme === 'light' ? 'bg-white text-black' : 'bg-black text-white',
        theme === 'light' ? 'border-black' : 'border-white',
        'border font-bold',
      )}
      onClick={exampleThemeStorage.toggle}
      {...props}>
      {theme === 'light' ? <Sun size={12} /> : <Moon size={12} />}
    </button>
  );
};
