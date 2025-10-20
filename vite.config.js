import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Use relative paths
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use 'src/styles/variables.scss' as *;`
      }
    }
  }
});
