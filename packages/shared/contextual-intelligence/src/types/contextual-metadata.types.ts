import type { IntelligenceReference } from "./intelligence-reference.types";
import type { TechnologyMapping } from "./technology-mapping.types";

export interface ContextualIntelligenceMetadata {
	reference: IntelligenceReference;

	technologyMappings: TechnologyMapping[];

	relatedRoles: string[];

	relatedEnvironments: string[];

	relatedInterests: string[];

	relatedPriorities: string[];
}
