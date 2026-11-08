import {
	createContext,
	useCallback,
	useEffect,
	useMemo,
	useState,
	type ReactNode,
} from "react";

import type {
	UserProfile,
	ProfileUpdate,
	ProfileState,
} from "../src/types/profile.types";

import { ProfileService } from "../services/profile.service";
import { LocalStorageProfileRepository } from "../src/persistence/local-storage.repository";

export interface ProfileContextValue extends ProfileState {
	refreshProfile: () => Promise<void>;
	createProfile: (data?: ProfileUpdate) => Promise<UserProfile>;
	updateProfile: (data: ProfileUpdate) => Promise<UserProfile>;
	clearProfile: () => Promise<void>;
}

interface ProfileProviderProps {
	children: ReactNode;
	service?: ProfileService;
}

export const ProfileContext = createContext<ProfileContextValue | undefined>(
	undefined,
);

export function ProfileProvider({ children, service }: ProfileProviderProps) {
	const profileService = useMemo(
		() => service ?? new ProfileService(new LocalStorageProfileRepository()),
		[service],
	);

	const [state, setState] = useState<ProfileState>({
		profile: null,
		status: "idle",
		isSaving: false,
		error: null,
	});

	/**
	 * Loads the profile from the configured repository.
	 */
	const refreshProfile = useCallback(async () => {
		setState((previous) => ({
			...previous,
			status: "loading",
			error: null,
		}));

		try {
			const profile = await profileService.getProfile();

			setState((previous) => ({
				...previous,
				profile,
				status: "loaded",
				error: null,
			}));
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Unable to load profile.";

			setState((previous) => ({
				...previous,
				status: "error",
				error: message,
			}));

			throw error;
		}
	}, [profileService]);

	/**
	 * Creates a new profile.
	 */
	const createProfile = useCallback(
		async (data: ProfileUpdate = {}) => {
			setState((previous) => ({
				...previous,
				isSaving: true,
				error: null,
			}));

			try {
				const profile = await profileService.createProfile(data);

				setState((previous) => ({
					...previous,
					profile,
					status: "loaded",
					error: null,
				}));

				return profile;
			} catch (error) {
				const message =
					error instanceof Error ? error.message : "Unable to create profile.";

				setState((previous) => ({
					...previous,
					error: message,
				}));

				throw error;
			} finally {
				setState((previous) => ({
					...previous,
					isSaving: false,
				}));
			}
		},
		[profileService],
	);

	/**
	 * Updates the existing profile.
	 */
	const updateProfile = useCallback(
		async (data: ProfileUpdate) => {
			setState((previous) => ({
				...previous,
				isSaving: true,
				error: null,
			}));

			try {
				const profile = await profileService.updateProfile(data);

				setState((previous) => ({
					...previous,
					profile,
					status: "loaded",
					error: null,
				}));

				return profile;
			} catch (error) {
				const message =
					error instanceof Error ? error.message : "Unable to update profile.";

				setState((previous) => ({
					...previous,
					error: message,
				}));

				throw error;
			} finally {
				setState((previous) => ({
					...previous,
					isSaving: false,
				}));
			}
		},
		[profileService],
	);

	/**
	 * Clears the existing profile.
	 */
	const clearProfile = useCallback(async () => {
		setState((previous) => ({
			...previous,
			isSaving: true,
			error: null,
		}));

		try {
			await profileService.clearProfile();

			setState((previous) => ({
				...previous,
				profile: null,
				status: "loaded",
				error: null,
			}));
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Unable to clear profile.";

			setState((previous) => ({
				...previous,
				error: message,
			}));

			throw error;
		} finally {
			setState((previous) => ({
				...previous,
				isSaving: false,
			}));
		}
	}, [profileService]);

	/**
	 * Initial profile loading.
	 */
	useEffect(() => {
		void refreshProfile().catch(() => {
			// Error is already captured in ProfileState.
		});
	}, [refreshProfile]);

	const contextValue = useMemo(
		() => ({
			...state,
			refreshProfile,
			createProfile,
			updateProfile,
			clearProfile,
		}),
		[state, refreshProfile, createProfile, updateProfile, clearProfile],
	);

	return (
		<ProfileContext.Provider value={contextValue}>
			{children}
		</ProfileContext.Provider>
	);
}
