import { Suspense, lazy, useState } from "react";
import MainLayout from "./layout/MainLayout";

import type { ModuleType } from "./components/Sidebar";

import "./App.css";

// import VanillaAboutAdapter from "./components/VanillaAboutAdapter";

const DashboardApp = lazy(() => import("mfeDashboard/DashboardApp"));
const CatalogApp = lazy(() => import("mfeThreatCatalog/Catalog"));
const TrackerApp = lazy(() => import("mfeVulnerabilityTracker/Tracker"));
const FeedsApp = lazy(() => import("mfeThreatFeeds/Feeds"));
const SecurityWorkspace = lazy(() => import("mfeSecurityWorkspace/Workspace"));

const App = () => {
	const [activeModule, setActiveModule] = useState<ModuleType>("dashboard");

	const renderModule = () => {
		switch (activeModule) {
			case "dashboard":
				return (
					<DashboardApp onNavigate={(module) => setActiveModule(module)} />
				);

			case "catalog":
				return <CatalogApp />;

			case "tracker":
				return <TrackerApp />;

			case "feeds":
				return <FeedsApp />;

			case "workspace":
				return <SecurityWorkspace />;

			default:
				return null;
		}
	};

	return (
		<MainLayout activeModule={activeModule} onNavigate={setActiveModule}>
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
