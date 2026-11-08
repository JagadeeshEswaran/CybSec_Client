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
					entry: `${process.env.VITE_MFE_DASHBOARD_URL ?? "http://localhost:3000"}/remoteEntry.js`,
				},

				mfeThreatCatalog: {
					type: "module",
					name: "mfeThreatCatalog",
					entry: `${process.env.VITE_MFE_CATALOG_URL ?? "http://localhost:3100"}/remoteEntry.js`,
				},

				mfeThreatFeeds: {
					type: "module",
					name: "mfeThreatFeeds",
					entry: `${process.env.VITE_MFE_FEEDS_URL ?? "http://localhost:3200"}/remoteEntry.js`,
				},

				mfeVulnerabilityTracker: {
					type: "module",
					name: "mfeVulnerabilityTracker",
					entry: `${process.env.VITE_MFE_VULNERABILITY_URL ?? "http://localhost:3300"}/remoteEntry.js`,
				},

				mfeSecurityWorkspace: {
					type: "module",
					name: "mfeSecurityWorkspace",
					entry: `${process.env.VITE_MFE_WORKSPACE_URL ?? "http://localhost:3400"}/remoteEntry.js`,
				},
			},

			shared: {
				react: {
					singleton: true,
				},
				"react-dom": {
					singleton: true,
				},
				"@cybsec/shared-profile": {
					singleton: true,
					requiredVersion: "1.0.0",
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
