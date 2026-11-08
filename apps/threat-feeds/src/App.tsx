import { useMemo, useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
	Activity,
	Radio,
	CheckCircle2,
	AlertTriangle,
	PauseCircle,
	Search,
	Filter,
	ArrowUpDown,
	Eye,
	X,
	Database,
	Clock3,
	Globe2,
	RefreshCw,
	Layers3,
	Server,
} from "lucide-react";

import "./App.css";

type FeedStatus = "Healthy" | "Degraded" | "Paused";
type FeedType = "TAXII" | "RSS" | "API" | "STIX";

interface ThreatFeed {
	id: string;
	name: string;
	description: string;
	provider: string;
	type: FeedType;
	status: FeedStatus;
	endpoint: string;
	lastSync: string;
	nextSync: string;
	recordsToday: number;
	totalRecords: number;
	syncFrequency: string;
	coverage: string[];
	healthMessage: string;
}

const initialFeeds: ThreatFeed[] = [
	{
		id: "FEED-001",
		name: "CISA Known Exploited Vulnerabilities",
		description:
			"A catalog of vulnerabilities that have been exploited in the wild, maintained by the Cybersecurity and Infrastructure Security Agency.",
		provider: "CISA",
		type: "API",
		status: "Healthy",
		endpoint: "https://example.invalid/cisa/kev",
		lastSync: "07 Nov 2026, 09:42",
		nextSync: "07 Nov 2026, 10:00",
		recordsToday: 124,
		totalRecords: 2840,
		syncFrequency: "Every 15 minutes",
		coverage: ["Known exploited vulnerabilities", "CVE intelligence"],
		healthMessage: "Last synchronization completed successfully.",
	},
	{
		id: "FEED-002",
		name: "AlienVault Open Threat Exchange",
		description:
			"Community-driven threat intelligence sharing, including indicators of compromise and threat pulses.",
		provider: "OTX",
		type: "API",
		status: "Healthy",
		endpoint: "https://example.invalid/otx",
		lastSync: "07 Nov 2026, 09:35",
		nextSync: "07 Nov 2026, 10:05",
		recordsToday: 86,
		totalRecords: 5120,
		syncFrequency: "Every 30 minutes",
		coverage: ["Indicators of compromise", "Malware", "Threat pulses"],
		healthMessage: "Connection and ingestion are operating normally.",
	},
	{
		id: "FEED-003",
		name: "MITRE ATT&CK Knowledge Base",
		description:
			"Structured knowledge base of adversary tactics, techniques and procedures used in real-world attacks.",
		provider: "MITRE",
		type: "STIX",
		status: "Healthy",
		endpoint: "https://example.invalid/mitre/attack",
		lastSync: "07 Nov 2026, 08:55",
		nextSync: "07 Nov 2026, 12:00",
		recordsToday: 42,
		totalRecords: 1860,
		syncFrequency: "Every 4 hours",
		coverage: ["Tactics", "Techniques", "Procedures"],
		healthMessage: "Last synchronization completed successfully.",
	},
	{
		id: "FEED-004",
		name: "National Vulnerability Database",
		description:
			"Structured vulnerability information, including CVE references, severity and affected product details.",
		provider: "NIST NVD",
		type: "API",
		status: "Degraded",
		endpoint: "https://example.invalid/nvd",
		lastSync: "07 Nov 2026, 07:20",
		nextSync: "Pending retry",
		recordsToday: 18,
		totalRecords: 7340,
		syncFrequency: "Every 30 minutes",
		coverage: ["CVE records", "CVSS scoring", "Affected products"],
		healthMessage:
			"Synchronization latency is above the configured threshold. A retry is pending.",
	},
	{
		id: "FEED-005",
		name: "Threat Research RSS",
		description:
			"An illustrative RSS source for security research articles, vulnerability disclosures and threat advisories.",
		provider: "Research Desk",
		type: "RSS",
		status: "Degraded",
		endpoint: "https://example.invalid/research/rss",
		lastSync: "06 Nov 2026, 22:15",
		nextSync: "Pending retry",
		recordsToday: 7,
		totalRecords: 920,
		syncFrequency: "Every 1 hour",
		coverage: ["Security advisories", "Research publications"],
		healthMessage:
			"The last polling attempt did not complete. The source requires attention.",
	},
	{
		id: "FEED-006",
		name: "Internal Intelligence Collection",
		description:
			"Illustrative internal source for curated intelligence records submitted by analysts.",
		provider: "Internal",
		type: "TAXII",
		status: "Paused",
		endpoint: "https://example.invalid/internal/taxii",
		lastSync: "05 Nov 2026, 16:40",
		nextSync: "Paused",
		recordsToday: 0,
		totalRecords: 640,
		syncFrequency: "Every 1 hour",
		coverage: ["Analyst submissions", "Internal indicators"],
		healthMessage: "Ingestion has been manually paused in this sample dataset.",
	},
];

const statusClass = (status: FeedStatus) =>
	`feed-status-${status.toLowerCase()}`;

function FeedDrawer({
	feed,
	onClose,
}: {
	feed: ThreatFeed | null;
	onClose: () => void;
}) {
	useEffect(() => {
		if (!feed) return;

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
	}, [feed, onClose]);

	if (!feed) return null;

	return createPortal(
		<div
			className="feed-drawer-backdrop"
			onMouseDown={(event) => {
				if (event.target === event.currentTarget) onClose();
			}}>
			<aside
				className="feed-drawer"
				role="dialog"
				aria-modal="true"
				aria-labelledby="feed-drawer-title">
				<header className="feed-drawer-header">
					<div>
						<span>INTELLIGENCE SOURCE</span>
						<small>Feed inspection</small>
					</div>

					<button
						type="button"
						className="feed-icon-button"
						onClick={onClose}
						aria-label="Close feed details">
						<X size={19} />
					</button>
				</header>

				<div className="feed-drawer-content">
					<div className="feed-drawer-topline">
						<span className={`feed-status ${statusClass(feed.status)}`}>
							<span />
							{feed.status}
						</span>
						<span className="feed-type">{feed.type}</span>
					</div>

					<h2 id="feed-drawer-title">{feed.name}</h2>

					<p className="feed-drawer-description">{feed.description}</p>

					<section className="feed-health-message">
						<Activity size={17} />
						<div>
							<strong>Source health</strong>
							<p>{feed.healthMessage}</p>
						</div>
					</section>

					<section className="feed-detail-section">
						<h3>Feed Information</h3>

						<div className="feed-detail-card">
							<div>
								<Database size={15} />
								<span>Feed ID</span>
								<strong>{feed.id}</strong>
							</div>
							<div>
								<Server size={15} />
								<span>Provider</span>
								<strong>{feed.provider}</strong>
							</div>
							<div>
								<Globe2 size={15} />
								<span>Endpoint</span>
								<strong>{feed.endpoint}</strong>
							</div>
							<div>
								<RefreshCw size={15} />
								<span>Frequency</span>
								<strong>{feed.syncFrequency}</strong>
							</div>
						</div>
					</section>

					<section className="feed-detail-section">
						<h3>Synchronization</h3>

						<div className="feed-sync-grid">
							<div>
								<span>Last synchronization</span>
								<strong>{feed.lastSync}</strong>
							</div>
							<div>
								<span>Next synchronization</span>
								<strong>{feed.nextSync}</strong>
							</div>
						</div>
					</section>

					<section className="feed-detail-section">
						<h3>Ingestion Statistics</h3>

						<div className="feed-stat-grid">
							<div>
								<strong>{feed.recordsToday.toLocaleString()}</strong>
								<span>Records today</span>
							</div>
							<div>
								<strong>{feed.totalRecords.toLocaleString()}</strong>
								<span>Total records</span>
							</div>
						</div>
					</section>

					<section className="feed-detail-section">
						<h3>Intelligence Coverage</h3>

						<div className="feed-coverage-tags">
							{feed.coverage.map((item) => (
								<span key={item}>{item}</span>
							))}
						</div>
					</section>

					<p className="feed-disclaimer">
						Illustrative feed configuration. Endpoints and synchronization
						information are sample values, not live connections.
					</p>
				</div>

				<footer className="feed-drawer-footer">
					<button
						type="button"
						className="feed-primary-button"
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
	const [feeds] = useState(initialFeeds);
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState("All");
	const [typeFilter, setTypeFilter] = useState("All");
	const [sortOrder, setSortOrder] = useState<"name" | "records">("name");
	const [selectedFeed, setSelectedFeed] = useState<ThreatFeed | null>(null);

	const filteredFeeds = useMemo(() => {
		const query = search.trim().toLowerCase();

		return feeds
			.filter((feed) => {
				const matchesSearch =
					!query ||
					feed.name.toLowerCase().includes(query) ||
					feed.provider.toLowerCase().includes(query) ||
					feed.id.toLowerCase().includes(query);

				const matchesStatus =
					statusFilter === "All" || feed.status === statusFilter;

				const matchesType = typeFilter === "All" || feed.type === typeFilter;

				return matchesSearch && matchesStatus && matchesType;
			})
			.sort((a, b) => {
				if (sortOrder === "records") {
					return b.recordsToday - a.recordsToday;
				}
				return a.name.localeCompare(b.name);
			});
	}, [feeds, search, statusFilter, typeFilter, sortOrder]);

	const healthyCount = feeds.filter((f) => f.status === "Healthy").length;
	const degradedCount = feeds.filter((f) => f.status === "Degraded").length;
	const pausedCount = feeds.filter((f) => f.status === "Paused").length;
	const totalRecordsToday = feeds.reduce(
		(total, feed) => total + feed.recordsToday,
		0,
	);

	const closeDrawer = useCallback(() => {
		setSelectedFeed(null);
	}, []);

	const resetFilters = () => {
		setSearch("");
		setStatusFilter("All");
		setTypeFilter("All");
	};

	return (
		<section className="feeds-page">
			<div className="feeds-heading">
				<div>
					<div className="feeds-eyebrow">
						<Radio size={14} />
						INTELLIGENCE PIPELINE
					</div>
					<h1>Threat Feeds</h1>
					<p>
						Monitor intelligence sources, ingestion activity and feed health.
					</p>
				</div>

				<span className="feeds-sample-indicator">
					<span />
					Sample dataset
				</span>
			</div>

			<div className="feeds-stats">
				<button
					type="button"
					className={`feeds-stat-card ${statusFilter === "All" ? "selected" : ""}`}
					onClick={() => setStatusFilter("All")}>
					<span>Total Feeds</span>
					<div>
						<strong>{feeds.length}</strong>
						<Layers3 size={19} />
					</div>
					<small>Configured intelligence sources</small>
				</button>

				<button
					type="button"
					className={`feeds-stat-card healthy ${statusFilter === "Healthy" ? "selected" : ""}`}
					onClick={() =>
						setStatusFilter(statusFilter === "Healthy" ? "All" : "Healthy")
					}>
					<span>Healthy</span>
					<div>
						<strong>{healthyCount}</strong>
						<CheckCircle2 size={19} />
					</div>
					<small>Operating normally</small>
				</button>

				<button
					type="button"
					className={`feeds-stat-card degraded ${statusFilter === "Degraded" ? "selected" : ""}`}
					onClick={() =>
						setStatusFilter(statusFilter === "Degraded" ? "All" : "Degraded")
					}>
					<span>Degraded</span>
					<div>
						<strong>{degradedCount}</strong>
						<AlertTriangle size={19} />
					</div>
					<small>Require attention</small>
				</button>

				<button
					type="button"
					className={`feeds-stat-card paused ${statusFilter === "Paused" ? "selected" : ""}`}
					onClick={() =>
						setStatusFilter(statusFilter === "Paused" ? "All" : "Paused")
					}>
					<span>Paused</span>
					<div>
						<strong>{pausedCount}</strong>
						<PauseCircle size={19} />
					</div>
					<small>Ingestion suspended</small>
				</button>
			</div>

			<section className="feeds-activity-strip">
				<div className="feeds-activity-icon">
					<Activity size={19} />
				</div>
				<div className="feeds-activity-copy">
					<strong>Ingestion activity</strong>
					<span>Records collected today across configured sources</span>
				</div>
				<div className="feeds-activity-value">
					<strong>{totalRecordsToday.toLocaleString()}</strong>
					<span>Records today</span>
				</div>
			</section>

			<section className="feeds-panel">
				<div className="feeds-panel-heading">
					<div>
						<h2>Feed Inventory</h2>
						<p>Review source connectivity and ingestion performance.</p>
					</div>
					<span>
						{filteredFeeds.length} of {feeds.length} sources
					</span>
				</div>

				<div className="feeds-toolbar">
					<div className="feeds-search">
						<Search size={16} />
						<input
							value={search}
							onChange={(event) => setSearch(event.target.value)}
							placeholder="Search source, provider or feed ID..."
							aria-label="Search feeds"
						/>
						{search && (
							<button
								type="button"
								onClick={() => setSearch("")}
								aria-label="Clear search">
								<X size={15} />
							</button>
						)}
					</div>

					<label className="feeds-filter">
						<Filter size={14} />
						<select
							value={statusFilter}
							onChange={(event) => setStatusFilter(event.target.value)}
							aria-label="Filter by feed health">
							<option value="All">All health states</option>
							<option value="Healthy">Healthy</option>
							<option value="Degraded">Degraded</option>
							<option value="Paused">Paused</option>
						</select>
					</label>

					<label className="feeds-filter">
						<select
							value={typeFilter}
							onChange={(event) => setTypeFilter(event.target.value)}
							aria-label="Filter by feed type">
							<option value="All">All feed types</option>
							<option value="API">API</option>
							<option value="RSS">RSS</option>
							<option value="TAXII">TAXII</option>
							<option value="STIX">STIX</option>
						</select>
					</label>

					<button
						type="button"
						className="feeds-sort-button"
						onClick={() =>
							setSortOrder(sortOrder === "name" ? "records" : "name")
						}>
						<ArrowUpDown size={14} />
						{sortOrder === "name" ? "Name" : "Records"}
					</button>
				</div>

				<div className="feeds-table-wrap">
					<table className="feeds-table">
						<thead>
							<tr>
								<th>INTELLIGENCE SOURCE</th>
								<th>TYPE</th>
								<th>HEALTH</th>
								<th>LAST SYNC</th>
								<th>RECORDS TODAY</th>
								<th></th>
							</tr>
						</thead>

						<tbody>
							{filteredFeeds.map((feed) => (
								<tr
									key={feed.id}
									tabIndex={0}
									onClick={() => setSelectedFeed(feed)}
									onKeyDown={(event) => {
										if (event.key === "Enter" || event.key === " ") {
											event.preventDefault();
											setSelectedFeed(feed);
										}
									}}>
									<td>
										<div className="feeds-source-cell">
											<div className="feeds-source-icon">
												<Globe2 size={17} />
											</div>
											<div>
												<strong>{feed.name}</strong>
												<span>
													{feed.provider} · {feed.id}
												</span>
											</div>
										</div>
									</td>
									<td>
										<span className="feeds-type-badge">{feed.type}</span>
									</td>
									<td>
										<span className={`feed-status ${statusClass(feed.status)}`}>
											<span />
											{feed.status}
										</span>
									</td>
									<td className="feeds-last-sync">
										<Clock3 size={13} />
										{feed.lastSync}
									</td>
									<td className="feeds-record-count">
										{feed.recordsToday.toLocaleString()}
									</td>
									<td>
										<button
											type="button"
											className="feeds-row-action"
											aria-label={`Inspect ${feed.name}`}
											onClick={(event) => {
												event.stopPropagation();
												setSelectedFeed(feed);
											}}>
											<Eye size={16} />
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>

					{filteredFeeds.length === 0 && (
						<div className="feeds-empty-state">
							<Search size={25} />
							<strong>No matching feeds found</strong>
							<p>Try changing your search or filter criteria.</p>
							<button type="button" onClick={resetFilters}>
								Clear all filters
							</button>
						</div>
					)}
				</div>

				<div className="feeds-table-footer">
					<span>Showing {filteredFeeds.length} sources</span>
					<span>Demo data · No live feed connections</span>
				</div>
			</section>

			<FeedDrawer feed={selectedFeed} onClose={closeDrawer} />
		</section>
	);
}

export default App;
