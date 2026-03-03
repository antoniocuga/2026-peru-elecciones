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
          chunk.name === 'embed' ? 'embed.[hash].js' : 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: (asset) =>
          asset.name?.endsWith('.css') && asset.originalFileName?.includes('embed')
            ? 'embed.[hash].css'
            : 'assets/[name].[hash][extname]',
      },
    },
  },
})
