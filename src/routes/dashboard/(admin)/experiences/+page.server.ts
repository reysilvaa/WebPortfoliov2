import { PortfolioService } from '$lib/server/services/portfolio.service';
import { createCrudActions } from '$lib/server/actions';
import { experiences } from '$lib/server/db/schema';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	const { experiences } = await PortfolioService.getAllContent(true);
	return { experiences };
};

export const actions: Actions = {
	...createCrudActions({
		addFields: ['role', 'company', 'startDate', 'endDate', 'description'],
		updateFields: ['role', 'company', 'startDate', 'endDate', 'description'],
		add: (data: typeof experiences.$inferInsert) =>
			PortfolioService.addExperience({ ...data, order: 0 }),
		update: (id: string, data: Partial<typeof experiences.$inferInsert>) =>
			PortfolioService.updateExperience(id, data),
		remove: (id: string) => PortfolioService.deleteExperience(id)
	})
};
