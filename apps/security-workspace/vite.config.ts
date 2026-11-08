import { federation } from "@module-federation/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		react(),
		federation({
			name: "mfeSecurityWorkspace",
			filename: "remoteEntry.js",
			exposes: {
				"./Workspace": "./src/App.tsx",
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

	base: "/",

	server: {
		port: 3400,
		strictPort: true,
		cors: true,
		origin: "http://localhost:3400",
	},

	build: {
		target: "chrome89",
	},

	preview: {
		port: 3400,
		strictPort: true,
		cors: true,
	},
});
