import { PortfolioService } from '$lib/server/services/portfolio.service';

export const load = async () => {
	const content = await PortfolioService.getAllContent();

	return {
		projects: content.projects,
		certificates: content.certificates,
		skills: content.skills,
		experiences: content.experiences,
		profile: content.profile
	};
};
