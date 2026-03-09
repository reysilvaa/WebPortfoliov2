import { PortfolioService } from '$lib/server/services/portfolio.service';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	const { projects } = await PortfolioService.getAllContent(true);
	return { projects };
};

export const actions: Actions = {
	'sync-github': async () => {
		await PortfolioService.syncGithubProjects();
		return { success: true };
	},
	'toggle-visibility': async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		const isHidden = formData.get('isHidden') === 'true';
		await PortfolioService.toggleProjectVisibility(id, isHidden);
		return { success: true };
	},
	'bulk-action': async ({ request }) => {
		const formData = await request.formData();
		const ids = JSON.parse(formData.get('ids') as string) as string[];
		const action = formData.get('type') as string;

		if (action === 'delete') {
			await Promise.all(ids.map((id) => PortfolioService.deleteProject(id)));
		} else if (action === 'hide') {
			await Promise.all(ids.map((id) => PortfolioService.toggleProjectVisibility(id, true)));
		} else if (action === 'show') {
			await Promise.all(ids.map((id) => PortfolioService.toggleProjectVisibility(id, false)));
		}

		return { success: true };
	},
	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		await PortfolioService.deleteProject(id);
		return { success: true };
	}
};
