import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types.js';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	const user = locals.user;
	
	if (!user && url.pathname !== '/dashboard/login') {
		redirect(302, '/dashboard/login');
	}

	return {
		user
	};
};
