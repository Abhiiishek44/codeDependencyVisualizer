import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  root: resolve(__dirname, 'src/renderer'),

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src/renderer'),
      '@shared': resolve(__dirname, 'src/shared'),
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },

  build: {
    outDir: resolve(__dirname, 'dist/renderer'),
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: resolve(__dirname, 'src/renderer/index.html'),
    },
  },

  server: {
    port: 5173,
    strictPort: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },

  // Prevent Vite from exposing process.env to the renderer — use contextBridge instead
  define: {
    'process.env': {},
    'process.platform': JSON.stringify(process.platform),
  },

  css: {
    devSourcemap: true,
  },
});
