import { PortfolioService } from '$lib/server/services/portfolio.service';
import { createCrudActions } from '$lib/server/actions';
import { skills } from '$lib/server/db/schema';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	const skills = await PortfolioService.getSkills();
	return { skills };
};

export const actions: Actions = {
	...createCrudActions({
		addFields: ['name', 'category'],
		updateFields: ['name', 'category'],
		add: (data: typeof skills.$inferInsert) => PortfolioService.addSkill({ ...data, order: 0 }),
		update: (id: string, data: Partial<typeof skills.$inferInsert>) =>
			PortfolioService.updateSkill(id, data),
		remove: (id: string) => PortfolioService.deleteSkill(id)
	})
};
