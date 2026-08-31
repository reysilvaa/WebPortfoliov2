import { GithubService } from '$lib/server/services/github.service';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const contributions = await GithubService.getMergedContributions();

	return new Response(JSON.stringify({ contributions }), {
		headers: {
			'Content-Type': 'application/json',
			// 10 min shared cache so the homepage doesn't hammer the GitHub API
			'Cache-Control': 'public, max-age=600, s-maxage=600'
		}
	});
};