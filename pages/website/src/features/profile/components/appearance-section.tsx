import { Redo, CheckIcon, MoonIcon, SunIcon } from 'lucide-react';
import {
  Button,
  buttonVariants,
  cn,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from '@extension/ui';
import { useTheme } from '@src/contexts/theme-context';
import { useThemeGenerator } from '@src/lib/utils/theme';

export function AppearanceSection() {
  const { setTheme: setMode, theme: mode } = useTheme();
  const {
    currentBorderRadius,
    borderRadius,
    updateBorderRadius,
    updateGrayColor,
    currentGrayColor,
    currentFontFamily,
    grayColors,
    currentAccentColor,
    fontFamilies,
    themes,
    updateAccentColor,
    updateFontFamily,
    reset,
  } = useThemeGenerator();

  return (
    <div className="w-full">
      <h5>Customize Theme</h5>
      <p>Pick a style and color for your components.</p>
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-1 flex-col space-y-4 overflow-y-auto px-1 py-3 md:space-y-6">
          <div className="space-y-1.5">
            <Label className="text-xs">Font</Label>
            <Select
              value={currentFontFamily.label}
              onValueChange={key => updateFontFamily(fontFamilies.find(f => f.label === key) ?? fontFamilies[2])}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a font" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Font</SelectLabel>
                  {fontFamilies.map(item => (
                    <SelectItem key={item.label} value={item.label}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Base Color</Label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {grayColors.map(theme => (
                <Button
                  key={theme.name}
                  variant="outline"
                  size="sm"
                  className={cn(
                    buttonVariants({
                      size: 'sm',
                      variant: 'outline',
                      className: 'justify-start text-xs cursor-pointer',
                    }),
                    currentGrayColor === theme.name && 'border-2 border-primary',
                  )}
                  onClick={() => updateGrayColor(theme.name)}>
                  <span
                    className={cn(
                      'mr-1 flex size-4 shrink-0 -translate-x-1 items-center justify-center rounded-full',
                      theme.name,
                    )}>
                    {currentGrayColor === theme.name && (
                      <CheckIcon className={cn('size-3 text-white', theme.name === 'zinc' && 'text-black')} />
                    )}
                  </span>
                  {theme.label}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Accent Color</Label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {themes.map(theme => (
                <Button
                  key={theme.name}
                  variant="outline"
                  size="sm"
                  className={cn(
                    buttonVariants({
                      variant: 'outline',
                      size: 'sm',
                      className: 'justify-start cursor-pointer',
                    }),
                    currentAccentColor === theme.name && 'border-2 border-primary',
                  )}
                  onClick={() => updateAccentColor(theme.name)}>
                  <span
                    className={cn(
                      'mr-1 flex size-4 shrink-0 -translate-x-1 items-center justify-center rounded-full',
                      theme.name,
                    )}>
                    {currentAccentColor === theme.name && (
                      <CheckIcon className={cn('size-3 text-white', theme.name === 'zinc' && 'text-black')} />
                    )}
                  </span>
                  {theme.label}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Radius</Label>
            <div className="grid grid-cols-5 gap-2">
              {borderRadius.map(value => (
                <Button
                  variant="outline"
                  size="sm"
                  key={value}
                  onClick={() => updateBorderRadius(value)}
                  className={cn(currentBorderRadius === value && 'border-2 border-primary')}>
                  {value}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Mode</Label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMode('light')}
                className={cn(mode === 'light' && 'border-2 border-primary')}>
                <SunIcon className="mr-1 size-4 -translate-x-1" />
                Light
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMode('dark')}
                className={cn(mode === 'dark' && 'border-2 border-primary')}>
                <MoonIcon className="mr-1 size-4 -translate-x-1" />
                Dark
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-4 border-t border-border py-4">
        <Button variant="secondary" onClick={() => reset()}>
          <Redo className="mr-1" /> Reset
          <span className="sr-only">Reset</span>
        </Button>
      </div>
    </div>
  );
}
