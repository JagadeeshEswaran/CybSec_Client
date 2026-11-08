import type { SecurityPriority } from "@cybsec/shared-profile";
import SelectionCardGroup from "../components/SelectionCardGroup";
import CustomOptionInput from "../components/CustomOptionInput";

interface Props {
	value: SecurityPriority[];
	onChange: (value: SecurityPriority[]) => void;
	customPriorities: string[];
	onCustomPrioritiesChange: (value: string[]) => void;
}

const options = [
	{
		value: "application-security",
		label: "Application Security",
		description: "Application vulnerabilities and secure development",
		icon: "⌘",
	},
	{
		value: "endpoint-security",
		label: "Endpoint Security",
		description: "Endpoint protection and device security",
		icon: "▣",
	},
	{
		value: "network-security",
		label: "Network Security",
		description: "Network defense and infrastructure protection",
		icon: "⌁",
	},
	{
		value: "identity-access-management",
		label: "Identity & Access Management",
		description: "Identity, authentication and authorization",
		icon: "♙",
	},
	{
		value: "data-protection",
		label: "Data Protection",
		description: "Data privacy and information protection",
		icon: "◇",
	},
	{
		value: "infrastructure-security",
		label: "Infrastructure Security",
		description: "Servers, platforms and infrastructure",
		icon: "▤",
	},
	{
		value: "compliance",
		label: "Compliance",
		description: "Security standards and regulatory requirements",
		icon: "✓",
	},
	{
		value: "other",
		label: "Other",
		description: "Other security priorities",
		icon: "＋",
	},
] satisfies {
	value: SecurityPriority;
	label: string;
	description: string;
	icon: string;
}[];

export default function SecurityPrioritiesSection({
	value,
	onChange,
	customPriorities,
	onCustomPrioritiesChange,
}: Props) {
	return (
		<div className="profile-section">
			<div className="section-intro">
				<h3>What are your security priorities?</h3>
				<p>
					Select the security domains that matter most to your responsibilities
					and objectives.
				</p>
			</div>

			<SelectionCardGroup options={options} value={value} onChange={onChange} />

			{value.includes("other") && (
				<CustomOptionInput
					label="Your Security Priorities"
					placeholder="e.g. DevSecOps, Container Security..."
					value={customPriorities}
					onChange={onCustomPrioritiesChange}
				/>
			)}
		</div>
	);
}
