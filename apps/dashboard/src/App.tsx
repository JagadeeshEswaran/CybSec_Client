import {
	ShieldAlert,
	Bug,
	RadioTower,
	Globe,
	ArrowUpRight,
	ArrowRight,
	AlertTriangle,
	Activity,
	Clock3,
	ExternalLink,
} from "lucide-react";

import "./App.css";
import {
	SourceHealthChart,
	ThreatActivityChart,
	ThreatSeverityChart,
} from "./components/charts/DashboardCharts";
import { useCallback, useMemo, useState } from "react";
import type { IntelligenceItem } from "./types/intelligence";
import IntelligenceDrawer from "./components/IntelligenceDrawer/IntelligenceDrawer";

const metrics = [
	{
		label: "Critical Threats",
		value: "12",
		description: "Requires immediate review",
		icon: ShieldAlert,
		color: "danger",
		trend: "+3 this week",
	},
	{
		label: "Tracked CVEs",
		value: "248",
		description: "Across all severity levels",
		icon: Bug,
		color: "primary",
		trend: "+18 this week",
	},
	{
		label: "Active Feeds",
		value: "18",
		description: "Configured intelligence feeds",
		icon: RadioTower,
		color: "success",
		trend: "Demo status",
	},
	{
		label: "Intelligence Sources",
		value: "32",
		description: "Configured trusted sources",
		icon: Globe,
		color: "warning",
		trend: "Demo status",
	},
];

const intelligence: IntelligenceItem[] = [
	{
		id: "CVE-2026-XXXX",
		title: "Critical vulnerability disclosure",
		description:
			"Illustrative vulnerability intelligence entry. Review the original advisory and determine whether affected assets exist in your environment.",
		severity: "Critical",
		source: "Sample source",
		time: "15 min ago",
		publishedAt: "2026-11-07",
		category: "Vulnerability",
		potentialImpact:
			"Potential unauthorized access or system compromise, depending on the affected product and vulnerability conditions.",
		recommendedActions: [
			"Review the original security advisory.",
			"Identify potentially affected products and versions.",
			"Prioritize remediation based on exposure and exploitability.",
		],
		affectedProducts: ["Not yet identified"],
	},
	{
		id: "THREAT-2026-002",
		title: "Ransomware campaign monitoring",
		description:
			"Illustrative intelligence entry describing a monitored ransomware campaign.",
		severity: "High",
		source: "Sample source",
		time: "1 hour ago",
		publishedAt: "2026-11-07",
		category: "Ransomware",
		potentialImpact:
			"Potential data encryption, operational disruption and data exfiltration.",
		recommendedActions: [
			"Review the associated indicators of compromise.",
			"Check endpoint and network telemetry.",
			"Validate backup and incident response readiness.",
		],
		affectedProducts: ["Under investigation"],
	},
	{
		id: "THREAT-2026-003",
		title: "New phishing infrastructure",
		description:
			"Illustrative intelligence entry describing newly identified phishing infrastructure.",
		severity: "Medium",
		source: "Sample source",
		time: "3 hours ago",
		publishedAt: "2026-11-07",
		category: "Phishing",
		potentialImpact:
			"Potential credential theft and unauthorized account access.",
		recommendedActions: [
			"Review associated domains and indicators.",
			"Check email security detections.",
			"Consider blocking confirmed malicious infrastructure.",
		],
		affectedProducts: ["Email infrastructure"],
	},
];

const severityClass: Record<string, string> = {
	Critical: "severity-critical",
	High: "severity-high",
	Medium: "severity-medium",
	Low: "severity-low",
};

export interface DashboardAppProps {
	onNavigate?: (module: "catalog" | "tracker" | "feeds") => void;
}

function App({ onNavigate }: DashboardAppProps) {
	const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null);
	const [selectedIntelligence, setSelectedIntelligence] =
		useState<IntelligenceItem | null>(null);

	const filteredIntelligence = useMemo(
		() =>
			selectedSeverity
				? intelligence.filter((item) => item.severity === selectedSeverity)
				: intelligence,
		[selectedSeverity],
	);

	const handleCloseDrawer = useCallback(() => {
		setSelectedIntelligence(null);
	}, []);

	return (
		<div className="dashboard-content">
			<section className="dashboard-heading">
				<div>
					<div className="eyebrow">
						<Activity size={14} />
						SECURITY INTELLIGENCE
					</div>

					<h2>Security Overview</h2>

					<p>
						Monitor emerging cyber threats, vulnerabilities and intelligence
						activity from one place.
					</p>
				</div>

				<div className="dashboard-updated">
					<span className="live-indicator" />
					Sample data environment
				</div>
			</section>

			{/* Metrics */}
			<section className="metrics-grid">
				{metrics.map((metric) => {
					const Icon = metric.icon;

					return (
						<article className="metric-card" key={metric.label}>
							<div className="metric-top">
								<span>{metric.label}</span>

								<div className={`metric-icon ${metric.color}`}>
									<Icon size={19} />
								</div>
							</div>

							<div className="metric-value">{metric.value}</div>

							<div className="metric-bottom">
								<span>{metric.description}</span>
								<small>{metric.trend}</small>
							</div>
						</article>
					);
				})}
			</section>

			{/* Priority intelligence */}
			<section className="priority-card">
				<div className="priority-icon">
					<AlertTriangle size={21} />
				</div>

				<div className="priority-content">
					<div className="priority-label">
						PRIORITY INTELLIGENCE
						<span>DEMO ALERT</span>
					</div>

					<h3>Emerging threats require analyst attention</h3>

					<p>
						Review newly ingested critical-severity intelligence and prioritize
						relevant vulnerabilities for investigation.
					</p>
				</div>

				<button
					className="priority-action"
					type="button"
					onClick={() => onNavigate?.("tracker")}>
					Review intelligence
					<ArrowRight size={16} />
				</button>
			</section>

			{/* Intelligence feed */}
			<section className="dashboard-panel intelligence-panel">
				<div className="panel-heading">
					<div>
						<div>
							<h3>Latest Intelligence</h3>
							<p>Recently discovered threats and vulnerabilities</p>

							{selectedSeverity && (
								<button
									className="text-action"
									onClick={() => setSelectedSeverity(null)}>
									Clear filter
								</button>
							)}
						</div>
					</div>

					<button
						className="text-action"
						type="button"
						onClick={() => onNavigate?.("catalog")}>
						View catalog
						<ArrowUpRight size={16} />
					</button>
				</div>

				<div className="intelligence-list">
					{filteredIntelligence.length > 0 ? (
						filteredIntelligence.map((item) => (
							<article className="intelligence-item" key={item.id}>
								<div className="intelligence-indicator">
									<ShieldAlert size={19} />
								</div>

								<div className="intelligence-details">
									<h4
										className="intelligence-title"
										onClick={() => setSelectedIntelligence(item)}
										role="button"
										tabIndex={0}
										onKeyDown={(event) => {
											if (event.key === "Enter" || event.key === " ") {
												event.preventDefault();
												setSelectedIntelligence(item);
											}
										}}>
										{item.title}
									</h4>
									<p>{item.description}</p>

									<div className="intelligence-meta">
										<span>{item.id}</span>
										<span>{item.source}</span>
										<span>
											<Clock3 size={12} />
											{item.time}
										</span>
									</div>
								</div>

								<span
									className={`severity-badge ${severityClass[item.severity]}`}>
									{item.severity}
								</span>

								<button
									className="item-action"
									aria-label={`View ${item.id}`}
									type="button"
									onClick={() => setSelectedIntelligence(item)}>
									<ExternalLink size={16} />
								</button>
							</article>
						))
					) : (
						<div className="empty-intelligence">
							No intelligence entries found for this severity.
						</div>
					)}
				</div>

				<div className="sample-notice">
					<span />
					All intelligence entries shown here are illustrative sample data.
				</div>
			</section>

			<section className="dashboard-charts-grid">
				<ThreatSeverityChart
					selectedSeverity={selectedSeverity}
					onSeveritySelect={setSelectedSeverity}
				/>
				<ThreatActivityChart />
				<SourceHealthChart />
			</section>

			<IntelligenceDrawer
				item={selectedIntelligence}
				onClose={handleCloseDrawer}
				onNavigate={onNavigate}
			/>
		</div>
	);
}

export default App;
