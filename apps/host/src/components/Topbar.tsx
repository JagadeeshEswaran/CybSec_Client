import {
	Search,
	Bell,
	ChevronDown,
	Menu,
	Sun,
	Moon,
	Monitor,
} from "lucide-react";

import { useTheme, type ThemePreference } from "../context/ThemeContext";

interface TopbarProps {
	onMenuClick: () => void;
}

const Topbar = ({ onMenuClick }: TopbarProps) => {
	const { preference, setPreference } = useTheme();

	const ThemeIcon =
		preference === "light" ? Sun : preference === "dark" ? Moon : Monitor;

	return (
		<header className="topbar">
			<button
				className="mobile-menu"
				onClick={onMenuClick}
				aria-label="Open navigation">
				<Menu size={20} />
			</button>

			<div className="breadcrumb">
				<span>Workspace</span>
				<span>/</span>
				<strong>CybSec_View</strong>
			</div>

			<div className="topbar-actions">
				<button className="icon-button" aria-label="Search">
					<Search size={19} />
				</button>

				<button className="icon-button notification" aria-label="Notifications">
					<Bell size={19} />
					<span />
				</button>

				<label className="theme-selector" title="Choose appearance">
					<ThemeIcon size={17} />

					<select
						aria-label="Theme preference"
						value={preference}
						onChange={(event) =>
							setPreference(event.target.value as ThemePreference)
						}>
						<option value="system">System</option>
						<option value="light">Light</option>
						<option value="dark">Dark</option>
					</select>
				</label>

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
