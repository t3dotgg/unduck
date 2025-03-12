import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  build: {
    // Optimize chunk size for faster loading
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      }
    },
    // Reduce requests by bundling dependencies
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['./src/bang.ts']
        }
      }
    },
    // Generate smaller CSS
    cssCodeSplit: false,
    // Reduce lookups for unused modules
    modulePreload: {
      polyfill: false,
    },
  },
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      // Add caching strategies for better offline performance
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/unduck\.formalsnake\.dev\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'unduck-api',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24, // 1 day
              }
            }
          }
        ]
      }
    }),
  ],
});
