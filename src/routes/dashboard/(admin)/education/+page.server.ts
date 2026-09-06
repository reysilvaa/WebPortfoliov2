import { PortfolioService } from '$lib/server/services/portfolio.service';
import { createCrudActions } from '$lib/server/actions';
import { education } from '$lib/server/db/schema';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	const { education: allEducation } = await PortfolioService.getAllContent(true);
	return { education: allEducation };
};

export const actions: Actions = {
	...createCrudActions({
		addFields: ['school', 'degree', 'period', 'location'],
		updateFields: ['school', 'degree', 'period', 'location'],
		add: (data: typeof education.$inferInsert) =>
			PortfolioService.addEducation({ ...data, order: 0 }),
		update: (id: string, data: Partial<typeof education.$inferInsert>) =>
			PortfolioService.updateEducation(id, data),
		remove: (id: string) => PortfolioService.deleteEducation(id)
	})
};
