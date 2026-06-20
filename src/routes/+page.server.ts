import { PortfolioService } from '$lib/server/services/portfolio.service';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const content = await PortfolioService.getAllContent();

	return {
		projects: content.projects,
		certificates: content.certificates,
		skills: content.skills,
		experiences: content.experiences,
		profile: content.profile
	};
};
