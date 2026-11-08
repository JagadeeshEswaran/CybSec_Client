import { useEffect, useRef, useState } from "react";
import {
	useProfile,
	type DeploymentEnvironment,
	type ProfessionalRole,
	type SecurityInterest,
	type SecurityPriority,
} from "@cybsec/shared-profile";

import "./styles.css";

import ProfessionalIdentity from "./sections/ProfessionalIdentity";
import TechnologyLandscape from "./sections/TechnologyLandscape";
import DeploymentEnvironmentSection from "./sections/DeploymentEnvironment";
import SecurityInterests from "./sections/SecurityInterest";
import SecurityPriorities from "./sections/SecurityPriorities";

type WorkspaceSection =
	| "overview"
	| "identity"
	| "technology"
	| "environment"
	| "interests"
	| "priorities";

const sections: {
	id: WorkspaceSection;
	label: string;
	description: string;
	icon: string;
}[] = [
	{
		id: "overview",
		label: "Overview",
		description: "Your security profile at a glance",
		icon: "◈",
	},
	{
		id: "identity",
		label: "Professional Identity",
		description: "Your role and responsibilities",
		icon: "♙",
	},
	{
		id: "technology",
		label: "Technology Landscape",
		description: "Technologies you work with",
		icon: "⌘",
	},
	{
		id: "environment",
		label: "Deployment Environment",
		description: "Where your systems operate",
		icon: "▤",
	},
	{
		id: "interests",
		label: "Security Interests",
		description: "Topics you want to follow",
		icon: "◎",
	},
	{
		id: "priorities",
		label: "Security Priorities",
		description: "Your areas of focus",
		icon: "⬡",
	},
];

const sectionContent: Record<
	WorkspaceSection,
	{ title: string; description: string }
> = {
	overview: {
		title: "Your Security Profile",
		description:
			"A consolidated view of your professional context and security focus.",
	},
	identity: {
		title: "Professional Identity",
		description:
			"Tell CybSec_View about your role in the cybersecurity ecosystem.",
	},
	technology: {
		title: "Technology Landscape",
		description: "Identify the technologies you develop, manage or work with.",
	},
	environment: {
		title: "Deployment Environment",
		description: "Describe the environments relevant to your work.",
	},
	interests: {
		title: "Security Interests",
		description: "Choose the cybersecurity subjects you want to monitor.",
	},
	priorities: {
		title: "Security Priorities",
		description: "Highlight the security domains that matter most to you.",
	},
};

function WorkspaceSidebar({
	activeSection,
	onNavigate,
}: {
	activeSection: WorkspaceSection;
	onNavigate: (section: WorkspaceSection) => void;
}) {
	return (
		<aside className="workspace-sidebar">
			<div className="sidebar-heading">
				<span className="sidebar-kicker">PERSONALIZATION</span>
				<h2>My Workspace</h2>
			</div>

			<nav className="workspace-navigation">
				{sections.map((section) => (
					<button
						key={section.id}
						type="button"
						className={`navigation-item ${
							activeSection === section.id ? "active" : ""
						}`}
						onClick={() => onNavigate(section.id)}>
						<span className="navigation-icon">{section.icon}</span>
						<span className="navigation-label">
							<strong>{section.label}</strong>
							<small>{section.description}</small>
						</span>
					</button>
				))}
			</nav>

			<div className="sidebar-note">
				<span>◉</span>
				<div>
					<strong>Your context matters</strong>
					<p>Your profile helps prioritize relevant security intelligence.</p>
				</div>
			</div>
		</aside>
	);
}

function WorkspaceOverview() {
	const { profile, status } = useProfile();

	const profileItems = [
		{
			label: "Professional Roles",
			count: profile?.roles.length ?? 0,
			value: profile?.roles.join(", "),
		},
		{
			label: "Technologies",
			count: profile?.technologies.length ?? 0,
			value: profile?.technologies.join(", "),
		},
		{
			label: "Environments",
			count: profile?.environments.length ?? 0,
			value: profile?.environments.join(", "),
		},
		{
			label: "Security Interests",
			count: profile?.interests.length ?? 0,
			value: profile?.interests.join(", "),
		},
		{
			label: "Security Priorities",
			count: profile?.priorities.length ?? 0,
			value: profile?.priorities.join(", "),
		},
	];

	return (
		<>
			<div className="overview-grid">
				{profileItems.map((item) => (
					<article className="overview-card" key={item.label}>
						<span className="card-label">{item.label}</span>
						<strong className="card-count">{item.count}</strong>
						<p>{item.value || "Not configured yet"}</p>
					</article>
				))}
			</div>

			<section className="profile-summary">
				<div>
					<span className="card-label">PROFILE IDENTIFIER</span>
					<h3>{profile?.id ?? "No profile available"}</h3>
				</div>

				<span className={`status-pill ${status}`}>
					{status === "loaded" ? "Profile loaded" : status}
				</span>
			</section>
		</>
	);
}

function areArraysEqual<T extends string>(first: T[], second: T[]): boolean {
	if (first.length !== second.length) {
		return false;
	}

	const sortedFirst = [...first].sort();
	const sortedSecond = [...second].sort();

	return sortedFirst.every((value, index) => value === sortedSecond[index]);
}

export default function SecurityWorkspace() {
	const {
		profile,
		status,
		isSaving,
		error: profileError,
		createProfile,
		updateProfile,
	} = useProfile();
	const hasHydrated = useRef(false);

	const [activeSection, setActiveSection] =
		useState<WorkspaceSection>("overview");
	const [roles, setRoles] = useState<ProfessionalRole[]>([]);
	const [technologies, setTechnologies] = useState<string[]>([]);
	const [environments, setEnvironments] = useState<DeploymentEnvironment[]>([]);
	const [interests, setInterests] = useState<SecurityInterest[]>([]);
	const [priorities, setPriorities] = useState<SecurityPriority[]>([]);
	const [customRoles, setCustomRoles] = useState<string[]>([]);
	const [customEnvironments, setCustomEnvironments] = useState<string[]>([]);
	const [customInterests, setCustomInterests] = useState<string[]>([]);
	const [customPriorities, setCustomPriorities] = useState<string[]>([]);

	const [saveFeedback, setSaveFeedback] = useState<{
		type: "success" | "error";
		message: string;
	} | null>(null);

	useEffect(() => {
		if (saveFeedback?.type !== "success") {
			return;
		}

		const timeoutId = window.setTimeout(() => {
			setSaveFeedback(null);
		}, 3000);

		return () => {
			window.clearTimeout(timeoutId);
		};
	}, [saveFeedback]);

	useEffect(() => {
		if (status !== "loaded" || hasHydrated.current) {
			return;
		}

		if (profile) {
			setRoles(profile.roles);
			setTechnologies(profile.technologies);
			setEnvironments(profile.environments);
			setInterests(profile.interests);
			setPriorities(profile.priorities);

			setCustomRoles(profile.customRoles ?? []);
			setCustomEnvironments(profile.customEnvironments ?? []);
			setCustomInterests(profile.customInterests ?? []);
			setCustomPriorities(profile.customPriorities ?? []);
		}

		hasHydrated.current = true;
	}, [profile, status]);

	const handleSave = async () => {
		setSaveFeedback(null);

		const profileData = {
			roles,
			technologies,
			environments,
			interests,
			priorities,
			customRoles,
			customEnvironments,
			customInterests,
			customPriorities,
		};

		try {
			if (profile) {
				await updateProfile(profileData);
			} else {
				await createProfile(profileData);
			}

			setSaveFeedback({
				type: "success",
				message: "Your security profile has been saved successfully.",
			});
		} catch (error) {
			setSaveFeedback({
				type: "error",
				message:
					error instanceof Error
						? error.message
						: "Unable to save your security profile.",
			});
		}
	};

	const handleCancel = () => {
		setRoles(profile?.roles ?? []);
		setTechnologies(profile?.technologies ?? []);
		setEnvironments(profile?.environments ?? []);
		setInterests(profile?.interests ?? []);
		setPriorities(profile?.priorities ?? []);

		setCustomRoles(profile?.customRoles ?? []);
		setCustomEnvironments(profile?.customEnvironments ?? []);
		setCustomInterests(profile?.customInterests ?? []);
		setCustomPriorities(profile?.customPriorities ?? []);

		setSaveFeedback(null);
	};

	const isDirty =
		!areArraysEqual(roles, profile?.roles ?? []) ||
		!areArraysEqual(technologies, profile?.technologies ?? []) ||
		!areArraysEqual(environments, profile?.environments ?? []) ||
		!areArraysEqual(interests, profile?.interests ?? []) ||
		!areArraysEqual(priorities, profile?.priorities ?? []) ||
		!areArraysEqual(customRoles, profile?.customRoles ?? []) ||
		!areArraysEqual(customEnvironments, profile?.customEnvironments ?? []) ||
		!areArraysEqual(customInterests, profile?.customInterests ?? []) ||
		!areArraysEqual(customPriorities, profile?.customPriorities ?? []);

	const activeContent = sectionContent[activeSection];

	return (
		<main className="workspace">
			<header className="workspace-header">
				<div>
					<span className="workspace-eyebrow">
						CYBSEC_VIEW / MY SECURITY WORKSPACE
					</span>
					<h1>Security Workspace</h1>
					<p>Personalize your security intelligence experience.</p>
				</div>

				<div className="workspace-header-status">
					<span className="status-indicator" />
					Personal Workspace
				</div>
			</header>

			<div className="workspace-layout">
				<WorkspaceSidebar
					activeSection={activeSection}
					onNavigate={(section) => {
						setActiveSection(section);
						setSaveFeedback(null);
					}}
				/>

				<section className="workspace-content">
					<div className="content-heading">
						<div>
							<span className="content-eyebrow">MY SECURITY PROFILE</span>
							<h2>{activeContent.title}</h2>
							<p>{activeContent.description}</p>
						</div>
					</div>

					{(isDirty || saveFeedback || profileError) && (
						<div className="workspace-actions">
							<div className="save-feedback" aria-live="polite">
								{saveFeedback && (
									<span className={saveFeedback.type}>
										{saveFeedback.message}
									</span>
								)}

								{!saveFeedback && profileError && (
									<span className="error">{profileError}</span>
								)}
							</div>

							{isDirty && (
								<div className="action-buttons">
									<button
										type="button"
										className="cancel-button"
										onClick={handleCancel}
										disabled={isSaving}>
										Cancel
									</button>

									<button
										type="button"
										className="save-button"
										onClick={handleSave}
										disabled={isSaving}>
										{isSaving ? "Saving..." : "Save Profile"}
									</button>
								</div>
							)}
						</div>
					)}

					{activeSection === "overview" && <WorkspaceOverview />}

					{activeSection === "identity" && (
						<ProfessionalIdentity
							value={roles}
							onChange={(next) => {
								setRoles(next);
								if (!next.includes("other")) setCustomRoles([]);
							}}
							customRoles={customRoles}
							onCustomRolesChange={setCustomRoles}
						/>
					)}

					{activeSection === "technology" && (
						<TechnologyLandscape
							value={technologies}
							onChange={setTechnologies}
						/>
					)}

					{activeSection === "environment" && (
						<DeploymentEnvironmentSection
							value={environments}
							onChange={(next) => {
								setEnvironments(next);
								if (!next.includes("other")) setCustomEnvironments([]);
							}}
							customEnvironments={customEnvironments}
							onCustomEnvironmentsChange={setCustomEnvironments}
						/>
					)}

					{activeSection === "interests" && (
						<SecurityInterests
							value={interests}
							onChange={(next) => {
								setInterests(next);
								if (!next.includes("other")) setCustomInterests([]);
							}}
							customInterests={customInterests}
							onCustomInterestsChange={setCustomInterests}
						/>
					)}

					{activeSection === "priorities" && (
						<SecurityPriorities
							value={priorities}
							onChange={(next) => {
								setPriorities(next);
								if (!next.includes("other")) setCustomPriorities([]);
							}}
							customPriorities={customPriorities}
							onCustomPrioritiesChange={setCustomPriorities}
						/>
					)}
				</section>
			</div>
		</main>
	);
}
