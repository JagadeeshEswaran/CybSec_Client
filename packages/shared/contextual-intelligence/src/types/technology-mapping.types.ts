export type TechnologyMatchType = "exact" | "alias" | "product" | "category";

export interface TechnologyMapping {
	canonicalName: string;
	aliases: string[];
	category?: string;
	matchType: TechnologyMatchType;
}
