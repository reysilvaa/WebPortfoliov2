import { PortfolioService } from '$lib/server/services/portfolio.service';
import { GithubService } from '$lib/server/services/github.service';
import { parseFormData, requireOwner } from '$lib/server/actions';
import { profile } from '$lib/server/db/schema';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const { profile } = await parent();
	return { profile };
};

const PROFILE_FIELDS = [
	'name',
	'role',
	'bio',
	'avatarUrl',
	'email',
	'phone',
	'location',
	'website',
	'github',
	'linkedin'
];

export const actions: Actions = {
	updateProfile: async (event) => {
		requireOwner(event);
		const formData = await event.request.formData();
		const profileData = parseFormData<Partial<typeof profile.$inferInsert>>(
			formData,
			PROFILE_FIELDS
		);

		await PortfolioService.updateProfile(profileData);
		return { success: true };
	},
	syncGithubProfile: async (event) => {
		requireOwner(event);
		const ghProfile = await GithubService.getProfileInfo();
		if (ghProfile) {
			await PortfolioService.updateProfile({
				name: ghProfile.name,
				bio: ghProfile.bio,
				avatarUrl: ghProfile.avatarUrl,
				github: ghProfile.github,
				email: ghProfile.email
			});
			return { success: true };
		}
		return { success: false, error: 'Could not fetch GitHub profile' };
	}
};
