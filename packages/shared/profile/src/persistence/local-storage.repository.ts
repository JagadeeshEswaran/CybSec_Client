import type { UserProfile } from "../types/profile.types";

export interface ProfileRepository {
	getProfile(): Promise<UserProfile | null>;

	saveProfile(profile: UserProfile): Promise<void>;

	clearProfile(): Promise<void>;
}
