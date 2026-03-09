import { json, error } from '@sveltejs/kit';
import { PortfolioService } from '$lib/server/services/portfolio.service';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
    if (!locals.user) throw error(401, 'Unauthorized');
    const data = await request.json();
    try {
        const result = await PortfolioService.addCertificate(data);
        return json(result);
    } catch (e) {
        console.error(e);
        throw error(500, 'Failed to add certificate');
    }
};
