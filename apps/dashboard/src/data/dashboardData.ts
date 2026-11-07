export interface SeverityData {
	name: string;
	value: number;
	color: string;
}

export interface ActivityData {
	date: string;
	ingested: number;
	processed: number;
}

export interface SourceHealthData {
	name: string;
	value: number;
	color: string;
}

export const severityData: SeverityData[] = [
	{ name: "Critical", value: 12, color: "#dc5555" },
	{ name: "High", value: 48, color: "#d99a43" },
	{ name: "Medium", value: 76, color: "#5277ea" },
	{ name: "Low", value: 112, color: "#299b75" },
];

export const activityData: ActivityData[] = Array.from(
	{ length: 90 },
	(_, index) => {
		const date = new Date();

		date.setHours(0, 0, 0, 0);
		date.setDate(date.getDate() - (89 - index));

		// Deterministic illustrative values, not actual threat counts.
		const ingested = 15 + ((index * 17 + 11) % 35);
		const processed = Math.max(0, ingested - (2 + ((index * 7 + 3) % 8)));

		return {
			date: date.toLocaleDateString("en-IN", {
				day: "2-digit",
				month: "short",
			}),
			ingested,
			processed,
		};
	},
);

export const sourceHealthData: SourceHealthData[] = [
	{ name: "Healthy", value: 14, color: "#299b75" },
	{ name: "Degraded", value: 3, color: "#d99a43" },
	{ name: "Inactive", value: 1, color: "#dc5555" },
];
