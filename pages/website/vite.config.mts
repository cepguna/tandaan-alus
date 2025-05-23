import { resolve } from 'node:path';
import { withPageConfig } from '@extension/vite-config';

const rootDir = resolve(import.meta.dirname);
const srcDir = resolve(rootDir, 'src');

export default withPageConfig({
  resolve: {
    alias: {
      '@src': srcDir,
    },
  },
  server: {
    port: 3000,
  },
  publicDir: resolve(rootDir, 'public'),
  build: {
    // outDir: resolve(rootDir, '..', '..', 'dist', 'website'),
    outDir: resolve(rootDir, 'dist', 'website'),
  },
});
