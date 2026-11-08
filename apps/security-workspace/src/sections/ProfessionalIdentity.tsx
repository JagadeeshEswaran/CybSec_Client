import type { ProfessionalRole } from "@cybsec/shared-profile";
import SelectionCardGroup from "../components/SelectionCardGroup";
import CustomOptionInput from "../components/CustomOptionInput";

interface Props {
	value: ProfessionalRole[];
	onChange: (value: ProfessionalRole[]) => void;
	customRoles: string[];
	onCustomRolesChange: (value: string[]) => void;
}

const options = [
	{
		value: "developer",
		label: "Developer",
		description: "Application and software development",
		icon: "⌘",
	},
	{
		value: "qa-analyst",
		label: "QA Analyst",
		description: "Quality assurance and testing",
		icon: "◉",
	},
	{
		value: "network-engineer",
		label: "Network Engineer",
		description: "Network infrastructure and operations",
		icon: "⌁",
	},
	{
		value: "infosec-professional",
		label: "InfoSec Professional",
		description: "Information security operations",
		icon: "◇",
	},
	{
		value: "soc-analyst",
		label: "SOC Analyst",
		description: "Security monitoring and incident response",
		icon: "◎",
	},
	{
		value: "security-architect",
		label: "Security Architect",
		description: "Security architecture and design",
		icon: "⬡",
	},
	{
		value: "ciso",
		label: "CISO",
		description: "Security leadership and governance",
		icon: "♜",
	},
	{
		value: "other",
		label: "Other",
		description: "Another professional responsibility",
		icon: "＋",
	},
] satisfies {
	value: ProfessionalRole;
	label: string;
	description: string;
	icon: string;
}[];

export default function ProfessionalIdentity({
	value,
	onChange,
	customRoles,
	onCustomRolesChange,
}: Props) {
	return (
		<div className="profile-section">
			<div className="section-intro">
				<h3>What best describes your professional role?</h3>
				<p>
					Select all roles that reflect your responsibilities. You can choose
					multiple roles.
				</p>
			</div>

			<SelectionCardGroup options={options} value={value} onChange={onChange} />

			{value.includes("other") && (
				<CustomOptionInput
					label="Your Professional Role"
					placeholder="e.g. DevSecOps Engineer, Cloud Architect..."
					value={customRoles}
					onChange={onCustomRolesChange}
				/>
			)}
		</div>
	);
}
