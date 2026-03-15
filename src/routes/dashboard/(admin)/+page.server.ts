import { PortfolioService } from '$lib/server/services/portfolio.service';
import { GithubService } from '$lib/server/services/github.service';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	const profile = await PortfolioService.getProfile();
	return { profile };
};

export const actions: Actions = {
	updateProfile: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name') as string;
		const role = formData.get('role') as string;
		const bio = formData.get('bio') as string;
		const avatarUrl = formData.get('avatarUrl') as string;
		const email = formData.get('email') as string;
		const github = formData.get('github') as string;
		const linkedin = formData.get('linkedin') as string;

		await PortfolioService.updateProfile({
			name,
			role,
			bio,
			avatarUrl,
			email,
			github,
			linkedin
		});

		return { success: true };
	},
	syncGithubProfile: async () => {
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
