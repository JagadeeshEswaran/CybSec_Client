import { TECHNOLOGY_CATALOG } from "./technology.catalog";
import type { NormalizedTechnology } from "./technology.types";

const normalizeKey = (value: string): string =>
	value.trim().replace(/\s+/g, " ").toLowerCase();

const technologyLookup = new Map(
	TECHNOLOGY_CATALOG.flatMap((entry) => {
		const names = [entry.canonicalName, ...entry.aliases];

		return names.map((name) => [normalizeKey(name), entry] as const);
	}),
);

export function normalizeTechnology(value: string): NormalizedTechnology {
	const originalValue = value;
	const normalizedKey = normalizeKey(value);

	if (!normalizedKey) {
		return {
			originalValue,
			canonicalName: null,
			category: null,
			isRecognized: false,
		};
	}

	const match = technologyLookup.get(normalizedKey);

	if (!match) {
		return {
			originalValue,
			canonicalName: null,
			category: null,
			isRecognized: false,
		};
	}

	return {
		originalValue,
		canonicalName: match.canonicalName,
		category: match.category,
		isRecognized: true,
	};
}

export function normalizeTechnologies(
	values: string[],
): NormalizedTechnology[] {
	return values
		.filter((value) => normalizeKey(value).length > 0)
		.map(normalizeTechnology);
}

export function normalizeUniqueTechnologies(
	values: string[],
): NormalizedTechnology[] {
	const normalized = normalizeTechnologies(values);
	const seenCanonicalNames = new Set<string>();

	return normalized.filter((technology) => {
		if (!technology.isRecognized || !technology.canonicalName) {
			return true;
		}

		if (seenCanonicalNames.has(technology.canonicalName)) {
			return false;
		}

		seenCanonicalNames.add(technology.canonicalName);
		return true;
	});
}
