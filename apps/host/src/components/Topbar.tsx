import { Search, Bell, ChevronDown, Menu } from "lucide-react";

interface TopbarProps {
	onMenuClick: () => void;
}

const Topbar = ({ onMenuClick }: TopbarProps) => {
	return (
		<header className="topbar">
			<button className="mobile-menu" onClick={onMenuClick}>
				<Menu size={20} />
			</button>

			<div className="breadcrumb">
				<span>Workspace</span>
				<span>/</span>
				<strong>Application Platform</strong>
			</div>

			<div className="topbar-actions">
				<button className="icon-button">
					<Search size={19} />
				</button>

				<button className="icon-button notification">
					<Bell size={19} />
					<span />
				</button>

				<div className="profile">
					<div className="avatar">JE</div>

					<div className="profile-info">
						<strong>Administrator</strong>
						<span>Platform Admin</span>
					</div>

					<ChevronDown size={15} />
				</div>
			</div>
		</header>
	);
};

export default Topbar;
