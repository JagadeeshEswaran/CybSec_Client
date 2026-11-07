import { federation } from "@module-federation/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		react(),
		federation({
			name: "host",

			remotes: {
				mfeDashboard: {
					type: "module",
					name: "mfeDashboard",
					entry: "http://localhost:3000/remoteEntry.js",
				},

				mfeThreatCatalog: {
					type: "module",
					name: "mfeThreatCatalog",
					entry: "http://localhost:3100/remoteEntry.js",
				},

				mfeThreatFeeds: {
					type: "module",
					name: "mfeThreatFeeds",
					entry: "http://localhost:3200/remoteEntry.js",
				},

				mfeVulnerabilityTracker: {
					type: "module",
					name: "mfeVulnerabilityTracker",
					entry: "http://localhost:3300/remoteEntry.js",
				},
			},

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

	server: {
		port: 4000,
		strictPort: true,
	},

	build: {
		target: "chrome89",
	},
});
