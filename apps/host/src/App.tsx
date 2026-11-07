import { Suspense, lazy, useState } from "react";
import MainLayout from "./layout/MainLayout";

import type { ModuleType } from "./components/Sidebar";

import "./App.css";

// import VanillaAboutAdapter from "./components/VanillaAboutAdapter";

const DashboardApp = lazy(() => import("mfeDashboard/DashboardApp"));
const CatalogApp = lazy(() => import("mfeThreatCatalog/Catalog"));
const TrackerApp = lazy(() => import("mfeVulnerabilityTracker/Tracker"));
const FeedsApp = lazy(() => import("mfeThreatFeeds/Feeds"));

const moduleDetails: Record<
	ModuleType,
	{ title: string; description: string }
> = {
	dashboard: {
		title: "Dashboard",
		description:
			"Get a comprehensive overview of your system's security status, recent activities, and key metrics.",
	},
	catalog: {
		title: "Threat Catalog",
		description:
			"A comprehensive repository of known threats and vulnerabilities.",
	},
	tracker: {
		title: "Vulnerability Tracker",
		description:
			"Stay updated with the latest vulnerabilities and their impact on your systems.",
	},
	feeds: {
		title: "Threat Feeds",
		description:
			"Real-time threat intelligence feeds to keep your security measures proactive and informed.",
	},
	about: {
		title: "About",
		description:
			"Learn more about the NEXUS Application Platform, its features, and its development team.",
	},
};

const App = () => {
	const [activeModule, setActiveModule] = useState<ModuleType>("dashboard");

	const renderModule = () => {
		switch (activeModule) {
			case "dashboard":
				return <DashboardApp />;

			case "catalog":
				return <CatalogApp />;

			case "tracker":
				return <TrackerApp />;

			case "feeds":
				return <FeedsApp />;

			default:
				return null;
		}
	};

	const details = moduleDetails[activeModule];

	return (
		<MainLayout activeModule={activeModule} onNavigate={setActiveModule}>
			<div className="page-heading">
				<div>
					<h1>{details.title}</h1>
					<p>{details.description}</p>
				</div>
			</div>

			<section className="module-container">
				<Suspense
					fallback={
						<div className="loading-state">
							<span className="loader" />
							Loading module...
						</div>
					}>
					{renderModule()}
				</Suspense>
			</section>
		</MainLayout>
	);
};

export default App;
