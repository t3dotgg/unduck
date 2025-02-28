import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    VitePWA({
      workbox: {
        maximumFileSizeToCacheInBytes: 3145728, // 3MB
      },
      registerType: "autoUpdate",
    }),
  ],
});
