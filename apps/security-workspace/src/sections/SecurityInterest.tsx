import type { SecurityInterest } from "@cybsec/shared-profile";
import SelectionCardGroup from "../components/SelectionCardGroup";
import CustomOptionInput from "../components/CustomOptionInput";

interface Props {
	value: SecurityInterest[];
	onChange: (value: SecurityInterest[]) => void;
	customInterests: string[];
	onCustomInterestsChange: (value: string[]) => void;
}

const options = [
	{
		value: "vulnerability-management",
		label: "Vulnerability Management",
		description: "CVE tracking and vulnerability remediation",
		icon: "⚠",
	},
	{
		value: "threat-intelligence",
		label: "Threat Intelligence",
		description: "Emerging threats and threat actors",
		icon: "◎",
	},
	{
		value: "malware",
		label: "Malware",
		description: "Malware analysis and detection",
		icon: "⌬",
	},
	{
		value: "ransomware",
		label: "Ransomware",
		description: "Ransomware campaigns and prevention",
		icon: "▤",
	},
	{
		value: "phishing",
		label: "Phishing",
		description: "Social engineering and phishing attacks",
		icon: "✉",
	},
	{
		value: "data-breaches",
		label: "Data Breaches",
		description: "Data exposure and breach intelligence",
		icon: "◉",
	},
	{
		value: "application-security",
		label: "Application Security",
		description: "Secure coding and application threats",
		icon: "⌘",
	},
	{
		value: "network-security",
		label: "Network Security",
		description: "Network attacks and defense",
		icon: "⌁",
	},
	{
		value: "identity-security",
		label: "Identity Security",
		description: "Authentication and access threats",
		icon: "♙",
	},
	{
		value: "cloud-security",
		label: "Cloud Security",
		description: "Cloud threats and misconfigurations",
		icon: "☁",
	},
	{
		value: "other",
		label: "Other",
		description: "Other cybersecurity topics",
		icon: "＋",
	},
] satisfies {
	value: SecurityInterest;
	label: string;
	description: string;
	icon: string;
}[];

export default function SecurityInterests({
	value,
	onChange,
	customInterests,
	onCustomInterestsChange,
}: Props) {
	return (
		<div className="profile-section">
			<div className="section-intro">
				<h3>What security topics interest you?</h3>
				<p>
					Select the topics you want CybSec_View to follow and prioritize in
					your intelligence feed.
				</p>
			</div>

			<SelectionCardGroup options={options} value={value} onChange={onChange} />

			{value.includes("other") && (
				<CustomOptionInput
					label="Your Security Interests"
					placeholder="e.g. Supply Chain Security, API Security..."
					value={customInterests}
					onChange={onCustomInterestsChange}
				/>
			)}
		</div>
	);
}
