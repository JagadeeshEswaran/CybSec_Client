import { useMemo, useState } from "react";

interface TechnologySelectorProps {
	value: string[];
	onChange: (value: string[]) => void;
}

const SUGGESTED_TECHNOLOGIES = [
	"React",
	"Angular",
	"Vue.js",
	"Node.js",
	"Java",
	"Spring Boot",
	"Python",
	"JavaScript",
	"TypeScript",
	"C#",
	".NET",
	"PHP",
	"Go",
	"Rust",
	"Docker",
	"Kubernetes",
	"AWS",
	"Microsoft Azure",
	"Google Cloud",
	"Linux",
	"Windows Server",
	"Nginx",
	"Apache",
	"PostgreSQL",
	"MySQL",
	"Microsoft SQL Server",
	"MongoDB",
	"Redis",
	"Kafka",
	"Terraform",
];

export default function TechnologySelector({
	value,
	onChange,
}: TechnologySelectorProps) {
	const [search, setSearch] = useState("");
	const [error, setError] = useState("");

	const suggestions = useMemo(() => {
		const query = search.trim().toLowerCase();

		if (!query) return [];

		return SUGGESTED_TECHNOLOGIES.filter(
			(technology) =>
				technology.toLowerCase().includes(query) &&
				!value.some((item) => item.toLowerCase() === technology.toLowerCase()),
		);
	}, [search, value]);

	const addTechnology = (technology: string) => {
		const trimmed = technology.trim();

		if (!trimmed) {
			setError("Please enter a technology name.");
			return;
		}

		const exists = value.some(
			(item) => item.toLowerCase() === trimmed.toLowerCase(),
		);

		if (exists) {
			setError(`"${trimmed}" has already been added.`);
			return;
		}

		onChange([...value, trimmed]);
		setSearch("");
		setError("");
	};

	const removeTechnology = (technology: string) => {
		onChange(value.filter((item) => item !== technology));
		setError("");
	};

	return (
		<div className="technology-selector">
			<div className="technology-input-wrapper">
				<input
					type="text"
					value={search}
					placeholder="Search or add a technology..."
					aria-invalid={Boolean(error)}
					aria-describedby={error ? "technology-error" : undefined}
					onChange={(event) => {
						setSearch(event.target.value);
						setError("");
					}}
					onKeyDown={(event) => {
						if (event.key === "Enter") {
							event.preventDefault();
							addTechnology(search);
						}
					}}
				/>

				<button
					type="button"
					disabled={!search.trim()}
					onClick={() => addTechnology(search)}>
					Add Technology
				</button>
			</div>

			{error && (
				<p id="technology-error" className="field-error" role="alert">
					<span>!</span> {error}
				</p>
			)}

			{suggestions.length > 0 && (
				<div className="technology-suggestions">
					{suggestions.slice(0, 8).map((technology) => (
						<button
							type="button"
							key={technology}
							onClick={() => addTechnology(technology)}>
							+ {technology}
						</button>
					))}
				</div>
			)}

			<div className="selected-technologies">
				<div className="selected-technologies-heading">
					<strong>Selected Technologies</strong>
					<span>{value.length} selected</span>
				</div>

				{value.length > 0 ? (
					<div className="technology-tags">
						{value.map((technology) => (
							<span className="technology-tag" key={technology}>
								{technology}
								<button
									type="button"
									aria-label={`Remove ${technology}`}
									onClick={() => removeTechnology(technology)}>
									×
								</button>
							</span>
						))}
					</div>
				) : (
					<p className="empty-selection">No technologies selected yet.</p>
				)}
			</div>
		</div>
	);
}
