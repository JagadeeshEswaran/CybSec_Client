import type { UserProfile } from "../types/profile.types";
import type { ProfileRepository } from "./profile.repository";

const DEFAULT_STORAGE_KEY = "cybsec:user-profile:v1";
const CURRENT_SCHEMA_VERSION = 2;

/**
 * LocalStorage implementation of the ProfileRepository contract.
 *
 * This adapter handles browser persistence only.
 * It contains no React or business logic.
 */
export class LocalStorageProfileRepository implements ProfileRepository {
	private readonly storageKey: string;
	private readonly getStorage: () => Storage;

	constructor(
		storageKey: string = DEFAULT_STORAGE_KEY,
		getStorage: () => Storage = () => window.localStorage,
	) {
		this.storageKey = storageKey;
		this.getStorage = getStorage;
	}

	/**
	 * Retrieves the saved profile and migrates older schemas when required.
	 */
	async getProfile(): Promise<UserProfile | null> {
		try {
			const storage = this.getStorage();
			const storedValue = storage.getItem(this.storageKey);

			if (!storedValue) {
				return null;
			}

			const parsedValue: unknown = JSON.parse(storedValue);

			if (!this.isBaseProfile(parsedValue)) {
				throw new Error("Stored profile has an invalid structure.");
			}

			const originalSchemaVersion = parsedValue.schemaVersion;
			const migratedProfile = this.migrateProfile(parsedValue);

			// Persist only when a migration has occurred.
			if (originalSchemaVersion !== migratedProfile.schemaVersion) {
				storage.setItem(this.storageKey, JSON.stringify(migratedProfile));
			}

			return migratedProfile;
		} catch (error) {
			throw this.createStorageError("Failed to load profile", error);
		}
	}

	/**
	 * Saves or replaces the user profile.
	 */
	async saveProfile(profile: UserProfile): Promise<void> {
		try {
			const storage = this.getStorage();
			storage.setItem(this.storageKey, JSON.stringify(profile));
		} catch (error) {
			throw this.createStorageError("Failed to save profile", error);
		}
	}

	/**
	 * Removes the saved user profile.
	 */
	async clearProfile(): Promise<void> {
		try {
			const storage = this.getStorage();
			storage.removeItem(this.storageKey);
		} catch (error) {
			throw this.createStorageError("Failed to clear profile", error);
		}
	}

	/**
	 * Validates the fields shared by schema versions 1 and 2.
	 */
	private isBaseProfile(value: unknown): value is Record<string, unknown> {
		if (typeof value !== "object" || value === null) {
			return false;
		}

		const profile = value as Record<string, unknown>;

		return (
			typeof profile.id === "string" &&
			typeof profile.schemaVersion === "number" &&
			Array.isArray(profile.roles) &&
			Array.isArray(profile.technologies) &&
			Array.isArray(profile.environments) &&
			Array.isArray(profile.interests) &&
			Array.isArray(profile.priorities) &&
			typeof profile.createdAt === "string" &&
			typeof profile.updatedAt === "string"
		);
	}

	/**
	 * Migrates supported older profile schemas to the current schema.
	 */
	private migrateProfile(profile: Record<string, unknown>): UserProfile {
		const schemaVersion = profile.schemaVersion as number;

		if (schemaVersion > CURRENT_SCHEMA_VERSION || schemaVersion < 1) {
			throw new Error(`Unsupported profile schema version: ${schemaVersion}`);
		}

		if (schemaVersion === 1) {
			return {
				...(profile as unknown as Omit<
					UserProfile,
					| "schemaVersion"
					| "customRoles"
					| "customEnvironments"
					| "customInterests"
					| "customPriorities"
				>),
				schemaVersion: CURRENT_SCHEMA_VERSION,
				customRoles: [],
				customEnvironments: [],
				customInterests: [],
				customPriorities: [],
			};
		}

		if (
			!this.isStringArray(profile.customRoles) ||
			!this.isStringArray(profile.customEnvironments) ||
			!this.isStringArray(profile.customInterests) ||
			!this.isStringArray(profile.customPriorities)
		) {
			throw new Error("Stored version 2 profile has invalid custom values.");
		}

		return profile as unknown as UserProfile;
	}

	private isStringArray(value: unknown): value is string[] {
		return (
			Array.isArray(value) && value.every((item) => typeof item === "string")
		);
	}

	private createStorageError(message: string, error: unknown): Error {
		const detail = error instanceof Error ? error.message : String(error);
		return new Error(`${message}: ${detail}`);
	}
}
