import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
	plugins: [
		VitePWA({
			registerType: "autoUpdate",
			workbox: {
				globPatterns: ["**/*.{js,css,html}", "assets/inter*.woff2"],
				maximumFileSizeToCacheInBytes: 3 * 1048576,
			},
		}),
	],
});
