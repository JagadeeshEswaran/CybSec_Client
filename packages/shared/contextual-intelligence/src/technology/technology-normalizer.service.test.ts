import { describe, expect, it } from "vitest";
import {
	normalizeTechnology,
	normalizeTechnologies,
	normalizeUniqueTechnologies,
} from "./technology-normalizer.service";

describe("normalizeTechnology", () => {
	it("recognizes a canonical technology name", () => {
		expect(normalizeTechnology("React")).toEqual({
			originalValue: "React",
			canonicalName: "React",
			category: "Frontend Framework",
			isRecognized: true,
		});
	});

	it("recognizes a known alias", () => {
		const result = normalizeTechnology("React.js");

		expect(result.canonicalName).toBe("React");
		expect(result.isRecognized).toBe(true);
	});

	it("matches technology names case-insensitively", () => {
		const result = normalizeTechnology("NODEJS");

		expect(result.canonicalName).toBe("Node.js");
		expect(result.isRecognized).toBe(true);
	});

	it("normalizes leading and trailing whitespace", () => {
		const result = normalizeTechnology(" Java ");

		expect(result.canonicalName).toBe("Java");
		expect(result.isRecognized).toBe(true);
		expect(result.originalValue).toBe(" Java ");
	});

	it("preserves unknown technologies as unrecognized", () => {
		expect(normalizeTechnology("Apache Kafka")).toEqual({
			originalValue: "Apache Kafka",
			canonicalName: null,
			category: null,
			isRecognized: false,
		});
	});

	it("returns an unrecognized result for an empty string", () => {
		expect(normalizeTechnology("")).toEqual({
			originalValue: "",
			canonicalName: null,
			category: null,
			isRecognized: false,
		});
	});

	it("does not guess unregistered aliases", () => {
		const result = normalizeTechnology("React   JS");

		expect(result.canonicalName).toBeNull();
		expect(result.isRecognized).toBe(false);
	});
});

describe("normalizeTechnologies", () => {
	it("normalizes multiple values while preserving duplicate matches", () => {
		const results = normalizeTechnologies(["React", "React.js", "NODEJS"]);

		expect(results).toHaveLength(3);
		expect(results.map((item) => item.canonicalName)).toEqual([
			"React",
			"React",
			"Node.js",
		]);
	});

	it("filters empty and whitespace-only values", () => {
		const results = normalizeTechnologies(["React", "", "   ", "Java"]);

		expect(results).toHaveLength(2);
		expect(results.map((item) => item.canonicalName)).toEqual([
			"React",
			"Java",
		]);
	});

	it("retains unknown non-empty technology values", () => {
		const results = normalizeTechnologies(["React", "Apache Kafka"]);

		expect(results).toHaveLength(2);
		expect(results[1]).toMatchObject({
			originalValue: "Apache Kafka",
			canonicalName: null,
			isRecognized: false,
		});
	});
});

describe("normalizeUniqueTechnologies", () => {
	it("deduplicates recognized technologies by canonical name", () => {
		const results = normalizeUniqueTechnologies([
			"React",
			"React.js",
			"NODEJS",
			"React",
		]);

		expect(results.map((item) => item.canonicalName)).toEqual([
			"React",
			"Node.js",
		]);
	});

	it("preserves unknown technology values", () => {
		const results = normalizeUniqueTechnologies([
			"Apache Kafka",
			"Unknown Platform",
			"Apache Kafka",
		]);

		expect(results).toHaveLength(3);
		expect(results.every((item) => !item.isRecognized)).toBe(true);
	});

	it("preserves the original value of the first recognized occurrence", () => {
		const results = normalizeUniqueTechnologies(["React.js", "React"]);

		expect(results).toHaveLength(1);
		expect(results[0].originalValue).toBe("React.js");
	});

	it("returns an empty array for empty input", () => {
		expect(normalizeUniqueTechnologies([])).toEqual([]);
	});
});

describe("technology category consistency", () => {
	it("assigns a non-empty category to every recognized technology", () => {
		const results = normalizeTechnologies([
			"React",
			"React.js",
			"NodeJS",
			"Java",
			"Linux",
			"Windows",
			"SQL",
		]);

		expect(
			results.every(
				(technology) =>
					!technology.isRecognized ||
					(technology.category !== null &&
						technology.category.trim().length > 0),
			),
		).toBe(true);
	});

	it("does not assign a category to unrecognized technologies", () => {
		const result = normalizeTechnology("Apache Kafka");

		expect(result.isRecognized).toBe(false);
		expect(result.category).toBeNull();
	});
});

describe("technology normalization edge cases", () => {
	it("preserves duplicate unknown technologies", () => {
		const results = normalizeTechnologies(["Apache Kafka", "Apache Kafka"]);

		expect(results).toHaveLength(2);
		expect(results[0].isRecognized).toBe(false);
		expect(results[1].isRecognized).toBe(false);
	});

	it("handles leading, trailing, and repeated whitespace", () => {
		const results = normalizeTechnologies(["  React  ", "   Java   "]);

		expect(results[0].canonicalName).toBe("React");
		expect(results[1].canonicalName).toBe("Java");
	});

	it("resolves case variations to the same canonical technology", () => {
		const results = normalizeUniqueTechnologies(["React", "REACT", "react"]);

		expect(results).toHaveLength(1);
		expect(results[0].canonicalName).toBe("React");
	});

	it("returns an empty array when all input values are blank", () => {
		const results = normalizeTechnologies(["", "   ", "     "]);

		expect(results).toEqual([]);
	});

	it("does not mutate the original input array", () => {
		const originalTechnologies = ["React.js", "Java", "Apache Kafka"];

		const originalSnapshot = [...originalTechnologies];

		normalizeTechnologies(originalTechnologies);

		expect(originalTechnologies).toEqual(originalSnapshot);
	});
});
