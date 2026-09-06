import { GithubService } from '$lib/server/services/github.service';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const { contributions, commits } = await GithubService.getExternalContributions();

	return new Response(JSON.stringify({ contributions, commits }), {
		headers: {
			'Content-Type': 'application/json',
			'Cache-Control': 'public, max-age=600, s-maxage=600'
		}
	});
};
