declare module "mfeDashboard/DashboardApp" {
	import type { ComponentType } from "react";

	interface DashboardAppProps {
		onNavigate?: (module: "catalog" | "tracker" | "feeds") => void;
	}

	const DashboardApp: ComponentType<DashboardAppProps>;

	export default DashboardApp;
}

declare module "mfeThreatCatalog/Catalog" {
	import type { ComponentType } from "react";
	const Catalog: ComponentType;
	export default Catalog;
}

declare module "mfeVulnerabilityTracker/Tracker" {
	import type { ComponentType } from "react";
	const Tracker: ComponentType;
	export default Tracker;
}

declare module "mfeThreatFeeds/Feeds" {
	import type { ComponentType } from "react";
	const Feeds: ComponentType;
	export default Feeds;
}
