interface SelectionOption<T extends string> {
	value: T;
	label: string;
	description: string;
	icon: string;
}

interface SelectionCardGroupProps<T extends string> {
	options: SelectionOption<T>[];
	value: T[];
	onChange: (value: T[]) => void;
}

export default function SelectionCardGroup<T extends string>({
	options,
	value,
	onChange,
}: SelectionCardGroupProps<T>) {
	const toggleOption = (option: T) => {
		const isSelected = value.includes(option);

		onChange(
			isSelected ? value.filter((item) => item !== option) : [...value, option],
		);
	};

	return (
		<div className="selection-grid">
			{options.map((option) => {
				const selected = value.includes(option.value);

				return (
					<button
						key={option.value}
						type="button"
						aria-pressed={selected}
						className={`selection-card ${selected ? "selected" : ""}`}
						onClick={() => toggleOption(option.value)}>
						<span className="selection-card-icon">{option.icon}</span>

						<span className="selection-card-content">
							<strong>{option.label}</strong>
							<small>{option.description}</small>
						</span>

						<span className="selection-check">{selected ? "✓" : "+"}</span>
					</button>
				);
			})}
		</div>
	);
}
