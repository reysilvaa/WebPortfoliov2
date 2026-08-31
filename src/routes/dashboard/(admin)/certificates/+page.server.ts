import { PortfolioService } from '$lib/server/services/portfolio.service';
import { createCrudActions } from '$lib/server/actions';
import { certificates } from '$lib/server/db/schema';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	const { certificates } = await PortfolioService.getAllContent(true);
	return { certificates };
};

export const actions: Actions = {
	...createCrudActions({
		addFields: ['name', 'issuer', 'credentialUrl', 'imageUrl'],
		updateFields: ['name', 'issuer', 'credentialUrl', 'imageUrl'],
		add: (data: typeof certificates.$inferInsert) =>
			PortfolioService.addCertificate({ ...data, order: 0 }),
		update: (id: string, data: Partial<typeof certificates.$inferInsert>) =>
			PortfolioService.updateCertificate(id, data),
		remove: (id: string) => PortfolioService.deleteCertificate(id)
	})
};
