import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/especiales/resultados-onpe-elecciones-2026/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['legacy-js-api', 'import'],
      },
    },
  },
  server: {
    port: 5173,
  },
  build: {
    rollupOptions: {
      input: {
        main:       fileURLToPath(new URL('./index.html', import.meta.url)),
        embed:      fileURLToPath(new URL('./src/embed.js', import.meta.url)),
        testEmbed:  fileURLToPath(new URL('./test-embed.html', import.meta.url)),
      },
      output: {
        entryFileNames: (chunk) =>
          chunk.name === 'embed' ? 'embed.js' : 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: (asset) =>
          asset.name?.endsWith('.css') && asset.originalFileName?.includes('embed')
            ? 'embed.css'
            : 'assets/[name][extname]',
        manualChunks: {
          'vendor-vue':       ['vue', 'pinia', 'vue-router'],
          'vendor-d3':        ['d3', 'd3-geo', 'topojson-client'],
          'vendor-bootstrap': ['bootstrap', 'bootstrap-vue-3', '@popperjs/core'],
          'vendor-utils':     ['lodash', 'numeral', 'axios'],
        },
      },
    },
  },
})
