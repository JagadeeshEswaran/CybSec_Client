import { useState } from "react";
import Sidebar, { type ModuleType } from "../components/Sidebar";

import Topbar from "../components/Topbar";

interface MainLayoutProps {
	activeModule: ModuleType;
	onNavigate: (module: ModuleType) => void;
	children: React.ReactNode;
}

const MainLayout = ({
	activeModule,
	onNavigate,
	children,
}: MainLayoutProps) => {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<div className="app-shell">
			<div className={`sidebar-container ${sidebarOpen ? "sidebar-open" : ""}`}>
				<Sidebar
					activeModule={activeModule}
					onNavigate={(module) => {
						onNavigate(module);
						setSidebarOpen(false);
					}}
				/>
			</div>

			{sidebarOpen && (
				<div
					className="sidebar-overlay"
					onClick={() => setSidebarOpen(false)}
				/>
			)}

			<div className="main-section">
				<Topbar onMenuClick={() => setSidebarOpen(true)} />

				<main className="workspace">{children}</main>

				<footer className="app-footer">
					<span>NEXUS Platform</span>
					<span>© 2026 All rights reserved</span>
				</footer>
			</div>
		</div>
	);
};

export default MainLayout;
