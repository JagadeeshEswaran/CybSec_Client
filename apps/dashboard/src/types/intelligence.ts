export type ThreatSeverity = "Critical" | "High" | "Medium" | "Low";

export interface IntelligenceItem {
	id: string;
	title: string;
	description: string;
	severity: ThreatSeverity;
	source: string;
	time: string;
	publishedAt: string;
	category: string;
	potentialImpact: string;
	recommendedActions: string[];
	affectedProducts: string[];
	sourceUrl?: string;
}
