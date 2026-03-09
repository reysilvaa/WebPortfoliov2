import { json, error } from '@sveltejs/kit';
import { PortfolioService } from '$lib/server/services/portfolio.service';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ params, locals }) => {
    if (!locals.user) throw error(401, 'Unauthorized');
    const { id } = params;
    if (!id) throw error(400, 'Missing ID');

    try {
        const result = await PortfolioService.deleteSkill(id);
        return json(result);
    } catch (e) {
        console.error(e);
        throw error(500, 'Failed to delete skill');
    }
};

export const PATCH: RequestHandler = async ({ params, request, locals }) => {
    if (!locals.user) throw error(401, 'Unauthorized');
    const { id } = params;
    if (!id) throw error(400, 'Missing ID');

    const data = await request.json();
    try {
        const result = await PortfolioService.updateSkill(id, data);
        return json(result);
    } catch (e) {
        console.error(e);
        throw error(500, 'Failed to update skill');
    }
};
