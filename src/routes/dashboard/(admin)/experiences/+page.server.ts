import { PortfolioService } from '$lib/server/services/portfolio.service';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const { experiences } = await PortfolioService.getAllContent();
	return { experiences };
};
