import { federation } from "@module-federation/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		react(),
		federation({
			name: "mfeDashboard",

			filename: "remoteEntry.js",

			exposes: { "./DashboardApp": "./src/App.tsx" },

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

	base: "/",
	server: {
		port: 3000,
		strictPort: true,
		cors: true,
		origin: "http://localhost:3000",
	},
	build: {
		target: "chrome89",
	},

	preview: {
		port: 3000,
		strictPort: true,
		cors: true,
	},
});
