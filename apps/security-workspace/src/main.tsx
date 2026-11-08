import React from "react";
import ReactDOM from "react-dom/client";
import { ProfileProvider } from "@cybsec/shared-profile";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<ProfileProvider>
			<App />
		</ProfileProvider>
	</React.StrictMode>,
);
