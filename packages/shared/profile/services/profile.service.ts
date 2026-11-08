import type { UserProfile, ProfileUpdate } from "../src/types/profile.types";
import type { ProfileRepository } from "../src/persistence/profile.repository";

const CURRENT_SCHEMA_VERSION = 2;

/**
 * Injectable dependencies make the service easier to test.
 */
export interface ProfileServiceOptions {
	generateId?: () => string;
	getCurrentTime?: () => string;
}

/**
 * Handles profile business operations.
 *
 * The service depends on the repository contract,
 * not on a specific persistence implementation.
 */
export class ProfileService {
	private readonly repository: ProfileRepository;
	private readonly generateId: () => string;
	private readonly getCurrentTime: () => string;

	constructor(
		repository: ProfileRepository,
		options: ProfileServiceOptions = {},
	) {
		this.repository = repository;

		this.generateId =
			options.generateId ?? (() => globalThis.crypto.randomUUID());

		this.getCurrentTime =
			options.getCurrentTime ?? (() => new Date().toISOString());
	}

	/**
	 * Retrieves the existing profile.
	 */
	async getProfile(): Promise<UserProfile | null> {
		return this.repository.getProfile();
	}

	/**
	 * Creates and persists a new profile.
	 */
	async createProfile(initialData: ProfileUpdate = {}): Promise<UserProfile> {
		const existingProfile = await this.repository.getProfile();

		if (existingProfile) {
			throw new Error(
				"A profile already exists. Update the existing profile instead.",
			);
		}

		const timestamp = this.getCurrentTime();

		const profile: UserProfile = {
			id: this.generateId(),
			schemaVersion: CURRENT_SCHEMA_VERSION,

			roles: [],
			customRoles: [],

			technologies: [],

			environments: [],
			customEnvironments: [],

			interests: [],
			customInterests: [],

			priorities: [],
			customPriorities: [],

			...initialData,

			createdAt: timestamp,
			updatedAt: timestamp,
		};

		await this.repository.saveProfile(profile);

		return profile;
	}

	/**
	 * Updates selected properties of the existing profile.
	 */
	async updateProfile(updates: ProfileUpdate): Promise<UserProfile> {
		const existingProfile = await this.repository.getProfile();

		if (!existingProfile) {
			throw new Error(
				"No profile exists. Create a profile before updating it.",
			);
		}

		const updatedProfile: UserProfile = {
			...existingProfile,
			...updates,

			// Preserve system-managed fields.
			id: existingProfile.id,
			schemaVersion: CURRENT_SCHEMA_VERSION,
			createdAt: existingProfile.createdAt,

			updatedAt: this.getCurrentTime(),
		};

		await this.repository.saveProfile(updatedProfile);

		return updatedProfile;
	}

	/**
	 * Removes the existing profile.
	 */
	async clearProfile(): Promise<void> {
		await this.repository.clearProfile();
	}
}
