import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const rootDir = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.join(rootDir, 'public', 'data-primera-vuelta')
const dataSegundaDir = path.join(rootDir, 'public', 'data-segunda-vuelta')

export default defineConfig({
  plugins: [
    vue(),
    // Serve public/data-primera-vuelta at /data-primera-vuelta in dev (avoids 404 with base path)
    {
      name: 'serve-data-primera',
      configureServer(server) {
        server.middlewares.use('/data-primera-vuelta', (req, res, next) => {
          const name = (req.url || '/').replace(/^\//, '').replace(/[?#].*$/, '') || 'index.json'
          if (!name || name.includes('..')) return next()
          const file = path.join(dataDir, name)
          if (fs.existsSync(file) && fs.statSync(file).isFile()) {
            res.setHeader('Content-Type', 'application/json')
            res.end(fs.readFileSync(file))
          } else {
            next()
          }
        })
      },
    },
    // Serve public/data-segunda-vuelta at /data-segunda-vuelta in dev.
    {
      name: 'serve-data-segunda',
      configureServer(server) {
        server.middlewares.use('/data-segunda-vuelta', (req, res, next) => {
          const name = (req.url || '/').replace(/^\//, '').replace(/[?#].*$/, '') || 'index.json'
          if (!name || name.includes('..')) return next()
          const file = path.join(dataSegundaDir, name)
          if (fs.existsSync(file) && fs.statSync(file).isFile()) {
            res.setHeader('Content-Type', 'application/json')
            res.end(fs.readFileSync(file))
          } else {
            next()
          }
        })
      },
    },
  ],
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
    proxy: {
      // Dev-only proxy for ONPE backend to avoid browser CORS issues.
      '/onpe-backend': {
        target: 'https://resultadoelectoral.onpe.gob.pe',
        changeOrigin: true,
        secure: true,
        rewrite: (p) => p.replace(/^\/onpe-backend/, '/presentacion-backend'),
        configure(proxy) {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Referer', 'https://resultadoelectoral.onpe.gob.pe/main/resumen')
            proxyReq.setHeader('Origin', 'https://resultadoelectoral.onpe.gob.pe')
          })
        },
      },
    },
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
