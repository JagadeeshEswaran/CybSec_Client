import { useEffect, useRef, useState } from "react";
import Sidebar, { type ModuleType } from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { ThemeProvider } from "../context/ThemeContext";

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
	const workspaceRef = useRef<HTMLElement>(null);

	useEffect(() => {
		workspaceRef.current?.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	}, [activeModule]);

	return (
		<ThemeProvider>
			<div className="app-shell">
				<div
					className={`sidebar-container ${sidebarOpen ? "sidebar-open" : ""}`}>
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

					<main className="workspace" ref={workspaceRef}>
						{children}
					</main>

					<footer className="app-footer">
						<span>CybSec_View Platform</span>
						<span>© 2026 All rights reserved</span>
					</footer>
				</div>
			</div>
		</ThemeProvider>
	);
};

export default MainLayout;
