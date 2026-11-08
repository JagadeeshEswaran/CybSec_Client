import type { DeploymentEnvironment } from "@cybsec/shared-profile";
import SelectionCardGroup from "../components/SelectionCardGroup";
import CustomOptionInput from "../components/CustomOptionInput";

interface Props {
	value: DeploymentEnvironment[];
	onChange: (value: DeploymentEnvironment[]) => void;
	customEnvironments: string[];
	onCustomEnvironmentsChange: (value: string[]) => void;
}

const options = [
	{
		value: "cloud",
		label: "Cloud",
		description: "Cloud-hosted applications and services",
		icon: "☁",
	},
	{
		value: "on-premises",
		label: "On-premises",
		description: "Locally hosted infrastructure",
		icon: "▣",
	},
	{
		value: "hybrid",
		label: "Hybrid",
		description: "Combination of cloud and on-premises",
		icon: "◈",
	},
	{
		value: "network-infrastructure",
		label: "Network Infrastructure",
		description: "Enterprise network and connectivity",
		icon: "⌁",
	},
	{
		value: "other",
		label: "Other",
		description: "Another deployment environment",
		icon: "＋",
	},
] satisfies {
	value: DeploymentEnvironment;
	label: string;
	description: string;
	icon: string;
}[];

export default function DeploymentEnvironmentSection({
	value,
	onChange,
	customEnvironments,
	onCustomEnvironmentsChange,
}: Props) {
	return (
		<div className="profile-section">
			<div className="section-intro">
				<h3>Where does your technology operate?</h3>
				<p>Select the deployment environments relevant to your work.</p>
			</div>

			<SelectionCardGroup options={options} value={value} onChange={onChange} />

			{value.includes("other") && (
				<CustomOptionInput
					label="Your Deployment Environment"
					placeholder="e.g. Private Cloud, Edge Infrastructure..."
					value={customEnvironments}
					onChange={onCustomEnvironmentsChange}
				/>
			)}
		</div>
	);
}
