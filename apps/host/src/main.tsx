import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { ProfileProvider } from "@cybsec/shared-profile";

import App from "./App";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ProfileProvider>
			<App />
		</ProfileProvider>
	</StrictMode>,
);
