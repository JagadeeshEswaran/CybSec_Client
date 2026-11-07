import {
	Area,
	AreaChart,
	CartesianGrid,
	Cell,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

import {
	activityData,
	severityData,
	sourceHealthData,
} from "../../data/dashboardData";

import "./DashboardCharts.css";
import { useMemo, useState } from "react";

const ChartHeader = ({
	title,
	description,
}: {
	title: string;
	description: string;
}) => (
	<div className="chart-header">
		<div>
			<h3>{title}</h3>
			<p>{description}</p>
		</div>
		<span className="chart-demo-badge">SAMPLE</span>
	</div>
);

interface ThreatSeverityChartProps {
	selectedSeverity: string | null;
	onSeveritySelect: (severity: string | null) => void;
}

export const ThreatSeverityChart = ({
	selectedSeverity,
	onSeveritySelect,
}: ThreatSeverityChartProps) => {
	const total = severityData.reduce((sum, item) => sum + item.value, 0);

	return (
		<article className="dashboard-panel chart-panel">
			<ChartHeader
				title="Threat Severity"
				description="Select a severity to filter intelligence"
			/>

			<div className="donut-chart-container">
				<ResponsiveContainer width="100%" height={230}>
					<PieChart>
						<Pie
							data={severityData}
							dataKey="value"
							nameKey="name"
							cx="50%"
							cy="48%"
							innerRadius={65}
							outerRadius={88}
							paddingAngle={3}
							stroke="none"
							onClick={(entry) => {
								const severity = entry.name;

								if (!severity) return;

								onSeveritySelect(
									selectedSeverity === severity ? null : severity,
								);
							}}
							style={{ cursor: "pointer" }}>
							{severityData.map((entry) => (
								<Cell
									key={entry.name}
									fill={entry.color}
									opacity={
										selectedSeverity && selectedSeverity !== entry.name
											? 0.3
											: 1
									}
								/>
							))}
						</Pie>

						<Tooltip />
					</PieChart>
				</ResponsiveContainer>

				<div className="donut-center">
					<strong>
						{selectedSeverity
							? severityData.find((item) => item.name === selectedSeverity)
									?.value
							: total}
					</strong>
					<span>{selectedSeverity || "Total threats"}</span>
				</div>
			</div>

			<div className="chart-legend">
				{severityData.map((item) => (
					<button
						type="button"
						className={`legend-item ${
							selectedSeverity === item.name ? "selected" : ""
						}`}
						key={item.name}
						onClick={() =>
							onSeveritySelect(
								selectedSeverity === item.name ? null : item.name,
							)
						}>
						<span className="legend-dot" style={{ background: item.color }} />
						<span>{item.name}</span>
						<strong>{item.value}</strong>
					</button>
				))}
			</div>
		</article>
	);
};

type TimeRange = 7 | 30 | 90;

const timeRanges: TimeRange[] = [7, 30, 90];

export const ThreatActivityChart = () => {
	const [selectedRange, setSelectedRange] = useState<TimeRange>(7);

	const filteredActivity = useMemo(() => {
		return activityData.slice(-selectedRange);
	}, [selectedRange]);

	const tickInterval = selectedRange === 7 ? 0 : selectedRange === 30 ? 4 : 14;

	const totalIngested = filteredActivity.reduce(
		(sum, item) => sum + item.ingested,
		0,
	);

	const totalProcessed = filteredActivity.reduce(
		(sum, item) => sum + item.processed,
		0,
	);

	return (
		<article className="dashboard-panel chart-panel">
			<div className="activity-chart-heading">
				<ChartHeader
					title="Threat Intelligence Activity"
					description="Ingested versus processed intelligence"
				/>

				<div
					className="time-range-selector"
					role="group"
					aria-label="Activity chart time range">
					{timeRanges.map((range) => (
						<button
							key={range}
							type="button"
							className={`time-range-button ${
								selectedRange === range ? "active" : ""
							}`}
							aria-pressed={selectedRange === range}
							onClick={() => setSelectedRange(range)}>
							{range}D
						</button>
					))}
				</div>
			</div>

			<div className="activity-summary">
				<div>
					<span className="summary-dot ingested-dot" />
					<span>Ingested</span>
					<strong>{totalIngested.toLocaleString()}</strong>
				</div>

				<div>
					<span className="summary-dot processed-dot" />
					<span>Processed</span>
					<strong>{totalProcessed.toLocaleString()}</strong>
				</div>
			</div>

			<div className="activity-chart">
				<ResponsiveContainer width="100%" height={285}>
					<AreaChart
						data={filteredActivity}
						margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
						<defs>
							<linearGradient id="ingestedGradient" x1="0" y1="0" x2="0" y2="1">
								<stop offset="0%" stopColor="#5277ea" stopOpacity={0.3} />
								<stop offset="95%" stopColor="#5277ea" stopOpacity={0.02} />
							</linearGradient>

							<linearGradient
								id="processedGradient"
								x1="0"
								y1="0"
								x2="0"
								y2="1">
								<stop offset="0%" stopColor="#299b75" stopOpacity={0.2} />
								<stop offset="95%" stopColor="#299b75" stopOpacity={0.01} />
							</linearGradient>
						</defs>

						<CartesianGrid
							stroke="var(--border)"
							strokeDasharray="3 3"
							vertical={false}
						/>

						<XAxis
							dataKey="date"
							interval={tickInterval}
							tick={{ fill: "var(--text-muted)", fontSize: 10 }}
							axisLine={false}
							tickLine={false}
						/>

						<YAxis
							allowDecimals={false}
							tick={{ fill: "var(--text-muted)", fontSize: 11 }}
							axisLine={false}
							tickLine={false}
						/>

						<Tooltip
							contentStyle={{
								background: "var(--surface)",
								border: "1px solid var(--border)",
								borderRadius: "8px",
								color: "var(--text-primary)",
								fontSize: "12px",
							}}
						/>

						<Area
							type="monotone"
							dataKey="ingested"
							name="Ingested"
							stroke="#5277ea"
							strokeWidth={2}
							fill="url(#ingestedGradient)"
							activeDot={{ r: 5 }}
						/>

						<Area
							type="monotone"
							dataKey="processed"
							name="Processed"
							stroke="#299b75"
							strokeWidth={2}
							fill="url(#processedGradient)"
							activeDot={{ r: 5 }}
						/>
					</AreaChart>
				</ResponsiveContainer>
			</div>

			<div className="activity-range-caption">
				Showing the last {selectedRange} days · Sample data
			</div>
		</article>
	);
};

export const SourceHealthChart = () => {
	const total = sourceHealthData.reduce((sum, item) => sum + item.value, 0);

	return (
		<article className="dashboard-panel chart-panel">
			<ChartHeader
				title="Source Health"
				description="Configured intelligence feed status"
			/>

			<div className="donut-chart-container source-donut">
				<ResponsiveContainer width="100%" height={210}>
					<PieChart>
						<Pie
							data={sourceHealthData}
							dataKey="value"
							nameKey="name"
							cx="50%"
							cy="48%"
							innerRadius={62}
							outerRadius={84}
							paddingAngle={4}
							stroke="none">
							{sourceHealthData.map((entry) => (
								<Cell key={entry.name} fill={entry.color} />
							))}
						</Pie>

						<Tooltip
							formatter={(value) => [value, "Sources"]}
							contentStyle={{
								background: "var(--surface)",
								border: "1px solid var(--border)",
								borderRadius: "8px",
								color: "var(--text-primary)",
								fontSize: "12px",
							}}
						/>
					</PieChart>
				</ResponsiveContainer>

				<div className="donut-center">
					<strong>{total}</strong>
					<span>Total feeds</span>
				</div>
			</div>

			<div className="chart-legend">
				{sourceHealthData.map((item) => (
					<div className="legend-item" key={item.name}>
						<span className="legend-dot" style={{ background: item.color }} />
						<span>{item.name}</span>
						<strong>{item.value}</strong>
					</div>
				))}
			</div>
		</article>
	);
};
