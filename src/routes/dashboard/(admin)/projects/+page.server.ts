import { PortfolioService } from '$lib/server/services/portfolio.service';
import { createCrudActions, requireOwner } from '$lib/server/actions';
import { projects } from '$lib/server/db/schema';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	const { projects } = await PortfolioService.getAllContent(true);
	return { projects };
};

export const actions: Actions = {
	...createCrudActions({
		updateFields: ['title', 'description', 'language', 'tags', 'liveUrl', 'repoUrl'],
		update: (id: string, data: Partial<typeof projects.$inferInsert>) =>
			PortfolioService.updateProject(id, data),
		remove: (id: string) => PortfolioService.deleteProject(id)
	}),
	'sync-github': async (event) => {
		requireOwner(event);
		await PortfolioService.syncGithubProjects();
		return { success: true };
	},
	'toggle-visibility': async (event) => {
		requireOwner(event);
		const formData = await event.request.formData();
		const id = formData.get('id') as string;
		const isHidden = formData.get('isHidden') === 'true';
		await PortfolioService.toggleProjectVisibility(id, isHidden);
		return { success: true };
	},
	'bulk-action': async (event) => {
		requireOwner(event);
		const formData = await event.request.formData();
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
	}
};
