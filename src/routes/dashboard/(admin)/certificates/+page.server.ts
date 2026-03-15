import { PortfolioService } from '$lib/server/services/portfolio.service';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	const { certificates } = await PortfolioService.getAllContent(true);
	return { certificates };
};

export const actions: Actions = {
	add: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name') as string;
		const issuer = formData.get('issuer') as string;
		const credentialUrl = formData.get('credentialUrl') as string;
		const imageUrl = formData.get('imageUrl') as string;

		await PortfolioService.addCertificate({
			name,
			issuer,
			credentialUrl,
			imageUrl,
			order: 0
		});
		return { success: true };
	},
	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		await PortfolioService.deleteCertificate(id);
		return { success: true };
	},
	update: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		const name = formData.get('name') as string;
		const issuer = formData.get('issuer') as string;
		const credentialUrl = formData.get('credentialUrl') as string;
		const imageUrl = formData.get('imageUrl') as string;

		await PortfolioService.updateCertificate(id, {
			name,
			issuer,
			credentialUrl,
			imageUrl
		});
		return { success: true };
	}
};
