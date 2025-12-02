import { defineConfig } from 'vite';

export default defineConfig({
  root: './',
  base: '/caromeartes/',
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});
