import { PortfolioService } from '$lib/server/services/portfolio.service';
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
		const email = formData.get('email') as string;
		const github = formData.get('github') as string;
		const linkedin = formData.get('linkedin') as string;

		await PortfolioService.updateProfile({
			name,
			role,
			bio,
			email,
			github,
			linkedin
		});

		return { success: true };
	}
};
