import { PortfolioService } from '$lib/server/services/portfolio.service';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const { skills } = await PortfolioService.getAllContent();
    return { skills };
};
