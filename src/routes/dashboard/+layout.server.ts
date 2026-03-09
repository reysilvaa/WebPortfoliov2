import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types.js';
import { PortfolioService } from '$lib/server/services/portfolio.service';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	const user = locals.user;

	if (!user && url.pathname !== '/dashboard/login') {
		redirect(302, '/dashboard/login');
	}

	const profile = await PortfolioService.getProfile();

	return {
		user,
		profile
	};
};
