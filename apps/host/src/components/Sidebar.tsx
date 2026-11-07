import {
	LayoutDashboard,
	Users,
	ChartColumn,
	Building2,
	Settings,
	Layers,
	ChevronLeft,
} from "lucide-react";

export type ModuleType =
	| "dashboard"
	| "catalog"
	| "tracker"
	| "feeds"
	| "about";

interface SidebarProps {
	activeModule: ModuleType;
	onNavigate: (module: ModuleType) => void;
}

const Sidebar = ({ activeModule, onNavigate }: SidebarProps) => {
	const workspaceItems = [
		{
			id: "dashboard" as ModuleType,
			label: "Overview",
			icon: LayoutDashboard,
		},
		{
			id: "catalog" as ModuleType,
			label: "Threat Catalog",
			icon: Users,
		},
		{
			id: "tracker" as ModuleType,
			label: "Vulnerability Tracker",
			icon: ChartColumn,
		},
		{
			id: "feeds" as ModuleType,
			label: "Threat Feeds",
			icon: Building2,
		},
	];

	return (
		<aside className="sidebar">
			<div className="brand">
				<div className="brand-icon">
					<Layers size={21} />
				</div>

				<div>
					<h2>CybSec_View</h2>
					<span>APPLICATION PLATFORM</span>
				</div>
			</div>

			<div className="sidebar-content">
				<span className="nav-heading">WORKSPACE</span>

				<nav className="nav-list">
					{workspaceItems.map((item) => {
						const Icon = item.icon;

						return (
							<button
								key={item.id}
								className={`nav-item ${
									activeModule === item.id ? "active" : ""
								}`}
								onClick={() => onNavigate(item.id)}>
								<Icon size={18} />
								<span>{item.label}</span>
							</button>
						);
					})}
				</nav>

				<div className="nav-divider" />

				<span className="nav-heading">GENERAL</span>

				<button
					className={`nav-item ${activeModule === "about" ? "active" : ""}`}
					onClick={() => onNavigate("about")}>
					<Building2 size={18} />
					<span>About Us</span>
				</button>
			</div>

			<div className="sidebar-footer">
				<button className="nav-item">
					<Settings size={18} />
					<span>Settings</span>
				</button>

				<div className="version">Platform v1.0.0</div>
			</div>
		</aside>
	);
};

export default Sidebar;
