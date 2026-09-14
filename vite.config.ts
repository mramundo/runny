import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// Deployed at https://<user>.github.io/runny/
const BASE = '/runny/'

export default defineConfig({
  base: BASE,
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'logo.svg', 'apple-touch-icon.png', 'robots.txt'],
      manifest: {
        name: 'Runny — weather-aware running planner',
        short_name: 'Runny',
        description:
          'Runny reads the forecast along your running route and tells you the coolest, freshest time windows to head out.',
        lang: 'en',
        dir: 'ltr',
        start_url: BASE,
        scope: BASE,
        display: 'standalone',
        orientation: 'portrait-primary',
        background_color: '#F7F7F2',
        theme_color: '#101418',
        categories: ['health', 'fitness', 'weather', 'sports'],
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2,webmanifest}'],
        navigateFallback: `${BASE}index.html`,
        // Leaflet ships a large sprite-free bundle; the map tiles below are the
        // only heavy runtime traffic, so a generous cache ceiling is fine.
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        runtimeCaching: [
          {
            // Forecast + elevation data (Open-Meteo)
            urlPattern: /^https:\/\/(api|geocoding-api)\.open-meteo\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'open-meteo',
              networkTimeoutSeconds: 8,
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Pedestrian routing (public OSM Valhalla instance)
            urlPattern: /^https:\/\/valhalla1\.openstreetmap\.de\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'valhalla',
              networkTimeoutSeconds: 20,
              expiration: { maxEntries: 40, maxAgeSeconds: 24 * 60 * 60 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Place search / autocomplete (Photon over OSM)
            urlPattern: /^https:\/\/photon\.komoot\.io\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'photon',
              networkTimeoutSeconds: 8,
              expiration: { maxEntries: 40, maxAgeSeconds: 24 * 60 * 60 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Reverse geocoding + IP country detection (drives the it/en switch)
            urlPattern: /^https:\/\/(api\.bigdatacloud\.net|ipwho\.is)\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'geo-meta',
              networkTimeoutSeconds: 6,
              expiration: { maxEntries: 20, maxAgeSeconds: 12 * 60 * 60 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Basemap tiles
            urlPattern: /^https:\/\/[a-d]?\.?basemaps\.cartocdn\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'map-tiles',
              expiration: { maxEntries: 400, maxAgeSeconds: 7 * 24 * 60 * 60 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
