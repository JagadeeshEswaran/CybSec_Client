import TechnologySelector from "../components/TechnologySelector";

interface Props {
	value: string[];
	onChange: (value: string[]) => void;
}

export default function TechnologyLandscape({ value, onChange }: Props) {
	return (
		<div className="profile-section">
			<div className="section-intro">
				<h3>Which technologies do you work with?</h3>
				<p>
					Add the languages, frameworks, databases, platforms and infrastructure
					technologies relevant to you.
				</p>
			</div>

			<TechnologySelector value={value} onChange={onChange} />
		</div>
	);
}
