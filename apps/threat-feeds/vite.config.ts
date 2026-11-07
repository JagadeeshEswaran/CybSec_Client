import { federation } from "@module-federation/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		react(),

		federation({
			name: "mfeThreatFeeds",

			filename: "remoteEntry.js",

			exposes: { "./Feeds": "./src/App.tsx" },

			shared: {
				react: {
					singleton: true,
				},
				"react-dom": {
					singleton: true,
				},
			},
		}),
	],

	base: "http://localhost:3200/",
	server: {
		port: 3200,
		strictPort: true,
		cors: true,
		origin: "http://localhost:3200",
	},

	build: {
		target: "chrome89",
	},

	preview: {
		port: 3200,
		strictPort: true,
		cors: true,
	},
});
