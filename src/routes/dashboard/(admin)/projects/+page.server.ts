import { PortfolioService } from '$lib/server/services/portfolio.service';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const { projects } = await PortfolioService.getAllContent();
    return { projects };
};
