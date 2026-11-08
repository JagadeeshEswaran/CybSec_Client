import { useState } from "react";

interface CustomOptionInputProps {
	label: string;
	placeholder: string;
	value: string[];
	onChange: (value: string[]) => void;
}

export default function CustomOptionInput({
	label,
	placeholder,
	value,
	onChange,
}: CustomOptionInputProps) {
	const [input, setInput] = useState("");
	const [error, setError] = useState("");

	const addOption = () => {
		const trimmed = input.trim();

		if (!trimmed) {
			setError("Please enter a name.");
			return;
		}

		if (value.some((item) => item.toLowerCase() === trimmed.toLowerCase())) {
			setError(`"${trimmed}" has already been added.`);
			return;
		}

		onChange([...value, trimmed]);
		setInput("");
		setError("");
	};

	return (
		<div className="custom-option-input">
			<div className="custom-option-heading">
				<div>
					<strong>{label}</strong>
					<p>Add your own choices that aren't listed above.</p>
				</div>
				<span>{value.length} added</span>
			</div>

			<div className="technology-input-wrapper">
				<input
					value={input}
					placeholder={placeholder}
					aria-invalid={Boolean(error)}
					onChange={(event) => {
						setInput(event.target.value);
						setError("");
					}}
					onKeyDown={(event) => {
						if (event.key === "Enter") {
							event.preventDefault();
							addOption();
						}
					}}
				/>

				<button type="button" disabled={!input.trim()} onClick={addOption}>
					Add
				</button>
			</div>

			{error && (
				<p className="field-error" role="alert">
					<span>!</span> {error}
				</p>
			)}

			{value.length > 0 && (
				<div className="technology-tags">
					{value.map((item) => (
						<span className="technology-tag" key={item}>
							{item}
							<button
								type="button"
								aria-label={`Remove ${item}`}
								onClick={() =>
									onChange(value.filter((entry) => entry !== item))
								}>
								×
							</button>
						</span>
					))}
				</div>
			)}
		</div>
	);
}
