export interface TechnologyCatalogEntry {
	canonicalName: string;
	aliases: string[];
	category: string;
}

export interface NormalizedTechnology {
	originalValue: string;
	canonicalName: string | null;
	category: string | null;
	isRecognized: boolean;
}
