import baseConfig from '@extension/tailwindcss-config';
const { fontFamily } = require('tailwindcss/defaultTheme');

import { withUI } from '@extension/ui';

export default withUI({
  ...baseConfig,
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  extend: {
    fontFamily: {
      sans: ['var(--font-sans)', ...fontFamily.sans],
      mono: ['var(--font-mono)', ...fontFamily.mono],
    },
    keyframes: {
      'caret-blink': {
        '0%,70%,100%': { opacity: '1' },
        '20%,50%': { opacity: '0' },
      },
    },
    animation: {
      'caret-blink': 'caret-blink 1.25s ease-out infinite',
    },
  },
});
