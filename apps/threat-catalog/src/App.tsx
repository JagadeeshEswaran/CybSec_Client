import { useMemo, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
	Search,
	ShieldAlert,
	ShieldCheck,
	Activity,
	Eye,
	X,
	ExternalLink,
	Filter,
	ArrowUpDown,
	Database,
	CalendarDays,
	Tag,
	ChevronDown,
} from "lucide-react";

import "./App.css";

type Severity = "Critical" | "High" | "Medium" | "Low";
type ThreatStatus = "New" | "Under Investigation" | "Mitigated";

interface Threat {
	id: string;
	title: string;
	description: string;
	category: string;
	severity: Severity;
	source: string;
	updatedAt: string;
	status: ThreatStatus;
	affectedAssets: string[];
	recommendedActions: string[];
}

const threats: Threat[] = [
	{
		id: "CVE-2026-10421",
		title: "Remote Code Execution in Web Framework",
		description:
			"Illustrative vulnerability record describing a remote code execution risk in a web application framework. An attacker could potentially execute unauthorized commands on an affected server.",
		category: "Vulnerability",
		severity: "Critical",
		source: "Sample Intelligence Feed",
		updatedAt: "07 Nov 2026",
		status: "Under Investigation",
		affectedAssets: ["Web Applications", "Application Servers"],
		recommendedActions: [
			"Identify affected framework versions.",
			"Review vendor security advisories.",
			"Apply the relevant security update after validation.",
		],
	},
	{
		id: "THR-2026-0082",
		title: "Ransomware Activity Targeting Enterprise Networks",
		description:
			"Illustrative ransomware intelligence describing suspicious activity targeting enterprise environments through exposed services and compromised credentials.",
		category: "Ransomware",
		severity: "Critical",
		source: "Sample Intelligence Feed",
		updatedAt: "06 Nov 2026",
		status: "New",
		affectedAssets: ["Enterprise Network", "File Servers"],
		recommendedActions: [
			"Review endpoint detection alerts.",
			"Validate recent privileged account activity.",
			"Check backup integrity and isolation.",
		],
	},
	{
		id: "THR-2026-0078",
		title: "Credential Harvesting Through Phishing Campaign",
		description:
			"Illustrative phishing campaign targeting enterprise users through deceptive login pages and credential collection techniques.",
		category: "Phishing",
		severity: "High",
		source: "Sample Intelligence Feed",
		updatedAt: "05 Nov 2026",
		status: "Under Investigation",
		affectedAssets: ["Corporate Email", "User Accounts"],
		recommendedActions: [
			"Review suspicious email reports.",
			"Block confirmed malicious domains.",
			"Reset credentials for confirmed affected accounts.",
		],
	},
	{
		id: "CVE-2026-09114",
		title: "Authentication Bypass in API Gateway",
		description:
			"Illustrative security issue involving a possible authentication bypass in an API gateway configuration.",
		category: "Vulnerability",
		severity: "High",
		source: "Sample Intelligence Feed",
		updatedAt: "04 Nov 2026",
		status: "New",
		affectedAssets: ["API Gateway", "Backend Services"],
		recommendedActions: [
			"Review gateway authentication policies.",
			"Inspect access logs for anomalous requests.",
			"Validate vendor remediation guidance.",
		],
	},
	{
		id: "THR-2026-0064",
		title: "Suspicious PowerShell Execution Patterns",
		description:
			"Illustrative threat record involving unusual PowerShell execution patterns that may indicate malicious scripting activity.",
		category: "Malware",
		severity: "Medium",
		source: "Sample Intelligence Feed",
		updatedAt: "03 Nov 2026",
		status: "Mitigated",
		affectedAssets: ["Windows Endpoints"],
		recommendedActions: [
			"Review process execution logs.",
			"Validate endpoint protection coverage.",
		],
	},
	{
		id: "THR-2026-0059",
		title: "Suspicious DNS Tunnelling Behaviour",
		description:
			"Illustrative network intelligence describing unusual DNS request patterns that could indicate covert data communication.",
		category: "Network",
		severity: "Low",
		source: "Sample Intelligence Feed",
		updatedAt: "02 Nov 2026",
		status: "New",
		affectedAssets: ["DNS Infrastructure", "Network Perimeter"],
		recommendedActions: [
			"Review DNS query volume and patterns.",
			"Investigate unusual outbound destinations.",
		],
	},
];

const severityClass = (severity: Severity) =>
	`severity-${severity.toLowerCase()}`;

function ThreatDrawer({
	threat,
	onClose,
}: {
	threat: Threat | null;
	onClose: () => void;
}) {
	useEffect(() => {
		if (!threat) return;

		const workspace = document.querySelector<HTMLElement>(".workspace");

		const previousOverflow = workspace?.style.overflowY;

		if (workspace) workspace.style.overflowY = "hidden";

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") onClose();
		};

		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			if (workspace && previousOverflow !== undefined) {
				workspace.style.overflowY = previousOverflow;
			}
		};
	}, [threat, onClose]);

	if (!threat) return null;

	return createPortal(
		<div
			className="catalog-drawer-backdrop"
			onMouseDown={(event) => {
				if (event.target === event.currentTarget) onClose();
			}}>
			<aside
				className="catalog-drawer"
				role="dialog"
				aria-modal="true"
				aria-labelledby="catalog-drawer-title">
				<header className="catalog-drawer-header">
					<div>
						<span>THREAT INTELLIGENCE</span>
						<small>Record inspection</small>
					</div>
					<button
						type="button"
						className="catalog-icon-button"
						onClick={onClose}
						aria-label="Close details">
						<X size={19} />
					</button>
				</header>

				<div className="catalog-drawer-content">
					<div className="catalog-drawer-meta">
						<span
							className={`severity-badge ${severityClass(threat.severity)}`}>
							{threat.severity}
						</span>
						<span className="catalog-category">
							<Tag size={13} /> {threat.category}
						</span>
					</div>

					<h2 id="catalog-drawer-title">{threat.title}</h2>
					<p className="catalog-drawer-description">{threat.description}</p>

					<section className="catalog-detail-card">
						<div>
							<Database size={15} />
							<span>Reference</span>
							<strong>{threat.id}</strong>
						</div>
						<div>
							<Activity size={15} />
							<span>Status</span>
							<strong>{threat.status}</strong>
						</div>
						<div>
							<CalendarDays size={15} />
							<span>Updated</span>
							<strong>{threat.updatedAt}</strong>
						</div>
						<div>
							<ExternalLink size={15} />
							<span>Source</span>
							<strong>{threat.source}</strong>
						</div>
					</section>

					<section className="catalog-detail-section">
						<h3>Affected Assets</h3>
						<div className="catalog-asset-tags">
							{threat.affectedAssets.map((asset) => (
								<span key={asset}>{asset}</span>
							))}
						</div>
					</section>

					<section className="catalog-detail-section">
						<h3>Recommended Actions</h3>
						<ul>
							{threat.recommendedActions.map((action) => (
								<li key={action}>{action}</li>
							))}
						</ul>
					</section>

					<p className="catalog-disclaimer">
						Illustrative sample record. This is not a verified security
						advisory.
					</p>
				</div>

				<footer className="catalog-drawer-footer">
					<button
						type="button"
						className="catalog-primary-button"
						onClick={onClose}>
						Close inspection
					</button>
				</footer>
			</aside>
		</div>,
		document.body,
	);
}

function App() {
	const [search, setSearch] = useState("");
	const [severityFilter, setSeverityFilter] = useState("All");
	const [categoryFilter, setCategoryFilter] = useState("All");
	const [statusFilter, setStatusFilter] = useState("All");
	const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
	const [selectedThreat, setSelectedThreat] = useState<Threat | null>(null);

	const filteredThreats = useMemo(() => {
		const query = search.trim().toLowerCase();

		return threats
			.filter((threat) => {
				const matchesSearch =
					!query ||
					threat.title.toLowerCase().includes(query) ||
					threat.id.toLowerCase().includes(query) ||
					threat.category.toLowerCase().includes(query);

				const matchesSeverity =
					severityFilter === "All" || threat.severity === severityFilter;

				const matchesCategory =
					categoryFilter === "All" || threat.category === categoryFilter;

				const matchesStatus =
					statusFilter === "All" || threat.status === statusFilter;

				return (
					matchesSearch && matchesSeverity && matchesCategory && matchesStatus
				);
			})
			.sort((a, b) => {
				const comparison = a.updatedAt.localeCompare(b.updatedAt);
				return sortOrder === "newest" ? -comparison : comparison;
			});
	}, [search, severityFilter, categoryFilter, statusFilter, sortOrder]);

	const investigationCount = threats.filter(
		(threat) => threat.status === "Under Investigation",
	).length;

	const resetFilters = () => {
		setSearch("");
		setSeverityFilter("All");
		setCategoryFilter("All");
		setStatusFilter("All");
	};

	return (
		<section className="catalog-page">
			<div className="catalog-heading">
				<div>
					<div className="catalog-eyebrow">
						<ShieldCheck size={14} />
						THREAT INTELLIGENCE
					</div>
					<h1>Threat Catalog</h1>
					<p>Discover, review and investigate security intelligence.</p>
				</div>

				<span className="catalog-sample-indicator">
					<span /> Sample dataset
				</span>
			</div>

			<div className="catalog-stats">
				<button
					className={`catalog-stat-card ${severityFilter === "All" ? "selected" : ""}`}
					onClick={() => setSeverityFilter("All")}>
					<span>Total Threats</span>
					<div>
						<strong>{threats.length}</strong>
						<Database size={19} />
					</div>
					<small>Across all categories</small>
				</button>

				<button
					className={`catalog-stat-card critical ${severityFilter === "Critical" ? "selected" : ""}`}
					onClick={() =>
						setSeverityFilter(
							severityFilter === "Critical" ? "All" : "Critical",
						)
					}>
					<span>Critical</span>
					<div>
						<strong>
							{threats.filter((t) => t.severity === "Critical").length}
						</strong>
						<ShieldAlert size={19} />
					</div>
					<small>Require immediate attention</small>
				</button>

				<button
					className={`catalog-stat-card high ${severityFilter === "High" ? "selected" : ""}`}
					onClick={() =>
						setSeverityFilter(severityFilter === "High" ? "All" : "High")
					}>
					<span>High Severity</span>
					<div>
						<strong>
							{threats.filter((t) => t.severity === "High").length}
						</strong>
						<Activity size={19} />
					</div>
					<small>Elevated risk records</small>
				</button>

				<button
					className="catalog-stat-card investigation"
					onClick={() =>
						setStatusFilter(
							statusFilter === "Under Investigation"
								? "All"
								: "Under Investigation",
						)
					}>
					<span>Under Investigation</span>
					<div>
						<strong>{investigationCount}</strong>
						<Eye size={19} />
					</div>
					<small>Currently being reviewed</small>
				</button>
			</div>

			<section className="catalog-panel">
				<div className="catalog-panel-heading">
					<div>
						<h2>Intelligence Records</h2>
						<p>Browse and inspect available threat records.</p>
					</div>
					<span className="catalog-record-count">
						{filteredThreats.length} of {threats.length} records
					</span>
				</div>

				<div className="catalog-toolbar">
					<div className="catalog-search">
						<Search size={16} />
						<input
							value={search}
							onChange={(event) => setSearch(event.target.value)}
							placeholder="Search by threat name, ID or category..."
							aria-label="Search threats"
						/>
						{search && (
							<button onClick={() => setSearch("")} aria-label="Clear search">
								<X size={15} />
							</button>
						)}
					</div>

					<label className="catalog-filter">
						<Filter size={14} />
						<select
							value={severityFilter}
							onChange={(event) => setSeverityFilter(event.target.value)}
							aria-label="Filter by severity">
							<option value="All">All severities</option>
							<option value="Critical">Critical</option>
							<option value="High">High</option>
							<option value="Medium">Medium</option>
							<option value="Low">Low</option>
						</select>
					</label>

					<label className="catalog-filter">
						<select
							value={categoryFilter}
							onChange={(event) => setCategoryFilter(event.target.value)}
							aria-label="Filter by category">
							<option value="All">All categories</option>
							<option value="Vulnerability">Vulnerability</option>
							<option value="Ransomware">Ransomware</option>
							<option value="Phishing">Phishing</option>
							<option value="Malware">Malware</option>
							<option value="Network">Network</option>
						</select>
					</label>

					<label className="catalog-filter">
						<select
							value={statusFilter}
							onChange={(event) => setStatusFilter(event.target.value)}
							aria-label="Filter by status">
							<option value="All">All statuses</option>
							<option value="New">New</option>
							<option value="Under Investigation">Under Investigation</option>
							<option value="Mitigated">Mitigated</option>
						</select>
					</label>

					<button
						className="catalog-sort-button"
						onClick={() =>
							setSortOrder(sortOrder === "newest" ? "oldest" : "newest")
						}
						title="Toggle date sorting">
						<ArrowUpDown size={14} />
						{sortOrder === "newest" ? "Newest" : "Oldest"}
					</button>
				</div>

				<div className="catalog-table-wrap">
					<table className="catalog-table">
						<thead>
							<tr>
								<th>THREAT / REFERENCE</th>
								<th>CATEGORY</th>
								<th>SEVERITY</th>
								<th>STATUS</th>
								<th>LAST UPDATED</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{filteredThreats.map((threat) => (
								<tr
									key={threat.id}
									onClick={() => setSelectedThreat(threat)}
									tabIndex={0}
									onKeyDown={(event) => {
										if (event.key === "Enter" || event.key === " ") {
											event.preventDefault();
											setSelectedThreat(threat);
										}
									}}>
									<td>
										<div className="catalog-threat-title">{threat.title}</div>
										<span className="catalog-threat-id">{threat.id}</span>
									</td>
									<td>
										<span className="catalog-category">{threat.category}</span>
									</td>
									<td>
										<span
											className={`severity-badge ${severityClass(threat.severity)}`}>
											{threat.severity}
										</span>
									</td>
									<td>
										<span
											className={`status-badge status-${threat.status.toLowerCase().replaceAll(" ", "-")}`}>
											<span />
											{threat.status}
										</span>
									</td>
									<td className="catalog-date">{threat.updatedAt}</td>
									<td>
										<button
											type="button"
											className="catalog-row-action"
											aria-label={`Inspect ${threat.id}`}
											onClick={(event) => {
												event.stopPropagation();
												setSelectedThreat(threat);
											}}>
											<Eye size={16} />
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>

					{filteredThreats.length === 0 && (
						<div className="catalog-empty-state">
							<Search size={25} />
							<strong>No matching threats found</strong>
							<p>Try changing your search or filter criteria.</p>
							<button type="button" onClick={resetFilters}>
								Clear all filters
							</button>
						</div>
					)}
				</div>

				<div className="catalog-table-footer">
					<span>Showing {filteredThreats.length} records</span>
					<span>Demo data · Not connected to a live intelligence source</span>
				</div>
			</section>

			<ThreatDrawer
				threat={selectedThreat}
				onClose={() => setSelectedThreat(null)}
			/>
		</section>
	);
}

export default App;
