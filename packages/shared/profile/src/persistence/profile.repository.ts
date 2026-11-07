import type { UserProfile } from "../types/profile.types";

export interface ProfileRepository {
	/**
	 * Retrieves the saved user profile.
	 * Returns null when no profile exists.
	 */
	getProfile(): Promise<UserProfile | null>;

	/**
	 * Persists the supplied user profile.
	 */
	saveProfile(profile: UserProfile): Promise<void>;

	/**
	 * Removes the saved profile.
	 */
	clearProfile(): Promise<void>;
}
