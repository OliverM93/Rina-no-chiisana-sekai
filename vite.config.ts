import { defineConfig } from 'vitest/config';
import preact from '@preact/preset-vite';

// `base: './'` sorgt dafür, dass der Build sowohl lokal als auch unter
// https://<user>.github.io/Rina-no-chiisana-sekai/ funktioniert.
export default defineConfig({
  base: './',
  plugins: [preact()],
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 2000,
  },
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
});
