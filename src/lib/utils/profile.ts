import type { Profile, ProfileData } from '$lib/types/profile';
import { fallbackProfile } from '$lib/constants/profile';

export function resolveProfile(profile?: Partial<Profile> | null): ProfileData {
	return {
		...fallbackProfile,
		...(profile || {})
	};
}
