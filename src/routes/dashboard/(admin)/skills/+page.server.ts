import { PortfolioService } from '$lib/server/services/portfolio.service';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	const { skills } = await PortfolioService.getAllContent(true);
	return { skills };
};

export const actions: Actions = {
	add: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name') as string;
		const category = formData.get('category') as string;

		await PortfolioService.addSkill({
			name,
			category,
			order: 0
		});
		return { success: true };
	},
	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		await PortfolioService.deleteSkill(id);
		return { success: true };
	}
};
