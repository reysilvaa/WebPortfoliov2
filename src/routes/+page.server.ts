import { PortfolioService } from '$lib/server/services/portfolio.service';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const page = Number(url.searchParams.get('page')) || 1;
	const limit = 6;

	const [paginated, content] = await Promise.all([
		PortfolioService.getPaginatedProjects(page, limit),
		PortfolioService.getAllContent()
	]);

	return {
		projects: paginated.projects,
		pagination: {
			page,
			limit,
			total: paginated.total,
			totalPages: Math.ceil(paginated.total / limit)
		},
		certificates: content.certificates,
		skills: content.skills,
		experiences: content.experiences,
		profile: content.profile
	};
};
