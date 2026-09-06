import { PortfolioService } from '$lib/server/services/portfolio.service';
import { createCrudActions } from '$lib/server/actions';
import { openSource } from '$lib/server/db/schema';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	const openSource = await PortfolioService.getOpenSource();
	return { openSource };
};

export const actions: Actions = {
	...createCrudActions({
		addFields: ['title', 'role', 'repoUrl', 'period', 'description'],
		updateFields: ['title', 'role', 'repoUrl', 'period', 'description'],
		add: (data: typeof openSource.$inferInsert) =>
			PortfolioService.addOpenSource({ ...data, order: 0 }),
		update: (id: string, data: Partial<typeof openSource.$inferInsert>) =>
			PortfolioService.updateOpenSource(id, data),
		remove: (id: string) => PortfolioService.deleteOpenSource(id)
	})
};
