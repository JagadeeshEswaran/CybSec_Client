import type { IntelligenceReference } from "./intelligence-reference.types";

export type RelevanceDimension =
	| "technology"
	| "role"
	| "environment"
	| "interest"
	| "priority";

export type RelevanceMatchStatus =
	| "matched"
	| "not-matched"
	| "insufficient-context";

export interface RelevanceReason {
	dimension: RelevanceDimension;
	matchedValue: string;
	explanation: string;
}

export interface RelevanceAssessment {
	reference: IntelligenceReference;
	status: RelevanceMatchStatus;
	reasons: RelevanceReason[];
	evaluatedAt: string;
}
