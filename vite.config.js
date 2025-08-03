import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
   plugins: [
      react(),
      VitePWA({
         registerType: 'autoUpdate',
         includeAssets: ['css_sprites.png', 'earth.svg', 'pwa-icon-192.png', 'pwa-icon-512.png'],
         workbox: {
            globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
            maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10MB limit
            runtimeCaching: [
               {
                  urlPattern: ({ request }) => request.destination === 'document',
                  handler: 'NetworkFirst',
                  options: {
                     cacheName: 'html-cache',
                  },
               },
               {
                  urlPattern: ({ request }) =>
                     ['style', 'script', 'worker'].includes(request.destination),
                  handler: 'StaleWhileRevalidate',
                  options: {
                     cacheName: 'asset-cache',
                  },
               },
            ],
         },
         manifest: {
            name: 'Dev.tools',
            short_name: 'Dev.tools',
            start_url: '/',
            display: 'standalone',
            background_color: '#2a2a2a',
            theme_color: '#2a2a2a',
         },
      })
   ],
   server: {
      host: '0.0.0.0',
      port: 3004,
      // open: true,
      https: false,
   },
   resolve: {
      alias: {
         '@': path.resolve(__dirname, './src'),
      },
   },
});
