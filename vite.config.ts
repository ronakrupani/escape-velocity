import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// GitHub Pages serves the site from /escape-velocity/. Dev runs at the root.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/escape-velocity/' : '/',
  // Lets several dev servers share one node_modules (e.g. git worktrees).
  cacheDir: process.env.VITE_CACHE_DIR ?? 'node_modules/.vite',
  plugins: [react(), tailwindcss()],
  assetsInclude: ['**/*.glsl'],
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three/')) return 'three';
          if (id.includes('node_modules/@react-three/') || id.includes('node_modules/postprocessing')) return 'r3f';
        },
      },
    },
  },
}));
