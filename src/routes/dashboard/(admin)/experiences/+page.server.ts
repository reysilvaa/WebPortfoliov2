import { PortfolioService } from '$lib/server/services/portfolio.service';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	const { experiences } = await PortfolioService.getAllContent(true);
	return { experiences };
};

export const actions: Actions = {
	add: async ({ request }) => {
		const formData = await request.formData();
		const role = formData.get('role') as string;
		const company = formData.get('company') as string;
		const startDate = formData.get('startDate') as string;
		const endDate = formData.get('endDate') as string;
		const description = formData.get('description') as string;

		await PortfolioService.addExperience({
			role,
			company,
			startDate,
			endDate,
			description,
			order: 0
		});
		return { success: true };
	},
	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		await PortfolioService.deleteExperience(id);
		return { success: true };
	},
	update: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		const role = formData.get('role') as string;
		const company = formData.get('company') as string;
		const startDate = formData.get('startDate') as string;
		const endDate = formData.get('endDate') as string;
		const description = formData.get('description') as string;

		await PortfolioService.updateExperience(id, {
			role,
			company,
			startDate,
			endDate,
			description
		});
		return { success: true };
	}
};
