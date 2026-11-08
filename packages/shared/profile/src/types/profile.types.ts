export type ProfessionalRole =
	| "developer"
	| "qa-analyst"
	| "network-engineer"
	| "infosec-professional"
	| "soc-analyst"
	| "security-architect"
	| "ciso"
	| "other";

export type DeploymentEnvironment =
	| "cloud"
	| "on-premises"
	| "hybrid"
	| "network-infrastructure"
	| "other";

export type SecurityInterest =
	| "vulnerability-management"
	| "threat-intelligence"
	| "malware"
	| "ransomware"
	| "phishing"
	| "data-breaches"
	| "application-security"
	| "network-security"
	| "identity-security"
	| "cloud-security"
	| "other";

export type SecurityPriority =
	| "application-security"
	| "endpoint-security"
	| "network-security"
	| "identity-access-management"
	| "data-protection"
	| "infrastructure-security"
	| "compliance"
	| "other";

export interface UserProfile {
	id: string;

	/**
	 * Used to identify the profile schema version.
	 * Useful for future migrations.
	 */
	schemaVersion: number;

	roles: ProfessionalRole[];
	customRoles: string[];

	/**
	 * Free-form technology names.
	 * Examples: React, Java, Node.js, Linux, SQL Server.
	 */
	technologies: string[];

	environments: DeploymentEnvironment[];
	customEnvironments: string[];

	interests: SecurityInterest[];
	customInterests: string[];

	priorities: SecurityPriority[];
	customPriorities: string[];

	createdAt: string;
	updatedAt: string;
}

export type ProfileUpdate = Partial<
	Omit<UserProfile, "id" | "schemaVersion" | "createdAt" | "updatedAt">
>;

export type ProfileLoadStatus = "idle" | "loading" | "loaded" | "error";

export interface ProfileState {
	profile: UserProfile | null;
	status: ProfileLoadStatus;
	isSaving: boolean;
	error: string | null;
}
