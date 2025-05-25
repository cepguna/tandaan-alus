import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const rootDir = resolve(import.meta.dirname);
const srcDir = resolve(rootDir, 'src');

export default defineConfig({
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
    outDir: resolve(rootDir, '..', '..', 'dist', 'website'),
    // outDir: resolve(rootDir, 'dist', 'website'),
  },
});
